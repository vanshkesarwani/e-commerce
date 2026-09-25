import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import DrawerMenu from "../Dashboard/Drawermenu";
import {
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaExternalLinkAlt,
  FaExclamationTriangle,
  FaBoxes,
  FaTag,
  FaStar,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

const CATEGORIES = [
  "All",
  "Men",
  "Women",
  "Kids",
  "Footwear",
  "Beauty",
  "Accessories",
  "Home",
];

// ==========================================
// LUXURY ADMIN PRODUCT MANAGEMENT HUB
// List, Filter, Search, Edit & Delete Products
// ==========================================
const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Safety Delete Confirmation Modal state
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  // Fetch products using apiClient
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/products/getmyproduct");
      const list = Array.isArray(data) ? data : [];
      setProducts(list);
      setFilteredProducts(list);
    } catch (error) {
      console.error("Error fetching admin products:", error);
      toast.error(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter & Search
  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter((p) => {
        const cat = (p.category || "").toLowerCase();
        const sel = selectedCategory.toLowerCase();
        if (sel === "home") return cat.includes("home") || cat.includes("kitchen");
        return cat.includes(sel);
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products]);

  // Handle Confirmed Product Deletion
  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);
      const { data } = await apiClient.delete(`/products/delete/${productToDelete._id}`);
      toast.success(data.message || "Product deleted successfully");

      // Update state
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      setProductToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  // Metrics counters
  const totalCount = products.length;
  const lowStockCount = products.filter((p) => (p.stock ?? 0) <= 5 && (p.stock ?? 0) > 0).length;
  const outOfStockCount = products.filter((p) => (p.stock ?? 0) === 0).length;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900">
      <DrawerMenu />

      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Top Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <FaBoxes className="text-amber-500" />
              <span>Inventory Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manage Products
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Create, update inventory, review pricing, and delete products
            </p>
          </div>

          <Link
            to="/createproduct"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md transition transform hover:scale-105 text-xs sm:text-sm"
          >
            <FaPlus />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Products</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
              <FaBoxes />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Low Stock Alert (&le; 5)</span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">{lowStockCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
              <FaExclamationTriangle />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Out of Stock</span>
              <p className="text-2xl font-extrabold text-red-600 mt-1">{outOfStockCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg">
              <FaTimes />
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product title or description..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <span className="text-xs font-bold text-slate-500 self-end sm:self-center">
              Showing {filteredProducts.length} items
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center overflow-x-auto no-scrollbar space-x-1.5 pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-amber-400 font-bold shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table/Grid View */}
        {loading ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold mt-3">Loading product records...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <FaBoxes className="text-2xl" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No items match your active search or category filters. Try clearing your search query.
            </p>
            <div className="mt-4 flex justify-center space-x-3">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Reset Filters
              </button>
              <Link
                to="/createproduct"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition"
              >
                Create Product
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-bold">
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredProducts.map((p) => {
                    const isLow = (p.stock ?? 0) <= 5 && (p.stock ?? 0) > 0;
                    const isOut = (p.stock ?? 0) === 0;

                    return (
                      <tr
                        key={p._id}
                        className="hover:bg-slate-50/80 transition duration-150"
                      >
                        {/* Title & Image */}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                p.productImage?.url ||
                                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"
                              }
                              alt={p.title}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0 max-w-xs sm:max-w-md">
                              <p className="font-bold text-slate-900 line-clamp-1">
                                {p.title}
                              </p>
                              <p className="text-[10px] text-slate-400 font-normal line-clamp-1">
                                ID: {p._id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                            {p.category || "General"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-extrabold text-slate-900 text-sm">
                          ₹{p.price}
                        </td>

                        {/* Stock Status */}
                        <td className="py-3 px-4">
                          {isOut ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {p.stock} left (Low)
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {p.stock} units
                            </span>
                          )}
                        </td>

                        {/* Rating */}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1">
                            <FaStar className="text-amber-400 text-[11px]" />
                            <span className="font-bold text-slate-800">
                              {p.ratings ? Number(p.ratings).toFixed(1) : "5.0"}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              ({p.numOfReviews || 0})
                            </span>
                          </div>
                        </td>

                        {/* Action Buttons: Edit, View, Delete */}
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center space-x-1.5">
                            {/* Public View Link */}
                            <Link
                              to={`/product/${p._id}`}
                              target="_blank"
                              title="View on store"
                              className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                            >
                              <FaExternalLinkAlt className="text-xs" />
                            </Link>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => navigate(`/updateproduct/${p._id}`)}
                              title="Edit product"
                              className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition font-bold"
                            >
                              <FaEdit className="text-sm" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setProductToDelete(p)}
                              title="Delete product"
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                            >
                              <FaTrashAlt className="text-xs" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Safety Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-pop-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setProductToDelete(null)}
          />

          <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-500/30 z-10 space-y-5 animate-pop-in">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-2xl mx-auto shadow-inner">
              <FaExclamationTriangle />
            </div>

            <div className="text-center space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Permanent Action
              </span>
              <h3 className="text-xl font-black text-white">
                Delete Product Listing?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to remove{" "}
                <span className="text-amber-400 font-bold">
                  &ldquo;{productToDelete.title}&rdquo;
                </span>{" "}
                from catalog inventory? Associated media and SKU records will be permanently deleted.
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs shadow-lg hover:shadow-rose-600/30 transition transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center space-x-1.5"
              >
                <FaTrashAlt className="text-xs" />
                <span>{deleting ? "Deleting..." : "Confirm Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;