import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import DrawerMenu from "../Dashboard/Drawermenu";
import { useAuth } from "../context/AuthProvider";
import {
  FaRupeeSign,
  FaShoppingBag,
  FaBoxes,
  FaUsers,
  FaArrowUp,
  FaClock,
  FaCheckCircle,
  FaShippingFast,
  FaExclamationTriangle,
  FaSyncAlt,
  FaPlus,
  FaEye,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaChartBar,
  FaChevronRight,
  FaTag,
} from "react-icons/fa";

// ==========================================
// EXECUTIVE ADMIN DASHBOARD OVERVIEW
// Complete command center with live analytics, inventory radar, and order management
// ==========================================
const Dashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Fetch executive dashboard stats from backend
  const fetchDashboardStats = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const { data } = await apiClient.get("/dashboard/stats");
      if (data?.success && data?.data) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to load dashboard metrics:", error);
      toast.error(error.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Quick inline order status update
  const handleQuickStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const { data } = await apiClient.put(`/order/update/${orderId}`, {
        status: newStatus,
      });

      toast.success(data.message || `Order updated to ${newStatus}`);

      // Update local state instantly for snappy UX
      setStats((prev) => {
        if (!prev) return prev;
        const updatedRecentOrders = prev.recentOrders.map((ord) =>
          ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord
        );

        // Recalculate status counts
        const updatedCounts = { ...prev.orderStatusCounts };
        fetchDashboardStats(true); // background sync
        return {
          ...prev,
          recentOrders: updatedRecentOrders,
        };
      });
    } catch (error) {
      console.error("Order update error:", error);
      toast.error(error.message || "Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Helper for status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Shipped":
        return "bg-sky-500/10 text-sky-400 border-sky-500/30";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "Processing":
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
  };

  // Calculate highest revenue day for relative chart scaling
  const maxRevenue = Math.max(
    ...(stats?.salesTrend?.map((d) => d.revenue) || [1]),
    1
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Persistent Dark-Luxe Sidebar */}
      <DrawerMenu />

      {/* Main Dashboard Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Top Header Command Bar */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
                Operations HQ
              </span>
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <FaClock className="text-amber-400 text-[11px]" />
                <span>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
              Executive Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Welcome back,{" "}
              <span className="text-amber-400 font-semibold">
                {profile?.name || "Administrator"}
              </span>
              . Real-time store performance and logistics breakdown.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => fetchDashboardStats(true)}
              disabled={refreshing || loading}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-bold text-slate-300 hover:text-white transition active:scale-95 disabled:opacity-50"
              title="Refresh live metrics"
            >
              <FaSyncAlt className={`text-xs ${refreshing ? "animate-spin text-amber-400" : ""}`} />
              <span>{refreshing ? "Refreshing..." : "Sync Data"}</span>
            </button>

            <Link
              to="/createproduct"
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-400/20 transition active:scale-95"
            >
              <FaPlus className="text-xs" />
              <span>Add Product</span>
            </Link>

            <Link
              to="/allorders"
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition active:scale-95"
            >
              <FaShoppingBag className="text-xs text-amber-400" />
              <span>All Orders</span>
            </Link>
          </div>
        </header>

        {loading ? (
          /* High-End Skeleton Loader */
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-3 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-400 animate-pulse">
              Aggregating live store metrics and order logs...
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* 1. EXECUTIVE KPI METRICS (4 CARDS) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Revenue */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-5 border border-slate-800 hover:border-amber-400/40 transition group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Gross Revenue
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                    <FaRupeeSign className="text-base" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline">
                    <span className="text-amber-400 text-xl mr-0.5">₹</span>
                    {stats?.kpis?.totalRevenue?.toLocaleString("en-IN") || 0}
                  </div>
                  <div className="flex items-center space-x-1.5 mt-2 text-[11px] text-emerald-400 font-semibold">
                    <FaArrowUp className="text-[10px]" />
                    <span>AOV: ₹{stats?.kpis?.averageOrderValue?.toLocaleString("en-IN") || 0}</span>
                    <span className="text-slate-400 font-normal">per transaction</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-amber-400/5 blur-xl group-hover:bg-amber-400/10 transition" />
              </div>

              {/* Card 2: Total Orders */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-5 border border-slate-800 hover:border-sky-400/40 transition group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Total Orders
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
                    <FaShoppingBag className="text-base" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {stats?.kpis?.totalOrders || 0}
                  </div>
                  <div className="flex items-center space-x-1.5 mt-2 text-[11px]">
                    <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400 font-bold">
                      {stats?.orderStatusCounts?.Processing || 0} Processing
                    </span>
                    <span className="text-slate-400">require fulfillment</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-sky-400/5 blur-xl group-hover:bg-sky-400/10 transition" />
              </div>

              {/* Card 3: Inventory Products */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-5 border border-slate-800 hover:border-emerald-400/40 transition group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Catalog Items
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                    <FaBoxes className="text-base" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {stats?.kpis?.totalProducts || 0}
                  </div>
                  <div className="flex items-center space-x-1.5 mt-2 text-[11px]">
                    <span className="text-emerald-400 font-semibold">
                      {stats?.kpis?.inStockCount || 0} in stock
                    </span>
                    {stats?.kpis?.lowStockCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                        {stats?.kpis?.lowStockCount} low stock
                      </span>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-emerald-400/5 blur-xl group-hover:bg-emerald-400/10 transition" />
              </div>

              {/* Card 4: Customers & Users */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-5 border border-slate-800 hover:border-purple-400/40 transition group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Registered Users
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400">
                    <FaUsers className="text-base" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {stats?.kpis?.totalUsers || 0}
                  </div>
                  <div className="flex items-center space-x-1.5 mt-2 text-[11px] text-slate-400">
                    <span className="text-purple-400 font-semibold">
                      {stats?.kpis?.customerCount || 0} Customers
                    </span>
                    <span>•</span>
                    <span className="text-amber-400 font-semibold">
                      {stats?.kpis?.adminCount || 0} Admins
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-purple-400/5 blur-xl group-hover:bg-purple-400/10 transition" />
              </div>
            </section>

            {/* 2. REVENUE TREND VISUALIZER & STATUS FUNNEL */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 7-Day Performance Chart (2 Cols) */}
              <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-extrabold text-white flex items-center space-x-2">
                      <FaChartBar className="text-amber-400" />
                      <span>7-Day Sales & Volume Trend</span>
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Daily gross revenue and order frequency across the past week
                    </p>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Weekly Pulse
                  </span>
                </div>

                {/* SVG/Bar Chart */}
                <div className="h-48 sm:h-56 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800/80">
                  {stats?.salesTrend?.map((item, idx) => {
                    const heightPercent = maxRevenue > 0 ? Math.max((item.revenue / maxRevenue) * 100, 6) : 6;
                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center justify-end h-full group relative"
                      >
                        {/* Hover Tooltip */}
                        <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-slate-950 text-white text-[10px] py-1 px-2 rounded-lg border border-slate-700 shadow-xl pointer-events-none whitespace-nowrap">
                          <span className="font-bold text-amber-400">₹{item.revenue.toLocaleString("en-IN")}</span>
                          <span className="text-slate-400 text-[9px]">{item.orders} order(s)</span>
                        </div>

                        {/* Order Count Dot */}
                        {item.orders > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mb-1 group-hover:scale-125 transition" />
                        )}

                        {/* Animated Visual Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[36px] rounded-t-lg transition-all duration-500 ${
                            item.revenue > 0
                              ? "bg-gradient-to-t from-amber-500/30 to-amber-400 group-hover:to-amber-300 shadow-lg shadow-amber-400/10"
                              : "bg-slate-800/60"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Day Labels */}
                <div className="flex justify-between items-center px-2 pt-2 text-[10px] font-semibold text-slate-400">
                  {stats?.salesTrend?.map((item, idx) => (
                    <div key={idx} className="flex-1 text-center">
                      <span className="block text-slate-300">{item.day}</span>
                      <span className="block text-[9px] text-slate-400">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status Funnel (1 Col) */}
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-extrabold text-white flex items-center space-x-2">
                      <FaShippingFast className="text-amber-400" />
                      <span>Order Fulfillment</span>
                    </h2>
                    <Link
                      to="/allorders"
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                    >
                      <span>View All</span>
                      <FaChevronRight className="text-[9px]" />
                    </Link>
                  </div>

                  <div className="space-y-3.5">
                    {/* Processing */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-amber-400 flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          <span>Processing</span>
                        </span>
                        <span className="text-white font-mono font-bold">
                          {stats?.orderStatusCounts?.Processing || 0}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          style={{
                            width: `${
                              stats?.kpis?.totalOrders > 0
                                ? ((stats?.orderStatusCounts?.Processing || 0) / stats.kpis.totalOrders) * 100
                                : 0
                            }%`,
                          }}
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>

                    {/* Shipped */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-sky-400 flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-sky-400" />
                          <span>Shipped & In Transit</span>
                        </span>
                        <span className="text-white font-mono font-bold">
                          {stats?.orderStatusCounts?.Shipped || 0}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          style={{
                            width: `${
                              stats?.kpis?.totalOrders > 0
                                ? ((stats?.orderStatusCounts?.Shipped || 0) / stats.kpis.totalOrders) * 100
                                : 0
                            }%`,
                          }}
                          className="h-full bg-sky-400 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>

                    {/* Delivered */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-emerald-400 flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>Delivered</span>
                        </span>
                        <span className="text-white font-mono font-bold">
                          {stats?.orderStatusCounts?.Delivered || 0}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          style={{
                            width: `${
                              stats?.kpis?.totalOrders > 0
                                ? ((stats?.orderStatusCounts?.Delivered || 0) / stats.kpis.totalOrders) * 100
                                : 0
                            }%`,
                          }}
                          className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>

                    {/* Cancelled */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-rose-400 flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-400" />
                          <span>Cancelled</span>
                        </span>
                        <span className="text-white font-mono font-bold">
                          {stats?.orderStatusCounts?.Cancelled || 0}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          style={{
                            width: `${
                              stats?.kpis?.totalOrders > 0
                                ? ((stats?.orderStatusCounts?.Cancelled || 0) / stats.kpis.totalOrders) * 100
                                : 0
                            }%`,
                          }}
                          className="h-full bg-rose-400 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Completion Rate</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {stats?.kpis?.totalOrders > 0
                      ? Math.round(
                          ((stats?.orderStatusCounts?.Delivered || 0) / stats.kpis.totalOrders) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </section>

            {/* 3. OPERATIONAL RADAR: LOW STOCK ALERTS & CATEGORY DISTRIBUTION */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Low Stock Radar (2 Cols) */}
              <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-extrabold text-white flex items-center space-x-2">
                      <FaExclamationTriangle className="text-rose-400" />
                      <span>Inventory Restock Alerts (≤ 5 in stock)</span>
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Products reaching critical stock levels that need inventory replenishment
                    </p>
                  </div>
                  <Link
                    to="/myproducts"
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                  >
                    <span>Manage All</span>
                    <FaChevronRight className="text-[9px]" />
                  </Link>
                </div>

                {stats?.lowStockProducts?.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 bg-slate-950/50 rounded-xl border border-slate-800/80">
                    <FaCheckCircle className="text-emerald-400 text-2xl mx-auto mb-2" />
                    <p className="font-semibold text-slate-300">All product stock levels are healthy!</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">No products currently below 5 units.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {stats?.lowStockProducts?.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={product.productImage?.url || "https://placehold.co/80x80?text=Item"}
                            alt={product.title}
                            className="w-11 h-11 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-[170px]">
                              {product.title}
                            </h4>
                            <p className="text-[10px] text-slate-400">
                              ₹{product.price?.toLocaleString("en-IN")} • {product.category}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              product.stock === 0
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {product.stock === 0 ? "OUT OF STOCK" : `${product.stock} LEFT`}
                          </span>
                          <div className="mt-1">
                            <Link
                              to={`/updateproduct/${product._id}`}
                              className="text-[10px] font-bold text-sky-400 hover:text-sky-300 inline-flex items-center space-x-1"
                            >
                              <span>Restock</span>
                              <FaExternalLinkAlt className="text-[8px]" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Breakdown (1 Col) */}
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-extrabold text-white flex items-center space-x-2">
                    <FaTag className="text-amber-400" />
                    <span>Catalog Distribution</span>
                  </h2>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {stats?.categoryBreakdown?.length || 0} Categories
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                  {stats?.categoryBreakdown?.map((cat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
                    >
                      <span className="text-xs font-bold text-slate-300 capitalize">
                        {cat.category}
                      </span>
                      <div className="flex items-center space-x-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-amber-400 font-bold font-mono">
                          {cat.count} items
                        </span>
                        <span className="text-slate-400 text-[10px]">
                          ({cat.totalStock} units)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. RECENT ORDERS MANAGEMENT STREAM */}
            <section className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
                    <FaShoppingBag className="text-amber-400" />
                    <span>Recent Customer Orders</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Latest incoming transactions with 1-click status update control
                  </p>
                </div>

                <Link
                  to="/allorders"
                  className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition border border-slate-700"
                >
                  <span>Open Full Order Management</span>
                  <FaChevronRight className="text-[9px] text-amber-400" />
                </Link>
              </div>

              {stats?.recentOrders?.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No orders recorded in the system yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-3.5 px-4">Order ID & Date</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Items</th>
                        <th className="py-3.5 px-4">Total Amount</th>
                        <th className="py-3.5 px-4">Status & Quick Update</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {stats?.recentOrders?.map((order) => (
                        <tr
                          key={order._id}
                          className="hover:bg-slate-800/40 transition group"
                        >
                          {/* Order ID & Date */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-white block">
                              #{order._id.substring(order._id.length - 8)}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-bold text-white block">
                              {order.customerName}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">
                              {order.customerEmail}
                            </span>
                          </td>

                          {/* Items count & preview */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {order.firstItemImage ? (
                                <img
                                  src={order.firstItemImage}
                                  alt="Item"
                                  className="w-7 h-7 rounded object-cover border border-slate-700"
                                />
                              ) : null}
                              <span className="font-semibold text-slate-300">
                                {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                              </span>
                            </div>
                          </td>

                          {/* Total Amount */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-black text-amber-400 font-mono text-sm">
                              ₹{order.totalPrice?.toLocaleString("en-IN")}
                            </span>
                          </td>

                          {/* Status & Inline Status Selector */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(
                                  order.orderStatus
                                )}`}
                              >
                                {order.orderStatus}
                              </span>

                              {/* Inline Quick Status Switcher */}
                              <select
                                value={order.orderStatus}
                                disabled={updatingOrderId === order._id}
                                onChange={(e) =>
                                  handleQuickStatusChange(order._id, e.target.value)
                                }
                                className="bg-slate-950 border border-slate-700 text-[10px] font-semibold text-slate-200 rounded-lg px-2 py-1 focus:outline-hidden focus:border-amber-400 transition cursor-pointer"
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <Link
                              to={`/update-order/${order._id}`}
                              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold border border-slate-700 transition"
                            >
                              <FaEye className="text-[10px] text-amber-400" />
                              <span>Details</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;