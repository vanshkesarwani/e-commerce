import express from "express";
import {
  getCoupon,
  getAvailableCoupons,
  validateCoupon,
  createCoupon,
  deleteCoupon,
} from "../Controllers/couponController.js";
import { isAuthenticated, isAdmin } from "../middleware/authUser.js";

const router = express.Router();

// ==========================================
// PUBLIC / USER COUPON ROUTES
// ==========================================
// Get currently active coupon
router.get("/", getCoupon);

// Get all available coupons with search support
router.get("/available", getAvailableCoupons);
router.get("/all", getAvailableCoupons);

// Validate entered coupon code
router.post("/validate", validateCoupon);

// ==========================================
// ADMIN COUPON MANAGEMENT ROUTES
// ==========================================
// Create a new promotional coupon
router.post("/create", isAuthenticated, isAdmin("admin"), createCoupon);

// Delete a coupon
router.delete("/delete", isAuthenticated, isAdmin("admin"), deleteCoupon);

export default router;