import api from "./api";

export const fetchStats = async () => (await api.get("/admin/stats")).data;

export const fetchAdminOrders = async (status) =>
  (await api.get("/admin/orders", { params: status ? { status } : {} })).data;

export const updateOrderStatusRequest = async (id, status) =>
  (await api.put(`/admin/orders/${id}`, { status })).data;

export const fetchAdminUsers = async () => (await api.get("/admin/users")).data;

export const updateUserRoleRequest = async (id, role) =>
  (await api.put(`/admin/users/${id}/role`, { role })).data;