import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import { unitPrice } from "../utils/calculateTotals";

// One cart line, used by both the drawer and the Cart page
function CartItemRow({ item, compact = false }) {
  const { updateQuantity, removeItem } = useCart();
  const maxQty = Math.min(item.stock, 10);

  return (
    <div className="cart-row">
      <Link to={`/product/${item._id}`}>
        <img src={item.image} alt={item.name} className="cart-row__img" />
      </Link>
      <div className="flex-grow-1">
        <Link to={`/product/${item._id}`} className="product-card__title fw-semibold">
          {item.name}
        </Link>
        <p className="small text-muted mb-1">Size {item.size} &middot; {item.color}</p>
        <div className="d-flex align-items-center gap-3">
          <div className="qty-control qty-control--sm" role="group" aria-label={`Quantity for ${item.name}`}>
            <button type="button" aria-label="Decrease quantity"
              onClick={() => updateQuantity(item.lineId, item.quantity - 1)} disabled={item.quantity <= 1}>
              <i className="bi bi-dash" aria-hidden="true"></i>
            </button>
            <span aria-live="polite">{item.quantity}</span>
            <button type="button" aria-label="Increase quantity"
              onClick={() => updateQuantity(item.lineId, item.quantity + 1)} disabled={item.quantity >= maxQty}>
              <i className="bi bi-plus" aria-hidden="true"></i>
            </button>
          </div>
          <button type="button" className="btn btn-link btn-sm text-danger p-0" onClick={() => removeItem(item.lineId)}>
            Remove
          </button>
        </div>
      </div>
      <div className="fw-bold text-end">
        {formatPrice(unitPrice(item) * item.quantity)}
        {!compact && item.quantity > 1 && (
          <div className="small fw-normal text-muted">{formatPrice(unitPrice(item))} each</div>
        )}
      </div>
    </div>
  );
}

export default CartItemRow;