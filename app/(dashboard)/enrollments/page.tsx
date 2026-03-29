'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faTrash,
  faCheck,
  faTimes,
  faSpinner,
  faTriangleExclamation,
  faUserGraduate,
  faFilter,
  faChevronLeft,
  faChevronRight,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  CourseEnrollmentService,
  type CourseEnrollment,
} from '@/services/courses/page';

// ===========================
// Types
// ===========================
interface StatusNotif {
  open: boolean;
  type: 'success' | 'error';
  message: string;
}

const PAGE_SIZE = 10;

// ===========================
// Skeleton Row
// ===========================
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 w-8 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
    </tr>
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
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl text-white font-semibold text-sm transition-all ${
        notif.type === 'success' ? 'bg-blue-600' : 'bg-red-500'
      }`}
    >
      <FontAwesomeIcon icon={notif.type === 'success' ? faCheck : faTriangleExclamation} />
      {notif.message}
      <button onClick={onClose} className="mr-2 opacity-70 hover:opacity-100">
        <FontAwesomeIcon icon={faTimes} className="text-xs" />
      </button>
    </div>
  );
}

// ===========================
// Delete Confirmation Modal
// ===========================
function DeleteModal({
  isOpen,
  enrollment,
  loading,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  enrollment: CourseEnrollment | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen || !enrollment) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">تأكيد حذف التسجيل</h2>
          <p className="text-gray-500 text-sm">
            هل أنت متأكد من حذف تسجيل{' '}
            <span className="font-semibold text-gray-800">"{enrollment.userName || enrollment.userId}"</span>
            {enrollment.courseName && <> من دورة <span className="font-semibold text-gray-800">"{enrollment.courseName}"</span></>}؟
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faTrash} />}
              حذف
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================
// Main Page
// ===========================
export default function EnrollmentsPage() {
  // --- Data ---
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- Filters ---
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // --- Delete Modal ---
  const [deleteModal, setDeleteModal] = useState(false);
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<CourseEnrollment | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // --- Notif ---
  const [notif, setNotif] = useState<StatusNotif>({ open: false, type: 'success', message: '' });

  const showNotif = (type: 'success' | 'error', message: string) =>
    setNotif({ open: true, type, message });

  // --- Fetch ---
  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CourseEnrollmentService.getAllPaged(
        { pageNumber: currentPage, pageSize: PAGE_SIZE },
        {}
      );
      if (res.succeeded) {
        let data = res.data ?? [];
        // Client-side search filter
        if (searchTerm.trim()) {
          const q = searchTerm.trim().toLowerCase();
          data = data.filter(
            (e) =>
              (e.userName || '').toLowerCase().includes(q) ||
              (e.courseName || '').toLowerCase().includes(q) ||
              (e.userId || '').toLowerCase().includes(q)
          );
        }
        setEnrollments(data);
        setTotalCount(res.totalCount ?? 0);
      } else {
        showNotif('error', res.message || 'فشل في تحميل البيانات');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentPage]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // --- Delete ---
  const handleOpenDelete = (enrollment: CourseEnrollment) => {
    setEnrollmentToDelete(enrollment);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!enrollmentToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await CourseEnrollmentService.delete(enrollmentToDelete.id);
      if (res.succeeded) {
        showNotif('success', 'تم حذف التسجيل بنجاح');
        setDeleteModal(false);
        setEnrollmentToDelete(null);
        fetchEnrollments();
      } else {
        showNotif('error', res.message || 'فشل الحذف');
        setDeleteModal(false);
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
      setDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // --- Search ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEnrollments();
  };

  // Count this month enrollments
  const thisMonth = new Date();
  const thisMonthCount = enrollments.filter((e) => {
    if (!e.enrolledAt) return false;
    const d = new Date(e.enrolledAt);
    return d.getMonth() === thisMonth.getMonth() && d.getFullYear() === thisMonth.getFullYear();
  }).length;

  return (
    <div className="p-4 sm:p-6" dir="rtl">
      {/* ===== Page Header ===== */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">التسجيلات</h1>
        <p className="text-gray-500 text-sm mt-1">
          إدارة تسجيلات الطلاب في الدورات التدريبية
        </p>
      </div>

      {/* ===== Stats Bar ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border px-5 py-4 bg-blue-50 text-blue-700 border-blue-200">
          <p className="text-2xl font-bold">{totalCount}</p>
          <p className="text-xs font-medium mt-0.5">إجمالي التسجيلات</p>
        </div>
        <div className="rounded-xl border px-5 py-4 bg-blue-50 text-blue-700 border-blue-200">
          <p className="text-2xl font-bold">{thisMonthCount}</p>
          <p className="text-xs font-medium mt-0.5">هذا الشهر</p>
        </div>
        <div className="rounded-xl border px-5 py-4 bg-purple-50 text-purple-700 border-purple-200">
          <p className="text-2xl font-bold">{new Set(enrollments.map(e => e.courseId)).size}</p>
          <p className="text-xs font-medium mt-0.5">دورات فريدة</p>
        </div>
      </div>

      {/* ===== Filters ===== */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث باسم الطالب أو الدورة..."
            className="w-full pr-9 pl-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-dashboardBg hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          بحث
        </button>
      </form>

      {/* ===== Table ===== */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3.5 text-right font-semibold text-gray-600">#</th>
                <th className="px-6 py-3.5 text-right font-semibold text-gray-600">اسم الدورة</th>
                <th className="px-6 py-3.5 text-right font-semibold text-gray-600">اسم الطالب</th>
                <th className="px-6 py-3.5 text-right font-semibold text-gray-600">تاريخ التسجيل</th>
                <th className="px-6 py-3.5 text-right font-semibold text-gray-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : enrollments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <FontAwesomeIcon icon={faUserGraduate} className="text-4xl" />
                      <p className="font-medium">لا توجد تسجيلات</p>
                    </div>
                  </td>
                </tr>
              ) : (
                enrollments.map((enrollment, index) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 text-gray-400 font-medium">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">{enrollment.courseName || `دورة #${enrollment.courseId}`}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {enrollment.userName || enrollment.userId}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-xs text-gray-400" />
                        {enrollment.enrolledAt
                          ? new Date(enrollment.enrolledAt).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOpenDelete(enrollment)}
                        title="حذف"
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ===== Pagination ===== */}
        {!loading && totalCount > PAGE_SIZE && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              عرض{' '}
              <span className="font-semibold text-gray-700">
                {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalCount)}
              </span>{' '}
              من <span className="font-semibold text-gray-700">{totalCount}</span> تسجيل
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                if (totalPages > 7 && p !== 1 && p !== totalPages && Math.abs(p - currentPage) > 2)
                  return p === 2 || p === totalPages - 1 ? (
                    <span key={p} className="text-gray-400 text-sm px-1">…</span>
                  ) : null;
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === p
                        ? 'bg-dashboardBg text-white shadow'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== Modals ===== */}
      <DeleteModal
        isOpen={deleteModal}
        enrollment={enrollmentToDelete}
        loading={deleteLoading}
        onClose={() => { setDeleteModal(false); setEnrollmentToDelete(null); }}
        onConfirm={confirmDelete}
      />

      {/* ===== Toast ===== */}
      <StatusToast notif={notif} onClose={() => setNotif({ ...notif, open: false })} />
    </div>
  );
}
