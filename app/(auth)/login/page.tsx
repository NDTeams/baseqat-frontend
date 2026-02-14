"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faEnvelope, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth/page";
import ModalMessage from "@/components/modal-message";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success" as "success" | "error" | "warning",
    title: "",
    message: "" as string | string[],
  });

  const router = useRouter();
  const togglePassword = () => setShowPassword(!showPassword);

  const showModal = (type: "success" | "error" | "warning", title: string, message: string | string[]) => {
    setModal({ isOpen: true, type, title, message });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await AuthService.login(email, password);

      if (response.succeeded) {
        if (response.data.token) {
          console.log("Received token:", response.data.token); // تحقق من وجود التوكن في الاستجابة
          localStorage.setItem("authToken", response.data.token);
        }
        if (response.data.roles) {
           console.log("User roles:", response.data.roles); // تحقق من وجود الأدوار في الاستجابة
        }
        if (response.data.isAuthenticated) {
          showModal(
            "success",
            "تسجيل الدخول بنجاح!",
            response.data.fullName
          );

        }


        setTimeout(() => {
          router.push("/student-dashboard");
        }, 1500);
      } else {
        const errorMessages = response.errors || [response.message];
        showModal("error", "فشل تسجيل الدخول", errorMessages);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "حدث خطأ في الاتصال بالخادم";
      showModal("error", "خطأ", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="canvas min-h-screen relative flex">
      <ModalMessage
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        autoClose={modal.type === "success" ? 0 : 5000}
      />

      {/* Full Page Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.6] contrast-[1.2] saturate-[1.1] z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1491147334573-44cbb4602074?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
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
            <p className="context-subtitle text-base md:text-xl text-white/80">تسجيل الدخول أو إنشاء حساب جديد</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 md:ml-32 md:min-w-[400px]">
          <div className="login-card w-full max-w-md h-fit p-4 md:p-8 bg-white rounded-2xl shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">تسجيل الدخول</h2>
              <p className="text-gray-600">
                مستخدم جديد؟{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">إنشاء حساب</Link>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">عنوان البريد الإلكتروني</label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all duration-300"
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                  />
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all duration-300"
                    placeholder="أدخل كلمة المرور"
                    required
                  />
                  <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={togglePassword}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                  <span className="mr-2 text-sm text-gray-600">تذكرني</span>
                </label>
                <Link href="/forgot-passwor" className="text-sm text-primary hover:underline">نسيت كلمة المرور؟</Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white py-3 mt-4 px-6 rounded-lg font-semibold text-lg transition-colors ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"
                  }`}
              >
                {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}