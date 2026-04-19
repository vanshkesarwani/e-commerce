import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState();
  const [products, setProducts] = useState();
  const [allorders, setAllOrders] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Retrieve the token directly from localStorage
        let token = localStorage.getItem("jwt"); 
        console.log(token);
        if (token) {
          const { data } = await axios.get(
            "http://localhost:3900/api/users/my-profile",
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          
          setProfile(data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3900/api/products/getallproducts",
          {
            withCredentials: true,
          }
        );
        
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAllOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3900/api/order/admin/orders",
          {
            withCredentials: true,
          },
        );
        setAllOrders(data);
        
      } catch (error) {
        console.log(error);
      }
    }

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
        profile,
        setProfile,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);