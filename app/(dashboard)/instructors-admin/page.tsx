'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faSearch, faEdit, faTrash, faEyeSlash, faCheck, faTimes,
  faSpinner, faTriangleExclamation, faUserTie, faChevronLeft, faChevronRight,
  faTrashRestore, faMars, faVenus, faCamera, faFileArrowUp, faFilePdf,
  faDownload, faImage, faEye, faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import {
  InstructorAdminService,
  InstructorSkillAdminService,
  type Instructor,
} from '@/services/courses/page';

// ===========================
// Types
// ===========================
interface FormData {
  name: string;
  title: string;
  bio: string;
  gender: number;
  rating: number | null;
  totalStudents: number | null;
  totalCources: number | null;
  // بيانات الحساب (عند الإضافة فقط)
  email: string;
  phoneNumber: string;
  password: string;
  // بيانات إضافية
  yearsOfExperience: number | null;
  linkedInUrl: string;
  xUrl: string;
  instagramUrl: string;
  facebookUrl: string;
}

interface StatusNotif {
  open: boolean;
  type: 'success' | 'error';
  message: string;
}

const EMPTY_FORM: FormData = {
  name: '', title: '', bio: '', gender: 1, rating: null, totalStudents: null, totalCources: null,
  email: '', phoneNumber: '', password: '',
  yearsOfExperience: null, linkedInUrl: '', xUrl: '', instagramUrl: '', facebookUrl: '',
};
const PAGE_SIZE = 10;
import { API_BASE, getFileUrl } from '@/lib/config';

