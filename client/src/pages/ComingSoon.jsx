import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

function ComingSoon({ title }) {
  return (
    <Container className="py-5 text-center">
      <h1 className="h2">{title}</h1>
      <p className="text-muted">This page is being built in a later step.</p>
      <Link to="/shop" className="btn-attire d-inline-block text-decoration-none">
        Back to shop
      </Link>
    </Container>
  );
}

export default ComingSoon;