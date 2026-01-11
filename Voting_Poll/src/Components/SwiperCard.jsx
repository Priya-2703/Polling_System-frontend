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

  // Popup States
  const [showPopup, setShowPopup] = useState(false);
  const [popupCandidate, setPopupCandidate] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!swiperReady) return;
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.init();
    swiper.navigation.update();
  }, [swiperReady]);

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
      {/* ========== DESCRIPTION POPUP MODAL - FIXED ========== */}
      {showPopup && popupCandidate && (
        <div
          className={`fixed inset-0 z-100 flex items-center justify-center overflow-hidden ${
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

          {/* Popup Container - Properly Centered */}
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
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-accet to-transparent" />
                <div className="absolute top-0 left-0 h-full w-px bg-linear-to-b from-accet to-transparent" />
              </div>

              {/* Corner Accents - Top Right */}
              <div className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-px bg-linear-to-l from-accet to-transparent" />
                <div className="absolute top-0 right-0 h-full w-px bg-linear-to-b from-accet to-transparent" />
              </div>

              {/* Main Popup Card - SCROLLABLE CONTAINER */}
              <div
                className="relative bg-linear-to-b from-[#0a0a0f] via-[#05050a] to-[#0a0a0f] border border-accet/30 shadow-[0_0_80px_rgba(76,67,221,0.15)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-accet/30 scrollbar-track-transparent"
                style={{
                  maxHeight: "calc(100dvh - 48px)",
                }}
              >
                {/* Top Accent Line */}
                <div className="sticky top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accet/60 to-transparent z-20" />

                {/* Close Button - Fixed in corner */}
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
                        {/* Subtle Glow */}
                        <div className="absolute inset-0 bg-accet/20 rounded-full blur-2xl" />

                        {/* Logo Container */}
                        <div className="relative">
                          {/* Corner Brackets */}
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

                    {/* Decorative Line */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-3 md:mt-5 w-full max-w-[180px] md:max-w-xs">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
                      <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-accet/60 rotate-45" />
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
                    </div>
                  </div>

                  {/* Content Grid with Center Divider */}
                  <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 lg:gap-0">
                    {/* Center Divider - Only visible on lg screens */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
                      <img
                        src="https://res.cloudinary.com/dfgyjzm7c/image/upload/v1768106397/ChatGPT_Image_Jan_10_2026_05_27_23_PM_xsdl5a.png"
                        alt="sengol"
                        className="h-80"
                      />
                      {/* <div className="w-px h-full bg-linear-to-b from-transparent via-white/10 to-transparent relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-accet rotate-45" />
                        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-1 h-1 bg-white/20 rounded-full" />
                        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-1 h-1 bg-white/20 rounded-full" />
                      </div> */}
                    </div>

                    {/* About Party Section */}
                    <div className="lg:pr-10">
                      {/* Section Header */}
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

                      {/* About Content */}
                      <div className="relative pl-6 md:pl-4 lf:border-l lg:border-white/5">
                        <div className="lg:hidden block absolute left-1 top-0 bottom-0 -translate-x-1/2">
                          <img
                            src="https://res.cloudinary.com/dfgyjzm7c/image/upload/v1768106398/Google_AI_Studio_2026-01-11T04_31_49.507Z_buyqxc.png"
                            alt="sengol"
                            className="h-36"
                          />
                        </div>
                        <p className="text-[11px] sm:text-[12px] md:text-[13px] leading-relaxed text-white font-light font-tamil">
                          {popupCandidate.discription}
                        </p>

                        {/* Party Stats */}
                        <div className="flex items-center gap-4 md:gap-6 mt-4 md:mt-5">
                          <div className="text-center">
                            <p className="text-base md:text-lg lg:text-xl font-num font-bold text-white">
                              {popupCandidate.year}
                            </p>
                            <p className="text-[8px] md:text-[9px] uppercase tracking-wider text-white/30 font-num">
                              Founded
                            </p>
                          </div>
                          {/* <div className="w-px h-6 md:h-8 bg-white/10" />
                          <div className="text-center">
                            <p className="text-base md:text-lg lg:text-xl font-heading font-bold text-white">
                              234
                            </p>
                            <p className="text-[8px] md:text-[9px] uppercase tracking-wider text-white/30 font-heading">
                              Constituencies
                            </p>
                          </div> */}
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
                      {/* Section Header */}
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

                      {/* Promises List */}
                      <div className="relative pl-6 md:pl-4 lg:pl-0 lg:pr-4 border-l-0 lg:border-l-0 lg:border-r border-white/5">
                        <div className="lg:hidden block absolute left-1 top-0 bottom-0 -translate-x-1/2">
                          <img
                            src="https://res.cloudinary.com/dfgyjzm7c/image/upload/v1768106398/Google_AI_Studio_2026-01-11T04_31_49.507Z_buyqxc.png"
                            alt="sengol"
                            className="h-36"
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

      {/* Swiper Container */}
      <div className="relative w-full px-2 sm:px-4">
        <div
          className="hidden lg:block absolute left-0 xl:left-0 top-0 bottom-0 w-32 xl:w-48 2xl:w-64 z-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 100%)",
          }}
        />

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
          className="overflow-visible! py-12!"
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
                      <div
                        className={`absolute -inset-1 bg-linear-to-r from-accet via-[#017474] to-accet rounded-3xl blur-lg transition-all duration-500 ${
                          isSelected && isActive
                            ? "opacity-50"
                            : isActive
                            ? "opacity-0 group-hover:opacity-30"
                            : "opacity-0"
                        }`}
                      />

                      <div
                        className={`relative w-70 md:w-70 lg:w-80 p-4 rounded-2xl backdrop-blur-xl transition-all duration-500 ${
                          isSelected && isActive
                            ? "bg-linear-to-b from-accet/20 via-black/80 to-black/90 border-2 border-accet shadow-[0_0_40px_rgba(95,98,233,0.2)]"
                            : "bg-shade border-2 border-accet/30 hover:border-accet/60"
                        }`}
                      >
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
                              <div className="relative w-20 h-20 rounded-full bg-linear-to-b from-gray-800 to-black p-0.5 border-2 border-accet/50 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)]">
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

                        <div
                          className={`flex flex-col justify-center items-center ${
                            item.party ? "mt-10" : "mt-3"
                          }`}
                        >
                          <div className="relative">
                            <div
                              className={`absolute -inset-2 bg-gradient-to-r from-accet/40 via-[#017474]/40 to-accet/40 rounded-2xl blur-xl transition-all duration-500 ${
                                isSelected && isActive
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-40"
                              }`}
                            />
                            <div className="relative p-0.75 overflow-hidden rounded-2xl bg-linear-to-br from-accet/50 via-purple-400 to-accet/50">
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
                            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accet/60 rounded-tl-lg" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-accet/60 rounded-tr-lg" />
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-accet/60 rounded-bl-lg" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accet/60 rounded-br-lg" />
                          </div>

                          <div
                            className={`text-center mt-4 ${
                              item.party ? "mb-0" : "mb-2"
                            }`}
                          >
                            <h1 className="text-[16px] px-2 font-heading uppercase font-black tracking-wide text-transparent bg-linear-to-r from-accet via-blue-300 to-blue-800 bg-clip-text leading-5">
                              {item.name}
                            </h1>
                            {item.party && (
                              <div className="flex items-center justify-center gap-2 my-2">
                                <div className="h-px w-8 bg-linear-to-r from-transparent to-accet/50" />
                                <div className="w-1.5 h-1.5 bg-accet/60 rounded-full" />
                                <div className="h-px w-8 bg-linear-to-l from-transparent to-accet/50" />
                              </div>
                            )}
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-[15px] sm:text-[18px] font-heading uppercase font-black tracking-widest text-transparent bg-linear-to-r from-accet to-blue-300 bg-clip-text">
                                {item.party}
                              </span>
                            </div>
                          </div>

                          {/* DESCRIPTION BUTTON */}
                          {item.party && (
                            <button
                              onClick={(e) => handleDescriptionClick(e, item)}
                              className="py-2.5 tracking-widest font-bold  w-full bg-linear-to-r from-accet/30 to-accet/70 font-heading uppercase text-[13px] mt-2 rounded-b-lg hover:from-accet/50 hover:to-accet/90 transition-all duration-300 hover:shadow-[0px_0px_40px_rgba(95,98,233,0.8)]"
                            >
                              Description
                            </button>
                          )}
                        </div>

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
