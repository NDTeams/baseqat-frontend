"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TeachersHeader from "./teachers-header";

interface GalleryItem {
  type: "image" | "video";
  src: string;      // رابط الصورة أو الفيديو
  thumb: string;    // صورة مصغرة (للفيديو أو الصورة الصغيرة)
  label: string;
}

const items: GalleryItem[] = [
  // صور
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1800&q=80",
    thumb: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=70",
    label: "ورشة منتج",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=80",
    thumb: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=70",
    label: "جلسة استشارية",
  },
  // فيديوهات
  {
    type: "video",
    src: "https://www.youtube.com/embed/ysz5S6PUM-U",
    thumb: "https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg",
    label: "جلسة تعريفية",
  },
  {
    type: "video",
    src: "https://www.youtube.com/embed/jNQXAC9IVRw",
    thumb: "https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg",
    label: "ملخص ورشة",
  },
];

export default function LightboxGallery() {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => setCurrentIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === items.length - 1 ? 0 : i + 1));

  return (
    <section className="bg-slate-50 w-full py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-12">
        <TeachersHeader
                expertsNetwork={t("videolibrary.badge")}
                specializedMentors={t("videolibrary.title")}
                teamDescription={t("videolibrary.description")}
              />
       
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="relative group cursor-pointer overflow-hidden rounded-2xl shadow border border-slate-100"
              onClick={() => { setCurrentIndex(idx); setOpen(true); }}
            >
              <div
                className="w-full h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${item.thumb})` }}
              ></div>
              {item.type === "video" && (
                <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center">
                  <span className="w-14 h-14 rounded-full bg-white/90 text-emerald-800 flex items-center justify-center text-xl font-bold">
                    ▶
                  </span>
                </div>
              )}
              <span className="absolute bottom-3 right-3 bg-white/80 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div className="fixed inset-0 z-[1200] w-screen h-screen bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center">
            {items[currentIndex].type === "image" ? (
              <img
                src={items[currentIndex].src}
                alt={items[currentIndex].label}
                className="w-full max-h-[85vh] object-contain rounded-lg shadow-lg"
              />
            ) : (
              <iframe
                src={items[currentIndex].src}
                title={items[currentIndex].label}
                className="w-full max-h-[85vh] rounded-lg shadow-lg"
                allowFullScreen
              ></iframe>
            )}

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 text-slate-900 px-4 py-2 rounded-lg font-semibold">
              {items[currentIndex].label}
            </div>

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70"
            >
              ×
            </button>

            {/* Prev / Next */}
            <button
              onClick={prev}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-4xl font-bold bg-black/50 rounded-full w-14 h-14 flex items-center justify-center hover:bg-black/70"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-4xl font-bold bg-black/50 rounded-full w-14 h-14 flex items-center justify-center hover:bg-black/70"
            >
              ›
            </button>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-6 overflow-x-auto justify-center px-2 w-full">
              {items.map((item, idx) => (
                <img
                  key={idx}
                  src={item.thumb}
                  alt={item.label}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-24 h-20 object-cover rounded-lg cursor-pointer border-2 ${
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
