import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { fetchOrderById } from "../services/orderService";
import { formatPrice } from "../utils/formatPrice";

const PAYMENT_LABELS = {
  CARD_DEMO: "Card (demo)",
  PAYPAL_DEMO: "PayPal (demo)",
  COD: "Cash on delivery",
};

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    fetchOrderById(id)
      .then((data) => { if (!ignore) setOrder(data); })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.status === 404 ? "Order not found." : "Could not load your order.");
        }
      })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [id]);

  if (loading) return <Container className="py-5"><LoadingSpinner text="Loading your order..." /></Container>;
  if (error) return <Container className="py-5"><ErrorMessage message={error} /></Container>;

  const a = order.shippingAddress;

  return (
    <Container className="py-5" style={{ maxWidth: 760 }}>
      <div className="text-center mb-4">
        <i className="bi bi-check-circle-fill display-3" style={{ color: "var(--ah-accent)" }} aria-hidden="true"></i>
        <h1 className="h2 mt-2">Thank you for your order!</h1>
        <p className="text-muted mb-0">Order number: <strong>{order._id}</strong></p>
        <p className="small text-muted">Demo store: nothing will actually ship.</p>
      </div>

      <div className="card-attire p-4 mb-4">
        <h2 className="h5 mb-3">Items</h2>
        {order.orderItems.map((i) => (
          <div key={`${i.product}-${i.size}-${i.color}`} className="cart-row">
            <img src={i.image} alt={i.name} className="cart-row__img" />
            <div className="flex-grow-1">
              <strong>{i.name}</strong>
              <p className="small text-muted mb-0">Size {i.size} &middot; {i.color} &middot; Qty {i.quantity}</p>
            </div>
            <div className="fw-bold">{formatPrice(i.price * i.quantity)}</div>
          </div>
        ))}
        <dl className="summary-list mt-3">
          <div><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          <div><dt>Shipping</dt><dd>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</dd></div>
          <div><dt>Tax</dt><dd>{formatPrice(order.tax)}</dd></div>
          <div className="summary-total"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
        </dl>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card-attire p-4 h-100">
            <h2 className="h6">Shipping to</h2>
            <address className="mb-0 small">
              {a.fullName}<br />{a.street}<br />{a.city}, {a.state} {a.postalCode}<br />{a.country}
            </address>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-attire p-4 h-100">
            <h2 className="h6">Payment and status</h2>
            <p className="small mb-1">{PAYMENT_LABELS[order.paymentMethod]}</p>
            <p className="small mb-0">Status: <strong>{order.status}</strong></p>
          </div>
        </div>
      </div>

      <div className="text-center d-flex flex-wrap justify-content-center gap-3">
        <Link to="/orders" className="btn btn-outline-dark rounded-pill px-4">View my orders</Link>
        <Link to="/shop" className="btn-attire d-inline-block text-decoration-none">Continue shopping</Link>
      </div>
    </Container>
  );
}

export default OrderConfirmation;