import api from "@/lib/axios";

// ===== Shared Types =====
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

export interface CourseCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  isDeleted?: boolean;
}

export interface CourseCategoryDetail extends CourseCategory {
  coursesCount: number;
  courses: { id: number; title: string }[];
}

export interface Course {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  thumbnailUrl?: string;
  promoVideoUrl?: string;
  level: number;
  levelName?: string;
  language?: string;
  hasCertificate: boolean;
  price: number;
  courseDays: number;
  courseDaysName?: string;
  startTime?: string;
  endTime?: string;
  durationInDays?: number;
  totalDurationInHours?: number;
  startDate?: string;
  endDate?: string;
  courseType?: number;
  courseTypeName?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  platformName?: string;
  platformUrl?: string;
  status: number;
  statusName?: string;
  isActive: boolean;
  courseCategoryId: number;
  courseCategoryName?: string;
  instructorId?: number;
  instructorName?: string;
}

// ===== Filter & Pagination Types =====
export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

export interface CourseCategoryFilter {
  id?: number;
  name?: string;
  isActive?: boolean;
}

export interface CourseFilter {
  id?: number;
  title?: string;
  level?: number;
  status?: number;
  courseCategoryId?: number;
  instructorId?: number;
  isActive?: boolean | string;
  minPrice?: number;
  maxPrice?: number;
  startDateFrom?: string;
  startDateTo?: string;
}

export interface Instructor {
  id: number;
  name: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  cvUrl?: string;
  gender: number;
  genderName?: string;
  rating?: number | null;
  totalStudents?: number | null;
  totalCources?: number | null;
  isDeleted?: boolean;
  isActive?: boolean;
  skills?: InstructorSkill[];
  yearsOfExperience?: number | null;
  linkedInUrl?: string;
  xUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  userEmail?: string;
  // حقول طلبات المدربين
  requestStatus?: number | null;
  requestStatusName?: string;
  submittedByUserId?: string;
  reviewedByUserId?: string;
  reviewedAt?: string;
  denialReason?: string;
  createdAt?: string;
}

export interface InstructorDetail extends Instructor {
  skills?: InstructorSkill[];
  courses?: Course[];
  reviews?: { id: number; instructorId: number; rating: number; comment: string }[];
}

export interface InstructorFilter {
  id?: number;
  name?: string;
  title?: string;
  gender?: number;
  minRating?: number;
}

// ===== Course Categories Service (Public) =====
export const CourseCategoryService = {
  // جلب جميع الأقسام للصفحة الرئيسية (بدون auth)
  getAllHome: async (): Promise<ApiResponse<CourseCategory[]>> => {
    const res = await api.get("/CourseCategory/GetAllHome");
    return res.data;
  },

  // جلب قسم محدد بالـ ID
  getById: async (id: number): Promise<ApiResponse<CourseCategoryDetail>> => {
    const res = await api.get(`/CourseCategory/${id}`);
    return res.data;
  },
};

// ===== Course Categories Admin Service (Dashboard) =====
export const CourseCategoryAdminService = {
  // جلب الكل بدون pagination (للـ dropdown)
  getAll: async (): Promise<ApiResponse<CourseCategory[]>> => {
    const res = await api.get("/CourseCategory/GetAll");
    return res.data;
  },

  // جلب الكل مع pagination وفلتر
  getAllPaged: async (
    pagination: PaginationParams,
    filter?: CourseCategoryFilter
  ): Promise<PagedResponse<CourseCategory>> => {
    const res = await api.get("/CourseCategory/GetAllAsync", {
      params: {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        ...filter,
      },
    });
    return res.data;
  },

  // إضافة قسم جديد
  add: async (data: { name: string; description: string; isActive: boolean }): Promise<ApiResponse<CourseCategory>> => {
    const res = await api.post("/CourseCategory/Add", data);
    return res.data;
  },

  // تعديل قسم
  update: async (
    id: number,
    data: { name?: string; description?: string; isActive?: boolean }
  ): Promise<ApiResponse<CourseCategory>> => {
    const res = await api.put(`/CourseCategory/Update/${id}`, data);
    return res.data;
  },

  // حذف نهائي
  delete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await api.delete(`/CourseCategory/Delete/${id}`);
    return res.data;
  },

  // إخفاء (soft delete)
  softDelete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await api.put(`/CourseCategory/SoftDelete/${id}`);
    return res.data;
  },

  // جلب العناصر المحذوفة
  getDeleted: async (): Promise<ApiResponse<CourseCategory[]>> => {
    const res = await api.get("/CourseCategory/GetDeleted");
    return res.data;
  },

  // استرجاع قسم محذوف
  restore: async (id: number): Promise<ApiResponse<CourseCategory>> => {
    const res = await api.put(`/CourseCategory/Restore/${id}`);
    return res.data;
  },
};

