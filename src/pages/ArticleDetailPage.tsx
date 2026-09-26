import { Link, useParams } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";
import { PageBreadcrumb } from "../components/PageBreadcrumb";
import { ShareButtons } from "../components/ShareButtons";
import { useGetArticleBySlug } from "../hooks/useGetArticleBySlug";
import { useI18n } from "../i18n/I18nProvider";
import { formatDate } from "../lib/date";

function ArticleDetailPage() {
	const { copy } = useI18n();
	const { slug } = useParams<{ slug: string }>();
	const {
		data: article,
		isLoading: loading,
		error,
	} = useGetArticleBySlug(slug);

	if (loading) {
		return (
			<div className="container-page w-full flex flex-col flex-grow items-center justify-center py-20">
				<LoadingIndicator label="Loading article..." />
			</div>
		);
	}

	if (error || !article) {
		return (
			<div className="container-page flex flex-col gap-6">
				<PageBreadcrumb
					items={[{ label: copy.breadcrumb.insights, to: "/insights" }]}
				/>
				<p className="text-sm text-rose-600">{error || "Article not found."}</p>
				<Link
					to="/insights"
					className="text-sm font-semibold text-ink underline"
				>
					← Back to Insights
				</Link>
			</div>
		);
	}

	return (
		<div className="container-page">
			<PageBreadcrumb
				items={[
					{ label: copy.breadcrumb.insights, to: "/insights" },
					{ label: article.title },
				]}
			/>
			<div className="grid gap-6 md:grid-cols-[56px_1fr] md:">
				<ShareButtons title={article.title} url={window.location.href} />
				<article className="flex flex-col gap-6">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
							{formatDate(article.created_at)}
						</p>
						<h1 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
							{article.title}
						</h1>
					</div>
					{article.cover_image_url && (
						<img
							src={article.cover_image_url}
							alt={article.title}
							className="h-64 w-full rounded-2xl object-cover md:h-96"
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
	);
}

export default ArticleDetailPage;
