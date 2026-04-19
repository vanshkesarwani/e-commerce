import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateBanner = () => {
  const [bannerImage, setBannerImage] = useState("");
  const [bannerImagePreview, setBannerImagePreview] = useState("");
  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setBannerImagePreview(reader.result);
      setBannerImage(file);
    };
  };

  const handleBannerCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('bannerImage', bannerImage);

    try {
      const { data } = await axios.post(
        "http://localhost:3900/api/banner/create",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(data.message || "Banner created successfully");
      setBannerImage("");
      setBannerImagePreview("");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
      console.error(error);
    }
  };

  const handleAllBanners = () => {
    navigate("/allbanners");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create New Banner</h2>
        
        <form onSubmit={handleBannerCreate}>
          {/* Banner Image Upload Section */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-32 h-32 mb-4 flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg">
              <img
                src={bannerImagePreview ? bannerImagePreview : "https://via.placeholder.com/150"}
                alt="Banner Preview"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <input
              type="file"
              onChange={changePhotoHandler}
              className="w-full p-2 mb-4 border rounded-md text-gray-700"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 hover:bg-blue-800 text-white font-semibold rounded-md transition duration-300"
            >
              Create Banner
            </button>
            <button
              type="button"
              onClick={handleAllBanners}
              className="w-full p-3 bg-gray-500 hover:bg-gray-700 text-white font-semibold rounded-md transition duration-300"
            >
              All Banners
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBanner;