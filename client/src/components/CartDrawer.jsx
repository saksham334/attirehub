import { Link } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import CartItemRow from "./CartItemRow";
import { formatPrice } from "../utils/formatPrice";

function CartDrawer() {
  const { items, subtotal, itemCount, drawerOpen, closeDrawer } = useCart();

  return (
    <Offcanvas show={drawerOpen} onHide={closeDrawer} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Your cart ({itemCount})</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column">
        {items.length === 0 ? (
          <p className="text-muted text-center my-auto">Your cart is empty.</p>
        ) : (
          <>
            <div className="flex-grow-1 overflow-auto">
              {items.map((item) => <CartItemRow key={item.lineId} item={item} compact />)}
            </div>
            <div className="border-top pt-3">
              <div className="d-flex justify-content-between fw-bold mb-3">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              <Link to="/cart" className="btn-attire d-block text-center text-decoration-none" onClick={closeDrawer}>
                View cart &amp; checkout
              </Link>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default CartDrawer;