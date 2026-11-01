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
 * Firebase Hosting serves real content on first request. Runs on every
 * `vite build`.
 */
export function prerender(paths: string[], appDir: string): Plugin {
	return {
		name: "prerender-spa",
		apply: "build",
		async closeBundle() {
			const outDir = join(appDir, "dist");
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

			await new Promise<void>((resolve) =>
				server.listen(0, "127.0.0.1", resolve),
			);
			const address = server.address();
			if (!address || typeof address === "string") {
				server.close();
				throw new Error("prerender-spa: failed to start local server");
			}
			const baseUrl = `http://127.0.0.1:${address.port}`;

			const { default: puppeteer } = await import("puppeteer");
			const browser = await puppeteer.launch({
				headless: true,
				// CI runners (Ubuntu 23.10+) restrict unprivileged user namespaces,
				// which breaks Chrome's setuid sandbox. Safe here: we only crawl our
				// own freshly built, trusted output, not external content.
				args: ["--no-sandbox", "--disable-setuid-sandbox"],
			});

			const render = async (routePath: string) => {
				const page = await browser.newPage();
				// networkidle2, not networkidle0: Firestore's SDK keeps a
				// persistent long-polling channel open even after a one-shot
				// getDocs() read, so the page never reaches zero open
				// connections and networkidle0 would hang forever.
				await page.goto(`${baseUrl}${routePath}`, {
					waitUntil: "networkidle2",
				});
				const html = await page.content();
				await page.close();
				return html;
			};

			try {
				for (const routePath of paths) {
					const html = await render(routePath);
					const outputFile =
						routePath === "/"
							? join(outDir, "index.html")
							: join(outDir, routePath, "index.html");
					mkdirSync(dirname(outputFile), { recursive: true });
					writeFileSync(outputFile, html);
				}

				// Firebase Hosting serves this page with a 404 status for unknown
				// public routes, including the former /admin/** URLs. Rendering an
				// unmatched path gives it NotFoundPage's noindex head tags; the SPA
				// router then re-renders NotFoundPage in the URL's language.
				writeFileSync(
					join(outDir, "404.html"),
					await render("/__prerender-not-found__"),
				);
			} finally {
				await browser.close();
				server.close();
			}
		},
	};
}
