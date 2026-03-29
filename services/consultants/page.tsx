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

export interface Consultant {
  id: number;
  userId?: string;
  userEmail?: string;
  userPhoneNumber?: string;
  name: string;
  title: string;
  bio?: string;
  avatarUrl?: string;
  cvUrl?: string;
  gender: number;
  genderName?: string;
  rating?: number;
  isActive: boolean;
  yearsOfExperience?: number;
  specialty?: string;
  hourlyRate?: number;
  availability?: string;
  linkedInUrl?: string;
  xUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  submittedByUserId?: string;
  requestStatus?: number;
  requestStatusName?: string;
  reviewedByUserId?: string;
  reviewedAt?: string;
  denialReason?: string;
  createdAt?: string;
}

export interface ConsultationCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  consultantCount?: number;
}

export interface ConsultantDetail extends Consultant {
  skills: ConsultantSkill[];
  categories: ConsultationCategory[];
}

export interface ConsultantSkill {
  id: number;
  consultantId?: number;
  name: string;
}

export interface CheckEmailResponse {
  exists: boolean;
  isInstructor?: boolean;
  isConsultant?: boolean;
  hasConsultantRecord?: boolean;
  userName?: string;
  instructorName?: string;
  instructorTitle?: string;
  instructorBio?: string;
  instructorGender?: number;
  instructorYearsOfExperience?: number;
}

export interface ConsultantFilter {
  id?: number;
  name?: string;
  title?: string;
  specialty?: string;
  gender?: number;
  isActive?: boolean | string;
}

export interface ConsultantSkillFilter {
  id?: number;
  consultantId?: number;
  name?: string;
}

export interface ConsultationRequest {
  id: number;
  consultantId?: number | null;
  consultantName?: string;
  consultationCategoryId: number;
  consultationCategoryName?: string;
  userId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  subject: string;
  message: string;
  preferredDate?: string;
  preferredTime?: string;
  status: number;
  statusName?: string;
  adminNotes?: string;
  consultantResponse?: number;
  consultantResponseName?: string;
  consultantNotes?: string;
  suggestedDate?: string;
  suggestedTime?: string;
  zoomLink?: string;
  createdAt?: string;
}

export interface ConsultantResponsePayload {
  responseType: number;
  consultantNotes?: string;
  suggestedDate?: string;
  suggestedTime?: string;
}

export interface ConsultationRequestFilter {
  id?: number;
  consultantId?: number;
  consultationCategoryId?: number;
  clientName?: string;
  status?: number;
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

// ===== Public Service (No Auth) =====
export const ConsultantPublicService = {
  async getActive(): Promise<ApiResponse<ConsultantDetail[]>> {
    const res = await api.get("/Consultant/GetActive");
    return res.data;
  },

  async getActiveById(id: number): Promise<ApiResponse<ConsultantDetail>> {
    const res = await api.get(`/Consultant/GetActiveById/${id}`);
    return res.data;
  },
};

// ===== Admin Service (Requires Auth) =====
export const ConsultantAdminService = {
  async getAll(): Promise<ApiResponse<Consultant[]>> {
    const res = await api.get("/Consultant/GetAll");
    return res.data;
  },

  async getAllPaged(
    pagination: PaginationParams,
    filter?: ConsultantFilter
  ): Promise<PagedResponse<Consultant>> {
    const params: any = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    };
    if (filter) {
      if (filter.name) params.name = filter.name;
      if (filter.title) params.title = filter.title;
      if (filter.specialty) params.specialty = filter.specialty;
      if (filter.gender !== undefined && filter.gender !== null)
        params.gender = filter.gender;
      if (filter.isActive !== undefined && filter.isActive !== "")
        params.isActive = filter.isActive;
    }
    const res = await api.get("/Consultant/GetAllAsync", { params });
    return res.data;
  },

  async getById(id: number): Promise<ApiResponse<Consultant>> {
    const res = await api.get(`/Consultant/${id}`);
    return res.data;
  },

  async add(data: Partial<Consultant>): Promise<ApiResponse<Consultant>> {
    const res = await api.post("/Consultant/Add", data);
    return res.data;
  },

