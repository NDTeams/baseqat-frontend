"use client";

import React from "react";
import DashboardContent from "@/components/site/dashboard-content";
export default function DashboardMain() {
  return (
    <div className="flex-1 space-y-6">
      <section id="overview" className="grid md:grid-cols-[1.2fr,2fr] gap-6">
        {/* Left column */}
        <div className="space-y-3">
          {/* Greeting Card */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
                className="w-16 h-16 rounded-full object-cover"
                alt="طالب"
              />
              <div>
                <h1 className="text-xl font-bold text-slate-900">مرحباً، محمد</h1>
                <p className="text-sm text-slate-600">تعلم واستكمل دوراتك من هنا</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-emerald-50 text-emerald-800 rounded-xl p-3">
                <div className="text-2xl font-extrabold">6</div>
                <div className="text-xs font-semibold">دورات نشطة</div>
              </div>
              <div className="bg-slate-50 text-slate-800 rounded-xl p-3">
                <div className="text-2xl font-extrabold">18</div>
                <div className="text-xs font-semibold">درس مكتمل</div>
              </div>
              <div className="bg-amber-50 text-amber-800 rounded-xl p-3">
                <div className="text-2xl font-extrabold">3</div>
                <div className="text-xs font-semibold">مهام بانتظارك</div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">إشعارات</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500"></span>
                <div>تم نشر درس جديد في دورة “تسريع + إطلاق”.</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500"></span>
                <div>موعد جلسة مباشرة غداً الساعة 7 مساءً.</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-2 h-2 rounded-full bg-amber-400"></span>
                <div>لديك مهمة واجب مفتوحة في “تصميم تجربة مستخدم”.</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right column */}
        <DashboardContent />
      </section>
    </div>
  );
}
