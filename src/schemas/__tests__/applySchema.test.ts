import { describe, expect, it } from "vitest";
import { applySchema } from "../applySchema";

describe("applySchema", () => {
	const validData = {
		name: "John Doe",
		role: "CEO",
		organization: "Acme Inc",
		size: "100-500",
		industry: "Technology",
		expectation: "Growth strategy",
		decisionFlow: "Board approval",
		readiness: "Ready to start",
		timeline: "Q1 2024",
	};

	it("validates correct apply form data", () => {
		const result = applySchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("rejects empty name", () => {
		const result = applySchema.safeParse({
			...validData,
			name: "",
		});

		expect(result.success).toBe(false);
	});

	it("rejects empty role", () => {
		const result = applySchema.safeParse({
			...validData,
			role: "",
		});

		expect(result.success).toBe(false);
	});

	it("rejects empty organization", () => {
		const result = applySchema.safeParse({
			...validData,
			organization: "",
		});

		expect(result.success).toBe(false);
	});

	it("rejects empty size", () => {
		const result = applySchema.safeParse({
			...validData,
			size: "",
		});

		expect(result.success).toBe(false);
	});

	it("rejects empty industry", () => {
		const result = applySchema.safeParse({
			...validData,
			industry: "",
		});

		expect(result.success).toBe(false);
	});

	it("allows optional situation field", () => {
		const result = applySchema.safeParse(validData);
		expect(result.success).toBe(true);

		const withSituation = applySchema.safeParse({
			...validData,
			situation: ["Growth", "Restructuring"],
		});
		expect(withSituation.success).toBe(true);
	});

	it("rejects more than 2 situation selections", () => {
		const result = applySchema.safeParse({
			...validData,
			situation: ["Growth", "Restructuring", "Merger"],
		});

		expect(result.success).toBe(false);
	});

	it("allows optional description field", () => {
		const result = applySchema.safeParse({
			...validData,
			description: "Additional details",
		});

		expect(result.success).toBe(true);
	});

	it("rejects empty expectation", () => {
		const result = applySchema.safeParse({
			...validData,
			expectation: "",
		});

		expect(result.success).toBe(false);
	});

	it("rejects empty decisionFlow", () => {
		const result = applySchema.safeParse({
			...validData,
			decisionFlow: "",
		});

		expect(result.success).toBe(false);
	});

	it("rejects empty readiness", () => {
		const result = applySchema.safeParse({
			...validData,
			readiness: "",
		});

		expect(result.success).toBe(false);
	});

	it("rejects empty timeline", () => {
		const result = applySchema.safeParse({
			...validData,
			timeline: "",
		});

		expect(result.success).toBe(false);
	});
});
