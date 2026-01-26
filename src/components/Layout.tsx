import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import { AdminHeader } from "./AdminHeader";
import { Header } from "./Header";

export function Layout() {
	const location = useLocation();
	const { copy } = useI18n();
	const isAdminRoute = location.pathname.startsWith("/admin");

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [location.pathname]);

	return (
		<div className="min-h-screen bg-mist text-ink flex flex-col">
			{isAdminRoute ? <AdminHeader /> : <Header />}

			<main className="py-5 xl:py-10 px-5 flex flex-grow flex-col">
				<Outlet />
			</main>

			<footer className="border-t border-sand/70 bg-white py-10">
				<div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-5 xl:px-0">
					<div>
						<p className="text-xs uppercase tracking-[0.2em] text-slate-500">
							The Builder
						</p>
						<p className="mt-2 max-w-xl text-sm text-slate-600">
							{copy.footer.line}
						</p>
					</div>
					<div className="flex flex-col md:flex-row md:flex-wrap gap-3 text-sm font-medium text-slate-700">
						{[
							{ label: copy.footer.about, to: "/about" },
							{ label: copy.nav.insights, to: "/insights" },
							{ label: copy.nav.work, to: "/work-with-me" },
							{ label: copy.footer.privacyPolicy, to: "/privacy" },
							{ label: copy.footer.resources, to: "/resources" },
							{
								label: copy.footer.riskReadinessDiagnostic,
								to: "/risk-readiness-diagnostic",
							},
						].map((link) => (
							<NavLink
								key={link.to}
								to={link.to}
								className="md:rounded-full md:border border-sand md:px-3 md:py-1 hover:border-ink hover:text-ink"
							>
								{link.label}
							</NavLink>
						))}
					</div>
				</div>
			</footer>
		</div>
	);
}
