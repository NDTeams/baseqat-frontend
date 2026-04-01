"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen, faSpinner, faExclamationTriangle, faUsers, faStar,
  faUserTie, faArrowLeft, faCertificate, faClock, faSearch,
  faFilter, faLayerGroup, faMapMarkerAlt, faDesktop, faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { CourseEnrollmentService, type MyEnrollment } from "@/services/courses/page";
import { getFileUrl } from "@/lib/config";
import StudentDashboard from "@/components/client-dashboard/student-header";

type FilterType = "all" | "online" | "in-person" | "hybrid";

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<MyEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await CourseEnrollmentService.getMyEnrollments();
      if (res.succeeded) {
        setEnrollments(res.data || []);
      } else {
        setError(res.message || "فشل تحميل الدورات");
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        setError("يرجى تسجيل الدخول أولاً");
      } else if (status === 502 || !err?.response) {
        setError("تعذر الاتصال بالخادم");
      } else {
        setError("حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter & search
  const filtered = enrollments.filter((e) => {
    const matchSearch = !search || e.courseTitle.toLowerCase().includes(search.toLowerCase()) || e.instructorName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ||
      (filter === "in-person" && e.courseType === 0) ||
      (filter === "online" && e.courseType === 1) ||
      (filter === "hybrid" && e.courseType === 2);
    return matchSearch && matchFilter;
  });

  const filterButtons: { id: FilterType; label: string; icon: any }[] = [
    { id: "all", label: "الكل", icon: faLayerGroup },
    { id: "online", label: "عن بُعد", icon: faDesktop },
    { id: "in-person", label: "حضوري", icon: faMapMarkerAlt },
    { id: "hybrid", label: "مدمج", icon: faGraduationCap },
  ];

  return (
    <>
      <StudentDashboard />

      <div dir="rtl" className="font-cairo">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-neutral-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faBookOpen} className="text-blue-600" />
              دوراتي
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              {loading ? "جاري التحميل..." : `${enrollments.length} دورة مسجلة`}
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <FontAwesomeIcon icon={faSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن دورة أو مدرب..."
              className="w-full pr-11 pl-4 py-3 border border-neutral-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm bg-white"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                filter === btn.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:border-blue-300 hover:text-blue-700"
              }`}
            >
              <FontAwesomeIcon icon={btn.icon} className="text-xs" />
              {btn.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-neutral-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-3/4 bg-neutral-200 rounded" />
                  <div className="h-4 w-1/2 bg-neutral-200 rounded" />
                  <div className="h-3 w-full bg-neutral-100 rounded-full" />
                  <div className="h-10 bg-neutral-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-red-400" />
            </div>
            <p className="text-neutral-800 font-bold text-lg">{error}</p>
            <button
              onClick={fetchEnrollments}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
              <FontAwesomeIcon icon={faBookOpen} className="text-3xl text-blue-300" />
            </div>
            {enrollments.length === 0 ? (
              <>
                <p className="text-neutral-800 font-bold text-lg">لا توجد دورات مسجلة</p>
                <p className="text-neutral-500 text-sm">سجّل في دورة جديدة لتبدأ رحلتك التعليمية</p>
                <a
                  href="/courses"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  تصفح الدورات
                </a>
              </>
            ) : (
              <>
                <p className="text-neutral-800 font-bold text-lg">لا توجد نتائج</p>
                <p className="text-neutral-500 text-sm">جرّب تغيير كلمة البحث أو الفلتر</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((enrollment) => (
              <MyCourseCard key={enrollment.enrollmentId} enrollment={enrollment} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ===== Course Card =====
function MyCourseCard({ enrollment }: { enrollment: MyEnrollment }) {
  const thumbnailUrl = enrollment.thumbnailUrl ? getFileUrl(enrollment.thumbnailUrl) : null;
  const instructorAvatar = enrollment.instructorAvatarUrl ? getFileUrl(enrollment.instructorAvatarUrl) : null;

  const courseTypeLabel = enrollment.courseType === 0 ? "حضوري" : enrollment.courseType === 1 ? "أونلاين" : "أونلاين + حضوري";
  const courseTypeColor = enrollment.courseType === 0 ? "bg-amber-500" : enrollment.courseType === 1 ? "bg-sky-500" : "bg-violet-500";

  const levelLabel = enrollment.level === 0 ? "مبتدئ" : enrollment.level === 1 ? "متوسط" : "متقدم";

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={enrollment.courseTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <FontAwesomeIcon icon={faBookOpen} className="text-5xl text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          <span className={`text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg ${courseTypeColor}`}>
            {courseTypeLabel}
          </span>
          {enrollment.hasCertificate && (
            <span className="bg-amber-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg">
              <FontAwesomeIcon icon={faCertificate} className="ml-1" />
              شهادة
            </span>
          )}
        </div>

        {/* Bottom stats */}
        <div className="absolute bottom-4 right-4 left-4">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faUsers} className="text-xs" />
              <span>{enrollment.totalEnrollments} طالب</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faClock} className="text-xs" />
              <span>{enrollment.totalDurationInHours} ساعة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          {instructorAvatar ? (
            <img src={instructorAvatar} alt={enrollment.instructorName} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <FontAwesomeIcon icon={faUserTie} className="text-xs text-blue-600" />
            </div>
          )}
          <div>
            <p className="text-xs text-neutral-500">المدرب</p>
            <p className="text-sm font-semibold text-neutral-900">{enrollment.instructorName || "غير محدد"}</p>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-neutral-900 mb-3 line-clamp-2 leading-tight">
          {enrollment.courseTitle}
        </h3>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-semibold">
            {levelLabel}
          </span>
          <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-lg text-[11px] font-semibold">
            <FontAwesomeIcon icon={faLayerGroup} className="ml-1" />
            {enrollment.totalSections} أقسام
          </span>
          {enrollment.startDate && (
            <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-lg text-[11px] font-semibold">
              {enrollment.startDate}
            </span>
          )}
        </div>

        {/* Enrolled date */}
        <div className="text-xs text-neutral-500 mb-4">
          تاريخ التسجيل: {enrollment.enrolledAt}
        </div>

        {/* Action */}
        <a
          href={`/courses/${enrollment.courseId}`}
          className="block w-full bg-blue-600 text-white text-center py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition text-sm flex items-center justify-center gap-2"
        >
          عرض الدورة
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
        </a>
      </div>
    </div>
  );
}
