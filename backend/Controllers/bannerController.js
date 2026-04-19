// controllers/bannerController.js
import { v2 as cloudinary } from 'cloudinary';
import Banner from '../models/bannerModel.js';

// Create Banner Controller
export const createBanner = async (req, res) => {
  try {
    const { bannerImage } = req.files; // Assuming you're using express-fileupload middleware to handle file uploads

    // Validate image format
    const allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedFormats.includes(bannerImage.mimetype)) {
      return res.status(400).json({
        message: 'Invalid photo format. Only jpg, png, and webp are allowed',
      });
    }

    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(bannerImage.tempFilePath, {
      folder: 'banners',
    });

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
      return res.status(500).json({ message: 'Error uploading banner' });
    }

    // Prepare banner data
    const bannerData = {
      bannerImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url, // Use secure_url for HTTPS
      },
    };

    // Save banner to the database
    const banner = await Banner.create(bannerData);

    // Respond with success message
    res.status(201).json({
      message: 'Banner created successfully',
      banner, // Correct the response to include the 'banner' object
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// Get all banners Controller
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json({
      message: 'All banners fetched successfully',
      banners,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// Delete Banner Controller
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Log the banner data to check if the public_id is correct
    console.log("Banner data:", banner);

    

    // Delete banner from database
    await Banner.deleteOne({ _id: id });  // Use deleteOne() instead of remove()

    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.log("Error deleting banner:", error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};