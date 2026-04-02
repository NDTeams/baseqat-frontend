'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faClock, faSpinner, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { MediaCenterService, type MediaItem } from '@/services/media-center/page';
import { getFileUrl } from '@/lib/config';

export default function MediaArticles() {
  const [articles, setArticles] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MediaCenterService.getActiveByType(1)
      .then((res) => {
        if (res.succeeded && res.data) setArticles(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
        <FontAwesomeIcon icon={faNewspaper} className="text-4xl" />
        <p className="text-lg font-semibold">لا توجد مقالات حالياً</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.id} href={`/media-center/article/${article.id}`}>
            <article className="group h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg dark:shadow-slate-900/50 overflow-hidden transition-all duration-300 hover:translate-y-[-4px]">
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={article.imageUrl ? getFileUrl(article.imageUrl) : '/site/logo.png'}
                  alt={article.title}
                  className={`w-full h-full transition-transform duration-500 group-hover:scale-110 ${article.imageUrl ? 'object-cover' : 'object-contain p-8'}`}
                />
                {article.category && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col">
                {/* Metadata */}
                <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {article.createdAt && (
                    <div className="flex items-center gap-2" suppressHydrationWarning>
                      <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  )}
                  {article.author && (
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                      <span>{article.author}</span>
                    </div>
                  )}
                  {article.readingTimeMinutes != null && article.readingTimeMinutes > 0 && (
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                      <span>{article.readingTimeMinutes} دقيقة قراءة</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {article.title}
                </h3>

                {/* Description */}
                {article.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 flex-grow">
                    {article.description}
                  </p>
                )}

                {/* Read More */}
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm flex items-center gap-2 group/btn">
                  اقرأ المقال
                  <span className="group-hover/btn:-translate-x-1 transition-transform">←</span>
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
