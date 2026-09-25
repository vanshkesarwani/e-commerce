import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import DrawerMenu from "../Dashboard/Drawermenu";
import {
  FaImages,
  FaPlus,
  FaTrashAlt,
  FaSyncAlt,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

// ==========================================
// LUXURY HERO BANNER MANAGEMENT HUB
// Audit, preview, and control active promotional storefront banners
// ==========================================
const AllBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/banner/all");
      setBanners(data?.banners || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error(error.message || "Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const confirmDeleteBanner = async () => {
    if (!bannerToDelete) return;

    try {
      setDeleting(true);
      const { data } = await apiClient.delete(`/banner/delete/${bannerToDelete._id}`);
      toast.success(data?.message || "Banner removed successfully");
      setBanners((prev) => prev.filter((b) => b._id !== bannerToDelete._id));
      setBannerToDelete(null);
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error(error.message || "Failed to delete banner");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      <DrawerMenu />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Header Command Bar */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
                Marketing & Creative
              </span>
              <span className="text-xs text-slate-400">
                Active Banners: <strong className="text-white">{banners.length}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
              Storefront Hero Banners
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage high-impact hero slides, promotional carousels, and seasonal campaign visuals.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchBanners}
              disabled={loading}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-bold text-slate-300 hover:text-white transition active:scale-95 disabled:opacity-50"
            >
              <FaSyncAlt className={`text-xs ${loading ? "animate-spin text-amber-400" : ""}`} />
              <span>Refresh</span>
            </button>

            <Link
              to="/createbanner"
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-400/20 transition active:scale-95"
            >
              <FaPlus className="text-xs" />
              <span>Upload New Banner</span>
            </Link>
          </div>
        </header>

        {/* Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-3 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Loading storefront banners...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="mt-8 p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
            <FaImages className="text-4xl text-slate-700 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No active banners found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Add visually captivating hero banners to engage customers on the homepage.
            </p>
            <Link
              to="/createbanner"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold"
            >
              <FaPlus className="text-xs" />
              <span>Upload First Banner</span>
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {banners.map((banner, index) => (
              <div
                key={banner._id}
                className="overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-xl group hover:border-slate-700 transition"
              >
                {/* Banner Image Preview Container */}
                <div className="relative w-full h-56 sm:h-72 lg:h-80 bg-slate-950 overflow-hidden">
                  <img
                    src={banner.bannerImage?.url}
                    alt={`Hero Banner #${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-101 transition duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-400/30">
                      Hero Slide #{index + 1}
                    </span>
                  </div>
                </div>

                {/* Banner Controls Bar */}
                <div className="p-4 sm:p-5 flex items-center justify-between bg-slate-900/90 border-t border-slate-800">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <FaCheckCircle className="text-emerald-400" />
                    <span>Active on Public Storefront</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBannerToDelete(banner)}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-rose-400 border border-slate-700 hover:border-rose-800/50 text-xs font-bold transition"
                  >
                    <FaTrashAlt className="text-xs" />
                    <span>Delete Slide</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {bannerToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-rose-800/40 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center space-x-3 text-rose-400">
                <FaExclamationTriangle className="text-2xl" />
                <h3 className="text-base font-bold text-white">Remove Hero Banner?</h3>
              </div>
              <p className="text-xs text-slate-300">
                Are you sure you want to delete this promotional banner? It will immediately disappear from the homepage carousel.
              </p>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBannerToDelete(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteBanner}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-extrabold text-white"
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllBanners;