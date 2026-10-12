import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminUsers from "./admin/AdminUsers";

function App() {
  return (
    <Routes>
      {/* Storefront: wrapped by MainLayout */}
      <Route element={<MainLayout />}>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Pages that need a logged-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>

        {/* "*" matches anything not listed above, so it goes last */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin area: separate layout, ADMIN role required */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ComingSoon title="Products (next step)" />} />
          <Route path="/admin/inventory" element={<ComingSoon title="Inventory (next step)" />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;