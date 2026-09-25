import express from "express";
import {
  deleteOrder,
  getAllOrders,
  getSingleOrder,
  myOrders,
  newOrder,
  updateOrder,
  requestReturnOrReplacement,
  cancelReturnRequest,
} from "../Controllers/orderController.js";
import { isAdmin, isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

// ==========================================
// CUSTOMER ORDER ROUTES (AUTHENTICATED)
// ==========================================
// Place a new order
router.post("/new", isAuthenticated, newOrder);

// Get single order details
router.get("/:id", isAuthenticated, getSingleOrder);

// Get all orders for the current user
router.get("/me/:userId", isAuthenticated, myOrders);

// Request Return or Replacement for an order
router.post("/return/:id", isAuthenticated, requestReturnOrReplacement);

// Cancel Return or Replacement request
router.post("/return/cancel/:id", isAuthenticated, cancelReturnRequest);

// ==========================================
// ADMIN ORDER MANAGEMENT ROUTES
// ==========================================
// Get all orders across the system
router.get("/admin/orders", isAuthenticated, isAdmin("admin"), getAllOrders);

// Update order status (Processing, Shipped, Delivered)
router.put("/update/:id", isAuthenticated, isAdmin("admin"), updateOrder);

// Delete an order
router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteOrder);

export default router;
