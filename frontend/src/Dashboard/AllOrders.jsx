import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import DrawerMenu from "./Drawermenu";
import {
  FaShoppingBag,
  FaSearch,
  FaTrashAlt,
  FaEdit,
  FaEye,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCheckCircle,
  FaTimes,
  FaExclamationTriangle,
  FaSyncAlt,
  FaBoxOpen,
} from "react-icons/fa";

// ==========================================
// LUXURY ORDER OPERATIONS & FULFILLMENT HUB
// Search, Filter by Status, Inline Status Transitions & Order Inspection
// ==========================================
const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Inspection modal state
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Delete modal state
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Updating single status state
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/order/admin/orders");
      const list = data?.orders || [];
      setOrders(list);
      setFilteredOrders(list);
    } catch (error) {
      console.error("Failed to fetch customer orders:", error);
      toast.error(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter and search
  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== "All") {
      result = result.filter(
        (o) => (o.orderStatus || "").toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o._id.toLowerCase().includes(q) ||
          (o.shippingInfo?.city || "").toLowerCase().includes(q) ||
          (o.shippingInfo?.phoneNo ? String(o.shippingInfo.phoneNo) : "").includes(q) ||
          (o.orderItems || []).some((item) => (item.name || "").toLowerCase().includes(q))
      );
    }

    setFilteredOrders(result);
  }, [searchQuery, statusFilter, orders]);

  // Inline status transition
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const { data } = await apiClient.put(`/order/update/${orderId}`, {
        status: newStatus,
      });

      toast.success(data.message || `Order updated to ${newStatus}`);

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (error) {
      console.error("Order status update failed:", error);
      toast.error(error.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete confirmation
  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      setDeleting(true);
      const { data } = await apiClient.delete(`/order/delete/${orderToDelete._id}`);
      toast.success(data.message || "Order deleted successfully");
      setOrders((prev) => prev.filter((o) => o._id !== orderToDelete._id));
      setOrderToDelete(null);
    } catch (error) {
      console.error("Delete order error:", error);
      toast.error(error.message || "Failed to delete order");
    } finally {
      setDeleting(false);
    }
  };

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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      <DrawerMenu />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Header Command Bar */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
                Logistics & Sales
              </span>
              <span className="text-xs text-slate-400">
                Total Orders: <strong className="text-white">{orders.length}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
              Customer Orders
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage fulfillment pipelines, dispatch status, shipping labels, and customer transactions.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="self-start lg:self-auto flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-bold text-slate-300 hover:text-white transition active:scale-95 disabled:opacity-50"
          >
            <FaSyncAlt className={`text-xs ${loading ? "animate-spin text-amber-400" : ""}`} />
            <span>Refresh Orders</span>
          </button>
        </header>

        {/* Search & Status Filters */}
        <section className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((tab) => {
              const isActive = statusFilter.toLowerCase() === tab.toLowerCase();
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isActive
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
            <input
              type="text"
              placeholder="Search by ID, product, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-xs text-white placeholder-slate-500 focus:outline-hidden transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>
        </section>

        {/* Order Cards / Table View */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-3 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Loading order records...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="mt-8 p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
            <FaShoppingBag className="text-4xl text-slate-700 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No orders match your filter criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the search bar or status tabs.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition p-4 sm:p-5 shadow-lg flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
              >
                {/* Left Info: ID, Date, Customer & Shipping */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-black text-amber-400 text-sm">
                      #{order._id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Paid: {new Date(order.paidAt || order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                    <span className="flex items-center space-x-1.5">
                      <FaMapMarkerAlt className="text-amber-400 text-[11px]" />
                      <span>
                        {order.shippingInfo?.city}, {order.shippingInfo?.state} ({order.shippingInfo?.pinCode})
                      </span>
                    </span>
                    <span className="flex items-center space-x-1.5 text-slate-400">
                      <FaPhoneAlt className="text-slate-500 text-[10px]" />
                      <span>{order.shippingInfo?.phoneNo}</span>
                    </span>
                  </div>

                  {/* Items Preview Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {order.orderItems?.slice(0, 4).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-5 h-5 rounded object-cover"
                        />
                        <span className="truncate max-w-[120px] font-semibold">{item.name}</span>
                        <span className="text-amber-400 font-mono font-bold">x{item.quantity}</span>
                      </div>
                    ))}
                    {order.orderItems?.length > 4 && (
                      <span className="text-[10px] text-slate-500 font-bold">
                        +{order.orderItems.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Controls: Total Amount & Status Actions */}
                <div className="flex flex-wrap items-center lg:flex-col lg:items-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="lg:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount</span>
                    <span className="text-lg font-black text-white font-mono">
                      ₹{order.totalPrice?.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Status Dropdown & Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <select
                      value={order.orderStatus}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:border-amber-400 cursor-pointer transition"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
                      title="Inspect Order Details"
                    >
                      <FaEye className="text-xs text-sky-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderToDelete(order)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition border border-slate-700 hover:border-rose-800/50"
                      title="Delete Order"
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-white">Order Details</h3>
                  <p className="text-xs text-amber-400 font-mono">#{selectedOrder._id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Status and Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Status</span>
                  <span className="font-bold text-white">{selectedOrder.orderStatus}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Price</span>
                  <span className="font-bold text-amber-400 font-mono">₹{selectedOrder.totalPrice}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Payment</span>
                  <span className="font-bold text-emerald-400">{selectedOrder.paymentInfo?.status || "Paid"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Paid Date</span>
                  <span className="font-bold text-slate-300">
                    {new Date(selectedOrder.paidAt || selectedOrder.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Delivery Destination
                </span>
                <p className="text-slate-200">
                  {selectedOrder.shippingInfo?.address}, {selectedOrder.shippingInfo?.city},{" "}
                  {selectedOrder.shippingInfo?.state}, {selectedOrder.shippingInfo?.country} -{" "}
                  {selectedOrder.shippingInfo?.pinCode}
                </p>
                <p className="text-slate-400">Contact: {selectedOrder.shippingInfo?.phoneNo}</p>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  Order Items ({selectedOrder.orderItems?.length})
                </span>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                        />
                        <div>
                          <h4 className="font-bold text-white">{item.name}</h4>
                          <span className="text-[10px] text-slate-400">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-amber-400">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {orderToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-rose-800/40 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center space-x-3 text-rose-400">
                <FaExclamationTriangle className="text-2xl" />
                <h3 className="text-base font-bold text-white">Permanently Delete Order?</h3>
              </div>
              <p className="text-xs text-slate-300">
                Are you sure you want to delete order{" "}
                <span className="font-mono font-bold text-amber-400">#{orderToDelete._id}</span>?
                This action is irreversible.
              </p>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOrderToDelete(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteOrder}
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

export default AllOrders;