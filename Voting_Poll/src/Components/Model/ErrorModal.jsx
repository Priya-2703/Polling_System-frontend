// Components/Modals/ErrorModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { MdCheck, MdWarning, MdError, MdInfo } from "react-icons/md";

// ========================================
// ✅ ERROR TYPES CONFIGURATION
// ========================================
export const ERROR_TYPES = {
  ALREADY_REGISTERED: "ALREADY_REGISTERED",
  INVALID_ID: "INVALID_ID",
  INVALID_PHONE: "INVALID_PHONE",
  NETWORK_ERROR: "NETWORK_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DUPLICATE_PHONE: "DUPLICATE_PHONE",
  DUPLICATE_ID: "DUPLICATE_ID",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  RATE_LIMIT: "RATE_LIMIT",
  ALREADY_VOTED: "ALREADY_VOTED",
  UNKNOWN: "UNKNOWN",
};

// ========================================
// ✅ ERROR MESSAGES (Tamil & English)
// ========================================
export const ERROR_MESSAGES = {
  [ERROR_TYPES.ALREADY_REGISTERED]: {
    title: "Already Registered!",
    titleTamil: "ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது!",
    message:
      "You have already registered with this ID. Please proceed to vote directly.",
    messageTamil:
      "இந்த ID-ஐப் பயன்படுத்தி நீங்கள் ஏற்கனவே பதிவு செய்துள்ளீர்கள். நேரடியாக வாக்களிக்க தொடரவும்.",
    icon: "info",
    actionText: "Try Again",
    actionTextTamil: "மீண்டும் முயற்சிக்கவும்",
    showVoteButton: true,
    voteButtonText: "Go to Vote",
    voteButtonTextTamil: "வாக்களிக்க செல்",
  },
  [ERROR_TYPES.ALREADY_VOTED]: {
    title: "Already Voted!",
    titleTamil: "ஏற்கனவே வாக்களித்துவிட்டீர்கள்!",
    message:
      "You have already cast your vote. Each person can vote only once.",
    messageTamil:
      "நீங்கள் ஏற்கனவே உங்கள் வாக்கை செலுத்திவிட்டீர்கள். ஒவ்வொருவரும் ஒரு முறை மட்டுமே வாக்களிக்க முடியும்.",
    icon: "info",
    actionText: "Close",
    actionTextTamil: "மூடு",
    showVoteButton: false,
  },
  [ERROR_TYPES.DUPLICATE_PHONE]: {
    title: "Phone Number Already Used",
    titleTamil: "ஃபோன் நம்பர் ஏற்கனவே பயன்படுத்தப்பட்டுள்ளது",
    message: "This phone number is already registered with another account.",
    messageTamil:
      "இந்த ஃபோன் நம்பர் வேறொரு கணக்கில் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.",
    icon: "warning",
    actionText: "Use Different Number",
    actionTextTamil: "வேறு நம்பரைப் பயன்படுத்தவும்",
    showVoteButton: false,
  },
  [ERROR_TYPES.DUPLICATE_ID]: {
    title: "ID Already Registered",
    titleTamil: "ID ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது",
    message:
      "This ID number is already registered. If this is your ID, you may have already registered.",
    messageTamil:
      "இந்த ID நம்பர் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது. இது உங்கள் ID எனில், நீங்கள் ஏற்கனவே பதிவு செய்திருக்கலாம்.",
    icon: "warning",
    actionText: "Try Again",
    actionTextTamil: "மீண்டும் முயற்சிக்கவும்",
    showVoteButton: true,
    voteButtonText: "Go to Vote",
    voteButtonTextTamil: "வாக்களிக்க செல்",
  },
  [ERROR_TYPES.INVALID_ID]: {
    title: "Invalid ID Number",
    titleTamil: "தவறான ID நம்பர்",
    message:
      "The ID number you entered is not valid. Please check and try again.",
    messageTamil:
      "நீங்கள் உள்ளிட்ட ID நம்பர் சரியானது அல்ல. சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
    icon: "error",
    actionText: "Correct ID",
    actionTextTamil: "ID-ஐ சரிசெய்யவும்",
    showVoteButton: false,
  },
  [ERROR_TYPES.INVALID_PHONE]: {
    title: "Invalid Phone Number",
    titleTamil: "தவறான ஃபோன் நம்பர்",
    message: "Please enter a valid 10-digit phone number.",
    messageTamil: "சரியான 10 இலக்க ஃபோன் நம்பரை உள்ளிடவும்.",
    icon: "error",
    actionText: "Correct Phone",
    actionTextTamil: "நம்பரை சரிசெய்யவும்",
    showVoteButton: false,
  },
  [ERROR_TYPES.NETWORK_ERROR]: {
    title: "Connection Problem",
    titleTamil: "இணைப்பு பிரச்சனை",
    message:
      "Unable to connect to the server. Please check your internet connection and try again.",
    messageTamil:
      "சர்வருடன் இணைக்க முடியவில்லை. உங்கள் இணைய இணைப்பை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
    icon: "error",
    actionText: "Retry",
    actionTextTamil: "மீண்டும் முயற்சிக்கவும்",
    showVoteButton: false,
  },
  [ERROR_TYPES.SERVER_ERROR]: {
    title: "Server Error",
    titleTamil: "சர்வர் பிழை",
    message:
      "Something went wrong on our end. Please try again after some time.",
    messageTamil:
      "எங்கள் தரப்பில் ஏதோ தவறு நடந்தது. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.",
    icon: "error",
    actionText: "Try Later",
    actionTextTamil: "பின்னர் முயற்சிக்கவும்",
    showVoteButton: false,
  },
  [ERROR_TYPES.VALIDATION_ERROR]: {
    title: "Invalid Information",
    titleTamil: "தவறான தகவல்",
    message:
      "Some of the information you provided is not valid. Please review and correct it.",
    messageTamil:
      "நீங்கள் வழங்கிய சில தகவல்கள் சரியானவை அல்ல. மறுபரிசீலனை செய்து திருத்தவும்.",
    icon: "warning",
    actionText: "Review",
    actionTextTamil: "மறுபரிசீலனை",
    showVoteButton: false,
  },
  [ERROR_TYPES.SESSION_EXPIRED]: {
    title: "Session Expired",
    titleTamil: "அமர்வு காலாவதியானது",
    message:
      "Your session has expired. Please refresh the page and try again.",
    messageTamil:
      "உங்கள் அமர்வு காலாவதியானது. பக்கத்தை புதுப்பித்து மீண்டும் முயற்சிக்கவும்.",
    icon: "warning",
    actionText: "Refresh",
    actionTextTamil: "புதுப்பிக்கவும்",
    showVoteButton: false,
  },
  [ERROR_TYPES.RATE_LIMIT]: {
    title: "Too Many Attempts",
    titleTamil: "அதிகமான முயற்சிகள்",
    message:
      "You have made too many attempts. Please wait for a few minutes before trying again.",
    messageTamil:
      "நீங்கள் அதிகமான முயற்சிகள் செய்துள்ளீர்கள். சில நிமிடங்கள் காத்திருந்து மீண்டும் முயற்சிக்கவும்.",
    icon: "warning",
    actionText: "Wait",
    actionTextTamil: "காத்திருக்கவும்",
    showVoteButton: false,
  },
  [ERROR_TYPES.UNKNOWN]: {
    title: "Something Went Wrong",
    titleTamil: "ஏதோ தவறு நடந்தது",
    message: "An unexpected error occurred. Please try again.",
    messageTamil: "எதிர்பாராத பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
    icon: "error",
    actionText: "Try Again",
    actionTextTamil: "மீண்டும் முயற்சிக்கவும்",
    showVoteButton: false,
  },
};

