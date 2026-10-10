export const FREE_SHIPPING_THRESHOLD = 75;
export const SHIPPING_COST = 6.99;
export const TAX_RATE = 0.13;

const round = (n) => Math.round(n * 100) / 100;

// items: [{ price, quantity }] where price is the unit price actually charged
export const calculateTotals = (items) => {
  const subtotal = round(items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = round(subtotal * TAX_RATE);
  const total = round(subtotal + shippingCost + tax);
  return { subtotal, shippingCost, tax, total };
};