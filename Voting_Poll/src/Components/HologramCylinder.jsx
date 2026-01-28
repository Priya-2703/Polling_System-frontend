/* HologramCylinder.jsx */
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const TOTAL = 6; // sponsor count
const ANGLE_STEP = 360 / TOTAL; // deg between slides
const RADIUS =
  typeof window !== "undefined"
    ? window.innerWidth < 768
      ? 150
      : window.innerWidth < 1024
        ? 300
        : 400
    : 400;

const sponsors = [
  {
    id: 1,
    name: "Lunai",
    tag: "Future of Democracy",
    tier: "platinum",
    img: "https://ik.imagekit.io/ivfldnjuy/lunailogoicon.ico?updatedAt=1759393439622",
    site: "#",
  },
  {
    id: 2,
    name: "JIO",
    tag: "Find Everything",
    tier: "gold",
    img: "https://i.pinimg.com/736x/c7/3c/2e/c73c2e4035dd583580fc413f9fe3657e.jpg",
    site: "#",
  },
  {
    id: 3,
    name: "TVS Motor",
    tag: "Secure Payments",
    tier: "gold",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBBOOdHTxT755WVz0Tf7NBMF2Mxlh35jWzLQ&s",
    site: "#",
  },
  {
    id: 4,
    name: "HDFC",
    tag: "Ultimate Protection",
    tier: "silver",
    img: "https://i.pinimg.com/736x/cc/15/74/cc1574e6b15ed8aa8a7759c2c9220429.jpg",
    site: "#",
  },
  {
    id: 5,
    name: "Byju's",
    tag: "Data Intelligence",
    tier: "silver",
    img: "https://media.assettype.com/outlookbusiness/2023-10/5b0ac594-e0e0-48f9-9254-973231d140b1/Byjus.jpg",
    site: "#",
  },
  {
    id: 6,
    name: "TCS",
    tag: "Data Intelligence",
    tier: "silver",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfZvI2R9YWoxIPsw4EihsX3EjhijgfyJk0ZA&s",
    site: "#",
  },
];

const tierGlow = {
  platinum: "shadow-[0_0_10px_#eab308]",
  gold: "shadow-[0_0_15px_#4c43dd]",
  silver: "shadow-[0_0_15px_#9ca3af]",
};

export default function HologramCylinder() {
  const { t } = useTranslation();
  const cylinder = useRef(null);
  const [rotation, setRotation] = useState(0); // 0-360
  const [drag, setDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [hoverId, setHoverId] = useState(null);

  /* --------- auto-rotate --------- */
  useEffect(() => {
    if (drag) return;
    let raf;
    const spin = () => {
      setRotation((r) => (r + 0.2) % 360); // ← speed here
      raf = requestAnimationFrame(spin);
    };
    raf = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(raf);
  }, [drag]);

  /* --------- drag handlers --------- */
  const onMouseDown = (e) => {
    setDrag(true);
    setStartX(e.clientX);
  };
  const onMouseUp = () => setDrag(false);
  const onMouseMove = (e) => {
    if (!drag) return;
    // throttle inside RAF
    requestAnimationFrame(() => {
      const delta = e.clientX - startX;
      setRotation((r) => (r + delta * 0.2) % 360);
      setStartX(e.clientX);
    });
  };

  return (
    <div
      className="relative w-full mx-auto py-10 md:py-16 lg:py-28 px-4 overflow-hidden isolate"
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {/* ambient bg */}
      {/* <div
        className="absolute inset-0 opacity-[0.03] bg-size-[60px_60px]"
        style={{
          backgroundImage:
            "linear-gradient(#4c43dd 1px,transparent 1px),linear-gradient(90deg,#4c43dd 1px,transparent 1px)",
        }}
      /> */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-30 h-30  md:w-175 md:h-175 bg-accet/10 rounded-full blur-[160px]" />

      {/* header */}
      <div className="relative z-10 text-center mb-2 md:mb-20">
        <div className="inline-flex items-center gap-2 border border-accet/30 bg-accet/10 rounded-full px-4 py-1 md:py-2 mb-2 md:mb-5 animate-pulse">
          <span className="w-2 h-2 bg-accet rounded-full" />
          <span className="text-[6px] md:text-xs uppercase tracking-widest text-accet font-heading">
            {t("home.sponser.badge")}
          </span>
        </div>
        <h2 className="font-heading text-2xl md:text-5xl font-bold text-white drop-shadow-[0px_0px_10px_rgba(0,243,255,0.4)]">
          <span className="text-accet uppercase">
             {t("home.sponser.title")}
          </span>
        </h2>
        <p className="text-neutral-400 text-[10px] lg:text-sm mt-1 md:mt-2 capitalize">
          {t("home.sponser.para")}
        </p>
      </div>

      {/* 3-D cylinder */}
      <div
        className="w-full mx-auto relative h-45 md:h-65 flex items-center justify-center z-10"
        style={{ perspective: "1200px" }}
      >
        <div
          ref={cylinder}
          className="relative w-full mx-auto h-full will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotation}deg)`,
          }}
          onMouseDown={onMouseDown}
        >
          {sponsors.map((s, i) => {
            const angle = i * ANGLE_STEP;
            const isActive = hoverId === s.id;
            return (
              <a
                key={s.id}
                href={s.site}
                target="_blank"
                rel="noreferrer"
                className={`flex flex-col justify-center items-center absolute w-37.5 md:w-70 h-20 md:h-45 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 md:p-8 bg-black/80 md:bg-linear-to-b from-accet/20 to-black/20 border border-white/10 backdrop-blur-[10px] transition-all duration-500 overflow-hidden ${isActive ? `shadow-[0_0_10px_#00F3FF] scale-105` : ""}`}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                  clipPath: "inset(0px round 12px)",
                  WebkitClipPath: "inset(0px round 12px)",
                }}
                onMouseEnter={() => setHoverId(s.id)}
                onMouseLeave={() => setHoverId(null)}
              >
                {/* hologram shine */}
                <div
                  className={`absolute inset-0 rounded-xl overflow-hidden pointer-events-none
                  ${isActive ? "opacity-100" : "opacity-0"}`}
                >
                  <div className="absolute -inset-full bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
                  
                </div>

                {/* logo */}
                <div className="relative">
                  <img
                    src={s.img}
                    alt={s.name}
                    className={`w-32 h-10 md:w-40 md:h-24 object-contain mx-auto
                    transition-all duration-500 z-20
                    ${isActive ? "filter-none scale-110" : "brightness-150"}`}
                  />
                  <div
                    className={`absolute -inset-4 rounded-full blur-2xl transition-opacity duration-500 z-0
                    ${isActive ? "opacity-40" : "opacity-0"} ${s.tier === "platinum" ? "bg-accet" : "bg-accet"}`}
                  />
                </div>

                {/* text */}
                <div className="text-center hidden lg:block">
                  <h3 className="text-white font-heading uppercase tracking-wider text-[10px] md:text-xl font-bold">
                    {s.name}
                  </h3>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes shimmer{
          0%   {transform:translateX(-100%) skewX(-12deg);}
          100% {transform:translateX(200%) skewX(-12deg);}
        }
        .animate-shimmer{animation:shimmer 2s infinite;}
      `}</style>
    </div>
  );
}
