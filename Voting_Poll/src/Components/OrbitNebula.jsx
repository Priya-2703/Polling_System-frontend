/* OrbitNebula.jsx */
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const TOTAL = 5;
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
    name: "SearchX",
    tag: "Find Everything",
    tier: "gold",
    img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767595202/search_mhz3a1.png",
    site: "#",
  },
  {
    id: 3,
    name: "PayPoint",
    tag: "Secure Payments",
    tier: "gold",
    img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767595262/paypoint_nnvsmr.png",
    site: "#",
  },
  {
    id: 4,
    name: "CyberShield",
    tag: "Ultimate Protection",
    tier: "silver",
    img: "https://ik.imagekit.io/ivfldnjuy/lunailogoicon.ico?updatedAt=1759393439622",
    site: "#",
  },
  {
    id: 5,
    name: "DataNova",
    tag: "Data Intelligence",
    tier: "silver",
    img: "https://ik.imagekit.io/ivfldnjuy/lunailogoicon.ico?updatedAt=1759393439622",
    site: "#",
  },
];

const tierColour = { platinum: "#eab308", gold: "#4c43dd", silver: "#9ca3af" };

export default function OrbitNebula() {
  const { t } = useTranslation();
  const canvas = useRef(null);
  const sectionRef = useRef(null);
  const [hoverId, setHoverId] = useState(null);
  const [universe, setUniverse] = useState({ x: 0, y: 0, z: 1200 });
  const [isVisible, setIsVisible] = useState(false);
  const drag = useRef(false),
    last = useRef({ x: 0, y: 0 });

  /* ---------- viewport observer ---------- */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* ---------- canvas stars ---------- */
  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    let w = (canvas.current.width = window.innerWidth);
    let h = (canvas.current.height = window.innerHeight);
    const stars = Array.from({ length: 600 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2,
      s: Math.random() * 0.3,
    }));
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach((s) => {
        s.y += s.s;
        if (s.y > h) {
          s.y = 0;
          s.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(76,67,221,0.6)";
        ctx.fill();
      });
      requestAnimationFrame(loop);
    };
    loop();
    const resize = () => {
      w = canvas.current.width = window.innerWidth;
      h = canvas.current.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ---------- auto rotation + cursor follow ---------- */
  useEffect(() => {
    if (!isVisible) return;
    let frame;
    const animate = () => {
      setUniverse((u) => ({ ...u, x: u.x + 0.1 }));
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [isVisible]);

  /* ---------- drag ---------- */
  const down = (e) => {
    drag.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };
  const up = () => {
    drag.current = false;
  };
  const move = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    setUniverse((u) => ({ ...u, x: u.x + dx * 0.5, y: u.y + dy * 0.5 }));
    last.current = { x: e.clientX, y: e.clientY };
  };

  /* ---------- planet calc ---------- */
  const angle = (i) => ((i * 360) / TOTAL + universe.x) % 360;
  const pos = (i) => {
    const a = (angle(i) * Math.PI) / 180;
    const radius = Math.min(500, universe.z * 0.4);
    const x = Math.cos(a) * radius;
    const z = Math.sin(a) * radius;
    const scale = (z + universe.z) / (universe.z * 2);
    return {
      x,
      y: universe.y * 0.1,
      scale,
      zIndex: Math.round((z + universe.z) * 10),
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden select-none"
      onMouseDown={down}
      onMouseUp={up}
      onMouseMove={move}
    >
      <canvas ref={canvas} className="absolute inset-0 pointer-events-none" />

      {/* header */}
      <div className="relative z-20 text-center pt-12 md:pt-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 border border-accet/30 bg-accet/10 rounded-full px-4 py-2 mb-5 animate-pulse">
          <span className="w-2 h-2 bg-accet rounded-full" />
          <span className="text-[10px] md:text-xs uppercase tracking-widest text-accet font-heading">
            Powered by Innovation
          </span>
        </div>
        <h2 className="font-heading text-4xl md:text-6xl font-bold text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accet to-white">
            Our Sponsors
          </span>
        </h2>
        <p className="text-neutral-400 text-sm mt-3">
          இந்த தளம் இயங்குவது இவர்களின் ஆதரவால் மட்டுமே
        </p>
      </div>

      {/* planets */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        {sponsors.map((s, i) => {
          const p = pos(i);
          const active = hoverId === s.id;
          return (
            <a
              key={s.id}
              href={s.site}
              target="_blank"
              rel="noreferrer"
              className={`absolute rounded-full backdrop-blur-xl bg-gradient-to-b from-white/8 to-white/1 border border-white/10 transition-all duration-500 ease-out ${active ? "scale-125" : "scale-100"}`}
              style={{
                transform: `translate3d(${p.x}px, ${p.y}px, 0) scale(${p.scale})`,
                zIndex: p.zIndex,
                width: active ? "240px" : "200px",
                height: active ? "240px" : "200px",
              }}
              onMouseEnter={() => setHoverId(s.id)}
              onMouseLeave={() => setHoverId(null)}
            >
              {/* glow */}
              <div
                className={`absolute -inset-4 rounded-full blur-xl transition-opacity duration-500 ${active ? "opacity-60" : "opacity-20"} ${s.tier === "platinum" ? "bg-yellow-400" : s.tier === "gold" ? "bg-accet" : "bg-gray-400"}`}
              />
              {/* logo */}
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={s.img}
                  alt={s.name}
                  className={`w-20 h-20 md:w-24 md:h-24 object-contain transition-all duration-500 ${active ? "filter-none scale-110" : "grayscale brightness-150"}`}
                />
              </div>
              {/* text */}
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 text-center">
                <h3 className="text-white font-heading font-bold">{s.name}</h3>
                <p className="text-neutral-300 text-xs">{s.tag}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
