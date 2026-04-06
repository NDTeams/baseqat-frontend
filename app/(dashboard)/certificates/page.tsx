"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSpinner,
  faCertificate,
  faTrash,
  faBan,
  faFilter,
  faChevronLeft,
  faChevronRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  CertificateService,
  CourseEnrollmentService,
  type CertificateData,
  type CertificateFilter,
} from "@/services/courses/page";

const PAGE_SIZE = 10;

function StatusToast({ open, type, message, onClose }: { open: boolean; type: string; message: string; onClose: () => void }) {
  useEffect(() => { if (open) { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); } }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl shadow-lg text-white text-sm font-semibold ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
      {message}
    </div>
  );
}

export default function CertificatesAdmin() {
  const [data, setData] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CertificateFilter>({});
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CertificateService.getAllPaged(
        { pageNumber: page, pageSize: PAGE_SIZE },
        { ...filter, certificateNumber: search || undefined }
      );
      if (res.succeeded && res.data) {
        setData(res.data);
        setTotalCount(res.totalCount);
      } else {
        setData([]);
        setTotalCount(0);
      }
    } catch { setData([]); }
    setLoading(false);
  }, [page, filter, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleRevoke = async (id: number) => {
    if (!confirm("هل تريد إلغاء هذه الشهادة؟")) return;
    setActionLoading(id);
    try {
      const res = await CertificateService.revoke(id);
      if (res.succeeded) {
        setToast({ open: true, type: "success", message: "تم إلغاء الشهادة" });
        fetchData();
      } else {
        setToast({ open: true, type: "error", message: res.message || "فشل الإلغاء" });
      }
    } catch { setToast({ open: true, type: "error", message: "حدث خطأ" }); }
    setActionLoading(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل تريد حذف هذه الشهادة نهائياً؟")) return;
    setActionLoading(id);
    try {
      const res = await CertificateService.delete(id);
      if (res.succeeded) {
        setToast({ open: true, type: "success", message: "تم حذف الشهادة" });
        fetchData();
      } else {
        setToast({ open: true, type: "error", message: res.message || "فشل الحذف" });
      }
    } catch { setToast({ open: true, type: "error", message: "حدث خطأ" }); }
    setActionLoading(null);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <StatusToast {...toast} onClose={() => setToast(p => ({ ...p, open: false }))} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">إدارة الشهادات</h1>
          <p className="text-sm text-neutral-500 mt-1">إصدار وإدارة شهادات الطلاب</p>
        </div>
        <button
          onClick={() => setShowIssueModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition text-sm"
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
          إصدار شهادات لدورة
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="ابحث برقم الشهادة..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">#</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">رقم الشهادة</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">الطالب</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">الدورة</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">المدرب</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">تاريخ الإصدار</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">الحالة</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-neutral-400">
                    <FontAwesomeIcon icon={faCertificate} className="text-3xl mb-2 block mx-auto" />
                    لا توجد شهادات
                  </td>
                </tr>
              ) : (
                data.map((cert) => (
                  <tr key={cert.id} className="hover:bg-neutral-50 transition">
                    <td className="px-6 py-4 text-neutral-500">{cert.id}</td>
                    <td className="px-6 py-4 font-mono text-xs text-emerald-700 font-semibold">{cert.certificateNumber}</td>
                    <td className="px-6 py-4 font-semibold text-neutral-800">{cert.studentName}</td>
                    <td className="px-6 py-4 text-neutral-700">{cert.courseTitle}</td>
                    <td className="px-6 py-4 text-neutral-600">{cert.instructorName}</td>
                    <td className="px-6 py-4 text-neutral-500">{cert.issuedAt}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        cert.isRevoked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {cert.isRevoked ? "ملغاة" : "سارية"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!cert.isRevoked && (
                          <button
                            onClick={() => handleRevoke(cert.id)}
                            disabled={actionLoading === cert.id}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="إلغاء الشهادة"
                          >
                            {actionLoading === cert.id ? (
                              <FontAwesomeIcon icon={faSpinner} spin className="text-sm" />
                            ) : (
                              <FontAwesomeIcon icon={faBan} className="text-sm" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(cert.id)}
                          disabled={actionLoading === cert.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="حذف"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100">
            <p className="text-sm text-neutral-500">
              عرض {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, totalCount)} من {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 transition"
              >
                <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
              </button>
              <span className="text-sm font-semibold text-neutral-700">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 transition"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Issue Modal */}
      {showIssueModal && (
        <IssueCertificatesModal
          onClose={() => setShowIssueModal(false)}
          onSuccess={() => { fetchData(); setToast({ open: true, type: "success", message: "تم إصدار الشهادات بنجاح" }); }}
          onError={(msg) => setToast({ open: true, type: "error", message: msg })}
        />
      )}
    </div>
  );
}

function IssueCertificatesModal({
  onClose,
  onSuccess,
  onError,
}: {
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [courseId, setCourseId] = useState("");
  const [issuing, setIssuing] = useState(false);

  const handleIssue = async () => {
    if (!courseId) return;
    setIssuing(true);
    try {
      const res = await CertificateService.issueForCourse(parseInt(courseId));
      if (res.succeeded) {
        onSuccess();
        onClose();
      } else {
        onError(res.message || "فشل إصدار الشهادات");
      }
    } catch {
      onError("حدث خطأ أثناء الإصدار");
    }
    setIssuing(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()} dir="rtl">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">إصدار شهادات لدورة</h2>
        <p className="text-sm text-neutral-500 mb-4">
          سيتم إصدار شهادات لجميع الطلاب المعتمدين في الدورة الذين لم يحصلوا على شهادة بعد.
        </p>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-neutral-700 mb-2">رقم الدورة (Course ID)</label>
          <input
            type="number"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            placeholder="أدخل رقم الدورة"
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleIssue}
            disabled={!courseId || issuing}
            className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {issuing ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <>
                <FontAwesomeIcon icon={faCertificate} className="text-xs" />
                إصدار الشهادات
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-100 text-neutral-600 rounded-xl font-semibold hover:bg-neutral-200 transition text-sm"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
