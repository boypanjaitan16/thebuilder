import { z } from "zod";

export const applySchema = z.object({
	name: z.string().min(1, "Required").max(200, "Too long"),
	email: z
		.string()
		.min(1, "Required")
		.max(254, "Too long")
		.email("Must be a valid email"),
	role: z.string().min(1, "Required").max(200, "Too long"),
	organization: z.string().min(1, "Required").max(200, "Too long"),
	size: z.string().min(1, "Required").max(200, "Too long"),
	industry: z.string().min(1, "Required").max(200, "Too long"),
	situation: z.array(z.string()).max(2, "Select up to two").optional(),
	description: z.string().max(5000, "Too long").optional(),
	expectation: z.string().min(1, "Required").max(500, "Too long"),
	decisionFlow: z.string().min(1, "Required").max(500, "Too long"),
	readiness: z.string().min(1, "Required").max(500, "Too long"),
	timeline: z.string().min(1, "Required").max(500, "Too long"),
});

export type ApplyFormValuesInput = z.input<typeof applySchema>;
export type ApplyFormValues = z.output<typeof applySchema>;
