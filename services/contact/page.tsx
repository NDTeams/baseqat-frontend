import api from "@/lib/axios";
import { ApiResponse, PagedResponse, PaginationParams } from "@/services/courses/page";

// ===== Enums =====
export enum ContactRequestStatus {
  New = 1,
  InProgress = 2,
  Closed = 3,
}

export enum ReplyChannel {
  Email = 0,
  WhatsApp = 1,
  Phone = 2,
}

// ===== Types =====
export interface ContactRequest {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  requestType: string;
  message: string;
  preferredReplyChannel?: ReplyChannel | null;
  status: ContactRequestStatus;
  adminReplyMessage?: string | null;
  repliedVia?: ReplyChannel | null;
  createdAt: string;
  repliedAt?: string | null;
  closedAt?: string | null;
  handledBy?: string | null;
}

export interface ContactRequestCreateDto {
  fullName: string;
  email: string;
  phoneNumber?: string;
  requestType?: string;
  message: string;
  preferredReplyChannel?: ReplyChannel | null;
}

export interface ContactRequestFilter {
  id?: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  requestType?: string;
  status?: ContactRequestStatus;
  preferredReplyChannel?: ReplyChannel;
  repliedVia?: ReplyChannel;
}

export interface ContactRequestReplyDto {
  replyMessage: string;
  replyChannel: ReplyChannel;
  closeRequest: boolean;
}

export interface ContactRequestStatusUpdateDto {
  status: ContactRequestStatus;
}

// ===== Public Service =====
export const ContactRequestPublicService = {
  send: async (data: ContactRequestCreateDto): Promise<ApiResponse<ContactRequest>> => {
    const res = await api.post("/ContactRequest/Send", {
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber || "",
      requestType: data.requestType || "استفسار عام",
      message: data.message,
      preferredReplyChannel: data.preferredReplyChannel ?? null,
    });
    return res.data;
  },
};

// ===== Admin Service =====
export const ContactRequestAdminService = {
  getAllPaged: async (
    pagination: PaginationParams,
    filter?: ContactRequestFilter
  ): Promise<PagedResponse<ContactRequest>> => {
    const res = await api.get("/ContactRequest/GetAllAsync", {
      params: {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        id: filter?.id,
        fullName: filter?.fullName,
        email: filter?.email,
        phoneNumber: filter?.phoneNumber,
        requestType: filter?.requestType,
        status: filter?.status,
        preferredReplyChannel: filter?.preferredReplyChannel,
        repliedVia: filter?.repliedVia,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<ContactRequest>> => {
    const res = await api.get(`/ContactRequest/${id}`);
    return res.data;
  },

  updateStatus: async (
    id: number,
    data: ContactRequestStatusUpdateDto
  ): Promise<ApiResponse<ContactRequest>> => {
    const res = await api.put(`/ContactRequest/UpdateStatus/${id}`, data);
    return res.data;
  },

  reply: async (
    id: number,
    data: ContactRequestReplyDto
  ): Promise<ApiResponse<ContactRequest>> => {
    const res = await api.put(`/ContactRequest/Reply/${id}`, data);
    return res.data;
  },

  softDelete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await api.put(`/ContactRequest/SoftDelete/${id}`);
    return res.data;
  },
};
