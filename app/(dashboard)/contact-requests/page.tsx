'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope, faSpinner, faSearch, faChevronLeft, faChevronRight,
  faEye, faReply, faTrash, faCheck, faClock, faCircle,
  faPhone, faUser, faFilter, faTimes, faCommentDots,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {
  ContactRequestAdminService,
  type ContactRequest,
  type ContactRequestFilter,
  ContactRequestStatus,
  ReplyChannel,
} from '@/services/contact/page';

const PAGE_SIZE = 10;

const STATUS_MAP: Record<ContactRequestStatus, { label: string; color: string; icon: typeof faCircle }> = {
  [ContactRequestStatus.New]: { label: 'جديد', color: 'bg-blue-100 text-blue-700', icon: faCircle },
  [ContactRequestStatus.InProgress]: { label: 'قيد المعالجة', color: 'bg-yellow-100 text-yellow-700', icon: faClock },
  [ContactRequestStatus.Closed]: { label: 'مغلق', color: 'bg-green-100 text-green-700', icon: faCheck },
};

const REPLY_CHANNEL_MAP: Record<ReplyChannel, { label: string; icon: typeof faEnvelope }> = {
  [ReplyChannel.Email]: { label: 'بريد إلكتروني', icon: faEnvelope },
  [ReplyChannel.WhatsApp]: { label: 'واتساب', icon: faWhatsapp as any },
  [ReplyChannel.Phone]: { label: 'هاتف', icon: faPhone },
};

