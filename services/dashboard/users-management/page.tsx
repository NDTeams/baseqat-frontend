// services/dashboard/users-management/page.ts
import api from "@/lib/axios";

interface ApiResponse {
  succeeded: boolean;
  message: string;
  errors?: string[];
  data?: any;
}

export const UsersManagement = {
  allUsers: async (params?: Record<string, any>): Promise<ApiResponse> => {
    const res = await api.get("/UsersManagement/AllUsers", { params });
    return res.data;
  },

  AddBaseqatEmployee: async (data: any): Promise<ApiResponse> => {
    const res = await api.post("/UsersManagement/AddBaseqatEmployee", data);
    return res.data;
  },

  UpdateBaseqatEmployee: async (userId: string, data: any): Promise<ApiResponse> => {
    const res = await api.put(`/UsersManagement/UpdateBaseqatEmployee/${userId}`, data);
    return res.data;
  },

  DeleteBaseqatEmployee: async (userId: string): Promise<ApiResponse> => {
    const res = await api.delete(`/UsersManagement/DeleteUser/${userId}`);
    return res.data;
  },




  
  GetAllUserPriviliges: async (userId: string): Promise<ApiResponse> => {
    const res = await api.post(`/UsersManagement/GetAllUserPriviliges?userId=${userId}`);
    return res.data;
  },

  GetUserInfo: async (userId: string): Promise<ApiResponse> => {
    const res = await api.get(`/UsersManagement/GetUserInfo?userId=${userId}`);
    return res.data;
  },

  LockUser: async (userId: string): Promise<ApiResponse> => {
    const res = await api.post(`/UsersManagement/LockUser?userId=${userId}`);
    return res.data;
  },

  UnlockUser: async (userId: string): Promise<ApiResponse> => {
    const res = await api.post(`/UsersManagement/UnlockUser?userId=${userId}`);
    return res.data;
  },

  GetUserRelatedData: async (userId: string): Promise<ApiResponse> => {
    const res = await api.get(`/UsersManagement/GetUserRelatedData/${userId}`);
    return res.data;
  },

  DeleteUserWithData: async (userId: string): Promise<ApiResponse> => {
    const res = await api.delete(`/UsersManagement/DeleteUserWithData/${userId}`);
    return res.data;
  },

  ActivateUser: async (userId: string): Promise<ApiResponse> => {
    const res = await api.post(`/UsersManagement/ActivateUser?userId=${userId}`);
    return res.data;
  },

  DeactivateUser: async (userId: string): Promise<ApiResponse> => {
    const res = await api.post(`/UsersManagement/DeactivateUser?userId=${userId}`);
    return res.data;
  },
};