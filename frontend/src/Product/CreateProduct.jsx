import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import DrawerMenu from "../Dashboard/Drawermenu";
import {
  FaCloudUploadAlt,
  FaTimes,
  FaCheck,
  FaBoxes,
  FaArrowLeft,
  FaPlusCircle,
  FaImage,
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
// LUXURY PRODUCT CREATION STUDIO
// Create New Product with Image Dropzone & Preview
// ==========================================
const CreateProduct = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Photo change handler with client-side preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(file.type)) {
      toast.error("Invalid format. Only JPG, PNG, and WEBP are supported.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    setProductImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setProductImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !category || !description.trim() || !price || !stock) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!productImage) {
      toast.error("Please select a high-quality product image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("category", category);
    formData.append("description", description.trim());
    formData.append("price", Number(price));
    formData.append("stock", Number(stock));
    formData.append("productImage", productImage);

    try {
      setLoading(true);
      const { data } = await apiClient.post("/products/create/new", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message || "Product created successfully!");
      // Reset form
      setTitle("");
      setCategory("");
      setDescription("");
      setPrice("");
      setStock("");
      setProductImage(null);
      setImagePreview("");

      // Optional navigate
      setTimeout(() => navigate("/myproducts"), 800);
    } catch (error) {
      console.error("Create product error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900">
      <DrawerMenu />

      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-5xl mx-auto w-full">
        {/* Header & Back Link */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <FaPlusCircle className="text-amber-500" />
              <span>Catalog Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create New Product
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Publish a new luxury piece with high-resolution imagery and specifications
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

        {/* Creation Form Split View */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Dropzone & Preview */}
          <div className="lg:col-span-5 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Product Image <span className="text-amber-500">*</span>
            </label>

            <div className="relative border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-3xl p-6 bg-white transition duration-200 flex flex-col items-center justify-center min-h-[340px] text-center overflow-hidden">
              {imagePreview ? (
                <div className="relative w-full h-full flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="max-h-72 w-auto object-contain rounded-2xl border border-slate-100 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 p-2 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition shadow"
                    title="Remove image"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                  <span className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-600 mt-3">
                    <FaCheck className="text-[10px]" />
                    <span>Image ready for upload</span>
                  </span>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center space-y-3 w-full h-full justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl shadow-inner">
                    <FaCloudUploadAlt />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Click to upload photo
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      PNG, JPG, or WEBP up to 5MB
                    </p>
                  </div>
                  <span className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-[11px] text-slate-400 italic">
              * The image will be automatically optimized and hosted on Cloudinary CDN.
            </p>
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
                placeholder="e.g. Italian Virgin Wool Tailored Blazer"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
            </div>

            {/* Category & Stock Grid */}
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
                  placeholder="e.g. 4999"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Initial Stock Inventory <span className="text-amber-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="e.g. 25"
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
                placeholder="Describe material, tailoring, craftsmanship, and fit recommendations..."
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
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-md transition transform hover:scale-105 disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <FaCheck className="text-xs" />
                    <span>Publish Product</span>
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

export default CreateProduct;