import { z } from "zod";

const ratingValues = ["1", "2", "3", "4", "5"] as const;
const ratingSchema = z.enum(ratingValues);

export const diagnosticSchema = z.object({
	q1: ratingSchema,
	q2: ratingSchema,
	q3: ratingSchema,
	q4: ratingSchema,
	q5: ratingSchema,
	q6: ratingSchema,
	q7: ratingSchema,
	q8: ratingSchema,
	q9: ratingSchema,
	q10: ratingSchema,
	q11: ratingSchema,
	q12: ratingSchema,
	reflection: z.string().optional(),
});

export type DiagnosticFormInput = z.input<typeof diagnosticSchema>;
export type DiagnosticFormValues = z.output<typeof diagnosticSchema>;
export const diagnosticRatingValues = ratingValues;
