import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSupabaseSession } from "../hooks/useSupabaseSession";
import { supabase } from "../lib/supabaseClient";

export function AdminHeader() {
	const navigate = useNavigate();
	const [signingOut, setSigningOut] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { isAuthenticated } = useSupabaseSession();

	const handleSignOut = async () => {
		setSigningOut(true);
		setError(null);
		const { error: signOutError } = await supabase.auth.signOut();
		if (signOutError) {
			setError(signOutError.message);
		} else {
			navigate("/admin");
		}
		setSigningOut(false);
	};

	return (
		<header className="sticky top-0 z-20 border-b border-sand/70 bg-white/90 backdrop-blur px-5">
			<div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
				<NavLink to="/admin" className="flex items-center gap-3">
					<div className="text-left leading-tight">
						<p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
							Admin
						</p>
						<p className="font-display text-lg font-semibold text-ink">
							The Builder
						</p>
					</div>
				</NavLink>

				<div className="flex items-center gap-2 text-sm font-semibold">
					<NavLink
						to="/"
						className="rounded-full border border-sand px-3 py-2 text-ink transition hover:border-ink"
					>
						Home
					</NavLink>
					{isAuthenticated && (
						<button
							type="button"
							onClick={handleSignOut}
							disabled={signingOut}
							className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-white shadow-soft transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
						>
							{signingOut ? "Signing out…" : "Sign out"}
						</button>
					)}
				</div>
			</div>
			{error && (
				<div className="border-t border-amber-200 bg-amber-50 px-6 py-2 text-sm text-amber-800">
					{error}
				</div>
			)}
		</header>
	);
}
