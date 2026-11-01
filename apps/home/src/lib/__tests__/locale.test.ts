import { describe, expect, it } from "vitest";
import {
	alternatePath,
	getLanguageFromPath,
	isArticleDetailPath,
	localizePath,
	stripLocale,
} from "../locale";

describe("locale paths", () => {
	it("reads the language from the URL prefix", () => {
		expect(getLanguageFromPath("/")).toBe("id");
		expect(getLanguageFromPath("/apply")).toBe("id");
		expect(getLanguageFromPath("/en")).toBe("en");
		expect(getLanguageFromPath("/en/apply")).toBe("en");
		expect(getLanguageFromPath("/english")).toBe("id");
	});

	it("strips the /en prefix", () => {
		expect(stripLocale("/en")).toBe("/");
		expect(stripLocale("/en/resources/products")).toBe("/resources/products");
		expect(stripLocale("/apply")).toBe("/apply");
		expect(stripLocale("/apply/")).toBe("/apply");
		expect(stripLocale("/en/")).toBe("/");
	});

	it("localizes unprefixed paths", () => {
		expect(localizePath("/", "en")).toBe("/en");
		expect(localizePath("/apply", "en")).toBe("/en/apply");
		expect(localizePath("/apply", "id")).toBe("/apply");
	});

	it("detects article detail paths in either language", () => {
		expect(isArticleDetailPath("/insights/some-slug")).toBe(true);
		expect(isArticleDetailPath("/en/insights/some-slug")).toBe(true);
		expect(isArticleDetailPath("/insights")).toBe(false);
	});

	it("maps a page to its alternate-language URL", () => {
		expect(alternatePath("/apply", "en")).toBe("/en/apply");
		expect(alternatePath("/en/apply", "id")).toBe("/apply");
		expect(alternatePath("/en", "id")).toBe("/");
		expect(alternatePath("/", "en")).toBe("/en");
		expect(alternatePath("/insights/some-slug", "en")).toBe("/en/insights");
		expect(alternatePath("/en/insights/some-slug", "id")).toBe("/insights");
	});
});