// ===========================
// Status Toggle
// ===========================
function StatusToggle({ isActive, loading, onToggle }: { isActive: boolean; loading: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      disabled={loading}
      className="group relative w-[52px] h-[28px] rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50 cursor-pointer"
      style={{ background: isActive ? 'linear-gradient(135deg, #10b981, #2558FF)' : 'linear-gradient(135deg, #e5e7eb, #d1d5db)' }}
      title={isActive ? 'اضغط لإلغاء التفعيل' : 'اضغط للتفعيل'}
    >
      <span
        className={`absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${
          isActive ? 'right-[3px] group-hover:right-[5px]' : 'right-[27px] group-hover:right-[25px]'
        }`}
      >
        {loading ? (
          <FontAwesomeIcon icon={faSpinner} className={`animate-spin text-[9px] ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
        ) : isActive ? (
          <FontAwesomeIcon icon={faCheck} className="text-[8px] text-blue-500" />
        ) : (
          <FontAwesomeIcon icon={faTimes} className="text-[8px] text-gray-400" />
        )}
      </span>
    </button>
  );
}

// ===========================
// Gender Badge
// ===========================
function GenderBadge({ gender }: { gender: number }) {
  return gender === 1 ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
      <FontAwesomeIcon icon={faMars} className="text-xs" />
      ذكر
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-700">
      <FontAwesomeIcon icon={faVenus} className="text-xs" />
      أنثى
    </span>
  );
}

// ===========================
// Skeleton Row
// ===========================
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 w-8 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-10 w-10 bg-gray-200 rounded-full" /></td>
      <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-200 rounded-full" /></td>
      <td className="px-6 py-4"><div className="h-4 w-12 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 rounded-full" /></td>
      <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
    </tr>
  );
}

// ===========================
// Add / Edit Modal
// ===========================
function InstructorFormModal({
  isOpen, isEditMode, initialData, loading, onClose, onSave,
}: {
  isOpen: boolean;
  isEditMode: boolean;
  initialData: FormData;
  loading: boolean;
  onClose: () => void;
  onSave: (data: FormData, avatarFile?: File, cvFile?: File) => void;
}) {
  const [form, setForm] = useState<FormData>(initialData);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(initialData);
    setAvatarFile(null);
    setAvatarPreview(null);
    setCvFile(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return;
    setAvatarFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return;
    setCvFile(f);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(form, avatarFile ?? undefined, cvFile ?? undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faUserTie} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              {isEditMode ? 'تعديل المدرب' : 'إضافة مدرب جديد'}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* ===== بيانات الحساب (عند الإضافة فقط) ===== */}
          {!isEditMode && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-sm font-bold text-blue-800">بيانات الحساب</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">البريد الإلكتروني <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="example@email.com" dir="ltr"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">رقم الهاتف <span className="text-red-500">*</span></label>
                <input type="tel" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} required placeholder="05XXXXXXXX" dir="ltr"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">كلمة المرور <span className="text-red-500">*</span></label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} placeholder="6 أحرف على الأقل" dir="ltr"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm" />
              </div>
            </div>
          )}

          {/* ===== البيانات الأساسية ===== */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">الاسم <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="مثال: أحمد محمد"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">اللقب <span className="text-red-500">*</span></label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="مثال: أستاذ برمجة"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">النبذة التعريفية <span className="text-red-500">*</span></label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} required rows={3} placeholder="نبذة عن المدرب..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">الجنس <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <label className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="radio" name="gender" value={1} checked={form.gender === 1} onChange={(e) => setForm({ ...form, gender: parseInt(e.target.value) })} className="text-blue-600 focus:ring-blue-500" />
                  <FontAwesomeIcon icon={faMars} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">ذكر</span>
                </label>
                <label className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="radio" name="gender" value={2} checked={form.gender === 2} onChange={(e) => setForm({ ...form, gender: parseInt(e.target.value) })} className="text-pink-600 focus:ring-pink-500" />
                  <FontAwesomeIcon icon={faVenus} className="text-pink-600" />
                  <span className="text-sm font-medium text-gray-700">أنثى</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">سنوات الخبرة</label>
              <input type="number" min="0" value={form.yearsOfExperience ?? ''} onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value ? parseInt(e.target.value) : null })} placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm" />
            </div>
          </div>

          {/* ===== الإحصائيات (عند التعديل فقط) ===== */}
          {isEditMode && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">التقييم</label>
                <input type="number" step="0.1" min="0" max="5" value={form.rating ?? ''} onChange={(e) => setForm({ ...form, rating: e.target.value ? parseFloat(e.target.value) : null })} placeholder="0 - 5"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">عدد الطلاب</label>
                <input type="number" min="0" value={form.totalStudents ?? ''} onChange={(e) => setForm({ ...form, totalStudents: e.target.value ? parseInt(e.target.value) : null })} placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">عدد الدورات</label>
                <input type="number" min="0" value={form.totalCources ?? ''} onChange={(e) => setForm({ ...form, totalCources: e.target.value ? parseInt(e.target.value) : null })} placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm" />
              </div>
            </div>
          )}

          {/* ===== روابط التواصل الاجتماعي ===== */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-bold text-gray-600">روابط التواصل الاجتماعي</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">LinkedIn</label>
                <input type="url" value={form.linkedInUrl} onChange={(e) => setForm({ ...form, linkedInUrl: e.target.value })} placeholder="https://linkedin.com/in/..." dir="ltr"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">X (Twitter)</label>
                <input type="url" value={form.xUrl} onChange={(e) => setForm({ ...form, xUrl: e.target.value })} placeholder="https://x.com/..." dir="ltr"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Instagram</label>
                <input type="url" value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} placeholder="https://instagram.com/..." dir="ltr"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Facebook</label>
                <input type="url" value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} placeholder="https://facebook.com/..." dir="ltr"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-xs" />
              </div>
            </div>
          </div>

          {/* ===== رفع الصورة والسيرة الذاتية ===== */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">الصورة الشخصية</label>
              <div
                onClick={() => avatarInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-colors"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="preview" className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-purple-200" />
                ) : (
                  <FontAwesomeIcon icon={faCamera} className="text-gray-300 text-2xl mb-2" />
                )}
                <p className="text-xs text-gray-500">{avatarFile ? avatarFile.name : 'اضغط لاختيار صورة'}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WEBP - 5MB</p>
              </div>
              <input ref={avatarInputRef} type="file" accept=".jpg,.jpeg,.png,.gif,.webp" onChange={handleAvatarChange} className="hidden" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">السيرة الذاتية (CV)</label>
              <div
                onClick={() => cvInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-colors"
              >
                {cvFile ? (
                  <FontAwesomeIcon icon={faFilePdf} className="text-red-500 text-2xl mb-2" />
                ) : (
                  <FontAwesomeIcon icon={faFileArrowUp} className="text-gray-300 text-2xl mb-2" />
                )}
                <p className="text-xs text-gray-500">{cvFile ? cvFile.name : 'اضغط لاختيار ملف'}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">PDF, DOC, DOCX - 5MB</p>
              </div>
              <input ref={cvInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="hidden" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60">
              {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faCheck} />}
              {isEditMode ? 'حفظ التعديلات' : 'إضافة المدرب'}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===========================
// Upload Modal (Avatar / CV)
// ===========================
function UploadModal({
  isOpen, type, instructor, onClose, onSuccess, showNotif,
}: {
  isOpen: boolean;
  type: 'avatar' | 'cv';
  instructor: Instructor | null;
  onClose: () => void;
  onSuccess: () => void;
  showNotif: (t: 'success' | 'error', m: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFile(null);
    setPreview(null);
  }, [isOpen]);

  if (!isOpen || !instructor) return null;

  const isAvatar = type === 'avatar';
  const accept = isAvatar ? '.jpg,.jpeg,.png,.gif,.webp' : '.pdf,.doc,.docx';
  const maxSize = isAvatar ? 5 : 5; // 5MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.size > maxSize * 1024 * 1024) {
      showNotif('error', `حجم الملف يجب أن لا يتجاوز ${maxSize} ميجابايت`);
      return;
    }
    setFile(f);
    if (isAvatar && f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const res = isAvatar
        ? await InstructorAdminService.uploadAvatar(instructor.id, file)
        : await InstructorAdminService.uploadCv(instructor.id, file);

      if (res.succeeded) {
        showNotif('success', isAvatar ? 'تم رفع الصورة بنجاح' : 'تم رفع السيرة الذاتية بنجاح');
        onClose();
        onSuccess();
      } else {
        showNotif('error', res.message || 'فشل الرفع');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAvatar ? 'bg-purple-100' : 'bg-orange-100'}`}>
              <FontAwesomeIcon icon={isAvatar ? faCamera : faFileArrowUp} className={isAvatar ? 'text-purple-600' : 'text-orange-600'} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {isAvatar ? 'رفع صورة شخصية' : 'رفع السيرة الذاتية'}
              </h2>
              <p className="text-xs text-gray-500">{instructor.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Current file info */}
          {isAvatar && instructor.avatarUrl && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <img src={getFileUrl(instructor.avatarUrl)} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
              <span className="text-sm text-gray-600">الصورة الحالية</span>
            </div>
          )}
          {!isAvatar && instructor.cvUrl && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <FontAwesomeIcon icon={faFilePdf} className="text-red-500 text-xl" />
              <span className="text-sm text-gray-600 flex-1">السيرة الذاتية الحالية</span>
              <a href={getFileUrl(instructor.cvUrl)} target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                <FontAwesomeIcon icon={faDownload} className="text-xs" /> تحميل
              </a>
            </div>
          )}

          {/* File picker */}
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-blue-200" />
            ) : file ? (
              <div className="mb-3">
                <FontAwesomeIcon icon={faFilePdf} className="text-red-500 text-4xl" />
              </div>
            ) : (
              <div className="mb-3">
                <FontAwesomeIcon icon={isAvatar ? faImage : faFileArrowUp} className="text-gray-300 text-4xl" />
              </div>
            )}

            {file ? (
              <div>
                <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-gray-600">اضغط لاختيار ملف</p>
                <p className="text-xs text-gray-400 mt-1">
                  {isAvatar ? 'JPG, PNG, GIF, WEBP' : 'PDF, DOC, DOCX'} - حد أقصى {maxSize}MB
                </p>
              </div>
            )}

            <input ref={inputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleUpload} disabled={!file || uploading}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-semibold rounded-xl transition-colors disabled:opacity-60 text-white ${isAvatar ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
              {uploading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={isAvatar ? faCamera : faFileArrowUp} />}
              {uploading ? 'جاري الرفع...' : 'رفع'}
            </button>
            <button onClick={onClose} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================
// Delete Confirmation Modal
// ===========================
function DeleteModal({ isOpen, instructor, loading, onClose, onConfirm }: {
  isOpen: boolean; instructor: Instructor | null; loading: boolean; onClose: () => void; onConfirm: () => void;
}) {
  if (!isOpen || !instructor) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">تأكيد الحذف</h2>
          <p className="text-gray-500 text-sm">
            هل أنت متأكد من حذف المدرب <span className="font-semibold text-gray-800">"{instructor.name}"</span>؟
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-60">
              {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faTrash} />}
              حذف
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================
// Restore Confirmation Modal
// ===========================
function RestoreModal({ isOpen, instructor, loading, onClose, onConfirm }: {
  isOpen: boolean; instructor: Instructor | null; loading: boolean; onClose: () => void; onConfirm: () => void;
}) {
  if (!isOpen || !instructor) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faTrashRestore} className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">تأكيد الاسترجاع</h2>
          <p className="text-gray-500 text-sm">
            هل أنت متأكد من استرجاع المدرب <span className="font-semibold text-gray-800">"{instructor.name}"</span>؟
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60">
              {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faTrashRestore} />}
              استرجاع
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================
// Skills Modal
// ===========================
function SkillsModal({
  isOpen, instructor, onClose, showNotif, onRefresh,
}: {
  isOpen: boolean;
  instructor: Instructor | null;
  onClose: () => void;
  showNotif: (t: 'success' | 'error', m: string) => void;
  onRefresh: () => void;
}) {
  const [skills, setSkills] = useState<Instructor['skills']>([]);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loadingSkills, setLoadingSkills] = useState(false);

  // جلب المهارات الخاصة بهذا المدرب فقط
  useEffect(() => {
    if (isOpen && instructor) {
      setNewName('');
      setSkills([]);
      setLoadingSkills(true);
      InstructorSkillAdminService.getByInstructor(instructor.id).then(res => {
        if (res.succeeded && Array.isArray(res.data)) {
          setSkills(res.data);
        } else {
          setSkills([]);
        }
      }).catch(err => {
        console.error('[SkillsModal] Fetch error:', err);
        setSkills([]);
      }).finally(() => setLoadingSkills(false));
    }
  }, [isOpen, instructor]);

  if (!isOpen || !instructor) return null;

  const handleAdd = async () => {
    if (!newName.trim()) return;
    if (skills?.some(s => s.name === newName.trim())) {
      showNotif('error', 'المهارة موجودة بالفعل');
      return;
    }
    setAdding(true);
    try {
      const res = await InstructorSkillAdminService.add({ name: newName.trim(), instructorId: instructor.id });
      if (res.succeeded && res.data) {
        setNewName('');
        setSkills(prev => [...(prev || []), res.data]);
        showNotif('success', 'تم إضافة المهارة');
      } else {
        showNotif('error', res.message || 'فشلت العملية');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || 'حدث خطأ');
    }
    setAdding(false);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await InstructorSkillAdminService.delete(id);
      if (res.succeeded) {
        setSkills(prev => (prev || []).filter(s => s.id !== id));
        showNotif('success', 'تم حذف المهارة');
      } else {
        showNotif('error', res.message || 'فشل الحذف');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || 'حدث خطأ');
    }
    setDeletingId(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col" dir="rtl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faLightbulb} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">مهارات المدرب</h2>
              <p className="text-xs text-gray-500">{instructor.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Add */}
          <div className="flex gap-2">
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="أضف مهارة لهذا المدرب..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm" />
            <button onClick={handleAdd} disabled={adding || !newName.trim()}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 text-sm">
              {adding ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faPlus} />}
              إضافة
            </button>
          </div>

          {/* List - فقط مهارات هذا المدرب */}
          <div className="space-y-2">
            {loadingSkills ? (
              <p className="text-center text-gray-400 text-sm py-4"><FontAwesomeIcon icon={faSpinner} className="animate-spin ml-2" />جاري تحميل المهارات...</p>
            ) : !skills || skills.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-4">لا توجد مهارات لهذا المدرب</p>
            ) : (
              skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                  <FontAwesomeIcon icon={faLightbulb} className="text-purple-400 text-sm" />
                  <span className="flex-1 text-sm font-medium text-gray-700">{skill.name}</span>
                  <button onClick={() => handleDelete(skill.id)} disabled={deletingId === skill.id}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                    {deletingId === skill.id ? <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" /> : <FontAwesomeIcon icon={faTrash} className="text-sm" />}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================
// Request Status Badge
// ===========================
function RequestStatusBadge({ status, statusName }: { status?: number | null; statusName?: string }) {
  if (!status) return <span className="text-gray-400 text-xs">-</span>;
  const map: Record<number, { bg: string; text: string; dot: string }> = {
    1: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },   // Pending
    2: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' }, // Approved
    3: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },             // Denied
  };
  const s = map[status] ?? map[1];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {statusName || (status === 1 ? 'معلق' : status === 2 ? 'مقبول' : 'مرفوض')}
    </span>
  );
}

