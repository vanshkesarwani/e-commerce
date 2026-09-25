import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";

import { autoSeedDefaults } from "./utils/autoSeed.js";

// Route imports
import userRoute from "./Routes/userRoute.js";
import productRoute from "./Routes/productRoute.js";
import bannerRoute from "./Routes/bannerRoute.js";
import cartRoute from "./Routes/cartRoute.js";
import orderRoute from "./Routes/orderRoute.js";
import couponRoute from "./Routes/couponRoute.js";
import dashboardRoute from "./Routes/dashboardRoute.js";

// ==========================================
// 1. CONFIGURATION & ENVIRONMENT SETUP
// ==========================================
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3900;
const MONGO_URL = process.env.MONGO_URI;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// ==========================================
// 2. CORE MIDDLEWARES
// ==========================================
app.use(express.json());
app.use(cookieParser());

// Dynamic CORS configuration supporting primary frontend and fallback ports
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback permissive for local dev
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// File upload middleware with temporary storage
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ==========================================
// 3. DATABASE CONNECTION
// ==========================================
const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce";
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected successfully to MongoDB:", uri.includes("127.0.0.1") ? "Local MongoDB (ecommerce)" : "MongoDB Atlas (ecommerce)");
    await autoSeedDefaults();
  } catch (error) {
    console.error("Primary MongoDB connection error, attempting fallback to local MongoDB:", error.message);
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
      console.log("Connected successfully to fallback local MongoDB (ecommerce)");
      await autoSeedDefaults();
    } catch (localErr) {
      console.error("Fallback MongoDB connection error:", localErr.message);
    }
  }
};
connectDB();

// ==========================================
// 4. API ROUTE MOUNTING
// ==========================================
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/banner", bannerRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/dashboard", dashboardRoute);

// Base root and health check routes
app.get("/", (req, res) => {
  res.status(200).json({ status: "active", name: "Velura E-Commerce API", version: "1.0.0" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 Unhandled API route fallback
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route '${req.originalUrl}' not found`,
  });
});

// Global Production Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Wrong Mongoose Object ID Error (CastError)
  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    return res.status(400).json({ success: false, message });
  }

  // Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    message = `Duplicate ${Object.keys(err.keyValue || {})} entered`;
    return res.status(400).json({ success: false, message });
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    message = "JSON Web Token is invalid. Try logging in again";
    return res.status(401).json({ success: false, message });
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    message = "JSON Web Token is expired. Please log in again";
    return res.status(401).json({ success: false, message });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// ==========================================
// 5. SERVER INITIALIZATION
// ==========================================
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;