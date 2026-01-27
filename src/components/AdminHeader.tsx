import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSupabaseSession } from "../hooks/useSupabaseSession";
import { supabase } from "../lib/supabaseClient";

export function AdminHeader() {
	const navigate = useNavigate();
	const location = useLocation();
	const [signingOut, setSigningOut] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const { isAuthenticated, session } = useSupabaseSession();

	useEffect(() => {
		setMenuOpen(false);
	}, [location.pathname]);

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
		<header className="sticky top-0 z-20 border-b border-ink bg-white backdrop-blur px-5">
			<div className="container-page flex flex-wrap items-center justify-between gap-4 py-2 md:py-4">
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

				<div className="flex items-center gap-2 text-sm">
					{!isAuthenticated && (
						<NavLink
							to="/"
							className="rounded-full border border-sand px-3 py-2 text-ink transition hover:border-ink"
						>
							Home
						</NavLink>
					)}
					{isAuthenticated && (
						<div className="relative">
							<button
								type="button"
								onClick={() => setMenuOpen((open) => !open)}
								aria-expanded={menuOpen}
								aria-haspopup="menu"
								className="font-semibold font-display rounded-full px-4 py-2 text-ink hover:bg-gray-200"
							>
								{session?.user.user_metadata.full_name ?? "Administrator"}
							</button>
							{menuOpen && (
								<div
									role="menu"
									className="absolute right-0 mt-2 w-52 rounded-2xl border border-sand bg-white p-2 shadow-soft"
								>
									<NavLink
										to="/"
										role="menuitem"
										className="block rounded-xl px-3 py-2 text-sm text-ink hover:bg-mist"
									>
										The Builder
									</NavLink>
									<hr className="my-2" />
									<NavLink
										to="/admin/profile"
										role="menuitem"
										className="block rounded-xl px-3 py-2 text-sm text-ink hover:bg-mist"
									>
										Update Profile
									</NavLink>
									<NavLink
										to="/admin/password"
										role="menuitem"
										className="block rounded-xl px-3 py-2 text-sm text-ink hover:bg-mist"
									>
										Update Password
									</NavLink>
									<NavLink
										to="/admin/products"
										role="menuitem"
										className="block rounded-xl px-3 py-2 text-sm text-ink hover:bg-mist"
									>
										Products
									</NavLink>
									<hr className="my-2" />
									<button
										type="button"
										onClick={handleSignOut}
										disabled={signingOut}
										className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
									>
										{signingOut ? "Signing out…" : "Sign out"}
									</button>
								</div>
							)}
						</div>
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
