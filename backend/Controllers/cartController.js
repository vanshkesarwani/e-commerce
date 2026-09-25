import { Product } from "../Models/productModel.js";
import { User } from "../Models/userModel.js";

// ==========================================
// CART HELPER: POPULATE CART PRODUCTS
// ==========================================
/**
 * Helper to transform and populate cart items with current product details
 */
const getPopulatedCart = async (cartItems) => {
  if (!cartItems || cartItems.length === 0) return [];

  const productIds = cartItems
    .map((item) => (item.product ? item.product.toString() : item.toString()))
    .filter(Boolean);

  const products = await Product.find({ _id: { $in: productIds } });

  return products
    .map((product) => {
      const match = cartItems.find((item) => {
        const id = item.product ? item.product.toString() : item.toString();
        return id === product._id.toString();
      });

      return {
        ...product.toObject(),
        quantity: match && match.quantity ? match.quantity : 1,
      };
    })
    .filter(Boolean);
};

// ==========================================
// 1. GET CART PRODUCTS
// ==========================================
/**
 * Retrieve all items in the authenticated user's cart
 */
export const getCartProducts = async (req, res) => {
  try {
    const user = req.user;
    const populated = await getPopulatedCart(user.cartItems);
    return res.status(200).json(populated);
  } catch (error) {
    console.error("Error in getCartProducts controller:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================================
// 2. ADD TO CART
// ==========================================
/**
 * Add a product to the user's cart or increment its quantity
 */
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const existingItem = user.cartItems.find((item) => {
      const id = item.product ? item.product.toString() : item.toString();
      return id === productId.toString();
    });

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      user.cartItems.push({
        product: productId,
        quantity: 1,
      });
    }

    await user.save();
    const populated = await getPopulatedCart(user.cartItems);
    return res.status(200).json(populated);
  } catch (error) {
    console.error("Error in addToCart controller:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================================
// 3. REMOVE FROM CART
// ==========================================
/**
 * Remove a specific item or clear the entire cart
 */
export const removeAllFromCart = async (req, res) => {
  try {
    const productId = req.params.id || req.body.productId;
    const user = req.user;

    if (!productId) {
      // Clear entire cart when no specific product ID is supplied
      user.cartItems = [];
    } else {
      // Filter out only the targeted product
      user.cartItems = user.cartItems.filter((item) => {
        const id = item.product ? item.product.toString() : item.toString();
        return id !== productId.toString();
      });
    }

    await user.save();
    const populated = await getPopulatedCart(user.cartItems);
    return res.status(200).json(populated);
  } catch (error) {
    console.error("Error in removeAllFromCart controller:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================================
// 4. UPDATE ITEM QUANTITY
// ==========================================
/**
 * Update the quantity for a specific product in the cart
 */
export const updateQuantity = async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;
    const user = req.user;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const existingItem = user.cartItems.find((item) => {
      const id = item.product ? item.product.toString() : item.toString();
      return id === productId.toString();
    });

    if (!existingItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      user.cartItems = user.cartItems.filter((item) => {
        const id = item.product ? item.product.toString() : item.toString();
        return id !== productId.toString();
      });
    } else {
      existingItem.quantity = quantity;
    }

    await user.save();
    const populated = await getPopulatedCart(user.cartItems);
    return res.status(200).json(populated);
  } catch (error) {
    console.error("Error in updateQuantity controller:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};