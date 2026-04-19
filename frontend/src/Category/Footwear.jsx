import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const Footwear = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [footwearProducts, setFootwearProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3900/api/products/getallproducts", // Fetching all products
          {
            withCredentials: true,
          }
        );
        setAllProducts(data.products || []);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    // Filter products by category 'Footwear'
    if (allProducts.length > 0) {
      const filteredProducts = allProducts.filter(
        (product) => product.category === "Footwear" // Only Footwear category
      );
      setFootwearProducts(filteredProducts);
    }
  }, [allProducts]); // Re-run when allProducts change

  if (loading) return <Loader />; // Use the Loader component during loading

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500 font-semibold">Error: {error}</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {footwearProducts.length === 0 ? (
        <p className="text-center text-gray-700 font-medium">No Footwear Products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {footwearProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-200"
            >
              <Link to={`/product/${product._id}`}>
                <div className="relative w-full h-56 bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={product?.productImage?.url || "https://via.placeholder.com/400x300"}
                    alt={product.title}
                    className="w-auto h-full object-contain"
                  />
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold py-1 px-3 rounded-full">
                    NEW
                  </span>
                </div>
              </Link>
              <div className="p-2">
                <h3 className="font-bold text-gray-800 truncate text-center">
                  {product.title}
                </h3>
                <p className="text-lg text-green-600 font-bold mt-1 text-center">
                  ₹{product.price}
                </p>
                <div className="flex mt-2">
                  <h3 className="font-bold mr-2">Rating: {product.rating} ⭐</h3>
                  <h3 className="text-red-900 font-bold ml-[150px]">
                    Reviews: {product.numOfReviews}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Footwear;
