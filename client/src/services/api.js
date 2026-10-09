import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Runs before EVERY request: attach the token if we have one
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("attirehub_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // localStorage unavailable: continue as a guest
  }
  return config;
});

export default api;