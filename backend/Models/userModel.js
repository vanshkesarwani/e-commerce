import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken"; // Ensure jwt is imported
import crypto from "crypto"; // Import crypto module
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Load environment variables
dotenv.config();

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  photo: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user", // Default value for role
  },
  password: {
    type: String,
    required: true,
    select: false, // Prevent password from being included in query results by default
    minlength: 8,
  },
  cartItems:[
    {
        quantity:{
            type: Number,
            default: 1
        },
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    }
  ],
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified:{
    type:Boolean,
    default:false
},

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.STRIPE_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};// Create the User model based on the schema
export const User = mongoose.model("User", userSchema);