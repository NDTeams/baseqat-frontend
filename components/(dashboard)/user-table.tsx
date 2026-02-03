"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch, faChevronLeft, faChevronRight, faTh } from "@fortawesome/free-solid-svg-icons";

interface UserTableProps {
  users: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  usersPerPage: number;
  setUsersPerPage: (num: number) => void;
  openEditUserModal: (user: any) => void;
  openDeleteUserModal: (user: any) => void;
  toggleView: () => void;
  isTableView: boolean;
}

export default function UserTable({
  users,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  usersPerPage,
  setUsersPerPage,
  openEditUserModal,
  openDeleteUserModal,
  toggleView,
  isTableView
}: UserTableProps) {

  // تطبيق البحث
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="table-container" id="tableView">

      {/* --- البحث واختيار عدد العناصر --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">

        {/* البحث */}
        <div className="dataTables_filter relative flex-1 max-w-xs">
          <div className="relative">
            <input
              type="text"
              placeholder="البحث عن مستخدم"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* اختيار عدد العناصر */}
        <div className="dataTables_length flex items-center gap-2">
          <span className="text-sm text-gray-600">عرض</span>
          <select
            value={usersPerPage}
            onChange={(e) => {
              setUsersPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={filteredUsers.length}>الكل</option>
          </select>
          <span className="text-sm text-gray-600">مستخدم</span>
        </div>
      </div>
      {/* --- نهاية البحث واختيار العدد --- */}

      {/* الجدول */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-start">اسم المستخدم</th>
            <th className="p-2 text-start">الحالة</th>
            <th className="p-2 text-start">الصلاحيات</th>
            <th className="p-2 text-start">تاريخ الإضافة</th>
            <th className="p-2 text-start">العمليات</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="p-2">
                <div>
                  <div className="font-semibold text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </td>
              <td className="p-2">
                {user.status === "active" ? (
                  <span className="inline-flex gap-1 items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    نشط
                  </span>
                ) : (
                  <span className="inline-flex gap-1 items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    غير نشط
                  </span>
                )}
              </td>
              <td className="p-2 flex flex-wrap gap-1">
                {user.permissions.map((perm, idx) => (
                  <span
                    key={idx}
                    className={`inline-block px-2 py-1 m-0.5 bg-blue-100 text-blue-800 rounded-md text-xs font-medium ${
                      perm.includes("غير") ? "revoked" : ""
                    }`}
                  >
                    {perm}
                  </span>
                ))}
              </td>
              <td className="p-2">{user.date}</td>
              <td className="p-2 flex gap-2">
                <button className="text-blue-500" onClick={() => openEditUserModal(user)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="text-red-600" onClick={() => openDeleteUserModal(user)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* أسفل الجدول */}
      <div className="bottom flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
        {/* معلومات الصفوف */}
        <div className="dataTables_info text-sm text-gray-600">
          عرض {(indexOfFirstUser + 1)} إلى {Math.min(indexOfLastUser, filteredUsers.length)} من {filteredUsers.length} مستخدم
        </div>

        {/* Pagination */}
        <div className="dataTables_paginate flex items-center gap-2">
          {/* السابق */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`paginate_button px-3 py-1 rounded border font-medium ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>

          {/* الأرقام */}
          {[...Array(totalPages)].map((_, idx) => {
            const pageNumber = idx + 1;
            const isCurrent = currentPage === pageNumber;
            return (
              <button
                key={idx}
                onClick={() => paginate(pageNumber)}
                className={`paginate_button px-3 py-1 rounded border font-medium ${
                  isCurrent ? 'bg-[#30846C] border-[#30846C] text-white font-semibold' : 'hover:bg-gray-100'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* التالي */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`paginate_button px-3 py-1 rounded border font-medium ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>

        {/* زر تبديل العرض */}
        <div className="view-controls flex gap-2">
          <button title="عرض الشبكة" onClick={toggleView}>
            <FontAwesomeIcon icon={faTh} />
          </button>
        </div>
      </div>
    </div>
  );
}
