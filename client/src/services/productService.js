import api from "./api";

// Fetch all products from the backend
export const fetchProducts = async () => {
  const { data } = await api.get("/products");
  return data.products;
};