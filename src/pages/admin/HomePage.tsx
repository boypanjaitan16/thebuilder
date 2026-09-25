import { Button } from "antd";
import { Package, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
	const navigate = useNavigate();

	return (
		<section className="container-page w-full">
			<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
				Admin Portal
			</p>
			<h1 className="mt-3 font-display text-3xl font-semibold text-ink">
				Welcome back
			</h1>
			<p className="mt-2 text-slate-700">
				Use the navigation below to manage your product catalog, stored in
				Firestore.
			</p>
			<div className="mt-4 flex flex-wrap gap-3">
				<Button
					type="primary"
					icon={<Package size={16} />}
					onClick={() => navigate("/admin/products")}
				>
					Manage Products
				</Button>
				<Button
					icon={<Plus size={16} />}
					onClick={() => navigate("/admin/products/new")}
				>
					Add Product
				</Button>
			</div>
		</section>
	);
};

export default HomePage;
