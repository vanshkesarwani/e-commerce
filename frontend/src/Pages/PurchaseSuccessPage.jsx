import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Confetti from "react-confetti";
import { useCartStore } from "../Store/useCartStore";
import {
  FaCheckCircle,
  FaShoppingBag,
  FaHome,
  FaEnvelope,
  FaTruck,
} from "react-icons/fa";

// ==========================================
// LUXURY VELURA PURCHASE SUCCESS PAGE
// ==========================================
const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const { clearCart } = useCartStore();
  const [error, setError] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Safely clear cart upon landing on order success
    clearCart();
    setIsProcessing(false);
  }, [clearCart]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 font-semibold text-sm">Processing your order…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-card border border-slate-200 text-center space-y-4">
          <p className="text-red-500 font-bold">Something went wrong: {error}</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Confetti */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        gravity={0.08}
        style={{ zIndex: 99 }}
        numberOfPieces={500}
        recycle={false}
        colors={["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6"]}
      />

      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 pointer-events-none" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-100/50 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-100/40 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Main Card */}
      <div className="relative z-10 max-w-lg w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center shadow-xl animate-bounce-slow">
            <FaCheckCircle className="text-emerald-500 text-5xl" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 sm:px-10 py-6 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-widest mb-3">
              Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Thank You for Your Order!
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
              We're preparing your Velura package with care.
            </p>
          </div>

          {/* Order Details */}
          <div className="px-6 sm:px-10 py-6 space-y-5">
            {/* Confirmation Blurb */}
            <div className="flex items-start space-x-3 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <FaEnvelope className="text-indigo-600 text-base mt-0.5 shrink-0" />
              <p className="text-sm text-indigo-800">
                A confirmation email with your order details and tracking information has been sent to your registered address.
              </p>
            </div>

            {/* Order Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Order ID</p>
                <p className="text-sm font-black text-slate-900">#VLR-{Math.floor(Math.random() * 90000) + 10000}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Est. Delivery</p>
                <p className="text-sm font-black text-slate-900">3 – 5 Business Days</p>
              </div>
            </div>

            {/* Delivery Progress */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <FaCheckCircle className="text-white text-xs" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs">Order Placed</p>
                  <p className="text-slate-400 text-[11px]">Confirmed & being processed</p>
                </div>
              </div>
              <div className="ml-4 border-l-2 border-dashed border-slate-200 h-4" />
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <FaTruck className="text-indigo-500 text-xs" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs">Dispatched</p>
                  <p className="text-slate-400 text-[11px]">Estimated within 24–48 hours</p>
                </div>
              </div>
              <div className="ml-4 border-l-2 border-dashed border-slate-200 h-4" />
              <div className="flex items-center space-x-3 text-sm opacity-50">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <FaHome className="text-slate-400 text-xs" />
                </div>
                <div>
                  <p className="font-bold text-slate-600 text-xs">Delivered</p>
                  <p className="text-slate-400 text-[11px]">3–5 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="px-6 sm:px-10 pb-8 space-y-3">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition duration-200"
            >
              <FaShoppingBag />
              <span>Continue Shopping</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center justify-center w-full py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm rounded-2xl transition duration-200"
            >
              View My Orders
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          Need help? Email us at{" "}
          <span className="text-indigo-600 font-semibold">support@velura.com</span>
        </p>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;