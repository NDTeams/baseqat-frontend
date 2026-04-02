"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faArrowLeft, faSpinner, faUsers, faLaptop, faLaptopHouse, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { CoursesService, Course } from "@/services/courses/page";
import { getFileUrl } from "@/lib/config";

export default function CoursesSlider() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CoursesService.getActive()
      .then((res) => {
        if (res.succeeded && res.data) {
          setCourses(res.data.slice(0, 4));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 0: return "مبتدئ";
      case 1: return "متوسط";
      case 2: return "متقدم";
      default: return "";
    }
  };

  const courseTypeBadge = (type: number | undefined | null) => {
    switch (type) {
      case 0: return { label: "حضوري", icon: faUsers, className: "bg-amber-500/90 text-white" };
      case 1: return { label: "أونلاين", icon: faLaptop, className: "bg-sky-500/90 text-white" };
      case 2: return { label: "أونلاين + حضوري", icon: faLaptopHouse, className: "bg-violet-500/90 text-white" };
      default: return null;
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="w-full max-w-[1260px] mx-auto px-4">
      <section id="courses" className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs sm:text-sm font-semibold text-primary">
              {t("CoursesSlider.basqat_programs")}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              {t("CoursesSlider.choose_service_for_stage")}
            </h2>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-16">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary text-3xl" />
            </div>
          )}

          {/* No courses */}
          {!loading && courses.length === 0 && (
            <p className="text-center text-slate-500 py-12">{t("CoursesSlider.no_courses")}</p>
          )}

          {/* Courses Grid - 4 cards */}
          {!loading && courses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {courses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <article className="group h-full bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden transition hover:shadow-xl hover:-translate-y-1">
                    {/* Image */}
                    {(() => { const badge = courseTypeBadge(course.courseType); return (
                    <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                      <img
                        src={course.thumbnailUrl ? getFileUrl(course.thumbnailUrl) : '/site/logo.png'}
                        alt={course.title}
                        className={`w-full h-full transition duration-300 group-hover:scale-105 ${course.thumbnailUrl ? 'object-cover' : 'object-contain p-6'}`}
                      />
                      {/* Course Type Badge */}
                      {badge && (
                        <span className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm ${badge.className}`}>
                          <FontAwesomeIcon icon={badge.icon} className="text-[11px]" />
                          {badge.label}
                        </span>
                      )}
                      {/* Category badge */}
                      {course.courseCategoryName && (
                        <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                          {course.courseCategoryName}
                        </span>
                      )}
                    </div>
                    ); })()}

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-relaxed">
                        {course.title}
                      </h3>

                      {/* Meta */}
                      <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500">
                        {course.totalDurationInHours != null && course.totalDurationInHours > 0 && (
                          <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faClock} className="text-slate-400" />
                            {course.totalDurationInHours} ساعة
                          </span>
                        )}
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {course.levelName || getLevelLabel(course.level)}
                        </span>
                      </div>

                      {/* Dates */}
                      {(course.startDate || course.endDate) && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400" suppressHydrationWarning>
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-primary text-[11px]" />
                          {formatDate(course.startDate) && <span>{formatDate(course.startDate)}</span>}
                          {course.startDate && course.endDate && <span>—</span>}
                          {formatDate(course.endDate) && <span>{formatDate(course.endDate)}</span>}
                        </div>
                      )}

                      {/* Instructor */}
                      {course.instructorName && (
                        <p className="text-xs text-slate-500">
                          {course.instructorName}
                        </p>
                      )}

                      {/* Price */}
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-lg font-bold text-primary">
                          {course.price > 0
                            ? `${course.price.toLocaleString("ar-SA")} ${t("CoursesSlider.sar")}`
                            : t("CoursesSlider.free")}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* View More Button */}
          {!loading && courses.length > 0 && (
            <div className="text-center mt-10">
              <Link
                href="/courses-archive"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition"
              >
                {t("CoursesSlider.view_more")}
                <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
