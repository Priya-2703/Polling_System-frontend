import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const questions = [
  {
    id: 1,
    question: "What is the purpose of voting for the party you choose?",
    questionTamil: "நீங்கள் தேர்ந்தெடுத்த கட்சிக்கு வாக்களிப்பதன் நோக்கம் என்ன?",
    options: [
      { id: "a", text: "Trust in the leader", tamil: "பொருளாதாரம் & வேலைவாய்ப்பு", icon: "💼" },
      { id: "b", text: "Party Idealogy", tamil: "கல்வி", icon: "📚" },
      { id: "c", text: "Past performance", tamil: "சுகாதாரம்", icon: "🏥" },
      { id: "d", text: "To form a new government", tamil: "உள்கட்டமைப்பு", icon: "🏗️" },
      { id: "e", text: "walfare / free scheme", tamil: "உள்கட்டமைப்பு", icon: "🏗️" },
    ],
  },
  {
    id: 2,
    question: "How do you prefer government communication?",
    questionTamil: "அரசு தொடர்பு எப்படி இருக்க வேண்டும்?",
    options: [
      { id: "a", text: "Social Media", tamil: "சமூக ஊடகங்கள்", icon: "📱" },
      { id: "b", text: "Television", tamil: "தொலைக்காட்சி", icon: "📺" },
      { id: "c", text: "Newspapers", tamil: "செய்தித்தாள்கள்", icon: "📰" },
      { id: "d", text: "Public Meetings", tamil: "பொதுக்கூட்டங்கள்", icon: "🎤" },
    ],
  },
  {
    id: 3,
    question: "What age group do you belong to?",
    questionTamil: "உங்கள் வயது பிரிவு எது?",
    options: [
      { id: "a", text: "18 - 25", tamil: "18 - 25", icon: "🧑" },
      { id: "b", text: "26 - 35", tamil: "26 - 35", icon: "👨" },
      { id: "c", text: "36 - 50", tamil: "36 - 50", icon: "👨‍💼" },
      { id: "d", text: "50+", tamil: "50+", icon: "👴" },
    ],
  },
  {
    id: 4,
    question: "Which sector needs immediate attention?",
    questionTamil: "எந்த துறைக்கு உடனடி கவனம் தேவை?",
    options: [
      { id: "a", text: "Agriculture", tamil: "விவசாயம்", icon: "🌾" },
      { id: "b", text: "Technology", tamil: "தொழில்நுட்பம்", icon: "💻" },
      { id: "c", text: "Manufacturing", tamil: "உற்பத்தி", icon: "🏭" },
      { id: "d", text: "Services", tamil: "சேவைகள்", icon: "🛎️" },
    ],
  },
  {
    id: 5,
    question: "How often do you vote in elections?",
    questionTamil: "நீங்கள் எவ்வளவு அடிக்கடி வாக்களிப்பீர்கள்?",
    options: [
      { id: "a", text: "Every Election", tamil: "ஒவ்வொரு தேர்தலிலும்", icon: "✅" },
      { id: "b", text: "Most Elections", tamil: "பெரும்பாலான தேர்தல்களில்", icon: "📊" },
      { id: "c", text: "Sometimes", tamil: "சில நேரங்களில்", icon: "🔄" },
      { id: "d", text: "First Time Voter", tamil: "முதல் முறை வாக்காளர்", icon: "🌟" },
    ],
  },
];

