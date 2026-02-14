'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faExclamation,
  faCheck,
  faEye,
  faEyeSlash,
  faUserPlus,
  // faPlus,
  // faShieldAlt,
  // faCreditCard,
  faCamera,
  // faKey,
} from '@fortawesome/free-solid-svg-icons';

// ✅ البيانات الثابتة داخل المكون
const MOCK_PRIVILEGES = [
  { id: 1, name: "ادارة المستخدمين" },
  { id: 2, name: "ادارة المجموعات" },
  { id: 3, name: "ادارة الصلاحيات" },
  { id: 4, name: "صلاحيات الطلبات" },
  { id: 5, name: "صلاحيات المشاريع" },
  { id: 6, name: "تعديل حالة الطلبات" },
  { id: 7, name: "قبول الطلبات" },
];

const MOCK_PLANS = [
  { id: 1, name: "باقة أساسية", cost: 100, daysNo: 30 },
  { id: 2, name: "باقة متقدمة", cost: 250, daysNo: 90 },
  { id: 3, name: "باقة سنوية", cost: 800, daysNo: 365 },
];

// interface User {
//   id: string;
//   userName: string;
//   email: string;
//   phoneNumber: string;
//   fullName: string;
//   userType?: string;
//   joinedDate: string;
//   isConfirmed: string;
//   isLocked: boolean;
//   userImage: string | null;
// }

interface UserModalsProps {
  isAddUserModalOpen: boolean;
  setIsAddUserModalOpen: (open: boolean) => void;
  modalMode: 'add' | 'edit';
  newUser: {
    email: string;
    fullName: string;
    phoneNumber: string;
    password: string;
  };
  setNewUser: React.Dispatch<React.SetStateAction<{
    email: string;
    fullName: string;
    phoneNumber: string;
    password: string;
  }>>;
  handleSubmit: (e: React.FormEvent) => void;
  errorMessage: string;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  confirmDelete: () => void;
  isPrivilegesModalOpen: boolean;
  setIsPrivilegesModalOpen: (open: boolean) => void;
  userPrivileges: Record<number, { insert: boolean; delete: boolean; update: boolean; view: boolean }>;
  setUserPrivileges: React.Dispatch<React.SetStateAction<Record<number, { insert: boolean; delete: boolean; update: boolean; view: boolean }>>>;
  handleSaveUserPrivileges: () => void;
  isPrivilegesLoading: boolean;
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (open: boolean) => void;
  selectedPlanId: string | number;
  setSelectedPlanId: (id: string | number) => void;
  handleSubscribeUser: (e: React.FormEvent) => void;
  isPhotoModalOpen: boolean;
  setIsPhotoModalOpen: (open: boolean) => void;
  photoPreview: string | null;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdatePhoto: (e: React.FormEvent) => void;
  photoFile: File | null;
  isResetPasswordModalOpen: boolean;
  setIsResetPasswordModalOpen: (open: boolean) => void;
  resetData: { userId: string; newPassword: string };
  setResetData: React.Dispatch<React.SetStateAction<{ userId: string; newPassword: string }>>;
  showResetPassword: boolean;
  setShowResetPassword: (show: boolean) => void;
  handleResetPassword: (e: React.FormEvent) => void;
  statusModal: { open: boolean; type: 'success' | 'error'; message: string };
  setStatusModal: React.Dispatch<React.SetStateAction<{ open: boolean; type: 'success' | 'error'; message: string }>>;
}

