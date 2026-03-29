'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faCalendarCheck,
  faClock,
  faMapMarkerAlt,
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
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) videoId = shortMatch[1];
  const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (longMatch) videoId = longMatch[1];
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch) videoId = embedMatch[1];
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = Number(params.id);

  const [event, setEvent] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    setError(false);
    MediaCenterService.getActiveById(eventId)
      .then((res) => {
        if (res.succeeded && res.data) {
          setEvent(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) {
    return (
      <main>
        <CoursesHeader subtitle="المركز الإعلامي" title="تفاصيل الفعالية" description="" />
        <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin" />
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main>
        <CoursesHeader subtitle="المركز الإعلامي" title="تفاصيل الفعالية" description="" />
        <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center gap-4">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-4xl text-red-500" />
          <p className="text-lg text-gray-600 dark:text-gray-400">لم يتم العثور على الفعالية</p>
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

  const isUpcoming = event.eventDate ? new Date(event.eventDate) >= new Date() : true;
  const embedUrl = event.videoUrl ? getYouTubeEmbedUrl(event.videoUrl) : null;

  return (
    <main>
      <CoursesHeader subtitle="المركز الإعلامي" title={event.title} description="" />

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
          {event.imageUrl && (
            <div className="relative rounded-2xl overflow-hidden shadow-lg mb-8">
              <img
                src={getFileUrl(event.imageUrl)}
                alt={event.title}
                className="w-full h-64 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span className={`inline-block text-white text-sm font-bold px-4 py-1.5 rounded-full ${isUpcoming ? 'bg-blue-600' : 'bg-gray-600'}`}>
                  {isUpcoming ? 'فعالية قادمة' : 'فعالية سابقة'}
                </span>
              </div>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {event.title}
          </h1>

          {/* Event Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {event.eventDate && (
              <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faCalendar} className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">تاريخ البداية</p>
                  <p className="text-base font-bold text-slate-800 dark:text-white">
                    {new Date(event.eventDate).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                  </p>
                </div>
              </div>
            )}
            {event.eventEndDate && (
              <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faCalendarCheck} className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">تاريخ الانتهاء</p>
                  <p className="text-base font-bold text-slate-800 dark:text-white">
                    {new Date(event.eventEndDate).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                  </p>
                </div>
              </div>
            )}
            {event.eventTime && (
              <div className="flex items-center gap-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-100 dark:border-amber-800/30">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-800/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faClock} className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">الوقت</p>
                  <p className="text-base font-bold text-slate-800 dark:text-white">{event.eventTime}</p>
                </div>
              </div>
            )}
            {event.eventLocation && (
              <div className="flex items-center gap-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-800/30">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">الموقع</p>
                  <p className="text-base font-bold text-slate-800 dark:text-white">{event.eventLocation}</p>
                </div>
              </div>
            )}
          </div>

          {/* Category */}
          {event.category && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-slate-700">
              <FontAwesomeIcon icon={faTag} className="w-4 h-4 text-blue-600" />
              <span>التصنيف: {event.category}</span>
            </div>
          )}

          {/* YouTube Video */}
          {embedUrl && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faYoutube} className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">فيديو الفعالية</h3>
              </div>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={embedUrl}
                  title={event.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Non-YouTube Video Link */}
          {event.videoUrl && !embedUrl && (
            <div className="mb-8">
              <a
                href={event.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-semibold"
              >
                <FontAwesomeIcon icon={faYoutube} className="w-5 h-5" />
                مشاهدة الفيديو
              </a>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="text-gray-700 dark:text-gray-200 text-lg leading-loose whitespace-pre-line">
              {event.description}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
