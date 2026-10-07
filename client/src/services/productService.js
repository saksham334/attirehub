import api from "./api";

// params is an object like { category: "Men", page: 2 }
export const fetchProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data; // { products, total, page, pages, count }
};

export const fetchFilterOptions = async () => {
  const { data } = await api.get("/products/filters");
  return data;
};

export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const fetchRelatedProducts = async (id) => {
  const { data } = await api.get(`/products/${id}/related`);
  return data;
};