import { describe, expect, it } from "vitest";
import { adminProfileSchema } from "../adminProfileSchema";

describe("adminProfileSchema", () => {
	it("validates correct profile data", () => {
		const result = adminProfileSchema.safeParse({
			fullName: "John Doe",
		});

		expect(result.success).toBe(true);
	});

	it("rejects empty full name", () => {
		const result = adminProfileSchema.safeParse({
			fullName: "",
		});

		expect(result.success).toBe(false);
	});

	it("rejects missing full name", () => {
		const result = adminProfileSchema.safeParse({});

		expect(result.success).toBe(false);
	});

	it("accepts single character name", () => {
		const result = adminProfileSchema.safeParse({
			fullName: "A",
		});

		expect(result.success).toBe(true);
	});

	it("accepts long name", () => {
		const result = adminProfileSchema.safeParse({
			fullName: "A Very Long Full Name With Many Words",
		});

		expect(result.success).toBe(true);
	});
});
