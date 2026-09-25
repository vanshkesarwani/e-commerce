import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import apiClient from "../api/apiClient";
import { useCartStore } from "../Store/useCartStore";
import toast from "react-hot-toast";
import {
  FaBox,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaArrowRight,
  FaShoppingBag,
  FaUndoAlt,
  FaExchangeAlt,
  FaCheckCircle,
  FaTimes,
  FaTruck,
  FaSearch,
  FaShieldAlt,
  FaFileInvoice,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

// ==========================================
// CLASSY LUXURY CUSTOMER ORDERS VIEW
// WITH INTERACTIVE RETURNS & REPLACEMENTS
// ==========================================
const MyOrders = () => {
  const { id } = useParams();
  const { profile } = useAuth();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  const targetId = id || profile?._id || profile?.id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Return / Replacement
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [requestType, setRequestType] = useState("Return"); // "Return" | "Replacement"
  const [returnReason, setReturnReason] = useState("");
  const [returnComments, setReturnComments] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    if (!targetId) return setLoading(false);

    try {
      setLoading(true);
      const { data } = await apiClient.get(`/order/me/${targetId}`);
      setOrders(data?.orders || []);
    } catch (error) {
      console.error("Orders fetch error:", error);
      toast.error("Failed to retrieve your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [targetId]);

  // Open modal for specific order
  const handleOpenReturnModal = (order, type = "Return") => {
    setSelectedOrder(order);
    setRequestType(type);
    setReturnReason("Size or fit issue");
    setReturnComments("");
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
    setReturnReason("");
    setReturnComments("");
  };

  // Submit Return or Replacement request
  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    if (!returnReason.trim()) {
      toast.error("Please select a reason");
      return;
    }

    try {
      setSubmittingReturn(true);
      const { data } = await apiClient.post(`/order/return/${selectedOrder._id}`, {
        requestType,
        reason: returnReason,
        comments: returnComments,
      });

      if (data.success) {
        toast.success(
          `${requestType} request submitted! Courier pickup will be scheduled within 24-48 hours.`
        );
        handleCloseModal();
        await fetchOrders();
      }
    } catch (err) {
      console.error("Return error:", err);
      toast.error(
        err.response?.data?.message || `Failed to submit ${requestType.toLowerCase()} request`
      );
    } finally {
      setSubmittingReturn(false);
    }
  };

  // Cancel an existing Return/Replacement request
  const handleCancelReturn = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this return/replacement request?")) {
      return;
    }

    try {
      const { data } = await apiClient.post(`/order/return/cancel/${orderId}`);
      if (data.success) {
        toast.success("Request cancelled successfully");
        await fetchOrders();
      }
    } catch (err) {
      console.error("Cancel return error:", err);
      toast.error("Failed to cancel request");
    }
  };

  // Buy Again handler
  const handleBuyAgain = (item) => {
    addToCart({
      _id: item.product,
      title: item.name,
      price: item.price,
      productImage: { url: item.image },
    });
    toast.success(`Added "${item.name}" to your bag!`);
    navigate("/cart");
  };

  // Filter orders based on active tab & search query
  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (activeTab === "delivered" && order.orderStatus !== "Delivered") return false;
    if (activeTab === "in_transit" && (order.orderStatus === "Delivered" || order.orderStatus === "Cancelled" || order.orderStatus?.includes("Return") || order.orderStatus?.includes("Replacement"))) return false;
    if (activeTab === "returns" && !order.orderStatus?.includes("Return") && !order.orderStatus?.includes("Replacement")) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesId = order._id.toLowerCase().includes(query);
      const matchesItem = order.orderItems?.some((item) =>
        item.name.toLowerCase().includes(query)
      );
      return matchesId || matchesItem;
    }

    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "Shipped":
        return "bg-sky-50 text-sky-700 border-sky-200/80";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      case "Return Requested":
      case "Returned":
        return "bg-amber-50 text-amber-800 border-amber-200/80";
      case "Replacement Requested":
      case "Replaced":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/80";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-900 border-t-amber-400" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                Purchase History
              </span>
              <span className="text-xs font-semibold text-slate-400">
                • {orders.length} {orders.length === 1 ? "order" : "orders"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              My Orders
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track live shipments, download invoices, or initiate returns & replacements
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-900 hover:text-indigo-600 transition"
          >
            <span>Browse Catalog</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Tabs */}
          <div className="flex items-center space-x-1 p-1 bg-slate-200/60 rounded-2xl overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "All Orders" },
              { id: "delivered", label: "Delivered" },
              { id: "in_transit", label: "In Transit" },
              { id: "returns", label: "Returns & Exchanges" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by item or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 shadow-2xs transition"
            />
            <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Orders Listing */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-slate-200/90 shadow-sm space-y-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <FaShoppingBag className="text-xl text-slate-500" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              No matching orders found
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? `No orders match your search "${searchQuery}". Try a different keyword.`
                : "You don't have any orders under this category."}
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition"
            >
              <span>Explore Products</span>
              <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const isDelivered = order.orderStatus === "Delivered";
              const isReturnActive =
                order.orderStatus?.includes("Return") ||
                order.orderStatus?.includes("Replacement");
              const isExpanded = expandedOrderId === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  {/* Order Meta Header */}
                  <div className="bg-slate-50/70 px-5 sm:px-7 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-5 sm:gap-8">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Order Placed
                        </span>
                        <p className="font-semibold text-slate-800 mt-0.5">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Recent"}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Total Amount
                        </span>
                        <p className="font-bold text-slate-900 mt-0.5">
                          ₹{order.totalPrice?.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="hidden sm:block">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Ship To
                        </span>
                        <p className="font-medium text-slate-700 mt-0.5 truncate max-w-[180px] flex items-center space-x-1">
                          <FaMapMarkerAlt className="text-slate-400 text-[10px] shrink-0" />
                          <span>
                            {order.shippingInfo?.city}, {order.shippingInfo?.state}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border flex items-center space-x-1.5 ${getStatusBadge(
                          order.orderStatus
                        )}`}
                      >
                        {isDelivered && <FaCheckCircle className="text-[10px]" />}
                        {isReturnActive && <FaUndoAlt className="text-[10px]" />}
                        <span>{order.orderStatus || "Processing"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Return / Replacement Status Alert Banner */}
                  {isReturnActive && order.returnRequest && (
                    <div className="bg-amber-50/90 border-b border-amber-200/80 px-5 sm:px-7 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start space-x-2.5">
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          {order.returnRequest.requestType === "Replacement" ? (
                            <FaExchangeAlt className="text-[10px]" />
                          ) : (
                            <FaUndoAlt className="text-[10px]" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-amber-950">
                            {order.returnRequest.requestType || "Return"} In Progress
                          </p>
                          <p className="text-amber-800 text-[11px]">
                            Reason: <span className="font-semibold">{order.returnRequest.reason}</span>
                            {order.returnRequest.comments && ` • "${order.returnRequest.comments}"`}
                          </p>
                          <p className="text-[10px] text-amber-700 mt-0.5">
                            Our pickup agent will collect the item from your registered address within 24-48 hours.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCancelReturn(order._id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline transition whitespace-nowrap self-end sm:self-center"
                      >
                        Cancel Request
                      </button>
                    </div>
                  )}

                  {/* Products in this Order */}
                  <div className="p-5 sm:p-7 divide-y divide-slate-100">
                    {order.orderItems?.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image || "https://via.placeholder.com/80"}
                            alt={item.name}
                            className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover bg-slate-50 border border-slate-200/80 shrink-0"
                          />
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition">
                              {item.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              Quantity: <span className="font-semibold text-slate-800">{item.quantity}</span>
                              <span className="text-slate-300 mx-1.5">|</span>
                              ₹{item.price?.toLocaleString("en-IN")} each
                            </p>
                          </div>
                        </div>

                        {/* Item Total & Quick Actions */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                          <span className="font-bold text-slate-900 text-sm sm:text-base">
                            ₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString("en-IN")}
                          </span>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleBuyAgain(item)}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold rounded-lg transition"
                            >
                              Buy Again
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Action Bar (Return / Replacement / Invoice) */}
                  <div className="bg-slate-50/50 px-5 sm:px-7 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    
                    <div className="flex items-center space-x-2 text-slate-400 font-mono text-[11px]">
                      <span>Order #{order._id.slice(-8).toUpperCase()}</span>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      
                      {/* Return & Replacement Buttons (Delivered Orders Only) */}
                      {isDelivered && !isReturnActive && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenReturnModal(order, "Return")}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 hover:text-slate-900 font-semibold text-xs transition shadow-2xs"
                          >
                            <FaUndoAlt className="text-[10px] text-amber-600" />
                            <span>Return Item</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenReturnModal(order, "Replacement")}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 hover:text-slate-900 font-semibold text-xs transition shadow-2xs"
                          >
                            <FaExchangeAlt className="text-[10px] text-indigo-600" />
                            <span>Replace / Exchange</span>
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrderId((prev) => (prev === order._id ? null : order._id))
                        }
                        className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-800 font-semibold text-xs px-2 py-1 transition"
                      >
                        <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                        {isExpanded ? <FaChevronUp className="text-[9px]" /> : <FaChevronDown className="text-[9px]" />}
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Order Deep Details */}
                  {isExpanded && (
                    <div className="p-5 sm:p-7 bg-slate-50 border-t border-slate-200/60 text-xs space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        <div>
                          <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                            Shipping Destination
                          </p>
                          <p className="text-slate-600 leading-relaxed">
                            {order.shippingInfo?.address}<br />
                            {order.shippingInfo?.city}, {order.shippingInfo?.state} - {order.shippingInfo?.pinCode}<br />
                            Phone: +91 {order.shippingInfo?.phoneNo}
                          </p>
                        </div>

                        <div>
                          <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                            Payment Details
                          </p>
                          <p className="text-slate-600 leading-relaxed">
                            Status: <span className="font-semibold text-emerald-600 uppercase">{order.paymentInfo?.status || "Paid"}</span><br />
                            Payment ID: <span className="font-mono text-[11px]">{order.paymentInfo?.id}</span><br />
                            Tax & Shipping Included
                          </p>
                        </div>

                        <div>
                          <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                            Buyer Assurance
                          </p>
                          <p className="text-slate-500 leading-relaxed flex items-center space-x-1.5">
                            <FaShieldAlt className="text-amber-500 text-xs shrink-0" />
                            <span>Eligible for 30-day hassle-free return or size replacement.</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ==================================================== */}
      {/* INTERACTIVE RETURN & REPLACEMENT POPUP MODAL        */}
      {/* ==================================================== */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl p-5 sm:p-8 space-y-4 sm:space-y-5 animate-scaleUp relative max-h-[92vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full transition"
            >
              <FaTimes className="text-sm" />
            </button>

            {/* Modal Title */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                {requestType === "Replacement" ? (
                  <>
                    <FaExchangeAlt />
                    <span>Free Size & Color Exchange</span>
                  </>
                ) : (
                  <>
                    <FaUndoAlt />
                    <span>Hassle-Free Return & Refund</span>
                  </>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Request {requestType}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Order #{selectedOrder._id.slice(-8).toUpperCase()} • Delivered items eligible for 30-day window
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setRequestType("Return")}
                className={`py-2 rounded-xl transition ${
                  requestType === "Return"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Return & Refund
              </button>

              <button
                type="button"
                onClick={() => setRequestType("Replacement")}
                className={`py-2 rounded-xl transition ${
                  requestType === "Replacement"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Replace / Exchange
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReturn} className="space-y-4 text-xs">
              
              {/* Reason Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Select Reason for {requestType}
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 transition"
                  required
                >
                  <option value="Size or fit issue">Size or fit issue (too small / too large)</option>
                  <option value="Damaged or defective piece">Item arrived damaged or defective</option>
                  <option value="Received incorrect item or color">Received incorrect item or color</option>
                  <option value="Product quality didn't meet expectation">Quality didn't meet expectation</option>
                  <option value="Package missing accessories">Missing parts or accessories</option>
                  <option value="Ordered by mistake / No longer needed">Ordered by mistake / No longer needed</option>
                </select>
              </div>

              {/* Additional Comments */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Additional Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={returnComments}
                  onChange={(e) => setReturnComments(e.target.value)}
                  placeholder="Share any specific notes for our courier agent or customer care..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 transition resize-none"
                />
              </div>

              {/* Pickup Address Verification */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="font-semibold text-slate-700 block">
                  Pickup Location:
                </span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {selectedOrder.shippingInfo?.address}, {selectedOrder.shippingInfo?.city},{" "}
                  {selectedOrder.shippingInfo?.state} - {selectedOrder.shippingInfo?.pinCode}
                </p>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingReturn}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition shadow-sm disabled:opacity-50"
                >
                  {submittingReturn
                    ? "Submitting..."
                    : `Confirm ${requestType}`}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default MyOrders;