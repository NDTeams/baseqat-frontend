"use client";

import { useContext, useEffect, useState } from "react";
import authService from "@/services/auth/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faBell,
  faEnvelope,
  faUser,
  faChevronDown,
  faCheck,
  faCog,
  faLock,
  faSignOutAlt,
  faGlobe,
  faThLarge,
  faGraduationCap,
  faChalkboardTeacher,
  faBookOpen,
  faUserGraduate,
  faListCheck,
  faUserTie,
  faComments,
  faCalendarAlt,
  faClipboardList,
  faNewspaper,
  faUsers,
  faUserShield,
  faKey,
  faUsersCog,
  faChartLine,
  faDatabase,
  faVial,
} from "@fortawesome/free-solid-svg-icons";
import { SidebarContext } from "@/app/(dashboard)/layout";
import { useRouter } from "next/navigation";

// قائمة جميع الصفحات للبحث
const allPages = [
  { href: "/index", title: "لوحة التحكم", icon: faThLarge, category: "الرئيسية" },

  // إدارة الدورات
  { href: "/courses", title: "الدورات", icon: faGraduationCap, category: "إدارة الدورات" },
  { href: "/course-categories", title: "تصنيفات الدورات", icon: faBookOpen, category: "إدارة الدورات" },
  { href: "/instructors-admin", title: "المدربين", icon: faChalkboardTeacher, category: "إدارة الدورات" },
  { href: "/instructor-skills", title: "مهارات المدربين", icon: faListCheck, category: "إدارة الدورات" },
  { href: "/enrollments", title: "التسجيلات", icon: faUserGraduate, category: "إدارة الدورات" },

  // إدارة الاستشارات
  { href: "/consultations", title: "الاستشارات", icon: faComments, category: "إدارة الاستشارات" },
  { href: "/consultants-admin", title: "المستشارين", icon: faUserTie, category: "إدارة الاستشارات" },
  { href: "/consultation-categories-admin", title: "تصنيفات الاستشارات", icon: faClipboardList, category: "إدارة الاستشارات" },
  { href: "/consultation-requests-admin", title: "طلبات الاستشارات", icon: faCalendarAlt, category: "إدارة الاستشارات" },
  { href: "/calendar", title: "التقويم", icon: faCalendarAlt, category: "إدارة الاستشارات" },

  // المحتوى
  { href: "/media-center-admin", title: "المركز الإعلامي", icon: faNewspaper, category: "المحتوى" },
  { href: "/contact-requests", title: "طلبات التواصل", icon: faEnvelope, category: "المحتوى" },
  { href: "/indicators", title: "المؤشرات", icon: faChartLine, category: "المحتوى" },

  // إدارة المستخدمين
  { href: "/users", title: "المستخدمين", icon: faUsers, category: "إدارة المستخدمين" },
  { href: "/user-management", title: "إدارة المستخدمين", icon: faUsersCog, category: "إدارة المستخدمين" },
  { href: "/roles", title: "المجموعات", icon: faUserShield, category: "إدارة المستخدمين" },
  { href: "/privileges", title: "الصلاحيات", icon: faKey, category: "إدارة المستخدمين" },

  // الإعدادات
  { href: "/settings", title: "الإعدادات", icon: faCog, category: "الإعدادات" },
  { href: "/seed", title: "البيانات التجريبية", icon: faDatabase, category: "الإعدادات" },
  { href: "/auth-test", title: "اختبار المصادقة", icon: faVial, category: "الإعدادات" },
];

