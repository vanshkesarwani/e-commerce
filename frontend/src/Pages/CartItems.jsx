import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const CartItems = () => {
  const { profile } = useAuth(); // Assumes `profile` contains user details
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Function to calculate the total price
  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  // Fetch cart items from the server for the logged-in user
  const fetchCartItems = async () => {
    try {
      const { data } = await axios.get("http://localhost:3900/api/cart", {
        withCredentials: true,
      });
      setCartItems(data || []);
      calculateTotalPrice(data || []);
      console.log(data);
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to fetch cart items.");
    }
  };

  // Update quantity for a specific cart item
  const updateQuantity = async (productId, currentQuantity, stock, increment = true) => {
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;

    // Prevent exceeding stock or going below 1
    if (newQuantity > stock) {
      toast.error("Cannot add more items. Reached stock limit!");
      return;
    }
    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1!");
      return;
    }

    try {
      const { data } = await axios.put(
        `http://localhost:3900/api/cart/update/${productId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      setCartItems(data || []);
      calculateTotalPrice(data || []);
     
    } catch (error) {
      console.log(error.message);
      
    }
  };

  // Remove item from the cart
  const removeFromCart = async (productId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3900/api/cart/delete/${productId}`,
        { withCredentials: true }
      );
      setCartItems(data || []);
      calculateTotalPrice(data || []);
      toast.success("Item removed from cart!");
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to remove item.");
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-600">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-lg text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center mb-4 p-4 border-b shadow-md rounded-lg transition-all duration-300 hover:bg-gray-100"
            >
              <div className="flex items-center">
              <img
  src={item.productImage?.url || "https://via.placeholder.com/150"}
  alt={item.title || "Product Image"}
  className="w-32 h-32 rounded-md shadow-md object-contain"
/>

                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
                  <p className="text-gray-600">Stock: {item.stock}</p>
                  <p className="text-gray-600">Price: ₹{item.price}</p>
                  <p className="text-gray-600">Total: ₹{item.price * item.quantity}</p>

                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity, item.stock, false)
                      }
                      className="bg-gray-300 text-black px-3 py-1 rounded-md hover:bg-gray-400 transition-all duration-300"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity, item.stock, true)
                      }
                      className="bg-gray-300 text-black px-3 py-1 rounded-md hover:bg-gray-400 transition-all duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-300"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Total Amount Card */}
          <div className="mt-6 p-6 border rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-blue-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-white">
                Total Price: ₹{totalPrice}
              </h2>
            </div>
            <div className="flex justify-end">
              <Link to="/address">
                <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-all duration-300">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItems;