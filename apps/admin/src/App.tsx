import LoadingIndicator from "@thebuilder/shared/components/LoadingIndicator";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AdminGuard } from "./components/AdminGuard";
import { Layout } from "./components/Layout";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const PasswordPage = lazy(() => import("./pages/PasswordPage"));
const ProductsPage = lazy(() => import("./pages/products/ProductsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ArticlesPage = lazy(() => import("./pages/articles/ArticlesPage"));
const ArticleFormPage = lazy(() => import("./pages/articles/ArticleFormPage"));
const ArticlePreviewPage = lazy(
	() => import("./pages/articles/ArticlePreviewPage"),
);
const AdvisoryRequestsPage = lazy(
	() => import("./pages/advisory-requests/AdvisoryRequestsPage"),
);

function App() {
	return (
		<Suspense
			fallback={
				<div className="container-page min-h-screen flex items-center justify-center">
					<LoadingIndicator label="Loading…" />
				</div>
			}
		>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/login" element={<LoginPage />} />
					<Route element={<AdminGuard />}>
						<Route path="/" element={<HomePage />} />
						<Route path="/products" element={<ProductsPage />} />
						<Route
							path="/advisory-requests"
							element={<AdvisoryRequestsPage />}
						/>
						<Route path="/articles" element={<ArticlesPage />} />
						<Route path="/articles/new" element={<ArticleFormPage />} />
						<Route
							path="/articles/:articleId/edit"
							element={<ArticleFormPage />}
						/>
						<Route
							path="/articles/:articleId/preview"
							element={<ArticlePreviewPage />}
						/>
						<Route path="/profile" element={<ProfilePage />} />
						<Route path="/password" element={<PasswordPage />} />
					</Route>
					<Route
						path="*"
						element={
							<div className="container-page">
								<h1>Page not found</h1>
								<a href="/">Admin home</a>
							</div>
						}
					/>
				</Route>
			</Routes>
		</Suspense>
	);
}

export default App;
