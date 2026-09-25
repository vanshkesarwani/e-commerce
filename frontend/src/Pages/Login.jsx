import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";
import apiClient from "../api/apiClient";
import Logo from "../components/Logo";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaArrowRight,
  FaStar,
  FaBolt,
  FaCheck,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

// ==========================================
// LUXURY E-COMMERCE LOGIN EXPERIENCE
// Highly responsive across Mobile, Tablet & Desktop
// ==========================================
const Login = () => {
  const { setProfile, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const { data } = await apiClient.post("/users/login", { email, password });

      if (data?.token) {
        localStorage.setItem("jwt", data.token);
      }

      toast.success(data?.message || "Welcome back to Velura!");
      const loggedUser = data.user || data;
      setProfile(loggedUser);
      setIsAuthenticated(true);

      if (loggedUser?.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failure:", error);
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Login for quick testing
  const handleQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    toast.success("Demo credentials loaded! Click Sign In.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50/30 flex items-center justify-center p-2.5 sm:p-6 lg:p-10 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Central Classy Luxury Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 transition-all">
        
        {/* Left Side: Desktop/Tablet Editorial Showcase (5 cols) */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 lg:p-10 bg-slate-950 text-white overflow-hidden">
          
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
            alt="Velura Editorial"
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
              <span>Member Privileges</span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
              Curated luxury for modern living.
            </h2>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px] shrink-0">
                  <FaCheck />
                </span>
                <span>Exclusive member pricing & seasonal drops</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px] shrink-0">
                  <FaCheck />
                </span>
                <span>Free express shipping on all orders over ₹999</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px] shrink-0">
                  <FaCheck />
                </span>
                <span>Effortless 30-day returns & doorstep exchange</span>
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
            <span className="text-[11px]">Rated 4.9/5 by 50k+ shoppers</span>
          </div>
        </div>

        {/* Right Side: Interactive Sign-In Form (7 cols) */}
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
                Curated Modern Luxury
              </p>
            </div>
            <span className="relative z-10 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
              Sign In
            </span>
          </div>

          <div className="p-5 sm:p-8 lg:p-12 space-y-5 sm:space-y-6">
            
            {/* Top Switcher */}
            <div>
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl max-w-xs mx-auto mb-5 text-xs font-semibold">
                <span className="flex-1 py-2 text-center rounded-xl bg-white text-slate-900 shadow-xs font-bold">
                  Sign In
                </span>
                <Link
                  to="/register"
                  className="flex-1 py-2 text-center rounded-xl text-slate-500 hover:text-slate-900 transition"
                >
                  Register
                </Link>
              </div>

              {/* Form Headline */}
              <div className="space-y-1 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Access your personalized bag, wishlist, and orders.
                </p>
              </div>
            </div>

            {/* Social Sign-In Buttons */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => toast("Google One-Tap is ready for live domain.", { icon: "ℹ️" })}
                className="flex items-center justify-center space-x-2 py-2.5 px-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition active:scale-95"
              >
                <FcGoogle className="text-base shrink-0" />
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => toast("Apple ID sign-in is ready for live domain.", { icon: "ℹ️" })}
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
                or continue with email
              </span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-3.5 sm:space-y-4">
              
              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <FaEnvelope className="absolute left-3.5 text-slate-400 text-xs pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <Link
                    to="/forgot"
                    className="text-xs font-medium text-slate-500 hover:text-slate-900 transition hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative flex items-center">
                  <FaLock className="absolute left-3.5 text-slate-400 text-xs pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 text-xs p-1"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Quick Demo Autofill */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-3.5 h-3.5"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => handleQuickDemo("demo@velura.com", "password123")}
                  className="inline-flex items-center space-x-1 text-amber-600 hover:text-amber-700 font-semibold text-[11px] transition active:scale-95"
                >
                  <FaBolt className="text-[10px]" />
                  <span>Auto-fill Demo</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center space-x-2 w-full py-3 sm:py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm hover:shadow-md transition duration-200 disabled:opacity-50 group active:scale-98"
              >
                <span>{loading ? "Authenticating..." : "Sign In to Account"}</span>
                <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">
                  &rarr;
                </span>
              </button>
            </form>

            {/* Footer Assistance & Security Notice */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
              <span className="flex items-center space-x-1 text-[11px]">
                <FaShieldAlt className="text-emerald-500 text-xs shrink-0" />
                <span>256-Bit SSL Encrypted Access</span>
              </span>

              <p className="text-[11px]">
                New to Velura?{" "}
                <Link to="/register" className="font-bold text-slate-900 hover:underline">
                  Create account
                </Link>
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;