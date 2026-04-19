import express from "express";
import {
  deleteOrder,
  getAllOrders,
  getSingleOrder,
  myOrders,
  newOrder,
  updateOrder,
} from "../Controllers/orderController.js";
import { isAdmin, isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

// Routes for Orders
router.post("/new",isAuthenticated, newOrder);
router.get("/:id",isAuthenticated, getSingleOrder);
router.get("/admin/orders",isAuthenticated, getAllOrders);
router.get("/me/:userId",isAuthenticated, myOrders);
router.put("/update/:id", updateOrder);
router.delete("/delete/:id", deleteOrder);

export default router;
