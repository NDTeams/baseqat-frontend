"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import type { UserData } from "./addUser-section";

interface DeleteUserModalProps {
  user: UserData;
  closeModal: () => void;
  onDelete: () => Promise<void>;
}

export default function DeleteUserModal({ user, closeModal, onDelete }: DeleteUserModalProps) {
  const router = useRouter();

  const goToDeletePage = () => {
    closeModal();
    router.push(`/delete-user?userId=${user.id}`);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center" onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-2xl" />
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-2">حذف مستخدم</h3>
        <p className="text-sm text-slate-500 mb-1">
          هل أنت متأكد من حذف المستخدم
        </p>
        <p className="text-sm font-bold text-slate-800 mb-4">
          {user.fullName || user.userName}؟
        </p>
        <p className="text-xs text-amber-600 mb-6 bg-amber-50 rounded-lg p-2">
          يُنصح بمراجعة البيانات المرتبطة وتصديرها قبل الحذف
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={goToDeletePage}
            className="w-full px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faEye} />
            مراجعة البيانات والحذف
          </button>
          <button
            onClick={closeModal}
            className="w-full px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
