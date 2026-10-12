import { Fragment, useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { fetchAdminOrders, updateOrderStatusRequest } from "../services/adminService";
import { formatPrice } from "../utils/formatPrice";
import { formatDate } from "../utils/formatDate";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetchAdminOrders(filter)
      .then((data) => { if (!ignore) { setOrders(data); setError(""); } })
      .catch(() => { if (!ignore) setError("Could not load orders."); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [filter]);

  const changeFilter = (value) => {
    setLoading(true);
    setFilter(value);
  };

  const changeStatus = async (order, status) => {
    if (status === "Cancelled" && !window.confirm("Cancel this order? Its items go back into stock and it can't be changed again.")) {
      return;
    }
    setNotice("");
    try {
      const updated = await updateOrderStatusRequest(order._id, status);
      setOrders((list) => list.map((o) => (o._id === updated._id ? updated : o)));
    } catch (err) {
      setNotice(err.response?.data?.message || "Could not update the order.");
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h1 className="h3 mb-0">Orders</h1>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="status-filter" className="small text-muted mb-0">Show</label>
          <select id="status-filter" className="form-select form-select-sm" value={filter}
            onChange={(e) => changeFilter(e.target.value)}>
            <option value="">All orders</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {notice && <div className="alert alert-danger py-2" role="alert">{notice}</div>}
      {loading && <LoadingSpinner text="Loading orders..." />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && orders.length === 0 && <p className="text-muted">No orders found.</p>}

      {!loading && !error && orders.length > 0 && (
        <div className="card-attire p-3 table-responsive">
          <table className="table align-middle admin-table mb-0">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th><span className="visually-hidden">Details</span></th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <Fragment key={o._id}>
                  <tr>
                    <td>#{o._id.slice(-8).toUpperCase()}</td>
                    <td>
                      {o.user?.name || "Deleted user"}
                      <div className="small text-muted">{o.user?.email}</div>
                    </td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td>{formatPrice(o.total)}</td>
                    <td>
                      <label className="visually-hidden" htmlFor={`st-${o._id}`}>Status for order {o._id.slice(-8)}</label>
                      <select id={`st-${o._id}`} className="form-select form-select-sm" value={o.status}
                        disabled={o.status === "Cancelled"}
                        onChange={(e) => changeStatus(o, e.target.value)}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="text-end">
                      <button type="button" className="btn btn-link btn-sm" aria-expanded={openId === o._id}
                        onClick={() => setOpenId(openId === o._id ? null : o._id)}>
                        {openId === o._id ? "Hide" : "Items"}
                      </button>
                    </td>
                  </tr>
                  {openId === o._id && (
                    <tr className="admin-detail-row">
                      <td colSpan={6}>
                        <div className="row g-3">
                          <div className="col-md-7">
                            {o.orderItems.map((i) => (
                              <div key={`${i.product}-${i.size}-${i.color}`} className="d-flex align-items-center gap-3 mb-2">
                                <img src={i.image} alt="" className="order-thumb" />
                                <span className="small">
                                  {i.name} ({i.size}, {i.color}) × {i.quantity} · {formatPrice(i.price * i.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="col-md-5 small">
                            <strong>Ship to</strong><br />
                            {o.shippingAddress.fullName}<br />
                            {o.shippingAddress.street}<br />
                            {o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.postalCode}<br />
                            {o.shippingAddress.country}
                            <p className="mt-2 mb-0"><strong>Payment:</strong> {o.paymentMethod} ({o.paymentStatus})</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;