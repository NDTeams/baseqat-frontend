"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAdjust,
  // faMobile,
  //aHeadphones,
  faBars,
  //faXmark,
  faChevronDown,
  faCalendarDays,
  faUser,
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
  const [megaOpen, setMegaOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ضبط التاريخ اليوم
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown="about"]')) {
        setAboutOpen(false);
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
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">

      {/* ====== Row 1 ====== */}
      {/* <div className="bg-slate-100 text-slate-800 text-sm sm:px-2 md:px-4">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span>{t('HomeSite.government_website')}</span>
          </div>
          <Link href="#" className="text-primary font-semibold hover:text-emerald-800 text-xs sm:text-sm">
            {t('HomeSite.verify')}
          </Link>
        </div>
      </div> */}

      {/* ====== Row 2 ====== */}
      <div className="bg-primary text-white text-sm px-2 md:px-4">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
          <button className="flex items-center gap-1 hover:text-slate-100">
            <FontAwesomeIcon icon={faCalendarDays} />
            <span id="nav-date">{t('HomeSite.today')}</span>
          </button>

          <div className="hidden lg:flex items-center gap-4 text-xs sm:text-sm">
            {/* <button className="flex items-center gap-1 hover:text-slate-100">
              <FontAwesomeIcon icon={faMobile} />
              {t('HomeSite.download_app')}
            </button> */}

            {/* زر تبديل اللون الرمادي */}
            <button onClick={() => setGrayscale(!grayscale)} className="flex items-center gap-1 hover:text-slate-100">
              <FontAwesomeIcon icon={faAdjust} />
              {t('HomeSite.toggle_colors')}
            </button>

            {/* <button className="flex items-center gap-1 hover:text-slate-100">
              <FontAwesomeIcon icon={faHeadphones} />
              {t('HomeSite.screen_reader')}
            </button> */}

            <FontSizeController />
          </div>
        </div>
      </div>

      {/* ====== Row 3 ====== */}
      <div className="bg-white shadow-sm relative px-2 md:px-4">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* زر فتح القائمة على الموبايل */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>

            {/* الشعار */}
            <Link href="/">
              <Image src="/site/logo.png" alt="Logo" width={120} height={48} className="h-12 w-auto" />
            </Link>

            {/* القوائم الرئيسية */}
            <nav className="hidden md:flex items-center gap-4 text-sm font-semibold text-background relative">
              <Link href="/" className="px-3 py-2 rounded-xl bg-primary text-white">
                {t('HomeSite.home')}
              </Link>

              {/* About Us Dropdown */}
              <div className="relative group" data-dropdown="about">
                <button
                  onClick={() => setAboutOpen(!aboutOpen)}
                  className="px-3 py-2 rounded-xl hover:text-primary flex items-center gap-1"
                >
                  {t('HomeSite.about_us')}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs transition-transform ${aboutOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {aboutOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-primary rounded-lg shadow-lg overflow-hidden z-40 min-w-52">
                    <Link
                      href="/ceo-message"
                      className="block px-4 py-3 text-white hover:bg-emerald-800 transition-colors"
                      onClick={() => setAboutOpen(false)}
                    >
                      كلمة الرئيس التنفيذي
                    </Link>
                    <Link
                      href="/achievements"
                      className="block px-4 py-3 text-white hover:bg-emerald-800 transition-colors border-t border-emerald-700"
                      onClick={() => setAboutOpen(false)}
                    >
                      إنجازات باسقات
                    </Link>
                    <Link
                      href="/aboutus"
                      className="block px-4 py-3 text-white hover:bg-emerald-800 transition-colors border-t border-emerald-700"
                      onClick={() => setAboutOpen(false)}
                    >
                      {t('HomeSite.about_us')}
                    </Link>
                  </div>
                )}
              </div>

              {/* <button
                onClick={() => setMegaOpen(!megaOpen)}
                className="px-3 py-2 rounded-xl flex items-center gap-1 hover:text-primary"
              >
                {t('HomeSite.about_us')}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`${megaOpen ? 'rotate-180' : ''} transition-transform`}
                />
              </button> */}
              
              <Link href="/services" className="px-3 py-2 rounded-xl hover:text-primary">{t('HomeSite.services')}</Link>
              <Link href="/courses-archive" className="px-3 py-2 rounded-xl hover:text-primary">{t('HomeSite.coursesHeader')}</Link>
              <Link href="/media-center" className="px-3 py-2 rounded-xl hover:text-primary">{t('HomeSite.media_center')}</Link>
              <Link href="/contact" className="px-3 py-2 rounded-xl hover:text-primary">{t('HomeSite.contactHeader')}</Link>

              {/* Mega Menu */}
              {megaOpen && (
                <div className="mega-panel absolute  top-full mt-2 w-screen max-w-5xl bg-white border border-slate-100 rounded-2xl shadow-2xl py-6 px-6 z-50">
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 text-sm text-slate-800">
                    {/* About Us */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-primary">{t('HomeSite.about_us')}</h4>
                      <ul className="space-y-1">
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.foundation')}</a></li>
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.vision_mission')}</a></li>
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.regulations')}</a></li>
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.annual_report')}</a></li>
                      </ul>
                    </div>

                    {/* Structure */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-primary">{t('structure')}</h4>
                      <ul className="space-y-1">
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.organizational_structure')}</a></li>
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.board')}</a></li>
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.executive_management')}</a></li>
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.departments_roles')}</a></li>
                      </ul>
                    </div>

                    {/* Strategy */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-primary">{t('HomeSite.strategy')}</h4>
                      <ul className="space-y-1">
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.policies')}</a></li>
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.hr_strategy')}</a></li>
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.service_agreement')}</a></li>
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.vision_2030')}</a></li>
                      </ul>
                    </div>

                    {/* Join Us */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-primary">{t('HomeSite.join_us')}</h4>
                      <ul className="space-y-1">
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.current_jobs')}</a></li>
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.suppliers')}</a></li>
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.partners')}</a></li>
                        <li><a className="hover:text-primary" href="#">{t('HomeSite.news_events')}</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </nav>
          </div>

          {/* أيقونات البحث واللغة */}
          <div className="hidden md:flex items-center gap-2 text-sm font-semibold">
            {isLoggedIn ? (
              <div className="relative" data-dropdown="user">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:text-primary transition"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 text-slate-800 hover:bg-emerald-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t('auth.control_panel')}
                    </Link>
                    <Link
                      href="/student-dashboard/profile"
                      className="block px-4 py-3 text-slate-800 hover:bg-emerald-50 border-t border-slate-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t('auth.profile')}
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-3 text-slate-800 hover:bg-emerald-50 border-t border-slate-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t('auth.settings')}
                    </Link>
                    <button
                      onClick={() => AuthService.logout()}
                      className="w-full text-right px-4 py-3 text-red-600 hover:bg-red-50 border-t border-slate-100"
                    >
                      {t('auth.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-emerald-700 transition"
              >
                {t('auth.login')}
              </Link>
            )}

            <LanguageSwitcher />
            <Link href="/jobs" className="font-semibold hover:text-primary">{t('HomeSite.jobs_portal')}</Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <MobileMenu
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          grayscale={grayscale}
          setGrayscale={setGrayscale}
          setSearchOpen={() => {}}
        />
      )}
    </header>
  );
}

