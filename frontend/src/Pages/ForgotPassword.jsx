import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import Logo from "../components/Logo";
import {
  FaEnvelope,
  FaArrowRight,
  FaArrowLeft,
  FaShieldAlt,
  FaKey,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

// ==========================================
// LUXURY FORGOT PASSWORD PAGE
// ==========================================
const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devResetToken, setDevResetToken] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your registered email address");
      return;
    }

    try {
      setLoading(true);
      const { data } = await apiClient.post("/users/password/forgot", {
        email: email.trim().toLowerCase(),
      });

      toast.success(data?.message || "Reset link dispatched to your email");
      setSubmitted(true);

      // In dev or local testing, if token is returned or available
      if (data?.resetToken) {
        setDevResetToken(data.resetToken);
      }

      // Start 60 second resend cooldown
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Forgot password failure:", error);
      toast.error(error.message || "Failed to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* 1. Left Editorial Showcase (Visible on Large Screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-slate-900">
        {/* Background Visual with Dark Gradient Overlay */}
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop"
          alt="Velura Security Showcase"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.40] scale-105 transition-transform duration-10000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Header Monogram */}
        <div className="relative z-10">
          <Logo size="default" />
        </div>

        {/* Middle Feature Headline */}
        <div className="relative z-10 max-w-lg space-y-6">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-widest">
            Account Recovery
          </span>
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Seamless Security for Your Peace of Mind.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Lost access to your Velura account? We provide end-to-end encrypted password recovery to get you back to your curated collections swiftly and securely.
          </p>

          {/* Floating Glassmorphic Security Feature Card */}
          <div className="glass-card p-5 rounded-2xl shadow-xl space-y-3 border border-white/20">
            <div className="flex items-center space-x-3 text-amber-400">
              <FaShieldAlt className="text-xl" />
              <span className="font-bold text-white text-sm">Velura Fortified Protocol</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Cryptographically signed 256-bit single-use tokens</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Strict 15-minute token expiration limit</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Zero plain-text password storage</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Guarantee */}
        <div className="relative z-10 flex items-center space-x-2 text-xs text-slate-400">
          <FaShieldAlt className="text-amber-400 text-sm" />
          <span>Encrypted authentication system & secure recovery channel.</span>
        </div>
      </div>

      {/* 2. Right Interactive Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden mb-4">
            <Logo size="default" light={true} />
          </div>

          {!submitted ? (
            <>
              {/* Header */}
              <div className="space-y-3">
                <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  Forgot Password
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Recover Password
                </h2>
                <p className="text-sm text-slate-500">
                  Enter the email address registered with your Velura account. We will send you a secure verification link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="forgot-email"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <FaEnvelope className="absolute left-4 text-slate-400 text-sm pointer-events-none" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      required
                      autoFocus
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none transition shadow-xs"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Recovery Link</span>
                      <FaArrowRight className="text-xs" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Post-Submission Confirmation Screen */
            <div className="space-y-6 text-center animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-3xl shadow-inner border border-amber-500/20">
                <FaEnvelope />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">
                  Check Your Inbox
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We've sent a password reset link to:
                </p>
                <p className="text-sm font-bold text-indigo-700 bg-indigo-50 py-1.5 px-4 rounded-lg inline-block">
                  {email}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                  <FaClock className="text-amber-500" />
                  <span>Link valid for 15 minutes</span>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  If you don't receive an email within a few minutes, please check your spam folder or request a new link below.
                </p>
              </div>

              {/* Dev token quick access for testing if available */}
              {devResetToken && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-left space-y-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                    ⚡ Instant Test Link Ready:
                  </span>
                  <Link
                    to={`/reset-password/${devResetToken}`}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    <span>Click here to test reset password immediately</span>
                    <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              )}

              {/* Resend button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={resendCooldown > 0 || loading}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:text-slate-400 disabled:cursor-not-allowed transition"
                >
                  {resendCooldown > 0
                    ? `Resend link in ${resendCooldown}s`
                    : "Didn't receive the email? Click to resend"}
                </button>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 font-bold text-slate-600 hover:text-slate-900 transition"
            >
              <FaArrowLeft className="text-[10px]" />
              <span>Back to Sign In</span>
            </Link>

            <Link
              to="/reset-password"
              className="font-medium text-indigo-600 hover:text-indigo-800 transition"
            >
              Have a reset token? Enter it here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
