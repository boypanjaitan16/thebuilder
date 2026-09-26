import type { TableProps } from "antd";
import { Alert, Button, Segmented, Space, Switch, Table } from "antd";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "../../components/Breadcrumb";
import { useToast } from "../../components/ToastProvider";
import { useDeleteArticle } from "../../hooks/useDeleteArticle";
import { useDeleteArticleImage } from "../../hooks/useDeleteArticleImage";
import { useGetArticles } from "../../hooks/useGetArticles";
import { useUpdateArticle } from "../../hooks/useUpdateArticle";
import { formatDate } from "../../lib/date";
import type { Article, ArticleStatus } from "../../types/Article";

type StatusFilter = "ALL" | ArticleStatus;

function ArticlesPage() {
	const navigate = useNavigate();
	const { showToast } = useToast();
	const [articles, setArticles] = useState<Article[]>([]);
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
	const [togglingId, setTogglingId] = useState<string | null>(null);

	const { fetchArticles: fetchArticlesApi, loading, error } = useGetArticles();
	const {
		deleteArticle,
		error: deleteError,
		setError: setDeleteError,
	} = useDeleteArticle();
	const {
		deleteImage,
		error: deleteImageError,
		setError: setDeleteImageError,
	} = useDeleteArticleImage();
	const {
		updateArticle,
		error: updateError,
		setError: setUpdateError,
	} = useUpdateArticle();

	const combinedError = useMemo(
		() => error || deleteError || deleteImageError || updateError,
		[deleteError, deleteImageError, error, updateError],
	);

	useEffect(() => {
		void fetchArticles();
	}, []);

	const fetchArticles = async () => {
		const data = await fetchArticlesApi();
		setArticles(data);
	};

	const filteredArticles = useMemo(
		() =>
			statusFilter === "ALL"
				? articles
				: articles.filter((article) => article.status === statusFilter),
		[articles, statusFilter],
	);

	const handleDeleteArticle = async (article: Article) => {
		setDeleteError(null);
		setDeleteImageError(null);
		const result = await deleteArticle(article.id);
		if (!result.success) return;
		let imageDeleted = true;
		if (article.cover_image_url) {
			const deleteResult = await deleteImage(article.cover_image_url);
			imageDeleted = deleteResult.success;
		}
		if (imageDeleted) {
			showToast("Article deleted", { tone: "success" });
		} else {
			showToast("Article deleted, cover image removal failed", {
				tone: "info",
			});
		}
		await fetchArticles();
	};

	const handleTogglePublished = async (article: Article, checked: boolean) => {
		setUpdateError(null);
		setTogglingId(article.id);
		const nextStatus: ArticleStatus = checked ? "PUBLISHED" : "DRAFT";
		const result = await updateArticle(
			article.id,
			{
				title: article.title,
				slug: article.slug,
				content: article.content,
				status: nextStatus,
			},
			{ cover_image_url: article.cover_image_url },
		);
		setTogglingId(null);
		if (!result.success) return;
		showToast(checked ? "Article published" : "Article unpublished", {
			tone: "success",
		});
		await fetchArticles();
	};

	const columns: TableProps<Article>["columns"] = [
		{
			title: "Cover",
			dataIndex: "cover_image_url",
			key: "cover",
			width: 120,
			render: (url: string | null, record) =>
				url ? (
					<img
						src={url}
						alt={`${record.title} cover`}
						className="h-14 rounded-lg object-cover ring-1 ring-sand"
						loading="lazy"
						decoding="async"
					/>
				) : (
					<span className="text-xs text-slate-500">No image</span>
				),
		},
		{
			title: "Title",
			dataIndex: "title",
			key: "title",
			render: (title: string, record) => (
				<button
					type="button"
					onClick={() => navigate(`/admin/articles/${record.id}/preview`)}
					className="text-left font-semibold text-blue-600 hover:underline"
				>
					{title}
				</button>
			),
		},
		{
			title: "Published",
			dataIndex: "status",
			key: "status",
			render: (status: ArticleStatus, record) => (
				<Switch
					checked={status === "PUBLISHED"}
					loading={togglingId === record.id}
					onChange={(checked) => void handleTogglePublished(record, checked)}
				/>
			),
		},
		{
			title: "Created",
			dataIndex: "created_at",
			key: "created_at",
			width: 150,
			render: (createdAt: string) => formatDate(createdAt),
		},
		{
			title: "Actions",
			key: "actions",
			width: 150,
			render: (_, record) => (
				<Space>
					<Button
						icon={<Pencil size={14} />}
						onClick={() => navigate(`/admin/articles/${record.id}/edit`)}
					>
						Edit
					</Button>
					<Button
						danger
						icon={<Trash2 size={14} />}
						onClick={() => void handleDeleteArticle(record)}
					>
						Delete
					</Button>
				</Space>
			),
		},
	];

	return (
		<section className="container-page w-full">
			<Breadcrumb items={[{ label: "Articles" }]} />
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-2xl font-semibold text-ink">Articles</h2>
					<p className="text-sm text-slate-600">
						Write, publish, and manage articles.
					</p>
				</div>
				<div className="flex-grow md:flex-none">
					<Button
						type="primary"
						icon={<Plus size={16} />}
						onClick={() => navigate("/admin/articles/new")}
						className="w-full md:w-auto"
					>
						New Article
					</Button>
				</div>
			</div>
			{combinedError && <Alert type="error" showIcon title={combinedError} />}
			<Segmented
				className="mt-4"
				value={statusFilter}
				onChange={(value) => setStatusFilter(value as StatusFilter)}
				options={[
					{ label: "All", value: "ALL" },
					{ label: "Draft", value: "DRAFT" },
					{ label: "Published", value: "PUBLISHED" },
				]}
			/>
			<Table<Article>
				bordered
				columns={columns}
				dataSource={filteredArticles}
				rowKey="id"
				loading={loading}
				pagination={false}
				locale={{ emptyText: "No articles yet." }}
				className="mt-5"
			/>
		</section>
	);
}

export default ArticlesPage;
