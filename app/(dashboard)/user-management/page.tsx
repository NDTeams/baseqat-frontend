'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSearch,
  faList,
  faThLarge,
} from '@fortawesome/free-solid-svg-icons';

interface User {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  userType?: string;
  joinedDate: string;
  isConfirmed: string;
  isLocked: boolean;
  userImage: string | null;
}

import { UsersManagement } from '@/services/dashboard/users-management/page';
import UserTable from '@/components/dashboard/user-modal-table';
import UserGrid from '@/components/dashboard/user-modal-grid';
import UserModals from '@/components/dashboard/user-modals';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isPrivilegesModalOpen, setIsPrivilegesModalOpen] = useState(false);
  const [userPrivileges, setUserPrivileges] = useState<Record<number, { insert: boolean; delete: boolean; update: boolean; view: boolean }>>({});
  const [isPrivilegesLoading, setIsPrivilegesLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
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

  // === جلب المستخدمين من الـ API ===
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await UsersManagement.allUsers();

        let usersData: User[] = [];
        if (Array.isArray(response)) {
          usersData = response;
        } else if (response && Array.isArray(response.data)) {
          usersData = response.data;
        } else {
          throw new Error('تنسيق غير متوقع من الـ API');
        }

        const normalizedUsers = usersData.map(user => ({
          ...user,
          userImage: user.userImage || "https://via.placeholder.com/40",
        }));

        setUsers(normalizedUsers);
      } catch (err: any) {
        console.error('فشل في جلب المستخدمين:', err);
        setStatusModal({
          open: true,
          type: 'error',
          message: err.message || 'فشل في تحميل قائمة المستخدمين'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // === الدوال ===
  const fetchUserPrivileges = (userId: string) => {
    setIsPrivilegesLoading(true);
    setSelectedUserId(userId);
    const tempPrivileges = [
      { id: 1, name: "ادارة المستخدمين" },
      { id: 2, name: "ادارة المجموعات" },
      { id: 3, name: "ادارة الصلاحيات" },
      { id: 4, name: "صلاحيات الطلبات" },
      { id: 5, name: "صلاحيات المشاريع" },
      { id: 6, name: "تعديل حالة الطلبات" },
      { id: 7, name: "قبول الطلبات" },
    ];
    const initPrivs: Record<number, any> = {};
    tempPrivileges.forEach(p => {
      initPrivs[p.id] = { insert: false, delete: false, update: false, view: false };
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
    setNewUser({ email: '', fullName: '', phoneNumber: '', password: '' });
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
    });
    setIsAddUserModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const response = await UsersManagement.DeleteBaseqatEmployee(userToDelete.id);
      
      if (response.succeeded) {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        setStatusModal({
          open: true,
          type: 'success',
          message: 'تم حذف المستخدم بنجاح'
        });
      } else {
        throw new Error(response.message || 'فشل في حذف المستخدم');
      }
    } catch (err: any) {
      setStatusModal({
        open: true,
        type: 'error',
        message: err.message || 'حدث خطأ أثناء الحذف'
      });
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        const addData = {
          email: newUser.email,
          fullName: newUser.fullName,
          phoneNumber: newUser.phoneNumber,
          password: newUser.password,
          userName: newUser.email, // ← الحل هنا
        };

        const response = await UsersManagement.AddBaseqatEmployee(addData);
        
        if (response.succeeded) {
          const newUserObj: User = {
            id: `${Date.now()}`,
            userName: newUser.email,
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
        } else {
          throw new Error(response.message || 'فشل في إضافة المستخدم');
        }
      } else if (modalMode === 'edit' && selectedUser) {
        const updateData = {
          email: newUser.email,
          fullName: newUser.fullName,
          phoneNumber: newUser.phoneNumber,
          password: newUser.password,
          userName: selectedUser.userName, // ← الحل هنا
        };

        const response = await UsersManagement.UpdateBaseqatEmployee(selectedUser.id, updateData);
        
        if (response.succeeded) {
          setUsers(users.map(u =>
            u.id === selectedUser.id
              ? { ...u, fullName: newUser.fullName, phoneNumber: newUser.phoneNumber }
              : u
          ));
          setStatusModal({
            open: true,
            type: 'success',
            message: 'تم تحديث بيانات المستخدم بنجاح'
          });
        } else {
          throw new Error(response.message || 'فشل في تحديث المستخدم');
        }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 
                     err.response?.data?.errors?.[0] ||
                     err.message || 
                     'حدث خطأ أثناء الحفظ';
      
      setStatusModal({
        open: true,
        type: 'error',
        message
      });
    } finally {
      setIsAddUserModalOpen(false);
    }
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

  const handleToggleLock = async (user: User) => {
    try {
      const response = user.isLocked
        ? await UsersManagement.UnlockUser(user.id)
        : await UsersManagement.LockUser(user.id);

      if (response.succeeded) {
        setUsers(users.map(u =>
          u.id === user.id ? { ...u, isLocked: !u.isLocked } : u
        ));
        setStatusModal({
          open: true,
          type: 'success',
          message: user.isLocked ? 'تم فك قفل المستخدم بنجاح' : 'تم قفل المستخدم بنجاح'
        });
      } else {
        setStatusModal({
          open: true,
          type: 'error',
          message: response.message || 'فشل في تغيير حالة القفل'
        });
      }
    } catch {
      setStatusModal({
        open: true,
        type: 'error',
        message: 'حدث خطأ أثناء تغيير حالة القفل'
      });
    }
  };

  const handleOpenPhotoModal = (user: User) => {
    setSelectedUserId(user.id);
    setPhotoPreview(user.userImage || "https://via.placeholder.com/150");
    setIsPhotoModalOpen(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !photoFile) return;
    setUsers(users.map(u =>
      u.id === selectedUserId ? { ...u, userImage: photoPreview! } : u
    ));
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

        {viewMode === 'table' && (
          <UserTable
            users={currentRecords}
            isLoading={isLoading}
            handleOpenPhotoModal={handleOpenPhotoModal}
            handleToggleLock={handleToggleLock}
            handleOpenPrivilegesModal={handleOpenPrivilegesModal}
            handleOpenSubscriptionModal={handleOpenSubscriptionModal}
            handleEditUser={handleEditUser}
            handleDeleteUser={handleDeleteUser}
            handleOpenResetPasswordModal={handleOpenResetPasswordModal}
          />
        )}

        {viewMode === 'grid' && (
          <UserGrid
            users={currentRecords}
            isLoading={isLoading}
            handleOpenPhotoModal={handleOpenPhotoModal}
            handleOpenPrivilegesModal={handleOpenPrivilegesModal}
            handleEditUser={handleEditUser}
            handleDeleteUser={handleDeleteUser}
          />
        )}

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

      <UserModals
        isAddUserModalOpen={isAddUserModalOpen}
        setIsAddUserModalOpen={setIsAddUserModalOpen}
        modalMode={modalMode}
        newUser={newUser}
        setNewUser={setNewUser}
        handleSubmit={handleSubmit}
        errorMessage={errorMessage}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        confirmDelete={confirmDelete}
        isPrivilegesModalOpen={isPrivilegesModalOpen}
        setIsPrivilegesModalOpen={setIsPrivilegesModalOpen}
        userPrivileges={userPrivileges}
        setUserPrivileges={setUserPrivileges}
        handleSaveUserPrivileges={handleSaveUserPrivileges}
        isPrivilegesLoading={isPrivilegesLoading}
        isSubscriptionModalOpen={isSubscriptionModalOpen}
        setIsSubscriptionModalOpen={setIsSubscriptionModalOpen}
        selectedPlanId={selectedPlanId}
        setSelectedPlanId={setSelectedPlanId}
        handleSubscribeUser={handleSubscribeUser}
        isPhotoModalOpen={isPhotoModalOpen}
        setIsPhotoModalOpen={setIsPhotoModalOpen}
        photoPreview={photoPreview}
        handlePhotoChange={handlePhotoChange}
        handleUpdatePhoto={handleUpdatePhoto}
        photoFile={photoFile}
        isResetPasswordModalOpen={isResetPasswordModalOpen}
        setIsResetPasswordModalOpen={setIsResetPasswordModalOpen}
        resetData={resetData}
        setResetData={setResetData}
        showResetPassword={showResetPassword}
        setShowResetPassword={setShowResetPassword}
        handleResetPassword={handleResetPassword}
        statusModal={statusModal}
        setStatusModal={setStatusModal}
      />
    </>
  );
}