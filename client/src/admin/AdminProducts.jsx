import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import useDebounce from "../hooks/useDebounce";
import { fetchAdminProducts, deleteProductRequest } from "../services/adminService";
import { formatPrice } from "../utils/formatPrice";

function AdminProducts() {
  const [data, setData] = useState({ products: [], total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    let ignore = false;
    fetchAdminProducts({ search: debouncedSearch || undefined, page, limit: 12, sort: "newest" })
      .then((result) => { if (!ignore) { setData(result); setError(""); } })
      .catch(() => { if (!ignore) setError("Could not load products."); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [debouncedSearch, page, reload]);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone. Past orders keep their own copy.`)) return;
    setNotice("");
    try {
      await deleteProductRequest(product._id);
      setReload((n) => n + 1);
    } catch (err) {
      setNotice(err.response?.data?.message || "Could not delete the product.");
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h1 className="h3 mb-0">Products <span className="text-muted fs-6">({data.total})</span></h1>
        <Link to="/admin/products/new" className="btn-attire text-decoration-none">
          <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>Add product
        </Link>
      </div>

      <div className="mb-3" style={{ maxWidth: 360 }}>
        <label htmlFor="admin-search" className="visually-hidden">Search products</label>
        <input id="admin-search" type="search" className="form-control" placeholder="Search by name or category"
          value={search} onChange={(e) => handleSearch(e.target.value)} />
      </div>

      {notice && <div className="alert alert-danger py-2" role="alert">{notice}</div>}
      {loading && <LoadingSpinner text="Loading products..." />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && data.products.length === 0 && <p className="text-muted">No products found.</p>}

      {!loading && !error && data.products.length > 0 && (
        <div className="card-attire p-3 table-responsive">
          <table className="table align-middle admin-table mb-0">
            <thead>
              <tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th><span className="visually-hidden">Actions</span></th></tr>
            </thead>
            <tbody>
              {data.products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img src={p.images[0]} alt="" className="order-thumb" />
                      <span className="fw-semibold">{p.name}</span>
                    </div>
                  </td>
                  <td>{p.sku}</td>
                  <td>{p.category}</td>
                  <td>
                    {p.discountPrice > 0 ? (
                      <>
                        <span style={{ color: "var(--ah-secondary)" }}>{formatPrice(p.discountPrice)}</span>{" "}
                        <span className="small text-muted text-decoration-line-through">{formatPrice(p.price)}</span>
                      </>
                    ) : formatPrice(p.price)}
                  </td>
                  <td>{p.stock}</td>
                  <td className="text-end text-nowrap">
                    <Link to={`/admin/products/${p._id}/edit`} className="btn btn-sm btn-outline-dark rounded-pill me-2">Edit</Link>
                    <button type="button" className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleDelete(p)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.pages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
          <button className="btn btn-outline-dark btn-sm rounded-pill" disabled={page <= 1}
            onClick={() => { setLoading(true); setPage(page - 1); }}>Previous</button>
          <span className="small">Page {data.page} of {data.pages}</span>
          <button className="btn btn-outline-dark btn-sm rounded-pill" disabled={page >= data.pages}
            onClick={() => { setLoading(true); setPage(page + 1); }}>Next</button>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;

