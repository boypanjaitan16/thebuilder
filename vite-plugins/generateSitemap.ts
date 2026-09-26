import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import dayjs from "dayjs";
import type { Plugin } from "vite";
import type { BuildTimeArticle } from "./fetchPublishedArticles";

const PRODUCTION_ORIGIN = "https://thebuilder.co.id";

function articleUrlEntry(article: BuildTimeArticle): string {
	const lastmod = dayjs(article.updated_at).format("YYYY-MM-DD");
	return [
		"  <url>",
		`    <loc>${PRODUCTION_ORIGIN}/insights/${article.slug}</loc>`,
		`    <lastmod>${lastmod}</lastmod>`,
		"    <changefreq>monthly</changefreq>",
		"    <priority>0.7</priority>",
		"  </url>",
	].join("\n");
}

/**
 * Appends one <url> entry per published article to the static
 * public/sitemap.xml (hand-maintained for non-article routes, see
 * publicPaths.ts's sync comment) and writes the merged result to
 * dist/sitemap.xml. Reads from public/ (source of truth), not dist/, so
 * this has no dependency on Vite's public-dir copy having already run.
 */
export function generateSitemap(articles: BuildTimeArticle[]): Plugin {
	return {
		name: "generate-sitemap",
		apply: "build",
		closeBundle() {
			const staticXml = readFileSync(
				join(process.cwd(), "public", "sitemap.xml"),
				"utf-8",
			);
			const articleEntries = articles.map(articleUrlEntry).join("\n");
			const merged = articleEntries
				? staticXml.replace("</urlset>", `${articleEntries}\n</urlset>`)
				: staticXml;
			writeFileSync(join(process.cwd(), "dist", "sitemap.xml"), merged);
		},
	};
}
