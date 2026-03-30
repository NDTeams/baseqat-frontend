// // lib/axios.ts
// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor لإضافة Authorization Header تلقائيًا
// api.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("token"); // توكن PHP
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  // استخدام رابط محلي (سيتم توجيهه عبر Next.js rewrites)
  baseURL: "/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة التوكن تلقائياً لكل طلب يخرج من التطبيق
api.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// معالجة الأخطاء العالمية
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // التحقق من أننا في جهة العميل (Client-side) قبل استخدام window
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // لا نعيد التوجيه تلقائياً للـ login، فقط نحذف التوكن
      // سيتم التعامل مع إعادة التوجيه من خلال middleware أو الصفحة نفسها
      Cookies.remove("auth_token");
      Cookies.remove("auth_token", { path: "/" });
      localStorage.clear();
      sessionStorage.clear();
    }
    return Promise.reject(error);
  }
);

export default api;