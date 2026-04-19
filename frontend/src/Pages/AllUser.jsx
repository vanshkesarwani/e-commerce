import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DrawerMenu from "../Dashboard/Drawermenu"; 

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch users on component mount
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:3900/api/users/allusers", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Fetched All Users:", data.users);

        // Sort users by role: admin first, then user
        const sortedUsers = data.users.sort((a, b) => {
          if (a.role === "admin" && b.role !== "admin") return -1;
          if (a.role !== "admin" && b.role === "admin") return 1;
          return 0;
        });

        setUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  // Delete user function
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3900/api/users/userdelete/${userId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error in user deletion");
    }
  };

  // Handle update (navigate to update page)
  const handleUpdate = (userId) => {
    navigate(`/update/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center py-10">
    <div className="w-full max-w-6xl bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 rounded-xl shadow-2xl p-10 space-y-8">
      <h1 className="text-5xl font-bold text-center text-white mb-8">All Users</h1>
  
      {/* Cards Display for Users */}
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl p-6 bg-white rounded-2xl shadow-lg"
            >
              <div className="flex justify-center mb-6">
                <img
                  src={user.photo.url || "https://via.placeholder.com/150"}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-indigo-400 shadow-lg object-cover"
                />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">{user.role}</p>
                <p className="text-sm text-gray-600">{user.phone}</p>
                <p className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => handleUpdate(user._id)}
                  className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-6 py-2 rounded-lg transition-transform duration-200 hover:scale-105"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-2 rounded-lg transition-transform duration-200 hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-white text-xl font-semibold">No users found</p>
        )}
      </div>
    </div>
  </div>
  
  );
};

export default AllUsers;