"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import "./globals.css";
import { Cairo } from "next/font/google";
import Sidebar from "@/components/student-dashboard/sidebar";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeCircleCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  weight: ["300","400","500","600","700","800","900"],
});

export const LanguageContext = createContext({
  language: "en",
  setLanguage: (_lang: string) => {},
});

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("ar");
  const [grayscale, setGrayscale] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [showEmailAlert, setShowEmailAlert] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", language);
    html.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
  }, [language]);

  useEffect(() => {
    if (grayscale) {
      document.body.classList.add("grayscale");
    } else {
      document.body.classList.remove("grayscale");
    }
  }, [grayscale]);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.isEmailConfirmed === false) setEmailNotConfirmed(true);
    } catch {}
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className={`${cairo.className} flex flex-col min-h-screen bg-gray-50`}>
        {/* Header full width */}
        <div className="sticky top-0 z-[1000]">
          <Header grayscale={grayscale} setGrayscale={setGrayscale} />
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-1 bg-gray-50 overflow-hidden pt-[108px]">
          <Sidebar />
          <main className="flex-1 p-6">
            {/* Email Confirmation Warning */}
            {emailNotConfirmed && showEmailAlert && (
              <div className="mb-6 bg-amber-50 border border-amber-300 rounded-2xl px-5 py-4 flex items-center justify-between gap-4" dir="rtl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faEnvelopeCircleCheck} className="text-amber-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-800">بريدك الإلكتروني غير مؤكد</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      يرجى تأكيد بريدك الإلكتروني للاستفادة من جميع مزايا المنصة. تحقق من صندوق الوارد أو البريد غير المرغوب فيه.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmailAlert(false)}
                  className="text-amber-400 hover:text-amber-600 transition flex-shrink-0 p-1"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}
            {children}
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </LanguageContext.Provider>
  );
}
