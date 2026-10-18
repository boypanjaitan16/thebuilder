import { describe, expect, it } from "vitest";
import { adminLoginSchema } from "../adminLoginSchema";

describe("adminLoginSchema", () => {
	it("validates correct login data", () => {
		const result = adminLoginSchema.safeParse({
			email: "admin@example.com",
			password: "password123",
		});

		expect(result.success).toBe(true);
	});

	it("rejects invalid email", () => {
		const result = adminLoginSchema.safeParse({
			email: "invalid-email",
			password: "password123",
		});

		expect(result.success).toBe(false);
	});

	it("rejects empty email", () => {
		const result = adminLoginSchema.safeParse({
			email: "",
			password: "password123",
		});

		expect(result.success).toBe(false);
	});

	it("rejects empty password", () => {
		const result = adminLoginSchema.safeParse({
			email: "admin@example.com",
			password: "",
		});

		expect(result.success).toBe(false);
	});

	it("rejects missing fields", () => {
		const result = adminLoginSchema.safeParse({});

		expect(result.success).toBe(false);
	});

	it("accepts any non-empty password", () => {
		const result = adminLoginSchema.safeParse({
			email: "admin@example.com",
			password: "x",
		});

		expect(result.success).toBe(true);
	});
});