export default function Header() {
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toggleSidebar } = useContext(SidebarContext);
  const router = useRouter();

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const filteredPages = searchQuery
    ? allPages.filter(
        (page) =>
          page.title.includes(searchQuery) ||
          page.category.includes(searchQuery)
      )
    : allPages;

  const getInitials = (name: string) => {
    if (!name) return "UN";
    const parts = name.split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`
      : name.substring(0, 2);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setNotifMenuOpen(false);
        setUserMenuOpen(false);
        setLangMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handlePageClick = (href: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  const handleLogout = async () => {
    await authService.logout();
    // تم إعادة التوجيه تلقائياً من دالة logout
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 gap-3 shadow-sm flex-shrink-0 z-30">

        {/* Hamburger Toggle */}
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition flex-shrink-0"
          title="القائمة"
          aria-label="تبديل القائمة"
        >
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>

        {/* Search Trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 flex-1 max-w-xs mx-1 md:mx-4 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100 text-slate-400 text-xs sm:text-sm hover:bg-slate-200 transition"
        >
          <FontAwesomeIcon icon={faSearch} className="text-base" />
          <span className="truncate hidden sm:block">بحث سريع...</span>
          <span className="truncate sm:hidden">بحث...</span>
          <span className="ms-auto hidden md:flex items-center gap-0.5 text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400">
            <span>Ctrl</span><span>K</span>
          </span>
        </button>

        {/* Spacer */}
        <div className="flex-1 hidden sm:block"></div>

        {/* Header Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">

          {/* Notifications */}
          <div className="relative" data-dropdown="notifications">
            <button
              onClick={() => setNotifMenuOpen(!notifMenuOpen)}
              className="relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition"
              title="الإشعارات"
            >
              <FontAwesomeIcon icon={faBell} className="text-xl" />
              <span className="absolute -top-1 -left-1 flex items-center justify-center bg-red-500 text-white rounded-full w-5 h-5 text-[10px] font-bold">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            {notifMenuOpen && (
              <div className="absolute top-12 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-emerald-700">
                  <h3 className="text-white font-bold text-sm">الإشعارات</h3>
                  <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-lg">
                    جديد 3
                  </span>
                </div>

                {/* Notifications List */}
                <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                  {/* Sample Notification */}
                  <div className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition cursor-pointer">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                      <FontAwesomeIcon icon={faBell} className="text-emerald-700 text-base" />
                    </div>
                    <div className="flex-1 text-right min-w-0">
                      <p className="text-xs text-slate-700 leading-relaxed">
                        لديك تسجيل جديد في دورة <span className="font-bold text-emerald-700">تطوير الويب</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">منذ 5 دقائق</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition cursor-pointer">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 text-base" />
                    </div>
                    <div className="flex-1 text-right min-w-0">
                      <p className="text-xs text-slate-700 leading-relaxed">
                        استشارة جديدة تنتظر الموافقة
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">منذ ساعة</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition cursor-pointer">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                      <FontAwesomeIcon icon={faBell} className="text-purple-600 text-base" />
                    </div>
                    <div className="flex-1 text-right min-w-0">
                      <p className="text-xs text-slate-700 leading-relaxed">
                        تم نشر محتوى جديد في المركز الإعلامي
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">منذ 3 ساعات</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-slate-100 text-center">
                  <a href="#" className="text-xs font-bold text-emerald-700 hover:underline">
                    عرض كل الإشعارات →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <button
            className="relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition"
            title="الرسائل"
          >
            <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
            <span className="absolute -top-1 -left-1 flex items-center justify-center bg-emerald-500 text-white rounded-full w-5 h-5 text-[10px] font-bold">
              5
            </span>
          </button>

          {/* Language Switcher */}
          <div className="relative" data-dropdown="language">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition"
              title="اللغة"
            >
              <FontAwesomeIcon icon={faGlobe} className="text-lg" />
              <span className="text-xs font-semibold hidden sm:block">عربي</span>
              <FontAwesomeIcon icon={faChevronDown} className="text-sm text-slate-400" />
            </button>

            {/* Language Dropdown */}
            {langMenuOpen && (
              <div className="absolute left-0 top-11 w-40 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                <button className="w-full flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-emerald-50 transition text-right">
                  <span className="text-sm font-medium text-slate-700">عربي 🇸🇦</span>
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-700 text-sm" />
                </button>
                <button className="w-full flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-emerald-50 transition text-right">
                  <span className="text-sm font-medium text-slate-700">English 🇬🇧</span>
                  <FontAwesomeIcon icon={faCheck} className="text-slate-200 text-sm" />
                </button>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" data-dropdown="profile">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-emerald-50 transition cursor-pointer"
              title="الملف الشخصي"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold ring-2 ring-emerald-200">
                  {currentUser ? getInitials(currentUser.name) : "UN"}
                </div>
                <span className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-700 leading-tight">
                  {currentUser?.name || "مستخدم"}
                </p>
                <p className="text-[11px] text-slate-400">
                  {currentUser?.role || "مدير النظام"}
                </p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {userMenuOpen && (
              <div className="absolute top-12 left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                {/* Welcome Banner */}
                <div className="px-4 py-3 bg-emerald-50 border-b border-slate-100 text-right">
                  <p className="text-xs text-slate-500">مرحباً</p>
                  <p className="text-sm font-bold text-emerald-700">
                    {currentUser?.name || "مستخدم"}!
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <a
                    href="/index"
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                  >
                    <span>الملف الشخصي</span>
                    <FontAwesomeIcon icon={faUser} className="text-base text-slate-400" />
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                  >
                    <span>الإعدادات</span>
                    <FontAwesomeIcon icon={faCog} className="text-base text-slate-400" />
                  </a>
                </div>

                {/* Bottom Items */}
                <div className="py-1 border-t border-slate-100">
                  <a
                    href="/lock-screen"
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                  >
                    <span>قفل الشاشة</span>
                    <FontAwesomeIcon icon={faLock} className="text-base text-slate-400" />
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    <span>تسجيل الخروج</span>
                    <FontAwesomeIcon icon={faSignOutAlt} className="text-base" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Command Palette Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-emerald-900/55 backdrop-blur-sm z-[100] flex items-start justify-center pt-[10vh]"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
              <FontAwesomeIcon icon={faSearch} className="text-xl text-emerald-700 flex-shrink-0" />
              <input
                type="text"
                placeholder="ابحث عن صفحة أو إجراء..."
                className="flex-1 text-sm text-slate-700 bg-transparent placeholder-slate-400 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs text-slate-400 border border-slate-200 rounded px-2 py-1 hover:bg-slate-50"
              >
                Esc
              </button>
            </div>

            {/* Results */}
            <div className="py-2 max-h-96 overflow-y-auto">
              {filteredPages.length > 0 ? (
                <>
                  {/* Group by category */}
                  {Array.from(new Set(filteredPages.map((p) => p.category))).map((category) => (
                    <div key={category}>
                      <div className="px-3 py-2">
                        <p className="text-xs font-bold text-slate-400 px-3">{category}</p>
                      </div>
                      {filteredPages
                        .filter((p) => p.category === category)
                        .map((page) => (
                          <button
                            key={page.href}
                            onClick={() => handlePageClick(page.href)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition cursor-pointer text-right"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <FontAwesomeIcon icon={page.icon} className="text-emerald-700" />
                            </div>
                            <div className="flex-1 text-right">
                              <p className="text-sm font-medium text-slate-700">{page.title}</p>
                              <p className="text-xs text-slate-400">{page.href}</p>
                            </div>
                          </button>
                        ))}
                    </div>
                  ))}
                </>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-slate-400">لا توجد نتائج</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-slate-100 text-[10px] text-slate-400">
              <span>
                <kbd className="bg-slate-100 border border-slate-200 rounded px-1">↑↓</kbd> تنقل
              </span>
              <span>
                <kbd className="bg-slate-100 border border-slate-200 rounded px-1">↵</kbd> فتح
              </span>
              <span>
                <kbd className="bg-slate-100 border border-slate-200 rounded px-1">Esc</kbd> إغلاق
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
