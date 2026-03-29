import api from "@/lib/axios";

// ===== Types =====
export interface ApiResponse<T = any> {
  succeeded: boolean;
  message: string;
  errors: null | string[];
  data: T;
}

export interface PagedResponse<T = any> {
  succeeded: boolean;
  message: string;
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export interface MediaItem {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  mediaType: number;
  mediaTypeName?: string;
  category?: string;
  // Article-specific
  author?: string;
  content?: string;
  readingTimeMinutes?: number;
  // Event-specific
  eventDate?: string;
  eventEndDate?: string;
  eventTime?: string;
  eventLocation?: string;
  // Media
  videoUrl?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface MediaCenterFilter {
  id?: number;
  title?: string;
  mediaType?: number;
  category?: string;
  isActive?: boolean | string;
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

// ===== Public Service (No Auth) =====
export const MediaCenterService = {
  async getActive(): Promise<ApiResponse<MediaItem[]>> {
    const res = await api.get("/MediaCenter/GetActive");
    return res.data;
  },

  async getActiveByType(type: number): Promise<ApiResponse<MediaItem[]>> {
    const res = await api.get(`/MediaCenter/GetActiveByType/${type}`);
    return res.data;
  },

  async getActiveById(id: number): Promise<ApiResponse<MediaItem>> {
    const res = await api.get(`/MediaCenter/GetActiveById/${id}`);
    return res.data;
  },
};

// ===== Admin Service (Requires Auth) =====
export const MediaCenterAdminService = {
  async getAllPaged(
    pagination: PaginationParams,
    filter?: MediaCenterFilter
  ): Promise<PagedResponse<MediaItem>> {
    const params: any = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    };
    if (filter) {
      if (filter.title) params.title = filter.title;
      if (filter.mediaType !== undefined && filter.mediaType !== null)
        params.mediaType = filter.mediaType;
      if (filter.category) params.category = filter.category;
      if (filter.isActive !== undefined && filter.isActive !== "")
        params.isActive = filter.isActive;
    }
    const res = await api.get("/MediaCenter/GetAllAsync", { params });
    return res.data;
  },

  async getById(id: number): Promise<ApiResponse<MediaItem>> {
    const res = await api.get(`/MediaCenter/${id}`);
    return res.data;
  },

  async add(data: Partial<MediaItem>): Promise<ApiResponse<MediaItem>> {
    const res = await api.post("/MediaCenter/Add", data);
    return res.data;
  },

  async update(
    id: number,
    data: Partial<MediaItem>
  ): Promise<ApiResponse<MediaItem>> {
    const res = await api.put(`/MediaCenter/Update/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<ApiResponse<string>> {
    const res = await api.delete(`/MediaCenter/Delete/${id}`);
    return res.data;
  },

  async softDelete(id: number): Promise<ApiResponse<string>> {
    const res = await api.put(`/MediaCenter/SoftDelete/${id}`);
    return res.data;
  },

  async getDeleted(): Promise<ApiResponse<MediaItem[]>> {
    const res = await api.get("/MediaCenter/GetDeleted");
    return res.data;
  },

  async restore(id: number): Promise<ApiResponse<MediaItem>> {
    const res = await api.put(`/MediaCenter/Restore/${id}`);
    return res.data;
  },

  async uploadImage(
    id: number,
    file: File
  ): Promise<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`/MediaCenter/UploadImage/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
