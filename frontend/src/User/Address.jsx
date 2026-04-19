import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Address = () => {
  const [address, setAddress] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    phoneNo: '',
  });
  const [loading, setLoading] = useState(false);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { data } = await axios.get('http://localhost:3900/api/cart', {
          withCredentials: true, 
        });
        setCartData(data);
      } catch (error) {
        toast.error('Error fetching cart items');
        console.error(error);
      }
    };

    fetchCartItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemsPrice = cartData.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const taxPrice = 36;
    const shippingPrice = 100;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const orderData = {
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderItems: cartData.map((item) => ({
        product: item._id,
        name: item.title,
        price: item.price,
        image: item.productImage.url,
        quantity: item.quantity,
      })),
      shippingInfo: address,
      paymentInfo: {
        id: 'sample Payment Info',
        status: 'succeeded',
      },
    };

    try {
      setLoading(true);

      const response = await axios.post('http://localhost:3900/api/order/new', orderData, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success('Order placed successfully!');
        navigate('/ordersummary');
      } else {
        toast.error('Failed to place the order.');
      }
    } catch (error) {
      toast.error('Error placing the order.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-600">Shipping Address</h1>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 shadow-md rounded-lg">
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={address.address}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
            placeholder="Enter your address"
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              value={address.city}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              placeholder="City"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              name="state"
              id="state"
              value={address.state}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              placeholder="State"
            />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              name="country"
              id="country"
              value={address.country}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              placeholder="Country"
            />
          </div>
          <div>
            <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">
              Pincode
            </label>
            <input
              type="number"
              name="pinCode"
              id="pinCode"
              value={address.pinCode}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              placeholder="Pin Code"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNo"
            id="phoneNo"
            value={address.phoneNo}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
            placeholder="Phone Number"
          />
        </div>

        <div className="mt-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Your Bill</h2>
          <div className="border-t mt-4">
            {cartData.length === 0 ? (
              <div className="py-4 text-center text-gray-500">No products in the cart.</div>
            ) : (
              cartData.map((item, index) => (
                <div key={index} className="flex justify-between py-2">
                  <div className="flex items-center">
                    <img src={item.productImage.url} alt={item.title} className="w-12 h-12 mr-4" />
                    <span>{item.title}</span>
                  </div>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))
            )}
            <div className="flex justify-between py-2">
              <span className="font-semibold">Tax:</span>
              <span>₹36</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-semibold">Shipping:</span>
              <span>₹100</span>
            </div>
            <div className="flex justify-between py-2 border-t font-semibold">
              <span>Total:</span>
              <span>₹{(cartData.reduce((acc, item) => acc + item.price * item.quantity, 0)) + 36 + 100}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            onClick={() => navigate('/purchase-success')}
            disabled={loading}
            className={`bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all duration-300 ${loading && 'opacity-50 cursor-not-allowed'}`}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Address;