// src/Pages/TermsAndConditionsPopup.jsx
import { useTranslation } from "react-i18next";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import { Icon } from "@iconify/react";
import { IoClose } from "react-icons/io5";
import { GoLaw } from "react-icons/go";
import { useEffect, useState } from "react";

const TermsAndConditionsPopup = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [playClick] = useSound(scifi, { volume: 0.1 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to trigger animation after render
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleClose = () => {
    playClick();
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!shouldRender) return null;

  const sections = [
    {
      title: t("terms.sections.introduction.title"),
      icon: "lucide:file-text",
      content: t("terms.sections.introduction.content"),
    },
    {
      title: t("terms.sections.eligibility.title"),
      icon: "lucide:user-check",
      content: t("terms.sections.eligibility.content"),
    },
    {
      title: t("terms.sections.purpose.title"),
      icon: "lucide:target",
      content: t("terms.sections.purpose.content"),
    },
    {
      title: t("terms.sections.information.title"),
      icon: "lucide:database",
      content: t("terms.sections.information.content"),
    },
    {
      title: t("terms.sections.intellectual.title"),
      icon: "lucide:shield",
      content: t("terms.sections.intellectual.content"),
    },
    {
      title: t("terms.sections.liability.title"),
      icon: "lucide:lock",
      content: t("terms.sections.liability.content"),
    },
    {
      title: t("terms.sections.governing.title"),
      icon: "lucide:gavel",
      content: t("terms.sections.governing.content"),
    },
  ];

  return (
    <>
      {/* Backdrop Overlay with Fade Animation */}
      <div
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-all duration-300 ease-out ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal Container with Scale & Fade Animation */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
        <div
          className={`relative w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] bg-black/95 border border-accet/30 rounded-sm overflow-hidden pointer-events-auto transition-all duration-300 ease-out ${
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
          style={{
            transformOrigin: "center center",
          }}
        >
          {/* Animated Border Glow */}
          <div
            className={`absolute inset-0 rounded-sm transition-all duration-500 pointer-events-none ${
              isAnimating ? "opacity-100" : "opacity-0"
            }`}
            style={{
              boxShadow: isAnimating
                ? "0 0 30px rgba(99, 102, 241, 0.3), inset 0 0 30px rgba(99, 102, 241, 0.1)"
                : "none",
            }}
          />

          {/* Close Button - Fixed Position */}
          <button
            onClick={handleClose}
            className={`absolute top-3 right-3 md:top-4 md:right-4 z-50 p-2 md:p-2.5 bg-black/80 border border-accet/30 hover:border-accet/60 hover:bg-accet/10 transition-all duration-300 rounded-sm group cursor-pointer ${
              isAnimating
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
            style={{ transitionDelay: isAnimating ? "150ms" : "0ms" }}
          >
            <IoClose className="text-accet text-lg md:text-xl group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[95vh] sm:max-h-[90vh] custom-scrollbar-indigo">
            {/* Hero Section */}
            <div
              className={`w-full mx-auto relative z-10 pt-6 md:pt-10 px-4 sm:px-6 md:px-10 transition-all duration-500 ease-out ${
                isAnimating
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: isAnimating ? "100ms" : "0ms" }}
            >
              <section className="w-full max-w-4xl mx-auto pb-5 md:pb-8">
                {/* Title */}
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-5">
                  <div
                    className={`p-2 md:p-3 bg-accet/10 border border-accet/30 rounded-sm transition-all duration-500 ${
                      isAnimating ? "scale-100 rotate-0" : "scale-0 rotate-180"
                    }`}
                    style={{ transitionDelay: isAnimating ? "200ms" : "0ms" }}
                  >
                    <GoLaw className="text-xl md:text-2xl text-accet icon-glow-subtle" />
                  </div>
                  <div>
                    <h1 className="font-heading text-lg md:text-4xl lg:text-5xl flex justify-center items-center gap-2 md:gap-3 font-bold tracking-tight text-white leading-none">
                      <span className="text-glow">
                        {t("terms.hero.title1")}
                      </span>
                      <span className="text-glow text-transparent bg-clip-text bg-linear-to-r from-accet via-cyan-400 to-accet leading-11">
                        {t("terms.hero.title2")}
                      </span>
                    </h1>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="relative md:mb-1">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-accet/50 via-accet/20 to-accet/10 rounded-full" />
                  <p className="text-neutral-400 text-[10px] md:text-sm pl-2 md:pl-3 font-light">
                    {t("terms.hero.lastUpdated")}
                  </p>
                </div>
              </section>
            </div>

            {/* Content Sections */}
            <section className="w-full px-4 sm:px-6 md:px-10 pb-8 md:pb-16">
              <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className={`glass-panel p-4 md:p-8 rounded-sm border border-accet/20 relative overflow-hidden group hover:border-accet/40 transition-all duration-500 ${
                      isAnimating
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-8"
                    }`}
                    style={{
                      transitionDelay: isAnimating
                        ? `${200 + index * 50}ms`
                        : "0ms",
                    }}
                  >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-accet/5 blur-2xl group-hover:bg-accet/10 transition-all duration-500" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-accet/5 blur-2xl" />

                    {/* Section Number */}
                    <div className="absolute top-4 right-4 md:top-6 md:right-6">
                      <span className="font-heading text-4xl md:text-6xl font-bold text-white/5 group-hover:text-accet/10 transition-colors duration-500">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="relative z-10">
                      {/* Section Header */}
                      <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-6">
                        <div className="p-2 md:p-3 bg-accet/10 border border-accet/30 rounded-sm group-hover:bg-accet/20 transition-all duration-300">
                          <Icon
                            icon={section.icon}
                            className="text-accet text-base md:text-xl"
                          />
                        </div>
                        <h2 className="font-heading text-sm md:text-xl text-white tracking-wide">
                          {section.title}
                        </h2>
                      </div>

                      {/* Section Content */}
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-accet/30 via-accet/10 to-transparent" />
                        <p className="text-neutral-400 text-[10px] md:text-sm leading-relaxed pl-3 md:pl-6">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Section */}
              <div
                className={`max-w-4xl mx-auto mt-8 md:mt-16 glass-panel p-6 md:p-10 rounded-sm border border-accet/30 relative overflow-hidden transition-all duration-500 ${
                  isAnimating
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: isAnimating ? "600ms" : "0ms" }}
              >
                <div className="absolute inset-0 z-0 opacity-50">
                  <div className="absolute top-0 left-1/4 w-px h-full bg-white/5" />
                  <div className="absolute top-0 right-1/4 w-px h-full bg-white/5" />
                </div>

                <div className="relative z-10 text-center">
                  <Icon
                    icon="lucide:mail"
                    className="text-accet mb-3 md:mb-6 mx-auto"
                    width={32}
                  />
                  <h3 className="font-heading text-lg md:text-2xl text-white mb-2 md:mb-4">
                    {t("terms.contact.title")}
                  </h3>
                  <p className="text-neutral-400 text-[10px] md:text-sm mb-4 md:mb-6 max-w-lg mx-auto">
                    {t("terms.contact.description")}
                  </p>
                  <a
                    href="mailto:support@lunai.in"
                    className="inline-flex items-center gap-2 text-accet hover:text-accet/30 transition-colors font-heading text-sm md:text-base tracking-wide"
                  >
                    <Icon icon="lucide:at-sign" />
                    support@lunai.in
                  </a>
                </div>
              </div>

              {/* Close Button at Bottom */}
              <div
                className={`max-w-4xl mx-auto mt-6 md:mt-10 flex justify-center pb-6 transition-all duration-500 ${
                  isAnimating
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: isAnimating ? "700ms" : "0ms" }}
              >
                <button
                  onClick={handleClose}
                  className="group flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-accet/10 border border-accet/50 hover:bg-accet/20 transition-all duration-300 rounded-sm cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Icon icon="lucide:check-circle" className="text-accet" />
                  <span className="font-heading text-[10px] md:text-xs tracking-widest text-white/80 group-hover:text-white uppercase">
                    I Accept
                  </span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditionsPopup;