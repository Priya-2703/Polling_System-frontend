// src/components/LanguageDialog.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";

const LanguageDialog = ({ onLanguageSelect, onClose  }) => {
  const { i18n } = useTranslation();
  const [playClick] = useSound(scifi);
    const [selectedLang, setSelectedLang] = useState(null);

  // Step 1: Select Language
  const handleLanguageClick = (lang) => {
    playClick();
    setSelectedLang(lang);
  };

  // Step 2: Confirm Selection
  const handleConfirm = () => {
    playClick();
    
    // Save to localStorage
    localStorage.setItem("language", selectedLang);
    
    // Change i18n language
    i18n.changeLanguage(selectedLang);
    
    // Add tamil-mode class if needed
    if (selectedLang === "ta") {
      document.body.classList.add("tamil-mode");
    } else {
      document.body.classList.remove("tamil-mode");
    }

     if (selectedLang === "ta") {
      document.body.classList.add("ta-lang");
    } else {
      document.body.classList.remove("ta-lang");
    }
    
    // Close dialog and go to home
    onLanguageSelect();
  };

  // Go back to selection
  const handleBack = () => {
    playClick();
    setSelectedLang(null);
  };

   const handleClose = () => {
    playClick();
    setSelectedLang(null);
    if (onClose) {
      onClose();  // Parent component-க்கு close event அனுப்பு
    }
};

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-100 flex items-center justify-center p-8 md:p-4">
      
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-accet/10 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 h-32 w-32 bg-blue-500/20 rounded-full blur-2xl" />
      
      <div className="relative bg-linear-to-br from-accet/10 to-accet/20 border border-accet/40 rounded-md p-6 md:p-8 max-w-sm w-full shadow-2xl shadow-accet/20 animate-scaleIn backdrop-blur-xl">

        <button
            onClick={handleClose}
            className="absolute top-3 right-3 md:w-8 md:h-8 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
        </button>
        
        {/* ========== STEP 1: Language Selection ========== */}
        {!selectedLang && (
          <>
            {/* Logo/Icon */}
            <div className="flex justify-center mb-3 md:mb-6">
              <div className="md:w-20 md:h-20 w-14 h-14 rounded-full bg-gradient-to-br from-accet/30 to-accet/10 flex items-center justify-center border border-accet/30">
                <span className="text-2xl md:text-4xl">🗳️</span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-4 md:mb-8">
              <h2 className="text-[14px] md:text-2xl uppercase font-heading font-bold text-white md:mb-1">
                Select Language
              </h2>
              <p className="text-accet text-[12px] md:text-base font-tamil font-bold">
                மொழியைத் தேர்ந்தெடுக்கவும்
              </p>
            </div>

            {/* Language Options */}
            <div className="space-y-1 md:space-y-3">
              {/* English */}
              <button
                onClick={() => handleLanguageClick("en")}
                className="w-full group relative overflow-hidden rounded border-2 border-transparent bg-white/15 p-2 transition-all duration-300 hover:bg-accet/20 hover:border-accet active:scale-[0.98]"
              >
                <div className="flex items-center justify-center">
                  <div className="text-center flex-1">
                    <p className="font-heading font-bold text-white text-[10px] md:text-lg">
                      English
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 hidden lg:block text-accet opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </button>

              {/* Tamil */}
              <button
                onClick={() => handleLanguageClick("ta")}
                className="w-full group relative overflow-hidden rounded border-2 border-transparent bg-white/15 p-2 transition-all duration-300 hover:bg-accet/20 hover:border-accet active:scale-[0.98]"
              >
                <div className="flex items-center justify-center">
                  <div className="text-center flex-1">
                    <p className="font-tamil font-bold text-white text-[10px] md:text-lg">
                      தமிழ்
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5  hidden lg:block text-accet opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-2 md:mt-5 pt-2 border-t border-white/10 text-center">
              <p className="text-gray-500 font-heading text-[7px] uppercase tracking-wide font-bold md:text-[10px]">
                Tamil Nadu 2026 Election Opinion Poll
              </p>
            </div>
          </>
        )}

        {/* ========== STEP 2: Confirmation Screen ========== */}
        {selectedLang && (
          <div className="animate-fadeIn">

            {/* Selected Language Display */}
            <div className="flex justify-center mb-3 md:mb-6 md:pt-4">
              <div className="md:w-24 md:h-24 w-16 h-16 rounded-full bg-gradient-to-br from-accet/40 to-accet/20 flex items-center justify-center border-2 border-accet/50 shadow-lg shadow-accet/20">
                <img src={selectedLang === "en" ? "https://ik.imagekit.io/saransk03/Voting%20Poll/united-kingdom.png" : "https://ik.imagekit.io/saransk03/Voting%20Poll/india.png"} alt="img" className="w-8 md:w-12" />
              </div>
            </div>

            {/* Confirmation Text */}
            <div className="text-center mb-4 md:mb-8">
              <h2 className={`text-[14px] md:text-2xl font-heading uppercase ${selectedLang === "en" ? "font-heading": "font-tamil"} tracking-wider font-black text-white`}>
                {selectedLang === "en" ? "English" : "தமிழ்"}
              </h2>
              <p className="text-gray-400 font-tamil text-[9px] md:text-xs md:mt-1">
                {selectedLang === "en" 
                  ? "You have selected English" 
                  : "நீங்கள் தமிழை தேர்ந்தெடுத்துள்ளீர்கள்"}
              </p>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              className={`${selectedLang === "en" ? "font-heading": "font-tamil"} w-full bg-gradient-to-r from-accet/40 to-accet/50 text-white py-2 rounded tracking-wide font-heading font-bold text-[13px] md:text-[16px] transition-all duration-300 hover:shadow-lg hover:shadow-accet/30 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2`}
            >
              {selectedLang === "en" ? "Confirm & Continue" : "உறுதிப்படுத்து"}
              <svg
                className="md:w-5 md:h-5 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>

            {/* Change Language Link */}
            <p className={`text-center ${selectedLang === "en" ? "font-heading": "font-tamil"} uppercase font-black tracking-wide mt-1 md:mt-2`}>
              <button
                onClick={handleBack}
                className="text-gray-500 uppercase underline text-[8px] md:text-[10px] hover:text-accet transition-colors"
              >
                {selectedLang === "en" ? "Change Language" : "மொழியை மாற்று"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageDialog;