import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "../../components/forms/TextInput";
import { useToast } from "../../components/ToastProvider";
import { useFirebaseSession } from "../../hooks/useFirebaseSession";
import { getFirebaseAuth, notifyAuthUserRefresh } from "../../lib/firebaseAuth";
import {
	type AdminProfileFormValues,
	type AdminProfileFormValuesInput,
	adminProfileSchema,
} from "../../schemas/adminProfileSchema";

function ProfilePage() {
	const { user } = useFirebaseSession();
	const { showToast } = useToast();
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<AdminProfileFormValuesInput, undefined, AdminProfileFormValues>({
		resolver: zodResolver(adminProfileSchema),
		defaultValues: {
			fullName: "",
		},
	});

	useEffect(() => {
		if (!user) return;
		reset({
			fullName: user.displayName || "",
		});
	}, [reset, user]);

	const onSubmit = async (values: AdminProfileFormValues) => {
		setError(null);
		const auth = getFirebaseAuth();
		if (!auth?.currentUser) {
			setError("No authenticated user.");
			return;
		}
		try {
			await updateProfile(auth.currentUser, { displayName: values.fullName });
			notifyAuthUserRefresh();
			showToast("Profile updated successfully", { tone: "success" });
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to update profile.",
			);
		}
	};

	return (
		<div className="container-page w-full">
			<section className="rounded-[24px] border border-sand bg-white p-8 shadow-soft">
				<div className="flex flex-row flex-wrap items-center justify-between gap-3">
					<div>
						<h1 className="mt-2 font-display text-2xl font-semibold text-ink">
							Update Profile
						</h1>
						<p className="text-sm text-slate-600">
							Keep your admin profile details up to date.
						</p>
					</div>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mt-6 flex flex-col gap-5"
				>
					<TextInput
						label="Email"
						inputProps={{
							type: "email",
							readOnly: true,
							value: user?.email || "",
						}}
						inputClassName="border-sand bg-slate-50 text-slate-500"
					/>
					<TextInput
						label="Full name"
						errorMessage={errors.fullName?.message}
						inputProps={{
							type: "text",
							...register("fullName"),
						}}
					/>

					{error && <p className="text-sm text-amber-700">{error}</p>}

					<div className="md:col-span-2">
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full md:w-auto rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
						>
							{isSubmitting ? "Saving…" : "Save changes"}
						</button>
					</div>
				</form>
			</section>
		</div>
	);
}

export default ProfilePage;
