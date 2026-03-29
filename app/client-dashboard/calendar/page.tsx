'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import ConsultationCalendar from '@/components/consultation-calendar';
import {
  ConsultationCalendarClientService,
  type CalendarItem,
} from '@/services/consultants/page';

function getMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { start: fmt(start), end: fmt(end) };
}

export default function ClientCalendarPage() {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(getMonthRange);

  const fetchData = useCallback(async (start: string, end: string) => {
    setLoading(true);
    try {
      const res = await ConsultationCalendarClientService.getMyByDateRange({
        startDate: start,
        endDate: end,
      });
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

  return (
    <div className="p-6 max-w-5xl mx-auto" dir="rtl">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-sky-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">تقويم استشاراتي</h1>
          <p className="text-sm text-gray-400">عرض مواعيد استشاراتك المجدولة</p>
        </div>
      </div>

      {/* Calendar */}
      <ConsultationCalendar
        items={items}
        loading={loading}
        onMonthChange={handleMonthChange}
        showClientName={false}
        showConsultant={true}
      />
    </div>
  );
}
