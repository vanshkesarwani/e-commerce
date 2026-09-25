import { Banner } from "../Models/bannerModel.js";
import { Coupon } from "../Models/couponModel.js";

/**
 * Default promotional hero banners
 */
const DEFAULT_BANNERS = [
  {
    bannerImage: {
      public_id: "seed_hero_women",
      url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
    },
    title: "Elevate Your Style - New Season Luxury Arrivals",
    link: "/women",
  },
  {
    bannerImage: {
      public_id: "seed_hero_footwear",
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop",
    },
    title: "Sophisticated Footwear - Handcrafted Comfort",
    link: "/footwear",
  },
  {
    bannerImage: {
      public_id: "seed_hero_home",
      url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop",
    },
    title: "Modern Living & Decor - Minimal Aesthetic Craftsmanship",
    link: "/homeandkitchen",
  },
  {
    bannerImage: {
      public_id: "seed_hero_men",
      url: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=1600&auto=format&fit=crop",
    },
    title: "Bespoke Menswear - Tailored Precision & Refinement",
    link: "/men",
  },
];

/**
 * Default promotional discount coupons
 */
const DEFAULT_COUPONS = [
  {
    code: "VELURA20",
    discountPercentage: 20,
    isActive: true,
  },
  {
    code: "WELCOME10",
    discountPercentage: 10,
    isActive: true,
  },
  {
    code: "LUXE15",
    discountPercentage: 15,
    isActive: true,
  },
  {
    code: "FESTIVE25",
    discountPercentage: 25,
    isActive: true,
  },
];

/**
 * Automatically ensures default promotional banners and coupons exist in the database.
 * Executes automatically upon server database connection.
 */
export const autoSeedDefaults = async () => {
  try {
    // 1. Seed Banners if none exist
    const bannerCount = await Banner.countDocuments();
    if (bannerCount === 0) {
      await Banner.insertMany(DEFAULT_BANNERS);
      console.log(`[AutoSeed] Successfully populated ${DEFAULT_BANNERS.length} hero promotional banners into MongoDB.`);
    } else {
      console.log(`[AutoSeed] Verified existing banners in database (${bannerCount} active).`);
    }

    // 2. Seed Coupons if missing or empty
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 2);

    for (const coup of DEFAULT_COUPONS) {
      await Coupon.updateOne(
        { code: coup.code },
        {
          $setOnInsert: {
            code: coup.code,
            discountPercentage: coup.discountPercentage,
            expirationDate: nextYear,
            isActive: coup.isActive,
          },
        },
        { upsert: true }
      );
    }

    const totalCoupons = await Coupon.countDocuments({ isActive: true });
    console.log(`[AutoSeed] Verified promotional discount coupons in database (${totalCoupons} active coupons).`);
  } catch (error) {
    console.error("[AutoSeed] Notice: Automatic seeding check encountered an issue:", error.message);
  }
};

export default autoSeedDefaults;
