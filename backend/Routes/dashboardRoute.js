import express from "express";
import { getDashboardStats } from "../Controllers/dashboardController.js";
import { isAdmin, isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

// ==========================================
// ADMIN DASHBOARD ANALYTICS ROUTE
// ==========================================
router.get("/stats", isAuthenticated, isAdmin("admin"), getDashboardStats);

export default router;
