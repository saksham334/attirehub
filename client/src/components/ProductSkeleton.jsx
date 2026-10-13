// A grey placeholder shaped like a ProductCard
function ProductSkeleton({ count = 8, colClass = "col-6 col-md-4 col-lg-3" }) {
  return (
    <div className="row g-4" role="status" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={colClass}>
          <div className="card-attire skeleton-card" aria-hidden="true">
            <div className="skeleton skeleton--image"></div>
            <div className="p-3">
              <div className="skeleton skeleton--line skeleton--short"></div>
              <div className="skeleton skeleton--line"></div>
              <div className="skeleton skeleton--line skeleton--short"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductSkeleton;