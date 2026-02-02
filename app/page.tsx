'use client';

import '../lib/i18n';
import { useTranslation } from 'react-i18next';
import Theme from "../components/theme-toggle";
import LanguageSwitcher from "../components/language"

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-primary ">{t('welcome')}</h1>
      <p>{t('templates')}</p>

      {/* Component الترجمة */}
      <LanguageSwitcher />

      <Theme />
    </div>
  );
}