// ===== Courses Service (Public) =====
export interface CourseDetailFull extends Course {
  sections: {
    id: number;
    title: string;
    order: number;
    lessons: {
      id: number;
      title: string;
      lessonType: number;
      lessonTypeName?: string;
      durationInMinutes: number;
      isPreview: boolean;
      order: number;
      courseSectionId: number;
    }[];
  }[];
  instructors: {
    courseId: number;
    instructorId: number;
    instructorName: string;
    instructorTitle: string;
    instructorAvatarUrl?: string;
  }[];
  requirements: {
    id: number;
    text: string;
    order: number;
    courseId: number;
  }[];
  reviews: {
    id: number;
    courseId: number;
    courseTitle: string;
    userId: number;
    userName: string;
    rating: number;
    comment?: string;
  }[];
  enrollmentCount: number;
  averageRating: number;
  totalReviews: number;
}

export const CoursesService = {
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<Course[]>> => {
    const res = await api.get("/Course/GetAll", { params });
    return res.data;
  },

  getByCategoryId: async (categoryId: number): Promise<ApiResponse<Course[]>> => {
    const res = await api.get("/Course/ByCategory", { params: { categoryId } });
    return res.data;
  },

  getFeatured: async (): Promise<ApiResponse<Course[]>> => {
    const res = await api.get("/Course/GetFeatured");
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<Course>> => {
    const res = await api.get(`/Course/${id}`);
    return res.data;
  },

  getActive: async (): Promise<ApiResponse<Course[]>> => {
    const res = await api.get("/Course/GetActive");
    return res.data;
  },

  getActiveById: async (id: number): Promise<ApiResponse<CourseDetailFull>> => {
    const res = await api.get(`/Course/GetActiveById/${id}`);
    return res.data;
  },
};

// ===== Courses Admin Service (Dashboard) =====
export const CoursesAdminService = {
  // جلب الكل بدون pagination
  getAll: async (): Promise<ApiResponse<Course[]>> => {
    const res = await api.get("/Course/GetAll");
    return res.data;
  },

  // جلب الكل مع pagination وفلتر
  getAllPaged: async (
    pagination: PaginationParams,
    filter?: CourseFilter
  ): Promise<PagedResponse<Course>> => {
    const res = await api.get("/Course/GetAllAsync", {
      params: {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        ...filter,
      },
    });
    return res.data;
  },

  // جلب دورة بالـ ID
  getById: async (id: number): Promise<ApiResponse<Course>> => {
    const res = await api.get(`/Course/${id}`);
    return res.data;
  },

  // إضافة دورة جديدة
  add: async (data: Partial<Course>): Promise<ApiResponse<Course>> => {
    const res = await api.post("/Course/Add", data);
    return res.data;
  },

  // تعديل دورة
  update: async (id: number, data: Partial<Course>): Promise<ApiResponse<Course>> => {
    const res = await api.put(`/Course/Update/${id}`, data);
    return res.data;
  },

  // رفع صورة مصغرة
  uploadThumbnail: async (id: number, file: File): Promise<ApiResponse<{ imageUrl: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`/Course/UploadThumbnail/${id}`, formData);
    return res.data;
  },

  // حذف نهائي
  delete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await api.delete(`/Course/Delete/${id}`);
    return res.data;
  },

  // إخفاء (soft delete)
  softDelete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await api.put(`/Course/SoftDelete/${id}`);
    return res.data;
  },

  // جلب الدورات المحذوفة
  getDeleted: async (): Promise<ApiResponse<Course[]>> => {
    const res = await api.get("/Course/GetDeleted");
    return res.data;
  },

  // استرجاع دورة محذوفة
  restore: async (id: number): Promise<ApiResponse<Course>> => {
    const res = await api.put(`/Course/Restore/${id}`);
    return res.data;
  },
};

