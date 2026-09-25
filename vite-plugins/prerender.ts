import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join } from "node:path";
import type { Plugin } from "vite";

const MIME_TYPES: Record<string, string> = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".ico": "image/x-icon",
	".webp": "image/webp",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".txt": "text/plain; charset=utf-8",
	".xml": "application/xml",
};

/**
 * Crawls the built SPA with a headless browser and writes the fully
 * rendered HTML for each path in `paths` back into the build output, so
 * GitHub Pages serves real content on first request instead of a 404
 * that gets client-redirected to 404.html. Runs on every `vite build`.
 */
export function prerender(paths: string[]): Plugin {
	return {
		name: "prerender-spa",
		apply: "build",
		async closeBundle() {
			const outDir = join(process.cwd(), "dist");
			const indexHtml = await readFile(join(outDir, "index.html"));

			const server = createServer(async (req, res) => {
				const url = new URL(req.url ?? "/", "http://localhost");
				const filePath = join(outDir, decodeURIComponent(url.pathname));
				if (extname(filePath) && existsSync(filePath)) {
					res.setHeader(
						"Content-Type",
						MIME_TYPES[extname(filePath)] ?? "application/octet-stream",
					);
					res.end(await readFile(filePath));
					return;
				}
				res.setHeader("Content-Type", "text/html; charset=utf-8");
				res.end(indexHtml);
			});

			await new Promise<void>((resolve) => server.listen(0, resolve));
			const address = server.address();
			if (!address || typeof address === "string") {
				server.close();
				throw new Error("prerender-spa: failed to start local server");
			}
			const baseUrl = `http://localhost:${address.port}`;

			const { default: puppeteer } = await import("puppeteer");
			const browser = await puppeteer.launch({
				headless: true,
				// CI runners (Ubuntu 23.10+) restrict unprivileged user namespaces,
				// which breaks Chrome's setuid sandbox. Safe here: we only crawl our
				// own freshly built, trusted output, not external content.
				args: ["--no-sandbox", "--disable-setuid-sandbox"],
			});

			try {
				let homeHtml: string | undefined;

				for (const routePath of paths) {
					const page = await browser.newPage();
					await page.goto(`${baseUrl}${routePath}`, {
						waitUntil: "networkidle0",
					});
					const html = await page.content();
					await page.close();

					const outputFile =
						routePath === "/"
							? join(outDir, "index.html")
							: join(outDir, routePath, "index.html");
					mkdirSync(dirname(outputFile), { recursive: true });
					writeFileSync(outputFile, html);

					if (routePath === "/") homeHtml = html;
				}

				// GitHub Pages fallback for unprerendered paths (/admin/**, unmatched
				// routes): served with a real 404 status, then the SPA's client-side
				// router takes over (AdminGuard, catch-all NotFoundPage).
				if (homeHtml) writeFileSync(join(outDir, "404.html"), homeHtml);
			} finally {
				await browser.close();
				server.close();
			}
		},
	};
}
