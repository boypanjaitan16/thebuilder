import { Route, Routes } from "react-router-dom";
import { AnalyticsTracker } from "./components/AnalyticsTracker";
import BlueprintLayout from "./components/BlueprintLayout";
import AboutPage from "./pages/AboutPage";
import ApplyPage from "./pages/ApplyPage";
import ArchitecturePage from "./pages/ArchitecturePage";
import DiagnosticPage from "./pages/DiagnosticPage";
import FutureTalentPage from "./pages/FutureTalentPage";
import HomePage from "./pages/HomePage";
import ArticleDetailPage from "./pages/insights/ArticleDetailPage";
import InsightsPage from "./pages/insights/InsightsPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrganizationPage from "./pages/OrganizationPage";
import PrivacyPage from "./pages/PrivacyPage";
import RiskContinuityPage from "./pages/RiskContinuityPage";
import RiskReadinessDiagnosticPage from "./pages/RiskReadinessDiagnosticPage";
import ResourcesCoursesPage from "./pages/resources/ResourcesCoursesPage";
import ResourcesFoundationalPage from "./pages/resources/ResourcesFoundationalPage";
import ResourcesGuidesPage from "./pages/resources/ResourcesGuidesPage";
import ResourcesPage from "./pages/resources/ResourcesPage";
import ResourcesProductsPage from "./pages/resources/ResourcesProductsPage";
import WorkWithMePage from "./pages/WorkWithMePage";

// Mounted at the root (Indonesian) and again under /en (English). Paths
// are relative so the same tree works under both parents.
const pageRoutes = (
	<>
		<Route index element={<HomePage />} />
		<Route path="organization-transformation" element={<OrganizationPage />} />
		<Route path="future-talent-strategy" element={<FutureTalentPage />} />
		<Route
			path="risk-and-business-continuity"
			element={<RiskContinuityPage />}
		/>
		<Route path="insights" element={<InsightsPage />} />
		<Route path="insights/:slug" element={<ArticleDetailPage />} />
		<Route path="work-with-me" element={<WorkWithMePage />} />
		<Route path="apply" element={<ApplyPage />} />
		<Route path="diagnostic" element={<DiagnosticPage />} />
		<Route
			path="risk-readiness-diagnostic"
			element={<RiskReadinessDiagnosticPage />}
		/>
		<Route path="resources" element={<ResourcesPage />} />
		<Route
			path="resources/foundational-thinking"
			element={<ResourcesFoundationalPage />}
		/>
		<Route
			path="resources/guides-playbooks"
			element={<ResourcesGuidesPage />}
		/>
		<Route
			path="resources/courses-deep-dives"
			element={<ResourcesCoursesPage />}
		/>
		<Route path="resources/products" element={<ResourcesProductsPage />} />
		<Route path="about" element={<AboutPage />} />
		<Route path="architecture" element={<ArchitecturePage />} />
		<Route path="privacy" element={<PrivacyPage />} />
		<Route path="*" element={<NotFoundPage />} />
	</>
);

function App() {
	return (
		<>
			<AnalyticsTracker />
			<Routes>
				<Route path="/" element={<BlueprintLayout />}>
					<Route path="en">{pageRoutes}</Route>
					{pageRoutes}
				</Route>
			</Routes>
		</>
	);
}

export default App;
