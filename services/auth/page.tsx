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
    const res = await api.post("/Account/LoginByEmail", { email, password: pass });
    const responseData = res.data;
    
    // التحقق من النجاح وحفظ التوكن
    if (responseData.succeeded && responseData.data?.token) {
      Cookies.set("auth_token", responseData.data.token, { expires: 7 });
    }
    
    return responseData;
  },

  // نسيت كلمة المرور
  forgetPassword: async (email: string): Promise<ApiResponse> => {
    const res = await api.post(`/Account/ForgetPasswordByEmail?email=${encodeURIComponent(email)}`);
    return res.data;
  },
    
  // تسجيل الخروج
  logout: () => {
    Cookies.remove("auth_token");
    window.location.href = "/login";
  }
};

export const DashboardService = {
  getUsers: () => api.get("/dashboard/users"),
  createUser: (data: any) => api.post("/dashboard/users", data),
  deleteUser: (id: number) => api.post("/dashboard/delete-user", { id }),
};