'use client';

import { useState, useEffect } from 'react';
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
  faTimes
} from '@fortawesome/free-solid-svg-icons';

// لا حاجة لـ API_BASE_URL أو API_URLS بعد الآن

interface Role {
    id: string | number;
    name: string;
    nameEn: string;
    description: string;
    permissions: string[];
}

interface Privilege {
    id: number;
    name: string;
    category: string;
}

// Skeleton Card Component (unchanged)
const SkeletonRoleCard = () => (
    <div className="role-card bg-white rounded-2xl shadow-sm border-2 border-transparent animate-pulse">
        <div className="role-header p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4 w-full">
                <div className="w-14 h-14 rounded-xl bg-gray-200"></div>
                <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        </div>
        <div className="role-body p-6">
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="permissions-group">
                <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </div>
        </div>
        <div className="role-actions p-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50/50 rounded-b-2xl">
            <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
            <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
        </div>
    </div>
);

const SkeletonPrivilegeRow = () => (
    <tr className="border-b border-gray-100 animate-pulse">
        <td className="p-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
        </td>
        <td className="p-4 text-center">
            <div className="h-6 w-11 bg-gray-200 rounded-full mx-auto"></div>
        </td>
        <td className="p-4 text-center">
            <div className="h-6 w-11 bg-gray-200 rounded-full mx-auto"></div>
        </td>
        <td className="p-4 text-center">
            <div className="h-6 w-11 bg-gray-200 rounded-full mx-auto"></div>
        </td>
        <td className="p-4 text-center">
            <div className="h-6 w-11 bg-gray-200 rounded-full mx-auto"></div>
        </td>
    </tr>
);

// Mock privileges for the privileges modal
const mockPrivileges: Privilege[] = [
    { id: 1, name: 'إدارة المستخدمين', category: 'users' },
    { id: 2, name: 'إدارة الأدوار', category: 'roles' },
    { id: 3, name: 'إدارة الباقات', category: 'packages' },
    { id: 4, name: 'عرض التقارير', category: 'reports' },
    { id: 5, name: 'الإعدادات العامة', category: 'settings' },
    { id: 6, name: 'إدارة المشاريع', category: 'projects' },
    { id: 7, name: 'إدارة الفرق', category: 'teams' },
    { id: 8, name: 'نشر المحتوى', category: 'content' },
];

