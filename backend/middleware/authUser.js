import { User } from "../Models/userModel.js";
import jwt from "jsonwebtoken";

// ==========================================
// 1. AUTHENTICATION MIDDLEWARE
// ==========================================
/**
 * Verify JWT cookie from incoming request and attach user instance
 */
export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Authentication required. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId || decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User account not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error.message);
    return res.status(401).json({ error: "Invalid or expired session. Please log in again." });
  }
};

// ==========================================
// 2. AUTHORIZATION MIDDLEWARE (ROLE CHECK)
// ==========================================
/**
 * Restrict access based on allowed user roles
 */
export const isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Role '${req.user?.role || "guest"}' is not authorized.`,
      });
    }
    next();
  };
};