  async addWithAccount(data: {
    name: string;
    title: string;
    bio?: string;
    gender: number;
    yearsOfExperience?: number;
    specialty?: string;
    hourlyRate?: number;
    availability?: string;
    categoryIds?: number[];
    linkedInUrl?: string;
    xUrl?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    email: string;
    phoneNumber: string;
    password: string;
  }): Promise<ApiResponse<Consultant>> {
    const res = await api.post("/Consultant/AddWithAccount", data);
    return res.data;
  },

  async checkEmail(email: string): Promise<ApiResponse<CheckEmailResponse>> {
    const res = await api.get("/Consultant/CheckEmail", { params: { email } });
    return res.data;
  },

  async update(
    id: number,
    data: Partial<Consultant>
  ): Promise<ApiResponse<Consultant>> {
    const res = await api.put(`/Consultant/Update/${id}`, data);
    return res.data;
  },

  async uploadAvatar(
    id: number,
    file: File
  ): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`/Consultant/UploadAvatar/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async uploadCv(
    id: number,
    file: File
  ): Promise<ApiResponse<{ cvUrl: string }>> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`/Consultant/UploadCv/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async delete(id: number): Promise<ApiResponse<string>> {
    const res = await api.delete(`/Consultant/Delete/${id}`);
    return res.data;
  },

  async softDelete(id: number): Promise<ApiResponse<string>> {
    const res = await api.put(`/Consultant/SoftDelete/${id}`);
    return res.data;
  },

  async getDeleted(): Promise<ApiResponse<Consultant[]>> {
    const res = await api.get("/Consultant/GetDeleted");
    return res.data;
  },

  async restore(id: number): Promise<ApiResponse<Consultant>> {
    const res = await api.put(`/Consultant/Restore/${id}`);
    return res.data;
  },

  async activate(id: number): Promise<ApiResponse<string>> {
    const res = await api.put(`/Consultant/Activate/${id}`);
    return res.data;
  },

  async deactivate(id: number): Promise<ApiResponse<string>> {
    const res = await api.put(`/Consultant/Deactivate/${id}`);
    return res.data;
  },

  registerRequest: async (data: {
    name: string;
    title: string;
    bio?: string;
    gender: number;
    yearsOfExperience?: number;
    specialty?: string;
    hourlyRate?: number;
    availability?: string;
    linkedInUrl?: string;
    xUrl?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    skills?: string[];
    categoryIds?: number[];
    avatarFile?: File;
    cvFile?: File;
  }): Promise<ApiResponse<Consultant>> => {
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("Title", data.title);
    if (data.bio) formData.append("Bio", data.bio);
    formData.append("Gender", data.gender.toString());
    if (data.yearsOfExperience != null) formData.append("YearsOfExperience", data.yearsOfExperience.toString());
    if (data.specialty) formData.append("Specialty", data.specialty);
    if (data.hourlyRate != null) formData.append("HourlyRate", data.hourlyRate.toString());
    if (data.availability) formData.append("Availability", data.availability);
    if (data.linkedInUrl) formData.append("LinkedInUrl", data.linkedInUrl);
    if (data.xUrl) formData.append("XUrl", data.xUrl);
    if (data.instagramUrl) formData.append("InstagramUrl", data.instagramUrl);
    if (data.facebookUrl) formData.append("FacebookUrl", data.facebookUrl);
    if (data.skills?.length) data.skills.forEach(s => formData.append("Skills", s));
    if (data.categoryIds?.length) data.categoryIds.forEach(id => formData.append("CategoryIds", id.toString()));
    if (data.avatarFile) formData.append("avatarFile", data.avatarFile);
    if (data.cvFile) formData.append("cvFile", data.cvFile);
    const res = await api.postForm("/Consultant/RegisterRequest", formData);
    return res.data;
  },
};

