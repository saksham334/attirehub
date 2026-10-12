import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: "bi-speedometer2", end: true },
  { to: "/admin/products", label: "Products", icon: "bi-tag" },
  { to: "/admin/inventory", label: "Inventory", icon: "bi-boxes" },
  { to: "/admin/orders", label: "Orders", icon: "bi-receipt" },
  { to: "/admin/users", label: "Users", icon: "bi-people" },
];

// A different shell from the storefront: sidebar instead of the shop header
function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <Link to="/admin" className="admin-brand">
          <i className="bi bi-bag-heart-fill me-2" aria-hidden="true"></i>AttireHub
          <span className="admin-brand__tag">Admin</span>
        </Link>

        <nav>
          <ul className="admin-nav">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end}>
                  <i className={`bi ${l.icon}`} aria-hidden="true"></i>
                  <span>{l.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar__footer">
          <p className="small mb-2">{user.name}</p>
          <Link to="/" className="admin-footer-link">
            <i className="bi bi-shop me-2" aria-hidden="true"></i>View store
          </Link>
          <button type="button" className="admin-footer-link" onClick={logout}>
            <i className="bi bi-box-arrow-right me-2" aria-hidden="true"></i>Log out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;