// ===== Instructors Admin Service (Dashboard) =====
export const InstructorPublicService = {
  // جلب المدربين المفعلين فقط (بدون تسجيل دخول)
  getActive: async (): Promise<ApiResponse<Instructor[]>> => {
    const res = await api.get("/Instructor/GetActive");
    return res.data;
  },
  // جلب تفاصيل مدرب مفعل بالـ ID (بدون تسجيل دخول)
  getActiveById: async (id: number): Promise<ApiResponse<InstructorDetail>> => {
    const res = await api.get(`/Instructor/GetActiveById/${id}`);
    return res.data;
  },
};

export const InstructorAdminService = {
  // جلب الكل بدون pagination
  getAll: async (): Promise<ApiResponse<Instructor[]>> => {
    const res = await api.get("/Instructor/GetAll");
    return res.data;
  },

  // جلب الكل مع pagination وفلتر
  getAllPaged: async (
    pagination: PaginationParams,
    filter?: InstructorFilter
  ): Promise<PagedResponse<Instructor>> => {
    const res = await api.get("/Instructor/GetAllAsync", {
      params: {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        id: filter?.id,
        name: filter?.name,
        title: filter?.title,
        gender: filter?.gender,
        minRating: filter?.minRating,
      },
    });
    return res.data;
  },

  // جلب مدرب بالـ ID
  getById: async (id: number): Promise<ApiResponse<Instructor>> => {
    const res = await api.get(`/Instructor/${id}`);
    return res.data;
  },

  // إضافة مدرب جديد (بدون حساب)
  add: async (data: Partial<Instructor>): Promise<ApiResponse<Instructor>> => {
    const res = await api.post("/Instructor/Add", data);
    return res.data;
  },

  // إضافة مدرب جديد مع إنشاء حساب
  addWithAccount: async (data: {
    name: string; title: string; bio?: string; gender: number;
    email: string; phoneNumber: string; password: string;
    yearsOfExperience?: number;
    linkedInUrl?: string; xUrl?: string; instagramUrl?: string; facebookUrl?: string;
  }): Promise<ApiResponse<Instructor>> => {
    const res = await api.post("/Instructor/AddWithAccount", data);
    return res.data;
  },

  // تعديل مدرب
  update: async (id: number, data: Partial<Instructor>): Promise<ApiResponse<Instructor>> => {
    const res = await api.put(`/Instructor/Update/${id}`, data);
    return res.data;
  },

  // رفع صورة شخصية
  uploadAvatar: async (id: number, file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`/Instructor/UploadAvatar/${id}`, formData);
    return res.data;
  },

  // رفع السيرة الذاتية (PDF, DOC, DOCX - حد أقصى 5MB)
  uploadCv: async (id: number, file: File): Promise<ApiResponse<{ cvUrl: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`/Instructor/UploadCv/${id}`, formData);
    return res.data;
  },

  // حذف نهائي
  delete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await api.delete(`/Instructor/Delete/${id}`);
    return res.data;
  },

  // حذف مؤقت (soft delete - IsDeleted = true)
  softDelete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await api.put(`/Instructor/SoftDelete/${id}`);
    return res.data;
  },

  // جلب المدربين المحذوفين
  getDeleted: async (): Promise<ApiResponse<Instructor[]>> => {
    const res = await api.get("/Instructor/GetDeleted");
    return res.data;
  },

  // استرجاع مدرب محذوف
  restore: async (id: number): Promise<ApiResponse<Instructor>> => {
    const res = await api.put(`/Instructor/Restore/${id}`);
    return res.data;
  },

  // تفعيل مدرب
  activate: async (id: number): Promise<ApiResponse<Instructor>> => {
    const res = await api.put(`/Instructor/Activate/${id}`);
    return res.data;
  },

  // إلغاء تفعيل مدرب
  deactivate: async (id: number): Promise<ApiResponse<Instructor>> => {
    const res = await api.put(`/Instructor/Deactivate/${id}`);
    return res.data;
  },

  // جلب دورات المدرب
  getInstructorCourses: async (id: number): Promise<ApiResponse<Course[]>> => {
    const res = await api.get(`/Instructor/${id}/Courses`);
    return res.data;
  },

  // جلب تقييمات المدرب
  getInstructorReviews: async (id: number): Promise<ApiResponse<any[]>> => {
    const res = await api.get(`/Instructor/${id}/Reviews`);
    return res.data;
  },

  // تسجيل طلب مدرب جديد (من الطالب) - [FromForm] + IFormFile
  registerRequest: async (data: {
    name: string;
    title: string;
    bio?: string;
    gender: number;
    yearsOfExperience?: number;
    linkedInUrl?: string;
    xUrl?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    skills?: string[];
    avatarFile?: File;
    cvFile?: File;
  }): Promise<ApiResponse<Instructor>> => {
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("Title", data.title);
    if (data.bio) formData.append("Bio", data.bio);
    formData.append("Gender", data.gender.toString());
    if (data.yearsOfExperience != null) formData.append("YearsOfExperience", data.yearsOfExperience.toString());
    if (data.linkedInUrl) formData.append("LinkedInUrl", data.linkedInUrl);
    if (data.xUrl) formData.append("XUrl", data.xUrl);
    if (data.instagramUrl) formData.append("InstagramUrl", data.instagramUrl);
    if (data.facebookUrl) formData.append("FacebookUrl", data.facebookUrl);
    if (data.skills?.length) data.skills.forEach(s => formData.append("Skills", s));
    if (data.avatarFile) formData.append("avatarFile", data.avatarFile);
    if (data.cvFile) formData.append("cvFile", data.cvFile);
    const res = await api.postForm("/Instructor/RegisterRequest", formData);
    return res.data;
  },

  // جلب طلبات المدربين (للأدمن)
  getRequests: async (params?: { instructorId?: number; status?: number }): Promise<ApiResponse<Instructor[]>> => {
    const res = await api.get("/Instructor/GetRequests", { params });
    return res.data;
  },

  // مراجعة طلب مدرب (موافقة / رفض)
  reviewRequest: async (requestId: number, data: { approve: boolean; denialReason?: string }): Promise<ApiResponse<Instructor>> => {
    const res = await api.put(`/Instructor/ReviewRequest/${requestId}`, data);
    return res.data;
  },
};

