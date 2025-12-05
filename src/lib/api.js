// src/lib/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) {
    // Let browser set boundary
    delete config.headers?.["Content-Type"];
  } else {
    config.headers["Content-Type"] =
      config.headers["Content-Type"] || "application/json";
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const err = {
      status: error.response?.status || null,
      message:
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message ||
        "Request failed",
      data: error.response?.data,
    };
    return Promise.reject(err);
  }
);

export default api;
