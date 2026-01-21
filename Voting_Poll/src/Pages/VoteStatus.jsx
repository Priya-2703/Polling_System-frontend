import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";
import click from "../assets/click2.wav";
import scifi from "../assets/scifi.wav";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import gsap from "gsap";

// ========== SECTION TITLE COMPONENT ==========
const SectionTitle = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
    <div className="md:w-10 md:h-10 w-8 h-8 rounded-full bg-gradient-to-br from-accet to-indigo-400 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex flex-col">
      <h2 className="text-[13px] lg:text-base text-white font-heading font-bold uppercase tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[8px] md:text-[10px] text-white/40 hidden lg:block">
          {subtitle}
        </p>
      )}
    </div>
    <div className="flex-1 w-full h-0.5 bg-gradient-to-r from-accet/50 to-transparent rounded-full" />
  </div>
);

// ========== STEP INDICATOR ==========
const StepIndicator = ({ currentStep, steps }) => (
  <div className="flex items-center justify-center gap-2 mb-4">
    {steps.map((step, index) => {
      const isActive = index + 1 === currentStep;
      const isCompleted = index + 1 < currentStep;
      return (
        <div key={index} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isCompleted
                ? "bg-gradient-to-br from-accet to-indigo-500 text-gray-900"
                : isActive
                ? "bg-accet/20 border-2 border-accet text-accet"
                : "bg-shade border border-white/20 text-white/40"
            }`}
          >
            {isCompleted ? (
              <Icon icon="lucide:check" className="text-sm" />
            ) : (
              <Icon icon={step.icon} className="text-sm" />
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 ${
                isCompleted ? "bg-accet" : "bg-white/10"
              }`}
            />
          )}
        </div>
      );
    })}
  </div>
);

// ========== ENCRYPTED TEXT COMPONENT ==========
const EncryptedText = ({ text, isDecrypted, className = "" }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (isDecrypted) {
      const chars = "█▓▒░@#$%&*!?";
      let iterations = 0;
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, idx) =>
              idx < iterations
                ? text[idx]
                : chars[Math.floor(Math.random() * chars.length)]
            )
            .join("")
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
    <span className={`font-mono ${isDecrypted ? "text-white" : "text-accet/20"} ${className}`}>
      {displayText}
    </span>
  );
};

