import express from "express";
import{ getCoupon, validateCoupon, createCoupon, deleteCoupon } from "../Controllers/couponController.js";


const router = express.Router();

// Get active coupon for the logged-in user
router.get("/", getCoupon);

// Validate a coupon code
router.post("/validate",validateCoupon);

// Create a new coupon
router.post("/create", createCoupon);

// Delete a coupon by code
router.delete("/delete", deleteCoupon);

export default router;