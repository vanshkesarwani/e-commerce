import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../Store/useCartStore";
import {
  FaShoppingBag,
  FaArrowLeft,
  FaShieldAlt,
  FaTag,
  FaCheckCircle,
  FaTruck,
  FaLock,
  FaSearch,
  FaTimes,
  FaGift,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

// ==========================================
// LUXURY ORDER REVIEW & PRE-CHECKOUT SUMMARY
// ==========================================
const OrderSummary = () => {
  const {
    cart,
    selectedItemIds,
    getSelectedItems,
    total,
    subtotal,
    coupon,
    isCouponApplied,
    applyCoupon,
    removeCoupon,
    getCartItems,
    availableCoupons,
    fetchAvailableCoupons,
    isLoading,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [showCouponDropdown, setShowCouponDropdown] = useState(false);
  const [showOffersPanel, setShowOffersPanel] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCartItems();
    fetchAvailableCoupons();
  }, [getCartItems, fetchAvailableCoupons]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCouponDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedItems = getSelectedItems();
  const displayItems = selectedItems.length > 0 ? selectedItems : cart;

  const filteredCoupons = availableCoupons.filter((c) =>
    c.code.toLowerCase().includes(couponCode.trim().toLowerCase())
  );

  const handleApplyCouponDirect = (code) => {
    if (!code || !code.trim()) return;
    applyCoupon(code.trim().toUpperCase());
    setCouponCode(code.trim().toUpperCase());
    setShowCouponDropdown(false);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    handleApplyCouponDirect(couponCode);
  };

  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = total + shippingFee + tax;
  const discountAmount =
    coupon && coupon.discountPercentage
      ? Math.round(subtotal * (coupon.discountPercentage / 100))
      : 0;

  if (isLoading && cart.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <Link
            to="/cart"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 transition"
          >
            <FaArrowLeft className="mr-2" />
            Back to Cart
          </Link>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Step 1 of 3: Order Review
          </span>
        </div>

        {displayItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm mt-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <FaShoppingBag className="text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              No items selected for checkout
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Please go back to your shopping cart and select the items you wish to purchase.
            </p>
            <Link
              to="/cart"
              className="inline-flex items-center px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition"
            >
              Return to Cart
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Order Summary
                </h1>
                <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  {displayItems.length} selected {displayItems.length === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Items List Preview */}
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
                {displayItems.map((item) => (
                  <div key={item._id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 p-1 shrink-0 overflow-hidden border border-slate-200">
                        <img
                          src={item.productImage?.url || "https://via.placeholder.com/100"}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Qty: {item.quantity || 1} &times; ₹{item.price?.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 shrink-0">
                      ₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Form with Suggestions */}
              <div className="pt-2 border-t border-slate-100" ref={dropdownRef}>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Promo Code
                  </label>
                  {availableCoupons.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowOffersPanel((prev) => !prev)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center space-x-1"
                    >
                      <FaGift className="text-amber-500 text-[11px]" />
                      <span>{showOffersPanel ? "Hide" : `Available (${availableCoupons.length})`}</span>
                    </button>
                  )}
                </div>

                {isCouponApplied && coupon ? (
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs shadow-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        %
                      </span>
                      <div>
                        <span className="font-bold uppercase tracking-wider">{coupon.code}</span> applied ({coupon.discountPercentage}% discount)
                        <span className="block text-[10px] text-emerald-700">Saved ₹{discountAmount}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-red-600 font-bold hover:underline text-xs bg-white px-2 py-1 rounded-md border border-red-100"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Search or enter coupon (e.g. VELURA20)"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setShowCouponDropdown(true);
                          }}
                          onFocus={() => setShowCouponDropdown(true)}
                          className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                        <FaTag className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
                      >
                        Apply
                      </button>
                    </form>

                    {/* Suggestions Dropdown */}
                    {showCouponDropdown && (
                      <div className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto">
                        {filteredCoupons.length > 0 ? (
                          filteredCoupons.map((c) => (
                            <div
                              key={c._id || c.code}
                              onClick={() => handleApplyCouponDirect(c.code)}
                              className="p-2.5 hover:bg-indigo-50 cursor-pointer flex items-center justify-between text-xs transition"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="font-extrabold text-slate-900 tracking-wider uppercase">
                                  {c.code}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  {c.discountPercentage}% OFF
                                </span>
                              </div>
                              <span className="text-[11px] font-bold text-indigo-600">
                                Apply
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-xs text-slate-400">
                            No matching coupons
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Financial Calculation */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {coupon && coupon.discountPercentage && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({coupon.discountPercentage}%)</span>
                    <span className="font-semibold">
                      -₹{discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-semibold text-slate-900">
                    ₹{tax.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-medium">Free</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-slate-100 text-base">
                  <div>
                    <span className="text-sm font-bold text-slate-900">Total</span>
                    <span className="block text-[11px] text-slate-400 font-normal">Taxes included</span>
                  </div>
                  <span className="font-bold text-slate-900 text-xl tracking-tight">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Checkout Action */}
              <div className="pt-2 space-y-3">
                <Link
                  to="/address"
                  className="flex items-center justify-center space-x-2 w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-2xl shadow-sm hover:shadow-md transition duration-200 group"
                >
                  <span>Proceed to Delivery Address</span>
                  <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </Link>

                <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 font-medium">
                  <FaLock className="text-[10px]" />
                  <span>Secure SSL Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;