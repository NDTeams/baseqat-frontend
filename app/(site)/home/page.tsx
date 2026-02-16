'use client';

import '@/lib/i18n';
import Hero from '@/components/site/hero';
import CoursesSlider from "@/components/site/courses-slider";
import Teachers from "@/components/site/teachers";
import  StatsSection  from '@/components/site/company-statistics';
import News from '@/components/site/news'; 
import Gallery from '@/components/site/gallery';
import VideoLibrary from '@/components/site/videoLibrary';
export default function Home() {

  return (
  <div className='flex flex-col justify-center items-center min-h-screen'>
    <Hero />
    <StatsSection />
    <CoursesSlider />
    <Teachers />
    <News />
    <Gallery />
    <VideoLibrary />


  </div>
  );
}
