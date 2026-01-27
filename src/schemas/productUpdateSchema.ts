import { z } from "zod";

export const productUpdateSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	price: z.coerce.number().min(0, "Price must be zero or more"),
	marketplace_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type ProductUpdateFormValues = z.input<typeof productUpdateSchema>;
export type ProductUpdateValues = z.output<typeof productUpdateSchema>;
