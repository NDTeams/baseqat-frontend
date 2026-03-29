'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import CoursesHeader from '@/components/site/courses-header';
import ConsultationCalendar from '@/components/consultation-calendar';
import {
  ConsultationCalendarPublicService,
  type CalendarItem,
} from '@/services/consultants/page';

function getMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { start: fmt(start), end: fmt(end) };
}

export default function PublicConsultationCalendarPage() {
  const router = useRouter();
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(getMonthRange);

  const fetchData = useCallback(async (start: string, end: string) => {
    setLoading(true);
    try {
      const res = await ConsultationCalendarPublicService.getPublicCalendar(start, end);
      if (res.succeeded) setItems(res.data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData(dateRange.start, dateRange.end);
  }, [dateRange, fetchData]);

  const handleMonthChange = (start: string, end: string) => {
    setDateRange({ start, end });
  };

  const handleDaySelect = (dateStr: string) => {
    router.push(`/consultation-request?date=${dateStr}`);
  };

  return (
    <>
      <CoursesHeader
        subtitle="باسقات"
        title="تقويم الاستشارات"
        description="اختر موعدًا مناسبًا وقدّم طلب استشارة"
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir="rtl">
        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Page Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-l from-sky-600 to-sky-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">تقويم الاستشارات</h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              اضغط على أي يوم لتقديم طلب استشارة في هذا الموعد
            </p>
          </div>

          {/* Calendar */}
          <ConsultationCalendar
            items={items}
            loading={loading}
            onMonthChange={handleMonthChange}
            showClientName={false}
            showConsultant={true}
            isPublic={true}
            onDaySelect={handleDaySelect}
          />
        </div>
      </div>
    </>
  );
}
