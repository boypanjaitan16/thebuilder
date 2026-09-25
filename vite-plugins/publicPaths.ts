/**
 * Static routes prerendered to HTML during `vite build` (see prerender.ts).
 * Mirrors the public routes in src/App.tsx and public/sitemap.xml — keep
 * all three in sync when adding/removing a public route. /admin/** is
 * intentionally excluded (auth-gated, no SEO value).
 */
export const PUBLIC_PATHS = [
	"/",
	"/organization-transformation",
	"/future-talent-strategy",
	"/risk-and-business-continuity",
	"/insights",
	"/work-with-me",
	"/apply",
	"/diagnostic",
	"/risk-readiness-diagnostic",
	"/resources",
	"/resources/foundational-thinking",
	"/resources/guides-playbooks",
	"/resources/courses-deep-dives",
	"/resources/products",
	"/about",
	"/architecture",
	"/privacy",
];
