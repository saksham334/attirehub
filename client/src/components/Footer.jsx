import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <Row className="g-4 py-5">
          <Col md={4}>
            <h2 className="h5 text-white">
              <i className="bi bi-bag-heart-fill me-2" aria-hidden="true"></i>AttireHub
            </h2>
            <p className="small">
              Colorful, modern fashion for everyone. This is a portfolio project: no real
              orders or payments are processed.
            </p>
          </Col>
          <Col xs={6} md={2}>
            <h3 className="h6 text-white">Shop</h3>
            <ul className="footer-links">
              <li><Link to="/shop?category=Men">Men</Link></li>
              <li><Link to="/shop?category=Women">Women</Link></li>
              <li><Link to="/shop?category=Kids">Kids</Link></li>
              <li><Link to="/shop?filter=sale">Sale</Link></li>
            </ul>
          </Col>
          <Col xs={6} md={2}>
            <h3 className="h6 text-white">Account</h3>
            <ul className="footer-links">
              <li><Link to="/login">Log in</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h3 className="h6 text-white">About this project</h3>
            <p className="small">
              Built with React, Node.js, Express and MongoDB as a full-stack learning project.
            </p>
          </Col>
        </Row>
        <p className="small text-center pb-4 mb-0">
          &copy; {new Date().getFullYear()} AttireHub. Portfolio project.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;