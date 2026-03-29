"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "@/services/auth/page";

const navItems = [
  { href: "/student-dashboard/index", label: "الرئيسية", icon: faHome },
  { href: "/student-dashboard/profile", label: "البروفايل", icon: faUser },
  { href: "/student-dashboard/attendance", label: "الحضور", icon: faCalendarCheck },
  { href: "/student-dashboard/my-courses", label: "دوراتي", icon: faBookOpen },
  { href: "/student-dashboard/tasks", label: "المهام", icon: faTasks },
  { href: "/student-dashboard/wishlist", label: "المفضلة", icon: faHeart },
  { href: "/student-dashboard/certificates", label: "الشهادات", icon: faCertificate },
  { href: "/student-dashboard/quizzes", label: "الاختبارات", icon: faClipboardCheck },
  { href: "/student-dashboard/orders", label: "الطلبات", icon: faShoppingBag },
  { href: "/student-dashboard/settings", label: "الإعدادات", icon: faCog },
  { href: "/student-dashboard/consultations", label: "الاستشارات", icon: faComments },
  { href: "/student-dashboard/become-instructor", label: "كن مدربًا", icon: faChalkboardTeacher },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[999] bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:hidden">
      <div className="flex items-center gap-1 overflow-x-auto px-3 py-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 min-w-[70px] max-w-[90px] px-2 py-2 rounded-xl flex-shrink-0 transition-all relative ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500"
              }`}
            >
              {isActive && (
                <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
              )}
              <FontAwesomeIcon
                icon={item.icon}
                className={`text-lg ${isActive ? "scale-110" : ""} transition-transform`}
              />
              <span className={`text-[11px] text-center leading-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-full ${
                isActive ? "font-bold" : "font-semibold"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={() => AuthService.logout()}
          className="flex flex-col items-center justify-center gap-1 min-w-[70px] max-w-[90px] px-2 py-2 rounded-xl flex-shrink-0 text-red-500 transition-all"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="text-lg" />
          <span className="text-[11px] font-semibold">خروج</span>
        </button>
      </div>
    </nav>
  );
}
