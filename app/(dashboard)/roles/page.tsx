'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSearch,
  faEdit,
  faShieldHalved,
  faTrash,
  faCheckCircle,
  faTriangleExclamation,
  faUserShield,
  faUserTie,
  faUserPen,
  faEye,
  faTimes,
  faSpinner,
  faCheck,
  faUsersGear,
} from '@fortawesome/free-solid-svg-icons';
import {
  RolesService,
  type Role as ApiRole,
  type PrivilegesRoleBasedDto,
  type PrivilegesRoleBasedCreateDto,
} from '@/services/dashboard/roles/page';

// ===== Notification =====
interface StatusNotif { open: boolean; type: 'success' | 'error'; message: string; }

function StatusToast({ notif, onClose }: { notif: StatusNotif; onClose: () => void }) {
  useEffect(() => { if (notif.open) { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); } }, [notif.open, onClose]);
  if (!notif.open) return null;
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl text-white font-semibold text-sm ${notif.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}>
      <FontAwesomeIcon icon={notif.type === 'success' ? faCheck : faTriangleExclamation} />
      {notif.message}
      <button onClick={onClose} className="mr-2 opacity-70 hover:opacity-100"><FontAwesomeIcon icon={faTimes} className="text-xs" /></button>
    </div>
  );
}

// ===== Skeleton =====
const SkeletonRoleCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border-2 border-transparent animate-pulse">
    <div className="p-6 border-b border-gray-100 flex items-center gap-4">
      <div className="w-14 h-14 rounded-xl bg-gray-200"></div>
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="p-6">
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
    <div className="p-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50/50 rounded-b-2xl">
      <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
      <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

