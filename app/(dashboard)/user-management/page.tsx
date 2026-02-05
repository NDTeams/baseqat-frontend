'use client';
import { useState } from 'react';
// --- FontAwesome Icons ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSearch,
  faList,
  faThLarge,
  faCamera,
  faShieldAlt,
  faCreditCard,
  faEdit,
  faTrash,
  faKey,
  faTimes,
  faExclamation,
  faCheck,
  faEye,
  faEyeSlash,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

interface User {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  userType: string;
  joinedDate: string;
  isConfirmed: string;
  isLocked: boolean;
  userImage?: string;
}

// === بيانات ثابتة (بدون API) ===
const MOCK_USERS: User[] = [
  {
    id: "1",
    userName: "hussein",
    email: "al-bayti@hotmail.com",
    phoneNumber: "0543740920",
    fullName: "حسين محسن البيتي",
    userType: "Contractor",
    joinedDate: "2025-01-01",
    isConfirmed: "مفعل",
    isLocked: false,
    userImage: "https://via.placeholder.com/40"
  },
  {
    id: "2",
    email: "maidroos@gmail.com",
    phoneNumber: "0543740220",
    fullName: "Mohammed Al-aaidroos",
    userType: "Contractor",
    joinedDate: "2025-01-02",
    isConfirmed: "مفعل",
    isLocked: false,
    userName: "mohammed",
    userImage: "https://via.placeholder.com/40"
  },
  {
    id: "3",
    email: "admin@gmail.com",
    phoneNumber: "9677777777",
    fullName: "مدير النظام",
    userType: "SuperAdmin",
    joinedDate: "2024-12-01",
    isConfirmed: "مفعل",
    isLocked: false,
    userName: "admin",
    userImage: "https://via.placeholder.com/40"
  },
  {
    id: "4",
    email: "rayan@gmail.com",
    phoneNumber: "0566624077",
    fullName: "rayan",
    userType: "Contractor",
    joinedDate: "2025-01-03",
    isConfirmed: "مفعل",
    isLocked: false,
    userName: "rayan",
    userImage: "https://via.placeholder.com/40"
  },
  {
    id: "5",
    email: "mohamed@gmail.com",
    phoneNumber: "0556338524",
    fullName: "محمد",
    userType: "SubContractor",
    joinedDate: "2025-01-04",
    isConfirmed: "مفعل",
    isLocked: false,
    userName: "mohamed",
    userImage: "https://via.placeholder.com/40"
  }
];

const MOCK_ROLES = [
  { id: "1", name: "Admin" },
  { id: "2", name: "Contractor" },
  { id: "3", name: "SubContractor" },
  { id: "4", name: "Owner" },
  { id: "5", name: "SuperAdmin" },
];

const MOCK_PRIVILEGES = [
  { id: 1, name: "ادارة المستخدمين" },
  { id: 2, name: "ادارة المجموعات" },
  { id: 3, name: "ادارة الصلاحيات" },
  { id: 4, name: "صلاحيات الطلبات" },
  { id: 5, name: "صلاحيات المشاريع" },
  { id: 6, name: "تعديل حالة الطلبات" },
  { id: 7, name: "قبول الطلبات" },
];

const MOCK_PLANS = [
  { id: 1, name: "باقة أساسية", cost: 100, daysNo: 30 },
  { id: 2, name: "باقة متقدمة", cost: 250, daysNo: 90 },
  { id: 3, name: "باقة سنوية", cost: 800, daysNo: 365 },
];

// === Skeletons ===
const SkeletonUserRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    <td className="px-6 py-4 whitespace-nowrap">
      <div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
    </td>
    <td className="px-6 py-4">
      <div className="flex gap-1">
        <div className="h-5 w-20 bg-gray-200 rounded"></div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex gap-3">
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
      </div>
    </td>
  </tr>
);

