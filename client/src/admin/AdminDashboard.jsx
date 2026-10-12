import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { fetchStats } from "../services/adminService";
import { formatPrice } from "../utils/formatPrice";
import { formatDate } from "../utils/formatDate";

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card card-attire">
      <span className="stat-card__icon" style={{ background: color }}>
        <i className={`bi ${icon}`} aria-hidden="true"></i>
      </span>
      <div>
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetchStats()
      .then((data) => { if (!ignore) { setStats(data); setError(""); } })
      .catch(() => { if (!ignore) setError("Could not load dashboard data."); });
    return () => { ignore = true; };
  }, [attempt]);

  if (error) return <ErrorMessage message={error} onRetry={() => setAttempt((n) => n + 1)} />;
  if (!stats) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <div>
      <h1 className="h3 mb-4">Dashboard</h1>

      <div className="stat-grid mb-4">
        <StatCard icon="bi-currency-dollar" label="Total sales" value={formatPrice(stats.totalSales)} color="var(--ah-primary)" />
        <StatCard icon="bi-receipt" label="Orders" value={stats.totalOrders} color="var(--ah-secondary)" />
        <StatCard icon="bi-people" label="Users" value={stats.totalUsers} color="var(--ah-accent)" />
        <StatCard icon="bi-tag" label="Products" value={stats.totalProducts} color="#d9a21b" />
      </div>

      <div className="row g-4">
        <div className="col-xl-7">
          <section className="card-attire p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 mb-0">Recent orders</h2>
              <Link to="/admin/orders" className="small">View all</Link>
            </div>
            {stats.recentOrders.length === 0 ? (
              <p className="text-muted mb-0">No orders yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle admin-table">
                  <thead>
                    <tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((o) => (
                      <tr key={o._id}>
                        <td>#{o._id.slice(-8).toUpperCase()}</td>
                        <td>{o.user?.name || "Deleted user"}</td>
                        <td>{formatDate(o.createdAt)}</td>
                        <td>{formatPrice(o.total)}</td>
                        <td><OrderStatusBadge status={o.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <div className="col-xl-5">
          <section className="card-attire p-4 h-100">
            <h2 className="h5 mb-3">Low stock (≤ {stats.lowStockLimit})</h2>
            {stats.lowStock.length === 0 ? (
              <p className="text-muted mb-0">All products are well stocked.</p>
            ) : (
              <ul className="list-unstyled mb-0">
                {stats.lowStock.map((p) => (
                  <li key={p._id} className="d-flex align-items-center gap-3 mb-3">
                    <img src={p.images[0]} alt="" className="order-thumb" />
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-semibold small">{p.name}</p>
                      <p className="mb-0 small text-muted">{p.sku}</p>
                    </div>
                    <span className={`stock-pill ${p.stock === 0 ? "stock-pill--out" : "stock-pill--low"}`}>
                      {p.stock === 0 ? "Out" : `${p.stock} left`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;