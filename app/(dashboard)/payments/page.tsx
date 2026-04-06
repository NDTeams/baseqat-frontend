"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSpinner,
  faMoneyBillWave,
  faTrash,
  faPlus,
  faChevronLeft,
  faChevronRight,
  faUndo,
  faCheckCircle,
  faTimes,
  faTimesCircle,
  faClock,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import {
  PaymentService,
  type PaymentData,
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

const statusBadge = (status: number) => {
  switch (status) {
    case 0: return { label: "قيد الانتظار", cls: "bg-amber-100 text-amber-700" };
    case 1: return { label: "مكتمل", cls: "bg-green-100 text-green-700" };
    case 2: return { label: "فشل", cls: "bg-red-100 text-red-700" };
    case 3: return { label: "مسترجع", cls: "bg-blue-100 text-blue-700" };
    case 4: return { label: "ملغي", cls: "bg-neutral-100 text-neutral-500" };
    default: return { label: "غير معروف", cls: "bg-neutral-100 text-neutral-500" };
  }
};

export default function PaymentsAdmin() {
  const [data, setData] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const filter: any = {};
      if (search) filter.invoiceNumber = search;
      if (statusFilter !== "") filter.paymentStatus = parseInt(statusFilter);

      const res = await PaymentService.getAllPaged(
        { pageNumber: page, pageSize: PAGE_SIZE },
        filter
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
  }, [page, search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleDelete = async (id: number) => {
    if (!confirm("هل تريد حذف هذه الفاتورة نهائياً؟")) return;
    setActionLoading(id);
    try {
      const res = await PaymentService.delete(id);
      if (res.succeeded) {
        setToast({ open: true, type: "success", message: "تم حذف الفاتورة" });
        fetchData();
      } else {
        setToast({ open: true, type: "error", message: res.message || "فشل الحذف" });
      }
    } catch { setToast({ open: true, type: "error", message: "حدث خطأ" }); }
    setActionLoading(null);
  };

  const handleRefund = async (id: number) => {
    const reason = prompt("سبب الاسترجاع (اختياري):");
    if (reason === null) return;
    setActionLoading(id);
    try {
      const res = await PaymentService.refund(id, reason || undefined);
      if (res.succeeded) {
        setToast({ open: true, type: "success", message: "تم استرجاع المبلغ" });
        fetchData();
      } else {
        setToast({ open: true, type: "error", message: res.message || "فشل الاسترجاع" });
      }
    } catch { setToast({ open: true, type: "error", message: "حدث خطأ" }); }
    setActionLoading(null);
  };

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await PaymentService.updateStatus(id, { paymentStatus: 1 });
      if (res.succeeded) {
        setToast({ open: true, type: "success", message: "تم تأكيد الدفع" });
        fetchData();
      } else {
        setToast({ open: true, type: "error", message: res.message || "فشل التحديث" });
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
          <h1 className="text-2xl font-bold text-neutral-900">إدارة المدفوعات</h1>
          <p className="text-sm text-neutral-500 mt-1">إدارة الفواتير والمدفوعات</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition text-sm"
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
          إضافة فاتورة
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="ابحث برقم الفاتورة..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">كل الحالات</option>
          <option value="0">قيد الانتظار</option>
          <option value="1">مكتمل</option>
          <option value="2">فشل</option>
          <option value="3">مسترجع</option>
          <option value="4">ملغي</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-5 py-4 text-right font-semibold text-neutral-600">#</th>
                <th className="px-5 py-4 text-right font-semibold text-neutral-600">رقم الفاتورة</th>
                <th className="px-5 py-4 text-right font-semibold text-neutral-600">المستخدم</th>
                <th className="px-5 py-4 text-right font-semibold text-neutral-600">الدورة</th>
                <th className="px-5 py-4 text-right font-semibold text-neutral-600">المبلغ</th>
                <th className="px-5 py-4 text-right font-semibold text-neutral-600">طريقة الدفع</th>
                <th className="px-5 py-4 text-right font-semibold text-neutral-600">الحالة</th>
                <th className="px-5 py-4 text-right font-semibold text-neutral-600">التاريخ</th>
                <th className="px-5 py-4 text-right font-semibold text-neutral-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-neutral-400">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-3xl mb-2 block mx-auto" />
                    لا توجد مدفوعات
                  </td>
                </tr>
              ) : (
                data.map((p) => {
                  const sb = statusBadge(p.paymentStatus);
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50 transition">
                      <td className="px-5 py-4 text-neutral-500">{p.id}</td>
                      <td className="px-5 py-4 font-mono text-xs text-emerald-700 font-semibold">{p.invoiceNumber}</td>
                      <td className="px-5 py-4">
                        <div>
                          <span className="font-semibold text-neutral-800 block">{p.userName}</span>
                          <span className="text-xs text-neutral-400">{p.userEmail}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-neutral-700">{p.courseTitle}</td>
                      <td className="px-5 py-4 font-bold text-emerald-700">{p.amount.toLocaleString()} ر.س</td>
                      <td className="px-5 py-4 text-neutral-600">{p.paymentMethodName}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${sb.cls}`}>
                          {sb.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-neutral-500 text-xs">{p.createdAt}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          {p.paymentStatus === 0 && (
                            <button
                              onClick={() => handleApprove(p.id)}
                              disabled={actionLoading === p.id}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="تأكيد الدفع"
                            >
                              {actionLoading === p.id ? (
                                <FontAwesomeIcon icon={faSpinner} spin className="text-sm" />
                              ) : (
                                <FontAwesomeIcon icon={faCheckCircle} className="text-sm" />
                              )}
                            </button>
                          )}
                          {p.paymentStatus === 1 && (
                            <button
                              onClick={() => handleRefund(p.id)}
                              disabled={actionLoading === p.id}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="استرجاع المبلغ"
                            >
                              <FontAwesomeIcon icon={faUndo} className="text-sm" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={actionLoading === p.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="حذف"
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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

      {/* Add Payment Modal */}
      {showAddModal && (
        <AddPaymentModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { fetchData(); setToast({ open: true, type: "success", message: "تم إضافة الفاتورة بنجاح" }); }}
          onError={(msg) => setToast({ open: true, type: "error", message: msg })}
        />
      )}
    </div>
  );
}

// ===== Add Payment Modal =====
function AddPaymentModal({
  onClose, onSuccess, onError,
}: {
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [userId, setUserId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("0");
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!userId || !courseId || !amount) return;
    setSubmitting(true);
    try {
      const res = await PaymentService.add({
        userId,
        courseId: parseInt(courseId),
        amount: parseFloat(amount),
        paymentMethod: parseInt(paymentMethod),
        transactionId: transactionId || undefined,
        notes: notes || undefined,
      });
      if (res.succeeded) {
        onSuccess();
        onClose();
      } else {
        onError(res.message || "فشل الإضافة");
      }
    } catch {
      onError("حدث خطأ أثناء الإضافة");
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()} dir="rtl">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">إضافة فاتورة جديدة</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">معرف المستخدم (User ID) *</label>
            <input
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="معرف المستخدم"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">رقم الدورة *</label>
              <input
                type="number"
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                placeholder="Course ID"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">المبلغ (ر.س) *</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">طريقة الدفع</label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="0">تحويل بنكي</option>
              <option value="1">بطاقة ائتمان</option>
              <option value="2">مدى</option>
              <option value="3">Apple Pay</option>
              <option value="4">نقدي</option>
              <option value="5">أخرى</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">رقم المعاملة</label>
            <input
              value={transactionId}
              onChange={e => setTransactionId(e.target.value)}
              placeholder="اختياري"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">ملاحظات</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="اختياري"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!userId || !courseId || !amount || submitting}
            className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? <FontAwesomeIcon icon={faSpinner} spin /> : "إضافة الفاتورة"}
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
