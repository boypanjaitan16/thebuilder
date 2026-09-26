import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Drawer, Form, Input, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { CheckCircle, ImageUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useDeleteProductThumbnail } from "../hooks/useDeleteProductThumbnail";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useUploadProductThumbnail } from "../hooks/useUploadProductThumbnail";
import { toErrorMessage } from "../lib/errors";
import {
	type ProductCreateFormValues,
	type ProductCreateValues,
	productCreateSchema,
} from "../schemas/productCreateSchema";
import type { Product } from "../types/Product";
import { useToast } from "./ToastProvider";

type ProductFormDrawerProps = {
	open: boolean;
	product: Product | null;
	onClose: () => void;
	onSaved: () => void;
};

const emptyValues: ProductCreateFormValues = {
	name: "",
	description: "",
	price: 0,
	marketplace_url: "",
};

export function ProductFormDrawer({
	open,
	product,
	onClose,
	onSaved,
}: ProductFormDrawerProps) {
	const { showToast } = useToast();
	const [error, setError] = useState<string | null>(null);
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const isEditing = Boolean(product);

	const { createProduct, isPending: creating } = useCreateProduct();
	const { updateProduct, isPending: updating } = useUpdateProduct();
	const { uploadThumbnail, isPending: uploading } = useUploadProductThumbnail();
	const { deleteThumbnail } = useDeleteProductThumbnail();

	const combinedError = error;
	const submitting = creating || updating || uploading;

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProductCreateFormValues, undefined, ProductCreateValues>({
		resolver: zodResolver(productCreateSchema),
		defaultValues: emptyValues,
	});

	useEffect(() => {
		if (!open) return;
		setError(null);
		setThumbnailFile(null);
		reset(
			product
				? {
						name: product.name,
						description: product.description || "",
						price: product.price,
						marketplace_url: product.marketplace_url,
					}
				: emptyValues,
		);
	}, [open, product, reset]);

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

	const onSubmit = async (values: ProductCreateValues) => {
		setError(null);

		try {
			if (isEditing && product) {
				const previousThumbnailUrl = product.thumbnail_url || null;
				let thumbnailUrl = previousThumbnailUrl;

				if (thumbnailFile) {
					thumbnailUrl = await uploadThumbnail(thumbnailFile);
				}

				await updateProduct(product.id, values, {
					thumbnail_url: thumbnailUrl,
				});

				if (
					thumbnailFile &&
					previousThumbnailUrl &&
					previousThumbnailUrl !== thumbnailUrl
				) {
					try {
						await deleteThumbnail(previousThumbnailUrl);
					} catch {
						setError(
							"Product updated, but failed to delete the previous thumbnail.",
						);
						return;
					}
				}

				showToast("Product updated successfully", { tone: "success" });
			} else {
				if (!thumbnailFile) {
					setError("Please select a thumbnail image.");
					return;
				}

				const thumbnailUrl = await uploadThumbnail(thumbnailFile);
				await createProduct(values, { thumbnail_url: thumbnailUrl });

				showToast("Product created successfully", { tone: "success" });
			}

			onSaved();
		} catch (err) {
			setError(toErrorMessage(err, "Something went wrong."));
		}
	};

	return (
		<Drawer
			title={isEditing ? "Edit product" : "Create product"}
			open={open}
			onClose={onClose}
			width={480}
			destroyOnHidden
			footer={
				<Button
					type="primary"
					size="large"
					htmlType="submit"
					loading={submitting}
					icon={<CheckCircle />}
					onClick={handleSubmit(onSubmit)}
					block
				>
					{submitting
						? "Saving…"
						: isEditing
							? "Update product"
							: "Create product"}
				</Button>
			}
		>
			{combinedError && (
				<p className="mb-3 text-sm text-amber-700">{combinedError}</p>
			)}
			<Form
				size="large"
				layout="vertical"
				onSubmitCapture={handleSubmit(onSubmit)}
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
					help={
						isEditing
							? "Current thumbnail will stay unless you upload a new file."
							: null
					}
				>
					<Upload.Dragger
						accept="image/*"
						maxCount={1}
						listType="picture"
						defaultFileList={existingThumbnailFileList}
						beforeUpload={(file) => {
							setThumbnailFile(file);
							return false;
						}}
					>
						<p className="ant-upload-drag-icon flex justify-center">
							<ImageUp size={32} className="text-slate-400" />
						</p>
						<p className="ant-upload-text">Click or drag image to this area</p>
						<p className="ant-upload-hint text-xs text-slate-500">
							Single image, e.g. &lt;1MB
						</p>
					</Upload.Dragger>
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
				<Form.Item label="Description">
					<Controller
						name="description"
						control={control}
						render={({ field }) => <Input.TextArea rows={3} {...field} />}
					/>
				</Form.Item>
			</Form>
		</Drawer>
	);
}
