// Colored pill for an order status. Text is always shown, so color is never the only signal.
function OrderStatusBadge({ status }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>;
}

export default OrderStatusBadge;