import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from 'react-hot-toast';
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthProvider";
import AllUser from "./pages/AllUser";
import UpdateUser from "./pages/UpdateUser";
import UpdateProfile from "./user/UpdateProfile";
import CreateProduct from "./Product/CreateProduct";
import BottomNavbar from "./components/BottomNavbar";
import MyProducts from "./Product/MyProducts";
import CreateBanner from "./BannerHome/CreateBanner";
import AllBanners from "./BannerHome/AllBanners";
import ProductDetails from "./Product/ProductDetail";
import GetAllProducts from "./Product/GetAllProducts";
import Loader from "./components/Loader";
import UpdateProduct from "./Product/UpdateProduct";
import CartItem from "./Pages/CartItems"
import Address from "./User/Address";
import Myorders from "./User/Myorders";
import AllOrders from "./Dashboard/AllOrders";
import UpdateOrder from "./Dashboard/UpdateOrder";
import GetReviews from "./Review/GetReviews";
import Men from "./Category/Men";
import Women from "./Category/Women";
import Kids from "./Category/Kids";
import Footwear from "./Category/Footwear";
import Beauty from "./Category/Beauty";
import Accessories from "./Category/Accessories";
import HomeKitchen from "./Category/homeandkitchen";
import PurchaseSuccessPage  from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import OrderSummary from "./components/OrderSummary";
import { useCartStore }   from "./Store/useCartStore";
import SearchResults from "./Search/SearchResults";


export default function App() {
  const { profile } = useAuth();
  
  const location = useLocation();

  const HideNavbarFooter = ["/login", "/register", "/reset-password/:token"].includes(location.pathname);

  return (
    <div className=''>
      {/* Render Navbar and BottomNavbar conditionally */}
      {!HideNavbarFooter && <Navbar />}
      {!HideNavbarFooter && <BottomNavbar />}
     

      {/* Routes */}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/alluser" element={<AllUser />} />
        <Route path="/update/:userId" element={<UpdateUser />} />
        <Route path="/updateprofile/:userId" element={<UpdateProfile />} />
        <Route path="/createproduct" element={<CreateProduct />} />
        <Route path="/myproducts" element={<MyProducts />} />
        <Route path="/createbanner" element={<CreateBanner />} />
        <Route path="/allbanners" element={<AllBanners />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/loader" element={<Loader />} />
        <Route path="/updateproduct/:productId" element={<UpdateProduct />} />
        <Route path="/cart" element={<CartItem />} />
        <Route path="/address" element={<Address />} />
        <Route path="/myorders/:id" element={<Myorders />} />
        <Route path="/allorders" element={<AllOrders />} />
        <Route path="/update-order/:orderId" element={<UpdateOrder />} />
        <Route path="/getreview/:id" element={<GetReviews />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/footwear" element={<Footwear />} />
        <Route path="/beauty" element={<Beauty />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/homeandkitchen" element={<HomeKitchen />} />
        <Route path="/purchase-cancel" element={<PurchaseCancelPage />} />
        <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
        <Route path="/ordersummary" element={<OrderSummary />} />
        <Route path="/usecartstore" element={<useCartStore />} />
        <Route path="/search" element={<SearchResults />} />
        

      

       
        
        
      </Routes>

      {/* Toaster notification */}
      <Toaster />

      {/* Render Footer conditionally */}
      {!HideNavbarFooter && <Footer />}
    </div>
  );
}