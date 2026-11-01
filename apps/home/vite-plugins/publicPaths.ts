import { localizePath } from "../src/lib/locale";

export type PublicRoute = {
	path: string;
	changefreq: "weekly" | "monthly" | "yearly";
	priority: number;
};

/**
 * Static public routes, unprefixed (Indonesian). Each is prerendered and
 * listed in the sitemap in both languages: `/x` and `/en/x` (see
 * prerender.ts and generateSitemap.ts). Mirrors the page routes in
 * src/App.tsx and the copy keys in src/config/seoRoutes.ts — keep them in
 * sync when adding/removing a public route. The admin app is hosted
 * separately and has no routes in this list.
 */
export const PUBLIC_ROUTES: PublicRoute[] = [
	{ path: "/", changefreq: "weekly", priority: 1.0 },
	{
		path: "/organization-transformation",
		changefreq: "monthly",
		priority: 0.8,
	},
	{ path: "/future-talent-strategy", changefreq: "monthly", priority: 0.8 },
	{
		path: "/risk-and-business-continuity",
		changefreq: "monthly",
		priority: 0.8,
	},
	{ path: "/insights", changefreq: "weekly", priority: 0.7 },
	{ path: "/work-with-me", changefreq: "monthly", priority: 0.8 },
	{ path: "/apply", changefreq: "monthly", priority: 0.9 },
	{ path: "/diagnostic", changefreq: "monthly", priority: 0.7 },
	{ path: "/risk-readiness-diagnostic", changefreq: "monthly", priority: 0.7 },
	{ path: "/resources", changefreq: "weekly", priority: 0.7 },
	{
		path: "/resources/foundational-thinking",
		changefreq: "monthly",
		priority: 0.6,
	},
	{ path: "/resources/guides-playbooks", changefreq: "monthly", priority: 0.6 },
	{
		path: "/resources/courses-deep-dives",
		changefreq: "monthly",
		priority: 0.6,
	},
	{ path: "/resources/products", changefreq: "weekly", priority: 0.6 },
	{ path: "/about", changefreq: "monthly", priority: 0.6 },
	{ path: "/architecture", changefreq: "monthly", priority: 0.5 },
	{ path: "/privacy", changefreq: "yearly", priority: 0.3 },
];

export const PUBLIC_PATHS = PUBLIC_ROUTES.map((route) => route.path);

/** Every static route in both languages, for prerendering. */
export function localizedPublicPaths(): string[] {
	return [
		...PUBLIC_PATHS,
		...PUBLIC_PATHS.map((path) => localizePath(path, "en")),
	];
}
