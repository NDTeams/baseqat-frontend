'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEdit,
  faTrash,
  faSpinner,
  faSearch,
  faGraduationCap,
  faTriangleExclamation,
  faRotateRight,
  faLaptop,
  faUsers,
  faLaptopHouse,
  faPlay,
  faCalendarDay,
  faImage,
  faCloudUploadAlt,
  faLink,
  faTimes,
  faCheck,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';
import {
  CoursesAdminService,
  CourseCategoryAdminService,
  type Course,
  type CourseCategory,
} from '@/services/courses/page';
import { getFileUrl } from '@/lib/config';

const PLATFORM_LOGO = '/site/logo.png';

// === Course Type helpers ===
const courseTypeLabel = (type?: number) => {
  switch (type) {
    case 0: return 'حضوري';
    case 1: return 'أونلاين';
    case 2: return 'هجين';
    default: return '—';
  }
};
const courseTypeIcon = (type?: number) => {
  switch (type) {
    case 0: return faUsers;
    case 1: return faLaptop;
    case 2: return faLaptopHouse;
    default: return faGraduationCap;
  }
};
const courseTypeColor = (type?: number) => {
  switch (type) {
    case 0: return 'bg-amber-50 text-amber-700 border-amber-200';
    case 1: return 'bg-sky-50 text-sky-700 border-sky-200';
    case 2: return 'bg-violet-50 text-violet-700 border-violet-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

// === Course Days helpers (Flags enum) ===
const DAY_FLAGS = [
  { value: 1, short: 'أحد', label: 'الأحد' },
  { value: 2, short: 'اثن', label: 'الاثنين' },
  { value: 4, short: 'ثلا', label: 'الثلاثاء' },
  { value: 8, short: 'أرب', label: 'الأربعاء' },
  { value: 16, short: 'خمي', label: 'الخميس' },
  { value: 32, short: 'جمع', label: 'الجمعة' },
  { value: 64, short: 'سبت', label: 'السبت' },
];
const countDays = (days?: number) => {
  if (!days) return 0;
  return DAY_FLAGS.filter(d => (days & d.value) !== 0).length;
};

// === Status helpers ===
const statusLabel = (status: number) => {
  switch (status) {
    case 0: return 'مسودة';
    case 1: return 'نشطة';
    case 2: return 'منتهية';
    default: return '—';
  }
};
const statusColor = (status: number) => {
  switch (status) {
    case 0: return 'bg-gray-50 text-gray-600 border-gray-200';
    case 1: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 2: return 'bg-red-50 text-red-600 border-red-200';
    default: return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

// === Toast ===
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white font-semibold text-sm ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
      <FontAwesomeIcon icon={type === 'success' ? faCheck : faTriangleExclamation} className="text-xs" />
      {message}
    </div>
  );
}

// === Days Popup (hover) ===
function DaysPopup({ days, courseDaysName }: { days?: number; courseDaysName?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  if (!days) return <span className="text-gray-400">—</span>;

  const activeDays = DAY_FLAGS.filter(d => (days & d.value) !== 0);
  const count = activeDays.length;

  return (
    <div className="relative" ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition-colors cursor-default"
      >
        <FontAwesomeIcon icon={faCalendarDay} className="text-[10px]" />
        {count} أيام
      </button>

      {open && (
        <div className="absolute z-30 top-full mt-1 right-0 bg-white border border-gray-200 rounded-xl shadow-xl p-3 min-w-[180px]">
          <p className="text-xs font-bold text-gray-700 mb-2">أيام الدورة</p>
          <div className="flex flex-wrap gap-1.5">
            {DAY_FLAGS.map((d) => {
              const active = (days & d.value) !== 0;
              return (
                <span
                  key={d.value}
                  className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-400 line-through'
                  }`}
                >
                  {d.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// === Image Upload Modal ===
function ImageUploadModal({
  isOpen,
  courseId,
  currentUrl,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  courseId: number;
  currentUrl?: string;
  onClose: () => void;
  onSuccess: (newUrl: string) => void;
}) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTab('upload');
      setUrlInput('');
      setError('');
      setPreview('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setError('');
    try {
      const res = await CoursesAdminService.uploadThumbnail(courseId, file);
      if (res.succeeded) {
        const newUrl = (res.data as any)?.imageUrl || '';
        onSuccess(newUrl);
        onClose();
      } else {
        setError(res.message || 'فشل رفع الصورة');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSave = async () => {
    if (!urlInput.trim()) {
      setError('أدخل رابط الصورة');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await CoursesAdminService.update(courseId, { thumbnailUrl: urlInput.trim() } as any);
      if (res.succeeded) {
        onSuccess(urlInput.trim());
        onClose();
      } else {
        setError(res.message || 'فشل الحفظ');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4" dir="rtl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FontAwesomeIcon icon={faCamera} className="text-blue-500" />
            صورة الدورة
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setTab('upload')}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              tab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FontAwesomeIcon icon={faCloudUploadAlt} className="ml-1.5" />
            رفع صورة
          </button>
          <button
            onClick={() => setTab('url')}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              tab === 'url' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FontAwesomeIcon icon={faLink} className="ml-1.5" />
            رابط خارجي
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Current image */}
          {currentUrl && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-1.5">الصورة الحالية:</p>
              <img
                src={currentUrl.startsWith('http') ? currentUrl : getFileUrl(currentUrl)}
                alt=""
                className="w-full h-32 object-cover rounded-xl border border-gray-200"
              />
            </div>
          )}

          {tab === 'upload' ? (
            <label className="cursor-pointer flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
              {uploading ? (
                <FontAwesomeIcon icon={faSpinner} className="text-2xl text-blue-600 animate-spin" />
              ) : preview ? (
                <img src={preview} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <FontAwesomeIcon icon={faCloudUploadAlt} className="text-3xl text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 font-medium">انقر لاختيار صورة</span>
                  <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP, GIF</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">رابط الصورة</label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => { setUrlInput(e.target.value); setError(''); }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  dir="ltr"
                />
              </div>

              {/* URL Preview */}
              {urlInput && (
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={urlInput}
                    alt=""
                    className="w-full h-28 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}

              <button
                onClick={handleUrlSave}
                disabled={saving || !urlInput.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faCheck} />}
                حفظ الرابط
              </button>
            </div>
          )}

          {error && (
            <p className="mt-3 text-sm text-red-500 font-medium text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}


// === Main Component ===
export default function CoursesTable() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Delete
  const [deleteModal, setDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Image upload
  const [imageModal, setImageModal] = useState(false);
  const [imageTargetCourse, setImageTargetCourse] = useState<Course | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [coursesRes, catsRes] = await Promise.all([
        CoursesAdminService.getAll(),
        CourseCategoryAdminService.getAll(),
      ]);
      if (coursesRes.succeeded) setCourses(coursesRes.data);
      else throw new Error(coursesRes.message || 'فشل في تحميل الدورات');
      if (catsRes.succeeded) setCategories(catsRes.data);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Filtered courses
  const filtered = courses.filter((c) => {
    const matchSearch = !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'all' || c.courseCategoryId === Number(filterCategory);
    const matchType = filterType === 'all' || c.courseType === Number(filterType);
    const matchStatus = filterStatus === 'all' || c.status === Number(filterStatus);
    return matchSearch && matchCategory && matchType && matchStatus;
  });

  // Delete
  const handleDelete = async () => {
    if (!courseToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await CoursesAdminService.delete(courseToDelete.id);
      if (res.succeeded) {
        setToast({ message: 'تم حذف الدورة بنجاح', type: 'success' });
        setCourses(prev => prev.filter(c => c.id !== courseToDelete.id));
      } else {
        setToast({ message: res.message || 'فشل الحذف', type: 'error' });
      }
    } catch {
      setToast({ message: 'حدث خطأ أثناء الحذف', type: 'error' });
    } finally {
      setDeleteLoading(false);
      setDeleteModal(false);
      setCourseToDelete(null);
    }
  };

  const handleImageSuccess = (courseId: number, newUrl: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, thumbnailUrl: newUrl } : c));
    setToast({ message: 'تم تحديث صورة الدورة', type: 'success' });
  };

  return (
    <div className="container mx-auto px-4 py-6 font-cairo" dir="rtl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الدورات التدريبية</h1>
          <p className="text-gray-500 text-xs mt-0.5">{courses.length} دورة مسجلة في المنصة</p>
        </div>
        <Link
          href="/courses-table/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-dashboardBg hover:bg-emerald-800 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
          إضافة دورة
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[180px]">
            <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="بحث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
            <option value="all">كل الأقسام</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
            <option value="all">كل الأنواع</option>
            <option value="0">حضوري</option>
            <option value="1">أونلاين</option>
            <option value="2">هجين</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
            <option value="all">كل الحالات</option>
            <option value="0">مسودة</option>
            <option value="1">نشطة</option>
            <option value="2">منتهية</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-3xl text-red-400" />
          <p className="text-gray-800 font-bold">تعذّر تحميل الدورات</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button onClick={fetchData} className="inline-flex items-center gap-2 px-4 py-2 bg-dashboardBg text-white font-semibold rounded-xl text-sm hover:bg-emerald-800 transition-colors">
            <FontAwesomeIcon icon={faRotateRight} className="text-xs" />
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <FontAwesomeIcon icon={faSpinner} spin className="text-2xl text-dashboardBg" />
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-dashboardBg text-white text-xs">
                <th className="px-3 py-3 text-center font-semibold w-[60px]">الصورة</th>
                <th className="px-3 py-3 text-right font-semibold">الدورة</th>
                <th className="px-3 py-3 text-center font-semibold w-[90px]">النوع</th>
                <th className="px-3 py-3 text-center font-semibold w-[80px]">الحالة</th>
                <th className="px-3 py-3 text-center font-semibold w-[80px]">السعر</th>
                <th className="px-3 py-3 text-center font-semibold w-[80px]">الأيام</th>
                <th className="px-3 py-3 text-center font-semibold w-[90px]">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? (
                filtered.map((course) => {
                  const thumbSrc = course.thumbnailUrl
                    ? (course.thumbnailUrl.startsWith('http') ? course.thumbnailUrl : getFileUrl(course.thumbnailUrl))
                    : '';

                  return (
                    <tr key={course.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Image */}
                      <td className="px-3 py-2.5 text-center">
                        <button
                          onClick={() => { setImageTargetCourse(course); setImageModal(true); }}
                          className="relative group mx-auto block"
                          title="تغيير الصورة"
                        >
                          {thumbSrc ? (
                            <img src={thumbSrc} alt="" className="w-11 h-11 rounded-lg object-cover border border-gray-200" />
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center border border-emerald-200">
                              <img src={PLATFORM_LOGO} alt="" className="w-7 h-7 object-contain" />
                            </div>
                          )}
                          {/* Hover overlay */}
                          <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <FontAwesomeIcon icon={faCamera} className="text-white text-xs" />
                          </div>
                          {/* Video badge */}
                          {course.promoVideoUrl && (
                            <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                              <FontAwesomeIcon icon={faPlay} className="text-white text-[5px]" />
                            </div>
                          )}
                        </button>
                      </td>

                      {/* Course info */}
                      <td className="px-3 py-2.5">
                        <Link href={`/courses-table/${course.id}`} className="block hover:text-blue-600 transition-colors">
                          <p className="font-bold text-gray-900 text-sm leading-tight truncate max-w-[280px]">{course.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                              {course.courseCategoryName || '—'}
                            </span>
                            {course.startDate && (
                              <span className="text-[10px] text-gray-400" suppressHydrationWarning>
                                {course.startDate}
                              </span>
                            )}
                          </div>
                        </Link>
                      </td>

                      {/* Type */}
                      <td className="px-3 py-2.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${courseTypeColor(course.courseType)}`}>
                          <FontAwesomeIcon icon={courseTypeIcon(course.courseType)} className="text-[8px]" />
                          {courseTypeLabel(course.courseType)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border ${statusColor(course.status)}`}>
                          {course.statusName || statusLabel(course.status)}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-3 py-2.5 text-center" suppressHydrationWarning>
                        {course.price > 0 ? (
                          <span className="font-bold text-gray-800 text-xs">{course.price.toLocaleString('ar-SA')} <span className="text-[10px] text-gray-400">ر.س</span></span>
                        ) : (
                          <span className="text-emerald-600 text-xs font-bold">مجاني</span>
                        )}
                      </td>

                      {/* Days popup */}
                      <td className="px-3 py-2.5 text-center">
                        <DaysPopup days={course.courseDays} courseDaysName={course.courseDaysName} />
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/courses-table/${course.id}`}
                            className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                            title="تعديل"
                          >
                            <FontAwesomeIcon icon={faEdit} className="text-[10px]" />
                          </Link>
                          <button
                            onClick={() => { setCourseToDelete(course); setDeleteModal(true); }}
                            className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                            title="حذف"
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-3xl text-gray-300 mb-2" />
                    <p className="text-gray-400 font-semibold text-sm">لا توجد دورات مطابقة</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
              <span>عرض {filtered.length} من {courses.length} دورة</span>
            </div>
          )}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4" dir="rtl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">حذف الدورة</h3>
            <p className="text-gray-500 text-sm mb-1">هل أنت متأكد من حذف:</p>
            <p className="font-bold text-gray-800 mb-5">{courseToDelete.title}</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm"
              >
                {deleteLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'حذف'}
              </button>
              <button
                onClick={() => { setDeleteModal(false); setCourseToDelete(null); }}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={imageModal}
        courseId={imageTargetCourse?.id ?? 0}
        currentUrl={imageTargetCourse?.thumbnailUrl}
        onClose={() => { setImageModal(false); setImageTargetCourse(null); }}
        onSuccess={(newUrl) => {
          if (imageTargetCourse) handleImageSuccess(imageTargetCourse.id, newUrl);
        }}
      />
    </div>
  );
}
