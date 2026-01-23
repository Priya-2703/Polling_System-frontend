import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../Context/AuthContext";
import { resumeSession } from "../../utils/service/api";
import { useNavigate } from "react-router-dom";

const ResumeModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { checkUserStatus } = useAuth();
  const navigate= useNavigate()
  const inputRef = useRef(null);

  const [trackerId, setTrackerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTrackerId("");
      setError(null);
      setSuccess(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLoading, onClose]);

  // Prevent body scroll when modal open
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

  // Format Tracker ID (VT-XXXXXXXX)
  const formatTrackerId = (value) => {
    let cleaned = value.replace(/\s/g, "").toUpperCase();

    // Auto add "VT-" prefix
    if (cleaned.length > 0 && !cleaned.startsWith("VT-")) {
      if (cleaned.startsWith("VT")) {
        cleaned = "VT-" + cleaned.slice(2);
      } else if (!cleaned.startsWith("V")) {
        cleaned = "VT-" + cleaned;
      }
    }

    return cleaned.slice(0, 11); // VT-XXXXXXXX = 11 chars
  };

  const handleInputChange = (e) => {
    const formatted = formatTrackerId(e.target.value);
    setTrackerId(formatted);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!trackerId || trackerId.length < 10) {
      setError(t("resume.invalidId") || "Please enter a valid Tracker ID");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await resumeSession(trackerId);

      if (result.success) {
        setSuccess(true);

        // ✅ FIXED: Get step from response and navigate
        setTimeout(async () => {
          // Option 1: Use step from resume response directly
          const step = result.data?.step;

          if (step) {
            const routes = {
              REGISTER: "/form",
              VOTE: "/vote",
              SURVEY: "/survey",
              CM_VOTE: "/candidate",
              THANKS: "/thanks",
            };

            const targetRoute = routes[step];
            if (targetRoute) {
              navigate(targetRoute, { replace: true });
            }
          }

          // Also update context
          await checkUserStatus(false); // false = don't redirect again

          onClose();
        }, 1500);
      } else {
        setError(
          result.error || "Invalid Tracker ID. Please check and try again.",
        );
      }
    } catch (err) {
      console.error("Resume Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => !isLoading && !success && onClose()}
      />

      {/* Modal */}
      <div className="relative w-[85%] md:w-[95%] max-w-md mx-auto animate-modalIn">
        <div className="bg-linear-to-b from-shade to-black border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-accet/10">
          {/* Close Button */}
          {!isLoading && !success && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors z-10"
            >
              <svg
                className="w-4 h-4 text-white/60"
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
          )}

          {/* Header */}
          <div className="pt-6 md:pt-8 pb-4 px-6 text-center border-b border-white/5">
            <div
              className={`w-10 h-10 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 rounded-full flex items-center justify-center transition-all duration-500 ${
                success
                  ? "bg-green-500/20 border-2 border-green-500/50"
                  : "bg-accet/20 border-2 border-accet/50"
              }`}
            >
              {success ? (
                <svg
                  className="w-8 h-8 text-green-500 animate-scaleIn"
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
              ) : (
                <svg
                  className="w-4 h-4 md:w-8 md:h-8 text-accet"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
            </div>
            <h2 className="text-sm lg:text-xl font-heading font-bold text-white uppercase tracking-wide">
              {success
                ? t("resume.successTitle") || "Welcome Back!"
                : t("resume.title") || "Resume Your Vote"}
            </h2>
            <p className="text-white/50 text-[10px] lg:text-sm mt-1 md:mt-2 font-body">
              {success
                ? t("resume.redirecting") || "Redirecting you to continue..."
                : t("resume.subtitle") || "Enter your Tracker ID to continue"}
            </p>
          </div>

          {/* Body */}
          <div className="p-6">
            {success ? (
              /* Success State */
              <div className="py-4 text-center">
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-3 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                </div>
                <p className="text-green-400/80 text-sm mt-4 font-body">
                  {t("resume.loadingSession") || "Loading your session..."}
                </p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit}>
                {/* Input */}
                <div className="mb-4">
                  <label className="text-[8px] lg:text-[11px] font-bold text-accet font-heading uppercase tracking-wider mb-2 block">
                    {t("resume.trackerId") || "Tracker ID"}
                  </label>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={trackerId}
                      onChange={handleInputChange}
                      placeholder="VT-XXXXXXXX"
                      disabled={isLoading}
                      className={`w-full bg-black/50 border ${
                        error
                          ? "border-red-500/50 focus:border-red-500"
                          : trackerId.length >= 10
                            ? "border-green-500/50 focus:border-green-500"
                            : "border-white/20 focus:border-accet"
                      } rounded-lg px-3 md:px-4 py-2 md:py-4 text-white font-mono text-[13px] lg:text-xl tracking-[0.2em] uppercase outline-none transition-all placeholder:text-white/20 text-center disabled:opacity-50`}
                      maxLength={11}
                      autoComplete="off"
                    />

                    {/* Status Icon */}
                    {trackerId.length > 0 && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {trackerId.length >= 10 ? (
                          <svg
                            className="w-5 h-5 text-green-500"
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
                        ) : (
                          <span className="text-white/30 text-xs font-mono">
                            {trackerId.length}/11
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 h-0.5 md:h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        error
                          ? "bg-red-500"
                          : trackerId.length >= 10
                            ? "bg-green-500"
                            : "bg-accet"
                      }`}
                      style={{
                        width: `${Math.min((trackerId.length / 11) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg animate-shake">
                    <p className="text-red-400 text-xs lg:text-sm flex items-center gap-2 font-body">
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
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || trackerId.length < 10}
                  className={`w-full py-2 lg:py-3.5 rounded-lg font-heading font-bold uppercase tracking-wider text-[10px] lg:text-sm transition-all duration-300 ${
                    trackerId.length >= 10 && !isLoading
                      ? "bg-gradient-to-r from-accet via-cyan-500 to-accet text-black hover:shadow-lg hover:shadow-accet/30 hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-white/10 text-white/30 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24">
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
                      {t("resume.verifying") || "Verifying..."}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {t("resume.continue") || "Continue"}
                      <svg
                        className="md:w-5 md:h-5 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              </form>
            )}

            {/* Help Text */}
            {!success && (
              <div className="mt-3 pt-3 md:mt-5 md:pt-4 border-t border-white/5">
                <p className="text-white/40 text-[8px] lg:text-[11px] text-center font-body leading-relaxed">
                  💡{" "}
                  {t("resume.helpText") ||
                    "Your Tracker ID was shown after registration. Check your notes or screenshots."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-modalIn {
          animation: modalIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ResumeModal;
