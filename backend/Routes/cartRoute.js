import express from "express";
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
} from "../Controllers/cartController.js";
import { isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

// ==========================================
// SHOPPING CART ROUTES (AUTHENTICATED)
// ==========================================
// Get active cart products
router.get("/", isAuthenticated, getCartProducts);

// Add product to cart
router.post("/", isAuthenticated, addToCart);

// Update item quantity in cart
router.put("/update/:id", isAuthenticated, updateQuantity);

// Remove specific item or clear cart
router.delete("/delete/:id", isAuthenticated, removeAllFromCart);
router.delete("/delete", isAuthenticated, removeAllFromCart);

export default router;