const QnA = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCandidate = location.state?.candidate;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if no candidate selected
  useEffect(() => {
    if (!selectedCandidate) {
      navigate("/vote", { replace: true });
    }
  }, [selectedCandidate, navigate]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  const handleOptionSelect = (optionId) => {
    if (isAnimating) return;
    setSelectedOption(optionId);
    setShowError(false);
  };

  const handleNext = () => {
    // Validate - Must select an option
    if (!selectedOption) {
      setShowError(true);
      return;
    }
    
    if (isAnimating) return;

    setIsAnimating(true);
    setAnswers((prev) => ({
      ...prev,
      [question.id]: selectedOption,
    }));

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption(answers[questions[currentQuestion + 1]?.id] || null);
      } else {
        setIsCompleted(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      setIsAnimating(false);
      setShowError(false);
    }, 400);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0 && !isAnimating) {
      setIsAnimating(true);
      setShowError(false);
      setTimeout(() => {
        setCurrentQuestion((prev) => prev - 1);
        setSelectedOption(answers[questions[currentQuestion - 1].id] || null);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const finalData = {
      candidate: selectedCandidate,
      answers: answers,
      submittedAt: new Date().toISOString(),
    };

    console.log("Final Vote Data:", finalData);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success or home page
      // navigate("/success", { state: { data: finalData } });
      alert(`Vote submitted successfully for ${selectedCandidate.name}!`);
      navigate("/vote", { replace: true });
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state if no candidate
  if (!selectedCandidate) {
    return (
      <div className="min-h-[100dvh] h-[100dvh] bg-black flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-accet mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-white/50">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Completion Screen
//   if (isCompleted) {
//     return (
//       <div className="min-h-[100dvh] h-[100dvh] bg-black relative overflow-hidden flex items-center justify-center">
//         {/* Background Effects */}
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute top-20 -left-32 w-96 h-96 bg-accet/20 rounded-full blur-[120px] animate-pulse" />
//           <div className="absolute bottom-20 -right-32 w-96 h-96 bg-[#017474]/20 rounded-full blur-[120px] animate-pulse" />
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accet/10 rounded-full blur-[150px]" />
//         </div>

//         {/* Confetti Effect */}
//         {showConfetti && (
//           <div className="absolute inset-0 pointer-events-none overflow-hidden">
//             {[...Array(50)].map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute w-2 h-2 animate-confetti"
//                 style={{
//                   left: `${Math.random() * 100}%`,
//                   top: `-5%`,
//                   backgroundColor: ['#00ffc8', '#017474', '#00d4aa', '#ffffff'][Math.floor(Math.random() * 4)],
//                   animationDelay: `${Math.random() * 2}s`,
//                   animationDuration: `${2 + Math.random() * 2}s`,
//                   transform: `rotate(${Math.random() * 360}deg)`,
//                 }}
//               />
//             ))}
//           </div>
//         )}

//         {/* Completion Card */}
//         <div className="relative z-10 w-[90%] max-w-md mx-auto px-4">
//           <div className="absolute -inset-1 bg-gradient-to-r from-accet via-[#017474] to-accet rounded-3xl blur-lg opacity-50 animate-pulse" />
          
//           <div className="relative bg-gradient-to-b from-accet/10 via-black/90 to-black/95 border-2 border-accet/50 rounded-3xl p-6 sm:p-8 text-center">
//             {/* Success Icon */}
//             <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6">
//               <div className="absolute inset-0 bg-accet/30 rounded-full blur-xl animate-pulse" />
//               <div className="relative w-full h-full bg-gradient-to-br from-accet to-[#017474] rounded-full flex items-center justify-center">
//                 <svg className="w-10 h-10 sm:w-12 sm:h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <div className="absolute -inset-2 border-2 border-accet/30 rounded-full animate-ping" />
//               <div className="absolute -inset-4 border border-accet/20 rounded-full animate-pulse" />
//             </div>

//             <h1 className="text-[24px] sm:text-[28px] font-heading uppercase font-black tracking-wider text-transparent bg-gradient-to-r from-accet via-[#00ffcc] to-[#017474] bg-clip-text mb-2">
//               Survey Complete!
//             </h1>
//             <h2 className="text-[14px] sm:text-[16px] font-tamil font-bold text-transparent bg-gradient-to-r from-[#017474] to-accet bg-clip-text mb-4">
//               கருத்துக்கணிப்பு முடிந்தது!
//             </h2>

//             <p className="text-white/60 text-xs sm:text-sm mb-6">
//               Thank you for completing the survey. Click submit to confirm your vote.
//             </p>

//             {/* Candidate Info */}
//             <div className="bg-white/5 rounded-xl p-4 mb-6 border border-accet/20">
//               <p className="text-white/40 text-xs mb-2">Your vote for</p>
//               <div className="flex items-center justify-center gap-3">
//                 <img 
//                   src={selectedCandidate.party_logo} 
//                   alt={selectedCandidate.party}
//                   className="w-12 h-12 rounded-full border-2 border-accet/40 object-cover"
//                 />
//                 <div className="text-left">
//                   <h3 className="text-accet font-heading font-bold text-lg uppercase tracking-wide">
//                     {selectedCandidate.name}
//                   </h3>
//                   <p className="text-white/50 text-xs">{selectedCandidate.party} | {selectedCandidate.tamil_party}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Summary */}
//             <div className="flex justify-center gap-4 mb-6">
//               <div className="bg-accet/10 rounded-lg px-4 py-2 border border-accet/30">
//                 <p className="text-accet font-bold text-xl">{questions.length}</p>
//                 <p className="text-white/40 text-xs">Questions</p>
//               </div>
//               <div className="bg-accet/10 rounded-lg px-4 py-2 border border-accet/30">
//                 <p className="text-accet font-bold text-xl">{Object.keys(answers).length}</p>
//                 <p className="text-white/40 text-xs">Answered</p>
//               </div>
//             </div>

//             <button
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//               className="w-full py-3 rounded-xl uppercase font-black tracking-widest text-[13px] font-heading bg-gradient-to-r from-accet via-[#00d4aa] to-[#017474] text-black hover:shadow-[0_0_40px_rgba(0,255,200,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <span className="flex items-center justify-center gap-2">
//                 {isSubmitting ? (
//                   <>
//                     <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     <span>Submitting...</span>
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                     <span>Confirm & Submit Vote</span>
//                   </>
//                 )}
//               </span>
//             </button>
//           </div>
//         </div>

//         <style>{`
//           @keyframes confetti {
//             0% {
//               transform: translateY(0) rotate(0deg);
//               opacity: 1;
//             }
//             100% {
//               transform: translateY(100vh) rotate(720deg);
//               opacity: 0;
//             }
//           }
//           .animate-confetti {
//             animation: confetti 3s ease-out forwards;
//           }
//         `}</style>
//       </div>
//     );
//   }

  // Question Screen
  return (
    <div className="min-h-dvh bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-accet/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-[#017474]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-accet/5 rounded-full blur-[150px]" />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 200, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0, 255, 200, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="h-full w-full relative z-10 flex flex-col">
        <div className="flex-1 flex flex-col py-4 px-4 min-h-0">
          
          {/* Header with Candidate Info */}
          <div className="shrink-0 mb-4">
            {/* Candidate Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <img 
                src={selectedCandidate.party_logo} 
                alt={selectedCandidate.party}
                className="w-8 h-8 rounded-full border border-accet/40 object-cover"
              />
              <div className="bg-accet/10 border border-accet/30 rounded-full px-3 py-1">
                <span className="text-accet text-xs font-medium">
                  Voting for: <span className="font-bold">{selectedCandidate.name}</span>
                </span>
              </div>
            </div>

            {/* Progress Section */}
            <div className="relative max-w-md mx-auto">
              {/* Step Indicators */}
              <div className="flex justify-between items-center mb-2 px-1">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center justify-center transition-all duration-500 ${
                      index <= currentQuestion ? 'scale-100' : 'scale-75 opacity-50'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-500 ${
                        index < currentQuestion
                          ? 'bg-gradient-to-br from-accet to-[#017474] text-black'
                          : index === currentQuestion
                          ? 'bg-accet/20 border-2 border-accet text-accet'
                          : 'bg-white/5 border border-white/20 text-white/30'
                      }`}
                    >
                      {index < currentQuestion ? (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index === currentQuestion && (
                      <div className="absolute inset-0 bg-accet/30 rounded-full animate-ping" />
                    )}
                  </div>
                ))}
              </div>

              {/* Progress Line */}
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accet via-[#00d4aa] to-[#017474] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Question Counter */}
              <div className="flex justify-between items-center mt-2 text-[10px]">
                <span className="text-white/40">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="flex-1 min-h-0 flex flex-col justify-center">
            <div
              className={`transition-all duration-400 max-w-lg mx-auto w-full ${
                isAnimating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
              }`}
            >
              {/* Question */}
              <div className="text-center mb-5">
                {/* <div className="inline-flex items-center gap-2 bg-accet/10 border border-accet/30 rounded-full px-3 py-1 mb-3">
                  <span className="text-accet text-sm">❓</span>
                  <span className="text-accet/80 text-[10px] font-medium uppercase tracking-wider">
                    Survey Question
                  </span>
                </div> */}
                
                <h2 className="text-[12px] font-tamil  text-white  mb-1">
                 {question.questionTamil} 
                </h2>
                <p className="text-[14px] font-heading font-bold leading-tight text-accet/70">
                  {question.question}
                </p>
              </div>

              {/* Error Message */}
              {showError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-center animate-shake">
                  <p className="text-red-400 text-sm font-medium flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Please select an option to continue
                  </p>
                </div>
              )}

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((option, index) => {
                  const isSelected = selectedOption === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className={`group relative overflow-hidden rounded-xl px-4 py-2 sm:p-4 transition-all duration-300 transform ${
                        isSelected
                          ? 'scale-[1.02] bg-gradient-to-br from-accet/20 via-accet/10 to-transparent border-2 border-accet shadow-[0_0_30px_rgba(0,255,200,0.2)]'
                          : `bg-white/5 border-2 ${showError ? 'border-red-500/30' : 'border-white/10'} hover:border-accet/40 hover:bg-white/10 active:scale-[0.98]`
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-linear-to-r from-accet/10 via-transparent to-accet/10 animate-pulse" />
                      )}

                      <div className="relative flex items-center gap-3">
                        {/* <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl transition-all duration-300 ${
                            isSelected
                              ? 'bg-linear-to-br from-accet to-[#017474] shadow-lg'
                              : 'bg-white/10 group-hover:bg-accet/20'
                          }`}
                        >
                          {option.icon}
                        </div> */}

                        <div className="flex-1 text-left gap-2">
                          <p
                            className={`font-heading capitalize font-medium tracking-wide text-[13px] sm:text-[14px] transition-colors duration-300 ${
                              isSelected ? 'text-accet' : 'text-white/90 group-hover:text-white'
                            }`}
                          >
                            {option.text}
                          </p>
                          <p
                            className={`font-tamil text-[10px] sm:text-[11px] transition-colors mt-1 duration-300 ${
                              isSelected ? 'text-accet/70' : 'text-white/50'
                            }`}
                          >
                            {option.tamil}
                          </p>
                        </div>

                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isSelected
                              ? 'bg-accet scale-100'
                              : 'bg-white/10 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100'
                          }`}
                        >
                          {isSelected ? (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                          )}
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex-shrink-0 flex items-center justify-between gap-4 mt-4 max-w-lg mx-auto w-full">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                currentQuestion === 0
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/30'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* Mobile Dots */}
            <div className="flex gap-1.5 sm:hidden">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuestion
                      ? 'bg-accet w-5'
                      : index < currentQuestion
                      ? 'bg-accet/50'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                selectedOption
                  ? 'bg-gradient-to-r from-accet via-[#00d4aa] to-[#017474] text-black hover:shadow-[0_0_30px_rgba(0,255,200,0.3)] hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gradient-to-r from-accet/50 to-[#017474]/50 text-black/70'
              }`}
            >
              <span>
                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mandatory Note */}
          {/* <div className="flex-shrink-0 text-center mt-3">
            <p className="text-white/30 text-[10px] flex items-center justify-center gap-1">
              <svg className="w-3 h-3 text-accet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              All questions are mandatory to complete the survey
            </p>
          </div> */}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default QnA;