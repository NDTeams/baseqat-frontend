"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

const coursesData = [
  {
    title: "تحضير وملاءمة سوق",
    category: "تحضير السوق",
    price: "18,500 ر.س",
    duration: "4 أسابيع",
    rating: 5,
    img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80",
    desc: "تحقق سريع من جدوى الحل، تسعير، ورسالة تسويقية أولى مع خطة أسبوعية.",
  },
  {
    title: "تسريع + إطلاق",
    category: "تسريع وإطلاق",
    price: "42,000 ر.س",
    duration: "8 أسابيع",
    rating: 5,
    img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80",
    desc: "فريق تشغيلي يرافقك حتى أول عميل مدفوع، إعداد المبيعات وملف المستثمرين.",
  },
  {
    title: "تحول وتشغيل رقمي",
    category: "تحول رقمي",
    price: "حسب النطاق",
    duration: "12 أسبوعاً",
    rating: 5,
    img: "https://images.unsplash.com/photo-1529333166433-84c3c85d1c8d?auto=format&fit=crop&w=800&q=80",
    desc: "أتمتة العمليات، تكامل الأنظمة، ولوحات بيانات للإدارة والتحكم.",
  },
];

export default function CoursesSection() {
      const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("جميع التصنيفات");
  const [duration, setDuration] = useState("المدة");
  const [rating, setRating] = useState("التقييم");

  const filteredCourses = coursesData.filter((course) => {
    const matchSearch =
      course.title.includes(search) || course.desc.includes(search);

    const matchCategory =
      category === "جميع التصنيفات" || course.category === category;

    const matchDuration =
      duration === "المدة" || course.duration === duration;

    const matchRating =
      rating === "التقييم" || course.rating >= Number(rating[0]);

    return matchSearch && matchCategory && matchDuration && matchRating;
  });

  return (
    <>
      {/* Filters */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <input
          type="text"
          placeholder={t("programs.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
          >
            <option>{t("programs.allCategories")}</option>
            <option>{t("programs.marketPrep")}</option>
            <option>{t("programs.acceleration")}</option>
            <option>{t("programs.digitalTransformation")}</option>
          </select>

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
          >
            <option>{t("programs.duration")}</option>
            <option>4 {t("programs.weeks")}</option>
            <option>8 {t("programs.weeks")}</option>
            <option>12 {t("programs.weeks")}</option>
          </select>

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
          >
            <option>{t("programs.rating")}</option>
            <option>5 {t("programs.stars")}</option>
            <option>4+ {t("programs.stars")}</option>
            <option>3+ {t("programs.stars")}</option>
          </select>
        </div>
      </div>
    </section>

      {/* Cards */}
      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <article
              key={index}
              className="bg-white border border-slate-100 rounded-2xl shadow hover:-translate-y-1 hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={course.img}
                alt={course.title}
                className="w-full h-44 object-cover"
              />
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">
                    {course.category}
                  </span>
                  <span className="font-bold text-emerald-700">
                    {course.price}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-600 leading-6">
                  {course.desc}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{course.duration}</span>
                  <span>{"★".repeat(course.rating)}</span>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="col-span-full text-center text-slate-500">
            لا توجد نتائج مطابقة 🔍
          </p>
        )}
      </section>
    </>
  );
}