// ===== Instructor Skill Types =====
export interface InstructorSkill {
  id: number;
  name: string;
  instructorId?: number;
}

export interface InstructorSkillFilter {
  id?: number;
  name?: string;
  instructorId?: number;
}

// ===== Instructor Skill Admin Service (Dashboard) =====
export const InstructorSkillAdminService = {
  // جلب الكل بدون pagination
  getAll: async (): Promise<ApiResponse<InstructorSkill[]>> => {
    const res = await api.get("/InstructorSkill/GetAll");
    return res.data;
  },

  // جلب الكل مع pagination وفلتر
  getAllPaged: async (
    pagination: PaginationParams,
    filter?: InstructorSkillFilter
  ): Promise<PagedResponse<InstructorSkill>> => {
    const res = await api.get("/InstructorSkill/GetAllAsync", {
      params: {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        id: filter?.id,
        name: filter?.name,
      },
    });
    return res.data;
  },

  // جلب مهارة بالـ ID
  getById: async (id: number): Promise<ApiResponse<InstructorSkill>> => {
    const res = await api.get(`/InstructorSkill/${id}`);
    return res.data;
  },

  // إضافة مهارة جديدة مع ربطها بمدرب محدد
  add: async (data: { name: string; instructorId?: number }): Promise<ApiResponse<InstructorSkill>> => {
    const res = await api.post("/InstructorSkill/Add", {
      name: data.name,
      instructorId: data.instructorId,
    });
    return res.data;
  },

  // تعديل مهارة
  update: async (id: number, data: { name: string }): Promise<ApiResponse<InstructorSkill>> => {
    const res = await api.put(`/InstructorSkill/Update/${id}`, data);
    return res.data;
  },

  // حذف مهارة
  delete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await api.delete(`/InstructorSkill/Delete/${id}`);
    return res.data;
  },

  // جلب مهارات مدرب معين
  getByInstructor: async (instructorId: number): Promise<ApiResponse<InstructorSkill[]>> => {
    const res = await api.get(`/InstructorSkill/ByInstructor/${instructorId}`);
    return res.data;
  },
};

