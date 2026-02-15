"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import { Cairo } from "next/font/google";
// import WhatsAppButton from "@/components/whatsapp-button";
const cairo = Cairo({
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const LanguageContext = createContext({
  language: "ar",
  setLanguage: (lang: string) => {},
});

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("ar");
  const [grayscale, setGrayscale] = useState(false);

  // تطبيق اللون الرمادي على <body>
  useEffect(() => {
    if (grayscale) {
      document.body.classList.add("grayscale");
    } else {
      document.body.classList.remove("grayscale");
    }
  }, [grayscale]);

  // ✅ تغيير اتجاه الصفحة كامل (html)
  useEffect(() => {
    const html = document.documentElement;

    html.setAttribute("lang", language);
    html.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
  }, [language]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <div
          className={`${cairo.className} font-cairo flex-1 h-screen bg-card dark:bg-black dark:text-white`}
        >
          <div className="flex-1 h-screen bg-card">
            <div className="flex-1 flex flex-col max-w-[100%] lg:max-w-[100vw]">

              {/* Header */}
              <div className="sticky top-0 z-[1000]">
                <Header 
                  grayscale={grayscale} 
                  setGrayscale={setGrayscale} 
                />
              </div>

              {/* Main Content */}
              <div className="flex-1 font-cairo mt-32">
                {children}
              </div>
               {/* <WhatsAppButton /> */}
              {/* Footer */}
              <Footer />
            </div>
          </div>
        </div>
      </LanguageContext.Provider>
    </ThemeProvider>
  );
}