const SkeletonUserCard = () => (
  <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center animate-pulse">
    <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
    <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-40 mb-4"></div>
    <div className="h-6 w-20 bg-gray-200 rounded-full mb-4"></div>
    <div className="flex gap-1 mb-4">
      <div className="h-5 w-24 bg-gray-200 rounded"></div>
    </div>
    <div className="flex gap-2 mt-auto">
      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

export default function Users() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [roles] = useState(MOCK_ROLES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    password: '',
    userType: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isPrivilegesModalOpen, setIsPrivilegesModalOpen] = useState(false);
  const [privileges] = useState(MOCK_PRIVILEGES);
  const [userPrivileges, setUserPrivileges] = useState<Record<number, { insert: boolean; delete: boolean; update: boolean; view: boolean }>>({});
  const [isPrivilegesLoading, setIsPrivilegesLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [plans] = useState(MOCK_PLANS);
  const [selectedPlanId, setSelectedPlanId] = useState<string | number>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [resetData, setResetData] = useState({ userId: '', newPassword: '' });
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [statusModal, setStatusModal] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
    open: false,
    type: 'success',
    message: ''
  });
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // === دوال بدون API ===
  const fetchUserPrivileges = (userId: string) => {
    setIsPrivilegesLoading(true);
    setSelectedUserId(userId);
    const initPrivs: Record<number, any> = {};
    MOCK_PRIVILEGES.forEach(p => {
      initPrivs[p.id] = { insert: false, delete: false, update: false, view: false, name: p.name, id: p.id };
    });
    setUserPrivileges(initPrivs);
    setTimeout(() => setIsPrivilegesLoading(false), 300);
  };

  const handleOpenPrivilegesModal = (user: User) => {
    fetchUserPrivileges(user.id);
    setIsPrivilegesModalOpen(true);
  };

  const handleSaveUserPrivileges = () => {
    setIsPrivilegesModalOpen(false);
    setStatusModal({
      open: true,
      type: 'success',
      message: 'تم حفظ صلاحيات المستخدم بنجاح'
    });
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setNewUser({ email: '', fullName: '', phoneNumber: '', password: '', userType: '' });
    setModalMode('add');
    setIsAddUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setNewUser({
      email: user.email || '',
      fullName: user.fullName || '',
      phoneNumber: user.phoneNumber || '',
      password: '',
      userType: user.userType || ''
    });
    setIsAddUserModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    setUsers(users.filter(u => u.id !== userToDelete.id));
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    setStatusModal({
      open: true,
      type: 'success',
      message: 'تم حذف المستخدم بنجاح'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newUserObj: User = {
        id: `${Date.now()}`,
        userName: newUser.fullName.split(' ')[0].toLowerCase(),
        ...newUser,
        joinedDate: new Date().toISOString().split('T')[0],
        isConfirmed: "مفعل",
        isLocked: false,
        userImage: "https://via.placeholder.com/40"
      };
      setUsers([...users, newUserObj]);
      setStatusModal({
        open: true,
        type: 'success',
        message: 'تم إضافة المستخدم بنجاح'
      });
    } else if (modalMode === 'edit' && selectedUser) {
      setUsers(users.map(u =>
        u.id === selectedUser.id
          ? { ...u, fullName: newUser.fullName, phoneNumber: newUser.phoneNumber, userType: newUser.userType }
          : u
      ));
      setStatusModal({
        open: true,
        type: 'success',
        message: 'تم تحديث بيانات المستخدم بنجاح'
      });
    }
    setIsAddUserModalOpen(false);
  };

  const handleOpenResetPasswordModal = (user: User) => {
    setResetData({ userId: user.id, newPassword: '' });
    setShowResetPassword(false);
    setIsResetPasswordModalOpen(true);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetPasswordModalOpen(false);
    setStatusModal({
      open: true,
      type: 'success',
      message: 'تم تغيير كلمة المرور بنجاح'
    });
  };

  const handleToggleLock = (user: User) => {
    setUsers(users.map(u =>
      u.id === user.id ? { ...u, isLocked: !u.isLocked } : u
    ));
    setStatusModal({
      open: true,
      type: 'success',
      message: user.isLocked ? 'تم فك قفل المستخدم بنجاح' : 'تم قفل المستخدم بنجاح'
    });
  };

  const handleOpenPhotoModal = (user: User) => {
    setSelectedUserId(user.id);
    setPhotoPreview(user.userImage || "https://via.placeholder.com/150");
    setIsPhotoModalOpen(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !photoFile) return;

    const updatedUsers = users.map(u =>
      u.id === selectedUserId ? { ...u, userImage: photoPreview! } : u
    );
    setUsers(updatedUsers);
    setIsPhotoModalOpen(false);
    setStatusModal({
      open: true,
      type: 'success',
      message: 'تم تحديث الصورة الشخصية بنجاح'
    });
  };

  const handleOpenSubscriptionModal = (user: User) => {
    setSelectedUserId(user.id);
    setIsSubscriptionModalOpen(true);
    setSelectedPlanId('');
  };

  const handleSubscribeUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedPlanId) return;
    setIsSubscriptionModalOpen(false);
    setStatusModal({
      open: true,
      type: 'success',
      message: 'تم اشتراك المستخدم في الباقة بنجاح'
    });
  };

  // --- Filter & Pagination ---
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.phoneNumber && user.phoneNumber.includes(searchQuery))
  );

  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentRecords = filteredUsers.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">المستخدمين</h1>
          <button
            className="btn-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center bg-primary hover:bg-primary/90 transition-colors"
            onClick={handleAddUser}
          >
            <FontAwesomeIcon icon={faPlus} className="ml-2" />
            <span className="hidden sm:inline">إضافة مستخدم</span>
            <span className="sm:hidden">إضافة</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="بحث عن مستخدم..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1 ml-0 mr-auto md:mr-0 md:ml-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FontAwesomeIcon icon={faList} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FontAwesomeIcon icon={faThLarge} />
            </button>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full whitespace-nowrap text-right">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">المستخدم</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الهاتف</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">نوع المستخدم</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => <SkeletonUserRow key={index} />)
                ) : (
                  currentRecords.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div onClick={() => handleOpenPhotoModal(user)} className="cursor-pointer relative group inline-block">
                          <img
                            src={user.userImage || "https://via.placeholder.com/40"}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 group-hover:opacity-75 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <FontAwesomeIcon icon={faCamera} className="text-white text-[10px]" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.userType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!user.isLocked}
                            onChange={() => handleToggleLock(user)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-purple-600 hover:text-purple-900 ml-3 cursor-pointer"
                          onClick={() => handleOpenPrivilegesModal(user)}
                          title="الصلاحيات"
                        >
                          <FontAwesomeIcon icon={faShieldAlt} />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 ml-3 cursor-pointer"
                          onClick={() => handleOpenSubscriptionModal(user)}
                          title="اشتراك في باقة"
                        >
                          <FontAwesomeIcon icon={faCreditCard} />
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-900 ml-3 cursor-pointer"
                          onClick={() => handleEditUser(user)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button
                          className="text-yellow-600 hover:text-yellow-900 ml-3 mr-4 cursor-pointer"
                          onClick={() => handleOpenResetPasswordModal(user)}
                          title="تغيير كلمة المرور"
                        >
                          <FontAwesomeIcon icon={faKey} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => <SkeletonUserCard key={index} />)
            ) : (
              currentRecords.map((user, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
                  <div
                    onClick={() => handleOpenPhotoModal(user)}
                    className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-2xl text-gray-500 overflow-hidden relative group cursor-pointer"
                  >
                    {user.userImage ? (
                      <img src={user.userImage} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.fullName.charAt(0)}</span>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FontAwesomeIcon icon={faCamera} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.fullName}</h3>
                  <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-4 ${user.isConfirmed === 'مفعل' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <span className={`w-2 h-2 rounded-full ml-1 ${user.isConfirmed === 'مفعل' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    {user.isConfirmed}
                  </span>
                  <div className="flex flex-wrap justify-center gap-1 mb-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {user.userType}
                    </span>
                  </div>
                  <div className="flex space-x-2 space-x-reverse mt-auto">
                    <button
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors cursor-pointer"
                      onClick={() => handleOpenPrivilegesModal(user)}
                      title="الصلاحيات"
                    >
                      <FontAwesomeIcon icon={faShieldAlt} />
                    </button>
                    <button
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors cursor-pointer"
                      onClick={() => handleEditUser(user)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              عرض {indexOfFirstRecord + 1} إلى {Math.min(indexOfLastRecord, filteredUsers.length)} من أصل {filteredUsers.length} مستخدم
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                }`}
              >
                السابق
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => paginate(idx + 1)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                      currentPage === idx + 1
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                }`}
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </main>

      {/* === Modals === */}
      {/* Add User Modal */}
      <div id="addUserModal" className={`fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 ${isAddUserModalOpen ? '' : 'hidden'}`}>
        <div className="w-full max-w-2xl mx-4 sm:mx-auto bg-white rounded-2xl p-6 relative">
          <button className="absolute top-4 right-4 text-gray-500" onClick={() => setIsAddUserModalOpen(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className="text-gray-500 cursor-pointer bg-gray-100 rounded-full flex justify-center items-center w-16 h-16 mx-auto mb-4 text-xl transition-all duration-200 relative overflow-hidden">
            <div className="cursor-pointer" onClick={() => document.getElementById('profileImageInput')?.click()}>
              <FontAwesomeIcon icon={faUserPlus} size="1x" />
              <img id="profileImagePreview" style={{ display: 'none' }} alt="Profile Preview" />
              <input type="file" id="profileImageInput" accept="image/*" style={{ display: 'none' }} />
            </div>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="الاسم الكامل"
                  required
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">البريد الالكتروني</label>
                <input
                  type="email"
                  id="userEmail"
                  placeholder="البريد الالكتروني"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  placeholder="رقم الهاتف"
                  required
                  value={newUser.phoneNumber}
                  onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              {modalMode === 'add' && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="كلمة المرور"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              )}
              <div className="sm:col-span-2">
                <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">نوع المستخدم (الدور)</label>
                <select
                  id="userType"
                  required
                  value={newUser.userType}
                  onChange={(e) => setNewUser({ ...newUser, userType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                >
                  <option value="">اختر نوع المستخدم</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="px-4 py-2 rounded border text-gray-700" onClick={() => setIsAddUserModalOpen(false)}>
                الغاء
              </button>
              <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">
                {modalMode === 'add' ? 'اضافة' : 'تحديث'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div id="deleteModal" className={`fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 ${isDeleteModalOpen ? '' : 'hidden'}`}>
        <div className="w-full max-w-sm mx-4 sm:mx-auto bg-white rounded-2xl p-6 text-center">
          <div className="mb-3">
            <FontAwesomeIcon icon={faExclamation} className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">حذف مستخدم</h3>
          <p className="text-gray-600 mb-6">هل انت متأكد من حذف هذا المستخدم؟</p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg" onClick={confirmDelete}>حذف</button>
            <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg" onClick={() => setIsDeleteModalOpen(false)}>الغاء</button>
          </div>
        </div>
      </div>

      {/* Privileges Modal */}
      <div className={`fixed inset-0 z-[3000] flex items-center justify-center ${isPrivilegesModalOpen ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsPrivilegesModalOpen(false)}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">صلاحيات المستخدم</h3>
            <button onClick={() => setIsPrivilegesModalOpen(false)} className="text-gray-400 hover:text-gray-600">
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
                  {isPrivilegesLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index} className="border-b border-gray-100 animate-pulse">
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                        <td className="p-4 text-center"><div className="h-6 w-11 bg-gray-200 rounded-full mx-auto"></div></td>
                        <td className="p-4 text-center"><div className="h-6 w-11 bg-gray-200 rounded-full mx-auto"></div></td>
                        <td className="p-4 text-center"><div className="h-6 w-11 bg-gray-200 rounded-full mx-auto"></div></td>
                        <td className="p-4 text-center"><div className="h-6 w-11 bg-gray-200 rounded-full mx-auto"></div></td>
                      </tr>
                    ))
                  ) : (
                    privileges.map((privilege) => (
                      <tr key={privilege.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-800 font-medium">{privilege.name}</td>
                        {(['insert', 'delete', 'update', 'view'] as const).map((action) => (
                          <td key={action} className="p-4 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                setUserPrivileges((prev) => ({
                                  ...prev,
                                  [privilege.id]: {
                                    ...prev[privilege.id],
                                    [action]: !prev[privilege.id]?.[action]
                                  }
                                }))
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                userPrivileges[privilege.id]?.[action] ? 'bg-primary' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  userPrivileges[privilege.id]?.[action] ? '-translate-x-6' : '-translate-x-1'
                                }`}
                              />
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button
              onClick={() => setIsPrivilegesModalOpen(false)}
              className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
            >
              الغاء
            </button>
            <button
              onClick={handleSaveUserPrivileges}
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-opacity-90 shadow-lg shadow-primary/30"
            >
              حفظ الصلاحيات
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      <div className={`fixed inset-0 z-[3000] flex items-center justify-center ${isSubscriptionModalOpen ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSubscriptionModalOpen(false)}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">اشتراك في باقة</h3>
            <button onClick={() => setIsSubscriptionModalOpen(false)} className="text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <form onSubmit={handleSubscribeUser} className="p-6">
            <div className="mb-6">
              <label htmlFor="planSelect" className="block text-sm font-medium text-gray-700 mb-2">اختر الباقة</label>
              <select
                id="planSelect"
                required
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              >
                <option value="">اختر باقة...</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - {plan.cost} ر.س - {plan.daysNo} يوم
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsSubscriptionModalOpen(false)}
                className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
              >
                الغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 shadow-lg shadow-green-600/30"
              >
                حفظ الاشتراك
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Photo Modal */}
      <div className={`fixed inset-0 z-[3000] flex items-center justify-center ${isPhotoModalOpen ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsPhotoModalOpen(false)}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">تحديث الصورة الشخصية</h3>
              <button onClick={() => setIsPhotoModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleUpdatePhoto} className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-6 group cursor-pointer" onClick={() => document.getElementById('updatePhotoInput')?.click()}>
                <img
                  src={photoPreview || "https://via.placeholder.com/150"}
                  className="w-full h-full rounded-full object-cover border-4 border-gray-100 shadow-lg group-hover:opacity-75"
                  alt="Profile Preview"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FontAwesomeIcon icon={faCamera} className="text-white text-2xl drop-shadow-lg" />
                </div>
                <input
                  type="file"
                  id="updatePhotoInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="w-full flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
                >
                  الغاء
                </button>
                <button
                  type="submit"
                  disabled={!photoFile}
                  className={`px-6 py-2.5 rounded-lg text-white font-medium transition-colors shadow-lg ${
                    !photoFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-opacity-90 shadow-primary/30'
                  }`}
                >
                  حفظ الصورة
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      <div className={`fixed inset-0 z-[3000] flex items-center justify-center ${isResetPasswordModalOpen ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsResetPasswordModalOpen(false)}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">تغيير كلمة المرور</h3>
            <button onClick={() => setIsResetPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <form onSubmit={handleResetPassword} className="p-6">
            <div className="mb-6">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الجديدة</label>
              <div className="relative">
                <input
                  type={showResetPassword ? "text" : "password"}
                  id="newPassword"
                  required
                  value={resetData.newPassword}
                  onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pl-10"
                  placeholder="ادخل كلمة المرور الجديدة"
                />
                <button
                  type="button"
                  onClick={() => setShowResetPassword(!showResetPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={showResetPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
              >
                الغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-yellow-600 text-white font-medium hover:bg-yellow-700 shadow-lg shadow-yellow-600/30"
              >
                تغيير كلمة المرور
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Status Modal */}
      <div className={`fixed inset-0 z-[3001] flex items-center justify-center ${statusModal.open ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setStatusModal({ ...statusModal, open: false })}></div>
        <div className={`relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden border-t-4 ${statusModal.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          <div className="p-6 text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${statusModal.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <FontAwesomeIcon icon={statusModal.type === 'success' ? faCheck : faTimes} className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {statusModal.type === 'success' ? 'تمت العملية بنجاح' : 'خطأ'}
            </h3>
            <p className="text-gray-600 mb-6">{statusModal.message}</p>
            <button
              onClick={() => setStatusModal({ ...statusModal, open: false })}
              className={`px-6 py-2.5 rounded-lg text-white font-medium shadow-lg transition-colors ${
                statusModal.type === 'success'
                  ? 'bg-green-600 hover:bg-green-700 shadow-green-600/30'
                  : 'bg-red-600 hover:bg-red-700 shadow-red-600/30'
              }`}
            >
              حسناً
            </button>
          </div>
        </div>
      </div>
    </>
  );
}