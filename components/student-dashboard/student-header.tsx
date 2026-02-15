"use client";

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import AOS from "aos";
import "aos/dist/aos.css";

export default function DashboardHero() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

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
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white/50 shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&q=90"
                    alt="أحمد محمد"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-sm md:text-base opacity-80 mb-1">
                    طالب في منصة باسقات
                  </p>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight">
                    أحمد محمد
                  </h1>
                </div>
              </div>

              <p className="text-sm md:text-base opacity-90 leading-relaxed">
                تتابع حالياً رحلتك التعليمية في مسار{" "}
                <span className="font-semibold">التحول الرقمي</span>،
                مع خطة واضحة لإكمال الدورات والحصول على المزيد من الشهادات.
              </p>

              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs md:text-sm">
                  مستوى التعلم: <span className="font-semibold">متقدم</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs md:text-sm">
                  آخر تسجيل دخول قبل <span className="font-semibold">3 أيام</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center space-x-reverse space-x-2 bg-white text-[#1a5f4a] px-5 md:px-4 py-2.5 rounded-2xl font-semibold text-sm md:text-base shadow-lg hover:bg-neutral-100 transition">
                  <span>متابعة آخر دورة توقفت عندها</span>
                  <FontAwesomeIcon icon={faArrowLeft} className="text-xs md:text-sm" />
                </button>

                <button className="inline-flex items-center space-x-reverse space-x-2 border border-white/50 text-white px-4 md:px-5 py-2 rounded-2xl font-semibold text-sm md:text-base hover:bg-white/10 transition">
                  <FontAwesomeIcon icon={faUserCircle} className="text-sm md:text-base" />
                  <span>عرض ملفي الشخصي</span>
                </button>
              </div>
            </div>

            {/* Right */}
            <div className="w-full lg:w-auto">
              <div className="grid grid-cols-2 gap-4 min-w-[260px]">

                <div className="bg-black/10 backdrop-blur-md rounded-2xl px-4 py-4 border border-white/10">
                  <p className="text-xs md:text-sm opacity-80 mb-1">الدورات المسجلة</p>
                  <p className="text-2xl md:text-3xl font-black leading-none mb-2">5</p>
                  <p className="text-[11px] md:text-xs opacity-80">
                    تستطيع اليوم إكمال مهام دورتين على الأقل.
                  </p>
                </div>

                <div className="bg-black/10 backdrop-blur-md rounded-2xl px-4 py-4 border border-white/10">
                  <p className="text-xs md:text-sm opacity-80 mb-1">الشهادات</p>
                  <p className="text-2xl md:text-3xl font-black leading-none mb-2">4</p>
                  <p className="text-[11px] md:text-xs opacity-80">
                    اقتربت من الوصول إلى 5 شهادات معتمدة.
                  </p>
                </div>

                <div className="col-span-2 bg-black/10 backdrop-blur-md rounded-2xl px-4 py-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs md:text-sm opacity-80">نسبة إنجاز خطة هذا الشهر</p>
                    <span className="text-sm md:text-base font-semibold">72%</span>
                  </div>

                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[72%] bg-gradient-to-r from-amber-300 via-white to-emerald-300 rounded-full"></div>
                  </div>

                  <p className="text-[11px] md:text-xs opacity-80 mt-2">
                    أكملت 3 من أصل 4 مهام رئيسية لهذا الشهر.
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
