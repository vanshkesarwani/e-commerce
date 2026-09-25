import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import DrawerMenu from "./Drawermenu";
import {
  FaArrowLeft,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaSyncAlt,
  FaClock,
} from "react-icons/fa";

// ==========================================
// LUXURY ORDER STATUS DISPATCH & UPDATE
// ==========================================
const UpdateOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get(`/order/${orderId}`);
      if (data?.success && data.order) {
        setOrder(data.order);
        setNewStatus(data.order.orderStatus || "Processing");
      } else {
        toast.error("Order not found");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error(error.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      setUpdating(true);
      const { data } = await apiClient.put(`/order/update/${orderId}`, {
        status: newStatus,
      });

      toast.success(data?.message || "Order status updated successfully");
      setOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : prev));
      navigate("/allorders");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.message || "Error updating order status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      <DrawerMenu />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
                Logistics Dispatch
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
              Update Order Status
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Update progression and fulfillment state for transaction{" "}
              <span className="text-amber-400 font-mono">#{orderId}</span>
            </p>
          </div>

          <Link
            to="/allorders"
            className="self-start sm:self-auto flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to Orders</span>
          </Link>
        </header>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-3 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Loading order info...</p>
          </div>
        ) : !order ? (
          <div className="mt-8 p-12 text-center text-slate-400 text-xs">
            Order not found or was removed.
          </div>
        ) : (
          <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Update Form (1 Col) */}
            <div className="lg:col-span-1 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl h-fit">
              <h3 className="text-sm font-extrabold text-white mb-4 flex items-center space-x-2">
                <FaClock className="text-amber-400" />
                <span>Change Status</span>
              </h3>

              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Current Stage: <span className="text-amber-400">{order.orderStatus}</span>
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-hidden focus:border-amber-400 cursor-pointer"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={updating || newStatus === order.orderStatus}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-400/20 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Updating..." : "Confirm Status Change"}
                </button>
              </form>
            </div>

            {/* Order Overview (2 Cols) */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
                  <FaShoppingBag className="text-amber-400" />
                  <span>Order Items & Shipping Details</span>
                </h3>
                <span className="font-mono font-bold text-amber-400 text-base">
                  ₹{order.totalPrice?.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Shipping info */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <FaMapMarkerAlt className="text-amber-400" />
                  <span>Delivery Address</span>
                </span>
                <p className="text-slate-200">
                  {order.shippingInfo?.address}, {order.shippingInfo?.city},{" "}
                  {order.shippingInfo?.state}, {order.shippingInfo?.country} -{" "}
                  {order.shippingInfo?.pinCode}
                </p>
                <p className="text-slate-400">Recipient Phone: {order.shippingInfo?.phoneNo}</p>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  Items Purchased ({order.orderItems?.length})
                </span>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {order.orderItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-11 h-11 rounded-lg object-cover border border-slate-800"
                        />
                        <div>
                          <h4 className="font-bold text-white">{item.name}</h4>
                          <span className="text-[10px] text-slate-400">
                            Unit Price: ₹{item.price?.toLocaleString("en-IN")} • Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-white">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UpdateOrder;
