import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import toast from "react-hot-toast"; // Add notifications for better UX

const stripePromise = loadStripe(
  "pk_test_51Ps4kv08o9GWutXxMP5nOoBWKsXgGHposJHhYmdGROVgHmHjzUn399D05CPyoIUQhspvNf9bRqPLlLGd0wvfyR1A00PFhuYXyO"
);

const OrderSummary = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // Fetch cart items on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const { data } = await axios.get("http://localhost:3900/api/cart", {
        withCredentials: true,
      });
      setCartItems(data || []);
      calculateTotalPrice(data || []);
      console.log(data);
    } catch (error) {
      console.error("Error fetching cart items:", error.message);
      toast.error("Failed to fetch cart items.");
    }
  };

  const calculateTotalPrice = (items) => {
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = coupon?.discountPercentage
      ? (subtotal * coupon.discountPercentage) / 100
      : 0;
    const total = subtotal - discount;
    setTotalPrice(total);
  };

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;

      if (cartItems.length === 0) {
        toast.error("Your cart is empty.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3900/api/payments/create-checkout-session",
        {
          products: cartItems,
          couponCode: coupon?.code || null,
        }
      );

      const session = response.data;

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error("Stripe Checkout error:", result.error.message);
        toast.error("Failed to redirect to payment gateway.");
      }
    } catch (error) {
      console.error("Payment error:", error.message || "Something went wrong");
      toast.error("Failed to process payment.");
    }
  };

  const formattedSubtotal = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);
  const savings = (formattedSubtotal - totalPrice).toFixed(2);
  const formattedTotal = totalPrice.toFixed(2);

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order Summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">Original Price</dt>
            <dd className="text-base font-medium text-white">${formattedSubtotal}</dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">-${savings}</dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}

          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">${formattedTotal}</dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;