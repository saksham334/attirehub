import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { calculateTotals } from "../utils/calculateTotals";
import { useAuth } from "./AuthContext";
import { mergeCartRequest, saveCartRequest } from "../services/cartService";

const CartContext = createContext(null);
const STORAGE_KEY = "attirehub_cart";

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState(loadCart);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // true only after the server cart has been loaded for the current user
  const [synced, setSynced] = useState(false);
  const userId = user?._id;
  const lastUserId = useRef(null);

  // Keep localStorage updated for guests only
  useEffect(() => {
    if (userId) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Could not save cart", err);
    }
  }, [items, userId]);

  // When the user changes (login, logout, session restored): sync with the server
  useEffect(() => {
    if (authLoading) return;
    let ignore = false;

    if (userId) {
      // Logged in: merge the guest cart into the saved cart
      mergeCartRequest(loadCart())
        .then((serverItems) => {
          if (ignore) return;
          setItems(serverItems);
          try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
          lastUserId.current = userId;
          setSynced(true);
        })
        .catch((err) => console.error("Cart sync failed", err));
    } else if (lastUserId.current) {
      // Just logged out: clear the previous user's cart from the screen
      lastUserId.current = null;
      setItems([]);
      setSynced(false);
    }

    return () => { ignore = true; };
  }, [userId, authLoading]);

  // Save changes to the server (logged-in users, after the first sync)
  const firstSave = useRef(true);
  useEffect(() => {
    if (!userId || !synced) return;
    // Skip the save that happens right after loading from the server
    if (firstSave.current) {
      firstSave.current = false;
      return;
    }
    const timer = setTimeout(() => {
      saveCartRequest(items).catch((err) => console.error("Cart save failed", err));
    }, 500); // wait for quick clicks to settle
    return () => clearTimeout(timer);
  }, [items, userId, synced]);

  // Reset the "skip first save" flag when the user changes
  useEffect(() => {
    firstSave.current = true;
  }, [userId]);

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

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};