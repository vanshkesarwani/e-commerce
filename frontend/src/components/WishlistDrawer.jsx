import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlistStore } from "../Store/useWishlistStore";
import { useCartStore } from "../Store/useCartStore";
import {
  FaHeart,
  FaTimes,
  FaShoppingCart,
  FaTrashAlt,
  FaArrowRight,
  FaBoxOpen,
} from "react-icons/fa";
import toast from "react-hot-toast";

// ==========================================
// LUXURY WISHLIST / FAVOURITES SLIDE-OVER DRAWER
// ==========================================
const WishlistDrawer = () => {
  const { wishlist, isOpen, closeWishlist, removeFromWishlist, clearWishlist } =
    useWishlistStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
  };

  const handleMoveAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((prod) => addToCart(prod));
    clearWishlist();
    toast.success("All favourite items moved to your shopping bag!", {
      icon: "🛍️",
    });
    closeWishlist();
    navigate("/cart");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={closeWishlist}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          
          {/* 1. Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-black text-white">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <FaHeart className="text-base" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  My Favourites
                </h2>
                <p className="text-[11px] text-slate-300 font-medium">
                  {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeWishlist}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
              aria-label="Close favourites drawer"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>

          {/* 2. Body List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-2xl shadow-inner border border-rose-100">
                  <FaHeart />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    Your favourites list is empty
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Explore our luxury catalog and click the heart icon to save products you love for easy review.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeWishlist();
                    navigate("/allproducts");
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition shadow"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {wishlist.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="py-4 flex items-center justify-between gap-4 group"
                  >
                    {/* Item Thumbnail & Details */}
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 p-1 shrink-0 overflow-hidden border border-slate-200">
                        <img
                          src={
                            item.productImage?.url ||
                            item.image ||
                            "https://via.placeholder.com/120"
                          }
                          alt={item.title || item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <Link
                          to={`/product/${item._id || item.id}`}
                          onClick={closeWishlist}
                          className="text-xs sm:text-sm font-bold text-slate-800 hover:text-indigo-600 truncate block transition"
                        >
                          {item.title || item.name}
                        </Link>
                        <p className="text-[11px] text-slate-400 capitalize">
                          {item.category || "Luxury"}
                        </p>
                        <p className="text-xs sm:text-sm font-black text-slate-900">
                          ₹{Number(item.price || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* Quick Actions: Add to Cart & Remove */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(item)}
                        className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-2xs"
                        title="Move to shopping bag"
                      >
                        <FaShoppingCart className="text-[10px]" />
                        <span className="hidden sm:inline">Add</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item._id || item.id)}
                        className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition"
                        title="Remove from favourites"
                      >
                        <FaTrashAlt className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Footer Actions */}
          {wishlist.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/70 space-y-3">
              <button
                type="button"
                onClick={handleMoveAllToCart}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <FaShoppingCart className="text-xs" />
                <span>Move All to Bag ({wishlist.length})</span>
              </button>

              <div className="flex items-center justify-between pt-1 text-xs">
                <Link
                  to="/wishlist"
                  onClick={closeWishlist}
                  className="font-bold text-slate-700 hover:text-indigo-600 flex items-center space-x-1.5 transition"
                >
                  <span>View Full Wishlist Page</span>
                  <FaArrowRight className="text-[10px]" />
                </Link>

                <button
                  type="button"
                  onClick={clearWishlist}
                  className="font-semibold text-slate-400 hover:text-red-500 transition"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;
