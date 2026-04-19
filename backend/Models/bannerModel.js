import mongoose from 'mongoose';

// Define the Banner schema
const bannerSchema = new mongoose.Schema(
  {
    bannerImage: {
      public_id: {
        type: String,
        required: [true, "Image public ID is required"],
      },
      url: {
        type: String,
        required: [true, "Image URL is required"],
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create and export the Banner model
const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;