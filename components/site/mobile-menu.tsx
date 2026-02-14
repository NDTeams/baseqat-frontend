'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAdjust,
  faMobile,
  faHeadphones,
  faXmark,
  faMagnifyingGlass,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import LanguageSwitcher from '@/components/language';
import FontSizeController from './fontsize-controller';

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: (val: boolean) => void;
  grayscale: boolean;
  setGrayscale: (val: boolean) => void;
  setSearchOpen: (val: boolean) => void;
}

export default function MobileMenu({
  menuOpen,
  setMenuOpen,
  grayscale,
  setGrayscale,
  setSearchOpen,
}: MobileMenuProps) {
  const { t } = useTranslation();
  const [megaOpen, setMegaOpen] = useState(false);

  return (
    <div
      className="md:hidden fixed inset-0 bg-black/40 z-40"
      onClick={() => {
        setMenuOpen(false);
        setMegaOpen(false);
      }}
    >
      <div
        className={`bg-white w-full p-4 space-y-4 text-sm font-semibold transform transition-transform duration-300
        ${menuOpen ? 'translate-y-0' : '-translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <Image src="/site/logo.png" alt="Logo" width={100} height={40} className="h-10 w-auto" />
          <button
            onClick={() => {
              setMenuOpen(false);
              setMegaOpen(false);
            }}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Tools */}
        <div className="grid grid-cols-2 gap-3 text-slate-600">
          <button
            onClick={() => setGrayscale(!grayscale)}
            className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2"
          >
            <FontAwesomeIcon icon={faAdjust} />
            {t('HomeSite.toggle_colors')}
          </button>

          <button className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
            <FontAwesomeIcon icon={faMobile} />
            {t('HomeSite.download_app')}
          </button>

          <button className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
            <FontSizeController />
           {t('HomeSite.zoomimage')}
          </button>

          <button className="flex items-center gap-2 bg-slate-100 rounded-lg px-2 py-2">
            <FontAwesomeIcon icon={faHeadphones} />
            {t('HomeSite.screen_reader')}
          </button>
        </div>

        {/* Menu Links */}
        <div className="space-y-1 pt-2 border-t">
          <Link href="/" className="block px-3 py-2 rounded-lg bg-emerald-600 text-white">
            {t('HomeSite.home')}
          </Link>

          {/* about us */}
          <button
            onClick={() => setMegaOpen(!megaOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-emerald-50"
          >
            <span>{t('HomeSite.about_us')}</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`transition-transform duration-300 ${megaOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {megaOpen && (
            <div className="mt-2 bg-slate-50 border rounded-xl p-4">
              <div className="grid grid-cols-1 gap-4 text-sm text-slate-800">

                <div className="space-y-2">
                  <h4 className="font-bold text-primary">{t('HomeSite.about_us')}</h4>
                  <ul className="space-y-1">
                    <li>{t('HomeSite.foundation')}</li>
                    <li>{t('HomeSite.vision_mission')}</li>
                    <li>{t('HomeSite.regulations')}</li>
                    <li>{t('HomeSite.annual_report')}</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-primary">{t('HomeSite.structure')}</h4>
                  <ul className="space-y-1">
                    <li>{t('HomeSite.organizational_structure')}</li>
                    <li>{t('HomeSite.board')}</li>
                    <li>{t('HomeSite.executive_management')}</li>
                    <li>{t('HomeSite.departments_roles')}</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-primary">{t('HomeSite.strategy')}</h4>
                  <ul className="space-y-1">
                    <li>{t('HomeSite.policies')}</li>
                    <li>{t('HomeSite.hr_strategy')}</li>
                    <li>{t('HomeSite.service_agreement')}</li>
                    <li>{t('HomeSite.vision_2030')}</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-primary">{t('HomeSite.join_us')}</h4>
                  <ul className="space-y-1">
                    <li>{t('HomeSite.current_jobs')}</li>
                    <li>{t('HomeSite.suppliers')}</li>
                    <li>{t('HomeSite.partners')}</li>
                    <li>{t('HomeSite.news_events')}</li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          <Link href="/services" className="block px-3 py-2 rounded-lg hover:bg-emerald-50">
            {t('HomeSite.services')}
          </Link>

          <Link href="/media" className="block px-3 py-2 rounded-lg hover:bg-emerald-50">
            {t('HomeSite.media_center')}
          </Link>

          <Link href="/support" className="block px-3 py-2 rounded-lg hover:bg-emerald-50">
            {t('HomeSite.support')}
          </Link>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t text-xs text-slate-600 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-full border hover:border-emerald-200 hover:text-primary flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>

            <LanguageSwitcher />
          </div>

          <span>{t('HomeSite.jobs_portal')}</span>
        </div>
      </div>
    </div>
  );
}
