import { z } from "zod";

export const adminPasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((values) => values.newPassword === values.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type AdminPasswordFormValuesInput = z.input<typeof adminPasswordSchema>;
export type AdminPasswordFormValues = z.output<typeof adminPasswordSchema>;
