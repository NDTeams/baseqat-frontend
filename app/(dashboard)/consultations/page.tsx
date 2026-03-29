"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faComments,
  faCalendarAlt,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const consultationsSections = [
  {
    title: "المستشارين",
    href: "/consultants",
    icon: faUserTie,
    bg: "bg-blue-50",
    color: "text-blue-600",
  },
  {
    title: "الجلسات",
    href: "/sessions",
    icon: faComments,
    bg: "bg-blue-50",
    color: "text-blue-600",
  },
  {
    title: "التقويم",
    href: "/calendar",
    icon: faCalendarAlt,
    bg: "bg-purple-50",
    color: "text-purple-600",
  },
];

export default function ConsultationsHubPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">الاستشارات</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {consultationsSections.map((item, index) => (
          <Link key={index} href={item.href} className="block group">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${item.bg} rounded-full flex items-center justify-center`}>
                    <FontAwesomeIcon icon={item.icon} className={`${item.color} text-xl`} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                </div>
                <FontAwesomeIcon icon={faArrowLeft} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
