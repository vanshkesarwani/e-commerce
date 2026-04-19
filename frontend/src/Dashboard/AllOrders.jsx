import React from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const AllOrders = () => {
  const { allorders } = useAuth();
  const navigate = useNavigate();

  // Extract orders from the allorders object
  const orders = allorders?.orders || [];

  const handleDeleteOrder = async (orderId) => {
    
    try {
        await axios.delete(
            `http://localhost:3900/api/order/delete/${orderId}`,
            {
                withCredentials:true,
                headers: {
                    "Content-Type": "application/json",
                  },
            }
        );
        toast.success("Order Delete Successfully")
    } catch (error) {
        console.log(error);
        toast.error("error In deleteing Order")
    }
  };

  const handleUpdateOrder = (orderId) => {
    // Navigate to the update page with the orderId in the URL
    navigate(`/update-order/${orderId}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">
          Manage Your Orders
        </h1>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-300"
            >
              <h2 className="text-lg font-bold mb-2 text-blue-600">
                Order #{index + 1}
              </h2>
              <p className="mb-2">
                <span className="font-semibold text-gray-700">Order ID:</span> {order._id}
              </p>
              <p className="mb-2">
                <span className="font-semibold text-gray-700">Status:</span>{' '}
                <span
                  className={`px-2 py-1 rounded-md text-sm ${
                    order.orderStatus === 'Processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {order.orderStatus}
                </span>
              </p>
              <p className="mb-2">
                <span className="font-semibold text-gray-700">Total Price:</span> ₹{order.totalPrice}
              </p>
              <p className="mb-4">
                <span className="font-semibold text-gray-700">Paid At:</span>{' '}
                {new Date(order.paidAt).toLocaleString()}
              </p>

              <div className="mb-4">
                <h3 className="font-bold text-gray-800 mb-2">Shipping Information:</h3>
                <p>
                  <span className="font-semibold text-gray-700">Address:</span> {order.shippingInfo.address},{' '}
                  {order.shippingInfo.city}, {order.shippingInfo.state}, {order.shippingInfo.country}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Pin Code:</span> {order.shippingInfo.pinCode}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Phone:</span> {order.shippingInfo.phoneNo}
                </p>
              </div>

              <div className="mb-4">
                <h3 className="font-bold text-gray-800 mb-2">Order Items:</h3>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.product}
                      className="flex items-center space-x-4 border-b pb-4 last:border-b-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-gray-600">Price: ₹{item.price}</p>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition"
                  onClick={() => handleDeleteOrder(order._id)}
                >
                  Delete Order
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
                  onClick={() => handleUpdateOrder(order._id)}
                >
                  Update Order
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 text-xl">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default AllOrders;