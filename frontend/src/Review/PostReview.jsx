import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthProvider";
import { FaStar, FaTimes, FaCheck, FaExclamationCircle } from "react-icons/fa";

/**
 * Reusable Luxury Post / Update Review Component
 * Supports both standalone embedded form and modal overlay display
 */
const PostReview = ({
  productId,
  existingReview = null,
  isOpen = true,
  onClose,
  onSuccess,
}) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 5);
      setComment(existingReview.comment || "");
    } else {
      setRating(5);
      setComment("");
    }
  }, [existingReview]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in to submit a review");
      return;
    }

    if (!rating || rating < 1) {
      toast.error("Please select a star rating between 1 and 5");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please provide your feedback comment");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await apiClient.put("/products/createreview", {
        productId,
        rating: Number(rating),
        comment: comment.trim(),
      });

      toast.success(data.message || "Review submitted successfully!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star Rating Picker */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Overall Rating
        </label>
        <div className="flex items-center space-x-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
              aria-label={`Rate ${star} stars`}
            >
              <FaStar
                className={`text-2xl ${
                  (hoverRating || rating) >= star
                    ? "text-amber-400 drop-shadow-xs"
                    : "text-slate-200"
                } transition-colors`}
              />
            </button>
          ))}
          <span className="ml-2 text-xs font-bold text-slate-700">
            {rating} of 5 Stars
          </span>
        </div>
      </div>

      {/* Review Comment Field */}
      <div>
        <label
          htmlFor="reviewComment"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
        >
          Your Feedback
        </label>
        <textarea
          id="reviewComment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Describe your experience with the craftsmanship, material, fit, and aesthetic..."
          className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          required
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition transform hover:scale-[1.02]"
        >
          {submitting ? (
            <span className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </span>
          ) : existingReview ? (
            "Update Review"
          ) : (
            "Submit Review"
          )}
        </button>
      </div>
    </form>
  );

  // If onClose is provided, render in an accessible modal dialog
  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-pop-in">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-400/30 relative animate-pop-in">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
            aria-label="Close dialog"
          >
            <FaTimes className="text-sm" />
          </button>

          <div className="mb-5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Verified Experience Review
            </span>
            <h3 className="text-2xl font-black text-white mt-2">
              {existingReview ? "Edit Your Review" : "Write a Customer Review"}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Your honest feedback helps fellow connoisseurs discover exceptional craftsmanship.
            </p>
          </div>

          <div className="text-slate-100">
            {formContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-3">
        {existingReview ? "Update Your Review" : "Write a Customer Review"}
      </h3>
      {formContent}
    </div>
  );
};

export default PostReview;
