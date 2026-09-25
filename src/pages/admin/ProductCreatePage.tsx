import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Upload } from "antd";
import { ArrowLeft, ImageUp } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateProduct } from "../../hooks/useCreateProduct";
import { useUploadProductThumbnail } from "../../hooks/useUploadProductThumbnail";
import {
	type ProductCreateFormValues,
	type ProductCreateValues,
	productCreateSchema,
} from "../../schemas/productCreateSchema";

function ProductCreatePage() {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const {
		createProduct,
		loading,
		error: createError,
		setError: setCreateError,
	} = useCreateProduct();
	const {
		uploadThumbnail,
		loading: uploading,
		error: uploadError,
		setError: setUploadError,
	} = useUploadProductThumbnail();
	const combinedError = error || createError || uploadError;

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
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
		setCreateError(null);
		setUploadError(null);
		if (!thumbnailFile) {
			setError("Please select a thumbnail image.");
			return;
		}

		const uploadResult = await uploadThumbnail(thumbnailFile);
		if (!uploadResult.success) return;

		const result = await createProduct(values, {
			thumbnail_url: uploadResult.url,
		});

		if (!result.success) return;

		navigate("/admin/products");
	};

	return (
		<div className="container-page w-full">
			<section className="rounded-[24px] border border-sand bg-white p-8 shadow-soft">
				<div className="flex flex-row flex-wrap items-center justify-between gap-3">
					<div>
						<h1 className="mt-2 font-display text-2xl font-semibold text-ink">
							Create product
						</h1>
						<p className="text-sm text-slate-600">
							Save products into Firestore. Any signed-in admin can create,
							edit, or delete products.
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

				{combinedError && (
					<p className="mt-3 text-sm text-amber-700">{combinedError}</p>
				)}

				<Form
					layout="vertical"
					onSubmitCapture={handleSubmit(onCreateProduct)}
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
						help="Upload a small image (e.g., <1MB). Stored in Firebase Storage under the public products/ path."
					>
						<Upload
							accept="image/*"
							maxCount={1}
							listType="picture"
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
							loading={isSubmitting || uploading || loading}
							className="w-full md:w-auto"
						>
							{isSubmitting || uploading || loading
								? "Saving…"
								: "Create product"}
						</Button>
					</div>
				</Form>
			</section>
		</div>
	);
}

export default ProductCreatePage;
