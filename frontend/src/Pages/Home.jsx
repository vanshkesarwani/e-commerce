import React from "react";
import { Link } from "react-router-dom";
import HomeBanner from "../BannerHome/HomeBanner";
import GetAllProducts from "../Product/GetAllProducts";
import {
  FaMale,
  FaFemale,
  FaChild,
  FaShoePrints,
  FaGem,
  FaHome,
} from "react-icons/fa";
import { GiLipstick } from "react-icons/gi";

// ==========================================
// FEATURED CATEGORY QUICK SELECTORS
// ==========================================
const featuredCategories = [
  {
    name: "Men",
    path: "/men",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=400&auto=format&fit=crop",
    icon: FaMale,
  },
  {
    name: "Women",
    path: "/women",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop",
    icon: FaFemale,
  },
  {
    name: "Footwear",
    path: "/footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400&auto=format&fit=crop",
    icon: FaShoePrints,
  },
  {
    name: "Beauty",
    path: "/beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&auto=format&fit=crop",
    icon: GiLipstick,
  },
  {
    name: "Accessories",
    path: "/accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
    icon: FaGem,
  },
  {
    name: "Home & Living",
    path: "/homeandkitchen",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=400&auto=format&fit=crop",
    icon: FaHome,
  },
  {
    name: "Kids",
    path: "/kids",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400&auto=format&fit=crop",
    icon: FaChild,
  },
];

// ==========================================
// HOMEPAGE COMPONENT
// ==========================================
const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Hero Carousel */}
      <HomeBanner />

      {/* 2. Visual Categories Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find curated essentials tailored for every style and occasion
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {featuredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={cat.path}
                className="group relative flex flex-col items-center bg-white rounded-2xl p-3 border border-slate-200 shadow-sm hover:shadow-card-hover hover:border-indigo-500 transition-all duration-300"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 ring-2 ring-slate-100 group-hover:ring-indigo-400 transition">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 text-center tracking-wide">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Product Catalog Grid */}
      <section className="border-t border-slate-200/80 bg-slate-50/50">
        <GetAllProducts />
      </section>
    </div>
  );
};

export default Home;