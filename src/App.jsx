import { Routes, Route } from "react-router-dom";
import Landing from "./routes/Landing/Landing";
import Choose from "./routes/Login/Choose";
import User from "./routes/Login/User";
import Owner from "./routes/Login/Owner";
import SignUp from "./routes/SignUp";
import ForgotPassword from "./routes/ForgotPassword";
import Homepage from "./routes/Authenticated/Homepage/Homepage";
import Profile from "./routes/Authenticated/Profile/Profile";
import Shop from "./routes/Authenticated/Shop/Shop";
import ShopDetails from "./routes/Authenticated/Shop/ShopDetails";
import Products from "./routes/Authenticated/Products/Products";
import ProductDetails from "./routes/Authenticated/ProductDetails/ProductDetails";
import Cart from "./routes/Authenticated/Cart/Cart";
import NotFound from "./components/404";
import Navbar from "./components/Navbar";
import About from "./routes/Page/About";
import OwnerDashboard from "./routes/Owner/Dashboard/Dashboard";
import OwnerProducts from "./routes/Owner/Products/Products";
import OwnerOrders from "./routes/Owner/Orders/Orders";

import OwnerProfile from "./routes/Owner/Profile/Profile";
import OwnerNavbar from "./routes/Owner/components/OwnerNavbar";
import AdminLayout from "./routes/Admin/AdminLayout";
import AdminLogin from "./routes/Admin/Auth/Login";
import AdminDashboard from "./routes/Admin/Dashboard/Dashboard";
import AdminOwners from "./routes/Admin/Owners/OwnerManagement";
import AdminProducts from "./routes/Admin/Products/ProductManagement";
import AdminUsers from "./routes/Admin/Users/UserControl";
import AdminProfile from "./routes/Admin/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

export default function App() {
  return (
    <Routes>
      {/* Public Routes - Redirect to dashboard if already authenticated */}
      <Route path="/" element={<Landing />} />
      <Route element={<PublicOnlyRoute />}>
        <Route path="/choose" element={<Choose />} />
        <Route path="/login">
          <Route path="user" element={<User />} />
          <Route path="owner" element={<Owner />} />
        </Route>
        <Route path="/signup" element={<SignUp />}>
          <Route path=":type" element={<SignUp />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />}>
          <Route path=":type" element={<ForgotPassword />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      {/* User Routes - Require authenticated user */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route element={<Navbar />}>
          <Route path="/dashboard" element={<Homepage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ShopDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
      </Route>

      {/* Owner Routes - Require authenticated owner */}
      <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
        <Route path="/owner" element={<OwnerNavbar />}>
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="products" element={<OwnerProducts />} />
          <Route path="orders" element={<OwnerOrders />} />

          <Route path="profile" element={<OwnerProfile />} />
        </Route>
      </Route>

      {/* Admin Routes - Require authenticated admin */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="owners" element={<AdminOwners />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
