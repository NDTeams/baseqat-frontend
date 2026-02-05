"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faEnvelope, faEye, faEyeSlash, faUser, faPhone } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth/page"; // تأكد أن التصدير في هذا الملف هو AuthService

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const togglePassword = () => setShowPassword(!showPassword);

  // دالة معالجة إرسال النموذج
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // جلب البيانات من الحقول بناءً على الـ "name"
    const formData = new FormData(e.currentTarget);
    
    // بناء الكائن بنفس الهيكل المطلوب بالضبط
    const userData = {
      email: formData.get("email"),
      fullName: formData.get("fullName"),
      phoneNumber: formData.get("phoneNumber"),
      password: formData.get("password")
    };

    try {
      // إرسال البيانات (ستذهب كـ JSON تلقائياً عبر axios)
      const response = await AuthService.register(userData);
      
      if (response) {
        alert("تم إنشاء الحساب بنجاح!");
        router.push("/login"); 
      }
    } catch (err: any) {
      // إظهار رسالة الخطأ القادمة من السيرفر (PHP) إن وجدت
      const errorMessage = err.response?.data?.message || "حدث خطأ أثناء التسجيل، حاول مرة أخرى.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="canvas min-h-screen relative flex">
      {/* Background Section - تصميمك الأصلي */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.6] contrast-[1.2] saturate-[1.1] z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1491147334573-44cbb4602074?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-black/25 z-10" />
        <div className="nature-background absolute inset-0 bg-green-500/50 opacity-50 z-20" />
      </div>

      <div className="canvas-layout relative z-30 flex flex-col md:flex-row min-h-screen w-full">
        <div className="canvas-context flex-1 md:flex-[2] min-h-[40vh] md:min-h-screen p-4 md:p-0 flex items-center justify-center">
          <div className="context-container flex justify-center items-center flex-col text-center md:text-left">
            <div className="context-logo w-16 h-16 md:w-20 md:h-20 mb-4 flex items-center justify-center bg-white/10 rounded-[17px]">
              <FontAwesomeIcon icon={faLeaf} className="text-white text-3xl md:text-4xl" />
            </div>
            <h1 className="context-title text-2xl md:text-5xl lg:text-6xl text-white font-bold mb-2">الشركة</h1>
            <p className="context-subtitle text-base md:text-xl text-white/80">إنشاء حساب جديد للبدء</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 md:ml-32 md:min-w-[400px]">
          <div className="login-card w-full max-w-md h-fit p-4 md:p-8 bg-white rounded-2xl shadow-lg">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">إنشاء حساب</h2>
              <p className="text-gray-600">
                لديك حساب بالفعل؟{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">تسجيل الدخول</Link>
              </p>
            </div>

            {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center font-medium">{error}</div>}

            <form className="space-y-2.5" onSubmit={handleRegister}>
              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">الاسم الكامل</label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all duration-300"
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                  <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">رقم الهاتف</label>
                <div className="relative">
                  <input
                    type="text"
                    name="phoneNumber"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all duration-300"
                    placeholder="أدخل رقم الهاتف"
                    required
                  />
                  <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">عنوان البريد الإلكتروني</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all duration-300"
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                  />
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all duration-300"
                    placeholder="أدخل كلمة المرور"
                    required
                  />
                  <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={togglePassword}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white py-3 mt-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                  isLoading ? "bg-gray-400" : "bg-primary hover:bg-primary-dark"
                }`}
              >
                {isLoading ? "جاري المعالجة..." : "إنشاء الحساب"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}