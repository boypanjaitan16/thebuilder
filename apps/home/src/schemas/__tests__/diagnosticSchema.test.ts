import { describe, expect, it } from "vitest";
import { diagnosticRatingValues, diagnosticSchema } from "../diagnosticSchema";

describe("diagnosticSchema", () => {
	const validData = {
		q1: "3",
		q2: "4",
		q3: "2",
		q4: "5",
		q5: "1",
		q6: "3",
		q7: "4",
		q8: "2",
		q9: "5",
		q10: "1",
		q11: "3",
		q12: "4",
	};

	it("validates correct diagnostic form data", () => {
		const result = diagnosticSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("validates all rating values 1-5", () => {
		for (const rating of diagnosticRatingValues) {
			const result = diagnosticSchema.safeParse({
				...validData,
				q1: rating,
			});
			expect(result.success).toBe(true);
		}
	});

	it("rejects invalid rating value", () => {
		const result = diagnosticSchema.safeParse({
			...validData,
			q1: "6",
		});

		expect(result.success).toBe(false);
	});

	it("rejects rating value 0", () => {
		const result = diagnosticSchema.safeParse({
			...validData,
			q1: "0",
		});

		expect(result.success).toBe(false);
	});

	it("rejects non-numeric rating", () => {
		const result = diagnosticSchema.safeParse({
			...validData,
			q1: "high",
		});

		expect(result.success).toBe(false);
	});

	it("allows optional reflection field", () => {
		const result = diagnosticSchema.safeParse({
			...validData,
			reflection: "Some thoughts on the diagnostic",
		});

		expect(result.success).toBe(true);
	});

	it("works without reflection field", () => {
		const result = diagnosticSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("rejects missing questions", () => {
		const { q12, ...incomplete } = validData;
		const result = diagnosticSchema.safeParse(incomplete);

		expect(result.success).toBe(false);
	});

	it("exports correct rating values", () => {
		expect(diagnosticRatingValues).toEqual(["1", "2", "3", "4", "5"]);
	});
});
