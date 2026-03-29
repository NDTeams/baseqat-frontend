'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar, faUserTie, faSearch, faSpinner, faBriefcase,
} from '@fortawesome/free-solid-svg-icons';
import {
  faInstagram, faFacebookF, faLinkedinIn, faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { ConsultantPublicService, type ConsultantDetail } from '@/services/consultants/page';
import { getFileUrl } from '@/lib/config';
import CoursesHeader from '@/components/site/courses-header';

export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState<ConsultantDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const res = await ConsultantPublicService.getActive();
        if (res.succeeded) {
          setConsultants(res.data || []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  // Extract unique specialties for filter pills
  const specialties = useMemo(() => {
    const set = new Set<string>();
    consultants.forEach((c) => {
      if (c.specialty) set.add(c.specialty);
    });
    return Array.from(set);
  }, [consultants]);

  // Filter consultants
  const filtered = useMemo(() => {
    let list = consultants;
    if (activeSpecialty !== 'all') {
      list = list.filter((c) => c.specialty === activeSpecialty);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          (c.specialty || '').toLowerCase().includes(q) ||
          (c.skills || []).some((s) => s.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [consultants, search, activeSpecialty]);

  // Render star rating
  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={faStar}
          className={`text-xs ${star <= Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero */}
      <CoursesHeader
        subtitle="فريقنا الاستشاري"
        title="مستشارونا"
        description="تعرّف على نخبة من المستشارين المتخصصين الذين يقدمون خبراتهم لدعم مشاريعك واستشاراتك"
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="ابحث عن مستشار بالاسم أو التخصص..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Specialty Filter Pills */}
        {specialties.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveSpecialty('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeSpecialty === 'all'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              الكل
            </button>
            {specialties.map((sp) => (
              <button
                key={sp}
                onClick={() => setActiveSpecialty(sp)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeSpecialty === sp
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>
        )}

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
              <FontAwesomeIcon icon={faUserTie} className="text-gray-400 text-3xl" />
            </div>
            <p className="text-gray-500 text-lg">
              {search || activeSpecialty !== 'all' ? 'لا توجد نتائج مطابقة' : 'لا يوجد مستشارون حالياً'}
            </p>
            {(search || activeSpecialty !== 'all') && (
              <button
                onClick={() => { setSearch(''); setActiveSpecialty('all'); }}
                className="text-sky-600 hover:text-sky-700 text-sm font-medium"
              >
                مسح الفلاتر
              </button>
            )}
          </div>
        )}

        {/* Consultants Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((consultant) => (
              <div
                key={consultant.id}
                className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
              >
                {/* Avatar */}
                <div className="relative h-64 bg-gradient-to-br from-sky-100 to-sky-50 overflow-hidden">
                  {consultant.avatarUrl ? (
                    <img
                      src={getFileUrl(consultant.avatarUrl)}
                      alt={consultant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faUserTie}
                        className="text-sky-300 text-6xl"
                      />
                    </div>
                  )}

                  {/* Rating Badge */}
                  {consultant.rating != null && consultant.rating > 0 && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-xs" />
                      <span className="text-xs font-bold text-gray-800">
                        {consultant.rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {/* Specialty Badge */}
                  {consultant.specialty && (
                    <div className="absolute bottom-3 right-3 bg-sky-600/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                      <span className="text-xs font-medium text-white">
                        {consultant.specialty}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                    {consultant.name}
                  </h3>
                  <p className="text-sky-600 font-semibold text-sm">{consultant.title}</p>

                  {/* Rating Stars */}
                  {consultant.rating != null && consultant.rating > 0 && (
                    <div className="flex items-center gap-2">
                      {renderStars(consultant.rating)}
                      <span className="text-xs text-gray-500">
                        ({consultant.rating.toFixed(1)})
                      </span>
                    </div>
                  )}

                  {/* Years of Experience */}
                  {consultant.yearsOfExperience != null && consultant.yearsOfExperience > 0 && (
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <FontAwesomeIcon icon={faBriefcase} className="text-gray-400 text-xs" />
                      {consultant.yearsOfExperience} سنوات خبرة
                    </p>
                  )}

                  {/* Skills Tags */}
                  {consultant.skills && consultant.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {consultant.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill.id}
                          className="px-2 py-0.5 bg-sky-50 text-sky-700 text-xs rounded-full font-medium"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {consultant.skills.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full font-medium">
                          +{consultant.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Social Links */}
                  {(consultant.instagramUrl || consultant.facebookUrl || consultant.linkedInUrl || consultant.xUrl) && (
                    <div className="flex items-center gap-3 pt-2 text-gray-400">
                      {consultant.linkedInUrl && (
                        <a href={consultant.linkedInUrl} target="_blank" rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors">
                          <FontAwesomeIcon icon={faLinkedinIn} />
                        </a>
                      )}
                      {consultant.xUrl && (
                        <a href={consultant.xUrl} target="_blank" rel="noopener noreferrer"
                          className="hover:text-gray-900 transition-colors">
                          <FontAwesomeIcon icon={faXTwitter} />
                        </a>
                      )}
                      {consultant.instagramUrl && (
                        <a href={consultant.instagramUrl} target="_blank" rel="noopener noreferrer"
                          className="hover:text-pink-500 transition-colors">
                          <FontAwesomeIcon icon={faInstagram} />
                        </a>
                      )}
                      {consultant.facebookUrl && (
                        <a href={consultant.facebookUrl} target="_blank" rel="noopener noreferrer"
                          className="hover:text-blue-500 transition-colors">
                          <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                      )}
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="pt-3 border-t border-gray-100">
                    <Link
                      href={`/consultants/${consultant.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-xl hover:bg-sky-700 transition-colors duration-200"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
