"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface FilterModalProps {
  closeModal: () => void;
}

export default function FilterModal({ closeModal }: FilterModalProps) {
  return (
    <div className="filter-modal-overlay fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="filter-modal-container w-full max-w-sm mx-4 sm:mx-auto bg-white rounded-2xl p-6 relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 ">
          <h3 className="text-xl font-semibold text-[#30846C] m-0 font-semibold">تصفية المستخدمين</h3>
          <button className="filter-modal-close text-gray-500" onClick={closeModal}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* الحالة */}
        <div className="mb-4 ">
          <label className="block mb-1 font-semibold text-[#30846C] text-sm">الحالة</label>
          <select id="statusFilter" className="w-full border border-gray-300 rounded px-3 py-2">
            <option value="">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
        </div>

        {/* الصلاحيات */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-[#30846C] text-sm">الصلاحيات</label>
          <select id="permissionFilter" className="w-full border border-gray-300 rounded px-3 py-2">
            <option value="">جميع الصلاحيات</option>
            <option value="إدارة العروض">إدارة العروض</option>
            <option value="الاشراف على المهام">الاشراف على المهام</option>
            <option value="الاطلاع فقط">الاطلاع فقط</option>
          </select>
        </div>

        {/* زر مسح الفلاتر */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button className="w-full px-6 py-3 bg-[#30846C] text-white rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 ease-in-out">
            مسح الفلاتر
          </button>
        </div>

      </div>
    </div>
  );
}
