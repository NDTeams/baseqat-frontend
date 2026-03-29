'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faSpinner, faTriangleExclamation,
  faCheck, faTimes, faUsers, faShieldHalved,
  faEye, faPlus, faTrash, faPen,
} from '@fortawesome/free-solid-svg-icons';
import { UsersManagement } from '@/services/dashboard/users-management/page';
import { PrivilegesService, SYSTEM_PRIVILEGES, type UserPrivilege } from '@/services/dashboard/roles/page';

interface StatusNotif { open: boolean; type: 'success' | 'error'; message: string; }

interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  userImage: string | null;
}

// privilege key labels
const PRIV_KEYS: { key: keyof UserPrivilege; label: string; icon: any; color: string }[] = [
  { key: 'isDisplayed', label: 'عرض', icon: faEye, color: 'text-blue-600 bg-blue-50' },
  { key: 'isInsert', label: 'إضافة', icon: faPlus, color: 'text-blue-600 bg-blue-50' },
  { key: 'isUpdate', label: 'تعديل', icon: faPen, color: 'text-amber-600 bg-amber-50' },
  { key: 'isDelete', label: 'حذف', icon: faTrash, color: 'text-red-600 bg-red-50' },
];

// ===== Privilege Toggle Row =====
function PrivilegeRow({ priv, onChange }: {
  priv: UserPrivilege;
  onChange: (key: keyof UserPrivilege, val: boolean) => void;
}) {
  const systemPriv = SYSTEM_PRIVILEGES.find(p => p.id === priv.privilegeId);
  const category = systemPriv?.category ?? priv.category ?? '—';

  return (
    <tr className="hover:bg-gray-50/60 transition-colors">
      <td className="px-6 py-3.5">
        <div>
          <p className="font-semibold text-gray-800 text-sm">{priv.privilegeName}</p>
          <p className="text-xs text-gray-400 mt-0.5">{category}</p>
        </div>
      </td>
      {PRIV_KEYS.map(({ key, label, icon, color }) => (
        <td key={key as string} className="px-4 py-3.5 text-center">
          <button
            onClick={() => onChange(key, !(priv[key] as boolean))}
            className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center transition-all ${
              (priv[key] as boolean)
                ? color
                : 'text-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
            title={label}
          >
            <FontAwesomeIcon icon={icon} className="text-xs" />
          </button>
        </td>
      ))}
    </tr>
  );
}

// ===== Toast =====
function StatusToast({ notif, onClose }: { notif: StatusNotif; onClose: () => void }) {
  useEffect(() => { if (notif.open) { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); } }, [notif.open, onClose]);
  if (!notif.open) return null;
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl text-white font-semibold text-sm ${notif.type === 'success' ? 'bg-blue-600' : 'bg-red-500'}`}>
      <FontAwesomeIcon icon={notif.type === 'success' ? faCheck : faTriangleExclamation} />
      {notif.message}
      <button onClick={onClose} className="mr-2 opacity-70 hover:opacity-100"><FontAwesomeIcon icon={faTimes} className="text-xs" /></button>
    </div>
  );
}

// ===== Main Page =====
export default function PrivilegesPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');

  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [privileges, setPrivileges] = useState<UserPrivilege[]>([]);
  const [privLoading, setPrivLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [notif, setNotif] = useState<StatusNotif>({ open: false, type: 'success', message: '' });
  const showNotif = (type: 'success' | 'error', message: string) => setNotif({ open: true, type, message });

  // Fetch users
  useEffect(() => {
    const load = async () => {
      setUsersLoading(true);
      try {
        const res = await UsersManagement.allUsers();
        const data = Array.isArray(res) ? res : res?.data ?? [];
        setUsers(data);
      } catch (err: any) {
        showNotif('error', err.message || 'فشل تحميل المستخدمين');
      } finally {
        setUsersLoading(false);
      }
    };
    load();
  }, []);

  // Fetch privileges for selected user
  const loadUserPrivileges = async (user: ApiUser) => {
    setSelectedUser(user);
    setPrivLoading(true);
    try {
      const res = await PrivilegesService.getUserPrivileges(user.id);
      if (res.succeeded && Array.isArray(res.data) && res.data.length > 0) {
        setPrivileges(res.data);
      } else {
        // Build from system privileges with all false
        setPrivileges(
          SYSTEM_PRIVILEGES.map(p => ({
            privilegeId: p.id,
            privilegeName: p.name,
            category: p.category,
            isDisplayed: false,
            isInsert: false,
            isUpdate: false,
            isDelete: false,
          }))
        );
      }
    } catch {
      setPrivileges(
        SYSTEM_PRIVILEGES.map(p => ({
          privilegeId: p.id,
          privilegeName: p.name,
          category: p.category,
          isDisplayed: false,
          isInsert: false,
          isUpdate: false,
          isDelete: false,
        }))
      );
    } finally {
      setPrivLoading(false);
    }
  };

  const handleToggle = (privId: string, key: keyof UserPrivilege, val: boolean) => {
    setPrivileges(prev =>
      prev.map(p => p.privilegeId === privId ? { ...p, [key]: val } : p)
    );
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setSaveLoading(true);
    try {
      const res = await PrivilegesService.updateUserPrivileges(
        selectedUser.id,
        privileges.map(p => ({
          privilegeId: p.privilegeId,
          isDisplayed: p.isDisplayed,
          isInsert: p.isInsert,
          isUpdate: p.isUpdate,
          isDelete: p.isDelete,
        }))
      );
      if (res.succeeded) showNotif('success', `تم حفظ صلاحيات ${selectedUser.fullName} بنجاح`);
      else showNotif('error', res.message || 'فشل حفظ الصلاحيات');
    } catch (err: any) {
      showNotif('error', err.response?.data?.message || err.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEnableAll = () => {
    setPrivileges(prev => prev.map(p => ({ ...p, isDisplayed: true, isInsert: true, isUpdate: true, isDelete: true })));
  };
  const handleDisableAll = () => {
    setPrivileges(prev => prev.map(p => ({ ...p, isDisplayed: false, isInsert: false, isUpdate: false, isDelete: false })));
  };

  // Group privileges by category
  const groupedPrivileges = privileges.reduce<Record<string, UserPrivilege[]>>((acc, p) => {
    const cat = SYSTEM_PRIVILEGES.find(sp => sp.id === p.privilegeId)?.category ?? 'أخرى';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const filteredUsers = users.filter(u =>
    u.fullName?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">إدارة الصلاحيات</h1>
        <p className="text-gray-500 text-sm mt-1">اختر مستخدماً لتعيين أو تعديل صلاحياته في النظام</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== Users List ===== */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="text-blue-500" />
                المستخدمون
              </h2>
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input type="text" value={searchUser} onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="بحث عن مستخدم..."
                  className="w-full pr-9 pl-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[500px]">
              {usersLoading ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-gray-400">
                  <FontAwesomeIcon icon={faUsers} className="text-3xl" />
                  <p className="text-sm">لا يوجد مستخدمون</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filteredUsers.map(user => (
                    <button key={user.id} onClick={() => loadUserPrivileges(user)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-gray-50 transition-colors ${selectedUser?.id === user.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''}`}
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-sm">
                        {user.fullName?.charAt(0) ?? '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-semibold text-sm truncate ${selectedUser?.id === user.id ? 'text-blue-700' : 'text-gray-800'}`}>{user.fullName}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      {selectedUser?.id === user.id && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== Privileges Panel ===== */}
        <div className="lg:col-span-2">
          {!selectedUser ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center py-24 text-gray-400 gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faShieldHalved} className="text-3xl text-gray-300" />
              </div>
              <p className="font-medium">اختر مستخدماً من القائمة لعرض صلاحياته</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Panel Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {selectedUser.fullName?.charAt(0) ?? '?'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{selectedUser.fullName}</p>
                    <p className="text-xs text-gray-400">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleEnableAll}
                    className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition-colors">
                    تفعيل الكل
                  </button>
                  <button onClick={handleDisableAll}
                    className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                    إلغاء الكل
                  </button>
                  <button onClick={handleSave} disabled={saveLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm disabled:opacity-60">
                    {saveLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faCheck} />}
                    حفظ الصلاحيات
                  </button>
                </div>
              </div>

              {/* Table */}
              {privLoading ? (
                <div className="flex items-center justify-center py-16 text-gray-400">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-3 text-right font-semibold text-gray-600">الصلاحية</th>
                        {PRIV_KEYS.map(({ label, icon, color }) => (
                          <th key={label} className="px-4 py-3 text-center font-semibold text-gray-600">
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${color}`}>
                              <FontAwesomeIcon icon={icon} className="text-[10px]" /> {label}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {Object.entries(groupedPrivileges).map(([category, privs]) => (
                        <>
                          <tr key={`cat-${category}`} className="bg-gray-50/80">
                            <td colSpan={5} className="px-6 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                              {category}
                            </td>
                          </tr>
                          {privs.map(priv => (
                            <PrivilegeRow
                              key={priv.privilegeId}
                              priv={priv}
                              onChange={(key, val) => handleToggle(priv.privilegeId, key, val)}
                            />
                          ))}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <StatusToast notif={notif} onClose={() => setNotif({ ...notif, open: false })} />
    </div>
  );
}
