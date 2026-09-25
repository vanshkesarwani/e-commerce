import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/authUser.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getMyProducts,
  getSingleProduct,
  updateProduct,
  createProductReview,
  getProductReviews,
  getProductsByCategory,
  searchProducts,
} from "../Controllers/productController.js";

const router = express.Router();

// ==========================================
// PUBLIC PRODUCT BROWSING ROUTES
// ==========================================
router.get("/getallproducts", getAllProducts);
router.get("/getsingleproduct/:id", getSingleProduct);
router.get("/product/:id/category", getProductsByCategory);
router.get("/search", searchProducts);
router.get("/getreviews/:id", getProductReviews);

// ==========================================
// USER INTERACTION ROUTES
// ==========================================
router.put("/createreview", isAuthenticated, createProductReview);

// ==========================================
// ADMIN PRODUCT MANAGEMENT ROUTES
// ==========================================
router.post("/create/new", isAuthenticated, isAdmin("admin"), createProduct);
router.put("/updateproduct/:id", isAuthenticated, isAdmin("admin"), updateProduct);
router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteProduct);
router.get("/getmyproduct", isAuthenticated, isAdmin("admin"), getMyProducts);

export default router;