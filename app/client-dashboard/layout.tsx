"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import "@/app/(site)/globals.css";
import { Cairo } from "next/font/google";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import StudentSidebar from "@/components/client-dashboard/sidebar";
import MobileBottomNav from "@/components/client-dashboard/mobile-bottom-nav";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const LanguageContext = createContext({
  language: "ar",
  setLanguage: (_lang: string) => {},
});

export default function StudentDashboardLayout({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("ar");
  const [grayscale, setGrayscale] = useState(false);

  useEffect(() => {
    if (grayscale) {
      document.body.classList.add("grayscale");
    } else {
      document.body.classList.remove("grayscale");
    }
  }, [grayscale]);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", language);
    html.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
  }, [language]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <div className={`${cairo.className} flex flex-col min-h-screen bg-gray-50`}>
          {/* Main Site Header */}
          <div className="sticky top-0 z-[1000]">
            <Header grayscale={grayscale} setGrayscale={setGrayscale} />
          </div>

          {/* Main Content with Sidebar */}
          <div className="flex flex-1 mt-28">
            {/* Desktop Sidebar */}
            <StudentSidebar />

            {/* Page Content */}
            <main className="flex-1 min-h-screen pb-20 lg:pb-0">
              <div className="container mx-auto px-4 md:px-6 py-8">
                {children}
              </div>
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav />

          {/* Footer */}
          <Footer />
        </div>
      </LanguageContext.Provider>
    </ThemeProvider>
  );
}
