// lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor لإضافة Authorization Header تلقائيًا
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token"); // توكن PHP
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
