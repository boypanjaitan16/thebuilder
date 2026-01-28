import { describe, expect, it } from "vitest";
import { productCreateSchema } from "../productCreateSchema";

describe("productCreateSchema", () => {
	const validData = {
		name: "Test Product",
		description: "A great product",
		price: 99.99,
		marketplace_url: "https://example.com/product",
	};

	it("validates correct product data", () => {
		const result = productCreateSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("rejects empty name", () => {
		const result = productCreateSchema.safeParse({
			...validData,
			name: "",
		});

		expect(result.success).toBe(false);
	});

	it("allows optional description", () => {
		const { description, ...withoutDescription } = validData;
		const result = productCreateSchema.safeParse(withoutDescription);

		expect(result.success).toBe(true);
	});

	it("allows empty description", () => {
		const result = productCreateSchema.safeParse({
			...validData,
			description: "",
		});

		expect(result.success).toBe(true);
	});

	it("rejects negative price", () => {
		const result = productCreateSchema.safeParse({
			...validData,
			price: -10,
		});

		expect(result.success).toBe(false);
	});

	it("accepts zero price", () => {
		const result = productCreateSchema.safeParse({
			...validData,
			price: 0,
		});

		expect(result.success).toBe(true);
	});

	it("coerces string price to number", () => {
		const result = productCreateSchema.safeParse({
			...validData,
			price: "49.99",
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.price).toBe(49.99);
		}
	});

	it("rejects invalid marketplace URL", () => {
		const result = productCreateSchema.safeParse({
			...validData,
			marketplace_url: "not-a-url",
		});

		expect(result.success).toBe(false);
	});

	it("rejects empty marketplace URL", () => {
		const result = productCreateSchema.safeParse({
			...validData,
			marketplace_url: "",
		});

		expect(result.success).toBe(false);
	});

	it("accepts valid HTTP URL", () => {
		const result = productCreateSchema.safeParse({
			...validData,
			marketplace_url: "http://example.com",
		});

		expect(result.success).toBe(true);
	});

	it("accepts valid HTTPS URL", () => {
		const result = productCreateSchema.safeParse({
			...validData,
			marketplace_url: "https://example.com/path?query=value",
		});

		expect(result.success).toBe(true);
	});
});
