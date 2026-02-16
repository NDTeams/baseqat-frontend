"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faBell,
  faEnvelope,
  faUser,
  // faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import LanguageDropdown from "@/components/dashboard/language";

export default function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-user-menu="dashboard"]')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Burger Menu */}
        <button
          id="mobile-burger"
          className="mobile-burger lg:hidden block p-2 text-gray-600 hover:text-primary transition-colors mr-4"
        >
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md lg:block hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="البحث"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <button className="p-2 text-gray-600 hover:text-primary transition-colors">
            <FontAwesomeIcon icon={faBell} className="text-xl" />
          </button>

          <button className="p-2 text-gray-600 hover:text-primary transition-colors">
            <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
          </button>

          <div className="relative" data-user-menu="dashboard">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="p-2 text-gray-600 hover:text-primary transition-colors"
              aria-haspopup="true"
              aria-expanded={userMenuOpen}
            >
              <FontAwesomeIcon icon={faUser} className="text-xl" />
            </button>

            {userMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                <a
                  href="/dashboard"
                  className="block px-4 py-3 text-slate-800 hover:bg-emerald-50"
                >
                  لوحة التحكم
                </a>
                <a
                  href="/student-dashboard/profile"
                  className="block px-4 py-3 text-slate-800 hover:bg-emerald-50 border-t border-gray-100"
                >
                  البروفايل
                </a>
                <a
                  href="/settings"
                  className="block px-4 py-3 text-slate-800 hover:bg-emerald-50 border-t border-gray-100"
                >
                  الإعدادات
                </a>
                <button
                  className="w-full text-right px-4 py-3 text-red-600 hover:bg-red-50 border-t border-gray-100"
                >
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>

            <LanguageDropdown />
          
        </div>
      </div>
    </header>
  );
}
