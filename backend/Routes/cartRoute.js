import express from "express";
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../Controllers/cartController.js"
import { isAuthenticated } from "../middleware/authUser.js";



const router = express.Router();

router.get("/",isAuthenticated, getCartProducts);
router.post("/",isAuthenticated, addToCart);
router.delete("/delete/:id",isAuthenticated, removeAllFromCart);
router.put("/update/:id",isAuthenticated, updateQuantity);

export default router;