// ===========================
// Review Modal (Approve/Deny)
// ===========================
function ReviewModal({
  isOpen, instructor, loading, onClose, onReview,
}: {
  isOpen: boolean;
  instructor: Instructor | null;
  loading: boolean;
  onClose: () => void;
  onReview: (approve: boolean, denialReason?: string) => void;
}) {
  const [denialReason, setDenialReason] = useState('');
  const [mode, setMode] = useState<'choose' | 'deny'>('choose');

  useEffect(() => {
    setDenialReason('');
    setMode('choose');
  }, [isOpen]);

  if (!isOpen || !instructor) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faUserTie} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">مراجعة طلب الانضمام</h2>
              <p className="text-xs text-gray-500">{instructor.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Instructor info summary */}
          <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">الاسم:</span><span className="font-semibold text-gray-800">{instructor.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">اللقب:</span><span className="font-semibold text-gray-800">{instructor.title}</span></div>
            {instructor.userEmail && (
              <div className="flex justify-between"><span className="text-gray-500">البريد:</span><span className="font-semibold text-gray-800" dir="ltr">{instructor.userEmail}</span></div>
            )}
            {instructor.yearsOfExperience != null && (
              <div className="flex justify-between"><span className="text-gray-500">سنوات الخبرة:</span><span className="font-semibold text-gray-800">{instructor.yearsOfExperience}</span></div>
            )}
            {instructor.createdAt && (
              <div className="flex justify-between"><span className="text-gray-500">تاريخ الطلب:</span><span className="font-semibold text-gray-800">{new Date(instructor.createdAt).toLocaleDateString('ar-SA')}</span></div>
            )}
          </div>

          {mode === 'choose' ? (
            <div className="flex gap-3">
              <button onClick={() => onReview(true)} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60">
                {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faCheck} />}
                قبول الطلب
              </button>
              <button onClick={() => setMode('deny')} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-60">
                <FontAwesomeIcon icon={faTimes} />
                رفض الطلب
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">سبب الرفض <span className="text-red-500">*</span></label>
              <textarea value={denialReason} onChange={(e) => setDenialReason(e.target.value)}
                rows={3} placeholder="اكتب سبب رفض الطلب..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm resize-none" />
              <div className="flex gap-3">
                <button onClick={() => onReview(false, denialReason)} disabled={loading || !denialReason.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-60">
                  {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faTimes} />}
                  تأكيد الرفض
                </button>
                <button onClick={() => setMode('choose')} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">رجوع</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===========================
// Status Toast
// ===========================
function StatusToast({ notif, onClose }: { notif: StatusNotif; onClose: () => void }) {
  useEffect(() => {
    if (notif.open) {
      const t = setTimeout(onClose, 3500);
      return () => clearTimeout(t);
    }
  }, [notif.open, onClose]);

  if (!notif.open) return null;
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl text-white font-semibold text-sm transition-all ${notif.type === 'success' ? 'bg-blue-600' : 'bg-red-500'}`}>
      <FontAwesomeIcon icon={notif.type === 'success' ? faCheck : faTriangleExclamation} />
      {notif.message}
      <button onClick={onClose} className="mr-2 opacity-70 hover:opacity-100">
        <FontAwesomeIcon icon={faTimes} className="text-xs" />
      </button>
    </div>
  );
}

// ===========================
// Main Page
// ===========================
export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<{ status: number; message: string } | null>(null);

  const [searchName, setSearchName] = useState('');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [currentPage, setCurrentPage] = useState(1);

  const [formModal, setFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState<Instructor | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [restoreModal, setRestoreModal] = useState(false);
  const [instructorToRestore, setInstructorToRestore] = useState<Instructor | null>(null);
  const [restoreLoading, setRestoreLoading] = useState(false);

  // Upload modals
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'avatar' | 'cv'>('avatar');
  const [uploadInstructor, setUploadInstructor] = useState<Instructor | null>(null);

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [notif, setNotif] = useState<StatusNotif>({ open: false, type: 'success', message: '' });

  // Skills modal
  const [skillsModal, setSkillsModal] = useState(false);
  const [skillsInstructor, setSkillsInstructor] = useState<Instructor | null>(null);

  // Review modal
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewInstructor, setReviewInstructor] = useState<Instructor | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const showNotif = (type: 'success' | 'error', message: string) =>
    setNotif({ open: true, type, message });

  // --- Fetch ---
  const fetchInstructors = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      let res;
      if (filterStatus === 'deleted') {
        res = await InstructorAdminService.getDeleted();
      } else if (filterStatus === 'requests') {
        res = await InstructorAdminService.getRequests();
      } else {
        res = await InstructorAdminService.getAll();
      }

      if (res.succeeded) {
        let filtered = res.data ?? [];
        if (searchName.trim()) {
          filtered = filtered.filter((inst) =>
            inst.name.toLowerCase().includes(searchName.trim().toLowerCase()) ||
            inst.title.toLowerCase().includes(searchName.trim().toLowerCase())
          );
        }
        if (filterGender !== 'all') {
          filtered = filtered.filter((inst) => inst.gender === parseInt(filterGender));
        }
        setTotalCount(filtered.length);
        // Client-side pagination
        const start = (currentPage - 1) * PAGE_SIZE;
        setInstructors(filtered.slice(start, start + PAGE_SIZE));
      } else {
        setInstructors([]);
        setTotalCount(0);
        if (filterStatus !== 'requests') showNotif('error', res.message || 'فشل في تحميل البيانات');
      }
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message || 'حدث خطأ غير متوقع';
      setApiError({ status: status ?? 0, message: msg });
    } finally {
      setLoading(false);
    }
  }, [searchName, filterGender, filterStatus, currentPage]);

  useEffect(() => { fetchInstructors(); }, [fetchInstructors]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // --- Add ---
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormModal(true);
  };

  // --- Edit ---
  const handleOpenEdit = (inst: Instructor) => {
    setIsEditMode(true);
    setEditingId(inst.id);
    setFormData({
      name: inst.name, title: inst.title, bio: inst.bio, gender: inst.gender,
      rating: inst.rating ?? null, totalStudents: inst.totalStudents ?? null, totalCources: inst.totalCources ?? null,
      email: '', phoneNumber: '', password: '',
      yearsOfExperience: inst.yearsOfExperience ?? null,
      linkedInUrl: inst.linkedInUrl ?? '', xUrl: inst.xUrl ?? '',
      instagramUrl: inst.instagramUrl ?? '', facebookUrl: inst.facebookUrl ?? '',
    });
    setFormModal(true);
  };

  // --- Save ---
  const handleSave = async (data: FormData, avatarFile?: File, cvFile?: File) => {
    setFormLoading(true);
    try {
      let res;
      if (isEditMode && editingId) {
        res = await InstructorAdminService.update(editingId, {
          name: data.name, title: data.title, bio: data.bio, gender: data.gender,
          rating: data.rating, totalStudents: data.totalStudents, totalCources: data.totalCources,
          yearsOfExperience: data.yearsOfExperience,
          linkedInUrl: data.linkedInUrl || undefined, xUrl: data.xUrl || undefined,
          instagramUrl: data.instagramUrl || undefined, facebookUrl: data.facebookUrl || undefined,
        });
      } else {
        res = await InstructorAdminService.addWithAccount({
          name: data.name, title: data.title, bio: data.bio, gender: data.gender,
          email: data.email, phoneNumber: data.phoneNumber, password: data.password,
          yearsOfExperience: data.yearsOfExperience ?? undefined,
          linkedInUrl: data.linkedInUrl || undefined, xUrl: data.xUrl || undefined,
          instagramUrl: data.instagramUrl || undefined, facebookUrl: data.facebookUrl || undefined,
        });
      }
      if (res.succeeded) {
        const instructorId = isEditMode ? editingId! : res.data?.id;
        // رفع الصورة والسيرة الذاتية إن وجدت
        if (instructorId) {
          if (avatarFile) {
            try { await InstructorAdminService.uploadAvatar(instructorId, avatarFile); } catch {}
          }
          if (cvFile) {
            try { await InstructorAdminService.uploadCv(instructorId, cvFile); } catch {}
          }
        }
        showNotif('success', isEditMode ? 'تم تعديل المدرب بنجاح' : 'تم إضافة المدرب بنجاح');
        setFormModal(false);
        fetchInstructors();
      } else {
        showNotif('error', res.message || 'فشلت العملية');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
    } finally {
      setFormLoading(false);
    }
  };

  // --- Soft Delete ---
  const handleToggleVisibility = async (inst: Instructor) => {
    setActionLoadingId(inst.id);
    try {
      const res = await InstructorAdminService.softDelete(inst.id);
      if (res.succeeded) {
        showNotif('success', 'تم إخفاء المدرب بنجاح');
        fetchInstructors();
      } else {
        showNotif('error', res.message || 'فشلت العملية');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
    } finally {
      setActionLoadingId(null);
    }
  };

  // --- Toggle Active ---
  const [toggleLoadingId, setToggleLoadingId] = useState<number | null>(null);
  const handleToggleActive = async (inst: Instructor) => {
    setToggleLoadingId(inst.id);
    try {
      const res = inst.isActive
        ? await InstructorAdminService.deactivate(inst.id)
        : await InstructorAdminService.activate(inst.id);
      if (res.succeeded) {
        showNotif('success', inst.isActive ? 'تم إلغاء تفعيل المدرب' : 'تم تفعيل المدرب بنجاح');
        fetchInstructors();
      } else {
        showNotif('error', res.message || 'فشلت العملية');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
    } finally {
      setToggleLoadingId(null);
    }
  };

  // --- Delete ---
  const handleConfirmDelete = async () => {
    if (!instructorToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await InstructorAdminService.delete(instructorToDelete.id);
      if (res.succeeded) {
        showNotif('success', 'تم حذف المدرب نهائياً');
        setDeleteModal(false);
        fetchInstructors();
      } else {
        showNotif('error', res.message || 'فشل الحذف');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
    } finally {
      setDeleteLoading(false);
    }
  };

  // --- Restore ---
  const handleConfirmRestore = async () => {
    if (!instructorToRestore) return;
    setRestoreLoading(true);
    try {
      const res = await InstructorAdminService.restore(instructorToRestore.id);
      if (res.succeeded) {
        showNotif('success', 'تم استرجاع المدرب بنجاح');
        setRestoreModal(false);
        fetchInstructors();
      } else {
        showNotif('error', res.message || 'فشل الاسترجاع');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
    } finally {
      setRestoreLoading(false);
    }
  };

  // --- Review Request ---
  const handleReview = async (approve: boolean, denialReason?: string) => {
    if (!reviewInstructor) return;
    setReviewLoading(true);
    try {
      const res = await InstructorAdminService.reviewRequest(reviewInstructor.id, { approve, denialReason });
      if (res.succeeded) {
        showNotif('success', approve ? 'تم قبول الطلب بنجاح' : 'تم رفض الطلب');
        setReviewModal(false);
        fetchInstructors();
      } else {
        showNotif('error', res.message || 'فشلت العملية');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
    } finally {
      setReviewLoading(false);
    }
  };

  // --- Upload ---
  const handleOpenUpload = (inst: Instructor, type: 'avatar' | 'cv') => {
    setUploadInstructor(inst);
    setUploadType(type);
    setUploadModal(true);
  };

  // ===========================
  // Render
  // ===========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faUserTie} className="text-white text-xl" />
              </div>
              إدارة المدربين
            </h1>
            <p className="text-sm text-gray-500 mt-1 mr-16">إدارة كاملة لجميع المدربين في المنصة</p>
          </div>
          <button onClick={handleOpenAdd}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
            <FontAwesomeIcon icon={faPlus} /> إضافة مدرب
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">إجمالي المدربين</div>
            <div className="text-2xl font-bold text-gray-800">{totalCount}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">النشطين</div>
            <div className="text-2xl font-bold text-blue-600">{filterStatus === 'active' ? totalCount : '-'}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">المحذوفين</div>
            <div className="text-2xl font-bold text-red-600">{filterStatus === 'deleted' ? totalCount : '-'}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">الصفحة الحالية</div>
            <div className="text-2xl font-bold text-blue-600">{currentPage} / {totalPages || 1}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input type="text" placeholder="بحث بالاسم أو اللقب..." value={searchName}
                  onChange={(e) => { setSearchName(e.target.value); setCurrentPage(1); }}
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
              </div>
            </div>
            <div className="flex gap-2">
              <select value={filterGender} onChange={(e) => { setFilterGender(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-medium cursor-pointer">
                <option value="all">الجنس: الكل</option>
                <option value="1">ذكر</option>
                <option value="2">أنثى</option>
              </select>
              <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-medium cursor-pointer">
                <option value="active">نشط</option>
                <option value="deleted">محذوفة</option>
                <option value="requests">طلبات الانضمام</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">الصورة</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">الاسم</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">اللقب</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">الجنس</th>
                  {filterStatus === 'requests' ? (
                    <>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">البريد</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">تاريخ الطلب</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">حالة الطلب</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">التقييم</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">السيرة</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">الحالة</th>
                    </>
                  )}
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : apiError ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="text-red-500 text-sm font-medium">{apiError.message}</div>
                    </td>
                  </tr>
                ) : instructors.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="text-gray-400 text-sm">لا توجد بيانات</div>
                    </td>
                  </tr>
                ) : (
                  instructors.map((instructor, idx) => (
                    <tr key={instructor.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>

                      {/* Avatar */}
                      <td className="px-6 py-4">
                        <div className="relative group cursor-pointer" onClick={() => handleOpenUpload(instructor, 'avatar')}>
                          {instructor.avatarUrl ? (
                            <img src={getFileUrl(instructor.avatarUrl)} alt={instructor.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-purple-400 transition-colors" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:from-purple-100 group-hover:to-purple-200 transition-colors">
                              <FontAwesomeIcon icon={faUserTie} className="text-gray-500 text-sm group-hover:text-purple-600" />
                            </div>
                          )}
                          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <FontAwesomeIcon icon={faCamera} className="text-white text-xs" />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        <Link href={`/instructors-admin/${instructor.id}`} className="hover:text-blue-600 transition-colors">
                          {instructor.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{instructor.title}</td>
                      <td className="px-6 py-4"><GenderBadge gender={instructor.gender} /></td>

                      {filterStatus === 'requests' ? (
                        <>
                          <td className="px-6 py-4 text-sm text-gray-600" dir="ltr">{instructor.userEmail || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {instructor.createdAt ? new Date(instructor.createdAt).toLocaleDateString('ar-SA') : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <RequestStatusBadge status={instructor.requestStatus} statusName={instructor.requestStatusName} />
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {instructor.rating !== null && instructor.rating !== undefined ? (
                              <span className="flex items-center gap-1">
                                <span className="text-yellow-500">&#11088;</span>
                                {instructor.rating.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>

                          {/* CV column */}
                          <td className="px-6 py-4">
                            {instructor.cvUrl ? (
                              <a href={getFileUrl(instructor.cvUrl)} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                                <FontAwesomeIcon icon={faFilePdf} className="text-xs" /> موجودة
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500">
                                غير مرفقة
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            {filterStatus === 'deleted' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                محذوف
                              </span>
                            ) : (
                              <StatusToggle isActive={instructor.isActive ?? false} loading={toggleLoadingId === instructor.id} onToggle={() => handleToggleActive(instructor)} />
                            )}
                          </td>
                        </>
                      )}

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {filterStatus === 'deleted' ? (
                            <button onClick={() => { setInstructorToRestore(instructor); setRestoreModal(true); }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="استرجاع">
                              <FontAwesomeIcon icon={faTrashRestore} className="text-sm" />
                            </button>
                          ) : filterStatus === 'requests' ? (
                            <>
                              {instructor.requestStatus === 1 && (
                                <button onClick={() => { setReviewInstructor(instructor); setReviewModal(true); }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors" title="مراجعة">
                                  <FontAwesomeIcon icon={faEye} className="text-xs" />
                                  مراجعة
                                </button>
                              )}
                              {instructor.requestStatus === 3 && instructor.denialReason && (
                                <span className="text-xs text-red-500 max-w-[150px] truncate" title={instructor.denialReason}>
                                  {instructor.denialReason}
                                </span>
                              )}
                            </>
                          ) : (
                            <>
                              <Link href={`/instructors-admin/${instructor.id}`}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="عرض التفاصيل">
                                <FontAwesomeIcon icon={faEye} className="text-sm" />
                              </Link>
                              <button onClick={() => handleOpenEdit(instructor)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="تعديل">
                                <FontAwesomeIcon icon={faEdit} className="text-sm" />
                              </button>
                              <button onClick={() => handleOpenUpload(instructor, 'avatar')}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors" title="رفع صورة">
                                <FontAwesomeIcon icon={faCamera} className="text-sm" />
                              </button>
                              <button onClick={() => handleOpenUpload(instructor, 'cv')}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors" title="رفع سيرة ذاتية">
                                <FontAwesomeIcon icon={faFileArrowUp} className="text-sm" />
                              </button>
                              <button onClick={() => { setSkillsInstructor(instructor); setSkillsModal(true); }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors" title="المهارات">
                                <FontAwesomeIcon icon={faLightbulb} className="text-sm" />
                              </button>
                              <button onClick={() => handleToggleVisibility(instructor)} disabled={actionLoadingId === instructor.id}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors disabled:opacity-50" title="إخفاء">
                                {actionLoadingId === instructor.id ? <FontAwesomeIcon icon={faSpinner} className="text-sm animate-spin" /> : <FontAwesomeIcon icon={faEyeSlash} className="text-sm" />}
                              </button>
                              <button onClick={() => { setInstructorToDelete(instructor); setDeleteModal(true); }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="حذف نهائي">
                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 bg-white rounded-xl shadow-md border border-gray-100 px-6 py-4">
            <div className="text-sm text-gray-600">
              عرض {(currentPage - 1) * PAGE_SIZE + 1} إلى {Math.min(currentPage * PAGE_SIZE, totalCount)} من {totalCount}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${currentPage === pageNum ? 'bg-blue-600 text-white shadow-md' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <InstructorFormModal isOpen={formModal} isEditMode={isEditMode} initialData={formData} loading={formLoading}
        onClose={() => setFormModal(false)} onSave={handleSave} />

      <UploadModal isOpen={uploadModal} type={uploadType} instructor={uploadInstructor}
        onClose={() => setUploadModal(false)} onSuccess={fetchInstructors} showNotif={showNotif} />

      <DeleteModal isOpen={deleteModal} instructor={instructorToDelete} loading={deleteLoading}
        onClose={() => setDeleteModal(false)} onConfirm={handleConfirmDelete} />

      <RestoreModal isOpen={restoreModal} instructor={instructorToRestore} loading={restoreLoading}
        onClose={() => setRestoreModal(false)} onConfirm={handleConfirmRestore} />

      <SkillsModal isOpen={skillsModal} instructor={skillsInstructor}
        onClose={() => setSkillsModal(false)} showNotif={showNotif} onRefresh={fetchInstructors} />

      <ReviewModal isOpen={reviewModal} instructor={reviewInstructor} loading={reviewLoading}
        onClose={() => setReviewModal(false)} onReview={handleReview} />

      <StatusToast notif={notif} onClose={() => setNotif({ ...notif, open: false })} />
    </div>
  );
}
