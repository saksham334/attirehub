import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

function Home() {
  return (
    <section className="hero">
      <Container className="text-center py-5">
        <h1 className="display-4 text-white">Wear your colors</h1>
        <p className="lead text-white mb-4">
          Fresh, fun and modern fashion for men, women and kids.
        </p>
        <Link to="/shop" className="btn btn-light btn-lg rounded-pill px-5">
          Shop now
        </Link>
      </Container>
    </section>
  );
}

export default Home;