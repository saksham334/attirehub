import axios from "axios";

// One configured Axios instance used by every API call in the app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export default api;