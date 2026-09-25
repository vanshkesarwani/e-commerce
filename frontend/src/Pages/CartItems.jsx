import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../Store/useCartStore";
import toast from "react-hot-toast";
import {
  FaTrashAlt,
  FaArrowLeft,
  FaShieldAlt,
  FaTag,
  FaShoppingBag,
  FaCheck,
  FaSearch,
  FaPercent,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaGift,
  FaCheckCircle,
  FaRegHeart,
  FaShareAlt,
  FaTimesCircle,
  FaLock,
} from "react-icons/fa";

// ==========================================
// LUXURY CART WITH ITEM SELECTION & SMART COUPON SUGGESTIONS
// ==========================================
const CartItems = () => {
  const {
    cart,
    selectedItemIds,
    total,
    subtotal,
    coupon,
    isCouponApplied,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeFromCart,
    getCartItems,
    toggleSelectItem,
    selectAllItems,
    deselectAllItems,
    removeSelectedItems,
    availableCoupons,
    fetchAvailableCoupons,
    isLoadingCoupons,
    isLoading,
  } = useCartStore();

  const [couponSearch, setCouponSearch] = useState("");
  const [showCouponDropdown, setShowCouponDropdown] = useState(false);
  const [showOffersPanel, setShowOffersPanel] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCartItems();
    fetchAvailableCoupons();
  }, [getCartItems, fetchAvailableCoupons]);

  // Close coupon suggestions dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCouponDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter coupons based on search input
  const filteredCoupons = availableCoupons.filter((c) =>
    c.code.toLowerCase().includes(couponSearch.trim().toLowerCase())
  );

  const handleApplyCouponCode = (code) => {
    if (!code || !code.trim()) return;
    applyCoupon(code.trim().toUpperCase());
    setCouponSearch(code.trim().toUpperCase());
    setShowCouponDropdown(false);
  };

  const handleFormApply = (e) => {
    e.preventDefault();
    if (!couponSearch.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    handleApplyCouponCode(couponSearch);
  };

  const isAllSelected =
    cart.length > 0 && selectedItemIds.length === cart.length;
  const isPartiallySelected =
    selectedItemIds.length > 0 && selectedItemIds.length < cart.length;

  const selectedCount = selectedItemIds.length;
  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = total + shippingFee;
  const discountAmount =
    coupon && coupon.discountPercentage
      ? Math.round(subtotal * (coupon.discountPercentage / 100))
      : 0;

  if (isLoading && cart.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[65vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <div className="flex items-center justify-between pb-8 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Select items, apply promotional discounts, and proceed to checkout
            </p>
          </div>
          <Link
            to="/"
            className="hidden sm:flex items-center text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 transition"
          >
            <FaArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl p-12 sm:p-20 text-center border border-slate-200 shadow-sm mt-8">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Your Shopping Cart is Empty
            </h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
              Looks like you haven't added anything to your cart yet. Explore our curated catalog and find your next favorite item!
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition transform hover:scale-105"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          /* Split Layout: Cart List (Left) + Summary (Right) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">

            {/* Left: Cart Items List & Selection Management */}
            <div className="lg:col-span-8 space-y-4">

              {/* Select All Controls Header Bar (Amazon / Flipkart Style) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between shadow-xs">
                <div className="flex items-center space-x-3">
                  <label className="relative flex items-center cursor-pointer select-none group">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={() => {
                        if (isAllSelected) {
                          deselectAllItems();
                        } else {
                          selectAllItems();
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-md border-2 border-slate-300 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 flex items-center justify-center transition shadow-xs group-hover:border-indigo-400">
                      {isAllSelected && <FaCheck className="text-white text-[10px]" />}
                      {isPartiallySelected && (
                        <div className="w-2 h-2 rounded-xs bg-indigo-600" />
                      )}
                    </div>
                    <span className="ml-3 text-xs sm:text-sm font-bold text-slate-800">
                      Select All
                    </span>
                  </label>

                  <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100/80">
                    {selectedCount} of {cart.length} selected
                  </span>
                </div>

                {/* Right: Amazon / Flipkart Style Only Icons */}
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  {selectedCount > 0 ? (
                    <>
                      {/* Deselect All Icon Button */}
                      <button
                        type="button"
                        onClick={deselectAllItems}
                        className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition relative"
                        title="Deselect all items"
                        aria-label="Deselect all"
                      >
                        <FaTimesCircle className="text-base text-slate-500 hover:text-slate-700" />
                      </button>

                      {/* Save for later / Wishlist Icon */}
                      <button
                        type="button"
                        onClick={() =>
                          toast.success(`${selectedCount} item(s) saved to wishlist!`, {
                            icon: "❤️",
                          })
                        }
                        className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition relative"
                        title={`Save ${selectedCount} selected item(s) for later`}
                        aria-label="Save for later"
                      >
                        <FaRegHeart className="text-base" />
                      </button>

                      {/* Share Icon */}
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(window.location.href);
                          }
                          toast.success("Cart link copied to clipboard!", {
                            icon: "🔗",
                          });
                        }}
                        className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition relative"
                        title="Share selected items"
                        aria-label="Share"
                      >
                        <FaShareAlt className="text-sm" />
                      </button>

                      {/* Delete / Remove Selected Icon Button */}
                      <button
                        type="button"
                        onClick={removeSelectedItems}
                        className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition relative group"
                        title={`Remove ${selectedCount} selected item(s)`}
                        aria-label="Remove selected items"
                      >
                        <FaTrashAlt className="text-base text-red-500 group-hover:scale-110 transition-transform" />
                        <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                          {selectedCount}
                        </span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={selectAllItems}
                      className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                      title="Select all items"
                      aria-label="Select all"
                    >
                      <FaCheck className="text-sm" />
                    </button>
                  )}
                </div>
              </div>


              {/* Cart Items List */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card divide-y divide-slate-100 overflow-hidden">
                {cart.map((item) => {
                  const isSelected = selectedItemIds.includes(item._id);

                  return (
                    <div
                      key={item._id}
                      className={`p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 transition duration-150 ${isSelected
                        ? "bg-white hover:bg-slate-50/70"
                        : "bg-slate-50/40 opacity-70 hover:opacity-100 hover:bg-slate-50"
                        }`}
                    >
                      {/* Checkbox & Item Info */}
                      <div className="flex items-center space-x-4 w-full sm:w-auto">
                        {/* Item Checkbox */}
                        <label className="relative flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectItem(item._id)}
                            className="sr-only peer"
                          />
                          <div
                            className={`w-5 h-5 rounded-md border-2 transition flex items-center justify-center ${isSelected
                              ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                              : "border-slate-300 bg-white"
                              }`}
                          >
                            {isSelected && <FaCheck className="text-[10px]" />}
                          </div>
                        </label>

                        {/* Product Thumbnail */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 p-2 shrink-0 flex items-center justify-center overflow-hidden border border-slate-200">
                          <img
                            src={
                              item.productImage?.url ||
                              "https://via.placeholder.com/150"
                            }
                            alt={item.title}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Details */}
                        <div className="space-y-1 min-w-0">
                          <Link
                            to={`/product/${item._id}`}
                            className="text-sm sm:text-base font-bold text-slate-800 hover:text-indigo-600 transition line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <p className="text-xs text-slate-500">
                            Category:{" "}
                            <span className="font-semibold text-slate-700">
                              {item.category || "General"}
                            </span>
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-extrabold text-indigo-600">
                              ₹{item.price}
                            </span>
                            {!isSelected && (
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                Unselected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                        <div className="flex items-center space-x-2 border border-slate-200 rounded-full px-2 py-1 bg-slate-50">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-full bg-white text-slate-700 flex items-center justify-center font-bold hover:bg-slate-200 transition shadow-xs text-sm"
                            title="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded-full bg-white text-slate-700 flex items-center justify-center font-bold hover:bg-slate-200 transition shadow-xs text-sm"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right min-w-[80px]">
                          <p className="text-base font-black text-slate-900">
                            ₹
                            {(
                              (Number(item.price) || 0) *
                              (Number(item.quantity) || 1)
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item._id)}
                          className="text-slate-400 hover:text-red-500 transition p-2 rounded-lg hover:bg-red-50"
                          title="Remove item"
                        >
                          <FaTrashAlt className="text-sm" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Security Banner */}
              <div className="flex items-center space-x-3 text-xs text-slate-500 px-4 pt-2">
                <FaShieldAlt className="text-emerald-500 text-base" />
                <span>
                  Encrypted checkout. Only selected items will be processed during checkout.
                </span>
              </div>
            </div>

            {/* Right: Sticky Order Summary & Smart Coupon Bar */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-7 space-y-4 sm:space-y-5 sticky top-28">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Order Summary
                  </h2>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {selectedCount} {selectedCount === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Promo Code Section */}
                <div className="space-y-2.5" ref={dropdownRef}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Promo Code</span>
                    {availableCoupons.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowOffersPanel((prev) => !prev)}
                        className="font-medium text-slate-500 hover:text-slate-900 inline-flex items-center space-x-1 transition"
                      >
                        <FaTag className="text-amber-500 text-[10px]" />
                        <span>{showOffersPanel ? "Hide offers" : `Offers (${availableCoupons.length})`}</span>
                        {showOffersPanel ? (
                          <FaChevronUp className="text-[9px]" />
                        ) : (
                          <FaChevronDown className="text-[9px]" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Active Applied Coupon Badge */}
                  {isCouponApplied && coupon ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 text-xs animate-fadeIn">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                          ✓
                        </span>
                        <div>
                          <span className="font-bold tracking-wider">{coupon.code}</span>
                          <span className="text-emerald-700 ml-1.5 text-[11px]">
                            ({coupon.discountPercentage}% off • -₹{discountAmount.toLocaleString("en-IN")})
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    /* Clean Promo Input */
                    <div className="relative">
                      <form onSubmit={handleFormApply} className="flex space-x-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Enter promo code"
                            value={couponSearch}
                            onChange={(e) => {
                              setCouponSearch(e.target.value.toUpperCase());
                              setShowCouponDropdown(true);
                            }}
                            onFocus={() => setShowCouponDropdown(true)}
                            className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold tracking-wide text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition"
                          />
                          <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]" />
                          {couponSearch && (
                            <button
                              type="button"
                              onClick={() => {
                                setCouponSearch("");
                                setShowCouponDropdown(true);
                              }}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[11px]"
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition duration-200 shadow-xs"
                        >
                          Apply
                        </button>
                      </form>

                      {/* Dropdown Suggestions Menu */}
                      {showCouponDropdown && (
                        <div className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto animate-fadeIn">
                          <div className="px-3 py-2 bg-slate-50 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                            <span>Available Offers</span>
                            <span className="text-slate-400 text-[10px]">Select to apply</span>
                          </div>

                          {filteredCoupons.length > 0 ? (
                            filteredCoupons.map((c) => (
                              <div
                                key={c._id || c.code}
                                onClick={() => handleApplyCouponCode(c.code)}
                                className="p-3 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-slate-900 text-xs tracking-wider uppercase group-hover:text-indigo-600 transition">
                                      {c.code}
                                    </span>
                                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                      {c.discountPercentage}% OFF
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400">
                                    Valid on selected items
                                  </p>
                                </div>

                                <span className="text-[11px] font-semibold text-slate-600 group-hover:text-indigo-600 transition">
                                  Apply &rarr;
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-xs text-slate-400">
                              No matching offers found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expandable Offers Panel */}
                  {showOffersPanel && (
                    <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                          <FaTag className="text-amber-500 text-xs" />
                          <span>Member Offers</span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Click to apply
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-1.5">
                        {availableCoupons.map((c) => (
                          <div
                            key={c._id || c.code}
                            onClick={() => handleApplyCouponCode(c.code)}
                            className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between shadow-2xs hover:border-slate-400 transition cursor-pointer group"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 font-bold text-xs tracking-wider">
                                {c.code}
                              </span>
                              <span className="text-xs font-semibold text-emerald-600">
                                {c.discountPercentage}% off
                              </span>
                            </div>

                            <span className="text-xs font-medium text-slate-500 group-hover:text-slate-900 transition">
                              Apply
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Clean Financial Breakdown */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {coupon && coupon.discountPercentage && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount ({coupon.discountPercentage}%)</span>
                      <span className="font-semibold">
                        -₹{discountAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

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

                  {/* Grand Total */}
                  <div className="flex justify-between items-baseline pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-sm font-bold text-slate-900">Total</span>
                      <span className="block text-[11px] text-slate-400 font-normal">Taxes included</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                {selectedCount > 0 ? (
                  <Link
                    to="/address"
                    className="flex items-center justify-center space-x-2 w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-2xl shadow-sm hover:shadow-md transition duration-200 group"
                  >
                    <span>Proceed to Checkout</span>
                    <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3.5 bg-slate-100 text-slate-400 font-semibold text-sm rounded-2xl cursor-not-allowed"
                  >
                    Select items to checkout
                  </button>
                )}

                {/* Secure Trust Guarantee */}
                <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 font-medium pt-1">
                  <FaLock className="text-[10px] text-slate-400" />
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

export default CartItems;