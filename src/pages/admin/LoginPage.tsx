import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input } from "antd";
import classNames from "classnames";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getFirebaseAuth } from "../../lib/firebaseAuth";
import {
	type AdminLoginValues,
	adminLoginSchema,
} from "../../schemas/adminLoginSchema";

function LoginPage() {
	const navigate = useNavigate();

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<AdminLoginValues>({
		resolver: zodResolver(adminLoginSchema),
		defaultValues: { email: "", password: "" },
	});

	const onLogin = async (values: AdminLoginValues) => {
		const auth = getFirebaseAuth();
		if (!auth) {
			setError("email", { message: "Firebase is not configured." });
			return;
		}
		try {
			await signInWithEmailAndPassword(auth, values.email, values.password);
			navigate("/admin");
		} catch (err) {
			setError("email", {
				message: err instanceof Error ? err.message : "Failed to sign in.",
			});
		}
	};

	return (
		<div className="flex flex-col flex-grow justify-center items-center">
			<section
				className={classNames(
					"flex border bg-white rounded-lg w-full max-w-lg p-8",
					{
						"border-red-600": errors.email || errors.password,
					},
				)}
			>
				<Form
					size="large"
					layout="vertical"
					onSubmitCapture={handleSubmit(onLogin)}
					className="w-full"
				>
					<Form.Item
						label="Email"
						rules={[{ required: true }]}
						validateStatus={errors.email ? "error" : ""}
						help={errors.email?.message}
					>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<Input
									type="email"
									allowClear
									status={errors.email ? "error" : undefined}
									{...field}
								/>
							)}
						/>
					</Form.Item>
					<Form.Item
						label="Password"
						rules={[{ required: true }]}
						validateStatus={errors.password ? "error" : ""}
						help={errors.password?.message}
					>
						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<Input.Password
									allowClear
									status={errors.password ? "error" : undefined}
									{...field}
								/>
							)}
						/>
					</Form.Item>
					<Button type="primary" htmlType="submit" loading={isSubmitting} block>
						{isSubmitting ? "Signing in…" : "Sign In"}
					</Button>
				</Form>
			</section>
		</div>
	);
}

export default LoginPage;
