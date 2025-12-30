import { useState } from "react";
import { HiMiniUser, HiPhone } from "react-icons/hi2";
import { MdLocationOn, MdVerifiedUser } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const UserDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    district: "",
    religion: "",
    motherTongue: "",
    phone: "",
    caste: "",
    community: "",
    idType: "",
    idNumber: "",
  });

  const [agreed, setAgreed] = useState(false);

  // Options Data
  const ageRanges = [
    { value: "below-18", label: "Below 18" },
    { value: "18-25", label: "18 - 25" },
    { value: "26-35", label: "26 - 35" },
    { value: "36-50", label: "36 - 50" },
    { value: "51-65", label: "51 - 65" },
    { value: "65+", label: "65+" },
  ];

  const districts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
    "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
    "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
    "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
    "Vellore", "Viluppuram", "Virudhunagar"
  ];

  const religions = [
    { value: "hindu", label: "Hindu", icon: "🕉️" },
    { value: "christian", label: "Christian", icon: "✝️" },
    { value: "muslim", label: "Muslim", icon: "☪️" },
    { value: "others", label: "Others", icon: "🙏" },
  ];

  const motherTongues = [
    { value: "tamil", label: "Tamil", icon: "த" },
    { value: "telugu", label: "Telugu", icon: "తె" },
    { value: "malayalam", label: "Malayalam", icon: "മ" },
    { value: "kannada", label: "Kannada", icon: "ಕ" },
    { value: "hindi", label: "Hindi", icon: "हि" },
    { value: "others", label: "Others", icon: "+" },
  ];

  const communities = [
    { value: "bc", label: "BC", full: "Backward Class" },
    { value: "mbc", label: "MBC", full: "Most Backward Class" },
    { value: "oc", label: "OC", full: "General" },
    { value: "dnc", label: "DNC", full: "Denotified Communities" },
    { value: "sc", label: "SC", full: "Scheduled Caste" },
    { value: "st", label: "ST", full: "Scheduled Tribe" },
  ];

  const idTypes = [
    { value: "aadhar", label: "Aadhar Card", icon: "https://ik.imagekit.io/saransk03/Voting%20Poll/employee-card.png", placeholder: "Enter 12-digit Aadhar", maxLength: 12 },
    { value: "driving", label: "Driving License", icon: "https://ik.imagekit.io/saransk03/Voting%20Poll/driving-licence.png", placeholder: "Enter DL number", maxLength: 16 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      localStorage.setItem("voterData", JSON.stringify(formData));
      navigate("/vote");
    }
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.gender &&
      formData.age &&
      formData.district &&
      formData.religion &&
      formData.motherTongue &&
      formData.phone.length === 10 &&
      formData.caste &&
      formData.community &&
      formData.idType &&
      formData.idNumber &&
      agreed
    );
  };

  // Section Title Component
  const SectionTitle = ({ icon, title, tamil }) => (
    <div className="flex items-center gap-2 mb-8 mt-8 first:mt-0">
      <div className="w-8 h-8 rounded-full bg-linear-to-br from-accet to-[#017474] flex items-center justify-center text-sm">
        {icon}
      </div>
      <div className="flex flex-col justify-center items-start"><h2 className="text-[12px] text-white font-heading font-bold uppercase tracking-widest">{title}</h2>
      <h2 className="text-[10px] text-white font-tamil font-bold uppercase tracking-widest">{tamil}</h2>
      </div>
      <div className="flex-1 h-px bg-linear-to-r from-accet/50 to-transparent" />
    </div>
  );

  return (
    <div className="container mx-auto">
      <div className="w-[90%] mx-auto min-h-screen relative flex flex-col py-4">
        
        {/* Header */}
        <div className="flex justify-center items-start pt-2 sticky top-0 bg-linear-to-b from-black via-black to-transparent pb-4 z-10">
          <div className="text-center">
            <h1 className="text-[20px] font-heading uppercase font-black tracking-wide leading-6 text-transparent bg-linear-to-r from-accet to-[#017474] bg-clip-text">
              Voter Registration
            </h1>
            <p className="text-[8px] font-medium text-white/40 font-body ">
              Fill your details to participate in the opinion poll
            </p>
          </div>
        </div>

        {/* Form Container - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pb-32 pt-4">
          
          {/* ==================== PERSONAL DETAILS ==================== */}
          <SectionTitle icon={<HiMiniUser  className="text-gray-900 "/>} title="Personal Details" tamil='வாக்காளர் விவரங்கள்'/>

          {/* Name Input */}
          <div className="relative group mb-4">
            <div className="absolute inset-0 bg-linear-to-r from-accet to-[#017474] rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-1.5 group-hover:border-accet/30 transition-colors">
              <label className="text-[10px] font-bold text-accet font-heading uppercase tracking-widest">
                Full Name / <span className="font-tamil">முழுப் பெயர்</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full bg-transparent text-white font-medium text-[12px] capitalize outline-none placeholder:text-white/30"
                required
              />
            </div>
          </div>

          {/* Gender Selection */}
          <div className="mb-4">
            <label className="text-[10px] font-bold  text-accet font-heading uppercase tracking-widest mb-3 block px-1">
              Gender / <span className="font-tamil">பாலினம்</span>  
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "male", label: "Male", icon: "https://ik.imagekit.io/saransk03/Voting%20Poll/man.png" },
                { value: "female", label: "Female", icon: "https://ik.imagekit.io/saransk03/Voting%20Poll/businesswoman.png" },
                { value: "other", label: "Other", icon: "https://ik.imagekit.io/saransk03/Voting%20Poll/transition.png" },
              ].map((gender) => (
                <label key={gender.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={gender.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`p-3 rounded-lg border text-center transition-all flex flex-col justify-center gap-1 items-center duration-300 ${
                      formData.gender === gender.value
                        ? "bg-linear-to-br from-accet/20 to-[#017474]/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
                    }`}
                  >
                    <img src={gender.icon} alt={gender.label} className="w-6"/>
                    <span className="text-[9px] font-heading uppercase tracking-widest">
                      {gender.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Age Range Selection */}
          <div className="mb-4">
            <label className="text-[10px] font-bold text-accet font-heading uppercase tracking-widest mb-3 block px-1">
              Age Group / <span className="font-tamil">வயது</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ageRanges.map((age) => (
                <label key={age.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="age"
                    value={age.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all duration-300 ${
                      formData.age === age.value
                        ? "bg-linear-to-br from-accet/20 to-[#017474]/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
                    }`}
                  >
                    <span className="text-[11px] font-heading font-bold tracking-wide">
                      {age.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            {/* Age Warning */}
            {formData.age === "below-18" && (
              <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 flex items-center gap-1">
                <span className="text-[10px]">⚠️</span>
                <p className="text-[9px] text-yellow-400 font-body">
                  You must be 18+ to vote, but can participate in this poll.
                </p>
              </div>
            )}
          </div>

          {/* ==================== LOCATION & BACKGROUND ==================== */}
          <SectionTitle icon={<MdLocationOn className="text-gray-900 "/>} title="Location & Background" tamil='இடம் & பின்னணி'/>

          {/* District Selection */}
          <div className="relative group mb-4">
            <div className="absolute inset-0 bg-linear-to-r from-accet to-[#017474] rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-1 group-hover:border-accet/30 transition-colors">
              <label className="text-[10px] font-bold text-accet font-heading uppercase tracking-widest">
                District / <span className="font-tamil">மாவட்டம்</span>
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full bg-transparent text-white font-body text-[12px] p-2 outline-none appearance-none cursor-pointer"
                required
              >
                <option value="" className="bg-gray-900 p-3">Select your district</option>
                {districts.map((district) => (
                  <option key={district} value={district} className="bg-gray-900 p-3">
                    {district}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-accet/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Religion Selection */}
          <div className="mb-4">
            <label className="text-[10px] font-bold text-accet font-heading uppercase tracking-widest mb-3 block px-1">
              Religion / <span className="font-tamil">மதம்</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {religions.map((religion) => (
                <label key={religion.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="religion"
                    value={religion.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`py-3 px-1 rounded-lg border text-center transition-all duration-300 ${
                      formData.religion === religion.value
                        ? "bg-linear-to-br from-accet/20 to-[#017474]/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
                    }`}
                  >
                    <div className="text-lg">{religion.icon}</div>
                    <span className="text-[7px]  font-heading uppercase tracking-widest font-bold">
                      {religion.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Mother Tongue Selection */}
          <div className="mb-4">
            <label className="text-[10px] font-bold text-accet font-heading uppercase tracking-widest mb-3 block px-1">
              Mother Tongue / <span className="font-tamil">தாய் மொழி</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {motherTongues.map((lang) => (
                <label key={lang.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="motherTongue"
                    value={lang.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all duration-300 ${
                      formData.motherTongue === lang.value
                        ? "bg-linear-to-br from-accet/20 to-[#017474]/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
                    }`}
                  >
                    <div className="text-lg font-bold">{lang.icon}</div>
                    <span className="text-[9px] font-bold font-heading uppercase tracking-widest">
                      {lang.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ==================== CONTACT & COMMUNITY ==================== */}
          <SectionTitle icon={<HiPhone className="text-gray-900 "/>} title="Contact & Community" tamil='தொடர்பு & சமூகம்'/>

          {/* Phone Number */}
          <div className="relative group mb-4">
            <div className="absolute inset-0 bg-linear-to-r from-accet to-[#017474] rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-1.5 group-hover:border-accet/30 transition-colors">
              <label className="text-[10px] text-accet font-bold font-heading uppercase tracking-widest">
                Phone Number / <span className="font-tamil">தொலைபேசி எண்</span>
              </label>
              <div className="flex items-center mt-2 gap-2">
                <span className="text-white/50 font-body text-[12px] py-1 rounded-lg">+91</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit number"
                  maxLength="10"
                  className="flex-1 bg-transparent text-white font-body text-[12px] outline-none placeholder:text-white/30 tracking-wider"
                  required
                />
              </div>
              {/* Phone validation indicator */}
              {formData.phone && (
                <div className=" flex items-center gap-2">
                  <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        formData.phone.length === 10 ? "bg-green-500" : "bg-accet"
                      }`}
                      style={{ width: `${(formData.phone.length / 10) * 100}%` }}
                    />
                  </div>
                  <span className={`text-[8px] font-body ${
                    formData.phone.length === 10 ? "text-green-400" : "text-white/40"
                  }`}>
                    {formData.phone.length}/10
                  </span>
                </div>
              )}
            </div>
          </div>


          {/* Community Selection */}
          <div className="mb-4">
            <label className="text-[10px] font-bold text-accet font-heading uppercase tracking-widest mb-3 block px-1">
              Community / <span className="font-tamil">சமூகம்</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {communities.map((community) => (
                <label key={community.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="community"
                    value={community.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`py-2 px-2 rounded-lg border text-center flex flex-col justify-center items-center transition-all duration-300 ${
                      formData.community === community.value
                        ? "bg-linear-to-br from-accet/20 to-[#017474]/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
                    }`}
                  >
                    <span className="text-[12px] font-heading font-bold leading-5">
                      {community.label}
                    </span>
                    <span className="text-[7px] font-body">
                      {community.full}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>


          {/* Caste Input */}
          <div className="relative group mb-4">
            <div className="absolute inset-0 bg-linear-to-r from-accet to-[#017474] rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-1.5 group-hover:border-accet/30 transition-colors">
              <label className="text-[10px] font-bold text-accet font-heading uppercase tracking-widest">
                Caste / <span className="font-tamil">சாதி</span>
              </label>
              <input
                type="text"
                name="caste"
                value={formData.caste}
                onChange={handleChange}
                placeholder="Enter your caste"
                className="w-full bg-transparent text-white font-body text-[12px] mt-2 outline-none placeholder:text-white/30"
                required
              />
            </div>
          </div>

          {/* ==================== ID VERIFICATION ==================== */}
          <SectionTitle icon={<MdVerifiedUser className="text-gray-900 "/>} title="ID Verification" tamil='அடையாள சரிபார்ப்பு'/>

          {/* ID Type Selection */}
          <div className="mb-4">
            <label className="text-[10px] font-bold text-accet font-heading uppercase tracking-widest mb-3 block px-1">
              Select ID Type / <span className="font-tamil">ஐடி வகையைத் தேர்ந்தெடுக்கவும்</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {idTypes.map((id) => (
                <label key={id.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="idType"
                    value={id.value}
                    onChange={(e) => {
                      handleChange(e);
                      setFormData(prev => ({ ...prev, idNumber: "" }));
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 rounded-lg border text-center transition-all flex flex-col justify-center gap-1 items-center duration-300 ${
                      formData.idType === id.value
                        ? "bg-linear-to-br from-accet/20 to-[#017474]/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
                    }`}
                  >
                    <img src={id.icon} alt={id.label} className="w-6"/>
                    <span className="text-[9px] font-bold font-heading uppercase tracking-widest">
                      {id.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ID Number Input */}
          {formData.idType && (
            <div className="relative group mb-4 animate-fadeIn">
              <div className="absolute inset-0 bg-linear-to-r from-accet to-[#017474] rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 group-hover:border-accet/30 transition-colors">
                <label className="text-[10px] text-accet font-heading uppercase tracking-widest flex items-center gap-2">
                  {formData.idType === "aadhar" ? "Aadhar Number" : "Driving License Number"}
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  placeholder={idTypes.find(id => id.value === formData.idType)?.placeholder}
                  maxLength={idTypes.find(id => id.value === formData.idType)?.maxLength}
                  className="w-full bg-transparent text-white font-body text-[12px] mt-2 outline-none placeholder:text-white/30 tracking-wide uppercase"
                  required
                />
                {/* ID validation indicator */}
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        formData.idNumber.length === idTypes.find(id => id.value === formData.idType)?.maxLength
                          ? "bg-green-500" 
                          : "bg-accet"
                      }`}
                      style={{ 
                        width: `${(formData.idNumber.length / idTypes.find(id => id.value === formData.idType)?.maxLength) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-[8px] text-white/40 font-body">
                    {formData.idNumber.length}/{idTypes.find(id => id.value === formData.idType)?.maxLength}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="bg-linear-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-green-400 font-heading uppercase tracking-wider">Your Data is Secure</p>
                <p className="text-[8px] text-white/50 font-body mt-1 leading-relaxed">
                  All information is encrypted and used only for this survey. We never share personal data with third parties.
                </p>
              </div>
            </div>
          </div>

        </form>

        {/* Fixed Bottom Button */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black via-black to-transparent pt-6 pb-4 px-[4px]">
          
          {/* Agreement Checkbox */}
          <div className="flex items-start gap-2 mb-3 px-3">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-accet w-4 h-4 cursor-pointer" 
            />
            <p className="text-[9px] text-white/50 font-body leading-relaxed">
              I confirm my details are accurate & I agree to the{" "}
              <span className="text-accet underline cursor-pointer">Privacy Policy</span> and{" "}
              <span className="text-accet underline cursor-pointer">Terms of Service</span>.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`w-full font-heading text-[12px] tracking-wider py-3.5 rounded-full uppercase font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              isFormValid()
                ? "text-white bg-linear-to-r from-accet to-[#017474] hover:shadow-lg hover:shadow-accet/30 active:scale-[0.98]"
                : "text-white/30 bg-white/5 border border-white/10 cursor-not-allowed"
            }`}
          >
            {isFormValid() ? (
              <>
                <span>Proceed to Vote</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            ) : (
              <>
                <span>Complete All Fields</span>
                <span className="text-[10px] opacity-50">
                  ({Object.values(formData).filter(v => v).length + (agreed ? 1 : 0)}/12)
                </span>
              </>
            )}
          </button>

          {/* Quick Links */}
          <div className="text-[7px] tracking-widest text-white/40 flex justify-between items-center mt-2 px-4 font-heading font-light">
            <p className="hover:text-white cursor-pointer transition-colors">Privacy Policy</p>
            <p className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</p>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="fixed top-20 left-0 h-40 w-40 bg-accet/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="fixed bottom-40 right-0 h-32 w-32 bg-[#017474]/30 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-60 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      </div>
    </div>
  );
};

export default UserDetails;




// import { useState } from "react";

// import { useNavigate } from "react-router-dom";

// const UserDetails = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     gender: "",
//     age: "",
//     district: "",
//     religion: "",
//     motherTongue: "",
//     phone: "",
//     caste: "",
//     community: "",
//     idType: "",
//     idNumber: "",
//   });

//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 3;

//   // Options Data
//   const ageRanges = [
//     { value: "below-18", label: "Below 18" },
//     { value: "18-25", label: "18 to 25" },
//     { value: "26-35", label: "26 to 35" },
//     { value: "36-50", label: "36 to 50" },
//     { value: "51-65", label: "51 to 65" },
//     { value: "65+", label: "65+" },
//   ];

//   const districts = [
//     "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
//     "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
//     "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
//     "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
//     "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
//     "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
//     "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
//     "Vellore", "Viluppuram", "Virudhunagar"
//   ];

//   const religions = [
//     { value: "hindu", label: "Hindu", icon: "🕉️" },
//     { value: "christian", label: "Christian", icon: "✝️" },
//     { value: "muslim", label: "Muslim", icon: "☪️" },
//     { value: "others", label: "Others", icon: "🙏" },
//   ];

//   const motherTongues = [
//     { value: "tamil", label: "Tamil", icon: "த" },
//     { value: "telugu", label: "Telugu", icon: "తె" },
//     { value: "malayalam", label: "Malayalam", icon: "മ" },
//     { value: "kannada", label: "Kannada", icon: "ಕ" },
//     { value: "hindi", label: "Hindi", icon: "हि" },
//     { value: "others", label: "Others", icon: "+" },
//   ];

//   const communities = [
//     { value: "oc", label: "OC (General)" },
//     { value: "bc", label: "BC (Backward Class)" },
//     { value: "mbc", label: "MBC (Most Backward Class)" },
//     { value: "dnc", label: "DNC (Denotified Communities)" },
//     { value: "sc", label: "SC (Scheduled Caste)" },
//     { value: "st", label: "ST (Scheduled Tribe)" },
//   ];

//   const idTypes = [
//     { value: "aadhar", label: "Aadhar Card", icon: "🪪", placeholder: "Enter 12-digit Aadhar number", pattern: "[0-9]{12}", maxLength: 12 },
//     { value: "driving", label: "Driving License", icon: "🚗", placeholder: "Enter DL number (e.g., TN01 20190012345)", pattern: "[A-Z]{2}[0-9]{2} [0-9]{11}", maxLength: 16 },
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     localStorage.setItem("voterData", JSON.stringify(formData));
//     navigate("/vote");
//   };

//   const nextStep = () => {
//     if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
//   };

//   const prevStep = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

//   // Check if current step is valid
//   const isStepValid = () => {
//     switch (currentStep) {
//       case 1:
//         return formData.name && formData.gender && formData.age;
//       case 2:
//         return formData.district && formData.religion && formData.motherTongue && formData.phone && formData.caste && formData.community;
//       case 3:
//         return formData.idType && formData.idNumber;
//       default:
//         return false;
//     }
//   };

//   return (
//     <div className="container mx-auto">
//       <div className="w-[90%] mx-auto min-h-screen relative flex flex-col py-4">
        
//         {/* Header */}
//         <div className="flex justify-center items-start pt-2">
//           <div className="text-center">
//             <h1 className="text-[18px] font-heading uppercase font-black tracking-wide leading-6 text-transparent bg-gradient-to-r from-accet to-[#017474] bg-clip-text">
//               Voter Registration
//             </h1>
//             <p className="text-[9px] text-white/40 font-body mt-1">Fill your details to participate in the poll</p>
//           </div>
//         </div>

//         {/* Progress Bar */}
//         <div className="mt-4 px-2">
//           <div className="flex justify-between items-center mb-2">
//             {[
//               { step: 1, label: "Personal", icon: "👤" },
//               { step: 2, label: "Background", icon: "📍" },
//               { step: 3, label: "Verify", icon: "🔐" },
//             ].map((item) => (
//               <div key={item.step} className="flex flex-col items-center flex-1">
//                 <div
//                   className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
//                     currentStep >= item.step
//                       ? "bg-gradient-to-br from-accet to-[#017474] border-accet text-white shadow-lg shadow-accet/30"
//                       : "border-white/20 text-white/30 bg-white/5"
//                   }`}
//                 >
//                   {currentStep > item.step ? (
//                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                     </svg>
//                   ) : (
//                     <span className="text-sm">{item.icon}</span>
//                   )}
//                 </div>
//                 <span className={`text-[8px] mt-1 font-heading uppercase tracking-wider ${
//                   currentStep >= item.step ? "text-accet" : "text-white/30"
//                 }`}>
//                   {item.label}
//                 </span>
//               </div>
//             ))}
//           </div>
//           {/* Progress Line */}
//           <div className="relative mt-[-28px] mb-6 mx-8 -z-10">
//             <div className="w-full bg-white/10 h-[2px]" />
//             <div
//               className="absolute top-0 left-0 bg-gradient-to-r from-accet to-[#017474] h-[2px] transition-all duration-500"
//               style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
//             />
//           </div>
//         </div>

//         {/* Form Container */}
//         <div className="flex-1 overflow-y-auto pb-4">
//           <form onSubmit={handleSubmit} className="w-full">
            
//             {/* ==================== STEP 1: Personal Details ==================== */}
//             <div className={`transition-all duration-500 ${currentStep === 1 ? "block" : "hidden"}`}>
//               <div className="space-y-4">
                
//                 {/* Name Input */}
//                 <div className="relative group">
//                   <div className="absolute inset-0 bg-gradient-to-r from-accet to-[#017474] rounded-2xl blur opacity-0 group-hover:opacity-25 transition-opacity duration-300" />
//                   <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 group-hover:border-accet/30 transition-colors">
//                     <label className="text-[10px] text-accet font-heading uppercase tracking-widest flex items-center gap-2">
//                       <span>👤</span> Full Name
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       placeholder="Enter your full name"
//                       className="w-full bg-transparent text-white font-body text-[14px] mt-2 outline-none placeholder:text-white/30"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Gender Selection */}
//                 <div className="relative">
//                   <label className="text-[10px] text-accet font-heading uppercase tracking-widest mb-3 block flex items-center gap-2 px-1">
//                     <span>⚧️</span> Gender
//                   </label>
//                   <div className="grid grid-cols-3 gap-2">
//                     {[
//                       { value: "male", label: "Male", icon: "👨" },
//                       { value: "female", label: "Female", icon: "👩" },
//                       { value: "other", label: "Other", icon: "🧑" },
//                     ].map((gender) => (
//                       <label key={gender.value} className="cursor-pointer">
//                         <input
//                           type="radio"
//                           name="gender"
//                           value={gender.value}
//                           onChange={handleChange}
//                           className="sr-only"
//                           required
//                         />
//                         <div
//                           className={`p-3 rounded-xl border text-center transition-all duration-300 ${
//                             formData.gender === gender.value
//                               ? "bg-gradient-to-br from-accet/20 to-[#017474]/20 border-accet text-white shadow-lg shadow-accet/20"
//                               : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
//                           }`}
//                         >
//                           <div className="text-2xl mb-1">{gender.icon}</div>
//                           <span className="text-[10px] font-heading uppercase tracking-wider">
//                             {gender.label}
//                           </span>
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Age Range Selection */}
//                 <div className="relative">
//                   <label className="text-[10px] text-accet font-heading uppercase tracking-widest mb-3 block flex items-center gap-2 px-1">
//                     <span>📅</span> Age Group
//                   </label>
//                   <div className="grid grid-cols-3 gap-2">
//                     {ageRanges.map((age) => (
//                       <label key={age.value} className="cursor-pointer">
//                         <input
//                           type="radio"
//                           name="age"
//                           value={age.value}
//                           onChange={handleChange}
//                           className="sr-only"
//                           required
//                         />
//                         <div
//                           className={`py-3 px-2 rounded-xl border text-center transition-all duration-300 ${
//                             formData.age === age.value
//                               ? "bg-gradient-to-br from-accet/20 to-[#017474]/20 border-accet text-white shadow-lg shadow-accet/20"
//                               : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
//                           }`}
//                         >
//                           <span className="text-[11px] font-heading font-bold tracking-wide">
//                             {age.label}
//                           </span>
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Age Warning for Below 18 */}
//                 {formData.age === "below-18" && (
//                   <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-4 animate-pulse">
//                     <div className="flex items-start gap-3">
//                       <span className="text-xl">⚠️</span>
//                       <div>
//                         <p className="text-[10px] text-yellow-400 font-heading uppercase tracking-wider">Age Restriction</p>
//                         <p className="text-[9px] text-white/50 font-body mt-1 leading-relaxed">
//                           You must be 18 or above to vote in elections. However, you can still participate in this opinion poll.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* ==================== STEP 2: Background Details ==================== */}
//             <div className={`transition-all duration-500 ${currentStep === 2 ? "block" : "hidden"}`}>
//               <div className="space-y-4">
                
//                 {/* District Selection */}
//                 <div className="relative group">
//                   <div className="absolute inset-0 bg-gradient-to-r from-accet to-[#017474] rounded-2xl blur opacity-0 group-hover:opacity-25 transition-opacity duration-300" />
//                   <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 group-hover:border-accet/30 transition-colors">
//                     <label className="text-[10px] text-accet font-heading uppercase tracking-widest flex items-center gap-2">
//                       <span>📍</span> District
//                     </label>
//                     <select
//                       name="district"
//                       value={formData.district}
//                       onChange={handleChange}
//                       className="w-full bg-transparent text-white font-body text-[14px] mt-2 outline-none appearance-none cursor-pointer"
//                       required
//                     >
//                       <option value="" className="bg-gray-900">Select your district</option>
//                       {districts.map((district) => (
//                         <option key={district} value={district} className="bg-gray-900">
//                           {district}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
//                       <svg className="w-5 h-5 text-accet/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Religion Selection */}
//                 <div className="relative">
//                   <label className="text-[10px] text-accet font-heading uppercase tracking-widest mb-3 block flex items-center gap-2 px-1">
//                     <span>🙏</span> Religion
//                   </label>
//                   <div className="grid grid-cols-4 gap-2">
//                     {religions.map((religion) => (
//                       <label key={religion.value} className="cursor-pointer">
//                         <input
//                           type="radio"
//                           name="religion"
//                           value={religion.value}
//                           onChange={handleChange}
//                           className="sr-only"
//                           required
//                         />
//                         <div
//                           className={`py-3 px-2 rounded-xl border text-center transition-all duration-300 ${
//                             formData.religion === religion.value
//                               ? "bg-gradient-to-br from-accet/20 to-[#017474]/20 border-accet text-white shadow-lg shadow-accet/20"
//                               : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
//                           }`}
//                         >
//                           <div className="text-lg mb-1">{religion.icon}</div>
//                           <span className="text-[8px] font-heading uppercase tracking-wide">
//                             {religion.label}
//                           </span>
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Mother Tongue Selection */}
//                 <div className="relative">
//                   <label className="text-[10px] text-accet font-heading uppercase tracking-widest mb-3 block flex items-center gap-2 px-1">
//                     <span>🗣️</span> Mother Tongue
//                   </label>
//                   <div className="grid grid-cols-3 gap-2">
//                     {motherTongues.map((lang) => (
//                       <label key={lang.value} className="cursor-pointer">
//                         <input
//                           type="radio"
//                           name="motherTongue"
//                           value={lang.value}
//                           onChange={handleChange}
//                           className="sr-only"
//                           required
//                         />
//                         <div
//                           className={`py-3 px-2 rounded-xl border text-center transition-all duration-300 ${
//                             formData.motherTongue === lang.value
//                               ? "bg-gradient-to-br from-accet/20 to-[#017474]/20 border-accet text-white shadow-lg shadow-accet/20"
//                               : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
//                           }`}
//                         >
//                           <div className="text-lg mb-1 font-bold">{lang.icon}</div>
//                           <span className="text-[9px] font-heading uppercase tracking-wide">
//                             {lang.label}
//                           </span>
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Phone Number */}
//                 <div className="relative group">
//                   <div className="absolute inset-0 bg-gradient-to-r from-accet to-[#017474] rounded-2xl blur opacity-0 group-hover:opacity-25 transition-opacity duration-300" />
//                   <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 group-hover:border-accet/30 transition-colors">
//                     <label className="text-[10px] text-accet font-heading uppercase tracking-widest flex items-center gap-2">
//                       <span>📱</span> Phone Number
//                     </label>
//                     <div className="flex items-center mt-2 gap-2">
//                       <span className="text-white/50 font-body text-[14px] bg-white/5 px-3 py-1 rounded-lg">+91</span>
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         placeholder="Enter 10-digit number"
//                         pattern="[0-9]{10}"
//                         maxLength="10"
//                         className="flex-1 bg-transparent text-white font-body text-[14px] outline-none placeholder:text-white/30"
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Caste Input */}
//                 <div className="relative group">
//                   <div className="absolute inset-0 bg-gradient-to-r from-accet to-[#017474] rounded-2xl blur opacity-0 group-hover:opacity-25 transition-opacity duration-300" />
//                   <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 group-hover:border-accet/30 transition-colors">
//                     <label className="text-[10px] text-accet font-heading uppercase tracking-widest flex items-center gap-2">
//                       <span>👥</span> Caste
//                     </label>
//                     <input
//                       type="text"
//                       name="caste"
//                       value={formData.caste}
//                       onChange={handleChange}
//                       placeholder="Enter your caste"
//                       className="w-full bg-transparent text-white font-body text-[14px] mt-2 outline-none placeholder:text-white/30"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Community Selection */}
//                 <div className="relative group">
//                   <div className="absolute inset-0 bg-gradient-to-r from-accet to-[#017474] rounded-2xl blur opacity-0 group-hover:opacity-25 transition-opacity duration-300" />
//                   <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 group-hover:border-accet/30 transition-colors">
//                     <label className="text-[10px] text-accet font-heading uppercase tracking-widest flex items-center gap-2">
//                       <span>🏛️</span> Community
//                     </label>
//                     <select
//                       name="community"
//                       value={formData.community}
//                       onChange={handleChange}
//                       className="w-full bg-transparent text-white font-body text-[14px] mt-2 outline-none appearance-none cursor-pointer"
//                       required
//                     >
//                       <option value="" className="bg-gray-900">Select your community</option>
//                       {communities.map((community) => (
//                         <option key={community.value} value={community.value} className="bg-gray-900">
//                           {community.label}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
//                       <svg className="w-5 h-5 text-accet/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ==================== STEP 3: Verification ==================== */}
//             <div className={`transition-all duration-500 ${currentStep === 3 ? "block" : "hidden"}`}>
//               <div className="space-y-4">
                
//                 {/* ID Type Selection */}
//                 <div className="relative">
//                   <label className="text-[10px] text-accet font-heading uppercase tracking-widest mb-3 block flex items-center gap-2 px-1">
//                     <span>🪪</span> Select ID Type
//                   </label>
//                   <div className="grid grid-cols-2 gap-3">
//                     {idTypes.map((id) => (
//                       <label key={id.value} className="cursor-pointer">
//                         <input
//                           type="radio"
//                           name="idType"
//                           value={id.value}
//                           onChange={(e) => {
//                             handleChange(e);
//                             setFormData(prev => ({ ...prev, idNumber: "" }));
//                           }}
//                           className="sr-only"
//                           required
//                         />
//                         <div
//                           className={`p-4 rounded-2xl border text-center transition-all duration-300 ${
//                             formData.idType === id.value
//                               ? "bg-gradient-to-br from-accet/20 to-[#017474]/20 border-accet text-white shadow-lg shadow-accet/20"
//                               : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
//                           }`}
//                         >
//                           <div className="text-3xl mb-2">{id.icon}</div>
//                           <span className="text-[10px] font-heading uppercase tracking-wide">
//                             {id.label}
//                           </span>
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 {/* ID Number Input - Shows based on selection */}
//                 {formData.idType && (
//                   <div className="relative group animate-fadeIn">
//                     <div className="absolute inset-0 bg-gradient-to-r from-accet to-[#017474] rounded-2xl blur opacity-0 group-hover:opacity-25 transition-opacity duration-300" />
//                     <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 group-hover:border-accet/30 transition-colors">
//                       <label className="text-[10px] text-accet font-heading uppercase tracking-widest flex items-center gap-2">
//                         <span>{formData.idType === "aadhar" ? "🔢" : "🚗"}</span>
//                         {formData.idType === "aadhar" ? "Aadhar Number" : "Driving License Number"}
//                       </label>
//                       <input
//                         type="text"
//                         name="idNumber"
//                         value={formData.idNumber}
//                         onChange={handleChange}
//                         placeholder={idTypes.find(id => id.value === formData.idType)?.placeholder}
//                         maxLength={idTypes.find(id => id.value === formData.idType)?.maxLength}
//                         className="w-full bg-transparent text-white font-body text-[14px] mt-2 outline-none placeholder:text-white/30 tracking-widest"
//                         required
//                       />
//                       <div className="mt-2 flex items-center gap-2">
//                         <div className={`h-1 flex-1 rounded-full ${formData.idNumber.length > 0 ? "bg-accet" : "bg-white/10"}`} />
//                         <span className="text-[8px] text-white/40 font-body">
//                           {formData.idNumber.length}/{idTypes.find(id => id.value === formData.idType)?.maxLength}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Summary Card */}
//                 <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mt-4">
//                   <h3 className="text-[11px] text-accet font-heading uppercase tracking-wider mb-3 flex items-center gap-2">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     Review Your Details
//                   </h3>
//                   <div className="space-y-2 max-h-48 overflow-y-auto">
//                     {[
//                       { label: "Name", value: formData.name, icon: "👤" },
//                       { label: "Gender", value: formData.gender, icon: "⚧️" },
//                       { label: "Age", value: ageRanges.find(a => a.value === formData.age)?.label, icon: "📅" },
//                       { label: "District", value: formData.district, icon: "📍" },
//                       { label: "Religion", value: religions.find(r => r.value === formData.religion)?.label, icon: "🙏" },
//                       { label: "Mother Tongue", value: motherTongues.find(l => l.value === formData.motherTongue)?.label, icon: "🗣️" },
//                       { label: "Phone", value: formData.phone ? `+91 ${formData.phone}` : "", icon: "📱" },
//                       { label: "Caste", value: formData.caste, icon: "👥" },
//                       { label: "Community", value: communities.find(c => c.value === formData.community)?.label, icon: "🏛️" },
//                     ].map((item) => (
//                       item.value && (
//                         <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
//                           <span className="text-[9px] text-white/50 font-body flex items-center gap-2">
//                             <span>{item.icon}</span>
//                             {item.label}
//                           </span>
//                           <span className="text-[11px] text-white font-heading capitalize">
//                             {item.value}
//                           </span>
//                         </div>
//                       )
//                     ))}
//                   </div>
//                 </div>

//                 {/* Privacy Notice */}
//                 <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-4">
//                   <div className="flex items-start gap-3">
//                     <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
//                       <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="text-[10px] text-green-400 font-heading uppercase tracking-wider">Data Protected</p>
//                       <p className="text-[8px] text-white/50 font-body mt-1 leading-relaxed">
//                         Your ID is verified securely. We use encryption to protect your personal information.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* Navigation Buttons */}
//         <div className="w-full py-3 space-y-3">
//           <div className="flex gap-3">
//             {currentStep > 1 && (
//               <button
//                 type="button"
//                 onClick={prevStep}
//                 className="flex-1 font-heading text-[11px] tracking-wider py-3 rounded-full text-white/70 bg-white/5 uppercase font-bold border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//                 Back
//               </button>
//             )}
//             {currentStep < totalSteps ? (
//               <button
//                 type="button"
//                 onClick={nextStep}
//                 disabled={!isStepValid()}
//                 className={`flex-1 font-heading text-[11px] tracking-wider py-3 rounded-full uppercase font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
//                   isStepValid()
//                     ? "text-white bg-gradient-to-r from-accet to-[#017474] hover:shadow-lg hover:shadow-accet/30"
//                     : "text-white/30 bg-white/5 border border-white/10 cursor-not-allowed"
//                 }`}
//               >
//                 Continue
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             ) : (
//               <button
//                 type="submit"
//                 onClick={handleSubmit}
//                 disabled={!isStepValid()}
//                 className={`flex-1 font-heading text-[11px] tracking-wider py-3 rounded-full uppercase font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
//                   isStepValid()
//                     ? "text-white bg-gradient-to-r from-accet to-[#017474] hover:shadow-lg hover:shadow-accet/30"
//                     : "text-white/30 bg-white/5 border border-white/10 cursor-not-allowed"
//                 }`}
//               >
//                 <span>Proceed to Vote</span>
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </button>
//             )}
//           </div>

//           {/* Step Indicator */}
//           <div className="flex items-center justify-center gap-2">
//             {[1, 2, 3].map((step) => (
//               <div
//                 key={step}
//                 className={`h-1.5 rounded-full transition-all duration-300 ${
//                   currentStep === step ? "w-6 bg-accet" : "w-1.5 bg-white/20"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Background Decorations */}
//         <div className="absolute top-20 left-0 h-40 w-40 bg-accet/20 rounded-full blur-3xl -z-10" />
//         <div className="absolute bottom-40 right-0 h-32 w-32 bg-[#017474]/30 rounded-full blur-3xl -z-10" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-60 bg-blue-500/10 rounded-full blur-3xl -z-10" />
//       </div>
//     </div>
//   );
// };

// export default UserDetails;