import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

function PromoBanners() {
  return (
    <Container className="py-4">
      <div className="row g-4">
        <div className="col-md-6">
          <div className="promo promo--yellow">
            <p className="promo__eyebrow">New season</p>
            <h2 className="h3">Layer up in oversized hoodies</h2>
            <Link to="/shop?search=hoodie" className="btn btn-dark rounded-pill px-4">Shop hoodies</Link>
          </div>
        </div>
        <div className="col-md-6">
          <div className="promo promo--teal">
            <p className="promo__eyebrow">Little ones</p>
            <h2 className="h3">Playful picks for kids</h2>
            <Link to="/shop?category=Kids" className="btn btn-dark rounded-pill px-4">Shop kids</Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default PromoBanners;