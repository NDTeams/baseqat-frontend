'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faFilter, faUserTie, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import ConsultationCalendar from '@/components/consultation-calendar';
import {
  ConsultationCalendarAdminService,
  ConsultantAdminService,
  type CalendarItem,
  type Consultant,
} from '@/services/consultants/page';

function getMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { start: fmt(start), end: fmt(end) };
}

const STATUS_OPTIONS = [
  { value: '', label: 'الكل' },
  { value: '0', label: 'بانتظار التعيين' },
  { value: '1', label: 'جديد' },
  { value: '2', label: 'قيد المعالجة' },
  { value: '3', label: 'معتمد' },
  { value: '4', label: 'مكتمل' },
  { value: '5', label: 'ملغي' },
];

export default function AdminCalendarPage() {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [dateRange, setDateRange] = useState(getMonthRange);
  const [filterConsultantId, setFilterConsultantId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = useCallback(async (start: string, end: string) => {
    setLoading(true);
    try {
      const query: any = { startDate: start, endDate: end };
      if (filterConsultantId) query.consultantId = Number(filterConsultantId);
      if (filterStatus) query.status = Number(filterStatus);
      const res = await ConsultationCalendarAdminService.getByDateRange(query);
      if (res.succeeded) setItems(res.data);
    } catch {}
    setLoading(false);
  }, [filterConsultantId, filterStatus]);

  useEffect(() => {
    fetchData(dateRange.start, dateRange.end);
  }, [dateRange, fetchData]);

  useEffect(() => {
    ConsultantAdminService.getAll().then(res => {
      if (res.succeeded) setConsultants(res.data);
    }).catch(() => {});
  }, []);

  const handleMonthChange = (start: string, end: string) => {
    setDateRange({ start, end });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto" dir="rtl">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-sky-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">تقويم الاستشارات</h1>
            <p className="text-sm text-gray-400">عرض جميع الاستشارات المجدولة</p>
          </div>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition
            ${showFilters ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          <FontAwesomeIcon icon={faFilter} />
          <span className="text-sm font-medium">تصفية</span>
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Consultant Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                <FontAwesomeIcon icon={faUserTie} className="text-gray-400" />
                المستشار
              </label>
              <select
                value={filterConsultantId}
                onChange={(e) => setFilterConsultantId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 outline-none"
              >
                <option value="">جميع المستشارين</option>
                {consultants.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                <FontAwesomeIcon icon={faLayerGroup} className="text-gray-400" />
                الحالة
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 outline-none"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <ConsultationCalendar
        items={items}
        loading={loading}
        onMonthChange={handleMonthChange}
        showClientName={true}
        showConsultant={true}
      />
    </div>
  );
}
