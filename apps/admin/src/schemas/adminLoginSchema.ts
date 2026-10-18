import { z } from "zod";

export const adminLoginSchema = z.object({
	email: z.string().email("Valid email required"),
	password: z.string().min(1, "Password is required"),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
