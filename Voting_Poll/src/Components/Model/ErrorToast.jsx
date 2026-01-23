// Components/Modals/ErrorToast.jsx
import React, { useEffect } from "react";
import { MdWarning, MdError, MdInfo, MdCheck } from "react-icons/md";

const ErrorToast = ({
  isOpen,
  message,
  type = "error", // "error" | "warning" | "info" | "success"
  onClose,
  duration = 5000,
  position = "top-right", // "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center"
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  // Type-based styling
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-500/20",
          border: "border-green-500/50",
          text: "text-green-400",
          icon: <MdCheck className="text-green-400 text-xl" />,
        };
      case "warning":
        return {
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/50",
          text: "text-yellow-400",
          icon: <MdWarning className="text-yellow-400 text-xl" />,
        };
      case "info":
        return {
          bg: "bg-blue-500/20",
          border: "border-blue-500/50",
          text: "text-blue-400",
          icon: <MdInfo className="text-blue-400 text-xl" />,
        };
      case "error":
      default:
        return {
          bg: "bg-red-500/20",
          border: "border-red-500/50",
          text: "text-red-400",
          icon: <MdError className="text-red-400 text-xl" />,
        };
    }
  };

  // Position styling
  const getPositionStyles = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-center":
        return "top-4 left-1/2 -translate-x-1/2";
      case "top-right":
      default:
        return "top-4 right-4";
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`fixed ${getPositionStyles()} z-[100] ${styles.bg} ${styles.border} border rounded-lg p-4 max-w-sm animate-toast-enter backdrop-blur-sm shadow-lg`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{styles.icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`${styles.text} text-sm font-body break-words`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors shrink-0"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-lg overflow-hidden">
        <div
          className={`h-full ${styles.text.replace("text-", "bg-")} animate-toast-progress`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes toast-enter {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-toast-enter {
          animation: toast-enter 0.3s ease-out;
        }
        .animate-toast-progress {
          animation: toast-progress linear forwards;
        }
      `}</style>
    </div>
  );
};

export default ErrorToast;