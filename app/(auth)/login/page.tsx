"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faSignInAlt,
  faSpinner,
  faCheckCircle,
  faShieldHalved,
  faGraduationCap,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth/page";
import ModalMessage from "@/components/modal-message";

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

  const validateForm = (): FieldErrors => {
    const newErrors: FieldErrors = {};

    if (!email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }

    if (!password.trim()) {
      newErrors.password = "كلمة المرور مطلوبة";
    }

    return newErrors;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.login(email, password, rememberMe);

      if (response.succeeded) {
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

  const getFieldBorderClass = (fieldName: keyof FieldErrors) => {
    if (submitted && errors[fieldName]) {
      return "border-red-400 shadow-sm shadow-red-100";
    }
    if (focusedField === fieldName) {
      return "border-emerald-500 shadow-sm shadow-emerald-100";
    }
    return "border-slate-200 hover:border-slate-300";
  };

  const getIconColorClass = (fieldName: keyof FieldErrors) => {
    if (submitted && errors[fieldName]) return "text-red-400";
    if (focusedField === fieldName) return "text-emerald-600";
    return "text-slate-400";
  };

  const features = [
    { icon: faGraduationCap, text: "دورات تدريبية متخصصة" },
    { icon: faComments, text: "استشارات احترافية" },
    { icon: faShieldHalved, text: "بيئة آمنة وموثوقة" },
  ];

  return (
    <div className="min-h-screen flex" dir="rtl">
      <ModalMessage
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        autoClose={modal.type === "success" ? 0 : 5000}
      />

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600" />

        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 rounded-full" />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
          {/* Logo */}
          <div className="mb-10">
            <Image
              src="/site/logo.png"
              alt="باسقات"
              width={180}
              height={72}
              className="h-16 w-auto brightness-0 invert"
            />
          </div>

          {/* Tagline */}
          <h2 className="text-3xl font-bold text-white text-center mb-3 leading-relaxed">
            مرحباً بعودتك
          </h2>
          <p className="text-emerald-100 text-center text-lg mb-12 max-w-sm leading-relaxed">
            سجل دخولك للوصول إلى دوراتك واستشاراتك
          </p>

          {/* Features */}
          <div className="space-y-5 w-full max-w-sm">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10"
              >
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={feature.icon} className="text-white text-lg" />
                </div>
                <span className="text-white font-medium">{feature.text}</span>
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-300 mr-auto text-sm" />
              </div>
            ))}
          </div>

          {/* Bottom decoration */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-emerald-200/60 text-sm">
            <div className="w-8 h-px bg-emerald-200/40" />
            <span>باسقات للتدريب والاستشارات</span>
            <div className="w-8 h-px bg-emerald-200/40" />
          </div>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 lg:px-12">
        <div className="w-full max-w-[460px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/site/logo.png"
              alt="باسقات"
              width={140}
              height={56}
              className="h-12 w-auto"
            />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faSignInAlt} className="text-emerald-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">تسجيل الدخول</h1>
              </div>
            </div>
            <p className="text-slate-500 text-sm">
              مستخدم جديد؟{" "}
              <Link href="/register" className="text-emerald-700 hover:text-emerald-800 font-semibold transition">
                إنشاء حساب
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <div className={`relative rounded-xl border-2 transition-all duration-200 ${getFieldBorderClass("email")}`}>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className={`text-sm transition-colors ${getIconColorClass("email")}`}
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (submitted) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className="w-full pr-10 pl-4 py-3 bg-transparent rounded-xl text-slate-700 placeholder-slate-400 text-sm outline-none"
                  placeholder="example@email.com"
                  dir="ltr"
                  style={{ textAlign: "right" }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              {submitted && errors.email && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                كلمة المرور <span className="text-red-500">*</span>
              </label>
              <div className={`relative rounded-xl border-2 transition-all duration-200 ${getFieldBorderClass("password")}`}>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <FontAwesomeIcon
                    icon={faLock}
                    className={`text-sm transition-colors ${getIconColorClass("password")}`}
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (submitted) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className="w-full pr-10 pl-11 py-3 bg-transparent rounded-xl text-slate-700 placeholder-slate-400 text-sm outline-none"
                  placeholder="أدخل كلمة المرور"
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  onClick={togglePassword}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-sm" />
                </button>
              </div>
              {submitted && errors.password && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-sm text-slate-600">تذكرني</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-emerald-700 hover:text-emerald-800 font-medium transition"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2.5 ${
                isLoading
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-700 text-white hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-200 active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">أو</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-slate-500">
            ليس لديك حساب؟{" "}
            <Link
              href="/register"
              className="text-emerald-700 font-semibold hover:text-emerald-800 transition"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
