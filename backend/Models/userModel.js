import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

// ==========================================
// USER SCHEMA DEFINITION
// ==========================================
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    phone: {
      type: Number,
      required: [true, "Please enter your phone number"],
      unique: true,
    },
    photo: {
      public_id: {
        type: String,
        default: "default_avatar",
      },
      url: {
        type: String,
        default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
      },
    },
    gender: {
      type: String,
      enum: ["men", "women", "all", "other"],
      default: "all",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    pincode: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      select: false, // Prevent password from being included in queries by default
      minlength: [8, "Password must be at least 8 characters long"],
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    token: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// ==========================================
// PRE-SAVE HOOK: PASSWORD HASHING
// ==========================================
userSchema.pre("save", async function (next) {
  // Only hash password if it has been modified or is new
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ==========================================
// INSTANCE METHODS
// ==========================================

/**
 * Generate JSON Web Token for authentication
 */
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

/**
 * Compare plain text password with hashed password in database
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate and hash password reset token
 */
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes validity

  return resetToken;
};

export const User = mongoose.model("User", userSchema);