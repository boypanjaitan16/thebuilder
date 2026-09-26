import type { MenuProps } from "antd";
import { Button, Dropdown } from "antd";
import { signOut } from "firebase/auth";
import { Home, HomeIcon, LogOut, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useFirebaseSession } from "../hooks/useFirebaseSession";
import { getFirebaseAuth } from "../lib/firebaseAuth";

export function AdminHeader() {
	const navigate = useNavigate();
	const location = useLocation();
	const [signingOut, setSigningOut] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const { isAuthenticated, user } = useFirebaseSession();

	useEffect(() => {
		setMenuOpen(false);
	}, [location.pathname]);

	const handleSignOut = async () => {
		setSigningOut(true);
		setError(null);
		const auth = getFirebaseAuth();
		if (!auth) {
			setError("Firebase is not configured.");
			setSigningOut(false);
			return;
		}
		try {
			await signOut(auth);
			navigate("/admin");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to sign out.");
		}
		setSigningOut(false);
	};

	const items: MenuProps["items"] = [
		{
			key: "home",
			label: "The Builder",
			icon: <Home size={16} />,
			onClick: () => navigate("/"),
		},
		{ type: "divider" },
		{
			key: "profile",
			label: "Update Profile",
			onClick: () => navigate("/admin/profile"),
		},
		{
			key: "password",
			label: "Update Password",
			onClick: () => navigate("/admin/password"),
		},
		{
			key: "products",
			label: "Products",
			onClick: () => navigate("/admin/products"),
		},
		{
			key: "articles",
			label: "Articles",
			onClick: () => navigate("/admin/articles"),
		},
		{ type: "divider" },
		{
			key: "signout",
			label: signingOut ? "Signing out…" : "Sign out",
			icon: <LogOut size={16} />,
			danger: true,
			disabled: signingOut,
			onClick: handleSignOut,
		},
	];

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
						<Button
							onClick={() => navigate("/")}
							icon={<HomeIcon />}
							type="text"
						/>
					)}
					{isAuthenticated && (
						<Dropdown
							menu={{ items }}
							trigger={["click", "hover"]}
							open={menuOpen}
							onOpenChange={setMenuOpen}
							arrow
						>
							<button
								type="button"
								className="font-semibold flex flex-row items-center gap-2"
							>
								<UserCircle />
								<span>{user?.displayName ?? "Administrator"}</span>
							</button>
						</Dropdown>
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
