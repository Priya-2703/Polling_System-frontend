import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SwiperCard from "../Components/SwiperCard";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav"
import { useTranslation } from "react-i18next";
import DigitalGlobeBackground from "../Components/DigitalGlobeBackground";


const Candidate = () => {
    const {t} = useTranslation()
    const [playClick] = useSound(scifi);
    const navigate = useNavigate();
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isVoting, setIsVoting] = useState(false);

  const candidates = [
    {
      id: 1,
      name: t("cm_candi.p1.name"),
    //   party: t("cm_candi.p1.party"),
    //   party_logo: "https://i.pinimg.com/1200x/8d/0a/d6/8d0ad6577fd8aede3244c674ca6bfc3c.jpg",
      leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350158/d971ca4cf51445e099353789a35beef7_g5ill3.jpg",
    },
    {
      id: 2,
      name: t("cm_candi.p2.name"),
    //   party: t("cm_candi.p2.party"),
    //   party_logo: "https://i.pinimg.com/1200x/8e/94/f8/8e94f852a6bf7bc2a3fb7918af013ff4.jpg",
      leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350156/c6dec00515fb74fe4f2382f83ea47b4e_t9ru5k.jpg",
    },
    {
      id: 3,
      name: t("cm_candi.p3.name"),
    //   party: t("cm_candi.p3.party"),
    //   party_logo: "https://i.pinimg.com/736x/ef/e0/f8/efe0f8970f04bafbb8d5f416cda2fc2f.jpg",
      leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350156/8ad7f3d2d2cb76b8f1ba1370b9027ba1_jbkvyy.jpg",
    },
  {
    id: 4,
    name: t("cm_candi.p4.name"),
    // party: t("cm_candi.p4.party"),
    // party_logo: "https://i.pinimg.com/1200x/eb/05/23/eb0523f9f6be7c0bdec78f67cd9ca050.jpg",
    leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350158/d3728b039ee9b46b0b470588e73291e3_bdstta.jpg",
  },
  {
    id: 5,
    name: t("cm_candi.p5.name"),
    // party: t("cm_candi.p5.party"),
    // party_logo: "https://www.schemecolor.com/images/scheme/bharatiya-janata-party-bjp-flag-colors.png",
    leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350472/0b1fd85b73618222d787ca412c07cd38_qx7jsg.jpg",
  },
  {
    id: 6,
    name: t("cm_candi.p6.name"),
    // party: t("cm_candi.p6.party"),
    // party_logo: "https://i.pinimg.com/736x/c1/d3/cc/c1d3ccbc02c015529332ecd52fbfcc1d.jpg",
    leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350652/annamalai-bjp-1_q6d7ea.jpg",
  },
  {
    id: 7,
    name: t("cm_candi.p7.name"),
    // party: t("cm_candi.p7.party"),
    // party_logo: "https://i.pinimg.com/1200x/98/c6/3c/98c63c764c77502b22e93746a7d79a98.jpg",
    leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350472/202509303525651_bv3qcg.jpg",
  },
  {
    id: 8,
    name: t("cm_candi.p8.name"),
    // party: t("cm_candi.p8.party"),
    // party_logo: "https://i.pinimg.com/736x/de/93/f3/de93f35351b928c834706c9b8aeefd66.jpg",
    leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767351351/47b2f89fc1a586468a2a08cefe6388a3_mjttxg.jpg",
  },
  {
    id: 9,
    name: t("cm_candi.p9.name"),
    // party: t("cm_candi.p9.party"),
    // party_logo: "https://votersverdict.com/party_img/1118412_desiya_murpokku_dravida_kazhagam_logo.webp",
    leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350654/c3eac93e0167b29531884865743e6424_osrcmu.jpg",
  },
  {
    id: 10,
    name: t("cm_candi.p10.name"),
    // party: t("cm_candi.p10.party"),
    // party_logo: "https://i.pinimg.com/736x/93/62/df/9362dfd674d8308e4414278642c5f65b.jpg",
    leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350157/160021_blai1l.jpg",
  },
  {
    id: 11,
    name: t("cm_candi.p11.name"),
    // party: t("cm_candi.p11.party"),
    // party_logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJsd14m-3naYxXQ406pta-yUOcoXzXaX5cwA&s",
    leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350473/Nainar_Nagendran__BJP_Tamil_Nadu_swt7k2.jpg",
  },
  {
    id: 12,
    name: t("cm_candi.p12.name"),
    // party: t("cm_candi.p12.party"),
    // party_logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCjLGPO2H742nhN27pR1xCrpDJb8EHmpUdpg&s",
    leader_img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767350169/ops_jfdmbi.jpg",
  },
];


   const handleVote = () => {
    if (!selectedCandidate) return;
    
    setIsVoting(true);
    playClick()
    setTimeout(() => {
      navigate("/thanks", { 
        state: { 
          candidate: selectedCandidate 
        } 
      });
    }, 500);
  };


  return (
    <div className="h-dvh bg-black relative overflow-hidden">
        <DigitalGlobeBackground />
        <div className="scanline" />
        <div className="vignette" />

      {/* Main Container */}
      <div className="container mx-auto relative z-10">
        <div className="w-full mx-auto h-dvh relative flex flex-col justify-between py-4">
          
          {/* Enhanced Header */}
          <div className="flex justify-center items-start z-20 px-4 mt-2">
            <div className="relative">          
              <div className="text-center">               
                <h1 className="text-[14px] lg:text-[18px] font-heading uppercase font-black tracking-wider leading-5.5 text-transparent bg-linear-to-r from-accet to-accet/80 via-indigo bg-clip-text drop-shadow-[0_0_30px_rgba(95, 98, 233,0.2)]">
                 {t('vote.question')}
                </h1>
              </div>
            </div>
          </div>

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
                  ? 'bg-linear-to-r from-accet via-indigo-500 to-accet/50 text-black hover:shadow-[0_0_40px_#4C43DD] hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-linear-to-r from-white/10 to-white/5 text-white/30 cursor-not-allowed border border-white/10'
              }`}
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
              
              {/* Button Content */}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isVoting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{t('vote.submitting')}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('vote.submit')}</span>
                  </>
                )}
              </span>
            </button>
            
            {/* Help Text */}
            <p className={`text-center text-[8px] lg:text-[10px] mt-2 transition-all duration-300 ${
              selectedCandidate ? 'text-accet/60' : 'text-white/40'
            }`}>
              {selectedCandidate 
                ? `✓ ${selectedCandidate.name} ${t('vote.selectedSuffix')}`  
                : t('vote.instruction')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Candidate;