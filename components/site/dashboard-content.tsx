"use client";

import React from "react";

interface Course {
  title: string;
  category: string;
  progress: number;
  imageUrl: string;
}

interface Assignment {
  title: string;
  due: string;
}

const courses: Course[] = [
  {
    title: "تحضير وملاءمة سوق",
    category: "تحضير السوق",
    progress: 65,
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "تسريع + إطلاق",
    category: "تسريع",
    progress: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "تحول وتشغيل رقمي",
    category: "تحول رقمي",
    progress: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1529333166433-84c3c85d1c8d?auto=format&fit=crop&w=400&q=80",
  },
];

const assignments: Assignment[] = [
  { title: "تسليم مخطط تجربة المستخدم", due: "18 يوليو" },
  { title: "إكمال اختبار قصير في “تسريع + إطلاق”", due: "16 يوليو" },
  { title: "مشاهدة الجلسة المسجلة حول “تحسين التحويل”", due: "14 يوليو" },
];

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Courses Section */}
      <section
        id="courses"
        className="bg-white border border-slate-100 rounded-2xl shadow p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">دوراتي</h2>
          <a
            href="#"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            عرض الكل
          </a>
        </div>

        <div className="space-y-4">
          {courses.map((course, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-4 p-4 border border-slate-100 rounded-xl hover:border-emerald-200 hover:shadow-sm transition"
            >
              <div
                className="w-full sm:w-32 h-24 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url('${course.imageUrl}')` }}
              ></div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">
                    {course.category}
                  </span>
                  <span>إنجاز {course.progress}%</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {course.title}
                </h3>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-emerald-600"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Assignments Section */}
      <section
        id="assignments"
        className="bg-white border border-slate-100 rounded-2xl shadow p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">المهام والواجبات</h2>
          <button className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            إضافة تذكير
          </button>
        </div>
        <ul className="space-y-3 text-sm text-slate-700">
          {assignments.map((assignment, index) => (
            <li key={index} className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-semibold text-slate-900">{assignment.title}</p>
                <p className="text-xs text-slate-500">موعد التسليم: {assignment.due}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
