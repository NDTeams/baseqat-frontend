"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useTranslation } from "react-i18next";
import Link from "next/link"; // مهم في Next.js

const courses = [
  {
    title: "تحضير وملاءمة سوق",
    category: "تحضير السوق",
    price: "18,500 ر.س",
    duration: "4 أسابيع",
    target: "فرق ناشئة",
    desc: "تحقق سريع من جدوى الحل، تسعير، ورسالة تسويقية أولى مع خطة أسبوعية.",
    img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80",
    link: "/courses/market-prep",
  },
  {
    title: "تسريع + إطلاق",
    category: "تسريع",
    price: "42,000 ر.س",
    duration: "8 أسابيع",
    target: "جاهزية إطلاق",
    desc: "فريق تشغيلي يرافقك حتى أول عميل مدفوع، إعداد المبيعات وملف المستثمرين.",
    img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80",
    link: "/courses/launch-accelerator",
  },
  {
    title: "تحول وتشغيل رقمي",
    category: "تحول رقمي",
    price: "حسب النطاق",
    duration: "12 أسبوعاً",
    target: "شركات قائمة",
    desc: "أتمتة العمليات، تكامل الأنظمة، ولوحات بيانات للإدارة والتحكم.",
    img: "https://images.unsplash.com/photo-1529333166433-84c3c85d1c8d?auto=format&fit=crop&w=800&q=80",
    link: "/courses/digital-transformation",
  },
  {
    title: "جلسة تكتيكية",
    category: "استشارة",
    price: "جلسات",
    duration: "90 دقيقة",
    target: "حسب الطلب",
    desc: "لقاء سريع مع خبراء منتج أو نمو أو تمويل لمعالجة تحدٍ محدد.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    link: "/courses/tactical-session",
  },
  {
    title: "قوالب تشغيل",
    category: "موارد",
    price: "مجاناً",
    duration: "تحميل فوري",
    target: "قوالب",
    desc: "ملفات مستثمرين، لوحات مالية، وأدوات إطلاق MVP جاهزة للتخصيص.",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    link: "/courses/templates",
  },
  {
    title: "ورش تدريبية للفرق",
    category: "محتوى تدريبي",
    price: "حسب الخطة",
    duration: "حسب عدد الورش",
    target: "الفرق التشغيلية",
    desc: "برامج تدريبية عملية في النمو، المبيعات، والمنتج مخصصة لفرقك.",
    img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
    link: "/courses/workshops",
  },
];

export default function CoursesSlider() {
  const { t } = useTranslation();

  return (
    <div className="w-[340px] md:w-[1260px] mx-auto">
      <section id="courses" className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs sm:text-sm font-semibold text-primary">
              {t("CoursesSlider.basqat_programs")}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              {t("CoursesSlider.choose_service_for_stage")}
            </h2>
          </div>

          {/* Slider */}
          <Swiper
            modules={[Autoplay, Pagination]}
            loop
            speed={650}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              reverseDirection: true,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true, el: ".custom-pagination" }}
            spaceBetween={12}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.3, spaceBetween: 18 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1100: { slidesPerView: 3, spaceBetween: 22 },
            }}
            className="pb-24"
          >
            {courses.map((course, i) => (
              <SwiperSlide key={i} className="h-auto py-6">
                <Link href={course.link}>
                <article className="group h-full bg-slate-50 rounded-2xl shadow-md border border-slate-100 overflow-hidden transition hover:shadow-xl sm:hover:-translate-y-2">
                  <img
                    src={course.img}
                    alt={course.title}
                    className="w-full h-44 sm:h-56 object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold">
                        {course.category}
                      </span>
                      <span className="font-bold text-primary">{course.price}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500 text-xs sm:text-sm">
                      ★★★★★
                      <span className="text-slate-500 text-[10px] sm:text-xs">
                        (0.5 تقييم العملاء)
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-6 sm:leading-7">
                      {course.desc}
                    </p>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
                      <span>{course.duration}</span>
                      <span className="font-semibold">{course.target}</span>
                    </div>
                    {/* زر الرابط */}
                    
                  </div>
                </article>
                </Link>

              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination أسفل السلايدر */}
          <div className="custom-pagination flex justify-center mt-6 gap-1.5"></div>
        </div>
      </section>
    </div>
  );
}
