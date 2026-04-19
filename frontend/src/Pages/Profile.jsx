import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { profile } = useAuth();
  console.log(profile)
  const navigate = useNavigate();

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      try {
        await axios.delete(
          `http://localhost:3900/api/users/userdelete/${userId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Profile deleted successfully");
        navigate("/login"); // Redirect to login page after successful deletion
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete profile. Please try again.");
      }
    }
  };

  return (
<div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-gray-100 to-gray-200">
  {/* Permanent Drawer */}
  <div className="w-full md:w-64 bg-gradient-to-b from-red-800 to-red-950 text-white shadow-2xl transition-transform transform hover:scale-105 duration-300" style={{ minWidth: "250px" }}>
    <div className="p-6 border-b border-gray-500">
      <h2 className="text-lg font-extrabold tracking-widest">Menu</h2>
    </div>
    <ul className="p-4 space-y-6">
      <li>
        <Link to={`/updateprofile/${profile?._id}`} className="text-lg font-semibold hover:text-yellow-400 transition-colors duration-200">
          Update Profile
        </Link>
      </li>
      <li>
        <Link to={`/myorders/${profile?._id}`} className="text-lg font-semibold hover:text-yellow-400 transition-colors duration-200">
          My Orders
        </Link>
      </li>
      <li>
        <button className="text-lg font-semibold hover:text-red-400 transition-colors duration-200 w-full text-left" onClick={() => handleDelete(profile._id)}>
          Delete Profile
        </button>
      </li>
    </ul>
  </div>

  {/* Main Content */}
  <div className="flex flex-col flex-1 p-4 md:p-8">
    {/* Header */}
    <header className="bg-white shadow-lg rounded-lg p-4 md:p-6 mb-4 md:mb-6">
      <h1 className="text-center text-xl md:text-2xl font-extrabold text-gray-800">Profile</h1>
    </header>

    {/* Profile Content */}
    <main className="flex justify-center items-center">
      <div className="bg-white shadow-2xl rounded-lg p-4 md:p-8 w-full max-w-2xl md:max-w-4xl transform transition-transform hover:scale-105 duration-300">
        {/* Profile Header */}
        <div className="flex justify-center mb-4 md:mb-8">
          <img src={profile?.photo?.url || "/default-profile.png"} className="object-cover w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-yellow-400 shadow-lg" alt="Profile" />
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-gray-100 shadow-md rounded-lg p-4 md:p-6 hover:bg-gray-200 transition-colors duration-200">
            <h2 className="text-gray-600 text-sm font-semibold mb-1 md:mb-2">Name</h2>
            <p className="text-lg font-bold text-gray-800">{profile?.name || "N/A"}</p>
          </div>
          <div className="bg-gray-100 shadow-md rounded-lg p-4 md:p-6 hover:bg-gray-200 transition-colors duration-200">
            <h2 className="text-gray-600 text-sm font-semibold mb-1 md:mb-2">Email</h2>
            <p className="text-lg font-bold text-gray-800">{profile?.email || "N/A"}</p>
          </div>
          <div className="bg-gray-100 shadow-md rounded-lg p-4 md:p-6 hover:bg-gray-200 transition-colors duration-200">
            <h2 className="text-gray-600 text-sm font-semibold mb-1 md:mb-2">Phone</h2>
            <p className="text-lg font-bold text-gray-800">{profile?.phone || "N/A"}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</div>

  );
};

export default Profile;