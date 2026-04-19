import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AllBanners = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3900/api/banner/all",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setBanners(data.banners);
        console.log("Fetched All Banners:", data.banners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const deleteBanner = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3900/api/banner/delete/${id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message || "Banner deleted successfully");
      setBanners(banners.filter((banner) => banner._id !== id));
    } catch (error) {
      toast.error("Failed to delete banner. Please try again.");
      console.error("Error deleting banner:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">All Banners</h1>

      {banners.length === 0 ? (
        <p className="text-center text-gray-500">No banners available.</p>
      ) : (
        <div className="space-y-8">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
            >
              {/* Banner Image */}
              <img
                src={banner.bannerImage.url || "https://via.placeholder.com/1400x400"}
                alt="Banner"
                className="w-full max-w-screen-xl mx-auto object-cover"
                style={{ height: '350px' }}  // Adjust height to make it a bit less
              />

              {/* Delete Button */}
              <div className="flex justify-center p-4">
                <button
                  onClick={() => deleteBanner(banner._id)}
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-800 transition duration-300"
                >
                  Delete Banner
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBanners;