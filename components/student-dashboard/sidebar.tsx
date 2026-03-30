"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faCalendarCheck,
  faBookOpen,
  faTasks,
  faHeart,
  faCertificate,
  faClipboardCheck,
  faShoppingBag,
  faCog,
  faComments,
  faSignOutAlt,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface SidebarItem {
  href: string;
  label: string;
  icon: any;
  active?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { href: "/index", label: "لوحة التحكم", icon: faHome },
  { href: "/profile", label: "صفحة البروفايل", icon: faUser },
  { href: "/attendance", label: "صفحة حضور الدورة", icon: faCalendarCheck, active: true },
  { href: "/my-courses", label: "صفحة الدورات الخاصة بالطالب", icon: faBookOpen },
  { href: "/tasks", label: "صفحة المهام", icon: faTasks },
  { href: "/wishlist", label: "صفحة الدورات المفضلة", icon: faHeart },
  { href: "/certificates", label: "صفحة الشهادات", icon: faCertificate },
  { href: "/quizzes", label: "صفحة الاختبارات", icon: faClipboardCheck },
  { href: "/orders", label: "صفحة المدفوعات او الطلبات", icon: faShoppingBag },
  { href: "/settings", label: "صفحة الاعدادات", icon: faCog },
  { href: "/consultations", label: "صفحة الاستشارات", icon: faComments },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // state لفتح/غلق الـ Sidebar

  return (
    <>
      {/* زر Toggle يظهر على الجوال فقط */}
      <button
        className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition fixed top-4 right-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={isOpen ? faXmark : faBars} className="text-xl text-neutral-700" />
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar w-64 flex-shrink-0 my-8 py-4 px-2 rounded-xl shadow-lg
          fixed top-0 right-0 h-full bg-white z-40 transform transition-transform duration-300
          lg:relative lg:translate-x-0 lg:block
          ${isOpen ? "translate-x-0" : "translate-x-full"} lg:my-8 lg:mx-2`}
      >
        <nav className="px-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-reverse space-x-3 px-4 py-3 transition-all duration-300 border-r-2 ${
                item.active
                  ? "bg-green-100 text-green-700 border-r-green-600 font-bold"
                  : "text-neutral-700 border-r-transparent hover:bg-green-100 hover:text-green-700 hover:border-r-green-600"
              }`}
              onClick={() => setIsOpen(false)} // يغلق الـ Sidebar بعد الضغط على أي رابط
            >
              <FontAwesomeIcon icon={item.icon} className="w-5" />
              <span>{item.label}</span>
            </Link>
          ))}

          <hr className="my-4 border-neutral-200" />

          <Link
            href="/"
            className="flex items-center space-x-reverse space-x-3 text-red-600 px-4 py-3 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
            <span>تسجيل الخروج</span>
          </Link>
        </nav>
      </aside>

      {/* Overlay للجوال فقط */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
