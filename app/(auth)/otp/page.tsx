"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
export default function OTPPage() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [showResend, setShowResend] = useState(false);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) {
      setShowResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Focus first input
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < inputsRef.current.length - 1) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const newOtp = [...otp];
    pastedData.forEach((digit, i) => (newOtp[i] = digit));
    setOtp(newOtp);
    const lastIndex = Math.min(pastedData.length - 1, inputsRef.current.length - 1);
    inputsRef.current[lastIndex]?.focus();
  };

  const handleResend = () => {
    setOtp(Array(6).fill(""));
    inputsRef.current[0]?.focus();
    setTimer(60);
    setShowResend(false);
    alert("تم إرسال رمز جديد إلى بريدك الإلكتروني");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length === 6) {
      alert("جاري التحقق...");
      setTimeout(() => {
        alert("تم التحقق بنجاح!");
        window.location.href = "/index"; // Redirect to dashboard
      }, 2000);
    } else {
      alert("يرجى إدخال الرمز المكون من 6 أرقام");
    }
  };

  return (
    <div className="font-cairo min-h-screen relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-[0.6] contrast-[1.2] saturate-[1.1] z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1491147334573-44cbb4602074?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="nature-background absolute inset-0"></div>
        <div className="nature-overlay absolute inset-0"></div>
        <div className="absolute inset-0 bg-black/25 z-10"></div>
        <div className="nature-background absolute inset-0 bg-green-500/50 opacity-50 z-20"></div>
      </div>

      {/* Main Layout */}
      <div className="relative z-30 flex flex-col md:flex-row min-h-screen">
        {/* Left Section */}
        <div className="flex-1 md:flex-[2] min-h-[40vh] md:min-h-screen flex items-center justify-center p-4 md:p-0">
          <div className="context-container text-white flex justify-center items-center flex-col text-center md:text-left">
            <div className="context-logo w-16 h-16 md:w-20 md:h-20 mb-4 md:mb-4 flex items-center justify-center bg-white/10 rounded-[17px]">
              <FontAwesomeIcon icon={faShieldAlt} className="text-white text-3xl md:text-4xl" />
            </div>
            <h1 className="text-2xl md:text-5xl lg:text-6xl mb-2">الشركة</h1>
            <p className="text-base md:text-xl">التحقق من الرمز المرسل</p>
          </div>
        </div>

        {/* OTP Section */}
        <div className="flex-1 md:flex-1 flex items-center justify-center p-4 md:ml-32 md:min-w-[400px]">
          <div className="otp-card w-full max-w-md h-fit p-4 md:p-8 bg-white rounded-xl shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">التحقق من الرمز</h2>
              <p className="text-gray-600">أدخل الرمز المرسل إلى بريدك الإلكتروني</p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  الرمز المكون من 6 أرقام
                </label>
                <div className="flex justify-center space-x-1 md:space-x-2 space-x-reverse">
                  {otp.map((value, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleChange(e, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      onPaste={handlePaste}
                      ref={(el) => (inputsRef.current[i] = el!)}
                      className={`otp-input w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl text-center border rounded-md ${
                        value ? "border-primary" : "border-gray-300"
                      }`}
                      required
                    />
                  ))}
                </div>
              </div>

              {/* Timer & Resend */}
              <div className="text-center">
                {!showResend && (
                  <p className="text-sm text-gray-600 mb-2">
                    لم تستلم الرمز؟{" "}
                    <span className="text-primary font-medium">
                      إعادة الإرسال خلال {timer} ثانية
                    </span>
                  </p>
                )}
                {showResend && (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    إعادة إرسال الرمز
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                className="w-full btn-primary text-white py-3 px-6 rounded-lg font-semibold text-lg"
              >
                التحقق من الرمز
              </button>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-primary hover:underline flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
                  العودة إلى تسجيل الدخول
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
