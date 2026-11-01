import {
	seoPageKeys,
	translations,
} from "@thebuilder/shared/i18n/translations";
import { describe, expect, it } from "vitest";
import { PUBLIC_PATHS } from "../../../vite-plugins/publicPaths";
import { seoRoutes } from "../seoRoutes";

describe("seoRoutes", () => {
	it("covers every prerendered public path", () => {
		expect(Object.keys(seoRoutes).sort()).toEqual([...PUBLIC_PATHS].sort());
	});

	it.each([
		"id",
		"en",
	] as const)("has %s title and description for every page", (lang) => {
		for (const key of seoPageKeys) {
			const entry = translations[lang].seo.pages[key];
			expect(entry?.title, `${lang}.seo.pages.${key}.title`).toBeTruthy();
			expect(
				entry?.description,
				`${lang}.seo.pages.${key}.description`,
			).toBeTruthy();
		}
	});
});
