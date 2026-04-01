"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import "./globals.css";
import { Cairo } from "next/font/google";
import Sidebar from "@/components/student-dashboard/sidebar";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";

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
            {children}
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </LanguageContext.Provider>
  );
}
