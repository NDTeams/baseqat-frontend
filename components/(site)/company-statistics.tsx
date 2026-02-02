'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

interface Stat {
  value: number
  label: string
  prefix?: string
  suffix?: string
}

export default function PartnerStats() {
  const { t } = useTranslation()
  
  const stats: Stat[] = [
    { 
      value: 350, 
      label: t('PartnerStats.trustedClients'),
      prefix: '+'
    },
    { 
      value: 120, 
      label: t('PartnerStats.completedProjects') 
    },
    { 
      value: 15, 
      label: t('PartnerStats.countriesWorked') 
    },
    { 
      value: 98, 
      label: t('PartnerStats.satisfactionRate'),
      suffix: '%'
    },
    { 
      value: 42, 
      label: t('PartnerStats.expertsPartners') 
    },
    { 
      value: 28, 
      label: t('PartnerStats.monthlyWorkshops') 
    }
  ]

  const [counters, setCounters] = useState<number[]>(stats.map(() => 0))
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateCounters()
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    const element = document.querySelector('.partner-area')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  const animateCounters = () => {
    setHasAnimated(true)
    
    stats.forEach((stat, index) => {
      let current = 0
      const increment = stat.value / 50
      const duration = 2000
      
      const timer = setInterval(() => {
        current += increment
        if (current >= stat.value) {
          current = stat.value
          clearInterval(timer)
        }
        
        setCounters(prev => {
          const newCounters = [...prev]
          newCounters[index] = Math.floor(current)
          return newCounters
        })
      }, duration / 50)
    })
  }

  return (
    <div className="w-[340px] md:w-[1260px]  mx-auto">
 <section className="partner-area py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={22}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 }
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          dir="rtl"
          className="partners-swiper"
        >
          {stats.map((stat, index) => (
            <SwiperSlide key={index}>
              <article className="stat-card  p-6 text-center">
                <div className="stat-value text-4xl font-bold text-primary mb-2">
                  {stat.prefix}
                  <span className="counter">
                    {counters[index]}
                  </span>
                  {stat.suffix}
                </div>
                <div className="stat-label text-gray-600 font-medium">
                  {stat.label}
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
    </div>
   
  )
}