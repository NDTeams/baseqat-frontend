"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAdjust,
  faMobile,
  faHeadphones,
  faBars,
  faXmark,
  faMagnifyingGlass,
  faChevronDown,
  faCalendarDays,
} from '@fortawesome/free-solid-svg-icons';
import LanguageSwitcher from '@/components/language';
import SearchModal from './search-modal';
import FontSizeController from './fontsize-controller';
import MobileMenu from './mobile-menu';

interface HeaderProps {
  grayscale: boolean;
  setGrayscale: (value: boolean) => void;
}

export default function Header({ grayscale, setGrayscale }: HeaderProps) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      
      {/* ====== Row 1 ====== */}
      <div className="bg-slate-100 text-slate-800 text-sm sm:px-2 md:px-4">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span>{t('HomeSite.government_website')}</span>
          </div>
          <Link href="#" className="text-primary font-semibold hover:text-emerald-800 text-xs sm:text-sm">
            {t('HomeSite.verify')}
          </Link>
        </div>
      </div>

      {/* ====== Row 2 ====== */}
      <div className="bg-primary text-white text-sm px-2 md:px-4">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
          <button className="flex items-center gap-1 hover:text-slate-100">
            <FontAwesomeIcon icon={faCalendarDays} />
            <span id="nav-date">{t('HomeSite.today')}</span>
          </button>

          <div className="hidden lg:flex items-center gap-4 text-xs sm:text-sm">
            <button className="flex items-center gap-1 hover:text-slate-100">
              <FontAwesomeIcon icon={faMobile} />
              {t('HomeSite.download_app')}
            </button>

            {/* زر تبديل اللون الرمادي */}
            <button onClick={() => setGrayscale(!grayscale)} className="flex items-center gap-1 hover:text-slate-100">
              <FontAwesomeIcon icon={faAdjust} />
              {t('HomeSite.toggle_colors')}
            </button>

            <button className="flex items-center gap-1 hover:text-slate-100">
              <FontAwesomeIcon icon={faHeadphones} />
              {t('HomeSite.screen_reader')}
            </button>

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

              <button
                onClick={() => setMegaOpen(!megaOpen)}
                className="px-3 py-2 rounded-xl flex items-center gap-1 hover:text-primary"
              >
                {t('HomeSite.about_us')}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`${megaOpen ? 'rotate-180' : ''} transition-transform`}
                />
              </button>

              <Link href="/services" className="px-3 py-2 rounded-xl hover:text-primary">{t('HomeSite.services')}</Link>
              <Link href="/media" className="px-3 py-2 rounded-xl hover:text-primary">{t('HomeSite.media_center')}</Link>
              <Link href="/support" className="px-3 py-2 rounded-xl hover:text-primary">{t('HomeSite.support')}</Link>

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
          <div className="hidden md:flex items-center gap-1 text-sm font-semibold">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-full border hover:border-emerald-200 hover:text-primary flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>

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
          setSearchOpen={setSearchOpen}
        />
      )}

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

