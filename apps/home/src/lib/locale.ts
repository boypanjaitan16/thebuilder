import type { Language } from "@thebuilder/shared/i18n/translations";

/**
 * Indonesian is the default language and lives at the root; English lives
 * under /en. The URL is the only source of truth for the home app's
 * language (no localStorage), so every language has its own crawlable,
 * prerendered URL.
 */
export const DEFAULT_LANGUAGE: Language = "id";
export const EN_PREFIX = "/en";

const ARTICLE_DETAIL = /^\/insights\/[^/]+$/;

export function getLanguageFromPath(pathname: string): Language {
	return pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`)
		? "en"
		: DEFAULT_LANGUAGE;
}

/**
 * `/en/apply` → `/apply`, `/en` → `/`, `/apply/` → `/apply`. Trailing
 * slashes are dropped because Hosting serves `/apply/` as well.
 */
export function stripLocale(pathname: string): string {
	const path =
		pathname.length > 1 ? pathname.replace(/\/+$/, "") || "/" : pathname;
	if (getLanguageFromPath(path) !== "en") return path;
	return path.slice(EN_PREFIX.length) || "/";
}

/** `/apply` + en → `/en/apply`, `/` + en → `/en`, any path + id → itself. */
export function localizePath(path: string, language: Language): string {
	if (language === DEFAULT_LANGUAGE) return path;
	return path === "/" ? EN_PREFIX : `${EN_PREFIX}${path}`;
}

export function isArticleDetailPath(pathname: string): boolean {
	return ARTICLE_DETAIL.test(stripLocale(pathname));
}

/**
 * The same page in `language`. Articles are single-language and not paired
 * with a translation, so an article page maps to that language's /insights.
 */
export function alternatePath(pathname: string, language: Language): string {
	const path = stripLocale(pathname);
	return localizePath(isArticleDetailPath(path) ? "/insights" : path, language);
}
