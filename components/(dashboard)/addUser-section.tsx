"use client";

import { useState, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faTimes, faFilter, faTh, faUserPlus, faEdit, faTrash, faSearch,
  faChevronLeft, faChevronRight, faExclamation, faUser, faCalendar
} from "@fortawesome/free-solid-svg-icons";

import UserTable from "@/components/(dashboard)/user-table";
import UserGrid from "@/components/(dashboard)/user-grid";
import AddEditUserModal from "@/components/(dashboard)/addEdituser-modal";
import DeleteUserModal from "@/components/(dashboard)/deleteUser-modal";
import FilterModal from "@/components/(dashboard)/filter-user-modal";

export default function UsersPage() {
  const [isTableView, setIsTableView] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleView = () => setIsTableView(!isTableView);

  const openAddUserModal = () => {
    setSelectedUser(null);
    setShowAddModal(true);
  };

  const openEditUserModal = (user: any) => {
    setSelectedUser(user);
    setShowAddModal(true);
  };

  const closeAddUserModal = () => {
    setShowAddModal(false);
    setProfilePreview(null);
  };

  const openFilterModal = () => setShowFilterModal(true);
  const closeFilterModal = () => setShowFilterModal(false);

  const openDeleteUserModal = (user: any) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const users = [
    { name: "أحمد محمد", email: "ahmed@company.com", status: "active", permissions: ["إدارة العروض","الاشراف على المهام","الاطلاع فقط"], date: "22 Jan 2022" },
    { name: "فاطمة علي", email: "fatima@company.com", status: "inactive", permissions: ["إدارة العروض غير","الاطلاع فقط"], date: "15 Jan 2022" },
    { name: "محمد السعيد", email: "mohamed@company.com", status: "active", permissions: ["إدارة العروض","الاشراف على المهام"], date: "10 Jan 2022" },
    { name: "نورا أحمد", email: "nora@company.com", status: "active", permissions: ["الاطلاع فقط"], date: "08 Jan 2022" },
    { name: "خالد محمد", email: "khalid@company.com", status: "inactive", permissions: ["إدارة العروض","الاشراف على المهام غير"], date: "05 Jan 2022" },
    { name: "سارة علي", email: "sara@company.com", status: "active", permissions: ["إدارة العروض","الاشراف على المهام","الاطلاع فقط"], date: "03 Jan 2022" },
    { name: "عبدالله حسن", email: "abdullah@company.com", status: "active", permissions: ["الاطلاع فقط"], date: "01 Jan 2022" },
    { name: "مريم أحمد", email: "mariam@company.com", status: "inactive", permissions: ["إدارة العروض"], date: "28 Dec 2021" },
    { name: "يوسف محمد", email: "youssef@company.com", status: "active", permissions: ["الاشراف على المهام","الاطلاع فقط"], date: "25 Dec 2021" },
    { name: "هند علي", email: "hind@company.com", status: "active", permissions: ["إدارة العروض","الاشراف على المهام","الاطلاع فقط"], date: "20 Dec 2021" },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <button className="bg-dashboardBg text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center w-full sm:w-auto" onClick={openAddUserModal}>
          <FontAwesomeIcon icon={faPlus} className="ml-2"/>
          <span className="hidden sm:inline">إضافة مستخدم</span>
          <span className="sm:hidden">إضافة</span>
        </button>

        <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-4 space-x-reverse">
          <div className="filter-buttons flex space-x-2 space-x-reverse">
            <button className="p-2 border border-gray-300 bg-white rounded-md" title="تصفية" onClick={openFilterModal}>
              <FontAwesomeIcon icon={faFilter} className="text-gray-600"/>
            </button>
            <button className="p-2 border border-gray-300 bg-white rounded-md" title="عرض" onClick={toggleView}>
              <FontAwesomeIcon icon={faTh} className="text-gray-600"/>
            </button>
          </div>
        </div>
      </div>

      {isTableView ? (
        <UserTable 
          users={users}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          usersPerPage={usersPerPage}
          setUsersPerPage={setUsersPerPage}
          openEditUserModal={openEditUserModal}
          openDeleteUserModal={openDeleteUserModal}
          toggleView={toggleView}
          isTableView={isTableView}
        />
      ) : (
        <UserGrid 
          users={users.slice((currentPage-1)*usersPerPage, currentPage*usersPerPage)}
          openEditUserModal={openEditUserModal}
        />
      )}

      {showAddModal && (
        <AddEditUserModal 
          selectedUser={selectedUser}
          profilePreview={profilePreview}
          handleProfileChange={handleProfileChange}
          closeModal={closeAddUserModal}
        />
      )}

      {showDeleteModal && (
        <DeleteUserModal closeModal={closeDeleteModal} />
      )}

      {showFilterModal && (
        <FilterModal closeModal={closeFilterModal} />
      )}

    </div>
  );
}