import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../../components/forms/TextInput";
import { supabase } from "../../lib/supabaseClient";
import {
	type AdminLoginValues,
	adminLoginSchema,
} from "../../schemas/adminLoginSchema";

function LoginPage() {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<AdminLoginValues>({
		resolver: zodResolver(adminLoginSchema),
		defaultValues: { email: "", password: "" },
	});

	const onLogin = async (values: AdminLoginValues) => {
		const { error: loginError } =
			await supabase.auth.signInWithPassword(values);
		if (loginError) {
			setError("email", { message: loginError.message });
			return;
		}
		navigate("/admin");
	};

	return (
		<div className="flex flex-col flex-grow justify-center items-center">
			<section
				className={classNames(
					"flex border bg-white rounded-2xl w-full max-w-lg p-8",
					{
						"border-red-600": errors.email || errors.password,
					},
				)}
			>
				<form onSubmit={handleSubmit(onLogin)} className="space-y-4 w-full">
					<TextInput
						label="Email"
						errorMessage={errors.email?.message}
						inputProps={{
							type: "email",
							...register("email"),
						}}
					/>
					<TextInput
						label="Password"
						errorMessage={errors.password?.message}
						inputProps={{
							type: "password",
							...register("password"),
						}}
					/>
					<button
						type="submit"
						disabled={isSubmitting}
						className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70 w-full"
					>
						{isSubmitting ? "Signing in…" : "Sign In"}
					</button>
				</form>
			</section>
		</div>
	);
}

export default LoginPage;
