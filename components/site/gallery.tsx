"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faImages } from "@fortawesome/free-solid-svg-icons";
import { MediaCenterService, type MediaItem } from "@/services/media-center/page";
import { getFileUrl } from "@/lib/config";

export default function CustomLightbox() {
  const { t } = useTranslation();
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

  const getImage = (item: MediaItem) =>
    item.imageUrl ? getFileUrl(item.imageUrl) : "/site/logo.png";

  if (loading) {
    return (
      <section className="bg-slate-50 py-16">
        <div className="flex justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary" />
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-12">
        <div className="text-center mb-8">
          <span className="text-sm font-semibold text-primary">
            {t("gallery.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            {t("gallery.title")}
          </h2>
          <p className="text-slate-500 mt-3 text-base">
            {t("gallery.description")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="relative group overflow-hidden rounded-2xl shadow border border-slate-100 cursor-pointer"
              onClick={() => { setCurrentIndex(idx); setOpen(true); }}
            >
              <img
                src={getImage(item)}
                alt={item.title}
                className={`w-full h-64 transition-transform duration-500 group-hover:scale-105 ${item.imageUrl ? 'object-cover' : 'object-contain p-8 bg-slate-50'}`}
              />
              <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition" />
              <span className="absolute bottom-3 right-3 bg-white/80 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div className="fixed inset-0 z-[1200] bg-black/90 h-[100%] flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <img
              src={getImage(items[currentIndex])}
              alt={items[currentIndex].title}
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 text-slate-900 px-4 py-2 rounded-lg font-semibold">
              {items[currentIndex].title}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-white text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
            >
              ×
            </button>

            <button
              onClick={prev}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white text-3xl font-bold bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white text-3xl font-bold bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70"
            >
              ›
            </button>

            <div className="flex gap-2 mt-4 overflow-x-auto justify-center px-2">
              {items.map((item, idx) => (
                <img
                  key={item.id}
                  src={getImage(item)}
                  alt={item.title}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-20 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                    idx === currentIndex ? "border-emerald-500" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
