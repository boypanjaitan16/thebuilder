import { Route, Routes } from "react-router-dom";
import { AdminGuard } from "./components/AdminGuard";
import { Layout } from "./components/Layout";
import AboutPage from "./pages/AboutPage";
import ApplyPage from "./pages/ApplyPage";
import ArchitecturePage from "./pages/ArchitecturePage";
import AdminPage from "./pages/admin/HomePage";
import AdminLoginPage from "./pages/admin/LoginPage";
import AdminProductCreatePage from "./pages/admin/ProductCreatePage";
import AdminProductEditPage from "./pages/admin/ProductEditPage";
import AdminProductsPage from "./pages/admin/ProductsPage";
import AdminProfilePage from "./pages/admin/ProfilePage";
import AdminPasswordPage from "./pages/admin/PasswordPage";
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

function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<HomePage />} />
				<Route
					path="/organization-transformation"
					element={<OrganizationPage />}
				/>
				<Route path="/future-talent-strategy" element={<FutureTalentPage />} />
				<Route
					path="/risk-and-business-continuity"
					element={<RiskContinuityPage />}
				/>
				<Route path="/insights" element={<InsightsPage />} />
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
				<Route path="/resources/products" element={<ResourcesProductsPage />} />
				<Route path="/about" element={<AboutPage />} />
				<Route path="/architecture" element={<ArchitecturePage />} />
				<Route path="/privacy" element={<PrivacyPage />} />
				<Route path="/admin/login" element={<AdminLoginPage />} />
				<Route path="/admin" element={<AdminGuard />}>
					<Route index element={<AdminPage />} />
					<Route path="products" element={<AdminProductsPage />} />
					<Route path="products/new" element={<AdminProductCreatePage />} />
					<Route
						path="products/:productId/edit"
						element={<AdminProductEditPage />}
					/>
					<Route path="profile" element={<AdminProfilePage />} />
					<Route path="password" element={<AdminPasswordPage />} />
				</Route>
				<Route path="*" element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
}

export default App;
