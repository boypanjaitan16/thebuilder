import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";
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

	return (
		<div className="container-page w-full">
			<section className="glass-panel p-8">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h2 className="text-2xl font-semibold text-ink">Products</h2>
						<p className="text-sm text-slate-600">
							Create, publish, and manage products.
						</p>
					</div>
					<div className="flex-grow md:flex-none">
						<button
							type="button"
							onClick={() => navigate("/admin/products/new")}
							className="rounded-full w-full md:w-auto bg-white px-4 py-2 text-sm font-semibold text-ink shadow-soft border border-ink"
						>
							Add Product
						</button>
					</div>
				</div>
				{combinedError && (
					<p className="mt-3 text-sm text-amber-700">{combinedError}</p>
				)}
				<div className="mt-6 overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="border-b border-sand text-left text-xs uppercase tracking-wide text-slate-500">
								<th className="px-2 py-2">Thumbnail</th>
								<th className="px-2 py-2">Name</th>
								<th className="px-2 py-2">Price</th>
								<th className="px-2 py-2">Actions</th>
							</tr>
						</thead>
						<tbody>
							{loading && (
								<tr>
									<td className="px-2 py-3 text-slate-600" colSpan={6}>
										<LoadingIndicator label="Loading products..." />
									</td>
								</tr>
							)}
							{!loading && products.length === 0 && (
								<tr>
									<td className="px-2 py-3 text-slate-600" colSpan={6}>
										No products yet.
									</td>
								</tr>
							)}
							{products.map((product) => (
								<tr key={product.id} className="border-b border-sand/70">
									<td className="px-2 py-3">
										{product.thumbnail_url ? (
											<img
												src={product.thumbnail_url}
												alt={`${product.name} thumbnail`}
												className="h-14 w-14 rounded-lg object-cover ring-1 ring-sand"
											/>
										) : (
											<span className="text-xs text-slate-500">No image</span>
										)}
									</td>
									<td className="px-2 py-3 font-semibold text-ink">
										<a
											target="_blank"
											href={product.marketplace_url}
											className="text-blue-600"
										>
											{product.name}
										</a>
									</td>
									<td className="px-2 py-3 text-slate-700">
										{new Intl.NumberFormat("id-ID", {
											style: "currency",
											currency: "IDR",
										}).format(product.price)}
									</td>

									<td className="px-2 py-3">
										<div className="flex flex-wrap gap-2">
											<button
												type="button"
												onClick={() =>
													navigate(`/admin/products/${product.id}/edit`)
												}
												className="rounded-full border border-ink px-3 py-1 text-xs font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-white"
											>
												Edit
											</button>
											<button
												type="button"
												onClick={() => void handleDeleteProduct(product)}
												className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-red-700"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}

export default ProductsPage;
