import { Link, matchPath, Outlet, useLocation } from "react-router-dom";
import { breadcrumbRoutes } from "../config/breadcrumbs";
import { useI18n } from "../i18n/I18nProvider";
import "../pages/blueprint.css";

function BlueprintHeader() {
	const location = useLocation();
	const { copy } = useI18n();
	const onServicePage = [
		"/organization-transformation",
		"/future-talent-strategy",
		"/risk-and-business-continuity",
	].includes(location.pathname);

	return (
		<header className="blueprint-header">
			<div className="blueprint-header-inner">
				<Link className="blueprint-brand" to="/" aria-label="The Builder">
					<span className="blueprint-brand-mark" aria-hidden="true">
						TB<span>.</span>
					</span>
					<span className="blueprint-brand-copy">
						<strong>THE BUILDER</strong>
						<small>{copy.header.tagline}</small>
					</span>
				</Link>
				<nav className="blueprint-nav">
					<Link className={location.pathname === "/" ? "is-active" : ""} to="/">
						{copy.nav.home}
					</Link>
					<details className="blueprint-services" key={location.pathname}>
						<summary className={onServicePage ? "is-active" : ""}>
							{copy.brand.services}
							<span aria-hidden="true">⌄</span>
						</summary>
						<div className="blueprint-services-menu">
							<Link to="/organization-transformation">
								{copy.nav.organization}
							</Link>
							<Link to="/future-talent-strategy">{copy.nav.future}</Link>
							<Link to="/risk-and-business-continuity">{copy.nav.risk}</Link>
						</div>
					</details>
					<Link
						className={
							location.pathname.startsWith("/insights") ? "is-active" : ""
						}
						to="/insights"
					>
						{copy.nav.insights}
					</Link>
					<Link
						className={location.pathname === "/work-with-me" ? "is-active" : ""}
						to="/work-with-me"
					>
						{copy.nav.work}
					</Link>
					<Link
						className={
							location.pathname.startsWith("/resources") ? "is-active" : ""
						}
						to="/resources"
					>
						{copy.nav.resources}
					</Link>
				</nav>
				<Link className="blueprint-header-cta" to="/apply">
					{copy.nav.apply}
					<span aria-hidden="true">↗</span>
				</Link>
			</div>
		</header>
	);
}

function BlueprintFooter() {
	const { copy, language, setLanguage } = useI18n();
	return (
		<footer className="blueprint-footer">
			<div className="blueprint-wrap blueprint-footer-inner">
				<div>
					<p className="blueprint-footer-brand">THE BUILDER</p>
					<p>{copy.footer.line}</p>
				</div>
				<div className="blueprint-footer-actions">
					<div className="blueprint-language">
						<button
							type="button"
							className={language === "id" ? "is-active" : ""}
							onClick={() => setLanguage("id")}
							aria-pressed={language === "id"}
						>
							ID
						</button>
						<button
							type="button"
							className={language === "en" ? "is-active" : ""}
							onClick={() => setLanguage("en")}
							aria-pressed={language === "en"}
						>
							EN
						</button>
					</div>
					<Link to="/about">{copy.footer.about}</Link>
					<Link to="/architecture">{copy.breadcrumb.architecture}</Link>
					<Link to="/resources">{copy.footer.resources}</Link>
					<Link to="/diagnostic">{copy.breadcrumb.diagnostic}</Link>
					<Link to="/risk-readiness-diagnostic">
						{copy.footer.riskReadinessDiagnostic}
					</Link>
					<Link to="/privacy">{copy.footer.privacyPolicy}</Link>
				</div>
			</div>
		</footer>
	);
}

function BlueprintBreadcrumb() {
	const location = useLocation();
	const { copy } = useI18n();
	const route = breadcrumbRoutes.find((item) =>
		matchPath({ path: item.path, end: true }, location.pathname),
	);
	if (!route) return null;
	const parent = route.parentPath
		? breadcrumbRoutes.find((item) => item.path === route.parentPath)
		: undefined;
	return (
		<nav
			className="blueprint-breadcrumb blueprint-wrap"
			aria-label="Breadcrumb"
		>
			<Link to="/">{copy.breadcrumb.home}</Link>
			<span aria-hidden="true">/</span>
			{parent && (
				<>
					<Link to={parent.path}>{copy.breadcrumb[parent.labelKey]}</Link>
					<span aria-hidden="true">/</span>
				</>
			)}
			<span aria-current="page">{copy.breadcrumb[route.labelKey]}</span>
		</nav>
	);
}

export default function BlueprintLayout() {
	const location = useLocation();
	const isFeaturePage =
		location.pathname === "/" ||
		location.pathname === "/organization-transformation";
	return (
		<div className="builder-blueprint">
			<BlueprintHeader />
			<main id="main-content">
				{isFeaturePage ? (
					<Outlet />
				) : (
					<div className="blueprint-interior flex flex-col">
						<BlueprintBreadcrumb />
						<Outlet />
					</div>
				)}
			</main>
			<BlueprintFooter />
		</div>
	);
}
