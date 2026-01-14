import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import { Icon } from "@iconify/react";
import { IoArrowBack } from "react-icons/io5";
import { MdNoEncryption } from "react-icons/md";

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const [playClick] = useSound(scifi);
  const navigate = useNavigate();

  const sections = [
    {
      title: t("privacy.sections.overview.title"),
      icon: "lucide:scroll-text",
      content: t("privacy.sections.overview.content"),
    },
    {
      title: t("privacy.sections.collection.title"),
      icon: "lucide:clipboard-list",
      content: t("privacy.sections.collection.content"),
    },
    {
      title: t("privacy.sections.storage.title"),
      icon: "lucide:database",
      content: t("privacy.sections.storage.content"),
    },
    {
      title: t("privacy.sections.aadhaar.title"),
      icon: "lucide:id-card",
      content: t("privacy.sections.aadhaar.content"),
    },
    {
      title: t("privacy.sections.usage.title"),
      icon: "lucide:bar-chart-3",
      content: t("privacy.sections.usage.content"),
    },
    {
      title: t("privacy.sections.sharing.title"),
      icon: "lucide:share-2",
      content: t("privacy.sections.sharing.content"),
    },
    {
      title: t("privacy.sections.retention.title"),
      icon: "lucide:trash-2",
      content: t("privacy.sections.retention.content"),
    },
    {
      title: t("privacy.sections.security.title"),
      icon: "lucide:shield-check",
      content: t("privacy.sections.security.content"),
    },
    {
      title: t("privacy.sections.age.title"),
      icon: "lucide:user-x",
      content: t("privacy.sections.age.content"),
    },
  ];

  const dataPoints = [
    { label: t("privacy.dataOverview.dataPoints.mobile"), stored: true },
    { label: t("privacy.dataOverview.dataPoints.age"), stored: true },
    { label: t("privacy.dataOverview.dataPoints.gender"), stored: true },
    { label: t("privacy.dataOverview.dataPoints.district"), stored: true },
    { label: t("privacy.dataOverview.dataPoints.religion"), stored: true },
    { label: t("privacy.dataOverview.dataPoints.caste"), stored: true },
    { label: t("privacy.dataOverview.dataPoints.motherTongue"), stored: true },
    { label: t("privacy.dataOverview.dataPoints.aadhaar"), stored: true },
    { label: t("privacy.dataOverview.dataPoints.votingPreference"), stored: true },
    { label: t("privacy.dataOverview.dataPoints.name"), stored: false },
  ];

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-black/40 backdrop-blur-xl">
        <div className="w-[95%] md:w-[90%] mx-auto px-2 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => {
              playClick();
              navigate("/form");
            }}
            className="flex items-center gap-2 md:gap-3 group cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <div className="border border-accet/30 flex items-center justify-center gap-1 p-2 group-hover:border-accet/60 group-hover:bg-accet/10 transition-all duration-300">
                <IoArrowBack className="text-accet text-sm md:text-lg" />
                <span className="font-heading text-[10px] md:text-[12px] tracking-widest text-white/70 group-hover:text-accet transition-colors duration-300 uppercase hidden sm:block">
              {t("privacy.nav.back")}
            </span>
              </div>
            </div>    
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
            <div className="relative">
              <div className="w-1.5 h-1.5 md:w-3 md:h-3 bg-accet group-hover:shadow-[0_0_20px_#4C43DD] transition-all duration-500" />
              <div className="absolute -inset-1.5 border border-accet/30 group-hover:scale-125 transition-transform duration-500" />
            </div>
            <span className="font-heading text-[10px] md:text-sm tracking-widest text-white font-semibold group-hover:text-accet transition-colors duration-300 uppercase">
              {t("home.nav.brand")}
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="w-[95%] md:w-full mx-auto relative z-10 pt-14 md:pt-22">
        <section className="w-[95%] md:w-[80%] max-w-5xl mx-auto pb-7 md:pb-10">
          {/* Title */}
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-5">
            <div className="p-2 md:p-3 bg-indigo-500/10 border border-accet/30 rounded-sm">
              <MdNoEncryption className="text-md md:text-2xl text-accet icon-glow-subtle" />
            </div>
            <div>
              <h1 className="font-heading text-lg md:text-5xl lg:text-5xl font-bold flex justify-center items-center gap-2 md:gap-3 tracking-tight text-white leading-none">
                <span className="text-glow">{t("privacy.hero.title1")}</span>
                <span className="text-glow text-transparent bg-clip-text bg-linear-to-r from-accet via-indigo-300 to-indigo-700 leading-19">
                  {t("privacy.hero.title2")}
                </span>
              </h1>
            </div>
          </div>

          {/* Last Updated */}
          <div className="relative md:mb-1">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-accet via-indigo-500/40 to-accet/10 rounded-full" />
            <p className="text-neutral-400 text-[10px] md:text-sm pl-2 md:pl-3 font-light">
              Compliant with Digital Personal Data Protection Act, 2023 & Aadhaar Act, 2016
            </p>
          </div>
        </section>
      </div>

      {/* Data Overview Panel */}
      {/* <section className="w-[93%] md:w-[80%] max-w-5xl mx-auto pb-10 md:pb-16">
        <div className="glass-panel p-5 md:p-8 rounded-sm border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Icon icon="lucide:database" className="text-indigo-400 text-xl md:text-2xl" />
              <h3 className="font-heading text-sm md:text-lg text-white tracking-wide">
                Data Collection Overview
              </h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
              {dataPoints.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 md:p-4 border rounded-sm text-center transition-all duration-300 ${
                    item.stored
                      ? "border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-500/50"
                      : "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50"
                  }`}
                >
                  <Icon
                    icon={item.stored ? "lucide:check-circle" : "lucide:x-circle"}
                    className={`mx-auto mb-2 text-base md:text-lg ${
                      item.stored ? "text-indigo-400" : "text-amber-400"
                    }`}
                  />
                  <p className="text-[8px] md:text-[10px] text-white/80 font-heading uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className={`text-[7px] md:text-[9px] mt-1 ${
                    item.stored ? "text-indigo-400/70" : "text-amber-400/70"
                  }`}>
                    {item.stored ? "Stored" : "Not Retained"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Content Sections */}
      <section className="w-[93%] md:w-[80%] max-w-5xl mx-auto pb-12 md:pb-24">
        <div className="space-y-3 md:space-y-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className="glass-panel p-4 md:p-8 rounded-sm border border-indigo-500/20 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-500"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 blur-2xl group-hover:bg-indigo-500/10 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-500/5 blur-2xl" />
              
              {/* Section Number */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6">
                <span className="font-heading text-4xl md:text-6xl font-bold text-white/5 group-hover:text-indigo-500/10 transition-colors duration-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="relative z-10">
                {/* Section Header */}
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="p-2 md:p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-sm group-hover:bg-indigo-500/20 transition-all duration-300">
                    <Icon
                      icon={section.icon}
                      className="text-indigo-400 text-base md:text-xl"
                    />
                  </div>
                  <h2 className="font-heading text-sm md:text-xl text-white tracking-wide">
                    {section.title}
                  </h2>
                </div>

                {/* Section Content */}
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-indigo-500/30 via-indigo-500/10 to-transparent" />
                  <p className="text-neutral-400 text-[10px] md:text-sm leading-relaxed pl-3 md:pl-6">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Highlights */}
        <div className="mt-8 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          <div className="glass-panel p-5 md:p-6 rounded-sm border border-green-500/30 text-center">
            <Icon icon="lucide:shield-off" className="text-green-400 mx-auto mb-3" width={28} />
            <h4 className="font-heading text-xs md:text-sm text-white mb-2"> {t("privacy.highlights.noSharing.title")}</h4>
            <p className="text-[8px] md:text-[11px] text-neutral-500">
               {t("privacy.highlights.noSharing.description")}
            </p>
          </div>
          
          <div className="glass-panel p-5 md:p-6 rounded-sm border border-blue-500/30 text-center">
            <Icon icon="lucide:clock" className="text-blue-400 mx-auto mb-3" width={28} />
            <h4 className="font-heading text-xs md:text-sm text-white mb-2">{t("privacy.highlights.deletion.title")}</h4>
            <p className="text-[8px] md:text-[11px] text-neutral-500">
               {t("privacy.highlights.deletion.description")}
            </p>
          </div>
          
          <div className="glass-panel p-5 md:p-6 rounded-sm border border-purple-500/30 text-center">
            <Icon icon="lucide:eye-off" className="text-purple-400 mx-auto mb-3" width={28} />
            <h4 className="font-heading text-xs md:text-sm text-white mb-2"> {t("privacy.highlights.anonymized.title")}</h4>
            <p className="text-[8px] md:text-[11px] text-neutral-500">
               {t("privacy.highlights.anonymized.description")}
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 md:mt-16 glass-panel p-6 md:p-10 rounded-sm border border-indigo-500/30 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-50">
            <div className="absolute top-0 left-1/4 w-px h-full bg-white/5" />
            <div className="absolute top-0 right-1/4 w-px h-full bg-white/5" />
          </div>
          
          <div className="relative z-10 text-center">
            <Icon
              icon="lucide:mail"
              className="text-indigo-400 mb-3 md:mb-6 mx-auto"
              width={32}
            />
            <h3 className="font-heading text-lg md:text-2xl text-white mb-3 md:mb-4">
              {t("privacy.contact.title")}
            </h3>
            <p className="text-neutral-400 text-[10px] md:text-sm mb-3 md:mb-6 max-w-lg mx-auto">
               {t("privacy.contact.description")}
            </p>
            <a
              href="mailto:support@lunai.in"
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-heading text-sm md:text-base tracking-wide"
            >
              <Icon icon="lucide:at-sign" />
              support@lunai.in
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-6 md:mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-8">
          <button
            onClick={() => {
              playClick();
              navigate("/terms");
            }}
            className="group flex items-center gap-2 md:gap-3 backdrop-blur-sm px-4 py-2.5 md:px-6 md:py-3 border border-accet/30 hover:border-accet/60 hover:bg-accet/10 transition-all duration-300 rounded-sm"
          >
            <Icon icon="lucide:file-text" className="text-accet" />
            <span className="font-heading text-[10px] md:text-xs tracking-widest text-white/80 group-hover:text-accet uppercase">
             {t("privacy.navigation.viewTerms")}
            </span>
            <Icon icon="lucide:arrow-right" className="text-accet group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => {
              playClick();
              navigate("/");
            }}
            className="group flex items-center gap-2 md:gap-3 px-4 py-2.5 md:px-6 md:py-3 backdrop-blur-sm bg-accet/10 border border-accet/50 hover:bg-accet/20 transition-all duration-300 rounded-sm"
          >
            <Icon icon="lucide:home" className="text-accet" />
            <span className="font-heading text-[10px] md:text-xs tracking-widest text-white/80 group-hover:text-white uppercase">
              {t("privacy.navigation.returnHome")}
            </span>
          </button>
        </div>
      </section>

      {/* Footer Bar */}
      <div className="backdrop-blur-md py-3 md:py-4 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[8px] md:text-[10px] font-heading text-neutral-600">
          <span>{t("home.footer.copyright")}</span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">{t("home.footer.protocol")}</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
              <span className="text-indigo-400">{t("home.footer.status")}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;