export default function Roles() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const [newRole, setNewRole] = useState({ name: '', nameEn: '', description: '', permissions: [] as string[] });
    const [privileges] = useState<Privilege[]>(mockPrivileges);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedRoleId, setSelectedRoleId] = useState<string | number | null>(null);
    const [isPrivilegesModalOpen, setIsPrivilegesModalOpen] = useState(false);
    const [rolePrivileges, setRolePrivileges] = useState<Record<number, { insert: boolean; delete: boolean; update: boolean; view: boolean }>>({});

    // Mock roles (as provided)
    const mockRoles: Role[] = [
        {
            id: 1,
            name: 'مدير النظام',
            nameEn: 'Admin',
            description: 'صلاحيات كاملة للوصول إلى جميع أجزاء النظام وإدارتها',
            permissions: ['إدارة المستخدمين', 'إدارة الأدوار', 'إدارة الباقات', 'التقارير', 'الإعدادات']
        },
        {
            id: 2,
            name: 'مدير',
            nameEn: 'Manager',
            description: 'صلاحيات لإدارة الفرق والمشاريع والموظفين',
            permissions: ['إدارة الفرق', 'إدارة المشاريع', 'عرض التقارير']
        },
        {
            id: 3,
            name: 'محرر',
            nameEn: 'Editor',
            description: 'صلاحيات لإنشاء وتعديل المحتوى دون إمكانية الحذف',
            permissions: ['إنشاء المحتوى', 'تعديل المحتوى', 'نشر المحتوى']
        },
        {
            id: 4,
            name: 'مشاهد',
            nameEn: 'Viewer',
            description: 'صلاحيات للاطلاع فقط دون إمكانية التعديل أو الحذف',
            permissions: ['عرض المحتوى', 'عرض التقارير']
        }
    ];

    // Initialize with mock data
    useEffect(() => {
        const timer = setTimeout(() => {
            setRoles(mockRoles);
            setIsLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, []);

    const handleOpenAddModal = () => {
        setModalMode('add');
        setNewRole({ name: '', nameEn: '', description: '', permissions: [] });
        setIsAddRoleModalOpen(true);
    };

    const handleOpenEditModal = (role: Role) => {
        setModalMode('edit');
        setSelectedRoleId(role.id);
        setNewRole({
            name: role.name,
            nameEn: role.nameEn,
            description: role.description,
            permissions: [...role.permissions]
        });
        setIsAddRoleModalOpen(true);
    };

    const handleSaveRole = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'add') {
            const newId = Math.max(...roles.map(r => typeof r.id === 'number' ? r.id : 0), 0) + 1;
            const roleToAdd: Role = {
                id: newId,
                name: newRole.name,
                nameEn: newRole.nameEn || newRole.name,
                description: newRole.description,
                permissions: newRole.permissions
            };
            setRoles(prev => [...prev, roleToAdd]);
        } else if (modalMode === 'edit' && selectedRoleId !== null) {
            setRoles(prev =>
                prev.map(r =>
                    r.id === selectedRoleId
                        ? { ...r, name: newRole.name, nameEn: newRole.nameEn, description: newRole.description, permissions: newRole.permissions }
                        : r
                )
            );
        }
        setIsAddRoleModalOpen(false);
        setNewRole({ name: '', nameEn: '', description: '', permissions: [] });
        setSelectedRoleId(null);
    };

    const handleDeleteRole = (role: Role) => {
        setRoleToDelete(role);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!roleToDelete) return;
        setRoles(prev => prev.filter(r => r.id !== roleToDelete.id));
        setIsDeleteModalOpen(false);
        setRoleToDelete(null);
    };

    const getRoleIcon = (roleNameEn: string) => {
        switch (roleNameEn.toLowerCase()) {
            case 'admin': return { icon: faUserShield, color: 'from-red-500 to-red-600' };
            case 'manager': return { icon: faUserTie, color: 'from-blue-500 to-blue-600' };
            case 'editor': return { icon: faUserPen, color: 'from-green-500 to-green-600' };
            default: return { icon: faEye, color: 'from-gray-500 to-gray-600' };
        }
    };

    const openPrivilegesModal = (role: Role) => {
        setSelectedRoleId(role.id);
        const initialPrivileges: Record<number, { insert: boolean; delete: boolean; update: boolean; view: boolean }> = {};
        mockPrivileges.forEach(priv => {
            initialPrivileges[priv.id] = {
                insert: false,
                delete: false,
                update: false,
                view: true
            };
        });
        setRolePrivileges(initialPrivileges);
        setIsPrivilegesModalOpen(true);
    };

    return (
        <>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 fade-in-up delay-200">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">إدارة الأدوار</h1>
                    <button
                        onClick={handleOpenAddModal}
                        className="btn-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 space-x-reverse hover:bg-opacity-90 transition-colors bg-primary"
                    >
                        <FontAwesomeIcon icon={faPlus} className="ml-2 text-sm" />
                        <span>إضافة دور جديد</span>
                    </button>
                </div>

                {/* Search Box */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="بحث عن دور..."
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="rolesGrid">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <SkeletonRoleCard key={index} />
                        ))
                    ) : (
                        roles
                            .filter(role => role.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((role) => {
                                const { icon, color } = getRoleIcon(role.nameEn);
                                return (
                                    <div key={role.id} className="role-card bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary transform hover:-translate-y-1">
                                        <div className="role-header p-6 border-b border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`role-icon w-14 h-14 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${color}`}>
                                                    <FontAwesomeIcon icon={icon} className="text-xl" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{role.name}</h3>
                                                    <p className="text-sm text-gray-500">{role.nameEn}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="role-body p-6">
                                            <div className="permissions-group">
                                                <div className="permissions-label text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">الصلاحيات</div>
                                                <div className="permissions-list flex flex-wrap gap-2">
                                                    {role.permissions.slice(0, 4).map((perm, idx) => (
                                                        <span key={idx} className="permission-badge inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                                                            <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" />
                                                            {perm}
                                                        </span>
                                                    ))}
                                                    {role.permissions.length > 4 && (
                                                        <span className="permission-badge inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium">
                                                            +{role.permissions.length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="role-actions p-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50/50 rounded-b-2xl">
                                            <button
                                                onClick={() => handleOpenEditModal(role)}
                                                className="role-action-btn edit px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="text-sm" />
                                                تعديل
                                            </button>
                                            <button
                                                onClick={() => openPrivilegesModal(role)}
                                                className="role-action-btn privileges px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all flex items-center gap-2 bg-purple-50 text-purple-600 hover:bg-purple-100"
                                            >
                                                <FontAwesomeIcon icon={faShieldHalved} className="text-sm" />
                                                الصلاحيات
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRole(role)}
                                                className="role-action-btn delete px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100"
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

            {/* Add/Edit Role Modal */}
            <div className={`fixed inset-0 z-[3000] flex items-center justify-center ${isAddRoleModalOpen ? '' : 'hidden'}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddRoleModalOpen(false)}></div>
                <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden animate-fade-in-up">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">
                            {modalMode === 'add' ? 'إضافة دور جديد' : 'تعديل الدور'}
                        </h3>
                        <button onClick={() => setIsAddRoleModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>

                    <form onSubmit={handleSaveRole} className="modal-form p-6 max-h-[80vh] overflow-y-auto">
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم الدور</label>
                                <input
                                    type="text"
                                    required
                                    value={newRole.name}
                                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="اسم الدور"
                                />
                            </div>
                        </div>

                        <div className="modal-actions mt-8 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setIsAddRoleModalOpen(false)}
                                className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                            >
                                الغاء
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-opacity-90 transition-colors shadow-lg shadow-primary/30"
                            >
                                {modalMode === 'add' ? 'اضافة' : 'حفظ التغييرات'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <div className={`fixed inset-0 z-[3000] flex items-center justify-center ${isDeleteModalOpen ? '' : 'hidden'}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
                <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden animate-fade-in-up">
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">حذف الدور</h3>
                        <p className="text-gray-500 mb-6">هل انت متأكد من حذف هذا الدور؟ لا يمكن التراجع عن هذا الإجراء.</p>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                            >
                                الغاء
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-6 py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privileges Modal */}
            <div className={`fixed inset-0 z-[3000] flex items-center justify-center ${isPrivilegesModalOpen ? '' : 'hidden'}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsPrivilegesModalOpen(false)}></div>
                <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">صلاحيات الدور</h3>
                        <button onClick={() => setIsPrivilegesModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1">
                        <div className="overflow-x-auto">
                            <table className="w-full text-right border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="p-4 text-sm font-bold text-gray-700">اسم الصلاحية</th>
                                        <th className="p-4 text-sm font-bold text-gray-700 text-center">إضافة</th>
                                        <th className="p-4 text-sm font-bold text-gray-700 text-center">حذف</th>
                                        <th className="p-4 text-sm font-bold text-gray-700 text-center">تعديل</th>
                                        <th className="p-4 text-sm font-bold text-gray-700 text-center">عرض</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {privileges.map((privilege) => (
                                        <tr key={privilege.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-sm text-gray-800 font-medium">{privilege.name}</td>
                                            <td className="p-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setRolePrivileges(prev => ({
                                                        ...prev,
                                                        [privilege.id]: { ...prev[privilege.id], insert: !prev[privilege.id]?.insert }
                                                    }))}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${rolePrivileges[privilege.id]?.insert ? 'bg-primary' : 'bg-gray-200'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rolePrivileges[privilege.id]?.insert ? '-translate-x-6' : '-translate-x-1'}`} />
                                                </button>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setRolePrivileges(prev => ({
                                                        ...prev,
                                                        [privilege.id]: { ...prev[privilege.id], delete: !prev[privilege.id]?.delete }
                                                    }))}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${rolePrivileges[privilege.id]?.delete ? 'bg-primary' : 'bg-gray-200'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rolePrivileges[privilege.id]?.delete ? '-translate-x-6' : '-translate-x-1'}`} />
                                                </button>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setRolePrivileges(prev => ({
                                                        ...prev,
                                                        [privilege.id]: { ...prev[privilege.id], update: !prev[privilege.id]?.update }
                                                    }))}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${rolePrivileges[privilege.id]?.update ? 'bg-primary' : 'bg-gray-200'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rolePrivileges[privilege.id]?.update ? '-translate-x-6' : '-translate-x-1'}`} />
                                                </button>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setRolePrivileges(prev => ({
                                                        ...prev,
                                                        [privilege.id]: { ...prev[privilege.id], view: !prev[privilege.id]?.view }
                                                    }))}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${rolePrivileges[privilege.id]?.view ? 'bg-primary' : 'bg-gray-200'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rolePrivileges[privilege.id]?.view ? '-translate-x-6' : '-translate-x-1'}`} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                        <button
                            onClick={() => setIsPrivilegesModalOpen(false)}
                            className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                        >
                            الغاء
                        </button>
                        <button
                            onClick={() => {
                                setIsPrivilegesModalOpen(false);
                                alert('تم حفظ الصلاحيات بنجاح (محليًا)');
                            }}
                            className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-opacity-90 transition-colors shadow-lg shadow-primary/30"
                        >
                            حفظ الصلاحيات
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}