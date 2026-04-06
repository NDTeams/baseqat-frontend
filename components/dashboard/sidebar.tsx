"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SidebarContext } from "@/app/(dashboard)/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faBars,
  faTimes,
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
  faEnvelope,
  faChartLine,
  faCog,
  faDatabase,
  faVial,
  faArrowDown,
  faHistory,
  faCertificate,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    courses: true,
    consultations: false,
    content: false,
    users: false,
    system: false,
  });
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside
      className={`h-screen flex-shrink-0 flex flex-col bg-emerald-700 text-white shadow-2xl relative transition-all duration-300 z-50
      ${isCollapsed ? "w-[72px]" : "w-[260px]"}
      ${isMobile ? `fixed top-0 right-0 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full"}` : ""}`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-5 py-5 border-b border-white/10 bg-emerald-800/30 hover:bg-emerald-800/50 transition-colors">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-lg flex-shrink-0 overflow-hidden">
          <img
            src="/site/logo.png"
            alt="باسقات"
            className="w-full h-full object-contain p-1"
          />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-white leading-tight">
              باسقات
            </span>
            <span className="text-[10px] text-white/60 font-medium tracking-wider">
              BASEQAT PLATFORM
            </span>
          </div>
        )}
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 sidebar-scrollbar">
        {/* Section label */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <div className="h-px flex-1 bg-white/20"></div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
              القائمة
            </p>
            <div className="h-px flex-1 bg-white/20"></div>
          </div>
        )}

        {/* Dashboard Home */}
        <MenuItem
          href="/index"
          icon={faThLarge}
          text="لوحة التحكم"
          collapsed={isCollapsed}
          active={pathname === "/index"}
        />

        {/* إدارة الدورات */}
        <MenuSection
          title="إدارة الدورات"
          icon={faGraduationCap}
          sectionKey="courses"
          expanded={expandedSections.courses}
          onToggle={toggleSection}
          collapsed={isCollapsed}
        >
          <MenuItem
            href="/courses"
            icon={faGraduationCap}
            text="الدورات"
            collapsed={isCollapsed}
            active={pathname === "/courses"}
          />
          <MenuItem
            href="/course-categories"
            icon={faBookOpen}
            text="تصنيفات الدورات"
            collapsed={isCollapsed}
            active={pathname === "/course-categories"}
          />
          <MenuItem
            href="/instructors-admin"
            icon={faChalkboardTeacher}
            text="المدربين"
            collapsed={isCollapsed}
            active={pathname === "/instructors-admin"}
          />
          <MenuItem
            href="/instructor-skills"
            icon={faListCheck}
            text="مهارات المدربين"
            collapsed={isCollapsed}
            active={pathname === "/instructor-skills"}
          />
          <MenuItem
            href="/enrollments"
            icon={faUserGraduate}
            text="التسجيلات"
            collapsed={isCollapsed}
            active={pathname === "/enrollments"}
          />
          <MenuItem
            href="/certificates"
            icon={faCertificate}
            text="الشهادات"
            collapsed={isCollapsed}
            active={pathname === "/certificates"}
          />
          <MenuItem
            href="/quizzes"
            icon={faClipboardList}
            text="الاختبارات"
            collapsed={isCollapsed}
            active={pathname === "/quizzes"}
          />
          <MenuItem
            href="/payments"
            icon={faChartLine}
            text="المدفوعات"
            collapsed={isCollapsed}
            active={pathname === "/payments"}
          />
        </MenuSection>

        {/* إدارة الاستشارات */}
        <MenuSection
          title="إدارة الاستشارات"
          icon={faComments}
          sectionKey="consultations"
          expanded={expandedSections.consultations}
          onToggle={toggleSection}
          collapsed={isCollapsed}
        >
          <MenuItem
            href="/consultations"
            icon={faComments}
            text="الاستشارات"
            collapsed={isCollapsed}
            active={pathname === "/consultations"}
          />
          <MenuItem
            href="/consultants-admin"
            icon={faUserTie}
            text="المستشارين"
            collapsed={isCollapsed}
            active={pathname === "/consultants-admin"}
          />
          <MenuItem
            href="/consultation-categories-admin"
            icon={faClipboardList}
            text="تصنيفات الاستشارات"
            collapsed={isCollapsed}
            active={pathname === "/consultation-categories-admin"}
          />
          <MenuItem
            href="/consultation-requests-admin"
            icon={faCalendarAlt}
            text="طلبات الاستشارات"
            collapsed={isCollapsed}
            active={pathname === "/consultation-requests-admin"}
          />
          <MenuItem
            href="/calendar"
            icon={faCalendarAlt}
            text="التقويم"
            collapsed={isCollapsed}
            active={pathname === "/calendar"}
          />
        </MenuSection>

        {/* المحتوى */}
        <MenuSection
          title="المحتوى"
          icon={faNewspaper}
          sectionKey="content"
          expanded={expandedSections.content}
          onToggle={toggleSection}
          collapsed={isCollapsed}
        >
          <MenuItem
            href="/media-center-admin"
            icon={faNewspaper}
            text="المركز الإعلامي"
            collapsed={isCollapsed}
            active={pathname === "/media-center-admin"}
          />
          <MenuItem
            href="/contact-requests"
            icon={faEnvelope}
            text="طلبات التواصل"
            collapsed={isCollapsed}
            active={pathname === "/contact-requests"}
          />
          <MenuItem
            href="/indicators"
            icon={faChartLine}
            text="المؤشرات"
            collapsed={isCollapsed}
            active={pathname === "/indicators"}
          />
          <MenuItem
            href="/home-statistics"
            icon={faChartLine}
            text="إحصائيات الموقع"
            collapsed={isCollapsed}
            active={pathname === "/home-statistics"}
          />
        </MenuSection>

        {/* Divider */}
        {!isCollapsed && <div className="my-2 border-t border-white/10"></div>}
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <div className="h-px flex-1 bg-white/20"></div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
              النظام
            </p>
            <div className="h-px flex-1 bg-white/20"></div>
          </div>
        )}

        {/* إدارة المستخدمين */}
        <MenuSection
          title="إدارة المستخدمين"
          icon={faUsers}
          sectionKey="users"
          expanded={expandedSections.users}
          onToggle={toggleSection}
          collapsed={isCollapsed}
        >
          <MenuItem
            href="/users"
            icon={faUsers}
            text="المستخدمين"
            collapsed={isCollapsed}
            active={pathname === "/users"}
          />
          <MenuItem
            href="/user-management"
            icon={faUsersCog}
            text="إدارة المستخدمين"
            collapsed={isCollapsed}
            active={pathname === "/user-management"}
          />
          <MenuItem
            href="/roles"
            icon={faUserShield}
            text="المجموعات"
            collapsed={isCollapsed}
            active={pathname === "/roles"}
          />
          <MenuItem
            href="/privileges"
            icon={faKey}
            text="الصلاحيات"
            collapsed={isCollapsed}
            active={pathname === "/privileges"}
          />
          <MenuItem
            href="/login-logs"
            icon={faHistory}
            text="سجل الدخول"
            collapsed={isCollapsed}
            active={pathname === "/login-logs"}
          />
        </MenuSection>

        {/* الإعدادات */}
        <MenuSection
          title="الإعدادات"
          icon={faCog}
          sectionKey="system"
          expanded={expandedSections.system}
          onToggle={toggleSection}
          collapsed={isCollapsed}
        >
          <MenuItem
            href="/settings"
            icon={faCog}
            text="الإعدادات"
            collapsed={isCollapsed}
            active={pathname === "/settings"}
          />
          <MenuItem
            href="/seed"
            icon={faDatabase}
            text="البيانات التجريبية"
            collapsed={isCollapsed}
            active={pathname === "/seed"}
          />
          <MenuItem
            href="/auth-test"
            icon={faVial}
            text="اختبار المصادقة"
            collapsed={isCollapsed}
            active={pathname === "/auth-test"}
          />
        </MenuSection>
      </nav>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-3 top-20 w-6 h-6 bg-emerald-600 hover:bg-emerald-800 rounded-full flex items-center justify-center shadow-lg transition-colors border-2 border-white"
        title={isCollapsed ? "توسيع القائمة" : "تصغير القائمة"}
      >
        <FontAwesomeIcon
          icon={isCollapsed ? faBars : faTimes}
          className="text-white text-xs"
        />
      </button>

      <style jsx global>{`
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.25);
          border-radius: 4px;
        }
      `}</style>
    </aside>
  );
}

