'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MediaGallery from '@/components/site/media-gallery';
import MediaArticles from '@/components/site/media-articles';
import MediaEvents from '@/components/site/media-events';
import CoursesHeader from '@/components/site/courses-header';

export default function MediaCenterPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'gallery' | 'articles' | 'events'>('gallery');

  const tabs = [
    { id: 'gallery', label: t('media.gallery.title') || 'Gallery' },
    { id: 'articles', label: t('media.articles.title') || 'Articles' },
    { id: 'events', label: t('media.events.title') || 'Events' },
  ] as const;

  return (
    <main>
      {/* Header */}
      <CoursesHeader
        subtitle={t('media.subtitle') || 'Media Center'}
        title={t('media.title') || 'Media Center'}
        description={t('media.description') || 'Explore our collection of photos, articles, and events'}
      />

      {/* Tabs Section */}
      <div className="min-h-screen bg-white dark:bg-slate-900 py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 border-b border-gray-200 dark:border-slate-700 mb-8 sm:mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-4 text-lg font-semibold transition-all duration-300 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fadeIn">
            {activeTab === 'gallery' && <MediaGallery />}
            {activeTab === 'articles' && <MediaArticles />}
            {activeTab === 'events' && <MediaEvents />}
          </div>
        </div>
      </div>
    </main>
  );
}
