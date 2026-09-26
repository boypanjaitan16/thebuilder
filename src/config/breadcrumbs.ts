import type { Copy } from "../i18n/translations";

export type BreadcrumbRoute = {
	path: string;
	labelKey: keyof Copy["breadcrumb"];
	parentPath?: string;
};

// Static public routes only — `/insights/:slug` is deliberately excluded
// since its trailing crumb is the fetched article's title, not a fixed
// i18n label; ArticleDetailPage renders its own PageBreadcrumb for that.
export const breadcrumbRoutes: BreadcrumbRoute[] = [
	{ path: "/organization-transformation", labelKey: "organization" },
	{ path: "/future-talent-strategy", labelKey: "future" },
	{ path: "/risk-and-business-continuity", labelKey: "risk" },
	{ path: "/insights", labelKey: "insights" },
	{ path: "/work-with-me", labelKey: "work" },
	{ path: "/apply", labelKey: "apply" },
	{ path: "/diagnostic", labelKey: "diagnostic" },
	{ path: "/risk-readiness-diagnostic", labelKey: "riskReadinessDiagnostic" },
	{ path: "/resources", labelKey: "resources" },
	{
		path: "/resources/foundational-thinking",
		labelKey: "resourcesFoundational",
		parentPath: "/resources",
	},
	{
		path: "/resources/guides-playbooks",
		labelKey: "resourcesGuides",
		parentPath: "/resources",
	},
	{
		path: "/resources/courses-deep-dives",
		labelKey: "resourcesCourses",
		parentPath: "/resources",
	},
	{
		path: "/resources/products",
		labelKey: "resourcesProducts",
		parentPath: "/resources",
	},
	{ path: "/about", labelKey: "about" },
	{ path: "/architecture", labelKey: "architecture" },
	{ path: "/privacy", labelKey: "privacy" },
];
