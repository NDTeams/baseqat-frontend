import api from "@/lib/axios";
import Cookies from "js-cookie";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UnlockRequest {
  password: string;
}

export interface AuthResponse {
  succeeded: boolean;
  message?: string;
  data?: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

class AuthService {
  /**
   * تسجيل الدخول
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);

      if (response.data.succeeded && response.data.data?.token) {
        // حفظ التوكن في الكوكيز
        Cookies.set("auth_token", response.data.data.token, { expires: 7 });
        // حفظ معلومات المستخدم
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      return {
        succeeded: false,
        message: error.response?.data?.message || "فشل تسجيل الدخول",
      };
    }
  }

  /**
   * فتح قفل الشاشة
   */
  async unlock(request: UnlockRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/unlock", request);
      return response.data;
    } catch (error: any) {
      return {
        succeeded: false,
        message: error.response?.data?.message || "كلمة المرور غير صحيحة",
      };
    }
  }

  /**
   * تسجيل الخروج
   */
  async logout(): Promise<void> {
    try {
      // إرسال طلب تسجيل الخروج للباك اند لإلغاء التوكن
      const token = Cookies.get("auth_token");
      if (token) {
        await api.post("/auth/logout", {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // حذف التوكن من الكوكيز بجميع المسارات
      Cookies.remove("auth_token", { path: "/" });
      Cookies.remove("auth_token");

      // حذف جميع البيانات من localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");

      // حذف جميع البيانات من sessionStorage
      sessionStorage.clear();

      // إعادة توجيه إلى صفحة تسجيل الدخول مع إعادة تحميل كاملة
      window.location.href = "/login";
    }
  }

  /**
   * الحصول على معلومات المستخدم الحالي
   */
  getCurrentUser() {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * التحقق من وجود توكن
   */
  isAuthenticated(): boolean {
    return !!Cookies.get("auth_token");
  }

  /**
   * التحقق من دور المستخدم
   */
  hasRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  }

  /**
   * التحقق من إمكانية الوصول للوحة التحكم
   */
  canAccessAdminDashboard(): boolean {
    return this.hasRole(['admin', 'BASEQATEMPLOYEE', 'SUPERADMIN']);
  }
}

export default new AuthService();
