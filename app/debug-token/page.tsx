"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function DebugToken() {
  const [meData, setMeData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read user data from localStorage
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUserData(JSON.parse(stored));
    } catch {}

    // Verify auth via HttpOnly cookie using /Account/Me
    api.get("/Account/Me")
      .then((res) => {
        if (res.data.succeeded) {
          setMeData(res.data.data);
        } else {
          setError("فشل جلب بيانات المستخدم");
        }
      })
      .catch((err) => {
        setError(
          err.response?.status === 401
            ? "غير مصادق - الرجاء تسجيل الدخول"
            : "خطأ في الاتصال: " + (err.message || "")
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">
            معلومات المصادقة (Debug)
          </h1>

          <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-700">
              التوكنات محفوظة في HttpOnly Cookies ولا يمكن قراءتها من JavaScript.
              يتم التحقق عبر <code className="bg-white px-2 py-1 rounded font-mono">/Account/Me</code>
            </p>
          </div>

          {loading && <div className="text-center py-8 text-slate-500">جاري التحقق...</div>}

          {error && (
            <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-lg mb-6">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {userData && (
            <div className="bg-amber-50 border-r-4 border-amber-500 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-bold text-amber-700 mb-2">بيانات localStorage:</h2>
              <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          )}

          {meData && (
            <div className="bg-emerald-50 border-r-4 border-emerald-500 p-4 rounded-lg">
              <h2 className="text-lg font-bold text-emerald-700 mb-2">بيانات من API (HttpOnly Cookie):</h2>
              <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(meData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
