export const FREE_SHIPPING_THRESHOLD = 75;
export const SHIPPING_COST = 6.99;
export const TAX_RATE = 0.13; // demo rate

// Price the customer actually pays for one unit
export const unitPrice = (product) =>
  product.discountPrice > 0 ? product.discountPrice : product.price;

// Round to cents so floating point errors (0.1 + 0.2) never show up
const round = (n) => Math.round(n * 100) / 100;

export const calculateTotals = (items) => {
  const subtotal = round(
    items.reduce((sum, i) => sum + unitPrice(i) * i.quantity, 0)
  );
  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = round(subtotal * TAX_RATE);
  const total = round(subtotal + shipping + tax);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  return { subtotal, shipping, tax, total, itemCount };
};