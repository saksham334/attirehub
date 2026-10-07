import { useSearchParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import useProducts from "../hooks/useProducts";

function Shop() {
  const { products, loading, error, retry } = useProducts();

  // The URL is the source of truth: /shop?category=Men&search=hoodie
  const [params] = useSearchParams();
  const category = params.get("category");
  const filter = params.get("filter");
  const rawSearch = params.get("search") || "";
  const words = rawSearch.toLowerCase().split(" ").filter(Boolean);

  // TEMPORARY filtering in the browser. Step 10 moves this to the server.
  const visible = products.filter((p) => {
    if (category && p.category !== category) return false;
    if (filter === "new" && !p.isNewArrival) return false;
    if (filter === "sale" && !(p.discountPrice > 0)) return false;

    const text = `${p.name} ${p.category} ${p.subcategory} ${p.colors.join(" ")}`.toLowerCase();
    return words.every((word) => text.includes(word));
  });

  let title = "All Products";
  if (category) title = category;
  else if (filter === "new") title = "New Arrivals";
  else if (filter === "sale") title = "Sale";
  else if (rawSearch) title = `Results for "${rawSearch}"`;

  return (
    <Container className="py-5">
      <h1 className="h2 mb-4">{title}</h1>

      {loading && <LoadingSpinner text="Loading products..." />}
      {error && <ErrorMessage message={error} onRetry={retry} />}

      {!loading && !error && visible.length === 0 && (
        <p className="text-center text-muted py-5">No products match your search.</p>
      )}

      <div className="row g-4">
        {visible.map((product) => (
          <div key={product._id} className="col-6 col-md-4 col-lg-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </Container>
  );
}

export default Shop;