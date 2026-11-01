import type { Article } from "@thebuilder/shared/types/Article";
import { afterEach, describe, expect, it } from "vitest";
import {
	getSeededArticle,
	getSeededArticles,
	PRERENDER_DATA_SCRIPT_ID,
	readPrerenderData,
	serializePrerenderData,
} from "../prerenderData";

const article: Article = {
	id: "1",
	title: "Title",
	slug: "slug",
	content: "<p>Body</p></script>",
	cover_image_url: null,
	status: "PUBLISHED",
	language: "en",
	created_at: "2026-01-01",
	updated_at: "2026-01-01",
};

const win = window as unknown as Record<string, unknown>;

afterEach(() => {
	delete win.__TB_PRERENDER_DATA__;
	document.getElementById(PRERENDER_DATA_SCRIPT_ID)?.remove();
});

function addScript(text: string) {
	const script = document.createElement("script");
	script.type = "application/json";
	script.id = PRERENDER_DATA_SCRIPT_ID;
	script.textContent = text;
	document.head.appendChild(script);
}

describe("prerenderData", () => {
	it("escapes < so serialized content can't close the script tag", () => {
		const json = serializePrerenderData({ article });
		expect(json).not.toContain("</script>");
		expect(JSON.parse(json).article.content).toBe(article.content);
	});

	it("reads the window global during prerender", () => {
		win.__TB_PRERENDER_DATA__ = { article };
		expect(readPrerenderData()).toEqual({ article });
	});

	it("reads the embedded JSON script on the client", () => {
		addScript(serializePrerenderData({ article }));
		expect(getSeededArticle("slug", "en")).toEqual(article);
	});

	it("ignores a seed for another slug or language", () => {
		addScript(serializePrerenderData({ article }));
		expect(getSeededArticle("other", "en")).toBeUndefined();
		expect(getSeededArticle("slug", "id")).toBeUndefined();
	});

	it("matches the list seed by language", () => {
		win.__TB_PRERENDER_DATA__ = {
			articles: { language: "en", items: [article] },
		};
		expect(getSeededArticles("en")).toEqual([article]);
		expect(getSeededArticles("id")).toBeUndefined();
	});

	it("ignores malformed JSON", () => {
		addScript("{not json");
		expect(readPrerenderData()).toBeNull();
	});
});
