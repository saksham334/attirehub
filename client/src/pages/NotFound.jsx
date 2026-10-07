import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

function NotFound() {
  return (
    <Container className="py-5 text-center">
      <h1 className="display-3" style={{ color: "var(--ah-primary)" }}>404</h1>
      <p className="lead">We couldn't find that page.</p>
      <Link to="/" className="btn-attire d-inline-block text-decoration-none">
        Go home
      </Link>
    </Container>
  );
}

export default NotFound;