import express from "express";
import {
  createBanner,
  getAllBanners,
  deleteBanner,
} from "../Controllers/bannerController.js";
import { isAuthenticated, isAdmin } from "../middleware/authUser.js";

const router = express.Router();

// ==========================================
// BANNER ROUTES
// ==========================================
// Public: View all promotional banners
router.get("/all", getAllBanners);

// Admin: Create and delete promotional banners
router.post("/create", isAuthenticated, isAdmin("admin"), createBanner);
router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteBanner);

export default router;