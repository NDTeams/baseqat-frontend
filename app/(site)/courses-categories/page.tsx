"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faChartLine,
  faPalette,
  faBriefcase,
  faHandshake,
  faArrowLeft,
  faGraduationCap,
  faBookOpen,
  faUsers,
  faTriangleExclamation,
  faRotateRight,
  faLayerGroup,
  faLaptopCode,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import { CourseCategoryService, CourseStatsService, type CourseCategory, type CourseStats } from "@/services/courses/page";

// ===== Visual config (cycles for any number of categories) =====
const visualStyles = [
  {
    icon: faLightbulb,
    gradient: "from-emerald-600 to-teal-700",
    lightColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    iconBg: "bg-emerald-100",
    textColor: "text-emerald-700",
  },
  {
    icon: faChartLine,
    gradient: "from-teal-600 to-cyan-700",
    lightColor: "bg-teal-50",
    borderColor: "border-teal-200",
    iconBg: "bg-teal-100",
    textColor: "text-teal-700",
  },
  {
    icon: faPalette,
    gradient: "from-amber-500 to-orange-600",
    lightColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconBg: "bg-amber-100",
    textColor: "text-amber-700",
  },
  {
    icon: faBriefcase,
    gradient: "from-emerald-500 to-green-700",
    lightColor: "bg-green-50",
    borderColor: "border-green-200",
    iconBg: "bg-green-100",
    textColor: "text-green-700",
  },
  {
    icon: faHandshake,
    gradient: "from-cyan-600 to-teal-600",
    lightColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    iconBg: "bg-cyan-100",
    textColor: "text-cyan-700",
  },
  {
    icon: faLaptopCode,
    gradient: "from-green-600 to-emerald-700",
    lightColor: "bg-green-50",
    borderColor: "border-green-200",
    iconBg: "bg-green-100",
    textColor: "text-green-700",
  },
  {
    icon: faCogs,
    gradient: "from-teal-500 to-emerald-600",
    lightColor: "bg-teal-50",
    borderColor: "border-teal-200",
    iconBg: "bg-teal-100",
    textColor: "text-teal-700",
  },
  {
    icon: faLayerGroup,
    gradient: "from-emerald-600 to-green-600",
    lightColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    iconBg: "bg-emerald-100",
    textColor: "text-emerald-700",
  },
];

// ===== Skeleton Card =====
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border-2 border-gray-100 shadow-md animate-pulse">
      <div className="h-3 w-full bg-gray-200" />
      <div className="p-8 space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-16 h-16 rounded-2xl bg-gray-200" />
          <div className="w-16 h-6 rounded-full bg-gray-200" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-4/5 rounded bg-gray-200" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-6 w-20 rounded-full bg-gray-200" />
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-100">
          <div className="h-4 w-24 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

