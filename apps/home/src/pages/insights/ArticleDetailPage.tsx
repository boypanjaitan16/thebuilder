import LoadingIndicator from "@thebuilder/shared/components/LoadingIndicator";
import { useI18n } from "@thebuilder/shared/i18n/I18nProvider";
import { formatDate } from "@thebuilder/shared/lib/date";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "../../components/LocalizedLink";
import { PageBreadcrumb } from "../../components/PageBreadcrumb";
import { ShareButtons } from "../../components/ShareButtons";
import { PRODUCTION_ORIGIN } from "../../config/seoRoutes";
import { useGetArticleBySlug } from "../../hooks/useGetArticleBySlug";
import { setMetaContent } from "../../lib/documentMeta";
import { stripHtmlAndTruncate } from "../../lib/textExcerpt";

const DEFAULT_OG_IMAGE = `${PRODUCTION_ORIGIN}/thebuilder.png?v=blueprint`;

function ArticleDetailPage() {
	const { copy } = useI18n();
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
		];

		return () => {
			document.title = previousTitle;
			for (const cleanup of cleanups) cleanup();
		};
	}, [article]);

	if (loading) {
		return (
			<div className="blueprint-page blueprint-page--article container-page w-full flex flex-col flex-grow items-center justify-center py-20">
				<LoadingIndicator label={copy.brand.articleLoading} />
			</div>
		);
	}

	if (error || !article) {
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
					<ShareButtons title={article.title} url={window.location.href} />
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
