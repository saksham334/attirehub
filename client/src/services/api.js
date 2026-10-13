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

// If the server says our token is no longer valid, clear it and go to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthCall = url.startsWith("/auth/login") || url.startsWith("/auth/register");
    if (error.response?.status === 401 && !isAuthCall) {
      try {
        if (localStorage.getItem("attirehub_token")) {
          localStorage.removeItem("attirehub_token");
          window.location.assign("/login");
        }
      } catch { /* ignore */ }
    }
    return Promise.reject(error);
  }
);

export default api;