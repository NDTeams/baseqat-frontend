'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChess, faCoins, faBullhorn, faGavel, faUsers, faLaptopCode,
  faVideo, faBuilding, faArrowLeft, faArrowRight, faPaperPlane,
  faSpinner, faClipboardCheck, faStar, faClock, faLock, faFileAlt,
  faHeadset, faCheck, faTimes, faCircleExclamation,
  faSignInAlt, faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import CoursesHeader from '@/components/site/courses-header';
import {
  ConsultationRequestService,
  ConsultationCategoryPublicService,
  type ConsultationCategory,
} from '@/services/consultants/page';

// ===== Icon mapping for categories =====
const CATEGORY_ICONS: Record<string, { icon: any; gradient: string }> = {
  'default': { icon: faChess, gradient: 'from-blue-600 to-blue-700' },
};

const ICON_LIST = [
  { icon: faChess, gradient: 'from-blue-600 to-blue-700' },
  { icon: faCoins, gradient: 'from-amber-500 to-amber-600' },
  { icon: faBullhorn, gradient: 'from-sky-500 to-blue-600' },
  { icon: faGavel, gradient: 'from-gray-500 to-gray-600' },
  { icon: faUsers, gradient: 'from-blue-600 to-sky-600' },
  { icon: faLaptopCode, gradient: 'from-amber-500 to-yellow-500' },
];

// ===== Time slots =====
const TIME_SLOTS = [
  '09:00 ص', '10:00 ص', '11:00 ص', '12:00 م',
  '01:00 م', '02:00 م', '03:00 م', '04:00 م',
];

// Convert Arabic time to 24h format
function timeTo24h(t: string): string {
  const match = t.match(/^(\d{2}):(\d{2})\s*(ص|م)$/);
  if (!match) return t;
  let h = parseInt(match[1]);
  const m = match[2];
  const period = match[3];
  if (period === 'م' && h !== 12) h += 12;
  if (period === 'ص' && h === 12) h = 0;
  return `${h.toString().padStart(2, '0')}:${m}`;
}

