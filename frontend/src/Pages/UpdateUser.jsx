import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import DrawerMenu from "../Dashboard/Drawermenu";
import {
  FaUserEdit,
  FaArrowLeft,
  FaShieldAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaUser,
  FaCheck,
} from "react-icons/fa";

// ==========================================
// LUXURY USER PROFILE & ROLE MANAGEMENT
// Allows administrators to promote/demote user roles and edit account info
// ==========================================
const UpdateUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch the user's current details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/users/getsingleuserbyid/${userId}`);
        if (data?.user) {
          setUserData({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone ? String(data.user.phone) : "",
            role: data.user.role || "user",
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error(error.message || "Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserDetails();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      // Send all fields including role
      const { data } = await apiClient.put(`/users/userupdate/${userId}`, userData);
      toast.success(data?.message || "User role & details updated successfully!");
      navigate("/alluser");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user.");
    } finally {
      setUpdating(false);
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
                Access Control
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
              Edit Account & Assign Role
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Promote user to Administrator or update account credentials.
            </p>
          </div>

          <Link
            to="/alluser"
            className="self-start sm:self-auto flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to Users</span>
          </Link>
        </header>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-3 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Loading user record...</p>
          </div>
        ) : (
          <div className="mt-8 max-w-xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5"
            >
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-hidden focus:border-amber-400 transition"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-hidden focus:border-amber-400 transition"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhoneAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-hidden focus:border-amber-400 transition"
                    required
                  />
                </div>
              </div>

              {/* Role Selector (Promote to Admin / Demote to User) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Account Role & Permissions
                </label>
                <div className="relative">
                  <FaShieldAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 text-xs" />
                  <select
                    name="role"
                    value={userData.role}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-amber-400 focus:outline-hidden focus:border-amber-400 cursor-pointer transition"
                  >
                    <option value="user">Customer / Regular User</option>
                    <option value="admin">Administrator (Full Dashboard Access)</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Admins can manage products, fulfill orders, review analytics, and edit accounts.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/alluser")}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-400/20 transition active:scale-95 disabled:opacity-50"
                >
                  <FaCheck className="text-xs" />
                  <span>{updating ? "Saving Changes..." : "Save & Update Role"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default UpdateUser;