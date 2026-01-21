import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import DigitalGlobeBackground from "../Components/DigitalGlobeBackground";
import scifi from "../assets/scifi.wav";
import click from "../assets/click2.wav";
import useSound from "use-sound";

const QnA = () => {
  const { t } = useTranslation();
  const [Click] = useSound(click, { volume: 0.2 });
  const [playClick] = useSound(scifi, { volume: 0.3 });
  const location = useLocation();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [otherText, setOtherText] = useState(""); 

  const questions = [
    {
      id: 1,
      question: t("qna.q1.question"),
      type: "text",
      hasOther: false,
      options: [
        { id: "a", text: t("qna.q1.options.a") },
        { id: "b", text: t("qna.q1.options.b") },
        { id: "c", text: t("qna.q1.options.c") },
        { id: "d", text: t("qna.q1.options.d") },
        { id: "e", text: t("qna.q1.options.e") },
      ],
    },
    {
      id: 2,
      question: t("qna.q2.question"),
      type: "text",
      hasOther: false,
      options: [
        { id: "a", text: t("qna.q2.options.a") },
        { id: "b", text: t("qna.q2.options.b") },
        { id: "c", text: t("qna.q2.options.c") },
        { id: "d", text: t("qna.q2.options.d") },
        { id: "e", text: t("qna.q2.options.e") },
      ],
    },
    {
      id: 3,
      question: t("qna.q3.question"),
      type: "text",
      hasOther: true,
      options: [
        { id: "a", text: t("qna.q3.options.a") },
        { id: "b", text: t("qna.q3.options.b") },
        { id: "c", text: t("qna.q3.options.c") },
        { id: "d", text: t("qna.q3.options.d") },
        { id: "e", text: t("qna.q3.options.e") },
        { id: "f", text: t("qna.q3.options.f") },
        { id: "g", text: t("qna.q3.options.g") },
        { id: "h", text: t("qna.q3.options.h") },
        { id: "i", text: t("qna.q3.options.i") },
        { id: "j", text: t("qna.q3.options.j"), isOther: true },
      ],
    },
    {
      id: 4,
      question: t("qna.q4.question"),
      type: "text",
      hasOther: true,
      options: [
        { id: "a", text: t("qna.q4.options.a") },
        { id: "b", text: t("qna.q4.options.b") },
        { id: "c", text: t("qna.q4.options.c") },
        { id: "d", text: t("qna.q4.options.d") },
        { id: "e", text: t("qna.q4.options.e") },
        { id: "f", text: t("qna.q4.options.f") },
        { id: "g", text: t("qna.q4.options.g")},
        { id: "h", text: t("qna.q4.options.h"), isOther: true },
      ],
    },
    {
      id: 5,
      question: t("qna.q5.question"),
      type: "image",
      hasOther: false,
      options: [
        {
          id: "a",
          images: [
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/dmk-logo-png_seeklogo-411320.png",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/vck.jpg",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/Indian_National_Congress_hand_logo.png",
          ],
        },
        {
          id: "b",
          images: [
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/images.png",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/bjp-logo-png.png",
          ],
        },
        {
          id: "c",
          images: [
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/images.png",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/images.jpg",
          ],
        },
        {
          id: "d",
          images: [
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/images.jpg",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/pmk.jpg",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/Indian_National_Congress_hand_logo.png",
          ],
        },
        {
          id: "e",
          images: [
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/images.png",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/pmk.jpg",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/1118412_desiya_murpokku_dravida_kazhagam_logo.jpg",
          ],
        },
        {
          id: "f",
          images: [
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/images.jpg",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/pmk.jpg",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/1118412_desiya_murpokku_dravida_kazhagam_logo.jpg",
          ],
        },
        {
          id: "g",
          images: [
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/images.jpg",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/Indian_National_Congress_hand_logo.png",
          ],
        },
        {
          id: "h",
          text: "No alliance",
          images: [],
        },
      ],
    },
  ];


  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  // Check if current selected option is "Other"
  const isOtherSelected = () => {
    if (!selectedOption) return false;
    const currentOption = question.options.find(opt => opt.id === selectedOption);
    return currentOption?.isOther === true;
  };

  const handleOptionSelect = (optionId) => {
    if (isAnimating || isCompleting) return;
    setSelectedOption(optionId);
    setShowError(false);
    
    // If not "Other" option, clear the other text
    const selectedOpt = question.options.find(opt => opt.id === optionId);
    if (!selectedOpt?.isOther) {
      setOtherText("");
    }
  };

  const handleOtherTextChange = (e) => {
    setOtherText(e.target.value);
    setShowError(false);
  };

  const handleNext = () => {
    playClick()
    if (!selectedOption) {
      setShowError(true);
      return;
    }

    if (isOtherSelected() && !otherText.trim()) {
      setShowError(true);
      return;
    }

    if (isAnimating || isCompleting) return;

    const answerValue = isOtherSelected() 
      ? { type: "other", text: otherText.trim() }
      : { type: "option", value: selectedOption };

    const updatedAnswers = {
      ...answers,
      [question.id]: answerValue,
    };
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      localStorage.setItem("voter_status", "survey_completed");
      navigate("/candidate", {
        replace: true,
      });
      return;
    }

    setIsAnimating(true);

    setTimeout(() => {
      setCurrentQuestion((prev) => prev + 1);
      
      // Restore previous answer if exists
      const nextQuestionId = questions[currentQuestion + 1]?.id;
      const previousAnswer = answers[nextQuestionId];
      
      if (previousAnswer) {
        if (previousAnswer.type === "other") {
          // Find the "other" option
          const otherOption = questions[currentQuestion + 1]?.options.find(opt => opt.isOther);
          setSelectedOption(otherOption?.id || null);
          setOtherText(previousAnswer.text || "");
        } else {
          setSelectedOption(previousAnswer.value || null);
          setOtherText("");
        }
      } else {
        setSelectedOption(null);
        setOtherText("");
      }
      
      setIsAnimating(false);
      setShowError(false);
    }, 300);
  };

  const handlePrevious = () => {
    playClick()
    if (currentQuestion > 0 && !isAnimating && !isCompleting) {
      setIsAnimating(true);
      setShowError(false);
      setTimeout(() => {
        setCurrentQuestion((prev) => prev - 1);
        
        // Restore previous answer
        const prevQuestionId = questions[currentQuestion - 1]?.id;
        const previousAnswer = answers[prevQuestionId];
        
        if (previousAnswer) {
          if (previousAnswer.type === "other") {
            const otherOption = questions[currentQuestion - 1]?.options.find(opt => opt.isOther);
            setSelectedOption(otherOption?.id || null);
            setOtherText(previousAnswer.text || "");
          } else {
            setSelectedOption(previousAnswer.value || null);
            setOtherText("");
          }
        } else {
          setSelectedOption(null);
          setOtherText("");
        }
        
        setIsAnimating(false);
      }, 300);
    }
  };


  const renderAllianceImages = (images, isSelected) => {
    return (
      <div className="flex items-center justify-start gap-2 sm:gap-2 flex-wrap">
        {images.map((img, idx) => (
          <React.Fragment key={idx}>
            <div
              className={`relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                isSelected
                  ? "border-accet shadow-[0_0_10px_rgba(95,93,233,0.3)]"
                  : "border-white/20 group-hover:border-accet/50"
              }`}
            >
              <img
                src={img}
                alt={`Party ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/50x50?text=Logo";
                }}
              />
            </div>
            {idx < images.length - 1 && (
              <span
                className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${
                  isSelected ? "text-accet" : "text-white/50"
                }`}
              >
                +
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // 👈 Render "Other" option with input field
  const renderOtherOption = (option, isSelected) => {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex-1 text-left">
            <p
              className={`font-heading capitalize font-medium tracking-wide lg:text-[16px] text-[13px] sm:text-[14px] transition-colors duration-300 ${
                isSelected
                  ? "text-accet"
                  : "text-white/90 group-hover:text-white"
              }`}
            >
              {option.text}
            </p>
          </div>
          <div
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
              isSelected
                ? "bg-accet scale-100"
                : "bg-white/10 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100"
            }`}
          >
            {isSelected ? (
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-black"
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
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            )}
          </div>
        </div>
        
        {/* 👈 Input field - only show when "Other" is selected */}
        {isSelected && (
          <div 
            className="mt-3 animate-fadeIn"
            onClick={(e) => e.stopPropagation()} // Prevent button click
          >
            <input
              type="text"
              value={otherText}
              onChange={handleOtherTextChange}
              placeholder={t("qna.otherPlaceholder") || "Please specify..."}
              className={`w-full px-4 py-2.5 bg-black/50 border rounded-lg text-white text-sm font-heading placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accet/50 transition-all duration-300 ${
                showError && !otherText.trim()
                  ? "border-red-500/50"
                  : "border-accet/30 focus:border-accet"
              }`}
              autoFocus
            />
            {showError && !otherText.trim() && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                </svg>
                {t("qna.otherRequired") || "Please enter your answer"}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-dvh bg-black relative">
      <DigitalGlobeBackground />
      <div className="scanline" />
      <div className="vignette" />

      {/* Main Content */}
      <div className="h-full w-full relative z-10 flex flex-col">
        <div className="flex-1 flex flex-col py-4 px-4 min-h-0">
          {/* Header with Candidate Info */}
          <div className="shrink-0 mb-4 mt-3">
            {/* <div className="flex items-center justify-center gap-2 mb-4">
              <img
                src={selectedCandidate.party_logo}
                alt={selectedCandidate.party}
                className="w-8 h-8 lg:w-14 lg:h-14 rounded-full border border-accet/40 object-cover"
              />
              <div className="bg-accet/10 border border-accet/30 rounded-full px-3 py-1">
                <span className="text-accet text-[10px] lg:text-[14px] font-heading font-medium">
                  {t("vote_messages.votingFor")} {"  "}
                  <span className="font-bold">{selectedCandidate.name}</span>
                </span>
              </div>
            </div> */}

            {/* Progress Section */}
            <div className="relative max-w-md lg:max-w-[50%] mx-auto mt-4 lg:mt-8">
              <div className="flex justify-between items-center mb-2 px-1">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center justify-center transition-all duration-500 ${
                      index <= currentQuestion
                        ? "scale-100"
                        : "scale-75 opacity-50"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-500 ${
                        index < currentQuestion
                          ? "bg-linear-to-br from-accet to-accet/30 text-black"
                          : index === currentQuestion
                          ? "bg-accet/20 border-2 border-accet text-accet"
                          : "bg-white/5 border border-white/20 text-white/30"
                      }`}
                    >
                      {index < currentQuestion ? (
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
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
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index === currentQuestion && (
                      <div className="absolute inset-0 bg-accet/30 rounded-full animate-ping" />
                    )}
                  </div>
                ))}
              </div>

              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-accet via-cyan-300 to-accet/50 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-2 text-[10px]">
                <span className="text-white/40">
                  {t("vote_messages.questionCounter")} {currentQuestion + 1}{" "}
                  {t("vote_messages.of")} {questions.length}
                </span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="flex-1 min-h-0 flex flex-col justify-center">
            <div
              className={`transition-all duration-300 mx-auto w-full max-w-2xl ${
                isAnimating
                  ? "opacity-0 translate-x-10"
                  : "opacity-100 translate-x-0"
              }`}
            >
              <div className="text-center mb-5">
                <p className="text-[14px] md:text-[16px] lg:text-[20px] font-heading font-bold text-accet">
                  {question.question}
                </p>
              </div>

              {showError && !isOtherSelected() && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-center animate-shake">
                  <p className="text-red-400 text-sm font-medium flex items-center justify-center gap-2">
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {t("vote_messages.selectError") || "Please select an option to continue"}
                  </p>
                </div>
              )}

              <div
                className={`grid gap-2 sm:gap-3 ${
                  question.type === "image"
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2"
                }`}
              >
                {question.options.map((option, index) => {
                  const isSelected = selectedOption === option.id;
                  const hasImages = option.images && option.images.length > 0;
                  const isOther = option.isOther === true;

                  return (
                    <button
                      key={`${option.id}-${index}`}
                      onClick={() => {
                        Click()
                        handleOptionSelect(option.id)}}
                      disabled={isAnimating || isCompleting}
                      className={`group relative overflow-hidden transition-all duration-300 transform ${
                        isSelected
                          ? "scale-[1.02] bg-linear-to-br from-accet/20 via-accet/10 to-shade backdrop-blur-sm border-2 border-accet shadow-[0_0_20px_rgba(95,98,233,0.3)]"
                          : `bg-shade border ${
                              showError && !isOtherSelected()
                                ? "border-red-500/30"
                                : "border-white/10"
                            } hover:border-accet/40 hover:bg-white/10 active:scale-[0.98]`
                      } ${
                        question.type === "image"
                          ? "px-3 py-4 sm:px-4 sm:py-5"
                          : "px-4 py-3 sm:p-4"
                      } ${isAnimating || isCompleting ? "pointer-events-none" : ""} ${
                        isOther && isSelected ? "sm:col-span-2" : "" // Other option spans full width when selected
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-linear-to-r from-accet/10 via-transparent to-accet/10 animate-pulse" />
                      )}

                      <div className="relative flex items-center justify-between gap-3">
                        {/* 👈 Check if it's "Other" option */}
                        {isOther ? (
                          renderOtherOption(option, isSelected)
                        ) : question.type === "image" && hasImages ? (
                          <>
                            <div className="flex-1">
                              {renderAllianceImages(option.images, isSelected)}
                            </div>
                            <div
                              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                                isSelected
                                  ? "bg-accet scale-100"
                                  : "bg-shade scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100"
                              }`}
                            >
                              {isSelected ? (
                                <svg
                                  className="w-4 h-4 text-black"
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
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-white/30" />
                              )}
                            </div>
                          </>
                        ) : question.type === "image" && option.text ? (
                          <>
                            <div className="flex-1 flex items-center justify-start">
                              <p
                                className={`font-heading font-normal text-sm md:text-base lg:text-[18px] transition-colors duration-300 ${
                                  isSelected ? "text-accet" : "text-white/70"
                                }`}
                              >
                                {option.text}
                              </p>
                            </div>
                            <div
                              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                                isSelected
                                  ? "bg-accet scale-100"
                                  : "bg-white/10 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100"
                              }`}
                            >
                              {isSelected ? (
                                <svg
                                  className="w-4 h-4 text-black"
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
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-white/30" />
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 text-left">
                              <p
                                className={`font-heading capitalize font-medium tracking-wide lg:text-[16px] text-[13px] sm:text-[14px] transition-colors duration-300 ${
                                  isSelected
                                    ? "text-accet"
                                    : "text-white/90 group-hover:text-white"
                                }`}
                              >
                                {option.text}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                                isSelected
                                  ? "bg-accet scale-100"
                                  : "bg-white/10 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100"
                              }`}
                            >
                              {isSelected ? (
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4 text-black"
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
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="shrink-0 flex items-center justify-between gap-4 mt-4 max-w-lg lg:max-w-[50%] lg:mt-14 mx-auto w-full">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0 || isAnimating || isCompleting}
              className={`flex items-center gap-2 px-4 py-2.5 font-heading font-bold text-sm lg:text-[16px] uppercase tracking-wider transition-all duration-300 ${
                currentQuestion === 0 || isAnimating || isCompleting
                  ? "bg-white/5 text-white/20 cursor-not-allowed"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/30"
              }`}
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">{t("vote_messages.back")}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={isAnimating || isCompleting}
              className={`flex items-center gap-2 px-6 py-2.5 font-heading font-bold text-sm lg:text-[16px] uppercase tracking-wider transition-all duration-300 ${
                isAnimating || isCompleting
                  ? "bg-accet/50 text-black/50 cursor-not-allowed"
                  : selectedOption
                  ? "bg-linear-to-r from-accet to-accet/30 text-black hover:shadow-[0_0_30px_rgba(95,98,233,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-linear-to-r from-accet/50 to-accet/50 text-black/70"
              }`}
            >
              <span>
                {isLastQuestion
                  ? t("vote_messages.finish")
                  : t("vote_messages.next")}
              </span>
              {isCompleting ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QnA;