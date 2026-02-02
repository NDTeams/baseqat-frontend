"use client";

import { createContext, useState, ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  weight: ["300","400","500","600","700","800","900"],
});

// ✅ تم إصلاح المشكلة: استخدام _lang أو إزالة المعامل
export const LanguageContext = createContext({
  language: "en",
  setLanguage: (_lang: string) => {}, // وضع _ قبل المعامل
});

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("ar");

  return (
    <html className={cairo.className} lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
      <body className="flex h-screen bg-card dark:bg-black dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageContext.Provider value={{ language, setLanguage }}>
            <div className="flex h-screen bg-card">
              <main className="flex-1 flex flex-col">

                {/* Header */}
                <div className="sticky top-0 z-[1000]"></div>

                {/* Main Content */}
                <section className="flex-1">{children}</section>

                {/* Footer */}
                <div className="bg-card"></div>
              </main>
            </div>
          </LanguageContext.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}