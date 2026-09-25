import type { TableProps } from "antd";
import { Alert, Button, Space, Table } from "antd";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/ToastProvider";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import { useDeleteProductThumbnail } from "../../hooks/useDeleteProductThumbnail";
import { useGetProducts } from "../../hooks/useGetProducts";
import type { Product } from "../../types/Product";

function ProductsPage() {
	const navigate = useNavigate();
	const { showToast } = useToast();
	const [products, setProducts] = useState<Product[]>([]);

	const { fetchProducts: fetchProductsApi, loading, error } = useGetProducts();
	const {
		deleteProduct,
		error: deleteError,
		setError: setDeleteError,
	} = useDeleteProduct();
	const {
		deleteThumbnail,
		error: deleteThumbnailError,
		setError: setDeleteThumbnailError,
	} = useDeleteProductThumbnail();

	const combinedError = useMemo(
		() => error || deleteError || deleteThumbnailError,
		[deleteError, deleteThumbnailError, error],
	);

	useEffect(() => {
		void fetchProducts();
	}, []);

	const fetchProducts = async () => {
		const data = await fetchProductsApi();
		setProducts(data);
	};

	const handleDeleteProduct = async (product: Product) => {
		setDeleteError(null);
		setDeleteThumbnailError(null);
		const result = await deleteProduct(product.id);
		if (!result.success) return;
		let thumbnailDeleted = true;
		if (product.thumbnail_url) {
			const deleteResult = await deleteThumbnail(product.thumbnail_url);
			thumbnailDeleted = deleteResult.success;
		}
		if (thumbnailDeleted) {
			showToast("Product deleted", { tone: "success" });
		} else {
			showToast("Product deleted, thumbnail removal failed", { tone: "info" });
		}
		await fetchProducts();
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
						onClick={() => navigate(`/admin/products/${record.id}/edit`)}
					>
						Edit
					</Button>
					<Button
						danger
						icon={<Trash2 size={14} />}
						onClick={() => void handleDeleteProduct(record)}
					>
						Delete
					</Button>
				</Space>
			),
		},
	];

	return (
		<section className="container-page w-full">
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
						onClick={() => navigate("/admin/products/new")}
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
			/>
		</section>
	);
}

export default ProductsPage;
