import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Every route inside this one is wrapped by MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<ComingSoon title="Your Cart" />} />
        <Route path="/wishlist" element={<ComingSoon title="Your Wishlist" />} />
        <Route path="/login" element={<ComingSoon title="Log in" />} />
        <Route path="/register" element={<ComingSoon title="Create an account" />} />
        {/* "*" matches anything not listed above */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;