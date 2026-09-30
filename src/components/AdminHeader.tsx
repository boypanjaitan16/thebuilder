import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { signOut } from "firebase/auth";
import { ArrowUpRight, Home, LogOut, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useFirebaseSession } from "../hooks/useFirebaseSession";
import { getFirebaseAuth } from "../lib/firebaseAuth";
import "./admin-chrome.css";

const adminLinks = [
	{ to: "/admin", label: "Overview" },
	{ to: "/admin/products", label: "Products" },
	{ to: "/admin/articles", label: "Articles" },
	{ to: "/admin/advisory-requests", label: "Requests" },
];

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
		<header className="admin-header">
			<div className="admin-header-inner">
				<NavLink
					to="/admin"
					className="admin-brand"
					aria-label="The Builder Admin"
				>
					<span className="admin-brand-mark" aria-hidden="true">
						TB<span>.</span>
					</span>
					<span className="admin-brand-copy">
						<strong>The Builder</strong>
						<small>Admin workspace</small>
					</span>
				</NavLink>

				{isAuthenticated && (
					<nav className="admin-nav" aria-label="Admin navigation">
						{adminLinks.map(({ to, label }) => (
							<NavLink
								key={to}
								to={to}
								end={to === "/admin"}
								className={({ isActive }) => (isActive ? "is-active" : "")}
							>
								{label}
							</NavLink>
						))}
					</nav>
				)}

				<div className="admin-header-actions">
					<NavLink className="admin-site-link" to="/">
						<span>View site</span>
						<ArrowUpRight size={16} aria-hidden="true" />
					</NavLink>
					{isAuthenticated && (
						<Dropdown
							menu={{ items }}
							trigger={["click"]}
							open={menuOpen}
							onOpenChange={setMenuOpen}
							arrow
						>
							<button type="button" className="admin-account-button">
								<UserCircle size={18} aria-hidden="true" />
								<span>{user?.displayName ?? "Administrator"}</span>
							</button>
						</Dropdown>
					)}
				</div>
			</div>
			{error && (
				<div className="admin-header-error" role="alert">
					{error}
				</div>
			)}
		</header>
	);
}
