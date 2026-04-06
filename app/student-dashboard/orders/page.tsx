"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag,
  faSpinner,
  faFileInvoice,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faUndo,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import { PaymentService, type PaymentData } from "@/services/courses/page";

const statusIcon = (status: number) => {
  switch (status) {
    case 0: return { icon: faClock, color: "text-amber-500", bg: "bg-amber-100" };
    case 1: return { icon: faCheckCircle, color: "text-green-600", bg: "bg-green-100" };
    case 2: return { icon: faTimesCircle, color: "text-red-600", bg: "bg-red-100" };
    case 3: return { icon: faUndo, color: "text-blue-600", bg: "bg-blue-100" };
    case 4: return { icon: faBan, color: "text-neutral-500", bg: "bg-neutral-100" };
    default: return { icon: faClock, color: "text-neutral-400", bg: "bg-neutral-100" };
  }
};

export default function OrdersPage() {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentData | null>(null);

  useEffect(() => {
    PaymentService.getMyPayments()
      .then((res) => {
        if (res.succeeded && res.data) setPayments(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">المدفوعات</h1>
        <p className="text-sm text-neutral-500 mt-1">سجل المدفوعات والفواتير</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-emerald-600" />
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-neutral-400">
          <FontAwesomeIcon icon={faShoppingBag} className="text-5xl" />
          <p className="text-lg font-semibold">لا توجد مدفوعات</p>
          <p className="text-sm">ستظهر هنا فواتيرك ومدفوعاتك</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => {
            const si = statusIcon(payment.paymentStatus);
            return (
              <div
                key={payment.id}
                className="bg-white rounded-2xl shadow-lg p-5 border border-neutral-100 hover:shadow-xl transition cursor-pointer"
                onClick={() => setSelectedInvoice(payment)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-neutral-900">{payment.courseTitle}</h3>
                    <p className="text-xs text-neutral-400 mt-0.5 font-mono">{payment.invoiceNumber}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${si.bg} ${si.color}`}>
                    <FontAwesomeIcon icon={si.icon} className="ml-1 text-[10px]" />
                    {payment.paymentStatusName}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm text-neutral-500">
                  <span className="font-bold text-emerald-700 text-base">
                    {payment.amount.toLocaleString()} ر.س
                  </span>
                  <span>{payment.paymentMethodName}</span>
                  <span className="text-xs">{payment.createdAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()} dir="rtl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faFileInvoice} className="text-2xl text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900">تفاصيل الفاتورة</h2>
              <p className="text-xs text-neutral-400 font-mono mt-1">{selectedInvoice.invoiceNumber}</p>
            </div>

            <div className="space-y-3 bg-neutral-50 rounded-xl p-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">الدورة</span>
                <span className="font-semibold text-neutral-800">{selectedInvoice.courseTitle}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">المبلغ</span>
                <span className="font-bold text-emerald-700">{selectedInvoice.amount.toLocaleString()} ر.س</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">طريقة الدفع</span>
                <span className="font-semibold">{selectedInvoice.paymentMethodName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">الحالة</span>
                <span className={`font-semibold ${statusIcon(selectedInvoice.paymentStatus).color}`}>
                  {selectedInvoice.paymentStatusName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">تاريخ الإنشاء</span>
                <span className="font-semibold">{selectedInvoice.createdAt}</span>
              </div>
              {selectedInvoice.paidAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">تاريخ الدفع</span>
                  <span className="font-semibold">{selectedInvoice.paidAt}</span>
                </div>
              )}
              {selectedInvoice.transactionId && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">رقم المعاملة</span>
                  <span className="font-mono text-xs">{selectedInvoice.transactionId}</span>
                </div>
              )}
              {selectedInvoice.refundedAt && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">تاريخ الاسترجاع</span>
                    <span className="font-semibold text-blue-600">{selectedInvoice.refundedAt}</span>
                  </div>
                  {selectedInvoice.refundReason && (
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">سبب الاسترجاع</span>
                      <span className="font-semibold">{selectedInvoice.refundReason}</span>
                    </div>
                  )}
                </>
              )}
              {selectedInvoice.notes && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">ملاحظات</span>
                  <span className="font-semibold">{selectedInvoice.notes}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedInvoice(null)}
              className="w-full mt-4 py-2.5 bg-neutral-100 text-neutral-600 rounded-xl font-semibold hover:bg-neutral-200 transition text-sm"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
