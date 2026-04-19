import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function SearchResults() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      const queryParams = new URLSearchParams(location.search);
      const keyword = queryParams.get("keyword");
      try {
        const { data } = await axios.get(
          `http://localhost:3900/api/products/search?keyword=${keyword}`
        );
        setProducts(data.products || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Search Results
      </h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
            >
              <div className="relative w-full h-56 bg-gray-200 flex items-center justify-center overflow-hidden">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={
                      product?.productImage?.url ||
                      "https://via.placeholder.com/400x300"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />

                  {/* NEW label */}
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold py-1 px-3 rounded-full">
                    NEW
                  </span>
                </Link>
              </div>

              <div className="p-2">
                <h3 className="font-bold text-gray-800 truncate text-center">
                  {product.title}
                </h3>
                <p className="text-lg text-green-600 font-bold mt-1 text-center">
                  ₹{product.price}
                </p>

                {/* Rating and Reviews Row */}
                <div className="flex mt-2 justify-between items-center">
                  <h3 className="font-bold text-sm text-yellow-600">
                    Rating: {product.ratings}
                  </h3>
                  <h3 className="text-red-900 font-bold text-sm">
                    Reviews: {product.numOfReviews}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 font-semibold mt-8">
          No products found
        </div>
      )}
    </div>
  );
}

export default SearchResults;