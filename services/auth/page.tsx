// api/dashboard/users.api.ts
import api from "@/lib/axios";
import Cookies from "js-cookie";

export const AuthService = {
  // تسجيل حساب جديد
  register: (data: any) => api.get("api/UsersManagement/AllUsers", data),

  // تسجيل دخول وحفظ التوكن
  login: async (email: string, pass: string) => {
    const res = await api.post("api/Account/LoginByEmail", { email, password: pass });
    if (res.data.token) {
      Cookies.set("auth_token", res.data.token, { expires: 7 }); // حفظ لمدة 7 أيام
    }
    return res.data;
  },

  // نسيت كلمة المرور
  forgetPassword: (email: string) => 
    api.post(`/api/Account/ForgetPasswordByEmail?email=${encodeURIComponent(email)}`),
    
  // تسجيل الخروج
  logout: () => {
    Cookies.remove("auth_token");
    window.location.href = "/login";
  }
};

export const DashboardService = {
  getUsers: () => api.get("/dashboard/users.php"),
  createUser: (data: any) => api.post("/dashboard/users.php", data),
  deleteUser: (id: number) => api.post("/dashboard/delete-user.php", { id }),
};