import mongoose from "mongoose";

// ==========================================
// PRODUCT SCHEMA DEFINITION
// ==========================================
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
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
      max: [99999999, "Price cannot exceed 8 digits"],
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      default: 1,
      min: [0, "Stock cannot be negative"],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        photo: {
          type: String,
          default: "",
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [10, "Description should contain at least 10 characters"],
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search optimization text indexes
productSchema.index({ title: "text", category: "text", description: "text" });

export const Product = mongoose.model("Product", productSchema);