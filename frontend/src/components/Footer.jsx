import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaShieldAlt,
  FaTruck,
  FaUndoAlt,
  FaHeadset,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Logo from "./Logo";

// ==========================================
// CLASSY MULTI-COLUMN STORE FOOTER
// ==========================================
const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing to Velura updates!");
    setNewsletterEmail("");
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Propositions Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-10 sm:pb-12 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0">
              <FaTruck className="text-lg" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-400">On all orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0">
              <FaShieldAlt className="text-lg" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400">Bank-grade encryption</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0">
              <FaUndoAlt className="text-lg" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Easy 30-Day Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free refunds</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0">
              <FaHeadset className="text-lg" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">24/7 Priority Support</h4>
              <p className="text-xs text-slate-400">Dedicated assistance</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <Logo size="default" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              Velura Studio & Co. curates premier lifestyle, contemporary fashion, footwear, beauty, and luxury home essentials designed to elevate your everyday living.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleNewsletter} className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Subscribe for Exclusive Offers & Drops
              </p>
              <div className="flex max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-l-lg text-sm focus:outline-none focus:border-indigo-500 w-full placeholder-slate-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-r-lg text-sm font-semibold transition"
                >
                  Join
                </button>
              </div>
            </form>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/men" className="hover:text-amber-400 transition">Men's Collection</Link></li>
              <li><Link to="/women" className="hover:text-amber-400 transition">Women's Fashion</Link></li>
              <li><Link to="/footwear" className="hover:text-amber-400 transition">Footwear & Sneakers</Link></li>
              <li><Link to="/beauty" className="hover:text-amber-400 transition">Beauty & Skincare</Link></li>
              <li><Link to="/accessories" className="hover:text-amber-400 transition">Accessories & Watches</Link></li>
              <li><Link to="/homeandkitchen" className="hover:text-amber-400 transition">Home & Kitchen</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/cart" className="hover:text-amber-400 transition">Shopping Bag</Link></li>
              <li><Link to="/profile" className="hover:text-amber-400 transition">Account Profile</Link></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Order Tracking</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Shipping & Delivery</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Returns & Exchanges</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Privacy & Security</span></li>
            </ul>
          </div>

          {/* Connect & Socials */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Connect With Us
            </h4>
            <div className="flex space-x-3 mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-indigo-600 transition"
              >
                <FaFacebookF className="text-sm" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-pink-600 transition"
              >
                <FaInstagram className="text-sm" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-sky-500 transition"
              >
                <FaTwitter className="text-sm" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 transition"
              >
                <FaLinkedinIn className="text-sm" />
              </a>
            </div>
            <p className="text-xs text-slate-500">
              Need assistance? Email us at <span className="text-slate-300">support@velura.com</span>
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-6 sm:pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Velura Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-slate-400 font-mono text-[11px]">
            <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800">UPI</span>
            <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800">VISA</span>
            <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800">MASTERCARD</span>
            <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800">RUPAY</span>
            <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800">NET BANKING</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
