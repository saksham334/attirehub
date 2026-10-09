import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import CartItemRow from "../components/CartItemRow";
import { formatPrice } from "../utils/formatPrice";
import { FREE_SHIPPING_THRESHOLD } from "../utils/calculateTotals";

function Cart() {
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <i className="bi bi-bag display-1 text-muted" aria-hidden="true"></i>
        <h1 className="h3 mt-3">Your cart is empty</h1>
        <p className="text-muted">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn-attire d-inline-block text-decoration-none">Start shopping</Link>
      </Container>
    );
  }

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <Container className="py-5">
      <h1 className="h2 mb-4">Shopping cart</h1>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card-attire p-3">
            {items.map((item) => <CartItemRow key={item.lineId} item={item} />)}
          </div>
          <button className="btn btn-link text-danger mt-2 px-0" onClick={clearCart}>Clear cart</button>
        </div>

        <div className="col-lg-4">
          <aside className="card-attire p-4" aria-label="Order summary">
            <h2 className="h5 mb-3">Order summary</h2>
            {remaining > 0 && (
              <p className="small text-muted">Add {formatPrice(remaining)} more for free shipping.</p>
            )}
            <dl className="summary-list">
              <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
              <div><dt>Shipping</dt><dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
              <div><dt>Estimated tax</dt><dd>{formatPrice(tax)}</dd></div>
              <div className="summary-total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
            </dl>
            <Link to="/checkout" className="btn-attire d-block text-center text-decoration-none">
              Proceed to checkout
            </Link>
            <Link to="/shop" className="d-block text-center mt-3 small">Continue shopping</Link>
          </aside>
        </div>
      </div>
    </Container>
  );
}

export default Cart;