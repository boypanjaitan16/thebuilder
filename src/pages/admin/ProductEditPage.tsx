import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { TextInput } from "../../components/forms/TextInput";
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
		register,
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

	return (
		<div className="container-page w-full">
			<section className="rounded-[24px] border border-sand bg-white p-8 shadow-soft">
				<div className="flex flex-row flex-wrap items-center justify-between gap-3">
					<div>
						<h1 className="mt-2 font-display text-3xl font-semibold text-ink">
							Edit product
						</h1>
						<p className="text-sm text-slate-600">
							Update product details or replace the thumbnail.
						</p>
					</div>
					<button
						type="button"
						onClick={() => navigate("/admin/products")}
						className="rounded-full flex-grow md:flex-none border border-ink px-4 py-2 text-sm font-semibold text-ink hover:bg-white"
					>
						Back to Products
					</button>
				</div>

				{displayedError && (
					<p className="mt-2 text-sm text-amber-700">{displayedError}</p>
				)}

				<form
					onSubmit={handleSubmit(onUpdateProduct)}
					className="mt-4 grid gap-4 md:grid-cols-2"
				>
					<TextInput
						label="Name"
						errorMessage={errors.name?.message}
						inputProps={{
							type: "text",
							...register("name"),
						}}
					/>
					<TextInput
						label="Price (IDR)"
						errorMessage={errors.price?.message}
						inputProps={{
							type: "number",
							step: "0.01",
							min: 0,
							...register("price", { valueAsNumber: true }),
						}}
					/>
					<label className="flex flex-col gap-1 text-sm font-medium text-ink">
						Thumbnail image
						<input
							type="file"
							accept="image/*"
							onChange={(event) => {
								const file = event.target.files?.[0];
								if (file) setThumbnailFile(file);
							}}
							className="rounded-xl border border-sand bg-white px-2 py-1.5 text-sm text-ink file:mr-3 file:rounded-lg file:border-none file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
						/>
						<span className="text-xs font-normal text-slate-600">
							Current thumbnail will stay unless you upload a new file.
						</span>
						{product?.thumbnail_url && (
							<div className="flex items-center gap-3 pt-1 text-xs text-slate-600">
								<img
									src={product.thumbnail_url}
									alt={`${product.name} thumbnail`}
									className="h-16 w-16 rounded-lg object-cover ring-1 ring-sand"
								/>
								<span>Existing thumbnail</span>
							</div>
						)}
					</label>
					<TextInput
						label="Marketplace Url"
						errorMessage={errors.marketplace_url?.message}
						inputProps={{
							type: "url",
							placeholder: "https://shopee.co.id/xxxxx",
							...register("marketplace_url"),
						}}
					/>
					<label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-ink">
						Description
						<textarea
							rows={3}
							className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
							{...register("description")}
						/>
					</label>
					<div className="md:col-span-2">
						<button
							type="submit"
							disabled={isSubmitting || uploading}
							className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70 w-full md:w-auto"
						>
							{isSubmitting || uploading ? "Saving…" : "Update product"}
						</button>
					</div>
				</form>
			</section>
		</div>
	);
}

export default ProductEditPage;
