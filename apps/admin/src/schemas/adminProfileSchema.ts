import { z } from "zod";

export const adminProfileSchema = z.object({
	fullName: z.string().min(1, "Name is required"),
});

export type AdminProfileFormValuesInput = z.input<typeof adminProfileSchema>;
export type AdminProfileFormValues = z.output<typeof adminProfileSchema>;
