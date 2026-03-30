// api/dashboard/users.api.ts
import api from "@/lib/axios";
import Cookies from "js-cookie";

// واجهة الاستجابة من API
interface ApiResponse {
  succeeded: boolean;
  message: string;
  errors?: string[];
  data?: any;
}

export const AuthService = {
  // تسجيل حساب جديد
  register: async (data: any): Promise<ApiResponse> => {
    const res = await api.post("/Account/Register", data);
    return res.data;
  },

  // تسجيل دخول وحفظ التوكن
  login: async (email: string, pass: string): Promise<ApiResponse> => {
    const res = await api.post("Account/LoginByEmail", { email, password: pass });
    const responseData = res.data;
    
    // التحقق من النجاح وحفظ التوكن
    if (responseData.succeeded && responseData.data?.token) {
      Cookies.set("auth_token", responseData.data.token, { expires: 5 });
    }
    
    return responseData;
  },

  // نسيت كلمة المرور
  forgetPassword: async (email: string): Promise<ApiResponse> => {
    const res = await api.post(`/Account/ForgetPasswordByEmail?email=${encodeURIComponent(email)}`);
    return res.data;
  },
    
  // إعادة تعيين كلمة المرور
  resetPassword: async (email: string, token: string, newPassword: string): Promise<ApiResponse> => {
    const res = await api.post("/Account/ResetPassword", { email, token, newPassword });
    return res.data;
  },

  // تسجيل الخروج
  logout: async () => {
    try {
      // إرسال طلب تسجيل الخروج للباك اند لإلغاء التوكن
      const token = Cookies.get("auth_token");
      if (token) {
        await api.post("/Account/logout", {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // حذف التوكن من الكوكيز بجميع الطرق الممكنة
      Cookies.remove("auth_token", { path: "/" });
      Cookies.remove("auth_token", { path: "/", domain: window.location.hostname });
      Cookies.remove("auth_token");

      // حذف أي كوكيز أخرى قد تكون موجودة
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // حذف جميع البيانات من localStorage
      localStorage.clear();

      // حذف جميع البيانات من sessionStorage
      sessionStorage.clear();

      // إعادة توجيه إلى الصفحة الرئيسية مع إعادة تحميل كاملة
      window.location.href = "/";
    }
  }
};

// export const DashboardService = {
//   getUsers: () => api.get("/dashboard/users"),
//   createUser: (data: any) => api.post("/dashboard/users", data),
//   deleteUser: (id: number) => api.post("/dashboard/delete-user", { id }),
// };