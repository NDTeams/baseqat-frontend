"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faFilter, faTh, faList, faSpinner, faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import api from "@/lib/axios";

import UserTable from "@/components/dashboard/user-table";
import UserGrid from "@/components/dashboard/user-grid";
import AddEditUserModal from "@/components/dashboard/addEdituser-modal";
import DeleteUserModal from "@/components/dashboard/deleteUser-modal";
import FilterModal from "@/components/dashboard/filter-user-modal";

export interface UserData {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  roles: string[];
  joinedDate: string;
  isConfirmed: string;
  isLocked: boolean;
  userImage: string | null;
  lastLogin: string | null;
  loginCount: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTableView, setIsTableView] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // فلاتر
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRole, setFilterRole] = useState("");

  // رسائل
  const [modal, setModal] = useState({ isOpen: false, type: "success" as "success" | "error", title: "", message: "" });

  const showMessage = (type: "success" | "error", title: string, message: string) => {
    setModal({ isOpen: true, type, title, message });
    setTimeout(() => setModal(prev => ({ ...prev, isOpen: false })), type === "success" ? 2000 : 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/UsersManagement/AllUsers");
      if (res.data?.succeeded && res.data.data) {
        setUsers(res.data.data);
      }
    } catch {
      showMessage("error", "خطأ", "فشل في جلب بيانات المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleView = () => setIsTableView(!isTableView);

  const openAddUserModal = () => {
    setSelectedUser(null);
    setShowAddModal(true);
  };

  const openEditUserModal = (user: UserData) => {
    setSelectedUser(user);
    setShowAddModal(true);
  };

  const closeAddUserModal = () => {
    setShowAddModal(false);
    setSelectedUser(null);
  };

  const openDeleteUserModal = (user: UserData) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (data: { fullName: string; email: string; phoneNumber: string; password?: string }) => {
    try {
      if (selectedUser) {
        // تعديل
        const res = await api.put(`/UsersManagement/UpdateBaseqatEmployee/${selectedUser.id}`, {
          email: data.email,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          password: data.password || undefined,
        });
        if (res.data?.succeeded) {
          showMessage("success", "تم", "تم تعديل المستخدم بنجاح");
          closeAddUserModal();
          fetchUsers();
        } else {
          showMessage("error", "خطأ", res.data?.message || "فشل في تعديل المستخدم");
        }
      } else {
        // إضافة
        const res = await api.post("/UsersManagement/AddBaseqatEmployee", {
          email: data.email,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          password: data.password,
        });
        if (res.data?.succeeded) {
          showMessage("success", "تم", "تم إضافة المستخدم بنجاح");
          closeAddUserModal();
          fetchUsers();
        } else {
          showMessage("error", "خطأ", res.data?.message || "فشل في إضافة المستخدم");
        }
      }
    } catch (err: any) {
      showMessage("error", "خطأ", err?.response?.data?.message || "حدث خطأ أثناء حفظ المستخدم");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const res = await api.delete(`/UsersManagement/DeleteUser/${selectedUser.id}`);
      if (res.data?.succeeded) {
        showMessage("success", "تم", "تم حذف المستخدم بنجاح");
        closeDeleteModal();
        fetchUsers();
      } else {
        showMessage("error", "خطأ", res.data?.message || "فشل في حذف المستخدم");
      }
    } catch {
      showMessage("error", "خطأ", "حدث خطأ أثناء حذف المستخدم");
    }
  };

  const handleToggleLock = async (user: UserData) => {
    const endpoint = user.isLocked ? "UnlockUser" : "LockUser";
    // تحديث محلي فوري
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isLocked: !u.isLocked } : u));
    try {
      const res = await api.post(`/UsersManagement/${endpoint}?userId=${user.id}`);
      if (!res.data?.succeeded) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isLocked: user.isLocked } : u));
        showMessage("error", "خطأ", res.data?.message || "فشل في تغيير حالة المستخدم");
      } else {
        showMessage("success", "تم", user.isLocked ? "تم فك القفل" : "تم قفل الحساب");
      }
    } catch {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isLocked: user.isLocked } : u));
      showMessage("error", "خطأ", "فشل في تغيير حالة المستخدم");
    }
  };

  const handleToggleActivation = async (user: UserData) => {
    const isActive = user.isConfirmed === "مفعل";
    const newStatus = isActive ? "غير مفعل" : "مفعل";
    // تحديث محلي فوري
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isConfirmed: newStatus } : u));
    try {
      const endpoint = isActive ? "DeactivateUser" : "ActivateUser";
      const res = await api.post(`/UsersManagement/${endpoint}?userId=${user.id}`);
      if (!res.data?.succeeded) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isConfirmed: user.isConfirmed } : u));
        showMessage("error", "خطأ", res.data?.message || "فشل في تغيير حالة التفعيل");
      } else {
        showMessage("success", "تم", isActive ? "تم تعطيل الحساب" : "تم تفعيل الحساب");
      }
    } catch {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isConfirmed: user.isConfirmed } : u));
      showMessage("error", "خطأ", "فشل في تغيير حالة التفعيل");
    }
  };

  // تطبيق الفلاتر
  const filteredUsers = users.filter(user => {
    const matchSearch = !searchTerm ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm);
    const matchStatus = !filterStatus ||
      (filterStatus === "confirmed" && user.isConfirmed === "مفعل") ||
      (filterStatus === "unconfirmed" && user.isConfirmed !== "مفعل") ||
      (filterStatus === "locked" && user.isLocked) ||
      (filterStatus === "active" && !user.isLocked);
    const matchRole = !filterRole || user.roles?.includes(filterRole);
    return matchSearch && matchStatus && matchRole;
  });

  // الأدوار المتاحة
  const allRoles = Array.from(new Set(users.flatMap(u => u.roles || [])));

  return (
    <div>
      {/* شريط الأدوات */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors text-sm"
            onClick={openAddUserModal}
          >
            <FontAwesomeIcon icon={faPlus} />
            إضافة مستخدم
          </button>
          <button
            className="p-2.5 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition text-slate-600"
            onClick={fetchUsers}
            title="تحديث"
          >
            <FontAwesomeIcon icon={faRefresh} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2.5 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition text-slate-600"
            title="تصفية"
            onClick={() => setShowFilterModal(true)}
          >
            <FontAwesomeIcon icon={faFilter} />
          </button>
          <button
            className={`p-2.5 border rounded-xl transition ${isTableView ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
            title="عرض جدول"
            onClick={() => setIsTableView(true)}
          >
            <FontAwesomeIcon icon={faList} />
          </button>
          <button
            className={`p-2.5 border rounded-xl transition ${!isTableView ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
            title="عرض شبكة"
            onClick={() => setIsTableView(false)}
          >
            <FontAwesomeIcon icon={faTh} />
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
          <div className="text-2xl font-black text-emerald-700">{users.length}</div>
          <div className="text-xs text-slate-500 mt-1">إجمالي المستخدمين</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
          <div className="text-2xl font-black text-green-600">{users.filter(u => u.isConfirmed === "مفعل").length}</div>
          <div className="text-xs text-slate-500 mt-1">مفعلين</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
          <div className="text-2xl font-black text-amber-600">{users.filter(u => u.isConfirmed !== "مفعل").length}</div>
          <div className="text-xs text-slate-500 mt-1">غير مفعلين</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
          <div className="text-2xl font-black text-red-600">{users.filter(u => u.isLocked).length}</div>
          <div className="text-xs text-slate-500 mt-1">محظورين</div>
        </div>
      </div>

      {/* الفلاتر النشطة */}
      {(filterStatus || filterRole) && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs text-slate-500">فلاتر نشطة:</span>
          {filterStatus && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs">
              {filterStatus === "confirmed" ? "مفعل" : filterStatus === "unconfirmed" ? "غير مفعل" : filterStatus === "locked" ? "محظور" : "نشط"}
              <button onClick={() => setFilterStatus("")} className="hover:text-red-600">&times;</button>
            </span>
          )}
          {filterRole && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
              {filterRole}
              <button onClick={() => setFilterRole("")} className="hover:text-red-600">&times;</button>
            </span>
          )}
          <button onClick={() => { setFilterStatus(""); setFilterRole(""); }} className="text-xs text-red-600 hover:underline">مسح الكل</button>
        </div>
      )}

      {/* المحتوى */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} className="text-emerald-700 text-3xl animate-spin" />
        </div>
      ) : isTableView ? (
        <UserTable
          users={filteredUsers}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          usersPerPage={usersPerPage}
          setUsersPerPage={setUsersPerPage}
          openEditUserModal={openEditUserModal}
          openDeleteUserModal={openDeleteUserModal}
          handleToggleLock={handleToggleLock}
          handleToggleActivation={handleToggleActivation}
        />
      ) : (
        <UserGrid
          users={filteredUsers}
          currentPage={currentPage}
          usersPerPage={usersPerPage}
          openEditUserModal={openEditUserModal}
          openDeleteUserModal={openDeleteUserModal}
          handleToggleLock={handleToggleLock}
          handleToggleActivation={handleToggleActivation}
        />
      )}

      {/* Modals */}
      {showAddModal && (
        <AddEditUserModal
          selectedUser={selectedUser}
          closeModal={closeAddUserModal}
          onSave={handleSaveUser}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          closeModal={closeDeleteModal}
          onDelete={handleDeleteUser}
        />
      )}

      {showFilterModal && (
        <FilterModal
          closeModal={() => setShowFilterModal(false)}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          allRoles={allRoles}
        />
      )}

      {/* رسالة النتيجة */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center" onClick={() => setModal(p => ({ ...p, isOpen: false }))}>
          <div className={`bg-white rounded-2xl p-6 shadow-2xl max-w-sm mx-4 text-center ${modal.type === "success" ? "border-t-4 border-emerald-500" : "border-t-4 border-red-500"}`} onClick={e => e.stopPropagation()}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${modal.type === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
              {modal.type === "success" ? "✓" : "✕"}
            </div>
            <h3 className="font-bold text-lg mb-1">{modal.title}</h3>
            <p className="text-sm text-slate-600">{modal.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