export default function UserModals({
  isAddUserModalOpen,
  setIsAddUserModalOpen,
  modalMode,
  newUser,
  setNewUser,
  handleSubmit,
  errorMessage,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  confirmDelete,
  isPrivilegesModalOpen,
  setIsPrivilegesModalOpen,
  userPrivileges,
  setUserPrivileges,
  handleSaveUserPrivileges,
  isPrivilegesLoading,
  isSubscriptionModalOpen,
  setIsSubscriptionModalOpen,
  selectedPlanId,
  setSelectedPlanId,
  handleSubscribeUser,
  isPhotoModalOpen,
  setIsPhotoModalOpen,
  photoPreview,
  handlePhotoChange,
  handleUpdatePhoto,
  photoFile,
  isResetPasswordModalOpen,
  setIsResetPasswordModalOpen,
  resetData,
  setResetData,
  showResetPassword,
  setShowResetPassword,
  handleResetPassword,
  statusModal,
  setStatusModal,
}: UserModalsProps) {
  return (
    <>
      {/* Add User Modal */}
      <div id="addUserModal" className={`fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 ${isAddUserModalOpen ? '' : 'hidden'}`}>
        <div className="w-full max-w-2xl mx-4 sm:mx-auto bg-white rounded-2xl p-6 relative">
          <button className="absolute top-4 right-4 text-gray-500" onClick={() => setIsAddUserModalOpen(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className="text-gray-500 cursor-pointer bg-gray-100 rounded-full flex justify-center items-center w-16 h-16 mx-auto mb-4 text-xl transition-all duration-200 relative overflow-hidden">
            <div className="cursor-pointer" onClick={() => document.getElementById('profileImageInput')?.click()}>
              <FontAwesomeIcon icon={faUserPlus} size="1x" />
              <img id="profileImagePreview" style={{ display: 'none' }} alt="Profile Preview" />
              <input type="file" id="profileImageInput" accept="image/*" style={{ display: 'none' }} />
            </div>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="الاسم الكامل"
                  required
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">البريد الالكتروني</label>
                <input
                  type="email"
                  id="userEmail"
                  placeholder="البريد الالكتروني"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  placeholder="رقم الهاتف"
                  required
                  value={newUser.phoneNumber}
                  onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="كلمة المرور"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="px-4 py-2 rounded border text-gray-700" onClick={() => setIsAddUserModalOpen(false)}>
                الغاء
              </button>
              <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">
                {modalMode === 'add' ? 'اضافة' : 'تحديث'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div id="deleteModal" className={`fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 ${isDeleteModalOpen ? '' : 'hidden'}`}>
        <div className="w-full max-w-sm mx-4 sm:mx-auto bg-white rounded-2xl p-6 text-center">
          <div className="mb-3">
            <FontAwesomeIcon icon={faExclamation} className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">حذف مستخدم</h3>
          <p className="text-gray-600 mb-6">هل انت متأكد من حذف هذا المستخدم؟</p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg" onClick={confirmDelete}>حذف</button>
            <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg" onClick={() => setIsDeleteModalOpen(false)}>الغاء</button>
          </div>
        </div>
      </div>

      {/* Privileges Modal */}
      <div className={`fixed inset-0 z-[3000] flex items-center justify-center ${isPrivilegesModalOpen ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsPrivilegesModalOpen(false)}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">صلاحيات المستخدم</h3>
            <button onClick={() => setIsPrivilegesModalOpen(false)} className="text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-sm font-bold text-gray-700">اسم الصلاحية</th>
                    <th className="p-4 text-sm font-bold text-gray-700 text-center">إضافة</th>
                    <th className="p-4 text-sm font-bold text-gray-700 text-center">حذف</th>
                    <th className="p-4 text-sm font-bold text-gray-700 text-center">تعديل</th>
                    <th className="p-4 text-sm font-bold text-gray-700 text-center">عرض</th>
                  </tr>
                </thead>
                <tbody>
                  {isPrivilegesLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index} className="border-b border-gray-100 animate-pulse">
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                        <td className="p-4 text-center"><div className="h-6 w-11 bg-gray-200 rounded-full mx-auto"></div></td>
                        <td className="p-4 text-center"><div className="h-6 w-11 bg-gray-200 rounded-full mx-auto"></div></td>
                        <td className="p-4 text-center"><div className="h-6 w-11 bg-gray-200 rounded-full mx-auto"></div></td>
                        <td className="p-4 text-center"><div className="h-6 w-11 bg-gray-200 rounded-full mx-auto"></div></td>
                      </tr>
                    ))
                  ) : (
                    MOCK_PRIVILEGES.map((privilege) => (
                      <tr key={privilege.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-800 font-medium">{privilege.name}</td>
                        {(['insert', 'delete', 'update', 'view'] as const).map((action) => (
                          <td key={action} className="p-4 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                setUserPrivileges((prev) => ({
                                  ...prev,
                                  [privilege.id]: {
                                    ...prev[privilege.id],
                                    [action]: !prev[privilege.id]?.[action],
                                  },
                                }))
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                userPrivileges[privilege.id]?.[action] ? 'bg-primary' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  userPrivileges[privilege.id]?.[action] ? '-translate-x-6' : '-translate-x-1'
                                }`}
                              />
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button
              onClick={() => setIsPrivilegesModalOpen(false)}
              className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
            >
              الغاء
            </button>
            <button
              onClick={handleSaveUserPrivileges}
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-opacity-90 shadow-lg shadow-primary/30"
            >
              حفظ الصلاحيات
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      <div className={`fixed inset-0 z-[3000] flex items-center justify-center ${isSubscriptionModalOpen ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSubscriptionModalOpen(false)}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">اشتراك في باقة</h3>
            <button onClick={() => setIsSubscriptionModalOpen(false)} className="text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <form onSubmit={handleSubscribeUser} className="p-6">
            <div className="mb-6">
              <label htmlFor="planSelect" className="block text-sm font-medium text-gray-700 mb-2">اختر الباقة</label>
              <select
                id="planSelect"
                required
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              >
                <option value="">اختر باقة...</option>
                {MOCK_PLANS.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - {plan.cost} ر.س - {plan.daysNo} يوم
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsSubscriptionModalOpen(false)}
                className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
              >
                الغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 shadow-lg shadow-green-600/30"
              >
                حفظ الاشتراك
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Photo Modal */}
      <div className={`fixed inset-0 z-[3000] flex items-center justify-center ${isPhotoModalOpen ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsPhotoModalOpen(false)}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">تحديث الصورة الشخصية</h3>
              <button onClick={() => setIsPhotoModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleUpdatePhoto} className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-6 group cursor-pointer" onClick={() => document.getElementById('updatePhotoInput')?.click()}>
                <img
                  src={photoPreview || "https://via.placeholder.com/150"}
                  className="w-full h-full rounded-full object-cover border-4 border-gray-100 shadow-lg group-hover:opacity-75"
                  alt="Profile Preview"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FontAwesomeIcon icon={faCamera} className="text-white text-2xl drop-shadow-lg" />
                </div>
                <input
                  type="file"
                  id="updatePhotoInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="w-full flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
                >
                  الغاء
                </button>
                <button
                  type="submit"
                  disabled={!photoFile}
                  className={`px-6 py-2.5 rounded-lg text-white font-medium transition-colors shadow-lg ${
                    !photoFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-opacity-90 shadow-primary/30'
                  }`}
                >
                  حفظ الصورة
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      <div className={`fixed inset-0 z-[3000] flex items-center justify-center ${isResetPasswordModalOpen ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsResetPasswordModalOpen(false)}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">تغيير كلمة المرور</h3>
            <button onClick={() => setIsResetPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <form onSubmit={handleResetPassword} className="p-6">
            <div className="mb-6">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الجديدة</label>
              <div className="relative">
                <input
                  type={showResetPassword ? "text" : "password"}
                  id="newPassword"
                  required
                  value={resetData.newPassword}
                  onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pl-10"
                  placeholder="ادخل كلمة المرور الجديدة"
                />
                <button
                  type="button"
                  onClick={() => setShowResetPassword(!showResetPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={showResetPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
              >
                الغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-yellow-600 text-white font-medium hover:bg-yellow-700 shadow-lg shadow-yellow-600/30"
              >
                تغيير كلمة المرور
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Status Modal */}
      <div className={`fixed inset-0 z-[3001] flex items-center justify-center ${statusModal.open ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setStatusModal({ ...statusModal, open: false })}></div>
        <div className={`relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden border-t-4 ${statusModal.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          <div className="p-6 text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${statusModal.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <FontAwesomeIcon icon={statusModal.type === 'success' ? faCheck : faTimes} className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {statusModal.type === 'success' ? 'تمت العملية بنجاح' : 'خطأ'}
            </h3>
            <p className="text-gray-600 mb-6">{statusModal.message}</p>
            <button
              onClick={() => setStatusModal({ ...statusModal, open: false })}
              className={`px-6 py-2.5 rounded-lg text-white font-medium shadow-lg transition-colors ${
                statusModal.type === 'success'
                  ? 'bg-green-600 hover:bg-green-700 shadow-green-600/30'
                  : 'bg-red-600 hover:bg-red-700 shadow-red-600/30'
              }`}
            >
              حسناً
            </button>
          </div>
        </div>
      </div>
    </>
  );
}