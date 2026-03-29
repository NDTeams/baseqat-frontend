"use client";

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
  faUserTie,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthService } from "@/services/auth/page";
import { useCurrentUser } from "@/lib/useCurrentUser";

const sidebarItems = [
  { href: "/client-dashboard/index", label: "لوحة التحكم", icon: faHome },
  { href: "/client-dashboard/profile", label: "صفحة البروفايل", icon: faUser },
  { href: "/client-dashboard/attendance", label: "حضور الدورة", icon: faCalendarCheck },
  { href: "/client-dashboard/my-courses", label: "دوراتي", icon: faBookOpen },
  { href: "/client-dashboard/tasks", label: "المهام", icon: faTasks },
  { href: "/client-dashboard/wishlist", label: "المفضلة", icon: faHeart },
  { href: "/client-dashboard/certificates", label: "الشهادات", icon: faCertificate },
  { href: "/client-dashboard/quizzes", label: "الاختبارات", icon: faClipboardCheck },
  { href: "/client-dashboard/orders", label: "المدفوعات والطلبات", icon: faShoppingBag },
  { href: "/client-dashboard/settings", label: "الإعدادات", icon: faCog },
  { href: "/client-dashboard/consultations", label: "الاستشارات", icon: faComments },
  { href: "/client-dashboard/calendar", label: "تقويم الاستشارات", icon: faCalendarCheck },
  { href: "/client-dashboard/become-instructor", label: "كن مدربًا", icon: faChalkboardTeacher },
  { href: "/client-dashboard/become-consultant", label: "كن مستشارًا", icon: faUserTie },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const { roles } = useCurrentUser();
  const isConsultant = roles.some(r => r.toLowerCase() === 'consultant');

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 my-8 mx-2 py-4 px-2 rounded-xl bg-white shadow-lg sticky top-36 h-fit">
      <nav className="px-2 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border-r-[3px] ${
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-blue-600 font-bold"
                  : "text-gray-600 border-r-transparent hover:bg-gray-50 hover:text-blue-700 hover:border-r-blue-600"
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="w-5 text-sm" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}

        {/* Consultant-only link */}
        {isConsultant && (
          <>
            <hr className="my-4 border-gray-200" />
            <Link
              href="/client-dashboard/assigned-consultations"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border-r-[3px] ${
                pathname === "/client-dashboard/assigned-consultations"
                  ? "bg-sky-50 text-sky-700 border-r-sky-600 font-bold"
                  : "text-gray-600 border-r-transparent hover:bg-gray-50 hover:text-sky-700 hover:border-r-sky-600"
              }`}
            >
              <FontAwesomeIcon icon={faClipboardList} className="w-5 text-sm" />
              <span className="text-sm">طلبات الاستشارة</span>
            </Link>
          </>
        )}

        <hr className="my-4 border-gray-200" />

        <button
          onClick={() => AuthService.logout()}
          className="w-full flex items-center gap-3 text-red-600 px-4 py-3 rounded-lg hover:bg-red-50 transition-all duration-200"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5 text-sm" />
          <span className="text-sm">تسجيل الخروج</span>
        </button>
      </nav>
    </aside>
  );
}
