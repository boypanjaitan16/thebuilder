import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AdminGuard } from "./components/AdminGuard";
import { AnalyticsTracker } from "./components/AnalyticsTracker";
import { Layout } from "./components/Layout";
import LoadingIndicator from "./components/LoadingIndicator";
import AboutPage from "./pages/AboutPage";
import ApplyPage from "./pages/ApplyPage";
import ArchitecturePage from "./pages/ArchitecturePage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import DiagnosticPage from "./pages/DiagnosticPage";
import FutureTalentPage from "./pages/FutureTalentPage";
import HomePage from "./pages/HomePage";
import InsightsPage from "./pages/InsightsPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrganizationPage from "./pages/OrganizationPage";
import PrivacyPage from "./pages/PrivacyPage";
import ResourcesCoursesPage from "./pages/ResourcesCoursesPage";
import ResourcesFoundationalPage from "./pages/ResourcesFoundationalPage";
import ResourcesGuidesPage from "./pages/ResourcesGuidesPage";
import ResourcesPage from "./pages/ResourcesPage";
import ResourcesProductsPage from "./pages/ResourcesProductsPage";
import RiskContinuityPage from "./pages/RiskContinuityPage";
import RiskReadinessDiagnosticPage from "./pages/RiskReadinessDiagnosticPage";
import WorkWithMePage from "./pages/WorkWithMePage";

// Lazy-loaded: admin pages pull in antd + lucide-react, which would
// otherwise bloat the public site's initial bundle for a route tree
// public visitors never touch.
const AdminPage = lazy(() => import("./pages/admin/HomePage"));
const AdminLoginPage = lazy(() => import("./pages/admin/LoginPage"));
const AdminPasswordPage = lazy(() => import("./pages/admin/PasswordPage"));
const AdminProductsPage = lazy(() => import("./pages/admin/ProductsPage"));
const AdminProfilePage = lazy(() => import("./pages/admin/ProfilePage"));
const AdminArticlesPage = lazy(() => import("./pages/admin/ArticlesPage"));
const AdminArticleFormPage = lazy(
	() => import("./pages/admin/ArticleFormPage"),
);
const AdminArticlePreviewPage = lazy(
	() => import("./pages/admin/ArticlePreviewPage"),
);

function AdminRouteFallback() {
	return (
		<div className="container-page w-full flex flex-col flex-grow items-center justify-center">
			<LoadingIndicator label="Loading…" />
		</div>
	);
}

function App() {
	return (
		<>
			<AnalyticsTracker />
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<HomePage />} />
					<Route
						path="/organization-transformation"
						element={<OrganizationPage />}
					/>
					<Route
						path="/future-talent-strategy"
						element={<FutureTalentPage />}
					/>
					<Route
						path="/risk-and-business-continuity"
						element={<RiskContinuityPage />}
					/>
					<Route path="/insights" element={<InsightsPage />} />
					<Route path="/insights/:slug" element={<ArticleDetailPage />} />
					<Route path="/work-with-me" element={<WorkWithMePage />} />
					<Route path="/apply" element={<ApplyPage />} />
					<Route path="/diagnostic" element={<DiagnosticPage />} />
					<Route
						path="/risk-readiness-diagnostic"
						element={<RiskReadinessDiagnosticPage />}
					/>
					<Route path="/resources" element={<ResourcesPage />} />
					<Route
						path="/resources/foundational-thinking"
						element={<ResourcesFoundationalPage />}
					/>
					<Route
						path="/resources/guides-playbooks"
						element={<ResourcesGuidesPage />}
					/>
					<Route
						path="/resources/courses-deep-dives"
						element={<ResourcesCoursesPage />}
					/>
					<Route
						path="/resources/products"
						element={<ResourcesProductsPage />}
					/>
					<Route path="/about" element={<AboutPage />} />
					<Route path="/architecture" element={<ArchitecturePage />} />
					<Route path="/privacy" element={<PrivacyPage />} />
					<Route
						path="/admin/login"
						element={
							<Suspense fallback={<AdminRouteFallback />}>
								<AdminLoginPage />
							</Suspense>
						}
					/>
					<Route
						path="/admin"
						element={
							<Suspense fallback={<AdminRouteFallback />}>
								<AdminGuard />
							</Suspense>
						}
					>
						<Route index element={<AdminPage />} />
						<Route path="products" element={<AdminProductsPage />} />
						<Route path="articles" element={<AdminArticlesPage />} />
						<Route path="articles/new" element={<AdminArticleFormPage />} />
						<Route
							path="articles/:articleId/edit"
							element={<AdminArticleFormPage />}
						/>
						<Route
							path="articles/:articleId/preview"
							element={<AdminArticlePreviewPage />}
						/>
						<Route path="profile" element={<AdminProfilePage />} />
						<Route path="password" element={<AdminPasswordPage />} />
					</Route>
					<Route path="*" element={<NotFoundPage />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
