import { Card, Statistic } from "antd";
import { FileText, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetArticles } from "../../hooks/useGetArticles";
import { useGetProducts } from "../../hooks/useGetProducts";

const HomePage = () => {
	const navigate = useNavigate();
	const [productCount, setProductCount] = useState<number | null>(null);
	const [publishedArticleCount, setPublishedArticleCount] = useState<
		number | null
	>(null);

	const { fetchProducts } = useGetProducts();
	const { fetchArticles } = useGetArticles();

	useEffect(() => {
		void fetchProducts().then((products) => setProductCount(products.length));
		void fetchArticles().then((articles) =>
			setPublishedArticleCount(
				articles.filter((article) => article.status === "PUBLISHED").length,
			),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<section className="container-page w-full">
			<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
				Admin Portal
			</p>
			<h1 className="mt-3 font-display text-3xl font-semibold text-ink">
				Welcome back
			</h1>
			<p className="mt-2 text-slate-700">
				Overview of your product catalog and articles, stored in Firestore.
			</p>
			<div className="mt-6 grid gap-4 sm:grid-cols-2">
				<Card
					hoverable
					onClick={() => navigate("/admin/products")}
					className="cursor-pointer"
				>
					<Statistic
						title="Total products"
						value={productCount ?? undefined}
						loading={productCount === null}
						prefix={<Package size={20} className="mr-1 text-ink" />}
					/>
				</Card>
				<Card
					hoverable
					onClick={() => navigate("/admin/articles")}
					className="cursor-pointer"
				>
					<Statistic
						title="Published articles"
						value={publishedArticleCount ?? undefined}
						loading={publishedArticleCount === null}
						prefix={<FileText size={20} className="mr-1 text-ink" />}
					/>
				</Card>
			</div>
		</section>
	);
};

export default HomePage;
