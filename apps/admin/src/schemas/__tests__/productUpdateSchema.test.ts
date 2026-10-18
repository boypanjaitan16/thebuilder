import { describe, expect, it } from "vitest";
import { productUpdateSchema } from "../productUpdateSchema";

describe("productUpdateSchema", () => {
	const validData = {
		name: "Updated Product",
		description: "Updated description",
		price: 149.99,
		marketplace_url: "https://example.com/updated",
	};

	it("validates correct product update data", () => {
		const result = productUpdateSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("rejects empty name", () => {
		const result = productUpdateSchema.safeParse({
			...validData,
			name: "",
		});

		expect(result.success).toBe(false);
	});

	it("allows optional description", () => {
		const { description, ...withoutDescription } = validData;
		const result = productUpdateSchema.safeParse(withoutDescription);

		expect(result.success).toBe(true);
	});

	it("allows empty description", () => {
		const result = productUpdateSchema.safeParse({
			...validData,
			description: "",
		});

		expect(result.success).toBe(true);
	});

	it("rejects negative price", () => {
		const result = productUpdateSchema.safeParse({
			...validData,
			price: -5,
		});

		expect(result.success).toBe(false);
	});

	it("accepts zero price", () => {
		const result = productUpdateSchema.safeParse({
			...validData,
			price: 0,
		});

		expect(result.success).toBe(true);
	});

	it("coerces string price to number", () => {
		const result = productUpdateSchema.safeParse({
			...validData,
			price: "199.99",
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.price).toBe(199.99);
		}
	});

	it("rejects invalid marketplace URL", () => {
		const result = productUpdateSchema.safeParse({
			...validData,
			marketplace_url: "invalid-url",
		});

		expect(result.success).toBe(false);
	});

	it("accepts valid URL with path and query", () => {
		const result = productUpdateSchema.safeParse({
			...validData,
			marketplace_url: "https://marketplace.example.com/products/123?ref=app",
		});

		expect(result.success).toBe(true);
	});

	it("accepts large price values", () => {
		const result = productUpdateSchema.safeParse({
			...validData,
			price: 999999.99,
		});

		expect(result.success).toBe(true);
	});

	it("accepts decimal prices", () => {
		const result = productUpdateSchema.safeParse({
			...validData,
			price: 29.5,
		});

		expect(result.success).toBe(true);
	});
});
