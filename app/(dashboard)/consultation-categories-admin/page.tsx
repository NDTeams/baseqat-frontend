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
  ConsultationCategoryAdminService,
  type ConsultationCategory,
} from '@/services/consultants/page';
import ModalMessage from '@/components/modal-message';

// ===========================
// Types
// ===========================
interface FormData {
  name: string;
  description: string;
}

interface StatusNotif {
  open: boolean;
  type: 'success' | 'error';
  message: string;
}

const EMPTY_FORM: FormData = { name: '', description: '' };
const PAGE_SIZE = 10;

// ===========================
// Status Toggle
// ===========================
function StatusToggle({ isActive, loading, onToggle }: { isActive: boolean; loading: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      disabled={loading}
      className="group relative w-[52px] h-[28px] rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50 cursor-pointer"
      style={{ background: isActive ? 'linear-gradient(135deg, #14b8a6, #0d9488)' : 'linear-gradient(135deg, #e5e7eb, #d1d5db)' }}
      title={isActive ? 'اضغط لإلغاء التفعيل' : 'اضغط للتفعيل'}
    >
      <span
        className={`absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${
          isActive ? 'right-[3px] group-hover:right-[5px]' : 'right-[27px] group-hover:right-[25px]'
        }`}
      >
        {loading ? (
          <FontAwesomeIcon icon={faSpinner} className={`animate-spin text-[9px] ${isActive ? 'text-sky-500' : 'text-gray-400'}`} />
        ) : isActive ? (
          <FontAwesomeIcon icon={faCheck} className="text-[8px] text-sky-500" />
        ) : (
          <FontAwesomeIcon icon={faTimes} className="text-[8px] text-gray-400" />
        )}
      </span>
    </button>
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
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faLayerGroup} className="text-sky-600" />
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
              placeholder="مثال: استشارات إدارية"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm"
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
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
// Soft Delete Confirmation Modal
// ===========================
function SoftDeleteModal({
  isOpen,
  category,
  loading,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  category: ConsultationCategory | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen || !category) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faEyeSlash} className="text-amber-500 text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">تأكيد الإخفاء</h2>
          <p className="text-gray-500 text-sm">
            هل أنت متأكد من إخفاء القسم{' '}
            <span className="font-semibold text-gray-800">&quot;{category.name}&quot;</span>؟
            <br />
            <span className="text-amber-600 text-xs mt-1 block">
              سيتم نقل القسم إلى المحذوفات ويمكن استرجاعه لاحقاً
            </span>
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faEyeSlash} />}
              إخفاء
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
  category: ConsultationCategory | null;
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
          <h2 className="text-lg font-bold text-gray-800">تأكيد الحذف النهائي</h2>
          <p className="text-gray-500 text-sm">
            هل أنت متأكد من حذف القسم{' '}
            <span className="font-semibold text-gray-800">&quot;{category.name}&quot;</span> نهائياً؟
            <br />
            <span className="text-red-500 text-xs mt-1 block">
              هذا الإجراء لا يمكن التراجع عنه
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
  category: ConsultationCategory | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen || !category) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-sky-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faTrashRestore} className="text-sky-600 text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">تأكيد الاسترجاع</h2>
          <p className="text-gray-500 text-sm">
            هل أنت متأكد من استرجاع القسم{' '}
            <span className="font-semibold text-gray-800">&quot;{category.name}&quot;</span>؟
            <br />
            <span className="text-sky-600 text-xs mt-1 block">
              سيتم إعادة القسم إلى القائمة الرئيسية
            </span>
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
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
        notif.type === 'success' ? 'bg-sky-600' : 'bg-red-500'
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
export default function ConsultationCategoriesPage() {
  // --- Data ---
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);
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

  const [softDeleteModal, setSoftDeleteModal] = useState(false);
  const [categoryToSoftDelete, setCategoryToSoftDelete] = useState<ConsultationCategory | null>(null);
  const [softDeleteLoading, setSoftDeleteLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ConsultationCategory | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [restoreModal, setRestoreModal] = useState(false);
  const [categoryToRestore, setCategoryToRestore] = useState<ConsultationCategory | null>(null);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const [toggleLoadingId, setToggleLoadingId] = useState<number | null>(null);

  // --- ModalMessage ---
  const [modalMsg, setModalMsg] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  }>({ isOpen: false, type: 'success', title: '', message: '' });

  // --- Notif ---
  const [notif, setNotif] = useState<StatusNotif>({ open: false, type: 'success', message: '' });

  const showNotif = (type: 'success' | 'error', message: string) =>
    setNotif({ open: true, type, message });

  // --- Fetch ---
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      if (filterActive === 'deleted') {
        const res = await ConsultationCategoryAdminService.getDeleted();
        if (res.succeeded) {
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
        const filter: Record<string, any> = {};
        if (searchName.trim()) filter.name = searchName.trim();
        if (filterActive !== 'all') {
          filter.isActive = filterActive;
        }

        const res = await ConsultationCategoryAdminService.getAllPaged(
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
  const handleOpenEdit = (cat: ConsultationCategory) => {
    setIsEditMode(true);
    setEditingId(cat.id);
    setFormData({ name: cat.name, description: cat.description || '' });
    setFormModal(true);
  };

  // --- Save (Add/Edit) ---
  const handleSave = async (data: FormData) => {
    setFormLoading(true);
    try {
      let res;
      if (isEditMode && editingId) {
        res = await ConsultationCategoryAdminService.update(editingId, {
          name: data.name,
          description: data.description || undefined,
        });
      } else {
        res = await ConsultationCategoryAdminService.add({
          name: data.name,
          description: data.description || undefined,
        });
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

  // --- Toggle Active (activate / deactivate) ---
  const handleToggleActive = async (cat: ConsultationCategory) => {
    setToggleLoadingId(cat.id);
    try {
      const res = cat.isActive
        ? await ConsultationCategoryAdminService.deactivate(cat.id)
        : await ConsultationCategoryAdminService.activate(cat.id);
      if (res.succeeded) {
        showNotif('success', cat.isActive ? 'تم إلغاء تفعيل القسم' : 'تم تفعيل القسم بنجاح');
        fetchCategories();
      } else {
        showNotif('error', res.message || 'فشلت العملية');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
    } finally {
      setToggleLoadingId(null);
    }
  };

  // --- Soft Delete ---
  const handleOpenSoftDelete = (cat: ConsultationCategory) => {
    setCategoryToSoftDelete(cat);
    setSoftDeleteModal(true);
  };

  const confirmSoftDelete = async () => {
    if (!categoryToSoftDelete) return;
    setSoftDeleteLoading(true);
    try {
      const res = await ConsultationCategoryAdminService.softDelete(categoryToSoftDelete.id);
      if (res.succeeded) {
        showNotif('success', 'تم إخفاء القسم بنجاح');
        setSoftDeleteModal(false);
        setCategoryToSoftDelete(null);
        fetchCategories();
      } else {
        showNotif('error', res.message || 'فشلت العملية');
        setSoftDeleteModal(false);
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
      setSoftDeleteModal(false);
    } finally {
      setSoftDeleteLoading(false);
    }
  };

  // --- Hard Delete ---
  const handleOpenDelete = (cat: ConsultationCategory) => {
    setCategoryToDelete(cat);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await ConsultationCategoryAdminService.delete(categoryToDelete.id);
      if (res.succeeded) {
        showNotif('success', 'تم حذف القسم نهائياً');
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
  const handleOpenRestore = (cat: ConsultationCategory) => {
    setCategoryToRestore(cat);
    setRestoreModal(true);
  };

  const confirmRestore = async () => {
    if (!categoryToRestore) return;
    setRestoreLoading(true);
    try {
      const res = await ConsultationCategoryAdminService.restore(categoryToRestore.id);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">

        {/* ===== Page Header ===== */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faLayerGroup} className="text-white text-xl" />
              </div>
              أقسام الاستشارات
            </h1>
            <p className="text-gray-500 text-sm mt-1 mr-16">
              إدارة أقسام الاستشارات — إضافة وتعديل وإخفاء وحذف
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <FontAwesomeIcon icon={faPlus} />
            إضافة قسم جديد
          </button>
        </div>

        {/* ===== Stats Bar ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {filterActive === 'deleted' ? (
            <div className="rounded-xl border px-5 py-4 bg-red-50 text-red-700 border-red-200 col-span-full">
              <p className="text-2xl font-bold">{totalCount}</p>
              <p className="text-xs font-medium mt-0.5">إجمالي الأقسام المحذوفة</p>
            </div>
          ) : (
            [
              { label: 'إجمالي الأقسام', value: totalCount, color: 'bg-blue-50 text-blue-700 border-blue-200' },
              {
                label: 'الأقسام النشطة',
                value: categories.filter((c) => c.isActive).length,
                color: 'bg-sky-50 text-sky-700 border-sky-200',
              },
              {
                label: 'الأقسام غير النشطة',
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
              className="w-full pr-9 pl-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm"
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
              className="pr-9 pl-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm bg-white appearance-none min-w-36"
            >
              <option value="all">جميع الحالات</option>
              <option value="true">نشط فقط</option>
              <option value="false">غير نشط فقط</option>
              <option value="deleted">محذوفة</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors text-sm"
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
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                  <th className="px-6 py-3.5 text-right font-semibold text-gray-600">#</th>
                  <th className="px-6 py-3.5 text-right font-semibold text-gray-600">الاسم</th>
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
                        {filterActive === 'deleted' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            محذوف
                          </span>
                        ) : (
                          <StatusToggle
                            isActive={cat.isActive}
                            loading={toggleLoadingId === cat.id}
                            onToggle={() => handleToggleActive(cat)}
                          />
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {filterActive === 'deleted' ? (
                            <>
                              <button
                                onClick={() => handleOpenRestore(cat)}
                                title="استرجاع القسم"
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors text-xs font-medium"
                              >
                                <FontAwesomeIcon icon={faTrashRestore} />
                                استرجاع
                              </button>
                              <button
                                onClick={() => handleOpenDelete(cat)}
                                title="حذف نهائي"
                                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                              >
                                <FontAwesomeIcon icon={faTrash} className="text-xs" />
                              </button>
                            </>
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

                              {/* Soft Delete (Hide) */}
                              <button
                                onClick={() => handleOpenSoftDelete(cat)}
                                title="إخفاء القسم"
                                className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors"
                              >
                                <FontAwesomeIcon icon={faEyeSlash} className="text-xs" />
                              </button>

                              {/* Hard Delete */}
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
                      <span key={p} className="text-gray-400 text-sm px-1">...</span>
                    ) : null;
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        currentPage === p
                          ? 'bg-sky-600 text-white shadow'
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

      <SoftDeleteModal
        isOpen={softDeleteModal}
        category={categoryToSoftDelete}
        loading={softDeleteLoading}
        onClose={() => { setSoftDeleteModal(false); setCategoryToSoftDelete(null); }}
        onConfirm={confirmSoftDelete}
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

      {/* ===== ModalMessage ===== */}
      <ModalMessage
        isOpen={modalMsg.isOpen}
        type={modalMsg.type}
        title={modalMsg.title}
        message={modalMsg.message}
        onClose={() => setModalMsg({ ...modalMsg, isOpen: false })}
        autoClose={4000}
      />

      {/* ===== Toast ===== */}
      <StatusToast notif={notif} onClose={() => setNotif({ ...notif, open: false })} />
    </div>
  );
}
