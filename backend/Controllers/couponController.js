import Coupon from "../Models/couponModel.js";

// Get active coupon
export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ isActive: true }); // No userId filter now
    res.json(coupon || null);
  } catch (error) {
    console.log("Error in getCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Validate a coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body; // Extracting code from request body
    const coupon = await Coupon.findOne({
      code: code,
      isActive: true, // Removed userId filter
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "Coupon expired" });
    }

    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in validateCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new coupon
export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate } = req.body; // Extracting data from request body

    if (!code || !discountPercentage || !expirationDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = new Coupon({
      code,
      discountPercentage,
      expirationDate,
    });

    await coupon.save();

    res.status(201).json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    console.log("Error in createCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { code } = req.body; // Extracting code from request body

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await Coupon.deleteOne({ code: code }); // Fix: Use deleteOne() instead of remove()

    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.log("Error in deleteCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