// ========================================
// ✅ ERROR TYPE DETECTION FUNCTION
// ========================================
export const detectErrorType = (error, statusCode) => {
  const errorLower = error?.toLowerCase() || "";

  // Check for already voted
  if (
    errorLower.includes("already voted") ||
    errorLower.includes("vote already") ||
    errorLower.includes("already cast")
  ) {
    return ERROR_TYPES.ALREADY_VOTED;
  }

  // Check for already registered
  if (
    errorLower.includes("already registered") ||
    errorLower.includes("already exists") ||
    errorLower.includes("user exists") ||
    errorLower.includes("duplicate entry") ||
    statusCode === 409
  ) {
    if (errorLower.includes("phone") || errorLower.includes("mobile")) {
      return ERROR_TYPES.DUPLICATE_PHONE;
    }
    if (
      errorLower.includes("id") ||
      errorLower.includes("aadhar") ||
      errorLower.includes("pan")
    ) {
      return ERROR_TYPES.DUPLICATE_ID;
    }
    return ERROR_TYPES.ALREADY_REGISTERED;
  }

  // Check for invalid ID
  if (
    errorLower.includes("invalid id") ||
    errorLower.includes("invalid aadhar") ||
    errorLower.includes("invalid pan") ||
    errorLower.includes("id verification failed")
  ) {
    return ERROR_TYPES.INVALID_ID;
  }

  // Check for invalid phone
  if (
    errorLower.includes("invalid phone") ||
    errorLower.includes("invalid mobile") ||
    errorLower.includes("phone verification failed")
  ) {
    return ERROR_TYPES.INVALID_PHONE;
  }

  // Check for network errors
  if (
    errorLower.includes("network") ||
    errorLower.includes("connection") ||
    errorLower.includes("timeout") ||
    errorLower.includes("econnrefused") ||
    statusCode === 0
  ) {
    return ERROR_TYPES.NETWORK_ERROR;
  }

  // Check for server errors
  if (statusCode >= 500) {
    return ERROR_TYPES.SERVER_ERROR;
  }

  // Check for validation errors
  if (
    errorLower.includes("validation") ||
    errorLower.includes("required") ||
    errorLower.includes("missing") ||
    statusCode === 400
  ) {
    return ERROR_TYPES.VALIDATION_ERROR;
  }

  // Check for session/auth errors
  if (
    errorLower.includes("session") ||
    errorLower.includes("expired") ||
    errorLower.includes("unauthorized") ||
    statusCode === 401
  ) {
    return ERROR_TYPES.SESSION_EXPIRED;
  }

  // Check for rate limiting
  if (
    errorLower.includes("rate limit") ||
    errorLower.includes("too many") ||
    statusCode === 429
  ) {
    return ERROR_TYPES.RATE_LIMIT;
  }

  return ERROR_TYPES.UNKNOWN;
};

