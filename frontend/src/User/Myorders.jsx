import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from "react-hot-toast";
import axios from 'axios';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const navigate = useNavigate();
  const { id } = useParams();  // Get the id from the URL

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true); // Start loading before fetching data
      try {
        const { data } = await axios.get(`http://localhost:3900/api/order/me/${id}`, {
          withCredentials: true,
        });
        console.log(data);
        setMyOrders(data.orders); // Directly set the orders array from the response
      } catch (error) {
        console.error(error);
        toast.error("Error in Fetching Your Orders");
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    fetchOrder(); // Call the function here
  }, [id]); // Add id to the dependency array to refetch when it changes

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin inline-block w-12 h-12 border-4 border-t-4 border-blue-600 rounded-full"></div>
        <span className="ml-4 text-lg text-gray-700">Loading...</span>
      </div>
    ); // Show loading state while fetching data
  }

  return (
    <div className="container mx-auto p-8 bg-gray-50">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8">My Orders</h1>
      {myOrders.length === 0 ? (
        <p className="text-center text-xl text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {myOrders.map((order, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105 ease-in-out duration-300">
              <div className="mb-6">
                <p className="text-lg font-medium">Status: 
                  <span className={`text-${order.paymentInfo.status === 'Paid' ? 'green' : 'red'}-600`}>{order.paymentInfo.status}</span>
                </p>
                <p className="text-lg font-medium">Total: ₹{order.totalPrice}</p>
                <p className="text-lg font-medium">Order Time: {new Date(order.createdAt).toLocaleString()}</p>
                <p className="text-lg font-medium">Order Status: {order.orderStatus}</p>
              </div>
              <div className="border-t-2 border-gray-200 mt-6 pt-4">
                <p className="text-xl font-semibold text-gray-800 mb-4">Items:</p>
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center mt-4 space-x-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                    <div>
                      <p className="text-lg font-medium">{item.name}</p>
                      <p className="text-lg font-medium">Shipping Price: ₹{order.shippingPrice}</p>
                      <p className="text-lg font-medium">Tax: ₹{order.taxPrice}</p>
                      <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t-2 border-gray-200 pt-4">
                <p className="font-medium text-gray-700">Shipping Info:</p>
                <p className="text-sm text-gray-500">Address: {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state}, {order.shippingInfo.country}</p>
                <p className="text-sm text-gray-500">Phone: {order.shippingInfo.phoneNo}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;