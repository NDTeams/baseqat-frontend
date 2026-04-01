import api from "@/lib/axios";

interface ApiResponse {
  succeeded: boolean;
  message: string;
  errors?: string[];
  data?: any;
  pageNumber?: number;
  pageSize?: number;
  totalCount?: number;
}

export const LoginLogsService = {
  getAll: async (params?: Record<string, any>): Promise<ApiResponse> => {
    const res = await api.get("/LoginLog/GetAll", { params });
    return res.data;
  },

  getByUser: async (userId: string, params?: Record<string, any>): Promise<ApiResponse> => {
    const res = await api.get("/LoginLog/GetByUser", {
      params: { userId, ...params },
    });
    return res.data;
  },

  getMyLogs: async (params?: Record<string, any>): Promise<ApiResponse> => {
    const res = await api.get("/LoginLog/GetMyLogs", { params });
    return res.data;
  },
};
