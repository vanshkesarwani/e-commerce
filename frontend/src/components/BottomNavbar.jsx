import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaMale,
  FaFemale,
  FaChild,
  FaShoePrints,
  FaGem,
  FaHome,
  FaFire,
} from "react-icons/fa";
import { GiLipstick } from "react-icons/gi";

// ==========================================
// SLEEK MODERN CATEGORY PILL STRIP: VELURA
// ==========================================
const categories = [
  { to: "/", text: "ALL PRODUCTS", icon: FaFire },
  { to: "/men", text: "MEN", icon: FaMale },
  { to: "/women", text: "WOMEN", icon: FaFemale },
  { to: "/kids", text: "KIDS", icon: FaChild },
  { to: "/footwear", text: "FOOTWEAR", icon: FaShoePrints },
  { to: "/beauty", text: "BEAUTY", icon: GiLipstick },
  { to: "/accessories", text: "ACCESSORIES", icon: FaGem },
  { to: "/homeandkitchen", text: "HOME & LIVING", icon: FaHome },
];

const BottomNavbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs relative md:sticky md:top-20 z-30 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <div className="flex items-center overflow-x-auto no-scrollbar py-2 sm:py-2.5 space-x-1 sm:space-x-2 justify-start md:justify-center">
          {categories.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.text}
                to={item.to}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm scale-105"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                }`}
              >
                <Icon
                  className={`text-xs transition-colors ${
                    isActive ? "text-amber-400" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span>{item.text}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar;
