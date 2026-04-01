import api from "@/lib/axios";

// ===== Types =====
export interface ApiResponse<T = any> {
  succeeded: boolean;
  message: string;
  errors: null | string[];
  data: T;
}

export interface Role {
  id: string;
  name: string;
  normalizedName?: string;
  usersCount?: number;
}

export interface RoleDetail extends Role {
  usersCount: number;
}

export interface PrivilegesRoleBasedDto {
  id: number;
  privilegesId: number;
  privilegeName: string;
  roleId: string;
  roleName: string;
  is_displayed: boolean;
  is_insert: boolean;
  is_update: boolean;
  is_delete: boolean;
  is_print: boolean;
}

export interface PrivilegesRoleBasedCreateDto {
  privilegesId: number;
  roleId: string;
  is_displayed: boolean;
  is_insert: boolean;
  is_update: boolean;
  is_delete: boolean;
  is_print: boolean;
}

export interface UserInRole {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  phoneNumber: string;
}

// Legacy types kept for PrivilegesService
export interface Privilege {
  id: string;
  name: string;
  category?: string;
}

// واجهة تطابق استجابة الباك اند _Role_PriviligeDto
export interface UserPrivilegeDto {
  privilegesId: number;
  name: string;
  roleId: string;
  userId?: string;
  is_displayed: boolean;
  is_insert: boolean;
  is_update: boolean;
  is_delete: boolean;
  is_print: boolean;
}

// واجهة قديمة - للتوافق
export interface UserPrivilege {
  privilegeId: string;
  privilegeName: string;
  category?: string;
  isDisplayed: boolean;
  isInsert: boolean;
  isUpdate: boolean;
  isDelete: boolean;
}

// ===== Roles Service =====
export const RolesService = {
  // جلب جميع المجموعات
  getAll: async (): Promise<ApiResponse<Role[]>> => {
    const res = await api.get("/Role/GetAll");
    return res.data;
  },

  // جلب مجموعة بالـ ID
  getById: async (id: string): Promise<ApiResponse<RoleDetail>> => {
    const res = await api.get(`/Role/${id}`);
    return res.data;
  },

  // إضافة مجموعة - Backend expects [FromBody] string
  add: async (roleName: string): Promise<ApiResponse<Role>> => {
    const res = await api.post("/Role/Add", JSON.stringify(roleName));
    return res.data;
  },

  // تعديل مجموعة - Backend expects [FromBody] string
  update: async (id: string, newRoleName: string): Promise<ApiResponse<Role>> => {
    const res = await api.put(`/Role/Update/${id}`, JSON.stringify(newRoleName));
    return res.data;
  },

  // حذف نهائي
  delete: async (id: string): Promise<ApiResponse<string>> => {
    const res = await api.delete(`/Role/Delete/${id}`);
    return res.data;
  },

  // جلب صلاحيات المجموعة
  getRolePrivileges: async (roleId: string): Promise<ApiResponse<PrivilegesRoleBasedDto[]>> => {
    const res = await api.get(`/Role/GetRolePrivileges/${roleId}`);
    return res.data;
  },

  // إضافة أو تحديث صلاحيات المجموعة
  addOrUpdateRolePrivileges: async (
    roleId: string,
    privileges: PrivilegesRoleBasedCreateDto[]
  ): Promise<ApiResponse<string>> => {
    const res = await api.post(`/Role/AddOrUpdateRolePrivileges/${roleId}`, privileges);
    return res.data;
  },

  // جلب المستخدمين في المجموعة
  getUsersInRole: async (roleId: string): Promise<ApiResponse<UserInRole[]>> => {
    const res = await api.get(`/Role/GetUsersInRole/${roleId}`);
    return res.data;
  },

  // تعيين مجموعة لمستخدم
  assignRoleToUser: async (userId: string, roleId: string): Promise<ApiResponse<string>> => {
    const res = await api.post(`/Role/AssignRoleToUser?userId=${userId}&roleId=${roleId}`);
    return res.data;
  },

  // إزالة مجموعة من مستخدم
  removeRoleFromUser: async (userId: string, roleId: string): Promise<ApiResponse<string>> => {
    const res = await api.post(`/Role/RemoveRoleFromUser?userId=${userId}&roleId=${roleId}`);
    return res.data;
  },

  // جلب مجموعات مستخدم
  getUserRoles: async (userId: string): Promise<ApiResponse<Role[]>> => {
    const res = await api.get(`/Role/GetUserRoles/${userId}`);
    return res.data;
  },
};

// ===== User Privileges Service =====
export const PrivilegesService = {
  // جلب صلاحيات مستخدم محدد (يدمج صلاحيات المستخدم + المجموعة)
  getUserPrivileges: async (userId: string): Promise<ApiResponse<UserPrivilegeDto[]>> => {
    const res = await api.get(`/UsersManagement/GetAllUserPriviliges?userId=${userId}`);
    return res.data;
  },

  // تحديث صلاحيات مستخدم (صلاحيات خاصة تتجاوز صلاحيات المجموعة)
  updateUserPrivileges: async (
    userId: string,
    privileges: UserPrivilegeDto[]
  ): Promise<ApiResponse<string>> => {
    const res = await api.post(`/UsersManagement/AddOrUpdatePriviligesToUser?userId=${userId}`, privileges);
    return res.data;
  },

  // جلب قائمة الصلاحيات المتاحة في النظام
  getSystemPrivileges: async (): Promise<ApiResponse<Privilege[]>> => {
    const res = await api.get("/Privileges/GetAll");
    return res.data;
  },
};
