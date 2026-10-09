import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, InputGroup, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";

// Each category links to /shop with a query string the Shop page reads
const categoryLinks = [
  { label: "Men", to: "/shop?category=Men" },
  { label: "Women", to: "/shop?category=Women" },
  { label: "Kids", to: "/shop?category=Kids" },
  { label: "Shoes", to: "/shop?category=Shoes" },
  { label: "Accessories", to: "/shop?category=Accessories" },
  { label: "New Arrivals", to: "/shop?filter=new" },
  { label: "Sale", to: "/shop?filter=sale", highlight: true },
];

function AppNavbar() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault(); // stop the browser's full page reload
    const query = term.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
  };
  const { itemCount, openDrawer } = useCart();

  return (
    <header className="site-header">
      <div className="site-header__top">
        <Container className="d-flex flex-wrap align-items-center gap-3 py-3">
          <Link to="/" className="brand">
            <i className="bi bi-bag-heart-fill me-2" aria-hidden="true"></i>
            AttireHub
          </Link>

          <div className="header-icons ms-auto order-2 order-md-3">
            <Link to="/login" aria-label="Account" className="header-icon">
              <i className="bi bi-person" aria-hidden="true"></i>
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="header-icon">
              <i className="bi bi-heart" aria-hidden="true"></i>
            </Link>
            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Open cart, ${itemCount} items`}
              className="header-icon header-icon--btn position-relative"
            >
              <i className="bi bi-bag" aria-hidden="true"></i>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>
      </div>

          <Form role="search" onSubmit={handleSearch} className="search-form order-3 order-md-2">
            <Form.Label htmlFor="site-search" className="visually-hidden">
              Search products
            </Form.Label>
            <InputGroup>
              <Form.Control
                id="site-search"
                type="search"
                placeholder="Search hoodies, jeans, black shirt..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
              <Button type="submit" className="btn-attire" aria-label="Search">
                <i className="bi bi-search" aria-hidden="true"></i>
              </Button>
            </InputGroup>
          </Form>
        </Container>
      </div>

      <nav className="category-nav" aria-label="Product categories">
        <Container>
          <ul className="category-list">
            {categoryLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className={link.highlight ? "text-sale" : ""}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  );
}

export default AppNavbar;