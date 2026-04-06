import api, { setTokenCookie, clearTokenCookie } from "@/lib/axios";

interface ApiResponse {
  succeeded: boolean;
  message: string;
  errors?: string[];
  data?: any;
}

export const AuthService = {
  register: async (data: any): Promise<ApiResponse> => {
    const res = await api.post("/Account/Register", data);
    return res.data;
  },

  login: async (email: string, pass: string, rememberMe: boolean = false): Promise<ApiResponse> => {
    const res = await api.post("Account/LoginByEmail", { email, password: pass, rememberMe });
    const responseData = res.data;

    if (responseData.succeeded && responseData.data) {
      // Store tokens
      localStorage.setItem("token", responseData.data.token);
      if (responseData.data.refreshToken) {
        localStorage.setItem("refreshToken", responseData.data.refreshToken);
      }

      // Set cookie for middleware route protection
      setTokenCookie(responseData.data.token);

      // Store user info
      const userData = {
        name: responseData.data.fullName || "",
        email: responseData.data.email || "",
        userName: responseData.data.userName || "",
        roles: responseData.data.roles || [],
        isEmailConfirmed: responseData.data.isEmailConfirmed ?? true,
      };
      localStorage.setItem("user", JSON.stringify(userData));
    }

    return responseData;
  },

  forgetPassword: async (email: string): Promise<ApiResponse> => {
    const res = await api.post(`/Account/ForgetPasswordByEmail?email=${encodeURIComponent(email)}`);
    return res.data;
  },

  resetPassword: async (email: string, token: string, newPassword: string): Promise<ApiResponse> => {
    const res = await api.post("/Account/ResetPassword", { email, token, newPassword });
    return res.data;
  },

  logout: async () => {
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
  },
};
