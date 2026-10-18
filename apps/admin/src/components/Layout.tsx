import { useI18n } from "@thebuilder/shared/i18n/I18nProvider";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminHeader } from "./AdminHeader";

export function Layout() {
	const location = useLocation();
	const { copy } = useI18n();

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [location.pathname]);

	return (
		<div className="admin-shell min-h-screen bg-mist text-ink flex flex-col">
			<AdminHeader />

			<main className="py-5 xl:py-10 px-5 flex flex-grow flex-col">
				<Outlet />
			</main>

			<footer className="admin-footer">
				<div className="admin-footer-inner">
					<div className="admin-footer-intro">
						<p className="admin-footer-brand">
							THE BUILDER<span>.</span>
						</p>
						<p className="admin-footer-description">{copy.footer.line}</p>
					</div>
					<div className="admin-footer-actions">
						<nav className="admin-footer-links" aria-label="Site links">
							{[
								{ label: copy.footer.about, to: "/about" },
								{ label: copy.nav.insights, to: "/insights" },
								{ label: copy.nav.work, to: "/work-with-me" },
								{ label: copy.footer.resources, to: "/resources" },
								{
									label: copy.footer.riskReadinessDiagnostic,
									to: "/risk-readiness-diagnostic",
								},
								{ label: copy.footer.privacyPolicy, to: "/privacy" },
							].map((link) => (
								<a key={link.to} href={`https://thebuilder.co.id${link.to}`}>
									{link.label}
								</a>
							))}
						</nav>
					</div>
				</div>
			</footer>
		</div>
	);
}
