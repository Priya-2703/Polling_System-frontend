import React, { useState, useEffect } from "react";
import { HiArrowRight, HiArrowLeft, HiMiniUser, HiPhone } from "react-icons/hi2";
import { MdLocationOn, MdFingerprint, MdVerifiedUser, MdCheck } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import DistrictMapPicker from "../Components/DistrictMapPicker";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";
import click from "../assets/click2.wav";
import scifi from "../assets/scifi.wav";

// --- ANIMATED PARTICLES BACKGROUND ---
const ParticleField = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-accet/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

// --- STEP INDICATOR ---
const StepIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="w-full mb-6">
      {/* Desktop View */}
      <div className="hidden lg:flex items-center justify-between relative px-4">
        {/* Progress Line */}
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-accet to-indigo-500 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;

          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-gradient-to-br from-accet to-indigo-500 text-gray-900 shadow-lg shadow-accet/30"
                    : isActive
                    ? "bg-shade border-2 border-accet text-accet"
                    : "bg-shade border border-white/20 text-white/40"
                }`}
              >
                {isCompleted ? <MdCheck className="text-lg" /> : step.icon}
              </div>
              <span
                className={`mt-2 text-[9px] uppercase tracking-widest font-heading ${
                  isActive ? "text-accet" : isCompleted ? "text-white/70" : "text-white/30"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-black text-accet font-heading">
            {String(currentStep).padStart(2, "0")}
          </span>
          <div className="flex flex-col">
            <span className="text-[9px] text-white/40 uppercase tracking-widest">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-[11px] text-white font-heading font-bold uppercase">
              {steps[currentStep - 1]?.label}
            </span>
          </div>
        </div>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i + 1 <= currentStep ? "w-6 bg-accet" : "w-3 bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- DIGITAL ID CARD PREVIEW ---
const DigitalIDCard = ({ data, t, isExpanded, onToggle }) => {
  const completionPercentage = () => {
    const fields = ['name', 'gender', 'age', 'district', 'religion', 'motherTongue', 'community', 'caste', 'phone', 'idType', 'idNumber'];
    const filled = fields.filter(f => data[f] && data[f].length > 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  return (
    <div className={`w-full transition-all duration-500 overflow-hidden max-h-100  opacity-100 mb-4 lg:max-h-[500px] lg:opacity-100 lg:mb-0 $`}>
      <div className="w-full mx-auto lg:mx-0">
        <div className="relative bg-accet/20 backdrop-blur-xs border border-white/10 rounded-xl p-4 md:p-5 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accet/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -ml-5 -mb-5" />
          
          {/* Status Badge */}
          <div className="absolute top-2 right-4 lg:top-3 lg:right-3 flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${completionPercentage() === 100 ? 'bg-green-500' : 'bg-accet'} animate-pulse`} />
            <span className="text-[7px] lg:text-[10px] text-white/50 font-mono uppercase tracking-widest">
              {completionPercentage() === 100 ? "Ready" : "Building"}
            </span>
          </div>

          {/* Card Header */}
          <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-4">
            <div className="md:w-14 md:h-14 w-10 h-10 rounded-lg md:rounded-xl bg-linear-to-br from-indigo-900 to-indigo-900/20 border border-white/10 flex items-center justify-center text-[16px] md:text-2xl">
              {data.gender === "male" ? "👨🏻" : data.gender === "female" ? "👩🏻" : "👤"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-heading font-bold text-[11px] lg:text-base leading-tight uppercase truncate">
                {data.name || t("placeholders.fullName")}
              </h3>
              <p className="text-indigo-400 text-[8px] lg:text-[12px] font-mono mt-1 tracking-wider">
                ID: {data.idNumber ? `XXXX-XXXX-${data.idNumber.slice(-4).toUpperCase()}` : "PENDING..."}
              </p>
              <div className="flex items-center gap-1.5 mt-1 md:mt-1.5">
                <span className={`text-[6px] lg:text-[10px] px-2 lg:px-3 py-1  font-heading uppercase ${
                  data.age === 'below-18' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-accet/50 text-white'
                }`}>
                  {data.age || "AGE"}
                </span>
                <span className="text-[6px] lg:text-[10px] px-2 lg:px-3 lg:py-1 py-1 font-heading bg-white/10 text-white/80 tracking-wider uppercase">
                  {data.gender || "GENDER"}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3 lg:mb-5">
            <div className="flex justify-between text-[7px] lg:text-[11px] font-heading uppercase tracking-widest text-white/40 mb-1">
              <span>Profile</span>
              <span className="text-accet font-bold">{completionPercentage()}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accet to-indigo-500 transition-all duration-500"
                style={{ width: `${completionPercentage()}%` }}
              />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 font-heading text-sm uppercase border-t border-white/20 pt-2 md:pt-3">
            <div className="bg-white/5 p-2 lg:p-3">
              <p className="text-[7px] lg:text-[10px] text-indigo-500 uppercase font-bold tracking-widest mb-0.5 flex items-center gap-1">
                {t("labels.district")}
              </p>
              <p className="text-white text-[9px] lg:text-[12px] lg:mt-1 font-medium truncate">{data.district || "---"}</p>
            </div>
            
            <div className="bg-white/5 p-2 lg:p-3">
              <p className="text-[7px] lg:text-[10px] text-indigo-500 uppercase font-bold tracking-widest mb-0.5">{t("labels.religion")}</p>
              <p className="text-white text-[9px] lg:text-[12px] lg:mt-1 font-medium ">{data.religion || "---"}</p>
            </div>
            
            <div className="bg-white/5 p-2 lg:p-3">
              <p className="text-[7px] lg:text-[10px] text-indigo-500 uppercase font-bold tracking-widest mb-0.5">{t("labels.motherTongue")}</p>
              <p className="text-white text-[9px] lg:text-[12px] lg:mt-1 font-medium ">{data.motherTongue || "---"}</p>
            </div>
            <div className="bg-white/5  p-2 lg:p-3">
              <p className="text-[7px] lg:text-[10px] text-indigo-500 uppercase font-bold tracking-widest mb-0.5">{t("labels.community")}</p>
              <p className="text-white text-[9px] lg:text-[12px] lg:mt-1 font-medium uppercase">{data.community || "---"}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-2 pt-2 lg:mt-5 lg:pt-4 border-t border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2 font-heading">
              <MdFingerprint className={`text-xl ${data.idNumber ? "text-accet" : "text-gray-600"}`} />
              <div className="flex flex-col">
                <span className="text-[6px] lg:text-[10px] tracking-widest text-white/50 uppercase">Status</span>
                <span className={`text-[7px] md:text-[9px] font-bold tracking-widest ${
                  data.idNumber && data.phone?.length === 10 ? "text-green-400" : "text-yellow-400"
                }`}>
                  {data.idNumber && data.phone?.length === 10 ? "VERIFIED" : "PENDING"}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[6px] lg:text-[10px] font-medium lg:leading-3 font-heading text-white/50 tracking-widest">LUNAI</p>
              <p className="text-[7px] lg:text-[8px] text-white/50">Digital Voting Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SECTION TITLE COMPONENT ---
const SectionTitle = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
    <div className="md:w-10 md:h-10 w-8 h-8 rounded-full bg-gradient-to-br from-accet to-indigo-400 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex flex-col">
      <h2 className="text-[10px] lg:text-base text-white font-heading font-bold uppercase tracking-wide">
        {title}
      </h2>
      {subtitle && <p className="text-[8px] md:text-[10px] text-white/40">{subtitle}</p>}
    </div>
    <div className="flex-1 w-full h-0.5 bg-linear-to-r from-accet/50 to-transparent rounded-full" />
  </div>
);

// --- MAIN COMPONENT ---
const UserDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [Click] = useSound(click, { volume: 0.2 });
  const [playClick] = useSound(scifi, { volume: 0.3 });

  // State
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [showMap, setShowMap] = useState(false);
  const [agreed, setAgreed] = useState(false);
  // const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [direction, setDirection] = useState('next');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "", gender: "", age: "", district: "", religion: "",
    motherTongue: "", phone: "", caste: "", community: "", idType: "", idNumber: ""
  });

  // Data Options
  const steps = [
    { icon: <HiMiniUser className="text-gray-900 text-sm" />, label: t("sections.personal") || "Personal" },
    { icon: <MdLocationOn className="text-gray-900 text-sm" />, label: t("sections.location") || "Location" },
    { icon: <HiPhone className="text-gray-900 text-sm" />, label: t("sections.contact") || "Contact" },
    { icon: <MdVerifiedUser className="text-gray-900 text-sm" />, label: t("sections.idVerification") || "Verify" },
  ];

  const ageRanges = [
    { value: "below-18", label: "Below 18" },
    { value: "18-25", label: "18 - 25" },
    { value: "26-35", label: "26 - 35" },
    { value: "36-50", label: "36 - 50" },
    { value: "51-65", label: "51 - 65" },
    { value: "65+", label: "65+" },
  ];

  const genders = [
    { value: "male", label: t("options.genders.male") || "Male", icon: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767355063/male_wum4dl.png" },
    { value: "female", label: t("options.genders.female") || "Female", icon: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767355028/femenine_ewcoiz.png" },
    { value: "other", label: t("options.genders.other") || "Other", icon: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767355233/transgender_vlfmqt.png" },
  ];

  const religions = [
    { value: "hindu", label: t("options.religions.hindu") || "Hindu", icon: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767355558/hindu_smq0lm.png" },
    { value: "christian", label: t("options.religions.christian") || "Christian", icon: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767355558/cross_d17hfp.png" },
    { value: "muslim", label: t("options.religions.muslim") || "Muslim", icon: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767355557/moon_av8avh.png" },
    { value: "others", label: t("options.religions.others") || "Others", icon: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767356101/hands_1_lqthfz.png" },
  ];

  const motherTongues = [
    { value: "tamil", label: t("options.languages.tamil") || "Tamil", icon: "த" },
    { value: "telugu", label: t("options.languages.telugu") || "Telugu", icon: "తె" },
    { value: "malayalam", label: t("options.languages.malayalam") || "Malayalam", icon: "മ" },
    { value: "kannada", label: t("options.languages.kannada") || "Kannada", icon: "ಕ" },
    { value: "hindi", label: t("options.languages.hindi") || "Hindi", icon: "हि" },
    { value: "others", label: t("options.languages.others") || "Others", icon: "+" },
  ];

  const communities = [
    { value: "bc", label: "BC", full: t("options.communities.bc") || "Backward Class" },
    { value: "mbc", label: "MBC", full: t("options.communities.mbc") || "Most Backward" },
    { value: "fc", label: "FC", full: t("options.communities.fc") || "Forward Class" },
    { value: "sc", label: "SC", full: t("options.communities.sc") || "Scheduled Caste" },
    { value: "st", label: "ST", full: t("options.communities.st") || "Scheduled Tribe" },
    { value: "obc", label: "OBC", full: "Other Backward" },
  ];

  const idTypes = [
    { value: "aadhar", label: t("options.ids.aadhar") || "Aadhar Card", icon: "https://ik.imagekit.io/saransk03/Voting%20Poll/employee-card.png", placeholder: t("placeholders.aadhar") || "XXXX XXXX XXXX", maxLength: 12 },
    { value: "driving", label: t("options.ids.driving") || "Driving License", icon: "https://ik.imagekit.io/saransk03/Voting%20Poll/driving-licence.png", placeholder: t("placeholders.dl") || "TN-00-0000-0000000", maxLength: 16 },
  ];

  // Handlers
  const handleChange = (name, value) => {
    Click();
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.name && formData.gender && formData.age;
      case 2: return formData.district && formData.religion && formData.motherTongue;
      case 3: return formData.community && formData.caste && formData.phone.length === 10;
      case 4: return formData.idType && formData.idNumber.length > 4 && agreed;
      default: return false;
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      playClick();
      setDirection('next');
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    Click();
    setDirection('back');
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (isStepValid()) {
      setIsSubmitting(true);
      playClick();
      await new Promise(resolve => setTimeout(resolve, 1500));
      localStorage.setItem("voterData", JSON.stringify(formData));
      navigate("/vote");
    }
  };

  // --- RENDER STEPS ---
  const renderStepContent = () => {
    const animationClass = direction === 'next' ? 'animate-slideInRight' : 'animate-slideInLeft';

    switch (step) {
      // STEP 1: PERSONAL
      case 1:
        return (
          <div className={`space-y-4 lg:space-y-6 ${animationClass}`} key="step1">
            <SectionTitle
              icon={<HiMiniUser className="text-gray-900 text-sm" />}
              title={t("sections.personal")}
              subtitle="Establish your identity"
            />

            {/* Name Input */}
            <div className="relative group">
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-wide mb-1.5 md:mb-2 block md:px-1">
                {t("labels.fullName")}
              </label>
              <div className="relative bg-shade flex justify-center items-center border border-white/20 md:px-4 py-2.5 md:py-3 px-3 group-hover:border-accet/30 transition-colors">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder={t("placeholders.fullName")}
                  className="w-full bg-transparent text-white font-body text-[12px] lg:text-[15px] capitalize outline-none placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-wide mb-1.5 md:mb-3 block md:px-1">
                {t("labels.gender")}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {genders.map((gender) => (
                  <button
                    key={gender.value}
                    onClick={() => handleChange("gender", gender.value)}
                    className={`py-2.5 px-2 md:p-4 border backdrop-blur-xl text-center transition-all flex  justify-center gap-2 items-center duration-300 ${
                      formData.gender === gender.value
                        ? "bg-gradient-to-br from-accet/20 to-indigo-500/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-shade border-white/20 text-white hover:border-white/30"
                    }`}
                  >
                    {/* <img src={gender.icon} alt={gender.label} className="w-7 lg:w-8" /> */}
                    <span className="text-[9px] lg:text-[11px] font-heading uppercase tracking-widest">
                      {gender.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Age Selection */}
            <div>
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-wide mb-1.5 md:mb-3 block md:px-1">
                {t("labels.ageGroup")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ageRanges.map((age) => (
                  <button
                    key={age.value}
                    onClick={() => handleChange("age", age.value)}
                    className={`py-2.5 md:py-3 px-2 border backdrop-blur-xl text-center flex justify-center items-center transition-all duration-300 ${
                      formData.age === age.value
                        ? "bg-gradient-to-br from-accet/20 to-indigo-500/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-shade border-white/20 text-white hover:border-white/30"
                    }`}
                  >
                    <span className="text-[10px] lg:text-[12px] font-heading tracking-wide">
                      {age.label}
                    </span>
                  </button>
                ))}
              </div>
              {formData.age === "below-18" && (
                <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 p-3 flex items-center gap-2">
                  <span className="text-sm">⚠️</span>
                  <p className="text-[8px] md:text-[10px] text-yellow-400 font-body">
                    {t("user_messages.ageWarning")}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      // STEP 2: LOCATION
      case 2:
        return (
          <div className={`space-y-4 lg:space-y-6 ${animationClass}`} key="step2">
            <SectionTitle
              icon={<MdLocationOn className="text-gray-900 text-sm" />}
              title={t("sections.location")}
              subtitle="Map your background"
            />

            {/* District Selection */}
            <div className="relative group">
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-wide mb-1.5 md:mb-2 block md:px-1">
                {t("labels.district")}
              </label>
              <div
                onClick={() => { Click(); setShowMap(true); }}
                className={`relative bg-shade border md:px-4 py-2.5 md:py-4 px-3 cursor-pointer transition-all flex justify-between items-center ${
                  formData.district ? "border-accet/50" : "border-white/20 hover:border-white/30"
                }`}
              >
                <span className={formData.district ? "text-white font-medium text-[11px] lg:text-[14px]" : "text-white/30 text-[10px] lg:text-[14px]"}>
                  {formData.district || t("placeholders.district")}
                </span>
                <MdLocationOn className="text-accet text-[14px] lg:text-xl animate-pulse" />
              </div>
            </div>

            {/* Religion Selection */}
            <div>
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-widest mb-1.5 md:mb-3 block md:px-1">
                {t("labels.religion")}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1 lg:gap-3">
                {religions.map((religion) => (
                  <button
                    key={religion.value}
                    onClick={() => handleChange("religion", religion.value)}
                    className={`py-2.5 md:py-3 px-2 border backdrop-blur-xl flex flex-col gap-2 justify-center items-center text-center transition-all duration-300 ${
                      formData.religion === religion.value
                        ? "bg-linear-to-br from-accet/20 to-indigo-500/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-shade border-white/20 text-white hover:border-white/30"
                    }`}
                  >
                    {/* <img src={religion.icon} alt={religion.label} className="w-6 lg:w-8" /> */}
                    <span className="text-[8px] lg:text-[10px] font-heading uppercase tracking-widest">
                      {religion.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mother Tongue Selection */}
            <div>
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-widest mb-1.5 md:mb-3 block md:px-1">
                {t("labels.motherTongue")}
              </label>
              <div className="grid grid-cols-3 gap-2 lg:gap-3">
                {motherTongues.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => handleChange("motherTongue", lang.value)}
                    className={`py-2.5 md:py-3 px-2 border backdrop-blur-xl flex justify-center items-center text-center transition-all duration-300 ${
                      formData.motherTongue === lang.value
                        ? "bg-gradient-to-br from-accet/20 to-indigo-500/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-shade border-white/20 text-white hover:border-white/30"
                    }`}
                  >
                    {/* <div className="text-xl font-normal mb-1">{lang.icon}</div> */}
                    <span className="text-[9px] lg:text-[11px] font-heading uppercase tracking-widest">
                      {lang.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // STEP 3: CONTACT & COMMUNITY
      case 3:
        return (
          <div className={`space-y-4 lg:space-y-6 ${animationClass}`} key="step3">
            <SectionTitle
              icon={<HiPhone className="text-gray-900 text-sm" />}
              title={t("sections.contact")}
              subtitle="Contact & Community details"
            />

            {/* Phone Number */}
            <div className="relative group">
              <label className="text-[8px] lg:text-[12px] text-accet font-bold font-heading uppercase tracking-widest mb-1.5 md:mb-2 block md:px-1">
                {t("labels.phoneNumber")}
              </label>
              <div className="relative bg-shade border border-white/20 md:px-4 py-2.5 md:py-3 px-2 group-hover:border-accet/30 transition-colors">
                <div className="flex items-center gap-1 md:gap-3">
                  <span className="text-white/60 font-body text-sm py-1 px-1 md:px-2 text-[10px] md:text-[13px]">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, ''))}
                    placeholder={t("placeholders.phone")}
                    maxLength="10"
                    className="flex-1 bg-transparent text-white font-body text-[10px] lg:text-[14px] outline-none placeholder:text-white/30 tracking-wider"
                  />
                </div>
                {formData.phone && (
                  <div className=" md:mt-2 flex items-center gap-2">
                    <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          formData.phone.length === 10 ? "bg-green-500" : "bg-accet"
                        }`}
                        style={{ width: `${(formData.phone.length / 10) * 100}%` }}
                      />
                    </div>
                    <span className={`text-[7px] md:text-[9px] font-body ${
                      formData.phone.length === 10 ? "text-green-400" : "text-white/40"
                    }`}>
                      {formData.phone.length}/10
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Community Selection */}
            <div>
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-widest mb-1.5 md:mb-3 block md:px-1">
                {t("labels.community")}
              </label>
              <div className="grid grid-cols-3 gap-2 lg:gap-3">
                {communities.map((community) => (
                  <button
                    key={community.value}
                    onClick={() => handleChange("community", community.value)}
                    className={`py-2.5 md:py-3 px-2 md:min-h-[70px] backdrop-blur-xl border text-center flex flex-col justify-center items-center transition-all duration-300 ${
                      formData.community === community.value
                        ? "bg-gradient-to-br from-accet/20 to-indigo-500/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-shade border-white/20 text-white hover:border-white/30"
                    }`}
                  >
                    <span className="text-[9px] lg:text-[16px] font-heading font-bold tracking-widest">
                      {community.label}
                    </span>
                    <span className="text-[7px] lg:text-[9px] font-body text-white/60 md:mt-1">
                      {community.full}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Caste Input */}
            <div className="relative group">
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-widest mb-1.5 md:mb-2 block md:px-1">
                {t("labels.caste")}
              </label>
              <div className="relative bg-shade flex justify-center items-center border border-white/20 md:px-4 py-2.5 md:py-3 px-3 group-hover:border-accet/30 transition-colors">
                <input
                  type="text"
                  value={formData.caste}
                  onChange={(e) => handleChange("caste", e.target.value)}
                  placeholder={t("placeholders.caste")}
                  className="w-full bg-transparent text-white font-body text-[11 px] lg:text-[14px] outline-none placeholder:text-white/30"
                />
              </div>
            </div>
          </div>
        );

      // STEP 4: VERIFICATION
      case 4:
        return (
          <div className={`space-y-4 lg:space-y-6 ${animationClass}`} key="step4">
            <SectionTitle
              icon={<MdVerifiedUser className="text-gray-900 text-sm" />}
              title={t("sections.idVerification")}
              subtitle="Final verification step"
            />

            {/* ID Type Selection */}
            <div>
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-widest mb-1.5 md:mb-3 block md:px-1">
                {t("labels.idType")}
              </label>
              <div className="grid grid-cols-2 gap-1.5 lg:gap-3">
                {idTypes.map((id) => (
                  <button
                    key={id.value}
                    onClick={() => {
                      handleChange("idType", id.value);
                      setFormData(prev => ({ ...prev, idNumber: "" }));
                    }}
                    className={`py-2.5 md:p-5 border backdrop-blur-xl text-center transition-all flex flex-col justify-center gap-2 items-center duration-300 ${
                      formData.idType === id.value
                        ? "bg-gradient-to-br from-accet/20 to-indigo-500/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-shade border-white/20 text-white hover:border-white/30"
                    }`}
                  >
                    {/* <img src={id.icon} alt={id.label} className="w-8 lg:w-10" /> */}
                    <span className="text-[9px] lg:text-[11px] font-heading uppercase tracking-widest">
                      {id.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ID Number Input */}
            {formData.idType && (
              <div className="relative group animate-fadeIn">
                <label className="text-[9px] lg:text-[12px] text-accet font-bold font-heading uppercase tracking-wide mb-1 md:mb-2 block md:px-1">
                  {formData.idType === "aadhar" ? t("labels.aadharNumber") : t("labels.dlNumber")}
                </label>
                <div className="relative bg-shade border border-white/20 md:px-4 py-2 md:py-3 px-3 group-hover:border-accet/30 transition-colors">
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => handleChange("idNumber", e.target.value)}
                    placeholder={idTypes.find(id => id.value === formData.idType)?.placeholder}
                    maxLength={idTypes.find(id => id.value === formData.idType)?.maxLength}
                    className="w-full bg-transparent text-white font-body text-[10px] md:text-[14px] outline-none placeholder:text-white/30 tracking-widest uppercase"
                  />
                  <div className="md:mt-2 flex items-center gap-2">
                    <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          formData.idNumber.length === idTypes.find(id => id.value === formData.idType)?.maxLength
                            ? "bg-green-500" : "bg-accet"
                        }`}
                        style={{
                          width: `${(formData.idNumber.length / (idTypes.find(id => id.value === formData.idType)?.maxLength || 12)) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-white/50 font-body">
                      {formData.idNumber.length}/{idTypes.find(id => id.value === formData.idType)?.maxLength}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Notice */}
            <div className="bg-linear-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 p-2 md:p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[8px] lg:text-[12px] text-green-400 font-heading uppercase tracking-wider">
                    {t("user_messages.dataSecure")}
                  </p>
                  <p className="text-[6px] lg:text-[10px] text-white/50 font-body mt-1 leading-relaxed">
                    {t("user_messages.encryptionNotice")}
                  </p>
                </div>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div
              onClick={() => { Click(); setAgreed(!agreed); }}
              className={`flex items-start gap-2 md:gap-3 p-2 md:p-4 border cursor-pointer transition-all ${
                agreed ? "bg-accet/10 border-accet/50" : "bg-shade border-white/20"
              }`}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                agreed ? "bg-accet border-accet" : "border-white/30"
              }`}>
                {agreed && <MdCheck className="text-black text-sm" />}
              </div>
              <p className="text-[8px] lg:text-[11px] text-white/60 font-body leading-relaxed">
                {t("user_messages.agreement")}{" "}
                <span className="text-accet underline cursor-pointer">{t("user_messages.privacyPolicy")}</span>
                {" "}and{" "}
                <span className="text-accet underline cursor-pointer">{t("user_messages.terms")}</span>.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-dvh lg:h-screen relative lg:overflow-hidden font-body">        
      <div className="container mx-auto px-4 py-3 md:py-6 relative z-10">
        {/* Header */}
        <div className="flex justify-center items-center mb-4 md:mb-6">
          <div className="text-center">
            <h1 className="text-xl lg:text-3xl font-heading uppercase font-black tracking-wide leading-6 text-transparent bg-linear-to-r from-accet to-indigo-400 bg-clip-text">
              {t("header.title")}
            </h1>
            <p className="text-[8px] lg:text-[13px] md:mt-1 font-medium text-white/40 font-body">
              {t("header.subtitle")}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:flex lg:gap-8 lg:items-start md:w-[95%] justify-center mx-auto">
          
          {/* Left Column - ID Card (Desktop: Sticky, Mobile: Toggleable) */}
          <div className="sticky top-3 lg:top-6 lg:w-[450px] lg:shrink-0 z-10">
            <DigitalIDCard
              data={formData}
              t={t}
              // isExpanded={isCardExpanded}
              // onToggle={() => setIsCardExpanded(!isCardExpanded)}
            />
            
            {/* Mobile Toggle Button */}
            {/* <button
              onClick={() => setIsCardExpanded(!isCardExpanded)}
              className="lg:hidden w-full mb-2 rounded-md py-2 bg-shade border border-white/10 text-[9px] uppercase tracking-widest text-white/50 flex items-center justify-center gap-2"
            >
              {isCardExpanded ? "Hide ID Preview" : "Show ID Preview"} 
              <span className={`transition-transform ${isCardExpanded ? "rotate-180" : ""}`}>▼</span>
            </button> */}
          </div>

          {/* Right Column - Form */}
          <div className="flex-1 lg:w-[90%]">
            {/* <StepIndicator currentStep={step} totalSteps={totalSteps} steps={steps} /> */}

            <div className="bg-shade/50 backdrop-blur-[2px] border border-white/10 rounded-xl p-4 lg:px-8 lg:py-6 lg:min-h-112.5 flex flex-col">
              {/* Form Content */}
              <div className="lg:flex-1">
                {renderStepContent()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-3 md:mt-8 pt-3 md:pt-6 border-t border-white/10">
                <button
                  onClick={handleBack}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 text-[10px] lg:text-[12px] uppercase font-heading font-bold tracking-widest transition-all ${
                    step === 1 ? "opacity-0 pointer-events-none" : "text-white/50 hover:text-white"
                  }`}
                >
                  <HiArrowLeft /> {t("vote_messages.back") || "Back"}
                </button>

                {step < totalSteps ? (
                  <button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 font-heading text-[10px] lg:text-[12px] tracking-wider uppercase font-bold transition-all duration-300 ${
                      isStepValid()
                        ? "bg-gradient-to-r from-accet/80 to-accet text-white hover:shadow-lg hover:shadow-accet/30"
                        : "bg-white/5 text-white/30 cursor-not-allowed"
                    }`}
                  >
                    {t("vote_messages.next") || "Continue"} <HiArrowRight />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!isStepValid() || isSubmitting}
                    className={`flex items-center gap-2 md:px-8 px-4 md:py-3 py-2.5 font-heading text-[11px] lg:text-[12px] tracking-wider uppercase font-bold transition-all duration-300 ${
                      isStepValid() && !isSubmitting
                        ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/30"
                        : "bg-white/5 text-white/30 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <MdVerifiedUser className="text-[12px] md:text-base" />
                        {t("vote_messages.finish") || "Proceed to Vote"}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-[7px] lg:text-[10px] tracking-widest text-white/40 flex justify-between items-center mt-2 md:mt-3 px-2 font-heading">
              <p className="hover:text-white cursor-pointer transition-colors">
                {t("user_messages.privacyPolicy")}
              </p>
              <p className="hover:text-white cursor-pointer transition-colors">
                {t("user_messages.terms")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Modal */}
      {showMap && (
        <DistrictMapPicker
          currentDistrict={formData.district}
          onClose={() => setShowMap(false)}
          onConfirm={(selectedDistrict) => {
            handleChange("district", selectedDistrict);
            setShowMap(false);
          }}
        />
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.8; }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default UserDetails;