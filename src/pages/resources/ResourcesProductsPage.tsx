import LoadingIndicator from "../../components/LoadingIndicator";
import { useActiveProducts } from "../../hooks/useActiveProducts";
import { useI18n } from "../../i18n/I18nProvider";

function ResourcesProductsPage() {
	const { copy } = useI18n();
	const { data: products, isLoading, error } = useActiveProducts();

	return (
		<div className="blueprint-page blueprint-page--products container-page flex flex-col">
			<section className="blueprint-product-intro">
				<h1>{copy.breadcrumb.resourcesProducts}</h1>
				<p>{copy.resources.closingNote}</p>
			</section>
			{isLoading ? (
				<div className="blueprint-product-state">
					<LoadingIndicator label={copy.brand.productsLoading} />
				</div>
			) : error ? (
				<p className="blueprint-product-state" role="alert">
					{error}
				</p>
			) : products?.length ? (
				<section className="blueprint-product-grid">
					{products.map((product, index) => (
						<a
							href={product.marketplace_url}
							key={product.id}
							target="_blank"
							rel="noopener noreferrer"
							className="blueprint-product"
						>
							<img
								src={product.thumbnail_url}
								alt={product.name}
								loading="lazy"
								decoding="async"
							/>
							<div>
								<span>
									0{index + 1} / {copy.breadcrumb.resourcesProducts}
								</span>
								<h2>{product.name}</h2>
								<span aria-hidden="true">↗</span>
							</div>
						</a>
					))}
				</section>
			) : (
				<p className="blueprint-product-state">{copy.brand.productsEmpty}</p>
			)}
		</div>
	);
}

export default ResourcesProductsPage;
