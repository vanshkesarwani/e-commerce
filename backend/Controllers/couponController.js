import Coupon from "../Models/couponModel.js";

// ==========================================
// 1. GET ACTIVE COUPONS
// ==========================================
/**
 * Retrieve any currently active promotional coupon (single)
 */
export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      isActive: true,
      expirationDate: { $gt: new Date() },
    });
    res.status(200).json(coupon || null);
  } catch (error) {
    console.error("Error in getCoupon controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Retrieve all active and valid coupons for suggestions & search
 */
export const getAvailableCoupons = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {
      isActive: true,
      expirationDate: { $gt: new Date() },
    };

    if (search && search.trim()) {
      query.code = { $regex: search.trim().toUpperCase(), $options: "i" };
    }

    const coupons = await Coupon.find(query)
      .select("code discountPercentage expirationDate description createdAt")
      .sort({ discountPercentage: -1 });

    res.status(200).json(coupons || []);
  } catch (error) {
    console.error("Error in getAvailableCoupons controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================================
// 2. VALIDATE COUPON CODE
// ==========================================
/**
 * Validate a coupon code and return discount percentage
 */
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "This coupon code has expired" });
    }

    res.status(200).json({
      message: "Coupon applied successfully",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.error("Error in validateCoupon controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================================
// 3. CREATE COUPON (ADMIN)
// ==========================================
/**
 * Create a new promotional discount coupon
 */
export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate } = req.body;

    if (!code || !discountPercentage || !expirationDate) {
      return res.status(400).json({ message: "Code, discount percentage, and expiration date are required" });
    }

    const normalizedCode = code.trim().toUpperCase();
    const existingCoupon = await Coupon.findOne({ code: normalizedCode });

    if (existingCoupon) {
      return res.status(400).json({ message: "A coupon with this code already exists" });
    }

    const coupon = new Coupon({
      code: normalizedCode,
      discountPercentage: Number(discountPercentage),
      expirationDate: new Date(expirationDate),
    });

    await coupon.save();

    res.status(201).json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    console.error("Error in createCoupon controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================================
// 4. DELETE COUPON (ADMIN)
// ==========================================
/**
 * Delete a coupon by its code
 */
export const deleteCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await Coupon.deleteOne({ _id: coupon._id });

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCoupon controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