function MenuSection({
  title,
  icon,
  sectionKey,
  expanded,
  onToggle,
  collapsed,
  children,
}: {
  title: string;
  icon: IconProp;
  sectionKey: string;
  expanded: boolean;
  onToggle: (key: string) => void;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  if (collapsed) {
    return (
      <div className="relative group nav-item" data-label={title}>
        <div className="flex items-center justify-center p-3 cursor-pointer transition-all">
          <FontAwesomeIcon icon={icon} className="text-xl text-white/80" />
        </div>
      </div>
    );
  }

  return (
    <div className={`nav-item ${expanded ? "active" : ""}`}>
      <button
        onClick={() => onToggle(sectionKey)}
        className={`nav-item-inner w-full flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all rounded-lg
          ${expanded ? "bg-white/15" : "hover:bg-white/10"}`}
      >
        <FontAwesomeIcon
          icon={icon}
          className={`nav-icon text-xl flex-shrink-0 ${expanded ? "text-white" : "text-white/70"
            }`}
        />
        <span className="nav-label flex-1 text-sm font-semibold text-right">
          {title}
        </span>
        <FontAwesomeIcon
          icon={faArrowDown}
          className={`nav-arrow text-white/60 transition-transform duration-300 ${expanded ? "rotate-180" : ""
            }`}
        />
      </button>
      <div
        className={`sub-menu overflow-hidden transition-all duration-300 ${expanded ? "max-h-[500px] mt-1" : "max-h-0"
          }`}
      >
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
}

function MenuItem({
  href,
  icon,
  text,
  collapsed,
  active,
}: {
  href: string;
  icon: IconProp;
  text: string;
  collapsed: boolean;
  active?: boolean;
}) {
  return (
    <div className="relative group nav-item" data-label={text}>
      <Link
        href={href}
        className={`flex items-center gap-2 py-1.5 px-3 text-sm rounded-lg transition-all
        ${active
            ? "bg-white/15 text-white font-semibold"
            : "text-white/70 hover:text-white hover:bg-white/10"
          }
        ${collapsed ? "justify-center" : ""}`}
      >
        <FontAwesomeIcon icon={icon} className="text-lg flex-shrink-0" />
        {!collapsed && <span className="flex-1 text-right">{text}</span>}
      </Link>

      {/* Tooltip when collapsed */}
      {collapsed && (
        <span className="sidebar-tooltip opacity-0 group-hover:opacity-100">
          {text}
        </span>
      )}

      <style jsx>{`
        .sidebar-tooltip {
          position: absolute;
          right: 78px;
          top: 50%;
          transform: translateY(-50%);
          background: #065f46;
          color: #fff;
          padding: 4px 10px;
          border-radius: 6px;
          white-space: nowrap;
          font-size: 12px;
          pointer-events: none;
          z-index: 999;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: opacity 0.2s;
        }
      `}</style>
    </div>
  );
}
