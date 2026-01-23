import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";

// Pages
import Home from "./Pages/Home";
import UserData from "./Pages/UserDetails";
import Vote from "./Pages/Vote";
import QnA from "./Pages/QnA";
import Candidate from "./Pages/Canditdate";
import Thanks from "./Pages/Thanks";
import PrivacyPolicy from "./Pages/PrivacyPolicyPopup";
import TermsAndConditions from "./Pages/TermsAndConditionsPopup";
import FormPage from "./Pages/FormPage";
import VoteStatus from "./Pages/VoteStatus";

// Components
import LanguageDialog from "./Components/LanguageDialog";
import ScrollToTop from "./Components/ScrollToTop";
import DigitalGlobeBackground from "./Components/DigitalGlobeBackground";
import ThreeBackground from "./Components/ThreeBackground";

// i18n
import "./i18n/i18n";
import { useTranslation } from "react-i18next";

// ✅ NEW: Protected Route Component (Backend based)
const ProtectedRoute = ({ children, allowedStep }) => {
  const { currentStep, stepRoutes, loading } = useAuth();

  if (loading) return null; // Loading screen App level la handle aagum

  // Step match aagala na, correct route ku redirect
  if (currentStep !== allowedStep) {
    const correctPath = stepRoutes[currentStep] || "/form";
    return <Navigate to={correctPath} replace />;
  }

  return children;
};

// ✅ Main App Routes (Separate component - AuthProvider kulla irukanum)
const AppRoutes = () => {
  const { loading } = useAuth();
  const { i18n } = useTranslation();
  const [languageSelected, setLanguageSelected] = useState(false);
  const [langLoading, setLangLoading] = useState(true);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      document.body.classList.toggle("tamil-mode", savedLanguage === "ta");
      setLanguageSelected(true);
    }
    setLangLoading(false);
  }, [i18n]);

  // Loading States
  if (langLoading || loading) {
    return (
      <div className="h-dvh w-full bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accet border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Language Selection
  if (!languageSelected) {
    return (
      <>
        <DigitalGlobeBackground />
        <div className="scanline" />
        <div className="vignette" />
        <LanguageDialog onLanguageSelect={() => setLanguageSelected(true)} />
      </>
    );
  }

  return (
    <>
      <ThreeBackground />
      <ScrollToTop behavior="smooth" />

      <Routes>
        {/* Public Routes - No Protection */}
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/user" element={<FormPage />} />
        <Route path="/status" element={<VoteStatus />} />

        {/* Protected Routes - Backend Status Based */}
        <Route
          path="/form"
          element={
            <ProtectedRoute allowedStep="REGISTER">
              <UserData />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vote"
          element={
            <ProtectedRoute allowedStep="VOTE">
              <Vote />
            </ProtectedRoute>
          }
        />

        <Route
          path="/survey"
          element={
            <ProtectedRoute allowedStep="SURVEY">
              <QnA />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate"
          element={
            <ProtectedRoute allowedStep="CM_VOTE">
              <Candidate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/thanks"
          element={
            <ProtectedRoute allowedStep="THANKS">
              <Thanks />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

// ✅ Main App Component
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
