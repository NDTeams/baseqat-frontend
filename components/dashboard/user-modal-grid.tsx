'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faShieldAlt, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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

interface UserGridProps {
  users: User[];
  isLoading: boolean;
  handleOpenPhotoModal: (user: User) => void;
  handleOpenPrivilegesModal: (user: User) => void;
  handleEditUser: (user: User) => void;
  handleDeleteUser: (user: User) => void;
}

const SkeletonUserCard = () => (
  <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center animate-pulse">
    <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
    <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-40 mb-4"></div>
    <div className="h-6 w-20 bg-gray-200 rounded-full mb-4"></div>
    <div className="flex gap-1 mb-4">
      <div className="h-5 w-24 bg-gray-200 rounded"></div>
    </div>
    <div className="flex gap-2 mt-auto">
      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

export default function UserGrid({
  users,
  isLoading,
  handleOpenPhotoModal,
  handleOpenPrivilegesModal,
  handleEditUser,
  handleDeleteUser,
}: UserGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {isLoading ? (
        Array.from({ length: 8 }).map((_, index) => <SkeletonUserCard key={index} />)
      ) : (
        users.map((user, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
            <div
              onClick={() => handleOpenPhotoModal(user)}
              className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-2xl text-gray-500 overflow-hidden relative group cursor-pointer"
            >
              {user.userImage ? (
                <img src={user.userImage} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <span>{user.fullName.charAt(0)}</span>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <FontAwesomeIcon icon={faCamera} className="text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.fullName}</h3>
            <p className="text-sm text-gray-500 mb-2">{user.email}</p>
            <p className="text-xs text-gray-400 mb-2">انضم في: {user.joinedDate}</p>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${
                user.isConfirmed === 'مفعل' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ml-1 ${
                  user.isConfirmed === 'مفعل' ? 'bg-green-400' : 'bg-red-400'
                }`}
              ></span>
              {user.isConfirmed}
            </span>
            {user.userType && (
              <div className="flex flex-wrap justify-center gap-1 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {user.userType}
                </span>
              </div>
            )}
            <div className="flex space-x-2 space-x-reverse mt-auto">
              <button
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors cursor-pointer"
                onClick={() => handleOpenPrivilegesModal(user)}
                title="الصلاحيات"
              >
                <FontAwesomeIcon icon={faShieldAlt} />
              </button>
              <button
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors cursor-pointer"
                onClick={() => handleEditUser(user)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                onClick={() => handleDeleteUser(user)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}