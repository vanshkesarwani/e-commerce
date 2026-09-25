import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthProvider";
import Logo from "../components/Logo";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaKey,
} from "react-icons/fa";

// ==========================================
// LUXURY RESET PASSWORD PAGE
// ==========================================
const ResetPassword = () => {
  const { token: routeToken } = useParams();
  const navigate = useNavigate();
  const { setProfile, setIsAuthenticated } = useAuth();

  const [token, setToken] = useState(routeToken || "");
  const [isVerifyingToken, setIsVerifyingToken] = useState(Boolean(routeToken));
  const [tokenValid, setTokenValid] = useState(null); // null = unknown, true = valid, false = invalid
  const [associatedEmail, setAssociatedEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Auto-verify token on mount if present in URL
  useEffect(() => {
    if (routeToken) {
      verifyToken(routeToken);
    }
  }, [routeToken]);

  const verifyToken = async (tokenToVerify) => {
    try {
      setIsVerifyingToken(true);
      const { data } = await apiClient.get(
        `/users/password/reset/verify/${tokenToVerify}`
      );
      if (data?.success) {
        setTokenValid(true);
        setAssociatedEmail(data.email || "");
      } else {
        setTokenValid(false);
      }
    } catch (err) {
      console.warn("Token verification error:", err.message);
      setTokenValid(false);
    } finally {
      setIsVerifyingToken(false);
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "", color: "bg-slate-200" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-rose-500" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 3, label: "Good", color: "bg-blue-500" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 0, label: "", color: "bg-slate-200" };
    }
  };

  const strength = getPasswordStrength(password);

  const handleReset = async (e) => {
    if (e) e.preventDefault();

    const activeToken = token.trim();
    if (!activeToken) {
      toast.error("Reset token is required");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please enter and confirm your new password");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { data } = await apiClient.post(
        `/users/password/reset/${activeToken}`,
        {
          password,
          confirmPassword,
        }
      );

      toast.success(data?.message || "Password updated successfully!");
      setResetSuccess(true);

      // If user session returned, log them in seamlessly
      if (data?.token) {
        localStorage.setItem("jwt", data.token);
      }
      if (data?.user) {
        setProfile(data.user);
        setIsAuthenticated(true);
      }

      // Automatically navigate to home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(
        error.message || "Failed to reset password. The link may have expired."
      );
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
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop"
          alt="Velura Luxury Editorial"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.38] scale-105 transition-transform duration-10000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Header Monogram */}
        <div className="relative z-10">
          <Logo size="default" />
        </div>

        {/* Middle Feature Headline */}
        <div className="relative z-10 max-w-lg space-y-6">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-widest">
            Security Checkpoint
          </span>
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Create a New Standard of Protection.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Your new password should be unique and distinct. We recommend using a blend of uppercase letters, numbers, and symbols to ensure maximum safety.
          </p>

          {/* Floating Glassmorphic Requirements Card */}
          <div className="glass-card p-5 rounded-2xl shadow-xl space-y-3 border border-white/20">
            <div className="flex items-center space-x-3 text-amber-400">
              <FaShieldAlt className="text-xl" />
              <span className="font-bold text-white text-sm">Security Recommendations</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>At least 8 characters in length</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Include at least one uppercase letter (A-Z)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Include numbers and special symbols</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Guarantee */}
        <div className="relative z-10 flex items-center space-x-2 text-xs text-slate-400">
          <FaShieldAlt className="text-amber-400 text-sm" />
          <span>Encrypted with SHA-256 and Bcrypt cryptographic hashing.</span>
        </div>
      </div>

      {/* 2. Right Interactive Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden mb-4">
            <Logo size="default" light={true} />
          </div>

          {/* Token Verification Loading State */}
          {isVerifyingToken && (
            <div className="text-center py-12 space-y-4">
              <div className="w-10 h-10 mx-auto border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-600">
                Verifying recovery security token...
              </p>
            </div>
          )}

          {/* Token Invalid / Expired State */}
          {!isVerifyingToken && tokenValid === false && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-3xl shadow-inner border border-rose-200">
                <FaExclamationTriangle />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">
                  Reset Link Expired
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  This password reset link is invalid or has expired for security reasons. Password reset links are valid for 15 minutes.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/forgot"
                  className="inline-flex items-center justify-center space-x-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg transition"
                >
                  <span>Request New Link</span>
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}

          {/* Reset Success State */}
          {!isVerifyingToken && resetSuccess && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl shadow-inner border border-emerald-200">
                <FaCheckCircle />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">
                  Password Updated!
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your password has been securely reset. You are now logged in. Redirecting to Velura storefront...
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center space-x-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg transition"
                >
                  <span>Continue to Store</span>
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          )}

          {/* Form State (When token is valid or token input is shown) */}
          {!isVerifyingToken && tokenValid !== false && !resetSuccess && (
            <>
              {/* Header */}
              <div className="space-y-3">
                <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  New Password
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Set New Password
                </h2>
                <p className="text-sm text-slate-500">
                  {associatedEmail ? (
                    <>
                      Updating password for{" "}
                      <span className="font-semibold text-slate-700">
                        {associatedEmail}
                      </span>
                    </>
                  ) : (
                    "Please choose a strong password to protect your account."
                  )}
                </p>
              </div>

              {/* Reset Form */}
              <form onSubmit={handleReset} className="space-y-5">
                {/* Manual Token field if not in URL */}
                {!routeToken && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="reset-token"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                    >
                      Reset Token
                    </label>
                    <div className="relative flex items-center">
                      <FaKey className="absolute left-4 text-slate-400 text-sm pointer-events-none" />
                      <input
                        id="reset-token"
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Paste your 40-character reset token"
                        required
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none transition shadow-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="reset-password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    New Password
                  </label>
                  <div className="relative flex items-center">
                    <FaLock className="absolute left-4 text-slate-400 text-sm pointer-events-none" />
                    <input
                      id="reset-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      required
                      autoFocus
                      className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none transition shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none text-sm"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="pt-1.5 space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-500">Strength:</span>
                        <span
                          className={
                            strength.score >= 3
                              ? "text-emerald-600"
                              : strength.score === 2
                              ? "text-amber-600"
                              : "text-rose-500"
                          }
                        >
                          {strength.label}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex space-x-1">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-full flex-1 rounded-full transition-all duration-300 ${
                              strength.score >= step
                                ? strength.color
                                : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="reset-confirm-password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative flex items-center">
                    <FaLock className="absolute left-4 text-slate-400 text-sm pointer-events-none" />
                    <input
                      id="reset-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      required
                      className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none transition shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none text-sm"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
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
                      <span>Update Password</span>
                      <FaArrowRight className="text-xs" />
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login link */}
              <div className="pt-2 text-center text-xs text-slate-500">
                Remember your credentials?{" "}
                <Link
                  to="/login"
                  className="font-bold text-blue-700 hover:text-blue-900 hover:underline transition"
                >
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