// ===== Additional Types =====
export interface CourseEnrollment {
  id: number;
  courseId: number;
  courseName?: string;
  userId: string;
  userName?: string;
  enrolledAt: string;
}

export interface CourseEnrollmentFilter {
  id?: number;
  courseId?: number;
  userId?: string;
  enrolledFrom?: string;
  enrolledTo?: string;
}

export interface CourseInstructor {
  id: number;
  courseId: number;
  courseName?: string;
  instructorId: number;
  instructorName?: string;
}

export interface CourseInstructorFilter {
  courseId?: number;
  instructorId?: number;
}

export interface CourseSection {
  id: number;
  title: string;
  description?: string;
  orderIndex: number;
  courseId: number;
  courseName?: string;
  lessonsCount?: number;
}

export interface CourseSectionFilter {
  id?: number;
  title?: string;
  courseId?: number;
}

export interface CourseLesson {
  id: number;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  orderIndex: number;
  lessonType: number;
  lessonTypeName?: string;
  isPreview: boolean;
  courseSectionId: number;
  sectionName?: string;
}

export interface CourseLessonFilter {
  id?: number;
  title?: string;
  lessonType?: number;
  courseSectionId?: number;
  isPreview?: boolean;
}

export interface CourseRequirement {
  id: number;
  text: string;
  courseId: number;
  courseName?: string;
}

export interface CourseRequirementFilter {
  id?: number;
  text?: string;
  courseId?: number;
}

export interface CourseReview {
  id: number;
  rating: number;
  comment?: string;
  courseId: number;
  courseName?: string;
  userId: number;
  userName?: string;
  createdAt?: string;
}

export interface CourseReviewFilter {
  id?: number;
  courseId?: number;
  userId?: number;
  minRating?: number;
  maxRating?: number;
}

// ===== My Enrollment (Client Dashboard) =====
export interface MyEnrollment {
  enrollmentId: number;
  enrolledAt: string;
  courseId: number;
  courseTitle: string;
  courseSubtitle: string | null;
  thumbnailUrl: string | null;
  level: number;
  levelName: string;
  courseType: number;
  courseTypeName: string;
  status: number;
  statusName: string;
  totalDurationInHours: number;
  hasCertificate: boolean;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  instructorName: string;
  instructorAvatarUrl: string | null;
  totalSections: number;
  totalEnrollments: number;
}

