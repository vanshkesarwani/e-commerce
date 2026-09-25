import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthProvider";
import { useCartStore } from "../Store/useCartStore";
import PostReview from "./PostReview";
import {
  FaStar,
  FaArrowLeft,
  FaUserCircle,
  FaCheckCircle,
  FaEdit,
  FaShoppingCart,
  FaExternalLinkAlt,
  FaThumbsUp,
  FaCommentDots,
} from "react-icons/fa";

// ==========================================
// LUXURY PRODUCT REVIEWS HUB & RATING RADAR
// ==========================================
const GetReviews = () => {
  const { id } = useParams();
  const { profile, isAuthenticated } = useAuth();
  const { addToCart } = useCartStore();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReviewToEdit, setSelectedReviewToEdit] = useState(null);

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      const [prodRes, revRes] = await Promise.allSettled([
        apiClient.get(`/products/getsingleproduct/${id}`),
        apiClient.get(`/products/getreviews/${id}`),
      ]);

      if (prodRes.status === "fulfilled") {
        setProduct(prodRes.value.data);
      }

      if (revRes.status === "fulfilled" && revRes.value.data?.reviews) {
        setReviews(revRes.value.data.reviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error loading reviews hub:", error);
      toast.error(error.message || "Failed to load product reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProductAndReviews();
  }, [id]);

  // Compute rating breakdown
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / totalReviews).toFixed(1)
      : product?.ratings || 5.0;

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.round(Number(r.rating) || 5);
    if (ratingCounts[star] !== undefined) ratingCounts[star]++;
  });

  // Check if current user already reviewed this product
  const myReview = reviews.find(
    (r) =>
      r.user?._id === profile?._id ||
      r.user === profile?._id ||
      (r.name && profile?.name && r.name.toLowerCase() === profile.name.toLowerCase())
  );

  const handleOpenCreateOrEdit = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to write a review");
      return;
    }
    setSelectedReviewToEdit(myReview || null);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500 animate-pulse">
          Loading customer feedback & rating radar...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 gap-4 flex-wrap">
          <Link
            to={product ? `/product/${product._id}` : "/"}
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 transition"
          >
            <FaArrowLeft className="mr-2" />
            Back to {product?.title ? product.title.slice(0, 30) + "..." : "Product"}
          </Link>

          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Verified Customer Feedback
          </span>
        </div>

        {/* Product Headline Card */}
        {product && (
          <div className="my-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 p-2 overflow-hidden border border-slate-200 shrink-0">
                <img
                  src={product.productImage?.url || "https://via.placeholder.com/150"}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700">
                  {product.category || "Velura Collection"}
                </span>
                <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  {product.title}
                </h1>
                <p className="text-sm font-extrabold text-indigo-600">
                  ₹{product.price?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => addToCart(product)}
                className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
              >
                <FaShoppingCart className="text-amber-400" />
                <span>Add to Cart</span>
              </button>
              <Link
                to={`/product/${product._id}`}
                className="inline-flex items-center justify-center p-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-xs font-bold"
                title="View product details"
              >
                <FaExternalLinkAlt />
              </Link>
            </div>
          </div>
        )}

        {/* Two-Column Layout: Rating Radar (Left) + Reviews List (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
          {/* Left Column: Rating Radar & Score Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
              <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                Rating Breakdown
              </h2>

              {/* Big Score Box */}
              <div className="text-center py-2 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl p-4 border border-slate-100">
                <div className="text-4xl sm:text-5xl font-black text-slate-900">
                  {averageRating}
                </div>
                <div className="flex justify-center text-amber-400 text-sm mt-1.5 space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={
                        star <= Math.round(Number(averageRating))
                          ? "text-amber-400"
                          : "text-slate-200"
                      }
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  Based on {totalReviews} customer {totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>

              {/* Star Distribution Progress Bars */}
              <div className="space-y-2.5 text-xs">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingCounts[stars] || 0;
                  const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                  return (
                    <div key={stars} className="flex items-center space-x-2">
                      <span className="w-12 text-slate-600 font-bold flex items-center space-x-1">
                        <span>{stars}</span>
                        <FaStar className="text-[10px] text-amber-400" />
                      </span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-[11px] text-slate-400 font-medium">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Write Review CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleOpenCreateOrEdit}
                  className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  {myReview ? <FaEdit className="text-sm" /> : <FaCommentDots className="text-sm" />}
                  <span>{myReview ? "Edit Your Review" : "Write a Review"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Reviews Feed */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-3">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Customer Feedback ({reviews.length})
              </h2>
            </div>

            {reviews.length === 0 ? (
              /* Empty Reviews Placeholder */
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <FaCommentDots className="text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No Reviews Yet
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  Be the very first customer to review this item and help others make confident selections.
                </p>
                <button
                  type="button"
                  onClick={handleOpenCreateOrEdit}
                  className="inline-flex items-center px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition transform hover:scale-105"
                >
                  Write First Review
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, idx) => {
                  const isMine =
                    review.user?._id === profile?._id ||
                    review.user === profile?._id ||
                    (review.name && profile?.name && review.name === profile.name);

                  return (
                    <div
                      key={review._id || idx}
                      className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                            {review.photo || review.user?.photo?.url ? (
                              <img
                                src={review.photo || review.user?.photo?.url}
                                alt={review.name || "Customer"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaUserCircle className="text-slate-400 text-2xl" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-bold text-slate-900">
                                {review.name || review.userName || "Verified Buyer"}
                              </h4>
                              {isMine && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-50 text-indigo-600 border border-indigo-200">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-1.5 text-amber-400 text-xs mt-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={
                                    star <= (Number(review.rating) || 5)
                                      ? "text-amber-400"
                                      : "text-slate-200"
                                  }
                                />
                              ))}
                              <span className="text-[11px] text-slate-400 font-medium ml-1">
                                {review.rating} / 5
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Date & Edit trigger if own review */}
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {review.createdAt
                              ? new Date(review.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Verified"}
                          </span>
                          {isMine && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedReviewToEdit(review);
                                setModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 transition"
                              title="Edit review"
                            >
                              <FaEdit className="text-xs" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                        {review.comment}
                      </p>

                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-2 border-t border-slate-50">
                        <FaCheckCircle className="text-emerald-500 text-xs" />
                        <span>Verified Storefront Purchase</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal for Creating or Editing Review */}
        {modalOpen && (
          <PostReview
            productId={id}
            existingReview={selectedReviewToEdit}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSuccess={() => {
              fetchProductAndReviews();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GetReviews;