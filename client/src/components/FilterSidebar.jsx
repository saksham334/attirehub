import { useEffect, useState } from "react";
import { fetchFilterOptions } from "../services/productService";
import useDebounce from "../hooks/useDebounce";

const RATING_OPTIONS = [4.5, 4, 3];

// Controlled by the URL: `params` is the current URLSearchParams,
// `updateParams` writes changes back to it.
function FilterSidebar({ params, updateParams, clearAll }) {
  const [options, setOptions] = useState({ categories: [], sizes: [], colors: [] });

  useEffect(() => {
    fetchFilterOptions()
      .then(setOptions)
      .catch((err) => console.error(err));
  }, []);

  // Price inputs: local typing state, pushed to the URL after a pause
  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "");
  const debouncedMin = useDebounce(minPrice);
  const debouncedMax = useDebounce(maxPrice);

  useEffect(() => {
    if ((params.get("minPrice") || "") !== debouncedMin ||
        (params.get("maxPrice") || "") !== debouncedMax) {
      updateParams({ minPrice: debouncedMin, maxPrice: debouncedMax });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMin, debouncedMax]);

  const category = params.get("category") || "";
  const size = params.get("size") || "";
  const color = params.get("color") || "";
  const rating = params.get("rating") || "";

  return (
    <aside className="filter-sidebar card-attire p-3" aria-label="Product filters">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h6 mb-0">Filters</h2>
        <button
          type="button"
          className="btn btn-link btn-sm p-0"
          onClick={() => {
            setMinPrice("");
            setMaxPrice("");
            clearAll();
          }}
        >
          Clear all
        </button>
      </div>

      <fieldset className="mb-4">
        <legend className="h6 small fw-bold">Category</legend>
        {options.categories.map((c) => (
          <div className="form-check" key={c}>
            <input
              className="form-check-input"
              type="radio"
              name="category"
              id={`cat-${c}`}
              checked={category === c}
              onChange={() => updateParams({ category: c, filter: "" })}
            />
            <label className="form-check-label" htmlFor={`cat-${c}`}>{c}</label>
          </div>
        ))}
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="category"
            id="cat-all"
            checked={category === ""}
            onChange={() => updateParams({ category: "" })}
          />
          <label className="form-check-label" htmlFor="cat-all">All</label>
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="h6 small fw-bold">Price ($)</legend>
        <div className="d-flex gap-2">
          <label className="visually-hidden" htmlFor="min-price">Minimum price</label>
          <input
            id="min-price" type="number" min="0" className="form-control form-control-sm"
            placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
          />
          <label className="visually-hidden" htmlFor="max-price">Maximum price</label>
          <input
            id="max-price" type="number" min="0" className="form-control form-control-sm"
            placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="h6 small fw-bold">Size</legend>
        <div className="d-flex flex-wrap gap-2">
          {options.sizes.map((s) => (
            <button
              key={s}
              type="button"
              className={`chip ${size === s ? "chip--active" : ""}`}
              aria-pressed={size === s}
              onClick={() => updateParams({ size: size === s ? "" : s })}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="h6 small fw-bold">Color</legend>
        <div className="d-flex flex-wrap gap-2">
          {options.colors.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${color === c ? "chip--active" : ""}`}
              aria-pressed={color === c}
              onClick={() => updateParams({ color: color === c ? "" : c })}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="h6 small fw-bold">Rating</legend>
        {RATING_OPTIONS.map((r) => (
          <div className="form-check" key={r}>
            <input
              className="form-check-input"
              type="radio"
              name="rating"
              id={`rating-${r}`}
              checked={rating === String(r)}
              onChange={() => updateParams({ rating: String(r) })}
            />
            <label className="form-check-label" htmlFor={`rating-${r}`}>
              {r}+ stars
            </label>
          </div>
        ))}
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="rating"
            id="rating-any"
            checked={rating === ""}
            onChange={() => updateParams({ rating: "" })}
          />
          <label className="form-check-label" htmlFor="rating-any">Any</label>
        </div>
      </fieldset>
    </aside>
  );
}

export default FilterSidebar;