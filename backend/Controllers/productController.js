import mongoose from "mongoose";
import { Product } from "../Models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import ApiFeatures from "../utils/apifeatures.js";

// ==========================================
// 1. CREATE PRODUCT (ADMIN)
// ==========================================
/**
 * Create a new product with image upload to Cloudinary
 */
export const createProduct = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const { productImage } = req.files;

    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(productImage.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only JPG, PNG, and WEBP are allowed",
      });
    }

    const { title, category, description, price, stock } = req.body;

    if (!title || !category || !description || !price || !stock) {
      return res.status(400).json({
        message: "Title, category, description, price, and stock are required fields",
      });
    }

    const adminName = req?.user?.name || "Admin";
    const adminPhoto = req?.user?.photo?.url || "defaultAdminPhoto.jpg";
    const createdBy = req?.user?._id;

    const cloudinaryResponse = await cloudinary.uploader.upload(
      productImage.tempFilePath,
      {
        folder: "products",
      }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary product upload error:", cloudinaryResponse?.error);
      return res.status(500).json({ message: "Error uploading image to Cloudinary" });
    }

    const productData = {
      title,
      category,
      description,
      price: Number(price),
      stock: Number(stock),
      adminName,
      adminPhoto,
      createdBy,
      productImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url || cloudinaryResponse.url,
      },
    };

    const product = await Product.create(productData);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

// ==========================================
// 2. DELETE PRODUCT (ADMIN)
// ==========================================
/**
 * Delete a product and its associated Cloudinary image
 */
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.productImage?.public_id) {
      await cloudinary.uploader.destroy(product.productImage.public_id);
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

// ==========================================
// 3. GET ALL PRODUCTS (WITH SEARCH & PAGINATION)
// ==========================================
/**
 * Retrieve all products with search, category filtering, and pagination
 */
export const getAllProducts = async (req, res) => {
  try {
    const resultPerPage = Number(req.query.limit) || 300;
    const productCount = await Product.countDocuments();

    // Query with search and filters applied
    const apifeature = new ApiFeatures(Product.find(), req.query).search().filter();
    const filteredProducts = await apifeature.query;
    const filteredProductCount = filteredProducts.length;

    // Apply pagination on separate query
    const paginatedApifeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);

    const products = await paginatedApifeature.query;

    res.status(200).json({
      success: true,
      products,
      productCount,
      resultPerPage,
      filteredProductCount,
    });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ==========================================
// 4. GET SINGLE PRODUCT DETAILS
// ==========================================
/**
 * Fetch a single product by ID
 */
export const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error: error.message });
  }
};

// ==========================================
// 5. GET PRODUCTS BY CATEGORY & RELATED PRODUCTS
// ==========================================
/**
 * Fetch product by ID and related products in same category
 */
export const getProductsByCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: id },
    }).limit(8);

    res.status(200).json({
      product,
      relatedProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching category products", error: error.message });
  }
};

// ==========================================
// 6. GET ADMIN'S PRODUCTS
// ==========================================
/**
 * Retrieve products created by the authenticated admin
 */
