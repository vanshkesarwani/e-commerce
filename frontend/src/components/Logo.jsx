import React from "react";
import { Link } from "react-router-dom";

// ==========================================
// UNIQUE VECTOR BRAND LOGO COMPONENT: VELURA
// ==========================================
const Logo = ({ size = "default", light = false, withTagline = true, to = "/" }) => {
  const isSmall = size === "small";
  const isLarge = size === "large";

  const iconSizes = isSmall
    ? "w-8 h-8 text-sm"
    : isLarge
    ? "w-14 h-14 text-2xl"
    : "w-10 h-10 text-lg";

  const titleSizes = isSmall
    ? "text-lg"
    : isLarge
    ? "text-3xl"
    : "text-xl";

  const logoContent = (
    <div className="flex items-center space-x-3 group select-none">
      {/* Stylized Modern Monogram Emblem */}
      <div
        className={`${iconSizes} rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-indigo-600 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/40 group-hover:scale-105 transition-all duration-300 relative overflow-hidden`}
      >
        {/* Subtle geometric light reflection */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/30" />
        
        {/* Custom SVG Monogram */}
        <svg
          className="w-3/5 h-3/5 text-slate-950 font-black relative z-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4l8 16L20 4" />
          <path d="M8 4l4 8 4-8" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Brand Name Typography */}
      <div>
        <span
          className={`${titleSizes} font-black tracking-tight leading-none ${
            light ? "text-slate-900" : "text-white"
          }`}
        >
          VELURA
        </span>
        {withTagline && (
          <span
            className={`block text-[9px] uppercase tracking-[0.25em] font-bold ${
              light ? "text-slate-500" : "text-slate-400"
            }`}
          >
            STUDIO & CO.
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{logoContent}</Link>;
  }

  return logoContent;
};

export default Logo;
