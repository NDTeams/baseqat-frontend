'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faSearch, faEdit, faTrash, faEyeSlash, faCheck, faTimes,
  faSpinner, faTriangleExclamation, faUserTie, faChevronLeft, faChevronRight,
  faTrashRestore, faMars, faVenus, faCamera, faFileArrowUp, faFilePdf,
  faDownload, faImage, faEye, faLightbulb, faEnvelope, faPhone, faLock,
  faCircleExclamation, faArrowRightArrowLeft, faIdCard,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import {
  ConsultantAdminService,
  ConsultantSkillAdminService,
  type Consultant,
  type CheckEmailResponse,
} from '@/services/consultants/page';
import { API_BASE, getFileUrl } from '@/lib/config';

// ===========================
// Types
// ===========================
interface FormData {
  name: string;
  title: string;
  bio: string;
  gender: number;
  rating: number | null;
  specialty: string;
  hourlyRate: number | null;
  availability: string;
  yearsOfExperience: number | null;
  linkedInUrl: string;
  xUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  // بيانات الحساب (عند الإضافة فقط)
  email: string;
  phoneNumber: string;
  password: string;
}

interface StatusNotif {
  open: boolean;
  type: 'success' | 'error';
  message: string;
}

const EMPTY_FORM: FormData = {
  name: '', title: '', bio: '', gender: 1, rating: null,
  specialty: '', hourlyRate: null, availability: '',
  yearsOfExperience: null, linkedInUrl: '', xUrl: '', instagramUrl: '', facebookUrl: '',
  email: '', phoneNumber: '', password: '',
};
const PAGE_SIZE = 10;

