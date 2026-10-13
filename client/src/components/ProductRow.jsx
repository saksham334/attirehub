import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import ProductCard from "./ProductCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import useProducts from "../hooks/useProducts";

// A titled row of products loaded with the given API params
function ProductRow({ title, params, viewAllTo, children }) {
  const { products, loading, error, retry } = useProducts(params);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <h2 className="h3 mb-0">{title}</h2>
        {viewAllTo && <Link to={viewAllTo} className="small">View all</Link>}
      </div>
      {children}
      {loading && <LoadingSpinner text="Loading..." />}
      {error && <ErrorMessage message={error} onRetry={retry} />}
      {!loading && !error && products.length === 0 && <p className="text-muted">Nothing here yet.</p>}
      <div className="row g-4">
        {products.map((p) => (
          <div key={p._id} className="col-6 col-md-3"><ProductCard product={p} /></div>
        ))}
      </div>
    </Container>
  );
}

export default ProductRow;