import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context & Common Components
import { useAuth } from "./context/AuthProvider";
import Navbar from "./components/Navbar";
import BottomNavbar from "./components/BottomNavbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import OrderSummary from "./components/OrderSummary";
import ScrollToTop from "./components/ScrollToTop";
import BackToTopButton from "./components/BackToTopButton";

// Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import Profile from "./Pages/Profile";
import Dashboard from "./Pages/Dashboard";
import AllUser from "./Pages/AllUser";
import UpdateUser from "./Pages/UpdateUser";
import CartItem from "./Pages/CartItems";
import PurchaseSuccessPage from "./Pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./Pages/PurchaseCancelPage";
import Wishlist from "./Pages/Wishlist";
import WishlistDrawer from "./components/WishlistDrawer";

// User Components
import Address from "./User/Address";
import Myorders from "./User/Myorders";
import UpdateProfile from "./User/UpdateProfile";

// Product Components
import CreateProduct from "./Product/CreateProduct";
import MyProducts from "./Product/MyProducts";
import ProductDetails from "./Product/ProductDetail";
import GetAllProducts from "./Product/GetAllProducts";
import UpdateProduct from "./Product/UpdateProduct";

// Banner Components
import CreateBanner from "./BannerHome/CreateBanner";
import AllBanners from "./BannerHome/AllBanners";

// Dashboard Components
import AllOrders from "./Dashboard/AllOrders";
import UpdateOrder from "./Dashboard/UpdateOrder";

// Review & Search
import GetReviews from "./Review/GetReviews";
import SearchResults from "./Search/SearchResults";

// Category Pages
import Men from "./Category/Men";
import Women from "./Category/Women";
import Kids from "./Category/Kids";
import Footwear from "./Category/Footwear";
import Beauty from "./Category/Beauty";
import Accessories from "./Category/Accessories";
import HomeKitchen from "./Category/homeandkitchen";

// ==========================================
// MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  const { profile } = useAuth();
  const location = useLocation();

  // Hide navigation headers/footers on authentication screens
  const isAuthPage = [
    "/login",
    "/register",
    "/forgot",
    "/forgot-password",
    "/reset-password",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Route change automatic scroll to top */}
      <ScrollToTop />

      {/* Conditionally rendered navigation */}
      {!isAuthPage && <Navbar />}
      {!isAuthPage && <BottomNavbar />}

      {/* Primary Routing */}
      <main className="flex-grow">
        <Routes>
          {/* Public & Storefront Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/allproducts" element={<GetAllProducts />} />
          <Route path="/loader" element={<Loader />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Customer Account & Order Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/updateprofile/:userId" element={<UpdateProfile />} />
          <Route path="/cart" element={<CartItem />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/favourites" element={<Wishlist />} />
          <Route path="/address" element={<Address />} />
          <Route path="/ordersummary" element={<OrderSummary />} />
          <Route path="/myorders/:id" element={<Myorders />} />
          <Route path="/getreview/:id" element={<GetReviews />} />
          <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
          <Route path="/purchase-cancel" element={<PurchaseCancelPage />} />

          {/* Category Browsing Routes */}
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/footwear" element={<Footwear />} />
          <Route path="/beauty" element={<Beauty />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/homeandkitchen" element={<HomeKitchen />} />

          {/* Admin Dashboard & Management Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alluser" element={<AllUser />} />
          <Route path="/update/:userId" element={<UpdateUser />} />
          <Route path="/createproduct" element={<CreateProduct />} />
          <Route path="/myproducts" element={<MyProducts />} />
          <Route path="/updateproduct/:productId" element={<UpdateProduct />} />
          <Route path="/createbanner" element={<CreateBanner />} />
          <Route path="/allbanners" element={<AllBanners />} />
          <Route path="/allorders" element={<AllOrders />} />
          <Route path="/update-order/:orderId" element={<UpdateOrder />} />
        </Routes>
      </main>

      {/* Global Interactive Luxury Velura Toast Notification Container */}
      <Toaster
        position="top-right"
        gutter={12}
        containerStyle={{
          top: 24,
          right: 24,
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 3800,
          className: "velura-toast",
          style: {
            background: "linear-gradient(135deg, #0f172a 0%, #020617 100%)",
            color: "#f8fafc",
            border: "1px solid rgba(251, 191, 36, 0.35)",
            padding: "14px 20px",
            borderRadius: "18px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
            fontSize: "13px",
            fontWeight: "600",
            letterSpacing: "0.01em",
            backdropFilter: "blur(12px)",
            maxWidth: "420px",
            cursor: "pointer",
          },
          success: {
            duration: 3200,
            iconTheme: {
              primary: "#fbbf24", // Velvet Amber/Gold
              secondary: "#0f172a",
            },
            style: {
              border: "1px solid rgba(251, 191, 36, 0.5)",
              boxShadow:
                "0 10px 30px -5px rgba(245, 158, 11, 0.25), 0 20px 25px -5px rgba(0, 0, 0, 0.7)",
            },
          },
          error: {
            duration: 4500,
            iconTheme: {
              primary: "#f43f5e", // Rose
              secondary: "#0f172a",
            },
            style: {
              border: "1px solid rgba(244, 63, 94, 0.5)",
              boxShadow:
                "0 10px 30px -5px rgba(244, 63, 94, 0.25), 0 20px 25px -5px rgba(0, 0, 0, 0.7)",
            },
          },
          loading: {
            iconTheme: {
              primary: "#818cf8", // Indigo
              secondary: "#0f172a",
            },
            style: {
              border: "1px solid rgba(129, 140, 248, 0.4)",
              boxShadow:
                "0 10px 30px -5px rgba(129, 140, 248, 0.2), 0 20px 25px -5px rgba(0, 0, 0, 0.7)",
            },
          },
        }}
      />

      {/* Global Slide-Over Luxury Favourites / Wishlist Drawer */}
      <WishlistDrawer />

      {/* Floating scroll to top button for users navigating down pages */}
      <BackToTopButton />

      {/* Conditionally rendered footer */}
      {!isAuthPage && <Footer />}
    </div>
  );
}