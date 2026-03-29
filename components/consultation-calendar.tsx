"use client";

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faCalendarAlt,
  faVideo,
  faTimes,
  faCircle,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import type { CalendarItem } from "@/services/consultants/page";

// ===== Status Config =====
const STATUS_MAP: Record<number, { label: string; color: string; dot: string }> = {
  0: { label: "بانتظار التعيين", color: "bg-gray-100 text-gray-700", dot: "text-gray-400" },
  1: { label: "جديد", color: "bg-blue-100 text-blue-700", dot: "text-blue-400" },
  2: { label: "قيد المعالجة", color: "bg-yellow-100 text-yellow-700", dot: "text-yellow-400" },
  3: { label: "معتمد", color: "bg-green-100 text-green-700", dot: "text-green-400" },
  4: { label: "مكتمل", color: "bg-sky-100 text-sky-700", dot: "text-sky-400" },
  5: { label: "ملغي", color: "bg-red-100 text-red-700", dot: "text-red-400" },
};

const ARABIC_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

const ARABIC_DAYS = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

// ===== Types =====
interface ConsultationCalendarProps {
  items: CalendarItem[];
  loading?: boolean;
  onMonthChange: (startDate: string, endDate: string) => void;
  showClientName?: boolean;
  showConsultant?: boolean;
  isPublic?: boolean;
  onDaySelect?: (dateStr: string) => void;
}

// ===== Helper Functions =====
function getEffectiveDate(item: CalendarItem): Date | null {
  const dateStr = item.suggestedDate || item.preferredDate;
  if (!dateStr) return null;
  return new Date(dateStr);
}

