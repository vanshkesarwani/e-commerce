import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";
import DrawerMenu from "../Dashboard/Drawermenu";
import { useAuth } from "../context/AuthProvider";
import {
  FaUsers,
  FaShieldAlt,
  FaUserCheck,
  FaSearch,
  FaTrashAlt,
  FaEdit,
  FaSyncAlt,
  FaExclamationTriangle,
  FaEnvelope,
  FaPhoneAlt,
  FaTimes,
} from "react-icons/fa";

// ==========================================
// LUXURY CUSTOMER & USER ACCOUNTS DIRECTORY
// Role management, identity inspection, and account moderation
// ==========================================
const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Delete modal state
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { profile } = useAuth();
  const navigate = useNavigate();

  // Fetch users
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/users/allusers");
      const list = Array.isArray(data?.users) ? data.users : [];

      // Sort users by role: admin first, then customer
      const sorted = list.sort((a, b) => {
        if (a.role === "admin" && b.role !== "admin") return -1;
        if (a.role !== "admin" && b.role === "admin") return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setUsers(sorted);
      setFilteredUsers(sorted);
    } catch (error) {
      console.error("Error fetching all users:", error);
      toast.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Filter & Search
  useEffect(() => {
    let result = [...users];

    if (roleFilter !== "All") {
      result = result.filter(
        (u) => (u.role || "").toLowerCase() === roleFilter.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          (u.name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q) ||
          (u.phone ? String(u.phone) : "").includes(q)
      );
    }

    setFilteredUsers(result);
  }, [searchQuery, roleFilter, users]);

  // Safe delete
  const confirmDelete = async () => {
    if (!userToDelete) return;

    if (profile && profile._id === userToDelete._id) {
      toast.error("Security restriction: You cannot delete your own active administrator account!");
      setUserToDelete(null);
      return;
    }

    try {
      setDeleting(true);
      const { data } = await apiClient.delete(`/users/userdelete/${userToDelete._id}`);
      toast.success(data.message || "User account deleted successfully");
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Error deleting user");
    } finally {
      setDeleting(false);
    }
  };

  const adminCount = users.filter((u) => u.role === "admin").length;
  const customerCount = users.length - adminCount;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      <DrawerMenu />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Header Command Bar */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
                User Management
              </span>
              <span className="text-xs text-slate-400">
                Total Users: <strong className="text-white">{users.length}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
              Customer Accounts & Roles
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Audit registered customers, staff permissions, and account contact details.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAllUsers}
            disabled={loading}
            className="self-start lg:self-auto flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-bold text-slate-300 hover:text-white transition active:scale-95 disabled:opacity-50"
          >
            <FaSyncAlt className={`text-xs ${loading ? "animate-spin text-amber-400" : ""}`} />
            <span>Refresh Users</span>
          </button>
        </header>

        {/* User Stats Overview (3 Mini Badges) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Total Accounts</span>
              <p className="text-xl font-black text-white font-mono">{users.length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
              <FaUsers />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Staff / Admins</span>
              <p className="text-xl font-black text-amber-400 font-mono">{adminCount}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <FaShieldAlt />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Shoppers / Customers</span>
              <p className="text-xl font-black text-emerald-400 font-mono">{customerCount}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FaUserCheck />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <section className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          {/* Role Filters */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            {["All", "Admin", "User"].map((tab) => {
              const isActive = roleFilter.toLowerCase() === tab.toLowerCase();
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setRoleFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    isActive
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {tab === "User" ? "Customers" : tab === "Admin" ? "Administrators" : "All Roles"}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
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

        {/* Users Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-3 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Loading directory...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="mt-8 p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
            <FaUsers className="text-4xl text-slate-700 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No users match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the search bar or role filter.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => {
              const isCurrentAdmin = profile && profile._id === user._id;

              return (
                <div
                  key={user._id}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition p-5 shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    {/* User Header with Avatar & Role */}
                    <div className="flex items-center space-x-3.5 mb-4">
                      <img
                        src={
                          user.photo?.url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=1e293b&color=f8fafc`
                        }
                        alt={user.name}
                        className="w-13 h-13 rounded-full object-cover border-2 border-slate-700 group-hover:border-amber-400/60 transition"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-black text-white truncate">{user.name}</h3>
                          {isCurrentAdmin && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400 text-slate-950">
                              YOU
                            </span>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold mt-1 border ${
                            user.role === "admin"
                              ? "bg-amber-400/10 text-amber-400 border-amber-400/30"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {user.role === "admin" ? <FaShieldAlt className="text-[9px]" /> : null}
                          <span className="capitalize">{user.role}</span>
                        </span>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-1.5 text-xs text-slate-300 py-3 border-t border-slate-800/80">
                      <p className="flex items-center space-x-2 truncate">
                        <FaEnvelope className="text-slate-500 text-[11px] shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </p>
                      {user.phone && (
                        <p className="flex items-center space-x-2">
                          <FaPhoneAlt className="text-slate-500 text-[10px] shrink-0" />
                          <span>{user.phone}</span>
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 pt-1">
                        Joined: {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/update/${user._id}`)}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition border border-slate-700"
                    >
                      <FaEdit className="text-xs text-amber-400" />
                      <span>Edit Account</span>
                    </button>

                    <button
                      type="button"
                      disabled={isCurrentAdmin}
                      onClick={() => setUserToDelete(user)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition border border-slate-700 hover:border-rose-800/50 disabled:opacity-30 disabled:cursor-not-allowed"
                      title={isCurrentAdmin ? "Cannot delete own active session" : "Delete Account"}
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-rose-800/40 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center space-x-3 text-rose-400">
                <FaExclamationTriangle className="text-2xl" />
                <h3 className="text-base font-bold text-white">Delete User Account?</h3>
              </div>
              <p className="text-xs text-slate-300">
                Are you sure you want to permanently delete{" "}
                <strong className="text-white">{userToDelete.name}</strong> ({userToDelete.email})?
                All associated session credentials will be revoked.
              </p>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
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

export default AllUsers;