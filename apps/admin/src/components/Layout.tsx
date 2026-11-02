import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminHeader } from "./AdminHeader";

export function Layout() {
	const location = useLocation();
	const showHeader = location.pathname !== "/login";

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [location.pathname]);

	return (
		<div className="admin-shell min-h-screen bg-mist text-ink flex flex-col">
			{showHeader && <AdminHeader />}

			<main className="py-5 xl:py-10 px-5 flex flex-grow flex-col">
				<Outlet />
			</main>
		</div>
	);
}
