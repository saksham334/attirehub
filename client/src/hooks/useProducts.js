import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";

// Loads products for a params object. Reloads whenever the params change.
function useProducts(params) {
  const [data, setData] = useState({ products: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  // A string is a stable value, so the effect only re-runs on real changes
  const key = JSON.stringify(params);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await fetchProducts(JSON.parse(key));
        if (!ignore) setData(result);
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
  }, [key, attempt]);

  const retry = () => setAttempt((n) => n + 1);

  return { ...data, loading, error, retry };
}

export default useProducts;