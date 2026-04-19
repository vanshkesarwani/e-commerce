import express from "express";

import { isAdmin, isAuthenticated } from "../middleware/authUser.js";
import { createProduct,  deleteProduct,  getAllProducts, getMyProducts, getSingleProduct, updateProduct,createProductReview, getProductReviews, getProductsByCategory, searchProducts } from "../Controllers/productController.js";

const router = express.Router();

// Routes
router.post("/create/new", isAuthenticated, isAdmin("admin"), createProduct)
router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteProduct)
router.get("/getmyproduct", isAuthenticated, getMyProducts)
router.get("/getsingleproduct/:id", getSingleProduct)
router.get("/getallproducts", getAllProducts)
router.put("/updateproduct/:id", updateProduct)
router.put("/createreview", isAuthenticated, createProductReview)
router.get("/getreviews/:id", getProductReviews)
router.get("/product/:id/category", getProductsByCategory);
router.get("/search", searchProducts);





export default router;