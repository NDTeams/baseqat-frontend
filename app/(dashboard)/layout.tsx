"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import "./globals.css";
import { Cairo } from "next/font/google";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";

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

  // ✅ تغيير اتجاه الصفحة كامل (html)
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", language);
    html.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className={`${cairo.className} flex h-screen bg-gray-50`}>

        {/* Mobile Overlay */}
        <div className="sidebar-overlay"></div>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>

      </div>
    </LanguageContext.Provider>
  );
}
