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
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import LanguageSwitcher from '@/components/language';
import FontSizeController from './fontsize-controller';

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: (val: boolean) => void;
  grayscale: boolean;
  setGrayscale: (val: boolean) => void;
  setSearchOpen?: (val: boolean) => void;
}

export default function MobileMenu({
  menuOpen,
  setMenuOpen,
  grayscale,
  setGrayscale,
}: MobileMenuProps) {
  const { t } = useTranslation();
  const [megaOpen, setMegaOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <div
      className="md:hidden fixed inset-0 bg-black/40 z-40"
      onClick={() => {
        setMenuOpen(false);
        setMegaOpen(false);
        setAboutOpen(false);
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
              setAboutOpen(false);
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
            onClick={() => setAboutOpen(!aboutOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-emerald-50"
          >
            <span>{t('HomeSite.about_us')}</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`transition-transform duration-300 ${aboutOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {aboutOpen && (
            <div className="mt-2 bg-primary rounded-lg overflow-hidden">
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

          <Link href="/services" className="block px-3 py-2 rounded-lg hover:bg-emerald-50">
            {t('HomeSite.services')}
          </Link>

          <Link href="/media-center" className="block px-3 py-2 rounded-lg hover:bg-emerald-50">
            {t('HomeSite.media_center')}
          </Link>

          <Link href="/contact" className="block px-3 py-2 rounded-lg hover:bg-emerald-50">
            {t('HomeSite.contactHeader')}
          </Link>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t text-xs text-slate-600 flex items-center justify-between">
          <LanguageSwitcher />
          <span>{t('HomeSite.jobs_portal')}</span>
        </div>
      </div>
    </div>
  );
}
