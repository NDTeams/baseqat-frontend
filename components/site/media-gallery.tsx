'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faImages } from '@fortawesome/free-solid-svg-icons';
import { MediaCenterService, type MediaItem } from '@/services/media-center/page';
import { getFileUrl } from '@/lib/config';

export default function MediaGallery() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    MediaCenterService.getActiveByType(0)
      .then((res) => {
        if (res.succeeded && res.data) setItems(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const prev = () => setCurrentIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === items.length - 1 ? 0 : i + 1));

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
        <FontAwesomeIcon icon={faImages} className="text-4xl" />
        <p className="text-lg font-semibold">لا توجد صور حالياً</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="relative group overflow-hidden rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => { setCurrentIndex(idx); setOpen(true); }}
          >
            <img
              src={item.imageUrl ? getFileUrl(item.imageUrl) : '/site/logo.png'}
              alt={item.title}
              className={`w-full h-64 transition-transform duration-500 group-hover:scale-105 ${item.imageUrl ? 'object-cover' : 'object-contain p-8 bg-slate-50'}`}
            />
            <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-800/90 text-emerald-700 dark:text-emerald-400 text-sm font-semibold px-3 py-1 rounded-full">
              {item.title}
            </span>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <img
              src={items[currentIndex].imageUrl ? getFileUrl(items[currentIndex].imageUrl!) : '/site/logo.png'}
              alt={items[currentIndex].title}
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 text-slate-900 px-4 py-2 rounded-lg font-semibold">
              {items[currentIndex].title}
            </div>

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-white text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ×
            </button>

            {/* Nav */}
            <button
              onClick={prev}
              className="absolute top-1/2 left-2 -translate-y-1/2 text-white text-3xl font-bold bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-white text-3xl font-bold bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ›
            </button>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4 overflow-x-auto justify-center px-2">
              {items.map((item, idx) => (
                <img
                  key={item.id}
                  src={item.imageUrl ? getFileUrl(item.imageUrl) : '/site/logo.png'}
                  alt={item.title}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-20 h-16 object-cover rounded-lg cursor-pointer border-2 transition-colors ${
                    idx === currentIndex ? 'border-emerald-500' : 'border-transparent hover:border-emerald-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
