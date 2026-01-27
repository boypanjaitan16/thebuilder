import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";
import { supabase } from "../../lib/supabaseClient";
import type { Product } from "../../types/Product";
import {
	type ProductUpdateFormValues,
	productUpdateSchema,
	type ProductUpdateValues,
} from "../../schemas/productUpdateSchema";

function ProductEditPage() {
	const navigate = useNavigate();
	const { productId } = useParams<{ productId: string }>();
	const [error, setError] = useState<string | null>(null);
	const [status, setStatus] = useState<string | null>(null);
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [loadingProduct, setLoadingProduct] = useState(true);
	const [product, setProduct] = useState<Product | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = useForm<ProductUpdateFormValues, undefined, ProductUpdateValues>({
		resolver: zodResolver(productUpdateSchema),
		defaultValues: {
			name: "",
			description: "",
			price: 0,
			marketplace_url: "",
		},
	});

	useEffect(() => {
		if (!productId) {
			setError("Invalid product id.");
			setLoadingProduct(false);
			return;
		}
		void fetchProduct(productId);
	}, [productId]);

	const fetchProduct = async (id: string) => {
		setLoadingProduct(true);
		setError(null);
		const { data, error: fetchError } = await supabase
			.from("products")
			.select("*")
			.eq("id", id)
			.single();

		if (fetchError || !data) {
			setError(fetchError?.message || "Product not found.");
			setLoadingProduct(false);
			return;
		}

		const productData = data as Product;
		setProduct(productData);
		reset({
			name: productData.name || "",
			description: productData.description || "",
			price: productData.price || 0,
			marketplace_url: productData.marketplace_url || "",
		});
		setLoadingProduct(false);
	};

	const onUpdateProduct = async (values: ProductUpdateValues) => {
		setError(null);
		setStatus(null);
		if (!productId) {
			setError("Invalid product id.");
			return;
		}

		let thumbnailUrl = product?.thumbnail_url || null;

		if (thumbnailFile) {
			const bucket =
				import.meta.env.VITE_SUPABASE_THUMBNAIL_BUCKET || "product-thumbnails";
			const fileExt = thumbnailFile.name.split(".").pop();
			const filePath = `products/${crypto.randomUUID ? crypto.randomUUID() : Date.now()}.${fileExt || "jpg"}`;

			setUploading(true);
			const { data: uploadData, error: uploadError } = await supabase.storage
				.from(bucket)
				.upload(filePath, thumbnailFile, {
					upsert: true,
					contentType: thumbnailFile.type,
				});

			if (uploadError || !uploadData?.path) {
				setError(uploadError?.message || "Failed to upload thumbnail.");
				setUploading(false);
				return;
			}

			const { data: publicUrlData } = supabase.storage
				.from(bucket)
				.getPublicUrl(uploadData.path);
			thumbnailUrl = publicUrlData?.publicUrl || thumbnailUrl;
			setUploading(false);
		}

		const { error: updateError } = await supabase
			.from("products")
			.update({
				name: values.name,
				description: values.description,
				price: values.price,
				marketplace_url: values.marketplace_url,
				thumbnail_url: thumbnailUrl,
			})
			.eq("id", productId);

		if (updateError) {
			setError(updateError.message);
			return;
		}

		setStatus("Product updated");
		navigate("/admin/products");
	};

	if (loadingProduct) {
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
						<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
							Admin
						</p>
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
						className="rounded-full border border-ink px-4 py-2 text-sm font-semibold text-ink hover:bg-white"
					>
						Back to products
					</button>
				</div>

				{error && <p className="mt-3 text-sm text-amber-700">{error}</p>}
				{status && <p className="mt-2 text-sm text-emerald-700">{status}</p>}

				<form
					onSubmit={handleSubmit(onUpdateProduct)}
					className="mt-4 grid gap-4 md:grid-cols-2"
				>
					<label className="flex flex-col gap-2 text-sm font-medium text-ink">
						Name
						<input
							type="text"
							required
							className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
							{...register("name")}
						/>
					</label>
					<label className="flex flex-col gap-2 text-sm font-medium text-ink">
						Price (IDR)
						<input
							type="number"
							step="0.01"
							min="0"
							required
							className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
							{...register("price", { valueAsNumber: true })}
						/>
					</label>
					<label className="flex flex-col gap-2 text-sm font-medium text-ink">
						Thumbnail image
						<input
							type="file"
							accept="image/*"
							onChange={(event) => {
								const file = event.target.files?.[0];
								if (file) setThumbnailFile(file);
							}}
							className="rounded-xl border border-sand bg-white px-2 py-2 text-sm text-ink file:mr-3 file:rounded-lg file:border-none file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
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
					<label className="flex flex-col gap-2 text-sm font-medium text-ink">
						Marketplace Url
						<input
							type="url"
							placeholder="https://shopee.co.id/xxxxx"
							required
							className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
							{...register("marketplace_url")}
						/>
					</label>
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
