import { describe, expect, it } from "vitest";
import { buildSitemapXml } from "../generateSitemap";
import { localizedPublicPaths, PUBLIC_PATHS } from "../publicPaths";

describe("buildSitemapXml", () => {
	const xml = buildSitemapXml([
		{
			slug: "id-article",
			title: "ID",
			content: "",
			cover_image_url: null,
			language: "id",
			updated_at: "2026-10-01T00:00:00.000Z",
		},
		{
			slug: "en-article",
			title: "EN",
			content: "",
			cover_image_url: null,
			language: "en",
			updated_at: "2026-10-02T00:00:00.000Z",
		},
	]);

	it("lists every static route in both languages with hreflang alternates", () => {
		expect(xml).toContain("<loc>https://thebuilder.co.id/</loc>");
		expect(xml).toContain("<loc>https://thebuilder.co.id/en</loc>");
		expect(xml).toContain("<loc>https://thebuilder.co.id/apply</loc>");
		expect(xml).toContain("<loc>https://thebuilder.co.id/en/apply</loc>");
		expect(xml).toContain(
			'<xhtml:link rel="alternate" hreflang="en" href="https://thebuilder.co.id/en/apply"/>',
		);
		expect(xml).toContain(
			'<xhtml:link rel="alternate" hreflang="x-default" href="https://thebuilder.co.id/apply"/>',
		);
		expect(xml.match(/<url>/g)).toHaveLength(PUBLIC_PATHS.length * 2 + 2);
	});

	it("puts each article under its own language", () => {
		expect(xml).toContain(
			"<loc>https://thebuilder.co.id/insights/id-article</loc>",
		);
		expect(xml).toContain(
			"<loc>https://thebuilder.co.id/en/insights/en-article</loc>",
		);
		expect(xml).not.toContain("/en/insights/id-article");
		expect(xml).toContain("<lastmod>2026-10-02</lastmod>");
	});
});

describe("localizedPublicPaths", () => {
	it("returns each route unprefixed and under /en", () => {
		const paths = localizedPublicPaths();
		expect(paths).toContain("/");
		expect(paths).toContain("/en");
		expect(paths).toContain("/en/resources/products");
		expect(paths).toHaveLength(PUBLIC_PATHS.length * 2);
	});
});
