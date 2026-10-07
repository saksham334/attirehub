import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";

// Custom hook: loads products and exposes { products, loading, error, retry }
function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Changing this number re-runs the effect, which is how "Try again" works
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Stops us updating state if the user leaves the page mid-request
    let ignore = false;

    const load = async () => {
      try {
        const data = await fetchProducts();
        if (!ignore) setProducts(data);
      } catch (err) {
        console.error(err);
        if (!ignore) setError("Could not reach the server. Is the API running?");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [attempt]);

  const retry = () => {
    setLoading(true);
    setError("");
    setAttempt((n) => n + 1);
  };

  return { products, loading, error, retry };
}

export default useProducts;