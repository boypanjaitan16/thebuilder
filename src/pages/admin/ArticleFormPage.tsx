import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Select, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { ImageUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ArticleEditor } from "../../components/ArticleEditor";
import { Breadcrumb } from "../../components/Breadcrumb";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useToast } from "../../components/ToastProvider";
import { useCreateArticle } from "../../hooks/useCreateArticle";
import { useDeleteArticleImage } from "../../hooks/useDeleteArticleImage";
import { useGetArticle } from "../../hooks/useGetArticle";
import { useUpdateArticle } from "../../hooks/useUpdateArticle";
import { useUploadArticleImage } from "../../hooks/useUploadArticleImage";
import {
	type ArticleFormValues,
	type ArticleValues,
	articleSchema,
	articleStatusValues,
} from "../../schemas/articleSchema";
import type { Article } from "../../types/Article";

function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function ArticleFormPage() {
	const navigate = useNavigate();
	const { showToast } = useToast();
	const { articleId } = useParams<{ articleId: string }>();
	const isEditing = Boolean(articleId);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
	const [article, setArticle] = useState<Article | null>(null);
	const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

	const {
		fetchArticle,
		loading: loadingArticle,
		error: articleError,
		setError: setArticleError,
	} = useGetArticle();
	const {
		createArticle,
		loading: creating,
		error: createError,
		setError: setCreateError,
	} = useCreateArticle();
	const {
		updateArticle,
		loading: updating,
		error: updateError,
		setError: setUpdateError,
	} = useUpdateArticle();
	const {
		uploadImage,
		loading: uploading,
		error: uploadError,
		setError: setUploadError,
	} = useUploadArticleImage();
	const {
		deleteImage,
		error: deleteImageError,
		setError: setDeleteImageError,
	} = useDeleteArticleImage();

	const {
		control,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<ArticleFormValues, undefined, ArticleValues>({
		resolver: zodResolver(articleSchema),
		defaultValues: {
			title: "",
			slug: "",
			content: "",
			status: "DRAFT",
		},
	});

	const loadArticle = useCallback(
		async (id: string) => {
			setErrorMessage(null);
			setArticleError(null);
			const data = await fetchArticle(id);
			if (!data) return;
			setArticle(data);
			setSlugManuallyEdited(true);
			reset({
				title: data.title,
				slug: data.slug,
				content: data.content,
				status: data.status,
			});
		},
		[fetchArticle, reset, setArticleError],
	);

	useEffect(() => {
		if (articleId) void loadArticle(articleId);
	}, [articleId, loadArticle]);

	const titleValue = watch("title");
	useEffect(() => {
		if (slugManuallyEdited) return;
		setValue("slug", slugify(titleValue || ""));
	}, [titleValue, slugManuallyEdited, setValue]);

	const onSubmit = async (values: ArticleValues) => {
		setErrorMessage(null);
		setCreateError(null);
		setUpdateError(null);
		setUploadError(null);
		setDeleteImageError(null);

		const previousCoverUrl = article?.cover_image_url || null;
		let coverImageUrl = previousCoverUrl;

		if (coverImageFile) {
			const uploadResult = await uploadImage(coverImageFile);
			if (!uploadResult.success) return;
			coverImageUrl = uploadResult.url || coverImageUrl;
		}

		if (isEditing && articleId) {
			const result = await updateArticle(articleId, values, {
				cover_image_url: coverImageUrl,
			});
			if (!result.success) return;

			if (
				coverImageFile &&
				previousCoverUrl &&
				previousCoverUrl !== coverImageUrl
			) {
				const deleteResult = await deleteImage(previousCoverUrl);
				if (!deleteResult.success) {
					setErrorMessage(
						"Article updated, but failed to delete the previous cover image.",
					);
					return;
				}
			}

			showToast("Article updated successfully", { tone: "success" });
		} else {
			const result = await createArticle(values, {
				cover_image_url: coverImageUrl,
			});
			if (!result.success) return;

			showToast("Article created successfully", { tone: "success" });
		}

		navigate("/admin/articles");
	};

	const displayedError =
		errorMessage ||
		articleError ||
		createError ||
		updateError ||
		uploadError ||
		deleteImageError;

	if (isEditing && loadingArticle) {
		return (
			<div className="container-page w-full flex flex-col flex-grow items-center justify-center">
				<LoadingIndicator label="Loading article..." />
			</div>
		);
	}

	const existingCoverFileList: UploadFile[] = article?.cover_image_url
		? [
				{
					uid: "-1",
					name: "current-cover",
					status: "done",
					url: article.cover_image_url,
				},
			]
		: [];

	return (
		<section className="container-page w-full">
			<Breadcrumb
				items={[
					{ label: "Articles", to: "/admin/articles" },
					{ label: isEditing ? "Edit" : "New" },
				]}
			/>
			<div className="flex flex-row flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="mt-2 font-display text-2xl font-semibold text-ink">
						{isEditing ? "Edit article" : "Create article"}
					</h1>
					<p className="text-sm text-slate-600">
						Write and publish articles with a rich-text editor.
					</p>
				</div>
			</div>

			{displayedError && (
				<p className="mt-3 text-sm text-amber-700">{displayedError}</p>
			)}

			<Form
				layout="vertical"
				size="large"
				onSubmitCapture={handleSubmit(onSubmit)}
				className="mt-5"
			>
				<Form.Item
					label="Title"
					validateStatus={errors.title ? "error" : ""}
					help={errors.title?.message}
					className="mb-0"
				>
					<Controller
						name="title"
						control={control}
						render={({ field }) => (
							<Input status={errors.title ? "error" : undefined} {...field} />
						)}
					/>
				</Form.Item>
				<Form.Item
					label="Slug"
					validateStatus={errors.slug ? "error" : ""}
					help={errors.slug?.message}
					className="mb-0"
				>
					<Controller
						name="slug"
						control={control}
						render={({ field }) => (
							<Input
								status={errors.slug ? "error" : undefined}
								{...field}
								onChange={(event) => {
									setSlugManuallyEdited(true);
									field.onChange(event);
								}}
							/>
						)}
					/>
				</Form.Item>
				<Form.Item label="Status" className="mb-0">
					<Controller
						name="status"
						control={control}
						render={({ field }) => (
							<Select
								{...field}
								options={articleStatusValues.map((value) => ({
									label: value,
									value,
								}))}
							/>
						)}
					/>
				</Form.Item>
				<Form.Item label="Cover image">
					<Upload.Dragger
						accept="image/*"
						maxCount={1}
						listType="picture"
						defaultFileList={existingCoverFileList}
						beforeUpload={(file) => {
							setCoverImageFile(file);
							return false;
						}}
					>
						<p className="ant-upload-drag-icon flex justify-center">
							<ImageUp size={32} className="text-slate-400" />
						</p>
						<p className="ant-upload-text">
							Click or drag cover image to this area
						</p>
					</Upload.Dragger>
				</Form.Item>
				<Form.Item
					label="Content"
					className="md:col-span-2"
					validateStatus={errors.content ? "error" : ""}
					help={errors.content?.message}
				>
					<Controller
						name="content"
						control={control}
						render={({ field }) => (
							<ArticleEditor content={field.value} onChange={field.onChange} />
						)}
					/>
				</Form.Item>
				<div className="md:col-span-2">
					<Button
						type="primary"
						htmlType="submit"
						loading={isSubmitting || creating || updating || uploading}
						className="w-full md:w-auto"
					>
						{isSubmitting || creating || updating || uploading
							? "Saving…"
							: isEditing
								? "Update article"
								: "Create article"}
					</Button>
				</div>
			</Form>
		</section>
	);
}

export default ArticleFormPage;
