import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";
import click from "../assets/click2.wav";
import scifi from "../assets/scifi.wav";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import axios from "axios";

// ========== API BASE URL ==========
const API_BASE_URL = import.meta.env.VITE_API_URL;

// ========== GLASS PANEL COMPONENT ==========
const GlassPanel = ({ children, className = "", hover = true }) => (
  <div
    className={`relative bg-black/60 backdrop-blur-md border border-accet/20 rounded-sm overflow-hidden ${
      hover ? "hover:border-accet/40 transition-all duration-500" : ""
    } ${className}`}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-accet/5 blur-3xl pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/5 blur-3xl pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

// ========== SECTION TITLE COMPONENT ==========
const SectionTitle = ({ icon, title, subtitle, number }) => (
  <div className="flex justify-between items-center gap-3 mb-4 md:mb-6">
    <div className="flex items-center gap-3">
      <div className="p-2 md:p-3 bg-accet/10 border border-accet/30 rounded-sm">
        {icon}
      </div>
      <div className="flex-1">
        <h2 className="font-heading uppercase text-xs md:text-lg text-white tracking-wider">
          {title}
        </h2>
        {subtitle && (
          <p className="text-neutral-500 text-[8px] md:text-xs mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {number && (
      <span className="font-heading text-4xl md:text-5xl font-bold text-white/5">
        {String(number).padStart(2, "0")}
      </span>
    )}
  </div>
);

// ========== ENCRYPTED TEXT COMPONENT ==========
const EncryptedText = ({ text, isDecrypted, className = "" }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (isDecrypted && text) {
      const chars = "█▓▒░@#$%&*!?";
      let iterations = 0;
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, idx) =>
              idx < iterations
                ? text[idx]
                : chars[Math.floor(Math.random() * chars.length)],
            )
            .join(""),
        );
        iterations++;
        if (iterations > text.length) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, 30);
      return () => clearInterval(interval);
    } else {
      setDisplayText("█".repeat(Math.min(text?.length || 8, 12)));
    }
  }, [isDecrypted, text]);

  return (
    <span
      className={`font-heading tracking-wider uppercase ${
        isDecrypted ? "text-white" : "text-accet/30"
      } ${className}`}
    >
      {displayText}
    </span>
  );
};

// ========== DATA FIELD COMPONENT ==========
const DataField = ({ label, value, isDecrypted, icon }) => (
  <div className="p-3 bg-black/40 border border-accet/10 rounded-sm group hover:border-accet/30 transition-all duration-300 overflow-hidden">
    <div className="flex items-center gap-2 mb-1.5">
      {icon && <Icon icon={icon} className="text-accet/50 text-xs" />}
      <p className="text-[8px] md:text-[10px] text-accet/70 font-heading uppercase tracking-widest">
        {label}
      </p>
    </div>
    <p className="text-white font-body capitalize text-[10px] md:text-sm font-medium">
      {isDecrypted ? (
        <>
          <span>{value}</span>
          {/* <EncryptedText text={value} isDecrypted={true} /> */}
        </>
      ) : (
        <span className="text-white/20">N/A</span>
      )}
    </p>
  </div>
);

