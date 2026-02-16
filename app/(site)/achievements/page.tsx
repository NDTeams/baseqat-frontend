"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export default function AchievementsPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-5 sm:px-8 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-600 dark:from-emerald-900 dark:via-emerald-950 dark:to-emerald-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            إنجازات باسقات
          </h1>
          <p className="text-lg md:text-xl text-emerald-100">
            رحلة النجاح والتطور المستمر
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 space-y-16">
        {/* Achievements Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: "👥", value: "500+", label: "رائد أعمال تم تدريبهم" },
            { icon: "🚀", value: "150+", label: "شركة تم تسريعها" },
            { icon: "💰", value: "200M+", label: "ريال استثماري جذب" },
            { icon: "🌟", value: "98%", label: "معدل الرضا" },
          ].map((stat, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 md:p-8 text-center border border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-lg"
            >
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* Achievements Timeline */}
        <section className="space-y-12 py-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              مسيرتنا نحو التميز
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              نسعى باستمرار لتحقيق أهدافنا والمساهمة في نمو الاقتصاد السعودي
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                year: "2024",
                title: "تسريع 50 شركة جديدة",
                description: "تحقيق أرقام قياسية في تسريع الشركات الناشئة وتمويلها",
                icon: "🏆",
              },
              {
                year: "2023",
                title: "جذب 200 مليون ريال استثمارات",
                description: "ساعدنا رواد الأعمال في جذب استثمارات كبيرة من صناديق الاستثمار والمستثمرين",
                icon: "💎",
              },
              {
                year: "2022",
                title: "تدريب 300 رائد أعمال",
                description: "برامج تدريبية متخصصة في الريادة والابتكار والتحول الرقمي",
                icon: "📚",
              },
              {
                year: "2021",
                title: "إطلاق منصة باسقات الرقمية",
                description: "منصة متكاملة توفر جميع الخدمات والأدوات اللازمة لرواد الأعمال",
                icon: "🚀",
              },
            ].map((achievement, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  <div className="flex items-center gap-4 md:flex-col md:items-start">
                    <div className="text-5xl">{achievement.icon}</div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg">
                      {achievement.year}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Values Section */}
        <section className="space-y-12 py-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              ما يميزنا
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "💡",
                title: "الابتكار المستمر",
                desc: "نطور باستمرار برامجنا وخدماتنا لمواكبة احتياجات السوق المتغيرة",
              },
              {
                icon: "🎯",
                title: "التركيز على النتائج",
                desc: "كل برنامح مصمم لتحقيق نتائج ملموسة وقياسية",
              },
              {
                icon: "🤝",
                title: "الشراكات الاستراتيجية",
                desc: "نعمل مع أفضل الشركات والجهات الحكومية لتحقيق أهدافنا",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative space-y-4">
                  <div className="text-5xl">{value.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative py-16 px-8 md:px-16 bg-gradient-to-r from-gray-900 via-emerald-900 to-gray-900 dark:from-gray-950 dark:via-emerald-950 dark:to-gray-950 rounded-3xl text-white overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>

          <div className="relative text-center space-y-8 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              كن جزءاً من نجاحنا
            </h2>
            <p className="text-lg text-emerald-100">
              انضم إلى آلاف رواد الأعمال الذين حققوا أحلامهم معنا
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="/courses-archive"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                تصفح البرامج →
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 border-2 border-emerald-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                تواصل معنا ↗
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
