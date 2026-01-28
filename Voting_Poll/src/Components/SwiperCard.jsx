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
import SuggestionPopup from "./SuggestionPopup";
import DescriptionPopup from "./DescriptionPopup";

const SwiperCard = ({
  candidates,
  selectedCandidate,
  setSelectedCandidate,
}) => {
  const { t, i18n } = useTranslation();
  const [Click] = useSound(click, { volume: 0.2 });
  const [playClick] = useSound(beep, { volume: 0.3 });
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Popup States
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);
  const [showSuggestionPopup, setShowSuggestionPopup] = useState(false);
  const [selectedPopupCandidate, setSelectedPopupCandidate] = useState(null);

  useEffect(() => {
    if (!swiperReady) return;
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.init();
    swiper.navigation.update();
  }, [swiperReady]);

  // ========== Popup Handlers ==========
  const handleDescriptionClick = (e, candidate) => {
    e.stopPropagation();
    Click();
    setSelectedPopupCandidate(candidate);
    setShowDescriptionPopup(true);
  };

  const handleCloseDescriptionPopup = () => {
    setShowDescriptionPopup(false);
    setSelectedPopupCandidate(null);
  };

  const handleOpenSuggestionFromDescription = (candidate) => {
    setSelectedPopupCandidate(candidate);
    setShowSuggestionPopup(true);
  };

  const handleCloseSuggestionPopup = () => {
    setShowSuggestionPopup(false);
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
      {/* Suggestion Popup */}
      <SuggestionPopup
        isOpen={showSuggestionPopup}
        onClose={handleCloseSuggestionPopup}
        candidate={selectedPopupCandidate}
      />

      {/* Description Popup */}
      <DescriptionPopup
        isOpen={showDescriptionPopup}
        onClose={handleCloseDescriptionPopup}
        candidate={selectedPopupCandidate}
        onOpenSuggestion={handleOpenSuggestionFromDescription}
      />

      {/* ==================== SWIPER CONTAINER ==================== */}
      <div className="relative w-full px-2 sm:px-4">
        {/* Left Fade Gradient */}
        <div
          className="hidden lg:block absolute left-0 xl:left-0 top-0 bottom-0 w-32 xl:w-48 2xl:w-64  z-20 pointer-events-none"
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
                        className={`relative w-70 md:w-80 p-4 rounded-2xl backdrop-blur-xl transition-all duration-500 ${
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
                            <h1 className={`${i18n.language === "ta" ? "text-[13px]" : "text-[16px]"}  px-2 font-heading uppercase font-black tracking-wide text-transparent bg-linear-to-r from-accet via-cyan-300 to-accet/80 bg-clip-text leading-5`}>
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
                              {t("vote.description")}
                            </button>
                          )}
                        </div>

                        {/* Tap to Select Hint */}
                        {isActive && !isSelected && (
                          <div className="w-full absolute -bottom-5 left-1/2 -translate-x-1/2 flex justify-center items-center">
                            <p className={` text-[10px] text-white/80 tracking-widest font-heading uppercase animate-pulse`}>
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
