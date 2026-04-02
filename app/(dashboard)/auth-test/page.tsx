'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck, faTimes, faSpinner, faRefresh,
  faKey, faServer, faUser, faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import api from '@/lib/axios';

interface TestResult {
  label: string;
  status: 'idle' | 'loading' | 'ok' | 'error';
  detail: string;
  httpStatus?: number;
  raw?: any;
}

export default function AuthTestPage() {
  const [userData, setUserData] = useState<any>(null);
  const [meData, setMeData] = useState<any>(null);
  const [meLoading, setMeLoading] = useState(true);
  const [results, setResults] = useState<TestResult[]>([
    { label: 'جلب أقسام الدورات (Admin)', status: 'idle', detail: 'GET /CourseCategory/GetAllAsync' },
    { label: 'جلب أقسام الدورات (Public)', status: 'idle', detail: 'GET /CourseCategory/GetAllHome' },
    { label: 'جلب المستخدمين', status: 'idle', detail: 'GET /Account/GetAllUsers' },
    { label: 'جلب المجموعات', status: 'idle', detail: 'GET /Role/GetAll' },
  ]);

  useEffect(() => {
    // Read user from localStorage
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUserData(JSON.parse(stored));
    } catch {}

    // Verify HttpOnly cookie via /Account/Me
    api.get('/Account/Me')
      .then(res => {
        if (res.data.succeeded) setMeData(res.data.data);
      })
      .catch(() => {})
      .finally(() => setMeLoading(false));
  }, []);

  const runTests = async () => {
    const endpoints = [
      { url: '/CourseCategory/GetAllAsync', params: { pageNumber: 1, pageSize: 5 } },
      { url: '/CourseCategory/GetAllHome', params: {} },
      { url: '/Account/GetAllUsers', params: { pageNumber: 1, pageSize: 5 } },
      { url: '/Role/GetAll', params: { pageNumber: 1, pageSize: 5 } },
    ];

    for (let i = 0; i < endpoints.length; i++) {
      setResults(prev => prev.map((r, idx) =>
        idx === i ? { ...r, status: 'loading', detail: endpoints[i].url } : r
      ));

      try {
        const res = await api.get(endpoints[i].url, { params: endpoints[i].params });
        setResults(prev => prev.map((r, idx) =>
          idx === i ? {
            ...r,
            status: 'ok',
            httpStatus: res.status,
            detail: endpoints[i].url,
            raw: JSON.stringify(res.data).slice(0, 200),
          } : r
        ));
      } catch (err: any) {
        const status = err.response?.status;
        const msg = err.response?.data?.message ?? err.message ?? 'خطأ غير معروف';
        setResults(prev => prev.map((r, idx) =>
          idx === i ? {
            ...r,
            status: 'error',
            httpStatus: status,
            detail: endpoints[i].url,
            raw: msg,
          } : r
        ));
      }
    }
  };

  const clearAll = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUserData(null);
    setMeData(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FontAwesomeIcon icon={faShieldHalved} className="text-primary" />
          تشخيص المصادقة
        </h1>
        <p className="text-gray-500 text-sm mt-1">فحص حالة المصادقة عبر HttpOnly Cookies</p>
      </div>

      {/* Auth Status */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <h2 className="font-bold text-gray-700 flex items-center gap-2">
          <FontAwesomeIcon icon={faKey} className="text-amber-500" />
          حالة المصادقة
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* HttpOnly Cookie Status */}
          <div className={`p-3 rounded-xl border-2 ${meData ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-gray-700">HttpOnly Cookie</span>
              {meLoading ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-blue-500" />
              ) : (
                <FontAwesomeIcon icon={meData ? faCheck : faTimes} className={meData ? 'text-blue-600' : 'text-red-500'} />
              )}
            </div>
            <p className="text-xs text-gray-500">
              {meLoading ? 'جاري التحقق...' : meData ? `مصادق كـ ${meData.userName}` : 'غير مصادق'}
            </p>
          </div>

          {/* localStorage */}
          <div className={`p-3 rounded-xl border-2 ${userData ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-gray-700">localStorage (user)</span>
              <FontAwesomeIcon icon={userData ? faCheck : faTimes} className={userData ? 'text-amber-500' : 'text-gray-400'} />
            </div>
            <p className="text-xs text-gray-500">
              {userData ? `${userData.name} (${userData.email})` : 'غير موجود'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(userData) && (
            <button onClick={clearAll}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200">
              مسح بيانات localStorage
            </button>
          )}
          {!meData && !meLoading && (
            <a href="/login" className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90">
              الذهاب لصفحة تسجيل الدخول
            </a>
          )}
        </div>
      </div>

      {/* API Tests */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-700 flex items-center gap-2">
            <FontAwesomeIcon icon={faServer} className="text-blue-500" />
            اختبار نقاط الـ API
          </h2>
          <button onClick={runTests}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
            <FontAwesomeIcon icon={faRefresh} />
            تشغيل الاختبارات
          </button>
        </div>

        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className={`p-3 rounded-xl border ${
              r.status === 'ok' ? 'border-blue-200 bg-blue-50'
              : r.status === 'error' ? 'border-red-200 bg-red-50'
              : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">{r.label}</span>
                <div className="flex items-center gap-2">
                  {r.httpStatus && (
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                      r.httpStatus < 300 ? 'bg-blue-200 text-blue-800'
                      : r.httpStatus === 401 ? 'bg-red-200 text-red-800'
                      : r.httpStatus === 403 ? 'bg-orange-200 text-orange-800'
                      : 'bg-gray-200 text-gray-700'
                    }`}>
                      {r.httpStatus}
                    </span>
                  )}
                  {r.status === 'loading' ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-blue-500" />
                  ) : r.status === 'ok' ? (
                    <FontAwesomeIcon icon={faCheck} className="text-blue-600" />
                  ) : r.status === 'error' ? (
                    <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-gray-300" />
                  )}
                </div>
              </div>
              <p className="text-xs font-mono text-gray-500 mt-1">{r.detail}</p>
              {r.raw && (
                <p className="text-xs text-gray-600 mt-1 bg-white/60 p-2 rounded-lg font-mono break-all">
                  {r.raw}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-2 flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} /> كيفية التفسير:</p>
        <ul className="space-y-1 list-disc list-inside text-xs">
          <li><strong>200</strong> - ناجح، الـ API يعمل بشكل صحيح</li>
          <li><strong>401</strong> - التوكن غير موجود أو منتهي الصلاحية</li>
          <li><strong>403</strong> - التوكن صحيح لكن حسابك ليس لديه صلاحية Admin</li>
          <li><strong>404</strong> - مسار الـ API غير صحيح</li>
          <li><strong>500</strong> - خطأ في السيرفر</li>
        </ul>
      </div>
    </div>
  );
}
