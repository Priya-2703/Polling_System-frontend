import React, { useRef, useState, useEffect } from "react";
import useSound from "use-sound";
import click from "../assets/click2.wav";
import { useTranslation } from "react-i18next";

const API_BASE_URL = import.meta.env.VITE_API_URL

const SuggestionPopup = ({ isOpen, onClose, candidate }) => {
  const { t, i18n } = useTranslation();
  const [Click] = useSound(click, { volume: 0.2 });
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null); // புதிய error state
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const MAX_WORDS = 50;

  // Smooth mount and animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsClosing(false);
      document.body.style.overflow = "hidden";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });

      const focusTimer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 500);

      return () => clearTimeout(focusTimer);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Reset state when fully closed
  useEffect(() => {
    if (!isOpen && !isClosing && !isMounted) {
      setSuggestionText("");
      setWordCount(0);
      setSubmitSuccess(false);
      setIsSubmitting(false);
      setSubmitError(null); // Error reset
    }
  }, [isOpen, isClosing, isMounted]);

  const handleClose = () => {
    Click();
    setIsClosing(true);
    setIsAnimating(false);

    setTimeout(() => {
      setIsMounted(false);
      setIsClosing(false);
      document.body.style.overflow = "auto";
      onClose();
    }, 350);
  };

  const handleSuggestionChange = (e) => {
    const text = e.target.value;
    const words = text.trim() ? text.trim().split(/\s+/) : [];

    if (words.length <= MAX_WORDS) {
      setSuggestionText(text);
      setWordCount(words.length);
    }
    
    // Clear error when user starts typing
    if (submitError) {
      setSubmitError(null);
    }
  };

  // ✅ API Integration - புதிய function
  const handleSubmitSuggestion = async () => {
    if (!suggestionText.trim() || isSubmitting) return;

    Click();
    setIsSubmitting(true);
    setSubmitError(null);

    // Request body தயாரிப்பு
    const requestBody = {
      partyId: candidate?.id,
      partyName: candidate?.party,
      suggestion: suggestionText.trim(),
      wordCount: wordCount,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/suggestion/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      // Response check
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP Error: ${response.status}`
        );
      }

      const data = await response.json();

      setIsSubmitting(false);
      setSubmitSuccess(true);

      // 2.5 sec பின் popup close
      setTimeout(() => {
        handleClose();
      }, 2500);

    } catch (error) {
      console.error("❌ Submission failed:", error);
      setIsSubmitting(false);
      setSubmitError(
        error.message || t("vote.sug.errorMsg") || "Submission failed. Please try again."
      );
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Retry button handler
  const handleRetry = () => {
    setSubmitError(null);
    handleSubmitSuggestion();
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Optimized Animation Styles */}
      <style>{`
        @keyframes suggestionBackdropIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes suggestionBackdropOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        @keyframes suggestionPopupIn {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(20px);
          }
          70% {
            transform: scale(1.01) translateY(-2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes suggestionPopupOut {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(0.9) translateY(15px);
          }
        }
        
        @keyframes suggestionContentFadeIn {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes successCheckmark {
          0% { stroke-dashoffset: 50; }
          100% { stroke-dashoffset: 0; }
        }
        
        @keyframes successScale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% { transform: scale(1.2); }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .suggestion-popup-wrapper,
        .suggestion-popup-container {
          will-change: transform, opacity;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        .error-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>

      <div
        className="suggestion-popup-wrapper fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
        onClick={handleBackdropClick}
        style={{
          height: "100dvh",
          width: "100vw",
          minHeight: "-webkit-fill-available",
          opacity: isAnimating && !isClosing ? 1 : 0,
          transition: isClosing
            ? "opacity 0.35s ease-out"
            : isAnimating
              ? "opacity 0.4s ease-out"
              : "none",
        }}
      >
        {/* Backdrop with blur */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          style={{
            opacity: isAnimating && !isClosing ? 1 : 0,
            transition: isClosing
              ? "opacity 0.35s ease-out"
              : isAnimating
                ? "opacity 0.4s ease-out 0.05s"
                : "none",
          }}
        />

        {/* Main Popup Container */}
        <div
          className="suggestion-popup-container relative z-10 w-[90%] sm:w-[90%] md:w-[80%] lg:w-[55%] xl:w-[45%] max-w-xl mx-auto"
          style={{
            maxHeight: "calc(100dvh - 40px)",
            animation: isClosing
              ? "suggestionPopupOut 0.35s cubic-bezier(0.4, 0, 0.6, 1) forwards"
              : isAnimating
                ? "suggestionPopupIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                : "none",
            opacity: isAnimating && !isClosing ? 1 : 0,
            transform:
              isAnimating && !isClosing
                ? "scale(1) translateY(0)"
                : "scale(0.85) translateY(20px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Outer Glow Effect */}
          <div
            className="absolute -inset-4 bg-accet/20 blur-3xl pointer-events-none"
            style={{
              animation:
                isAnimating && !isClosing
                  ? "glowPulse 2s ease-in-out infinite"
                  : "none",
              opacity: isAnimating && !isClosing ? 1 : 0,
              transition: "opacity 0.5s ease-out 0.3s",
            }}
          />

          {/* Corner Decorations */}
          <div className="absolute -top-1 -left-1 w-10 h-10 z-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accet via-cyan-400 to-transparent" />
            <div className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-accet via-cyan-400 to-transparent" />
          </div>
          <div className="absolute -top-1 -right-1 w-10 h-10 z-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-accet via-cyan-400 to-transparent" />
            <div className="absolute top-0 right-0 h-full w-0.5 bg-gradient-to-b from-accet via-cyan-400 to-transparent" />
          </div>
          <div className="absolute -bottom-1 -left-1 w-10 h-10 z-20 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-accet via-cyan-400 to-transparent" />
            <div className="absolute bottom-0 left-0 h-full w-0.5 bg-gradient-to-t from-accet via-cyan-400 to-transparent" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-10 h-10 z-20 pointer-events-none">
            <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-accet via-cyan-400 to-transparent" />
            <div className="absolute bottom-0 right-0 h-full w-0.5 bg-gradient-to-t from-accet via-cyan-400 to-transparent" />
          </div>

          {/* Main Card Container */}
          <div className="relative bg-gradient-to-b from-[#0d0d18] via-[#080810] to-[#0d0d18] border border-accet/50 rounded-xl shadow-[0_0_30px_rgba(0,243,255,0.3)] overflow-hidden">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 md:top-4 md:right-4 z-30 w-8 h-8 md:w-10 md:h-10 border border-white/20 bg-black/80 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 group rounded-lg"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-white/60 group-hover:text-red-400 transition-all duration-300 group-hover:rotate-90"
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

            {/* Content Area */}
            <div
              className="p-5 md:p-8 overflow-y-auto"
              style={{
                maxHeight: "calc(100dvh - 80px)",
                animation: isClosing
                  ? "none"
                  : isAnimating
                    ? "suggestionContentFadeIn 0.5s ease-out 0.25s both"
                    : "none",
              }}
            >
              {/* Header Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="text-center">
                  <h2 className="text-[12px] md:text-xl font-heading uppercase font-bold tracking-wider text-transparent bg-gradient-to-r from-accet via-cyan-300 to-accet bg-clip-text mb-2">
                    {t("vote.sug.title")}
                  </h2>
                  <p className="text-[9px] md:text-sm text-white/50 font-heading uppercase tracking-wider flex items-center justify-center gap-2">
                    <span
                      className={`${i18n.language === "ta" ? "hidden" : "flex"}`}
                    >
                      About
                    </span>
                    <span className="text-accet font-semibold px-2 py-0.5 bg-accet/10 rounded border border-accet/30">
                      {candidate?.party}
                    </span>
                  </p>
                </div>

                {/* Decorative Divider */}
                <div className="flex items-center justify-center gap-3 mt-4 md:mt-5 w-full max-w-xs">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-accet/40" />
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-accet rounded-full animate-pulse" />
                    <div
                      className="w-1.5 h-1.5 bg-accet/60 rounded-full animate-pulse"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-accet/30 rounded-full animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-accet/40" />
                </div>
              </div>

              {/* Success State */}
              {submitSuccess ? (
                <div
                  className="flex flex-col items-center justify-center py-10"
                  style={{
                    animation:
                      "successScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-green-500/40 rounded-full blur-3xl animate-pulse" />
                    <div className="relative w-24 h-24 bg-gradient-to-b from-green-500/20 to-green-500/5 border-2 border-green-500/60 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                      <svg
                        className="w-12 h-12 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{
                          strokeDasharray: 50,
                          animation: "successCheckmark 0.6s ease-out 0.2s both",
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-2xl font-heading font-bold text-green-400 mb-2 tracking-wider">
                    {t("vote.sug.success")}
                  </h3>
                  <p className="text-sm text-white/60 font-body text-center max-w-xs">
                    {t("vote.sug.msg")}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-white/30 text-xs">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-green-400 rounded-full animate-spin" />
                    <span>{t("vote.sug.close")}</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* ✅ Error Message Display - புதிய section */}
                  {submitError && (
                    <div className="mb-4 p-3 md:p-4 bg-red-500/10 border border-red-500/30 rounded-lg error-shake">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-heading font-semibold text-red-400 mb-1">
                            {t("vote.sug.errorTitle") || "Submission Failed"}
                          </h4>
                          <p className="text-xs text-red-300/70">{submitError}</p>
                        </div>
                        <button
                          onClick={() => setSubmitError(null)}
                          className="flex-shrink-0 text-red-400/60 hover:text-red-400 transition-colors"
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
                      </div>
                    </div>
                  )}

                  {/* Textarea Section */}
                  <div className="relative mb-5">
                    <div
                      className={`absolute -inset-1 bg-gradient-to-r from-accet via-cyan-400 to-accet rounded-xl blur-md transition-all duration-500 ${
                        isFocused ? "opacity-10" : "opacity-0"
                      }`}
                    />

                    <div
                      className={`relative border rounded-lg transition-all duration-300 overflow-hidden ${
                        submitError
                          ? "border-red-500/50 bg-red-500/5"
                          : isFocused
                            ? "border-accet/70 bg-accet/5 shadow-[0_0_15px_rgba(0,243,255,0.1)]"
                            : "border-white/15 bg-white/5"
                      }`}
                    >
                      {/* Header Bar */}
                      <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b border-white/10 bg-white/5">
                        <div className="flex items-center gap-1 md:gap-2">
                          <div
                            className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                              submitError
                                ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                                : isFocused
                                  ? "bg-accet shadow-[0_0_10px_rgba(0,243,255,0.8)] animate-pulse"
                                  : "bg-white/30"
                            }`}
                          />
                          <span className="text-[9px] md:text-xs uppercase tracking-widest text-white/80 font-heading">
                            {t("vote.sug.your")}
                          </span>
                        </div>

                        <svg
                          className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-colors duration-300 ${
                            submitError
                              ? "text-red-400"
                              : isFocused
                                ? "text-accet"
                                : "text-white/30"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </div>

                      {/* Textarea */}
                      <textarea
                        ref={textareaRef}
                        value={suggestionText}
                        onChange={handleSuggestionChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="உங்கள் கருத்துக்களை இங்கே பகிரவும்...&#10;Share your valuable thoughts and suggestions here..."
                        className="w-full h-36 md:h-44 px-3 lg:px-4 py-2 lg:py-4 bg-transparent text-white/90 text-[10px] lg:text-sm md:text-base font-tamil placeholder:text-white/25 focus:outline-none resize-none scrollbar-thin scrollbar-thumb-accet/40 scrollbar-track-transparent lg:leading-7"
                        disabled={isSubmitting}
                      />

                      {/* Footer Bar */}
                      <div className="flex items-center justify-between px-4 py-2 md:py-3 border-t border-white/10 bg-black/30">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-1 lg:h-1.5 bg-white/10 rounded-full overflow-hidden"
                            style={{ width: "80px" }}
                          >
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                wordCount >= MAX_WORDS
                                  ? "bg-gradient-to-r from-red-500 to-red-400"
                                  : wordCount >= MAX_WORDS * 0.8
                                    ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                                    : "bg-gradient-to-r from-accet to-cyan-400"
                              }`}
                              style={{
                                width: `${Math.min((wordCount / MAX_WORDS) * 100, 100)}%`,
                              }}
                            />
                          </div>

                          {wordCount >= MAX_WORDS && (
                            <span className="text-[10px] text-red-400">
                              {t("vote.sug.limit")}
                            </span>
                          )}
                        </div>

                        <div
                          className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-all duration-300 ${
                            wordCount >= MAX_WORDS
                              ? "border-red-500/40 bg-red-500/10 text-red-400"
                              : wordCount >= MAX_WORDS * 0.8
                                ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                                : "border-white/10 bg-white/5 text-white/50"
                          }`}
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                            />
                          </svg>
                          <span className="text-[8px] md:text-[10px] font-num">
                            {wordCount}
                          </span>
                          <span className="text-[8px] md:text-[10px] font-num text-white/30">
                            / {MAX_WORDS}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className={`flex-1 py-2 lg:py-3.5 px-5 border border-white/15 rounded-lg text-white/60 font-heading uppercase text-[10px] md:text-xs tracking-[0.15em] hover:bg-white/5 hover:border-white/25 hover:text-white/80 transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <svg
                        className="w-3.5 h-3.5 md:w-4 md:h-4"
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
                      {t("vote.sug.cancel")}
                    </button>

                    {/* Submit / Retry Button */}
                    <button
                      onClick={submitError ? handleRetry : handleSubmitSuggestion}
                      disabled={!suggestionText.trim() || isSubmitting}
                      className={`flex-1 py-2 lg:py-3.5 px-5 rounded-lg font-heading font-semibold uppercase text-[10px] md:text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 ${
                        suggestionText.trim() && !isSubmitting
                          ? submitError
                            ? "bg-gradient-to-r from-orange-500 via-orange-500 to-yellow-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.4)] hover:shadow-[0_0_35px_rgba(249,115,22,0.6)] hover:scale-[1.02] active:scale-[0.98]"
                            : "bg-gradient-to-r from-accet via-accet to-cyan-500 text-black shadow-[0_0_10px_rgba(0,243,255,0.4)] hover:shadow-[0_0_35px_rgba(0,243,255,0.6)] hover:scale-[1.02] active:scale-[0.98]"
                          : "bg-white/5 text-white/25 cursor-not-allowed border border-white/10"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>{t("vote.sug.submitting")}</span>
                        </>
                      ) : submitError ? (
                        <>
                          <svg
                            className="w-3.5 h-3.5 md:w-4 md:h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          <span>{t("vote.sug.retry") || "Retry"}</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3.5 h-3.5 md:w-4 md:h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                          <span>{t("vote.sug.submit")}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[8px] md:text-[9px] text-white/25 text-center mt-4 font-body">
                    {t("vote.sug.note")}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuggestionPopup;