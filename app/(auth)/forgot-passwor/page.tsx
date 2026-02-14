"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { AuthService } from "@/services/auth/page";
import ModalMessage from "@/components/modal-message";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success" as "success" | "error" | "warning",
    title: "",
    message: "" as string | string[],
  });

  const showModal = (
    type: "success" | "error" | "warning",
    title: string,
    message: string | string[]
  ) => {
    setModal({ isOpen: true, type, title, message });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleForgetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await AuthService.forgetPassword(email);

      if (response.succeeded) {
        showModal(
          "success",
          "تم الإرسال بنجاح",
          "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
        );
         setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const errors = response.errors || [response.message];
        showModal("error", "فشل العملية", errors);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "حدث خطأ في الاتصال بالخادم";
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
        autoClose={modal.type === "success" ? 3000 : 5000}
      />

      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.6] contrast-[1.2] saturate-[1.1] z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1491147334573-44cbb4602074?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black/25 z-10" />
        <div className="nature-background absolute inset-0 bg-green-500/50 opacity-50 z-20" />
      </div>

      <div className="canvas-layout relative z-30 flex flex-col md:flex-row min-h-screen w-full">
        {/* Left Side */}
        <div className="canvas-context flex-1 md:flex-[2] min-h-[40vh] md:min-h-screen p-4 md:p-0 flex items-center justify-center">
          <div className="context-container flex justify-center items-center flex-col text-center md:text-left">
            <div className="context-logo w-16 h-16 md:w-20 md:h-20 mb-4 flex items-center justify-center bg-white/10 rounded-[17px]">
              <FontAwesomeIcon
                icon={faLeaf}
                className="text-white text-3xl md:text-4xl"
              />
            </div>
            <h1 className="context-title text-2xl md:text-5xl lg:text-6xl text-white font-bold mb-2">
              الشركة
            </h1>
            <p className="context-subtitle text-base md:text-xl text-white/80">
              استعادة كلمة المرور
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex items-center justify-center p-4 md:ml-32 md:min-w-[400px]">
          <div className="login-card w-full max-w-md h-fit p-4 md:p-8 bg-white rounded-2xl shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                نسيت كلمة المرور؟
              </h2>
              <p className="text-gray-600">
                أدخل بريدك الإلكتروني لإرسال رابط إعادة التعيين
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleForgetPassword}>
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all duration-300"
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                  />
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white py-3 mt-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark"
                }`}
              >
                {isLoading ? "جاري الإرسال..." : "إرسال رابط الاستعادة"}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link href="/login" className="text-primary hover:underline text-sm">
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
