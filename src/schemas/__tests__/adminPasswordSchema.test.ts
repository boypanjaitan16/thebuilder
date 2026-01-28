import { describe, expect, it } from "vitest";
import { adminPasswordSchema } from "../adminPasswordSchema";

describe("adminPasswordSchema", () => {
	it("validates correct password change data", () => {
		const result = adminPasswordSchema.safeParse({
			currentPassword: "oldpassword",
			newPassword: "newpassword123",
			confirmPassword: "newpassword123",
		});

		expect(result.success).toBe(true);
	});

	it("rejects empty current password", () => {
		const result = adminPasswordSchema.safeParse({
			currentPassword: "",
			newPassword: "newpassword123",
			confirmPassword: "newpassword123",
		});

		expect(result.success).toBe(false);
	});

	it("rejects new password shorter than 8 characters", () => {
		const result = adminPasswordSchema.safeParse({
			currentPassword: "oldpassword",
			newPassword: "short",
			confirmPassword: "short",
		});

		expect(result.success).toBe(false);
	});

	it("rejects when passwords do not match", () => {
		const result = adminPasswordSchema.safeParse({
			currentPassword: "oldpassword",
			newPassword: "newpassword123",
			confirmPassword: "differentpassword",
		});

		expect(result.success).toBe(false);
	});

	it("rejects empty confirm password", () => {
		const result = adminPasswordSchema.safeParse({
			currentPassword: "oldpassword",
			newPassword: "newpassword123",
			confirmPassword: "",
		});

		expect(result.success).toBe(false);
	});

	it("accepts exactly 8 character new password", () => {
		const result = adminPasswordSchema.safeParse({
			currentPassword: "oldpassword",
			newPassword: "12345678",
			confirmPassword: "12345678",
		});

		expect(result.success).toBe(true);
	});
});
