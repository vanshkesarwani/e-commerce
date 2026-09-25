import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import DrawerMenu from "../Dashboard/Drawermenu";
import {
  FaCloudUploadAlt,
  FaArrowLeft,
  FaCheck,
  FaEdit,
  FaImage,
  FaRedo,
} from "react-icons/fa";

const CATEGORIES = [
  "Men",
  "Women",
  "Kids",
  "Footwear",
  "Beauty",
  "Accessories",
  "Home",
];

// ==========================================
// LUXURY PRODUCT EDITOR & UPDATER
// Edit Specifications, Stock, Price & Replace Image
// ==========================================
const UpdateProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState("");

  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch single product details to prefill
  useEffect(() => {
    if (!productId) {
      toast.error("Product ID is missing.");
      return;
    }

    const fetchDetail = async () => {
      try {
        setFetching(true);
        const { data } = await apiClient.get(`/products/getsingleproduct/${productId}`);

        if (data && data._id) {
          setTitle(data.title || "");
          setCategory(data.category || "");
          setDescription(data.description || "");
          setPrice(data.price !== undefined ? data.price : "");
          setStock(data.stock !== undefined ? data.stock : "");
          setCurrentImageUrl(data.productImage?.url || "");
        } else {
          toast.error("Product not found.");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error(error.message || "Failed to load product details.");
      } finally {
        setFetching(false);
      }
    };

    fetchDetail();
  }, [productId]);

  // Handle Replacement Photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(file.type)) {
      toast.error("Invalid format. Only JPG, PNG, and WEBP are supported.");
      return;
    }

    setNewImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setNewImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleResetImage = () => {
    setNewImageFile(null);
    setNewImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !category || !description.trim() || price === "" || stock === "") {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("category", category);
    formData.append("description", description.trim());
    formData.append("price", Number(price));
    formData.append("stock", Number(stock));

    if (newImageFile) {
      formData.append("productImage", newImageFile);
    }

    try {
      setUpdating(true);
      const { data } = await apiClient.put(
        `/products/updateproduct/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(data.message || "Product updated successfully!");
      setTimeout(() => navigate("/myproducts"), 800);
    } catch (error) {
      console.error("Update product error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Failed to update product"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900">
        <DrawerMenu />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Loading product record...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900">
      <DrawerMenu />

      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-5xl mx-auto w-full">
        {/* Header & Back Link */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <FaEdit className="text-amber-500" />
              <span>Product Editor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Update Product
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Modify details, pricing, inventory stock, or replace the primary image
            </p>
          </div>

          <Link
            to="/myproducts"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl transition shadow-xs"
          >
            <FaArrowLeft className="mr-2" />
            Back to Products
          </Link>
        </div>

        {/* Update Form Split View */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Management */}
          <div className="lg:col-span-5 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Product Visual
            </label>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center p-3">
                <img
                  src={newImagePreview || currentImageUrl || "https://via.placeholder.com/300"}
                  alt={title}
                  className="max-h-full max-w-full object-contain rounded-xl"
                />
              </div>

              {newImagePreview ? (
                <div className="w-full flex items-center justify-between bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs">
                  <span className="font-bold text-amber-800 flex items-center gap-1.5">
                    <FaImage className="text-amber-600" />
                    New image selected
                  </span>
                  <button
                    type="button"
                    onClick={handleResetImage}
                    className="text-red-600 hover:underline font-bold"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">
                  Currently displayed live on the storefront
                </p>
              )}

              {/* Replace image button */}
              <label className="w-full py-2.5 rounded-xl border border-slate-300 hover:border-amber-500 text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-white text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer">
                <FaCloudUploadAlt className="text-sm text-amber-500" />
                <span>{newImagePreview ? "Choose Different Image" : "Replace Image"}</span>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Right Column: Specification Form Fields */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Product Title <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product Title"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category <span className="text-amber-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Price (₹) <span className="text-amber-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Current Stock Inventory <span className="text-amber-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Stock count"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Product Description <span className="text-amber-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description and details..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/myproducts")}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-md transition transform hover:scale-105 disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
              >
                {updating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <FaCheck className="text-xs" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default UpdateProduct;