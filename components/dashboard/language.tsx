'use client';

import { useState, useContext, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { LanguageContext } from '@/app/layout';
import i18n from '@/lib/i18n';
import Image from 'next/image';

export default function LanguageDropdown() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setLanguage(i18n.language); // تحديث اللغة بعد mount
  }, [setLanguage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectLanguage = (lang: 'en' | 'ar') => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    setOpen(false);
  };

  if (!mounted) return null; // تمنع Hydration mismatch

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-600 hover:text-green-600 transition-colors rounded"
      >
        <FontAwesomeIcon icon={faGlobe} className="text-xl" />
      </button>

      {open && (
        <div className="absolute end-0 mt-2 w-32 bg-white shadow-lg rounded-md z-50">
          <button
            className="flex items-center px-3 py-2 w-full hover:bg-gray-100 transition"
            onClick={() => selectLanguage('en')}
          >
            <Image
              src="/dashboard/En.jpg" // من public
              alt="English"
              width={25}
              height={25}
              className="mx-2"
            />
            English
          </button>
          <button
            className="flex items-center px-3 py-2 w-full hover:bg-gray-100 transition rounded-b-md"
            onClick={() => selectLanguage('ar')}
          >
            <Image
              src="/dashboard/As.png"
              alt="العربية"
              width={25}
              height={25}
              className="mx-2"
            />
            العربية
          </button>
        </div>
      )}
    </div>
  );
}
