import mongoose from "mongoose";
import { Product } from "../Models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import ApiFeatures from "../utils/apifeatures.js"

export const createProduct = async (req, res) => {
  try {
    // Check if an image file is provided
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const { productImage } = req.files;

    // Validate image format
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(productImage.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only jpg, png, and webp are allowed",
      });
    }

    // Extract product details from the request body
    const { title, category, description, price, stock } = req.body;

    if (!title || !category || !description || !price || !stock) {
      return res.status(400).json({
        message: "Title, category, description, price, and stock are required fields",
      });
    }

    // Fetch admin details from the authenticated user
    const adminName = req?.user?.name || "Admin";
    const adminPhoto = req?.user?.photo?.url || "defaultAdminPhoto.jpg";
    const createdBy = req?.user?._id;

    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      productImage.tempFilePath,
      {
        folder: "products",
      }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
      return res.status(500).json({ message: "Error uploading image" });
    }

    // Prepare product data
    const productData = {
      title,
      category,
      description,
      price,
      stock,
      adminName,
      adminPhoto,
      createdBy,
      productImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      },
    };

    // Save product to the database
    const product = await Product.create(productData);

    // Respond with success message
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.deleteOne();
  res.status(200).json({ message: "Product deleted successfully" });
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const resultPerPage = 80;
    const productCount = await Product.countDocuments();

    // Apply search and filter separately
    const apifeature = new ApiFeatures(Product.find(), req.query).search().filter();
    const filteredProductsQuery = apifeature.query;

    // Execute search and filter query to get the count
    const filteredProducts = await filteredProductsQuery;
    const filteredProductCount = filteredProducts.length;

    // Apply pagination on a new query
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
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// Get Single Product
export const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
};


// get product by id then category
// Get Product by Category
export const getProductsByCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }

  // Find the product by its ID
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Find other products in the same category
  const productsInSameCategory = await Product.find({ 
    category: product.category, 
    _id: { $ne: id } // Exclude the current product
  });

  res.status(200).json({
    product,
    relatedProducts: productsInSameCategory,
  });
};

// Get My Products
export const getMyProducts = async (req, res) => {
  const createdBy = req.user._id;

  const myProducts = await Product.find({ createdBy });
  res.status(200).json(myProducts);
};

// Update Product
export const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }

  try {
    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update specified fields if provided in req.body
    const { title, price, stock, category, description } = req.body;

    if (title) product.title = title;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;
    if (description) product.description = description;

    // Handle product image update if provided
    if (req.files && req.files.productImage) {
      const { productImage } = req.files;

      // Validate image format
      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedFormats.includes(productImage.mimetype)) {
        return res.status(400).json({
          message: "Invalid image format. Only JPG, PNG, and WEBP are allowed.",
        });
      }

      // Upload new image to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(
        productImage.tempFilePath
      );

      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(cloudinaryResponse.error);
        return res.status(500).json({ message: "Failed to upload image" });
      }

      // Delete old image from Cloudinary if exists
      if (product.productImage?.public_id) {
        await cloudinary.uploader.destroy(product.productImage.public_id);
      }

      // Update product image details
      product.productImage = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      };
    }

    // Save the updated product
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




// Create or Update a Product Review
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      photo: req.user.photo.url, // Store the user's photo URL in the review
      rating: Number(rating),
      comment,
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
          rev.photo = review.photo; // Update the photo URL if it changes
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    // Calculate average rating
    const totalRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    product.ratings = totalRating / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Review added/updated successfully",
      productDetails: {
        id: product._id,
        name: product.name,
        price: product.price,
        ratings: product.ratings,
        numOfReviews: product.numOfReviews,
        reviews: product.reviews,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params; // Extract the product ID from the route parameter

    // Fetch the product and populate the 'user' field in reviews with 'name' and 'photo.url'
    const product = await Product.findById(id).populate({
      path: 'reviews.user',  // Populate the 'user' field in the review
      select: 'name photo.url', // Fetch 'name' and 'photo.url' of the user
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Map over the reviews to include the user's name and photo URL
    const reviewsWithUserDetails = product.reviews.map((review) => {
      const userName = review.user ? review.user.name : 'Anonymous'; // Fallback if user is null
      const userProfilePhotoUrl = review.user && review.user.photo ? review.user.photo.url : ''; // Fallback if photo is null

      return {
        ...review.toObject(),
        userName,
        userProfilePhotoUrl, // Add the user's profile photo URL
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


// Controller to handle product search by title and description
export const searchProducts = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { category: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  try {
    const products = await Product.find({ ...keyword });
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching search results',
    });
  }
};