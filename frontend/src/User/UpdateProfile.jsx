import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import { API_BASE_URL } from "../api/apiClient";

// ==========================================
// USER PROFILE UPDATE COMPONENT
// ==========================================
const UpdateProfile = () => {
  const { profile, setProfile } = useAuth();
  const { userId, id } = useParams();
  const targetId = userId || id || profile?._id || profile?.id;
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    photo: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);

  // Pre-fill form fields from context profile
  useEffect(() => {
    if (profile) {
      setUserData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        photo: profile.photo?.url || profile.photo || "",
        file: null,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setUserData((prev) => ({
        ...prev,
        photo: URL.createObjectURL(selectedFile),
        file: selectedFile,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!targetId) {
      toast.error("User identification missing. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("phone", userData.phone);
    if (userData.file) {
      formData.append("photo", userData.file);
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${API_BASE_URL}/users/user/${targetId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.user) {
        setProfile(response.data.user);
      }

      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50/70 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200/80 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <Link
            to="/profile"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition"
          >
            ← Return to Profile
          </Link>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Velura Portal
          </span>
        </div>

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Update Profile
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Update your verified client credentials and display portrait
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Preview & Upload */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-md ring-4 ring-indigo-100">
              <img
                src={userData.photo || "/default-avatar.png"}
                alt="Profile Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            <label className="cursor-pointer bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-indigo-100 transition">
              Choose Photo
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              placeholder="Your full name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              placeholder="10-digit phone number"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
