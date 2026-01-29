import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import DigitalGlobeBackground from "../Components/DigitalGlobeBackground";
import scifi from "../assets/scifi.wav";
import click from "../assets/click2.wav";
import useSound from "use-sound";
import { submitSurvey } from "../utils/service/api";

const QnA = () => {
  const { t } = useTranslation();
  const { voteId, checkUserStatus } = useAuth();
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
  const [apiError, setApiError] = useState(null);

  // Image Upload States
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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
        { id: "g", text: t("qna.q4.options.g") },
        { id: "h", text: t("qna.q4.options.h"), isOther: true },
      ],
    },
    {
      id: 5,
      question:
        t("qna.q5.question") || "Upload an image of a problem in your district",
      type: "image_upload",
      isOptional: true,
      hasOther: false,
      options: [],
    },
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isImageUploadQuestion = question.type === "image_upload";

  // Check if current selected option is "Other"
  const isOtherSelected = () => {
    if (!selectedOption) return false;
    const currentOption = question.options.find(
      (opt) => opt.id === selectedOption,
    );
    return currentOption?.isOther === true;
  };

  const formatSurveyData = (answersToFormat) => {
    const formattedData = {};

    Object.keys(answersToFormat).forEach((questionId) => {
      const answer = answersToFormat[questionId];

      // ✅ Skip பண்ணா அந்த question-ஐ include பண்ணாதே
      if (answer.type === "skipped") {
        // Don't add to formattedData - skip entirely
        return;
      }

      if (answer.type === "other") {
        formattedData[questionId] = {
          value: "other",
          text: answer.text,
        };
      } else if (answer.type === "image") {
        // ✅ Image upload பண்ணா மட்டும் include பண்ணு
        formattedData[questionId] = {
          value: "image",
          file: answer.file,
        };
      } else {
        formattedData[questionId] = answer.value;
      }
    });

    return formattedData;
  };

  // Image Upload Handlers
  const handleFileSelect = (file) => {
    setUploadError(null);

    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploadError(
        t("qna.imageUpload.invalidType") ||
          "Please upload a valid image (JPG, PNG, or WebP)",
      );
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(
        t("qna.imageUpload.tooLarge") || "Image size should be less than 10MB",
      );
      return;
    }

    setIsUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setUploadedImage(file);
      setIsUploading(false);
      playClick();
    };
    reader.onerror = () => {
      setUploadError(t("qna.imageUpload.readError") || "Failed to read file");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleRemoveImage = () => {
    playClick();
    setUploadedImage(null);
    setImagePreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOptionSelect = (optionId) => {
    if (isAnimating || isCompleting) return;
    setSelectedOption(optionId);
    setShowError(false);
    setApiError(null);

    const selectedOpt = question.options.find((opt) => opt.id === optionId);
    if (!selectedOpt?.isOther) {
      setOtherText("");
    }
  };

  const handleOtherTextChange = (e) => {
    setOtherText(e.target.value);
    setShowError(false);
    setApiError(null);
  };

  // Handle Skip for optional questions
  const handleSkip = () => {
    playClick();

    if (isAnimating || isCompleting) return;

    const updatedAnswers = {
      ...answers,
      [question.id]: { type: "skipped", value: null },
    };
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      handleSubmitSurvey(updatedAnswers);
    } else {
      proceedToNextQuestion(updatedAnswers);
    }
  };

  // Submit survey to API
  const handleSubmitSurvey = async (finalAnswers) => {
    setIsCompleting(true);
    setApiError(null);

    try {
      const surveyData = formatSurveyData(finalAnswers);
      const result = await submitSurvey(surveyData);

      if (result.success) {
        await checkUserStatus();
      } else {
        setApiError(
          result.error || "Failed to submit survey. Please try again.",
        );
        console.error("Survey submission failed:", result.error);
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      setApiError("Something went wrong. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  // Proceed to next question
  const proceedToNextQuestion = (updatedAnswers) => {
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentQuestion((prev) => prev + 1);

      const nextQuestionId = questions[currentQuestion + 1]?.id;
      const nextQuestion = questions[currentQuestion + 1];
      const previousAnswer = updatedAnswers[nextQuestionId];

      // Reset image states if moving to/from image upload question
      if (nextQuestion?.type !== "image_upload") {
        setUploadedImage(null);
        setImagePreview(null);
        setUploadError(null);
      }

      if (previousAnswer) {
        if (previousAnswer.type === "other") {
          const otherOption = nextQuestion?.options.find((opt) => opt.isOther);
          setSelectedOption(otherOption?.id || null);
          setOtherText(previousAnswer.text || "");
        } else if (previousAnswer.type === "image") {
          setUploadedImage(previousAnswer.file);
          // Re-create preview
          const reader = new FileReader();
          reader.onloadend = () => setImagePreview(reader.result);
          reader.readAsDataURL(previousAnswer.file);
        } else if (previousAnswer.type !== "skipped") {
          setSelectedOption(previousAnswer.value || null);
          setOtherText("");
        } else {
          setSelectedOption(null);
          setOtherText("");
        }
      } else {
        setSelectedOption(null);
        setOtherText("");
      }

      setIsAnimating(false);
      setShowError(false);
      setApiError(null);
    }, 300);
  };

  const handleNext = async () => {
    playClick();

    // For image upload question
    if (isImageUploadQuestion) {
      if (isAnimating || isCompleting) return;

      let answerValue;
      if (uploadedImage) {
        answerValue = { type: "image", file: uploadedImage };
      } else {
        // If no image and it's optional, skip
        answerValue = { type: "skipped", value: null };
      }

      const updatedAnswers = {
        ...answers,
        [question.id]: answerValue,
      };
      setAnswers(updatedAnswers);

      if (isLastQuestion) {
        await handleSubmitSurvey(updatedAnswers);
      } else {
        proceedToNextQuestion(updatedAnswers);
      }
      return;
    }

    // For regular questions
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
      ? { type: "other", value: selectedOption, text: otherText.trim() }
      : { type: "option", value: selectedOption };

    const updatedAnswers = {
      ...answers,
      [question.id]: answerValue,
    };
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      await handleSubmitSurvey(updatedAnswers);
      return;
    }

    proceedToNextQuestion(updatedAnswers);
  };

  const handlePrevious = () => {
    playClick();
    if (currentQuestion > 0 && !isAnimating && !isCompleting) {
      setIsAnimating(true);
      setShowError(false);
      setApiError(null);
      setUploadError(null);

      setTimeout(() => {
        setCurrentQuestion((prev) => prev - 1);

        const prevQuestionId = questions[currentQuestion - 1]?.id;
        const prevQuestion = questions[currentQuestion - 1];
        const previousAnswer = answers[prevQuestionId];

        // Reset image states
        setUploadedImage(null);
        setImagePreview(null);

        if (previousAnswer) {
          if (previousAnswer.type === "other") {
            const otherOption = prevQuestion?.options.find(
              (opt) => opt.isOther,
            );
            setSelectedOption(otherOption?.id || null);
            setOtherText(previousAnswer.text || "");
          } else if (previousAnswer.type === "image") {
            setUploadedImage(previousAnswer.file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(previousAnswer.file);
          } else if (previousAnswer.type !== "skipped") {
            setSelectedOption(previousAnswer.value || null);
            setOtherText("");
          } else {
            setSelectedOption(null);
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

  const handleRetry = () => {
    setApiError(null);
    handleNext();
  };

  const renderAllianceImages = (images, isSelected) => {
    return (
      <div className="flex items-center justify-start gap-2 sm:gap-2 flex-wrap">
        {images.map((img, idx) => (
          <React.Fragment key={idx}>
            <div
              className={`relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                isSelected
                  ? "border-accet shadow-[0_0_10px_rgba(0,243,255,0.3)]"
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

        {isSelected && (
          <div
            className="mt-3 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
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
                    d="M12 8v4m0 4h.01"
                  />
                </svg>
                {t("qna.otherRequired") || "Please enter your answer"}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Image Upload Question
  const renderImageUploadQuestion = () => {
    return (
      <div className="w-full max-w-lg mx-auto">
        {/* Optional Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="px-3 py-1 bg-accet/10 border border-accet/30 text-accet text-[10px] font-heading uppercase tracking-wider">
            {t("qna.imageUpload.optional") || "Optional"}
          </span>
        </div>

        {/* Upload Area */}
        {!imagePreview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative cursor-pointer transition-all duration-300 ${
              isDragging
                ? "bg-accet/20 border-accet scale-[1.02]"
                : "bg-shade hover:bg-accet/5 border-white/20 hover:border-accet/50"
            } border-2 border-dashed p-8 md:p-12`}
          >
            {/* Animated Corner Decorations */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accet/50" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accet/50" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accet/50" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accet/50" />

            <div className="flex flex-col items-center gap-4">
              {isUploading ? (
                <div className="w-16 h-16 flex items-center justify-center">
                  <svg
                    className="animate-spin w-10 h-10 text-accet"
                    viewBox="0 0 24 24"
                  >
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
                </div>
              ) : (
                <div
                  className={`w-16 h-16 flex items-center justify-center transition-colors ${
                    isDragging ? "text-accet" : "text-white/40"
                  }`}
                >
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              <div className="text-center">
                <p
                  className={`font-heading text-sm md:text-base transition-colors ${
                    isDragging ? "text-accet" : "text-white/70"
                  }`}
                >
                  {isDragging
                    ? t("qna.imageUpload.dropHere") || "Drop image here"
                    : t("qna.imageUpload.dragDrop") ||
                      "Drag & drop an image here"}
                </p>
                <p className="text-white/40 text-xs mt-2">
                  {t("qna.imageUpload.or") || "or"}
                </p>
                <button
                  type="button"
                  className="mt-3 px-5 py-2 bg-accet/10 border border-accet/40 text-accet text-sm font-heading uppercase tracking-wider hover:bg-accet/20 transition-all"
                >
                  {t("qna.imageUpload.browse") || "Browse Files"}
                </button>
              </div>

              <p className="text-white/30 text-[10px] font-heading tracking-wider mt-2">
                {t("qna.imageUpload.formats") || "JPG, PNG, WebP • Max 10MB"}
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        ) : (
          /* Image Preview */
          <div className="relative bg-shade border border-accet/30 p-4 animate-fadeIn">
            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accet" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accet" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accet" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accet" />

            {/* Success Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black border border-accet/50 z-10">
              <span className="text-accet text-[10px] font-heading uppercase tracking-wider flex items-center gap-1.5">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {t("qna.imageUpload.uploaded") || "Image Uploaded"}
              </span>
            </div>

            {/* Image */}
            <div className="relative aspect-video overflow-hidden bg-black/50 mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-contain"
              />

              {/* Scan Line Effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-accet/5 via-transparent to-accet/5" />
                <div className="absolute top-0 left-0 right-0 h-px bg-accet/30 animate-scanline" />
              </div>
            </div>

            {/* File Info */}
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-white/70 text-sm font-heading truncate">
                  {uploadedImage?.name}
                </p>
                <p className="text-white/40 text-[10px] font-heading">
                  {(uploadedImage?.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={handleRemoveImage}
                className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-heading uppercase tracking-wider hover:bg-red-500/20 transition-all flex items-center gap-2"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                {t("qna.imageUpload.remove") || "Remove"}
              </button>
            </div>
          </div>
        )}

        {/* Upload Error */}
        {uploadError && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 animate-shake">
            <p className="text-red-400 text-sm font-heading flex items-center gap-2">
              <svg
                className="w-4 h-4 shrink-0"
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
              {uploadError}
            </p>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-white/40 text-xs font-heading">
            {t("qna.imageUpload.helpText") ||
              "Share an image showing infrastructure issues, public problems, or areas needing attention in your district."}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-dvh relative">
      {/* Main Content */}
      <div className="h-full w-full relative z-10 flex flex-col">
        <div className="flex-1 flex flex-col py-4 px-4 min-h-0">
          {/* Header with Progress */}
          <div className="shrink-0 mb-4 mt-3">
            {/* Progress Section */}
            <div className="relative max-w-md lg:max-w-[50%] mx-auto mt-4 md:mt-8">
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
                {question.isOptional && (
                  <span className="text-accet/70">
                    {t("qna.imageUpload.optional") || "Optional"}
                  </span>
                )}
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
                <p className="text-[14px] md:text-[20px] font-heading font-bold text-accet">
                  {question.question}
                </p>
              </div>

              {/* API Error Message */}
              {apiError && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-shake">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                      <svg
                        className="w-5 h-5 shrink-0"
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
                      {apiError}
                    </p>
                    <button
                      onClick={handleRetry}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded text-red-400 text-xs font-medium transition-all"
                    >
                      {t("common.retry") || "Retry"}
                    </button>
                  </div>
                </div>
              )}

              {showError && !isOtherSelected() && !isImageUploadQuestion && (
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
                    {t("vote_messages.selectError") ||
                      "Please select an option to continue"}
                  </p>
                </div>
              )}

              {/* Render Image Upload or Regular Options */}
              {isImageUploadQuestion ? (
                renderImageUploadQuestion()
              ) : (
                <div
                  className={`grid gap-2 sm:gap-3 ${
                    question.type === "image"
                      ? "grid-cols-1 lg:grid-cols-2"
                      : "grid-cols-1 lg:grid-cols-2"
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
                          Click();
                          handleOptionSelect(option.id);
                        }}
                        disabled={isAnimating || isCompleting}
                        className={`group relative overflow-hidden transition-all duration-300 transform ${
                          isSelected
                            ? "scale-[1.02] bg-linear-to-br from-accet/20 via-accet/10 to-shade backdrop-blur-sm border-2 border-accet shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                            : `bg-shade border ${
                                showError && !isOtherSelected()
                                  ? "border-red-500/30"
                                  : "border-white/10"
                              } hover:border-accet/40 hover:bg-white/10 active:scale-[0.98]`
                        } ${
                          question.type === "image"
                            ? "px-3 py-4 sm:px-4 sm:py-5"
                            : "px-4 py-3 sm:p-4"
                        } ${
                          isAnimating || isCompleting
                            ? "pointer-events-none"
                            : ""
                        } ${isOther && isSelected ? "lg:col-span-2" : ""}`}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 bg-linear-to-r from-accet/10 via-transparent to-accet/10 animate-pulse" />
                        )}

                        <div className="relative flex items-center justify-between gap-3">
                          {isOther ? (
                            renderOtherOption(option, isSelected)
                          ) : question.type === "image" && hasImages ? (
                            <>
                              <div className="flex-1">
                                {renderAllianceImages(
                                  option.images,
                                  isSelected,
                                )}
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
                                  className={`font-heading capitalize font-medium tracking-wide md:text-[16px] text-[13px] sm:text-[14px] transition-colors duration-300 ${
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
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="shrink-0 flex items-center justify-between gap-4 mt-4 max-w-lg md:max-w-[90%] lg:max-w-[50%] md:mt-14 mx-auto w-full">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0 || isAnimating || isCompleting}
              className={`flex items-center gap-2 px-4 py-2.5 font-heading font-bold text-sm md:text-[16px] uppercase tracking-wider transition-all duration-300 ${
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
              <span className="hidden sm:inline">
                {t("vote_messages.back")}
              </span>
            </button>

            <div className="flex items-center gap-3">
              {/* Skip Button (only for optional questions) */}
              {question.isOptional && (
                <button
                  onClick={handleSkip}
                  disabled={isAnimating || isCompleting}
                  className={`flex items-center gap-2 px-4 py-2.5 font-heading font-bold text-sm md:text-[16px] uppercase tracking-wider transition-all duration-300 ${
                    isAnimating || isCompleting
                      ? "bg-white/5 text-white/20 cursor-not-allowed"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/30"
                  }`}
                >
                  <span>{t("qna.imageUpload.skip") || "Skip"}</span>
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
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}

              {/* Next/Finish Button */}
              <button
                onClick={handleNext}
                disabled={isAnimating || isCompleting}
                className={`flex items-center gap-2 px-6 py-2.5 font-heading font-bold text-sm md:text-[16px] uppercase tracking-wider transition-all duration-300 ${
                  isAnimating || isCompleting
                    ? "bg-accet/50 text-black/50 cursor-not-allowed"
                    : isImageUploadQuestion
                      ? uploadedImage
                        ? "bg-linear-to-r from-accet to-accet/30 text-black hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-linear-to-r from-accet/50 to-accet/50 text-black/70 hover:from-accet hover:to-accet/30 hover:text-black"
                      : selectedOption
                        ? "bg-linear-to-r from-accet to-accet/30 text-black hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-linear-to-r from-accet/50 to-accet/50 text-black/70"
                }`}
              >
                <span>
                  {isCompleting
                    ? t("vote_messages.submitting") || "Submitting..."
                    : isLastQuestion
                      ? uploadedImage
                        ? t("vote_messages.finish") || "Finish"
                        : t("vote_messages.finish") || "Finish"
                      : isImageUploadQuestion && uploadedImage
                        ? t("vote_messages.next") || "Next"
                        : isImageUploadQuestion
                          ? t("vote_messages.next") || "Next"
                          : t("vote_messages.next") || "Next"}
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
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scanline {
          animation: scanline 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default QnA;
