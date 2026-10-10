import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createOrderRequest } from "../services/orderService";
import { saveCartRequest } from "../services/cartService";
import { formatPrice } from "../utils/formatPrice";

const PAYMENT_OPTIONS = [
  { value: "CARD_DEMO", label: "Credit / Debit Card (demo mode)", icon: "bi-credit-card" },
  { value: "PAYPAL_DEMO", label: "PayPal (demo mode)", icon: "bi-paypal" },
  { value: "COD", label: "Cash on Delivery", icon: "bi-cash-coin" },
];

function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const navigate = useNavigate();

  // Start from the saved profile address when there is one
  const saved = user.address || {};
  const [form, setForm] = useState({
    fullName: user.name || "",
    phone: "",
    street: saved.street || "",
    city: saved.city || "",
    state: saved.state || "",
    postalCode: saved.postalCode || "",
    country: saved.country || "Canada",
  });
  const [payment, setPayment] = useState("CARD_DEMO");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Nothing to buy
  if (items.length === 0 && !submitting) {
    return (
      <Container className="py-5 text-center">
        <h1 className="h3">Your cart is empty</h1>
        <p className="text-muted">Add something before checking out.</p>
        <Link to="/shop" className="btn-attire d-inline-block text-decoration-none">Browse products</Link>
      </Container>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Quick checks in the browser (the server checks again)
    const required = ["fullName", "street", "city", "state", "postalCode", "country"];
    if (required.some((f) => !form[f].trim())) {
      return setError("Please fill in all required shipping fields.");
    }

    setSubmitting(true);
    try {
      // Make sure the server has the latest cart before it builds the order
      await saveCartRequest(items);
      const order = await createOrderRequest(form, payment);
      clearCart(); // the server already emptied its copy
      navigate(`/order-confirmation/${order._id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server. Is the API running?");
      setSubmitting(false);
    }
  };

  const field = (name, label, props = {}) => (
    <div className={props.col || "col-12"}>
      <label htmlFor={name} className="form-label">
        {label}{props.optional ? " (optional)" : ""}
      </label>
      <input
        id={name} name={name} className="form-control"
        value={form[name]} onChange={handleChange}
        required={!props.optional} autoComplete={props.autoComplete}
      />
    </div>
  );

  return (
    <Container className="py-5">
      <h1 className="h2 mb-4">Checkout</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-4">
          <div className="col-lg-7">
            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            <section className="card-attire p-4 mb-4" aria-labelledby="ship-heading">
              <h2 id="ship-heading" className="h5 mb-3">Shipping address</h2>
              <div className="row g-3">
                {field("fullName", "Full name", { autoComplete: "name" })}
                {field("phone", "Phone", { optional: true, autoComplete: "tel" })}
                {field("street", "Street address", { autoComplete: "street-address" })}
                {field("city", "City", { col: "col-md-6", autoComplete: "address-level2" })}
                {field("state", "Province / State", { col: "col-md-6", autoComplete: "address-level1" })}
                {field("postalCode", "Postal code", { col: "col-md-6", autoComplete: "postal-code" })}
                {field("country", "Country", { col: "col-md-6", autoComplete: "country-name" })}
              </div>
            </section>

            <fieldset className="card-attire p-4">
              <legend className="h5 mb-3 float-none w-auto">Payment method</legend>
              <div className="alert alert-info py-2 small">
                <i className="bi bi-info-circle me-2" aria-hidden="true"></i>
                Demo store: no real payment is taken, and you never enter card details.
              </div>
              {PAYMENT_OPTIONS.map((o) => (
                <div className="form-check mb-2" key={o.value}>
                  <input
                    className="form-check-input" type="radio" name="payment"
                    id={`pay-${o.value}`} checked={payment === o.value}
                    onChange={() => setPayment(o.value)}
                  />
                  <label className="form-check-label" htmlFor={`pay-${o.value}`}>
                    <i className={`bi ${o.icon} me-2`} aria-hidden="true"></i>{o.label}
                  </label>
                </div>
              ))}
            </fieldset>
          </div>

          <div className="col-lg-5">
            <aside className="card-attire p-4" aria-label="Order summary">
              <h2 className="h5 mb-3">Order summary</h2>
              <ul className="list-unstyled small">
                {items.map((i) => (
                  <li key={i.lineId} className="d-flex justify-content-between mb-2">
                    <span>{i.name} ({i.size}, {i.color}) × {i.quantity}</span>
                  </li>
                ))}
              </ul>
              <dl className="summary-list">
                <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
                <div><dt>Shipping</dt><dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
                <div><dt>Estimated tax</dt><dd>{formatPrice(tax)}</dd></div>
                <div className="summary-total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
              </dl>
              <button type="submit" className="btn-attire w-100" disabled={submitting}>
                {submitting ? "Placing order..." : "Place order"}
              </button>
              <p className="small text-muted mt-3 mb-0">
                The final total is confirmed by the server when you place the order.
              </p>
            </aside>
          </div>
        </div>
      </form>
    </Container>
  );
}

export default Checkout;