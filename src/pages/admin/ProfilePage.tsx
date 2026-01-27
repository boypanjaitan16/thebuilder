import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSupabaseSession } from "../../hooks/useSupabaseSession";
import { supabase } from "../../lib/supabaseClient";
import {
	type AdminProfileFormValues,
	type AdminProfileFormValuesInput,
	adminProfileSchema,
} from "../../schemas/adminProfileSchema";

function ProfilePage() {
	const { session } = useSupabaseSession();
	const [status, setStatus] = useState<string | null>(null);
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
		if (!session?.user) return;
		const metadata = session.user.user_metadata || {};
		reset({
			fullName: (metadata.full_name as string) || "",
		});
	}, [reset, session]);

	const onSubmit = async (values: AdminProfileFormValues) => {
		setError(null);
		setStatus(null);
		const { error: updateError } = await supabase.auth.updateUser({
			data: {
				full_name: values.fullName,
			},
		});

		if (updateError) {
			setError(updateError.message);
			return;
		}

		setStatus("Profile updated");
	};

	return (
		<div className="container-page w-full">
			<section className="rounded-[24px] border border-sand bg-white p-8 shadow-soft">
				<div className="flex flex-row flex-wrap items-center justify-between gap-3">
					<div>
						<h1 className="mt-2 font-display text-3xl font-semibold text-ink">
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
					<label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-ink">
						Email
						<input
							type="email"
							readOnly
							value={session?.user.email || ""}
							className="rounded-xl border border-sand bg-slate-50 px-4 py-3 text-base text-slate-500"
						/>
					</label>
					<label className="flex flex-col gap-2 text-sm font-medium text-ink">
						Full name
						<input
							type="text"
							className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
							{...register("fullName")}
						/>
						{errors.fullName && (
							<span className="text-sm text-amber-700">
								{errors.fullName.message}
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
							{isSubmitting ? "Saving…" : "Save changes"}
						</button>
					</div>
				</form>
			</section>
		</div>
	);
}

export default ProfilePage;
