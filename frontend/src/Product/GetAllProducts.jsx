import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const GetAllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3900/api/products/getallproducts",
          {
            withCredentials: true,
          }
        );
        setAllProducts(data.products || []); // Assuming `data.products` contains the list of products
        setLoading(false);
        console.log(data)
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading products...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500 font-semibold">Error: {error}</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {allProducts.length === 0 ? (
        <p className="text-center text-gray-700 font-medium">
          No products available.
        </p>
      ) : (
        <div>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-200"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="relative w-full h-56 bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                      src={
                        product?.productImage?.url ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={product.title}
                      className="w-auto h-full object-contain"
                    />

                    {/* NEW label */}
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

                  {/* Rating and Reviews Row */}
                  <div className="flex mt-2">
                    <h3 className="font-bold mr-2">
                      Rating: {product.ratings} 
                    </h3>
                    <h3 className="text-red-900 font-bold ml-auto">
                      Reviews: {product.numOfReviews}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`px-4 py-2 mx-1 border rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllProducts;