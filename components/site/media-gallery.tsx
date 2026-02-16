'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface GalleryItem {
  img: string;
  label: string;
}

const galleryItems: GalleryItem[] = [
  {
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80',
    label: 'Workshop Session',
  },
  {
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80',
    label: 'Team Collaboration',
  },
  {
    img: 'https://images.unsplash.com/photo-1557804506-669714d2e9d8?auto=format&fit=crop&w=1800&q=80',
    label: 'Launch Event',
  },
  {
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80',
    label: 'Networking Session',
  },
  {
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80',
    label: 'Team Building',
  },
  {
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80',
    label: 'Workshop Activity',
  },
];

export default function MediaGallery() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () =>
    setCurrentIndex((i) => (i === 0 ? galleryItems.length - 1 : i - 1));
  const next = () =>
    setCurrentIndex((i) => (i === galleryItems.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-8">
      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item, idx) => (
          <div
            key={idx}
            className="relative group overflow-hidden rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => {
              setCurrentIndex(idx);
              setOpen(true);
            }}
          >
            <img
              src={item.img}
              alt={item.label}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-800/90 text-emerald-700 dark:text-emerald-400 text-sm font-semibold px-3 py-1 rounded-full">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <img
              src={galleryItems[currentIndex].img}
              alt={galleryItems[currentIndex].label}
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 text-slate-900 px-4 py-2 rounded-lg font-semibold">
              {galleryItems[currentIndex].label}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-white text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ×
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prev}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white text-3xl font-bold bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white text-3xl font-bold bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ›
            </button>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4 overflow-x-auto justify-center px-2">
              {galleryItems.map((item, idx) => (
                <img
                  key={idx}
                  src={item.img}
                  alt={item.label}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-20 h-16 object-cover rounded-lg cursor-pointer border-2 transition-colors ${
                    idx === currentIndex
                      ? 'border-emerald-500'
                      : 'border-transparent hover:border-emerald-300'
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
