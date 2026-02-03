"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent } from "react";

interface AddEditUserModalProps {
  selectedUser: any;
  profilePreview: string | null;
  handleProfileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  closeModal: () => void;
}

export default function AddEditUserModal({
  selectedUser,
  profilePreview,
  handleProfileChange,
  closeModal
}: AddEditUserModalProps) {

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="modal-container w-full max-w-md mx-4 sm:mx-auto bg-white rounded-2xl p-6 relative">
        <button className="absolute top-4 right-4 text-gray-500" onClick={closeModal}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="modal-header flex justify-center mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-gray-500 cursor-pointer transition-all duration-200 relative overflow-hidden cursor-pointer" onClick={() => document.getElementById('profileImageInput')?.click()}>
            {!profilePreview ? (
              <FontAwesomeIcon icon={faUserPlus} size="1.5xp" />
            ) : (
              <img src={profilePreview} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover" />
            )}
            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleProfileChange}
            />
          </div>
        </div>

        <form className="modal-form space-y-3">
          <div className="form-group">
            <label htmlFor="userName ">اسم المستخدم</label>
            <input
              type="text"
              id="userName"
              defaultValue={selectedUser?.name}
              placeholder="اسم المستخدم"
              required
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="userEmail">البريد الالكتروني</label>
            <input
              type="email"
              id="userEmail"
              defaultValue={selectedUser?.email}
              placeholder="البريد الالكتروني"
              required
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="userRole">الدور</label>
            <input
              type="text"
              id="userRole"
              placeholder="الدور"
              required
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="form-group">
            <label className="permissions-label">الصلاحيات</label>
            <div className="permissions-group flex flex-col gap-1">
              <label className="checkbox-label flex items-center gap-2">
                <input type="checkbox" name="permissions" value="manage-offers" />
                إدارة العروض
              </label>
              <label className="checkbox-label flex items-center gap-2">
                <input type="checkbox" name="permissions" value="supervise-tasks" />
                الاشراف على المهام
              </label>
              <label className="checkbox-label flex items-center gap-2">
                <input type="checkbox" name="permissions" value="view-only" />
                الاطلاع فقط
              </label>
            </div>
          </div>
          <div className="modal-actions flex justify-end gap-2 mt-3">
            <button type="button" className="btn-cancel px-3 py-1 rounded border" onClick={closeModal}>
              الغاء
            </button>
            <button type="submit" className="btn-add px-3 py-1 rounded bg-green-600 text-white">
              {selectedUser ? "تحديث" : "اضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
