'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faTag,
  faCalendar,
  faGlobe,
  faCertificate,
  faStar,
  faUsers,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import type { CourseDetailFull } from '@/services/courses/page';

export default function CourseHero({ course }: { course: CourseDetailFull }) {
  const levelLabels: Record<number, string> = { 0: 'مبتدئ', 1: 'متوسط', 2: 'متقدم' };

  return (
    <section className="course-hero w-full py-12 md:py-16 relative z-10 bg-gradient-to-br from-[#0a2e1f] via-[#1a5f4a] to-[#2d8659]">
      <div className="container mx-auto px-6 relative z-10" dir="rtl">
        <div className="w-full max-w-4xl">

          {/* Category & Rating */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {course.courseCategoryName && (
              <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-4 py-1 rounded-full text-sm font-semibold">
                {course.courseCategoryName}
              </span>
            )}
            {course.averageRating > 0 && (
              <div className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faStar} className="text-sm text-yellow-400" />
                <span className="text-white font-bold">{course.averageRating.toFixed(1)}</span>
                <span className="text-white/70 text-sm">({course.totalReviews} تقييم)</span>
              </div>
            )}
            {course.enrollmentCount > 0 && (
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <FontAwesomeIcon icon={faUsers} className="text-xs" />
                <span>{course.enrollmentCount.toLocaleString('ar-SA')} مسجل</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            {course.title}
          </h1>

          {/* Subtitle */}
          {course.subtitle && (
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl leading-relaxed">
              {course.subtitle}
            </p>
          )}

          {/* Course Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {course.instructorName && (
              <>
                <div className="flex items-center text-white/90 gap-1.5">
                  <FontAwesomeIcon icon={faUserGraduate} />
                  <span className="text-sm">{course.instructorName}</span>
                </div>
                <span className="text-white/30">|</span>
              </>
            )}
            <div className="flex items-center text-white/90 gap-1.5">
              <FontAwesomeIcon icon={faTag} />
              <span className="text-sm">{levelLabels[course.level] || course.levelName || 'عام'}</span>
            </div>
            {course.startDate && (
              <>
                <span className="text-white/30">|</span>
                <div className="flex items-center text-white/90 gap-1.5">
                  <FontAwesomeIcon icon={faCalendar} />
                  <span className="text-sm">{new Date(course.startDate).toLocaleDateString('ar-SA')}</span>
                </div>
              </>
            )}
            {course.language && (
              <>
                <span className="text-white/30">|</span>
                <div className="flex items-center text-white/90 gap-1.5">
                  <FontAwesomeIcon icon={faGlobe} />
                  <span className="text-sm">{course.language}</span>
                </div>
              </>
            )}
            {course.hasCertificate && (
              <>
                <span className="text-white/30">|</span>
                <div className="flex items-center text-white/90 gap-1.5">
                  <FontAwesomeIcon icon={faCertificate} />
                  <span className="text-sm">شهادة معتمدة</span>
                </div>
              </>
            )}
            {course.totalDurationInHours != null && course.totalDurationInHours > 0 && (
              <>
                <span className="text-white/30">|</span>
                <div className="flex items-center text-white/90 gap-1.5">
                  <FontAwesomeIcon icon={faClock} />
                  <span className="text-sm">{course.totalDurationInHours} ساعة</span>
                </div>
              </>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white">
                {course.price > 0 ? course.price.toLocaleString('ar-SA') : 'مجاناً'}
              </span>
              {course.price > 0 && <span className="text-white/80 text-lg">ر.س</span>}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
