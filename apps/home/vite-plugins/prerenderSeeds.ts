import type { Language } from "@thebuilder/shared/i18n/translations";
import { localizePath } from "../src/lib/locale";
import type { PrerenderData } from "../src/lib/prerenderData";
import type { BuildTimeArticle } from "./fetchPublishedArticles";

const LANGUAGES: Language[] = ["id", "en"];

/**
 * Seed data per prerendered path: each article page gets its article, and
 * each language's /insights gets that language's published list (newest
 * first, without bodies, since the list doesn't render them).
 */
export function buildPrerenderSeeds(
	articles: BuildTimeArticle[],
): Record<string, PrerenderData> {
	const seeds: Record<string, PrerenderData> = {};
	for (const article of articles) {
		seeds[localizePath(`/insights/${article.slug}`, article.language)] = {
			article,
		};
	}
	for (const language of LANGUAGES) {
		const items = articles
			.filter((article) => article.language === language)
			.sort((a, b) => b.created_at.localeCompare(a.created_at))
			.map((article) => ({ ...article, content: "" }));
		seeds[localizePath("/insights", language)] = {
			articles: { language, items },
		};
	}
	return seeds;
}
