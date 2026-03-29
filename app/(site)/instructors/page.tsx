'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar, faUsers, faBookOpen, faChalkboardTeacher,
  faSearch, faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import {
  faInstagram, faFacebookF, faLinkedinIn, faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { InstructorPublicService, type Instructor } from '@/services/courses/page';
import { getFileUrl } from '@/lib/config';
import CoursesHeader from '@/components/site/courses-header';

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [filtered, setFiltered] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await InstructorPublicService.getActive();
        if (res.succeeded) {
          setInstructors(res.data);
          setFiltered(res.data);
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(instructors);
    } else {
      const q = search.trim().toLowerCase();
      setFiltered(
        instructors.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.title.toLowerCase().includes(q) ||
            (i.skills || []).some((s) => s.name.toLowerCase().includes(q))
        )
      );
    }
  }, [search, instructors]);

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero */}
      <CoursesHeader
        subtitle="فريقنا التدريبي"
        title="المدربون"
        description="تعرّف على نخبة من المدربين المتخصصين الذين يقدمون خبراتهم لدعم رحلتك الريادية"
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
              placeholder="ابحث عن مدرب بالاسم أو التخصص..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-3xl" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-gray-400 text-3xl" />
            </div>
            <p className="text-gray-500 text-lg">
              {search ? 'لا توجد نتائج مطابقة' : 'لا يوجد مدربون حالياً'}
            </p>
          </div>
        )}

        {/* Instructors Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((instructor) => (
              <Link
                key={instructor.id}
                href={`/instructors/${instructor.id}`}
                className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
              >
                {/* Avatar */}
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden">
                  {instructor.avatarUrl ? (
                    <img
                      src={getFileUrl(instructor.avatarUrl)}
                      alt={instructor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faChalkboardTeacher}
                        className="text-blue-300 text-6xl"
                      />
                    </div>
                  )}

                  {/* Rating Badge */}
                  {instructor.rating != null && instructor.rating > 0 && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-xs" />
                      <span className="text-xs font-bold text-gray-800">
                        {instructor.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {instructor.name}
                  </h3>
                  <p className="text-blue-600 font-semibold text-sm">{instructor.title}</p>

                  {/* Skills Tags */}
                  {instructor.skills && instructor.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {instructor.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill.id}
                          className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {instructor.skills.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full font-medium">
                          +{instructor.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 pt-2 border-t border-gray-100 text-gray-500 text-xs">
                    {(instructor.totalStudents ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faUsers} />
                        {instructor.totalStudents} طالب
                      </span>
                    )}
                    {(instructor.totalCources ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faBookOpen} />
                        {instructor.totalCources} دورة
                      </span>
                    )}
                  </div>

                  {/* Social Links */}
                  {(instructor.instagramUrl || instructor.facebookUrl || instructor.linkedInUrl || instructor.xUrl) && (
                    <div className="flex items-center gap-3 pt-2 text-gray-400">
                      {instructor.linkedInUrl && (
                        <span onClick={(e) => { e.preventDefault(); window.open(instructor.linkedInUrl, '_blank'); }} className="hover:text-blue-600 transition-colors cursor-pointer">
                          <FontAwesomeIcon icon={faLinkedinIn} />
                        </span>
                      )}
                      {instructor.xUrl && (
                        <span onClick={(e) => { e.preventDefault(); window.open(instructor.xUrl, '_blank'); }} className="hover:text-gray-900 transition-colors cursor-pointer">
                          <FontAwesomeIcon icon={faXTwitter} />
                        </span>
                      )}
                      {instructor.instagramUrl && (
                        <span onClick={(e) => { e.preventDefault(); window.open(instructor.instagramUrl, '_blank'); }} className="hover:text-pink-500 transition-colors cursor-pointer">
                          <FontAwesomeIcon icon={faInstagram} />
                        </span>
                      )}
                      {instructor.facebookUrl && (
                        <span onClick={(e) => { e.preventDefault(); window.open(instructor.facebookUrl, '_blank'); }} className="hover:text-blue-500 transition-colors cursor-pointer">
                          <FontAwesomeIcon icon={faFacebookF} />
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
