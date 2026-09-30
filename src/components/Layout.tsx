import { lazy, Suspense, useEffect } from "react";
import { matchPath, NavLink, Outlet, useLocation } from "react-router-dom";
import { breadcrumbRoutes } from "../config/breadcrumbs";
import { useI18n } from "../i18n/I18nProvider";
import type { BreadcrumbItem } from "./Breadcrumb";
import { PageBreadcrumb } from "./PageBreadcrumb";

// Lazy-loaded: pulls in antd + lucide-react, kept out of the public
// site's bundle since only /admin/** routes ever render it.
const AdminHeader = lazy(() =>
	import("./AdminHeader").then((m) => ({ default: m.AdminHeader })),
);
const BlueprintLayout = lazy(() => import("./BlueprintLayout"));

export function Layout() {
	const location = useLocation();
	const { copy, language, setLanguage } = useI18n();
	const isAdminRoute = location.pathname.startsWith("/admin");

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [location.pathname]);

	if (!isAdminRoute) {
		return (
			<Suspense fallback={<div className="min-h-screen bg-mist" />}>
				<BlueprintLayout />
			</Suspense>
		);
	}

	const matchedRoute = breadcrumbRoutes.find((route) =>
		matchPath({ path: route.path, end: true }, location.pathname),
	);
	const parentRoute = matchedRoute?.parentPath
		? breadcrumbRoutes.find((route) => route.path === matchedRoute.parentPath)
		: undefined;
	const breadcrumbItems: BreadcrumbItem[] | null = matchedRoute
		? [
				...(parentRoute
					? [
							{
								label: copy.breadcrumb[parentRoute.labelKey],
								to: parentRoute.path,
							},
						]
					: []),
				{ label: copy.breadcrumb[matchedRoute.labelKey] },
			]
		: null;

	return (
		<Suspense fallback={<div className="min-h-screen bg-mist" />}>
			<div className="admin-shell min-h-screen bg-mist text-ink flex flex-col">
				<AdminHeader />

				<main className="py-5 xl:py-10 px-5 flex flex-grow flex-col">
					{breadcrumbItems && (
						<div className="breadcrumb-container">
							<PageBreadcrumb items={breadcrumbItems} />
						</div>
					)}
					<Outlet />
				</main>

				<footer className="admin-footer">
					<div className="admin-footer-inner">
						<div className="admin-footer-intro">
							<p className="admin-footer-eyebrow">THE BUILDER / ADMIN</p>
							<p className="admin-footer-brand">
								THE BUILDER<span>.</span>
							</p>
							<p className="admin-footer-description">{copy.footer.line}</p>
						</div>
						<div className="admin-footer-actions">
							<nav className="admin-footer-language" aria-label="Language">
								<button
									type="button"
									onClick={() => setLanguage("id")}
									className={language === "id" ? "is-active" : ""}
									aria-pressed={language === "id"}
								>
									ID
								</button>
								<button
									type="button"
									onClick={() => setLanguage("en")}
									className={language === "en" ? "is-active" : ""}
									aria-pressed={language === "en"}
								>
									EN
								</button>
							</nav>
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
									<NavLink key={link.to} to={link.to}>
										{link.label}
									</NavLink>
								))}
							</nav>
						</div>
					</div>
				</footer>
			</div>
		</Suspense>
	);
}
