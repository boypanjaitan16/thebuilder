import { z } from "zod";

export const articleStatusValues = ["DRAFT", "PUBLISHED"] as const;

export const articleSchema = z.object({
	title: z.string().min(1, "Title is required"),
	slug: z.string().min(1, "Slug is required"),
	content: z.string().min(1, "Content is required"),
	status: z.enum(articleStatusValues),
});

export type ArticleFormValues = z.input<typeof articleSchema>;
export type ArticleValues = z.output<typeof articleSchema>;
