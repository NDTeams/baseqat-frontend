import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function FilterModal({ applyFilters, clearFilters }: { applyFilters: () => void; clearFilters: () => void }) {
  const [isOpen, setIsOpen] = useState(true); // تحكم في ظهور المودال

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm mx-4 sm:mx-auto rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">تصفية المستخدمين</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* الحالة */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-[#30846C] text-sm">
                الحالة
              </label>
              <select
                id="statusFilter"
                className="w-full border border-gray-300 rounded px-3 py-2"
                onChange={applyFilters}
              >
                <option value="">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>

            {/* الصلاحيات */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-[#30846C] text-sm">
                الصلاحيات
              </label>
              <select
                id="permissionFilter"
                className="w-full border border-gray-300 rounded px-3 py-2"
                onChange={applyFilters}
              >
                <option value="">جميع الصلاحيات</option>
                <option value="إدارة العروض">إدارة العروض</option>
                <option value="الاشراف على المهام">الاشراف على المهام</option>
                <option value="الاطلاع فقط">الاطلاع فقط</option>
              </select>
            </div>

            {/* الأزرار */}
            <div className="text-right">
              <button
                className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
                onClick={clearFilters}
              >
                مسح الفلاتر
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
