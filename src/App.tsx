import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import AboutPage from './pages/AboutPage'
import ApplyPage from './pages/ApplyPage'
import ArchitecturePage from './pages/ArchitecturePage'
import DiagnosticPage from './pages/DiagnosticPage'
import FutureTalentPage from './pages/FutureTalentPage'
import HomePage from './pages/HomePage'
import InsightsPage from './pages/InsightsPage'
import OrganizationPage from './pages/OrganizationPage'
import PrivacyPage from './pages/PrivacyPage'
import RiskContinuityPage from './pages/RiskContinuityPage'
import WorkWithMePage from './pages/WorkWithMePage'

function App() {
  return (
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
        <Route path="/work-with-me" element={<WorkWithMePage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/diagnostic" element={<DiagnosticPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