// ===== Toast =====
function Toast({ open, type, message, onClose }: { open: boolean; type: string; message: string; onClose: () => void }) {
  useEffect(() => {
    if (open) { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-bold ${type === 'success' ? 'bg-blue-600' : 'bg-red-500'}`}>
      <FontAwesomeIcon icon={type === 'success' ? faCheck : faTimes} />
      {message}
    </div>
  );
}

export default function ConsultationRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledDate = searchParams.get('date');
  const [currentStep, setCurrentStep] = useState(1);

  // Auth check
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = loading

  // Categories from API
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);
  const [catLoading, setCatLoading] = useState(true);

  // Form state
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [sessionType, setSessionType] = useState<'online' | 'in-person'>('online');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('11:00 ص');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [notif, setNotif] = useState({ open: false, type: 'success', message: '' });
  const showNotif = (type: string, msg: string) => setNotif({ open: true, type, message: msg });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Check authentication on mount
  useEffect(() => {
    const token = Cookies.get('auth_token') || localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  // Load categories (only if logged in)
  useEffect(() => {
    if (isLoggedIn !== true) return;
    ConsultationCategoryPublicService.getActive().then(res => {
      if (res.succeeded && Array.isArray(res.data)) {
        setCategories(res.data);
        if (res.data.length > 0) setSelectedCategoryId(res.data[0].id);
      }
    }).finally(() => setCatLoading(false));
  }, [isLoggedIn]);

  // Set min date to today, or use pre-filled date from calendar
  useEffect(() => {
    if (prefilledDate && prefilledDate >= new Date().toISOString().split('T')[0]) {
      setSelectedDate(prefilledDate);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    }
  }, [prefilledDate]);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  // ===== Step navigation =====
  const goStep = (n: number) => {
    if (n === 2 && !selectedCategoryId) {
      showNotif('error', 'يرجى اختيار نوع الاستشارة');
      return;
    }
    setCurrentStep(n);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // ===== Submit =====
  const handleSubmit = async () => {
    const newErrors: Record<string, boolean> = {};
    if (!subject.trim()) newErrors.subject = true;
    if (!message.trim()) newErrors.message = true;
    if (!agreeTerms) {
      showNotif('error', 'يرجى الموافقة على الأحكام والشروط');
      return;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await ConsultationRequestService.submit({
        consultationCategoryId: selectedCategoryId!,
        subject: subject.trim(),
        message: `[${sessionType === 'online' ? 'عبر الإنترنت' : 'حضوري'}] ${message.trim()}`,
        preferredDate: selectedDate || undefined,
        preferredTime: selectedTime ? timeTo24h(selectedTime) : undefined,
      });
      if (res.succeeded) {
        showNotif('success', 'تم إرسال طلب الاستشارة بنجاح! سيتواصل معك فريقنا قريباً');
        setTimeout(() => router.push('/client-dashboard/consultations'), 2000);
      } else {
        if (res.message?.includes('تسجيل الدخول') || res.message?.includes('Unauthorized')) {
          showNotif('error', 'يجب تسجيل الدخول أولاً لطلب استشارة');
        } else {
          showNotif('error', res.message || 'فشل في إرسال الطلب');
        }
      }
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401) {
        showNotif('error', 'يجب تسجيل الدخول أولاً لطلب استشارة');
      } else {
        showNotif('error', err.response?.data?.message || 'حدث خطأ غير متوقع');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Loading state
  if (isLoggedIn === null) {
    return (
      <main className="min-h-screen bg-gray-50" dir="rtl">
        <CoursesHeader
          subtitle="خطوتك الأولى نحو النجاح"
          title="طلب جلسة استشارية"
          description="أكمل البيانات أدناه وسيتواصل معك أحد متخصصينا في غضون 24 ساعة"
        />
        <div className="flex justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-3xl" />
        </div>
      </main>
    );
  }

  // Not logged in → show login/register prompt
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-50" dir="rtl">
        <CoursesHeader
          subtitle="خطوتك الأولى نحو النجاح"
          title="طلب جلسة استشارية"
          description="أكمل البيانات أدناه وسيتواصل معك أحد متخصصينا في غضون 24 ساعة"
        />
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 md:p-12 border-2 border-blue-50 shadow-lg shadow-gray-200/50 text-center">
              {/* Lock icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <FontAwesomeIcon icon={faLock} className="text-blue-600 text-3xl" />
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-3">يجب تسجيل الدخول أولاً</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                لطلب جلسة استشارية، يرجى تسجيل الدخول إلى حسابك أو إنشاء حساب جديد. سيساعدنا ذلك في متابعة طلبك والتواصل معك بسهولة.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/login?returnUrl=/consultation-request"
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-l from-blue-600 to-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-300/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register?returnUrl=/consultation-request"
                  className="flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-blue-600 text-blue-700 font-black rounded-2xl hover:bg-blue-50 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                  إنشاء حساب
                </Link>
              </div>

              <p className="text-xs text-gray-400 mt-6 font-semibold">
                بعد تسجيل الدخول ستتمكن من طلب استشارة ومتابعة حالة طلباتك
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero */}
      <CoursesHeader
        subtitle="خطوتك الأولى نحو النجاح"
        title="طلب جلسة استشارية"
        description="أكمل البيانات أدناه وسيتواصل معك أحد متخصصينا في غضون 24 ساعة"
      />

      {/* Steps Indicator */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[72px] z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center max-w-lg mx-auto gap-0">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                currentStep === 1 ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-300/40'
                  : currentStep > 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'
              }`}>
                {currentStep > 1 ? <FontAwesomeIcon icon={faCheck} className="text-xs" /> : '1'}
              </div>
              <span className={`text-xs font-bold mt-1 ${currentStep >= 1 ? 'text-gray-600' : 'text-gray-400'}`}>الخدمة</span>
            </div>
            {/* Line 1 */}
            <div className={`flex-1 h-[3px] rounded mx-2 ${currentStep > 1 ? 'bg-gradient-to-l from-blue-500 to-blue-600' : 'bg-gray-200'}`} />
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                currentStep === 2 ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-300/40'
                  : currentStep > 2 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'
              }`}>
                {currentStep > 2 ? <FontAwesomeIcon icon={faCheck} className="text-xs" /> : '2'}
              </div>
              <span className={`text-xs font-bold mt-1 ${currentStep >= 2 ? 'text-gray-600' : 'text-gray-400'}`}>الموعد</span>
            </div>
            {/* Line 2 */}
            <div className={`flex-1 h-[3px] rounded mx-2 ${currentStep > 2 ? 'bg-gradient-to-l from-blue-500 to-blue-600' : 'bg-gray-200'}`} />
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                currentStep === 3 ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-300/40'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                3
              </div>
              <span className={`text-xs font-bold mt-1 ${currentStep === 3 ? 'text-gray-600' : 'text-gray-400'}`}>بياناتك</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-10 max-w-6xl mx-auto">

            {/* Form Area */}
            <div className="flex-1">
              {/* ===== Step 1: Service Selection ===== */}
              {currentStep === 1 && (
                <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-blue-50 shadow-lg shadow-gray-200/50">
                  <h2 className="text-2xl font-black text-gray-900 mb-2">اختر نوع الاستشارة</h2>
                  <p className="text-gray-500 text-sm mb-6">حدّد المجال الذي تحتاج فيه للدعم الاستشاري.</p>

                  {catLoading ? (
                    <div className="text-center py-12">
                      <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-2xl" />
                      <p className="text-gray-400 mt-3 text-sm">جاري تحميل أنواع الاستشارات...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {categories.map((cat, idx) => {
                        const iconInfo = ICON_LIST[idx % ICON_LIST.length];
                        const isSelected = selectedCategoryId === cat.id;
                        return (
                          <div
                            key={cat.id}
                            onClick={() => setSelectedCategoryId(cat.id)}
                            className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50/50 shadow-md'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/20'
                            }`}
                          >
                            {/* Check circle */}
                            <div className={`absolute top-4 left-4 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                            }`}>
                              {isSelected && <span className="text-white text-[10px] font-black">&#10003;</span>}
                            </div>

                            <div className="pr-2">
                              <div className="flex items-center gap-3 mb-1.5">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${iconInfo.gradient}`}>
                                  <FontAwesomeIcon icon={iconInfo.icon} className="text-white text-sm" />
                                </div>
                                <span className="font-black text-gray-900">{cat.name}</span>
                              </div>
                              {cat.description && (
                                <p className="text-gray-500 text-xs mr-12">{cat.description}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={() => goStep(2)}
                      className="flex items-center gap-3 px-8 py-3.5 bg-gradient-to-l from-blue-600 to-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-300/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                    >
                      التالي
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                  </div>
                </div>
              )}

              {/* ===== Step 2: Date & Time ===== */}
              {currentStep === 2 && (
                <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-blue-50 shadow-lg shadow-gray-200/50">
                  <h2 className="text-2xl font-black text-gray-900 mb-2">اختر موعد الجلسة</h2>
                  <p className="text-gray-500 text-sm mb-6">الجلسات تُعقد حضورياً أو عبر الإنترنت | المدة: 60 دقيقة</p>

                  {/* Session Type */}
                  <div className="flex gap-4 mb-6">
                    <label
                      onClick={() => setSessionType('online')}
                      className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        sessionType === 'online' ? 'border-blue-500 bg-blue-50/40' : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <input type="radio" name="sessionType" checked={sessionType === 'online'} onChange={() => setSessionType('online')} className="accent-blue-700" />
                      <div>
                        <div className="font-black text-sm text-gray-900">
                          <FontAwesomeIcon icon={faVideo} className="ml-1 text-sm text-blue-600" />
                          عبر الإنترنت
                        </div>
                        <div className="text-xs text-gray-500">Zoom / Meet</div>
                      </div>
                    </label>
                    <label
                      onClick={() => setSessionType('in-person')}
                      className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        sessionType === 'in-person' ? 'border-blue-500 bg-blue-50/40' : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <input type="radio" name="sessionType" checked={sessionType === 'in-person'} onChange={() => setSessionType('in-person')} className="accent-blue-700" />
                      <div>
                        <div className="font-black text-sm text-gray-900">
                          <FontAwesomeIcon icon={faBuilding} className="ml-1 text-sm text-blue-600" />
                          حضوري
                        </div>
                        <div className="text-xs text-gray-500">مقر باسقات</div>
                      </div>
                    </label>
                  </div>

                  {/* Date */}
                  <label className="block font-bold text-sm text-gray-700 mb-2">التاريخ المفضّل</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    min={todayStr}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all mb-6"
                  />

                  {/* Time Slots */}
                  <label className="block font-bold text-sm text-gray-700 mb-2">الوقت المفضّل</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
                    {TIME_SLOTS.map(t => (
                      <div
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`border-2 rounded-xl py-2.5 px-3 text-center font-bold text-sm cursor-pointer transition-all ${
                          selectedTime === t
                            ? 'bg-gradient-to-l from-blue-600 to-blue-700 text-white border-transparent shadow-lg shadow-blue-300/30'
                            : 'border-gray-200 text-gray-700 hover:border-blue-400'
                        }`}
                      >
                        {t}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => goStep(1)}
                      className="flex items-center gap-3 px-6 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                      السابق
                    </button>
                    <button
                      onClick={() => goStep(3)}
                      className="flex items-center gap-3 px-8 py-3.5 bg-gradient-to-l from-blue-600 to-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-300/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                    >
                      التالي
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                  </div>
                </div>
              )}

              {/* ===== Step 3: Details & Submit ===== */}
              {currentStep === 3 && (
                <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-blue-50 shadow-lg shadow-gray-200/50">
                  <h2 className="text-2xl font-black text-gray-900 mb-2">تفاصيل الاستشارة</h2>
                  <p className="text-gray-500 text-sm mb-6">أخبرنا عن طلبك حتى نستعد لجلستك على أكمل وجه.</p>

                  <div className="space-y-5 mb-5">
                    {/* Subject */}
                    <div>
                      <label className="block font-bold text-sm text-gray-700 mb-2">موضوع الاستشارة *</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={e => { setSubject(e.target.value); setErrors(p => ({ ...p, subject: false })); }}
                        placeholder="مثال: تخطيط استراتيجي لمشروع جديد"
                        className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-all ${
                          errors.subject ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                        }`}
                      />
                      {errors.subject && <p className="text-red-500 text-xs font-semibold mt-1">يرجى إدخال موضوع الاستشارة</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block font-bold text-sm text-gray-700 mb-2">وصف مختصر لمشروعك أو استفساراتك *</label>
                      <textarea
                        value={message}
                        onChange={e => { setMessage(e.target.value); setErrors(p => ({ ...p, message: false })); }}
                        rows={4}
                        placeholder="اكتب باختصار عن مشروعك وما تأمل الحصول عليه من الجلسة..."
                        className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold resize-none focus:outline-none transition-all ${
                          errors.message ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                        }`}
                      />
                      {errors.message && <p className="text-red-500 text-xs font-semibold mt-1">يرجى إدخال تفاصيل الطلب</p>}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={e => setAgreeTerms(e.target.checked)}
                      className="mt-1 accent-blue-700 w-4 h-4 flex-shrink-0"
                    />
                    <label className="text-sm text-gray-600 font-semibold cursor-pointer" onClick={() => setAgreeTerms(!agreeTerms)}>
                      أوافق على{' '}
                      <a href="/terms" className="underline font-black text-blue-700">الأحكام والشروط</a>
                      {' '}و
                      <a href="/privacy" className="underline font-black text-blue-700">سياسة الخصوصية</a>
                      {' '}لباسقات
                    </label>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => goStep(2)}
                      className="flex items-center gap-3 px-6 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                      السابق
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex items-center gap-3 px-8 py-3.5 bg-gradient-to-l from-blue-600 to-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-300/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {submitting ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : (
                        <FontAwesomeIcon icon={faPaperPlane} />
                      )}
                      إرسال الطلب
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ===== Sidebar ===== */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="lg:sticky top-[160px] space-y-5">

                {/* Selection Summary */}
                <div className="bg-white rounded-2xl p-6 border-2 border-blue-50 shadow-md">
                  <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faClipboardCheck} className="text-blue-600" />
                    ملخص طلبك
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-semibold">نوع الاستشارة</span>
                      <span className="font-black text-gray-900">{selectedCategory?.name || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-semibold">نوع الجلسة</span>
                      <span className="font-black text-gray-900">{sessionType === 'online' ? 'عبر الإنترنت' : 'حضوري'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-semibold">مدة الجلسة</span>
                      <span className="font-black text-gray-900">60 دقيقة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-semibold">الرسوم</span>
                      <span className="font-black text-blue-600">مجانية (أولى)</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 font-semibold">
                    الجلسة الأولى التقييمية مجانية تماماً
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-white rounded-2xl p-6 border-2 border-blue-50 shadow-md">
                  <h3 className="font-black text-gray-900 mb-4">لماذا تختار باسقات؟</h3>
                  <div className="space-y-3.5">
                    {[
                      { icon: faStar, text: 'مستشارون خبراء بخبرة 10+ سنوات في السوق السعودية' },
                      { icon: faClock, text: 'مواعيد مرنة تناسب جدولك على مدار الأسبوع' },
                      { icon: faLock, text: 'جلسات سرية ومحمية بالكامل' },
                      { icon: faFileAlt, text: 'ملخص وخطوات قابلة للتنفيذ بعد كل جلسة' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700">
                          <FontAwesomeIcon icon={item.icon} className="text-white text-xs" />
                        </div>
                        <p className="text-sm text-gray-600">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-white rounded-2xl p-6 border-2 border-blue-50 shadow-md text-center">
                  <FontAwesomeIcon icon={faHeadset} className="text-3xl text-blue-600 mb-3" />
                  <p className="font-black text-gray-900 mb-1">تحتاج مساعدة؟</p>
                  <p className="text-sm text-gray-500 mb-3">تواصل معنا مباشرة</p>
                  <a
                    href="https://wa.me/9663104372766"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white text-sm bg-[#25D366] hover:bg-[#1da851] transition-colors"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                    واتساب
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <Toast open={notif.open} type={notif.type} message={notif.message} onClose={() => setNotif(p => ({ ...p, open: false }))} />
    </main>
  );
}
