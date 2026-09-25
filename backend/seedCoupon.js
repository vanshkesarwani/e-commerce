import mongoose from "mongoose";
import dotenv from "dotenv";
import Coupon from "./Models/couponModel.js";

dotenv.config({ path: "./.env" });

async function seedCoupon() {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb+srv://Cluster0:KX6ppDBHpoPO0SQb@cluster0.jppvflk.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for coupon seeding...");

    // Expiration date: 1 year from now
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    // Upsert VELURA20
    const existing = await Coupon.findOne({ code: "VELURA20" });
    if (existing) {
      existing.discountPercentage = 20;
      existing.isActive = true;
      existing.expirationDate = nextYear;
      await existing.save();
      console.log("Updated active coupon VELURA20 (20% discount, expires next year)");
    } else {
      await Coupon.create({
        code: "VELURA20",
        discountPercentage: 20,
        expirationDate: nextYear,
        isActive: true,
      });
      console.log("Created new active coupon VELURA20 (20% discount, expires next year)");
    }

    const allCoupons = await Coupon.find();
    console.log("All active coupons in database:", allCoupons.map((c) => ({ code: c.code, discount: c.discountPercentage + "%" })));

    await mongoose.disconnect();
    console.log("Coupon seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Coupon seeding failed:", error);
    process.exit(1);
  }
}

seedCoupon();
