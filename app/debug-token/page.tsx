"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function DebugToken() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    try {
      const token = Cookies.get("auth_token");

      if (!token) {
        setError("لا يوجد توكن - الرجاء تسجيل الدخول");
        return;
      }

      // فك تشفير التوكن
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const payload = JSON.parse(jsonPayload);
      setTokenInfo(payload);
    } catch (err) {
      setError("خطأ في فك تشفير التوكن: " + err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">
            🔍 معلومات التوكن (Debug)
          </h1>

          {error && (
            <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-lg mb-6">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {tokenInfo && (
            <div>
              <div className="bg-emerald-50 border-r-4 border-emerald-500 p-4 rounded-lg mb-6">
                <h2 className="text-lg font-bold text-emerald-700 mb-2">
                  محتويات التوكن:
                </h2>
                <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm text-right">
                  {JSON.stringify(tokenInfo, null, 2)}
                </pre>
              </div>

              <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-lg">
                <h2 className="text-lg font-bold text-blue-700 mb-3">
                  المفاتيح الموجودة:
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(tokenInfo).map((key) => (
                    <div
                      key={key}
                      className="bg-white p-3 rounded-lg border border-slate-200"
                    >
                      <p className="text-xs text-slate-500">{key}:</p>
                      <p className="font-mono text-sm text-slate-800 truncate">
                        {typeof tokenInfo[key] === "object"
                          ? JSON.stringify(tokenInfo[key])
                          : String(tokenInfo[key])}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 border-r-4 border-yellow-500 p-4 rounded-lg">
                <h2 className="text-lg font-bold text-yellow-700 mb-2">
                  ملاحظة:
                </h2>
                <p className="text-sm text-slate-700">
                  ابحث عن مفتاح يحتوي على الدور (role) مثل: <br />
                  <code className="bg-white px-2 py-1 rounded text-emerald-700 font-mono">
                    role, Role, ROLE, user_role, userRole, roles
                  </code>
                  <br />
                  <br />
                  الأدوار المسموح لها بالوصول للوحة التحكم:
                  <br />
                  <code className="bg-white px-2 py-1 rounded text-emerald-700 font-mono">
                    admin, SUPERADMIN, BASEQATEMPLOYEE
                  </code>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
