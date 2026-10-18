import { z } from "zod";

export const productCreateSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	price: z.coerce.number().min(0, "Price must be zero or more"),
	marketplace_url: z.string().url("Must be a valid URL"),
});

export type ProductCreateFormValues = z.input<typeof productCreateSchema>;
export type ProductCreateValues = z.output<typeof productCreateSchema>;
