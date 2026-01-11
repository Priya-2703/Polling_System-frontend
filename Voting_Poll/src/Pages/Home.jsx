import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import LanguageDialog from "../Components/LanguageDialog";
import { Icon } from "@iconify/react";
import { GoLaw } from "react-icons/go";
import { MdNoEncryption } from "react-icons/md";

const Home = () => {
  const { t, i18n } = useTranslation();
  const [playClick] = useSound(scifi);
  const navigate = useNavigate();
  const [showLangDialog, setShowLangDialog] = useState(false);
  // const videoRef = useRef(null);

  const sponser = [
    {
      id: 1,
      img: "https://ik.imagekit.io/ivfldnjuy/lunailogoicon.ico?updatedAt=1759393439622",
      name: "Lunai",
    },
    {
      id: 2,
      img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767595202/search_mhz3a1.png",
      name: "Lunai",
    },
    {
      id: 3,
      img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767595262/paypoint_nnvsmr.png",
      name: "Lunai",
    },
  ];


  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current.playbackRate = 0.5; // 👈 0.5 = half speed (slow motion)
  //   }
  // }, []);

  // const handleClose = () => {
  //   setShowLangDialog(false);
  // };

  const currentLang = i18n.language;

  const isMobile = window.innerWidth <= 460;

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40  bg-black/40 backdrop-blur-xl">
        <div className="w-[90%] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
         <Link to={'/user'}>
            <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
              <div className="relative">
                <div className="w-1.5 h-1.5 md:w-3 md:h-3 bg-accet group-hover:shadow-[0_0_20px_#4C43DD] transition-all duration-500" />
                <div className="absolute -inset-1.5 border border-accet/30 group-hover:scale-125 transition-transform duration-500" />
              </div>
              <span className="font-heading text-[10px] md:text-sm tracking-widest text-white font-semibold group-hover:text-accet transition-colors duration-300 uppercase">
                {t("home.nav.brand")}
              </span>
            </div>
         </Link>

          {/* Right Side Controls */}
          <div className="flex items-center">
            {/* Language Button */}
            <button
              onClick={() => {
                playClick();
                setShowLangDialog(true);
              }}
              className="md:px-4 md:py-2 px-2 py-1.5 bg-white/5 backdrop-blur-sm border border-accet/20 text-white/80 text-[10px] md:text-[11px] font-heading tracking-widest uppercase hover:text-accet hover:border-accet/50 hover:bg-accet/10 transition-all duration-300 rounded flex items-center gap-1 md:gap-2 group"
            >
              <svg
                className="w-3 h-3 md:w-4 md:h-4 text-accet"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex justify-center items-center gap-1">
                <span className="text-[8px] lg:text-[11px]">
                  {currentLang === "en" ? "EN" : "தமிழ்"}
                </span>
                <svg
                  className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="w-full mx-auto relative z-10 min-h-dvh flex flex-col justify-center">
        <section className="w-[93%] md:w-[80%] mx-auto  pt-24 pb-20 md:pb-32">
          {/* Floating Status Badge */}
          <div className=" animate-float flex justify-center md:inline-flex items-center gap-3 border border-accet/20 bg-accet/5 backdrop-blur-md rounded-full px-4 py-2 w-fit mb-8">
            <div className="relative">
              <div className="w-1 h-1 md:w-2 md:h-2 bg-accet rounded-full animate-ping absolute" />
              <div className="w-1 h-1 md:w-2 md:h-2 bg-accet rounded-full relative" />
            </div>
            <span className=" text-[7px] md:text-[10px]  uppercase tracking-widest text-indigo-300 font-heading">
              {t("home.statusBadge")}
            </span>
          </div>

          {/* Hero Title */}
          <h1 className="font-heading text-[32px] md:text-6xl lg:text-[96px] font-bold tracking-tight text-white mb-5 md:mb-6 leading-none">
            <span className="block text-glowtext-start">
              {" "}
              {t("home.hero.title1")}
            </span>
            <span className="block text-glow text-start text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-cyan-300 to-indigo-400 animate-pulse-slow">
              {t("home.hero.title2")}
            </span>
          </h1>

          {/* Subtitle / Description */}
          <div className="relative mb-8">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-accet/50 via-accet/20 to-transparent rounded-full" />
            <p className="text-neutral-400 max-w-xl  text-[8px] md:text-base leading-relaxed pl-3 md:pl-6 font-light">
              {t("home.hero.description")}
            </p>
          </div>

          <div className="flex justify-center items-center border border-accet/40 backdrop-blur-lg px-5 py-3 md:px-10 md:py-4 w-full md:w-fit ">
            <div className=" flex justify-center items-center gap-10 md:gap-20">
              <div className="text-center">
                <div className="text-[14px] md:text-3xl font-heading font-semibold text-accet text-glow-subtle">
                  100%
                </div>
                <div className="text-[6px] md:text-xs text-white font-light uppercase tracking-wider mt-1 font-heading">
                  {t("home.features.secure")}
                </div>
              </div>
              <div className="text-center flex flex-col justify-center items-center">
                <div className="text-[19px] md:text-3xl font-heading font-bold text-accet text-glow-subtle">
                  <GoLaw className="font-bold icon-glow-subtle" />
                </div>
                <div className="text-[6px] md:text-xs text-white uppercase tracking-wider mt-1 font-heading">
                  {t("home.features.unbiased")}
                </div>
              </div>
              <div className="text-center flex flex-col justify-center items-center">
                <div className="text-[14px] md:text-3xl font-heading font-bold text-accet icon-glow-subtle">
                  <MdNoEncryption />
                </div>
                <div className="text-[6px] md:text-xs text-white uppercase tracking-wider mt-1 font-heading">
                  {t("home.features.encrypted")}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* video */}
      <div className="w-full mx-auto bg-black/30 h-[90dvh] mb-32">
        <div className="w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="w-[90%] mx-auto flex flex-col justify-start items-start">
            <h1 className="font-heading text-[32px] md:text-2xl lg:text-3xl font-bold tracking-tight text-white mb-5 md:mb-6 leading-none drop-shadow-[0px_0px_10px] drop-shadow-accet/70">
              LUNAI
            </h1>
            <p className="text-white text-[14px] font-tamil ">
              Printers in the 1500s scrambled the words from Cicero's "De
              Finibus Bonorum et Malorum'' after mixing the words in each
              sentence. The familiar "lorem ipsum dolor sit amet" text emerged
              when 16th-century printers adapted Cicero's original work,
              beginning with the phrase "dolor sit amet consectetur." They
              abbreviated "dolorem" (meaning "pain") to "lorem," which carries
              no meaning in Latin. "Ipsum" translates to "itself," and the text
              frequently includes phrases such as "consectetur adipiscing elit"
              and "ut labore et dolore." These Latin fragments, derived from
              Cicero's philosophical treatise, were rearranged to create the
              standard dummy text that has become a fundamental tool in design
              and typography across generations.
            </p>
            <div className="flex items-center gap-4 md:gap-6 mt-4 md:mt-5">
              <div className="text-start">
                <p className="text-base md:text-lg lg:text-xl font-num font-bold text-white">
                  Ra Origins
                </p>
                <p className="text-[8px] md:text-[9px] uppercase tracking-wider text-white/30 font-num">
                  Founded
                </p>
              </div>
              <div className="w-px h-6 md:h-8 bg-white/10" />
              <div className="text-end">
                <p className="text-base md:text-lg lg:text-xl font-heading font-bold text-white">
                  234
                </p>
                <p className="text-[8px] md:text-[9px] uppercase tracking-wider text-white/30 font-heading">
                  Constituencies
                </p>
              </div>
            </div>
          </div>

          <div className="h-[90dvh] bg-black flex flex-col justify-center items-center z-50 rounded-[30px] drop-shadow-[0px_0px_20px] drop-shadow-accet/30 overflow-hidden">
            <video 
            // ref={videoRef}
            autoPlay
            muted
            playsInline
            loop
            src="https://res.cloudinary.com/dfgyjzm7c/video/upload/v1768040895/Project_01-08_4__Full_HD_1080p_MEDIUM_FR30__1_lkxlve.mp4"
            ></video>
          </div>

          <div className="w-[90%] mx-auto flex flex-col justify-end items-end">
            <div className="flex items-center gap-4 md:gap-6 mb-6">
              <div className="text-start">
                <p className="text-base md:text-lg lg:text-xl font-num font-bold text-white">
                  Ra Origins
                </p>
                <p className="text-[8px] md:text-[9px] uppercase tracking-wider text-white/30 font-num">
                  Founded
                </p>
              </div>
              <div className="w-px h-6 md:h-8 bg-white/10" />
              <div className="text-end">
                <p className="text-base md:text-lg lg:text-xl font-heading font-bold text-white">
                  234
                </p>
                <p className="text-[8px] md:text-[9px] uppercase tracking-wider text-white/30 font-heading">
                  Constituencies
                </p>
              </div>
            </div>
            <p className="text-white text-end text-[14px] font-tamil mb-5">
              Printers in the 1500s scrambled the words from Cicero's "De
              Finibus Bonorum et Malorum'' after mixing the words in each
              sentence. The familiar "lorem ipsum dolor sit amet" text emerged
              when 16th-century printers adapted Cicero's original work,
              beginning with the phrase "dolor sit amet consectetur." They
              abbreviated "dolorem" (meaning "pain") to "lorem," which carries
              no meaning in Latin. "Ipsum" translates to "itself," and the text
              frequently includes phrases such as "consectetur adipiscing elit"
              and "ut labore et dolore." These Latin fragments, derived from
              Cicero's philosophical treatise, were rearranged to create the
              standard dummy text that has become a fundamental tool in design
              and typography across generations.
            </p>

            <h1 className="font-heading text-[32px] md:text-2xl lg:text-3xl font-bold tracking-tight text-white mb-5 md:mb-6 leading-none drop-shadow-[0px_0px_10px] drop-shadow-accet/70">
              LUNAI
            </h1>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-5 md:py-10">
        <div className="glass-panel p-6 md:p-16 rounded-sm border-t border-indigo-500/30 text-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 z-0 opacity-80">
            <div className="absolute top-0 left-1/4 w-px h-full bg-white/5" />
            <div className="absolute top-0 right-1/4 w-px h-full bg-white/5" />
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/5" />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <Icon
              icon="lucide:fingerprint"
              className="text-indigo-400 mb-4 md:mb-6 text-lg md:text-4xl opacity-80"
              width={isMobile ? 34 : 48}
              strokeWidth={1}
            />
            <h2 className="font-heading text-lg md:text-4xl text-white mb-2 md:mb-4 tracking-wide">
              {t("home.cta.title")}
            </h2>
            <p className="text-neutral-400 mb-5 md:mb-10 max-w-lg mx-auto text-[10px] md:text-sm">
              {t("home.cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 via-cyan-500 to-indigo-500 rounded-sm opacity-30 group-hover:opacity-100 transition duration-500 blur" />
              <button
                onClick={() => {
                  playClick();
                  navigate("/form");
                }}
                className="relative bg-white text-black font-heading font-semibold text-[9px] md:text-xs md:px-8 md:py-3 px-5 py-2 tracking-widest uppercase hover:bg-neutral-200 transition-colors z-10 flex items-center gap-2 justify-center"
              >
                {t("home.cta.startButton")} {t("home.cta.votingText")}
                <Icon icon="lucide:check-circle" width={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Bar */}
      <div className="backdrop-blur-md py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-heading text-neutral-600">
          <span>{t("home.footer.copyright")}</span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">
              {t("home.footer.protocol")}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accet rounded-full animate-pulse" />
              <span className="text-accet">{t("home.footer.status")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Dialog */}
      {showLangDialog && (
        <LanguageDialog
          isChangeMode={true}
          onLanguageSelect={() => setShowLangDialog(false)}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default Home;

