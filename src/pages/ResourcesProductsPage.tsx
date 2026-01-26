import { useEffect, useState } from "react";
import LoadingIndicator from "../components/LoadingIndicator";
import { supabase } from "../lib/supabaseClient";
import type { Product } from "../types/Product";

function ResourcesProductsPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [products, setProducts] = useState<Product[]>([]);

	const fetchProducts = async () => {
		setLoading(true);
		setError(null);
		const { data, error: fetchError } = await supabase
			.from("products")
			.select("id,name,thumbnail_url,marketplace_url")
			.order("created_at", { ascending: false });
		if (fetchError) setError(fetchError.message);
		else setProducts((data || []) as Product[]);
		setLoading(false);
	};

	useEffect(() => {
		void fetchProducts();
	}, []);

	return (
		<div className="container-page flex flex-col gap-10">
			{loading ? (
				<div className="flex justify-center">
					<LoadingIndicator label="Loading products..." />
				</div>
			) : error ? (
				<p>{error}</p>
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
