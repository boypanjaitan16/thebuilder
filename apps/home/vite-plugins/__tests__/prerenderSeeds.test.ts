import { describe, expect, it } from "vitest";
import type { BuildTimeArticle } from "../fetchPublishedArticles";
import { injectPrerenderData } from "../prerender";
import { buildPrerenderSeeds } from "../prerenderSeeds";

function article(overrides: Partial<BuildTimeArticle>): BuildTimeArticle {
	return {
		id: "a",
		title: "Title",
		slug: "slug",
		content: "<p>Body</p>",
		cover_image_url: null,
		status: "PUBLISHED",
		language: "id",
		created_at: "2026-09-01",
		updated_at: "2026-09-01",
		...overrides,
	};
}

describe("buildPrerenderSeeds", () => {
	const older = article({ id: "1", slug: "older", created_at: "2026-01-01" });
	const newer = article({ id: "2", slug: "newer", created_at: "2026-02-01" });
	const english = article({ id: "3", slug: "english", language: "en" });
	const seeds = buildPrerenderSeeds([older, english, newer]);

	it("seeds each article page under its language", () => {
		expect(seeds["/insights/older"]).toEqual({ article: older });
		expect(seeds["/en/insights/english"]).toEqual({ article: english });
		expect(seeds["/insights/english"]).toBeUndefined();
	});

	it("seeds each language's list newest first, without bodies", () => {
		expect(seeds["/insights"]?.articles?.items.map((a) => a.slug)).toEqual([
			"newer",
			"older",
		]);
		expect(seeds["/insights"]?.articles?.items[0]?.content).toBe("");
		expect(seeds["/en/insights"]?.articles).toEqual({
			language: "en",
			items: [{ ...english, content: "" }],
		});
	});
});

describe("injectPrerenderData", () => {
	it("embeds escaped JSON before </head>", () => {
		const html = injectPrerenderData(
			"<html><head><title>x</title></head><body></body></html>",
			{ article: article({ content: "</script><b>" }) },
		);
		expect(html).toContain(
			'<script type="application/json" id="tb-prerender-data">',
		);
		expect(html.indexOf("tb-prerender-data")).toBeLessThan(
			html.indexOf("</head>"),
		);
		expect(html).not.toContain("</script><b>");
	});
});