export default function GroupsPage() {
  // ===== State =====
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<ApiRole | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Privileges Modal
  const [isPrivilegesModalOpen, setIsPrivilegesModalOpen] = useState(false);
  const [privilegesRoleName, setPrivilegesRoleName] = useState('');
  const [modalPrivileges, setModalPrivileges] = useState<{ id: number; name: string; category: string }[]>([]);
  const [rolePrivileges, setRolePrivileges] = useState<Record<number, { is_displayed: boolean; is_insert: boolean; is_update: boolean; is_delete: boolean; is_print: boolean }>>({});
  const [privLoading, setPrivLoading] = useState(false);
  const [privSaving, setPrivSaving] = useState(false);

  // Notification
  const [notif, setNotif] = useState<StatusNotif>({ open: false, type: 'success', message: '' });
  const showNotif = (type: 'success' | 'error', message: string) => setNotif({ open: true, type, message });

  // ===== Fetch Roles =====
  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await RolesService.getAll();
      if (res.succeeded && Array.isArray(res.data)) {
        setRoles(res.data);
      } else {
        showNotif('error', res.message || 'فشل تحميل المجموعات');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || 'فشل الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // ===== Add / Edit =====
  const handleOpenAddModal = () => {
    setModalMode('add');
    setRoleName('');
    setSelectedRoleId(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (role: ApiRole) => {
    setModalMode('edit');
    setSelectedRoleId(role.id);
    setRoleName(role.name);
    setIsAddModalOpen(true);
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;
    setSaving(true);
    try {
      if (modalMode === 'add') {
        const res = await RolesService.add(roleName.trim());
        if (res.succeeded) {
          showNotif('success', 'تم إضافة المجموعة بنجاح');
          setIsAddModalOpen(false);
          setRoleName('');
          fetchRoles();
        } else {
          showNotif('error', res.message || 'فشل إضافة المجموعة');
        }
      } else if (modalMode === 'edit' && selectedRoleId) {
        const res = await RolesService.update(selectedRoleId, roleName.trim());
        if (res.succeeded) {
          showNotif('success', 'تم تعديل المجموعة بنجاح');
          setIsAddModalOpen(false);
          setRoleName('');
          setSelectedRoleId(null);
          fetchRoles();
        } else {
          showNotif('error', res.message || 'فشل تعديل المجموعة');
        }
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  // ===== Delete =====
  const handleDeleteRole = (role: ApiRole) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;
    setDeleting(true);
    try {
      const res = await RolesService.delete(roleToDelete.id);
      if (res.succeeded) {
        showNotif('success', 'تم حذف المجموعة بنجاح');
        setIsDeleteModalOpen(false);
        setRoleToDelete(null);
        fetchRoles();
      } else {
        showNotif('error', res.message || 'فشل حذف المجموعة');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || 'حدث خطأ أثناء الحذف');
    } finally {
      setDeleting(false);
    }
  };

  // ===== Privileges =====
  const openPrivilegesModal = async (role: ApiRole) => {
    setSelectedRoleId(role.id);
    setPrivilegesRoleName(role.name);
    setIsPrivilegesModalOpen(true);
    setPrivLoading(true);

    try {
      const res = await RolesService.getRolePrivileges(role.id);
      if (res.succeeded && Array.isArray(res.data) && res.data.length > 0) {
        // استخدام بيانات API مباشرة - تحتوي على أسماء الصلاحيات وحالتها
        const privList: { id: number; name: string; category: string }[] = [];
        const privStates: Record<number, { is_displayed: boolean; is_insert: boolean; is_update: boolean; is_delete: boolean; is_print: boolean }> = {};

        res.data.forEach((rp: PrivilegesRoleBasedDto) => {
          privList.push({
            id: rp.privilegesId,
            name: rp.privilegeName,
            category: '',
          });
          privStates[rp.privilegesId] = {
            is_displayed: rp.is_displayed,
            is_insert: rp.is_insert,
            is_update: rp.is_update,
            is_delete: rp.is_delete,
            is_print: rp.is_print,
          };
        });

        setModalPrivileges(privList);
        setRolePrivileges(privStates);
      } else {
        setModalPrivileges([]);
        setRolePrivileges({});
      }
    } catch {
      setModalPrivileges([]);
      setRolePrivileges({});
    }

    setPrivLoading(false);
  };

  const handleSavePrivileges = async () => {
    if (!selectedRoleId) return;
    setPrivSaving(true);
    try {
      const privileges: PrivilegesRoleBasedCreateDto[] = Object.entries(rolePrivileges).map(([privId, flags]) => ({
        privilegesId: Number(privId),
        roleId: selectedRoleId,
        ...flags,
      }));
      const res = await RolesService.addOrUpdateRolePrivileges(selectedRoleId, privileges);
      if (res.succeeded) {
        showNotif('success', 'تم حفظ الصلاحيات بنجاح');
        setIsPrivilegesModalOpen(false);
      } else {
        showNotif('error', res.message || 'فشل حفظ الصلاحيات');
      }
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || 'حدث خطأ أثناء حفظ الصلاحيات');
    } finally {
      setPrivSaving(false);
    }
  };

  // ===== Helpers =====
  const getRoleIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('admin') || lower.includes('مدير النظام') || lower.includes('superadmin'))
      return { icon: faUserShield, color: 'from-red-500 to-red-600' };
    if (lower.includes('manager') || lower.includes('مدير') || lower.includes('baseqatemployee'))
      return { icon: faUserTie, color: 'from-blue-500 to-blue-600' };
    if (lower.includes('editor') || lower.includes('محرر') || lower.includes('trainer'))
      return { icon: faUserPen, color: 'from-green-500 to-green-600' };
    if (lower.includes('consultant') || lower.includes('مستشار'))
      return { icon: faUsersGear, color: 'from-purple-500 to-purple-600' };
    return { icon: faEye, color: 'from-gray-500 to-gray-600' };
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count active privileges for a display badge
  const getActivePrivCount = (privs: Record<string, { is_displayed: boolean; is_insert: boolean; is_update: boolean; is_delete: boolean; is_print: boolean }>) => {
    return Object.values(privs).filter(p => p.is_displayed || p.is_insert || p.is_update || p.is_delete).length;
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 fade-in-up delay-200">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">إدارة المجموعات</h1>
          <button
            onClick={handleOpenAddModal}
            className="btn-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 space-x-reverse hover:bg-opacity-90 transition-colors bg-primary"
          >
            <FontAwesomeIcon icon={faPlus} className="ml-2 text-sm" />
            <span>إضافة مجموعة جديدة</span>
          </button>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="بحث عن مجموعة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonRoleCard key={index} />
            ))
          ) : filteredRoles.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
              <FontAwesomeIcon icon={faUsersGear} className="text-5xl mb-4" />
              <p className="text-lg font-medium">
                {searchQuery ? 'لا توجد مجموعات تطابق البحث' : 'لا توجد مجموعات'}
              </p>
            </div>
          ) : (
            filteredRoles.map((role) => {
              const { icon, color } = getRoleIcon(role.name);
              return (
                <div key={role.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary transform hover:-translate-y-1">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${color}`}>
                        <FontAwesomeIcon icon={icon} className="text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{role.name}</h3>
                        {role.usersCount !== undefined && (
                          <p className="text-sm text-gray-500">{role.usersCount} مستخدم</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="permissions-group">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">الصلاحيات</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium">
                          <FontAwesomeIcon icon={faShieldHalved} className="text-[10px]" />
                          اضغط لإدارة الصلاحيات
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50/50 rounded-b-2xl">
                    <button
                      onClick={() => handleOpenEditModal(role)}
                      className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-sm" />
                      تعديل
                    </button>
                    <button
                      onClick={() => openPrivilegesModal(role)}
                      className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all flex items-center gap-2 bg-purple-50 text-purple-600 hover:bg-purple-100"
                    >
                      <FontAwesomeIcon icon={faShieldHalved} className="text-sm" />
                      الصلاحيات
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role)}
                      className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      حذف
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* ===== Add/Edit Modal ===== */}
      <div className={`fixed inset-0 z-[3000] flex items-center justify-center ${isAddModalOpen ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !saving && setIsAddModalOpen(false)}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">
              {modalMode === 'add' ? 'إضافة مجموعة جديدة' : 'تعديل المجموعة'}
            </h3>
            <button onClick={() => !saving && setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <form onSubmit={handleSaveRole} className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المجموعة</label>
                <input
                  type="text"
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="اسم المجموعة"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => !saving && setIsAddModalOpen(false)}
                className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                disabled={saving}
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-opacity-90 transition-colors shadow-lg shadow-primary/30 disabled:opacity-60 inline-flex items-center gap-2"
              >
                {saving && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                {modalMode === 'add' ? 'إضافة' : 'حفظ التغييرات'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== Delete Confirmation Modal ===== */}
      <div className={`fixed inset-0 z-[3000] flex items-center justify-center ${isDeleteModalOpen ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deleting && setIsDeleteModalOpen(false)}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden animate-fade-in-up">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">حذف المجموعة</h3>
            <p className="text-gray-500 mb-2">
              هل أنت متأكد من حذف مجموعة <span className="font-bold text-gray-700">{roleToDelete?.name}</span>؟
            </p>
            <p className="text-gray-400 text-sm mb-6">لا يمكن التراجع عن هذا الإجراء.</p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => !deleting && setIsDeleteModalOpen(false)}
                className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                disabled={deleting}
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-6 py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 disabled:opacity-60 inline-flex items-center gap-2"
              >
                {deleting && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Privileges Modal ===== */}
      <div className={`fixed inset-0 z-[3000] flex items-center justify-center ${isPrivilegesModalOpen ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !privSaving && setIsPrivilegesModalOpen(false)}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">
              صلاحيات المجموعة: <span className="text-primary">{privilegesRoleName}</span>
            </h3>
            <button onClick={() => !privSaving && setIsPrivilegesModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {privLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-4 text-sm font-bold text-gray-700">اسم الصلاحية</th>
                      <th className="p-4 text-sm font-bold text-gray-700 text-center">عرض</th>
                      <th className="p-4 text-sm font-bold text-gray-700 text-center">إضافة</th>
                      <th className="p-4 text-sm font-bold text-gray-700 text-center">تعديل</th>
                      <th className="p-4 text-sm font-bold text-gray-700 text-center">حذف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalPrivileges.map((privilege) => (
                      <tr key={privilege.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm text-gray-800 font-medium">
                          <div>
                            <p>{privilege.name}</p>
                            {privilege.category && (
                              <p className="text-xs text-gray-400 mt-0.5">{privilege.category}</p>
                            )}
                          </div>
                        </td>
                        {(['is_displayed', 'is_insert', 'is_update', 'is_delete'] as const).map((flag) => (
                          <td key={flag} className="p-4 text-center">
                            <button
                              type="button"
                              onClick={() => setRolePrivileges(prev => ({
                                ...prev,
                                [privilege.id]: {
                                  ...prev[privilege.id],
                                  [flag]: !prev[privilege.id]?.[flag]
                                }
                              }))}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${rolePrivileges[privilege.id]?.[flag] ? 'bg-primary' : 'bg-gray-200'}`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rolePrivileges[privilege.id]?.[flag] ? '-translate-x-6' : '-translate-x-1'}`} />
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button
              onClick={() => !privSaving && setIsPrivilegesModalOpen(false)}
              className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              disabled={privSaving}
            >
              إلغاء
            </button>
            <button
              onClick={handleSavePrivileges}
              disabled={privSaving || privLoading}
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-opacity-90 transition-colors shadow-lg shadow-primary/30 disabled:opacity-60 inline-flex items-center gap-2"
            >
              {privSaving && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
              حفظ الصلاحيات
            </button>
          </div>
        </div>
      </div>

      <StatusToast notif={notif} onClose={() => setNotif({ ...notif, open: false })} />
    </>
  );
}
