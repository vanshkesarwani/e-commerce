import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const UpdateOrder = () => {
  const { orderId } = useParams();

  const [orderData, setOrderData] = useState({
    orderStatus: '',
  });
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrderStatus = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:3900/api/order/${orderId}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (data?.success && data.order) {
        setOrderData({ orderStatus: data.order.orderStatus || 'Status not available' });
      } else {
        toast.error('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
      toast.error('Error fetching order status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrderStatus();
  }, [orderId]);

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error('Please select a new status');
      return;
    }

    setUpdating(true);
    try {
      const { data } = await axios.put(
        `http://localhost:3900/api/order/update/${orderId}`,
        { orderStatus: newStatus },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (data?.success) {
        toast.success('Order status updated successfully');
        setOrderData({ orderStatus: newStatus });
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Order Status</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>Status: {orderData.orderStatus}</p>
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="status" className="block mb-2 text-gray-600">Select Order Status</label>
          <select
            id="status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">--Select Status--</option>
            <option value="Delivered">Delivered</option>
            <option value="On the Way">On the Way</option>
            <option value="Processing">Processing</option>
          </select>
          <button
            onClick={handleUpdateStatus}
            disabled={updating}
            className="mt-4 bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
          >
            {updating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;
