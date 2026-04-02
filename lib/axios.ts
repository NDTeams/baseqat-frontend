import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== Request Interceptor: Add Authorization from localStorage =====
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
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

    if (error.response?.status !== 401 || typeof window === "undefined") {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("Account/RefreshToken") || originalRequest.url?.includes("Account/LoginByEmail")) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      forceLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest)).catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const accessToken = localStorage.getItem("token") || "";
      const refreshToken = localStorage.getItem("refreshToken") || "";

      const res = await axios.post("/api/Account/RefreshToken", {
        accessToken,
        refreshToken,
      });

      const data = res.data;

      if (data.succeeded && data.data) {
        // Store new tokens
        localStorage.setItem("token", data.data.token);
        if (data.data.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }
        setTokenCookie(data.data.token);

        // Update user data
        if (data.data.fullName) {
          localStorage.setItem("user", JSON.stringify({
            name: data.data.fullName || "",
            email: data.data.email || "",
            userName: data.data.userName || "",
            roles: data.data.roles || [],
          }));
        }

        processQueue(null);
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

// ===== Helpers =====
function forceLogout() {
  localStorage.clear();
  sessionStorage.clear();
  clearTokenCookie();

  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
}

export function setTokenCookie(token: string) {
  if (typeof document !== "undefined") {
    document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
  }
}

export function clearTokenCookie() {
  if (typeof document !== "undefined") {
    document.cookie = "access_token=; path=/; max-age=0";
    document.cookie = "auth_token=; path=/; max-age=0";
  }
}

export default api;
