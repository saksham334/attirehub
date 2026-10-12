import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { fetchOrderById } from "../services/orderService";
import { formatPrice } from "../utils/formatPrice";
import { formatDate } from "../utils/formatDate";

const STEPS = ["Pending", "Processing", "Shipped", "Delivered"];
const PAYMENT_LABELS = { CARD_DEMO: "Card (demo)", PAYPAL_DEMO: "PayPal (demo)", COD: "Cash on delivery" };

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    fetchOrderById(id)
      .then((data) => { if (!ignore) setOrder(data); })
      .catch((err) => {
        if (!ignore) setError(err.response?.status === 404 ? "Order not found." : "Could not load this order.");
      })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [id]);

  if (loading) return <Container className="py-5"><LoadingSpinner text="Loading order..." /></Container>;
  if (error) {
    return (
      <Container className="py-5">
        <ErrorMessage message={error} />
        <div className="text-center"><Link to="/orders">Back to my orders</Link></div>
      </Container>
    );
  }

  const a = order.shippingAddress;
  const cancelled = order.status === "Cancelled";
  const currentStep = STEPS.indexOf(order.status);

  return (
    <Container className="py-5" style={{ maxWidth: 820 }}>
      <nav aria-label="Breadcrumb">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/orders">My orders</Link></li>
          <li className="breadcrumb-item active" aria-current="page">#{order._id.slice(-8).toUpperCase()}</li>
        </ol>
      </nav>

      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-muted small mb-0">Placed {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Status tracker */}
      <section className="card-attire p-4 mb-4" aria-label="Order progress">
        {cancelled ? (
          <p className="mb-0">This order was cancelled.</p>
        ) : (
          <ol className="tracker">
            {STEPS.map((step, i) => (
              <li
                key={step}
                className={i <= currentStep ? "tracker__step tracker__step--done" : "tracker__step"}
                aria-current={i === currentStep ? "step" : undefined}
              >
                <span className="tracker__dot" aria-hidden="true">
                  {i <= currentStep && <i className="bi bi-check-lg"></i>}
                </span>
                <span className="tracker__label">{step}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="card-attire p-4 mb-4">
        <h2 className="h5 mb-3">Items</h2>
        {order.orderItems.map((i) => (
          <div key={`${i.product}-${i.size}-${i.color}`} className="cart-row">
            <Link to={`/product/${i.product}`}>
              <img src={i.image} alt={i.name} className="cart-row__img" />
            </Link>
            <div className="flex-grow-1">
              <strong>{i.name}</strong>
              <p className="small text-muted mb-0">
                Size {i.size} &middot; {i.color} &middot; Qty {i.quantity}
              </p>
              <p className="small text-muted mb-0">{formatPrice(i.price)} each</p>
            </div>
            <div className="fw-bold">{formatPrice(i.price * i.quantity)}</div>
          </div>
        ))}
        <dl className="summary-list mt-3 mb-0">
          <div><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          <div><dt>Shipping</dt><dd>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</dd></div>
          <div><dt>Tax</dt><dd>{formatPrice(order.tax)}</dd></div>
          <div className="summary-total"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
        </dl>
      </section>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card-attire p-4 h-100">
            <h2 className="h6">Shipping address</h2>
            <address className="small mb-0">
              {a.fullName}<br />{a.street}<br />{a.city}, {a.state} {a.postalCode}<br />{a.country}
            </address>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-attire p-4 h-100">
            <h2 className="h6">Payment</h2>
            <p className="small mb-1">{PAYMENT_LABELS[order.paymentMethod]}</p>
            <p className="small mb-0">
              {order.paymentStatus === "PAID_DEMO" ? "Paid (demo, no real charge)" : "Pay on delivery"}
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default OrderDetails;