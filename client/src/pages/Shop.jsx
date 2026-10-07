import { useSearchParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import useProducts from "../hooks/useProducts";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Top rated" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

function Shop() {
  // The URL is the single source of truth for every filter
  const [params, setParams] = useSearchParams();

  // Change some params at once. Empty values remove the param. Always go back to page 1.
  const updateParams = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === "" || value == null) next.delete(key);
      else next.set(key, value);
    });
    if (!("page" in changes)) next.delete("page");
    setParams(next);
  };

  const clearAll = () => setParams(new URLSearchParams());

  // Turn the URL into the object we send to the API
  const apiParams = Object.fromEntries(params.entries());
  const { products, total, page, pages, loading, error, retry } = useProducts(apiParams);

  const category = params.get("category");
  const filter = params.get("filter");
  const search = params.get("search");

  let title = "All Products";
  if (search) title = `Results for "${search}"`;
  else if (filter === "new") title = "New Arrivals";
  else if (filter === "sale") title = "Sale";
  else if (category) title = category;

  return (
    <Container className="py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h1 className="h2 mb-1">{title}</h1>
          {!loading && !error && (
            <p className="text-muted small mb-0">{total} product{total === 1 ? "" : "s"}</p>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          <label htmlFor="sort" className="small text-muted mb-0">Sort by</label>
          <select
            id="sort"
            className="form-select form-select-sm"
            value={params.get("sort") || "newest"}
            onChange={(e) => updateParams({ sort: e.target.value })}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-3">
          {/* key forces the sidebar to reset its price boxes when filters are cleared */}
          <FilterSidebar
            key={`${params.get("minPrice")}-${params.get("maxPrice")}`}
            params={params}
            updateParams={updateParams}
            clearAll={clearAll}
          />
        </div>

        <div className="col-lg-9">
          {loading && <LoadingSpinner text="Loading products..." />}
          {error && <ErrorMessage message={error} onRetry={retry} />}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted">No products match your filters.</p>
              <button className="btn-attire" onClick={clearAll}>Clear filters</button>
            </div>
          )}

          {!loading && !error && (
            <div className="row g-4">
              {products.map((product) => (
                <div key={product._id} className="col-6 col-md-4">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {!error && (
            <Pagination
              page={page}
              pages={pages}
              onChange={(n) => {
                updateParams({ page: String(n) });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </div>
      </div>
    </Container>
  );
}

export default Shop;