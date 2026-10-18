import { describe, expect, it } from "vitest";
import { articleSchema } from "../articleSchema";

describe("articleSchema", () => {
	const validData = {
		title: "Test Article",
		slug: "test-article",
		content: "<p>Body</p>",
		status: "DRAFT" as const,
	};

	it("validates correct article data", () => {
		const result = articleSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("rejects empty title", () => {
		const result = articleSchema.safeParse({ ...validData, title: "" });
		expect(result.success).toBe(false);
	});

	it("rejects empty slug", () => {
		const result = articleSchema.safeParse({ ...validData, slug: "" });
		expect(result.success).toBe(false);
	});

	it("rejects empty content", () => {
		const result = articleSchema.safeParse({ ...validData, content: "" });
		expect(result.success).toBe(false);
	});

	it("accepts PUBLISHED status", () => {
		const result = articleSchema.safeParse({
			...validData,
			status: "PUBLISHED",
		});
		expect(result.success).toBe(true);
	});

	it("rejects an invalid status value", () => {
		const result = articleSchema.safeParse({
			...validData,
			status: "ARCHIVED",
		});
		expect(result.success).toBe(false);
	});
});
