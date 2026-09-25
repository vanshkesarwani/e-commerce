import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaShoppingCart, FaArrowLeft, FaHeart, FaRegHeart } from "react-icons/fa";
import apiClient from "../api/apiClient";
import { useCartStore } from "../Store/useCartStore";
import { useWishlistStore } from "../Store/useWishlistStore";

// ==========================================
// REUSABLE CLASSY CATEGORY STOREFRONT TEMPLATE
// ==========================================
const CategoryPageTemplate = ({
  categoryKey,
  title,
  subtitle,
  bannerImage,
}) => {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/products/getallproducts");
        const list = Array.isArray(data?.products) ? data.products : [];

        // Match case-insensitively
        const filtered = list.filter(
          (p) => p.category?.toLowerCase() === categoryKey.toLowerCase()
        );

        setProducts(filtered);
        setSortedProducts(filtered);
      } catch (error) {
        console.error(`Error loading ${categoryKey} products:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryKey]);

  useEffect(() => {
    let result = [...products];

    if (sortBy === "price-low") {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (Number(b.ratings) || 0) - (Number(a.ratings) || 0));
    }

    setSortedProducts(result);
  }, [sortBy, products]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Category Hero Banner */}
      <section className="relative h-44 sm:h-64 lg:h-80 bg-slate-900 overflow-hidden flex items-center">
        <img
          src={bannerImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.5]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full text-white">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 mb-2 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link to="/" className="hover:text-amber-400 shrink-0">Home</Link>
            <span className="shrink-0">/</span>
            <span className="text-amber-400 uppercase tracking-wider font-bold shrink-0">{title}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight">{title}</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mt-1 sm:mt-2 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Main Listing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Controls Bar */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-200 gap-3 flex-wrap">
          <p className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-800">{sortedProducts.length}</span> items
          </p>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            <option value="default">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 py-6 sm:py-10">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse space-y-4"
              >
                <div className="w-full h-40 sm:h-60 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-14 sm:py-20 bg-white rounded-3xl border border-slate-200 shadow-sm mt-6 sm:mt-8 px-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              No products available in this category yet.
            </h3>
            <p className="text-xs text-slate-500 mt-1">Check back soon for new arrivals!</p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center text-xs font-bold uppercase tracking-wider text-indigo-600 hover:underline"
            >
              <FaArrowLeft className="mr-1.5" /> Return to Catalog
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 py-6 sm:py-8">
            {sortedProducts.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Image */}
                <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={
                        product?.productImage?.url ||
                        "https://via.placeholder.com/400"
                      }
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </Link>

                  {/* Stock Badge */}
                  {product.stock !== undefined && product.stock <= 5 && (
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/90 text-slate-900 text-[9px] sm:text-[10px] font-bold shadow z-10">
                      Only {product.stock} left
                    </span>
                  )}

                  {/* Wishlist Heart Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-20 shadow-md ${
                      isInWishlist(product._id)
                        ? "bg-rose-50 text-rose-500 scale-105"
                        : "bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white"
                    }`}
                    title={isInWishlist(product._id) ? "Remove from favourites" : "Add to favourites"}
                    aria-label="Toggle favourite"
                  >
                    {isInWishlist(product._id) ? (
                      <FaHeart className="text-xs sm:text-sm text-rose-500 animate-pulse" />
                    ) : (
                      <FaRegHeart className="text-xs sm:text-sm" />
                    )}
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 sm:p-5 flex flex-col flex-grow justify-between space-y-2 sm:space-y-3">
                  <div>
                    <Link
                      to={`/product/${product._id}`}
                      className="text-xs sm:text-sm font-bold text-slate-800 hover:text-indigo-600 line-clamp-2 transition"
                    >
                      {product.title}
                    </Link>

                    {/* Star ratings */}
                    <div className="hidden sm:flex items-center space-x-1.5 mt-1.5 text-xs">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <FaStar
                            key={starIdx}
                            className={`text-xs ${
                              starIdx < Math.round(Number(product.ratings) || 0)
                                ? "text-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-slate-500 text-[11px] font-medium">
                        ({product.numOfReviews || 0})
                      </span>
                    </div>
                  </div>

                  {/* Price & Add */}
                  <div className="pt-1.5 sm:pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                    <span className="text-sm sm:text-lg font-extrabold text-slate-900">
                      ₹{product.price}
                    </span>

                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center space-x-1 sm:space-x-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition duration-200 shadow-sm"
                    >
                      <FaShoppingCart className="text-xs" />
                      <span className="hidden xs:inline">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPageTemplate;
