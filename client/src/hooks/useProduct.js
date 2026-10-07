import { useEffect, useState } from "react";
import { fetchProductById } from "../services/productService";

// Loads ONE product. Separates "not found" (404) from "server unreachable".
function useProduct(id) {
  const [state, setState] = useState({
    product: null, loading: true, error: "", notFound: false,
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ product: null, loading: true, error: "", notFound: false });
      try {
        const product = await fetchProductById(id);
        if (!ignore) setState({ product, loading: false, error: "", notFound: false });
      } catch (err) {
        if (ignore) return;
        if (err.response?.status === 404) {
          setState({ product: null, loading: false, error: "", notFound: true });
        } else {
          console.error(err);
          setState({
            product: null, loading: false, notFound: false,
            error: "Could not reach the server. Is the API running?",
          });
        }
      }
    };

    load();
    return () => { ignore = true; };
  }, [id, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}

export default useProduct;