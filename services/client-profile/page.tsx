import api from "@/lib/axios";
import { ApiResponse } from "@/services/courses/page";

// ===== Types =====
export interface ProfileCompletionDetails {
  hasFullName: boolean;
  hasProfilePicture: boolean;
  hasPhoneNumber: boolean;
  hasDateOfBirth: boolean;
  hasBio: boolean;
  hasAddress: boolean;
  hasGender: boolean;
  hasCv: boolean;
}

export interface ClientProfileData {
  id: number;
  userId: string;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  profilePictureUrl: string | null;
  joinedDate: string;
  lastLogin: string | null;
  bio: string | null;
  address: string | null;
  region: string | null;
  city: string | null;
  gender: number;
  genderName: string;
  cvUrl: string | null;
  skills: string[];
  interests: string[];
  linkedInUrl: string | null;
  xUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  gitHubUrl: string | null;
  websiteUrl: string | null;
  profileCompletion: number;
  completionDetails: ProfileCompletionDetails;
}

export interface UpdateProfileData {
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  bio?: string;
  address?: string;
  region?: string;
  city?: string;
  gender?: number;
  skills?: string[];
  interests?: string[];
  linkedInUrl?: string;
  xUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  gitHubUrl?: string;
  websiteUrl?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ClientStats {
  totalEnrollments: number;
  certificateCount: number;
  totalLearningHours: number;
}

// ===== Service =====
export const ClientProfileService = {
  getMyProfile: async (): Promise<ApiResponse<ClientProfileData>> => {
    const res = await api.get("/ClientProfile/GetMyProfile");
    return res.data;
  },

  updateMyProfile: async (
    data: UpdateProfileData
  ): Promise<ApiResponse<ClientProfileData>> => {
    const res = await api.put("/ClientProfile/UpdateMyProfile", data);
    return res.data;
  },

  uploadAvatar: async (
    file: File
  ): Promise<ApiResponse<{ profilePictureUrl: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/ClientProfile/UploadAvatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  deleteAvatar: async (): Promise<ApiResponse<string>> => {
    const res = await api.delete("/ClientProfile/DeleteAvatar");
    return res.data;
  },

  uploadCv: async (
    file: File
  ): Promise<ApiResponse<{ cvUrl: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/ClientProfile/UploadCv", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  deleteCv: async (): Promise<ApiResponse<string>> => {
    const res = await api.delete("/ClientProfile/DeleteCv");
    return res.data;
  },

  changePassword: async (
    data: ChangePasswordData
  ): Promise<ApiResponse<string>> => {
    const res = await api.post("/ClientProfile/ChangePassword", data);
    return res.data;
  },

  getMyStats: async (): Promise<ApiResponse<ClientStats>> => {
    const res = await api.get("/ClientProfile/GetMyStats");
    return res.data;
  },
};
