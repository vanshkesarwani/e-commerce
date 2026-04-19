import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";
import GetProductIDThenCategory from "./GetProductIDThenCategory";

const ProductDetails = () => {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [allReviews, setAllReviews] = useState([]);
  const [productDetail, setProductDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3900/api/products/getsingleproduct/${id}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setProductDetail(data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching product");
        setLoading(false);
      }
    };

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
          toast.error("No reviews available for this product.");
        }
      } catch (error) {
        toast.error("Error fetching reviews.");
      }
    };

    fetchProductDetails();
    fetchProductReviews();
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("You need to log in to submit a review.");
      return;
    }

    if (!rating || !comment) {
      toast.error("Please provide both rating and comment.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:3900/api/products/createreview",
        { rating, comment, productId: id },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        setAllReviews((prev) => [
          ...prev,
          { rating, comment, name: "You" },
        ]);
        setRating("");
        setComment("");
      } else {
        toast.error("Failed to submit review.");
      }
    } catch (error) {
      toast.error("Error submitting review.");
    }
  };


  const handleAddToCart = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3900/api/cart",
        {
          productId: id, // Send the product id here
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Product Added To Cart");
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error("Product not added to cart");
    }
  };
  
  
    const handleContinuePurchase = () => {
      if (isAuthenticated) {
        navigate("/address");
      } else {
        navigate("/login"); 
      }
    };
  
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-4 px-2 sm:px-4 md:px-6">
      <div className="container mx-auto">
        {productDetail && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              {productDetail?.productImage && (
                <div className="w-full h-[350px] md:h-[500px] flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={productDetail?.productImage?.url}
                    alt={productDetail?.title}
                    className="w-auto h-full object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                {productDetail?.title}
              </h1>
              <div className="flex items-center space-x-2 text-lg text-gray-600">
                <span className="font-semibold">Avarage Rating:</span>
                <span>{productDetail?.ratings} </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
                ₹{productDetail?.price}
              </div>
              <div className="text-lg text-gray-500">
                <span>{productDetail?.numOfReviews} Reviews</span>
              </div>
              <div className="text-lg font-bold text-red-600">
                {productDetail?.stock > 0 ? "In Stock" : "Out of Stock"}
              </div>
              <div className="text-gray-600">
                <p className="text-lg text-justify">{productDetail?.description}</p>
              </div>
            </div>
          </section>
        )}
      </div>
      <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  className="bg-yellow-500 w-[650px] ml-[750px] text-white text-lg px-6 py-3 rounded-md hover:bg-yellow-600 transition-all duration-300 focus:outline-none"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleContinuePurchase}
                  className="bg-green-500 w-[650px] ml-[750px] text-white text-lg px-6 py-3 rounded-md hover:bg-green-600 transition-all duration-300 focus:outline-none"
                >
                  Continue to Purchase
                </button>
              </div>

      <div className="container mx-auto ">
        <div className="p-6 bg-gray-50 shadow-2xl">
          <h2 className="text-3xl shadow-2xl font-semibold text-center text-gray-800 mb-6">
            Add Your Review
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="Enter rating (1-5)"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min="1"
              max="5"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleReviewSubmit}
            >
              Submit Review
            </button>
          </div>
        </div>
        <div className="p-6 bg-gray-50">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Product Reviews
          </h2>
          <div className="max-w-7xl mx-auto">
            {allReviews.length > 0 ? (
              <div className="flex overflow-x-auto space-x-2 pb-4">
                {allReviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md flex-shrink-0 w-64"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={review.photo || "default-profile.png"}
                        className="w-12 h-12 rounded-full object-cover"
                        alt={review.name}
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {review.name}
                        </h3>
                        <p className="text-yellow-500 text-3xl">
                          {"★".repeat(review.rating)}{" "}
                          {"☆".repeat(5 - review.rating)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No reviews yet for this product.
              </p>
            )}
          </div>
        </div>
        
      </div>
      <div>
          <GetProductIDThenCategory />
        </div>
    </div>
  );
};

export default ProductDetails;