import { Outlet } from "react-router-dom";
import AnnouncementBar from "../components/AnnouncementBar";
import AppNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";

// Wraps every storefront page with the same top and bottom
function MainLayout() {
  return (
    <div className="app-shell">
      {/* First thing a keyboard user reaches: jumps past the header */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <AnnouncementBar />
      <AppNavbar />
      <main id="main-content" tabIndex={-1} className="app-main">
        {/* Outlet is where the current page (Home, Shop...) is drawn */}
        <Outlet />
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
}

export default MainLayout;