import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Select, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { CheckCircle, ImageUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { AdminBreadcrumb } from "../../components/AdminBreadcrumb";
import { ArticleEditor } from "../../components/ArticleEditor";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useToast } from "../../components/ToastProvider";
import { useCreateArticle } from "../../hooks/useCreateArticle";
import { useDeleteArticleImage } from "../../hooks/useDeleteArticleImage";
import { useGetArticle } from "../../hooks/useGetArticle";
import { useUpdateArticle } from "../../hooks/useUpdateArticle";
import { useUploadArticleImage } from "../../hooks/useUploadArticleImage";
import { toErrorMessage } from "../../lib/errors";
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
		data: fetchedArticle,
		isLoading: loadingArticle,
		error: articleError,
	} = useGetArticle(articleId);
	const { createArticle, isPending: creating } = useCreateArticle();
	const { updateArticle, isPending: updating } = useUpdateArticle();
	const { uploadImage, isPending: uploading } = useUploadArticleImage();
	const { deleteImage } = useDeleteArticleImage();

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

	useEffect(() => {
		if (!fetchedArticle) return;
		setArticle(fetchedArticle);
		setSlugManuallyEdited(true);
		reset({
			title: fetchedArticle.title,
			slug: fetchedArticle.slug,
			content: fetchedArticle.content,
			status: fetchedArticle.status,
		});
	}, [fetchedArticle, reset]);

	const titleValue = watch("title");
	useEffect(() => {
		if (slugManuallyEdited) return;
		setValue("slug", slugify(titleValue || ""));
	}, [titleValue, slugManuallyEdited, setValue]);

	const onSubmit = async (values: ArticleValues) => {
		setErrorMessage(null);

		try {
			const previousCoverUrl = article?.cover_image_url || null;
			let coverImageUrl = previousCoverUrl;

			if (coverImageFile) {
				coverImageUrl = await uploadImage(coverImageFile);
			}

			if (isEditing && articleId) {
				await updateArticle(articleId, values, {
					cover_image_url: coverImageUrl,
				});

				if (
					coverImageFile &&
					previousCoverUrl &&
					previousCoverUrl !== coverImageUrl
				) {
					try {
						await deleteImage(previousCoverUrl);
					} catch {
						setErrorMessage(
							"Article updated, but failed to delete the previous cover image.",
						);
						return;
					}
				}

				showToast("Article updated successfully", { tone: "success" });
			} else {
				await createArticle(values, { cover_image_url: coverImageUrl });

				showToast("Article created successfully", { tone: "success" });
			}

			navigate("/admin/articles");
		} catch (err) {
			setErrorMessage(toErrorMessage(err, "Something went wrong."));
		}
	};

	const displayedError = errorMessage || articleError;

	if (isEditing && (loadingArticle || (fetchedArticle && !article))) {
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
			<AdminBreadcrumb
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
						shape="round"
						htmlType="submit"
						loading={isSubmitting || creating || updating || uploading}
						className="w-full md:w-auto"
						icon={<CheckCircle />}
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
