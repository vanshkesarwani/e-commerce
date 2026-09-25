import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlistStore } from "../Store/useWishlistStore";
import { useCartStore } from "../Store/useCartStore";
import {
  FaHeart,
  FaShoppingCart,
  FaTrashAlt,
  FaArrowLeft,
  FaStar,
  FaBoxOpen,
  FaShieldAlt,
  FaShoppingBag,
} from "react-icons/fa";
import toast from "react-hot-toast";

// ==========================================
// LUXURY WISHLIST & FAVOURITES PAGE
// ==========================================
const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id || product.id);
  };

  const handleMoveAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((item) => addToCart(item));
    clearWishlist();
    toast.success("All favourite items have been moved to your shopping cart!", {
      icon: "🛍️",
    });
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
                <FaHeart className="text-lg" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  My Favourites & Wishlist
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Curate your desired products, review anytime, and effortlessly move them to your shopping bag
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <Link
              to="/allproducts"
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 transition"
            >
              <FaArrowLeft className="mr-2" />
              Continue Shopping
            </Link>

            {wishlist.length > 0 && (
              <button
                type="button"
                onClick={handleMoveAllToCart}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
              >
                <FaShoppingCart className="text-xs" />
                <span>Move All to Bag ({wishlist.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 sm:p-20 text-center border border-slate-200 shadow-sm mt-8 space-y-5">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner border border-rose-100">
              <FaHeart className="text-3xl" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">
                Your Wishlist is Empty
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                You haven't saved any favourite items yet. Tap the heart icon on any product in our store to save it here for later!
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/allproducts"
                className="inline-flex items-center px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition transform hover:scale-105"
              >
                Start Exploring Catalog
              </Link>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Showing {wishlist.length} saved {wishlist.length === 1 ? "product" : "products"}
              </span>

              <button
                type="button"
                onClick={clearWishlist}
                className="text-xs font-bold text-red-600 hover:text-red-800 transition hover:underline"
              >
                Clear Entire Wishlist
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {wishlist.map((product) => (
                <div
                  key={product._id || product.id}
                  className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
                >
                  {/* Image Container with Badges & Remove Button */}
                  <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                    <Link to={`/product/${product._id || product.id}`}>
                      <img
                        src={
                          product?.productImage?.url ||
                          product?.image ||
                          "https://via.placeholder.com/400"
                        }
                        alt={product.title || product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>

                    {/* Category Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider shadow">
                        {product.category || "Luxury"}
                      </span>
                    </div>

                    {/* Remove From Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product._id || product.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 text-rose-500 hover:text-rose-600 hover:bg-rose-50 shadow-md flex items-center justify-center transition-all duration-200 z-10"
                      title="Remove from favourites"
                      aria-label="Remove from favourites"
                    >
                      <FaHeart className="text-xs" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 sm:p-5 flex flex-col flex-grow justify-between space-y-3">
                    <div>
                      <Link
                        to={`/product/${product._id || product.id}`}
                        className="text-xs sm:text-sm font-bold text-slate-800 hover:text-indigo-600 line-clamp-1 transition"
                      >
                        {product.title || product.name}
                      </Link>

                      {/* Ratings */}
                      <div className="flex items-center space-x-1 mt-1 text-[10px] sm:text-xs text-amber-400">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <FaStar
                            key={idx}
                            className={
                              idx < Math.round(Number(product.ratings) || 5)
                                ? "text-amber-400"
                                : "text-slate-200"
                            }
                          />
                        ))}
                        <span className="text-slate-400 text-[10px] ml-1">
                          ({product.numOfReviews || 0})
                        </span>
                      </div>
                    </div>

                    {/* Price & Move to Bag CTA */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleMoveToCart(product)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs hover:shadow"
                      >
                        <FaShoppingCart className="text-[10px]" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
