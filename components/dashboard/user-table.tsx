"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit, faTrash, faSearch, faChevronLeft, faChevronRight,
  faLock, faLockOpen, faUser, faHistory, faCheckCircle, faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import type { UserData } from "./addUser-section";

interface UserTableProps {
  users: UserData[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  usersPerPage: number;
  setUsersPerPage: (num: number) => void;
  openEditUserModal: (user: UserData) => void;
  openDeleteUserModal: (user: UserData) => void;
  handleToggleLock: (user: UserData) => void;
  handleToggleActivation: (user: UserData) => void;
}

export default function UserTable({
  users,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  usersPerPage,
  setUsersPerPage,
  openEditUserModal,
  openDeleteUserModal,
  handleToggleLock,
  handleToggleActivation,
}: UserTableProps) {
  // Pagination
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* شريط البحث */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-slate-100">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="البحث بالاسم أو البريد أو الهاتف..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pe-4 ps-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none transition"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">عرض</span>
          <select
            value={usersPerPage}
            onChange={(e) => { setUsersPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
            className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-xs text-slate-500">مستخدم</span>
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-slate-600">
              <th className="p-3 text-start text-xs font-semibold">المستخدم</th>
              <th className="p-3 text-start text-xs font-semibold">الهاتف</th>
              <th className="p-3 text-start text-xs font-semibold">الأدوار</th>
              <th className="p-3 text-start text-xs font-semibold">الحالة</th>
              <th className="p-3 text-start text-xs font-semibold">تاريخ الانضمام</th>
              <th className="p-3 text-start text-xs font-semibold">آخر دخول</th>
              <th className="p-3 text-center text-xs font-semibold">مرات الدخول</th>
              <th className="p-3 text-center text-xs font-semibold">العمليات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400 text-sm">لا توجد نتائج</td>
              </tr>
            ) : currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition">
                {/* المستخدم */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {user.userImage ? (
                        <img src={user.userImage} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <FontAwesomeIcon icon={faUser} className="text-emerald-700" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 text-sm truncate">{user.fullName || user.userName}</div>
                      <div className="text-xs text-slate-400 truncate">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* الهاتف */}
                <td className="p-3">
                  <span className="text-sm text-slate-600 dir-ltr inline-block" dir="ltr">{user.phoneNumber || "—"}</span>
                </td>

                {/* الأدوار */}
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {user.roles?.length > 0 ? user.roles.map((role, idx) => (
                      <span key={idx} className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-xs font-medium">
                        {role}
                      </span>
                    )) : (
                      <span className="text-xs text-slate-400">بدون دور</span>
                    )}
                  </div>
                </td>

                {/* الحالة */}
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    {user.isLocked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        محظور
                      </span>
                    ) : user.isConfirmed === "مفعل" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        مفعل
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        غير مفعل
                      </span>
                    )}
                  </div>
                </td>

                {/* التاريخ */}
                <td className="p-3">
                  <span className="text-sm text-slate-600">{user.joinedDate || "—"}</span>
                </td>

                {/* آخر دخول */}
                <td className="p-3">
                  <span className="text-sm text-slate-600">{user.lastLogin || "لم يسجل دخول"}</span>
                </td>

                {/* مرات الدخول */}
                <td className="p-3 text-center">
                  <Link
                    href={`/login-logs?userId=${user.id}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-sm font-medium transition"
                    title="عرض سجل الدخول"
                  >
                    <FontAwesomeIcon icon={faHistory} className="text-xs" />
                    {user.loginCount ?? 0}
                  </Link>
                </td>

                {/* العمليات */}
                <td className="p-3">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => openEditUserModal(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm"
                      title="تعديل"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleToggleActivation(user)}
                      className={`p-2 rounded-lg transition text-sm ${user.isConfirmed === "مفعل" ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"}`}
                      title={user.isConfirmed === "مفعل" ? "تعطيل الحساب" : "تفعيل الحساب"}
                    >
                      <FontAwesomeIcon icon={user.isConfirmed === "مفعل" ? faCheckCircle : faTimesCircle} />
                    </button>
                    <button
                      onClick={() => handleToggleLock(user)}
                      className={`p-2 rounded-lg transition text-sm ${user.isLocked ? "text-green-600 hover:bg-green-50" : "text-amber-600 hover:bg-amber-50"}`}
                      title={user.isLocked ? "فك الحظر" : "حظر"}
                    >
                      <FontAwesomeIcon icon={user.isLocked ? faLockOpen : faLock} />
                    </button>
                    <button
                      onClick={() => openDeleteUserModal(user)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm"
                      title="حذف"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          عرض {users.length === 0 ? 0 : indexOfFirst + 1} إلى {Math.min(indexOfLast, users.length)} من {users.length} مستخدم
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2.5 py-1.5 rounded-lg border text-sm ${currentPage === 1 ? "opacity-40 cursor-not-allowed border-slate-200" : "hover:bg-slate-50 border-slate-200"}`}
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((p, idx, arr) => (
              <span key={p} className="flex items-center gap-1">
                {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-slate-400 text-xs px-1">...</span>}
                <button
                  onClick={() => paginate(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${currentPage === p ? "bg-emerald-700 text-white" : "hover:bg-slate-50 border border-slate-200"}`}
                >
                  {p}
                </button>
              </span>
            ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-2.5 py-1.5 rounded-lg border text-sm ${currentPage === totalPages || totalPages === 0 ? "opacity-40 cursor-not-allowed border-slate-200" : "hover:bg-slate-50 border-slate-200"}`}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
