import api from "./api";

// The server only needs ids and choices, never prices
const toPayload = (items) => ({
  items: items.map((i) => ({
    productId: i._id,
    size: i.size,
    color: i.color,
    quantity: i.quantity,
  })),
});

export const fetchCart = async () => (await api.get("/cart")).data;
export const saveCartRequest = async (items) => (await api.put("/cart", toPayload(items))).data;
export const mergeCartRequest = async (items) => (await api.post("/cart/merge", toPayload(items))).data;