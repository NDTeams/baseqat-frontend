'use client';

import '@/lib/i18n';
import Hero from '@/components/site/hero';
import Teachers from "@/components/site/teachers";
import  StatsSection  from '@/components/site/company-statistics';
import News from '@/components/site/news'; 
import ArticlesSection from '@/components/site/articles-section';
import Gallery from '@/components/site/gallery';
export default function Home() {

  return (
  <div className='flex flex-col justify-center items-center min-h-screen'>
    <Hero />
    <StatsSection />
    <Teachers />
    <News />
    <ArticlesSection />
    <Gallery />


  </div>
  );
}
