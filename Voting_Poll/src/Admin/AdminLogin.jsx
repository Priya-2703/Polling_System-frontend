// src/pages/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import { Icon } from "@iconify/react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";

const AdminLogin = () => {
  const { t } = useTranslation();
  const [playClick] = useSound(scifi);
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Particles for background
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  // Check if already logged in
  useEffect(() => {
    // const token = localStorage.getItem("admin_token");
    // if (token) {
    //   navigate("/admin");
    // }
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, [navigate]);

  // Load remembered email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("admin_remembered_email");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    playClick();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call - Replace with your actual API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock validation - Replace with actual API call
      if (email === "admin@votepoll.com" && password === "admin123") {
        // Save token
        const mockToken = "admin_jwt_token_" + Date.now();
        localStorage.setItem("admin_token", mockToken);

        // Remember email if checked
        if (rememberMe) {
          localStorage.setItem("admin_remembered_email", email);
        } else {
          localStorage.removeItem("admin_remembered_email");
        }

        toast.success("Login successful! Redirecting...", {
          style: {
            background: "#0a0a0a",
            color: "#00d4aa",
            border: "1px solid #00d4aa30",
          },
          iconTheme: { primary: "#00d4aa", secondary: "#0a0a0a" },
        });

        setTimeout(() => navigate("/admin"), 1500);
      } else {
        toast.error("Invalid credentials", {
          style: {
            background: "#0a0a0a",
            color: "#ef4444",
            border: "1px solid #ef444430",
          },
        });
      }
    } catch (error) {
      toast.error("Login failed. Please try again.", {
        style: {
          background: "#0a0a0a",
          color: "#ef4444",
          border: "1px solid #ef444430",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="h-screen bg-black relative overflow-hidden flex items-center justify-center">
        {/* Toast Container */}
        <Toaster position="top-right" />

        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black" />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(#00d4aa 1px, transparent 1px), linear-gradient(90deg, #00d4aa 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Animated Lines */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-accet/20 to-transparent animate-pulse" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent animate-pulse" />
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accet/10 to-transparent" />
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />

          {/* Floating Particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-accet/30 animate-float"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}

          {/* Glowing Orbs */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-accet/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        </div>

        {/* Login Card */}
        <div
          className={`relative z-10 w-full max-w-md mx-4 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Card Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-accet/20 via-indigo-500/20 to-accet/20 rounded-lg blur-lg opacity-50 animate-pulse" />

          {/* Card */}
          <div className="relative bg-black/80 backdrop-blur-xl border border-accet/20 rounded-lg overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accet to-transparent" />

            {/* Header */}
            <div className="p-8 pb-0">
              {/* Logo */}
              <div
                className="flex justify-center mb-6 cursor-pointer group"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accet/20 to-indigo-500/20 flex items-center justify-center border border-accet/30 group-hover:border-accet/60 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(0,212,170,0.3)]">
                    <Icon
                      icon="lucide:shield-check"
                      className="text-accet"
                      width={32}
                    />
                  </div>
                  {/* Rotating Border */}
                  <div className="absolute -inset-2 border border-accet/20 rounded-xl animate-spin-slow opacity-50" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl md:text-3xl text-white font-bold mb-2 tracking-wide">
                  Admin Portal
                </h1>
                <p className="text-white/40 text-sm">
                  Sign in to access the dashboard
                </p>
              </div>

              {/* Security Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accet/10 border border-accet/20 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-[10px] font-heading uppercase tracking-wider">
                    Secure Connection
                  </span>
                  <Icon
                    icon="lucide:lock"
                    className="text-green-400"
                    width={12}
                  />
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} autoComplete="off" className="p-8 pt-4 space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-white/60 text-xs font-heading uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  {/* Glow Effect on Focus */}
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r from-accet to-indigo-500 rounded-sm opacity-0 blur transition-opacity duration-300 ${
                      focusedField === "email" ? "opacity-30" : ""
                    }`}
                  />

                  <div className="relative">
                    <Icon
                      icon="lucide:mail"
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                        focusedField === "email"
                          ? "text-accet"
                          : "text-white/30"
                      }`}
                      width={18}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="admin@votepoll.com"
                      className={`w-full bg-white/5 border rounded-sm pl-12 pr-4 py-3.5 
                        text-white text-sm font-heading placeholder:text-white/30
                        focus:outline-none transition-all duration-300
                        ${
                          errors.email
                            ? "border-red-500/50"
                            : focusedField === "email"
                            ? "border-accet/50 bg-accet/5"
                            : "border-white/10 hover:border-white/20"
                        }`}
                    />

                    {/* Valid Checkmark */}
                    {email && !errors.email && (
                      <Icon
                        icon="lucide:check-circle"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 animate-fadeIn"
                        width={18}
                      />
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {errors.email && (
                  <p className="text-red-400 text-xs flex items-center gap-1 animate-shake">
                    <Icon icon="lucide:alert-circle" width={12} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-white/60 text-xs font-heading uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  {/* Glow Effect on Focus */}
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r from-accet to-indigo-500 rounded-sm opacity-0 blur transition-opacity duration-300 ${
                      focusedField === "password" ? "opacity-30" : ""
                    }`}
                  />

                  <div className="relative">
                    <Icon
                      icon="lucide:lock"
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                        focusedField === "password"
                          ? "text-accet"
                          : "text-white/30"
                      }`}
                      width={18}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password)
                          setErrors({ ...errors, password: "" });
                      }}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your password"
                      className={`w-full bg-white/5 border rounded-sm pl-12 pr-12 py-3.5 
                        text-white text-sm font-heading placeholder:text-white/30
                        focus:outline-none transition-all duration-300
                        ${
                          errors.password
                            ? "border-red-500/50"
                            : focusedField === "password"
                            ? "border-accet/50 bg-accet/5"
                            : "border-white/10 hover:border-white/20"
                        }`}
                    />

                    {/* Toggle Password Visibility */}
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setShowPassword(!showPassword);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-accet transition-colors"
                    >
                      <Icon
                        icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
                        width={18}
                      />
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {errors.password && (
                  <p className="text-red-400 text-xs flex items-center gap-1 animate-shake">
                    <Icon icon="lucide:alert-circle" width={12} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-4 bg-gradient-to-r from-accet to-cyan-400 text-black font-heading font-bold text-sm uppercase tracking-wider rounded-sm overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,170,0.4)]"
              >
                {/* Shine Effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                {/* Button Content */}
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Icon
                        icon="lucide:loader-2"
                        className="animate-spin"
                        width={18}
                      />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Icon icon="lucide:log-in" width={18} />
                      Sign In
                    </>
                  )}
                </span>
              </button>
            </form> 
          </div>
        </div>
        </div>
    </GoogleOAuthProvider>
  );
};
export default AdminLogin;