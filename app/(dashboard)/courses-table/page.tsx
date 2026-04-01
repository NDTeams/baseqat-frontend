'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEye,
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
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import {
  CoursesAdminService,
  CourseCategoryAdminService,
  type Course,
  type CourseCategory,
} from '@/services/courses/page';
import { getFileUrl } from '@/lib/config';

// === Course Type helpers ===
const courseTypeLabel = (type?: number) => {
  switch (type) {
    case 0: return 'حضوري';
    case 1: return 'أونلاين';
    case 2: return 'أونلاين + حضوري';
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
    case 0: return 'bg-amber-100 text-amber-800';
    case 1: return 'bg-sky-100 text-sky-800';
    case 2: return 'bg-violet-100 text-violet-800';
    default: return 'bg-gray-100 text-gray-800';
  }
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
    case 0: return 'bg-gray-100 text-gray-700';
    case 1: return 'bg-emerald-100 text-emerald-800';
    case 2: return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// === Toast ===
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-semibold text-sm ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
      {message}
    </div>
  );
}

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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="container mx-auto px-4 py-8 font-cairo" dir="rtl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">جدول الدورات التدريبية</h1>
          <p className="text-gray-500 text-sm mt-1">إدارة جميع الدورات المسجلة في المنصة</p>
        </div>
        <Link
          href="/courses-table/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-dashboardBg hover:bg-emerald-800 text-white font-semibold rounded-xl transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} />
          إضافة دورة
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <FontAwesomeIcon icon={faSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="ابحث بعنوان الدورة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          >
            <option value="all">كل الأقسام</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          >
            <option value="all">كل الأنواع</option>
            <option value="0">حضوري</option>
            <option value="1">أونلاين</option>
            <option value="2">أونلاين + حضوري</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          >
            <option value="all">كل الحالات</option>
            <option value="0">مسودة</option>
            <option value="1">نشطة</option>
            <option value="2">منتهية</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-4xl text-red-400" />
          <p className="text-lg font-bold text-gray-800">تعذّر تحميل الدورات</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button onClick={fetchData} className="inline-flex items-center gap-2 px-5 py-2.5 bg-dashboardBg text-white font-semibold rounded-xl hover:bg-emerald-800 transition-colors">
            <FontAwesomeIcon icon={faRotateRight} />
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-dashboardBg" />
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dashboardBg text-white">
                  <th className="px-5 py-4 text-right font-semibold">العنوان</th>
                  <th className="px-5 py-4 text-right font-semibold">القسم</th>
                  <th className="px-5 py-4 text-center font-semibold">النوع</th>
                  <th className="px-5 py-4 text-center font-semibold">الحالة</th>
                  <th className="px-5 py-4 text-center font-semibold">السعر</th>
                  <th className="px-5 py-4 text-center font-semibold">تاريخ البدء</th>
                  <th className="px-5 py-4 text-center font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length > 0 ? (
                  filtered.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                      {/* Title */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {course.thumbnailUrl ? (
                            <img src={getFileUrl(course.thumbnailUrl)} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                              <FontAwesomeIcon icon={faGraduationCap} className="text-emerald-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate max-w-[250px]">{course.title}</p>
                            {course.subtitle && <p className="text-xs text-gray-400 truncate max-w-[250px]">{course.subtitle}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                          {course.courseCategoryName || '—'}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${courseTypeColor(course.courseType)}`}>
                          <FontAwesomeIcon icon={courseTypeIcon(course.courseType)} className="text-[10px]" />
                          {courseTypeLabel(course.courseType)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(course.status)}`}>
                          {course.statusName || statusLabel(course.status)}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 text-center font-bold text-gray-800" suppressHydrationWarning>
                        {course.price > 0 ? `${course.price.toLocaleString('ar-SA')} ر.س` : <span className="text-emerald-600">مجاني</span>}
                      </td>

                      {/* Start Date */}
                      <td className="px-5 py-4 text-center text-gray-600 whitespace-nowrap" suppressHydrationWarning>
                        {formatDate(course.startDate)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/courses-table/${course.id}`}
                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                            title="عرض / تعديل"
                          >
                            <FontAwesomeIcon icon={faEdit} className="text-xs" />
                          </Link>
                          <button
                            onClick={() => { setCourseToDelete(course); setDeleteModal(true); }}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                            title="حذف"
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-4xl text-gray-300 mb-3" />
                      <p className="text-gray-400 font-semibold">لا توجد دورات مطابقة</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
              عرض {filtered.length} من {courses.length} دورة
            </div>
          )}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">حذف الدورة</h3>
            <p className="text-gray-500 text-sm mb-1">هل أنت متأكد من حذف:</p>
            <p className="font-bold text-gray-800 mb-5">{courseToDelete.title}</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
              >
                {deleteLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'حذف'}
              </button>
              <button
                onClick={() => { setDeleteModal(false); setCourseToDelete(null); }}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
