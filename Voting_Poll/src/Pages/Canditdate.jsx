import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SwiperCard from "../Components/SwiperCard";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import { useTranslation } from "react-i18next";
import { useAuth } from "../Context/AuthContext";
import DigitalGlobeBackground from "../Components/DigitalGlobeBackground";
import { submitCMVote } from "../utils/service/api";

const Candidate = () => {
  const { t } = useTranslation();
  const [playClick] = useSound(scifi);
  const navigate = useNavigate();
  const {voteId, checkUserStatus } = useAuth();

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState(null);

  const candidates = [
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
  ];

  // const handleVote = () => {
  //   if (!selectedCandidate) return;

  //   setIsVoting(true);
  //   playClick();

  //     // localStorage.setItem("voter_status", "candidate_selected");

  //   setTimeout(() => {
  //     navigate("/thanks", {
  //       state: {
  //         candidate: selectedCandidate,
  //       },
  //        replace: true,
  //     });
  //   }, 500);
  // };

  const handleVote = async () => {
    if (!selectedCandidate) return;

    setIsVoting(true);
    setError(null);
    playClick();

    try {
      // ✅ Call Backend API
      const result = await submitCMVote(voteId, selectedCandidate.id);



      if (result.success) {
        // ❌ OLD - REMOVE:
        // localStorage.setItem("voter_status", "candidate_selected");
        console.log("cand id", selectedCandidate.id)

        // ✅ NEW: Refresh status - Auto redirect to Thanks
        await checkUserStatus();

        // Note: checkUserStatus auto redirect pannum, navigate thevai illa
        // But if you want to pass state to Thanks page:
        // navigate("/thanks", { state: { candidate: selectedCandidate }, replace: true });
      } else {
        setError(result.error || "Failed to submit vote. Please try again.");
      }
    } catch (err) {
      console.error("CM Vote Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="h-dvh relative overflow-hidden">
      {/* Main Container */}
      <div className="w-full mx-auto relative z-10">
        <div className="w-full mx-auto h-dvh relative flex flex-col justify-between py-4">
          {/* Enhanced Header */}
          <div className="flex justify-center items-start z-20 px-4 mt-2">
            <div className="relative">
              <div className="text-center lg:max-w-4xl">
                <h1 className="text-[14px] lg:text-[24px] font-heading uppercase font-black tracking-wider leading-5.5 md:leading-8 text-transparent bg-linear-to-r from-accet to-accet/80 via-indigo bg-clip-text drop-shadow-[0_0_30px_rgba(95, 98, 233,0.2)]">
                  {t("vote.question")}
                </h1>
              </div>
            </div>
          </div>

          {error && (
            <div className="mx-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="w-full mx-auto flex flex-col justify-center items-center">
            <SwiperCard
              candidates={candidates}
              selectedCandidate={selectedCandidate}
              setSelectedCandidate={setSelectedCandidate}
            />
          </div>

          {/* Vote Button */}
          <div className="flex justify-center items-center flex-col relative px-4">
            <button
              onClick={handleVote}
              disabled={!selectedCandidate || isVoting}
              className={`relative w-[95%] sm:w-80 py-3 rounded uppercase font-bold tracking-widest text-[12px] lg:text-[16px] font-heading overflow-hidden transition-all duration-500 ${
                selectedCandidate
                  ? "bg-linear-to-r from-accet via-cyan-500 to-accet/50 text-black hover:shadow-[0_0_20px_#00F3FF] hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-linear-to-r from-white/10 to-white/5 text-white/30 cursor-not-allowed border border-white/10"
              }`}
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />

              {/* Button Content */}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isVoting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                    <span>{t("vote.submitting")}</span>
                  </>
                ) : (
                  <>
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{t("vote.submit")}</span>
                  </>
                )}
              </span>
            </button>

            {/* Help Text */}
            <p
              className={`text-center text-[8px] lg:text-[10px] mt-2 transition-all duration-300 ${
                selectedCandidate ? "text-accet/60" : "text-white/40"
              }`}
            >
              {selectedCandidate
                ? `✓ ${selectedCandidate.name} ${t("vote.selectedSuffix")}`
                : t("vote.instruction")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Candidate;
