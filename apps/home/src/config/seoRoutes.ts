import type { SeoPageKey } from "@thebuilder/shared/i18n/translations";

export const PRODUCTION_ORIGIN = "https://thebuilder.co.id";

// Unprefixed static route → `seo.pages` copy key. Must cover every path in
// vite-plugins/publicPaths.ts (enforced by seoRoutes.test.ts).
export const seoRoutes: Record<string, SeoPageKey> = {
	"/": "home",
	"/organization-transformation": "organization",
	"/future-talent-strategy": "future",
	"/risk-and-business-continuity": "risk",
	"/insights": "insights",
	"/work-with-me": "work",
	"/apply": "apply",
	"/diagnostic": "diagnostic",
	"/risk-readiness-diagnostic": "riskReadinessDiagnostic",
	"/resources": "resources",
	"/resources/foundational-thinking": "resourcesFoundational",
	"/resources/guides-playbooks": "resourcesGuides",
	"/resources/courses-deep-dives": "resourcesCourses",
	"/resources/products": "resourcesProducts",
	"/about": "about",
	"/architecture": "architecture",
	"/privacy": "privacy",
};

export const OG_LOCALES = { id: "id_ID", en: "en_US" } as const;
