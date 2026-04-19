import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";
import Logo from "../assets/logo.jpeg";
import { FaSearch, FaShoppingCart, FaUserCircle } from "react-icons/fa";

function Navbar() {
  const { profile, isAuthenticated, setIsAuthenticated, allproduct } = useAuth();
  const navigateTo = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  console.log(allproduct)

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        "http://localhost:3900/api/users/logout",
        { withCredentials: true }
      );
      localStorage.removeItem("jwt");
      toast.success(data.message);
      setIsAuthenticated(false);
      navigateTo("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout");
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      toast.error("Please enter a search keyword");
      return;
    }
    navigateTo(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
    
  };
  

  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-lg">
    <div className="hidden md:flex h-20 items-center justify-between px-6">
      {/* Logo and Returns & Orders */}
      <div className="flex items-center">
        <Link to="/">
          <img
            src={Logo}
            className="w-20 h-16 object-contain transition-transform duration-300 hover:scale-110"
            alt="Logo"
          />
        </Link>
        <h1 className="ml-6 text-white text-lg font-medium hover:text-yellow-500 hover:scale-105 hover:border hover:border-yellow-500 hover:rounded-lg px-3 py-1 transition-all duration-300">
          Returns & Orders
        </h1>
      </div>
  
      {/* Search Bar */}
      <div className="flex items-center bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shadow-lg rounded-full w-[700px] h-14">
  <input
    type="text"
    placeholder="Search "
    value={searchKeyword}
    onChange={(e) => setSearchKeyword(e.target.value)}
    className="flex-grow text-gray-800 px-6 py-3 text-sm bg-transparent focus:outline-none rounded-l-full placeholder-gray-500"
  />
  <FaSearch
    className="text-white bg-gradient-to-r from-pink-500 to-purple-600 text-3xl p-3 rounded-full cursor-pointer hover:scale-110 transition-transform duration-300 "
    onClick={handleSearch}
  />
</div>

  
      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Cart Icon */}
        <Link to="/cart">
          <FaShoppingCart className="text-white text-4xl hover:text-yellow-500 transition-transform duration-300 hover:scale-110" />
        </Link>
  
        {/* Profile Icon */}
        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center overflow-hidden hover:ring-4 hover:ring-yellow-500 hover:scale-110 transition-all duration-300">
          <Link to="/profile">
            {profile?.photo?.url ? (
              <img
                src={profile.photo.url}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <FaUserCircle className="text-white text-3xl" />
            )}
          </Link>
        </div>
  
        {/* Admin Dashboard (Conditional) */}
        {isAuthenticated && profile?.role === "admin" && (
          <Link
            to="/dashboard"
            className="text-white font-semibold text-sm px-3 py-1 bg-gray-800 hover:bg-yellow-500 hover:text-gray-900 hover:scale-110 transition-all duration-300 rounded-lg shadow-lg"
          >
            DASHBOARD
          </Link>
        )}
  
        {/* Login/Logout Button */}
        <button
          onClick={isAuthenticated ? handleLogout : () => navigateTo("/login")}
          className={`${
            isAuthenticated
              ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
              : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
          } text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:scale-110 hover:ring-4 hover:ring-white transition-all duration-300`}
        >
          {isAuthenticated ? "LOGOUT" : "LOGIN"}
        </button>
      </div>
    </div>
  </div>  
  );
}

export default Navbar;