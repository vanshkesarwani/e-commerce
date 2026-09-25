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

// Dynamic CORS configuration supporting primary frontend, vercel previews, and fallback ports
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed list, localhost, or any vercel.app deployment
    if (
      allowedOrigins.includes(origin) ||
      origin.includes("localhost") ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive fallback for all clients
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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
let isConnected = false;
let isSeeded = false;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce";
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    isConnected = true;
    console.log("Connected successfully to MongoDB:", uri.includes("127.0.0.1") ? "Local MongoDB (ecommerce)" : "MongoDB Atlas (ecommerce)");
    if (!isSeeded) {
      isSeeded = true;
      autoSeedDefaults().catch((err) => console.error("AutoSeed failed:", err.message));
    }
  } catch (error) {
    console.error("Primary MongoDB connection error, attempting fallback:", error.message);
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce", { serverSelectionTimeoutMS: 3000 });
      isConnected = true;
      console.log("Connected successfully to fallback local MongoDB (ecommerce)");
      if (!isSeeded) {
        isSeeded = true;
        autoSeedDefaults().catch((err) => console.error("AutoSeed failed:", err.message));
      }
    } catch (localErr) {
      console.error("Fallback MongoDB connection error:", localErr.message);
    }
  }
};

// Immediate connection attempt
connectDB();

// Middleware ensuring DB connection before processing API routes
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState < 1) {
    await connectDB();
  }
  next();
});

// ==========================================
// 4. API ROUTE MOUNTING
// ==========================================
const apiRoutes = [
  { path: "/users", handler: userRoute },
  { path: "/products", handler: productRoute },
  { path: "/banner", handler: bannerRoute },
  { path: "/cart", handler: cartRoute },
  { path: "/order", handler: orderRoute },
  { path: "/coupon", handler: couponRoute },
  { path: "/dashboard", handler: dashboardRoute },
];

apiRoutes.forEach(({ path, handler }) => {
  app.use(`/api${path}`, handler);
  app.use(path, handler);
});

// Base root and health check routes
app.get(["/", "/api", "/health", "/api/health"], (req, res) => {
  res.status(200).json({ status: "active", name: "Velura E-Commerce API", version: "1.0.0" });
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
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;