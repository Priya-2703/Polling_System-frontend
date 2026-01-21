import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, Form } from "react-router-dom";
import Home from "./Pages/Home";
import UserData from "./Pages/UserDetails";
import Vote from "./Pages/Vote";
import QnA from "./Pages/QnA";
import LanguageDialog from "./Components/LanguageDialog";
import "./i18n/i18n";
import { useTranslation } from "react-i18next";
import DigitalGlobeBackground from "./Components/DigitalGlobeBackground";
import Candidate from "./Pages/Canditdate";
import Thanks from "./Pages/Thanks";
import PrivacyPolicy from "./Pages/PrivacyPolicyPopup";
import TermsAndConditions from "./Pages/TermsAndConditionsPopup";
import FormPage from "./Pages/FormPage";
import ScrollToTop from "./Components/ScrollToTop";
import VoteStatus from "./Pages/VoteStatus";
import ThreeBackground from "./Components/ThreeBackground";


const getRedirectPath = (status) => {
  switch (status) {
    case "registered": return "/vote";
    case "voted": return "/survey";
    case "survey_completed": return "/candidate";
    case "candidate_selected": return "/thanks";
    default: return "/form";
  }
};


const StepGuard = ({ children, requiredStatus }) => {
  const currentStatus = localStorage.getItem("voter_status");

  if (!currentStatus && requiredStatus !== "new") {
    return <Navigate to="/form" replace />;
  }

  if (currentStatus !== requiredStatus) {
    if (currentStatus === "registered") return <Navigate to="/vote" replace />;
    if (currentStatus === "voted") return <Navigate to="/survey" replace />;
    if (currentStatus === "survey_completed") return <Navigate to="/candidate" replace />;
    if (currentStatus === "candidate_selected") return <Navigate to="/thanks" replace />;
    
    return <Navigate to="/form" replace />;
  }

  return children;
};

function App() {
  const { i18n } = useTranslation();
  const [languageSelected, setLanguageSelected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      if (savedLanguage === "ta") {
        document.body.classList.add("tamil-mode");
      } else {
        document.body.classList.remove("tamil-mode");
      }
      setLanguageSelected(true);
    }
    setLoading(false);
  }, [i18n]);

  if (loading) {
    return (
      <div className="h-dvh w-full bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accet border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
      {/* <div className="scanline" /> */}

      <BrowserRouter>
      <ScrollToTop behavior="smooth" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/user" element={<FormPage />} />
          <Route path="/status" element={<VoteStatus />} />
          <Route path="/form" element={
            localStorage.getItem("voter_status") ? <Navigate to={getRedirectPath(localStorage.getItem("voter_status"))} replace /> : <UserData />
          } />

          <Route path="/vote" element={
            <StepGuard requiredStatus="registered">
              <Vote />
            </StepGuard>
          } />

          <Route path="/survey" element={
            <StepGuard requiredStatus="voted">
              <QnA />
            </StepGuard>
          } />

          <Route path="/candidate" element={
            <StepGuard requiredStatus="survey_completed">
              <Candidate />
            </StepGuard>
          } />

          <Route path="/thanks" element={
            <StepGuard requiredStatus="candidate_selected">
              <Thanks />
            </StepGuard>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;