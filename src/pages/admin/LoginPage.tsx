import classNames from "classnames";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

type LoginValues = {
	email: string;
	password: string;
};

function LoginPage() {
	const navigate = useNavigate();
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<LoginValues>({
		defaultValues: { email: "", password: "" },
	});

	const onLogin = async (values: LoginValues) => {
		setError(null);
		setStatus(null);
		const { error: loginError } =
			await supabase.auth.signInWithPassword(values);
		if (loginError) {
			setError(loginError.message);
			return;
		}
		setStatus("Signed in");
		navigate("/admin");
	};

	return (
		<div className="flex flex-col flex-grow justify-center items-center">
			<section
				className={classNames(
					"flex border bg-white rounded-2xl w-full max-w-lg p-8",
					{
						"border-red-600": error,
					},
				)}
			>
				<form onSubmit={handleSubmit(onLogin)} className="space-y-4 w-full">
					<label className="flex flex-col gap-2 text-sm font-medium text-ink">
						Email
						<input
							type="email"
							required
							className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
							{...register("email")}
						/>
					</label>
					<label className="flex flex-col gap-2 text-sm font-medium text-ink">
						Password
						<input
							type="password"
							required
							className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
							{...register("password")}
						/>
					</label>
					{error && <p className="text-sm text-red-600">{error}</p>}
					{status && <p className="text-sm text-emerald-700">{status}</p>}
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
