"use client";

import { createContext, useState, ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Cairo } from "next/font/google";

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

  return (
    <html
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={`${cairo.className} font-cairo flex-1 h-screen bg-card dark:bg-black dark:text-white`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageContext.Provider value={{ language, setLanguage }}>
            <div className="flex h-screen bg-card">
              <main className="flex-1 flex flex-col">

                {/* Header */}
                <div className="sticky top-0 z-[1000]">
                  {/* <Header /> */}
                </div>

                {/* Main Content */}
                <div className="flex-1 font-cairo">
                  {children}
                </div>

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
