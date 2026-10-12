import api from "./api";

export const fetchStats = async () => (await api.get("/admin/stats")).data;

export const fetchAdminOrders = async (status) =>
  (await api.get("/admin/orders", { params: status ? { status } : {} })).data;

export const updateOrderStatusRequest = async (id, status) =>
  (await api.put(`/admin/orders/${id}`, { status })).data;

export const fetchAdminUsers = async () => (await api.get("/admin/users")).data;

export const updateUserRoleRequest = async (id, role) =>
  (await api.put(`/admin/users/${id}/role`, { role })).data;

export const fetchAdminProducts = async (params) =>
  (await api.get("/products", { params })).data;

export const fetchProductForEdit = async (id) => (await api.get(`/products/${id}`)).data;

export const createProductRequest = async (data) => (await api.post("/products", data)).data;

export const updateProductRequest = async (id, data) =>
  (await api.put(`/products/${id}`, data)).data;

export const deleteProductRequest = async (id) => (await api.delete(`/products/${id}`)).data;

export const fetchInventory = async () => (await api.get("/admin/inventory")).data;

export const updateStockRequest = async (id, stock) =>
  (await api.patch(`/admin/inventory/${id}`, { stock })).data;

