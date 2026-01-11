import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SwiperCard from "../Components/SwiperCard";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import { useTranslation } from "react-i18next";
import useVote from "../Hooks/useVote";

const Vote = () => {
  const { t } = useTranslation();
  const [playClick] = useSound(scifi);
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const { isLoading, error, isSuccess, castVote, hasVoted, reset } = useVote();

  const candidates = [
    {
      id: 1,
      name: t("candidates.p1.name"),
      founder: "M.G. Ramachandran",
      discription:
        "1972 ஆம் ஆண்டு புரட்சித்தலைவர் எம்.ஜி. ராமச்சந்திரன் அவர்களால் அனைத்திந்திய அண்ணா திராவிட முன்னேற்றக் கழகம் தொடங்கப்பட்டது. அவருக்குப் பின், புரட்சித்தலைவி ஜெ. ஜெயலலிதா அவர்கள் கட்சியின் தலைமைப் பொறுப்பை ஏற்று வழிநடத்தினார்., அண்ணாயிசம் அடிப்படையிலான சமூகநீதி, சமூகநலக் கொள்கைகளை ஏற்று, பெண்கள், ஏழை மற்றும் பின்தங்கிய மக்களின் வளர்ச்சி திட்டங்களைக் கொண்டு, தமிழ்நாடு சட்டமன்றத் தேர்தலில் 7 முறை ஆட்சி அமைத்த முக்கிய அரசியல் கட்சியாகத் திகழ்கிறது. 50 ஆண்டுகளாக தமிழ் மக்களின் முன்னேற்றத்திற்காக பயணிக்கும் கட்சியாகும்.",
      year: "1972",
      promises: [
        "சமூக நீதி, சமத்துவம்",
        "ஏழை எளிய மக்களுக்கான நலத்திட்டங்கள்",
        "சத்துணவுத் திட்டம்",
        "மகளிருக்கான சிறப்புத் திட்டங்கள்",
        "அம்மா உணவகம், தாலிக்கு தங்கம் மற்றும் பல ",
        "ஊழலற்ற மக்கள் நலன் சார்ந்த ஆட்சி",
      ],
      tagline_en: "Makkalai Kaappom, Thamizagathai Meetpom",
      tagline_ta: "மக்களை காப்போம், தமிழகத்தை மீட்போம்",
      party: t("candidates.p1.party"),
      party_logo:
        "https://i.pinimg.com/1200x/8e/94/f8/8e94f852a6bf7bc2a3fb7918af013ff4.jpg",
      leader_img:
        "https://images.seeklogo.com/logo-png/41/1/aiadmk-logo-png_seeklogo-411321.png",
    },
    {
      id: 2,
      name: t("candidates.p2.name"),
      founder: "Vijay",
      discription:
        "Tamilaga Vettri Kazhagam (TVK) என்பது தமிழ்நாட்டை மையமாகக் கொண்டு உருவான புதிய அரசியல் கட்சி. சமூக நியாயம், சமத்துவம், நல்லாட்சியை அடிப்படையாகக் கொண்ட அரசியல் கொள்கைகளை TVK முன்னிறுத்துகிறது. இளைஞர்கள், மாணவர்கள், தொழிலாளர்கள் மற்றும் பொதுமக்களின் உரிமைகளை பாதுகாப்பது, அரசியலில் வெளிப்படைத்தன்மை கட்சியின் முக்கிய நோக்கமாகும். அரசியலில் வெளிப்படைத்தன்மை, ஊழல் இல்லா நிர்வாகம் மற்றும் மக்கள் நலன் சார்ந்த அணுகுமுறையை TVK வலியுறுத்துகிறது. தற்போது TVK, தமிழக அரசியலில் ஒரு புதிய மாற்று  சக்தியாக கவனம் பெறுகிறது.",
      year: "2024",
      promises: [],
      tagline_en: "Pirappokkum Ellaa Uyirkkum",
      tagline_ta: "பிறப்பொக்கும் எல்லா உயிருக்கும்",
      party: t("candidates.p2.party"),
      party_logo:
        "https://i.pinimg.com/736x/ef/e0/f8/efe0f8970f04bafbb8d5f416cda2fc2f.jpg",
      leader_img:
        "https://i.pinimg.com/736x/cb/94/47/cb9447a9a518aa16563a2748f428e589.jpg",
    },
    {
      id: 3,
      name: t("candidates.p3.name"),
      founder: "C. N. Annadurai",
      discription:
        "திராவிட முன்னேற்றக் கழகம் (DMK) தமிழ்நாட்டில் முக்கிய அரசியல் கட்சி. இக்கட்சி சமூக நீதி, சமத்துவம், பெண்சாதிகெதிர்ப்பு, தமிழ் மொழி–பண்பாட்டுப் பாதுகாப்பு போன்ற கொள்கைகளை முன்னெடுக்கிறது. DMK ஆட்சியில் பல சமூக சீர்திருத்தங்கள், கல்வி வளர்ச்சி மற்றும் நலத்திட்டங்கள் நடைமுறைப்படுத்தப்பட்டுள்ளன. தற்போது மு.க. ஸ்டாலின் தலைமையிலேயே கட்சி தமிழக அரசியலில் முக்கிய பங்கு வகிக்கிறது மற்றும் செய்யற்குழு முன்னேற்ற கூட்டணி-யின் உறுப்பினராக செயல்படுகிறது.",
      year: "1949",
      promises: [],
      tagline_en: "Stalin thaan varaaru, vidiyal thara poraaru",
      tagline_ta: "ஸ்டாலின் தான் வராரு, விடியல் தரப் போறாரு",
      party: t("candidates.p3.party"),
      party_logo:
        "https://i.pinimg.com/1200x/8d/0a/d6/8d0ad6577fd8aede3244c674ca6bfc3c.jpg",
      leader_img:
        "https://images.seeklogo.com/logo-png/41/1/dmk-logo-png_seeklogo-411320.png",
    },
    {
      id: 4,
      name: t("candidates.p4.name"),
      founder: "S. P. Adithanar",
      discription: "",
      year: "1958",
      promises: [],
      tagline_en: " Uzhavai Meetpoom, Ulagai Kaappom",
      tagline_ta: " உழவை மீட்டோம் உலகை காப்போம்",
      party: t("candidates.p4.party"),
      party_logo:
        "https://i.pinimg.com/1200x/eb/05/23/eb0523f9f6be7c0bdec78f67cd9ca050.jpg",
      leader_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgEKfezxlo_XSniQNjVhAQcbF4mEFKSup5tg&s",
    },
    {
      id: 5,
      name: t("candidates.p5.name"),
      founder: " Dr. Syama Prasad Mookerjee",
      discription: "",
      year: "1980",
      promises: [],
      tagline_en: "Thamizagam Thalai Nimira Tamizhanin Payanam ",
      tagline_ta: "தமிழகம் தலை நிமிர தமிழனின் பயணம்",
      party: t("candidates.p5.party"),
      party_logo:
        "https://i.pinimg.com/1200x/87/98/06/879806e54afb6170f276e63787dc10e6.jpg",
      leader_img:
        "https://i.pinimg.com/1200x/87/98/06/879806e54afb6170f276e63787dc10e6.jpg",
    },
    {
      id: 6,
      name: t("candidates.p6.name"),
      founder: "Allan Octavian Hume",
      discription: "",
      year: "1885",
      promises: [],
      tagline_en: "Vaakku Thiruttukku Ethiraaga Ondrianthu Nirppom",
      tagline_ta: "வாக்கு திருட்டுக்கு எதிராக ஒன்றிணைந்து நிற்போம்",
      party: t("candidates.p6.party"),
      party_logo:
        "https://i.pinimg.com/736x/c1/d3/cc/c1d3ccbc02c015529332ecd52fbfcc1d.jpg",
      leader_img:
        "https://i.pinimg.com/736x/ba/5a/fa/ba5afa25ea6ca1abea61b5895be253ab.jpg",
    },
    {
      id: 7,
      name: t("candidates.p7.name"),
      founder: "Thol. Thirumavalavan",
      discription: "",
      year: "1982",
      promises: [],
      tagline_en: "Saathi Ozhippe Makkal Viduthalai",
      tagline_ta: "சாதி ஒழிப்பே மக்கள் விடுதலை",
      party: t("candidates.p7.party"),
      party_logo:
        "https://i.pinimg.com/1200x/98/c6/3c/98c63c764c77502b22e93746a7d79a98.jpg",
      leader_img:
        "https://i.pinimg.com/736x/8c/9e/8a/8c9e8a9c95aaed234d059791a0cb541f.jpg",
    },
    {
      id: 8,
      name: t("candidates.p8.name"),
      founder: "S. Ramadoss",
      discription: "",
      year: "1989",
      promises: [],
      tagline_en: " Anivarukkum Valarchi, Anaivarukkum Urimai",
      tagline_ta: "அனைவருக்கும் வளர்ச்சி, அனைவருக்கும் உரிமை",
      party: t("candidates.p8.party"),
      party_logo:
        "https://i.pinimg.com/736x/de/93/f3/de93f35351b928c834706c9b8aeefd66.jpg",
      leader_img:
        "https://upload.wikimedia.org/wikipedia/commons/6/67/Pmk_flag.jpg",
    },
    {
      id: 9,
      name: t("candidates.p9.name"),
      founder: "Vijayakanth",
      discription: "",
      year: "2005",
      promises: [],
      tagline_en:
        " Tamizhan endru solladaa, thalai nimirnthu nilladaa, iyandrathai seivom, illaathavarkkae",
      tagline_ta:
        "தமிழன் என்று சொல்லடா, தலை நிமிர்ந்து நில்லடா, இயன்றதை செய்வோம், இல்லாதவர்க்கே!",
      party: t("candidates.p9.party"),
      party_logo:
        "https://votersverdict.com/party_img/1118412_desiya_murpokku_dravida_kazhagam_logo.webp",
      leader_img:
        "https://i.pinimg.com/1200x/40/47/9a/40479a53cc1be2c47d86a661358509da.jpg",
    },
    {
      id: 10,
      name: t("candidates.p10.name"),
      founder: "M. N. Roy",
      discription: "",
      year: "1925",
      promises: [],
      tagline_en: "Workers of the world, unite!",
      tagline_ta: "உலகத் தொழிலாளர்களே, ஒன்றுபடுங்கள்!",
      party: t("candidates.p10.party"),
      party_logo:
        "https://i.pinimg.com/736x/93/62/df/9362dfd674d8308e4414278642c5f65b.jpg",
      leader_img:
        "https://i.pinimg.com/736x/93/62/df/9362dfd674d8308e4414278642c5f65b.jpg",
    },
    {
      id: 11,
      name: t("candidates.p11.name"),
      founder: "T. T. V. Dhinakaran",
      discription: "",
      year: "2018",
      promises: [],
      tagline_en: "Thamizagam Thalai Nimirattum, Tamizhar Vaazhvu Malarattum ",
      tagline_ta: "தமிழகம் தலை நிமிரட்டும், தமிழர் வாழ்வு மலரட்டும்",
      party: t("candidates.p11.party"),
      party_logo:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJsd14m-3naYxXQ406pta-yUOcoXzXaX5cwA&s",
      leader_img:
        "https://upload.wikimedia.org/wikipedia/commons/c/c5/Flag_AMMK.jpg",
    },
    {
      id: 12,
      name: t("candidates.p12.name"),
      founder: " T. Velmurugan",
      discription: "",
      year: "2012",
      promises: [],
      tagline_en: "Urimai Meetchiye, Inaththin Eazhuchi ",
      tagline_ta: "உரிமை மீட்சியே, இனத்தின் எழுச்சி",
      party: t("candidates.p12.party"),
      party_logo:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCjLGPO2H742nhN27pR1xCrpDJb8EHmpUdpg&s",
      leader_img:
        "https://prime9tamil.com/wp-content/uploads/2025/05/tvk-velmurugan.jpg",
    },
    {
      id: 13,
      name: t("candidates.p13.name"),
      founder: "P. Ramamurthi",
      discription: "",
      year: "1964",
      promises: [],
      tagline_en:
        " Anaivarukkum Samathuvathum Neethiyayum Oruthi Seivatharkkanaa Ore Paathai",
      tagline_ta:
        "அனைவருக்கும் சமத்துவத்தும் நீதியும் ஒருச்சென்று செய்வதற்கான ஒரே பாதை",
      party: t("candidates.p13.party"),
      party_logo:
        "https://www.globalsecurity.org/military/world/india/images/cpi-m.gif",
      leader_img:
        "https://i.pinimg.com/1200x/00/b2/c8/00b2c835686c67028a5ae70d27349308.jpg",
    },
  ];

  // Check if already voted - Redirect
  useEffect(() => {
    if (hasVoted()) {
      navigate("/survey", { replace: true });
    }
  }, [hasVoted, navigate]);

  // Success - Navigate to survey
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/survey", { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  // Clear error when candidate changes
  useEffect(() => {
    if (error && selectedCandidate) {
      reset();
    }
  }, [selectedCandidate]);

  // Handle Vote
  const handleVote = async () => {
    if (!selectedCandidate || isLoading) return;
    playClick();
    await castVote(selectedCandidate.id);
  };

  return (
    <div className="h-dvh overflow-hidden md:overflow-auto relative">
      {/* Main Container - NO overflow-hidden here */}
      <div className="w-full mx-auto relative z-10">
        <div className="w-full mx-auto h-dvh relative flex flex-col justify-between py-4">
          {/* Enhanced Header */}
          <div className="flex justify-center items-start z-20 px-4">
            <div className="relative">
              <div className="text-center">
                <h1 className="text-[18px] lg:text-[24px] font-heading uppercase font-black tracking-wider leading-5.5 md:leading-11 text-transparent bg-linear-to-r from-accet via-accet/80 to-indigo-500 bg-clip-text drop-shadow-[0_0_30px_rgba(95, 98, 233,0.2)]">
                  {t("vote.title")}
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
              disabled={!selectedCandidate || isLoading || isSuccess}
              className={`relative w-[95%] md:w-80 py-3 lg:py-4 rounded uppercase font-bold tracking-widest text-[12px] lg:text-[14px] font-heading overflow-hidden transition-all duration-500 ${
                selectedCandidate && !isLoading && !isSuccess
                  ? "bg-linear-to-r from-accet via-indigo-500 to-accet/50 text-black hover:shadow-[0_0_30px_#4C43DD] hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-linear-to-r from-white/10 to-white/5 text-white/30 cursor-not-allowed border border-white/10"
              }`}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />

              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
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
                ) : isSuccess ? (
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>வாக்கு பதிவானது!</span>
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
                    <span>{t("vote.castVote")}</span>
                  </>
                )}
              </span>
            </button>

            <p
              className={`text-center text-[8px] lg:text-[10px] mt-2 transition-all duration-300 ${
                selectedCandidate ? "text-accet/60" : "text-white/40"
              }`}
            >
              {isSuccess
                ? "✓ சர்வே பக்கத்திற்கு செல்கிறது..."
                : selectedCandidate
                ? `✓ ${selectedCandidate.name} ${t("vote.selectedSuffix")}`
                : t("vote.instruction")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vote;