export const getMyProducts = async (req, res) => {
  try {
    const createdBy = req.user._id;
    let myProducts = await Product.find({ createdBy }).sort({ createdAt: -1 });

    // If no products explicitly match createdBy and user is an admin, return all catalog products
    if (myProducts.length === 0 && (req.user.role === "admin" || !req.user.role)) {
      myProducts = await Product.find().sort({ createdAt: -1 });
    }

    res.status(200).json(myProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin products", error: error.message });
  }
};

// ==========================================
// 7. UPDATE PRODUCT (ADMIN)
// ==========================================
/**
 * Update product details and optionally replace image
 */
export const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { title, price, stock, category, description } = req.body;

    if (title) product.title = title;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (category) product.category = category;
    if (description) product.description = description;

    if (req.files && req.files.productImage) {
      const { productImage } = req.files;
      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedFormats.includes(productImage.mimetype)) {
        return res.status(400).json({
          message: "Invalid image format. Only JPG, PNG, and WEBP are allowed.",
        });
      }

      if (product.productImage?.public_id) {
        await cloudinary.uploader.destroy(product.productImage.public_id);
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(
        productImage.tempFilePath,
        { folder: "products" }
      );

      product.productImage = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url || cloudinaryResponse.url,
      };
    }

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ==========================================
// 8. PRODUCT REVIEWS
// ==========================================
/**
 * Create or update a customer review for a product
 */
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    if (!rating || !comment || !productId) {
      return res.status(400).json({ message: "Rating, comment, and productId are required" });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      photo: req.user.photo?.url || "",
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = review.rating;
          rev.comment = review.comment;
          rev.photo = review.photo;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    const totalRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    product.ratings = Number((totalRating / product.reviews.length).toFixed(1));

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      productDetails: {
        id: product._id,
        title: product.title,
        price: product.price,
        ratings: product.ratings,
        numOfReviews: product.numOfReviews,
        reviews: product.reviews,
      },
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all reviews for a product
 */
export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate({
      path: "reviews.user",
      select: "name photo.url",
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviewsWithUserDetails = product.reviews.map((review) => {
      const userName = review.user ? review.user.name : review.name || "Anonymous";
      const userProfilePhotoUrl =
        review.user && review.user.photo ? review.user.photo.url : review.photo || "";

      return {
        ...review.toObject(),
        userName,
        userProfilePhotoUrl,
      };
    });

    res.status(200).json({
      success: true,
      reviews: reviewsWithUserDetails,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 9. SMART SEARCH PRODUCTS WITH SEMANTIC EXPANSION
// ==========================================
const CATEGORY_SYNONYMS = {
  Footwear: [
    "shoe", "shoes", "sneaker", "sneakers", "boot", "boots", "loafer",
    "loafers", "sandals", "heels", "footwear", "oxford", "slippers", "derby"
  ],
  Men: [
    "men", "mens", "man", "male", "boy", "blazer", "suit", "t-shirt",
    "shirt", "trouser", "tuxedo", "jacket"
  ],
  Women: [
    "women", "womens", "woman", "female", "girl", "dress", "saree",
    "kurti", "gown", "skirt", "top", "blouse"
  ],
  Kids: [
    "kid", "kids", "child", "children", "baby", "toddler", "toys", "infant"
  ],
  Beauty: [
    "beauty", "cosmetic", "cosmetics", "skincare", "skin", "makeup",
    "serum", "perfume", "fragrance", "lipstick", "cream", "moisturizer",
    "glow", "lotion", "oil"
  ],
  Accessories: [
    "accessory", "accessories", "watch", "watches", "bag", "bags",
    "handbag", "purse", "wallet", "sunglasses", "shades", "belt",
    "jewelry", "jewellery", "bracelet", "ring", "necklace", "tote"
  ],
  Home: [
    "home", "kitchen", "decor", "cushion", "lamp", "vase", "blanket",
    "curtain", "furniture", "rug", "table", "chair", "bedding", "ceramic"
  ],
};

const escapeRegex = (str) => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

/**
 * Search products by multi-token keywords, category synonyms, and relevance ranking
 */
export const searchProducts = async (req, res) => {
  try {
    const rawSearch = (req.query.keyword || req.query.query || req.query.q || "").trim();

    if (!rawSearch) {
      const products = await Product.find().sort({ createdAt: -1 }).limit(30);
      return res.status(200).json({
        success: true,
        keyword: "",
        count: products.length,
        products,
      });
    }

    const searchTokens = rawSearch
      .toLowerCase()
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Identify any matched categories from synonyms
    const matchedCategories = new Set();
    for (const [catName, synonyms] of Object.entries(CATEGORY_SYNONYMS)) {
      if (rawSearch.toLowerCase().includes(catName.toLowerCase())) {
        matchedCategories.add(catName);
      }
      for (const token of searchTokens) {
        if (
          synonyms.some(
            (s) =>
              s.toLowerCase() === token ||
              token.includes(s) ||
              s.includes(token)
          )
        ) {
          matchedCategories.add(catName);
        }
      }
    }

    // Build compound query:
    // 1. Direct whole-phrase match
    // 2. Any token match on title, category, description
    // 3. Matched categories
    const conditions = [];

    // Exact phrase
    const escapedPhrase = escapeRegex(rawSearch);
    conditions.push({ title: { $regex: escapedPhrase, $options: "i" } });
    conditions.push({ category: { $regex: escapedPhrase, $options: "i" } });
    conditions.push({ description: { $regex: escapedPhrase, $options: "i" } });

    // Individual tokens
    for (const token of searchTokens) {
      if (token.length >= 2) {
        const escaped = escapeRegex(token);
        conditions.push({ title: { $regex: escaped, $options: "i" } });
        conditions.push({ category: { $regex: escaped, $options: "i" } });
        conditions.push({ description: { $regex: escaped, $options: "i" } });
      }
    }

    // Category synonyms
    if (matchedCategories.size > 0) {
      conditions.push({ category: { $in: Array.from(matchedCategories) } });
    }

    const matchedProducts = await Product.find({ $or: conditions });

    // Relevance scoring
    const scoredProducts = matchedProducts.map((p) => {
      let score = 0;
      const titleLower = (p.title || "").toLowerCase();
      const descLower = (p.description || "").toLowerCase();
      const catLower = (p.category || "").toLowerCase();
      const searchLower = rawSearch.toLowerCase();

      // Exact title match gets huge score
      if (titleLower === searchLower) score += 100;
      else if (titleLower.includes(searchLower)) score += 60;

      // Category match
      if (catLower.includes(searchLower) || matchedCategories.has(p.category)) {
        score += 40;
      }

      // Check how many tokens match
      for (const token of searchTokens) {
        if (titleLower.includes(token)) score += 20;
        if (catLower.includes(token)) score += 15;
        if (descLower.includes(token)) score += 5;
      }

      return { product: p, score };
    });

    // Sort by highest score first, then newest
    scoredProducts.sort((a, b) => b.score - a.score);

    const sortedProducts = scoredProducts.map((sp) => sp.product);

    res.status(200).json({
      success: true,
      keyword: rawSearch,
      count: sortedProducts.length,
      matchedCategories: Array.from(matchedCategories),
      products: sortedProducts,
    });
  } catch (error) {
    console.error("Error in searchProducts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching search results",
      error: error.message,
    });
  }
};