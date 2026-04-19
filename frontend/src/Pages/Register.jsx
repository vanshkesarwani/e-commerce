import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";

const Register = () => {
  const authContext = useAuth();

  // Check if the context is available
  if (!authContext) {
    // Handle the error or show a fallback message
    return <div>Loading...</div>; // Or any other error handling logic
  }

  const { setProfile, profile, isAuthenticated, setIsAuthenticated } = authContext;
  console.log(profile);

  const naviagte = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setPhoto(file);
    };
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("photo", photo);

    try {
      const { data } = await axios.post(
        "http://localhost:3900/api/users/register",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      localStorage.setItem("jwt", data.token);
      toast.success(data.message || "Registration Successful");
      setProfile(data); // Update profile context
      setIsAuthenticated(true); // Set authentication to true
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setPhoto("");
      setPhotoPreview("");
      naviagte("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Please fill the required fields"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
  <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 transform transition-all duration-300 hover:scale-105">
    <form onSubmit={handleRegister}>
      <div className="text-center">
        <h1 className="font-extrabold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">
        Shoe<span className="mx-2 text-blue-700">Paradise</span>
        </h1>
      </div>
      <div className="text-center">
        <h2 className="font-semibold text-2xl text-gray-700 my-4">REGISTER</h2>
      </div>
      <div>
        <input
          type="text"
          value={name}
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-md my-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
      </div>
      <div>
        <input
          type="email"
          value={email}
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-md my-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
      </div>
      <div>
        <input
          type="tel"
          value={phone}
          placeholder="Enter Your Phone Number"
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-md my-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          placeholder="Enter Your Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-md my-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
      </div>
      <div className="flex items-center mb-4">
        <div className="w-20 h-20 mr-4">
          <img
            src={photoPreview ? photoPreview : "default-photo.png"}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <input
          type="file"
          onChange={changePhotoHandler}
          className="w-full p-2 border-2 border-gray-300 rounded-md"
        />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-gray-600">
          Already Registered?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 duration-300">
            Login 
          </Link>
        </h3>
      </div>
      <button
        type="submit"
        className="my-4 w-full p-3 bg-blue-500 hover:bg-blue-700 transition duration-300 rounded-md text-white font-semibold focus:outline-none"
      >
        Register
      </button>
    </form>
  </div>
</div>
  );
};

export default Register;
