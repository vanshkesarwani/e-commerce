import express from "express";
import {
  deleteUser,
  getAdmins,
  getMyProfile,
  getUsers,
  login,
  logout,
  getSingleUserById,
  updateUser,
  register,
  updatebyUser,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "../Controllers/userConroller.js";
import { isAuthenticated, isAdmin } from "../middleware/authUser.js";

const router = express.Router();

// ==========================================
// PUBLIC AUTHENTICATION ROUTES
// ==========================================
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Password recovery routes
router.post("/password/forgot", forgotPassword);
router.post("/forgot-password", forgotPassword);
router.get("/password/reset/verify/:token", verifyResetToken);
router.post("/password/reset/:token", resetPassword);
router.put("/password/reset/:token", resetPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/reset-password/:token", resetPassword);

// ==========================================
// USER PROFILE & ACCOUNT ROUTES
// ==========================================
router.get("/my-profile", isAuthenticated, getMyProfile);
router.put("/user/:userId", isAuthenticated, updatebyUser);
router.get("/getsingleuserbyid/:userId", getSingleUserById);

// ==========================================
// ADMIN USER MANAGEMENT ROUTES
// ==========================================
router.get("/admins", isAuthenticated, isAdmin("admin"), getAdmins);
router.get("/allusers", isAuthenticated, isAdmin("admin"), getUsers);
router.put("/userupdate/:userId", isAuthenticated, isAdmin("admin"), updateUser);
router.delete("/userdelete/:id", isAuthenticated, isAdmin("admin"), deleteUser);

export default router;
