"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faArrowUp,
  faPlayCircle,
  faClock,
  faCheckCircle,
  faTrophy,
  faFire,
} from "@fortawesome/free-solid-svg-icons";

export default function ProgressCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      {/* Enrolled Courses */}
      <div
        className="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-primary"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <FontAwesomeIcon icon={faBookOpen} className="text-2xl text-primary" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-neutral-900 mb-1">5</div>
            <div className="text-sm text-neutral-600">الدورات المسجلة</div>
          </div>
        </div>
        <div className="pt-4 border-t border-neutral-100">
          <div className="flex items-center text-xs text-neutral-500">
            <FontAwesomeIcon icon={faArrowUp} className="text-green-500 ml-2" />
            <span>زيادة 2 دورة هذا الشهر</span>
          </div>
        </div>
      </div>

      {/* Active Courses */}
      <div
        className="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-accent"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
            <FontAwesomeIcon icon={faPlayCircle} className="text-2xl text-accent" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-neutral-900 mb-1">3</div>
            <div className="text-sm text-neutral-600">الدورات النشطة</div>
          </div>
        </div>
        <div className="pt-4 border-t border-neutral-100">
          <div className="flex items-center text-xs text-neutral-500">
            <FontAwesomeIcon icon={faClock} className="text-blue-500 ml-2" />
            <span>متوسط التقدم: 60%</span>
          </div>
        </div>
      </div>

      {/* Completed Courses */}
      <div
        className="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-secondary"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-secondary" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-neutral-900 mb-1">2</div>
            <div className="text-sm text-neutral-600">الدورات المكتملة</div>
          </div>
        </div>
        <div className="pt-4 border-t border-neutral-100">
          <div className="flex items-center text-xs text-neutral-500">
            <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 ml-2" />
            <span>4 شهادات حصلت عليها</span>
          </div>
        </div>
      </div>

      {/* Learning Hours */}
      <div
        className="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-purple-500"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center">
            <FontAwesomeIcon icon={faClock} className="text-2xl text-purple-500" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-neutral-900 mb-1">120</div>
            <div className="text-sm text-neutral-600">ساعة تعلم</div>
          </div>
        </div>
        <div className="pt-4 border-t border-neutral-100">
          <div className="flex items-center text-xs text-neutral-500">
            <FontAwesomeIcon icon={faFire} className="text-orange-500 ml-2" />
            <span>15 ساعة هذا الأسبوع</span>
          </div>
        </div>
      </div>

    </div>
  );
}
