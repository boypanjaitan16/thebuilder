import LoadingIndicator from "@thebuilder/shared/components/LoadingIndicator";
import { useI18n } from "@thebuilder/shared/i18n/I18nProvider";
import type { Language } from "@thebuilder/shared/i18n/translations";
import { formatDate } from "@thebuilder/shared/lib/date";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "../../components/LocalizedLink";
import { PageBreadcrumb } from "../../components/PageBreadcrumb";
import { ShareButtons } from "../../components/ShareButtons";
import { PRODUCTION_ORIGIN } from "../../config/seoRoutes";
import { useGetArticleBySlug } from "../../hooks/useGetArticleBySlug";
import { setJsonLd, setMetaContent } from "../../lib/documentMeta";
import { localizePath } from "../../lib/locale";
import { stripHtmlAndTruncate } from "../../lib/textExcerpt";

const DEFAULT_OG_IMAGE = `${PRODUCTION_ORIGIN}/thebuilder.png?v=blueprint`;

function articleUrl(slug: string, language: Language) {
	return `${PRODUCTION_ORIGIN}${localizePath(`/insights/${slug}`, language)}`;
}

function ArticleDetailPage() {
	const { copy, language } = useI18n();
	const { slug } = useParams<{ slug: string }>();
	const {
		data: article,
		isLoading: loading,
		error,
	} = useGetArticleBySlug(slug);

	// Canonical, og:url, hreflang and <html lang> come from SeoHead (the
	// article's language always matches the URL's, see useGetArticleBySlug).
	useEffect(() => {
		if (!article) return;

		const previousTitle = document.title;
		const excerpt = stripHtmlAndTruncate(article.content, 155);
		const pageTitle = `The Builder — ${article.title}`;
		const ogImage = article.cover_image_url || DEFAULT_OG_IMAGE;
		const url = articleUrl(article.slug, article.language);

		document.title = pageTitle;
		const cleanups = [
			setMetaContent("name", "description", excerpt),
			setMetaContent("property", "og:title", pageTitle),
			setMetaContent("property", "og:description", excerpt),
			setMetaContent("property", "og:image", ogImage),
			setMetaContent("property", "og:type", "article"),
			setMetaContent("name", "twitter:title", pageTitle),
			setMetaContent("name", "twitter:description", excerpt),
			setMetaContent("name", "twitter:image", ogImage),
			setJsonLd("article-jsonld", {
				"@context": "https://schema.org",
				"@type": "BlogPosting",
				headline: article.title,
				description: excerpt,
				image: ogImage,
				datePublished: article.created_at,
				dateModified: article.updated_at,
				inLanguage: article.language,
				url,
				mainEntityOfPage: url,
				author: { "@type": "Organization", name: "The Builder" },
				publisher: {
					"@type": "Organization",
					name: "The Builder",
					logo: {
						"@type": "ImageObject",
						url: `${PRODUCTION_ORIGIN}/thebuilder.png`,
					},
				},
			}),
		];

		return () => {
			document.title = previousTitle;
			for (const cleanup of cleanups) cleanup();
		};
	}, [article]);

	// With data in hand (seeded at build time or fetched), a failed
	// background refetch doesn't replace the article.
	if (loading) {
		return (
			<div className="blueprint-page blueprint-page--article container-page w-full flex flex-col flex-grow items-center justify-center py-20">
				<LoadingIndicator label={copy.brand.articleLoading} />
			</div>
		);
	}

	if (!article) {
		return (
			<div className="blueprint-page blueprint-page--article-error container-page">
				<section>
					<p className="blueprint-kicker">{copy.breadcrumb.insights} / 404</p>
					<h1>{copy.notFound.title}</h1>
					<p>{error ? copy.insightsPage.publishedError : copy.notFound.body}</p>
					<Link to="/insights" className="blueprint-article-back">
						← {copy.breadcrumb.insights}
					</Link>
				</section>
			</div>
		);
	}

	return (
		<div className="blueprint-page blueprint-page--article">
			<header className="blueprint-article-heading">
				<div className="blueprint-wrap">
					<PageBreadcrumb
						items={[
							{ label: copy.breadcrumb.insights, to: "/insights" },
							{ label: article.title },
						]}
					/>
					<p>{formatDate(article.created_at)}</p>
					<h1>{article.title}</h1>
				</div>
			</header>
			<div className="blueprint-article-content">
				<div className="blueprint-wrap grid gap-6 md:grid-cols-[56px_1fr]">
					<ShareButtons
						title={article.title}
						url={articleUrl(article.slug, language)}
					/>
					<article className="flex min-w-0 flex-col gap-6">
						{article.cover_image_url && (
							<img
								src={article.cover_image_url}
								alt={article.title}
								className="w-full rounded-2xl object-cover"
							/>
						)}

						<section className="lg:border lg:border-sand lg:bg-white lg:p-8 lg:shadow-soft lg:rounded-2xl">
							<div
								className="prose prose-slate max-w-none prose-p:my-2 prose-li:my-1 prose-ul:my-3 prose-ol:my-3 prose-headings:mt-4 prose-headings:mb-2"
								// Content is authored exclusively by signed-in admins via the
								// Tiptap editor (src/components/ArticleEditor.tsx) — trusted,
								// not user-submitted, so rendering as raw HTML here is safe.
								// biome-ignore lint/security/noDangerouslySetInnerHtml: trusted admin-authored HTML, see comment above
								dangerouslySetInnerHTML={{ __html: article.content }}
							/>
						</section>
					</article>
				</div>
			</div>
		</div>
	);
}

export default ArticleDetailPage;
