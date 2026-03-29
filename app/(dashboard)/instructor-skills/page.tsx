'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faSearch, faEdit, faTrash, faCheck, faTimes,
  faSpinner, faLightbulb, faChevronLeft, faChevronRight,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import {
  InstructorSkillAdminService,
  type InstructorSkill,
} from '@/services/courses/page';

const PAGE_SIZE = 10;

// ===========================
// Status Toast
// ===========================
function StatusToast({ notif, onClose }: { notif: { open: boolean; type: string; message: string }; onClose: () => void }) {
  if (!notif.open) return null;
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl shadow-lg text-white text-sm font-semibold flex items-center gap-2 ${notif.type === 'success' ? 'bg-blue-600' : 'bg-red-600'}`}>
      <FontAwesomeIcon icon={notif.type === 'success' ? faCheck : faTriangleExclamation} />
      {notif.message}
      <button onClick={onClose} className="mr-2 hover:opacity-80"><FontAwesomeIcon icon={faTimes} /></button>
    </div>
  );
}

export default function InstructorSkillsPage() {
  const [skills, setSkills] = useState<InstructorSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState('');

  // Form
  const [formModal, setFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Delete
  const [deleteModal, setDeleteModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<InstructorSkill | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notif
  const [notif, setNotif] = useState({ open: false, type: 'success', message: '' });

  const showNotif = (type: 'success' | 'error', message: string) => {
    setNotif({ open: true, type, message });
    setTimeout(() => setNotif(n => ({ ...n, open: false })), 3000);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const res = await InstructorSkillAdminService.getAllPaged(
        { pageNumber: currentPage, pageSize: PAGE_SIZE },
        { name: searchName || undefined }
      );
      if (res.succeeded) {
        setSkills(res.data);
        setTotalCount(res.totalCount);
      } else {
        setSkills([]);
        setTotalCount(0);
      }
    } catch {
      setSkills([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchName]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // Add
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormName('');
    setFormModal(true);
  };

  // Edit
  const handleOpenEdit = (skill: InstructorSkill) => {
    setIsEditMode(true);
    setEditingId(skill.id);
    setFormName(skill.name);
    setFormModal(true);
  };

  // Save
  const handleSave = async () => {
    if (!formName.trim()) return;
    setFormLoading(true);
    try {
      const res = isEditMode && editingId
        ? await InstructorSkillAdminService.update(editingId, { name: formName.trim() })
        : await InstructorSkillAdminService.add({ name: formName.trim() });
      if (res.succeeded) {
        showNotif('success', isEditMode ? 'تم تعديل المهارة بنجاح' : 'تم إضافة المهارة بنجاح');
        setFormModal(false);
        fetchSkills();
      } else {
        showNotif('error', res.message || 'فشلت العملية');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    if (!skillToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await InstructorSkillAdminService.delete(skillToDelete.id);
      if (res.succeeded) {
        showNotif('success', 'تم حذف المهارة بنجاح');
        setDeleteModal(false);
        fetchSkills();
      } else {
        showNotif('error', res.message || 'فشل الحذف');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faLightbulb} className="text-purple-600" />
            </div>
            مهارات المدربين
          </h1>
          <p className="text-sm text-gray-500 mt-1">إدارة المهارات التي يمكن ربطها بالمدربين</p>
        </div>
        <button onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition-colors text-sm">
          <FontAwesomeIcon icon={faPlus} />
          إضافة مهارة
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">إجمالي المهارات</div>
          <div className="text-2xl font-bold text-purple-600">{totalCount}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">الصفحة الحالية</div>
          <div className="text-2xl font-bold text-blue-600">{currentPage} / {totalPages || 1}</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="relative max-w-md">
          <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input type="text" placeholder="بحث بالاسم..." value={searchName}
            onChange={(e) => { setSearchName(e.target.value); setCurrentPage(1); }}
            className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">اسم المهارة</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-8 bg-gray-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-40 bg-gray-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                  </tr>
                ))
              ) : skills.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-400 text-sm">لا توجد بيانات</td>
                </tr>
              ) : (
                skills.map((skill, idx) => (
                  <tr key={skill.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                        <FontAwesomeIcon icon={faLightbulb} className="text-xs" />
                        {skill.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleOpenEdit(skill)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="تعديل">
                          <FontAwesomeIcon icon={faEdit} className="text-sm" />
                        </button>
                        <button onClick={() => { setSkillToDelete(skill); setDeleteModal(true); }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="حذف">
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
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-md border border-gray-100 px-6 py-4">
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
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${currentPage === pageNum ? 'bg-purple-600 text-white shadow-md' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
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

      {/* Add/Edit Modal */}
      {formModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faLightbulb} className="text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  {isEditMode ? 'تعديل المهارة' : 'إضافة مهارة جديدة'}
                </h2>
              </div>
              <button onClick={() => setFormModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">اسم المهارة <span className="text-red-500">*</span></label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder="مثال: تطوير المنتجات"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm" />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} disabled={formLoading || !formName.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60">
                  {formLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faCheck} />}
                  {isEditMode ? 'حفظ التعديلات' : 'إضافة'}
                </button>
                <button onClick={() => setFormModal(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && skillToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" dir="rtl">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faTrash} className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">حذف المهارة</h3>
            <p className="text-gray-500 text-sm mb-6">
              هل أنت متأكد من حذف <span className="font-bold text-gray-700">{skillToDelete.name}</span>؟
            </p>
            <div className="flex gap-3">
              <button onClick={handleConfirmDelete} disabled={deleteLoading}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {deleteLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faTrash} />}
                حذف
              </button>
              <button onClick={() => setDeleteModal(false)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      <StatusToast notif={notif} onClose={() => setNotif(n => ({ ...n, open: false }))} />
    </div>
  );
}
