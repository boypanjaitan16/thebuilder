import LoadingIndicator from "../components/LoadingIndicator";
import { useGetProducts } from "../hooks/useGetProducts";

function ResourcesProductsPage() {
	const {
		data: products,
		isLoading: loadingProducts,
		error: productsError,
	} = useGetProducts();

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
									loading="lazy"
									decoding="async"
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
