// Simple Previous / page numbers / Next control
function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  return (
    <nav aria-label="Product pages" className="mt-5">
      <ul className="pagination justify-content-center flex-wrap">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onChange(page - 1)} disabled={page === 1}>
            Previous
          </button>
        </li>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <li key={n} className={`page-item ${n === page ? "active" : ""}`}>
            <button
              className="page-link"
              onClick={() => onChange(n)}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </button>
          </li>
        ))}
        <li className={`page-item ${page === pages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onChange(page + 1)} disabled={page === pages}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;