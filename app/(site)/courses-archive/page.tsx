"use client"; 
import Coursessection from '@/components/site/coursessection';
import CoursesHeader from '@/components/site/courses-header';
import { useTranslation } from 'react-i18next';

export default function CoursesArchive() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <CoursesHeader
        subtitle={t("courses.subtitle")}
        title={t("courses.title")}
        description={t("courses.description")}
      />

      {/* Courses Content */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
        <Coursessection />
      </div>
    </main>
  );
}
