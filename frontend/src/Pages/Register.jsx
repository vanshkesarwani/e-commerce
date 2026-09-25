import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";
import apiClient from "../api/apiClient";
import Logo from "../components/Logo";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCamera,
  FaShieldAlt,
  FaStar,
  FaCheck,
  FaTag,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

// ==========================================
// LUXURY E-COMMERCE REGISTRATION EXPERIENCE
// Highly responsive across Mobile, Tablet & Desktop
// ==========================================
const Register = () => {
  const { setProfile, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  // Quick photo upload & preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Dynamic Password Strength Meter
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-rose-500" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 3, label: "Good", color: "bg-sky-500" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 0, label: "", color: "" };
    }
  };

  const strength = getPasswordStrength();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your mobile number");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!agreeTerms) {
      toast.error("Please agree to the Terms of Service to continue");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim().toLowerCase());
    formData.append("phone", phone.trim());
    formData.append("password", password);

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      setLoading(true);
      const { data } = await apiClient.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data?.token) {
        localStorage.setItem("jwt", data.token);
      }

      toast.success(data?.message || "Welcome to Velura! Account created.");
      setProfile(data.user || data);
      setIsAuthenticated(true);

      navigate("/");
    } catch (error) {
      console.error("Fast registration error:", error);
      toast.error(
        error.message || "Failed to create account. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50/30 flex items-center justify-center p-2.5 sm:p-6 lg:p-10 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Central Classy Luxury Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 transition-all">
        
        {/* Left Side: Desktop/Tablet Editorial Showcase (5 cols) */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 lg:p-10 bg-slate-950 text-white overflow-hidden">
          
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
            alt="Velura Editorial Showcase"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.38] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <Link to="/">
              <Logo size="default" />
            </Link>
          </div>

          {/* Middle Perks Highlight */}
          <div className="relative z-10 space-y-5 my-auto">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold uppercase tracking-widest backdrop-blur-xs">
              <FaTag className="text-[10px]" />
              <span>Unlock Member Benefits</span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
              Join the Velura Private Club.
            </h2>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px] shrink-0">
                  <FaCheck />
                </span>
                <span>Get 10% instant discount on your first order</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px] shrink-0">
                  <FaCheck />
                </span>
                <span>Free express shipping & priority dispatch</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px] shrink-0">
                  <FaCheck />
                </span>
                <span>Hassle-free 30-day returns & doorstep exchange</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px] shrink-0">
                  <FaCheck />
                </span>
                <span>Saved addresses & 1-click rapid checkout</span>
              </li>
            </ul>
          </div>

          {/* Bottom Social Proof Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-1 text-amber-400 text-[11px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <span className="text-[11px]">50,000+ happy shoppers</span>
          </div>
        </div>

        {/* Right Side: Interactive Registration Form (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between">
          
          {/* Mobile-Only Editorial Brand Banner */}
          <div className="md:hidden relative h-28 bg-slate-950 text-white overflow-hidden flex items-center justify-between px-5">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop"
              alt="Velura"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.35]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="relative z-10">
              <Link to="/">
                <Logo size="default" />
              </Link>
              <p className="text-[10px] text-amber-300 font-semibold tracking-wider uppercase mt-0.5">
                Join Velura Club
              </p>
            </div>
            <span className="relative z-10 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
              Register
            </span>
          </div>

          <div className="p-5 sm:p-8 lg:p-12 space-y-4 sm:space-y-6">
            
            {/* Top Switcher */}
            <div>
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl max-w-xs mx-auto mb-4 sm:mb-5 text-xs font-semibold">
                <Link
                  to="/login"
                  className="flex-1 py-2 text-center rounded-xl text-slate-500 hover:text-slate-900 transition"
                >
                  Sign In
                </Link>
                <span className="flex-1 py-2 text-center rounded-xl bg-white text-slate-900 shadow-xs font-bold">
                  Register
                </span>
              </div>

              {/* Form Headline */}
              <div className="space-y-1 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Create Account
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Join in 15 seconds to unlock curated fashion, footwear & member pricing.
                </p>
              </div>
            </div>

            {/* Social Sign-In Buttons */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => toast("Google signup ready for live domain.", { icon: "ℹ️" })}
                className="flex items-center justify-center space-x-2 py-2.5 px-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition active:scale-95"
              >
                <FcGoogle className="text-base shrink-0" />
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => toast("Apple ID signup ready for live domain.", { icon: "ℹ️" })}
                className="flex items-center justify-center space-x-2 py-2.5 px-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition active:scale-95"
              >
                <FaApple className="text-base shrink-0" />
                <span>Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                or register with details
              </span>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-3 sm:space-y-3.5">
              
              {/* Full Name & Profile Photo Avatar Picker */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <FaUser className="text-slate-400 text-xs sm:text-sm" />
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-slate-800 transition">
                    <FaCamera className="text-[9px]" />
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>

                <div className="flex-1 space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <FaUser className="absolute left-3 text-slate-400 text-xs pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Liam Sterling"
                      required
                      className="w-full pl-8 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <FaEnvelope className="absolute left-3 text-slate-400 text-xs pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. liam@example.com"
                    required
                    className="w-full pl-8 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition"
                  />
                </div>
              </div>

              {/* Phone Number with +91 Prefix */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Mobile Number
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-2.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-600 text-xs font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    required
                    maxLength={10}
                    className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-r-xl text-base sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition"
                  />
                </div>
              </div>

              {/* Password Field with Interactive Strength Meter */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Create Password
                </label>
                <div className="relative flex items-center">
                  <FaLock className="absolute left-3 text-slate-400 text-xs pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full pl-8 pr-10 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs p-1"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Password Strength Visual Meter */}
                {password && (
                  <div className="pt-1 space-y-1 animate-fadeIn">
                    <div className="flex items-center space-x-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            step <= strength.score ? strength.color : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Security rating:</span>
                      <span className="font-semibold text-slate-700">{strength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms Agreement Checkbox */}
              <div className="pt-0.5">
                <label className="flex items-start space-x-2 text-[11px] text-slate-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-3.5 h-3.5 mt-0.5"
                  />
                  <span>
                    I agree to the Velura Terms & Privacy Policy to receive member discounts.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center space-x-2 w-full py-3 sm:py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm hover:shadow-md transition duration-200 disabled:opacity-50 group active:scale-98"
              >
                <span>{loading ? "Creating Account..." : "Create Account & Unlock Perks"}</span>
                <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">
                  &rarr;
                </span>
              </button>
            </form>

            {/* Footer Security Notice */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
              <span className="flex items-center space-x-1 text-[11px]">
                <FaShieldAlt className="text-emerald-500 text-xs shrink-0" />
                <span>Bank-Grade Data Encryption</span>
              </span>

              <p className="text-[11px]">
                Already a member?{" "}
                <Link to="/login" className="font-bold text-slate-900 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;
