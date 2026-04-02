import api, { clearTokenCookie } from "@/lib/axios";

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
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/Account/LoginByEmail", credentials);

      if (response.data.succeeded && response.data.data?.user) {
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

  async logout(): Promise<void> {
    try {
      await api.post("/Account/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      clearTokenCookie();
      window.location.href = "/";
    }
  }

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

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  }

  hasRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    const userRoles = user.roles || (user.role ? [user.role] : []);
    return userRoles.some((r: string) => roles.includes(r));
  }

  canAccessAdminDashboard(): boolean {
    return this.hasRole(['admin', 'Admin', 'BASEQATEMPLOYEE', 'BaseqatEmployee', 'SUPERADMIN', 'SuperAdmin']);
  }
}

export default new AuthService();
