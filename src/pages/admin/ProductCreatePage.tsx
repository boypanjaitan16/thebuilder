import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import {
	type ProductCreateFormValues,
	type ProductCreateValues,
	productCreateSchema,
} from "../../schemas/productCreateSchema";

function ProductCreatePage() {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [status, setStatus] = useState<string | null>(null);
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<ProductCreateFormValues, undefined, ProductCreateValues>({
		resolver: zodResolver(productCreateSchema),
		defaultValues: {
			name: "",
			description: "",
			price: 0,
			marketplace_url: "",
		},
	});

	const onCreateProduct = async (values: ProductCreateValues) => {
		setError(null);
		setStatus(null);
		if (!thumbnailFile) {
			setError("Please select a thumbnail image.");
			return;
		}

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
		const publicUrl = publicUrlData?.publicUrl;

		const { error: insertError } = await supabase.from("products").insert({
			name: values.name,
			description: values.description,
			price: values.price,
			thumbnail_url: publicUrl || null,
			marketplace_url: values.marketplace_url,
		});
		setUploading(false);

		if (insertError) {
			setError(insertError.message);
			return;
		}

		navigate("/admin/products");
	};

	return (
		<div className="container-page w-full">
			<section className="rounded-[24px] border border-sand bg-white p-8 shadow-soft">
				<div className="flex flex-row flex-wrap items-center justify-between gap-3">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
							Admin
						</p>
						<h1 className="mt-2 font-display text-3xl font-semibold text-ink">
							Create product
						</h1>
						<p className="text-sm text-slate-600">
							Save products into Supabase. RLS should allow only admins to
							write.
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
					onSubmit={handleSubmit(onCreateProduct)}
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
							required
							onChange={(event) => {
								const file = event.target.files?.[0];
								if (file) setThumbnailFile(file);
							}}
							className="rounded-xl border border-sand bg-white px-2 py-2 text-sm text-ink file:mr-3 file:rounded-lg file:border-none file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
						/>
						<span className="text-xs font-normal text-slate-600">
							Upload a small image (e.g., &lt;1MB). Stored in the public
							thumbnail bucket.
						</span>
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
							{isSubmitting || uploading ? "Saving…" : "Create product"}
						</button>
					</div>
				</form>
			</section>
		</div>
	);
}

export default ProductCreatePage;
