"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faArrowLeft, faCalendar, faUser } from "@fortawesome/free-solid-svg-icons";
import { MediaCenterService, type MediaItem } from "@/services/media-center/page";
import { getFileUrl } from "@/lib/config";
import TeachersHeader from "@/components/site/teachers-header";

export default function News() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    MediaCenterService.getActive()
      .then((res) => {
        if (res.succeeded && res.data) {
          setItems(res.data.slice(0, 4));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" });
  };

  const getImage = (item: MediaItem) =>
    item.imageUrl ? getFileUrl(item.imageUrl) : "/site/logo.png";

  if (loading) {
    return (
      <section className="bg-slate-50 py-16 w-full">
        <div className="flex justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary" />
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  const selected = items[selectedIndex];

  return (
    <section className="bg-slate-50 py-16 w-full">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <TeachersHeader
          expertsNetwork="المركز الإعلامي"
          specializedMentors="آخر الأحداث والأخبار"
          teamDescription=""
        />

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Big Feature */}
          <Link href={`/media-center/${selected.mediaType === 2 ? 'event' : 'article'}/${selected.id}`}>
            <article className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-full">
              <div className="relative">
                <img
                  src={getImage(selected)}
                  alt={selected.title}
                  className={`w-full h-72 ${selected.imageUrl ? 'object-cover' : 'object-contain p-8 bg-slate-50'}`}
                />
                {selected.category && (
                  <span className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {selected.category}
                  </span>
                )}
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                  {selected.title}
                </h3>
                {selected.description && (
                  <p className="text-slate-600 text-sm leading-7 line-clamp-3">{selected.description}</p>
                )}
                <ul className="flex items-center justify-between text-slate-500 text-sm mt-auto" suppressHydrationWarning>
                  {selected.author && <li className="flex items-center gap-1.5"><FontAwesomeIcon icon={faUser} className="text-xs" /> {selected.author}</li>}
                  {selected.createdAt && <li className="flex items-center gap-1.5 font-semibold"><FontAwesomeIcon icon={faCalendar} className="text-xs" /> {formatDate(selected.createdAt)}</li>}
                </ul>
              </div>
            </article>
          </Link>

          {/* Stacked List */}
          <div className="space-y-6">
            {items.map((item, index) => (
              <article
                key={item.id}
                onClick={() => setSelectedIndex(index)}
                className={`flex gap-4 bg-white rounded-2xl shadow border border-slate-100 overflow-hidden cursor-pointer transition ${
                  selectedIndex === index ? "border-emerald-500 shadow-lg" : "hover:shadow-md"
                }`}
              >
                <div className="min-w-[120px] w-[120px] h-full">
                  <img
                    src={getImage(item)}
                    alt={item.title}
                    className={`w-full h-full min-h-[100px] ${item.imageUrl ? 'object-cover' : 'object-contain p-4 bg-slate-50'}`}
                  />
                </div>
                <div className="p-4 space-y-2 flex-1">
                  {item.category && (
                    <span className="text-xs font-semibold text-primary bg-emerald-100 px-2 py-1 rounded-full inline-flex">
                      {item.category}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <ul className="flex items-center justify-between text-slate-500 text-xs" suppressHydrationWarning>
                    {item.author && <li>بواسطة: {item.author}</li>}
                    {item.createdAt && <li className="font-semibold">{formatDate(item.createdAt)}</li>}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* View More Button */}
        <div className="text-center mt-10">
          <Link
            href="/media-center"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition"
          >
            المزيد من المركز الإعلامي
            <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}