function getEffectiveTime(item: CalendarItem): string {
  return item.suggestedTime || item.preferredTime || "";
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getMonthRange(year: number, month: number): { start: string; end: string } {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return { start: formatDate(start), end: formatDate(end) };
}

// ===== Detail Modal =====
function DetailModal({
  item,
  onClose,
  showClientName,
  showConsultant,
}: {
  item: CalendarItem;
  onClose: () => void;
  showClientName?: boolean;
  showConsultant?: boolean;
}) {
  const status = STATUS_MAP[item.status] || STATUS_MAP[0];
  const effectiveDate = getEffectiveDate(item);
  const effectiveTime = getEffectiveTime(item);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100] p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-sky-600 to-sky-700 text-white p-5 flex items-center justify-between">
          <h3 className="text-lg font-bold">تفاصيل الاستشارة</h3>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>

          {/* Subject */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">الموضوع</label>
            <p className="text-gray-800 font-medium">{item.subject}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {showConsultant && item.consultantName && (
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="text-xs text-gray-400 block mb-1">المستشار</label>
                <p className="text-gray-700 text-sm font-medium">{item.consultantName}</p>
              </div>
            )}
            {showClientName && item.clientName && (
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="text-xs text-gray-400 block mb-1">العميل</label>
                <p className="text-gray-700 text-sm font-medium">{item.clientName}</p>
              </div>
            )}
            {item.consultationCategoryName && (
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="text-xs text-gray-400 block mb-1">التصنيف</label>
                <p className="text-gray-700 text-sm font-medium">{item.consultationCategoryName}</p>
              </div>
            )}
            {effectiveDate && (
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="text-xs text-gray-400 block mb-1">التاريخ</label>
                <p className="text-gray-700 text-sm font-medium">{effectiveDate.toLocaleDateString("ar-SA")}</p>
              </div>
            )}
            {effectiveTime && (
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="text-xs text-gray-400 block mb-1">الوقت</label>
                <p className="text-gray-700 text-sm font-medium">{effectiveTime}</p>
              </div>
            )}
          </div>

          {/* Zoom Link */}
          {item.zoomLink && (
            <a
              href={item.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-50 text-blue-700 rounded-lg p-3 hover:bg-blue-100 transition"
            >
              <FontAwesomeIcon icon={faVideo} />
              <span className="text-sm font-medium">انضم للاجتماع عبر Zoom</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Main Calendar Component =====
export default function ConsultationCalendar({
  items,
  loading,
  onMonthChange,
  showClientName = false,
  showConsultant = true,
  isPublic = false,
  onDaySelect,
}: ConsultationCalendarProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [detailItem, setDetailItem] = useState<CalendarItem | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Group items by day
  const itemsByDay = useMemo(() => {
    const map: Record<number, CalendarItem[]> = {};
    items.forEach((item) => {
      const d = getEffectiveDate(item);
      if (d && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(item);
      }
    });
    return map;
  }, [items, currentMonth, currentYear]);

  const goToPreviousMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDay(null);
    const range = getMonthRange(newYear, newMonth);
    onMonthChange(range.start, range.end);
  };

  const goToNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDay(null);
    const range = getMonthRange(newYear, newMonth);
    onMonthChange(range.start, range.end);
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDay(today.getDate());
    const range = getMonthRange(today.getFullYear(), today.getMonth());
    onMonthChange(range.start, range.end);
  };

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  // Selected day items
  const selectedDayItems = selectedDay ? itemsByDay[selectedDay] || [] : [];

  // Calendar grid cells
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  return (
    <div className="space-y-6">
      {/* Calendar Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-l from-sky-600 to-sky-700 text-white p-4 flex items-center justify-between">
          <button onClick={goToNextMonth} className="hover:bg-white/20 rounded-lg w-10 h-10 flex items-center justify-center transition">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <div className="flex items-center gap-3">
            <button onClick={goToToday} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition">
              اليوم
            </button>
            <h2 className="text-xl font-bold">
              {ARABIC_MONTHS[currentMonth]} {currentYear}
            </h2>
            <FontAwesomeIcon icon={faCalendarAlt} className="text-white/70" />
          </div>
          <button onClick={goToPreviousMonth} className="hover:bg-white/20 rounded-lg w-10 h-10 flex items-center justify-center transition">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {ARABIC_DAYS.map((day) => (
            <div key={day} className="text-center py-3 text-sm font-semibold text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full mx-auto mb-3" />
            <p className="text-gray-400 text-sm">جاري تحميل التقويم...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="min-h-[80px] bg-gray-50/50 border-b border-l border-gray-100" />;
              }

              const dayItems = itemsByDay[day] || [];
              const isSelected = selectedDay === day;
              const isTodayCell = isToday(day);

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`min-h-[80px] border-b border-l border-gray-100 p-1.5 cursor-pointer transition-colors
                    ${isSelected ? "bg-sky-50 ring-2 ring-inset ring-sky-400" : "hover:bg-gray-50"}
                  `}
                >
                  {/* Day Number */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium
                        ${isTodayCell ? "bg-sky-600 text-white" : "text-gray-700"}
                      `}
                    >
                      {day}
                    </span>
                    {dayItems.length > 0 && (
                      <span className="text-xs bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded-full font-medium">
                        {dayItems.length}
                      </span>
                    )}
                  </div>

                  {/* Event Dots / Mini previews */}
                  <div className="space-y-0.5">
                    {dayItems.slice(0, 2).map((item) => {
                      const st = STATUS_MAP[item.status] || STATUS_MAP[0];
                      return (
                        <div
                          key={item.id}
                          className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate ${st.color}`}
                          title={item.subject}
                        >
                          {item.subject}
                        </div>
                      );
                    })}
                    {dayItems.length > 2 && (
                      <div className="text-[10px] text-gray-400 pr-1">+{dayItems.length - 2} المزيد</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Day Detail Panel */}
      {selectedDay && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-5 py-3 border-b flex items-center justify-between">
            <h3 className="font-bold text-gray-700">
              {selectedDay} {ARABIC_MONTHS[currentMonth]} {currentYear}
            </h3>
            <span className="text-sm text-gray-400">
              {selectedDayItems.length === 0
                ? "لا توجد استشارات"
                : `${selectedDayItems.length} استشارة`}
            </span>
          </div>

          {/* Book consultation button for public calendar */}
          {onDaySelect && selectedDay && (() => {
            const selDate = new Date(currentYear, currentMonth, selectedDay);
            const todayDate = new Date(); todayDate.setHours(0,0,0,0);
            return selDate >= todayDate;
          })() && (
            <div className="px-5 py-3 border-b bg-blue-50/50">
              <button
                onClick={() => {
                  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
                  onDaySelect(dateStr);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-l from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-300/30 hover:-translate-y-0.5 hover:shadow-xl transition-all text-sm"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                طلب استشارة في هذا الموعد
              </button>
            </div>
          )}

          {selectedDayItems.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-3xl mb-2 text-gray-300" />
              <p>لا توجد استشارات مجدولة في هذا اليوم</p>
            </div>
          ) : (
            <div className="divide-y">
              {selectedDayItems.map((item) => {
                const st = STATUS_MAP[item.status] || STATUS_MAP[0];
                const time = getEffectiveTime(item);
                return (
                  <div
                    key={item.id}
                    onClick={() => setDetailItem(item)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition flex items-start gap-3"
                  >
                    <FontAwesomeIcon icon={faCircle} className={`mt-1.5 text-[8px] ${st.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800 truncate">{item.subject}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${st.color}`}>
                          {st.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        {time && <span>{time}</span>}
                        {showConsultant && item.consultantName && <span>المستشار: {item.consultantName}</span>}
                        {showClientName && item.clientName && <span>العميل: {item.clientName}</span>}
                        {item.consultationCategoryName && <span>{item.consultationCategoryName}</span>}
                      </div>
                    </div>
                    {item.zoomLink && (
                      <FontAwesomeIcon icon={faVideo} className="text-blue-400 mt-1" title="يوجد رابط Zoom" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {detailItem && (
        <DetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          showClientName={showClientName}
          showConsultant={showConsultant}
        />
      )}

      {/* Legend */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-4 justify-center">
          {Object.entries(STATUS_MAP).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCircle} className={`text-[8px] ${val.dot}`} />
              <span className="text-xs text-gray-500">{val.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
