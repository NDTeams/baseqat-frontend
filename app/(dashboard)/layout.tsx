"use client";

import { createContext, useState, ReactNode } from "react";
import "./globals.css";
import { Cairo } from "next/font/google";
import Sidebar from "@/components/(dashboard)/sidebar";
import Header from "@/components/(dashboard)/header";

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

  return (
    <html className={cairo.className} lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
      <body className="flex h-screen bg-gray-50 ">
          <LanguageContext.Provider value={{ language, setLanguage }}>
            <div className="flex h-screen bg-gray-50">
        {/* <!-- Mobile Overlay --> */}
        <div  className="sidebar-overlay"></div>
        
        {/* <!-- Right Sidebar --> */}
       <Sidebar />

        {/* <!-- Main Content --> */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>

        </div>
    </div>
          </LanguageContext.Provider>
      </body>
    </html>
  );
}