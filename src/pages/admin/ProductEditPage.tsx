import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { ArrowLeft, ImageUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useToast } from "../../components/ToastProvider";
import { useDeleteProductThumbnail } from "../../hooks/useDeleteProductThumbnail";
import { useGetProduct } from "../../hooks/useGetProduct";
import { useUpdateProduct } from "../../hooks/useUpdateProduct";
import { useUploadProductThumbnail } from "../../hooks/useUploadProductThumbnail";
import {
	type ProductUpdateFormValues,
	type ProductUpdateValues,
	productUpdateSchema,
} from "../../schemas/productUpdateSchema";
import type { Product } from "../../types/Product";

function ProductEditPage() {
	const navigate = useNavigate();
	const { showToast } = useToast();
	const { productId } = useParams<{ productId: string }>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [product, setProduct] = useState<Product | null>(null);
	const {
		fetchProduct: fetchProductApi,
		loading: loadingProductApi,
		error: productError,
		setError: setProductError,
	} = useGetProduct();
	const {
		updateProduct,
		loading: updating,
		error: updateError,
		setError: setUpdateError,
	} = useUpdateProduct();
	const {
		uploadThumbnail,
		loading: uploading,
		error: uploadError,
		setError: setUploadError,
	} = useUploadProductThumbnail();
	const {
		deleteThumbnail,
		loading: deletingThumbnail,
		error: deleteThumbnailError,
		setError: setDeleteThumbnailError,
	} = useDeleteProductThumbnail();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<ProductUpdateFormValues, undefined, ProductUpdateValues>({
		resolver: zodResolver(productUpdateSchema),
		defaultValues: {
			name: "",
			description: "",
			price: 0,
			marketplace_url: "",
		},
	});

	const fetchProduct = useCallback(
		async (id: string) => {
			setErrorMessage(null);
			setProductError(null);
			const productData = await fetchProductApi(id);
			if (!productData) {
				return;
			}
			setProduct(productData);
			reset({
				name: productData.name || "",
				description: productData.description || "",
				price: productData.price || 0,
				marketplace_url: productData.marketplace_url || "",
			});
		},
		[fetchProductApi, reset, setProductError],
	);

	useEffect(() => {
		if (!productId) {
			setErrorMessage("Invalid product id.");
			return;
		}
		void fetchProduct(productId);
	}, [fetchProduct, productId]);

	const onUpdateProduct = async (values: ProductUpdateValues) => {
		setErrorMessage(null);
		setUpdateError(null);
		setUploadError(null);
		setDeleteThumbnailError(null);
		if (!productId) {
			setErrorMessage("Invalid product id.");
			return;
		}

		const previousThumbnailUrl = product?.thumbnail_url || null;
		let thumbnailUrl = previousThumbnailUrl;

		if (thumbnailFile) {
			const uploadResult = await uploadThumbnail(thumbnailFile);
			if (!uploadResult.success) return;
			thumbnailUrl = uploadResult.url || thumbnailUrl;
		}

		const result = await updateProduct(productId, values, {
			thumbnail_url: thumbnailUrl,
		});

		if (!result.success) {
			return;
		}

		if (
			thumbnailFile &&
			previousThumbnailUrl &&
			previousThumbnailUrl !== thumbnailUrl
		) {
			const deleteResult = await deleteThumbnail(previousThumbnailUrl);
			if (!deleteResult.success) {
				setErrorMessage(
					"Product updated, but failed to delete the previous thumbnail.",
				);
				return;
			}
		}

		showToast("Product updated successfully", { tone: "success" });
		navigate("/admin/products");
	};

	const displayedError =
		errorMessage ||
		productError ||
		updateError ||
		uploadError ||
		deleteThumbnailError;

	if (loadingProductApi || updating || uploading || deletingThumbnail) {
		return (
			<div className="container-page w-full flex flex-col flex-grow items-center justify-center">
				<LoadingIndicator label="Loading product..." />
			</div>
		);
	}

	const existingThumbnailFileList: UploadFile[] = product?.thumbnail_url
		? [
				{
					uid: "-1",
					name: "current-thumbnail",
					status: "done",
					url: product.thumbnail_url,
				},
			]
		: [];

	return (
		<div className="container-page w-full">
			<section className="rounded-[24px] border border-sand bg-white p-8 shadow-soft">
				<div className="flex flex-row flex-wrap items-center justify-between gap-3">
					<div>
						<h1 className="mt-2 font-display text-2xl font-semibold text-ink">
							Edit product
						</h1>
						<p className="text-sm text-slate-600">
							Update product details or replace the thumbnail.
						</p>
					</div>
					<Button
						icon={<ArrowLeft size={16} />}
						onClick={() => navigate("/admin/products")}
						className="flex-grow md:flex-none"
					>
						Back to Products
					</Button>
				</div>

				{displayedError && (
					<p className="mt-2 text-sm text-amber-700">{displayedError}</p>
				)}

				<Form
					layout="vertical"
					onSubmitCapture={handleSubmit(onUpdateProduct)}
					className="mt-4 grid gap-4 md:grid-cols-2"
				>
					<Form.Item
						label="Name"
						validateStatus={errors.name ? "error" : ""}
						help={errors.name?.message}
					>
						<Controller
							name="name"
							control={control}
							render={({ field }) => (
								<Input
									type="text"
									status={errors.name ? "error" : undefined}
									{...field}
								/>
							)}
						/>
					</Form.Item>
					<Form.Item
						label="Price (IDR)"
						validateStatus={errors.price ? "error" : ""}
						help={errors.price?.message}
					>
						<Controller
							name="price"
							control={control}
							render={({ field }) => (
								<Input
									type="number"
									step="0.01"
									min={0}
									status={errors.price ? "error" : undefined}
									{...field}
									value={field.value as number}
								/>
							)}
						/>
					</Form.Item>
					<Form.Item
						label="Thumbnail image"
						help="Current thumbnail will stay unless you upload a new file."
					>
						<Upload
							accept="image/*"
							maxCount={1}
							listType="picture"
							defaultFileList={existingThumbnailFileList}
							beforeUpload={(file) => {
								setThumbnailFile(file);
								return false;
							}}
						>
							<Button icon={<ImageUp size={16} />}>Select image</Button>
						</Upload>
					</Form.Item>
					<Form.Item
						label="Marketplace Url"
						validateStatus={errors.marketplace_url ? "error" : ""}
						help={errors.marketplace_url?.message}
					>
						<Controller
							name="marketplace_url"
							control={control}
							render={({ field }) => (
								<Input
									type="url"
									placeholder="https://shopee.co.id/xxxxx"
									status={errors.marketplace_url ? "error" : undefined}
									{...field}
								/>
							)}
						/>
					</Form.Item>
					<Form.Item label="Description" className="md:col-span-2">
						<Controller
							name="description"
							control={control}
							render={({ field }) => <Input.TextArea rows={3} {...field} />}
						/>
					</Form.Item>
					<div className="md:col-span-2">
						<Button
							type="primary"
							htmlType="submit"
							loading={isSubmitting || uploading}
							className="w-full md:w-auto"
						>
							{isSubmitting || uploading ? "Saving…" : "Update product"}
						</Button>
					</div>
				</Form>
			</section>
		</div>
	);
}

export default ProductEditPage;