// ===== Main Page =====
export default function CoursesCategoriesPage() {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, statsRes] = await Promise.all([
        CourseCategoryService.getAllHome(),
        CourseStatsService.getStats(),
      ]);
      if (!catRes.succeeded) throw new Error(catRes.message || "فشل في تحميل البيانات");
      setCategories(catRes.data.filter((c: CourseCategory) => c.isActive));
      if (statsRes.succeeded) setStats(statsRes.data);
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 font-cairo" dir="rtl">
      {/* ===== Hero Section ===== */}
      <section className="relative pt-32 pb-24 px-5 sm:px-8 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-80 h-80 bg-white opacity-10 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 left-16 w-72 h-72 bg-teal-300 opacity-10 rounded-full filter blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400 opacity-5 rounded-full filter blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-emerald-200 text-sm">
            <Link href="/" className="hover:text-white transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-white font-medium">أقسام الدورات</span>
          </div>

          <p className="inline-block text-emerald-100 text-sm font-semibold uppercase tracking-widest bg-white/10 px-5 py-2 rounded-full border border-white/20 backdrop-blur-sm">
            برامجنا التدريبية
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            أقسام الدورات التدريبية
          </h1>

          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            اختر القسم المناسب لك وابدأ رحلتك التعليمية مع أفضل المدربين والمحتوى المتخصص
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            {[
              { label: "قسم تدريبي", icon: faBookOpen, value: stats?.totalCategories ?? categories.length },
              { label: "دورة متاحة", icon: faGraduationCap, value: stats?.totalCourses },
              { label: "متدرب مسجل", icon: faUsers, value: stats?.totalEnrollments },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-2xl"
              >
                <FontAwesomeIcon icon={stat.icon} className="text-emerald-300 text-lg" />
                <div className="text-right">
                  <p className="text-2xl font-bold text-white" suppressHydrationWarning>
                    {loading ? (
                      <span className="inline-block w-8 h-6 bg-white/20 rounded animate-pulse" />
                    ) : (
                      (stat.value ?? 0).toLocaleString("ar-SA")
                    )}
                  </p>
                  <p className="text-emerald-200 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Categories Grid ===== */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="text-center mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            تصفح حسب القسم
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            كل قسم يضم مجموعة متكاملة من الدورات المصممة لتطوير مهاراتك المهنية
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-3xl" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-gray-800">تعذّر تحميل الأقسام</p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-emerald-800 text-white font-semibold rounded-xl transition-colors"
            >
              <FontAwesomeIcon icon={faRotateRight} />
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Categories Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, index) => {
              const style = visualStyles[index % visualStyles.length];
              return (
                <Link
                  href={`/courses-archive?category=${cat.id}`}
                  key={cat.id}
                  onMouseEnter={() => setHoveredCard(cat.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group relative block"
                >
                  <div
                    className={`
                      relative bg-white rounded-3xl overflow-hidden
                      border-2 ${style.borderColor}
                      shadow-md hover:shadow-2xl
                      transition-all duration-500
                      ${hoveredCard === cat.id ? "-translate-y-3" : "translate-y-0"}
                    `}
                  >
                    {/* Top Gradient Banner */}
                    <div className={`h-3 w-full bg-gradient-to-r ${style.gradient}`} />

                    {/* Card Body */}
                    <div className="p-8 space-y-5">
                      {/* Icon */}
                      <div className="flex items-start justify-between">
                        <div
                          className={`
                            w-16 h-16 rounded-2xl flex items-center justify-center
                            bg-gradient-to-br ${style.gradient}
                            shadow-lg group-hover:scale-110 transition-transform duration-300
                          `}
                        >
                          <FontAwesomeIcon icon={style.icon} className="text-white text-2xl" />
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-semibold ${style.textColor} ${style.lightColor} ${style.borderColor} border px-3 py-1.5 rounded-full`}>
                          <FontAwesomeIcon icon={faGraduationCap} className="text-[10px]" />
                          دورات متاحة
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                          {cat.name}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                          {cat.description || "اكتشف الدورات المتاحة في هذا القسم"}
                        </p>
                      </div>

                      {/* Action Row */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className={`text-sm font-semibold bg-gradient-to-r ${style.gradient} bg-clip-text text-transparent`}>
                          استعرض الدورات
                        </span>
                        <div
                          className={`
                            w-9 h-9 rounded-full flex items-center justify-center
                            bg-gradient-to-br ${style.gradient}
                            opacity-0 group-hover:opacity-100
                            scale-75 group-hover:scale-100
                            transition-all duration-300 shadow-md
                          `}
                        >
                          <FontAwesomeIcon icon={faArrowLeft} className="text-white text-sm" />
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow */}
                    <div
                      className={`
                        absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0
                        group-hover:opacity-5 transition-opacity duration-500 pointer-events-none
                      `}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && categories.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-24 text-center text-gray-400">
            <FontAwesomeIcon icon={faLayerGroup} className="text-5xl" />
            <p className="text-xl font-semibold">لا توجد أقسام متاحة حالياً</p>
          </div>
        )}
      </section>

      {/* ===== Feature Highlights ===== */}
      <section className="bg-white py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              لماذا تختار دوراتنا؟
            </h2>
            <p className="text-gray-500 text-lg">
              نقدم تجربة تعليمية متكاملة تضمن لك أفضل النتائج
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: faGraduationCap, title: "شهادات معتمدة", desc: "شهادات موثوقة تُعزز سيرتك الذاتية" },
              { icon: faBookOpen, title: "مرونة في التعلم", desc: "تعلّم في أي وقت ومن أي مكان" },
              { icon: faUsers, title: "مدربون متخصصون", desc: "خبراء ذوو تجربة ميدانية حقيقية" },
              { icon: faLaptopCode, title: "محتوى تفاعلي", desc: "فيديوهات ومهام عملية متنوعة" },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <FontAwesomeIcon icon={item.icon} className="text-xl text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="relative py-20 px-5 sm:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl px-8 py-16 text-white text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500 opacity-20 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500 opacity-20 rounded-full filter blur-3xl pointer-events-none" />

            <div className="relative space-y-6">
              <p className="inline-block text-emerald-300 text-sm font-semibold tracking-widest bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
                ابدأ اليوم
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                هل أنت مستعد للانطلاق؟
              </h2>
              <p className="text-emerald-200 text-lg max-w-xl mx-auto">
                سجّل الآن واحصل على وصول فوري لمئات الدورات التدريبية المتخصصة
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Link
                  href="/courses-archive"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-emerald-50 transition-all duration-300 hover:scale-105 shadow-xl"
                >
                  <FontAwesomeIcon icon={faGraduationCap} />
                  استعرض جميع الدورات
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-400 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
                >
                  سجّل مجاناً
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
