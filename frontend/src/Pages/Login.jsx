import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";

const Login = () => {

   const { setProfile, isAuthenticated, setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:3900/api/users/login",
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);

      // Store the token in localStorage
      localStorage.setItem("jwt", data.token);

      toast.success(data.message || "User logged in successfully", {
        duration: 3000,
      });

      setProfile(data);
      setIsAuthenticated(true);

      setEmail("");
      setPassword("");

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Please fill the required fields",
        {
          duration: 3000,
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 transform transition-all duration-300 hover:scale-105">
      <form onSubmit={handleLogin}>
        <div className="text-center">
          <h1 className="font-extrabold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">
            Shoe Paradise
          </h1>
        </div>
        <div className="text-center">
          <h2 className="font-semibold text-2xl text-gray-700 my-4">Login</h2>
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
            type="password"
            value={password}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-md my-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-gray-600">
            New User?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 duration-300">
              Register
            </Link>
          </h3>
        </div>
        <div className="text-center mt-2">
          <h3 className="font-semibold text-gray-600">
            Forgot Password?{" "}
            <Link to="/forgot" className="text-blue-600 hover:text-blue-800 duration-300">
              Click Here
            </Link>
          </h3>
        </div>
        <button
          type="submit"
          className="my-4 w-full p-3 bg-blue-500 hover:bg-blue-700 transition duration-300 rounded-md text-white font-semibold focus:outline-none"
        >
          Login
        </button>
      </form>
    </div>
  </div>
  );
};

export default Login;