import { zodResolver } from "@hookform/resolvers/zod";
import {
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
} from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "../../components/forms/TextInput";
import { useToast } from "../../components/ToastProvider";
import { useFirebaseSession } from "../../hooks/useFirebaseSession";
import { getFirebaseAuth } from "../../lib/firebaseAuth";
import {
	type AdminPasswordFormValues,
	type AdminPasswordFormValuesInput,
	adminPasswordSchema,
} from "../../schemas/adminPasswordSchema";

function PasswordPage() {
	const { user } = useFirebaseSession();
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
		const auth = getFirebaseAuth();
		const email = auth?.currentUser?.email ?? user?.email;
		if (!auth?.currentUser || !email) {
			setError("No email available for this account.");
			return;
		}

		try {
			const credential = EmailAuthProvider.credential(
				email,
				values.currentPassword,
			);
			await reauthenticateWithCredential(auth.currentUser, credential);
			await updatePassword(auth.currentUser, values.newPassword);
			reset();
			showToast("Password updated successfully", { tone: "success" });
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to update password.",
			);
		}
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
