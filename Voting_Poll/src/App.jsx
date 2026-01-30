import { useEffect, useState, useRef, useCallback } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import backscore1 from "../src/assets/backscore1.mp3";

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
import { TimeTrackingProvider } from "./Context/TimeTrackingContext";

// ✅ Create Audio Context for global access
import React, { createContext, useContext } from "react";

const AudioContext = createContext(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
};

// ✅ Protected Route Component
const ProtectedRoute = ({ children, allowedStep }) => {
  const { currentStep, stepRoutes, loading } = useAuth();

  if (loading) return null;

  if (currentStep !== allowedStep) {
    const correctPath = stepRoutes[currentStep] || "/form";
    return <Navigate to={correctPath} replace />;
  }

  return children;
};

// ✅ Audio Manager Hook with Fade Out
const useBackgroundMusic = () => {
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const originalVolume = useRef(0.1);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(backscore1);
    audioRef.current.loop = true;
    audioRef.current.volume = originalVolume.current;

    // Audio events
    audioRef.current.onplay = () => setIsPlaying(true);
    audioRef.current.onpause = () => setIsPlaying(false);

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 🎯 Check if returning user & try autoplay
  useEffect(() => {
    const hasPlayedBefore = localStorage.getItem("musicEnabled") === "true";

    if (hasPlayedBefore && audioRef.current) {
      audioRef.current.play()
        .then(() => {
          console.log("🎵 Autoplay SUCCESS! (Returning user)");
          setHasInteracted(true);
        })
        .catch((err) => {
          console.log("🔇 Autoplay blocked, waiting for interaction...", err);
        });
    }
  }, []);

  // Start music
  const startMusic = useCallback(async () => {
    if (audioRef.current && !isPlaying) {
      try {
        audioRef.current.volume = originalVolume.current;
        await audioRef.current.play();
        localStorage.setItem("musicEnabled", "true");
        setHasInteracted(true);
        console.log("🎵 Music started & saved!");
      } catch (err) {
        console.log("Play failed:", err);
      }
    }
  }, [isPlaying]);

  // Toggle music
  const toggleMusic = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.volume = originalVolume.current;
        audioRef.current.play();
        localStorage.setItem("musicEnabled", "true");
      }
    }
  }, [isPlaying]);

  // 🎵 Fade Out and Stop - இது main function!
  const fadeOutAndStop = useCallback((duration = 1500) => {
    return new Promise((resolve) => {
      if (!audioRef.current || !isPlaying) {
        resolve();
        return;
      }

      const audio = audioRef.current;
      const startVolume = audio.volume;
      const steps = 30; // Number of fade steps
      const stepTime = duration / steps;
      const volumeStep = startVolume / steps;
      let currentStep = 0;

      console.log("🔉 Fading out...");

      // Clear any existing fade
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        const newVolume = startVolume - (volumeStep * currentStep);

        if (currentStep >= steps || newVolume <= 0) {
          audio.volume = 0;
          audio.pause();
          audio.volume = originalVolume.current; // Reset for next play
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
          console.log("🔇 Fade complete, audio stopped!");
          resolve();
        } else {
          audio.volume = Math.max(0, newVolume);
        }
      }, stepTime);
    });
  }, [isPlaying]);

  // 🎵 Fade In (optional - if you want to restart with fade)
  const fadeInAndPlay = useCallback(async (duration = 1000) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.volume = 0;

    try {
      await audio.play();
      localStorage.setItem("musicEnabled", "true");

      const steps = 20;
      const stepTime = duration / steps;
      const volumeStep = originalVolume.current / steps;
      let currentStep = 0;

      console.log("🔊 Fading in...");

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        const newVolume = volumeStep * currentStep;

        if (currentStep >= steps) {
          audio.volume = originalVolume.current;
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
          console.log("🎵 Fade in complete!");
        } else {
          audio.volume = Math.min(originalVolume.current, newVolume);
        }
      }, stepTime);
    } catch (err) {
      console.log("Play failed:", err);
    }
  }, []);

  return {
    isPlaying,
    startMusic,
    toggleMusic,
    fadeOutAndStop,    // 🎯 Export this!
    fadeInAndPlay,     // Optional
    hasInteracted,
    setHasInteracted,
  };
};

// ✅ Main App Routes
const AppRoutes = ({ onLanguageSelect }) => {
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

  const handleLanguageSelect = () => {
    setLanguageSelected(true);
    onLanguageSelect();
  };

  if (langLoading || loading) {
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
        <LanguageDialog onLanguageSelect={handleLanguageSelect} />
      </>
    );
  }

  return (
    <>
      <ThreeBackground />
      <ScrollToTop behavior="smooth" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/user" element={<FormPage />} />
        <Route path="/status" element={<VoteStatus />} />

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

// ✅ Main App Component
function App() {
  const audioControls = useBackgroundMusic();
  const { isPlaying, startMusic, toggleMusic, hasInteracted, setHasInteracted } = audioControls;

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        startMusic();
        setHasInteracted(true);
      }
    };

    const hasPlayedBefore = localStorage.getItem("musicEnabled") === "true";

    if (hasPlayedBefore) {
      const events = ['click', 'touchstart', 'scroll', 'keydown'];
      events.forEach(event => {
        window.addEventListener(event, handleInteraction, { once: true, passive: true });
      });

      return () => {
        events.forEach(event => {
          window.removeEventListener(event, handleInteraction);
        });
      };
    }
  }, [hasInteracted, startMusic, setHasInteracted]);

  return (
    <BrowserRouter>
      <TimeTrackingProvider>
        <AuthProvider>
          {/* 🎵 Provide audio controls to all children */}
          <AudioContext.Provider value={audioControls}>
            <AppRoutes onLanguageSelect={startMusic} />
          </AudioContext.Provider>
        </AuthProvider>
      </TimeTrackingProvider>
    </BrowserRouter>
  );
}

export default App;