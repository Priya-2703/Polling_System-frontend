import { useState, useEffect } from "react"; // useEffect add pannikonga
import { useNavigate } from "react-router-dom";
import SwiperCard from "../Components/SwiperCard";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import { useTranslation } from "react-i18next";
import { useAuth } from "../Context/AuthContext";
import { submitCMVote } from "../utils/service/api";
import axios from "axios"; // axios install pannilena fetch use pannalam

const API_BASE_URL = import.meta.env.VITE_API_URL

const Candidate = () => {
  const { t } = useTranslation();
  const [playClick] = useSound(scifi);
  const navigate = useNavigate();
  const { checkUserStatus } = useAuth();

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState(null);
  
  // ✅ 1. Store the final merged data here
  const [candidateList, setCandidateList] = useState([]);

  // ✅ 2. Your Static Data (Text & ID from Frontend)
  // Image URL-ஐ fallback-க்காக வச்சுக்கலாம், ஆனா API data வந்ததும் அது replace ஆகிடும்.
  const staticCandidates = [
    {
      id: 1,
      name: t("cm_candi.p1.name"),
      leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350472/0b1fd85b73618222d787ca412c07cd38_qx7jsg.jpg", // Fallback
    },
    {
      id: 2,
      name: t("cm_candi.p2.name"),
      leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350158/d3728b039ee9b46b0b470588e73291e3_bdstta.jpg",
    },
    {
      id: 3,
      name: t("cm_candi.p3.name"),
      leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350652/annamalai-bjp-1_q6d7ea.jpg",
    },
    {
      id: 4,
      name: t("cm_candi.p4.name"),
      leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350158/d971ca4cf51445e099353789a35beef7_g5ill3.jpg",
    },
    {
      id: 5,
      name: t("cm_candi.p5.name"),
      leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350156/8ad7f3d2d2cb76b8f1ba1370b9027ba1_jbkvyy.jpg",
    },
    {
      id: 6,
      name: t("cm_candi.p6.name"),
      leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767351351/47b2f89fc1a586468a2a08cefe6388a3_mjttxg.jpg",
    },
    {
      id: 7,
      name: t("cm_candi.p7.name"),
      leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350472/202509303525651_bv3qcg.jpg",
    },
    {
      id: 8,
      name: t("cm_candi.p8.name"),
      leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350156/c6dec00515fb74fe4f2382f83ea47b4e_t9ru5k.jpg",
    },
    {
      id: 9,
      name: t("cm_candi.p9.name"),
      leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350157/160021_blai1l.jpg",
    },
    {
      id: 10,
      name: t("cm_candi.p10.name"),
      leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350654/c3eac93e0167b29531884865743e6424_osrcmu.jpg",
    },
    {
      id: 11,
      name: t("cm_candi.p11.name"),
      leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350473/Nainar_Nagendran__BJP_Tamil_Nadu_swt7k2.jpg",
    },
  ];

  // ✅ 3. API Call Logic & Merge
  useEffect(() => {
    const fetchAndMergeCandidates = async () => {
      try {

        const response = await axios.get(`${API_BASE_URL}/api/cm/list`); // Update URL if needed
        const apiData = response.data;

        // Merging Logic:
        // Frontend List-ஐ map செய்து, Backend Data-வில் ID match ஆகிறதா என்று பார்க்கிறோம்.
        const mergedData = staticCandidates.map((staticItem) => {
          // Backend array-வில் இந்த ID இருக்கான்னு தேடுறோம்
          const apiItem = apiData.find((item) => item.id === staticItem.id);

          return {
            ...staticItem, // Frontend-ல் உள்ள Name மற்றும் ID அப்படியே இருக்கும்
            leader_img: apiItem ? apiItem.images.candidate : staticItem.leader_img, // API Image இருந்தால் அதை வை, இல்லைனா பழைய Image.
          };
        });

        setCandidateList(mergedData);

      } catch (err) {
        console.error("Error fetching candidate images:", err);
        // Error வந்தால் பழைய Static Data-வையே காட்டலாம்
        setCandidateList(staticCandidates);
      }
    };

    fetchAndMergeCandidates();
  }, [t]); // translation மாறினால் இது மறுபடியும் ரன் ஆக t dependency தேவைப்படலாம்

  const handleVote = async () => {
    if (!selectedCandidate) return;

    setIsVoting(true);
    setError(null);
    playClick();

    try {
      const result = await submitCMVote(selectedCandidate.id);

      if (result.success) {
        await checkUserStatus();
      } else {
        setError(result.error || "Failed to submit vote. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="h-dvh relative overflow-hidden">
      <div className="w-full mx-auto relative z-10">
        <div className="w-full mx-auto h-dvh relative flex flex-col justify-between py-4">
          <div className="flex justify-center items-start z-20 px-4 mt-2">
            <div className="relative">
              <div className="text-center md:max-w-4xl">
                <h1 className="text-[14px] md:text-[24px] font-heading uppercase font-black tracking-wider leading-5.5 md:leading-8 text-transparent bg-linear-to-r from-accet to-accet/80 via-indigo bg-clip-text drop-shadow-[0_0_30px_rgba(95, 98, 233,0.2)]">
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
            {/* ✅ Change: Pass candidateList instead of candidates */}
            <SwiperCard
              candidates={candidateList.length > 0 ? candidateList : staticCandidates}
              selectedCandidate={selectedCandidate}
              setSelectedCandidate={setSelectedCandidate}
            />
          </div>

          {/* Vote Button Section */}
          <div className="flex justify-center items-center flex-col relative px-4">
            <button
              onClick={handleVote}
              disabled={!selectedCandidate || isVoting}
              className={`relative w-[95%] sm:w-80 py-3 rounded uppercase font-bold tracking-widest text-[12px] md:text-[16px] font-heading overflow-hidden transition-all duration-500 ${
                selectedCandidate
                  ? "bg-linear-to-r from-accet via-cyan-500 to-accet/50 text-black hover:shadow-[0_0_20px_#00F3FF] hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-linear-to-r from-white/10 to-white/5 text-white/30 cursor-not-allowed border border-white/10"
              }`}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isVoting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{t("vote.submitting")}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t("vote.submit")}</span>
                  </>
                )}
              </span>
            </button>

            <p className={`text-center text-[8px] md:text-[10px] mt-2 transition-all duration-300 ${selectedCandidate ? "text-accet/60" : "text-white/40"}`}>
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