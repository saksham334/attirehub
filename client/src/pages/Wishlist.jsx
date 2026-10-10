import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useWishlist } from "../context/WishlistContext";
import { fetchWishlist } from "../services/wishlistService";

function Wishlist() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    fetchWishlist()
      .then((data) => { if (!ignore) setProducts(data); })
      .catch(() => { if (!ignore) setError("Could not load your wishlist."); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  // Hide items the user un-hearted on this page without reloading
  const visible = products.filter((p) => ids.includes(p._id));

  return (
    <Container className="py-5">
      <h1 className="h2 mb-4">My wishlist</h1>
      {loading && <LoadingSpinner text="Loading wishlist..." />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && visible.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">Nothing saved yet. Tap the heart on any product.</p>
          <Link to="/shop" className="btn-attire d-inline-block text-decoration-none">Browse products</Link>
        </div>
      )}
      <div className="row g-4">
        {visible.map((p) => (
          <div key={p._id} className="col-6 col-md-4 col-lg-3"><ProductCard product={p} /></div>
        ))}
      </div>
    </Container>
  );
}

export default Wishlist;