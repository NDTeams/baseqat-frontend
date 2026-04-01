"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUser, faEnvelope, faPhone, faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";
import type { UserData } from "./addUser-section";

interface AddEditUserModalProps {
  selectedUser: UserData | null;
  closeModal: () => void;
  onSave: (data: { fullName: string; email: string; phoneNumber: string; password?: string }) => Promise<void>;
}

export default function AddEditUserModal({ selectedUser, closeModal, onSave }: AddEditUserModalProps) {
  const [fullName, setFullName] = useState(selectedUser?.fullName || "");
  const [email, setEmail] = useState(selectedUser?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(selectedUser?.phoneNumber || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "الاسم مطلوب";
    if (!email.trim()) errs.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "بريد إلكتروني غير صحيح";
    if (!phoneNumber.trim()) errs.phoneNumber = "رقم الهاتف مطلوب";
    if (!selectedUser && !password.trim()) errs.password = "كلمة المرور مطلوبة";
    if (password && password.length < 6) errs.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({ fullName, email, phoneNumber, password: password || undefined });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">
            {selectedUser ? "تعديل مستخدم" : "إضافة مستخدم جديد"}
          </h3>
          <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* الاسم */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">الاسم الكامل</label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="أدخل الاسم الكامل"
                className={`w-full pe-4 ps-10 py-2.5 border rounded-xl text-sm outline-none transition ${errors.fullName ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-emerald-500"} focus:ring-2`}
              />
              <FontAwesomeIcon icon={faUser} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            </div>
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* البريد */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                dir="ltr"
                className={`w-full pe-4 ps-10 py-2.5 border rounded-xl text-sm outline-none transition ${errors.email ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-emerald-500"} focus:ring-2`}
              />
              <FontAwesomeIcon icon={faEnvelope} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* الهاتف */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">رقم الهاتف</label>
            <div className="relative">
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="05XXXXXXXX"
                dir="ltr"
                className={`w-full pe-4 ps-10 py-2.5 border rounded-xl text-sm outline-none transition ${errors.phoneNumber ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-emerald-500"} focus:ring-2`}
              />
              <FontAwesomeIcon icon={faPhone} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            </div>
            {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* كلمة المرور */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              كلمة المرور {selectedUser && <span className="text-xs text-slate-400 font-normal">(اتركها فارغة لعدم التغيير)</span>}
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={selectedUser ? "كلمة مرور جديدة (اختياري)" : "أدخل كلمة المرور"}
                dir="ltr"
                className={`w-full pe-4 ps-10 py-2.5 border rounded-xl text-sm outline-none transition ${errors.password ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-emerald-500"} focus:ring-2`}
              />
              <FontAwesomeIcon icon={faLock} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* الأزرار */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
              {selectedUser ? "تحديث" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
