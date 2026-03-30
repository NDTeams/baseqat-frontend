'use client'

import { useState, useEffect, useRef } from 'react'
import api from '@/lib/axios'

interface HomeStatistic {
  id: number
  title: string
  value: string
  icon?: string
  sortOrder: number
  isActive: boolean
}

export default function PartnerStats() {
  const [stats, setStats] = useState<HomeStatistic[]>([])
  const [counters, setCounters] = useState<number[]>([])
  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/HomeStatistic/GetAll')
        if (res.data?.succeeded && res.data.data) {
          setStats(res.data.data)
          setCounters(res.data.data.map(() => 0))
        }
      } catch {
        // fallback بيانات افتراضية في حال فشل الاتصال
        const fallback: HomeStatistic[] = [
          { id: 1, title: 'مشروع مُنجز', value: '120', sortOrder: 1, isActive: true },
          { id: 2, title: 'دولة عملنا بها', value: '15', sortOrder: 2, isActive: true },
          { id: 3, title: 'معدل الرضا', value: '98%', sortOrder: 3, isActive: true },
          { id: 4, title: 'خبير وشريك', value: '42', sortOrder: 4, isActive: true },
          { id: 5, title: 'ورش وجلسات شهرية', value: '28', sortOrder: 5, isActive: true },
        ]
        setStats(fallback)
        setCounters(fallback.map(() => 0))
      }
    }
    fetchStats()
  }, [])

  useEffect(() => {
    if (hasAnimated || stats.length === 0) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateCounters()
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [stats, hasAnimated])

  const parseNumericValue = (val: string): { num: number; suffix: string; prefix: string } => {
    const cleaned = val.trim()
    let prefix = ''
    let suffix = ''
    let numStr = cleaned

    if (cleaned.startsWith('+')) {
      prefix = '+'
      numStr = cleaned.slice(1)
    }
    if (numStr.endsWith('%')) {
      suffix = '%'
      numStr = numStr.slice(0, -1)
    }
    if (numStr.endsWith('+')) {
      suffix = '+'
      numStr = numStr.slice(0, -1)
    }

    return { num: parseInt(numStr) || 0, suffix, prefix }
  }

  const animateCounters = () => {
    setHasAnimated(true)

    stats.forEach((stat, index) => {
      const { num } = parseNumericValue(stat.value)
      let current = 0
      const increment = num / 50
      const duration = 2000

      const timer = setInterval(() => {
        current += increment
        if (current >= num) {
          current = num
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

  const getDisplayValue = (stat: HomeStatistic, counter: number) => {
    const { suffix, prefix } = parseNumericValue(stat.value)
    return `${prefix}${counter}${suffix}`
  }

  if (stats.length === 0) return null

  return (
    <section ref={sectionRef} className="w-full bg-gradient-to-b from-slate-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-6 ${
          stats.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' :
          stats.length <= 4 ? 'grid-cols-2 lg:grid-cols-4' :
          stats.length <= 5 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' :
          'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
        }`}>
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="group relative bg-white rounded-2xl border border-slate-100 p-6 text-center hover:shadow-lg hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-emerald-500 to-teal-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-4xl font-black text-emerald-700 mb-2 tracking-tight" dir="ltr">
                {getDisplayValue(stat, counters[index] ?? 0)}
              </div>
              <div className="text-sm font-semibold text-slate-600">
                {stat.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
