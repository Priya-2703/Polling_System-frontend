/* GlassMuseum.jsx */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const sponsors = [
  { id:1, name:'Lunai',      tag:'Future of Democracy',  tier:'platinum', img:'https://ik.imagekit.io/ivfldnjuy/lunailogoicon.ico?updatedAt=1759393439622', site:'#' },
  { id:2, name:'SearchX',    tag:'Find Everything',      tier:'gold',     img:'https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767595202/search_mhz3a1.png', site:'#' },
  { id:3, name:'PayPoint',   tag:'Secure Payments',      tier:'gold',     img:'https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767595262/paypoint_nnvsmr.png', site:'#' },
  { id:4, name:'CyberShield',tag:'Ultimate Protection',  tier:'silver',   img:'https://ik.imagekit.io/ivfldnjuy/lunailogoicon.ico?updatedAt=1759393439622', site:'#' },
  { id:5, name:'DataNova',   tag:'Data Intelligence',    tier:'silver',   img:'https://ik.imagekit.io/ivfldnjuy/lunailogoicon.ico?updatedAt=1759393439622', site:'#' },
];

const tierStyle = {
  platinum:{ glow:'shadow-[0_0_20px_#eab308]', badge:'bg-gradient-to-r from-yellow-500 to-amber-600' },
  gold:    { glow:'shadow-[0_0_20px_#4c43dd]', badge:'bg-gradient-to-r from-indigo-500 to-purple-600' },
  silver:  { glow:'shadow-[0_0_16px_#9ca3af]', badge:'bg-gradient-to-r from-gray-500 to-gray-700' },
};

export default function GlassMuseum() {
  const {t} = useTranslation();
  const [hoverId, setHoverId] = useState(null);

  /* broken-grid placement (museum-style) */
  const layout = [
    { idx:0, left:'8%',  top:'12%', rotate:'-3deg',  z:30 },
    { idx:1, left:'28%', top:'4%',  rotate:'2deg',   z:40 },
    { idx:2, left:'52%', top:'18%', rotate:'-1deg',  z:35 },
    { idx:3, left:'72%', top:'6%',  rotate:'4deg',   z:38 },
    { idx:4, left:'42%', top:'48%', rotate:'-2deg',  z:32 },
  ];

  return (
    <section className="relative w-full py-24 md:py-32 bg-transparent overflow-hidden">

      {/* subtle floor reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accet/20 to-transparent"/>

      {/* header */}
      <div className="text-center mb-16 md:mb-24">
        <div className="inline-flex items-center gap-2 border border-accet/30 bg-accet/10 rounded-full px-4 py-2 mb-5">
          <span className="w-2 h-2 bg-accet rounded-full"/>
          <span className="text-[10px] md:text-xs uppercase tracking-widest text-accet font-heading">Powered by Innovation</span>
        </div>
        <h2 className="font-heading text-4xl md:text-6xl font-bold text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accet to-white">Our Sponsors</span>
        </h2>
        <p className="text-neutral-400 text-sm mt-3">இந்த தளம் இயங்குவது இவர்களின் ஆதரவால் மட்டுமே</p>
      </div>

      {/* museum wall */}
      <div className="relative w-full h-[460px] md:h-[520px]">
        {layout.map(({idx,left,top,rotate,z})=>{
          const s = sponsors[idx];
          const t = tierStyle[s.tier];
          const active = hoverId === s.id;
          return(
            <a key={s.id} href={s.site} target="_blank" rel="noreferrer"
               className={`absolute group
                          w-56 md:w-64 h-36 md:h-40
                          rounded-2xl
                          bg-gradient-to-b from-white/10 to-white/5
                          border border-white/10
                          backdrop-blur-md
                          transition-all duration-300 ease-out
                          ${active ? '-translate-y-2 ' + t.glow : 'hover:-translate-y-1 hover:shadow-xl'}`}
               style={{left,top,transform:`rotate(${rotate}) translateZ(${z}px)`, zIndex:active?50:40-idx}}
               onMouseEnter={()=>setHoverId(s.id)}
               onMouseLeave={()=>setHoverId(null)}>

              {/* edge light */}
              <div className={`absolute -inset-px rounded-2xl border-2 ${active?'border-accet':'border-transparent'} transition-colors duration-300`}/>

              {/* content */}
              <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
                <img src={s.img} alt={s.name} className={`w-14 h-14 md:w-16 md:h-16 object-contain mb-3
                                                          transition-all duration-300
                                                          ${active?'filter-none scale-110':'grayscale brightness-125'}`}/>
                <h3 className="text-white font-heading font-bold text-base md:text-lg">{s.name}</h3>
                <p className="text-neutral-300 text-xs mt-1">{s.tag}</p>
                <span className={`mt-3 px-3 py-1 rounded-full text-[9px] md:text-[11px] uppercase tracking-wider font-heading text-white ${t.badge}`}>
                  {s.tier}
                </span>
              </div>

              {/* micro CTA */}
              <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-accet text-[10px] font-heading uppercase tracking-wider
                              transition-all duration-200
                              ${active?'opacity-100':'opacity-0 group-hover:opacity-70'}`}>
                Visit →
              </div>
            </a>
          );
        })}
      </div>

      {/* bottom CTA */}
      <div className="text-center mt-20 md:mt-28">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl border border-accet/20 bg-accet/10 backdrop-blur-sm">
          <div className="text-center sm:text-left">
            <p className="text-white font-heading">Become a Sponsor</p>
            <p className="text-neutral-400 text-xs">Join our mission to revolutionize digital democracy</p>
          </div>
          <button className="px-5 py-2 bg-accet/20 border border-accet/50 rounded-lg text-accet text-xs font-heading uppercase tracking-wider hover:bg-accet hover:text-black transition-all">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}