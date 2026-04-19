import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MyProducts = () => {
  const [myProducts, setMyProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3900/api/products/getmyproduct",
          { withCredentials: true }
        );
        setMyProducts(data);
        console.log(data)
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error(
          error.response?.data?.message || "Error fetching products."
        );
      }
    };

    fetchMyProducts();
  }, []);

  // Navigate to product detail page
  const handleViewDetails = (productId) => {
    navigate(`/productdetail/${productId}`);
  };

  // Delete a product
  const handleDelete = async (productId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3900/api/products/delete/${productId}`,
        { withCredentials: true }
      );
      toast.success(data.message || "Product deleted successfully");
      setMyProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error while deleting product."
      );
    }
  };

  // Navigate to update product page
  const handleUpdate = (productId) => {
    navigate(`/updateproduct/${productId}`);
  };

  return (
    <div className="container mx-auto my-12 p-4">
      {myProducts && myProducts.length > 0 ? (
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {myProducts.map((product) => (
            <div
              key={product._id || product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
            >
              {/* Product Image */}
              <img
              src={product?.productImage?.url || "https://via.placeholder.com/150"}
              alt={product.name || "Product"}
              className="w-full h-48 object-contain bg-gray-100"
              />


              {/* Product Details */}
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {product.name || "No Name"}
                </h3>
                <p className="text-gray-600 text-sm italic mb-4">
                  <span className="font-bold">Title:</span> {product.title || "No Title"}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-bold">Category:</span> {product.category || "N/A"}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-bold">Stock:</span> {product.stock || "N/A"}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-bold">Rating:</span> {product.rating || "N/A"} ⭐
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">Reviews:</span>{" "}
                  {product.numOfReviews || 0}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="bg-gray-100 p-4 text-center flex justify-between">
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-all duration-300"
                  onClick={() => handleViewDetails(product._id)}
                >
                  View Details
                </button>
                <button
                  className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow hover:bg-yellow-600 transition-all duration-300"
                  onClick={() => handleUpdate(product._id)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded-lg shadow hover:bg-red-600 transition-all duration-300"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-xl">
          No products available.
        </p>
      )}
    </div>
  );
};

export default MyProducts;