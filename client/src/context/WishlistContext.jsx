import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { addWishlistItem, fetchWishlist, removeWishlistItem } from "../services/wishlistService";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useState([]); // just ids: enough to color the hearts

  // Load when a user logs in; clear on logout
  useEffect(() => {
    let ignore = false;
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIds([]);
      return;
    }
    fetchWishlist()
      .then((products) => { if (!ignore) setIds(products.map((p) => p._id)); })
      .catch((err) => console.error(err));
    return () => { ignore = true; };
  }, [user]);

  const isInWishlist = (productId) => ids.includes(productId);

  // Returns false if the user is not logged in so the caller can redirect
  const toggle = async (productId) => {
    if (!user) return false;
    const had = ids.includes(productId);
    // Optimistic update: change the heart immediately, undo if the server fails
    setIds((cur) => (had ? cur.filter((i) => i !== productId) : [...cur, productId]));
    try {
      if (had) await removeWishlistItem(productId);
      else await addWishlistItem(productId);
    } catch (err) {
      console.error(err);
      setIds((cur) => (had ? [...cur, productId] : cur.filter((i) => i !== productId)));
    }
    return true;
  };

  return (
    <WishlistContext.Provider value={{ ids, count: ids.length, isInWishlist, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
};