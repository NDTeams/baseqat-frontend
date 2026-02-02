"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUser, faClock } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export default function BlogArticle() {
  const { t } = useTranslation();

  return (
    <article className="bg-white mt-40 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* صورة المقال */}
      <div className="relative w-full h-80">
        <img
          src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80"
          alt={t("blog.imageAlt")}
          className="object-cover h-[380px] w-full"
        />
      </div>

      <div className="p-6 mt-14 sm:p-8 space-y-6">
        {/* معلومات المقال */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold text-xs">
            {t("blog.badge")}
          </span>
          <span>
            <FontAwesomeIcon icon={faCalendar} /> {t("blog.date")}
          </span>
          <span>
            <FontAwesomeIcon icon={faUser} /> {t("blog.author")}
          </span>
          <span>
            <FontAwesomeIcon icon={faClock} /> {t("blog.readingTime")}
          </span>
        </div>

        {/* العنوان والوصف */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {t("blog.title")}
        </h1>

        <p className="text-lg text-slate-700 leading-8">{t("blog.description")}</p>

        {/* اقتباس */}
        <blockquote className="border-r-4 border-emerald-500 bg-emerald-50 text-emerald-900 px-5 py-4 rounded-xl text-lg font-semibold">
          {t("blog.quote")}
        </blockquote>

        {/* محتوى المقال */}
        <div className="space-y-4 text-slate-700 leading-7">
          <h2 className="text-2xl font-bold text-slate-900">{t("blog.section1.title")}</h2>
          <p>{t("blog.section1.content")}</p>

          <h2 className="text-2xl font-bold text-slate-900">{t("blog.section2.title")}</h2>
          <p>{t("blog.section2.content")}</p>

          <h2 className="text-2xl font-bold text-slate-900">{t("blog.section3.title")}</h2>
          <p>{t("blog.section3.content")}</p>
        </div>

        {/* الوسوم */}
        <div className="flex flex-wrap gap-2 pt-4">
          <span className="text-sm font-semibold text-slate-600">{t("blog.tags.label")}</span>
          {t("blog.tags.items", { returnObjects: true }).map((tag: string, idx: number) => (
            <Link
              key={idx}
              className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm"
              href="#"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
