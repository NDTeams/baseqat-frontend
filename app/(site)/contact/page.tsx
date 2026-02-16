"use client";

import React from "react";
import MessageForm from "@/components/site/message-form";
import ContactInfo from "@/components/site/contactInfo";
import { useTranslation } from "react-i18next";
export default function ContactPage() {
      const { t } = useTranslation();
    
  return (
    <main className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-600 text-white">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 md:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100">
            {t("contactHeader.subtitle")}
          </p>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            {t("contactHeader.title")}
          </h1>
          <p className="mt-4 max-w-3xl text-emerald-100/90">
            {t("contactHeader.description")}
          </p>
        </div>
      </section>

      <section className="relative -mt-10 pb-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <MessageForm />
            <ContactInfo />
          </div>
        </div>
      </section>
    </main>
  );
}
