import { User } from "../Models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookies from "../jwt/AuthToken.js";

export const register = async (req, res) => {
  try {
    // Ensure the user has uploaded a photo
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "User photo is required" });
    }
    const { photo } = req.files;

    // Check for allowed photo formats
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(photo.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only jpg, png, and webp are allowed",
      });
    }

    // Extract user data from request body
    const { email, name, password, phone, } = req.body;

    // Ensure all required fields are provided
    if (!email || !name || !password || !phone) {
      return res.status(400).json({ message: "Please fill required fields" });
    }

    // Check if user already exists with the provided email or phone
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this Phone Number" });
    }

    // Upload photo to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
      return res.status(500).json({ message: "Photo upload failed" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      phone,
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      },
    });

    // Save the new user to the database
    await newUser.save();

    // If user is created, generate a token and send a response
    const token = await createTokenAndSaveCookies(newUser._id, res);
    console.log("Signup: ", token);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role, // Role will default to "user"
        photo: newUser.photo.url,
        createdAt: newUser.createdAt,
      },
      token,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill required fields" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = await createTokenAndSaveCookies(user._id, res);
    console.log("Login: ", token);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server error" });
  }
};

export const getMyProfile = async (req, res) => {
  const user = req.user;
  res.status(200).json({ user });
};

export const getAdmins = async (req, res) => {
  const admins = await User.find({ role: "admin" });
  res.status(200).json({ admins });
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: " Error Fatching Users"})
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await user.deleteOne();
  res.status(200).json({ message: "User deleted successfully" });
};


// only User can Chnage this 
export const updatebyUser = async (req, res) => {
  const { userId } = req.params;  // Get userId from params
  const { name, email, phone, role } = req.body;  // Extract updated info from body
  
  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow role update if the user is an admin
    if (role && req.user.role !== "admin") {
      return res.status(403).json({ message: "Permission denied: Only admin can change role" });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;  // Update the user's role

    // Save the updated user to the database
    await user.save();

    res.status(200).json({
      message: "User Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server error" });
  }
};

// Only admin can change this 

export const updateUser = async (req, res) => {
  const { userId } = req.params; // Get userId from params
  const { name, email, phone, role } = req.body; // Extract updated info from body

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profile image if a new one is uploaded
    if (req.files && req.files.photo) {
      const { photo } = req.files;

      // Validate photo format
      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedFormats.includes(photo.mimetype)) {
        return res.status(400).json({
          message: "Invalid photo format. Only jpg, png, and webp are allowed",
        });
      }

      // Delete old photo from Cloudinary if it exists
      if (user.photo && user.photo.public_id) {
        await cloudinary.uploader.destroy(user.photo.public_id);
      }

      // Upload new photo to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return res.status(500).json({ message: "Photo upload failed" });
      }

      // Update user photo details
      user.photo = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      };
    }

    // Update other user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Role update is NOT allowed
    if (role) {
      return res.status(400).json({
        message: "Updating the role is not allowed",
      });
    }

    // Save the updated user to the database
    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: user.photo.url,
        role: user.role, // Role remains unchanged
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch single user by ID
export const getSingleUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user by ID from the database
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user data as a response
    return res.status(200).json({
      message: "User fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server error" });
  }
};