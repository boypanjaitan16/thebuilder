import { z } from "zod";

export const applySchema = z.object({
	name: z.string().min(1, "Required"),
	role: z.string().min(1, "Required"),
	organization: z.string().min(1, "Required"),
	size: z.string().min(1, "Required"),
	industry: z.string().min(1, "Required"),
	situation: z.array(z.string()).max(2, "Select up to two").optional(),
	description: z.string().optional(),
	expectation: z.string().min(1, "Required"),
	decisionFlow: z.string().min(1, "Required"),
	readiness: z.string().min(1, "Required"),
	timeline: z.string().min(1, "Required"),
});

export type ApplyFormValuesInput = z.input<typeof applySchema>;
export type ApplyFormValues = z.output<typeof applySchema>;
