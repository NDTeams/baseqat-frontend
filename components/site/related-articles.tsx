"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function RelatedArticles() {
  const { t } = useTranslation();

  const articles = t("relatedArticles.items", { returnObjects: true }) as {
    category: string;
    title: string;
    date: string;
    href: string;
  }[];

  return (
    <section className="bg-white w-full my-8 rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-5">
      <h3 className="text-xl font-bold text-slate-900">{t("relatedArticles.title")}</h3>

      <div className="grid md:grid-cols-3 gap-4">
        {articles.map((article, idx) => (
          <Link
            key={idx}
            className="block p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:shadow transition"
            href={article.href}
          >
            <div className="text-sm font-semibold text-emerald-700 mb-1">{article.category}</div>
            <div className="font-bold text-slate-900">{article.title}</div>
            <div className="text-xs text-slate-500 mt-2">{article.date}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
