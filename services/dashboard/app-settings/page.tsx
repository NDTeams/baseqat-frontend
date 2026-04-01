import api from "@/lib/axios";

interface ApiResponse {
  succeeded: boolean;
  message: string;
  data?: any;
}

export const AppSettingsService = {
  getAll: async (): Promise<ApiResponse> => {
    const res = await api.get("/AppSettings/GetAll");
    return res.data;
  },

  getByKey: async (key: string): Promise<ApiResponse> => {
    const res = await api.get(`/AppSettings/GetByKey?key=${key}`);
    return res.data;
  },

  update: async (key: string, value: string): Promise<ApiResponse> => {
    const res = await api.put(`/AppSettings/Update?key=${key}&value=${value}`);
    return res.data;
  },
};
