import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import useSound from "use-sound";
import beep from "../assets/beep.wav";
import click from "../assets/click2.wav";
import { useTranslation } from "react-i18next";

const SwiperCard = ({
  candidates,
  selectedCandidate,
  setSelectedCandidate,
}) => {
  const { t } = useTranslation();
  const [Click] = useSound(click, { volume: 0.2 });
  const [playClick] = useSound(beep, { volume: 0.3 });
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Description Popup States
  const [showPopup, setShowPopup] = useState(false);
  const [popupCandidate, setPopupCandidate] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  // ========== Suggestion Popup States ==========
  const [showSuggestionPopup, setShowSuggestionPopup] = useState(false);
  const [suggestionCandidate, setSuggestionCandidate] = useState(null);
  const [isSuggestionClosing, setIsSuggestionClosing] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const MAX_WORDS = 300;

  // Quick suggestion tags
  const quickTags = [
    "நல்ல திட்டங்கள்",
    "மேம்படுத்த வேண்டும்",
    "ஆதரவு",
    "கருத்து",
    "வளர்ச்சி",
    "நன்றி"
  ];

  useEffect(() => {
    if (!swiperReady) return;
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.init();
    swiper.navigation.update();
  }, [swiperReady]);

  // ========== Word Count Handler ==========
  const handleSuggestionChange = (e) => {
    const text = e.target.value;
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    
    if (words.length <= MAX_WORDS) {
      setSuggestionText(text);
      setWordCount(words.length);
    }
  };

  // ========== Add Quick Tag ==========
  const handleAddTag = (tag) => {
    Click();
    const newText = suggestionText + (suggestionText ? " " : "") + tag;
    const words = newText.trim().split(/\s+/);
    if (words.length <= MAX_WORDS) {
      setSuggestionText(newText);
      setWordCount(words.length);
      textareaRef.current?.focus();
    }
  };

  // ========== Open Suggestion Popup ==========
  const handleSuggestionClick = (e, candidate) => {
    e.stopPropagation();
    Click();
    setSuggestionCandidate(candidate);
    setShowSuggestionPopup(true);
    setIsSuggestionClosing(false);
    setSuggestionText("");
    setWordCount(0);
    setSubmitSuccess(false);
    document.body.style.overflow = "hidden";
    
    // Focus textarea after animation
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 500);
  };

  // ========== Close Suggestion Popup ==========
  const closeSuggestionPopup = () => {
    Click();
    setIsSuggestionClosing(true);
    setTimeout(() => {
      setShowSuggestionPopup(false);
      setSuggestionCandidate(null);
      setIsSuggestionClosing(false);
      setSuggestionText("");
      setWordCount(0);
      setSubmitSuccess(false);
      setIsSubmitting(false);
      document.body.style.overflow = "auto";
    }, 300);
  };

  // ========== Submit Suggestion ==========
  const handleSubmitSuggestion = async () => {
    if (!suggestionText.trim() || isSubmitting) return;
    
    Click();
    setIsSubmitting(true);
    
    // Simulate API call - Replace with your actual API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Log the data - Replace with your API call
      console.log({
        partyId: suggestionCandidate?.id,
        partyName: suggestionCandidate?.party,
        suggestion: suggestionText,
        wordCount: wordCount,
        timestamp: new Date().toISOString()
      });
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        closeSuggestionPopup();
      }, 2500);
    } catch (error) {
      console.error("Submission failed:", error);
      setIsSubmitting(false);
    }
  };

  // ========== Description Popup Handlers ==========
  const handleDescriptionClick = (e, candidate) => {
    e.stopPropagation();
    Click();
    setPopupCandidate(candidate);
    setShowPopup(true);
    setIsClosing(false);
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    Click();
    setIsClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setPopupCandidate(null);
      setIsClosing(false);
      document.body.style.overflow = "auto";
    }, 300);
  };

  // ========== Card Click Handler ==========
  const handleCardClick = (candidate, isActive) => {
    Click();
    if (isActive) {
      if (selectedCandidate?.id === candidate.id) {
        setSelectedCandidate(null);
      } else {
        setSelectedCandidate(candidate);
      }
    }
  };

  return (
    <div className="w-full max-h-dvh bg-transparent relative">
      
      {/* ==================== SUGGESTION POPUP MODAL ==================== */}
      {showSuggestionPopup && suggestionCandidate && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          onClick={closeSuggestionPopup}
          style={{
            height: "100dvh",
            width: "100vw",
            minHeight: "-webkit-fill-available",
            animation: isSuggestionClosing
              ? "suggestionFadeOut 0.3s ease-out forwards"
              : "suggestionFadeIn 0.4s ease-out forwards",
          }}
        >
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-accet/20"
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `suggestionFloat ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>

          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />

          {/* Radial Gradient Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(76,67,221,0.2) 0%, transparent 60%)"
            }}
          />

          {/* Main Popup Container */}
          <div
            className="relative z-10 w-[94%] sm:w-[90%] md:w-[80%] lg:w-[55%] xl:w-[45%] max-w-xl mx-auto"
            style={{
              maxHeight: "calc(100dvh - 40px)",
              animation: isSuggestionClosing
                ? "suggestionScaleDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                : "suggestionScaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Outer Glow Effect */}
            <div className="absolute -inset-3 bg-accet/15 blur-3xl pointer-events-none animate-pulse" />

            {/* Corner Decorations */}
            <div className="absolute -top-1 -left-1 w-10 h-10 z-20 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accet via-cyan-400 to-transparent" />
              <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-accet via-cyan-400 to-transparent" />
              <div className="absolute top-2 left-2 w-2 h-2 bg-accet rounded-full animate-ping" />
            </div>
            <div className="absolute -top-1 -right-1 w-10 h-10 z-20 pointer-events-none">
              <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-accet via-cyan-400 to-transparent" />
              <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-accet via-cyan-400 to-transparent" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-10 h-10 z-20 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-accet via-cyan-400 to-transparent" />
              <div className="absolute bottom-0 left-0 h-full w-[2px] bg-gradient-to-t from-accet via-cyan-400 to-transparent" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-10 h-10 z-20 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-accet via-cyan-400 to-transparent" />
              <div className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-accet via-cyan-400 to-transparent" />
              <div className="absolute bottom-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
            </div>

            {/* Main Card Container */}
            <div className="relative bg-gradient-to-b from-[#0d0d18] via-[#080810] to-[#0d0d18] border border-accet/50 rounded-xl shadow-[0_0_80px_rgba(76,67,221,0.25)] overflow-hidden">
              
              {/* Top Gradient Line */}
              <div className="h-[2px] bg-gradient-to-r from-transparent via-accet to-transparent" />

              {/* Scanning Line Animation */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div 
                  className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accet/60 to-transparent"
                  style={{
                    animation: "suggestionScan 4s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Close Button */}
              <button
                onClick={closeSuggestionPopup}
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
              <div className="p-5 md:p-8 overflow-y-auto" style={{ maxHeight: "calc(100dvh - 80px)" }}>
                
                {/* Header Section */}
                <div className="flex flex-col items-center mb-6">
                  
                  {/* Party Logo with Animated Rings */}
                  <div className="relative mb-5">
                    {/* Outer Rotating Ring */}
                    <div 
                      className="absolute -inset-4 border-2 border-dashed border-accet/30 rounded-full"
                      style={{ animation: "suggestionSpin 12s linear infinite" }}
                    />
                    {/* Inner Rotating Ring */}
                    <div 
                      className="absolute -inset-6 border border-cyan-400/20 rounded-full"
                      style={{ animation: "suggestionSpin 18s linear infinite reverse" }}
                    />
                    
                    {/* Logo Glow */}
                    <div className="absolute inset-0 bg-accet/40 rounded-full blur-2xl animate-pulse" />
                    
                    {/* Logo Container */}
                    <div className="relative w-18 h-18 md:w-22 md:h-22 rounded-full bg-gradient-to-b from-accet/30 to-black p-1 border-2 border-accet/60 overflow-hidden shadow-[0_0_30px_rgba(76,67,221,0.4)]">
                      <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                        <img
                          src={suggestionCandidate.party_logo || suggestionCandidate.leader_img}
                          alt={suggestionCandidate.party}
                          className="w-[90%] h-[90%] object-cover rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Title Section */}
                  <div className="text-center">
                    <h2 className="text-base md:text-xl font-heading uppercase font-bold tracking-[0.2em] text-transparent bg-gradient-to-r from-accet via-cyan-300 to-accet bg-clip-text mb-2">
                      Share Your Thoughts
                    </h2>
                    <p className="text-xs md:text-sm text-white/50 font-body flex items-center justify-center gap-2">
                      <span>About</span>
                      <span className="text-accet font-semibold px-2 py-0.5 bg-accet/10 rounded border border-accet/30">
                        {suggestionCandidate.party}
                      </span>
                    </p>
                  </div>

                  {/* Decorative Divider */}
                  <div className="flex items-center justify-center gap-3 mt-5 w-full max-w-xs">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-accet/40" />
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-accet rounded-full animate-pulse" />
                      <div className="w-1.5 h-1.5 bg-accet/60 rounded-full animate-pulse" style={{ animationDelay: "0.15s" }} />
                      <div className="w-1.5 h-1.5 bg-accet/30 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-accet/40" />
                  </div>
                </div>

                {/* ===== Success State ===== */}
                {submitSuccess ? (
                  <div 
                    className="flex flex-col items-center justify-center py-10"
                    style={{ animation: "suggestionScaleUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                  >
                    {/* Success Icon Container */}
                    <div className="relative mb-6">
                      {/* Success Glow */}
                      <div className="absolute inset-0 bg-green-500/40 rounded-full blur-3xl animate-pulse" />
                      
                      {/* Success Circle */}
                      <div className="relative w-24 h-24 bg-gradient-to-b from-green-500/20 to-green-500/5 border-2 border-green-500/60 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                        {/* Checkmark with animation */}
                        <svg
                          className="w-12 h-12 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ 
                            strokeDasharray: 50,
                            strokeDashoffset: 0,
                            animation: "suggestionCheckmark 0.6s ease-out 0.2s both" 
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
                      
                      {/* Celebration Particles */}
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-green-400 rounded-full"
                          style={{
                            top: "50%",
                            left: "50%",
                            animation: `suggestionCelebrate 0.8s ease-out ${i * 0.1}s forwards`,
                            transform: `rotate(${i * 45}deg)`,
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Success Message */}
                    <h3 className="text-2xl font-heading font-bold text-green-400 mb-2 tracking-wider">
                      Thank You!
                    </h3>
                    <p className="text-sm text-white/60 font-body text-center max-w-xs">
                      Your valuable suggestion has been submitted successfully. We appreciate your feedback!
                    </p>
                    
                    {/* Auto close indicator */}
                    <div className="mt-6 flex items-center gap-2 text-white/30 text-xs">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-green-400 rounded-full animate-spin" />
                      <span>Closing automatically...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* ===== Textarea Section ===== */}
                    <div className="relative mb-5">
                      {/* Focus Glow Effect */}
                      <div 
                        className={`absolute -inset-1 bg-gradient-to-r from-accet via-cyan-400 to-accet rounded-xl blur-md transition-all duration-500 ${
                          isFocused ? "opacity-30" : "opacity-0"
                        }`}
                      />
                      
                      {/* Textarea Container */}
                      <div className={`relative border rounded-xl transition-all duration-300 overflow-hidden ${
                        isFocused 
                          ? "border-accet/70 bg-accet/5 shadow-[0_0_30px_rgba(76,67,221,0.15)]" 
                          : "border-white/15 bg-white/5"
                      }`}>
                        
                        {/* Header Bar */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                          <div className="flex items-center gap-2">
                            {/* Status Indicator */}
                            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              isFocused ? "bg-accet shadow-[0_0_10px_rgba(76,67,221,0.8)] animate-pulse" : "bg-white/30"
                            }`} />
                            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/50 font-heading">
                              Your Suggestion
                            </span>
                          </div>
                          
                          {/* Edit Icon */}
                          <div className="flex items-center gap-2">
                            <svg className={`w-4 h-4 transition-colors duration-300 ${isFocused ? "text-accet" : "text-white/30"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Textarea */}
                        <textarea
                          ref={textareaRef}
                          value={suggestionText}
                          onChange={handleSuggestionChange}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          placeholder="உங்கள் கருத்துக்களை இங்கே பகிரவும்...&#10;Share your valuable thoughts and suggestions here..."
                          className="w-full h-36 md:h-44 px-4 py-4 bg-transparent text-white/90 text-sm md:text-base font-tamil placeholder:text-white/25 focus:outline-none resize-none scrollbar-thin scrollbar-thumb-accet/40 scrollbar-track-transparent leading-7"
                        />
                        
                        {/* Footer Bar with Word Counter */}
                        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-black/30">
                          {/* Progress Bar */}
                          <div className="flex items-center gap-3">
                            <div 
                              className="h-1.5 bg-white/10 rounded-full overflow-hidden"
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
                                style={{ width: `${Math.min((wordCount / MAX_WORDS) * 100, 100)}%` }}
                              />
                            </div>
                            
                            {wordCount > 0 && (
                              <span className={`text-[10px] transition-colors duration-300 ${
                                wordCount >= MAX_WORDS 
                                  ? "text-red-400" 
                                  : wordCount >= MAX_WORDS * 0.8 
                                    ? "text-yellow-400" 
                                    : "text-white/40"
                              }`}>
                                {wordCount >= MAX_WORDS ? "Limit reached" : ""}
                              </span>
                            )}
                          </div>
                          
                          {/* Word Count Display */}
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-all duration-300 ${
                            wordCount >= MAX_WORDS 
                              ? "border-red-500/40 bg-red-500/10 text-red-400" 
                              : wordCount >= MAX_WORDS * 0.8 
                                ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400" 
                                : "border-white/10 bg-white/5 text-white/50"
                          }`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <span className="text-xs font-num font-semibold">
                              {wordCount}
                            </span>
                            <span className="text-[10px] text-white/30">/ {MAX_WORDS}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ===== Quick Tags Section ===== */}
                    <div className="mb-6">
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3 font-heading flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Quick Add
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {quickTags.map((tag, index) => (
                          <button
                            key={index}
                            onClick={() => handleAddTag(tag)}
                            className="group px-3 py-1.5 text-[10px] md:text-[11px] font-tamil bg-white/5 border border-white/10 rounded-full text-white/50 hover:bg-accet/20 hover:border-accet/50 hover:text-white transition-all duration-300 flex items-center gap-1.5"
                          >
                            <span className="text-accet/60 group-hover:text-accet transition-colors">+</span>
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ===== Action Buttons ===== */}
                    <div className="flex gap-3">
                      {/* Cancel Button */}
                      <button
                        onClick={closeSuggestionPopup}
                        className="flex-1 py-3.5 px-5 border border-white/15 rounded-xl text-white/60 font-heading uppercase text-[11px] md:text-xs tracking-[0.15em] hover:bg-white/5 hover:border-white/25 hover:text-white/80 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                      
                      {/* Submit Button */}
                      <button
                        onClick={handleSubmitSuggestion}
                        disabled={!suggestionText.trim() || isSubmitting}
                        className={`flex-1 py-3.5 px-5 rounded-xl font-heading uppercase text-[11px] md:text-xs tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2 ${
                          suggestionText.trim() && !isSubmitting
                            ? "bg-gradient-to-r from-accet via-accet to-cyan-500 text-white shadow-[0_0_25px_rgba(76,67,221,0.4)] hover:shadow-[0_0_40px_rgba(76,67,221,0.6)] hover:scale-[1.02] active:scale-[0.98]"
                            : "bg-white/5 text-white/25 cursor-not-allowed border border-white/10"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            {/* Loading Spinner */}
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span>Submit</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Privacy Note */}
                    <p className="text-[9px] text-white/25 text-center mt-4 font-body">
                      Your feedback is anonymous and helps improve our services.
                    </p>
                  </>
                )}
              </div>

              {/* Bottom Gradient Line */}
              <div className="h-[2px] bg-gradient-to-r from-transparent via-accet to-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* ==================== DESCRIPTION POPUP MODAL ==================== */}
      {showPopup && popupCandidate && (
        <div
          className={`fixed inset-0 z-[150] flex items-center justify-center overflow-hidden ${
            isClosing ? "animate-fade-out" : "animate-fade-in"
          }`}
          onClick={closePopup}
          style={{
            height: "100dvh",
            width: "100vw",
            minHeight: "-webkit-fill-available",
            animation: isClosing
              ? "fadeIn 0.3s ease-out reverse forwards"
              : undefined,
          }}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

          {/* Popup Container */}
          <div
            className="relative z-10 w-[94%] sm:w-[92%] md:w-[85%] lg:w-[75%] xl:w-[65%] max-w-4xl mx-auto px-1"
            style={{
              maxHeight: "calc(100dvh - 32px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Width Expanding Wrapper */}
            <div
              className={`relative w-full ${
                isClosing ? "" : "animate-expand-width"
              }`}
              style={{
                animation: isClosing
                  ? "expandWidth 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse forwards"
                  : undefined,
              }}
            >
              {/* Subtle Outer Glow */}
              <div className="absolute -inset-1 bg-accet/20 blur-2xl opacity-50 pointer-events-none" />

              {/* Corner Accents - Top Left */}
              <div className="absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 z-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-accet to-transparent" />
                <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accet to-transparent" />
              </div>

              {/* Corner Accents - Top Right */}
              <div className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-accet to-transparent" />
                <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-accet to-transparent" />
              </div>

              {/* Main Popup Card */}
              <div
                className="relative bg-gradient-to-b from-[#0a0a0f] via-[#05050a] to-[#0a0a0f] border border-accet/30 shadow-[0_0_80px_rgba(76,67,221,0.15)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-accet/30 scrollbar-track-transparent"
                style={{
                  maxHeight: "calc(100dvh - 48px)",
                }}
              >
                {/* Top Accent Line */}
                <div className="sticky top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accet/60 to-transparent z-20" />

                {/* Close Button */}
                <button
                  onClick={closePopup}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-30 w-8 h-8 md:w-9 md:h-9 border border-white/20 bg-black/90 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 hover:border-accet/50 transition-all duration-300 group rounded-sm"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-white/60 group-hover:text-white transition-colors"
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

                {/* Content Container */}
                <div className="p-4 pt-8 sm:p-5 sm:pt-10 md:p-6 md:pt-10 lg:p-8 lg:pt-12 animate-content-fade">
                  {/* Header Section */}
                  <div className="flex flex-col items-center mb-5 md:mb-8">
                    {/* Party Logo */}
                    {popupCandidate.party_logo && (
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
                                src={popupCandidate.leader_img}
                                alt={popupCandidate.party}
                                className="w-[92%] h-[92%] object-cover rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Party Name */}
                    <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-heading uppercase font-bold text-center tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] text-white mb-1 px-2">
                      {popupCandidate.party}
                    </h2>

                    {/* Suggestion Button - Opens Suggestion Popup */}
                    <button 
                      onClick={(e) => handleSuggestionClick(e, popupCandidate)}
                      className="relative text-[10px] md:text-[12px] px-4 py-2.5 bg-gradient-to-r from-accet/40 to-accet/60 text-white rounded-lg uppercase font-heading font-semibold tracking-wide mt-2 hover:from-accet/60 hover:to-accet/80 transition-all duration-300 hover:shadow-[0_0_25px_rgba(76,67,221,0.5)] group overflow-hidden"
                    >
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <span className="relative flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Suggestion About Party
                      </span>
                    </button>

                    {/* Decorative Line */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-3 md:mt-5 w-full max-w-45 md:max-w-xs">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
                      <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-accet/60 rotate-45" />
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
                    </div>
                  </div> 

                  {/* Content Grid */}
                  <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 lg:gap-0">
                    {/* Center Divider */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
                      <img
                        src="https://res.cloudinary.com/dfgyjzm7c/image/upload/v1768106397/ChatGPT_Image_Jan_10_2026_05_27_23_PM_xsdl5a.png"
                        alt="sengol"
                        className="h-64"
                      />
                    </div>

                    {/* About Party Section */}
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
                            About Party
                          </h3>
                          <div className="w-8 md:w-12 h-px bg-accet/40 mt-1" />
                        </div>
                      </div>

                      <div className="relative pl-10 md:pl-4 lg:border-l lg:border-white/5">
                        <div className="lg:hidden block absolute left-4 top-0 bottom-0 -translate-x-1/2">
                          <img
                            src="https://res.cloudinary.com/dfgyjzm7c/image/upload/v1768106397/ChatGPT_Image_Jan_10_2026_05_27_23_PM_xsdl5a.png"
                            alt="sengol"
                            className="h-40"
                          />
                        </div>
                        <p className="text-[11px] sm:text-[12px] md:text-[13px] leading-relaxed text-white font-light font-tamil">
                          {popupCandidate.discription}
                        </p>

                        <div className="flex items-center gap-4 md:gap-6 mt-4 md:mt-5">
                          <div className="text-center">
                            <p className="text-base md:text-lg lg:text-xl font-num font-bold text-white">
                              {popupCandidate.year}
                            </p>
                            <p className="text-[8px] md:text-[9px] uppercase tracking-wider text-white/30 font-num">
                              Founded
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Divider */}
                    <div className="lg:hidden w-full flex items-center justify-center gap-3 md:gap-4 py-2 md:py-3">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
                      <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-accet/40 rotate-45" />
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
                    </div>

                    {/* Party Promises Section */}
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
                            Key Promises
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

                      <div className="relative pl-10 md:pl-4 lg:pl-0 lg:pr-4 border-l-0 lg:border-l-0 lg:border-r border-white/5">
                        <div className="lg:hidden block absolute left-4 top-0 bottom-0 -translate-x-1/2">
                          <img
                            src="https://res.cloudinary.com/dfgyjzm7c/image/upload/v1768106397/ChatGPT_Image_Jan_10_2026_05_27_23_PM_xsdl5a.png"
                            alt="sengol"
                            className="h-40"
                          />
                        </div>
                        <ul className="space-y-2 md:space-y-3">
                          {(
                            popupCandidate.promises || [
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

                  {/* Footer Section */}
                  <div className="mt-4 md:mt-4 pt-3 md:pt-4 border-t border-white/5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        {popupCandidate.party_logo && (
                          <img
                            src={popupCandidate.party_logo}
                            alt="Party Symbol"
                            className="w-6 h-6 md:w-8 md:h-8 object-contain"
                          />
                        )}
                        <div>
                          <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/30 font-heading">
                            Founder
                          </p>
                          <p className="text-[10px] md:text-[11px] font-body font-normal text-white/60">
                            {popupCandidate.founder || "Party Founder"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3">
                        {popupCandidate.tagline_en && (
                          <div>
                            <p className="text-[10px] md:text-[11px] text-center lg:text-end font-tamil font-normal text-white/60">
                              {popupCandidate.tagline_ta}
                            </p>
                            <p className="text-[10px] md:text-[11px] text-center lg:text-end font-body font-normal text-white/60">
                              {popupCandidate.tagline_en || "Party Founder"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div className="sticky bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accet/60 to-transparent z-20" />
              </div>

              {/* Corner Accents - Bottom Left */}
              <div className="absolute bottom-0 left-0 w-6 h-6 md:w-8 md:h-8 z-10 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-accet to-transparent" />
                <div className="absolute bottom-0 left-0 h-full w-px bg-gradient-to-t from-accet to-transparent" />
              </div>

              {/* Corner Accents - Bottom Right */}
              <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 z-10 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-accet to-transparent" />
                <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-accet to-transparent" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SWIPER CONTAINER ==================== */}
      <div className="relative w-full px-2 sm:px-4">
        {/* Left Fade Gradient */}
        <div
          className="hidden lg:block absolute left-0 xl:left-0 top-0 bottom-0 w-32 xl:w-48 2xl:w-64 z-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* Right Fade Gradient */}
        <div
          className="hidden lg:block absolute right-0 top-0 bottom-0 w-32 xl:w-48 2xl:w-64 z-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 100%)",
          }}
        />

        <Swiper
          modules={[Navigation, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={candidates.length > 2}
          watchSlidesProgress={true}
          slideToClickedSlide={true}
          speed={600}
          slidesPerView={1.2}
          spaceBetween={20}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 120,
            modifier: 2,
            slideShadows: false,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setSwiperReady(true);
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          breakpoints={{
            480: { slidesPerView: 1.4, spaceBetween: 30 },
            640: { slidesPerView: 1.8, spaceBetween: 40 },
            768: { slidesPerView: 2.2, spaceBetween: 50 },
            1024: { slidesPerView: 2.5, spaceBetween: 60 },
            1280: { slidesPerView: 2.5, spaceBetween: 20 },
            1400: { slidesPerView: 3, spaceBetween: 80 },
          }}
          className="!overflow-visible !py-12"
        >
          {candidates.map((item, index) => {
            const isSelected = selectedCandidate?.id === item.id;
            const isHovered = hoveredIndex === index;

            return (
              <SwiperSlide key={item.id} className="!h-auto">
                {({ isActive, isPrev, isNext }) => (
                  <div
                    className="flex justify-center items-center transition-all duration-500 ease-out py-2"
                    style={{
                      transform: isActive
                        ? "perspective(1000px) rotateY(0deg) scale(1)"
                        : isPrev
                        ? "perspective(1000px) rotateY(12deg) scale(0.9)"
                        : isNext
                        ? "perspective(1000px) rotateY(-12deg) scale(0.9)"
                        : "perspective(1000px) rotateY(0deg) scale(0.85)",
                      opacity: isActive ? 1 : 0.6,
                    }}
                  >
                    <div
                      className={`relative group cursor-pointer transition-all duration-500 ${
                        isSelected && isActive ? "scale-[1.02]" : ""
                      } ${!isActive ? "pointer-events-none" : ""}`}
                      onClick={() => handleCardClick(item, isActive)}
                      onMouseEnter={() => isActive && setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Card Glow Effect */}
                      <div
                        className={`absolute -inset-1 bg-gradient-to-r from-accet via-[#017474] to-accet rounded-3xl blur-lg transition-all duration-500 ${
                          isSelected && isActive
                            ? "opacity-50"
                            : isActive
                            ? "opacity-0 group-hover:opacity-30"
                            : "opacity-0"
                        }`}
                      />

                      {/* Main Card */}
                      <div
                        className={`relative w-70 md:w-70 lg:w-80 p-4 rounded-2xl backdrop-blur-xl transition-all duration-500 ${
                          isSelected && isActive
                            ? "bg-gradient-to-b from-accet/20 via-black/80 to-black/90 border-2 border-accet shadow-[0_0_40px_rgba(95,98,233,0.2)]"
                            : "bg-shade border-2 border-accet/30 hover:border-accet/60"
                        }`}
                      >
                        {/* Selected Checkmark */}
                        {isSelected && isActive && (
                          <div className="absolute top-2 right-2 z-20">
                            <div className="relative">
                              <div className="absolute inset-0 bg-accet rounded-full blur-md animate-pulse" />
                              <div className="relative w-6 h-6 md:w-7 md:h-7 bg-accet rounded-full flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
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
                          </div>
                        )}

                        {/* Party Logo */}
                        {item.party_logo && (
                          <div className="absolute left-1/2 -translate-x-1/2 -top-10 z-10">
                            <div className="relative">
                              <div
                                className={`absolute inset-0 bg-accet/50 rounded-full blur-xl transition-all duration-500 ${
                                  isSelected && isActive
                                    ? "opacity-100 scale-110"
                                    : "opacity-0"
                                }`}
                              />
                              <div
                                className={`absolute -inset-1 border-2 border-accet/40 rounded-full transition-all duration-500 ${
                                  (isHovered || isSelected) && isActive
                                    ? "scale-110 opacity-100"
                                    : "scale-100 opacity-0"
                                }`}
                              />
                              <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-gray-800 to-black p-0.5 border-2 border-accet/50 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                                <div className="w-full h-full rounded-full overflow-hidden bg-shade flex justify-center items-center">
                                  <img
                                    src={item.party_logo}
                                    alt={item.party}
                                    className="w-[88%] h-[88%] object-cover rounded-full"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Card Content */}
                        <div
                          className={`flex flex-col justify-center items-center ${
                            item.party ? "mt-10" : "mt-3"
                          }`}
                        >
                          {/* Leader Image */}
                          <div className="relative">
                            <div
                              className={`absolute -inset-2 bg-gradient-to-r from-accet/40 via-[#017474]/40 to-accet/40 rounded-2xl blur-xl transition-all duration-500 ${
                                isSelected && isActive
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-40"
                              }`}
                            />
                            <div className="relative p-0.75 overflow-hidden rounded-2xl bg-gradient-to-br from-accet/50 via-cyan-400 to-accet/50">
                              <div className="rounded-xl overflow-hidden bg-black">
                                <img
                                  src={item.leader_img}
                                  alt={item.name}
                                  className={`h-52 w-52 sm:h-56 sm:w-56 object-cover transition-all duration-700 ${
                                    isHovered && isActive
                                      ? "scale-110"
                                      : "scale-100"
                                  }`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              </div>
                            </div>
                            {/* Corner Decorations */}
                            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accet/60 rounded-tl-lg" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-accet/60 rounded-tr-lg" />
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-accet/60 rounded-bl-lg" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accet/60 rounded-br-lg" />
                          </div>

                          {/* Name and Party */}
                          <div
                            className={`text-center mt-4 ${
                              item.party ? "mb-0" : "mb-2"
                            }`}
                          >
                            <h1 className="text-[16px] px-2 font-heading uppercase font-black tracking-wide text-transparent bg-gradient-to-r from-accet via-cyan-300 to-accet/80 bg-clip-text leading-5">
                              {item.name}
                            </h1>
                            {item.party && (
                              <div className="flex items-center justify-center gap-2 my-2">
                                <div className="h-px w-8 bg-gradient-to-r from-transparent to-accet/50" />
                                <div className="w-1.5 h-1.5 bg-accet/60 rounded-full" />
                                <div className="h-px w-8 bg-gradient-to-l from-transparent to-accet/50" />
                              </div>
                            )}
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-[15px] sm:text-[18px] font-heading uppercase font-black tracking-widest text-transparent bg-gradient-to-r from-accet to-cyan-300 bg-clip-text">
                                {item.party}
                              </span>
                            </div>
                          </div>

                          {/* Description Button */}
                          {item.party && (
                            <button
                              onClick={(e) => handleDescriptionClick(e, item)}
                              className="py-2.5 tracking-widest font-bold w-full bg-gradient-to-r from-accet/30 to-accet/70 font-heading uppercase text-[13px] mt-2 rounded-b-lg hover:from-accet/50 hover:to-accet/90 transition-all duration-300 hover:shadow-[0px_0px_40px_rgba(0,243,255,0.8)]"
                            >
                              Description
                            </button>
                          )}
                        </div>

                        {/* Tap to Select Hint */}
                        {isActive && !isSelected && (
                          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                            <p className="text-[8px] text-white/80 tracking-widest font-body uppercase animate-pulse">
                              {t("messages.tapToSelect")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Navigation Buttons */}
        <button
          onClick={() => playClick()}
          ref={prevRef}
          aria-label="Previous"
          className="absolute top-1/2 -translate-y-1/2 left-0 sm:left-2 lg:left-16 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-md border border-accet/30 lg:border-accet flex justify-center items-center hover:bg-accet/20 hover:border-accet/60 hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-accet"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={() => playClick()}
          ref={nextRef}
          aria-label="Next"
          className="absolute top-1/2 -translate-y-1/2 right-0 sm:right-2 lg:right-16 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-md border border-accet/30 lg:border-accet flex justify-center items-center hover:bg-accet/20 hover:border-accet/60 hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-accet"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SwiperCard;