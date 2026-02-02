'use client';

import { useContext, useEffect } from 'react';
import { LanguageContext } from '@/app/layout';
import i18n from '@/lib/i18n'; // استدعاء i18n مباشرة بدل useTranslation

export default function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext);

  // ضبط اللغة الحالية عند التحميل
  useEffect(() => {
    setLanguage(i18n.language); // تأكد من مزامنة الـ Context مع i18n
  }, [setLanguage]);

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang); // الآن هذه الدالة موجودة
    setLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 transition font-semibold hover:bg-gray-100 rounded"
    >
      {language === 'ar' ? 'English' : 'العربية'}
    </button>
  );
}
