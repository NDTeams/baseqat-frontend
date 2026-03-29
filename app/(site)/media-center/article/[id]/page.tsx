'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faUser,
  faClock,
  faTag,
  faArrowRight,
  faSpinner,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { MediaCenterService, type MediaItem } from '@/services/media-center/page';
import { getFileUrl } from '@/lib/config';
import CoursesHeader from '@/components/site/courses-header';

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  let videoId = '';
  // Handle youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) videoId = shortMatch[1];
  // Handle youtube.com/watch?v=VIDEO_ID
  const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (longMatch) videoId = longMatch[1];
  // Handle youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch) videoId = embedMatch[1];
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = Number(params.id);

  const [article, setArticle] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!articleId) return;
    setLoading(true);
    setError(false);
    MediaCenterService.getActiveById(articleId)
      .then((res) => {
        if (res.succeeded && res.data) {
          setArticle(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [articleId]);

  if (loading) {
    return (
      <main>
        <CoursesHeader subtitle="المركز الإعلامي" title="تفاصيل المقال" description="" />
        <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin" />
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main>
        <CoursesHeader subtitle="المركز الإعلامي" title="تفاصيل المقال" description="" />
        <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center gap-4">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-4xl text-red-500" />
          <p className="text-lg text-gray-600 dark:text-gray-400">لم يتم العثور على المقال</p>
          <Link
            href="/media-center"
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            العودة للمركز الإعلامي
          </Link>
        </div>
      </main>
    );
  }

  const embedUrl = article.videoUrl ? getYouTubeEmbedUrl(article.videoUrl) : null;

  return (
    <main>
      <CoursesHeader subtitle="المركز الإعلامي" title={article.title} description="" />

      <div className="min-h-screen bg-white dark:bg-slate-900 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/media-center"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold mb-8 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
            العودة للمركز الإعلامي
          </Link>

          {/* Hero Image */}
          {article.imageUrl && (
            <div className="relative rounded-2xl overflow-hidden shadow-lg mb-8">
              <img
                src={getFileUrl(article.imageUrl)}
                alt={article.title}
                className="w-full h-64 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-slate-700">
            {article.createdAt && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-blue-600" />
                <span>{new Date(article.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
            {article.author && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-blue-600" />
                <span>{article.author}</span>
              </div>
            )}
            {article.readingTimeMinutes && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-blue-600" />
                <span>{article.readingTimeMinutes} دقيقة قراءة</span>
              </div>
            )}
            {article.category && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faTag} className="w-4 h-4 text-blue-600" />
                <span>{article.category}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {article.description && (
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8 font-medium">
              {article.description}
            </p>
          )}

          {/* YouTube Video */}
          {embedUrl && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faYoutube} className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">فيديو</h3>
              </div>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={embedUrl}
                  title={article.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Non-YouTube Video Link */}
          {article.videoUrl && !embedUrl && (
            <div className="mb-8">
              <a
                href={article.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-semibold"
              >
                <FontAwesomeIcon icon={faYoutube} className="w-5 h-5" />
                مشاهدة الفيديو
              </a>
            </div>
          )}

          {/* Article Content */}
          {article.content && (
            <div className="prose prose-lg prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-loose whitespace-pre-line">
              {article.content}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
