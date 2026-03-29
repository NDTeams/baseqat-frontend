'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboardList, faSpinner, faCheck, faTimes,
  faChevronLeft, faChevronRight, faClock, faCalendarAlt,
  faLayerGroup, faUser, faCircle, faEnvelope, faPhone,
  faFilter, faEye, faXmark, faThumbsUp, faCalendarPlus,
  faBuilding, faReply, faCommentDots,
} from '@fortawesome/free-solid-svg-icons';
import {
  ConsultationRequestService,
  ConsultationCategoryPublicService,
  type ConsultationRequest,
  type ConsultationCategory,
  type ConsultationRequestFilter,
} from '@/services/consultants/page';

const PAGE_SIZE = 10;

const STATUS_MAP: Record<number, { label: string; color: string }> = {
  0: { label: 'بانتظار التعيين', color: 'bg-yellow-100 text-yellow-700' },
  1: { label: 'جديد', color: 'bg-blue-100 text-blue-700' },
  2: { label: 'قيد المعالجة', color: 'bg-indigo-100 text-indigo-700' },
  3: { label: 'تمت الموافقة', color: 'bg-green-100 text-green-700' },
  4: { label: 'مكتمل', color: 'bg-sky-100 text-sky-700' },
  5: { label: 'ملغي', color: 'bg-red-100 text-red-700' },
};

const RESPONSE_MAP: Record<number, { label: string; color: string; icon: typeof faCheck }> = {
  0: { label: 'لم يتم الرد', color: 'bg-gray-100 text-gray-600', icon: faClock },
  1: { label: 'تمت الموافقة على الموعد', color: 'bg-green-100 text-green-700', icon: faThumbsUp },
  2: { label: 'تم طلب تأجيل', color: 'bg-amber-100 text-amber-700', icon: faCalendarPlus },
  3: { label: 'طلب تحويل لحضوري', color: 'bg-purple-100 text-purple-700', icon: faBuilding },
};

function StatusToast({ open, type, message, onClose }: { open: boolean; type: string; message: string; onClose: () => void }) {
  useEffect(() => {
    if (open) { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${type === 'success' ? 'bg-sky-600' : 'bg-red-500'}`}>
      <FontAwesomeIcon icon={type === 'success' ? faCheck : faTimes} />
      {message}
    </div>
  );
}

export default function AssignedConsultationsPage() {
  // Categories for filter
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);

  // Requests
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filter, setFilter] = useState<ConsultationRequestFilter>({});
  const [showFilters, setShowFilters] = useState(false);

  // Detail modal
  const [detailReq, setDetailReq] = useState<ConsultationRequest | null>(null);

  // Response modal
  const [responseModal, setResponseModal] = useState(false);
  const [responseReq, setResponseReq] = useState<ConsultationRequest | null>(null);
  const [responseType, setResponseType] = useState<number>(0);
  const [responseNotes, setResponseNotes] = useState('');
  const [suggestedDate, setSuggestedDate] = useState('');
  const [suggestedTime, setSuggestedTime] = useState('');
  const [responseLoading, setResponseLoading] = useState(false);

  // Notif
  const [notif, setNotif] = useState({ open: false, type: 'success', message: '' });
  const showNotif = (type: string, message: string) => setNotif({ open: true, type, message });

  // Load categories
  useEffect(() => {
    ConsultationCategoryPublicService.getActive().then(res => {
      if (res.succeeded && Array.isArray(res.data)) setCategories(res.data);
    });
  }, []);

  // Load assigned requests
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ConsultationRequestService.getMyAssignedRequests(
        { pageNumber: currentPage, pageSize: PAGE_SIZE },
        filter
      );
      if (res.succeeded) {
        setRequests(res.data || []);
        setTotalCount(res.totalCount || 0);
      }
    } catch {
      showNotif('error', 'فشل في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const openResponseModal = (req: ConsultationRequest) => {
    setResponseReq(req);
    setResponseType(0);
    setResponseNotes('');
    setSuggestedDate('');
    setSuggestedTime('');
    setResponseModal(true);
  };

  const handleSubmitResponse = async () => {
    if (!responseReq || responseType === 0) return;
    setResponseLoading(true);
    try {
      const payload: any = { responseType, consultantNotes: responseNotes || undefined };
      if (responseType === 2) {
        payload.suggestedDate = suggestedDate || undefined;
        payload.suggestedTime = suggestedTime || undefined;
      }
      const res = await ConsultationRequestService.respondToRequest(responseReq.id, payload);
      if (res.succeeded) {
        showNotif('success', 'تم إرسال الرد بنجاح');
        setResponseModal(false);
        setDetailReq(null);
        fetchRequests();
      } else {
        showNotif('error', res.message || 'فشل في إرسال الرد');
      }
    } catch {
      showNotif('error', 'حدث خطأ أثناء إرسال الرد');
    } finally {
      setResponseLoading(false);
    }
  };

  // Stats
  const newCount = requests.filter(r => r.status === 1).length;
  const inProgressCount = requests.filter(r => r.status === 2).length;
  const completedCount = requests.filter(r => r.status === 4).length;

  return (
    <div className="flex-1 p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faClipboardList} className="text-white text-lg" />
              </div>
              طلبات الاستشارة المعيّنة لي
            </h1>
            <p className="text-sm text-gray-500 mt-1 mr-14">الطلبات التي تم تعيينك كمستشار لها</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${showFilters ? 'bg-sky-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            <FontAwesomeIcon icon={faFilter} />
            فلتر
          </button>
        </div>

        {/* Stats Cards */}
        {!loading && totalCount > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faCircle} className="text-blue-600 text-xs" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">{newCount}</div>
                <div className="text-xs text-gray-500">طلبات جديدة</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faClock} className="text-indigo-600 text-xs" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">{inProgressCount}</div>
                <div className="text-xs text-gray-500">قيد المعالجة</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faCheck} className="text-sky-600 text-xs" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">{completedCount}</div>
                <div className="text-xs text-gray-500">مكتملة</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">اسم العميل</label>
                <input
                  type="text"
                  value={filter.clientName || ''}
                  onChange={e => { setFilter({ ...filter, clientName: e.target.value }); setCurrentPage(1); }}
                  placeholder="بحث بالاسم..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">نوع الاستشارة</label>
                <select
                  value={filter.consultationCategoryId || ''}
                  onChange={e => { setFilter({ ...filter, consultationCategoryId: e.target.value ? parseInt(e.target.value) : undefined }); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none cursor-pointer"
                >
                  <option value="">الكل</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">الحالة</label>
                <select
                  value={filter.status !== undefined && filter.status !== null ? filter.status : ''}
                  onChange={e => { setFilter({ ...filter, status: e.target.value !== '' ? parseInt(e.target.value) : undefined }); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none cursor-pointer"
                >
                  <option value="">الكل</option>
                  {Object.entries(STATUS_MAP).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FontAwesomeIcon icon={faClipboardList} className="text-sky-600" />
              الطلبات ({totalCount})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-600">#</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-600">العميل</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-600">نوع الاستشارة</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-600">الموضوع</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-600">الموعد المفضل</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-600">الحالة</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-600">تاريخ الطلب</th>
                  <th className="px-5 py-3 text-center text-xs font-bold text-gray-600">تفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-5 py-4"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <FontAwesomeIcon icon={faClipboardList} className="text-gray-300 text-4xl mb-3" />
                      <div className="text-gray-400 text-sm">لا توجد طلبات استشارة معيّنة لك حالياً</div>
                    </td>
                  </tr>
                ) : (
                  requests.map((req, idx) => {
                    const statusInfo = STATUS_MAP[req.status] || { label: req.statusName || '-', color: 'bg-gray-100 text-gray-700' };
                    return (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-sm text-gray-600">{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                        <td className="px-5 py-3 text-sm font-medium text-gray-800">
                          <span className="inline-flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faUser} className="text-gray-400 text-xs" />
                            {req.clientName}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          <span className="inline-flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faLayerGroup} className="text-sky-500 text-xs" />
                            {req.consultationCategoryName || '-'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700 max-w-[180px] truncate">{req.subject}</td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                          {req.preferredDate ? new Date(req.preferredDate).toLocaleDateString('ar-SA') : '-'}
                          {req.preferredTime ? ` | ${req.preferredTime}` : ''}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                            <FontAwesomeIcon icon={faCircle} className="text-[6px]" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">
                          {req.createdAt ? new Date(req.createdAt).toLocaleDateString('ar-SA') : '-'}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setDetailReq(req)}
                              className="w-8 h-8 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-600 transition-colors inline-flex items-center justify-center"
                              title="تفاصيل"
                            >
                              <FontAwesomeIcon icon={faEye} className="text-sm" />
                            </button>
                            {(req.status === 1 || req.status === 2) && (
                              <button
                                onClick={() => openResponseModal(req)}
                                className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors inline-flex items-center justify-center"
                                title="الرد على الطلب"
                              >
                                <FontAwesomeIcon icon={faReply} className="text-sm" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
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
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
              </button>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {detailReq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDetailReq(null)}>
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">تفاصيل الطلب #{detailReq.id}</h3>
                <button onClick={() => setDetailReq(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
                  <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                {/* Client info */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <h4 className="text-sm font-bold text-gray-700 mb-2">معلومات العميل</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400 text-xs w-4" />
                    <span className="font-medium">{detailReq.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-xs w-4" />
                    <span>{detailReq.clientEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FontAwesomeIcon icon={faPhone} className="text-gray-400 text-xs w-4" />
                    <span dir="ltr">{detailReq.clientPhone}</span>
                  </div>
                </div>

                {/* Request details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">نوع الاستشارة</span>
                    <span className="text-sm font-semibold text-gray-800">{detailReq.consultationCategoryName || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">الحالة</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${(STATUS_MAP[detailReq.status] || { color: 'bg-gray-100 text-gray-700' }).color}`}>
                      {(STATUS_MAP[detailReq.status] || { label: detailReq.statusName || '-' }).label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">الموعد المفضل</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {detailReq.preferredDate ? new Date(detailReq.preferredDate).toLocaleDateString('ar-SA') : '-'}
                      {detailReq.preferredTime ? ` | ${detailReq.preferredTime}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">تاريخ الطلب</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {detailReq.createdAt ? new Date(detailReq.createdAt).toLocaleDateString('ar-SA') : '-'}
                    </span>
                  </div>
                </div>

                {/* Subject & Message */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-1">الموضوع</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{detailReq.subject}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-1">التفاصيل</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{detailReq.message}</p>
                </div>

                {detailReq.adminNotes && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-1">ملاحظات الإدارة</h4>
                    <p className="text-sm text-gray-600 bg-amber-50 border border-amber-100 rounded-lg p-3">{detailReq.adminNotes}</p>
                  </div>
                )}

                {/* Consultant Response Status */}
                {detailReq.consultantResponse != null && detailReq.consultantResponse > 0 && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-2">
                    <h4 className="text-sm font-bold text-indigo-800 flex items-center gap-2">
                      <FontAwesomeIcon icon={faReply} className="text-xs" />
                      ردي على الطلب
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${(RESPONSE_MAP[detailReq.consultantResponse] || RESPONSE_MAP[0]).color}`}>
                        <FontAwesomeIcon icon={(RESPONSE_MAP[detailReq.consultantResponse] || RESPONSE_MAP[0]).icon} className="text-[10px]" />
                        {(RESPONSE_MAP[detailReq.consultantResponse] || RESPONSE_MAP[0]).label}
                      </span>
                    </div>
                    {detailReq.consultantNotes && (
                      <p className="text-sm text-gray-600 mt-1">{detailReq.consultantNotes}</p>
                    )}
                    {detailReq.consultantResponse === 2 && (detailReq.suggestedDate || detailReq.suggestedTime) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-amber-500 text-xs" />
                        <span>الموعد المقترح: </span>
                        <span className="font-semibold">
                          {detailReq.suggestedDate ? new Date(detailReq.suggestedDate).toLocaleDateString('ar-SA') : ''}
                          {detailReq.suggestedTime ? ` | ${detailReq.suggestedTime}` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Respond Button */}
                {(detailReq.status === 1 || detailReq.status === 2) && (
                  <button
                    onClick={() => { openResponseModal(detailReq); }}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faReply} />
                    الرد على الطلب
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Response Modal */}
        {responseModal && responseReq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setResponseModal(false)}>
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FontAwesomeIcon icon={faReply} className="text-blue-600" />
                  الرد على الطلب #{responseReq.id}
                </h3>
                <button onClick={() => setResponseModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
                  <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Client & Subject Info */}
                <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400 text-xs w-4" />
                    <span className="font-medium">{responseReq.clientName}</span>
                  </div>
                  <div className="text-xs text-gray-500 mr-6">{responseReq.subject}</div>
                </div>

                {/* Response Type Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">اختر نوع الرد</label>
                  <div className="space-y-2">
                    {/* Approve */}
                    <button
                      type="button"
                      onClick={() => setResponseType(1)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-right ${
                        responseType === 1
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${responseType === 1 ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'}`}>
                        <FontAwesomeIcon icon={faThumbsUp} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">الموافقة على الموعد</div>
                        <div className="text-xs text-gray-500">قبول الموعد المقترح من العميل</div>
                      </div>
                    </button>

                    {/* Postpone */}
                    <button
                      type="button"
                      onClick={() => setResponseType(2)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-right ${
                        responseType === 2
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${responseType === 2 ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
                        <FontAwesomeIcon icon={faCalendarPlus} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">تأجيل الموعد</div>
                        <div className="text-xs text-gray-500">اقتراح موعد بديل للعميل</div>
                      </div>
                    </button>

                    {/* Change to In-Person */}
                    <button
                      type="button"
                      onClick={() => setResponseType(3)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-right ${
                        responseType === 3
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${responseType === 3 ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600'}`}>
                        <FontAwesomeIcon icon={faBuilding} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">تحويل لحضوري في باسقات</div>
                        <div className="text-xs text-gray-500">طلب تغيير من أونلاين إلى حضوري</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Suggested Date/Time (for Postpone) */}
                {responseType === 2 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                    <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendarPlus} className="text-xs" />
                      الموعد البديل المقترح
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">التاريخ</label>
                        <input
                          type="date"
                          value={suggestedDate}
                          onChange={e => setSuggestedDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">الوقت</label>
                        <input
                          type="time"
                          value={suggestedTime}
                          onChange={e => setSuggestedTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Consultant Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faCommentDots} className="text-gray-400 text-xs" />
                    ملاحظات (اختياري)
                  </label>
                  <textarea
                    value={responseNotes}
                    onChange={e => setResponseNotes(e.target.value)}
                    rows={3}
                    placeholder="أضف ملاحظة للعميل أو الإدارة..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmitResponse}
                    disabled={responseType === 0 || responseLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {responseLoading ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    ) : (
                      <FontAwesomeIcon icon={faCheck} />
                    )}
                    إرسال الرد
                  </button>
                  <button
                    onClick={() => setResponseModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <StatusToast open={notif.open} type={notif.type} message={notif.message} onClose={() => setNotif({ ...notif, open: false })} />
    </div>
  );
}
