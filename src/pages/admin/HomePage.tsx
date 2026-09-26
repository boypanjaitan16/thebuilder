import { Card, Statistic } from "antd";
import { FileText, Inbox, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetAdvisoryRequests } from "../../hooks/useGetAdvisoryRequests";
import { useGetArticles } from "../../hooks/useGetArticles";
import { useGetProducts } from "../../hooks/useGetProducts";

const HomePage = () => {
	const navigate = useNavigate();
	const { data: products, isLoading: loadingProducts } = useGetProducts();
	const { data: articles, isLoading: loadingArticles } = useGetArticles();
	const { data: advisoryRequests, isLoading: loadingAdvisoryRequests } =
		useGetAdvisoryRequests();

	const productCount = loadingProducts ? null : products.length;
	const publishedArticleCount = loadingArticles
		? null
		: articles.filter((article) => article.status === "PUBLISHED").length;
	const advisoryRequestCount = loadingAdvisoryRequests
		? null
		: advisoryRequests.length;

	return (
		<section className="container-page w-full">
			<h1 className="mt-3 font-display text-3xl font-semibold text-ink">
				Welcome back
			</h1>
			<p className="mt-2 text-slate-700">
				Overview of your product catalog and articles, stored in Firestore.
			</p>
			<div className="mt-6 grid gap-4 sm:grid-cols-3">
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
				<Card
					hoverable
					onClick={() => navigate("/admin/advisory-requests")}
					className="cursor-pointer"
				>
					<Statistic
						title="Advisory requests"
						value={advisoryRequestCount ?? undefined}
						loading={advisoryRequestCount === null}
						prefix={<Inbox size={20} className="mr-1 text-ink" />}
					/>
				</Card>
			</div>
		</section>
	);
};

export default HomePage;
