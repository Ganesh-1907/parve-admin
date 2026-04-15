import axios from "axios";
import { clearPersistedSession, getStoredToken, isTokenExpired } from "@/lib/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    if (isTokenExpired(token)) {
      clearPersistedSession();
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
      return Promise.reject(new Error("Session expired. Please log in again."));
    }

    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearPersistedSession();
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
