import api from "./api";

export const createOrderRequest = async (shippingAddress, paymentMethod) =>
  (await api.post("/orders", { shippingAddress, paymentMethod })).data;

export const fetchOrderById = async (id) => (await api.get(`/orders/${id}`)).data;

export const fetchMyOrders = async () => (await api.get("/orders")).data;