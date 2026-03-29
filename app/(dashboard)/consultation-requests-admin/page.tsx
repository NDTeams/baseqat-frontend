'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments, faSpinner, faCheck, faTimes, faSearch,
  faChevronLeft, faChevronRight, faTrash, faUserTie,
  faTriangleExclamation, faCircle, faLayerGroup, faEye,
  faArrowRight, faVideo, faThumbsUp, faCalendarPlus, faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import {
  ConsultationRequestAdminService,
  ConsultationCalendarAdminService,
  ConsultantAdminService,
  ConsultationCategoryAdminService,
  type ConsultationRequest,
  type Consultant,
  type ConsultationCategory,
  type ScheduleConflict,
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

interface StatusNotif { open: boolean; type: 'success' | 'error'; message: string; }

function StatusToast({ notif, onClose }: { notif: StatusNotif; onClose: () => void }) {
  useEffect(() => { if (notif.open) { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); } }, [notif.open, onClose]);
  if (!notif.open) return null;
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${notif.type === 'success' ? 'bg-sky-600' : 'bg-red-500'}`}>
      <FontAwesomeIcon icon={notif.type === 'success' ? faCheck : faTimes} />
      {notif.message}
    </div>
  );
}

// ===== Assign Consultant Modal =====
function AssignModal({
  isOpen, request, consultants, loading, onClose, onAssign,
}: {
  isOpen: boolean;
  request: ConsultationRequest | null;
  consultants: Consultant[];
  loading: boolean;
  onClose: () => void;
  onAssign: (requestId: number, consultantId: number, notes?: string) => void;
}) {
  const [selectedConsultant, setSelectedConsultant] = useState(0);
  const [notes, setNotes] = useState('');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [checkingConflict, setCheckingConflict] = useState(false);

  useEffect(() => {
    setSelectedConsultant(0);
    setNotes('');
    setConflictWarning(null);
  }, [isOpen]);

  // Check conflicts when consultant is selected
  useEffect(() => {
    if (!selectedConsultant || !request?.preferredDate) {
      setConflictWarning(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setCheckingConflict(true);
      try {
        const res = await ConsultationCalendarAdminService.checkConflict({
          consultantId: selectedConsultant,
          date: request.preferredDate!,
          time: request.preferredTime || undefined,
          excludeRequestId: request.id,
        });
        if (!cancelled && res.succeeded && res.data?.hasConflict) {
          const count = res.data.conflictingRequests.length;
          setConflictWarning(`تنبيه: هذا المستشار لديه ${count} استشارة أخرى في نفس ${request.preferredTime ? 'التاريخ والوقت' : 'التاريخ'}`);
        } else if (!cancelled) {
          setConflictWarning(null);
        }
      } catch {}
      if (!cancelled) setCheckingConflict(false);
    })();
    return () => { cancelled = true; };
  }, [selectedConsultant, request?.preferredDate, request?.preferredTime, request?.id]);

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faUserTie} className="text-sky-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">تعيين مستشار</h2>
              <p className="text-xs text-gray-500">طلب #{request.id} - {request.clientName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">المستشار <span className="text-red-500">*</span></label>
            <select
              value={selectedConsultant}
              onChange={e => setSelectedConsultant(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm cursor-pointer"
            >
              <option value={0}>-- اختر المستشار --</option>
              {consultants.map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.specialty ? `(${c.specialty})` : ''}</option>
              ))}
            </select>
          </div>

          {/* Conflict Warning */}
          {checkingConflict && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              جاري فحص التعارضات...
            </div>
          )}
          {conflictWarning && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-3 text-sm">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5" />
              <span>{conflictWarning}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">ملاحظات (اختياري)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="ملاحظات إدارية..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onAssign(request.id, selectedConsultant, notes || undefined)}
              disabled={loading || !selectedConsultant}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm"
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faCheck} />}
              تعيين
            </button>
            <button onClick={onClose} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Update Status Modal =====
function UpdateStatusModal({
  isOpen, request, loading, onClose, onUpdate,
}: {
  isOpen: boolean;
  request: ConsultationRequest | null;
  loading: boolean;
  onClose: () => void;
  onUpdate: (requestId: number, status: number, notes?: string, zoomLink?: string) => void;
}) {
  const [status, setStatus] = useState(0);
  const [notes, setNotes] = useState('');
  const [zoomLink, setZoomLink] = useState('');

  useEffect(() => {
    if (request) {
      setStatus(request.status);
      setNotes(request.adminNotes || '');
      setZoomLink(request.zoomLink || '');
    }
  }, [request, isOpen]);

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faArrowRight} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">تحديث الحالة</h2>
              <p className="text-xs text-gray-500">طلب #{request.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">الحالة <span className="text-red-500">*</span></label>
            <select
              value={status}
              onChange={e => setStatus(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm cursor-pointer"
            >
              {Object.entries(STATUS_MAP).map(([val, info]) => (
                <option key={val} value={val}>{info.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <FontAwesomeIcon icon={faVideo} className="text-blue-500 ml-1 text-xs" />
              رابط الزوم (اختياري)
            </label>
            <input
              type="url"
              value={zoomLink}
              onChange={e => setZoomLink(e.target.value)}
              placeholder="https://zoom.us/j/..."
              dir="ltr"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">ملاحظات (اختياري)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="ملاحظات إدارية..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onUpdate(request.id, status, notes || undefined, zoomLink || undefined)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm"
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faCheck} />}
              تحديث
            </button>
            <button onClick={onClose} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Consultant Response Map =====
const RESPONSE_MAP: Record<number, { label: string; color: string; icon: any }> = {
  0: { label: 'لم يتم الرد', color: 'bg-gray-100 text-gray-500', icon: faTimes },
  1: { label: 'تمت الموافقة', color: 'bg-green-100 text-green-700', icon: faThumbsUp },
  2: { label: 'مؤجل', color: 'bg-amber-100 text-amber-700', icon: faCalendarPlus },
  3: { label: 'تغيير لحضوري', color: 'bg-purple-100 text-purple-700', icon: faBuilding },
};

// ===== Detail Modal =====
function DetailModal({ isOpen, request, onClose }: { isOpen: boolean; request: ConsultationRequest | null; onClose: () => void }) {
  if (!isOpen || !request) return null;
  const statusInfo = STATUS_MAP[request.status] || { label: request.statusName || '-', color: 'bg-gray-100 text-gray-700' };
  const responseInfo = RESPONSE_MAP[request.consultantResponse ?? 0] || RESPONSE_MAP[0];
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">تفاصيل الطلب #{request.id}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-xs text-gray-500">العميل</span><p className="text-sm font-semibold text-gray-800">{request.clientName}</p></div>
            <div><span className="text-xs text-gray-500">البريد</span><p className="text-sm text-gray-700" dir="ltr">{request.clientEmail}</p></div>
            <div><span className="text-xs text-gray-500">الهاتف</span><p className="text-sm text-gray-700" dir="ltr">{request.clientPhone || '-'}</p></div>
            <div><span className="text-xs text-gray-500">نوع الاستشارة</span><p className="text-sm font-medium text-gray-800">{request.consultationCategoryName || '-'}</p></div>
            <div><span className="text-xs text-gray-500">المستشار</span><p className="text-sm text-gray-700">{request.consultantName || 'لم يتم التعيين'}</p></div>
            <div><span className="text-xs text-gray-500">الحالة</span><p><span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusInfo.color}`}>{statusInfo.label}</span></p></div>
            <div><span className="text-xs text-gray-500">التاريخ المفضل</span><p className="text-sm text-gray-700">{request.preferredDate ? new Date(request.preferredDate).toLocaleDateString('ar-SA') : '-'}</p></div>
            <div><span className="text-xs text-gray-500">الوقت المفضل</span><p className="text-sm text-gray-700">{request.preferredTime || '-'}</p></div>
          </div>
          <div>
            <span className="text-xs text-gray-500">الموضوع</span>
            <p className="text-sm font-semibold text-gray-800 mt-1">{request.subject}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">الرسالة</span>
            <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded-xl">{request.message}</p>
          </div>
          {/* Consultant Response */}
          {request.consultantResponse != null && request.consultantResponse > 0 && (
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 space-y-2">
              <div className="text-xs font-semibold text-indigo-600 mb-2">رد المستشار</div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${responseInfo.color}`}>
                  <FontAwesomeIcon icon={responseInfo.icon} className="text-xs" />
                  {responseInfo.label}
                </span>
              </div>
              {request.consultantNotes && (
                <div><span className="text-xs text-gray-500">ملاحظات المستشار:</span><p className="text-sm text-gray-700 mt-1">{request.consultantNotes}</p></div>
              )}
              {request.consultantResponse === 2 && (request.suggestedDate || request.suggestedTime) && (
                <div className="text-sm text-gray-700">
                  <span className="text-xs text-gray-500">الموعد المقترح: </span>
                  {request.suggestedDate ? new Date(request.suggestedDate).toLocaleDateString('ar-SA') : ''}
                  {request.suggestedTime ? ` | ${request.suggestedTime}` : ''}
                </div>
              )}
            </div>
          )}
          {/* Zoom Link */}
          {request.zoomLink && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faVideo} className="text-blue-600" />
                <span className="text-xs font-semibold text-blue-600">رابط الزوم</span>
              </div>
              <a href={request.zoomLink} target="_blank" rel="noopener noreferrer"
                className="text-sm text-blue-700 hover:text-blue-800 underline mt-1 block" dir="ltr">
                {request.zoomLink}
              </a>
            </div>
          )}
          {request.adminNotes && (
            <div>
              <span className="text-xs text-gray-500">ملاحظات الإدارة</span>
              <p className="text-sm text-gray-700 mt-1 bg-yellow-50 p-3 rounded-xl border border-yellow-200">{request.adminNotes}</p>
            </div>
          )}
          <div className="text-xs text-gray-400 pt-2">
            تاريخ الطلب: {request.createdAt ? new Date(request.createdAt).toLocaleDateString('ar-SA') : '-'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Delete Modal =====
function DeleteModal({ isOpen, request, loading, onClose, onConfirm }: {
  isOpen: boolean; request: ConsultationRequest | null; loading: boolean; onClose: () => void; onConfirm: () => void;
}) {
  if (!isOpen || !request) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">تأكيد الحذف</h2>
          <p className="text-gray-500 text-sm">
            هل أنت متأكد من حذف الطلب <span className="font-semibold text-gray-800">#{request.id}</span> من {request.clientName}؟
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

// ===== Main Page =====
export default function ConsultationRequestsAdminPage() {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategoryId, setFilterCategoryId] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Lookups
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);

  // Modals
  const [assignModal, setAssignModal] = useState(false);
  const [assignRequest, setAssignRequest] = useState<ConsultationRequest | null>(null);
  const [assignLoading, setAssignLoading] = useState(false);

  const [statusModal, setStatusModal] = useState(false);
  const [statusRequest, setStatusRequest] = useState<ConsultationRequest | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const [detailModal, setDetailModal] = useState(false);
  const [detailRequest, setDetailRequest] = useState<ConsultationRequest | null>(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteRequest, setDeleteRequest] = useState<ConsultationRequest | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notif
  const [notif, setNotif] = useState<StatusNotif>({ open: false, type: 'success', message: '' });
  const showNotif = (type: 'success' | 'error', message: string) => setNotif({ open: true, type, message });

  // Load lookups
  useEffect(() => {
    ConsultantAdminService.getAll().then(res => {
      if (res.succeeded && Array.isArray(res.data)) setConsultants(res.data);
    });
    ConsultationCategoryAdminService.getAll().then(res => {
      if (res.succeeded && Array.isArray(res.data)) setCategories(res.data);
    });
  }, []);

  // Fetch requests
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const filter: any = {};
      if (searchName.trim()) filter.clientName = searchName.trim();
      if (filterStatus !== 'all') filter.status = parseInt(filterStatus);
      if (filterCategoryId !== 'all') filter.consultationCategoryId = parseInt(filterCategoryId);

      const res = await ConsultationRequestAdminService.getAllPaged(
        { pageNumber: currentPage, pageSize: PAGE_SIZE },
        filter
      );
      if (res.succeeded) {
        setRequests(res.data || []);
        setTotalCount(res.totalCount || 0);
      } else {
        setRequests([]);
        setTotalCount(0);
      }
    } catch {
      showNotif('error', 'فشل في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  }, [searchName, filterStatus, filterCategoryId, currentPage]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Assign consultant
  const handleAssign = async (requestId: number, consultantId: number, notes?: string) => {
    setAssignLoading(true);
    try {
      const res = await ConsultationRequestAdminService.assignConsultant(requestId, { consultantId, adminNotes: notes });
      if (res.succeeded) {
        showNotif('success', 'تم تعيين المستشار بنجاح');
        setAssignModal(false);
        fetchRequests();
      } else {
        showNotif('error', res.message || 'فشل التعيين');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || 'حدث خطأ');
    } finally {
      setAssignLoading(false);
    }
  };

  // Update status
  const handleUpdateStatus = async (requestId: number, status: number, notes?: string, zoomLink?: string) => {
    setStatusLoading(true);
    try {
      const res = await ConsultationRequestAdminService.updateStatus(requestId, { status, adminNotes: notes, zoomLink });
      if (res.succeeded) {
        showNotif('success', 'تم تحديث الحالة بنجاح');
        setStatusModal(false);
        fetchRequests();
      } else {
        showNotif('error', res.message || 'فشل التحديث');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || 'حدث خطأ');
    } finally {
      setStatusLoading(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteRequest) return;
    setDeleteLoading(true);
    try {
      const res = await ConsultationRequestAdminService.delete(deleteRequest.id);
      if (res.succeeded) {
        showNotif('success', 'تم حذف الطلب بنجاح');
        setDeleteModal(false);
        fetchRequests();
      } else {
        showNotif('error', res.message || 'فشل الحذف');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || 'حدث خطأ');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faComments} className="text-white text-xl" />
              </div>
              إدارة طلبات الاستشارة
            </h1>
            <p className="text-sm text-gray-500 mt-1 mr-16">متابعة وتعيين المستشارين لطلبات العملاء</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">إجمالي الطلبات</div>
            <div className="text-2xl font-bold text-gray-800">{totalCount}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">بانتظار التعيين</div>
            <div className="text-2xl font-bold text-yellow-600">
              {filterStatus === '0' ? totalCount : '-'}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">قيد المعالجة</div>
            <div className="text-2xl font-bold text-indigo-600">
              {filterStatus === '2' ? totalCount : '-'}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">الصفحة</div>
            <div className="text-2xl font-bold text-blue-600">{currentPage} / {totalPages || 1}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text" placeholder="بحث باسم العميل..."
                  value={searchName}
                  onChange={e => { setSearchName(e.target.value); setCurrentPage(1); }}
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>
            <select
              value={filterCategoryId}
              onChange={e => { setFilterCategoryId(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm font-medium cursor-pointer"
            >
              <option value="all">نوع الاستشارة: الكل</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm font-medium cursor-pointer"
            >
              <option value="all">الحالة: الكل</option>
              {Object.entries(STATUS_MAP).map(([val, info]) => (
                <option key={val} value={val}>{info.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-5 py-4 text-right text-xs font-bold text-gray-600">#</th>
                  <th className="px-5 py-4 text-right text-xs font-bold text-gray-600">العميل</th>
                  <th className="px-5 py-4 text-right text-xs font-bold text-gray-600">نوع الاستشارة</th>
                  <th className="px-5 py-4 text-right text-xs font-bold text-gray-600">الموضوع</th>
                  <th className="px-5 py-4 text-right text-xs font-bold text-gray-600">التاريخ المفضل</th>
                  <th className="px-5 py-4 text-right text-xs font-bold text-gray-600">المستشار</th>
                  <th className="px-5 py-4 text-right text-xs font-bold text-gray-600">الحالة</th>
                  <th className="px-5 py-4 text-right text-xs font-bold text-gray-600">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-5 py-4"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="text-gray-400 text-sm">لا توجد طلبات</div>
                    </td>
                  </tr>
                ) : (
                  requests.map((req, idx) => {
                    const statusInfo = STATUS_MAP[req.status] || { label: req.statusName || '-', color: 'bg-gray-100 text-gray-700' };
                    return (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-sm text-gray-600">{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                        <td className="px-5 py-3">
                          <div className="text-sm font-semibold text-gray-800">{req.clientName}</div>
                          <div className="text-xs text-gray-400" dir="ltr">{req.clientEmail}</div>
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
                        </td>
                        <td className="px-5 py-3 text-sm">
                          {req.consultantName ? (
                            <span className="inline-flex items-center gap-1.5 text-gray-700">
                              <FontAwesomeIcon icon={faUserTie} className="text-sky-500 text-xs" />
                              {req.consultantName}
                            </span>
                          ) : (
                            <span className="text-yellow-600 text-xs font-medium">لم يتم التعيين</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                            <FontAwesomeIcon icon={faCircle} className="text-[6px]" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => { setDetailRequest(req); setDetailModal(true); }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                              title="التفاصيل"
                            >
                              <FontAwesomeIcon icon={faEye} className="text-sm" />
                            </button>
                            {!req.consultantId && (
                              <button
                                onClick={() => { setAssignRequest(req); setAssignModal(true); }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                                title="تعيين مستشار"
                              >
                                <FontAwesomeIcon icon={faUserTie} className="text-sm" />
                              </button>
                            )}
                            <button
                              onClick={() => { setStatusRequest(req); setStatusModal(true); }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="تحديث الحالة"
                            >
                              <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                            </button>
                            <button
                              onClick={() => { setDeleteRequest(req); setDeleteModal(true); }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
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
      </div>

      {/* Modals */}
      <AssignModal isOpen={assignModal} request={assignRequest} consultants={consultants} loading={assignLoading}
        onClose={() => setAssignModal(false)} onAssign={handleAssign} />
      <UpdateStatusModal isOpen={statusModal} request={statusRequest} loading={statusLoading}
        onClose={() => setStatusModal(false)} onUpdate={handleUpdateStatus} />
      <DetailModal isOpen={detailModal} request={detailRequest} onClose={() => setDetailModal(false)} />
      <DeleteModal isOpen={deleteModal} request={deleteRequest} loading={deleteLoading}
        onClose={() => setDeleteModal(false)} onConfirm={handleDelete} />
      <StatusToast notif={notif} onClose={() => setNotif({ ...notif, open: false })} />
    </div>
  );
}
