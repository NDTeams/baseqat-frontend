"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendar, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

interface UserGridProps {
  users: any[];
  openEditUserModal: (user: any) => void;
}

export default function UserGrid({ users, openEditUserModal }: UserGridProps) {
  return (
    <div className="grid-container p-4 sm:p-6" id="gridView">
      <div className="users-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {users.map((user, i) => (
          <div key={i} className="border rounded-xl p-4 bg-white shadow-sm flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex gap-1 items-center px-2 py-1 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                <span className="w-2 h-2 rounded-full bg-current mr-1"></span>
                {user.status === "active" ? "نشط" : "غير نشط"}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
              {user.permissions.map((perm: string, idx: number) => (
                <span key={idx} className={`px-2 py-1 text-xs rounded-md ${perm.includes("غير") ? "bg-red-50 text-red-700 border border-red-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                  {perm}
                </span>
              ))}
            </div>

            <div className="flex items-center text-sm text-gray-400 gap-1">
              <FontAwesomeIcon icon={faCalendar} className="text-xs" />
              <span>{user.date}</span>
            </div>

            <div className="mt-4 flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button onClick={() => openEditUserModal(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
