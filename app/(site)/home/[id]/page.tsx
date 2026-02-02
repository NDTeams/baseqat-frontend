"use client";

import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faFacebookF, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { teachers, Teacher } from "@/components/(site)/teachers";

export default function TeacherDetailPage() {
  const params = useParams();
  const teacher: Teacher | undefined = teachers.find((t) => t.id === params.id);

  if (!teacher) return <p className="p-8 text-center">المدرب غير موجود</p>;

  // بيانات افتراضية يمكن تعديلها لاحقًا لكل مدرب
  const skills = ["تصميم تجربة المستخدم", "بحث المستخدم", "واجهات UI", "تحسين التحويل", "تصميم نظم التصميم"];
  const courses = [
    { title: "تصميم تجربة مستخدم فعّالة", category: "منتج", duration: "4 أسابيع", desc: "منهج عملي لتخطيط، نمذجة، واختبار تجربة المستخدم." },
    { title: "تحسين التحويل في المتاجر الرقمية", category: "تحسين", duration: "3 أسابيع", desc: "إستراتيجيات A/B واختبارات قابلية الاستخدام لزيادة المبيعات." },
  ];
  const reviews = [
    { name: "أحمد", rating: 5, comment: "شرح واضح وأمثلة واقعية؛ نفذنا تعديلات رفعت التحويل 15% في أسبوعين." },
    { name: "ليان", rating: 4, comment: "المحتوى مكثف ومباشر؛ الواجبات ساعدتني أبني بورتفوليو قوي." },
  ];

  return (
    <main className="pt-40 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-10">
        <section className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 grid lg:grid-cols-[2fr,3fr] gap-6">
          
          {/* العمود الأيسر: الصورة والبيانات الشخصية وروابط التواصل */}
          <div className="space-y-5">
            <img src={teacher.image} alt={teacher.name} className="w-full rounded-2xl object-cover shadow" />
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{teacher.name}</h1>
              <p className="text-emerald-700 font-semibold">{teacher.role}</p>
              <p className="text-slate-600">أعمل مع الفرق لبناء منتجات رقمية يحبها المستخدمون، من البحث إلى التصميم ثم الإطلاق.</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold text-xs">تقييم 4.9</span>
              <span><i className="fa-solid fa-user"></i> 1.2k طالب</span>
              <span><i className="fa-solid fa-video"></i> 24 درس</span>
            </div>
            <div className="flex gap-3 text-slate-600">
              {teacher.linkedin && (
                <a href={teacher.linkedin} target="_blank" rel="noreferrer" className="hover:text-emerald-700">
                  <FontAwesomeIcon icon={faLinkedinIn} className="text-lg" />
                </a>
              )}
              {teacher.facebook && (
                <a href={teacher.facebook} target="_blank" rel="noreferrer" className="hover:text-emerald-700">
                  <FontAwesomeIcon icon={faFacebookF} className="text-lg" />
                </a>
              )}
              {teacher.instagram && (
                <a href={teacher.instagram} target="_blank" rel="noreferrer" className="hover:text-emerald-700">
                  <FontAwesomeIcon icon={faInstagram} className="text-lg" />
                </a>
              )}
            </div>
          </div>

          {/* العمود الأيمن: المهارات، الدورات، آراء الطلاب */}
          <div className="space-y-6">

            {/* المهارات */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">المهارات</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">{skill}</span>
                ))}
              </div>
            </section>

            {/* الدورات */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">الدورات التي يدرّسها</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {courses.map((course, idx) => (
                  <article key={idx} className="border border-slate-100 rounded-2xl p-4 bg-white hover:border-emerald-200 hover:shadow transition space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">{course.category}</span>
                      <span className="font-bold text-emerald-700">{course.duration}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
                    <p className="text-sm text-slate-600 leading-6">{course.desc}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* آراء الطلاب */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">آراء الطلاب</h2>
              <div className="space-y-3">
                {reviews.map((review, idx) => (
                  <div key={idx} className="border border-slate-100 rounded-2xl p-4 bg-white space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">{review.name}</span>
                      <span className="text-amber-500">
                        {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </section>
      </div>
    </main>
  );
}
