import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaPlusCircle,
  FaUsers,
  FaImages,
  FaClipboardList,
  FaStore,
  FaBars,
  FaTimes,
  FaShieldAlt,
  FaArrowRight,
  FaPhotoVideo,
} from "react-icons/fa";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthProvider";

// ==========================================
// LUXURY ADMIN SIDEBAR NAVIGATION
// Categorized, responsive command drawer for store administrators
// ==========================================
const DrawerMenu = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile } = useAuth();

  const navigationSections = [
    {
      title: "Core Overview",
      items: [
        {
          to: "/dashboard",
          label: "Executive Dashboard",
          icon: FaTachometerAlt,
          badge: "Live",
        },
      ],
    },
    {
      title: "Catalog & Stock",
      items: [
        { to: "/myproducts", label: "Inventory & Products", icon: FaBoxOpen },
        { to: "/createproduct", label: "Add New Product", icon: FaPlusCircle },
      ],
    },
    {
      title: "Orders & Sales",
      items: [
        { to: "/allorders", label: "Customer Orders", icon: FaClipboardList },
      ],
    },
    {
      title: "Customer Relations",
      items: [
        { to: "/alluser", label: "User Management", icon: FaUsers },
      ],
    },
    {
      title: "Marketing & Media",
      items: [
        { to: "/allbanners", label: "Hero Banners", icon: FaImages },
        { to: "/createbanner", label: "Add New Banner", icon: FaPhotoVideo },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-5 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300 border-r border-slate-800 shadow-2xl">
      <div className="overflow-y-auto pr-1 custom-scrollbar">
        {/* Admin Header & Brand */}
        <div className="pb-5 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <Logo size="small" light={false} />
            <div className="flex items-center space-x-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Admin Console
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/50"
            aria-label="Close admin menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* Admin User Chip */}
        {profile && (
          <div className="mt-4 p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center space-x-3">
            <img
              src={profile?.photo?.url || "https://ui-avatars.com/api/?name=Admin&background=f59e0b&color=0f172a"}
              alt={profile?.name || "Admin"}
              className="w-9 h-9 rounded-full object-cover border border-amber-400/40 shadow-xs"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{profile?.name || "Admin"}</p>
              <div className="flex items-center space-x-1 text-[10px] text-amber-400 font-medium">
                <FaShieldAlt className="text-[9px]" />
                <span className="capitalize">{profile?.role || "Administrator"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Grouped Navigation Links */}
        <nav className="mt-5 space-y-5">
          {navigationSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                {section.title}
              </span>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 font-extrabold translate-x-0.5"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`text-sm ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && !isActive && (
                      <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Footer: Back to Storefront */}
      <div className="pt-4 border-t border-slate-800 space-y-2 mt-4">
        <Link
          to="/"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-bold text-white transition hover:border-amber-400/40"
        >
          <span className="flex items-center space-x-2">
            <FaStore className="text-amber-400" />
            <span>Storefront Public View</span>
          </span>
          <FaArrowRight className="text-slate-400 text-[10px]" />
        </Link>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 py-1">
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Server Connected</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">v2.4</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Toggle Header */}
      <div className="md:hidden sticky top-0 z-30 bg-slate-950 text-white p-3.5 border-b border-slate-800 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2.5">
          <Logo size="small" light={false} />
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded">
            Console
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700"
          aria-label="Open sidebar menu"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Slide-in Drawer with Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fadeIn">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-[280px] w-full z-50 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 min-h-screen sticky top-0 h-screen">
        {sidebarContent}
      </aside>
    </>
  );
};

export default DrawerMenu;