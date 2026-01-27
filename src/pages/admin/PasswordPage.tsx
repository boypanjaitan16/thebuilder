import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "../../components/forms/TextInput";
import { useToast } from "../../components/ToastProvider";
import { useSupabaseSession } from "../../hooks/useSupabaseSession";
import { supabase } from "../../lib/supabaseClient";
import {
	type AdminPasswordFormValues,
	type AdminPasswordFormValuesInput,
	adminPasswordSchema,
} from "../../schemas/adminPasswordSchema";

function PasswordPage() {
	const { session } = useSupabaseSession();
	const { showToast } = useToast();
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<AdminPasswordFormValuesInput, undefined, AdminPasswordFormValues>(
		{
			resolver: zodResolver(adminPasswordSchema),
			defaultValues: {
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			},
		},
	);

	const onSubmit = async (values: AdminPasswordFormValues) => {
		setError(null);
		const email = session?.user?.email;
		if (!email) {
			setError("No email available for this account.");
			return;
		}

		const { error: reauthError } = await supabase.auth.signInWithPassword({
			email,
			password: values.currentPassword,
		});
		if (reauthError) {
			setError(reauthError.message);
			return;
		}

		const { error: updateError } = await supabase.auth.updateUser({
			password: values.newPassword,
		});
		if (updateError) {
			setError(updateError.message);
			return;
		}
		reset();
		showToast("Password updated successfully", { tone: "success" });
	};

	return (
		<div className="container-page w-full">
			<section className="rounded-[24px] border border-sand bg-white p-8 shadow-soft">
				<div className="flex flex-row flex-wrap items-center justify-between gap-3">
					<div>
						<h1 className="mt-2 font-display text-2xl font-semibold text-ink">
							Update Password
						</h1>
						<p className="text-sm text-slate-600">
							Choose a strong password you do not reuse elsewhere.
						</p>
					</div>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mt-6 flex flex-col gap-5"
				>
					<TextInput
						label="Current password"
						errorMessage={errors.currentPassword?.message}
						inputProps={{
							type: "password",
							...register("currentPassword"),
						}}
					/>
					<TextInput
						label="New password"
						errorMessage={errors.newPassword?.message}
						inputProps={{
							type: "password",
							...register("newPassword"),
						}}
					/>
					<TextInput
						label="Confirm password"
						errorMessage={errors.confirmPassword?.message}
						inputProps={{
							type: "password",
							...register("confirmPassword"),
						}}
					/>

					{error && <p className="text-sm text-amber-700">{error}</p>}

					<div className="md:col-span-2">
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full md:w-auto rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
						>
							{isSubmitting ? "Saving…" : "Update password"}
						</button>
					</div>
				</form>
			</section>
		</div>
	);
}

export default PasswordPage;
