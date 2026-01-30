import React, { useState, useEffect } from "react";
import useSound from "use-sound";
import click from "../assets/click2.wav";
import { useTranslation } from "react-i18next";

const DescriptionPopup = ({ isOpen, onClose, candidate, onOpenSuggestion }) => {
  const {t}= useTranslation()
  const [Click] = useSound(click, { volume: 0.1 });
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // ⭐ Just open suggestion - NO CLOSE
  const handleSuggestionClick = (e) => {
    e.stopPropagation();
    Click();
    onOpenSuggestion(candidate);
  };

  if (!isMounted) return null;

  return (
    <>
      <style>{`
        @keyframes descFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes descFadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        @keyframes expandWidth {
          0% {
            max-width: 0;
            opacity: 0;
            transform: scaleX(0.7);
          }
          60% { opacity: 1; }
          100% {
            max-width: 100%;
            opacity: 1;
            transform: scaleX(1);
          }
        }
        
        @keyframes collapseWidth {
          0% {
            max-width: 100%;
            opacity: 1;
            transform: scaleX(1);
          }
          40% { opacity: 0.7; }
          100% {
            max-width: 0;
            opacity: 0;
            transform: scaleX(0.7);
          }
        }
        
        @keyframes contentFadeIn {
          0% {
            opacity: 0;
            transform: translateX(-15px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes contentFadeOut {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(15px);
          }
        }

        .desc-popup-wrapper,
        .desc-popup-container,
        .desc-popup-content {
          will-change: transform, opacity;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
      `}</style>

      <div
        className="desc-popup-wrapper fixed inset-0 z-[150] flex items-center justify-center overflow-hidden"
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
        <div 
          className="absolute inset-0 bg-black/95 backdrop-blur-xl"
          style={{
            opacity: isAnimating && !isClosing ? 1 : 0,
            transition: isClosing 
              ? "opacity 0.35s ease-out" 
              : isAnimating 
                ? "opacity 0.4s ease-out 0.05s"
                : "none",
          }}
        />

        <div
          className="desc-popup-container relative z-10 w-[94%] sm:w-[92%] md:w-[90%] lg:w-[75%] xl:w-[65%] max-w-4xl mx-auto px-1"
          style={{
            maxHeight: "calc(100dvh - 32px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{
              animation: isClosing
                ? "collapseWidth 0.35s cubic-bezier(0.4, 0, 0.6, 1) forwards"
                : isAnimating
                  ? "expandWidth 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                  : "none",
              transformOrigin: "center center",
              opacity: isAnimating && !isClosing ? 1 : 0,
            }}
          >
            <div 
              className="absolute -inset-1 bg-accet/20 blur-2xl pointer-events-none"
              style={{
                opacity: isAnimating && !isClosing ? 0.5 : 0,
                transition: "opacity 0.5s ease-out 0.2s",
              }}
            />
 
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 z-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-accet to-transparent" />
              <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accet to-transparent" />
            </div>
            <div className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 z-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-accet to-transparent" />
              <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-accet to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 w-6 h-6 md:w-8 md:h-8 z-10 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-accet to-transparent" />
              <div className="absolute bottom-0 left-0 h-full w-px bg-gradient-to-t from-accet to-transparent" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 z-10 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-accet to-transparent" />
              <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-accet to-transparent" />
            </div>

            <div
              className="relative bg-gradient-to-b from-[#0a0a0f] via-[#05050a] to-[#0a0a0f] border border-accet/30 shadow-[0_0_80px_rgba(76,67,221,0.15)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-accet/30 scrollbar-track-transparent"
              style={{
                maxHeight: "calc(100dvh - 48px)",
              }}
            >
              <div className="sticky top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accet/60 to-transparent z-20" />

              <button
                onClick={handleClose}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-30 w-8 h-8 md:w-9 md:h-9 border border-white/20 bg-black/90 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 group rounded-sm"
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

              <div
                className="desc-popup-content p-4 pt-8 sm:p-5 sm:pt-10 md:p-6 md:pt-10 lg:p-8 lg:pt-12"
                style={{
                  animation: isClosing
                    ? "contentFadeOut 0.25s ease-out forwards"
                    : isAnimating
                      ? "contentFadeIn 0.5s ease-out 0.2s both"
                      : "none",
                }}
              >
                {/* Header Section */}
                <div className="flex flex-col items-center mb-5 md:mb-8">
                  {candidate?.party_logo && (
                    <div className="relative mb-4 md:mb-6">
                      <div className="absolute inset-0 bg-accet/20 rounded-full blur-2xl" />
                      <div className="relative">
                        <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 w-4 h-4 md:w-5 md:h-5 border-t border-l border-accet/50" />
                        <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-4 h-4 md:w-5 md:h-5 border-t border-r border-accet/50" />
                        <div className="absolute -bottom-2 -left-2 md:-bottom-3 md:-left-3 w-4 h-4 md:w-5 md:h-5 border-b border-l border-accet/50" />
                        <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 w-4 h-4 md:w-5 md:h-5 border-b border-r border-accet/50" />

                        <div className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-b from-white/5 to-transparent p-0.5 border border-accet/30 overflow-hidden">
                          <div className="w-full h-full rounded-full overflow-hidden bg-black/50 flex justify-center items-center">
                            <img
                              src={candidate?.leader_img}
                              alt={candidate?.party}
                              className="w-[92%] h-[92%] object-cover rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-heading uppercase font-bold text-center tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] text-white mb-1 px-2">
                    {candidate?.party}
                  </h2>

                  <div className="w-full mx-auto lg:-mt-9 my-2">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        {candidate?.party_logo && (
                          <img
                            src={candidate?.party_logo}
                            alt="Party Symbol"
                            className="w-6 h-6 md:w-8 md:h-8 object-contain "
                          />
                        )}
                        <div>
                          <p className="text-[8px] md:text-[9px] uppercase text-center md:text-start tracking-widest text-white/40 font-heading">
                            {t("vote.dis.founder")}
                          </p>
                          <p className="text-[10px] md:text-[11px] font-body font-normal text-white/80">
                            {candidate?.founder || "Party Founder"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3">
                        {candidate?.tagline_en && (
                          <div>
                            <p className="text-[10px] md:text-[11px] text-center lg:text-end font-tamil font-normal text-white/60">
                              {candidate?.tagline_ta}
                            </p>
                            <p className="text-[10px] md:text-[11px] text-center lg:text-end font-body font-normal text-white/60">
                              {candidate?.tagline_en}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-3 md:mt-5 w-full max-w-45 md:max-w-xs">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-accet/60 rotate-45" />
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
                  </div>
                </div>

                {/* Content Grid */}
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 lg:gap-0">
                  <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
                    <img
                      src="https://res.cloudinary.com/dfgyjzm7c/image/upload/v1768106397/ChatGPT_Image_Jan_10_2026_05_27_23_PM_xsdl5a.png"
                      alt="sengol"
                      className="h-64"
                    />
                  </div>

                  {/* About Party */}
                  <div className="lg:pr-10">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="w-6 h-6 md:w-8 md:h-8 border border-accet/30 bg-accet/5 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-3 h-3 md:w-4 md:h-4 text-accet"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[10px] md:text-xs lg:text-sm font-heading uppercase tracking-widest text-white font-semibold">
                          {t("vote.dis.about")}
                        </h3>
                        <div className="w-8 md:w-12 h-px bg-accet/40 mt-1" />
                      </div>
                    </div>

                    <div className="relative pl-10 md:pl-12 lg:pl-4 lg:border-l lg:border-white/5">
                      <div className="lg:hidden block absolute left-4 top-0 bottom-0 -translate-x-1/2">
                        <img
                          src="https://res.cloudinary.com/dfgyjzm7c/image/upload/v1768106397/ChatGPT_Image_Jan_10_2026_05_27_23_PM_xsdl5a.png"
                          alt="sengol"
                          className="h-40 md:h-44"
                        />
                      </div>
                      <p className="text-[11px] sm:text-[12px] md:text-[13px] leading-relaxed text-white font-light font-tamil">
                        {candidate?.discription}
                      </p>

                      <div className="flex items-center gap-4 md:gap-6 mt-4 md:mt-5">
                        <div className="text-start">
                          <p className="text-base md:text-lg lg:text-xl font-num font-bold text-white">
                            {candidate?.year}
                          </p>
                          <p className="text-[8px] md:text-[9px] uppercase tracking-wider text-white/30 font-num">
                            {t("vote.dis.founded")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:hidden w-full flex items-center justify-center gap-3 md:gap-4 py-2 md:py-3">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-accet/40 rotate-45" />
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
                  </div>

                  {/* Promises */}
                  <div className="lg:pl-12">
                    <div className="flex items-center lg:justify-end gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="lg:hidden w-6 h-6 md:w-8 md:h-8 border border-accet/30 bg-accet/5 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-3 h-3 md:w-4 md:h-4 text-accet"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="lg:text-right">
                        <h3 className="text-[10px] md:text-xs lg:text-sm font-heading uppercase tracking-widest text-white font-semibold">
                          {t("vote.dis.promises")}
                        </h3>
                        <div className="w-8 md:w-12 h-px bg-accet/40 mt-1 lg:ml-auto" />
                      </div>
                      <div className="hidden lg:flex w-8 h-8 border border-accet/30 bg-accet/5 items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-accet"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="relative pl-10 md:pl-12 lg:pl-0 lg:pr-4 border-l-0 lg:border-l-0 lg:border-r border-white/5">
                      <div className="lg:hidden block absolute left-4 top-0 bottom-0 -translate-x-1/2">
                        <img
                          src="https://res.cloudinary.com/dfgyjzm7c/image/upload/v1768106397/ChatGPT_Image_Jan_10_2026_05_27_23_PM_xsdl5a.png"
                          alt="sengol"
                          className="h-40 md:h-44"
                        />
                      </div>
                      <ul className="space-y-2 md:space-y-3">
                        {(
                          candidate?.promises || [
                            "அம்மா உணவகம்",
                            "இலவச பேருந்து பயணம்",
                            "மின்சாரம் மானியம்",
                            "கல்வி உதவித்தொகை",
                            "விவசாயிகளுக்கு கடன் தள்ளுபடி",
                          ]
                        ).map((promise, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 md:gap-3 group"
                          >
                            <span className="flex-shrink-0 w-5 h-5 border border-white/10 bg-white/5 flex items-center justify-center text-[9px] font-num text-white group-hover:border-accet/40 group-hover:text-accet transition-all duration-300">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[11px] sm:text-[12px] md:text-[13px] text-white font-normal group-hover:text-white/70 transition-colors duration-300 font-tamil leading-relaxed">
                              {promise}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Suggestion Button - NO CLOSE */}
                <div className="mt-4 md:mt-4 pt-3 md:pt-4 border-t border-white/5"/>
                <button
                  onClick={handleSuggestionClick}
                  className="w-full lg:w-[40%] mx-auto flex justify-center items-center relative text-[10px] md:text-[12px] px-4 py-2.5 bg-gradient-to-r from-accet/40 to-accet/60 text-white rounded-lg uppercase font-heading font-semibold tracking-wide mt-2 hover:from-accet/60 hover:to-accet/80 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,243,255,0.5)] group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative flex items-center gap-2">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    {t("vote.dis.suggestion")}
                  </span>
                </button>
              </div>

              <div className="sticky bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accet/60 to-transparent z-20" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DescriptionPopup;