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
  updatebyUser
} from "../Controllers/userConroller.js"; // Correct case and folder path
import { isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

// Routes
router.post("/register", register); // Register a new user
router.post("/login", login); // User login
router.get("/logout", logout); // User logout, requires authentication
router.get("/my-profile",isAuthenticated, getMyProfile); // Fetch the current user's profile
router.get("/admins", getAdmins); // Get all admin users
router.get("/allusers", getUsers);
router.put("/userupdate/:userId", updateUser); // Update user (Only accessible by admin)
router.put("/user/:id", updatebyUser);     //   Profile Update by User
router.delete("/userdelete/:id", deleteUser); // Delete a user// Update user (Only accessible by admin)
router.get("/getsingleuserbyid/:userId", getSingleUserById); // Get a user by ID



export default router;
