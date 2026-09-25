import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import apiClient from "../api/apiClient";
import { useCartStore } from "../Store/useCartStore";
import { useWishlistStore } from "../Store/useWishlistStore";

// ==========================================
// CLASSY PRODUCT LISTING & FILTER GRID
// ==========================================
const CATEGORY_TABS = [
  "All",
  "Men",
  "Women",
  "Kids",
  "Footwear",
  "Beauty",
  "Accessories",
  "Home",
];

const GetAllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);

  const catalogTopRef = useRef(null);
  const { addToCart } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  // Fetch all products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/products/getallproducts");
        const list = Array.isArray(data?.products) ? data.products : [];
        setAllProducts(list);
        setFilteredProducts(list);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and Sort Logic
  useEffect(() => {
    let result = [...allProducts];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort by criteria
    if (sortBy === "price-low") {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (Number(b.ratings) || 0) - (Number(a.ratings) || 0));
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [selectedCategory, sortBy, allProducts]);

  // Pagination slicing
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Smooth page change handler
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    if (catalogTopRef.current) {
      catalogTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Smart Windowed Pagination Generator
  const getPaginationItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <div ref={catalogTopRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Exclusive Collection
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Featured Products
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Showing {filteredProducts.length} curated products
          </p>
        </div>

        {/* Category Pills & Sorting Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Tabs */}
          <div className="flex items-center overflow-x-auto no-scrollbar space-x-1.5 p-1 bg-slate-200/60 rounded-xl">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-white text-slate-900 shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            <option value="default">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse space-y-4"
            >
              <div className="w-full h-64 bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : currentItems.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-lg font-semibold text-slate-600">
            No products found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSortBy("default");
            }}
            className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Product Cards Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 py-6 sm:py-8">
          {currentItems.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden justify-between"
            >
              {/* Image Container with Badges */}
              <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={
                      product?.productImage?.url ||
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </Link>

                {/* Category & Stock Badges */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 z-10">
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider shadow">
                    {product.category || "Essential"}
                  </span>
                  {product.stock !== undefined && product.stock <= 5 && (
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-900 text-[9px] sm:text-[10px] font-bold shadow w-fit">
                      {product.stock} left
                    </span>
                  )}
                </div>

                {/* Wishlist Heart Toggle Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className={`absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-20 shadow-md ${
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

              {/* Product Details Body */}
              <div className="p-3 sm:p-5 flex flex-col flex-grow justify-between space-y-2 sm:space-y-3">
                <div>
                  <Link
                    to={`/product/${product._id}`}
                    className="text-xs sm:text-sm font-bold text-slate-800 hover:text-indigo-600 line-clamp-1 transition"
                  >
                    {product.title}
                  </Link>

                  {/* Rating Stars Row */}
                  <div className="flex items-center space-x-1 sm:space-x-1.5 mt-1 text-[10px] sm:text-xs">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <FaStar
                          key={starIdx}
                          className={`text-[10px] sm:text-xs ${
                            starIdx < Math.round(Number(product.ratings) || 0)
                              ? "text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-slate-500 text-[10px] sm:text-[11px] font-medium">
                      ({product.numOfReviews || 0})
                    </span>
                  </div>
                </div>

                {/* Price & Add-To-Cart Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                  <div>
                    <span className="text-sm sm:text-lg font-extrabold text-slate-900">
                      ₹{product.price}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center space-x-1 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white px-2 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 shadow-xs"
                  >
                    <FaShoppingCart className="text-[10px] sm:text-xs" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Luxury Pagination & Discovery Bar */}
      {filteredProducts.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200/80 flex flex-col items-center space-y-5">
          {/* Progress Tracker Capsule */}
          <div className="flex flex-col items-center space-y-2">
            <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5 sm:gap-2">
              <span>Showing</span>
              <span className="text-slate-900 font-extrabold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {indexOfFirstProduct + 1} – {Math.min(indexOfLastProduct, filteredProducts.length)}
              </span>
              <span>of</span>
              <span className="text-slate-900 font-extrabold">{filteredProducts.length}</span>
              <span>products</span>
            </div>

            {/* Dynamic Progress Indicator Line */}
            <div className="w-56 sm:w-72 h-1.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${Math.min(
                    100,
                    (Math.min(indexOfLastProduct, filteredProducts.length) /
                      filteredProducts.length) *
                      100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Interactive Navigation Control Strip */}
          {totalPages > 1 && (
            <div className="inline-flex items-center gap-1 sm:gap-2 bg-white p-1.5 sm:p-2 rounded-2xl border border-slate-200 shadow-md shadow-slate-200/50">
              {/* Jump to First Page (if far) */}
              {currentPage > 3 && (
                <button
                  onClick={() => handlePageChange(1)}
                  title="First Page"
                  className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                >
                  <FaAngleDoubleLeft className="text-xs" />
                </button>
              )}

              {/* Previous Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 hover:bg-slate-900 hover:text-white"
              >
                <FaChevronLeft className="text-[10px]" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Numbered Pills with Smart Truncation */}
              <div className="flex items-center gap-1">
                {getPaginationItems().map((item, idx) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="w-8 h-9 flex items-center justify-center text-slate-400 font-bold tracking-widest text-xs select-none"
                    >
                      ···
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => handlePageChange(item)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                        currentPage === item
                          ? "bg-slate-900 text-white shadow-md shadow-slate-900/25 scale-105 ring-2 ring-indigo-500/20"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 hover:bg-slate-900 hover:text-white"
              >
                <span className="hidden sm:inline">Next</span>
                <FaChevronRight className="text-[10px]" />
              </button>

              {/* Jump to Last Page (if far) */}
              {currentPage < totalPages - 2 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  title="Last Page"
                  className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                >
                  <FaAngleDoubleRight className="text-xs" />
                </button>
              )}

              {/* Direct Jump Selector (Dropdown inside pill) */}
              <div className="hidden md:flex items-center pl-2 ml-1 border-l border-slate-200 text-xs text-slate-500 gap-1.5">
                <span className="font-medium text-[11px]">Go to:</span>
                <select
                  value={currentPage}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  className="bg-slate-100 hover:bg-slate-200/80 font-bold text-slate-900 rounded-lg px-2 py-1 text-xs outline-none cursor-pointer transition border border-slate-200"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pg) => (
                      <option key={pg} value={pg}>
                        Page {pg}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          )}

          {/* Quick Density / Items Per Page Switcher */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <span className="font-medium">Products per page:</span>
            <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {[12, 24, 48].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setProductsPerPage(size);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    productsPerPage === size
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllProducts;
