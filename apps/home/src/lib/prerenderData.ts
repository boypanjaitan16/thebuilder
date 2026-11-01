import type { Language } from "@thebuilder/shared/i18n/translations";
import type { Article } from "@thebuilder/shared/types/Article";

/**
 * Build-time article data for prerendered pages. Firestore reads are
 * skipped while prerendering (no App Check token), so vite-plugins/
 * prerender.ts hands the page this data instead: as a window global while
 * headless Chrome renders it, and as a JSON <script> in the saved HTML so
 * the first client render matches the static markup without a spinner.
 */
export type PrerenderData = {
	article?: Article;
	articles?: { language: Language; items: Article[] };
};

export const PRERENDER_DATA_GLOBAL = "__TB_PRERENDER_DATA__";
export const PRERENDER_DATA_SCRIPT_ID = "tb-prerender-data";

/** JSON for an inline <script>; `<` is escaped so content can't close it. */
export function serializePrerenderData(data: PrerenderData): string {
	return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function readPrerenderData(): PrerenderData | null {
	if (typeof window === "undefined") return null;
	const fromGlobal = (window as unknown as Record<string, unknown>)[
		PRERENDER_DATA_GLOBAL
	];
	if (fromGlobal) return fromGlobal as PrerenderData;

	const script = document.getElementById(PRERENDER_DATA_SCRIPT_ID);
	if (!script?.textContent) return null;
	try {
		return JSON.parse(script.textContent) as PrerenderData;
	} catch {
		return null;
	}
}

/** The seeded article, only if it is the one this URL asks for. */
export function getSeededArticle(
	slug: string | undefined,
	language: Language,
): Article | undefined {
	const article = readPrerenderData()?.article;
	return article && article.slug === slug && article.language === language
		? article
		: undefined;
}

/** The seeded /insights list, only for the matching language. */
export function getSeededArticles(language: Language): Article[] | undefined {
	const articles = readPrerenderData()?.articles;
	return articles?.language === language ? articles.items : undefined;
}