function StatusBadge({ status }: { status: ContactRequestStatus }) {
  const s = STATUS_MAP[status] || STATUS_MAP[ContactRequestStatus.New];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${s.color}`}>
      <FontAwesomeIcon icon={s.icon} className="text-[8px]" />
      {s.label}
    </span>
  );
}

export default function ContactRequestsPage() {
  const [data, setData] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactRequestStatus | ''>('');

  // Modals
  const [viewItem, setViewItem] = useState<ContactRequest | null>(null);
  const [replyItem, setReplyItem] = useState<ContactRequest | null>(null);
  const [deleteItem, setDeleteItem] = useState<ContactRequest | null>(null);

  // Reply form
  const [replyMessage, setReplyMessage] = useState('');
  const [replyChannel, setReplyChannel] = useState<ReplyChannel>(ReplyChannel.Email);
  const [closeOnReply, setCloseOnReply] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const filter: ContactRequestFilter = {};
      if (search.trim()) filter.fullName = search.trim();
      if (statusFilter !== '') filter.status = statusFilter;

      const res = await ContactRequestAdminService.getAllPaged(
        { pageNumber: page, pageSize: PAGE_SIZE },
        filter
      );
      if (res.succeeded) {
        setData(res.data);
        setTotalCount(res.totalCount);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusChange = async (item: ContactRequest, newStatus: ContactRequestStatus) => {
    try {
      const res = await ContactRequestAdminService.updateStatus(item.id, { status: newStatus });
      if (res.succeeded && res.data) {
        setData(prev => prev.map(d => d.id === item.id ? res.data : d));
        if (viewItem?.id === item.id) setViewItem(res.data);
      }
    } catch { /* ignore */ }
  };

  const handleReply = async () => {
    if (!replyItem || !replyMessage.trim()) return;
    setSubmitting(true);
    try {
      const res = await ContactRequestAdminService.reply(replyItem.id, {
        replyMessage: replyMessage.trim(),
        replyChannel,
        closeRequest: closeOnReply,
      });
      if (res.succeeded && res.data) {
        setData(prev => prev.map(d => d.id === replyItem.id ? res.data : d));
        setReplyItem(null);
        setReplyMessage('');
        setCloseOnReply(false);
      }
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setSubmitting(true);
    try {
      const res = await ContactRequestAdminService.softDelete(deleteItem.id);
      if (res.succeeded) {
        setData(prev => prev.filter(d => d.id !== deleteItem.id));
        setTotalCount(prev => prev - 1);
        setDeleteItem(null);
      }
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FontAwesomeIcon icon={faEnvelope} className="text-blue-600" />
            طلبات التواصل
          </h1>
          <p className="text-sm text-gray-500 mt-1">إدارة رسائل التواصل الواردة من الموقع</p>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          {totalCount} طلب
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="بحث بالاسم..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pr-9 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="relative">
            <FontAwesomeIcon icon={faFilter} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value === '' ? '' : Number(e.target.value) as ContactRequestStatus); setPage(1); }}
              className="pr-9 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white min-w-[160px]"
            >
              <option value="">كل الحالات</option>
              <option value={ContactRequestStatus.New}>جديد</option>
              <option value={ContactRequestStatus.InProgress}>قيد المعالجة</option>
              <option value={ContactRequestStatus.Closed}>مغلق</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-2xl" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-300 text-4xl mb-3" />
            <p className="text-gray-500">لا توجد طلبات تواصل</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">#</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">الاسم</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">البريد</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">الجوال</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">النوع</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">الحالة</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">التاريخ</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{item.id}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{item.fullName}</td>
                    <td className="px-4 py-3 text-gray-600">{item.email}</td>
                    <td className="px-4 py-3 text-gray-600" dir="ltr">{item.phoneNumber || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{item.requestType || '-'}</td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setViewItem(item)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="عرض">
                          <FontAwesomeIcon icon={faEye} className="text-sm" />
                        </button>
                        <button onClick={() => { setReplyItem(item); setReplyMessage(''); setCloseOnReply(false); }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="رد">
                          <FontAwesomeIcon icon={faReply} className="text-sm" />
                        </button>
                        {item.status === ContactRequestStatus.New && (
                          <button onClick={() => handleStatusChange(item, ContactRequestStatus.InProgress)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors" title="قيد المعالجة">
                            <FontAwesomeIcon icon={faClock} className="text-sm" />
                          </button>
                        )}
                        {item.status !== ContactRequestStatus.Closed && (
                          <button onClick={() => handleStatusChange(item, ContactRequestStatus.Closed)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="إغلاق">
                            <FontAwesomeIcon icon={faCheck} className="text-sm" />
                          </button>
                        )}
                        <button onClick={() => setDeleteItem(item)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="حذف">
                          <FontAwesomeIcon icon={faTrash} className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              صفحة {page} من {totalPages}
            </span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== View Modal ===== */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setViewItem(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">تفاصيل الطلب #{viewItem.id}</h3>
              <button onClick={() => setViewItem(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">الاسم الكامل</p>
                  <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400 text-xs" />
                    {viewItem.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">الحالة</p>
                  <StatusBadge status={viewItem.status} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">البريد الإلكتروني</p>
                  <p className="text-gray-700 text-sm">{viewItem.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">الجوال</p>
                  <p className="text-gray-700 text-sm" dir="ltr">{viewItem.phoneNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">نوع الطلب</p>
                  <p className="text-gray-700 text-sm">{viewItem.requestType || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">قناة الرد المفضلة</p>
                  <p className="text-gray-700 text-sm">
                    {viewItem.preferredReplyChannel != null
                      ? REPLY_CHANNEL_MAP[viewItem.preferredReplyChannel]?.label || '-'
                      : '-'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">الرسالة</p>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm leading-relaxed">
                  {viewItem.message}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div>تاريخ الإرسال: {formatDate(viewItem.createdAt)}</div>
                <div>تاريخ الرد: {formatDate(viewItem.repliedAt)}</div>
                <div>تاريخ الإغلاق: {formatDate(viewItem.closedAt)}</div>
                <div>تم المعالجة بواسطة: {viewItem.handledBy || '-'}</div>
              </div>

              {viewItem.adminReplyMessage && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">رد الإدارة</p>
                  <div className="bg-blue-50 rounded-xl p-4 text-blue-800 text-sm leading-relaxed border-r-4 border-blue-500">
                    {viewItem.adminReplyMessage}
                  </div>
                  {viewItem.repliedVia != null && (
                    <p className="text-xs text-gray-400 mt-1">
                      تم الرد عبر: {REPLY_CHANNEL_MAP[viewItem.repliedVia]?.label || '-'}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 p-5 border-t border-gray-100">
              <button onClick={() => { setViewItem(null); setReplyItem(viewItem); setReplyMessage(''); setCloseOnReply(false); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                <FontAwesomeIcon icon={faReply} className="text-xs" />
                رد
              </button>
              <button onClick={() => setViewItem(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Reply Modal ===== */}
      {replyItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setReplyItem(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">
                <FontAwesomeIcon icon={faReply} className="text-blue-600 ml-2" />
                الرد على {replyItem.fullName}
              </h3>
              <button onClick={() => setReplyItem(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
                <p className="text-xs text-gray-400 mb-1">رسالة العميل:</p>
                {replyItem.message}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">الرد</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="اكتب ردك هنا..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">قناة الرد</label>
                <div className="flex gap-2">
                  {Object.entries(REPLY_CHANNEL_MAP).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setReplyChannel(Number(key) as ReplyChannel)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        replyChannel === Number(key)
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                          : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                      }`}
                    >
                      <FontAwesomeIcon icon={val.icon} className="text-xs" />
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={closeOnReply}
                  onChange={(e) => setCloseOnReply(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">إغلاق الطلب بعد الرد</span>
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 p-5 border-t border-gray-100">
              <button onClick={handleReply} disabled={submitting || !replyMessage.trim()}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                {submitting ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faReply} className="text-xs" />}
                إرسال الرد
              </button>
              <button onClick={() => setReplyItem(null)}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Delete Confirmation ===== */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteItem(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faTrash} className="text-red-500 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">حذف الطلب</h3>
              <p className="text-sm text-gray-500">
                هل أنت متأكد من حذف طلب التواصل من <span className="font-semibold text-gray-700">{deleteItem.fullName}</span>؟
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 p-5 border-t border-gray-100">
              <button onClick={handleDelete} disabled={submitting}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                {submitting ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faTrash} className="text-xs" />}
                حذف
              </button>
              <button onClick={() => setDeleteItem(null)}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
