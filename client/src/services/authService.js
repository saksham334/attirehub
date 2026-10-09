import api from "./api";

export const registerRequest = async (name, email, password) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
};

export const loginRequest = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const fetchMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};