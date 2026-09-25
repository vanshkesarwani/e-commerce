import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useCartStore } from "../Store/useCartStore";
import { useWishlistStore } from "../Store/useWishlistStore";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";
import Logo from "./Logo";
import {
  FaSearch,
  FaTimes,
  FaShoppingCart,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBoxOpen,
  FaFire,
  FaTag,
  FaCopy,
  FaCheck,
  FaHeart,
  FaBars,
} from "react-icons/fa";

// Popular trending search tags
const TRENDING_SEARCHES = [
  "Sneakers",
  "Leather Jackets",
  "Chronograph Watch",
  "Silk Dress",
  "Minimalist Wallet",
  "Perfume",
];

// ==========================================
// LUXURY INTERACTIVE NAVBAR: VELURA
// Styled with the Beloved Classic Theme:
// (Dark Slate/Black Gradient + Gold Accents + Pink/Purple Search + Blue Sign In)
// ==========================================
function Navbar() {
  const { profile, isAuthenticated, setIsAuthenticated, setProfile } = useAuth();
  const { cart, getCartItems } = useCartStore();
  const { wishlist, openWishlist } = useWishlistStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [liveSuggestions, setLiveSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Live Predictive Search Debounced Query
  useEffect(() => {
    const query = searchKeyword.trim();
    if (!query || query.length < 2) {
      setLiveSuggestions([]);
      setSearchLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const { data } = await apiClient.get(
          `/products/search?keyword=${encodeURIComponent(query)}`
        );
        setLiveSuggestions(Array.isArray(data?.products) ? data.products.slice(0, 5) : []);
      } catch (err) {
        console.error("Predictive search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Sync cart count when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getCartItems();
    }
  }, [isAuthenticated, getCartItems]);

  // Close menus on route change
  useEffect(() => {
    setShowProfileMenu(false);
    setSearchFocused(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalCartCount = (cart || []).reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0
  );

  const handleLogout = async () => {
    try {
      await apiClient.get("/users/logout");
      localStorage.removeItem("jwt");
      setIsAuthenticated(false);
      setProfile(null);
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error) {
      localStorage.removeItem("jwt");
      setIsAuthenticated(false);
      setProfile(null);
      navigate("/login");
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchKeyword.trim()) {
      toast.error("Please enter a keyword to search");
      return;
    }
    setSearchFocused(false);
    navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
  };

  const handleTrendingClick = (tag) => {
    setSearchKeyword(tag);
    setSearchFocused(false);
    navigate(`/search?keyword=${encodeURIComponent(tag)}`);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("VELURA20");
    setCopiedCode(true);
    toast.success("Code VELURA20 copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const userOrdersPath =
    isAuthenticated && (profile?._id || profile?.id)
      ? `/myorders/${profile._id || profile.id}`
      : "/login";

  return (
    <div className="w-full sticky top-0 z-50 transition-all duration-300 shadow-xl">
      {/* 1. Announcement Bar with Previous Dark/Gold Accents */}
      {showAnnouncement && (
        <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-black text-white text-xs py-2 px-4 border-b border-gray-800 relative">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex-1 text-center flex items-center justify-center flex-wrap gap-1.5 sm:gap-2">
              <span className="text-yellow-400">✨</span>
              <span className="font-semibold text-yellow-400">
                Special Offer:
              </span>
              <span className="text-gray-300">
                Free Express Shipping on orders over ₹999
              </span>
              <span className="hidden md:inline text-gray-600">|</span>
              <button
                type="button"
                onClick={handleCopyCoupon}
                className="inline-flex items-center space-x-1.5 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 border border-yellow-400/40 px-2 py-0.5 rounded-full text-[11px] font-bold font-mono transition transform hover:scale-105 cursor-pointer"
                title="Click to copy coupon code"
              >
                <FaTag className="text-[10px]" />
                <span>VELURA20</span>
                {copiedCode ? (
                  <FaCheck className="text-emerald-400 text-[10px]" />
                ) : (
                  <FaCopy className="text-[10px] opacity-80" />
                )}
              </button>
              <span className="text-[11px] text-yellow-400 font-semibold">
                (20% Off)
              </span>
            </div>

            {/* Dismiss button */}
            <button
              type="button"
              onClick={() => setShowAnnouncement(false)}
              className="text-gray-400 hover:text-white p-1 rounded transition text-xs flex-shrink-0"
              aria-label="Dismiss banner"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Header: Classic Gray-800 via Gray-900 to Black */}
      <header className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white shadow-lg border-b border-gray-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-1 text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-xl transition cursor-pointer"
              aria-label="Open mobile menu"
            >
              <FaBars className="text-lg" />
            </button>
            <Link to="/" className="flex items-center group">
              <Logo size="default" />
            </Link>
          </div>

          {/* Desktop Search Bar (Hidden on Mobile) */}
          <div
            ref={searchContainerRef}
            className="hidden md:flex flex-1 max-w-xl relative items-center mx-4"
          >
            <form onSubmit={handleSearch} className="w-full relative flex items-center">
              <input
                type="text"
                placeholder="Search products, brands, essentials..."
                value={searchKeyword}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-gradient-to-r from-gray-100 via-white to-gray-100 text-gray-900 placeholder-gray-500 text-sm rounded-full pl-5 pr-20 py-2.5 border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 focus:outline-none transition shadow-md"
              />

              {searchKeyword && (
                <button
                  type="button"
                  onClick={() => setSearchKeyword("")}
                  className="absolute right-12 text-gray-400 hover:text-gray-700 text-xs p-1"
                >
                  <FaTimes />
                </button>
              )}

              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white flex items-center justify-center transition transform hover:scale-110 shadow-md cursor-pointer"
              >
                <FaSearch className="text-xs" />
              </button>
            </form>

            {/* Desktop Predictive Dropdown */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/98 backdrop-blur-2xl border border-gray-700 rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn max-h-[420px] overflow-y-auto no-scrollbar">
                {searchKeyword.trim().length >= 2 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                      <span className="flex items-center space-x-1.5 text-yellow-400">
                        <FaSearch className="text-[10px]" />
                        <span>Matching Products</span>
                      </span>
                      {searchLoading && (
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                          Searching...
                        </span>
                      )}
                    </div>

                    {liveSuggestions.length > 0 ? (
                      <div className="space-y-2">
                        {liveSuggestions.map((prod) => (
                          <div
                            key={prod._id}
                            onClick={() => {
                              setSearchFocused(false);
                              navigate(`/product/${prod._id}`);
                            }}
                            className="flex items-center justify-between p-2 rounded-xl bg-gray-800/60 hover:bg-gray-800 border border-gray-700/60 hover:border-yellow-500/50 cursor-pointer transition group"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.productImage?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
                                alt={prod.title}
                                className="w-10 h-10 object-cover rounded-lg bg-gray-700 border border-gray-600"
                              />
                              <div>
                                <span className="text-xs font-bold text-gray-200 group-hover:text-yellow-400 transition line-clamp-1">
                                  {prod.title}
                                </span>
                                <span className="text-[10px] text-gray-400 uppercase font-semibold">
                                  {prod.category}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-yellow-400 ml-2 whitespace-nowrap">
                              ₹{prod.price}
                            </span>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={handleSearch}
                          className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-600/20 hover:from-pink-500 hover:to-purple-600 border border-pink-500/30 text-xs font-bold text-white transition text-center"
                        >
                          View all related results for "{searchKeyword}" →
                        </button>
                      </div>
                    ) : !searchLoading ? (
                      <div className="py-4 text-center text-xs text-gray-400">
                        <p>No direct matches found for "{searchKeyword}".</p>
                        <button
                          type="button"
                          onClick={handleSearch}
                          className="mt-2 text-yellow-400 hover:underline font-bold"
                        >
                          Search catalog anyway →
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                      <span className="flex items-center space-x-1.5 text-yellow-400">
                        <FaFire className="text-xs" />
                        <span>Trending Searches</span>
                      </span>
                      <span className="text-[10px] text-gray-500 font-normal">
                        Press Enter to search
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {TRENDING_SEARCHES.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTrendingClick(tag)}
                          className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-yellow-500 hover:text-gray-900 border border-gray-700 text-xs font-semibold text-gray-300 transition duration-200"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
                      <span>Quick Categories:</span>
                      <div className="flex items-center space-x-3 font-semibold">
                        <Link to="/men" onClick={() => setSearchFocused(false)} className="hover:text-yellow-400 transition">Men</Link>
                        <Link to="/women" onClick={() => setSearchFocused(false)} className="hover:text-yellow-400 transition">Women</Link>
                        <Link to="/footwear" onClick={() => setSearchFocused(false)} className="hover:text-yellow-400 transition">Footwear</Link>
                        <Link to="/beauty" onClick={() => setSearchFocused(false)} className="hover:text-yellow-400 transition">Beauty</Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Cart & User Profile with Classic Gold / Blue Theme */}
          <div className="flex items-center space-x-2.5 sm:space-x-5">
            
            {/* Wishlist / Favourites Button with Live Count Badge */}
            <button
              type="button"
              onClick={openWishlist}
              className="relative p-1.5 sm:p-2 text-white hover:text-rose-400 transition group flex items-center cursor-pointer"
              title="My Favourites"
              aria-label="My Favourites"
            >
              <FaHeart className="text-2xl sm:text-3xl text-rose-500 group-hover:scale-110 transition-transform duration-300" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-[10px] sm:text-[11px] min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 rounded-full flex items-center justify-center px-1 shadow-lg ring-2 ring-gray-900 animate-pulse">
                  {wishlist.length > 99 ? "99+" : wishlist.length}
                </span>
              )}
            </button>

            {/* Cart with Live Count Badge & Gold Hover */}
            <Link
              to="/cart"
              className="relative p-1.5 sm:p-2 text-white hover:text-yellow-400 transition group flex items-center"
              aria-label="Shopping Cart"
            >
              <FaShoppingCart className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-950 font-black text-[10px] sm:text-[11px] min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 rounded-full flex items-center justify-center px-1 shadow-lg ring-2 ring-gray-900 animate-bounce">
                  {totalCartCount > 99 ? "99+" : totalCartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown / Login Button */}
            {isAuthenticated ? (
              <div ref={profileMenuRef} className="relative">
                <button
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="flex items-center space-x-2 focus:outline-none p-0.5 rounded-full hover:ring-3 sm:hover:ring-4 hover:ring-yellow-500 hover:scale-105 transition-all duration-200 group"
                  aria-label="User Menu"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-xs sm:text-sm font-bold text-white shadow-md">
                    {profile?.photo?.url ? (
                      <img
                        src={profile.photo.url}
                        alt={profile.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-white text-2xl sm:text-3xl" />
                    )}
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-60 sm:w-64 bg-gray-900/98 backdrop-blur-2xl border border-gray-700 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-800">
                      <p className="text-sm font-bold text-white truncate">
                        {profile?.name || "Member Account"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {profile?.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-400/20 text-yellow-400 border border-yellow-400/40">
                          {profile?.role || "Member"}
                        </span>
                        <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Active</span>
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-yellow-400 transition"
                      >
                        <FaUserCircle className="mr-3 text-yellow-400 text-base" />
                        My Profile
                      </Link>

                      <Link
                        to={userOrdersPath}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-yellow-400 transition"
                      >
                        <FaBoxOpen className="mr-3 text-yellow-400 text-base" />
                        My Orders
                      </Link>

                      {profile?.role === "admin" && (
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-yellow-400 hover:bg-gray-800 transition font-bold"
                        >
                          <FaTachometerAlt className="mr-3 text-yellow-400 text-base" />
                          Admin Dashboard
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-950/40 hover:text-red-300 transition"
                      >
                        <FaSignOutAlt className="mr-3 text-base" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Classic Blue Sign In Button */
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow-md transition transform hover:scale-105"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Full-Width Dedicated Search Bar Row */}
        <div
          ref={mobileSearchContainerRef}
          className="md:hidden px-3.5 pb-2.5 pt-0 relative"
        >
          <form onSubmit={handleSearch} className="w-full relative flex items-center">
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchKeyword}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-gradient-to-r from-gray-100 via-white to-gray-100 text-gray-900 placeholder-gray-500 text-xs rounded-full pl-4 pr-16 py-2 border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 focus:outline-none transition shadow-sm"
            />

            {searchKeyword && (
              <button
                type="button"
                onClick={() => setSearchKeyword("")}
                className="absolute right-10 text-gray-400 hover:text-gray-700 text-[11px] p-1"
              >
                <FaTimes />
              </button>
            )}

            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center shadow cursor-pointer"
            >
              <FaSearch className="text-[10px]" />
            </button>
          </form>
        </div>
      </header>

      {/* Mobile Slide-In Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fadeIn">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Side Drawer Panel */}
          <div className="fixed inset-y-0 left-0 max-w-[280px] w-full bg-gray-950 text-white shadow-2xl border-r border-gray-800 z-50 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Header with Logo & Close */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <Logo size="default" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
                  aria-label="Close menu"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>

              {/* User Greeting / Sign In CTA in Drawer */}
              <div className="p-4 bg-gray-900/70 border-b border-gray-800">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-amber-400 text-gray-950 font-extrabold flex items-center justify-center text-sm shadow">
                      {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "VK"}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{profile?.name || "Client"}</p>
                      <p className="text-[11px] text-amber-400 font-medium truncate">{profile?.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Welcome to Velura</p>
                      <p className="text-[10px] text-gray-400">Discover curated luxury</p>
                    </div>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xs font-bold shadow"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>

              {/* Category Navigation Links */}
              <div className="p-3 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 py-1">
                  Departments
                </p>
                {[
                  { to: "/", label: "All Products" },
                  { to: "/men", label: "Men's Fashion" },
                  { to: "/women", label: "Women's Collection" },
                  { to: "/kids", label: "Kids & Toys" },
                  { to: "/footwear", label: "Footwear & Shoes" },
                  { to: "/beauty", label: "Beauty & Skincare" },
                  { to: "/accessories", label: "Accessories & Bags" },
                  { to: "/homeandkitchen", label: "Home & Living" },
                ].map((cat) => (
                  <Link
                    key={cat.to}
                    to={cat.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-yellow-400 hover:bg-gray-900 transition"
                  >
                    <span>{cat.label}</span>
                    <span className="text-gray-600 text-xs">›</span>
                  </Link>
                ))}
              </div>

              {/* Account Quick Links */}
              <div className="p-3 border-t border-gray-800 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 py-1">
                  Account & Orders
                </p>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-yellow-400 hover:bg-gray-900 transition"
                >
                  <FaUserCircle className="mr-3 text-yellow-400" />
                  Client Profile
                </Link>
                <Link
                  to={userOrdersPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-yellow-400 hover:bg-gray-900 transition"
                >
                  <FaBoxOpen className="mr-3 text-yellow-400" />
                  My Orders
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openWishlist();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-rose-400 hover:bg-gray-900 transition"
                >
                  <div className="flex items-center">
                    <FaHeart className="mr-3 text-rose-500" />
                    My Favourites
                  </div>
                  {wishlist.length > 0 && (
                    <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {wishlist.length}
                    </span>
                  )}
                </button>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-yellow-400 hover:bg-gray-900 transition"
                >
                  <div className="flex items-center">
                    <FaShoppingCart className="mr-3 text-yellow-400" />
                    Shopping Bag
                  </div>
                  {totalCartCount > 0 && (
                    <span className="bg-yellow-400 text-gray-950 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {totalCartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Drawer Footer with Coupon & Sign out */}
            <div className="p-4 border-t border-gray-800 space-y-2.5">
              <button
                type="button"
                onClick={handleCopyCoupon}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gray-900 border border-yellow-400/30 text-xs font-mono text-yellow-400"
              >
                <span className="flex items-center gap-1.5">
                  <FaTag /> VELURA20
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400">Copy Code</span>
              </button>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/30 transition text-center"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;