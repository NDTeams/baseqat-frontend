"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faEye,
  faEyeSlash,
  faArrowRight,
  faSpinner,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import authService from "@/services/auth/auth.service";

export default function LockScreen() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    let userData = authService.getCurrentUser();

    if (!userData) {
      userData = {
        id: "demo",
        name: "أحمد محمد",
        email: "admin@baseqat.com",
        role: "مدير النظام",
      };
    }

    setUser(userData);
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError("الرجاء إدخال كلمة المرور");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (user?.id === "demo") {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (password === "123456") {
          router.push("/index");
        } else {
          setError("كلمة المرور غير صحيحة. استخدم: 123456");
          setPassword("");
        }
      } else {
        const response = await authService.unlock({ password });

        if (response.succeeded) {
          router.push("/index");
        } else {
          setError(response.message || "كلمة المرور غير صحيحة");
          setPassword("");
        }
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchUser = () => {
    if (user?.id !== "demo") {
      authService.logout();
    }
    router.push("/login");
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`
      : name.substring(0, 2);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-emerald-700 text-4xl animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-8 px-4">
      {/* Logo Header */}
      <div className="absolute top-8 right-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden">
            <img
              src="/site/logo.png"
              alt="باسقات"
              className="w-full h-full object-contain p-1.5"
            />
          </div>
          <span className="text-xl font-bold text-slate-800">باسقات</span>
        </div>
      </div>

      {/* Lock Screen Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Card Body */}
          <div className="p-8 sm:p-12">
            {/* Lock Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faLock}
                  className="text-emerald-700 text-2xl"
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">
              الشاشة مقفلة!
            </h1>
            <p className="text-slate-500 text-center mb-8">
              أدخل كلمة المرور الخاصة بك لفتح الشاشة
            </p>

            {/* User Avatar & Info */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-emerald-100">
                  {getInitials(user.name)}
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white"></div>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                {user.name}
              </h2>
              <p className="text-sm text-slate-500">{user.role}</p>
            </div>

            {/* Unlock Form */}
            <form onSubmit={handleUnlock} className="space-y-4">
              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 text-right">
                  كلمة المرور <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="أدخل كلمة المرور"
                    disabled={loading}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-right outline-none transition ${
                      error
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="text-lg"
                    />
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-r-4 border-red-500 rounded-lg px-4 py-3 text-right">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Unlock Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3.5 rounded-xl transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    <span>جاري التحقق...</span>
                  </>
                ) : (
                  <>
                    <span>فتح القفل</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </>
                )}
              </button>
            </form>

            {/* Switch User Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 mb-2">لست أنت؟</p>
              <button
                onClick={handleSwitchUser}
                className="text-emerald-700 hover:text-emerald-800 font-semibold text-sm transition hover:underline"
              >
                العودة إلى تسجيل الدخول
              </button>
            </div>
          </div>

          {/* Card Footer */}
          <div className="bg-slate-50 border-t border-slate-200 px-8 py-4 text-center">
            <p className="text-xs text-slate-400">
              © 2026 باسقات. جميع الحقوق محفوظة
            </p>
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
            <FontAwesomeIcon icon={faUser} className="text-emerald-600" />
            <p className="text-xs text-slate-600">
              كلمة المرور التجريبية:{" "}
              <span className="font-mono font-bold text-emerald-700">
                123456
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
