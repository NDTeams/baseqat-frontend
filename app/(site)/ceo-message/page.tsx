"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function CEOMessagePage() {
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
            أ.بدرية الحجيلي
          </h1>
          <p className="text-lg md:text-2xl text-emerald-100">
            المدير العام
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 space-y-16">
        {/* CEO Message Content */}
        <section className="grid md:grid-cols-3 gap-12 items-center">
          {/* Image Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 dark:from-emerald-700 dark:to-emerald-900 rounded-3xl w-full aspect-square flex items-center justify-center overflow-hidden">
              <div className="text-white text-center">
                <div className="text-6xl mb-4">👩‍💼</div>
                <div className="text-lg font-semibold">أ.بدرية الحجيلي</div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                رسالة المدير العام
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed md:text-justify mb-6">
                نحن في رحلة مستمرة لتعزيز ثقافة الريادة من خلال شركتنا، لأننا نؤمن بأنها الطريقة الوحيدة لتحقيق التميز والنجاح المستدام. للفرد والمتجمع ونعمل بشكل مستمر على تكامل الابتكار والتنمية والتمكين.
              </p>
            </div>

            {/* Key Points */}
            <div className="grid sm:grid-cols-2 gap-6 pt-6">
              {[
                { icon: "🎯", title: "الرؤية الواضحة", desc: "نسعى لتحقيق التميز والابتكار المستمر" },
                { icon: "🚀", title: "التمكين", desc: "تمكين رواد الأعمال لتحقيق أحلامهم" },
                { icon: "💡", title: "الابتكار", desc: "البحث المستمر عن طرق جديدة وفعالة" },
                { icon: "🤝", title: "التعاون", desc: "العمل معاً لبناء مستقبل مزدهر" },
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="space-y-12 py-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              قيمنا الأساسية
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              نؤمن بمجموعة من القيم التي توجه عملنا وتحدد علاقاتنا مع شركائنا
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "⭐", title: "التميز", desc: "نسعى للتميز في كل جوانب عملنا وتقديم أفضل الخدمات" },
              { icon: "🌱", title: "التطور المستمر", desc: "الاستثمار في التنمية والابتكار المستمر" },
              { icon: "💎", title: "القيم الأخلاقية", desc: "الاستدامة والمسؤولية الاجتماعية في كل قراراتنا" },
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
              انضم إلى رحلتنا
            </h2>
            <p className="text-lg text-emerald-100">
              تحقيق التميز والابتكار يتطلب شراكة حقيقية. لنعمل معاً لبناء مستقبل أفضل
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                تواصل معنا →
              </a>
              <a
                href="/courses-archive"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 border-2 border-emerald-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                استكشف برامجنا ↗
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