// ===== Consultant Skill Admin Service =====
export const ConsultantSkillAdminService = {
  async getByConsultant(
    consultantId: number
  ): Promise<ApiResponse<ConsultantSkill[]>> {
    const res = await api.get(
      `/ConsultantSkill/GetByConsultantId/${consultantId}`
    );
    return res.data;
  },

  async add(data: {
    name: string;
    consultantId?: number;
  }): Promise<ApiResponse<ConsultantSkill>> {
    const res = await api.post("/ConsultantSkill/Add", data);
    return res.data;
  },

  async update(
    id: number,
    data: { name: string }
  ): Promise<ApiResponse<ConsultantSkill>> {
    const res = await api.put(`/ConsultantSkill/Update/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<ApiResponse<string>> {
    const res = await api.delete(`/ConsultantSkill/Delete/${id}`);
    return res.data;
  },
};

// ===== Consultation Request Service (Authenticated Client) =====
export const ConsultationRequestService = {
  async submit(data: {
    consultationCategoryId: number;
    subject: string;
    message: string;
    preferredDate?: string;
    preferredTime?: string;
  }): Promise<ApiResponse<ConsultationRequest>> {
    const res = await api.post("/ConsultationRequest/Submit", data);
    return res.data;
  },

  async getMyRequests(
    pagination: PaginationParams
  ): Promise<PagedResponse<ConsultationRequest>> {
    const params = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    };
    const res = await api.get("/ConsultationRequest/GetMyRequests", { params });
    return res.data;
  },

  async getMyAssignedRequests(
    pagination: PaginationParams,
    filter?: ConsultationRequestFilter
  ): Promise<PagedResponse<ConsultationRequest>> {
    const params: any = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    };
    if (filter) {
      if (filter.consultationCategoryId) params.consultationCategoryId = filter.consultationCategoryId;
      if (filter.clientName) params.clientName = filter.clientName;
      if (filter.status !== undefined && filter.status !== null) params.status = filter.status;
    }
    const res = await api.get("/ConsultationRequest/GetMyAssignedRequests", { params });
    return res.data;
  },

  async respondToRequest(
    id: number,
    data: ConsultantResponsePayload
  ): Promise<ApiResponse<ConsultationRequest>> {
    const res = await api.put(`/ConsultationRequest/RespondToRequest/${id}`, data);
    return res.data;
  },
};

// ===== Consultation Request Admin Service =====
export const ConsultationRequestAdminService = {
  async getAllPaged(
    pagination: PaginationParams,
    filter?: ConsultationRequestFilter
  ): Promise<PagedResponse<ConsultationRequest>> {
    const params: any = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    };
    if (filter) {
      if (filter.consultantId) params.consultantId = filter.consultantId;
      if (filter.consultationCategoryId) params.consultationCategoryId = filter.consultationCategoryId;
      if (filter.clientName) params.clientName = filter.clientName;
      if (filter.status !== undefined && filter.status !== null)
        params.status = filter.status;
    }
    const res = await api.get("/ConsultationRequest/GetAllAsync", { params });
    return res.data;
  },

  async getById(id: number): Promise<ApiResponse<ConsultationRequest>> {
    const res = await api.get(`/ConsultationRequest/GetById/${id}`);
    return res.data;
  },

  async assignConsultant(
    id: number,
    data: { consultantId: number; adminNotes?: string }
  ): Promise<ApiResponse<ConsultationRequest>> {
    const res = await api.put(
      `/ConsultationRequest/AssignConsultant/${id}`,
      data
    );
    return res.data;
  },

  async updateStatus(
    id: number,
    data: { status: number; adminNotes?: string; zoomLink?: string }
  ): Promise<ApiResponse<ConsultationRequest>> {
    const res = await api.put(
      `/ConsultationRequest/UpdateStatus/${id}`,
      data
    );
    return res.data;
  },

  async delete(id: number): Promise<ApiResponse<string>> {
    const res = await api.delete(`/ConsultationRequest/Delete/${id}`);
    return res.data;
  },
};

// ===== Calendar Types =====
export interface CalendarItem {
  id: number;
  subject: string;
  clientName: string;
  consultantName?: string;
  consultantId?: number | null;
  consultationCategoryName?: string;
  preferredDate?: string;
  preferredTime?: string;
  suggestedDate?: string;
  suggestedTime?: string;
  status: number;
  statusName?: string;
  zoomLink?: string;
}

export interface CalendarQuery {
  startDate: string;
  endDate: string;
  consultantId?: number;
  status?: number;
}

export interface ScheduleConflict {
  hasConflict: boolean;
  conflictingRequests: CalendarItem[];
}

// ===== Calendar Service (Admin) =====
export const ConsultationCalendarAdminService = {
  async getByDateRange(query: CalendarQuery): Promise<ApiResponse<CalendarItem[]>> {
    const res = await api.get("/ConsultationRequest/GetByDateRange", { params: query });
    return res.data;
  },

  async checkConflict(params: {
    consultantId: number;
    date: string;
    time?: string;
    excludeRequestId?: number;
  }): Promise<ApiResponse<ScheduleConflict>> {
    const res = await api.get("/ConsultationRequest/CheckConsultantConflict", { params });
    return res.data;
  },
};

// ===== Calendar Service (Client) =====
export const ConsultationCalendarClientService = {
  async getMyByDateRange(query: CalendarQuery): Promise<ApiResponse<CalendarItem[]>> {
    const res = await api.get("/ConsultationRequest/GetMyRequestsByDateRange", { params: query });
    return res.data;
  },
};

// ===== Calendar Service (Public) =====
export const ConsultationCalendarPublicService = {
  async getPublicCalendar(startDate: string, endDate: string): Promise<ApiResponse<CalendarItem[]>> {
    const res = await api.get("/ConsultationRequest/GetPublicCalendar", { params: { startDate, endDate } });
    return res.data;
  },
};

// ===== Consultation Category Public Service =====
export const ConsultationCategoryPublicService = {
  async getActive(): Promise<ApiResponse<ConsultationCategory[]>> {
    const res = await api.get("/ConsultationCategory/GetActive");
    return res.data;
  },
};

// ===== Consultation Category Admin Service =====
export const ConsultationCategoryAdminService = {
  async getAll(): Promise<ApiResponse<ConsultationCategory[]>> {
    const res = await api.get("/ConsultationCategory/GetAll");
    return res.data;
  },

  async getAllPaged(
    pagination: PaginationParams,
    filter?: { name?: string; isActive?: boolean | string }
  ): Promise<PagedResponse<ConsultationCategory>> {
    const params: any = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    };
    if (filter) {
      if (filter.name) params.name = filter.name;
      if (filter.isActive !== undefined && filter.isActive !== "")
        params.isActive = filter.isActive;
    }
    const res = await api.get("/ConsultationCategory/GetAllAsync", { params });
    return res.data;
  },

  async getById(id: number): Promise<ApiResponse<ConsultationCategory>> {
    const res = await api.get(`/ConsultationCategory/${id}`);
    return res.data;
  },

  async add(data: { name: string; description?: string }): Promise<ApiResponse<ConsultationCategory>> {
    const res = await api.post("/ConsultationCategory/Add", data);
    return res.data;
  },

  async update(id: number, data: { name?: string; description?: string; isActive?: boolean }): Promise<ApiResponse<ConsultationCategory>> {
    const res = await api.put(`/ConsultationCategory/Update/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<ApiResponse<string>> {
    const res = await api.delete(`/ConsultationCategory/Delete/${id}`);
    return res.data;
  },

  async softDelete(id: number): Promise<ApiResponse<string>> {
    const res = await api.put(`/ConsultationCategory/SoftDelete/${id}`);
    return res.data;
  },

  async getDeleted(): Promise<ApiResponse<ConsultationCategory[]>> {
    const res = await api.get("/ConsultationCategory/GetDeleted");
    return res.data;
  },

  async restore(id: number): Promise<ApiResponse<ConsultationCategory>> {
    const res = await api.put(`/ConsultationCategory/Restore/${id}`);
    return res.data;
  },

  async activate(id: number): Promise<ApiResponse<string>> {
    const res = await api.put(`/ConsultationCategory/Activate/${id}`);
    return res.data;
  },

  async deactivate(id: number): Promise<ApiResponse<string>> {
    const res = await api.put(`/ConsultationCategory/Deactivate/${id}`);
    return res.data;
  },
};
