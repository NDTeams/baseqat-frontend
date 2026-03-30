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
import { usePathname } from "next/navigation";

interface SidebarItem {
  href: string;
  label: string;
  icon: any;
}

const sidebarItems: SidebarItem[] = [
  { href: "/student-dashboard", label: "لوحة التحكم", icon: faHome },
  { href: "/student-dashboard/profile", label: "الملف الشخصي", icon: faUser },
  { href: "/student-dashboard/attendance", label: "حضور الدورات", icon: faCalendarCheck },
  { href: "/student-dashboard/my-courses", label: "دوراتي", icon: faBookOpen },
  { href: "/student-dashboard/tasks", label: "المهام", icon: faTasks },
  { href: "/student-dashboard/wishlist", label: "المفضلة", icon: faHeart },
  { href: "/student-dashboard/certificates", label: "الشهادات", icon: faCertificate },
  { href: "/student-dashboard/quizzes", label: "الاختبارات", icon: faClipboardCheck },
  { href: "/student-dashboard/orders", label: "المدفوعات", icon: faShoppingBag },
  { href: "/student-dashboard/settings", label: "الإعدادات", icon: faCog },
  { href: "/student-dashboard/consultations", label: "الاستشارات", icon: faComments },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/student-dashboard") return pathname === "/student-dashboard" || pathname === "/student-dashboard/index";
    return pathname === href || pathname.startsWith(href + "/");
  };

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
          lg:relative lg:translate-x-0 lg:block overflow-y-auto
          ${isOpen ? "translate-x-0" : "translate-x-full"} lg:my-8 lg:mx-2`}
      >
        <nav className="px-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-emerald-100 text-emerald-700 font-bold"
                  : "text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={item.icon} className="w-5 text-base" />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}

          <hr className="my-4 border-neutral-200" />

          <button
            className="flex items-center gap-3 text-red-600 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-200 w-full"
            onClick={() => {
              setIsOpen(false);
              window.location.href = "/";
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 text-base" />
            <span className="text-sm">تسجيل الخروج</span>
          </button>
        </nav>
      </aside>

      {/* Overlay للجوال فقط */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
