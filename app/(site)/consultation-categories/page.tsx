'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup, faSpinner, faUserTie, faSearch, faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import {
  ConsultationCategoryPublicService,
  type ConsultationCategory,
} from '@/services/consultants/page';
import CoursesHeader from '@/components/site/courses-header';

export default function ConsultationCategoriesPage() {
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await ConsultationCategoryPublicService.getActive();
        if (res.succeeded) {
          setCategories(res.data || []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  const filtered = search.trim()
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(search.trim().toLowerCase()) ||
          c.description.toLowerCase().includes(search.trim().toLowerCase())
      )
    : categories;

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero */}
      <CoursesHeader
        subtitle="مجالات الاستشارات"
        title="أقسام الاستشارات"
        description="تصفح مجالات الاستشارات المتاحة واختر القسم المناسب للتواصل مع مستشارينا المتخصصين"
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="ابحث عن قسم استشاري..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <FontAwesomeIcon icon={faSpinner} spin className="text-sky-600 text-3xl" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faLayerGroup} className="text-gray-400 text-3xl" />
            </div>
            <p className="text-gray-500 text-lg">
              {search ? 'لا توجد نتائج مطابقة' : 'لا توجد أقسام استشارية حالياً'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-sky-600 hover:text-sky-700 text-sm font-medium"
              >
                مسح البحث
              </button>
            )}
          </div>
        )}

        {/* Categories Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((category) => (
              <Link
                key={category.id}
                href={`/consultants?category=${category.id}`}
                className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
              >
                {/* Top Color Bar */}
                <div className="h-2 bg-gradient-to-r from-sky-500 to-sky-500 group-hover:from-sky-600 group-hover:to-sky-600 transition-colors" />

                <div className="p-6 space-y-4">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-50 flex items-center justify-center flex-shrink-0 group-hover:from-sky-100 group-hover:to-sky-100 transition-colors">
                      <FontAwesomeIcon icon={faLayerGroup} className="text-sky-600 text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                        {category.name}
                      </h3>
                      {(category.consultantCount ?? 0) > 0 && (
                        <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                          <FontAwesomeIcon icon={faUserTie} className="text-xs text-sky-500" />
                          <span>{category.consultantCount} مستشار</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {category.description && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {category.description}
                    </p>
                  )}

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sky-600 text-sm font-semibold pt-2 group-hover:gap-3 transition-all">
                    <span>عرض المستشارين</span>
                    <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {!loading && categories.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-6 bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-5">
              <div className="text-center">
                <p className="text-2xl font-bold text-sky-600">{categories.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">قسم استشاري</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-sky-600">
                  {categories.reduce((sum, c) => sum + (c.consultantCount ?? 0), 0)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">مستشار متخصص</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
