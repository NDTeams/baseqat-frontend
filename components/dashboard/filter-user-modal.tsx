"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface FilterModalProps {
  closeModal: () => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  filterRole: string;
  setFilterRole: (val: string) => void;
  allRoles: string[];
}

export default function FilterModal({ closeModal, filterStatus, setFilterStatus, filterRole, setFilterRole, allRoles }: FilterModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">تصفية المستخدمين</h3>
          <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* الحالة */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">الحالة</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
            >
              <option value="">جميع الحالات</option>
              <option value="confirmed">مفعل</option>
              <option value="unconfirmed">غير مفعل</option>
              <option value="locked">محظور</option>
              <option value="active">نشط (غير محظور)</option>
            </select>
          </div>

          {/* الدور */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">الدور</label>
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
            >
              <option value="">جميع الأدوار</option>
              {allRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* الأزرار */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => { setFilterStatus(""); setFilterRole(""); }}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              مسح الفلاتر
            </button>
            <button
              onClick={closeModal}
              className="flex-1 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold transition"
            >
              تطبيق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
