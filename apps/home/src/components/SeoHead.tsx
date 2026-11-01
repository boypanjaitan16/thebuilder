import { useI18n } from "@thebuilder/shared/i18n/I18nProvider";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { OG_LOCALES, PRODUCTION_ORIGIN, seoRoutes } from "../config/seoRoutes";
import {
	removeHeadElement,
	setAlternateLinks,
	setCanonicalLink,
	setHtmlLang,
	setMetaContent,
} from "../lib/documentMeta";
import { isArticleDetailPath, localizePath, stripLocale } from "../lib/locale";

/**
 * Per-URL head tags: <html lang>, canonical, hreflang alternates, Open
 * Graph locale/url, and the page's localized title + description. Runs
 * before prerender captures the DOM, so each language's static HTML ships
 * its own tags. Article pages only get the URL-level tags here; their
 * title/description come from ArticleDetailPage once the article loads.
 */
export function SeoHead() {
	const { pathname } = useLocation();
	const { copy, language } = useI18n();

	useEffect(() => {
		const pagePath = stripLocale(pathname);
		const isArticle = isArticleDetailPath(pagePath);
		const pageKey = seoRoutes[pagePath];
		const url = `${PRODUCTION_ORIGIN}${localizePath(pagePath, language)}`;
		const otherLanguage = language === "id" ? "en" : "id";

		const cleanups = [
			setHtmlLang(language),
			pageKey || isArticle
				? setCanonicalLink(url)
				: removeHeadElement('link[rel="canonical"]'),
			setMetaContent("property", "og:url", url),
			setMetaContent("name", "twitter:url", url),
			setMetaContent("property", "og:locale", OG_LOCALES[language]),
			setMetaContent(
				"property",
				"og:locale:alternate",
				OG_LOCALES[otherLanguage],
			),
		];

		if (pageKey) {
			// Static pages exist in both languages; Indonesian is the default.
			cleanups.push(
				setAlternateLinks([
					{ hreflang: "id", href: `${PRODUCTION_ORIGIN}${pagePath}` },
					{
						hreflang: "en",
						href: `${PRODUCTION_ORIGIN}${localizePath(pagePath, "en")}`,
					},
					{ hreflang: "x-default", href: `${PRODUCTION_ORIGIN}${pagePath}` },
				]),
			);
		} else if (isArticle) {
			// Articles are single-language with no paired translation.
			cleanups.push(setAlternateLinks([{ hreflang: language, href: url }]));
		} else {
			cleanups.push(
				setAlternateLinks([]),
				setMetaContent("name", "robots", "noindex"),
			);
		}

		if (!isArticle) {
			const key = pageKey ?? "notFound";
			const { title, description } = copy.seo.pages[key];
			const fullTitle =
				key === "home" ? title : `${title} | ${copy.seo.siteName}`;
			const previousTitle = document.title;
			document.title = fullTitle;
			cleanups.push(
				() => {
					document.title = previousTitle;
				},
				setMetaContent("name", "title", fullTitle),
				setMetaContent("name", "description", description),
				setMetaContent("property", "og:title", fullTitle),
				setMetaContent("property", "og:description", description),
				setMetaContent("name", "twitter:title", fullTitle),
				setMetaContent("name", "twitter:description", description),
			);
		}

		return () => {
			for (const cleanup of cleanups.reverse()) cleanup();
		};
	}, [pathname, language, copy]);

	return null;
}
