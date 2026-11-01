import { writeFileSync } from "node:fs";
import { join } from "node:path";
import dayjs from "dayjs";
import type { Plugin } from "vite";
import { localizePath } from "../src/lib/locale";
import type { BuildTimeArticle } from "./fetchPublishedArticles";
import { PUBLIC_ROUTES, type PublicRoute } from "./publicPaths";

const PRODUCTION_ORIGIN = "https://thebuilder.co.id";

function urlEntry(lines: string[]): string {
	return ["  <url>", ...lines.map((line) => `    ${line}`), "  </url>"].join(
		"\n",
	);
}

function staticRouteEntries(route: PublicRoute): string[] {
	const idUrl = `${PRODUCTION_ORIGIN}${route.path}`;
	const enUrl = `${PRODUCTION_ORIGIN}${localizePath(route.path, "en")}`;
	const alternates = [
		`<xhtml:link rel="alternate" hreflang="id" href="${idUrl}"/>`,
		`<xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>`,
		`<xhtml:link rel="alternate" hreflang="x-default" href="${idUrl}"/>`,
	];
	return [idUrl, enUrl].map((loc) =>
		urlEntry([
			`<loc>${loc}</loc>`,
			...alternates,
			`<changefreq>${route.changefreq}</changefreq>`,
			`<priority>${route.priority.toFixed(1)}</priority>`,
		]),
	);
}

function articleEntry(article: BuildTimeArticle): string {
	const path = localizePath(`/insights/${article.slug}`, article.language);
	return urlEntry([
		`<loc>${PRODUCTION_ORIGIN}${path}</loc>`,
		`<lastmod>${dayjs(article.updated_at).format("YYYY-MM-DD")}</lastmod>`,
		"<changefreq>monthly</changefreq>",
		"<priority>0.7</priority>",
	]);
}

export function buildSitemapXml(articles: BuildTimeArticle[]): string {
	const entries = [
		...PUBLIC_ROUTES.flatMap(staticRouteEntries),
		...articles.map(articleEntry),
	];
	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
		...entries,
		"</urlset>",
		"",
	].join("\n");
}

/**
 * Writes dist/sitemap.xml: every static route in both languages (with
 * hreflang alternates) plus one entry per published article at its own
 * language's URL. PUBLIC_ROUTES is the source of truth for static routes.
 */
export function generateSitemap(
	articles: BuildTimeArticle[],
	appDir: string,
): Plugin {
	return {
		name: "generate-sitemap",
		apply: "build",
		closeBundle() {
			writeFileSync(
				join(appDir, "dist", "sitemap.xml"),
				buildSitemapXml(articles),
			);
		},
	};
}