// ===========================
// Status Toggle
// ===========================
function StatusToggle({ isActive, loading, onToggle }: { isActive: boolean; loading: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      disabled={loading}
      className="group relative w-[52px] h-[28px] rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50 cursor-pointer"
      style={{ background: isActive ? 'linear-gradient(135deg, #14b8a6, #0d9488)' : 'linear-gradient(135deg, #e5e7eb, #d1d5db)' }}
      title={isActive ? 'اضغط لإلغاء التفعيل' : 'اضغط للتفعيل'}
    >
      <span
        className={`absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${
          isActive ? 'right-[3px] group-hover:right-[5px]' : 'right-[27px] group-hover:right-[25px]'
        }`}
      >
        {loading ? (
          <FontAwesomeIcon icon={faSpinner} className={`animate-spin text-[9px] ${isActive ? 'text-sky-500' : 'text-gray-400'}`} />
        ) : isActive ? (
          <FontAwesomeIcon icon={faCheck} className="text-[8px] text-sky-500" />
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
      <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
    </tr>
  );
}

// ===========================
// Add / Edit Modal
// ===========================
function ConsultantFormModal({
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

  // حالة فحص البريد
  const [emailCheck, setEmailCheck] = useState<CheckEmailResponse | null>(null);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailCheckDone, setEmailCheckDone] = useState(false);

  useEffect(() => {
    setForm(initialData);
    setAvatarFile(null);
    setAvatarPreview(null);
    setCvFile(null);
    setEmailCheck(null);
    setEmailChecking(false);
    setEmailCheckDone(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleEmailBlur = async () => {
    const email = form.email.trim();
    if (!email || !email.includes('@')) {
      setEmailCheck(null);
      setEmailCheckDone(false);
      return;
    }
    setEmailChecking(true);
    try {
      const res = await ConsultantAdminService.checkEmail(email);
      if (res.succeeded && res.data) {
        setEmailCheck(res.data);
        setEmailCheckDone(true);
      }
    } catch {
      setEmailCheck(null);
    }
    setEmailChecking(false);
  };

  const handleUseInstructorData = () => {
    if (!emailCheck) return;
    setForm(prev => ({
      ...prev,
      name: emailCheck.instructorName || prev.name,
      title: emailCheck.instructorTitle || prev.title,
      bio: emailCheck.instructorBio || prev.bio,
      gender: emailCheck.instructorGender ?? prev.gender,
      yearsOfExperience: emailCheck.instructorYearsOfExperience ?? prev.yearsOfExperience,
    }));
  };

  const isExistingUser = emailCheckDone && emailCheck?.exists === true;
  const isInstructor = isExistingUser && emailCheck?.isInstructor;
  const hasConsultantRecord = isExistingUser && emailCheck?.hasConsultantRecord;

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
    if (!isEditMode && hasConsultantRecord) return;
    onSave(form, avatarFile ?? undefined, cvFile ?? undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faUserTie} className="text-sky-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              {isEditMode ? 'تعديل المستشار' : 'إضافة مستشار جديد'}
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
              <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-blue-600" />
                بيانات الحساب
              </h3>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      setEmailCheck(null);
                      setEmailCheckDone(false);
                    }}
                    onBlur={handleEmailBlur}
                    required
                    placeholder="example@email.com"
                    dir="ltr"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                  {emailChecking && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-blue-500 text-sm" />
                    </div>
                  )}
                </div>
              </div>

              {/* تنبيه: البريد مسجل كمدرب */}
              {isInstructor && !hasConsultantRecord && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl">
                  <div className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faCircleExclamation} className="text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-800">
                        هذا البريد مسجل كمدرب: {emailCheck?.instructorName || emailCheck?.userName}
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        سيتم ربط سجل المستشار بنفس الحساب وإضافة صلاحية المستشار بدون حذف صلاحية المدرب
                      </p>
                      <button
                        type="button"
                        onClick={handleUseInstructorData}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-semibold rounded-lg transition-colors"
                      >
                        <FontAwesomeIcon icon={faArrowRightArrowLeft} className="text-xs" />
                        استخدام بيانات المدرب
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* تنبيه: عنده سجل مستشار بالفعل */}
              {hasConsultantRecord && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl">
                  <div className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faCircleExclamation} className="text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-800">
                        هذا المستخدم لديه سجل مستشار بالفعل
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        لا يمكن إنشاء سجل مستشار آخر لنفس الحساب
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* تنبيه: بريد موجود (ليس مدرب) وليس عنده سجل مستشار */}
              {isExistingUser && !isInstructor && !hasConsultantRecord && (
                <div className="p-3 bg-blue-50 border border-blue-300 rounded-xl">
                  <div className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faCircleExclamation} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-800">
                        هذا البريد مسجل باسم: {emailCheck?.userName}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        سيتم ربط سجل المستشار بالحساب الموجود وإضافة صلاحية المستشار
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* رقم الهاتف وكلمة المرور - تظهر فقط للمستخدم الجديد */}
              {(!emailCheckDone || !emailCheck?.exists) && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      <FontAwesomeIcon icon={faPhone} className="text-blue-500 ml-1 text-xs" />
                      رقم الهاتف <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phoneNumber}
                      onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                      required={!isExistingUser}
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      <FontAwesomeIcon icon={faLock} className="text-blue-500 ml-1 text-xs" />
                      كلمة المرور <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required={!isExistingUser}
                      minLength={6}
                      placeholder="6 أحرف على الأقل"
                      dir="ltr"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== البيانات الأساسية ===== */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">الاسم <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="مثال: أحمد محمد"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">اللقب <span className="text-red-500">*</span></label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="مثال: مستشار إداري"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">النبذة التعريفية</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="نبذة عن المستشار..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm resize-none" />
          </div>

          {/* ===== بيانات الاستشارة ===== */}
          <div className="space-y-4 p-4 bg-sky-50 rounded-xl border border-sky-200">
            <h3 className="text-sm font-bold text-sky-800">بيانات الاستشارة</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">التخصص</label>
              <input type="text" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="مثال: استشارات إدارية"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">سعر الساعة (ر.س)</label>
                <input type="number" min="0" step="0.01" value={form.hourlyRate ?? ''} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value ? parseFloat(e.target.value) : null })} placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">أوقات التوفر</label>
                <input type="text" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} placeholder="مثال: الأحد - الخميس"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm" />
              </div>
            </div>
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm" />
            </div>
          </div>

          {/* ===== التقييم (عند التعديل فقط) ===== */}
          {isEditMode && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">التقييم</label>
              <input type="number" step="0.1" min="0" max="5" value={form.rating ?? ''} onChange={(e) => setForm({ ...form, rating: e.target.value ? parseFloat(e.target.value) : null })} placeholder="0 - 5"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm" />
            </div>
          )}

          {/* ===== روابط التواصل الاجتماعي ===== */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-bold text-gray-600">روابط التواصل الاجتماعي</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">LinkedIn</label>
                <input type="url" value={form.linkedInUrl} onChange={(e) => setForm({ ...form, linkedInUrl: e.target.value })} placeholder="https://linkedin.com/in/..." dir="ltr"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">X (Twitter)</label>
                <input type="url" value={form.xUrl} onChange={(e) => setForm({ ...form, xUrl: e.target.value })} placeholder="https://x.com/..." dir="ltr"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Instagram</label>
                <input type="url" value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} placeholder="https://instagram.com/..." dir="ltr"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Facebook</label>
                <input type="url" value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} placeholder="https://facebook.com/..." dir="ltr"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-xs" />
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
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60">
              {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faCheck} />}
              {isEditMode ? 'حفظ التعديلات' : 'إضافة المستشار'}
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
  isOpen, type, consultant, onClose, onSuccess, showNotif,
}: {
  isOpen: boolean;
  type: 'avatar' | 'cv';
  consultant: Consultant | null;
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

  if (!isOpen || !consultant) return null;

  const isAvatar = type === 'avatar';
  const accept = isAvatar ? '.jpg,.jpeg,.png,.gif,.webp' : '.pdf,.doc,.docx';
  const maxSize = 5;

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
        ? await ConsultantAdminService.uploadAvatar(consultant.id, file)
        : await ConsultantAdminService.uploadCv(consultant.id, file);

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
              <p className="text-xs text-gray-500">{consultant.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {isAvatar && consultant.avatarUrl && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <img src={getFileUrl(consultant.avatarUrl)} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
              <span className="text-sm text-gray-600">الصورة الحالية</span>
            </div>
          )}
          {!isAvatar && consultant.cvUrl && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <FontAwesomeIcon icon={faFilePdf} className="text-red-500 text-xl" />
              <span className="text-sm text-gray-600 flex-1">السيرة الذاتية الحالية</span>
              <a href={getFileUrl(consultant.cvUrl)} target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                <FontAwesomeIcon icon={faDownload} className="text-xs" /> تحميل
              </a>
            </div>
          )}

          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-sky-400 hover:bg-sky-50/30 transition-colors"
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-sky-200" />
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
function DeleteModal({ isOpen, consultant, loading, onClose, onConfirm }: {
  isOpen: boolean; consultant: Consultant | null; loading: boolean; onClose: () => void; onConfirm: () => void;
}) {
  if (!isOpen || !consultant) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">تأكيد الحذف</h2>
          <p className="text-gray-500 text-sm">
            هل أنت متأكد من حذف المستشار <span className="font-semibold text-gray-800">&quot;{consultant.name}&quot;</span>؟
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
function RestoreModal({ isOpen, consultant, loading, onClose, onConfirm }: {
  isOpen: boolean; consultant: Consultant | null; loading: boolean; onClose: () => void; onConfirm: () => void;
}) {
  if (!isOpen || !consultant) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-sky-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faTrashRestore} className="text-sky-600 text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">تأكيد الاسترجاع</h2>
          <p className="text-gray-500 text-sm">
            هل أنت متأكد من استرجاع المستشار <span className="font-semibold text-gray-800">&quot;{consultant.name}&quot;</span>؟
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60">
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
  isOpen, consultant, onClose, showNotif, onRefresh,
}: {
  isOpen: boolean;
  consultant: Consultant | null;
  onClose: () => void;
  showNotif: (t: 'success' | 'error', m: string) => void;
  onRefresh: () => void;
}) {
  const [skills, setSkills] = useState<{ id: number; name: string; consultantId?: number }[]>([]);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loadingSkills, setLoadingSkills] = useState(false);

  useEffect(() => {
    if (isOpen && consultant) {
      setNewName('');
      setSkills([]);
      setLoadingSkills(true);
      ConsultantSkillAdminService.getByConsultant(consultant.id).then(res => {
        if (res.succeeded && Array.isArray(res.data)) {
          setSkills(res.data);
        } else {
          setSkills([]);
        }
      }).catch(() => {
        setSkills([]);
      }).finally(() => setLoadingSkills(false));
    }
  }, [isOpen, consultant]);

  if (!isOpen || !consultant) return null;

  const handleAdd = async () => {
    if (!newName.trim()) return;
    if (skills.some(s => s.name === newName.trim())) {
      showNotif('error', 'المهارة موجودة بالفعل');
      return;
    }
    setAdding(true);
    try {
      const res = await ConsultantSkillAdminService.add({ name: newName.trim(), consultantId: consultant.id });
      if (res.succeeded && res.data) {
        setNewName('');
        setSkills(prev => [...prev, res.data]);
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
      const res = await ConsultantSkillAdminService.delete(id);
      if (res.succeeded) {
        setSkills(prev => prev.filter(s => s.id !== id));
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
              <h2 className="text-lg font-bold text-gray-800">مهارات المستشار</h2>
              <p className="text-xs text-gray-500">{consultant.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="flex gap-2">
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="أضف مهارة لهذا المستشار..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm" />
            <button onClick={handleAdd} disabled={adding || !newName.trim()}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 text-sm">
              {adding ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faPlus} />}
              إضافة
            </button>
          </div>

          <div className="space-y-2">
            {loadingSkills ? (
              <p className="text-center text-gray-400 text-sm py-4"><FontAwesomeIcon icon={faSpinner} className="animate-spin ml-2" />جاري تحميل المهارات...</p>
            ) : skills.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-4">لا توجد مهارات لهذا المستشار</p>
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
// Account Info Modal
// ===========================
function AccountInfoModal({
  isOpen, consultant, onClose,
}: {
  isOpen: boolean;
  consultant: Consultant | null;
  onClose: () => void;
}) {
  if (!isOpen || !consultant) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" dir="rtl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faIdCard} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">بيانات الحساب</h2>
              <p className="text-xs text-gray-500">{consultant.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* البريد الإلكتروني */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 text-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 mb-0.5">البريد الإلكتروني</p>
              <p className="text-sm font-semibold text-gray-800 truncate" dir="ltr">
                {consultant.userEmail || 'غير مرتبط بحساب'}
              </p>
            </div>
          </div>

          {/* رقم الهاتف */}
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faPhone} className="text-green-600 text-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 mb-0.5">رقم الهاتف</p>
              <p className="text-sm font-semibold text-gray-800" dir="ltr">
                {consultant.userPhoneNumber || 'غير متوفر'}
              </p>
            </div>
          </div>

          {/* معرف المستخدم */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faUserTie} className="text-gray-600 text-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 mb-0.5">معرف المستخدم</p>
              <p className="text-xs font-mono text-gray-600 truncate" dir="ltr">
                {consultant.userId || 'غير مرتبط'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 pt-0">
          <button onClick={onClose}
            className="w-full py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            إغلاق
          </button>
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
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${
      notif.type === 'success' ? 'bg-sky-600' : 'bg-red-500'
    }`}>
      <FontAwesomeIcon icon={notif.type === 'success' ? faCheck : faTimes} />
      {notif.message}
    </div>
  );
}

// ===========================
// Main Page
// ===========================
export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<{ status: number; message: string } | null>(null);

  // Filters
  const [searchName, setSearchName] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [formModal, setFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);

  const [uploadModal, setUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'avatar' | 'cv'>('avatar');
  const [uploadConsultant, setUploadConsultant] = useState<Consultant | null>(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const [consultantToDelete, setConsultantToDelete] = useState<Consultant | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [restoreModal, setRestoreModal] = useState(false);
  const [consultantToRestore, setConsultantToRestore] = useState<Consultant | null>(null);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const [skillsModal, setSkillsModal] = useState(false);
  const [skillsConsultant, setSkillsConsultant] = useState<Consultant | null>(null);

  const [accountInfoModal, setAccountInfoModal] = useState(false);
  const [accountInfoConsultant, setAccountInfoConsultant] = useState<Consultant | null>(null);

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [toggleLoadingId, setToggleLoadingId] = useState<number | null>(null);

  // Notif
  const [notif, setNotif] = useState<StatusNotif>({ open: false, type: 'success', message: '' });
  const showNotif = (type: 'success' | 'error', message: string) => setNotif({ open: true, type, message });

  // ===========================
  // Fetch
  // ===========================
  const fetchConsultants = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      let res: any;
      if (filterStatus === 'deleted') {
        res = await ConsultantAdminService.getDeleted();
      } else {
        res = await ConsultantAdminService.getAll();
      }
      if (res.succeeded && Array.isArray(res.data)) {
        let filtered = res.data;
        if (searchName.trim()) {
          filtered = filtered.filter((c: Consultant) =>
            c.name.toLowerCase().includes(searchName.trim().toLowerCase()) ||
            c.title.toLowerCase().includes(searchName.trim().toLowerCase()) ||
            (c.specialty || '').toLowerCase().includes(searchName.trim().toLowerCase())
          );
        }
        if (filterGender !== 'all') {
          filtered = filtered.filter((c: Consultant) => c.gender === parseInt(filterGender));
        }
        setTotalCount(filtered.length);
        const start = (currentPage - 1) * PAGE_SIZE;
        setConsultants(filtered.slice(start, start + PAGE_SIZE));
      } else {
        setConsultants([]);
        setTotalCount(0);
        showNotif('error', res.message || 'فشل في تحميل البيانات');
      }
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message || 'حدث خطأ غير متوقع';
      setApiError({ status: status ?? 0, message: msg });
    } finally {
      setLoading(false);
    }
  }, [searchName, filterGender, filterStatus, currentPage]);

  useEffect(() => { fetchConsultants(); }, [fetchConsultants]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // --- Add ---
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormModal(true);
  };

  // --- Edit ---
  const handleOpenEdit = (c: Consultant) => {
    setIsEditMode(true);
    setEditingId(c.id);
    setFormData({
      name: c.name, title: c.title, bio: c.bio || '', gender: c.gender,
      rating: c.rating ?? null,
      specialty: c.specialty || '', hourlyRate: c.hourlyRate ?? null,
      availability: c.availability || '',
      yearsOfExperience: c.yearsOfExperience ?? null,
      linkedInUrl: c.linkedInUrl ?? '', xUrl: c.xUrl ?? '',
      instagramUrl: c.instagramUrl ?? '', facebookUrl: c.facebookUrl ?? '',
      email: '', phoneNumber: '', password: '',
    });
    setFormModal(true);
  };

  // --- Save ---
  const handleSave = async (data: FormData, avatarFile?: File, cvFile?: File) => {
    setFormLoading(true);
    try {
      let res;
      if (isEditMode && editingId) {
        res = await ConsultantAdminService.update(editingId, {
          name: data.name, title: data.title, bio: data.bio, gender: data.gender,
          rating: data.rating ?? undefined,
          specialty: data.specialty || undefined,
          hourlyRate: data.hourlyRate ?? undefined,
          availability: data.availability || undefined,
          yearsOfExperience: data.yearsOfExperience ?? undefined,
          linkedInUrl: data.linkedInUrl || undefined, xUrl: data.xUrl || undefined,
          instagramUrl: data.instagramUrl || undefined, facebookUrl: data.facebookUrl || undefined,
        });
      } else {
        res = await ConsultantAdminService.addWithAccount({
          name: data.name, title: data.title, bio: data.bio, gender: data.gender,
          specialty: data.specialty || undefined,
          hourlyRate: data.hourlyRate ?? undefined,
          availability: data.availability || undefined,
          yearsOfExperience: data.yearsOfExperience ?? undefined,
          linkedInUrl: data.linkedInUrl || undefined, xUrl: data.xUrl || undefined,
          instagramUrl: data.instagramUrl || undefined, facebookUrl: data.facebookUrl || undefined,
          email: data.email,
          phoneNumber: data.phoneNumber || '',
          password: data.password || '',
        });
      }
      if (res.succeeded) {
        const consultantId = isEditMode ? editingId! : res.data?.id;
        if (consultantId) {
          if (avatarFile) {
            try { await ConsultantAdminService.uploadAvatar(consultantId, avatarFile); } catch {}
          }
          if (cvFile) {
            try { await ConsultantAdminService.uploadCv(consultantId, cvFile); } catch {}
          }
        }
        showNotif('success', isEditMode ? 'تم تعديل المستشار بنجاح' : 'تم إضافة المستشار بنجاح');
        setFormModal(false);
        fetchConsultants();
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
  const handleToggleVisibility = async (c: Consultant) => {
    setActionLoadingId(c.id);
    try {
      const res = await ConsultantAdminService.softDelete(c.id);
      if (res.succeeded) {
        showNotif('success', 'تم إخفاء المستشار بنجاح');
        fetchConsultants();
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
  const handleToggleActive = async (c: Consultant) => {
    setToggleLoadingId(c.id);
    try {
      const res = c.isActive
        ? await ConsultantAdminService.deactivate(c.id)
        : await ConsultantAdminService.activate(c.id);
      if (res.succeeded) {
        showNotif('success', c.isActive ? 'تم إلغاء تفعيل المستشار' : 'تم تفعيل المستشار بنجاح');
        fetchConsultants();
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
    if (!consultantToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await ConsultantAdminService.delete(consultantToDelete.id);
      if (res.succeeded) {
        showNotif('success', 'تم حذف المستشار نهائياً');
        setDeleteModal(false);
        fetchConsultants();
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
    if (!consultantToRestore) return;
    setRestoreLoading(true);
    try {
      const res = await ConsultantAdminService.restore(consultantToRestore.id);
      if (res.succeeded) {
        showNotif('success', 'تم استرجاع المستشار بنجاح');
        setRestoreModal(false);
        fetchConsultants();
      } else {
        showNotif('error', res.message || 'فشل الاسترجاع');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
    } finally {
      setRestoreLoading(false);
    }
  };

  // --- Upload ---
  const handleOpenUpload = (c: Consultant, type: 'avatar' | 'cv') => {
    setUploadConsultant(c);
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faUserTie} className="text-white text-xl" />
              </div>
              إدارة المستشارين
            </h1>
            <p className="text-sm text-gray-500 mt-1 mr-16">إدارة كاملة لجميع المستشارين في المنصة</p>
          </div>
          <button onClick={handleOpenAdd}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
            <FontAwesomeIcon icon={faPlus} /> إضافة مستشار
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">إجمالي المستشارين</div>
            <div className="text-2xl font-bold text-gray-800">{totalCount}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">النشطين</div>
            <div className="text-2xl font-bold text-sky-600">{filterStatus === 'active' ? totalCount : '-'}</div>
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
                <input type="text" placeholder="بحث بالاسم أو التخصص..." value={searchName}
                  onChange={(e) => { setSearchName(e.target.value); setCurrentPage(1); }}
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm" />
              </div>
            </div>
            <div className="flex gap-2">
              <select value={filterGender} onChange={(e) => { setFilterGender(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm font-medium cursor-pointer">
                <option value="all">الجنس: الكل</option>
                <option value="1">ذكر</option>
                <option value="2">أنثى</option>
              </select>
              <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm font-medium cursor-pointer">
                <option value="active">نشط</option>
                <option value="deleted">محذوف</option>
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
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">التخصص</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">الجنس</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">التقييم</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">السيرة</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">الحالة</th>
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
                ) : consultants.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="text-gray-400 text-sm">لا توجد بيانات</div>
                    </td>
                  </tr>
                ) : (
                  consultants.map((consultant, idx) => (
                    <tr key={consultant.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>

                      {/* Avatar */}
                      <td className="px-6 py-4">
                        <div className="relative group cursor-pointer" onClick={() => handleOpenUpload(consultant, 'avatar')}>
                          {consultant.avatarUrl ? (
                            <img src={getFileUrl(consultant.avatarUrl)} alt={consultant.name}
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

                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{consultant.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{consultant.specialty || '-'}</td>
                      <td className="px-6 py-4"><GenderBadge gender={consultant.gender} /></td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {consultant.rating != null && consultant.rating !== undefined ? (
                          <span className="flex items-center gap-1">
                            <span className="text-yellow-500">&#11088;</span>
                            {consultant.rating.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      {/* CV column */}
                      <td className="px-6 py-4">
                        {consultant.cvUrl ? (
                          <a href={getFileUrl(consultant.cvUrl)} target="_blank" rel="noopener noreferrer"
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
                          <StatusToggle isActive={consultant.isActive ?? false} loading={toggleLoadingId === consultant.id} onToggle={() => handleToggleActive(consultant)} />
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {filterStatus === 'deleted' ? (
                            <button onClick={() => { setConsultantToRestore(consultant); setRestoreModal(true); }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors" title="استرجاع">
                              <FontAwesomeIcon icon={faTrashRestore} className="text-sm" />
                            </button>
                          ) : (
                            <>
                              <button onClick={() => handleOpenEdit(consultant)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="تعديل">
                                <FontAwesomeIcon icon={faEdit} className="text-sm" />
                              </button>
                              <button onClick={() => { setAccountInfoConsultant(consultant); setAccountInfoModal(true); }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors" title="بيانات الحساب">
                                <FontAwesomeIcon icon={faIdCard} className="text-sm" />
                              </button>
                              <button onClick={() => handleOpenUpload(consultant, 'avatar')}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors" title="رفع صورة">
                                <FontAwesomeIcon icon={faCamera} className="text-sm" />
                              </button>
                              <button onClick={() => handleOpenUpload(consultant, 'cv')}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors" title="رفع سيرة ذاتية">
                                <FontAwesomeIcon icon={faFileArrowUp} className="text-sm" />
                              </button>
                              <button onClick={() => { setSkillsConsultant(consultant); setSkillsModal(true); }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors" title="المهارات">
                                <FontAwesomeIcon icon={faLightbulb} className="text-sm" />
                              </button>
                              <button onClick={() => handleToggleVisibility(consultant)} disabled={actionLoadingId === consultant.id}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors disabled:opacity-50" title="إخفاء">
                                {actionLoadingId === consultant.id ? <FontAwesomeIcon icon={faSpinner} className="text-sm animate-spin" /> : <FontAwesomeIcon icon={faEyeSlash} className="text-sm" />}
                              </button>
                              <button onClick={() => { setConsultantToDelete(consultant); setDeleteModal(true); }}
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
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${currentPage === pageNum ? 'bg-sky-600 text-white shadow-md' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
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
      <ConsultantFormModal isOpen={formModal} isEditMode={isEditMode} initialData={formData} loading={formLoading}
        onClose={() => setFormModal(false)} onSave={handleSave} />

      <UploadModal isOpen={uploadModal} type={uploadType} consultant={uploadConsultant}
        onClose={() => setUploadModal(false)} onSuccess={fetchConsultants} showNotif={showNotif} />

      <DeleteModal isOpen={deleteModal} consultant={consultantToDelete} loading={deleteLoading}
        onClose={() => setDeleteModal(false)} onConfirm={handleConfirmDelete} />

      <RestoreModal isOpen={restoreModal} consultant={consultantToRestore} loading={restoreLoading}
        onClose={() => setRestoreModal(false)} onConfirm={handleConfirmRestore} />

      <SkillsModal isOpen={skillsModal} consultant={skillsConsultant}
        onClose={() => setSkillsModal(false)} showNotif={showNotif} onRefresh={fetchConsultants} />

      <AccountInfoModal isOpen={accountInfoModal} consultant={accountInfoConsultant}
        onClose={() => setAccountInfoModal(false)} />

      <StatusToast notif={notif} onClose={() => setNotif({ ...notif, open: false })} />
    </div>
  );
}
