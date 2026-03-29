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
  faLayerGroup,
  faFilter,
  faChevronLeft,
  faChevronRight,
  faTrashRestore,
} from '@fortawesome/free-solid-svg-icons';
import {
  CourseCategoryAdminService,
  type CourseCategory,
} from '@/services/courses/page';

// ===========================
// Types
// ===========================
interface FormData {
  name: string;
  description: string;
  isActive: boolean;
}

interface StatusNotif {
  open: boolean;
  type: 'success' | 'error';
  message: string;
}

const EMPTY_FORM: FormData = { name: '', description: '', isActive: true };
const PAGE_SIZE = 10;

// ===========================
// Status Badge
// ===========================
function StatusBadge({ isActive, isDeleted }: { isActive: boolean; isDeleted?: boolean }) {
  if (isDeleted) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        محذوفة
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
// Skeleton Row
// ===========================
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 w-8 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-56 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-200 rounded-full" /></td>
      <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
    </tr>
  );
}

// ===========================
// Add / Edit Modal
// ===========================
function CategoryFormModal({
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faLayerGroup} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              {isEditMode ? 'تعديل القسم' : 'إضافة قسم جديد'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              اسم القسم <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="مثال: ريادة الأعمال"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              وصف القسم
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="وصف مختصر للقسم..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm resize-none"
            />
          </div>

          {/* isActive Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-700">حالة القسم</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {form.isActive ? 'سيظهر القسم للمستخدمين' : 'سيكون القسم مخفياً'}
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
              {isEditMode ? 'حفظ التعديلات' : 'إضافة القسم'}
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
  category,
  loading,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  category: CourseCategory | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen || !category) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">تأكيد الحذف</h2>
          <p className="text-gray-500 text-sm">
            هل أنت متأكد من حذف القسم{' '}
            <span className="font-semibold text-gray-800">"{category.name}"</span> نهائياً؟
            <br />
            <span className="text-red-500 text-xs mt-1 block">
              ⚠️ لا يمكن حذف القسم إذا كانت هناك دورات مرتبطة به
            </span>
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
// Restore Confirmation Modal
// ===========================
function RestoreModal({
  isOpen,
  category,
  loading,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  category: CourseCategory | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen || !category) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faTrashRestore} className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">تأكيد الاسترجاع</h2>
          <p className="text-gray-500 text-sm">
            هل أنت متأكد من استرجاع القسم{' '}
            <span className="font-semibold text-gray-800">"{category.name}"</span>؟
            <br />
            <span className="text-blue-600 text-xs mt-1 block">
              ✓ سيتم إعادة القسم إلى القائمة الرئيسية
            </span>
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
// Main Page
// ===========================
export default function CourseCategoriesPage() {
  // --- Data ---
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<{ status: number; message: string } | null>(null);

  // --- Filters ---
  const [searchName, setSearchName] = useState('');
  const [filterActive, setFilterActive] = useState<string>('all'); // 'all' | 'true' | 'false' | 'deleted'
  const [currentPage, setCurrentPage] = useState(1);

  // --- Modals ---
  const [formModal, setFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CourseCategory | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [restoreModal, setRestoreModal] = useState(false);
  const [categoryToRestore, setCategoryToRestore] = useState<CourseCategory | null>(null);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // --- Notif ---
  const [notif, setNotif] = useState<StatusNotif>({ open: false, type: 'success', message: '' });

  const showNotif = (type: 'success' | 'error', message: string) =>
    setNotif({ open: true, type, message });

  // --- Fetch ---
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      // إذا كان الفلتر = deleted، نستخدم endpoint مختلف
      if (filterActive === 'deleted') {
        const res = await CourseCategoryAdminService.getDeleted();
        if (res.succeeded) {
          // تصفية حسب البحث إذا وُجد
          let filtered = res.data ?? [];
          if (searchName.trim()) {
            filtered = filtered.filter((cat) =>
              cat.name.toLowerCase().includes(searchName.trim().toLowerCase())
            );
          }
          setCategories(filtered);
          setTotalCount(filtered.length);
        } else {
          showNotif('error', res.message || 'فشل في تحميل البيانات');
        }
      } else {
        // منطق عادي للفلتر
        const filter: Record<string, any> = {};
        if (searchName.trim()) filter.name = searchName.trim();
        if (filterActive !== 'all') {
          // إرسال القيمة كـ string: "true" أو "false"
          filter.isActive = filterActive;
        }

        const res = await CourseCategoryAdminService.getAllPaged(
          { pageNumber: currentPage, pageSize: PAGE_SIZE },
          filter
        );

        if (res.succeeded) {
          setCategories(res.data ?? []);
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
  }, [searchName, filterActive, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // --- Add ---
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormModal(true);
  };

  // --- Edit ---
  const handleOpenEdit = (cat: CourseCategory) => {
    setIsEditMode(true);
    setEditingId(cat.id);
    setFormData({ name: cat.name, description: cat.description, isActive: cat.isActive });
    setFormModal(true);
  };

  // --- Save (Add/Edit) ---
  const handleSave = async (data: FormData) => {
    setFormLoading(true);
    try {
      let res;
      if (isEditMode && editingId) {
        res = await CourseCategoryAdminService.update(editingId, data);
      } else {
        res = await CourseCategoryAdminService.add(data);
      }
      if (res.succeeded) {
        showNotif('success', isEditMode ? 'تم تعديل القسم بنجاح' : 'تم إضافة القسم بنجاح');
        setFormModal(false);
        fetchCategories();
      } else {
        showNotif('error', res.message || 'فشلت العملية');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
    } finally {
      setFormLoading(false);
    }
  };

  // --- Soft Delete (Toggle Visibility) ---
  const handleToggleVisibility = async (cat: CourseCategory) => {
    setActionLoadingId(cat.id);
    try {
      const res = await CourseCategoryAdminService.softDelete(cat.id);
      if (res.succeeded) {
        showNotif('success', 'تم تغيير حالة القسم بنجاح');
        fetchCategories();
      } else {
        showNotif('error', res.message || 'فشلت العملية');
      }
    } catch (err: any) {
      showNotif('error', err.message || 'حدث خطأ');
    } finally {
      setActionLoadingId(null);
    }
  };

  // --- Hard Delete ---
  const handleOpenDelete = (cat: CourseCategory) => {
    setCategoryToDelete(cat);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await CourseCategoryAdminService.delete(categoryToDelete.id);
      if (res.succeeded) {
        showNotif('success', 'تم حذف القسم بنجاح');
        setDeleteModal(false);
        setCategoryToDelete(null);
        fetchCategories();
      } else {
        showNotif('error', res.message || 'فشل الحذف');
        setDeleteModal(false);
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ أثناء الحذف');
      setDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // --- Restore ---
  const handleOpenRestore = (cat: CourseCategory) => {
    setCategoryToRestore(cat);
    setRestoreModal(true);
  };

  const confirmRestore = async () => {
    if (!categoryToRestore) return;
    setRestoreLoading(true);
    try {
      const res = await CourseCategoryAdminService.restore(categoryToRestore.id);
      if (res.succeeded) {
        showNotif('success', 'تم استرجاع القسم بنجاح');
        setRestoreModal(false);
        setCategoryToRestore(null);
        fetchCategories();
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

  // --- Search ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCategories();
  };

  return (
    <div className="p-4 sm:p-6" dir="rtl">
      {/* ===== Page Header ===== */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">أقسام الدورات</h1>
          <p className="text-gray-500 text-sm mt-1">
            إدارة أقسام الدورات التدريبية — إضافة وتعديل وإخفاء وحذف
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-dashboardBg hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          <FontAwesomeIcon icon={faPlus} />
          إضافة قسم جديد
        </button>
      </div>

      {/* ===== Stats Bar ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {filterActive === 'deleted' ? (
          // إحصائيات العناصر المحذوفة فقط
          <div className="rounded-xl border px-5 py-4 bg-red-50 text-red-700 border-red-200 col-span-full">
            <p className="text-2xl font-bold">{totalCount}</p>
            <p className="text-xs font-medium mt-0.5">إجمالي الأقسام المحذوفة</p>
          </div>
        ) : (
          // إحصائيات العناصر العادية
          [
            { label: 'إجمالي الأقسام', value: totalCount, color: 'bg-blue-50 text-blue-700 border-blue-200' },
            {
              label: 'الأقسام النشطة',
              value: categories.filter((c) => c.isActive).length,
              color: 'bg-blue-50 text-blue-700 border-blue-200',
            },
            {
              label: 'الأقسام المخفية',
              value: categories.filter((c) => !c.isActive).length,
              color: 'bg-gray-50 text-gray-600 border-gray-200',
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
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="ابحث باسم القسم..."
            className="w-full pr-9 pl-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>

        <div className="relative">
          <FontAwesomeIcon
            icon={faFilter}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
          />
          <select
            value={filterActive}
            onChange={(e) => { setFilterActive(e.target.value); setCurrentPage(1); }}
            className="pr-9 pl-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white appearance-none min-w-36"
          >
            <option value="all">جميع الحالات</option>
            <option value="true">نشط فقط</option>
            <option value="false">مخفي فقط</option>
            <option value="deleted">محذوفة</option>
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
                  تسجيل الدخول مجدداً
                </a>
              )}
              <button onClick={fetchCategories} className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                إعادة المحاولة
              </button>
              <a href="/auth-test" className="px-4 py-1.5 bg-white border border-blue-200 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50">
                تشخيص المشكلة
              </a>
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
                <th className="px-6 py-3.5 text-right font-semibold text-gray-600">اسم القسم</th>
                <th className="px-6 py-3.5 text-right font-semibold text-gray-600">الوصف</th>
                <th className="px-6 py-3.5 text-right font-semibold text-gray-600">الحالة</th>
                <th className="px-6 py-3.5 text-right font-semibold text-gray-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <FontAwesomeIcon icon={faLayerGroup} className="text-4xl" />
                      <p className="font-medium">لا توجد أقسام مطابقة للبحث</p>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat, index) => (
                  <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* # */}
                    <td className="px-6 py-4 text-gray-400 font-medium">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">{cat.name}</span>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 text-gray-500 max-w-xs">
                      <span className="line-clamp-1">{cat.description || '—'}</span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge isActive={cat.isActive} isDeleted={filterActive === 'deleted'} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {filterActive === 'deleted' ? (
                          // زر استرجاع للعناصر المحذوفة
                          <button
                            onClick={() => handleOpenRestore(cat)}
                            title="استرجاع القسم"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-medium"
                          >
                            <FontAwesomeIcon icon={faTrashRestore} />
                            استرجاع
                          </button>
                        ) : (
                          <>
                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEdit(cat)}
                              title="تعديل"
                              className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                            >
                              <FontAwesomeIcon icon={faEdit} className="text-xs" />
                            </button>

                            {/* Toggle Visibility */}
                            <button
                              onClick={() => handleToggleVisibility(cat)}
                              disabled={actionLoadingId === cat.id}
                              title={cat.isActive ? 'إخفاء القسم' : 'إظهار القسم'}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 ${
                                cat.isActive
                                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                              }`}
                            >
                              {actionLoadingId === cat.id ? (
                                <FontAwesomeIcon icon={faSpinner} className="text-xs animate-spin" />
                              ) : (
                                <FontAwesomeIcon
                                  icon={cat.isActive ? faEyeSlash : faCheck}
                                  className="text-xs"
                                />
                              )}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleOpenDelete(cat)}
                              title="حذف نهائي"
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
              من <span className="font-semibold text-gray-700">{totalCount}</span> قسم
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
      <CategoryFormModal
        isOpen={formModal}
        isEditMode={isEditMode}
        initialData={formData}
        loading={formLoading}
        onClose={() => setFormModal(false)}
        onSave={handleSave}
      />

      <DeleteModal
        isOpen={deleteModal}
        category={categoryToDelete}
        loading={deleteLoading}
        onClose={() => { setDeleteModal(false); setCategoryToDelete(null); }}
        onConfirm={confirmDelete}
      />

      <RestoreModal
        isOpen={restoreModal}
        category={categoryToRestore}
        loading={restoreLoading}
        onClose={() => { setRestoreModal(false); setCategoryToRestore(null); }}
        onConfirm={confirmRestore}
      />

      {/* ===== Toast ===== */}
      <StatusToast notif={notif} onClose={() => setNotif({ ...notif, open: false })} />
    </div>
  );
}
