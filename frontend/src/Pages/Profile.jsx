import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import apiClient, { API_BASE_URL } from "../api/apiClient";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCrown,
  FaShoppingBag,
  FaBoxOpen,
  FaShieldAlt,
  FaCamera,
  FaEdit,
  FaSignOutAlt,
  FaTrashAlt,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaMapMarkerAlt,
  FaArrowRight,
  FaLock,
  FaBell,
  FaRegCopy,
  FaCreditCard,
} from "react-icons/fa";

// ==========================================
// LUXURY VELURA PROFILE & ACCOUNT DASHBOARD
// ==========================================
const Profile = () => {
  const { profile, setProfile, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Active Tab State: 'overview' | 'edit' | 'orders' | 'settings'
  const [activeTab, setActiveTab] = useState("overview");

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    photoUrl: "",
    file: null,
  });
  const [updating, setUpdating] = useState(false);

  // Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Notification Preferences state (interactive toggle)
  const [notifications, setNotifications] = useState({
    orders: true,
    promotions: true,
    security: true,
  });

  // Populate form with current profile
  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        photoUrl: profile.photo?.url || profile.photo || "",
        file: null,
      });

      // Fetch user's orders
      const fetchUserOrders = async () => {
        try {
          setOrdersLoading(true);
          const userId = profile._id || profile.id;
          if (userId) {
            const { data } = await apiClient.get(`/order/me/${userId}`);
            setOrders(Array.isArray(data?.orders) ? data.orders : []);
          }
        } catch (err) {
          console.log("Could not load user orders:", err.message);
        } finally {
          setOrdersLoading(false);
        }
      };

      fetchUserOrders();
    }
  }, [profile]);

  // Handle Photo selection
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm((prev) => ({
        ...prev,
        file,
        photoUrl: URL.createObjectURL(file),
      }));
    }
  };

  // Handle Profile Update Submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profile?._id) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("email", editForm.email);
      formData.append("phone", editForm.phone);
      if (editForm.file) {
        formData.append("photo", editForm.file);
      }

      const res = await axios.put(
        `${API_BASE_URL}/users/user/${profile._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.user) {
        setProfile(res.data.user);
      } else {
        // Fallback update in state
        setProfile((prev) => ({
          ...prev,
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          ...(editForm.file && { photo: { url: editForm.photoUrl } }),
        }));
      }

      toast.success("Profile details updated successfully!");
      setActiveTab("overview");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await apiClient.get("/users/logout");
    } catch (e) {
      // Continue anyway
    }
    localStorage.removeItem("jwt");
    setProfile(null);
    setIsAuthenticated(false);
    toast.success("You have been securely signed out.");
    navigate("/login");
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await apiClient.delete(`/users/userdelete/${profile._id}`);
      localStorage.removeItem("jwt");
      setProfile(null);
      setIsAuthenticated(false);
      toast.success("Your account has been deleted.");
      navigate("/login");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.message || "Failed to delete account. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Helper for Initials Monogram
  const getInitials = (name) => {
    if (!name) return "VIP";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Helper for Status Badges
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
      case "shipped":
        return "bg-sky-500/10 text-sky-600 border border-sky-500/20";
      case "cancelled":
        return "bg-rose-500/10 text-rose-600 border border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 border border-amber-500/20";
    }
  };

  // If not logged in
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-slate-200/80 shadow-xl max-w-lg mx-auto">
          <div className="w-20 h-20 mx-auto rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-3xl mb-6 shadow-md shadow-slate-900/10">
            <FaCrown />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Velura Client Portal
          </h2>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            Sign in to your Velura account to manage your bespoke orders, curated wishlist, and VIP member benefits.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="px-8 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition shadow-md"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const clientId = profile?._id ? `VEL-${profile._id.slice(-6).toUpperCase()}` : "VEL-CLIENT";

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================
            LUXURY HERO PROFILE HEADER
        ========================================== */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl mb-8">
          {/* Subtle Ambient Light Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 sm:gap-8">
            {/* Avatar & User Details */}
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-5 sm:gap-6">
              {/* Avatar Frame with Quick Upload Trigger */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-xl shadow-amber-500/20">
                  {editForm.photoUrl ? (
                    <img
                      src={editForm.photoUrl}
                      alt={profile?.name || "Client Avatar"}
                      className="w-full h-full object-cover rounded-full bg-slate-800"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-extrabold text-2xl text-amber-400">
                      {getInitials(profile?.name)}
                    </div>
                  )}
                </div>

                {/* Quick Camera Upload Overlay */}
                <label
                  htmlFor="hero-avatar-input"
                  className="absolute bottom-0 right-0 p-2.5 rounded-full bg-slate-900 text-amber-400 border border-slate-700 shadow-lg cursor-pointer hover:bg-slate-800 hover:scale-105 transition"
                  title="Update Profile Photo"
                >
                  <FaCamera className="text-xs" />
                  <input
                    id="hero-avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handlePhotoSelect(e);
                      setActiveTab("edit");
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Title, Badges & Identification */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                    <FaCrown className="text-[10px]" />
                    {profile.role === "admin" ? "VIP Administrator" : "Velura Privilege Elite"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                    <FaCheckCircle className="text-[9px]" /> Verified Client
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {profile.name || "Distinguished Guest"}
                </h1>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs text-slate-300 font-medium pt-1">
                  <span className="flex items-center gap-1.5">
                    <FaEnvelope className="text-amber-400/80 text-[11px]" />
                    {profile.email}
                  </span>
                  {profile.phone && (
                    <span className="flex items-center gap-1.5">
                      <FaPhone className="text-amber-400/80 text-[11px]" />
                      {profile.phone}
                    </span>
                  )}
                  <span
                    onClick={() => {
                      navigator.clipboard.writeText(clientId);
                      toast.success("Client ID copied!");
                    }}
                    className="flex items-center gap-1 text-slate-400 hover:text-amber-300 cursor-pointer transition"
                    title="Click to copy Client ID"
                  >
                    <span className="font-mono text-[11px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                      {clientId}
                    </span>
                    <FaRegCopy className="text-[10px]" />
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Header Actions */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                  activeTab === "edit"
                    ? "bg-amber-400 text-slate-950 shadow-amber-400/20"
                    : "bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700"
                }`}
              >
                <FaEdit className="text-xs" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                  activeTab === "orders"
                    ? "bg-amber-400 text-slate-950 shadow-amber-400/20"
                    : "bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700"
                }`}
              >
                <FaShoppingBag className="text-xs" />
                <span>Orders ({orders.length})</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900/80 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-slate-800 transition"
                title="Sign Out"
              >
                <FaSignOutAlt className="text-xs" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================
            KEY STATS ROW (INTERACTIVE TILES)
        ========================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Total Orders */}
          <div
            onClick={() => setActiveTab("orders")}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-400/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-amber-600 transition">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Orders
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
                <FaShoppingBag />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {ordersLoading ? "..." : orders.length}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Bespoke purchases</p>
            </div>
          </div>

          {/* Membership Tier */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Club Status
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
                <FaCrown />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Privilege
              </span>
              <p className="text-[11px] text-amber-600 font-bold mt-0.5">✦ 5% Velvet Rewards</p>
            </div>
          </div>

          {/* In Transit */}
          <div
            onClick={() => setActiveTab("orders")}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-sky-400/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-sky-600 transition">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Shipments
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-sm">
                <FaTruck />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {orders.filter((o) => o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled").length}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">En route to your door</p>
            </div>
          </div>

          {/* Account Security */}
          <div
            onClick={() => setActiveTab("settings")}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-400/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-600 transition">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Account Status
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                <FaShieldAlt />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Protected
              </span>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5">SSL Encrypted Session</p>
            </div>
          </div>
        </div>

        {/* =========================================
            INTERACTIVE NAVIGATION TABS STRIP
        ========================================== */}
        <div className="flex items-center overflow-x-auto no-scrollbar gap-2 p-1.5 bg-slate-200/70 rounded-2xl mb-8">
          {[
            { id: "overview", label: "Overview", icon: FaUser },
            { id: "edit", label: "Edit Profile", icon: FaEdit },
            { id: "orders", label: `Order History (${orders.length})`, icon: FaShoppingBag },
            { id: "settings", label: "Settings & Security", icon: FaLock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm shadow-slate-300"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Icon className={`text-xs ${isActive ? "text-amber-500" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================
            TAB CONTENT PANELS
        ========================================== */}

        {/* --- TAB 1: OVERVIEW --- */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Account Details & Recent Order */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Your official account credentials & contact data</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("edit")}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
                  >
                    <FaEdit className="text-[11px]" />
                    <span>Update</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Full Legal Name</span>
                    <span className="text-sm font-bold text-slate-900">{profile.name || "N/A"}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Primary Email</span>
                    <span className="text-sm font-bold text-slate-900">{profile.email || "N/A"}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Telephone Contact</span>
                    <span className="text-sm font-bold text-slate-900">{profile.phone || "Not configured"}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Client Tier</span>
                    <span className="text-sm font-bold text-amber-600 flex items-center gap-1.5">
                      <FaCrown className="text-xs" />
                      Velura Elite Member
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Order Preview */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Latest Purchase</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Most recent order placed on your Velura account</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
                  >
                    <span>View All</span>
                    <FaArrowRight className="text-[10px]" />
                  </button>
                </div>

                {ordersLoading ? (
                  <div className="py-8 text-center text-xs text-slate-400 font-medium">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="py-10 text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xl mb-3">
                      <FaShoppingBag />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">No orders placed yet</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Explore our handcrafted luxury pieces and start your collection today.
                    </p>
                    <Link
                      to="/allproducts"
                      className="mt-4 inline-block px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition"
                    >
                      Explore Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="pt-5 space-y-4">
                    {(() => {
                      const latest = orders[0];
                      return (
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-900">
                                #{latest._id?.slice(-8).toUpperCase()}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(latest.orderStatus)}`}>
                                {latest.orderStatus || "Processing"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              Placed on {latest.createdAt ? new Date(latest.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Recently"}
                            </p>
                            <p className="text-xs text-slate-700 font-medium">
                              {latest.orderItems?.length || 1} exclusive item(s) • Total: ₹{latest.totalPrice}
                            </p>
                          </div>

                          <button
                            onClick={() => setActiveTab("orders")}
                            className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-900 hover:text-white transition shadow-2xs"
                          >
                            Track Package
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: VIP Perks & Quick Shortcuts */}
            <div className="space-y-6">
              {/* Velura VIP Privilege Card */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2.5 text-amber-200 text-xs font-bold tracking-widest uppercase mb-3">
                  <FaCrown />
                  <span>Velura Privilege</span>
                </div>
                <h4 className="text-xl font-extrabold tracking-tight">Complimentary Perks</h4>
                <p className="text-xs text-amber-100 mt-1 leading-relaxed">
                  As an elite client, enjoy guaranteed insured door delivery, priority dispatch, and concierge support on every order.
                </p>

                <ul className="mt-4 space-y-2.5 text-xs text-amber-50 font-medium">
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-amber-200" /> Free White-Glove Shipping &gt; ₹999
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-amber-200" /> Dedicated 24/7 Concierge Service
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-amber-200" /> 30-Day Effortless Return Window
                  </li>
                </ul>

                <div className="mt-6 pt-5 border-t border-white/20 flex items-center justify-between text-xs">
                  <span>Rewards Balance</span>
                  <span className="font-extrabold text-sm">450 Points</span>
                </div>
              </div>

              {/* Quick Navigation Shortcuts */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Quick Shortcuts
                </h4>

                <Link
                  to="/allproducts"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <FaShoppingBag className="text-indigo-600" /> Explore Catalog
                  </span>
                  <FaArrowRight className="text-slate-400" />
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <FaBoxOpen className="text-amber-600" /> Review Bag & Cart
                  </span>
                  <FaArrowRight className="text-slate-400" />
                </Link>

                <Link
                  to="/address"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <FaMapMarkerAlt className="text-emerald-600" /> Delivery Addresses
                  </span>
                  <FaArrowRight className="text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: EDIT PROFILE --- */}
        {activeTab === "edit" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm max-w-3xl mx-auto">
            <div className="pb-6 border-b border-slate-100">
              <h3 className="text-xl font-extrabold text-slate-900">Edit Profile Credentials</h3>
              <p className="text-xs text-slate-500 mt-1">
                Keep your personal contact details and avatar current for seamless communication and order deliveries.
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="pt-8 space-y-6">
              {/* Avatar Upload Banner */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-20 h-20 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-md">
                  {editForm.photoUrl ? (
                    <img
                      src={editForm.photoUrl}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover rounded-full bg-slate-800"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xl">
                      {getInitials(editForm.name)}
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-xs font-bold text-slate-800 block">Profile Portrait</span>
                  <p className="text-[11px] text-slate-500">
                    PNG, JPG or WEBP up to 5MB. High resolution recommended.
                  </p>
                  <label
                    htmlFor="edit-avatar-upload"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-100 cursor-pointer shadow-2xs transition"
                  >
                    <FaCamera className="text-[10px]" />
                    <span>Choose New Image</span>
                    <input
                      id="edit-avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                      placeholder="e.g. Eleanor Vance"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      required
                      placeholder="e.g. eleanor@velurastudio.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Phone Contact
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-7 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50 transition shadow-md"
                >
                  {updating ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- TAB 3: ORDER HISTORY --- */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Your Order Archive</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete history of orders, dispatch progress, and purchase invoices.
                </p>
              </div>
              <Link
                to="/allproducts"
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition shadow-xs"
              >
                + New Order
              </Link>
            </div>

            {ordersLoading ? (
              <div className="bg-white rounded-3xl p-16 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900 mx-auto" />
                <p className="text-xs text-slate-500 font-semibold mt-4">Retrieving your order records...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mb-4">
                  <FaShoppingBag />
                </div>
                <h4 className="text-lg font-extrabold text-slate-900">No Orders in Your Archive</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5">
                  You haven't placed any orders yet. Discover timeless pieces tailored for you.
                </p>
                <Link
                  to="/allproducts"
                  className="mt-6 inline-block px-7 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition shadow-md"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    {/* Header: ID, Date, Status */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            #{order._id?.slice(-8).toUpperCase()}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(order.orderStatus)}`}>
                            {order.orderStatus || "Processing"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <FaClock className="text-[10px]" />
                          Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400 font-medium block">Total Amount</span>
                        <span className="text-base font-extrabold text-slate-900">
                          ₹{order.totalPrice?.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="space-y-3">
                      {order.orderItems?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
                              alt={item.title || item.name}
                              className="w-12 h-12 object-cover rounded-xl bg-slate-200 border border-slate-200"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-900 line-clamp-1">
                                {item.title || item.name}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">
                                Qty: {item.quantity || 1} • ₹{item.price} each
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-900">
                            ₹{(item.price || 0) * (item.quantity || 1)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer / Delivery Destination */}
                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-amber-500 text-[11px]" />
                        <span>
                          Shipping to:{" "}
                          <strong>
                            {order.shippingInfo?.city || "Destination on file"}, {order.shippingInfo?.state || "India"}
                          </strong>
                        </span>
                      </div>

                      <Link
                        to={`/myorders/${profile._id}`}
                        className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <span>Full Details & Review</span>
                        <FaArrowRight className="text-[9px]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB 4: SETTINGS & SECURITY --- */}
        {activeTab === "settings" && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Notification Preferences */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-base">
                  <FaBell />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Notification Preferences</h3>
                  <p className="text-xs text-slate-500">Control how you receive order dispatches and private alerts</p>
                </div>
              </div>

              <div className="pt-6 space-y-5">
                {[
                  {
                    key: "orders",
                    title: "Live Order Tracking & Dispatch Alerts",
                    desc: "Real-time updates regarding courier shipment, transit milestones, and delivery arrival.",
                  },
                  {
                    key: "promotions",
                    title: "VIP Private Salon & Seasonal Previews",
                    desc: "Early access invitations to limited edition collections and private seasonal sales.",
                  },
                  {
                    key: "security",
                    title: "Account Security & Login Notifications",
                    desc: "Instant notifications whenever a login occurs from an unverified device or IP.",
                  },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{item.title}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key],
                        }));
                        toast.success("Preferences saved!");
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        notifications[item.key] ? "bg-slate-900" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          notifications[item.key] ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Snapshot */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base">
                  <FaShieldAlt />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Security & Authentication</h3>
                  <p className="text-xs text-slate-500">Protect your personal credentials and stored information</p>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <FaLock className="text-slate-400 text-xs" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Account Password</span>
                      <span className="text-[11px] text-slate-500">Protected with high-entropy salt encryption</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      toast("To update your password, sign out and use Reset Password on the sign-in screen.", {
                        icon: "🔒",
                      });
                    }}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-200 transition"
                  >
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-emerald-500 text-xs" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Authenticated Session</span>
                      <span className="text-[11px] text-slate-500">JWT Token active on this browser</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Danger Zone: Delete Account */}
            <div className="bg-rose-50/50 rounded-3xl p-6 sm:p-8 border border-rose-200/70 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-base font-extrabold text-rose-900">Danger Zone</h4>
                  <p className="text-xs text-rose-700/80 mt-1 max-w-md leading-relaxed">
                    Permanently delete your Velura account, associated order history, and saved addresses. This action cannot be undone.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm whitespace-nowrap"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================
          DELETE CONFIRMATION MODAL
      ========================================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-pop-in">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-500/30 shadow-2xl space-y-5 animate-pop-in">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-2xl mx-auto shadow-inner">
              <FaTrashAlt />
            </div>

            <div className="text-center space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Security & Account
              </span>
              <h3 className="text-xl font-black text-white">Delete Velura Account?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you certain you wish to delete your account? All past purchase histories, saved delivery addresses, and member privileges will be permanently erased.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
              >
                Keep Account
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-extrabold transition shadow-lg hover:shadow-rose-600/30 transform hover:scale-[1.02] disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;