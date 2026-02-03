"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";

interface DeleteUserModalProps {
  closeModal: () => void;
}

export default function DeleteUserModal({ closeModal }: DeleteUserModalProps) {
  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="delete-modal-container w-full max-w-sm mx-4 sm:mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="delete-modal-header text-center space-y-3">
          <div className="w-16 h-16 bg-red-100 border-2 border-red-200 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-red-600">
            <FontAwesomeIcon icon={faExclamation} />
          </div>
          <h3 className="delete-modal-title text-lg font-semibold text-gray-800">حذف مستخدم</h3>
          <p className="delete-modal-message text-gray-600">هل انت متأكد من حذف هذا المستخدم؟</p>
        </div>
        <div className="flex justify-center gap-4 mt-6 ">
          <button className="btn-delete bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition">
            حذف
          </button>
          <button className="btn-cancel-delete bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition" onClick={closeModal}>
            الغاء
          </button>
        </div>
      </div>
    </div>
  );
}
