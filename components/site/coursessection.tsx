"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSpinner,
  faGraduationCap,
  faClock,
  faTag,
  faLayerGroup,
  faLaptop,
  faUsers,
  faLaptopHouse,
} from "@fortawesome/free-solid-svg-icons";
import { CoursesService, CourseCategoryService, type Course, type CourseCategory } from "@/services/courses/page";
import { getFileUrl } from "@/lib/config";

// Course type helpers
const courseTypeBadge = (type: number | undefined | null) => {
  switch (type) {
    case 0:
      return { label: "حضوري", icon: faUsers, className: "bg-amber-500/90 text-white" };
    case 1:
      return { label: "أونلاين", icon: faLaptop, className: "bg-sky-500/90 text-white" };
    case 2:
      return { label: "أونلاين + حضوري", icon: faLaptopHouse, className: "bg-violet-500/90 text-white" };
    default:
      return null;
  }
};

const levelName = (level: number) => {
  switch (level) {
    case 1: return "مبتدئ";
    case 2: return "متوسط";
    case 3: return "متقدم";
    default: return "";
  }
};

function CoursesSectionInner() {
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("category");

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId || "all");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [coursesRes, catsRes] = await Promise.all([
          CoursesService.getActive(),
          CourseCategoryService.getAllHome(),
        ]);
        if (coursesRes.succeeded) setCourses(coursesRes.data);
        if (catsRes.succeeded) setCategories(catsRes.data.filter(c => c.isActive));
      } catch { /* silent */ }
      setLoading(false);
    };
    loadData();
  }, []);

  // Update category from URL param
  useEffect(() => {
    if (initialCategoryId) setSelectedCategory(initialCategoryId);
  }, [initialCategoryId]);

  const filteredCourses = courses.filter((course) => {
    const matchSearch = !search ||
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "all" ||
      course.courseCategoryId === Number(selectedCategory);
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-8" dir="rtl">
      {/* Filters */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="relative w-full md:w-72">
            <FontAwesomeIcon icon={faSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="ابحث عن دورة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                selectedCategory === "all"
                  ? "bg-primary text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              جميع الأقسام
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(String(cat.id))}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  selectedCategory === String(cat.id)
                    ? "bg-primary text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary" />
        </div>
      )}

      {/* Cards */}
      {!loading && (
        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => {
              const badge = courseTypeBadge(course.courseType);
              return (
                <Link href={`/course/${course.id}`} key={course.id}>
                  <article className="bg-white border border-slate-100 rounded-2xl shadow hover:-translate-y-1 hover:shadow-lg transition overflow-hidden h-full">
                    <div className="relative">
                      {course.thumbnailUrl ? (
                        <img
                          src={getFileUrl(course.thumbnailUrl)}
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center">
                          <FontAwesomeIcon icon={faGraduationCap} className="text-4xl text-emerald-300" />
                        </div>
                      )}
                      {/* Course Type Badge */}
                      {badge && (
                        <span className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm ${badge.className}`}>
                          <FontAwesomeIcon icon={badge.icon} className="text-[11px]" />
                          {badge.label}
                        </span>
                      )}
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        {course.courseCategoryName && (
                          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                            <FontAwesomeIcon icon={faTag} className="text-[10px]" />
                            {course.courseCategoryName}
                          </span>
                        )}
                        <span className="font-bold text-primary text-sm" suppressHydrationWarning>
                          {course.price > 0 ? `${course.price.toLocaleString("ar-SA")} ر.س` : "مجاني"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-sm text-slate-500 leading-6 line-clamp-2">
                          {course.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          {course.totalDurationInHours != null && course.totalDurationInHours > 0 && (
                            <span className="flex items-center gap-1">
                              <FontAwesomeIcon icon={faClock} />
                              {course.totalDurationInHours} ساعة
                            </span>
                          )}
                          {course.level > 0 && (
                            <span className="flex items-center gap-1">
                              <FontAwesomeIcon icon={faLayerGroup} />
                              {course.levelName || levelName(course.level)}
                            </span>
                          )}
                        </div>
                        {course.instructorName && (
                          <span className="text-slate-500 font-semibold">{course.instructorName}</span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center gap-3 py-20 text-slate-400">
              <FontAwesomeIcon icon={faGraduationCap} className="text-4xl" />
              <p className="text-lg font-semibold">لا توجد دورات مطابقة</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default function CoursesSection() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary" />
      </div>
    }>
      <CoursesSectionInner />
    </Suspense>
  );
}
