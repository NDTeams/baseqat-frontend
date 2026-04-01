"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendar, faEdit, faTrash, faLock, faLockOpen, faEnvelope, faPhone, faHistory, faSignInAlt, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import type { UserData } from "./addUser-section";

interface UserGridProps {
  users: UserData[];
  currentPage: number;
  usersPerPage: number;
  openEditUserModal: (user: UserData) => void;
  openDeleteUserModal: (user: UserData) => void;
  handleToggleLock: (user: UserData) => void;
  handleToggleActivation: (user: UserData) => void;
}

export default function UserGrid({ users, currentPage, usersPerPage, openEditUserModal, openDeleteUserModal, handleToggleLock, handleToggleActivation }: UserGridProps) {
  const paged = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  if (paged.length === 0) {
    return <div className="text-center py-16 text-slate-400 text-sm">لا توجد نتائج</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {paged.map((user) => (
        <div key={user.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user.userImage ? (
                <img src={user.userImage} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <FontAwesomeIcon icon={faUser} className="text-emerald-700 text-lg" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-800 text-sm truncate">{user.fullName || user.userName}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                {user.isLocked ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> محظور
                  </span>
                ) : user.isConfirmed === "مفعل" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> مفعل
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> غير مفعل
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* معلومات */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 w-3" />
              <span className="truncate">{user.email}</span>
            </div>
            {user.phoneNumber && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FontAwesomeIcon icon={faPhone} className="text-slate-400 w-3" />
                <span dir="ltr">{user.phoneNumber}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FontAwesomeIcon icon={faCalendar} className="text-slate-400 w-3" />
              <span>{user.joinedDate || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FontAwesomeIcon icon={faSignInAlt} className="text-slate-400 w-3" />
              <span>{user.lastLogin || "لم يسجل دخول"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FontAwesomeIcon icon={faHistory} className="text-slate-400 w-3" />
              <Link href={`/login-logs?userId=${user.id}`} className="hover:text-emerald-700 transition">
                عدد الدخول: {user.loginCount ?? 0}
              </Link>
            </div>
          </div>

          {/* الأدوار */}
          <div className="flex flex-wrap gap-1 mb-4">
            {user.roles?.length > 0 ? user.roles.map((role, idx) => (
              <span key={idx} className="px-2 py-0.5 text-[10px] rounded-md bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                {role}
              </span>
            )) : (
              <span className="text-[10px] text-slate-400">بدون دور</span>
            )}
          </div>

          {/* العمليات */}
          <div className="flex justify-end gap-1 pt-3 border-t border-slate-100">
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
        </div>
      ))}
    </div>
  );
}
