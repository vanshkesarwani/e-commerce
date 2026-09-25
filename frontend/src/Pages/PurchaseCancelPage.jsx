import { Link } from "react-router-dom";
import {
  FaTimesCircle,
  FaArrowLeft,
  FaShoppingBag,
  FaHeadset,
  FaShieldAlt,
} from "react-icons/fa";

// ==========================================
// LUXURY VELURA PURCHASE CANCELLED PAGE
// ==========================================
const PurchaseCancelPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/60 via-slate-50 to-slate-100 pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-100/30 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-200/30 rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Main Card */}
      <div className="relative z-10 max-w-lg w-full">
        {/* Cancel Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-red-50 border-4 border-red-200 flex items-center justify-center shadow-xl">
            <FaTimesCircle className="text-red-500 text-5xl" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 sm:px-10 py-6 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-400/30 text-xs font-bold uppercase tracking-widest mb-3">
              Order Cancelled
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Payment Was Not Completed
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Your cart is saved and no charges have been made.
            </p>
          </div>

          {/* Info Section */}
          <div className="px-6 sm:px-10 py-6 space-y-4">
            {/* Info Box */}
            <div className="flex items-start space-x-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <FaShieldAlt className="text-amber-500 text-base mt-0.5 shrink-0" />
              <p className="text-sm text-amber-800">
                No payment has been charged to your account. Your items may still be in your cart and can be purchased any time.
              </p>
            </div>

            {/* Help Info */}
            <div className="flex items-start space-x-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <FaHeadset className="text-indigo-600 text-base mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-800 mb-0.5">Need assistance?</p>
                <p className="text-xs text-slate-500">
                  If you encountered an issue during checkout, our support team is here to help.{" "}
                  <span className="text-indigo-600 font-semibold">support@velura.com</span>
                </p>
              </div>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="px-6 sm:px-10 pb-8 space-y-3">
            <Link
              to="/cart"
              className="flex items-center justify-center space-x-2 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition duration-200"
            >
              <FaShoppingBag />
              <span>Return to Cart</span>
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 w-full py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm rounded-2xl transition duration-200"
            >
              <FaArrowLeft className="text-xs" />
              <span>Continue Browsing</span>
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          Your cart items are saved and waiting for you.
        </p>
      </div>
    </div>
  );
};

export default PurchaseCancelPage;