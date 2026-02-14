"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faBars,
  faTimes,
  faThLarge,
  faClock,
  faFileAlt,
  faMoneyBillWave,
  faUsers,
  faCog,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside
      className={`h-screen bg-dashboardBg text-white flex flex-col transition-all duration-300
      ${isCollapsed ? "w-20" : "w-[200px]"}`}
    >
      {/* Logo */}
      <div className="sidebar-header p-5 border-b border-white/20">
        <div className="logo-container flex items-center space-x-3 space-x-reverse justify-center">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faLeaf} className="text-white text-lg" />
          </div>
          {!isCollapsed && (
            <span id="logo-text" className="text-xl font-bold">
              الشركة
            </span>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="sidebar-content p-3 flex-1">
        <div className="menu-header flex items-center justify-between mb-4">
          {!isCollapsed && (
            <h3 id="menu-title" className="text-sm font-semibold text-white/80">
              القائمة
            </h3>
          )}

          <button
            id="burger-menu"
            className={`p-1 text-white/80 text-start hover:text-white transition-colors ${
              isCollapsed ? "mx-auto" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isMobile) {
                setIsCollapsed(!isCollapsed);
              }
            }}
          >
            <FontAwesomeIcon
              icon={isCollapsed ? faBars : faTimes}
              className="text-lg"
            />
          </button>
        </div>

        <nav id="menu-items" className="space-y-2">
          <MenuItem
            href="/dashboard"
            icon={faThLarge}
            text="لوحة التحكم"
            collapsed={isCollapsed}
            active
          />
          <MenuItem
            href="/offers"
            icon={faClock}
            text="العروض"
            collapsed={isCollapsed}
          />
          <MenuItem
            href="/orders"
            icon={faFileAlt}
            text="الطلبات"
            collapsed={isCollapsed}
          />
          <MenuItem
            href="/installments"
            icon={faMoneyBillWave}
            text="الاقساط"
            collapsed={isCollapsed}
          />
          <MenuItem
            href="/users"
            icon={faUsers}
            text="المستخدمين"
            collapsed={isCollapsed}
          />
          <MenuItem
            href="/settings"
            icon={faCog}
            text="الاعدادات"
            collapsed={isCollapsed}
          />
          <MenuItem
            href="/support"
            icon={faHeadset}
            text="الدعم الفني"
            collapsed={isCollapsed}
          />
        </nav>
      </div>
    </aside>
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
    <div className="relative group">
      <Link
        href={href}
        className={`sidebar-item flex items-center p-3 rounded-lg transition-colors cursor-pointer
        ${active ? "bg-white/20" : "hover:bg-white/10"}
        ${collapsed ? "justify-center" : "space-x-3 space-x-reverse"}`}
      >
        <FontAwesomeIcon icon={icon} className="text-lg" />
        {!collapsed && <span className="menu-text">{text}</span>}
      </Link>

      {/* Tooltip يظهر فقط عند الإغلاق */}
      {collapsed && (
        <span
          className="absolute right-full top-1/2 -translate-y-1/2 mr-3
          bg-black text-white text-sm px-3 py-1 rounded-md
          opacity-0 group-hover:opacity-100 transition
          whitespace-nowrap pointer-events-none"
        >
          {text}
        </span>
      )}
    </div>
  );
}
