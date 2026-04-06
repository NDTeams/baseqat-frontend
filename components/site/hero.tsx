"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronLeft,
  faChevronRight,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

const slides = [
  {
    title: "أطلق مشروعك بثقة ",
    subtitle: "مع مسرعة باسقات",
    desc: "ندربك، نرشدك، ونقدم لك الاستشارات لتحويل فكرتك إلى مشروع جاهز للسوق بخطة واضحة ودعم متخصص",
    btn: "احجز جلسة استشارية",
    link: "/consultation-request",
    img: "/site/slide1.png",
  },
  {
    title: "سرّع منتجك",
    subtitle: "بخطة إطلاق واضحة",
    desc: "برنامج تسريع يشمل إعداد المبيعات، الملفات الاستثمارية، وتجربة العملاء مع فريق تشغيلي يرافقك حتى أول عميل مدفوع",
    btn: "استكشف خدماتنا",
    link: "/services",
    img: "/site/slide1.png",
  },
  {
    title: "إرشاد متخصص",
    subtitle: "وتمكين رقمي لفريقك",
    desc: "شبكة خبراء في المنتج، البيانات، والنمو تمنحك جلسات تكتيكية، أتمتة للعمليات، ولوحات تحكم تتابع التنفيذ",
    btn: "تعرف على الخبراء",
    link: "/consultants",
    img: "/site/slide1.png",
  },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = slides[index];

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full min-h-[550px] md:min-h-[600px] pt-[75px] overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/85 to-teal-900/90"></div>

        {/* Decorative Circles */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Pattern Overlay - Subtle Dots */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3Ccircle cx='13' cy='13' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
          {/* Text Content */}
          <div
            key={index}
            className="space-y-5 text-center lg:text-right animate-[slideIn_0.8s_ease-out]"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 shadow-lg">
              <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
              <span className="text-white font-semibold text-xs tracking-wide">
                منصة باسقات للأعمال والاستشارات
              </span>
            </div>

            {/* Main Title */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                {slide.title}
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-200">
                {slide.subtitle}
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {slide.desc}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href={slide.link}
                className="group inline-flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 text-emerald-900 px-6 py-3 rounded-xl font-bold shadow-xl hover:shadow-emerald-300/50 transition-all duration-300 text-sm hover:scale-105"
              >
                <span>{slide.btn}</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-sm transition-transform group-hover:-translate-x-1"
                />
              </a>

              <button className="group inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md border-2 border-white/40 hover:border-white/60 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 text-sm hover:scale-105">
                <FontAwesomeIcon icon={faPlay} className="text-xs" />
                <span>شاهد الفيديو</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 lg:gap-8 pt-4">
              <div className="text-center lg:text-right">
                <div className="text-2xl lg:text-3xl font-black text-white">
                  500+
                </div>
                <div className="text-xs text-emerald-200 font-semibold">
                  متدرب
                </div>
              </div>
              <div className="w-px h-10 bg-white/30"></div>
              <div className="text-center lg:text-right">
                <div className="text-2xl lg:text-3xl font-black text-white">
                  100+
                </div>
                <div className="text-xs text-emerald-200 font-semibold">
                  استشارة
                </div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden lg:flex items-center justify-center animate-[fadeIn_1s_ease-out]">
            <div className="relative max-w-lg w-full">
              {/* Decorative Frame */}
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl blur-lg"></div>

              {/* Image */}
              <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/30 shadow-lg">
                <Image
                  src={slide.img}
                  alt="باسقات - التدريب والاستشارات"
                  width={500}
                  height={350}
                  className="w-full h-[300px] object-cover rounded-lg"
                />

                {/* Overlay Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-lg px-3 py-2 shadow-lg">
                  <div className="text-base font-black">باسقات</div>
                  <div className="text-[10px] font-semibold opacity-90">
                    نحو التميز
                  </div>
                </div>

                {/* Floating Success Card */}
                <div className="absolute bottom-4 right-4 bg-white rounded-lg p-2 shadow-lg border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <span className="text-base">🎯</span>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-emerald-900">
                        نجاح مضمون
                      </div>
                      <div className="text-[8px] text-slate-600 font-semibold">
                        مع فريق محترف
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg z-20"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-base" />
      </button>

      <button
        onClick={nextSlide}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg z-20"
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-base" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="group relative"
          >
            <div
              className={`rounded-full transition-all duration-300 shadow-md ${index === i
                ? "bg-white w-10 h-2.5"
                : "bg-white/50 hover:bg-white/70 w-2.5 h-2.5"
                }`}
            ></div>
          </button>
        ))}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}
