import type { TableProps } from "antd";
import { Alert, Button, Space, Table } from "antd";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AdminBreadcrumb } from "../../components/AdminBreadcrumb";
import { ProductFormDrawer } from "../../components/ProductFormDrawer";
import { useToast } from "../../components/ToastProvider";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import { useDeleteProductThumbnail } from "../../hooks/useDeleteProductThumbnail";
import { useGetProducts } from "../../hooks/useGetProducts";
import { confirmDelete } from "../../lib/confirmDelete";
import { toErrorMessage } from "../../lib/errors";
import type { Product } from "../../types/Product";

function ProductsPage() {
	const { showToast } = useToast();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [actionError, setActionError] = useState<string | null>(null);

	const { data: products, isLoading: loading, error } = useGetProducts();
	const { deleteProduct } = useDeleteProduct();
	const { deleteThumbnail } = useDeleteProductThumbnail();

	const combinedError = error || actionError;

	const handleDeleteProduct = async (product: Product) => {
		setActionError(null);
		try {
			await deleteProduct(product.id);
			let thumbnailDeleted = true;
			if (product.thumbnail_url) {
				try {
					await deleteThumbnail(product.thumbnail_url);
				} catch {
					thumbnailDeleted = false;
				}
			}
			if (thumbnailDeleted) {
				showToast("Product deleted", { tone: "success" });
			} else {
				showToast("Product deleted, thumbnail removal failed", {
					tone: "info",
				});
			}
		} catch (err) {
			setActionError(toErrorMessage(err, "Failed to delete product."));
		}
	};

	const columns: TableProps<Product>["columns"] = [
		{
			title: "Thumbnail",
			dataIndex: "thumbnail_url",
			key: "thumbnail",
			render: (url: string, record) =>
				url ? (
					<img
						src={url}
						alt={`${record.name} thumbnail`}
						className="h-14 w-14 rounded-lg object-cover ring-1 ring-sand"
						loading="lazy"
						decoding="async"
					/>
				) : (
					<span className="text-xs text-slate-500">No image</span>
				),
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			render: (name: string, record) => (
				<a
					target="_blank"
					rel="noreferrer"
					href={record.marketplace_url}
					className="text-blue-600 font-semibold"
				>
					{name}
				</a>
			),
		},
		{
			title: "Price",
			dataIndex: "price",
			key: "price",
			render: (price: number) =>
				new Intl.NumberFormat("id-ID", {
					style: "currency",
					currency: "IDR",
				}).format(price),
		},
		{
			title: "Actions",
			key: "actions",
			width: 150,
			render: (_, record) => (
				<Space>
					<Button
						icon={<Pencil size={14} />}
						onClick={() => {
							setEditingProduct(record);
							setDrawerOpen(true);
						}}
					>
						Edit
					</Button>
					<Button
						danger
						icon={<Trash2 size={14} />}
						onClick={() =>
							confirmDelete({
								title: `Delete "${record.name}"?`,
								content: "This action cannot be undone.",
								onConfirm: () => handleDeleteProduct(record),
							})
						}
					>
						Delete
					</Button>
				</Space>
			),
		},
	];

	return (
		<section className="container-page w-full">
			<AdminBreadcrumb items={[{ label: "Products" }]} />
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-2xl font-semibold text-ink">Products</h2>
					<p className="text-sm text-slate-600">
						Create, publish, and manage products.
					</p>
				</div>
				<div className="flex-grow md:flex-none">
					<Button
						type="primary"
						icon={<Plus size={16} />}
						onClick={() => {
							setEditingProduct(null);
							setDrawerOpen(true);
						}}
						className="w-full md:w-auto"
					>
						Add Product
					</Button>
				</div>
			</div>
			{combinedError && <Alert type="error" showIcon title={combinedError} />}
			<Table<Product>
				bordered
				columns={columns}
				dataSource={products}
				rowKey="id"
				loading={loading}
				pagination={false}
				locale={{ emptyText: "No products yet." }}
				className="mt-5"
				scroll={{ x: "max-content" }}
			/>
			<ProductFormDrawer
				open={drawerOpen}
				product={editingProduct}
				onClose={() => setDrawerOpen(false)}
				onSaved={() => setDrawerOpen(false)}
			/>
		</section>
	);
}

export default ProductsPage;
