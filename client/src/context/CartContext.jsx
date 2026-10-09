import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { calculateTotals } from "../utils/calculateTotals";

const CartContext = createContext(null);
const STORAGE_KEY = "attirehub_cart";

// Read the saved cart once, safely (bad JSON must never crash the app)
const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Save on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Could not save cart", err);
    }
  }, [items]);

  // Same product + size + color = same cart line
  const lineId = (p, size, color) => `${p._id}-${size}-${color}`;

  const addItem = (product, size, color, quantity = 1) => {
    const id = lineId(product, size, color);
    setItems((current) => {
      const existing = current.find((i) => i.lineId === id);
      if (existing) {
        return current.map((i) =>
          i.lineId === id
            ? { ...i, quantity: Math.min(i.quantity + quantity, Math.min(i.stock, 10)) }
            : i
        );
      }
      return [
        ...current,
        {
          lineId: id,
          _id: product._id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          discountPrice: product.discountPrice,
          stock: product.stock,
          size,
          color,
          quantity: Math.min(quantity, product.stock, 10),
        },
      ];
    });
  };

  const updateQuantity = (id, quantity) =>
    setItems((current) =>
      current.map((i) =>
        i.lineId === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock, 10)) } : i
      )
    );

  const removeItem = (id) => setItems((current) => current.filter((i) => i.lineId !== id));
  const clearCart = () => setItems([]);

  // Recalculate only when items change
  const totals = useMemo(() => calculateTotals(items), [items]);

  const value = {
    items, ...totals,
    addItem, updateQuantity, removeItem, clearCart,
    drawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook so components write useCart() instead of useContext(CartContext)
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};