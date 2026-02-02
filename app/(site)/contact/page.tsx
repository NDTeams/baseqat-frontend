"use client";

import React from "react";
import MessageForm from "@/components/(site)/message-form";
import ContactInfo from "@/components/(site)/contactInfo";
import ContactHeader from "@/components/(site)/contactheader";
import { useTranslation } from "react-i18next";
export default function ContactPage() {
      const { t } = useTranslation();
    
  return (
    <main className="pt-40 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-10">
         <ContactHeader
      subtitle={t("contactHeader.subtitle")}
      title={t("contactHeader.title")}
      description={t("contactHeader.description")}
    />


        <div className="grid lg:grid-cols-2 gap-8">
         <MessageForm />

          <ContactInfo />
           

          
        </div>
      </div>
    </main>
  );
}