// ========== MAIN COMPONENT ==========
const VoterStatus = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [Click] = useSound(click, { volume: 0.2 });
  const [playClick] = useSound(scifi, { volume: 0.3 });

  // Refs
  const containerRef = useRef(null);

  // States
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [voterData, setVoterData] = useState(null);
  const [searchStatus, setSearchStatus] = useState("idle"); // idle, searching, decrypting, found, notfound
  const [decryptionStep, setDecryptionStep] = useState(0);
  const [decryptedFields, setDecryptedFields] = useState([]);
  const [liveResults, setLiveResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Viewport
  const [dimensions, setDimensions] = useState({
    vw: typeof window !== "undefined" ? window.innerWidth : 1024,
    vh: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ vw: window.innerWidth, vh: window.innerHeight });
    };
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const isMobile = dimensions.vw < 768;

  // Decryption Steps
  const decryptionSteps = useMemo(
    () => [
      { text: "CONNECTING TO BLOCKCHAIN", icon: "lucide:wifi" },
      { text: "VERIFYING DIGITAL SIGNATURE", icon: "lucide:shield-check" },
      { text: "DECRYPTING VOTER DATA", icon: "lucide:lock-open" },
      { text: "LOADING LIVE RESULTS", icon: "lucide:activity" },
    ],
    []
  );

  // Step Indicator Config
  const stepConfig = [
    { icon: "lucide:search", label: "Search" },
    { icon: "lucide:lock", label: "Decrypt" },
    { icon: "lucide:check-circle", label: "Verify" },
  ];

  // Candidates Data
  const allCandidates = useMemo(
    () => [
      {
        id: 1,
        name: t("cm_candi.p1.name") || "M.K. Stalin",
        party: "DMK",
        symbol: "☀️",
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350472/0b1fd85b73618222d787ca412c07cd38_qx7jsg.jpg",
        partyFull: "Dravida Munnetra Kazhagam",
        votes: 2847563,
      },
      {
        id: 2,
        name: t("cm_candi.p2.name") || "Edappadi K. Palaniswami",
        party: "AIADMK",
        symbol: "🍃",
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350158/d3728b039ee9b46b0b470588e73291e3_bdstta.jpg",
        partyFull: "All India Anna Dravida Munnetra Kazhagam",
        votes: 2156892,
      },
      {
        id: 3,
        name: t("cm_candi.p3.name") || "K. Annamalai",
        party: "BJP",
        symbol: "🪷",
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350652/annamalai-bjp-1_q6d7ea.jpg",
        partyFull: "Bharatiya Janata Party",
        votes: 1876234,
      },
      {
        id: 4,
        name: t("cm_candi.p4.name") || "Seeman",
        party: "NTK",
        symbol: "🐅",
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350158/d971ca4cf51445e099353789a35beef7_g5ill3.jpg",
        partyFull: "Naam Tamilar Katchi",
        votes: 1234567,
      },
      {
        id: 5,
        name: t("cm_candi.p5.name") || "Vijay",
        party: "TVK",
        symbol: "⭐",
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350156/8ad7f3d2d2cb76b8f1ba1370b9027ba1_jbkvyy.jpg",
        partyFull: "Tamilaga Vettri Kazhagam",
        votes: 3456789,
      },
      {
        id: 6,
        name: t("cm_candi.p6.name") || "Kamal Haasan",
        party: "MNM",
        symbol: "🔦",
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767351351/47b2f89fc1a586468a2a08cefe6388a3_mjttxg.jpg",
        partyFull: "Makkal Needhi Maiam",
        votes: 987654,
      },
      {
        id: 7,
        name: t("cm_candi.p7.name") || "Anbumani Ramadoss",
        party: "PMK",
        symbol: "🥭",
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350472/202509303525651_bv3qcg.jpg",
        partyFull: "Pattali Makkal Katchi",
        votes: 765432,
      },
      {
        id: 8,
        name: t("cm_candi.p8.name") || "Thirumavalavan",
        party: "VCK",
        symbol: "🔵",
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350156/c6dec00515fb74fe4f2382f83ea47b4e_t9ru5k.jpg",
        partyFull: "Viduthalai Chiruthaigal Katchi",
        votes: 654321,
      },
    ],
    [t]
  );

  // Mock Voter Database
  const mockVoterDatabase = useMemo(
    () => ({
      "VTX-M8K9X2-A1B2": {
        uniqueId: "VTX-M8K9X2-A1B2",
        name: "Rajesh Kumar",
        tamilName: "ராஜேஷ் குமார்",
        voterId: "TN/01/123/456789",
        district: "Chennai",
        constituency: "Mylapore",
        age: 35,
        gender: "Male",
        votedAt: "2026-02-15T10:30:00",
        candidateId: 1,
      },
      "VTX-N7L8M3-C4D5": {
        uniqueId: "VTX-N7L8M3-C4D5",
        name: "Priya Sundaram",
        tamilName: "பிரியா சுந்தரம்",
        voterId: "TN/02/234/567890",
        district: "Coimbatore",
        constituency: "Singanallur",
        age: 28,
        gender: "Female",
        votedAt: "2026-02-15T11:45:00",
        candidateId: 5,
      },
      "VTX-P6Q7R8-E9F0": {
        uniqueId: "VTX-P6Q7R8-E9F0",
        name: "Murugan Selvam",
        tamilName: "முருகன் செல்வம்",
        voterId: "TN/03/345/678901",
        district: "Madurai",
        constituency: "Madurai Central",
        age: 42,
        gender: "Male",
        votedAt: "2026-02-15T09:15:00",
        candidateId: 3,
      },
      "VTX-S5T6U7-G8H9": {
        uniqueId: "VTX-S5T6U7-G8H9",
        name: "Lakshmi Narayanan",
        tamilName: "லக்ஷ்மி நாராயணன்",
        voterId: "TN/04/456/789012",
        district: "Trichy",
        constituency: "Srirangam",
        age: 55,
        gender: "Female",
        votedAt: "2026-02-15T14:20:00",
        candidateId: 2,
      },
      "VTX-W4X5Y6-J1K2": {
        uniqueId: "VTX-W4X5Y6-J1K2",
        name: "Karthik Raja",
        tamilName: "கார்த்திக் ராஜா",
        voterId: "TN/05/567/890123",
        district: "Salem",
        constituency: "Salem West",
        age: 31,
        gender: "Male",
        votedAt: "2026-02-15T16:00:00",
        candidateId: 4,
      },
    }),
    []
  );

  // Live Results Simulation
  useEffect(() => {
    const initResults = allCandidates
      .map((c) => ({
        ...c,
        votes: c.votes + Math.floor(Math.random() * 10000),
      }))
      .sort((a, b) => b.votes - a.votes);

    setLiveResults(initResults);
    setTotalVotes(initResults.reduce((sum, c) => sum + c.votes, 0));

    const interval = setInterval(() => {
      setLiveResults((prev) => {
        const updated = prev.map((c) => ({
          ...c,
          votes: c.votes + Math.floor(Math.random() * 500),
        }));
        setTotalVotes(updated.reduce((sum, c) => sum + c.votes, 0));
        setLastUpdated(new Date());
        return updated.sort((a, b) => b.votes - a.votes);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [allCandidates]);

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
          colors: ["#00d4aa", "#6366f1"],
        });
      }, fields.length * 300);
    }
  }, [searchStatus, voterData]);

  // URL Params
  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId) {
      setSearchId(urlId.toUpperCase());
      handleSearch(urlId);
    }
  }, [searchParams]);

  // Search Handler
  const handleSearch = useCallback(
    async (idToSearch = searchId) => {
      const cleanId = idToSearch.trim().toUpperCase();
      if (!cleanId) return;

      playClick();
      setIsSearching(true);
      setSearchStatus("searching");
      setVoterData(null);
      setDecryptionStep(0);
      setDecryptedFields([]);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const voter = mockVoterDatabase[cleanId];

      if (voter) {
        const candidate = allCandidates.find((c) => c.id === voter.candidateId);
        setVoterData({ ...voter, candidate });
        setSearchStatus("decrypting");
      } else {
        setSearchStatus("notfound");
      }

      setIsSearching(false);
    },
    [searchId, mockVoterDatabase, allCandidates, playClick]
  );

  // Reset
  const resetSearch = () => {
    Click();
    setSearchId("");
    setVoterData(null);
    setSearchStatus("idle");
    setDecryptionStep(0);
    setDecryptedFields([]);
  };

  // Format Helpers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (dateString) => {
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

  // Get Current Step for Indicator
  const getCurrentStep = () => {
    if (searchStatus === "idle" || searchStatus === "notfound") return 1;
    if (searchStatus === "searching" || searchStatus === "decrypting") return 2;
    return 3;
  };

  return (
    <div className="min-h-dvh w-full bg-black relative overflow-x-hidden" ref={containerRef}>
      {/* ========== BACKGROUND ========== */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#00d4aa 1px, transparent 1px), linear-gradient(90deg, #00d4aa 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
        {/* Gradient Orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(circle, #00d4aa, transparent)" }}
        />
      </div>

      {/* ========== HEADER ========== */}
      <header className="relative z-20 px-4 py-3 md:py-4 border-b border-white/10 bg-shade/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-accet to-indigo-400 flex items-center justify-center">
              <Icon icon="lucide:shield-check" className="text-gray-900 text-lg md:text-xl" />
            </div>
            <div>
              <h1 className="text-sm md:text-base font-heading font-bold uppercase tracking-wide text-transparent bg-gradient-to-r from-accet to-indigo-400 bg-clip-text">
                VoteX Verify
              </h1>
              <p className="text-[8px] md:text-[10px] text-white/40 font-body">
                Blockchain Secured Verification
              </p>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => {
              Click();
              navigate("/");
            }}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 text-[10px] md:text-[11px] uppercase font-heading font-bold tracking-widest text-white/50 hover:text-white transition-all border border-white/10 hover:border-white/30 rounded"
          >
            <Icon icon="lucide:arrow-left" className="text-sm" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <div className="relative z-10 px-4 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {/* ========== SEARCH STATE ========== */}
            {(searchStatus === "idle" || searchStatus === "notfound") && (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                {/* Form Card */}
                <div className="w-full max-w-md bg-shade/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accet/20 to-indigo-500/20 border border-accet/30 flex items-center justify-center">
                      <Icon icon="lucide:fingerprint" className="text-accet text-3xl" />
                    </div>
                    <h2 className="text-lg md:text-xl font-heading font-bold uppercase tracking-wide text-transparent bg-gradient-to-r from-accet to-indigo-400 bg-clip-text">
                      Verify Your Vote
                    </h2>
                    <p className="text-[9px] md:text-[11px] text-white/40 font-body mt-1">
                      Enter your unique voting ID to view your record
                    </p>
                  </div>

                  {/* Input */}
                  <div className="relative group mb-4">
                    <label className="text-[8px] lg:text-[11px] font-bold text-accet font-heading uppercase tracking-wide mb-1.5 md:mb-2 block">
                      Unique Voting ID
                    </label>
                    <div className="relative bg-shade border border-white/20 md:px-4 py-2.5 md:py-3 px-3 group-hover:border-accet/30 transition-colors rounded">
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:search" className="text-white/40 text-sm" />
                        <input
                          type="text"
                          value={searchId}
                          onChange={(e) => {
                            Click();
                            setSearchId(e.target.value.toUpperCase());
                          }}
                          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                          placeholder="VTX-XXXXXX-XXXX"
                          className="flex-1 bg-transparent text-white font-mono text-[11px] lg:text-[14px] outline-none placeholder:text-white/30 uppercase tracking-wider"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {searchStatus === "notfound" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 bg-red-500/10 border border-red-500/30 rounded p-3 flex items-center gap-2"
                    >
                      <Icon icon="lucide:alert-triangle" className="text-red-400" />
                      <p className="text-[10px] text-red-400 font-body">
                        ID not found. Please check and try again.
                      </p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={() => handleSearch()}
                    disabled={!searchId.trim() || isSearching}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-heading text-[11px] lg:text-[12px] tracking-wider uppercase font-bold transition-all duration-300 rounded ${
                      searchId.trim() && !isSearching
                        ? "bg-gradient-to-r from-accet/80 to-accet text-gray-900 hover:shadow-lg hover:shadow-accet/30"
                        : "bg-white/5 text-white/30 cursor-not-allowed"
                    }`}
                  >
                    {isSearching ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Icon icon="lucide:scan" className="text-base" />
                        Verify Now
                      </>
                    )}
                  </button>

                  {/* Sample IDs */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-[8px] text-white/30 font-heading uppercase tracking-widest text-center mb-3">
                      Demo Access Codes
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {Object.keys(mockVoterDatabase).map((id) => (
                        <button
                          key={id}
                          onClick={() => {
                            Click();
                            setSearchId(id);
                          }}
                          className="px-2.5 py-1.5 bg-shade border border-white/10 rounded text-[8px] text-white/50 font-mono hover:border-accet/30 hover:text-accet transition-all"
                        >
                          {id}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center gap-2 text-white/30">
                  <Icon icon="lucide:lock" className="text-xs" />
                  <span className="text-[8px] font-heading uppercase tracking-widest">
                    End-to-End Encrypted
                  </span>
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
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accet/20 to-indigo-500/20 border border-accet/30 flex items-center justify-center mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <Icon icon="lucide:loader-2" className="text-accet text-3xl" />
                  </motion.div>
                </div>
                <h3 className="text-white font-heading font-bold uppercase tracking-wide mb-2">
                  Scanning Blockchain
                </h3>
                <p className="text-accet font-mono text-sm">
                  Locating: {searchId}
                </p>
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
                <div className="w-full max-w-sm bg-shade/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6">
                  <SectionTitle
                    icon={<Icon icon="lucide:lock-open" className="text-gray-900 text-sm" />}
                    title="Decrypting Data"
                    subtitle="Please wait..."
                  />

                  <div className="space-y-2 mt-4">
                    {decryptionSteps.map((step, idx) => (
                      <motion.div
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded border transition-all duration-300 ${
                          idx <= decryptionStep
                            ? "bg-gradient-to-br from-accet/10 to-indigo-500/10 border-accet/30"
                            : "bg-shade border-white/10"
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            idx < decryptionStep
                              ? "bg-gradient-to-br from-accet to-indigo-500 text-gray-900"
                              : idx === decryptionStep
                              ? "bg-accet/20 border border-accet text-accet"
                              : "bg-shade border border-white/20 text-white/40"
                          }`}
                        >
                          {idx < decryptionStep ? (
                            <Icon icon="lucide:check" className="text-sm" />
                          ) : idx === decryptionStep ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Icon icon="lucide:loader-2" className="text-sm" />
                            </motion.div>
                          ) : (
                            <Icon icon={step.icon} className="text-sm" />
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-heading uppercase tracking-widest ${
                            idx <= decryptionStep ? "text-white" : "text-white/30"
                          }`}
                        >
                          {step.text}
                        </span>
                      </motion.div>
                    ))}
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
                className="space-y-4"
              >
                {/* Success Header */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-3 md:p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Icon icon="lucide:check-circle" className="text-green-400 text-xl" />
                    </div>
                    <div>
                      <p className="text-[10px] text-green-400 font-heading uppercase tracking-widest">
                        Verification Complete
                      </p>
                      <p className="text-white font-mono text-sm font-bold">
                        {voterData.uniqueId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetSearch}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded text-[10px] text-white/60 font-heading uppercase tracking-widest hover:border-white/30 hover:text-white transition-all"
                  >
                    New Search
                  </button>
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* ===== VOTER INFO ===== */}
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-shade/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
                  >
                    <div className="p-4">
                      <SectionTitle
                        icon={<Icon icon="lucide:user" className="text-gray-900 text-sm" />}
                        title="Voter Information"
                        subtitle="Personal Details"
                      />

                      {/* Name */}
                      <div className="p-3 bg-shade border border-white/10 rounded mb-3">
                        <p className="text-[8px] text-accet font-heading uppercase tracking-widest mb-1">
                          Full Name
                        </p>
                        <p className="text-white text-sm font-heading font-bold">
                          {decryptedFields.includes("info") ? (
                            <EncryptedText text={voterData.name} isDecrypted={true} />
                          ) : (
                            <EncryptedText text={voterData.name} isDecrypted={false} />
                          )}
                        </p>
                        {decryptedFields.includes("info") && (
                          <p className="text-white/50 text-xs mt-0.5 font-body">
                            {voterData.tamilName}
                          </p>
                        )}
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Voter ID", value: voterData.voterId, field: "info" },
                          { label: "Age / Gender", value: `${voterData.age}Y / ${voterData.gender}`, field: "info" },
                          { label: "District", value: voterData.district, field: "location" },
                          { label: "Constituency", value: voterData.constituency, field: "location" },
                        ].map((item, idx) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.05 }}
                            className="p-2.5 bg-shade border border-white/10 rounded"
                          >
                            <p className="text-[7px] text-accet/70 font-heading uppercase tracking-widest mb-0.5">
                              {item.label}
                            </p>
                            <p className="text-white text-[11px] font-body truncate">
                              {decryptedFields.includes(item.field) ? (
                                <EncryptedText text={item.value} isDecrypted={true} />
                              ) : (
                                "████████"
                              )}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Voting Time */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-3 p-3 bg-gradient-to-r from-accet/10 to-indigo-500/10 border border-accet/20 rounded flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-accet/20 flex items-center justify-center shrink-0">
                          <Icon icon="lucide:calendar-check" className="text-accet text-lg" />
                        </div>
                        <div>
                          <p className="text-[8px] text-accet font-heading uppercase tracking-widest">
                            Vote Recorded
                          </p>
                          <p className="text-white text-xs font-body font-medium">
                            {decryptedFields.includes("info")
                              ? `${formatDate(voterData.votedAt).date} • ${formatDate(voterData.votedAt).time}`
                              : "████████████"}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* ===== VOTED CANDIDATE ===== */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-shade/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
                  >
                    <div className="p-4">
                      <SectionTitle
                        icon={<Icon icon="lucide:vote" className="text-gray-900 text-sm" />}
                        title="Your Vote"
                        subtitle="Selected Candidate"
                      />

                      {/* Candidate Display */}
                      <div className="flex flex-col items-center py-4">
                        {/* Image */}
                        <motion.div
                          className="relative mb-4"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                        >
                          <motion.div
                            className="absolute -inset-2 rounded-full"
                            style={{
                              background: "conic-gradient(#00d4aa, #6366f1, #00d4aa)",
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          />
                          <div className="absolute -inset-1 rounded-full bg-black" />

                          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-accet/50">
                            {decryptedFields.includes("candidate") ? (
                              <motion.img
                                src={voterData.candidate?.leader_img}
                                alt=""
                                className="w-full h-full object-cover object-top"
                                initial={{ filter: "blur(15px)" }}
                                animate={{ filter: "blur(0px)" }}
                                transition={{ duration: 0.4 }}
                              />
                            ) : (
                              <div className="w-full h-full bg-shade flex items-center justify-center">
                                <Icon icon="lucide:user" className="text-white/20 text-3xl" />
                              </div>
                            )}
                          </div>

                          {decryptedFields.includes("candidate") && (
                            <motion.div
                              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-accet to-indigo-500 flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5, type: "spring" }}
                            >
                              <Icon icon="lucide:check" className="text-gray-900 text-lg" />
                            </motion.div>
                          )}
                        </motion.div>

                        {/* Symbol */}
                        <div className="text-3xl mb-2">
                          {decryptedFields.includes("candidate")
                            ? voterData.candidate?.symbol
                            : "❓"}
                        </div>

                        {/* Name */}
                        <h4 className="text-white text-base font-heading font-bold uppercase tracking-wide text-center mb-1">
                          {decryptedFields.includes("candidate") ? (
                            <EncryptedText
                              text={voterData.candidate?.name || ""}
                              isDecrypted={true}
                            />
                          ) : (
                            <span className="text-white/20">████████████</span>
                          )}
                        </h4>

                        {/* Party Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-accet/10 to-indigo-500/10 border border-accet/30 rounded-full">
                          <div className="w-2 h-2 rounded-full bg-accet" />
                          <span className="text-accet text-[10px] font-heading font-bold uppercase tracking-widest">
                            {decryptedFields.includes("candidate")
                              ? voterData.candidate?.party
                              : "███"}
                          </span>
                        </div>

                        {decryptedFields.includes("candidate") && (
                          <p className="text-white/40 text-[9px] mt-2 font-body text-center">
                            {voterData.candidate?.partyFull}
                          </p>
                        )}

                        {/* Security Notice */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="w-full mt-4 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                            <Icon icon="lucide:lock" className="text-green-400 text-sm" />
                          </div>
                          <div>
                            <p className="text-[9px] text-green-400 font-heading uppercase tracking-wider">
                              Encrypted & Secured
                            </p>
                            <p className="text-[7px] text-white/40 font-body">
                              Blockchain verified record
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* ===== LIVE RESULTS ===== */}
                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-shade/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <SectionTitle
                          icon={<Icon icon="lucide:activity" className="text-gray-900 text-sm" />}
                          title="Live Results"
                          subtitle="Real-time vote count"
                        />
                        <div className="flex items-center gap-1.5">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-red-500"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          <span className="text-[8px] text-white/40 font-mono">
                            {formatTime(lastUpdated)}
                          </span>
                        </div>
                      </div>

                      {/* Total Votes */}
                      <div className="mb-4 p-3 bg-gradient-to-r from-accet/10 to-indigo-500/10 border border-accet/30 rounded text-center">
                        <p className="text-[8px] text-accet/70 font-heading uppercase tracking-widest">
                          Total Votes Cast
                        </p>
                        <motion.p
                          className="text-accet text-xl font-bold font-num"
                          key={totalVotes}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                        >
                          {decryptedFields.includes("results")
                            ? formatNumber(totalVotes)
                            : "███████"}
                        </motion.p>
                      </div>

                      {/* Results List */}
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        {liveResults.slice(0, 6).map((candidate, idx) => {
                          const percentage = ((candidate.votes / totalVotes) * 100).toFixed(1);
                          const isVoted = voterData.candidateId === candidate.id;

                          return (
                            <motion.div
                              key={candidate.id}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + idx * 0.05 }}
                              className={`p-2.5 rounded border transition-all ${
                                isVoted
                                  ? "bg-gradient-to-r from-accet/20 to-indigo-500/20 border-accet/50"
                                  : "bg-shade border-white/10"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {/* Rank */}
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold font-num ${
                                    idx === 0
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : idx === 1
                                      ? "bg-gray-400/20 text-gray-400"
                                      : idx === 2
                                      ? "bg-orange-500/20 text-orange-400"
                                      : "bg-white/5 text-white/40"
                                  }`}
                                >
                                  {idx + 1}
                                </div>

                                {/* Image */}
                                <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20">
                                  {decryptedFields.includes("results") ? (
                                    <img
                                      src={candidate.leader_img}
                                      alt=""
                                      className="w-full h-full object-cover object-top"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-shade" />
                                  )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1">
                                    <p className="text-white text-[10px] font-heading font-bold truncate">
                                      {decryptedFields.includes("results")
                                        ? candidate.name.split(" ").slice(0, 2).join(" ")
                                        : "██████"}
                                    </p>
                                    {isVoted && (
                                      <span className="text-[6px] px-1.5 py-0.5 bg-accet text-gray-900 rounded font-heading uppercase font-bold">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-white/40 text-[8px] font-body">
                                    {decryptedFields.includes("results")
                                      ? candidate.party
                                      : "███"}
                                  </p>
                                </div>

                                {/* Votes */}
                                <div className="text-right">
                                  <motion.p
                                    className="text-accet text-[11px] font-bold font-num"
                                    key={candidate.votes}
                                    initial={{ color: "#00ffcc" }}
                                    animate={{ color: "#00d4aa" }}
                                  >
                                    {decryptedFields.includes("results")
                                      ? formatNumber(candidate.votes)
                                      : "███"}
                                  </motion.p>
                                  <p className="text-white/30 text-[8px] font-num">
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
                                      ? "bg-gradient-to-r from-accet to-indigo-500"
                                      : "bg-accet/50"
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: decryptedFields.includes("results")
                                      ? `${percentage}%`
                                      : "0%",
                                  }}
                                  transition={{ duration: 0.8, delay: 0.5 + idx * 0.05 }}
                                />
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Live Indicator */}
                      <motion.div
                        className="mt-3 flex items-center justify-center gap-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              className="w-0.5 h-3 bg-accet rounded-full"
                              animate={{ scaleY: [0.3, 1, 0.3] }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.15,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-accet text-[8px] font-heading uppercase tracking-[0.2em]">
                          Live Updates
                        </span>
                      </motion.div>
                    </div>
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
                    onClick={resetSearch}
                    className="flex items-center gap-2 px-5 py-2.5 bg-shade border border-white/10 rounded text-[10px] text-white/60 font-heading uppercase tracking-widest hover:border-white/30 hover:text-white transition-all"
                  >
                    <Icon icon="lucide:search" className="text-sm" />
                    New Search
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-shade border border-white/10 rounded text-[10px] text-white/60 font-heading uppercase tracking-widest hover:border-white/30 hover:text-white transition-all"
                  >
                    <Icon icon="lucide:printer" className="text-sm" />
                    Print
                  </button>
                  <button
                    onClick={() => {
                      playClick();
                      navigate("/");
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-accet/80 to-accet text-gray-900 rounded text-[10px] font-heading uppercase tracking-widest font-bold hover:shadow-lg hover:shadow-accet/30 transition-all"
                  >
                    <Icon icon="lucide:home" className="text-sm" />
                    Back to Home
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ========== FOOTER ========== */}
      <footer className="relative z-20 px-4 py-3 border-t border-white/10 bg-shade/50 mt-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-[8px] text-white/30 font-heading uppercase tracking-widest">
            © 2025 VoteX
          </span>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[8px] text-green-400 font-heading uppercase tracking-widest">
              System Secured
            </span>
          </div>
        </div>
      </footer>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 212, 170, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 212, 170, 0.5);
        }
      `}</style>
    </div>
  );
};

export default VoterStatus;