import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";

const GetProductIDThenCategory = () => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchIdCategory = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3900/api/products/product/${id}/category`,
          {
            withCredentials: true,
          }
        );
        setRelatedProducts(data.relatedProducts || []);
      } catch (error) {
        console.error(error);
        toast.error("Error in Fetching Related Products");
      }
    };
    fetchIdCategory();
  }, [id]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Related Products Carousel */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">Related Products</h3>
        <div className="overflow-hidden relative">
          <div
            className="flex gap-4 animate-marquee"
            style={{
              whiteSpace: "nowrap",
              overflowX: "hidden",
              animation: "marquee 15s linear infinite",
            }}
          >
            {relatedProducts.map((relatedProduct) => (
              <Link
                to={`/product/${relatedProduct._id}`}
                key={relatedProduct._id}
                className="flex-none bg-gray-100 border rounded-lg shadow-md w-60 p-4 hover:shadow-lg"
                style={{ textDecoration: "none" }}
              >
                <img
                  src={relatedProduct.productImage?.url || "/placeholder.png"}
                  alt={relatedProduct.title}
                  className="w-full h-40 object-contain mb-4"
                />
                <h4 className="text-lg font-medium mb-2 truncate">
                  {relatedProduct.title}
                </h4>
                <p className="text-sm text-gray-600">
                  Price: ₹{relatedProduct.price}
                </p>
                <p className="text-sm text-gray-600">
                  Ratings: {relatedProduct.ratings} / 5
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetProductIDThenCategory;