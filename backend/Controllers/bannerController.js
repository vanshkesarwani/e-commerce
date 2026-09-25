import { v2 as cloudinary } from "cloudinary";
import Banner from "../Models/bannerModel.js";

// ==========================================
// 1. CREATE BANNER (ADMIN)
// ==========================================
/**
 * Create a new promotional banner with image upload
 */
export const createBanner = async (req, res) => {
  try {
    if (!req.files || !req.files.bannerImage) {
      return res.status(400).json({ message: "Banner image is required" });
    }

    const { bannerImage } = req.files;

    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(bannerImage.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only JPG, PNG, and WEBP are allowed",
      });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      bannerImage.tempFilePath,
      { folder: "banners" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary banner upload error:", cloudinaryResponse?.error);
      return res.status(500).json({ message: "Error uploading banner image" });
    }

    const { title, link } = req.body;

    const banner = await Banner.create({
      title: title || "",
      link: link || "",
      bannerImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url || cloudinaryResponse.url,
      },
    });

    res.status(201).json({
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    console.error("Error in createBanner:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// ==========================================
// 2. GET ALL BANNERS
// ==========================================
/**
 * Retrieve all active promotional banners
 */
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "All banners fetched successfully",
      banners,
    });
  } catch (error) {
    console.error("Error in getAllBanners:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// ==========================================
// 3. DELETE BANNER (ADMIN)
// ==========================================
/**
 * Delete a banner and its associated Cloudinary image
 */
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    if (banner.bannerImage?.public_id) {
      await cloudinary.uploader.destroy(banner.bannerImage.public_id);
    }

    await Banner.deleteOne({ _id: id });

    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};