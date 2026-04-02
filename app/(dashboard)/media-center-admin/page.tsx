'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSearch,
  faEdit,
  faTrash,
  faEyeSlash,
  faCheck,
  faTimes,
  faSpinner,
  faTriangleExclamation,
  faFilter,
  faChevronLeft,
  faChevronRight,
  faTrashRestore,
  faImage,
  faUpload,
  faNewspaper,
} from '@fortawesome/free-solid-svg-icons';
import {
  MediaCenterAdminService,
  type MediaItem,
  type MediaCenterFilter,
} from '@/services/media-center/page';
import { getFileUrl } from '@/lib/config';

// ===========================
// Types
// ===========================
interface FormData {
  title: string;
  description: string;
  mediaType: number; // 0=Gallery, 1=Article, 2=Event
  category: string;
  author: string;
  content: string;
  readingTimeMinutes: number;
  eventDate: string;
  eventEndDate: string;
  eventTime: string;
  eventLocation: string;
  videoUrl: string;
  isActive: boolean;
}

interface StatusNotif {
  open: boolean;
  type: 'success' | 'error';
  message: string;
}

const EMPTY_FORM: FormData = {
  title: '',
  description: '',
  mediaType: 0,
  category: '',
  author: '',
  content: '',
  readingTimeMinutes: 5,
  eventDate: '',
  eventEndDate: '',
  eventTime: '',
  eventLocation: '',
  videoUrl: '',
  isActive: true,
};

const PAGE_SIZE = 10;

// ===========================
// Status Badge
// ===========================
function StatusBadge({ isActive, isDeleted }: { isActive: boolean; isDeleted?: boolean }) {
  if (isDeleted) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        محذوف
      </span>
    );
  }

  return isActive ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
      نشط
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      مخفي
    </span>
  );
}

// ===========================
// Media Type Badge
// ===========================
function MediaTypeBadge({ mediaType }: { mediaType: number }) {
  if (mediaType === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
        <FontAwesomeIcon icon={faImage} className="text-[10px]" />
        صور
      </span>
    );
  }
  if (mediaType === 1) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
        <FontAwesomeIcon icon={faNewspaper} className="text-[10px]" />
        مقالات
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
      <FontAwesomeIcon icon={faNewspaper} className="text-[10px]" />
      فعاليات
    </span>
  );
}

