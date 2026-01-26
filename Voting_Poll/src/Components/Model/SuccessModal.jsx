// Components/Modals/SuccessModal.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdCheck, MdContentCopy, MdShare } from "react-icons/md";
import confetti from "canvas-confetti"; // Optional: npm install canvas-confetti

const SuccessModal = ({
  isOpen,
  trackerId,
  onContinue,
  language = "en",
  autoRedirect = false,
  redirectDelay = 5000,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(redirectDelay / 1000);

  const isTamil = language === "ta";

  // Confetti effect on open
  useEffect(() => {
    if (isOpen && typeof confetti === "function") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#22d3ee", "#06b6d4"],
      });
    }
  }, [isOpen]);

  // Auto redirect countdown
  useEffect(() => {
    if (!isOpen || !autoRedirect) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, autoRedirect]);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      localStorage.setItem("voter_status", "registered");
      navigate("/vote", { replace: true });
    }
  };

  const handleCopyTrackerId = async () => {
    try {
      await navigator.clipboard.writeText(trackerId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: isTamil ? "வாக்காளர் பதிவு வெற்றி" : "Voter Registration Success",
          text: isTamil
            ? `எனது Tracker ID: ${trackerId}`
            : `My Tracker ID: ${trackerId}`,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-shade border border-green-500/30 rounded-xl p-6 max-w-md w-full text-center animate-success-enter relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          {/* Success Icon */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center mx-auto mb-2 md:mb-4 animate-bounce-gentle">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <MdCheck className="text-white text-3xl md:text-4xl" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-white font-heading font-bold text-lg md:text-xl uppercase tracking-wide mb-1 md:mb-2">
            {isTamil ? "பதிவு வெற்றிகரம்!" : "Registration Successful!"}
          </h3>

          <p className="text-white/60 text-[12px] md:text-sm font-body mb-4">
            {isTamil
              ? "உங்கள் பதிவு வெற்றிகரமாக முடிந்தது"
              : "Your registration has been completed successfully"}
          </p>

          {/* Tracker ID Card */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-3 lg:mb-6">
            <p className="text-[12px] text-green-400 uppercase tracking-wide mb-2 font-heading">
              {isTamil ? "உங்கள் அடையாள ID" : "Your Access ID"}
            </p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-white font-mono text-xl lg:text-2xl font-bold tracking-wider">
                {trackerId}
              </p>
              <button
                onClick={handleCopyTrackerId}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                title="Copy Tracker ID"
              >
                {copied ? (
                  <MdCheck className="text-green-400 text-lg" />
                ) : (
                  <MdContentCopy className="text-white/60 text-lg" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-green-400 text-[10px] mt-2 animate-fade-in">
                {isTamil ? "நகலெடுக்கப்பட்டது!" : "Copied to clipboard!"}
              </p>
            )}
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-3 lg:mb-6 text-left">
            <p className="text-[10px] text-yellow-400 font-body">
              <span className="font-bold">
                {isTamil ? "முக்கியம்:" : "Important:"}
              </span>{" "}
              {isTamil
                ? "இந்த Tracker ID-ஐ பாதுகாப்பாக வைத்திருங்கள். வாக்கு நிலையை கண்காணிக்க இது தேவைப்படும்."
                : "Please save this Tracker ID securely. You'll need it to track your vote status."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-heading uppercase tracking-wide text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2"
            >
              <MdCheck className="text-lg" />
              {isTamil ? "வாக்களிக்க தொடரவும்" : "Proceed to Vote"}
            </button>

            {navigator.share && (
              <button
                onClick={handleShare}
                className="w-full py-3 bg-white/5 border border-white/20 text-white/70 font-heading uppercase tracking-widest text-sm rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <MdShare className="text-lg" />
                {isTamil ? "பகிர்" : "Share"}
              </button>
            )}
          </div>

          {/* Auto Redirect Timer */}
          {autoRedirect && countdown > 0 && (
            <p className="text-white/40 text-[10px] mt-4 font-body">
              {isTamil
                ? `${countdown} வினாடிகளில் தானாக செல்லும்...`
                : `Redirecting in ${countdown} seconds...`}
            </p>
          )}
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes success-enter {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes bounce-gentle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-success-enter {
          animation: success-enter 0.4s ease-out;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SuccessModal;