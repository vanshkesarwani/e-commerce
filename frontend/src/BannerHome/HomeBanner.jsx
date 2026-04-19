import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material"; // For responsive design

const HomeBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isMobile = useMediaQuery("(max-width: 600px)"); // Check if the screen size is mobile

  useEffect(() => {
    // Fetch banners from the API
    const fetchBanners = async () => {
      try {
        const { data } = await axios.get("http://localhost:3900/api/banner/all", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setBanners(data.banners);
        console.log("Fetched All Banners:", data.banners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []); // Empty array means this effect runs only once when the component mounts

  useEffect(() => {
    // Set an interval for automatic sliding every 3 seconds
    const interval = setInterval(() => {
      nextBanner();
    }, 3000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [banners.length]); // Only re-run this effect if banners length changes

  const nextBanner = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-gray-100 p-0 m-0">
      {banners.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="relative w-full p-0 m-0 overflow-hidden">
          <div className="bg-white shadow-lg overflow-hidden border border-gray-200 w-full m-0">
            {/* Banner Images */}
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`, // Move to the current index
              }}
            >
              {banners.map((banner, index) => (
                <div
                  key={index}
                  className={`w-full flex-shrink-0 ${
                    isMobile ? "h-200" : "h-350" // Set different heights for mobile and desktop
                  }`}
                  style={{
                    objectFit: "cover",
                  }}
                >
                  <img
                    src={banner?.bannerImage?.url}
                    alt={`Banner ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
              <button
                onClick={prevBanner}
                className="bg-gray-700 text-white p-2 rounded-full"
              >
                Prev
              </button>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
              <button
                onClick={nextBanner}
                className="bg-gray-700 text-white p-2 rounded-full"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeBanner;