import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from "../context/AuthProvider";
import axios from 'axios';

const UpdateProfile = () => {
  const { profile } = useAuth(); // Assuming profile is fetched using context
  const { id } = useParams(); // Get user ID from URL
  const navigate = useNavigate();

  // State to store user data
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    photo: "", // Initial empty string, will hold current photo URL
    file: null,
  });

  // Effect to pre-fill the form with existing user data
  useEffect(() => {
    if (profile) {
      // Pre-fill form fields with current profile data
      setUserData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        photo: profile.photo, // Assuming the photo is already in the profile
        file: null,
      });
    }
  }, [profile]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Handle file input change (for profile photo)
  const handleFileChange = (e) => {
    setUserData({
      ...userData,
      photo: URL.createObjectURL(e.target.files[0]),
      file: e.target.files[0],
    });
  };

  // Handle form submission for updating user
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create FormData to handle file uploads
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('phone', userData.phone);
    if (userData.file) {
      formData.append('photo', userData.file);
    }
  
    try {
      console.log("Submitting form with ID:", id); // Add log to check the ID value
  
      const response = await axios.put(`http://localhost:3900/api/users/user/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      toast.success("User Profile Updated Successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Update User Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={userData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              required
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={userData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-700 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
            />
            {userData.photo && (
              <div className="mt-4">
                <img src={userData.photo.url} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 hover:bg-indigo-700"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
