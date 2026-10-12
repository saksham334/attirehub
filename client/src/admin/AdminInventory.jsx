import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { fetchInventory, updateStockRequest } from "../services/adminService";

const PILL = {
  "In stock": "stock-pill stock-pill--ok",
  "Low stock": "stock-pill stock-pill--low",
  "Out of stock": "stock-pill stock-pill--out",
};

const statusFor = (stock, limit) =>
  stock === 0 ? "Out of stock" : stock <= limit ? "Low stock" : "In stock";

function AdminInventory() {
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(10);
  const [edits, setEdits] = useState({}); // id -> typed value
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState({ type: "", text: "" });

  useEffect(() => {
    let ignore = false;
    fetchInventory()
      .then((data) => { if (!ignore) { setItems(data.inventory); setLimit(data.lowStockLimit); } })
      .catch(() => { if (!ignore) setError("Could not load inventory."); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const save = async (item) => {
    const typed = edits[item._id];
    const stock = Number(typed);
    if (typed === "" || !Number.isInteger(stock) || stock < 0) {
      return setNotice({ type: "danger", text: "Stock must be a whole number, 0 or more." });
    }
    try {
      const updated = await updateStockRequest(item._id, stock);
      setItems((list) =>
        list.map((i) => (i._id === item._id
          ? { ...i, stock: updated.stock, status: statusFor(updated.stock, limit) }
          : i))
      );
      setEdits(({ [item._id]: _removed, ...rest }) => rest);
      setNotice({ type: "success", text: `Updated ${item.name} to ${updated.stock}.` });
    } catch (err) {
      setNotice({ type: "danger", text: err.response?.data?.message || "Could not update stock." });
    }
  };

  const visible = filter ? items.filter((i) => i.status === filter) : items;

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h1 className="h3 mb-0">Inventory</h1>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="inv-filter" className="small text-muted mb-0">Show</label>
          <select id="inv-filter" className="form-select form-select-sm" value={filter}
            onChange={(e) => setFilter(e.target.value)}>
            <option value="">All products</option>
            <option value="Low stock">Low stock</option>
            <option value="Out of stock">Out of stock</option>
            <option value="In stock">In stock</option>
          </select>
        </div>
      </div>

      {notice.text && <div className={`alert alert-${notice.type} py-2`} role="status">{notice.text}</div>}
      {loading && <LoadingSpinner text="Loading inventory..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="card-attire p-3 table-responsive">
          <table className="table align-middle admin-table mb-0">
            <thead>
              <tr><th>Product</th><th>SKU</th><th>Category</th><th>Status</th><th>Stock</th></tr>
            </thead>
            <tbody>
              {visible.map((i) => {
                const typed = edits[i._id];
                const changed = typed !== undefined && String(typed) !== String(i.stock);
                return (
                  <tr key={i._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img src={i.images[0]} alt="" className="order-thumb" />
                        <span className="fw-semibold">{i.name}</span>
                      </div>
                    </td>
                    <td>{i.sku}</td>
                    <td>{i.category}</td>
                    <td><span className={PILL[i.status]}>{i.status}</span></td>
                    <td>
                      <div className="d-flex gap-2" style={{ maxWidth: 170 }}>
                        <label htmlFor={`stock-${i._id}`} className="visually-hidden">Stock for {i.name}</label>
                        <input id={`stock-${i._id}`} type="number" min="0" step="1"
                          className="form-control form-control-sm"
                          value={typed ?? i.stock}
                          onChange={(e) => setEdits({ ...edits, [i._id]: e.target.value })} />
                        <button type="button" className="btn btn-sm btn-outline-dark rounded-pill"
                          disabled={!changed} onClick={() => save(i)}>Save</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminInventory;