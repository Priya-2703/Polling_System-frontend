import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import { Icon } from "@iconify/react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

const Thanks = () => {
  const { t } = useTranslation();
  const [playClick] = useSound(scifi);
  const navigate = useNavigate();
  const location = useLocation();

  const [rotationAngle, setRotationAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // ========== VIEWPORT-BASED SIZING ==========
  const [dimensions, setDimensions] = useState({
    vw: typeof window !== "undefined" ? window.innerWidth : 1024,
    vh: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        vw: window.innerWidth,
        vh: window.innerHeight,
      });
    };

    // Update on resize and zoom
    window.addEventListener("resize", updateDimensions);

    // Also update on zoom changes (detected via visualViewport if available)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateDimensions);
    }

    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateDimensions);
      }
    };
  }, []);

  // Get selected candidate from navigation state
  const selectedCandidate = location.state?.candidate || {
    id: 1,
    name: "NO one",
    leader_img:
      "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350158/d971ca4cf51445e099353789a35beef7_g5ill3.jpg",
  };

  const allCandidates = useMemo(
    () => [
      {
        id: 1,
        name: t("cm_candi.p1.name"),
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350472/0b1fd85b73618222d787ca412c07cd38_qx7jsg.jpg",
      },
      {
        id: 2,
        name: t("cm_candi.p2.name"),
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350158/d3728b039ee9b46b0b470588e73291e3_bdstta.jpg",
      },
      {
        id: 3,
        name: t("cm_candi.p3.name"),
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350652/annamalai-bjp-1_q6d7ea.jpg",
      },
      {
        id: 4,
        name: t("cm_candi.p4.name"),
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350158/d971ca4cf51445e099353789a35beef7_g5ill3.jpg",
      },
      {
        id: 5,
        name: t("cm_candi.p5.name"),
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350156/8ad7f3d2d2cb76b8f1ba1370b9027ba1_jbkvyy.jpg",
      },
      {
        id: 6,
        name: t("cm_candi.p6.name"),
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767351351/47b2f89fc1a586468a2a08cefe6388a3_mjttxg.jpg",
      },
      {
        id: 7,
        name: t("cm_candi.p7.name"),
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350472/202509303525651_bv3qcg.jpg",
      },
      {
        id: 8,
        name: t("cm_candi.p8.name"),
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350156/c6dec00515fb74fe4f2382f83ea47b4e_t9ru5k.jpg",
      },
      {
        id: 9,
        name: t("cm_candi.p9.name"),
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350157/160021_blai1l.jpg",
      },
      {
        id: 10,
        name: t("cm_candi.p10.name"),
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350654/c3eac93e0167b29531884865743e6424_osrcmu.jpg",
      },
      {
        id: 11,
        name: t("cm_candi.p11.name"),
        leader_img:
          "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350473/Nainar_Nagendran__BJP_Tamil_Nadu_swt7k2.jpg",
      },
    ],
    [t]
  );

  const selectedIndex = allCandidates.findIndex(
    (c) => c.id === selectedCandidate.id
  );
  const totalCandidates = allCandidates.length;

  const targetAngle = useMemo(() => {
    const anglePerCandidate = 360 / totalCandidates;
    const selectedInitialAngle = selectedIndex * anglePerCandidate;
    const rotationNeeded = -selectedInitialAngle;
    return 720 + rotationNeeded;
  }, [selectedIndex, totalCandidates]);

  const anglePerCandidate = 360 / totalCandidates;

  const uniqueId = useMemo(
    () =>
      `VTX-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`,
    []
  );

  const resultDate = "March 03, 2026";

  const sponsors = [
    {
      id: 1,
      img: "https://ik.imagekit.io/ivfldnjuy/lunailogoicon.ico?updatedAt=1759393439622",
      name: "Lunai",
    },
  ];

  useEffect(() => {
    const spinDuration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = easeOut * targetAngle;
      setRotationAngle(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setShowContent(true);

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.5 },
          colors: ["#00d4aa", "#6366f1", "#06b6d4", "#8b5cf6"],
        });
      }
    };

    requestAnimationFrame(animate);
  }, [targetAngle, playClick]);

  const copyUniqueId = () => {
    navigator.clipboard.writeText(uniqueId);
    playClick();
  };

  // ========== VIEWPORT-RELATIVE WHEEL CONFIGURATION ==========
  // This calculates sizes based on actual viewport, so zoom doesn't affect layout

  const isMobile = dimensions.vw < 768;

  // Calculate wheel size as percentage of viewport height
  // This ensures wheel always fits regardless of zoom level
  const wheelConfig = useMemo(() => {
    const { vh, vw } = dimensions;

    if (isMobile) {
      // Mobile: wheel is 60% of viewport height
      const wheelSize = Math.min(vh * 0.6, vw * 0.95);
      return {
        wheelSize: wheelSize,
        wheelRadius: wheelSize * 0.5,
        imageWidth: wheelSize * 0.29,
        imageHeight: wheelSize * 0.33,
        hubSize: wheelSize * 0.12,
        bottomOffset: wheelSize * 0.48,
      };
    } else {
      // Desktop: wheel is 70% of viewport height, capped at reasonable max
      const wheelSize = Math.min(vh * 0.75, 600); // Max 600px
      return {
        wheelSize: wheelSize,
        wheelRadius: wheelSize * 0.49,
        imageWidth: wheelSize * 0.28,
        imageHeight: wheelSize * 0.33,
        hubSize: wheelSize * 0.125,
        bottomOffset: wheelSize * 0.48,
      };
    }
  }, [dimensions, isMobile]);

  const {
    wheelSize: currentWheelSize,
    wheelRadius: currentWheelRadius,
    imageWidth: currentImageWidth,
    imageHeight: currentImageHeight,
    hubSize: currentHubSize,
    bottomOffset,
  } = wheelConfig;

  return (
    <div className="w-full md:w-[90%] mx-auto h-dvh relative overflow-hidden flex flex-col">
      {/* ========== TOP CONTENT SECTION ========== */}
      {/* Using flex-shrink-0 to prevent content from shrinking */}
      <div className="relative z-10 flex flex-col items-center px-4 pt-[4vh] md:pt-[2vh] shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{
            opacity: showContent ? 1 : 0,
            y: showContent ? 0 : -30,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          {/* Animated Checkmark */}
          <div className="relative flex justify-center mb-[1.5vh]">
            <motion.div
              className="absolute bg-accet/20 rounded-full"
              style={{
                width: `${Math.max(dimensions.vh * 0.07, 40)}px`,
                height: `${Math.max(dimensions.vh * 0.07, 40)}px`,
              }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="relative backdrop-blur-xl rounded-full flex items-center justify-center"
              style={{
                width: `${Math.max(dimensions.vh * 0.08, 48)}px`,
                height: `${Math.max(dimensions.vh * 0.08, 48)}px`,
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: showContent ? 1 : 0,
                rotate: showContent ? 0 : -180,
              }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  {sponsors.map((sponsor) => (
                    <div
                      key={sponsor.id}
                      style={{
                        width: `${Math.max(dimensions.vh * 0.1, 60)}px`,
                      }}
                    >
                      <img
                        src={sponsor.img}
                        alt={sponsor.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Thank You Title - Using clamp for responsive font size */}
          <h1
            className="font-heading uppercase font-bold text-white mb-1"
            style={{
              fontSize: `clamp(1.5rem, ${dimensions.vh * 0.05}px, 3rem)`,
            }}
          >
            {t("thanks.title")}
          </h1>

          {/* Description */}
          <div className="mb-[1vh] max-w-2xl mx-auto">
            <p
              className="text-neutral-400 leading-relaxed"
              style={{
                fontSize: `clamp(8px, ${dimensions.vh * 0.014}px, 11px)`,
              }}
            >
              {t("thanks.description1")}
            </p>
            <p
              className="text-neutral-400 leading-relaxed"
              style={{
                fontSize: `clamp(8px, ${dimensions.vh * 0.014}px, 11px)`,
              }}
            >
              {t("thanks.description2")}
            </p>
          </div>

          {/* Unique ID Card */}
          <motion.div
            className="relative mx-auto mb-[1vh] max-w-xs md:max-w-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: showContent ? 1 : 0.8,
              opacity: showContent ? 1 : 0,
            }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div
              className="relative flex items-center gap-2 bg-black/90 backdrop-blur-xl border border-accet/40"
              style={{
                padding: `${Math.max(dimensions.vh * 0.01, 6)}px ${Math.max(
                  dimensions.vh * 0.02,
                  12
                )}px`,
              }}
            >
              <div className="flex-1">
                <p
                  className="text-white uppercase tracking-widest font-heading mb-0.5"
                  style={{
                    fontSize: `clamp(6px, ${dimensions.vh * 0.011}px, 9px)`,
                  }}
                >
                  {t("thanks.uniqueId")}
                </p>
                <p
                  className="text-accet font-heading font-bold tracking-wider"
                  style={{
                    fontSize: `clamp(12px, ${dimensions.vh * 0.022}px, 18px)`,
                  }}
                >
                  {uniqueId}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Result Date & Sponsors */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
            <div
              className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full"
              style={{
                padding: `${Math.max(dimensions.vh * 0.008, 4)}px ${Math.max(
                  dimensions.vh * 0.02,
                  12
                )}px`,
              }}
            >
              <Icon
                icon="lucide:calendar-check"
                className="text-accet"
                style={{
                  fontSize: `clamp(10px, ${dimensions.vh * 0.018}px, 14px)`,
                }}
              />
              <span
                className="text-neutral-400 tracking-wide font-heading"
                style={{
                  fontSize: `clamp(7px, ${dimensions.vh * 0.013}px, 10px)`,
                }}
              >
                {t("thanks.resultDate")} :
              </span>
              <span
                className="text-white font-heading font-semibold"
                style={{
                  fontSize: `clamp(7px, ${dimensions.vh * 0.013}px, 10px)`,
                }}
              >
                {resultDate}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========== 2D CIRCLE WHEEL SECTION ========== */}
      {/* Takes remaining space with flex-1 */}
      <div className="absolute bottom-0 left-0 right-0 h-[65%] md:h-[60%] overflow-hidden">
        {/* Wheel Container */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: `-${bottomOffset}px`,
            width: `${currentWheelSize}px`,
            height: `${currentWheelSize}px`,
          }}
        >
          {/* Decorative Outer Ring */}
          <div
            className="absolute rounded-full border-2 border-accet/20"
            style={{
              inset: `${currentWheelSize * 0.016}px`,
              boxShadow:
                "0 0 60px rgba(99, 102, 241, 0.2), inset 0 0 40px rgba(99, 102, 241, 0.06)",
            }}
          />
          <div
            className="absolute rounded-full border border-accet/15"
            style={{ inset: `${currentWheelSize * 0.05}px` }}
          />

          {/* ✅ ROTATING WHEEL - Contains all candidates */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: rotationAngle }}
            transition={{ duration: 0, ease: "linear" }}
          >
            {/* Spokes/Lines */}
            {allCandidates.map((_, index) => {
              const angle = (index / totalCandidates) * 360;
              return (
                <div
                  key={`spoke-${index}`}
                  className="absolute top-1/2 left-1/2 origin-left h-px"
                  style={{
                    width: `${currentWheelRadius + currentWheelSize * 0.05}px`,
                    background:
                      "linear-gradient(90deg, rgba(0,212,170,0.4), rgba(99,102,241,0.2), transparent)",
                    transform: `rotate(${angle}deg)`,
                  }}
                />
              );
            })}

            {/* ✅ CANDIDATES ON THE WHEEL */}
            {allCandidates.map((candidate, index) => {
              const angleDegrees = index * anglePerCandidate - 90;
              const angleRadians = (angleDegrees * Math.PI) / 180;

              const x = Math.cos(angleRadians) * currentWheelRadius;
              const y = Math.sin(angleRadians) * currentWheelRadius;

              const isSelected = candidate.id === selectedCandidate.id;

              const cardPositionAngle = index * anglePerCandidate;
              const effectiveAngle = (cardPositionAngle + rotationAngle) % 360;
              const normalizedEffectiveAngle =
                effectiveAngle > 180 ? effectiveAngle - 360 : effectiveAngle;

              const cardTiltAngle = isSpinning
                ? 0
                : isSelected
                ? 0
                : normalizedEffectiveAngle * 0.9;

              return (
                <div
                  key={candidate.id}
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                    zIndex: isSelected && !isSpinning ? 20 : 10,
                  }}
                >
                  <motion.div
                    animate={{ rotate: -rotationAngle + cardTiltAngle }}
                    transition={{
                      duration: isSpinning ? 0 : 0.5,
                      ease: "easeOut",
                    }}
                  >
                    <motion.div
                      className="relative"
                      animate={{
                        scale:
                          !isSpinning && isSelected
                            ? 1.3
                            : !isSpinning
                            ? 0.7
                            : 0.5,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      {!isSpinning && isSelected && (
                        <motion.div
                          className="absolute rounded-xl"
                          style={{
                            inset: "-5px",
                            background: "rgba(0, 243, 255, 0.6)",
                            filter: "blur(15px)",
                          }}
                          animate={{ opacity: [0.4, 0.8, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}

                      <div
                        className={`relative overflow-hidden rounded-lg transition-all duration-500 ${
                          !isSpinning && isSelected
                            ? "ring-2 ring-accet shadow-[0_0_20px_rgba(0, 243, 255,0.1)]"
                            : "ring-1 ring-white/20"
                        }`}
                        style={{
                          width: `${currentImageWidth}px`,
                          height: `${currentImageHeight}px`,
                          background:
                            "linear-gradient(145deg, #1a1a2e, #0a0a12)",
                        }}
                      >
                        <img
                          src={candidate.leader_img}
                          alt={candidate.name}
                          className={`w-full h-full object-cover object-top transition-all duration-600 ${
                            !isSpinning && !isSelected
                              ? "grayscale brightness-[0.2] scale-100"
                              : "grayscale-0 brightness-100"
                          }`}
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                        {!isSpinning && isSelected && (
                          <motion.div
                            className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
                            initial={{ x: "-100%" }}
                            animate={{ x: "200%" }}
                            transition={{
                              duration: 0.8,
                              delay: 0.3,
                              ease: "easeInOut",
                            }}
                          />
                        )}

                        {!isSpinning && !isSelected && (
                          <div className="absolute inset-0 bg-black/10" />
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>

          {/* ✅ CENTER HUB */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-gray-900 to-black border-2 border-accet/50 flex items-center justify-center z-30"
            style={{
              width: `${currentHubSize}px`,
              height: `${currentHubSize}px`,
              boxShadow:
                "0 0 40px rgba(0, 243, 255, 0.4), inset 0 0 20px rgba(0, 243, 255, 0.1)",
            }}
          >
            {isSpinning ? (
              <motion.div
                className="border-3 border-accet/20 border-t-accet rounded-full"
                style={{
                  width: `${currentHubSize * 0.5}px`,
                  height: `${currentHubSize * 0.5}px`,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-center"
              >
                <Icon
                  icon="lucide:vote"
                  className="text-accet drop-shadow-[0_0_10px_rgba(0, 243, 255,0.8)]"
                  style={{
                    fontSize: `${currentHubSize * 0.4}px`,
                  }}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* ✅ SELECTED CANDIDATE INFO CARD */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-40"
          style={{
            bottom: `${Math.max(dimensions.vh * 0.03, 40)}px`,
          }}
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{
            opacity: showContent ? 1 : 0,
            y: showContent ? 0 : -20,
            scale: showContent ? 1 : 0.9,
          }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div
            className="text-center bg-black/95 backdrop-blur-xl border border-accet rounded-md shadow-[0_0_50px_rgba(0, 243, 255,0.6)]"
            style={{
              padding: `${Math.max(dimensions.vh * 0.01, 6)}px ${Math.max(
                dimensions.vh * 0.025,
                16
              )}px`,
            }}
          >
            <p
              className="text-accet font-light md:font-medium uppercase tracking-widest md:tracking-[0.2em] font-heading md:mb-1"
              style={{
                fontSize: isMobile
                  ? `clamp(6px, ${dimensions.vh * 0.013}px, 6px)` // Mobile: smaller
                  : `clamp(8px, ${dimensions.vh * 0.022}px, 8px)`,
              }}
            >
              {t("thanks.votedFor")}
            </p>
            <h3
              className="text-white font-heading font-bold uppercase tracking-wider"
              style={{
                fontSize: isMobile
                  ? `clamp(6px, ${dimensions.vh * 0.013}px, 10px)` // Mobile: smaller
                  : `clamp(8px, ${dimensions.vh * 0.022}px, 16px)`,
              }}
            >
              {selectedCandidate.name}
            </h3>
          </div>
        </motion.div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-black via-black/90 to-transparent pointer-events-none" />
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-50 py-2 px-4 bg-linear-to-t from-black to-transparent">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              playClick();
              navigate("https://lunai.in/");
            }}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-accet transition-colors group"
          >
            <Icon
              icon="lucide:home"
              className="text-sm group-hover:scale-110 transition-transform"
            />
            <span className="text-[7px] md:text-[9px] font-heading uppercase tracking-wider">
              {t("thanks.backHome")}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[6px] md:text-[8px] text-neutral-600 font-heading">
              © 2025 VoteX
            </span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[6px] md:text-[8px] text-green-400 font-heading">
                {t("thanks.secured")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thanks;
