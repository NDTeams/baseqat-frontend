'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMapMarkerAlt, faClock, faArrowLeft, faSpinner, faCalendarXmark } from '@fortawesome/free-solid-svg-icons';
import { MediaCenterService, type MediaItem } from '@/services/media-center/page';
import { getFileUrl } from '@/lib/config';

export default function MediaEvents() {
  const [events, setEvents] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MediaCenterService.getActiveByType(2)
      .then((res) => {
        if (res.succeeded && res.data) setEvents(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const isUpcoming = (event: MediaItem) => {
    if (!event.eventDate) return false;
    return new Date(event.eventDate) >= new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
        <FontAwesomeIcon icon={faCalendarXmark} className="text-4xl" />
        <p className="text-lg font-semibold">لا توجد فعاليات حالياً</p>
      </div>
    );
  }

  const upcomingEvents = events.filter(isUpcoming);
  const pastEvents = events.filter((e) => !isUpcoming(e));

  const renderEventCard = (event: MediaItem, upcoming: boolean) => (
    <Link key={event.id} href={`/media-center/event/${event.id}`}>
      <div className={`group h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg dark:shadow-slate-900/50 overflow-hidden transition-all duration-300 ${
        upcoming ? 'hover:translate-y-[-4px] border-2 border-transparent hover:border-emerald-500/20' : 'opacity-90 hover:opacity-100'
      }`}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-slate-700">
          <img
            src={event.imageUrl ? getFileUrl(event.imageUrl) : '/site/logo.png'}
            alt={event.title}
            className={`w-full h-full transition-transform duration-500 group-hover:scale-110 ${
              event.imageUrl ? (upcoming ? 'object-cover' : 'object-cover opacity-75') : 'object-contain p-8'
            }`}
          />
          {event.category && (
            <div className="absolute top-4 right-4">
              <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {event.category}
              </span>
            </div>
          )}
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-block text-white text-xs font-bold px-3 py-1 rounded-full ${
              upcoming ? 'bg-blue-600' : 'bg-gray-600'
            }`}>
              {upcoming ? 'قادم' : 'منتهي'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {event.title}
          </h3>

          {/* Details */}
          <div className="space-y-3 mb-4 flex-grow">
            {event.eventDate && (
              <div className={`flex items-start gap-3 text-sm ${upcoming ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`} suppressHydrationWarning>
                <FontAwesomeIcon icon={faCalendar} className={`w-4 h-4 flex-shrink-0 mt-0.5 ${upcoming ? 'text-emerald-600' : ''}`} />
                <span>{formatDate(event.eventDate)}</span>
              </div>
            )}
            {event.eventTime && upcoming && (
              <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{event.eventTime}</span>
              </div>
            )}
            {event.eventLocation && (
              <div className={`flex items-start gap-3 text-sm ${upcoming ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                <FontAwesomeIcon icon={faMapMarkerAlt} className={`w-4 h-4 flex-shrink-0 mt-0.5 ${upcoming ? 'text-emerald-600' : ''}`} />
                <span>{event.eventLocation}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
              {event.description}
            </p>
          )}

          {/* CTA */}
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm flex items-center gap-2 group/btn">
            {upcoming ? 'التفاصيل' : 'عرض التفاصيل'}
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-12">
      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b-2 border-emerald-600 dark:border-emerald-500">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">الفعاليات القادمة</h3>
            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {upcomingEvents.length}
            </span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => renderEventCard(event, true))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-400 dark:border-gray-600">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">الفعاليات السابقة</h3>
            <span className="bg-gray-400 dark:bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {pastEvents.length}
            </span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => renderEventCard(event, false))}
          </div>
        </div>
      )}
    </div>
  );
}
