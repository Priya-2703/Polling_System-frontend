import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SwiperCard from "../Components/SwiperCard";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav"
import { useTranslation } from "react-i18next";
import DigitalGlobeBackground from "../Components/DigitalGlobeBackground";


const Vote = () => {

    const {t} = useTranslation()
    const [playClick] = useSound(scifi);
    const navigate = useNavigate();
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isVoting, setIsVoting] = useState(false);

  const candidates = [
    {
      id: 1,
      name: t("candidates.p2.name"),
      party: t("candidates.p2.party"),
      party_logo: "https://i.pinimg.com/1200x/8d/0a/d6/8d0ad6577fd8aede3244c674ca6bfc3c.jpg",
      leader_img: "https://images.seeklogo.com/logo-png/41/1/dmk-logo-png_seeklogo-411320.png",
    },
    {
      id: 2,
      name: t("candidates.p3.name"),
      party: t("candidates.p3.party"),
      party_logo: "https://i.pinimg.com/1200x/8e/94/f8/8e94f852a6bf7bc2a3fb7918af013ff4.jpg",
      leader_img: "https://images.seeklogo.com/logo-png/41/1/aiadmk-logo-png_seeklogo-411321.png",
    },
    {
      id: 3,
      name: t("candidates.p1.name"),
      party: t("candidates.p1.party"),
      party_logo: "https://i.pinimg.com/736x/ef/e0/f8/efe0f8970f04bafbb8d5f416cda2fc2f.jpg",
      leader_img: "https://i.pinimg.com/736x/cb/94/47/cb9447a9a518aa16563a2748f428e589.jpg",
    },
  {
    id: 4,
    name: t("candidates.p4.name"),
    party: t("candidates.p4.party"),
    party_logo: "https://i.pinimg.com/1200x/eb/05/23/eb0523f9f6be7c0bdec78f67cd9ca050.jpg",
    leader_img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgEKfezxlo_XSniQNjVhAQcbF4mEFKSup5tg&s",
  },
  {
    id: 5,
    name: t("candidates.p5.name"),
    party: t("candidates.p5.party"),
    party_logo: "https://www.schemecolor.com/images/scheme/bharatiya-janata-party-bjp-flag-colors.png",
    leader_img: "https://i.pinimg.com/1200x/87/98/06/879806e54afb6170f276e63787dc10e6.jpg",
  },
  {
    id: 6,
    name: t("candidates.p6.name"),
    party: t("candidates.p6.party"),
    party_logo: "https://i.pinimg.com/736x/c1/d3/cc/c1d3ccbc02c015529332ecd52fbfcc1d.jpg",
    leader_img: "https://i.pinimg.com/736x/ba/5a/fa/ba5afa25ea6ca1abea61b5895be253ab.jpg",
  },
  {
    id: 7,
    name: t("candidates.p7.name"),
    party: t("candidates.p7.party"),
    party_logo: "https://i.pinimg.com/1200x/98/c6/3c/98c63c764c77502b22e93746a7d79a98.jpg",
    leader_img: "https://i.pinimg.com/736x/8c/9e/8a/8c9e8a9c95aaed234d059791a0cb541f.jpg",
  },
  {
    id: 8,
    name: t("candidates.p8.name"),
    party: t("candidates.p8.party"),
    party_logo: "https://i.pinimg.com/736x/de/93/f3/de93f35351b928c834706c9b8aeefd66.jpg",
    leader_img: "https://upload.wikimedia.org/wikipedia/commons/6/67/Pmk_flag.jpg",
  },
  {
    id: 9,
    name: t("candidates.p9.name"),
    party: t("candidates.p9.party"),
    party_logo: "https://votersverdict.com/party_img/1118412_desiya_murpokku_dravida_kazhagam_logo.webp",
    leader_img: "https://i.pinimg.com/1200x/40/47/9a/40479a53cc1be2c47d86a661358509da.jpg",
  },
  {
    id: 10,
    name: t("candidates.p10.name"),
    party: t("candidates.p10.party"),
    party_logo: "https://i.pinimg.com/736x/93/62/df/9362dfd674d8308e4414278642c5f65b.jpg",
    leader_img: "https://i.pinimg.com/736x/93/62/df/9362dfd674d8308e4414278642c5f65b.jpg",
  },
  {
    id: 11,
    name: t("candidates.p11.name"),
    party: t("candidates.p11.party"),
    party_logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJsd14m-3naYxXQ406pta-yUOcoXzXaX5cwA&s",
    leader_img: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Flag_AMMK.jpg",
  },
  {
    id: 12,
    name: t("candidates.p12.name"),
    party: t("candidates.p12.party"),
    party_logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCjLGPO2H742nhN27pR1xCrpDJb8EHmpUdpg&s",
    leader_img: "https://prime9tamil.com/wp-content/uploads/2025/05/tvk-velmurugan.jpg",
  },
  {
    id: 13,
    name: t("candidates.p13.name"),
    party: t("candidates.p13.party"),
    party_logo: "https://www.globalsecurity.org/military/world/india/images/cpi-m.gif",
    leader_img: "https://i.pinimg.com/1200x/00/b2/c8/00b2c835686c67028a5ae70d27349308.jpg",
  },
];


   const handleVote = () => {
    if (!selectedCandidate) return;
    
    setIsVoting(true);
    playClick()
    setTimeout(() => {
      navigate("/survey", { 
        state: { 
          candidate: selectedCandidate 
        } 
      });
    }, 500);
  };


  return (
    <div className="h-dvh bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <DigitalGlobeBackground />
      
      {/* 👇 Scanline Effect */}
      <div className="scanline" />
      
      {/* 👇 Vignette Overlay */}
      <div className="vignette" />


      {/* Main Container - NO overflow-hidden here */}
      <div className="container mx-auto relative z-10">
        <div className="w-full mx-auto h-dvh relative flex flex-col justify-between py-4">
          
          {/* Enhanced Header */}
          <div className="flex justify-center items-start z-20 px-4">
            <div className="relative">          
              <div className="text-center">               
                <h1 className="text-[18px] lg:text-[24px] font-heading uppercase font-black tracking-wider leading-5.5 text-transparent bg-linear-to-r from-accet via-accet/80 to-indigo-500 bg-clip-text drop-shadow-[0_0_30px_rgba(95, 98, 233,0.2)]">
                 {t('vote.title')}
                </h1>
              </div>
            </div>
          </div>

          {/* Main Content - Added padding for party logo */}
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
              className={`relative w-[95%] md:w-80 py-3 lg:py-4 rounded uppercase font-bold tracking-widest text-[12px] lg:text-[14px] font-heading overflow-hidden transition-all duration-500 ${
                selectedCandidate 
                  ? 'bg-linear-to-r from-accet via-indigo-500 to-accet/50 text-black hover:shadow-[0_0_30px_#4C43DD] hover:scale-[1.02] active:scale-[0.98]' 
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
                    <span>{t('vote.castVote')}</span>
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

export default Vote;