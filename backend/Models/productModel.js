import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product title is required"],
  },
  productImage: {
    public_id: {
      type: String,
      required: [true, "Image public ID is required"],
    },
    url: {
      type: String,
      required: [true, "Image URL is required"],
    },
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      photo: {
        type: String,
        required: false, // Make photo optional
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Product category is required"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    minlength: [20, "Description should contain at least 20 characters"],
    maxlength: [2000, "Description cannot exceed 2000 characters"],
  },
  adminName: {
    type: String,
    default: "Admin",
  },
  adminPhoto: {
    type: String,
    default: "defaultAdminPhoto.jpg",
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add text index for title and category for search optimization
productSchema.index({ title: "text", category: "text" });

export const Product = mongoose.model("Product", productSchema);