// ========== MAIN COMPONENT ==========
const VoterStatus = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [Click] = useSound(click, { volume: 0.1 });
  const [playClick] = useSound(scifi, { volume: 0.1 });

  // Refs
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // States
  const [trackerId, setTrackerId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [voterData, setVoterData] = useState(null);
  const [searchStatus, setSearchStatus] = useState("idle");
  const [decryptionStep, setDecryptionStep] = useState(0);
  const [decryptedFields, setDecryptedFields] = useState([]);
  const [liveResults, setLiveResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState("");

  // Focus input on mount
  useEffect(() => {
    if (searchStatus === "idle") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchStatus]);

  // ========== FORMAT TRACKER ID (VT-XXXXXXXX) ==========
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
    Click();
    const formatted = formatTrackerId(e.target.value);
    setTrackerId(formatted);
    setErrorMessage("");
  };

  // Decryption Steps
  const decryptionSteps = useMemo(
    () => [
      {
        text: "Checking participation status responsibly",
        icon: "lucide:wifi",
      },
      { text: "Ensuring every vote is counted", icon: "lucide:shield-check" },
      {
        text: "Protecting voter privacy and integrity",
        icon: "lucide:lock-open",
      },
      { text: "Promoting transparent participation", icon: "lucide:activity" },
    ],
    [],
  );

  // ========== API: Verify Vote ==========
  const verifyVote = async (votingId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/verify/track`,
        { tracker_id: votingId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        },
      );

      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
        };
      } else {
        return {
          success: false,
          error: "Verification failed",
        };
      }
    } catch (error) {
      console.error("API Error:", error);

      if (error.response) {
        return {
          success: false,
          error:
            error.response.data?.error ||
            `Server error: ${error.response.status}`,
        };
      } else if (error.request) {
        return {
          success: false,
          error: "Unable to connect to server. Please check your connection.",
        };
      } else {
        return {
          success: false,
          error: error.message || "An unexpected error occurred",
        };
      }
    }
  };

  // Decryption Sequence
  useEffect(() => {
    if (searchStatus === "decrypting") {
      const stepInterval = setInterval(() => {
        setDecryptionStep((prev) => {
          if (prev >= decryptionSteps.length - 1) {
            clearInterval(stepInterval);
            setTimeout(() => setSearchStatus("found"), 400);
            return prev;
          }
          return prev + 1;
        });
      }, 600);
      return () => clearInterval(stepInterval);
    }
  }, [searchStatus, decryptionSteps.length]);

  // Field Decryption Animation
  useEffect(() => {
    if (searchStatus === "found" && voterData) {
      const fields = ["info", "location", "candidate", "results"];
      fields.forEach((field, index) => {
        setTimeout(() => {
          setDecryptedFields((prev) => [...prev, field]);
        }, index * 300);
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.7 },
          colors: ["#6366f1", "#22d3ee", "#a855f7"],
        });
      }, fields.length * 300);
    }
  }, [searchStatus, voterData]);

  // URL Params
  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId) {
      const formatted = formatTrackerId(urlId);
      setTrackerId(formatted);
      if (formatted.length >= 10) {
        handleSearch(formatted);
      }
    }
  }, [searchParams]);

  // Search Handler
  const handleSearch = useCallback(
    async (idToSearch = trackerId) => {
      // Validation
      if (!idToSearch || idToSearch.length < 10) {
        setErrorMessage("Please enter a valid Tracker ID");
        return;
      }

      playClick();
      setIsSearching(true);
      setSearchStatus("searching");
      setVoterData(null);
      setDecryptionStep(0);
      setDecryptedFields([]);
      setErrorMessage("");

      // Simulate minimum loading time for better UX
      const minLoadTime = new Promise((resolve) => setTimeout(resolve, 1200));

      // API call
      const apiCall = verifyVote(idToSearch);

      // Wait for both
      const [, result] = await Promise.all([minLoadTime, apiCall]);

      if (result.success) {
        const apiData = result.data;

        // Transform API response
        const transformedData = {
          uniqueId: apiData.uniqueId,
          name: apiData.name,
          tamilName: apiData.tamilName || "",
          voterId: apiData.voterId,
          district: apiData.district,
          constituency: apiData.constituency,
          age: apiData.age,
          gender: apiData.gender,
          votedAt: apiData.votedAt,
          candidateId: apiData.candidateId,
          candidate: apiData.candidate,
        };

        // Set live results from backend
        if (apiData.live_results) {
          setLiveResults(apiData.live_results);
          const total = apiData.live_results.reduce(
            (sum, c) => sum + c.votes,
            0,
          );
          setTotalVotes(total);
        }

        setVoterData(transformedData);
        setSearchStatus("decrypting");
      } else {
        setErrorMessage(result.error);
        setSearchStatus("notfound");
      }

      setIsSearching(false);
    },
    [trackerId, playClick],
  );

  // Reset
  const resetSearch = () => {
    Click();
    setTrackerId("");
    setVoterData(null);
    setSearchStatus("idle");
    setDecryptionStep(0);
    setDecryptedFields([]);
    setErrorMessage("");
    setLiveResults([]);
    setTotalVotes(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Format Helpers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return { date: "", time: "" };

    // If already formatted string (DD-MM-YYYY HH:MM AM/PM)
    if (typeof dateString === "string" && dateString.includes("-")) {
      const parts = dateString.split(" ");
      return {
        date: parts[0] || "",
        time: parts.slice(1).join(" ") || "",
      };
    }

    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  // Check if ID is valid length
  const isValidLength = trackerId.length >= 10;

  return (
    <div
      className="min-h-dvh w-full bg-black relative overflow-x-hidden"
      ref={containerRef}
    >
      {/* ========== BACKGROUND ========== */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-0 left-1/4 w-px h-full bg-white/5" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-white/5" />
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-[150px]"
          style={{
            background: "radial-gradient(circle, #6366f1, transparent)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #22d3ee, transparent)",
          }}
        />
      </div>

      {/* ========== HEADER ========== */}
      <header className="relative z-20 px-4 sm:px-6 py-4 md:py-5 border-b border-accet/20 bg-black/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-2.5 bg-accet/10 border border-accet/30 rounded-sm">
              <Icon
                icon="lucide:shield-check"
                className="text-accet text-md md:text-xl"
              />
            </div>
            <div>
              <h1 className="font-heading text-md md:text-2xl uppercase font-bold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accet via-cyan-400 to-accet">
                  Lunai
                </span>
              </h1>
            </div>
          </div>

          <button
            onClick={() => {
              Click();
              navigate("/");
            }}
            className="group flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-accet/5 border border-accet/30 hover:border-accet/60 hover:bg-accet/10 transition-all duration-300 rounded-sm cursor-pointer"
          >
            <Icon
              icon="lucide:arrow-left"
              className="text-accet text-sm group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="text-[10px] md:text-xs text-white/70 font-heading uppercase tracking-widest group-hover:text-white transition-colors hidden sm:inline">
              Back
            </span>
          </button>
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <div className="relative z-10 px-4 sm:px-6 py-8 md:py-8">
        <div className="max-w-[95%] mx-auto">
          <AnimatePresence mode="wait">
            {/* ========== SEARCH STATE (Resume Modal Style) ========== */}
            {(searchStatus === "idle" || searchStatus === "notfound") && (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                {/* Card with Resume Modal Style */}
                <div className="w-full max-w-md mx-auto">
                  <div className="bg-gradient-to-br from-accet/10 to-accet/5 border border-accet/30 rounded-lg overflow-hidden shadow-2xl shadow-accet/20 backdrop-blur-xl">
                    {/* Header */}
                    <div className="pt-6 md:pt-8 pb-4 px-6 text-center border-b border-white/5">
                      <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-accet/20 border-2 border-accet/50 flex items-center justify-center">
                        <Icon
                          icon="lucide:fingerprint"
                          className="w-6 h-6 md:w-8 md:h-8 text-accet"
                        />
                      </div>
                      <h2 className="text-base md:text-xl font-heading font-bold text-white uppercase tracking-wide">
                        Verify Your Vote
                      </h2>
                      <p className="text-white/50 text-[10px] md:text-sm mt-1 md:mt-2 font-body">
                        Enter your Tracker ID to view your voting record
                      </p>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSearch();
                        }}
                      >
                        {/* Input Label */}
                        <div className="mb-4">
                          <label className="text-[8px] md:text-[11px] font-bold text-accet font-heading uppercase tracking-wider mb-2 block">
                            <Icon
                              icon="lucide:key"
                              className="inline-block mr-1 text-xs"
                            />
                            Tracker ID
                          </label>

                          {/* Input Field */}
                          <div className="relative">
                            <input
                              ref={inputRef}
                              type="text"
                              value={trackerId}
                              onChange={handleInputChange}
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                isValidLength &&
                                handleSearch()
                              }
                              placeholder="VT-XXXXXXXX"
                              disabled={isSearching}
                              className={`w-full bg-black/50 border ${
                                errorMessage
                                  ? "border-red-500/50 focus:border-red-500"
                                  : isValidLength
                                    ? "border-green-500/50 focus:border-green-500"
                                    : "border-white/20 focus:border-accet"
                              } rounded-lg px-4 py-3 md:py-4 text-white font-mono text-sm md:text-xl tracking-[0.15em] uppercase outline-none transition-all placeholder:text-white/20 text-center disabled:opacity-50`}
                              maxLength={11}
                              autoComplete="off"
                            />

                            {/* Status Icon */}
                            {trackerId.length > 0 && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {isValidLength ? (
                                  <Icon
                                    icon="lucide:check-circle"
                                    className="w-5 h-5 text-green-500"
                                  />
                                ) : (
                                  <span className="text-white/30 text-xs font-mono">
                                    {trackerId.length}/11
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full transition-colors duration-300 ${
                                errorMessage
                                  ? "bg-red-500"
                                  : isValidLength
                                    ? "bg-green-500"
                                    : "bg-accet"
                              }`}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(
                                  (trackerId.length / 11) * 100,
                                  100,
                                )}%`,
                              }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                        </div>

                        {/* Error Message */}
                        {errorMessage && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                          >
                            <p className="text-red-400 text-xs md:text-sm flex items-center gap-2 font-body">
                              <Icon
                                icon="lucide:alert-circle"
                                className="w-4 h-4 shrink-0"
                              />
                              {errorMessage}
                            </p>
                          </motion.div>
                        )}

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSearching || !isValidLength}
                          className={`w-full py-3 md:py-4 rounded-lg font-heading font-bold uppercase tracking-wider text-[10px] md:text-sm transition-all duration-300 cursor-pointer ${
                            isValidLength && !isSearching
                              ? "bg-gradient-to-r from-accet via-cyan-500 to-accet text-black hover:shadow-lg hover:shadow-accet/30 hover:scale-[1.02] active:scale-[0.98]"
                              : "bg-white/10 text-white/30 cursor-not-allowed"
                          }`}
                        >
                          {isSearching ? (
                            <span className="flex items-center justify-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              >
                                <Icon
                                  icon="lucide:loader-2"
                                  className="w-4 h-4 md:w-5 md:h-5"
                                />
                              </motion.div>
                              Verifying...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              Verify Now
                              <Icon
                                icon="lucide:arrow-right"
                                className="w-4 h-4 md:w-5 md:h-5"
                              />
                            </span>
                          )}
                        </button>
                      </form>

                      {/* Help Text */}
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-white/40 text-[9px] md:text-[11px] text-center font-body leading-relaxed">
                          💡 Your Tracker ID was shown after you cast your vote.
                          <br className="hidden md:block" />
                          Check your notes or screenshots.
                        </p>
                      </div>

                      {/* Security Badge */}
                      <div className="mt-4 flex items-center justify-center gap-2 text-neutral-500">
                        <Icon
                          icon="lucide:lock"
                          className="text-accet/50 text-sm"
                        />
                        <span className="text-[8px] md:text-[10px] font-heading uppercase tracking-[0.15em]">
                          256-bit Encrypted
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========== SEARCHING STATE ========== */}
            {searchStatus === "searching" && (
              <motion.div
                key="searching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                <div className="w-full max-w-md mx-auto">
                  <div className="bg-gradient-to-br from-accet/10 to-accet/5 border border-accet/30 rounded-lg overflow-hidden shadow-2xl shadow-accet/20 backdrop-blur-xl p-8 md:p-12 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-full bg-accet/20 border-2 border-accet/50 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Icon
                          icon="lucide:radar"
                          className="w-8 h-8 md:w-10 md:h-10 text-accet"
                        />
                      </motion.div>
                    </div>
                    <h3 className="font-heading text-base md:text-xl text-white font-bold tracking-wide mb-2">
                      Scanning
                    </h3>
                    <p className="text-accet font-mono text-sm md:text-base mb-4">
                      {trackerId}
                    </p>
                    <div className="flex justify-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-accet rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========== DECRYPTING STATE ========== */}
            {searchStatus === "decrypting" && (
              <motion.div
                key="decrypting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                <div className="w-full max-w-md mx-auto">
                  <div className="bg-gradient-to-br from-accet/10 to-accet/5 border border-accet/30 rounded-lg overflow-hidden shadow-2xl shadow-accet/20 backdrop-blur-xl p-6 md:p-8">
                    <SectionTitle
                      icon={
                        <Icon icon="lucide:lock-open" className="text-accet" />
                      }
                      title="Decrypting Data"
                      subtitle="Securing your information..."
                    />

                    <div className="space-y-3 mt-6">
                      {decryptionSteps.map((step, idx) => (
                        <motion.div
                          key={idx}
                          className={`flex items-center gap-4 p-3 md:p-4 rounded-lg border transition-all duration-500 ${
                            idx <= decryptionStep
                              ? "bg-accet/10 border-accet/30"
                              : "bg-black/40 border-white/5"
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <div
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                              idx < decryptionStep
                                ? "bg-green-500/20 border-2 border-green-500"
                                : idx === decryptionStep
                                  ? "bg-accet/20 border-2 border-accet"
                                  : "bg-white/5 border border-white/10"
                            }`}
                          >
                            {idx < decryptionStep ? (
                              <Icon
                                icon="lucide:check"
                                className="text-green-500 text-sm md:text-base"
                              />
                            ) : idx === decryptionStep ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              >
                                <Icon
                                  icon="lucide:loader-2"
                                  className="text-accet text-sm md:text-base"
                                />
                              </motion.div>
                            ) : (
                              <Icon
                                icon={step.icon}
                                className="text-white/30 text-sm md:text-base"
                              />
                            )}
                          </div>
                          <span
                            className={`text-[11px] md:text-xs font-heading tracking-wider ${
                              idx <= decryptionStep
                                ? "text-white"
                                : "text-white/30"
                            }`}
                          >
                            {step.text}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========== RESULTS STATE ========== */}
            {searchStatus === "found" && voterData && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3 md:space-y-6"
              >
                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 md:gap-2">
                  {/* ===== VOTER INFO ===== */}
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <GlassPanel className="p-4 md:p-6 h-full">
                      <SectionTitle
                        icon={
                          <Icon icon="lucide:user" className="text-accet" />
                        }
                        title="Voter Information"
                        subtitle="Personal & Location Details"
                        number={1}
                      />

                      {/* Name Card */}
                      <div className="p-3 md:p-5 bg-gradient-to-br from-accet/10 to-cyan-500/5 border border-accet/20 rounded-lg mb-4">
                        <p className="text-[9px] text-accet font-heading uppercase tracking-widest mb-1 md:mb-2">
                          Full Name
                        </p>
                        <p className="text-white text-[12px] md:text-lg font-heading font-bold">
                          {decryptedFields.includes("info") ? (
                            <EncryptedText
                              text={voterData.name}
                              isDecrypted={true}
                            />
                          ) : (
                            <EncryptedText
                              text={voterData.name}
                              isDecrypted={false}
                            />
                          )}
                        </p>
                        {/* {decryptedFields.includes("info") &&
                          voterData.tamilName && (
                            <p className="text-neutral-400 text-sm mt-1">
                              {voterData.tamilName}
                            </p>
                          )} */}
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-2 md:gap-3">
                        <DataField
                          label="Voter ID"
                          value={voterData.uniqueId}
                          isDecrypted={decryptedFields.includes("info")}
                          icon="lucide:id-card"
                        />
                        <DataField
                          label="Age / Gender"
                          value={`${voterData.age || "N/A"} / ${voterData.gender || "N/A"}`}
                          isDecrypted={decryptedFields.includes("info")}
                          icon="lucide:user-circle"
                        />
                        <DataField
                          label="District"
                          value={voterData.district}
                          isDecrypted={decryptedFields.includes("location")}
                          icon="lucide:map-pin"
                        />
                        <DataField
                          label="Constituency"
                          value={voterData.constituency}
                          isDecrypted={decryptedFields.includes("location")}
                          icon="lucide:building"
                        />
                      </div>

                      {/* Voting Time */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 p-3 md:p-4 bg-accet/5 border border-accet/20 rounded-lg flex items-center gap-3 md:gap-4"
                      >
                        <div className="p-2 md:p-2.5 bg-accet/10 border border-accet/30 rounded-lg">
                          <Icon
                            icon="lucide:calendar-check"
                            className="text-accet text-md md:text-lg"
                          />
                        </div>
                        <div>
                          <p className="text-[8px] md:text-[9px] text-accet font-heading uppercase tracking-widest">
                            Vote Recorded
                          </p>
                          <p className="text-white text-[10px] md:text-sm font-medium mt-0.5">
                            {decryptedFields.includes("info")
                              ? voterData.votedAt
                              : "████████████"}
                          </p>
                        </div>
                      </motion.div>
                    </GlassPanel>
                  </motion.div>

                  {/* ===== VOTED CANDIDATE ===== */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <GlassPanel className="p-5 md:p-6 h-full">
                      <SectionTitle
                        icon={
                          <Icon icon="lucide:vote" className="text-accet" />
                        }
                        title="Your Vote"
                        subtitle="Selected Candidate"
                        number={2}
                      />
                      {voterData.candidate ? (
                        <>
                          {/* Candidate Display */}
                          <div className="flex flex-col items-center py-6">
                            {/* Image */}
                            <motion.div
                              className="relative mb-6"
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3, type: "spring" }}
                            >
                              {/* Rotating Border */}
                              <motion.div
                                className="absolute -inset-2"
                                style={{
                                  background:
                                    "conic-gradient(from 0deg, #0198a0, #0198a0, #0198a0, #0198a0)",
                                }}
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 8,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                              <div className="absolute -inset-1 bg-black" />

                              <div className="relative w-28 h-28 md:w-36 md:h-36 overflow-hidden border-2 border-accet/30">
                                {decryptedFields.includes("candidate") &&
                                voterData.candidate ? (
                                  <motion.img
                                    src={voterData.candidate?.leader_img}
                                    alt={voterData.candidate?.name}
                                    className="w-full h-full object-cover object-top"
                                    initial={{ filter: "blur(20px)" }}
                                    animate={{ filter: "blur(0px)" }}
                                    transition={{ duration: 0.5 }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-black/80 flex items-center justify-center">
                                    <Icon
                                      icon="lucide:user"
                                      className="text-white/10 text-4xl"
                                    />
                                  </div>
                                )}
                              </div>
                            </motion.div>

                            {/* Name */}
                            <h4 className="text-white text-lg md:text-3xl font-heading font-bold text-center mb-3 mt-7 uppercase">
                              {decryptedFields.includes("candidate") &&
                              voterData.candidate ? (
                                <EncryptedText
                                  text={voterData.candidate?.partyFull || ""}
                                  isDecrypted={true}
                                />
                              ) : (
                                <span className="text-white/20">
                                  ████████████
                                </span>
                              )}
                            </h4>

                            {/* Party Badge */}
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-accet/10 border border-accet/30 rounded-full">
                              <div className="w-2 h-2 rounded-full bg-accet animate-pulse" />
                              <span className="text-accet text-xs font-heading font-bold uppercase tracking-widest">
                                {decryptedFields.includes("candidate") &&
                                voterData.candidate
                                  ? voterData.candidate?.party
                                  : "███"}
                              </span>
                            </div>

                            {decryptedFields.includes("candidate") &&
                              voterData.candidate && (
                                <p className="text-accet font-heading uppercase tracking-wider font-black text-[10px] md:text-[14px] mt-3 text-center">
                                 <span className="text-white">Leader : </span>{voterData.candidate?.name}
                                </p>
                              )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col gap-3 justify-center items-center px-3 mt-4">
                            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-yellow-700">
                              <div className="w-full h-full bg-black/80 flex items-center justify-center">
                                <Icon
                                  icon="material-symbols-light:warning-outline-rounded"
                                  className="text-yellow-700 text-4xl md:text-6xl"
                                />
                              </div>
                            </div>
                            <p className="text-white text-center capitalize font-sans text-[10px] md:text-[12px]">
                              You have successfully registered, but your vote
                              has not been recorded yet
                            </p>
                            <p className="p-2 text-[8px] md:text-[10px]  font-sans tracking-wider capitalize text-yellow-500 bg-yellow-700/30 border-yellow-500 border rounded-md flex items-center gap-1.5">
                              <Icon
                                icon="material-symbols-light:warning-outline-rounded"
                                className="text-yellow-500 text-2xl md:text-4xl"
                              />
                              Please click Resume and continue voting from where
                              you left off
                            </p>
                          </div>
                        </>
                      )}
                    </GlassPanel>
                  </motion.div>

                  {/* ===== LIVE RESULTS ===== */}
                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <GlassPanel className="p-5 md:p-6 h-full">
                      <SectionTitle
                        icon={
                          <Icon icon="lucide:activity" className="text-accet" />
                        }
                        title="Live Results"
                        subtitle="Real-time vote count"
                        number={3}
                      />

                      {/* Total Votes */}
                      <div className="mb-5 p-4 bg-gradient-to-r from-accet/10 to-cyan-500/5 border border-accet/20 rounded-lg text-center">
                        <p className="text-[9px] text-accet/70 font-heading uppercase tracking-widest mb-1">
                          Total Votes Cast
                        </p>
                        <motion.p
                          className="text-accet text-2xl md:text-3xl font-bold font-num"
                          key={totalVotes}
                          initial={{ scale: 1.05 }}
                          animate={{ scale: 1 }}
                        >
                          {decryptedFields.includes("results")
                            ? formatNumber(totalVotes)
                            : "███████"}
                        </motion.p>
                      </div>

                      {/* Results List */}
                      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar-accet">
                        {liveResults.length > 0 ? (
                          liveResults.slice(0, 6).map((candidate, idx) => {
                            const percentage =
                              totalVotes > 0
                                ? (
                                    (candidate.votes / totalVotes) *
                                    100
                                  ).toFixed(1)
                                : "0.0";
                            const isVoted =
                              voterData.candidateId === candidate.id;

                            return (
                              <motion.div
                                key={candidate.id}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + idx * 0.05 }}
                                className={`p-3 rounded-lg border transition-all duration-300 ${
                                  isVoted
                                    ? "bg-accet/10 border-accet/40"
                                    : "bg-black/40 border-white/5 hover:border-white/10"
                                }`}
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  {/* Rank */}
                                  <div
                                    className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                      idx === 0
                                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                        : idx === 1
                                          ? "bg-gray-400/20 text-gray-400 border border-gray-500/30"
                                          : idx === 2
                                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                            : "bg-white/5 text-white/40 border border-white/10"
                                    }`}
                                  >
                                    {idx + 1}
                                  </div>

                                  {/* Image */}
                                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border border-white/10">
                                    {decryptedFields.includes("results") ? (
                                      <img
                                        src={candidate.leader_img}
                                        alt=""
                                        className="w-full h-full object-cover object-top"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-black/80" />
                                    )}
                                  </div>

                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="text-white text-[10px] md:text-[11px] font-heading font-medium truncate">
                                        {decryptedFields.includes("results")
                                          ? candidate.name
                                          : "██████"}
                                      </p>
                                      {isVoted && (
                                        <span className="text-[6px] md:text-[7px] px-1.5 py-0.5 bg-accet text-black rounded font-heading uppercase font-bold shrink-0">
                                          You
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-neutral-500 text-[8px] md:text-[9px]">
                                      {decryptedFields.includes("results")
                                        ? candidate.party
                                        : "███"}
                                    </p>
                                  </div>

                                  {/* Votes */}
                                  <div className="text-right shrink-0">
                                    <p className="text-accet text-[10px] md:text-xs font-bold">
                                      {decryptedFields.includes("results")
                                        ? formatNumber(candidate.votes)
                                        : "███"}
                                    </p>
                                    <p className="text-neutral-600 text-[8px] md:text-[9px]">
                                      {decryptedFields.includes("results")
                                        ? `${percentage}%`
                                        : "██%"}
                                    </p>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div
                                    className={`h-full rounded-full ${
                                      isVoted
                                        ? "bg-gradient-to-r from-accet to-cyan-400"
                                        : "bg-accet/40"
                                    }`}
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: decryptedFields.includes("results")
                                        ? `${percentage}%`
                                        : "0%",
                                    }}
                                    transition={{
                                      duration: 0.8,
                                      delay: 0.5 + idx * 0.05,
                                    }}
                                  />
                                </div>
                              </motion.div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 text-neutral-500 text-sm">
                            <Icon
                              icon="lucide:bar-chart-3"
                              className="mx-auto text-3xl mb-2 opacity-50"
                            />
                            <p>No results available</p>
                          </div>
                        )}
                      </div>

                      {/* Live Indicator */}
                      {liveResults.length > 0 && (
                        <motion.div
                          className="mt-4 flex items-center justify-center gap-3"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4].map((i) => (
                              <motion.div
                                key={i}
                                className="w-0.5 h-3 md:h-4 bg-accet rounded-full"
                                animate={{ scaleY: [0.3, 1, 0.3] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-accet text-[8px] md:text-[9px] font-heading uppercase tracking-[0.2em]">
                            Live Updates
                          </span>
                        </motion.div>
                      )}
                    </GlassPanel>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap justify-center gap-3 pt-4"
                >
                  <button
                    onClick={() => {
                      playClick();
                      navigate("/");
                    }}
                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accet/20 to-cyan-500/20 border border-accet/50 hover:from-accet/30 hover:to-cyan-500/30 transition-all duration-300 rounded-lg cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Icon icon="lucide:home" className="text-accet text-sm" />
                    <span className="text-[11px] text-white font-heading uppercase tracking-widest font-medium">
                      Back to Home
                    </span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar-accet::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-accet::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar-accet::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar-accet::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  );
};

export default VoterStatus;
