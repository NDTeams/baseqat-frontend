'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faCheckCircle,
  faTimesCircle,
  faDesktop,
  faMobileAlt,
  faTabletAlt,
  faHistory,
  faFilter,
  faArrowRight,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { LoginLogsService } from '@/services/dashboard/login-logs/page';

interface LoginLog {
  id: number;
  userId: string | null;
  email: string;
  ipAddress: string | null;
  browser: string | null;
  deviceType: string | null;
  isSuccess: boolean;
  failureReason: string | null;
  createdAt: string;
}

function LoginLogsPageInner() {
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get('userId');
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(15);
  const [filterSuccess, setFilterSuccess] = useState<string>('');
  const [filterDeviceType, setFilterDeviceType] = useState('');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const params: Record<string, any> = {
        pageNumber: currentPage,
        pageSize: pageSize,
      };
      if (searchQuery) params.email = searchQuery;
      if (filterSuccess !== '') params.isSuccess = filterSuccess === 'true';
      if (filterDeviceType) params.deviceType = filterDeviceType;
      if (filterFromDate) params.fromDate = filterFromDate;
      if (filterToDate) params.toDate = filterToDate;

      const response = userIdParam
        ? await LoginLogsService.getByUser(userIdParam, params)
        : await LoginLogsService.getAll(params);

      if (response.succeeded && Array.isArray(response.data)) {
        setLogs(response.data);
        setTotalCount(response.totalCount || 0);
      } else {
        setLogs([]);
        setTotalCount(0);
      }
    } catch {
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, filterSuccess, filterDeviceType, filterFromDate, filterToDate, userIdParam]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchLogs();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const getDeviceIcon = (deviceType: string | null) => {
    switch (deviceType) {
      case 'Mobile': return faMobileAlt;
      case 'Tablet': return faTabletAlt;
      default: return faDesktop;
    }
  };

  const getDeviceLabel = (deviceType: string | null) => {
    switch (deviceType) {
      case 'Mobile': return 'جوال';
      case 'Tablet': return 'تابلت';
      case 'Desktop': return 'كمبيوتر';
      default: return '-';
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {userIdParam && (
            <Link
              href="/login-logs"
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
              title="عرض كل السجلات"
            >
              <FontAwesomeIcon icon={faArrowRight} className="text-gray-600" />
            </Link>
          )}
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faHistory} className="text-emerald-700" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {userIdParam ? 'سجل دخول المستخدم' : 'سجل تسجيلات الدخول'}
            </h1>
            <p className="text-sm text-gray-500">
              {userIdParam
                ? `عرض سجل تسجيلات الدخول للمستخدم`
                : 'تتبع جميع محاولات تسجيل الدخول'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition ${showFilters ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        >
          <FontAwesomeIcon icon={faFilter} />
          الفلاتر
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="بحث بالبريد الإلكتروني..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
          />
          <button onClick={handleSearch} className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-4 flex flex-wrap gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <select
            value={filterSuccess}
            onChange={(e) => { setFilterSuccess(e.target.value); setCurrentPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">كل الحالات</option>
            <option value="true">ناجح</option>
            <option value="false">فاشل</option>
          </select>

          <select
            value={filterDeviceType}
            onChange={(e) => { setFilterDeviceType(e.target.value); setCurrentPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">كل الأجهزة</option>
            <option value="Desktop">كمبيوتر</option>
            <option value="Mobile">جوال</option>
            <option value="Tablet">تابلت</option>
          </select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">من:</span>
            <input
              type="date"
              value={filterFromDate}
              onChange={(e) => { setFilterFromDate(e.target.value); setCurrentPage(1); }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">إلى:</span>
            <input
              type="date"
              value={filterToDate}
              onChange={(e) => { setFilterToDate(e.target.value); setCurrentPage(1); }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-right font-semibold text-gray-600">البريد الإلكتروني</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">عنوان IP</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">المتصفح</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">الجهاز</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">الحالة</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">سبب الفشل</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">التاريخ والوقت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  <FontAwesomeIcon icon={faHistory} className="text-3xl mb-2" />
                  <p>لا توجد سجلات</p>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">{log.email}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600" dir="ltr">{log.ipAddress || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{log.browser || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-gray-600">
                      <FontAwesomeIcon icon={getDeviceIcon(log.deviceType)} className="text-gray-400" />
                      {getDeviceLabel(log.deviceType)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {log.isSuccess ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">
                        <FontAwesomeIcon icon={faCheckCircle} />
                        ناجح
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium">
                        <FontAwesomeIcon icon={faTimesCircle} />
                        فاشل
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-red-500 text-xs max-w-[200px] truncate">{log.failureReason || '-'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('ar-SA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && totalCount > 0 && (
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            عرض {((currentPage - 1) * pageSize) + 1} إلى {Math.min(currentPage * pageSize, totalCount)} من أصل {totalCount} سجل
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
            >
              السابق
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
              let page: number;
              if (totalPages <= 5) {
                page = idx + 1;
              } else if (currentPage <= 3) {
                page = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + idx;
              } else {
                page = currentPage - 2 + idx;
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition ${currentPage === page ? 'bg-emerald-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function LoginLogsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" /></div>}>
      <LoginLogsPageInner />
    </Suspense>
  );
}
