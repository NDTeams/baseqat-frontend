import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send HttpOnly cookies automatically
});

// ===== Token Refresh State =====
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// ===== Response Interceptor with Auto-Refresh =====
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only handle 401 errors on client-side
    if (error.response?.status !== 401 || typeof window === "undefined") {
      return Promise.reject(error);
    }

    // Don't retry refresh/login requests (avoid infinite loop)
    if (originalRequest.url?.includes("Account/RefreshToken") || originalRequest.url?.includes("Account/LoginByEmail")) {
      return Promise.reject(error);
    }

    // Don't retry if already retried
    if (originalRequest._retry) {
      forceLogout();
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        return api(originalRequest);
      }).catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // HttpOnly cookies (access_token, refresh_token) are sent automatically
      const res = await axios.post("/api/Account/RefreshToken", {}, { withCredentials: true });

      const data = res.data;

      if (data.succeeded && data.data) {
        // Update user data in localStorage
        if (data.data.fullName) {
          const userData = {
            name: data.data.fullName || "",
            email: data.data.email || "",
            userName: data.data.userName || "",
            roles: data.data.roles || [],
          };
          localStorage.setItem("user", JSON.stringify(userData));
        }

        processQueue(null);

        // Retry original request (new HttpOnly cookies are set automatically)
        return api(originalRequest);
      } else {
        throw new Error("Refresh failed");
      }
    } catch (refreshError) {
      processQueue(refreshError);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// ===== Force Logout Helper =====
function forceLogout() {
  localStorage.clear();
  sessionStorage.clear();

  // Try to clear HttpOnly cookies via logout API (fire-and-forget)
  try {
    axios.post("/api/Account/logout", {}, { withCredentials: true }).catch(() => {});
  } catch {}

  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
}

export default api;
