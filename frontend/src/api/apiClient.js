import axios from "axios";

// ==========================================
// CENTRALIZED API CLIENT CONFIGURATION
// ==========================================
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:3900/api");

export const BASE_SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  (import.meta.env.PROD ? "" : "http://localhost:3900");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach Authorization header if token exists in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error messaging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
