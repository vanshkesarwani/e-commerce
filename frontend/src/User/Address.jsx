import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import { useCartStore } from "../Store/useCartStore";
import {
  FaCheckCircle,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaCreditCard,
  FaLock,
  FaTruck,
  FaMoneyBillWave,
  FaTag,
} from "react-icons/fa";

// ==========================================
// CLASSY LUXURY CHECKOUT & ADDRESS EXPERIENCE
// ==========================================
const Address = () => {
  const {
    cart,
    selectedItemIds,
    getCartItems,
    coupon,
  } = useCartStore();

  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",
    phoneNo: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [loading, setLoading] = useState(false);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        await getCartItems();
        const { data } = await apiClient.get("/cart");
        const allItems = Array.isArray(data) ? data : [];
        setCartData(allItems);
      } catch (error) {
        console.error("Cart fetch error:", error);
      }
    };
    fetchCart();
  }, [getCartItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Determine active selected items for checkout
  const selectedCartItems =
    cart.length > 0 && selectedItemIds.length > 0
      ? cart.filter((item) => selectedItemIds.includes(item._id))
      : cart.length > 0
      ? cart
      : cartData;

  const displayItems = selectedCartItems.length > 0 ? selectedCartItems : cartData;

  const rawItemsPrice = displayItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const discountAmount =
    coupon && coupon.discountPercentage
      ? Math.round(rawItemsPrice * (coupon.discountPercentage / 100))
      : 0;

  const itemsPrice = Math.max(0, rawItemsPrice - discountAmount);
  const taxPrice = Math.round(itemsPrice * 0.05); // 5% GST
  const shippingPrice = itemsPrice > 999 || itemsPrice === 0 ? 0 : 99;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (displayItems.length === 0) {
      toast.error("No items selected for checkout. Please return to cart and select items.");
      return navigate("/cart");
    }

    if (
      !address.address.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.pinCode ||
      !address.phoneNo
    ) {
      toast.error("Please fill in all delivery details");
      return;
    }

    const orderData = {
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderItems: displayItems.map((item) => ({
        product: item._id,
        name: item.title,
        price: item.price,
        image: item.productImage?.url || "https://via.placeholder.com/150",
        quantity: item.quantity || 1,
      })),
      shippingInfo: address,
      paymentInfo: {
        id: "PAY-" + Date.now(),
        status: paymentMethod === "cod" ? "pending" : "succeeded",
        method: paymentMethod,
      },
    };

    try {
      setLoading(true);
      const response = await apiClient.post("/order/new", orderData);

      if (response.data.success) {
        toast.success("Order placed successfully! Thank you for your purchase.");
        // Clear only the purchased items from cart
        for (const item of displayItems) {
          try {
            await apiClient.delete(`/cart/delete/${item._id}`);
          } catch (e) {}
        }
        await getCartItems();

        navigate("/purchase-success");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sleek Breadcrumb / Checkout Step Progress */}
        <div className="flex items-center justify-between max-w-lg mx-auto mb-6 sm:mb-10 text-[11px] sm:text-xs font-semibold">
          <Link
            to="/cart"
            className="flex items-center space-x-1 sm:space-x-1.5 text-slate-500 hover:text-slate-900 transition"
          >
            <FaCheckCircle className="text-emerald-500 text-xs" />
            <span>Bag</span>
          </Link>

          <span className="h-px w-6 sm:w-16 bg-slate-200" />

          <div className="flex items-center space-x-1 sm:space-x-1.5 text-slate-900 font-bold">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Delivery & Review</span>
          </div>

          <span className="h-px w-6 sm:w-16 bg-slate-200" />

          <div className="flex items-center space-x-1 sm:space-x-1.5 text-slate-400">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">
              3
            </span>
            <span className="hidden xs:inline">Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left: Refined Delivery Details Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-sm space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center text-sm shadow-xs">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                    Delivery Details
                  </h1>
                  <p className="text-xs text-slate-400">
                    Where should we send your order?
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                <FaTruck className="text-[10px]" />
                <span>Express Dispatch</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Street Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Street Address, Apartment or Landmark
                </label>
                <input
                  type="text"
                  name="address"
                  value={address.address}
                  onChange={handleChange}
                  placeholder="e.g. 402, Sunset Heights, Linking Road"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition bg-slate-50/50 focus:bg-white"
                />
              </div>

              {/* City & State Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    placeholder="e.g. Maharashtra"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* PIN Code & Country Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={address.pinCode}
                    onChange={handleChange}
                    placeholder="6-digit postal code"
                    required
                    maxLength={6}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={address.country}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-100/70 cursor-not-allowed focus:outline-none"
                    readOnly
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Contact Phone Number
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-500 text-xs font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phoneNo"
                    value={address.phoneNo}
                    onChange={handleChange}
                    placeholder="10-digit mobile for delivery updates"
                    required
                    maxLength={10}
                    className="w-full px-4 py-2.5 rounded-r-xl border border-slate-200 text-base sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Interactive Payment Method Choice */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Payment Option
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setPaymentMethod("online")}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      paymentMethod === "online"
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50/60 border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <FaCreditCard className={paymentMethod === "online" ? "text-amber-400" : "text-slate-500"} />
                      <div>
                        <p className="text-xs font-bold leading-tight">Online Payment</p>
                        <p className={`text-[10px] ${paymentMethod === "online" ? "text-slate-300" : "text-slate-400"}`}>
                          UPI, Cards, NetBanking
                        </p>
                      </div>
                    </div>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === "online" ? "border-amber-400 bg-amber-400 text-slate-900 text-[10px]" : "border-slate-300"
                    }`}>
                      {paymentMethod === "online" && "✓"}
                    </span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      paymentMethod === "cod"
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50/60 border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <FaMoneyBillWave className={paymentMethod === "cod" ? "text-amber-400" : "text-slate-500"} />
                      <div>
                        <p className="text-xs font-bold leading-tight">Cash on Delivery</p>
                        <p className={`text-[10px] ${paymentMethod === "cod" ? "text-slate-300" : "text-slate-400"}`}>
                          Pay when delivered
                        </p>
                      </div>
                    </div>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === "cod" ? "border-amber-400 bg-amber-400 text-slate-900 text-[10px]" : "border-slate-300"
                    }`}>
                      {paymentMethod === "cod" && "✓"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Classy Submit Button */}
              <div className="pt-3 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-2xl shadow-sm hover:shadow-md transition duration-200 disabled:opacity-60 group"
                >
                  <FaLock className="text-xs text-amber-400" />
                  <span>
                    {loading
                      ? "Processing Order..."
                      : `Place Order • ₹${totalPrice.toLocaleString("en-IN")}`}
                  </span>
                  <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">
                    &rarr;
                  </span>
                </button>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
                  <Link
                    to="/cart"
                    className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-900 transition"
                  >
                    <FaArrowLeft className="text-[10px]" />
                    <span>Return to bag</span>
                  </Link>
                  <span className="flex items-center space-x-1 text-[11px] text-slate-400">
                    <FaShieldAlt className="text-emerald-500 text-[10px]" />
                    <span>Bank-grade 256-bit encryption</span>
                  </span>
                </div>
              </div>
            </form>
          </div>

          {/* Right: Order Review & Item Showcase */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/90 shadow-sm space-y-4 sm:space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Items in Order
                </h2>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {displayItems.length} {displayItems.length === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-slate-100">
                {displayItems.map((item) => (
                  <div key={item._id} className="pt-3 first:pt-0 flex items-center space-x-3 text-xs">
                    <img
                      src={item.productImage?.url || "https://via.placeholder.com/60"}
                      alt={item.title}
                      className="w-13 h-13 rounded-xl object-cover bg-slate-50 border border-slate-200/80 shrink-0"
                    />
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-semibold text-slate-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Qty: {item.quantity || 1}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900 text-sm whitespace-nowrap">
                      ₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="space-y-2.5 pt-3.5 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    ₹{rawItemsPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                {coupon && coupon.discountPercentage && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span className="flex items-center space-x-1">
                      <FaTag className="text-[10px]" />
                      <span>Coupon Discount ({coupon.discountPercentage}%)</span>
                    </span>
                    <span className="font-semibold">
                      -₹{discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span className="font-semibold text-slate-900">
                    ₹{taxPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {shippingPrice === 0 ? (
                      <span className="text-emerald-600 font-medium">Free</span>
                    ) : (
                      `₹${shippingPrice}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-sm font-bold text-slate-900">Total</span>
                    <span className="block text-[11px] text-slate-400 font-normal">Taxes included</span>
                  </div>
                  <span className="text-xl font-bold text-slate-900 tracking-tight">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Quality & Buyer Protection Guarantee */}
            <div className="bg-slate-900 text-slate-300 p-4 rounded-2xl border border-slate-800 text-xs space-y-1.5 shadow-sm">
              <div className="flex items-center space-x-2 text-white font-semibold">
                <FaShieldAlt className="text-amber-400 text-sm shrink-0" />
                <span>Velura Buyer Protection Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                100% genuine products directly sourced from verified artisans & brands. Easy 30-day returns and contactless express delivery.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;