// ===========================
// Skeleton Row
// ===========================
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 w-8 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-200 rounded-full" /></td>
      <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
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
// Media Form Modal (Add/Edit)
// ===========================
function MediaFormModal({
  isOpen,
  isEditMode,
  initialData,
  loading,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  isEditMode: boolean;
  initialData: FormData;
  loading: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
}) {
  const [form, setForm] = useState<FormData>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faNewspaper} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              {isEditMode ? 'تعديل العنصر' : 'إضافة عنصر جديد'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                العنوان <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="مثال: معرض الصور السنوي"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                الوصف <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={3}
                placeholder="وصف مختصر..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                التصنيف
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="مثال: أخبار، إنجازات"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            {/* Media Type */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                نوع المحتوى <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                {[
                  { label: 'صور', value: 0 },
                  { label: 'مقالات', value: 1 },
                  { label: 'فعاليات', value: 2 },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all text-sm select-none ${
                      form.mediaType === opt.value
                        ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mediaType"
                      value={opt.value}
                      checked={form.mediaType === opt.value}
                      onChange={() => setForm({ ...form, mediaType: opt.value })}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Article-specific fields */}
            {form.mediaType === 1 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    الكاتب
                  </label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="اسم الكاتب"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    وقت القراءة (دقائق)
                  </label>
                  <input
                    type="number"
                    value={form.readingTimeMinutes}
                    onChange={(e) => setForm({ ...form, readingTimeMinutes: Number(e.target.value) })}
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    المحتوى
                  </label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={6}
                    placeholder="محتوى المقال..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm resize-none"
                  />
                </div>
              </>
            )}

            {/* Event-specific fields */}
            {form.mediaType === 2 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    تاريخ بداية الفعالية
                  </label>
                  <input
                    type="date"
                    value={form.eventDate ? form.eventDate.split('T')[0] : ''}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    تاريخ نهاية الفعالية
                  </label>
                  <input
                    type="date"
                    value={form.eventEndDate ? form.eventEndDate.split('T')[0] : ''}
                    onChange={(e) => setForm({ ...form, eventEndDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    وقت الفعالية
                  </label>
                  <input
                    type="time"
                    value={form.eventTime || ''}
                    onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    موقع الفعالية
                  </label>
                  <input
                    type="text"
                    value={form.eventLocation}
                    onChange={(e) => setForm({ ...form, eventLocation: e.target.value })}
                    placeholder="مثال: قاعة المؤتمرات - الرياض"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
              </>
            )}
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              رابط يوتيوب (اختياري)
            </label>
            <input
              type="url"
              dir="ltr"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">أدخل رابط يوتيوب لعرض الفيديو في صفحة التفاصيل</p>
          </div>

          {/* isActive Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-700">حالة العنصر</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {form.isActive ? 'سيظهر العنصر للمستخدمين' : 'سيكون العنصر مخفي'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                form.isActive ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  form.isActive ? 'translate-x-1' : 'translate-x-6'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-dashboardBg hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faCheck} />
              )}
              {isEditMode ? 'حفظ التعديلات' : 'إضافة العنصر'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===========================
// Delete Confirmation Modal
// ===========================
function DeleteModal({
  isOpen,
  item,
  loading,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  item: MediaItem | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen || !item) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">تأكيد الحذف</h2>
          <p className="text-gray-500 text-sm">
            هل أنت متأكد من حذف العنصر{' '}
            <span className="font-semibold text-gray-800">&quot;{item.title}&quot;</span> نهائيا؟
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faTrash} />}
              حذف نهائي
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
// Restore Modal
// ===========================
function RestoreModal({
  isOpen,
  item,
  loading,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  item: MediaItem | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen || !item) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faTrashRestore} className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">تأكيد الاسترجاع</h2>
          <p className="text-gray-500 text-sm">
            هل أنت متأكد من استرجاع العنصر{' '}
            <span className="font-semibold text-gray-800">&quot;{item.title}&quot;</span>؟
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faTrashRestore} />}
              استرجاع
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
export default function MediaCenterAdminPage() {
  // --- Data ---
  const [items, setItems] = useState<MediaItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<{ status: number; message: string } | null>(null);

  // --- Filters ---
  const [searchTitle, setSearchTitle] = useState('');
  const [filterType, setFilterType] = useState<'all' | '0' | '1' | '2'>('all');
  const [filterActive, setFilterActive] = useState<'all' | 'true' | 'false' | 'deleted'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // --- Modals ---
  const [formModal, setFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [restoreModal, setRestoreModal] = useState(false);
  const [itemToRestore, setItemToRestore] = useState<MediaItem | null>(null);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [imageLoadingId, setImageLoadingId] = useState<number | null>(null);

  // --- Notif ---
  const [notif, setNotif] = useState<StatusNotif>({ open: false, type: 'success', message: '' });

  const showNotif = (type: 'success' | 'error', message: string) =>
    setNotif({ open: true, type, message });

  // --- Fetch ---
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      if (filterActive === 'deleted') {
        const res = await MediaCenterAdminService.getDeleted();
        if (res.succeeded) {
          let filtered = res.data ?? [];
          if (searchTitle.trim()) {
            filtered = filtered.filter((item) =>
              item.title.toLowerCase().includes(searchTitle.trim().toLowerCase())
            );
          }
          if (filterType !== 'all') {
            filtered = filtered.filter((item) => item.mediaType === Number(filterType));
          }
          setItems(filtered);
          setTotalCount(filtered.length);
        } else {
          showNotif('error', res.message || 'فشل في تحميل البيانات');
        }
      } else {
        const filter: MediaCenterFilter = {};
        if (searchTitle.trim()) filter.title = searchTitle.trim();
        if (filterType !== 'all') filter.mediaType = Number(filterType);
        if (filterActive !== 'all') {
          filter.isActive = filterActive;
        }

        const res = await MediaCenterAdminService.getAllPaged(
          { pageNumber: currentPage, pageSize: PAGE_SIZE },
          filter
        );

        if (res.succeeded) {
          setItems(res.data ?? []);
          setTotalCount(res.totalCount ?? 0);
        } else {
          showNotif('error', res.message || 'فشل في تحميل البيانات');
        }
      }
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message || 'حدث خطأ غير متوقع';
      setApiError({ status: status ?? 0, message: msg });
    } finally {
      setLoading(false);
    }
  }, [searchTitle, filterType, filterActive, currentPage]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // --- Add ---
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormModal(true);
  };

  // --- Edit ---
  const handleOpenEdit = (item: MediaItem) => {
    setIsEditMode(true);
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description || '',
      mediaType: item.mediaType,
      category: item.category || '',
      author: item.author || '',
      content: item.content || '',
      readingTimeMinutes: item.readingTimeMinutes || 5,
      eventDate: item.eventDate || '',
      eventEndDate: item.eventEndDate || '',
      eventTime: item.eventTime || '',
      eventLocation: item.eventLocation || '',
      videoUrl: item.videoUrl || '',
      isActive: item.isActive,
    });
    setFormModal(true);
  };

  // --- Save (Add/Edit) ---
  const handleSave = async (data: FormData) => {
    setFormLoading(true);
    try {
      let res;
      if (isEditMode && editingId) {
        res = await MediaCenterAdminService.update(editingId, data);
      } else {
        res = await MediaCenterAdminService.add(data);
      }
      if (res.succeeded) {
        showNotif('success', isEditMode ? 'تم تعديل العنصر بنجاح' : 'تم إضافة العنصر بنجاح');
        setFormModal(false);
        fetchItems();
      } else {
        showNotif('error', res.message || 'فشلت العملية');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
    } finally {
      setFormLoading(false);
    }
  };

  // --- Toggle Visibility ---
  const handleToggleVisibility = async (item: MediaItem) => {
    setActionLoadingId(item.id);
    try {
      const res = await MediaCenterAdminService.softDelete(item.id);
      if (res.succeeded) {
        showNotif('success', 'تم تغيير حالة العنصر بنجاح');
        fetchItems();
      } else {
        showNotif('error', res.message || 'فشلت العملية');
      }
    } catch (err: any) {
      showNotif('error', err.message || 'حدث خطأ');
    } finally {
      setActionLoadingId(null);
    }
  };

  // --- Delete ---
  const handleOpenDelete = (item: MediaItem) => {
    setItemToDelete(item);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await MediaCenterAdminService.delete(itemToDelete.id);
      if (res.succeeded) {
        showNotif('success', 'تم حذف العنصر بنجاح');
        setDeleteModal(false);
        setItemToDelete(null);
        fetchItems();
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

  // --- Restore ---
  const handleOpenRestore = (item: MediaItem) => {
    setItemToRestore(item);
    setRestoreModal(true);
  };

  const confirmRestore = async () => {
    if (!itemToRestore) return;
    setRestoreLoading(true);
    try {
      const res = await MediaCenterAdminService.restore(itemToRestore.id);
      if (res.succeeded) {
        showNotif('success', 'تم استرجاع العنصر بنجاح');
        setRestoreModal(false);
        setItemToRestore(null);
        fetchItems();
      } else {
        showNotif('error', res.message || 'فشلت العملية');
        setRestoreModal(false);
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
      setRestoreModal(false);
    } finally {
      setRestoreLoading(false);
    }
  };

  // --- Upload Image ---
  const handleUploadImage = async (item: MediaItem) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImageLoadingId(item.id);
      try {
        const res = await MediaCenterAdminService.uploadImage(item.id, file);
        if (res.succeeded) {
          showNotif('success', 'تم رفع الصورة بنجاح');
          fetchItems();
        } else {
          showNotif('error', res.message || 'فشل رفع الصورة');
        }
      } catch (err: any) {
        showNotif('error', err.message || 'حدث خطأ أثناء رفع الصورة');
      } finally {
        setImageLoadingId(null);
      }
    };
    input.click();
  };

  // --- Search ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchItems();
  };

  return (
    <div className="p-4 sm:p-6" dir="rtl">
      {/* ===== Page Header ===== */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">المركز الإعلامي</h1>
          <p className="text-gray-500 text-sm mt-1">
            إدارة الصور والمقالات والفعاليات
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-dashboardBg hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          <FontAwesomeIcon icon={faPlus} />
          إضافة عنصر جديد
        </button>
      </div>

      {/* ===== Stats Bar ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {filterActive === 'deleted' ? (
          <div className="rounded-xl border px-5 py-4 bg-red-50 text-red-700 border-red-200 col-span-full">
            <p className="text-2xl font-bold">{totalCount}</p>
            <p className="text-xs font-medium mt-0.5">إجمالي العناصر المحذوفة</p>
          </div>
        ) : (
          [
            { label: 'إجمالي العناصر', value: totalCount, color: 'bg-blue-50 text-blue-700 border-blue-200' },
            {
              label: 'صور',
              value: items.filter((item) => item.mediaType === 0).length,
              color: 'bg-blue-50 text-blue-700 border-blue-200',
            },
            {
              label: 'مقالات',
              value: items.filter((item) => item.mediaType === 1).length,
              color: 'bg-blue-50 text-blue-700 border-blue-200',
            },
            {
              label: 'فعاليات',
              value: items.filter((item) => item.mediaType === 2).length,
              color: 'bg-amber-50 text-amber-700 border-amber-200',
            },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl border px-5 py-4 ${s.color}`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium mt-0.5">{s.label}</p>
            </div>
          ))
        )}
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
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="ابحث بالعنوان..."
            className="w-full pr-9 pl-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>

        <div className="relative">
          <FontAwesomeIcon
            icon={faFilter}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
          />
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value as 'all' | '0' | '1' | '2'); setCurrentPage(1); }}
            className="pr-9 pl-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white appearance-none min-w-36"
          >
            <option value="all">الكل</option>
            <option value="0">صور</option>
            <option value="1">مقالات</option>
            <option value="2">فعاليات</option>
          </select>
        </div>

        <div className="relative">
          <FontAwesomeIcon
            icon={faFilter}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
          />
          <select
            value={filterActive}
            onChange={(e) => { setFilterActive(e.target.value as 'all' | 'true' | 'false' | 'deleted'); setCurrentPage(1); }}
            className="pr-9 pl-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white appearance-none min-w-36"
          >
            <option value="all">جميع الحالات</option>
            <option value="true">نشط فقط</option>
            <option value="false">مخفي فقط</option>
            <option value="deleted">محذوف</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-dashboardBg hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          بحث
        </button>
      </form>

      {/* ===== API Error Block ===== */}
      {apiError && (
        <div className={`rounded-2xl border p-6 mb-6 flex items-start gap-4 ${
          apiError.status === 401 ? 'bg-red-50 border-red-200' :
          apiError.status === 403 ? 'bg-orange-50 border-orange-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl ${
            apiError.status === 401 ? 'bg-red-100' :
            apiError.status === 403 ? 'bg-orange-100' : 'bg-gray-100'
          }`}>
            <FontAwesomeIcon icon={faTriangleExclamation} className={
              apiError.status === 401 ? 'text-red-500' :
              apiError.status === 403 ? 'text-orange-500' : 'text-gray-500'
            } />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                apiError.status === 401 ? 'bg-red-200 text-red-800' :
                apiError.status === 403 ? 'bg-orange-200 text-orange-800' :
                'bg-gray-200 text-gray-700'
              }`}>HTTP {apiError.status}</span>
              <p className="font-bold text-gray-800">
                {apiError.status === 401 ? 'انتهت صلاحية الجلسة' :
                 apiError.status === 403 ? 'ليس لديك صلاحية الوصول' :
                 'خطأ في الاتصال'}
              </p>
            </div>
            <p className="text-sm text-gray-600">{apiError.message}</p>
            <div className="flex gap-2 mt-3">
              {apiError.status === 401 && (
                <a href="/login" className="px-4 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600">
                  تسجيل الدخول مجددا
                </a>
              )}
              <button onClick={fetchItems} className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Table ===== */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3.5 text-right font-semibold text-gray-600">#</th>
                <th className="px-6 py-3.5 text-right font-semibold text-gray-600">العنوان</th>
                <th className="px-6 py-3.5 text-right font-semibold text-gray-600">النوع</th>
                <th className="px-6 py-3.5 text-right font-semibold text-gray-600">التصنيف</th>
                <th className="px-6 py-3.5 text-right font-semibold text-gray-600">الحالة</th>
                <th className="px-6 py-3.5 text-right font-semibold text-gray-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <FontAwesomeIcon icon={faNewspaper} className="text-4xl" />
                      <p className="font-medium">لا توجد عناصر مطابقة للبحث</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 text-gray-400 font-medium">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="relative w-12 h-12 rounded-lg overflow-hidden cursor-pointer group/img flex-shrink-0"
                          onClick={() => filterActive !== 'deleted' && handleUploadImage(item)}
                          title="انقر لتغيير الصورة"
                        >
                          {item.imageUrl ? (
                            <img
                              src={getFileUrl(item.imageUrl)}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                              <FontAwesomeIcon icon={faImage} className="text-lg" />
                            </div>
                          )}
                          {filterActive !== 'deleted' && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                              {imageLoadingId === item.id ? (
                                <FontAwesomeIcon icon={faSpinner} className="text-white text-sm animate-spin" />
                              ) : (
                                <FontAwesomeIcon icon={faUpload} className="text-white text-sm" />
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 block">{item.title}</span>
                          {item.description && (
                            <span className="text-xs text-gray-400 line-clamp-1">{item.description}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <MediaTypeBadge mediaType={item.mediaType} />
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.category || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge isActive={item.isActive} isDeleted={filterActive === 'deleted'} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {filterActive === 'deleted' ? (
                          <button
                            onClick={() => handleOpenRestore(item)}
                            title="استرجاع العنصر"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-medium"
                          >
                            <FontAwesomeIcon icon={faTrashRestore} />
                            استرجاع
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              title="تعديل"
                              className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                            >
                              <FontAwesomeIcon icon={faEdit} className="text-xs" />
                            </button>
                            <button
                              onClick={() => handleUploadImage(item)}
                              disabled={imageLoadingId === item.id}
                              title="رفع صورة"
                              className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                              {imageLoadingId === item.id ? (
                                <FontAwesomeIcon icon={faSpinner} className="text-xs animate-spin" />
                              ) : (
                                <FontAwesomeIcon icon={faUpload} className="text-xs" />
                              )}
                            </button>
                            <button
                              onClick={() => handleToggleVisibility(item)}
                              disabled={actionLoadingId === item.id}
                              title={item.isActive ? 'إخفاء' : 'إظهار'}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 ${
                                item.isActive
                                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                              }`}
                            >
                              {actionLoadingId === item.id ? (
                                <FontAwesomeIcon icon={faSpinner} className="text-xs animate-spin" />
                              ) : (
                                <FontAwesomeIcon
                                  icon={item.isActive ? faEyeSlash : faCheck}
                                  className="text-xs"
                                />
                              )}
                            </button>
                            <button
                              onClick={() => handleOpenDelete(item)}
                              title="حذف"
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-xs" />
                            </button>
                          </>
                        )}
                      </div>
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
              من <span className="font-semibold text-gray-700">{totalCount}</span> عنصر
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
                    <span key={p} className="text-gray-400 text-sm px-1">...</span>
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
      <MediaFormModal
        isOpen={formModal}
        isEditMode={isEditMode}
        initialData={formData}
        loading={formLoading}
        onClose={() => setFormModal(false)}
        onSave={handleSave}
      />

      <DeleteModal
        isOpen={deleteModal}
        item={itemToDelete}
        loading={deleteLoading}
        onClose={() => { setDeleteModal(false); setItemToDelete(null); }}
        onConfirm={confirmDelete}
      />

      <RestoreModal
        isOpen={restoreModal}
        item={itemToRestore}
        loading={restoreLoading}
        onClose={() => { setRestoreModal(false); setItemToRestore(null); }}
        onConfirm={confirmRestore}
      />

      {/* ===== Toast ===== */}
      <StatusToast notif={notif} onClose={() => setNotif({ ...notif, open: false })} />
    </div>
  );
}
