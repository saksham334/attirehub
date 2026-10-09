import { Outlet } from "react-router-dom";
import AnnouncementBar from "../components/AnnouncementBar";
import AppNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";

// Wraps every storefront page with the same top and bottom
function MainLayout() {
  return (
    <div className="app-shell">
      <AnnouncementBar />
      <AppNavbar />
      <main className="app-main">
        {/* Outlet is where the current page (Home, Shop...) is drawn */}
        <Outlet />
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
}

export default MainLayout;