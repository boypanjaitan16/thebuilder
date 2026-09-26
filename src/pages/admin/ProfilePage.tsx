import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input } from "antd";
import { updateProfile } from "firebase/auth";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Breadcrumb } from "../../components/Breadcrumb";
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
		control,
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
		<section className="container-page w-full">
			<Breadcrumb items={[{ label: "Profile" }]} />
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

			<Form
				layout="vertical"
				size="large"
				onSubmitCapture={handleSubmit(onSubmit)}
				className="mt-6 flex flex-col"
			>
				<Form.Item label="Email">
					<Input
						type="email"
						readOnly
						value={user?.email || ""}
						className="bg-slate-50 text-slate-500"
					/>
				</Form.Item>
				<Form.Item
					label="Full name"
					validateStatus={errors.fullName ? "error" : ""}
					help={errors.fullName?.message}
				>
					<Controller
						name="fullName"
						control={control}
						render={({ field }) => (
							<Input
								status={errors.fullName ? "error" : undefined}
								{...field}
							/>
						)}
					/>
				</Form.Item>

				{error && <p className="text-sm text-amber-700">{error}</p>}

				<div className="md:col-span-2">
					<Button
						type="primary"
						shape="round"
						htmlType="submit"
						loading={isSubmitting}
						className="w-full md:w-auto"
						icon={<CheckCircle />}
					>
						{isSubmitting ? "Saving…" : "Save changes"}
					</Button>
				</div>
			</Form>
		</section>
	);
}

export default ProfilePage;
