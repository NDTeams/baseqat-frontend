"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAdjust,
  faBars,
  faChevronDown,
  faCalendarDays,
  faUser,
  faSignOutAlt,
  faCog,
  faIdCard,
  faGraduationCap,
  faComments,
  faNewspaper,
  faHandshake,
} from '@fortawesome/free-solid-svg-icons';
import LanguageSwitcher from '@/components/language';
import FontSizeController from './fontsize-controller';
import MobileMenu from './mobile-menu';
import { AuthService } from '@/services/auth/page';

interface HeaderProps {
  grayscale: boolean;
  setGrayscale: (value: boolean) => void;
}

export default function Header({ grayscale, setGrayscale }: HeaderProps) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [consultationsOpen, setConsultationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("مستخدم");
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const today = new Date().toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const el = document.getElementById('nav-date');
    if (el) el.textContent = today;
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown="about"]')) {
        setAboutOpen(false);
      }
      if (!target.closest('[data-dropdown="courses"]')) {
        setCoursesOpen(false);
      }
      if (!target.closest('[data-dropdown="consultations"]')) {
        setConsultationsOpen(false);
      }
      if (!target.closest('[data-dropdown="user"]')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const hasToken =
      typeof window !== 'undefined' &&
      (localStorage.getItem('authToken') || Cookies.get('auth_token'));
    setIsLoggedIn(Boolean(hasToken));

    if (hasToken) {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const user = JSON.parse(stored);
          if (user.name) setUserName(user.name);
          if (user.roles) setUserRoles(user.roles);
        }
      } catch {}
    }
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* ====== Row 2 ====== */}
      <div className="bg-primary text-white text-sm px-2 md:px-4">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
          <button className="flex items-center gap-1 hover:text-slate-100">
            <FontAwesomeIcon icon={faCalendarDays} />
            <span id="nav-date">{t('HomeSite.today')}</span>
          </button>

          <div className="hidden lg:flex items-center gap-4 text-xs sm:text-sm">
            <button onClick={() => setGrayscale(!grayscale)} className="flex items-center gap-1 hover:text-slate-100">
              <FontAwesomeIcon icon={faAdjust} />
              {t('HomeSite.toggle_colors')}
            </button>
            <FontSizeController />
          </div>
        </div>
      </div>

      {/* ====== Row 3 ====== */}
      <div className="bg-white shadow-md relative px-2 md:px-4">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-emerald-800 transition"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image src="/site/logo.png" alt="باسقات" width={120} height={48} className="h-12 w-auto" />
            </Link>

            {/* Main Navigation */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-700">
              {/* Home */}
              <Link href="/" className="px-4 py-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition">
                الرئيسية
              </Link>

              {/* About Us Dropdown */}
              <div className="relative" data-dropdown="about">
                <button
                  onClick={() => setAboutOpen(!aboutOpen)}
                  className="px-4 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 transition"
                >
                  من نحن
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs transition-transform duration-300 ${aboutOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {aboutOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                    <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-3">
                      <h3 className="text-white font-bold text-sm">من نحن</h3>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/aboutus"
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition"
                        onClick={() => setAboutOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faIdCard} className="text-emerald-700" />
                        </div>
                        <span className="text-sm">عن باسقات</span>
                      </Link>
                      <Link
                        href="/ceo-message"
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition"
                        onClick={() => setAboutOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faUser} className="text-blue-700" />
                        </div>
                        <span className="text-sm">كلمة الرئيس التنفيذي</span>
                      </Link>
                      <Link
                        href="/achievements"
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition"
                        onClick={() => setAboutOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faHandshake} className="text-yellow-700" />
                        </div>
                        <span className="text-sm">إنجازات باسقات</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Services */}
              <Link href="/services" className="px-4 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition">
                خدمات
              </Link>

              {/* Courses Dropdown */}
              <div className="relative" data-dropdown="courses">
                <button
                  onClick={() => setCoursesOpen(!coursesOpen)}
                  className="px-4 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 transition"
                >
                  الدورات التدريبية
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs transition-transform duration-300 ${coursesOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {coursesOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                    <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-3">
                      <h3 className="text-white font-bold text-sm">الدورات التدريبية</h3>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/courses-archive"
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition"
                        onClick={() => setCoursesOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faGraduationCap} className="text-emerald-700" />
                        </div>
                        <span className="text-sm">الدورات التدريبية</span>
                      </Link>
                      <Link
                        href="/courses-categories"
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition"
                        onClick={() => setCoursesOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faGraduationCap} className="text-blue-700" />
                        </div>
                        <span className="text-sm">أقسام الدورات</span>
                      </Link>
                      <Link
                        href="/instructors"
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition"
                        onClick={() => setCoursesOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faUser} className="text-purple-700" />
                        </div>
                        <span className="text-sm">المدربين</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Consultations Dropdown */}
              <div className="relative" data-dropdown="consultations">
                <button
                  onClick={() => setConsultationsOpen(!consultationsOpen)}
                  className="px-4 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 transition"
                >
                  الاستشارات
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs transition-transform duration-300 ${consultationsOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {consultationsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                    <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-3">
                      <h3 className="text-white font-bold text-sm">الاستشارات</h3>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/consultation-categories"
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition"
                        onClick={() => setConsultationsOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faComments} className="text-emerald-700" />
                        </div>
                        <span className="text-sm">أقسام الاستشارات</span>
                      </Link>
                      <Link
                        href="/consultants"
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition"
                        onClick={() => setConsultationsOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faUser} className="text-blue-700" />
                        </div>
                        <span className="text-sm">المستشارين</span>
                      </Link>
                      <Link
                        href="/consultation-request"
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition"
                        onClick={() => setConsultationsOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faHandshake} className="text-yellow-700" />
                        </div>
                        <span className="text-sm">طلب استشارة</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Media Center */}
              <Link href="/media-center" className="px-4 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition">
                المركز الإعلامي
              </Link>

              {/* Support */}
              <Link href="/contact" className="px-4 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition">
                الدعم والمساعدة
              </Link>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />

            {isLoggedIn ? (
              <div className="relative" data-dropdown="user">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-emerald-100 hover:border-emerald-700 hover:bg-emerald-50 transition group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white text-sm font-bold">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs text-slate-400 group-hover:text-emerald-700 transition-all duration-300 ${
                      userMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                    <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-3">
                      <p className="text-white text-xs">مرحباً بك</p>
                      <p className="text-white font-bold text-sm">{userName}</p>
                    </div>
                    <div className="p-2">
                      {userRoles.some(r => ['SuperAdmin', 'Admin', 'BaseqatEmployee'].includes(r)) && (
                        <Link
                          href="/index"
                          className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <FontAwesomeIcon icon={faIdCard} className="text-emerald-700" />
                          <span className="text-sm">لوحة التحكم</span>
                        </Link>
                      )}
                      <Link
                        href="/student-dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={faUser} className="text-blue-700" />
                        <span className="text-sm">الملف الشخصي</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={faCog} className="text-slate-500" />
                        <span className="text-sm">الإعدادات</span>
                      </Link>
                      <div className="border-t border-slate-100 my-2"></div>
                      <button
                        onClick={async () => {
                          setUserMenuOpen(false);
                          await AuthService.logout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span className="text-sm">تسجيل الخروج</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/register"
                  className="px-5 py-2.5 border-2 border-emerald-700 text-emerald-700 rounded-xl hover:bg-emerald-50 transition font-semibold text-sm"
                >
                  التسجيل
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition font-semibold text-sm"
                >
                  تسجيل الدخول
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
