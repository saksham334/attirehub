import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { fetchProducts } from "./services/productService";

function App() {
  // Three pieces of state: the data, whether we're waiting, and any error
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      setProducts(await fetchProducts());
    } catch {
      setError("Could not reach the server. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  // Runs once, after the first render
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
  }, []);

  return (
    <main className="container py-5">
      <h1 className="text-center mb-1" style={{ color: "var(--ah-primary)" }}>
        <i className="bi bi-bag-heart-fill me-2"></i>AttireHub
      </h1>
      <p className="text-center text-muted mb-5">Colorful, modern fashion</p>

      {loading && <LoadingSpinner text="Loading products..." />}
      {error && <ErrorMessage message={error} onRetry={loadProducts} />}

      <div className="row g-4">
        {products.map((product) => (
          <div key={product._id} className="col-6 col-md-4 col-lg-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;