import { useEffect, useState } from "react";
import LoadingIndicator from "../components/LoadingIndicator";
import { useGetProducts } from "../hooks/useGetProducts";
import type { Product } from "../types/Product";

function ResourcesProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const {
		fetchProducts: fetchProductsApi,
		loading: loadingProducts,
		error: productsError,
		setError: setProductsError,
	} = useGetProducts();

	const fetchProducts = async () => {
		setProductsError(null);
		const data = await fetchProductsApi();
		setProducts(data);
	};

	useEffect(() => {
		void fetchProducts();
	}, []);

	const combinedError = productsError;
	const combinedLoading = loadingProducts;

	return (
		<div className="container-page flex flex-col gap-10">
			{combinedLoading ? (
				<div className="flex justify-center">
					<LoadingIndicator label="Loading products..." />
				</div>
			) : combinedError ? (
				<p>{combinedError}</p>
			) : (
				<section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-5">
					{products?.map((product) => (
						<a
							href={product.marketplace_url}
							key={product.id}
							target="_blank"
							rel="noopener noreferrer"
						>
							<article className="bg-white rounded-2xl border hover:border-ink overflow-hidden">
								<img
									src={product.thumbnail_url}
									className="w-full"
									alt={product.name}
								/>
								<div className="px-5 py-3">
									<h4
										className="font-semibold text-lg leading-tight truncate"
										title={product.name}
									>
										{product.name}
									</h4>
								</div>
							</article>
						</a>
					))}
				</section>
			)}
		</div>
	);
}

export default ResourcesProductsPage;
