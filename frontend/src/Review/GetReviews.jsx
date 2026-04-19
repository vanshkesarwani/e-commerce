import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const GetReviews = () => {
  const [allReviews, setAllReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    productId: '', 
    reviewId: '', // Track the review being updated
  });
  const { id } = useParams(); // Get the product ID from the URL

  // Fetch all reviews when the component mounts
  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3900/api/products/getreviews/${id}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (data.success) {
          setAllReviews(data.reviews);
        } else {
          toast.error('No reviews available for this product.');
        }
      } catch (error) {
        console.log(error);
        toast.error("Error fetching reviews.");
      }
    };

    fetchProductReviews();
  }, [id]);

  // Handle input changes for new review
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: value,
    });
  };

  // Handle star rating selection
  const handleStarClick = (rating) => {
    setNewReview({
      ...newReview,
      rating,
    });
  };

  // Handle form submission to create or update the review
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const reviewData = {
      rating: newReview.rating,
      comment: newReview.comment,
      productId: id, // Sending the product ID from URL
    };

    try {
      // Check if reviewId exists to determine if we're creating or updating
      const url = newReview.reviewId
        ? `http://localhost:3900/api/products/createreview` // Create or update review (based on reviewId)
        : `http://localhost:3900/api/products/createreview`; // If no reviewId, it will create the review (Adjust if necessary)

      const response = await axios.put(url, reviewData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        const updatedReviews = allReviews.map((review) =>
          review._id === newReview.reviewId ? response.data.review : review
        );
        setAllReviews(updatedReviews); // Update the review in the list
        setShowForm(false); // Close the review form
        toast.success('Review updated/created successfully!');
      } else {
        toast.error('Error updating/creating review.');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error submitting review.');
    }
  };

  // Handle click to edit a review
  const handleEditClick = (review) => {
    setNewReview({
      rating: review.rating,
      comment: review.comment,
      productId: id,
      reviewId: review._id, // Set reviewId to the review being updated
    });
    setShowForm(true); // Open the form to edit the review
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Product Reviews</h2>
      
      {/* Display all reviews */}
      <div className="max-w-4xl mx-auto">
        {allReviews.length > 0 ? (
          <div className="flex overflow-x-auto space-x-6 pb-4">
            {allReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-4 rounded-lg shadow-md flex-shrink-0 w-64 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl min-h-[180px]"
              >
                <div className="flex items-center space-x-4">
                  {/* Use a fallback image if photo is undefined */}
                  <img
                    src={review.photo || 'default-profile-photo.png'} // Fallback to a default image if photo is missing
                    className="w-12 h-12 rounded-full object-cover"
                    alt={review.name || 'User'} // Fallback to 'User' if name is missing
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{review.name}</h3>
                    <p className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                  </div>
                </div>
                <p className="text-gray-600 mt-2 text-sm">{review.comment}</p>
                {/* Button to open the review form to update the review */}
                <div className="text-center mt-4">
                  <button
                    onClick={() => handleEditClick(review)} 
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all"
                  >
                    Update Your Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No reviews yet for this product.</p>
        )}
      </div>

      {/* Review form modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-2xl font-semibold mb-4">Update Your Review</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm text-gray-700">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      onClick={() => handleStarClick(star)}
                      className={`w-8 h-8 cursor-pointer ${newReview.rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 17.75l6.62 3.5-1.69-7.12L22 9.5l-7.19-.61L12 2 9.19 8.89 2 9.5l4.07 4.63-1.69 7.12L12 17.75z"
                      />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm text-gray-700">Comment</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={newReview.comment}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  rows="4"
                  placeholder="Write your review here..."
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  {newReview.reviewId ? 'Update Review' : 'Create Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetReviews;