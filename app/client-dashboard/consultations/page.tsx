'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments, faSpinner, faCheck, faTimes, faPaperPlane,
  faChevronLeft, faChevronRight, faClock, faCalendarAlt,
  faLayerGroup, faUserTie, faCircle, faEye, faVideo,
  faThumbsUp, faCalendarPlus, faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import {
  ConsultationRequestService,
  ConsultationCategoryPublicService,
  type ConsultationRequest,
  type ConsultationCategory,
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

const RESPONSE_MAP: Record<number, { label: string; color: string; icon: any }> = {
  0: { label: 'لم يتم الرد', color: 'bg-gray-100 text-gray-500', icon: faTimes },
  1: { label: 'تمت الموافقة', color: 'bg-green-100 text-green-700', icon: faThumbsUp },
  2: { label: 'مؤجل', color: 'bg-amber-100 text-amber-700', icon: faCalendarPlus },
  3: { label: 'تغيير لحضوري', color: 'bg-purple-100 text-purple-700', icon: faBuilding },
};

function StatusToast({ open, type, message, onClose }: { open: boolean; type: string; message: string; onClose: () => void }) {
  useEffect(() => {
    if (open) { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[1200] flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${type === 'success' ? 'bg-sky-600' : 'bg-red-500'}`}>
      <FontAwesomeIcon icon={type === 'success' ? faCheck : faTimes} />
      {message}
    </div>
  );
}

// ===== Detail Modal =====
function DetailModal({ isOpen, request, onClose }: { isOpen: boolean; request: ConsultationRequest | null; onClose: () => void }) {
  if (!isOpen || !request) return null;
  const statusInfo = STATUS_MAP[request.status] || { label: request.statusName || '-', color: 'bg-gray-100 text-gray-700' };
  const responseInfo = RESPONSE_MAP[request.consultantResponse ?? 0] || RESPONSE_MAP[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faComments} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">تفاصيل الطلب</h2>
              <p className="text-xs text-gray-500">طلب #{request.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500">نوع الاستشارة</span>
              <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5 mt-0.5">
                <FontAwesomeIcon icon={faLayerGroup} className="text-blue-500 text-xs" />
                {request.consultationCategoryName || '-'}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500">الحالة</span>
              <p className="mt-0.5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                  <FontAwesomeIcon icon={faCircle} className="text-[6px]" />
                  {statusInfo.label}
                </span>
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500">التاريخ المفضل</span>
              <p className="text-sm text-gray-700 mt-0.5">
                {request.preferredDate ? new Date(request.preferredDate).toLocaleDateString('ar-SA') : '-'}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500">الوقت المفضل</span>
              <p className="text-sm text-gray-700 mt-0.5">{request.preferredTime || '-'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">المستشار المعيّن</span>
              <p className="text-sm text-gray-700 mt-0.5">
                {request.consultantName ? (
                  <span className="inline-flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faUserTie} className="text-sky-500 text-xs" />
                    {request.consultantName}
                  </span>
                ) : (
                  <span className="text-gray-400">لم يتم التعيين بعد</span>
                )}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500">تاريخ الطلب</span>
              <p className="text-sm text-gray-700 mt-0.5">
                {request.createdAt ? new Date(request.createdAt).toLocaleDateString('ar-SA') : '-'}
              </p>
            </div>
          </div>

          {/* Subject & Message */}
          <div>
            <span className="text-xs text-gray-500">الموضوع</span>
            <p className="text-sm font-semibold text-gray-800 mt-1">{request.subject}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">تفاصيل الطلب</span>
            <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded-xl">{request.message}</p>
          </div>

          {/* Consultant Response */}
          {request.consultantResponse != null && request.consultantResponse > 0 && (
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 space-y-3">
              <div className="text-sm font-bold text-indigo-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faUserTie} className="text-indigo-500" />
                رد المستشار
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full ${responseInfo.color}`}>
                  <FontAwesomeIcon icon={responseInfo.icon} className="text-xs" />
                  {responseInfo.label}
                </span>
              </div>
              {request.consultantNotes && (
                <div>
                  <span className="text-xs text-gray-500">ملاحظات المستشار:</span>
                  <p className="text-sm text-gray-700 mt-1">{request.consultantNotes}</p>
                </div>
              )}
              {request.consultantResponse === 2 && (request.suggestedDate || request.suggestedTime) && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-amber-500 text-xs" />
                  <span className="text-xs text-gray-500">الموعد المقترح:</span>
                  {request.suggestedDate ? new Date(request.suggestedDate).toLocaleDateString('ar-SA') : ''}
                  {request.suggestedTime ? ` | ${request.suggestedTime}` : ''}
                </div>
              )}
            </div>
          )}

          {/* Zoom Link */}
          {request.zoomLink && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faVideo} className="text-blue-600" />
                <span className="text-sm font-bold text-blue-700">رابط الاجتماع</span>
              </div>
              <a
                href={request.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <FontAwesomeIcon icon={faVideo} />
                انضم للاجتماع
              </a>
              <p className="text-xs text-blue-500 mt-2 break-all" dir="ltr">{request.zoomLink}</p>
            </div>
          )}

          {/* Admin Notes */}
          {request.adminNotes && (
            <div>
              <span className="text-xs text-gray-500">ملاحظات الإدارة</span>
              <p className="text-sm text-gray-700 mt-1 bg-yellow-50 p-3 rounded-xl border border-yellow-200">{request.adminNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClientConsultationsPage() {
  // Categories
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);
  const [catLoading, setCatLoading] = useState(true);

  // Form
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    consultationCategoryId: 0,
    subject: '',
    message: '',
    preferredDate: '',
    preferredTime: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // My requests
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Detail modal
  const [detailModal, setDetailModal] = useState(false);
  const [detailRequest, setDetailRequest] = useState<ConsultationRequest | null>(null);

  // Notif
  const [notif, setNotif] = useState({ open: false, type: 'success', message: '' });
  const showNotif = (type: string, message: string) => setNotif({ open: true, type, message });

  // Load categories
  useEffect(() => {
    ConsultationCategoryPublicService.getActive().then(res => {
      if (res.succeeded && Array.isArray(res.data)) setCategories(res.data);
    }).finally(() => setCatLoading(false));
  }, []);

  // Load my requests
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ConsultationRequestService.getMyRequests({
        pageNumber: currentPage,
        pageSize: PAGE_SIZE,
      });
      if (res.succeeded) {
        setRequests(res.data || []);
        setTotalCount(res.totalCount || 0);
      }
    } catch {
      showNotif('error', 'فشل في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consultationCategoryId) {
      showNotif('error', 'يرجى اختيار نوع الاستشارة');
      return;
    }
    setSubmitting(true);
    try {
      const res = await ConsultationRequestService.submit({
        consultationCategoryId: formData.consultationCategoryId,
        subject: formData.subject,
        message: formData.message,
        preferredDate: formData.preferredDate || undefined,
        preferredTime: formData.preferredTime || undefined,
      });
      if (res.succeeded) {
        showNotif('success', 'تم إرسال طلب الاستشارة بنجاح');
        setFormData({ consultationCategoryId: 0, subject: '', message: '', preferredDate: '', preferredTime: '' });
        setFormOpen(false);
        setCurrentPage(1);
        fetchRequests();
      } else {
        showNotif('error', res.message || 'فشل في إرسال الطلب');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || 'حدث خطأ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faComments} className="text-white text-lg" />
              </div>
              الاستشارات
            </h1>
            <p className="text-sm text-gray-500 mt-1 mr-14">طلب استشارة جديدة ومتابعة طلباتك</p>
          </div>
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
            طلب استشارة جديدة
          </button>
        </div>

        {/* Submit Form */}
        {formOpen && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <FontAwesomeIcon icon={faPaperPlane} className="text-blue-600" />
              طلب استشارة جديدة
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <FontAwesomeIcon icon={faLayerGroup} className="text-blue-500 ml-1 text-xs" />
                  نوع الاستشارة <span className="text-red-500">*</span>
                </label>
                {catLoading ? (
                  <div className="text-sm text-gray-400"><FontAwesomeIcon icon={faSpinner} className="animate-spin ml-1" /> جاري التحميل...</div>
                ) : (
                  <select
                    value={formData.consultationCategoryId}
                    onChange={e => setFormData({ ...formData, consultationCategoryId: parseInt(e.target.value) })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm cursor-pointer"
                  >
                    <option value={0}>-- اختر نوع الاستشارة --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">الموضوع <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  required
                  placeholder="عنوان مختصر للاستشارة"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">تفاصيل الطلب <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  placeholder="اشرح تفاصيل الاستشارة المطلوبة..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 ml-1 text-xs" />
                    التاريخ المفضل
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <FontAwesomeIcon icon={faClock} className="text-blue-500 ml-1 text-xs" />
                    الوقت المفضل
                  </label>
                  <input
                    type="time"
                    value={formData.preferredTime}
                    onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm"
                >
                  {submitting ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faPaperPlane} />}
                  إرسال الطلب
                </button>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Requests Table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FontAwesomeIcon icon={faComments} className="text-blue-600" />
              طلباتي
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-600">#</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-600">نوع الاستشارة</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-600">الموضوع</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-600">التاريخ المفضل</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-600">المستشار</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-600">الحالة</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-600">تاريخ الطلب</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-600">التفاصيل</th>
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
                    <td colSpan={8} className="px-5 py-12 text-center">
                      <div className="text-gray-400 text-sm">لا توجد طلبات استشارة بعد</div>
                      <button onClick={() => setFormOpen(true)} className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-semibold">
                        طلب استشارة جديدة
                      </button>
                    </td>
                  </tr>
                ) : (
                  requests.map((req, idx) => {
                    const statusInfo = STATUS_MAP[req.status] || { label: req.statusName || '-', color: 'bg-gray-100 text-gray-700' };
                    return (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => { setDetailRequest(req); setDetailModal(true); }}>
                        <td className="px-5 py-3 text-sm text-gray-600">{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                        <td className="px-5 py-3 text-sm font-medium text-gray-800">
                          <span className="inline-flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faLayerGroup} className="text-blue-500 text-xs" />
                            {req.consultationCategoryName || '-'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700 max-w-[200px] truncate">{req.subject}</td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                          {req.preferredDate ? new Date(req.preferredDate).toLocaleDateString('ar-SA') : '-'}
                          {req.preferredTime ? ` | ${req.preferredTime}` : ''}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {req.consultantName ? (
                            <span className="inline-flex items-center gap-1.5">
                              <FontAwesomeIcon icon={faUserTie} className="text-sky-500 text-xs" />
                              {req.consultantName}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">لم يتم التعيين</span>
                          )}
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
                        <td className="px-5 py-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDetailRequest(req); setDetailModal(true); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="عرض التفاصيل"
                          >
                            <FontAwesomeIcon icon={faEye} className="text-sm" />
                          </button>
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
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${currentPage === pageNum ? 'bg-blue-600 text-white shadow-md' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
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
      </div>

      {/* Modals */}
      <DetailModal isOpen={detailModal} request={detailRequest} onClose={() => setDetailModal(false)} />
      <StatusToast open={notif.open} type={notif.type} message={notif.message} onClose={() => setNotif({ ...notif, open: false })} />
    </div>
  );
}
