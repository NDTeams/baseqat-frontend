"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCalendar, faUser, faClock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { MediaCenterService, type MediaItem } from "@/services/media-center/page";
import { getFileUrl } from "@/lib/config";

export default function ArticlesSection() {
  const [articles, setArticles] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MediaCenterService.getActiveByType(1)
      .then((res) => {
        if (res.succeeded && res.data) setArticles(res.data.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
  };

  if (loading) {
    return (
      <section className="bg-white py-16 w-full">
        <div className="flex justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary" />
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="bg-white py-16 w-full">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-12">
        <div className="text-center mb-8">
          <span className="text-sm font-semibold text-primary">المركز الإعلامي</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">أحدث المقالات</h2>
          <p className="text-slate-500 mt-3 text-base">اطّلع على آخر المقالات والأخبار من فريق باسقات</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/media-center/article/${article.id}`}>
              <article className="group h-full flex flex-col bg-white rounded-2xl shadow-md hover:shadow-lg border border-slate-100 overflow-hidden transition-all duration-300 hover:translate-y-[-4px]">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={article.imageUrl ? getFileUrl(article.imageUrl) : "/site/logo.png"}
                    alt={article.title}
                    className={`w-full h-full transition-transform duration-500 group-hover:scale-110 ${article.imageUrl ? "object-cover" : "object-contain p-8"}`}
                  />
                  {article.category && (
                    <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  )}
                </div>

                <div className="flex-1 p-5 flex flex-col">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3" suppressHydrationWarning>
                    {article.createdAt && (
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendar} className="text-[10px]" />
                        {formatDate(article.createdAt)}
                      </span>
                    )}
                    {article.author && (
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faUser} className="text-[10px]" />
                        {article.author}
                      </span>
                    )}
                    {article.readingTimeMinutes != null && article.readingTimeMinutes > 0 && (
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                        {article.readingTimeMinutes} د
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {article.title}
                  </h3>

                  {article.description && (
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">{article.description}</p>
                  )}

                  <span className="text-emerald-600 font-semibold text-sm flex items-center gap-2">
                    اقرأ المقال
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/media-center"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition"
          >
            المزيد من المقالات
            <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}
