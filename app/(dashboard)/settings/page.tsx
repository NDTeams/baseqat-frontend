"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faUsers,
  faUserShield,
  faUserTag,
  faTags,
  faLayerGroup,
  faTicketAlt,
  faMoneyBillWave,
  faCity,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const settingsList = [
  {
    title: "إدارة الباقات",
    href: "/plans",
    icon: faBox,
    bg: "bg-primary/10",
    hoverBg: "group-hover:bg-primary",
    color: "text-primary",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-primary",
  },
  {
    title: "إدارة المستخدمين",
    href: "/users",
    icon: faUsers,
    bg: "bg-blue-50",
    hoverBg: "group-hover:bg-blue-600",
    color: "text-blue-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-blue-600",
  },
  {
    title: "الصلاحيات",
    href: "/Privileges",
    icon: faUserShield,
    bg: "bg-green-50",
    hoverBg: "group-hover:bg-green-600",
    color: "text-green-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-green-600",
  },
  {
    title: "إدارة الأدوار",
    href: "/Roles",
    icon: faUserTag,
    bg: "bg-orange-50",
    hoverBg: "group-hover:bg-orange-600",
    color: "text-orange-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-orange-600",
  },
  {
    title: "إدارة الوسوم",
    href: "/Tag",
    icon: faTags,
    bg: "bg-purple-50",
    hoverBg: "group-hover:bg-purple-600",
    color: "text-purple-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-purple-600",
  },
  {
    title: "إدارة فئات الخدمات",
    href: "/ServiceCategories",
    icon: faLayerGroup,
    bg: "bg-indigo-50",
    hoverBg: "group-hover:bg-indigo-600",
    color: "text-indigo-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-indigo-600",
  },
  {
    title: "إدارة الكوبونات",
    href: "/coupons",
    icon: faTicketAlt,
    bg: "bg-pink-50",
    hoverBg: "group-hover:bg-pink-600",
    color: "text-pink-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-pink-600",
  },
  {
    title: "سجل المدفوعات",
    href: "/userPayments",
    icon: faMoneyBillWave,
    bg: "bg-yellow-50",
    hoverBg: "group-hover:bg-yellow-600",
    color: "text-yellow-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-yellow-600",
  },
  {
    title: "إدارة المدن",
    href: "/city",
    icon: faCity,
    bg: "bg-cyan-50",
    hoverBg: "group-hover:bg-cyan-600",
    color: "text-cyan-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-cyan-600",
  },
];

export default function Settings() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 fade-in-up delay-200">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          الاعدادات
        </h1>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsList.map((item, index) => (
          <Link key={index} href={item.href} className="block group">
            <div className="bg-white rounded-xl card-shadow p-6 hover:shadow-lg transition-all transform group-hover:-translate-y-1 h-full cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div
                    className={`w-12 h-12 ${item.bg} rounded-full flex items-center justify-center ${item.hoverBg} transition-colors`}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`${item.color} text-xl ${item.hoverColor} transition-colors`}
                    />
                  </div>
                  <div className="mr-3">
                    <h3 className="font-bold text-lg text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <div
                  className={`text-gray-400 ${item.arrowHover} transition-colors`}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
