"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "أطلق مشروعك بثقة كاملة مع مسرعة باسقات",
    desc: "ندربك، نرشدك، ونقدم لك الاستشارات لتحويل فكرتك إلى مشروع جاهز للسوق بخطة واضحة ودعم متخصص.",
    btn: "احجز جلسة استشارية",
    link: "#contact",
    img: "/site/hero.jpg",
  },
  {
    title: "سرّع منتجك بخطة إطلاق واضحة",
    desc: "برنامج تسريع يشمل إعداد المبيعات، الملفات الاستثمارية، وتجربة العملاء مع فريق تشغيلي يرافقك حتى أول عميل مدفوع.",
    btn: "استكشف البرامج",
    link: "#courses",
    img: "/site/hero.jpg",
  },
  {
    title: "إرشاد متخصص وتمكين رقمي لفريقك",
    desc: "شبكة خبراء في المنتج، البيانات، والنمو تمنحك جلسات تكتيكية، أتمتة للعمليات، ولوحات تحكم تتابع التنفيذ.",
    btn: "تعرف على الخبراء",
    link: "#teachers",
    img: "/site/hero.jpg",
  },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <section
      className="relative w-full overflow-hidden pt-[0.5rem]"
      style={{
        background:
          "linear-gradient(135deg, rgba(12, 30, 24, 0.9) 0%, rgba(20, 55, 45, 0.85) 40%, rgba(14, 36, 28, 0.95) 100%), #0f241c",
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-1 sm:pt-12 mt-12 md:mt-0 pb-16 lg:pb-8">
        <div
          key={index}
          className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center animate-fade"
        >
          {/* النص */}
          <div className="space-y-4 sm:space-y-5 max-w-2xl text-emerald-50 text-center lg:text-right">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-snug">
              {slide.title}
            </h1>

            <p className="text-emerald-100 text-base sm:text-lg leading-7 sm:leading-8">
              {slide.desc}
            </p>

            <a
              href={slide.link}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-emerald-800 text-white px-5 sm:px-6 py-3 rounded-xl font-bold shadow-lg transition text-base sm:text-lg"
            >
              {slide.btn}
            </a>
          </div>

          {/* الصورة */}
          <Image
            src={slide.img}
            alt="hero"
            className="w-full h-[220px] sm:h-[320px] lg:h-[380px] object-cover rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
            width={600}
            height={600}
          />
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-10 sm:mt-16">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                index === i ? "bg-emerald-400" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
