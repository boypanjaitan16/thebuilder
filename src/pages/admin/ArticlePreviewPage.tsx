import { Button, Tag } from "antd";
import { PencilLine } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminBreadcrumb } from "../../components/AdminBreadcrumb";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useGetArticle } from "../../hooks/useGetArticle";
import { formatDate } from "../../lib/date";

function ArticlePreviewPage() {
	const navigate = useNavigate();
	const { articleId } = useParams<{ articleId: string }>();
	const { data: article, isLoading: loading, error } = useGetArticle(articleId);

	if (loading) {
		return (
			<div className="container-page w-full flex flex-col flex-grow items-center justify-center">
				<LoadingIndicator label="Loading article..." />
			</div>
		);
	}

	if (error || !article) {
		return (
			<section className="container-page w-full">
				<AdminBreadcrumb
					items={[
						{ label: "Articles", to: "/admin/articles" },
						{ label: "Preview" },
					]}
				/>
				<p className="text-sm text-amber-700">
					{error || "Article not found."}
				</p>
			</section>
		);
	}

	return (
		<section className="container-page w-full">
			<AdminBreadcrumb
				items={[
					{ label: "Articles", to: "/admin/articles" },
					{ label: "Preview" },
				]}
				action={
					<Button
						type="primary"
						onClick={() => navigate(`/admin/articles/${article.id}/edit`)}
						icon={<PencilLine size={16} />}
					>
						Edit article
					</Button>
				}
			/>
			<div className="flex flex-col gap-2">
				<h1 className="font-display text-2xl lg:text-3xl font-semibold text-ink">
					{article.title}
				</h1>
				<span className="text-neutral-500">
					Last updated {formatDate(article.updated_at)}
				</span>
			</div>

			{article.cover_image_url && (
				<img
					src={article.cover_image_url}
					alt={article.title}
					className="mt-6 w-full rounded-xl object-cover"
				/>
			)}

			<article className="mt-6 rounded-2xl border border-sand bg-white p-8 shadow-soft">
				<div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
					<Tag color={article.status === "PUBLISHED" ? "green" : "default"}>
						{article.status}
					</Tag>
					<span>Slug: {article.slug}</span>
				</div>

				<div
					className="prose prose-slate mt-4 max-w-none prose-p:my-2 prose-li:my-1 prose-ul:my-3 prose-ol:my-3 prose-headings:mt-4 prose-headings:mb-2"
					// Content is authored exclusively by signed-in admins via
					// ArticleEditor (Tiptap) — same trust boundary as the editor
					// itself. Revisit sanitization if this content is ever
					// rendered on a public, non-admin-authenticated page.
					// biome-ignore lint/security/noDangerouslySetInnerHtml: trusted admin-authored HTML, see comment above
					dangerouslySetInnerHTML={{ __html: article.content }}
				/>
			</article>
		</section>
	);
}

export default ArticlePreviewPage;
