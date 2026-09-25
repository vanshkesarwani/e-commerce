import { User } from "../Models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import createTokenAndSaveCookies from "../jwt/AuthToken.js";
import sendEmail from "../utils/sendEmail.js";

// ==========================================
// 1. USER REGISTRATION
// ==========================================
/**
 * Register a new user with profile photo upload
 * Note: Password hashing is automatically handled by the User schema pre-save hook.
 */
export const register = async (req, res) => {
  try {
    const { email, name, password, phone, gender, city, state, pincode, address, photoUrl } = req.body;

    // Validate required fields
    if (!email || !name || !password || !phone) {
      return res.status(400).json({ message: "Please fill all required fields (Name, Email, Phone, Password)" });
    }

    // Check for existing user by email or phone
    const existingEmail = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const existingPhone = await User.findOne({ phone: Number(phone) });
    if (existingPhone) {
      return res.status(400).json({ message: "User already exists with this phone number" });
    }

    let photoData = {
      public_id: "default_avatar",
      url: photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=6366f1&color=fff&size=256`,
    };

    // If an image file was provided, upload to Cloudinary
    if (req.files && req.files.photo) {
      const { photo } = req.files;
      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedFormats.includes(photo.mimetype)) {
        return res.status(400).json({
          message: "Invalid photo format. Only JPG, PNG, and WEBP are allowed",
        });
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath, {
        folder: "users",
      });

      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary upload error:", cloudinaryResponse?.error);
        return res.status(500).json({ message: "Photo upload failed" });
      }

      photoData = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url || cloudinaryResponse.url,
      };
    }

    // Create user instance (password will be hashed in userModel pre-save hook)
    const newUser = new User({
      email: email.trim().toLowerCase(),
      name: name.trim(),
      password,
      phone: Number(phone),
      photo: photoData,
      gender: gender || "all",
      city: city ? city.trim() : "",
      state: state ? state.trim() : "",
      pincode: pincode ? pincode.trim() : "",
      address: address ? address.trim() : "",
    });

    await newUser.save();

    // Generate JWT cookie and send response
    const token = await createTokenAndSaveCookies(newUser._id, res);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        photo: newUser.photo,
        gender: newUser.gender,
        city: newUser.city,
        state: newUser.state,
        pincode: newUser.pincode,
        address: newUser.address,
        createdAt: newUser.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ==========================================
// 2. USER LOGIN
// ==========================================
/**
 * Authenticate user and issue JWT cookie
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Explicitly select password field for verification
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await createTokenAndSaveCookies(user._id, res);

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        photo: user.photo,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Error in user login:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ==========================================
// 3. USER LOGOUT
// ==========================================
/**
 * Clear authentication cookie
 */
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in user logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ==========================================
// 4. USER PROFILES & DIRECTORY
// ==========================================
/**
 * Get current authenticated user's profile
 */
export const getMyProfile = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

/**
 * Get all administrators
 */
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    return res.status(200).json({ admins });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch admins", error: error.message });
  }
};

/**
 * Get all registered users (Admin only)
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

/**
 * Get single user by ID
 */
export const getSingleUserById = async (req, res) => {
  try {
    const userId = req.params.userId || req.params.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        photo: user.photo,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ==========================================
// 5. PROFILE UPDATES & MANAGEMENT
// ==========================================
/**
 * Update user's own profile
 */
export const updatebyUser = async (req, res) => {
  const userId = req.params.userId || req.params.id;
  const { name, email, phone, role } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent non-admin users from altering their role
    if (role && (!req.user || req.user.role !== "admin")) {
      return res.status(403).json({ message: "Permission denied: Only admins can change user roles" });
    }

    // Handle photo replacement if provided
    if (req.files && req.files.photo) {
      const { photo } = req.files;
      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedFormats.includes(photo.mimetype)) {
        return res.status(400).json({
          message: "Invalid photo format. Only JPG, PNG, and WEBP are allowed",
        });
      }

      if (user.photo?.public_id) {
        await cloudinary.uploader.destroy(user.photo.public_id);
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath, {
        folder: "users",
      });

      user.photo = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url || cloudinaryResponse.url,
      };
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role && req.user?.role === "admin") user.role = role;

    await user.save();

    return res.status(200).json({
      message: "User profile updated successfully",
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error("Error in updatebyUser:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/**
 * Update user profile (Admin management)
 */
export const updateUser = async (req, res) => {
  const userId = req.params.userId || req.params.id;
  const { name, email, phone, role } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.files && req.files.photo) {
      const { photo } = req.files;
      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedFormats.includes(photo.mimetype)) {
        return res.status(400).json({
          message: "Invalid photo format. Only JPG, PNG, and WEBP are allowed",
        });
      }

      if (user.photo?.public_id) {
        await cloudinary.uploader.destroy(user.photo.public_id);
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath, {
        folder: "users",
      });

      user.photo = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url || cloudinaryResponse.url,
      };
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;

    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.photo?.public_id) {
      await cloudinary.uploader.destroy(user.photo.public_id);
    }

    await user.deleteOne();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ==========================================
// 6. FORGOT & RESET PASSWORD CONTROLLERS
// ==========================================

/**
 * Initiate password reset: generates reset token and emails the user
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Please enter your email address" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "No account found with that email address" });
    }

    // Generate reset token and set expiry on user model
    const resetToken = user.getResetPasswordToken();

    // Save token without re-running full schema validations
    await user.save({ validateBeforeSave: false });

    // Build reset link using frontend application URL
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetPasswordUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `Hello ${user.name},\n\nYou requested a password reset for your Velura account.\nPlease click the link below to set a new password:\n\n${resetPasswordUrl}\n\nThis link will expire in 15 minutes.\nIf you did not request this, please ignore this email.`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
        <div style="background: linear-gradient(135deg, #020617 0%, #0f172a 100%); padding: 36px 30px; text-align: center; border-bottom: 1px solid #1e293b;">
          <h1 style="color: #fbbf24; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">VELURA</h1>
          <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">Curated Luxury & Elegance</p>
        </div>
        <div style="padding: 36px 32px; background-color: #0b0f19;">
          <h2 style="color: #ffffff; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Password Reset Request</h2>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            Hello <strong>${user.name}</strong>,<br/><br/>
            We received a request to reset the password for your Velura account. Click the button below to choose a new password:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetPasswordUrl}" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
              Reset My Password
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin-top: 24px;">
            Or copy and paste this link into your browser:<br/>
            <a href="${resetPasswordUrl}" style="color: #60a5fa; word-break: break-all;">${resetPasswordUrl}</a>
          </p>
          <div style="margin-top: 28px; padding: 14px 18px; background-color: rgba(251, 191, 36, 0.1); border-left: 4px solid #fbbf24; border-radius: 6px;">
            <p style="color: #fef08a; font-size: 13px; margin: 0; line-height: 1.4;">
              ⏳ This link is valid for <strong>15 minutes</strong>. If you did not make this request, you can safely ignore this email.
            </p>
          </div>
        </div>
        <div style="background-color: #030712; padding: 20px 30px; text-align: center; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Velura. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Velura - Password Reset Request",
        message,
        html: htmlContent,
      });

      return res.status(200).json({
        success: true,
        message: `Password reset email sent to ${user.email}`,
        resetToken: process.env.NODE_ENV !== "production" ? resetToken : undefined,
      });
    } catch (emailError) {
      // Rollback reset token if email delivery fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      console.error("Error sending password reset email:", emailError);
      return res.status(500).json({
        success: false,
        message: "Email delivery failed. Please check SMTP settings or try again.",
      });
    }
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/**
 * Verify whether a reset token is valid and not expired
 */
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset link is invalid or has expired.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token is valid",
      email: user.email,
    });
  } catch (error) {
    console.error("Error verifying reset token:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/**
 * Reset password using valid token
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Reset token is missing" });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Please provide both new password and confirm password" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Password reset link is invalid or has expired. Please request a new one.",
      });
    }

    // Set new password (pre-save hook will hash it)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Authenticate user directly and return token
    const authToken = await createTokenAndSaveCookies(user._id, res);

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully! You are now logged in.",
      token: authToken,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};