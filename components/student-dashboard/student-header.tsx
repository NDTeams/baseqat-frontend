"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUserCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ClientProfileService, type ClientProfileData, type ClientStats } from "@/services/client-profile/page";
import { getFileUrl } from "@/lib/config";
import AOS from "aos";
import "aos/dist/aos.css";

export default function DashboardHero() {
  const [profile, setProfile] = useState<ClientProfileData | null>(null);
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });

    Promise.all([
      ClientProfileService.getMyProfile(),
      ClientProfileService.getMyStats(),
    ])
      .then(([profileRes, statsRes]) => {
        if (profileRes.succeeded && profileRes.data) setProfile(profileRes.data);
        if (statsRes.succeeded && statsRes.data) setStats(statsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatLastLogin = (date?: string | null) => {
    if (!date) return "غير محدد";
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "اليوم";
    if (diff === 1) return "أمس";
    return `قبل ${diff} ${diff <= 10 ? "أيام" : "يوم"}`;
  };

  if (loading) {
    return (
      <section className="mb-10">
        <div className="rounded-3xl shadow-xl bg-gradient-to-r from-[#1a5f4a] via-[#238062] to-[#41b883] flex items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} spin className="text-white text-3xl" />
        </div>
      </section>
    );
  }

  const name = profile?.fullName || "مستخدم";
  const completion = profile?.profileCompletion ?? 0;

  return (
    <section className="mb-10" data-aos="fade-up">
      <div className="relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-r from-[#1a5f4a] via-[#238062] to-[#41b883] text-white">

        {/* shapes */}
        <div className="absolute -top-24 -left-10 w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 right-0 w-72 h-72 bg-black/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 px-6 md:px-10 py-8 md:py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

            {/* Left */}
            <div className="space-y-5 max-w-xl">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs md:text-sm gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>مرحباً بعودتك إلى لوحة تحكمك</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white/50 shadow-lg bg-white/10">
                  <img
                    src={profile?.profilePictureUrl ? getFileUrl(profile.profilePictureUrl) : "/site/logo.png"}
                    alt={name}
                    className={`w-full h-full ${profile?.profilePictureUrl ? "object-cover" : "object-contain p-2"}`}
                  />
                </div>

                <div>
                  <p className="text-sm md:text-base opacity-80 mb-1">
                    طالب في منصة باسقات
                  </p>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight">
                    {name}
                  </h1>
                </div>
              </div>

              <p className="text-sm md:text-base opacity-90 leading-relaxed">
                تتابع حالياً رحلتك التعليمية في منصة باسقات، مع خطة واضحة لإكمال الدورات والحصول على المزيد من الشهادات.
              </p>

              <div className="flex flex-wrap gap-3" suppressHydrationWarning>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs md:text-sm">
                  آخر تسجيل دخول: <span className="font-semibold">{formatLastLogin(profile?.lastLogin)}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/student-dashboard/my-courses"
                  className="inline-flex items-center space-x-reverse space-x-2 bg-white text-[#1a5f4a] px-5 md:px-4 py-2.5 rounded-2xl font-semibold text-sm md:text-base shadow-lg hover:bg-neutral-100 transition"
                >
                  <span>متابعة آخر دورة توقفت عندها</span>
                  <FontAwesomeIcon icon={faArrowLeft} className="text-xs md:text-sm" />
                </Link>

                <Link
                  href="/student-dashboard/profile"
                  className="inline-flex items-center space-x-reverse space-x-2 border border-white/50 text-white px-4 md:px-5 py-2 rounded-2xl font-semibold text-sm md:text-base hover:bg-white/10 transition"
                >
                  <FontAwesomeIcon icon={faUserCircle} className="text-sm md:text-base" />
                  <span>عرض ملفي الشخصي</span>
                </Link>
              </div>
            </div>

            {/* Right */}
            <div className="w-full lg:w-auto">
              <div className="grid grid-cols-2 gap-4 min-w-[260px]">

                <div className="bg-black/10 backdrop-blur-md rounded-2xl px-4 py-4 border border-white/10">
                  <p className="text-xs md:text-sm opacity-80 mb-1">الدورات المسجلة</p>
                  <p className="text-2xl md:text-3xl font-black leading-none mb-2">{stats?.totalEnrollments ?? 0}</p>
                  <p className="text-[11px] md:text-xs opacity-80">
                    {(stats?.totalEnrollments ?? 0) > 0
                      ? "تستطيع اليوم إكمال مهام دوراتك."
                      : "سجّل في أول دورة لك الآن!"}
                  </p>
                </div>

                <div className="bg-black/10 backdrop-blur-md rounded-2xl px-4 py-4 border border-white/10">
                  <p className="text-xs md:text-sm opacity-80 mb-1">الشهادات</p>
                  <p className="text-2xl md:text-3xl font-black leading-none mb-2">{stats?.certificateCount ?? 0}</p>
                  <p className="text-[11px] md:text-xs opacity-80">
                    {(stats?.certificateCount ?? 0) > 0
                      ? `حصلت على ${stats!.certificateCount} شهادة معتمدة.`
                      : "أكمل دورة للحصول على شهادتك الأولى."}
                  </p>
                </div>

                <div className="col-span-2 bg-black/10 backdrop-blur-md rounded-2xl px-4 py-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs md:text-sm opacity-80">اكتمال الملف الشخصي</p>
                    <span className="text-sm md:text-base font-semibold">{completion}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-300 via-white to-emerald-300 rounded-full transition-all duration-700"
                      style={{ width: `${completion}%` }}
                    ></div>
                  </div>

                  <p className="text-[11px] md:text-xs opacity-80 mt-2">
                    {completion >= 100
                      ? "ملفك الشخصي مكتمل بالكامل!"
                      : `أكمل ملفك الشخصي للحصول على تجربة أفضل.`}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