// ===== Course Enrollment Service (Dashboard) =====
export const CourseEnrollmentService = {
  getAll: async (): Promise<ApiResponse<CourseEnrollment[]>> => {
    const res = await api.get("/CourseEnrollment/GetAll");
    return res.data;
  },

  getAllPaged: async (
    pagination: PaginationParams,
    filter?: CourseEnrollmentFilter
  ): Promise<PagedResponse<CourseEnrollment>> => {
    const res = await api.get("/CourseEnrollment/GetAllAsync", {
      params: {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        ...filter,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<CourseEnrollment>> => {
    const res = await api.get(`/CourseEnrollment/${id}`);
    return res.data;
  },

  add: async (data: { courseId: number; userId: string }): Promise<ApiResponse<CourseEnrollment>> => {
    const res = await api.post("/CourseEnrollment/Add", data);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await api.delete(`/CourseEnrollment/Delete/${id}`);
    return res.data;
  },

  getByCourse: async (courseId: number): Promise<ApiResponse<CourseEnrollment[]>> => {
    const res = await api.get(`/CourseEnrollment/ByCourse/${courseId}`);
    return res.data;
  },

  getByUser: async (userId: string): Promise<ApiResponse<CourseEnrollment[]>> => {
    const res = await api.get(`/CourseEnrollment/ByUser/${userId}`);
    return res.data;
  },

  getMyEnrollments: async (): Promise<ApiResponse<MyEnrollment[]>> => {
    const res = await api.get("/CourseEnrollment/GetMyEnrollments");
    return res.data;
  },
};

// ===== Course Instructor Service (Dashboard) =====
export const CourseInstructorService = {
  getAll: async (): Promise<ApiResponse<CourseInstructor[]>> => {
    const res = await api.get("/CourseInstructor/GetAll");
    return res.data;
  },

  getAllPaged: async (
    pagination: PaginationParams,
    filter?: CourseInstructorFilter
  ): Promise<PagedResponse<CourseInstructor>> => {
    const res = await api.get("/CourseInstructor/GetAllAsync", {
      params: {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        ...filter,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<CourseInstructor>> => {
    const res = await api.get(`/CourseInstructor/${id}`);
    return res.data;
  },

  add: async (data: { courseId: number; instructorId: number }): Promise<ApiResponse<CourseInstructor>> => {
    const res = await api.post("/CourseInstructor/Add", data);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await api.delete(`/CourseInstructor/Delete/${id}`);
    return res.data;
  },

  getByCourse: async (courseId: number): Promise<ApiResponse<CourseInstructor[]>> => {
    const res = await api.get(`/CourseInstructor/ByCourse/${courseId}`);
    return res.data;
  },

  getByInstructor: async (instructorId: number): Promise<ApiResponse<CourseInstructor[]>> => {
    const res = await api.get(`/CourseInstructor/ByInstructor/${instructorId}`);
    return res.data;
  },
};

// ===== Course Section Service (Dashboard) =====
export const CourseSectionService = {
  getAll: async (): Promise<ApiResponse<CourseSection[]>> => {
    const res = await api.get("/CourseSection/GetAll");
    return res.data;
  },

  getAllPaged: async (
    pagination: PaginationParams,
    filter?: CourseSectionFilter
  ): Promise<PagedResponse<CourseSection>> => {
    const res = await api.get("/CourseSection/GetAllAsync", {
      params: {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        ...filter,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<CourseSection>> => {
    const res = await api.get(`/CourseSection/${id}`);
    return res.data;
  },

  add: async (data: Partial<CourseSection>): Promise<ApiResponse<CourseSection>> => {
    const res = await api.post("/CourseSection/Add", data);
    return res.data;
  },

  update: async (id: number, data: Partial<CourseSection>): Promise<ApiResponse<CourseSection>> => {
    const res = await api.put(`/CourseSection/Update/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await api.delete(`/CourseSection/Delete/${id}`);
    return res.data;
  },
};

// ===== Course Lesson Service (Dashboard) =====
export const CourseLessonService = {
  getAll: async (): Promise<ApiResponse<CourseLesson[]>> => {
    const res = await api.get("/CourseLesson/GetAll");
    return res.data;
  },

  getAllPaged: async (
    pagination: PaginationParams,
    filter?: CourseLessonFilter
  ): Promise<PagedResponse<CourseLesson>> => {
    const res = await api.get("/CourseLesson/GetAllAsync", {
      params: {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        ...filter,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<CourseLesson>> => {
    const res = await api.get(`/CourseLesson/${id}`);
    return res.data;
  },

  add: async (data: Partial<CourseLesson>): Promise<ApiResponse<CourseLesson>> => {
    const res = await api.post("/CourseLesson/Add", data);
    return res.data;
  },

  update: async (id: number, data: Partial<CourseLesson>): Promise<ApiResponse<CourseLesson>> => {
    const res = await api.put(`/CourseLesson/Update/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await api.delete(`/CourseLesson/Delete/${id}`);
    return res.data;
  },

  getBySection: async (sectionId: number): Promise<ApiResponse<CourseLesson[]>> => {
    const res = await api.get(`/CourseLesson/BySection/${sectionId}`);
    return res.data;
  },
};

// ===== Course Requirement Service (Dashboard) =====
export const CourseRequirementService = {
  getAll: async (): Promise<ApiResponse<CourseRequirement[]>> => {
    const res = await api.get("/CourseRequirement/GetAll");
    return res.data;
  },

  getAllPaged: async (
    pagination: PaginationParams,
    filter?: CourseRequirementFilter
  ): Promise<PagedResponse<CourseRequirement>> => {
    const res = await api.get("/CourseRequirement/GetAllAsync", {
      params: {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        ...filter,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<CourseRequirement>> => {
    const res = await api.get(`/CourseRequirement/${id}`);
    return res.data;
  },

  add: async (data: { text: string; courseId: number }): Promise<ApiResponse<CourseRequirement>> => {
    const res = await api.post("/CourseRequirement/Add", data);
    return res.data;
  },

  update: async (id: number, data: { text: string }): Promise<ApiResponse<CourseRequirement>> => {
    const res = await api.put(`/CourseRequirement/Update/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await api.delete(`/CourseRequirement/Delete/${id}`);
    return res.data;
  },

  getByCourse: async (courseId: number): Promise<ApiResponse<CourseRequirement[]>> => {
    const res = await api.get(`/CourseRequirement/ByCourse/${courseId}`);
    return res.data;
  },
};

// ===== Course Review Service (Dashboard) =====
export const CourseReviewService = {
  getAll: async (): Promise<ApiResponse<CourseReview[]>> => {
    const res = await api.get("/CourseReview/GetAll");
    return res.data;
  },

  getAllPaged: async (
    pagination: PaginationParams,
    filter?: CourseReviewFilter
  ): Promise<PagedResponse<CourseReview>> => {
    const res = await api.get("/CourseReview/GetAllAsync", {
      params: {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        ...filter,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<CourseReview>> => {
    const res = await api.get(`/CourseReview/${id}`);
    return res.data;
  },

  add: async (data: { rating: number; comment?: string; courseId: number; userId: number }): Promise<ApiResponse<CourseReview>> => {
    const res = await api.post("/CourseReview/Add", data);
    return res.data;
  },

  update: async (id: number, data: { rating?: number; comment?: string }): Promise<ApiResponse<CourseReview>> => {
    const res = await api.put(`/CourseReview/Update/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await api.delete(`/CourseReview/Delete/${id}`);
    return res.data;
  },

  getByCourse: async (courseId: number): Promise<ApiResponse<CourseReview[]>> => {
    const res = await api.get(`/CourseReview/ByCourse/${courseId}`);
    return res.data;
  },

  getAverageRating: async (courseId: number): Promise<ApiResponse<number>> => {
    const res = await api.get(`/CourseReview/AverageRating/${courseId}`);
    return res.data;
  },
};

// ===== Course Stats (Public) =====
export interface CourseStats {
  totalCategories: number;
  totalCourses: number;
  totalEnrollments: number;
}

export const CourseStatsService = {
  getStats: async (): Promise<ApiResponse<CourseStats>> => {
    const res = await api.get("/Course/GetCourseStats");
    return res.data;
  },
};

// ===== Home Statistic Types & Service =====
export interface HomeStatistic {
  id: number;
  title: string;
  value: string;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
}

export const HomeStatisticService = {
  getAll: async (): Promise<ApiResponse<HomeStatistic[]>> => {
    const res = await api.get("/HomeStatistic/GetAll");
    return res.data;
  },
};
