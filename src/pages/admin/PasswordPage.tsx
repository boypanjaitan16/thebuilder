import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSupabaseSession } from "../../hooks/useSupabaseSession";
import { supabase } from "../../lib/supabaseClient";
import {
	type AdminPasswordFormValues,
	type AdminPasswordFormValuesInput,
	adminPasswordSchema,
} from "../../schemas/adminPasswordSchema";

function PasswordPage() {
	const { session } = useSupabaseSession();
	const [status, setStatus] = useState<string | null>(null);
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
		setStatus(null);
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
		setStatus("Password updated");
	};

	return (
		<div className="container-page w-full">
			<section className="rounded-[24px] border border-sand bg-white p-8 shadow-soft">
				<div className="flex flex-row flex-wrap items-center justify-between gap-3">
					<div>
						<h1 className="mt-2 font-display text-3xl font-semibold text-ink">
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
					<label className="flex flex-col gap-2 text-sm font-medium text-ink">
						Current password
						<input
							type="password"
							className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
							{...register("currentPassword")}
						/>
						{errors.currentPassword && (
							<span className="text-sm text-amber-700">
								{errors.currentPassword.message}
							</span>
						)}
					</label>
					<label className="flex flex-col gap-2 text-sm font-medium text-ink">
						New password
						<input
							type="password"
							className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
							{...register("newPassword")}
						/>
						{errors.newPassword && (
							<span className="text-sm text-amber-700">
								{errors.newPassword.message}
							</span>
						)}
					</label>
					<label className="flex flex-col gap-2 text-sm font-medium text-ink">
						Confirm password
						<input
							type="password"
							className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
							{...register("confirmPassword")}
						/>
						{errors.confirmPassword && (
							<span className="text-sm text-amber-700">
								{errors.confirmPassword.message}
							</span>
						)}
					</label>

					{error && <p className="text-sm text-amber-700">{error}</p>}
					{status && <p className="text-sm text-emerald-700">{status}</p>}

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
