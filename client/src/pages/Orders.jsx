import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { fetchMyOrders } from "../services/orderService";
import { formatPrice } from "../utils/formatPrice";
import { formatDate } from "../utils/formatDate";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetchMyOrders()
      .then((data) => { if (!ignore) { setOrders(data); setError(""); } })
      .catch(() => { if (!ignore) setError("Could not load your orders."); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [attempt]);

  const retry = () => {
    setLoading(true);
    setAttempt((n) => n + 1);
  };

  return (
    <Container className="py-5" style={{ maxWidth: 860 }}>
      <h1 className="h2 mb-4">My orders</h1>

      {loading && <LoadingSpinner text="Loading your orders..." />}
      {error && <ErrorMessage message={error} onRetry={retry} />}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-box-seam display-3 text-muted" aria-hidden="true"></i>
          <p className="text-muted mt-3">You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn-attire d-inline-block text-decoration-none">Start shopping</Link>
        </div>
      )}

      {orders.map((order) => (
        <article key={order._id} className="card-attire p-3 p-md-4 mb-3">
          <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
            <div>
              <p className="mb-0 fw-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
              <p className="small text-muted mb-0">Placed {formatDate(order.createdAt)}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex gap-2">
              {order.orderItems.slice(0, 4).map((item) => (
                <img
                  key={`${item.product}-${item.size}-${item.color}`}
                  src={item.image} alt={item.name} className="order-thumb"
                />
              ))}
              {order.orderItems.length > 4 && (
                <span className="small text-muted align-self-center">+{order.orderItems.length - 4} more</span>
              )}
            </div>
            <div className="text-end">
              <p className="fw-bold mb-1">{formatPrice(order.total)}</p>
              <Link to={`/orders/${order._id}`} className="small">View details</Link>
            </div>
          </div>
        </article>
      ))}
    </Container>
  );
}

export default Orders;