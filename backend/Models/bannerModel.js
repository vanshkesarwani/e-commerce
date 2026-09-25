import mongoose from "mongoose";

// ==========================================
// BANNER SCHEMA DEFINITION
// ==========================================
const bannerSchema = new mongoose.Schema(
  {
    bannerImage: {
      public_id: {
        type: String,
        required: [true, "Banner image public ID is required"],
      },
      url: {
        type: String,
        required: [true, "Banner image URL is required"],
      },
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    link: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;