// components/News.tsx
"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import TeachersHeader from "@/components/site/teachers-header";

interface NewsItem {
  title: string;
  category: string;
  img: string;
  author: string;
  date: string;
  desc: string;
}

const news: NewsItem[] = [
  {
    title: "إطلاق دفعة تسريع جديدة لمنتجات SaaS",
    category: "برامجنا",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    author: "فريق باسقات",
    date: "13/07/2025",
    desc: "نرافق مؤسسي المنتجات الرقمية في رحلة تسريع شاملة تشمل النمو والمنتج والمبيعات.",
  },
  {
    title: "كيف تختبر شريحة العملاء خلال أسبوع",
    category: "نمو السوق",
    img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=600&q=80",
    author: "فريق النمو",
    date: "12/07/2025",
    desc: "نصائح عملية لاختبار شريحة العملاء بسرعة وفعالية.",
  },
  {
    title: "نماذج مالية جاهزة لعرض المستثمرين",
    category: "أبحاث",
    img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=600&q=80",
    author: "التمويل",
    date: "11/07/2025",
    desc: "نماذج جاهزة لتقديم خطة مالية واضحة للمستثمرين.",
  },
  {
    title: "خطة أول 90 يوماً لفرق المبيعات",
    category: "نصائح تشغيل",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    author: "التشغيل",
    date: "10/07/2025",
    desc: "خطة عملية لفرق المبيعات لتحقيق نتائج سريعة في أول 90 يومًا.",
  },
];

export default function News() {
  const [selectedIndex, setSelectedIndex] = useState(0); // الخبر الكبير الافتراضي
  const { t } = useTranslation();

  const selected = news[selectedIndex];

  return (
    <section className="bg-slate-50 py-16 w-full">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <TeachersHeader
        expertsNetwork={t("news.title")}
        specializedMentors={t("news.subtitle")}
        teamDescription={t("news.description") || ""}
      />
        {/* Header */}
       

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Big Feature News */}
          <article className="bg-slate-50 rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col">
            <div className="block cursor-pointer" onClick={() => setSelectedIndex(selectedIndex)}>
              <img
                src={selected.img}
                alt={selected.title}
                className="w-full h-72 object-cover"
              />
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col">
              <div className="flex items-center gap-3 text-sm text-primary font-semibold">
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  {selected.category}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                {selected.title}
              </h3>
              <p className="text-slate-600 text-sm leading-7">{selected.desc}</p>
              <ul className="flex items-center justify-between text-slate-500 text-sm mt-auto">
                <li>بواسطة: {selected.author}</li>
                <li className="font-semibold">التاريخ: {selected.date}</li>
              </ul>
            </div>
          </article>

          {/* Stacked List */}
          <div className="space-y-6">
            {news.map((item, index) => (
              <article
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex gap-4 bg-slate-50 rounded-2xl shadow border border-slate-100 overflow-hidden cursor-pointer transition ${
                  selectedIndex === index ? "border-emerald-500 shadow-lg" : ""
                }`}
              >
                <div
                  className="min-w-[120px] h-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.img})` }}
                ></div>
                <div className="p-4 space-y-2 flex-1">
                  <span className="text-xs font-semibold text-primary bg-emerald-100 px-2 py-1 rounded-full inline-flex">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <ul className="flex items-center justify-between text-slate-500 text-xs">
                    <li>بواسطة: {item.author}</li>
                    <li className="font-semibold">التاريخ: {item.date}</li>
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
