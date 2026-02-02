"use client"; 
import Coursessection from '@/components/(site)/coursessection';
import ContactHeader from '@/components/(site)/contactheader';
import { useTranslation } from 'react-i18next';
export default function CoursesArchive() {
    const { t } = useTranslation();
  return (
    <main className="pt-40 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-8">
      
         <ContactHeader
              subtitle={t("courses.subtitle")}
              title={t("courses.title")}
              description={t("courses.description")}
            />

        {/* Filters */}
        <Coursessection />
       
      </div>
    </main>
  );
}
