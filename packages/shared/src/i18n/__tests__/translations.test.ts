import { describe, expect, it } from "vitest";
import { translations } from "../translations";

describe("translations", () => {
	it("has English translations", () => {
		expect(translations.en).toBeDefined();
	});

	it("has Indonesian translations", () => {
		expect(translations.id).toBeDefined();
	});

	it("has nav section in English", () => {
		expect(translations.en.nav).toBeDefined();
		expect(translations.en.nav.home).toBe("Home");
		expect(translations.en.nav.insights).toBeDefined();
		expect(translations.en.nav.work).toBeDefined();
		expect(translations.en.nav.apply).toBeDefined();
		expect(translations.en.nav.resources).toBeDefined();
	});

	it("has nav section in Indonesian", () => {
		expect(translations.id.nav).toBeDefined();
		expect(translations.id.nav.home).toBeDefined();
	});

	it("has footer section in both languages", () => {
		expect(translations.en.footer).toBeDefined();
		expect(translations.id.footer).toBeDefined();
	});

	it("has header section in both languages", () => {
		expect(translations.en.header).toBeDefined();
		expect(translations.id.header).toBeDefined();
	});

	it("has shared section with focus areas", () => {
		expect(translations.en.shared).toBeDefined();
		expect(translations.en.shared.areasOfFocus).toBeDefined();
		expect(Array.isArray(translations.en.shared.areasOfFocus)).toBe(true);
		expect(translations.en.shared.areasOfFocus.length).toBeGreaterThan(0);
	});

	it("has CTA button text", () => {
		expect(translations.en.ctaButton).toBeDefined();
		expect(translations.id.ctaButton).toBeDefined();
	});

	it("has home section", () => {
		expect(translations.en.home).toBeDefined();
		expect(translations.id.home).toBeDefined();
	});

	it("focus areas have required properties", () => {
		const focusArea = translations.en.shared.areasOfFocus[0];
		expect(focusArea.slug).toBeDefined();
		expect(focusArea.title).toBeDefined();
		expect(focusArea.summary).toBeDefined();
		expect(focusArea.to).toBeDefined();
	});

	it("both languages have matching structure", () => {
		const enKeys = Object.keys(translations.en);
		const idKeys = Object.keys(translations.id);

		// Both should have the same top-level keys
		expect(enKeys.sort()).toEqual(idKeys.sort());
	});

	it("nav keys match between languages", () => {
		const enNavKeys = Object.keys(translations.en.nav);
		const idNavKeys = Object.keys(translations.id.nav);

		expect(enNavKeys.sort()).toEqual(idNavKeys.sort());
	});
});
