import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input } from "antd";
import {
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
} from "firebase/auth";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Breadcrumb } from "../../components/Breadcrumb";
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
		control,
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
		<section className="container-page w-full">
			<Breadcrumb items={[{ label: "Password" }]} />
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

			<Form
				size="large"
				layout="vertical"
				onSubmitCapture={handleSubmit(onSubmit)}
				className="mt-6 flex flex-col"
			>
				<Form.Item
					label="Current password"
					validateStatus={errors.currentPassword ? "error" : ""}
					help={errors.currentPassword?.message}
				>
					<Controller
						name="currentPassword"
						control={control}
						render={({ field }) => (
							<Input.Password
								status={errors.currentPassword ? "error" : undefined}
								{...field}
							/>
						)}
					/>
				</Form.Item>
				<Form.Item
					label="New password"
					validateStatus={errors.newPassword ? "error" : ""}
					help={errors.newPassword?.message}
				>
					<Controller
						name="newPassword"
						control={control}
						render={({ field }) => (
							<Input.Password
								status={errors.newPassword ? "error" : undefined}
								{...field}
							/>
						)}
					/>
				</Form.Item>
				<Form.Item
					label="Confirm password"
					validateStatus={errors.confirmPassword ? "error" : ""}
					help={errors.confirmPassword?.message}
				>
					<Controller
						name="confirmPassword"
						control={control}
						render={({ field }) => (
							<Input.Password
								status={errors.confirmPassword ? "error" : undefined}
								{...field}
							/>
						)}
					/>
				</Form.Item>

				{error && <p className="text-sm text-amber-700">{error}</p>}

				<div className="md:col-span-2">
					<Button
						shape="round"
						type="primary"
						htmlType="submit"
						loading={isSubmitting}
						className="w-full md:w-auto"
						icon={<CheckCircle />}
					>
						{isSubmitting ? "Saving…" : "Update password"}
					</Button>
				</div>
			</Form>
		</section>
	);
}

export default PasswordPage;
