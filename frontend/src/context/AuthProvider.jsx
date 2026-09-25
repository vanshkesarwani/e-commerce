import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export const AuthContext = createContext();

// ==========================================
// AUTHENTICATION & GLOBAL DATA PROVIDER
// ==========================================
export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [allorders, setAllOrders] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize session and global store data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (token) {
          const { data } = await apiClient.get("/users/my-profile");
          if (data?.user) {
            setProfile(data.user);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error("Session verification failed:", error.message);
        // Clear invalid local storage token if session expired
        localStorage.removeItem("jwt");
        setIsAuthenticated(false);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await apiClient.get("/products/getallproducts");
        setProducts(data?.products || data || []);
      } catch (error) {
        console.error("Failed to load products in AuthProvider:", error.message);
      }
    };

    const fetchAllOrders = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (token) {
          const { data } = await apiClient.get("/order/admin/orders");
          setAllOrders(data?.orders || data || []);
        }
      } catch (error) {
        // Suppress expected 403 for standard non-admin users
      }
    };

    fetchProfile();
    fetchProducts();
    fetchAllOrders();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        allorders,
        setAllOrders,
        products,
        setProducts,
        profile,
        setProfile,
        isAuthenticated,
        setIsAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;