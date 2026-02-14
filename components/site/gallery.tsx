// components/CustomLightbox.tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface GalleryItem {
  img: string;
  label: string;
}

const galleryItems: GalleryItem[] = [
  { img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1800&q=80", label: "ورشة منتج" },
  { img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=80", label: "جلسة استشارية" },
  { img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1800&q=80", label: "جلسات فرق" },
  { img: "https://images.unsplash.com/photo-1529333166433-84c3c85d1c8d?auto=format&fit=crop&w=1800&q=80", label: "جلسة تفاعلية" },
  { img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1800&q=80", label: "تعاون" },
  { img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=80", label: "تجربة مستخدم" },
];

export default function CustomLightbox() {
    const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () =>
    setCurrentIndex((i) => (i === 0 ? galleryItems.length - 1 : i - 1));
  const next = () =>
    setCurrentIndex((i) => (i === galleryItems.length - 1 ? 0 : i + 1));

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
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-2xl shadow border border-slate-100 cursor-pointer"
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
              <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition"></div>
              <span className="absolute bottom-3 right-3 bg-white/80 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full">
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>
        {/* Lightbox */}
        {open && (
          <div className="fixed inset-0 z-[1200]  bg-black/90 h-[100%] flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full ">
              <img
                src={galleryItems[currentIndex].img}
                alt={galleryItems[currentIndex].label}
                className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 text-slate-900 px-4 py-2 rounded-lg font-semibold">
                {galleryItems[currentIndex].label}
              </div>

              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-2 right-2 text-white text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
              >
                ×
              </button>

              {/* Prev / Next */}
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

              {/* Thumbnails */}
              <div className="flex gap-2 mt-4 overflow-x-auto justify-center px-2">
                {galleryItems.map((item, idx) => (
                  <img
                    key={idx}
                    src={item.img}
                    alt={item.label}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-20 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                      idx === currentIndex
                        ? "border-emerald-500"
                        : "border-transparent"
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
