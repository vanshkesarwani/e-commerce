import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const UpdateProduct = () => {
  const { productId } = useParams(); // Get productId from URL
  const navigate = useNavigate();

  // State for managing product data
  const [productData, setProductData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    productImage: "", // This will hold the URL for image after upload
    file: null, // To store file for upload
  });

  // Fetch product details when component mounts
  useEffect(() => {
    if (!productId) {
      console.error("Product ID is undefined.");
      toast.error("Product ID is missing.");
      return;
    }

    const fetchProductDetail = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3900/api/products/getsingleproduct/${productId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API response:", data); 

        // Check if the product data exists in the response
        if (data && data._id) {
          setProductData({
            title: data.title,
            category: data.category,
            description: data.description,
            price: data.price,
            stock: data.stock,
            productImage: data.productImage.url || "", // Accessing product image URL
            file: null, // Reset the file input
          });
        } else {
          console.error("Product data is missing in the response.");
          toast.error("Failed to load product details.");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to load product details.");
      }
    };

    fetchProductDetail();
  }, [productId]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setProductData((prevData) => ({ ...prevData, category: value }));
  };

  // Handle file change (image upload)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProductData((prevData) => ({
      ...prevData,
      file,
      productImage: URL.createObjectURL(file), // Show the uploaded image preview
    }));
  };

  // Handle form submission
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("category", productData.category);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("stock", productData.stock);
    formData.append("productImage", productData.file); // Append the image file

    try {
      await axios.put(
        `http://localhost:3900/api/products/updateproduct/${productId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Use multipart/form-data for file uploads
          },
        }
      );
      toast.success("Product updated successfully!");
      navigate("/myproducts");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-8">Update Product</h1>
        <form onSubmit={handleUpdateProduct}>
          {/* Title */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-semibold mb-2"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={productData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-lg">Category</label>
            <select
              value={productData.category}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Shoes">Shoes</option>
              <option value="Shirts">Shirts</option>
              <option value="Paints">Paints</option>
              <option value="Watches">Watches</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-semibold mb-2"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={productData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-700 font-semibold mb-2"
            >
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              value={productData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Stock */}
          <div className="mb-4">
            <label
              htmlFor="stock"
              className="block text-gray-700 font-semibold mb-2"
            >
              Stock
            </label>
            <input
              type="number"
              name="stock"
              id="stock"
              value={productData.stock}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Product Image */}
          <div className="mb-4">
            <label
              htmlFor="productImage"
              className="block text-gray-700 font-semibold mb-2"
            >
              Product Image
            </label>
            {productData.productImage && (
              <img
                src={productData.productImage}
                alt="Product"
                className="w-24 h-24 object-cover mb-2"
              />
            )}
            <input
              type="file"
              name="productImage"
              id="productImage"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;