import api from "./api";

export const fetchWishlist = async () => (await api.get("/wishlist")).data;
export const addWishlistItem = (productId) => api.post("/wishlist", { productId });
export const removeWishlistItem = (productId) => api.delete(`/wishlist/${productId}`);