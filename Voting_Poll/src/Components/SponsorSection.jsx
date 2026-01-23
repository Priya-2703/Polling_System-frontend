import { useState } from "react";
import { useTranslation } from "react-i18next";

const SponsorSection = () => {
  const { t } = useTranslation();
  const [hoveredId, setHoveredId] = useState(null);

  const sponsors = [
    {
      id: 1,
      img: "https://ik.imagekit.io/ivfldnjuy/lunailogoicon.ico?updatedAt=1759393439622",
      name: "Lunai",
      tagline: "Future of Democracy",
      tier: "platinum",
      description: "Leading the revolution in secure digital voting systems",
    },
    {
      id: 2,
      img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767595202/search_mhz3a1.png",
      name: "SearchX",
      tagline: "Find Everything",
      tier: "gold",
      description: "AI-powered search solutions for the modern world",
    },
    {
      id: 3,
      img: "https://res.cloudinary.com/dfgyjzm7c/image/upload/v1767595262/paypoint_nnvsmr.png",
      name: "PayPoint",
      tagline: "Secure Payments",
      tier: "gold",
      description: "Blockchain-based payment infrastructure",
    },
    {
      id: 4,
      img: "https://ik.imagekit.io/ivfldnjuy/lunailogoicon.ico?updatedAt=1759393439622",
      name: "CyberShield",
      tagline: "Ultimate Protection",
      tier: "silver",
      description: "Enterprise-grade cybersecurity solutions",
    },
    {
      id: 5,
      img: "https://ik.imagekit.io/ivfldnjuy/lunailogoicon.ico?updatedAt=1759393439622",
      name: "DataNova",
      tagline: "Data Intelligence",
      tier: "silver",
      description: "Transform data into actionable insights",
    },
  ];

  const getTierStyles = (tier) => {
    switch (tier) {
      case "platinum":
        return {
          border: "border-yellow-500/50",
          glow: "shadow-[0_0_30px_rgba(234,179,8,0.3)]",
          badge: "bg-gradient-to-r from-yellow-500 to-amber-600",
          text: "text-yellow-400",
        };
      case "gold":
        return {
          border: "border-accet/50",
          glow: "shadow-[0_0_25px_rgba(76,67,221,0.3)]",
          badge: "bg-gradient-to-r from-accet to-purple-600",
          text: "text-accet",
        };
      case "silver":
        return {
          border: "border-white/20",
          glow: "shadow-[0_0_20px_rgba(255,255,255,0.1)]",
          badge: "bg-gradient-to-r from-gray-400 to-gray-600",
          text: "text-gray-400",
        };
      default:
        return {
          border: "border-white/10",
          glow: "",
          badge: "bg-gray-600",
          text: "text-gray-400",
        };
    }
  };

  return (
    <section className="w-full py-16 md:py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(76,67,221,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(76,67,221,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial gradient overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accet/5 rounded-full blur-[150px]" />
      </div>

      <div className="w-[90%] max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 md:gap-3 border border-accet/30 bg-accet/5 backdrop-blur-md rounded-full px-4 py-2 mb-6 animate-pulse">
            <div className="relative">
              <div className="w-2 h-2 bg-accet rounded-full animate-ping absolute" />
              <div className="w-2 h-2 bg-accet rounded-full relative" />
            </div>
            <span className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] text-accet font-heading">
              Powered By Innovation
            </span>
          </div>

          <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accet to-white">
              Our Sponsors
            </span>
          </h2>
          
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto">
            இந்த தளம் இயங்குவது இவர்களின் ஆதரவால் மட்டுமே
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-accet/50" />
            <div className="w-2 h-2 bg-accet rotate-45" />
            <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-accet/50" />
          </div>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {sponsors.map((sponsor, index) => {
            const styles = getTierStyles(sponsor.tier);
            const isHovered = hoveredId === sponsor.id;

            return (
              <div
                key={sponsor.id}
                className={`
                  relative group cursor-pointer
                  ${index === 0 ? 'col-span-2 md:col-span-1' : ''}
                `}
                onMouseEnter={() => setHoveredId(sponsor.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card */}
                <div
                  className={`
                    relative h-full p-5 md:p-6 rounded-2xl backdrop-blur-sm
                    bg-gradient-to-b from-white/[0.08] to-white/[0.02]
                    border ${styles.border}
                    transition-all duration-500 ease-out
                    ${isHovered ? `${styles.glow} scale-[1.02] -translate-y-2` : ''}
                  `}
                >
                  {/* Corner Decorations */}
                  <div className={`absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 ${styles.border} rounded-tl-lg transition-all duration-300 ${isHovered ? 'w-6 h-6' : ''}`} />
                  <div className={`absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 ${styles.border} rounded-tr-lg transition-all duration-300 ${isHovered ? 'w-6 h-6' : ''}`} />
                  <div className={`absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 ${styles.border} rounded-bl-lg transition-all duration-300 ${isHovered ? 'w-6 h-6' : ''}`} />
                  <div className={`absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 ${styles.border} rounded-br-lg transition-all duration-300 ${isHovered ? 'w-6 h-6' : ''}`} />

                  {/* Tier Badge */}
                  {sponsor.tier === 'platinum' && (
                    <div className="absolute -top-2 -right-2 text-xl">👑</div>
                  )}
                  {sponsor.tier === 'gold' && (
                    <div className="absolute -top-2 -right-2 text-lg">⭐</div>
                  )}

                  {/* Logo Container */}
                  <div className="relative mb-4 flex justify-center">
                    <div
                      className={`
                        w-14 h-14 md:w-16 md:h-16 rounded-xl
                        bg-gradient-to-br from-white/10 to-white/5
                        flex items-center justify-center
                        transition-all duration-500
                        ${isHovered ? 'scale-110 rotate-3' : ''}
                      `}
                    >
                      <img
                        src={sponsor.img}
                        alt={sponsor.name}
                        className={`
                          w-10 h-10 md:w-12 md:h-12 object-contain
                          transition-all duration-500
                          ${isHovered ? 'filter-none' : 'grayscale brightness-150'}
                        `}
                      />
                    </div>
                    
                    {/* Glow effect behind logo */}
                    <div
                      className={`
                        absolute inset-0 rounded-xl blur-xl
                        bg-accet/20 transition-opacity duration-500
                        ${isHovered ? 'opacity-100' : 'opacity-0'}
                      `}
                    />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="font-heading text-sm md:text-base font-bold text-white mb-1 tracking-wide">
                      {sponsor.name}
                    </h3>
                    <p className={`text-[10px] md:text-xs ${styles.text} font-medium mb-2`}>
                      {sponsor.tagline}
                    </p>
                    
                    {/* Tier Label */}
                    <span
                      className={`
                        inline-block px-2 py-0.5 rounded-full
                        text-[8px] md:text-[10px] font-heading uppercase tracking-wider
                        ${styles.badge} text-white
                      `}
                    >
                      {sponsor.tier}
                    </span>

                    {/* Description - shows on hover */}
                    <div
                      className={`
                        mt-3 overflow-hidden transition-all duration-500
                        ${isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}
                      `}
                    >
                      <p className="text-[9px] md:text-[11px] text-neutral-400 leading-relaxed">
                        {sponsor.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover shine effect */}
                  <div
                    className={`
                      absolute inset-0 rounded-2xl overflow-hidden pointer-events-none
                      ${isHovered ? 'opacity-100' : 'opacity-0'}
                    `}
                  >
                    <div
                      className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer"
                    />
                  </div>
                </div>

                {/* Visit link - appears on hover */}
                <div
                  className={`
                    absolute -bottom-3 left-1/2 -translate-x-1/2
                    transition-all duration-300
                    ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
                  `}
                >
                  <a
                    href="#"
                    className="px-4 py-1.5 bg-accet/90 backdrop-blur-sm rounded-full text-[9px] md:text-[10px] font-heading text-white hover:bg-accet transition-colors whitespace-nowrap"
                  >
                    Visit Website →
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl border border-accet/20 bg-accet/5 backdrop-blur-sm">
            <div className="text-center sm:text-left">
              <p className="text-white font-heading text-sm md:text-base mb-1">
                Become a Sponsor
              </p>
              <p className="text-neutral-400 text-[10px] md:text-xs">
                Join our mission to revolutionize digital democracy
              </p>
            </div>
            <button className="px-6 py-2.5 bg-accet/20 border border-accet/50 rounded-lg text-accet text-[10px] md:text-xs font-heading uppercase tracking-wider hover:bg-accet hover:text-black transition-all duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Add this to your global CSS or style tag */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default SponsorSection;
