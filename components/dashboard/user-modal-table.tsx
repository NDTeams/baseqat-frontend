'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faShieldAlt,
  faCreditCard,
  faEdit,
  faTrash,
  faKey,
} from '@fortawesome/free-solid-svg-icons';

interface User {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  userType?: string;
  joinedDate: string;
  isConfirmed: string;
  isLocked: boolean;
  userImage: string | null;
}

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  handleOpenPhotoModal: (user: User) => void;
  handleToggleLock: (user: User) => void;
  handleOpenPrivilegesModal: (user: User) => void;
  handleOpenSubscriptionModal: (user: User) => void;
  handleEditUser: (user: User) => void;
  handleDeleteUser: (user: User) => void;
  handleOpenResetPasswordModal: (user: User) => void;
}

const SkeletonUserRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    <td className="px-6 py-4 whitespace-nowrap">
      <div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
    </td>
    <td className="px-6 py-4">
      <div className="flex gap-1">
        <div className="h-5 w-20 bg-gray-200 rounded"></div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex gap-3">
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
      </div>
    </td>
  </tr>
);

export default function UserTable({
  users,
  isLoading,
  handleOpenPhotoModal,
  handleToggleLock,
  handleOpenPrivilegesModal,
  handleOpenSubscriptionModal,
  handleEditUser,
  handleDeleteUser,
  handleOpenResetPasswordModal,
}: UserTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full whitespace-nowrap text-right">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">المستخدم</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الهاتف</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الانضمام</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => <SkeletonUserRow key={index} />)
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div onClick={() => handleOpenPhotoModal(user)} className="cursor-pointer relative group inline-block">
                    <img
                      src={user.userImage || "https://via.placeholder.com/40"}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 group-hover:opacity-75 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <FontAwesomeIcon icon={faCamera} className="text-white text-[10px]" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinedDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!user.isLocked}
                      onChange={() => handleToggleLock(user)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-purple-600 hover:text-purple-900 ml-3 cursor-pointer"
                    onClick={() => handleOpenPrivilegesModal(user)}
                    title="الصلاحيات"
                  >
                    <FontAwesomeIcon icon={faShieldAlt} />
                  </button>
                  <button
                    className="text-green-600 hover:text-green-900 ml-3 cursor-pointer"
                    onClick={() => handleOpenSubscriptionModal(user)}
                    title="اشتراك في باقة"
                  >
                    <FontAwesomeIcon icon={faCreditCard} />
                  </button>
                  <button
                    className="text-indigo-600 hover:text-indigo-900 ml-3 cursor-pointer"
                    onClick={() => handleEditUser(user)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 cursor-pointer"
                    onClick={() => handleDeleteUser(user)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    className="text-yellow-600 hover:text-yellow-900 ml-3 mr-4 cursor-pointer"
                    onClick={() => handleOpenResetPasswordModal(user)}
                    title="تغيير كلمة المرور"
                  >
                    <FontAwesomeIcon icon={faKey} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}