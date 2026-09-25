import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import DrawerMenu from "../Dashboard/Drawermenu";
import {
  FaCloudUploadAlt,
  FaImages,
  FaArrowLeft,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

// ==========================================
// LUXURY BANNER UPLOADER
// High-res campaign hero slide publishing module
// ==========================================
const CreateBanner = () => {
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit. Please upload an optimized banner.");
      return;
    }

    setBannerImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setBannerPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearPreview = () => {
    setBannerImage(null);
    setBannerPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bannerImage) {
      toast.error("Please select an image for the storefront banner");
      return;
    }

    const formData = new FormData();
    formData.append("bannerImage", bannerImage);

    try {
      setUploading(true);
      const { data } = await apiClient.post("/banner/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data?.message || "Hero banner published successfully!");
      navigate("/allbanners");
    } catch (error) {
      console.error("Banner upload error:", error);
      toast.error(error.message || "Failed to upload banner. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      <DrawerMenu />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Header Command Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
                Marketing Creator
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
              Publish Hero Banner
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Upload a 1920x600 or 1400x500 high-resolution visual for the storefront carousel.
            </p>
          </div>

          <Link
            to="/allbanners"
            className="self-start sm:self-auto flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to All Banners</span>
          </Link>
        </header>

        {/* Upload Form Card */}
        <div className="mt-8 max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6"
          >
            {/* Dropzone / Upload Area */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Banner Artwork (JPG, PNG, WEBP)
              </label>

              {bannerPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 group bg-slate-950">
                  <img
                    src={bannerPreview}
                    alt="Banner Preview"
                    className="w-full h-56 sm:h-72 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-3">
                    <button
                      type="button"
                      onClick={handleClearPreview}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg"
                    >
                      <FaTimes className="text-xs" />
                      <span>Change Image</span>
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-2xl bg-slate-950/60 hover:bg-slate-950 cursor-pointer transition text-center group">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition">
                    <FaCloudUploadAlt className="text-2xl" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Click to select artwork or drag and drop
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Recommended dimensions: 1920x600 or 1400x500 pixels. Maximum file size: 5MB.
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/allbanners")}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!bannerImage || uploading}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-400/20 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    <span>Publishing to Cloud...</span>
                  </>
                ) : (
                  <>
                    <FaCheck className="text-xs" />
                    <span>Publish Banner</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateBanner;