import { describe, expect, it } from "vitest";
import { renderWithMemoryRouter } from "../../test/test-utils";
import { SeoHead } from "../SeoHead";

function headLink(selector: string) {
	return document.head.querySelector(selector)?.getAttribute("href");
}

function meta(attr: "name" | "property", key: string) {
	return document.head
		.querySelector(`meta[${attr}="${key}"]`)
		?.getAttribute("content");
}

function alternates() {
	return Array.from(
		document.head.querySelectorAll('link[rel="alternate"][hreflang]'),
	).map((el) => `${el.getAttribute("hreflang")} ${el.getAttribute("href")}`);
}

describe("SeoHead", () => {
	it("sets Indonesian tags on unprefixed URLs", () => {
		renderWithMemoryRouter(<SeoHead />, ["/apply"]);

		expect(document.documentElement.lang).toBe("id");
		expect(document.title).toBe("Ajukan Percakapan Advisory | The Builder");
		expect(meta("name", "description")).toMatch(/^Ajukan percakapan awal/);
		expect(meta("property", "og:locale")).toBe("id_ID");
		expect(headLink('link[rel="canonical"]')).toBe(
			"https://thebuilder.co.id/apply",
		);
		expect(alternates()).toEqual([
			"id https://thebuilder.co.id/apply",
			"en https://thebuilder.co.id/en/apply",
			"x-default https://thebuilder.co.id/apply",
		]);
	});

	it("sets English tags under /en", () => {
		renderWithMemoryRouter(<SeoHead />, ["/en"]);

		expect(document.documentElement.lang).toBe("en");
		expect(document.title).toBe(
			"The Builder — Strategic Advisory for Organizational Resilience",
		);
		expect(meta("property", "og:locale")).toBe("en_US");
		expect(headLink('link[rel="canonical"]')).toBe(
			"https://thebuilder.co.id/en",
		);
		expect(alternates()).toContain("en https://thebuilder.co.id/en");
	});

	it("gives articles a single self alternate and leaves the title alone", () => {
		document.title = "Previous";
		renderWithMemoryRouter(<SeoHead />, ["/en/insights/some-slug"]);

		expect(document.title).toBe("Previous");
		expect(headLink('link[rel="canonical"]')).toBe(
			"https://thebuilder.co.id/en/insights/some-slug",
		);
		expect(alternates()).toEqual([
			"en https://thebuilder.co.id/en/insights/some-slug",
		]);
	});

	it("marks unknown routes noindex", () => {
		renderWithMemoryRouter(<SeoHead />, ["/en/does-not-exist"]);

		expect(meta("name", "robots")).toBe("noindex");
		expect(document.title).toBe("Page Not Found | The Builder");
		expect(headLink('link[rel="canonical"]')).toBeUndefined();
		expect(alternates()).toEqual([]);
	});

	it("restores previous tags on unmount", () => {
		const { unmount } = renderWithMemoryRouter(<SeoHead />, [
			"/en/does-not-exist",
		]);
		unmount();

		expect(meta("name", "robots")).toBeUndefined();
	});
});
