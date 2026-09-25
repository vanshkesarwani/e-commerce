import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useCartStore } from "../Store/useCartStore";
import { useWishlistStore } from "../Store/useWishlistStore";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";
import {
  FaStar,
  FaShoppingCart,
  FaBolt,
  FaShieldAlt,
  FaTruck,
  FaUndoAlt,
  FaUserCircle,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

// ==========================================
// LUXURY PRODUCT DETAILS & REVIEWS VIEW
// ==========================================
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();
  const { addToCart } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [productDetail, setProductDetail] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [prodRes, reviewsRes, relatedRes] = await Promise.allSettled([
          apiClient.get(`/products/getsingleproduct/${id}`),
          apiClient.get(`/products/getreviews/${id}`),
          apiClient.get(`/products/product/${id}/category`),
        ]);

        if (prodRes.status === "fulfilled") {
          setProductDetail(prodRes.value.data);
        }

        if (reviewsRes.status === "fulfilled" && reviewsRes.value.data?.reviews) {
          setAllReviews(reviewsRes.value.data.reviews);
        }

        if (relatedRes.status === "fulfilled" && relatedRes.value.data?.relatedProducts) {
          setRelatedProducts(relatedRes.value.data.relatedProducts);
        }
      } catch (error) {
        console.error("Failed to load product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleAddToCart = () => {
    if (!productDetail) return;
    addToCart(productDetail);
  };

  const handleBuyNow = () => {
    if (!productDetail) return;
    addToCart(productDetail);
    navigate("/cart");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in to post a review");
      return navigate("/login");
    }

    if (!comment.trim()) {
      return toast.error("Please provide a review comment");
    }

    try {
      setSubmittingReview(true);
      const { data } = await apiClient.put("/products/createreview", {
        productId: id,
        rating: Number(rating),
        comment: comment.trim(),
      });

      toast.success("Thank you! Your review has been submitted.");
      setComment("");

      // Refresh reviews
      const updatedReviews = await apiClient.get(`/products/getreviews/${id}`);
      if (updatedReviews.data?.reviews) {
        setAllReviews(updatedReviews.data.reviews);
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!productDetail) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <Link
          to="/"
          className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const inStock = (productDetail.stock ?? 1) > 0;

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link to="/" className="hover:text-indigo-600 shrink-0">Home</Link>
          <span className="shrink-0">/</span>
          <span className="capitalize shrink-0">{productDetail.category || "Products"}</span>
          <span className="shrink-0">/</span>
          <span className="text-slate-800 font-semibold truncate">{productDetail.title}</span>
        </div>

        {/* Top Split Layout: Gallery & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200/80 shadow-card">
          
          {/* Product Image Viewer */}
          <div className="relative flex items-center justify-center bg-slate-100/60 rounded-2xl p-4 sm:p-6 border border-slate-100 overflow-hidden min-h-[260px] sm:min-h-[360px]">
            <img
              src={productDetail.productImage?.url || "https://via.placeholder.com/600"}
              alt={productDetail.title}
              className="max-h-[280px] sm:max-h-[420px] lg:max-h-[500px] w-auto object-contain hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              {productDetail.category}
            </span>
          </div>

          {/* Product Purchase Details */}
          <div className="flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {productDetail.title}
              </h1>

              {/* Rating & Review Counter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <FaStar
                      key={idx}
                      className={
                        idx < Math.round(Number(productDetail.ratings) || 0)
                          ? "text-amber-400"
                          : "text-slate-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {productDetail.ratings ? Number(productDetail.ratings).toFixed(1) : "0.0"}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-sm text-indigo-600 font-medium">
                  {allReviews.length} {allReviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>

              {/* Price & Stock Badge */}
              <div className="flex items-baseline flex-wrap gap-3 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  ₹{productDetail.price}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${inStock ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {productDetail.description}
              </p>
            </div>

            {/* Actions & Guarantee Box */}
            <div className="space-y-5 pt-2">
              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 sm:py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition duration-200 disabled:opacity-50 text-sm cursor-pointer"
                  >
                    <FaShoppingCart className="shrink-0" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={!inStock}
                    className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-black text-white font-bold py-3 sm:py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition duration-200 disabled:opacity-50 text-sm cursor-pointer"
                  >
                    <FaBolt className="text-amber-400 shrink-0" />
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* Save to Favourites Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(productDetail)}
                  className={`w-full py-3 px-4 rounded-xl border flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    isInWishlist(id)
                      ? "bg-rose-50 text-rose-600 border-rose-200 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-rose-500 hover:border-rose-200"
                  }`}
                >
                  {isInWishlist(id) ? (
                    <>
                      <FaHeart className="text-rose-500 text-sm" />
                      <span>Saved in Favourites</span>
                    </>
                  ) : (
                    <>
                      <FaRegHeart className="text-slate-400 text-sm" />
                      <span>Save to Favourites</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <FaTruck className="text-indigo-600 text-base shrink-0" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUndoAlt className="text-indigo-600 text-base shrink-0" />
                  <span>30-Day Free Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaShieldAlt className="text-indigo-600 text-base shrink-0" />
                  <span>2-Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="mt-14 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Customer Reviews & Ratings
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Verified buyer feedback and satisfaction ratings
              </p>
            </div>
            <Link
              to={`/getreview/${id}`}
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition"
            >
              View Full Review Hub & Ratings &rarr;
            </Link>
          </div>

          {/* Write a Review Form */}
          <form onSubmit={handleReviewSubmit} className="my-8 p-6 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Leave a Review
            </h3>

            {/* Interactive Star Picker */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-600">Your Rating:</span>
              <div className="flex space-x-1 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <FaStar
                      className={`text-lg ${
                        star <= rating ? "text-amber-400" : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your feedback about this product's quality, fit, and comfort..."
              className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition disabled:opacity-50"
            >
              {submittingReview ? "Submitting..." : "Post Review"}
            </button>
          </form>

          {/* Reviews Feed */}
          {allReviews.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              No customer reviews yet. Be the first to review this product!
            </p>
          ) : (
            <div className="space-y-6">
              {allReviews.map((rev, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                        {rev.photo || rev.userProfilePhotoUrl ? (
                          <img
                            src={rev.photo || rev.userProfilePhotoUrl}
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUserCircle className="text-slate-400 text-xl" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {rev.userName || rev.name || "Verified Customer"}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Recent Purchase"}
                        </p>
                      </div>
                    </div>

                    <div className="flex text-amber-400 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < (rev.rating || 5) ? "text-amber-400" : "text-slate-200"}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related Products from Same Category */}
        {relatedProducts.length > 0 && (
          <section className="mt-14 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500">
                  Curated Recommendations
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  You May Also Like
                </h2>
              </div>
              {productDetail?.category && (
                <Link
                  to={`/${productDetail.category.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
                >
                  Explore More in {productDetail.category} &rarr;
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((related) => (
                <div
                  key={related._id}
                  className="group bg-white rounded-3xl p-4 border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between"
                >
                  <Link to={`/product/${related._id}`} className="block">
                    <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden mb-3 p-2 flex items-center justify-center">
                      <img
                        src={related.productImage?.url || "https://via.placeholder.com/200"}
                        alt={related.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {related.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 line-clamp-1 mt-0.5">
                      {related.title}
                    </h3>
                  </Link>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs sm:text-sm font-black text-slate-900">
                        ₹{related.price?.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(related)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-black text-white hover:text-amber-400 transition shadow-xs"
                      title="Add to cart"
                      aria-label="Add to cart"
                    >
                      <FaShoppingCart className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
