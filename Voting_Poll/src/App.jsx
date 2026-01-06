import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import UserData from "./Pages/UserDetails";
import Vote from "./Pages/Vote";
import QnA from "./Pages/QnA";
import LanguageDialog from "./Components/LanguageDialog";
import "./i18n/i18n";
import { useTranslation } from "react-i18next";
// import HolographicBackground from "./Components/HolographicBackground";
import DigitalGlobeBackground from "./Components/DigitalGlobeBackground";
import Candidate from "./Pages/Canditdate";
import Thanks from "./Pages/Thanks";

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
        {/* <HolographicBackground /> */}
        <DigitalGlobeBackground />
        <div className="scanline" />
        <div className="vignette" />
        <LanguageDialog onLanguageSelect={() => setLanguageSelected(true)} />
      </>
    );
  }

  return (
    <>
      {/* <HolographicBackground /> */}
      <DigitalGlobeBackground />
      <div className="scanline" />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<UserData />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/survey" element={<QnA />} />
          <Route path="/candidate" element={<Candidate />} />
          <Route path="/thanks" element={<Thanks />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