// ========================================
// ✅ ERROR MODAL COMPONENT
// ========================================
const ErrorModal = ({
  isOpen,
  errorType = ERROR_TYPES.UNKNOWN,
  originalMessage = "",
  onClose,
  onGoToVote,
  language = "en",
  showDetails = true,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const errorConfig =
    ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ERROR_TYPES.UNKNOWN];

  const isTamil = language === "ta";
  const title = isTamil ? errorConfig.titleTamil : errorConfig.title;
  const message = isTamil ? errorConfig.messageTamil : errorConfig.message;
  const actionText = isTamil
    ? errorConfig.actionTextTamil
    : errorConfig.actionText;
  const voteButtonText = isTamil
    ? errorConfig.voteButtonTextTamil
    : errorConfig.voteButtonText;

  // Icon based on error type
  const getIcon = () => {
    switch (errorConfig.icon) {
      case "info":
        return <MdInfo className="text-blue-400 text-3xl" />;
      case "warning":
        return <MdWarning className="text-yellow-400 text-3xl" />;
      case "error":
      default:
        return <MdError className="text-red-400 text-3xl" />;
    }
  };

  // Colors based on error type
  const getColors = () => {
    switch (errorConfig.icon) {
      case "info":
        return {
          border: "border-blue-500/30",
          bg: "bg-blue-500/10",
          iconBg: "bg-blue-500/20",
          button: "bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30",
        };
      case "warning":
        return {
          border: "border-yellow-500/30",
          bg: "bg-yellow-500/10",
          iconBg: "bg-yellow-500/20",
          button: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30",
        };
      case "error":
      default:
        return {
          border: "border-red-500/30",
          bg: "bg-red-500/10",
          iconBg: "bg-red-500/20",
          button: "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30",
        };
    }
  };

  const colors = getColors();

  const handleGoToVote = () => {
    if (onGoToVote) {
      onGoToVote();
    } else {
      // localStorage.setItem("voter_status", "registered");
      navigate("/vote", { replace: true });
    }
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-shade border ${colors.border} ${colors.bg} rounded-xl p-6 max-w-md w-full animate-modal-enter`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5"
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

        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-full ${colors.iconBg} flex items-center justify-center shrink-0`}
          >
            {getIcon()}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-heading font-bold text-lg uppercase tracking-wide">
              {title}
            </h3>
            <p className="text-white/50 text-[10px] mt-1 font-mono">
              Error Code: {errorType}
            </p>
          </div>
        </div>

        {/* Message */}
        <div className="mb-6 space-y-3">
          <p className="text-white/80 text-sm font-body leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Go to Vote Button (for already registered users) */}
          {errorConfig.showVoteButton && (
            <button
              onClick={handleGoToVote}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-heading uppercase tracking-widest text-sm rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2"
            >
              <MdCheck className="text-lg" />
              {voteButtonText || (isTamil ? "வாக்களிக்க செல்" : "Proceed to Vote")}
            </button>
          )}

          {/* Primary Action Button */}
          <button
            onClick={onClose}
            className={`w-full py-3 border font-heading uppercase tracking-widest text-sm rounded-lg transition-all ${colors.button}`}
          >
            {actionText}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-[10px] text-white/40 text-center font-body">
            {isTamil
              ? "உதவி தேவைப்பட்டால், எங்கள் ஆதரவைத் தொடர்பு கொள்ளவும்"
              : "If you need help, please contact our support team"}
          </p>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes modal-enter {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-enter {
          animation: modal-enter 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ErrorModal;