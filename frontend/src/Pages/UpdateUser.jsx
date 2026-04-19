import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateUser = () => {
  const { userId } = useParams(); // Get userId from the URL
  const navigate = useNavigate(); // For navigation after update

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  // Fetch the user's current details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3900/api/users/getsingleuserbyid/${userId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setUserData({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          role: data.user.role,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to load user details.");
      }
    };

    fetchUserDetails();
  }, [userId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a copy of userData without the role field
    const { role, ...allowedData } = userData; 
  
    console.log("Submitting data (excluding role):", allowedData); // Debugging
  
    try {
      const response = await axios.put(
        `http://localhost:3900/api/users/userupdate/${userId}`,
        allowedData, // Send only allowed data
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Server Response:", response.data); // Debugging
      toast.success("User updated successfully!");
      navigate("/allusers");
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to update user.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center py-10">
  <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8">
    <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
      Update User
    </h1>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={userData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={userData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phone
        </label>
        <input
          type="text"
          name="phone"
          id="phone"
          value={userData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Role */}
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Role
        </label>
        <select
          name="role"
          id="role"
          value={userData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Update User
      </button>
    </form>
  </div>
</div>

  );
};

export default UpdateUser;