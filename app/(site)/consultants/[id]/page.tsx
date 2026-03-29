'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie, faStar, faBriefcase, faClock, faMoneyBill,
  faArrowRight, faSpinner, faCheck, faPaperPlane, faLightbulb,
  faQuoteRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedinIn, faXTwitter, faInstagram, faFacebookF,
} from '@fortawesome/free-brands-svg-icons';
import {
  ConsultantPublicService,
  ConsultationRequestService,
  type ConsultantDetail,
} from '@/services/consultants/page';
import { getFileUrl } from '@/lib/config';

export default function ConsultantDetailsPage() {
  const { id } = useParams();
  const [consultant, setConsultant] = useState<ConsultantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    subject: '',
    message: '',
    preferredDate: '',
    preferredTime: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch consultant on mount
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await ConsultantPublicService.getActiveById(Number(id));
        if (res.succeeded && res.data) {
          setConsultant(res.data);
        } else {
          setError(res.message || 'لم يتم العثور على المستشار');
        }
      } catch {
        setError('حدث خطأ أثناء تحميل بيانات المستشار');
      }
      setLoading(false);
    })();
  }, [id]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const payload: any = {
        consultantId: Number(id),
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        subject: formData.subject,
        message: formData.message,
      };
      if (formData.preferredDate) payload.preferredDate = formData.preferredDate;
      if (formData.preferredTime) payload.preferredTime = formData.preferredTime;

      const res = await ConsultationRequestService.submit(payload);
      if (res.succeeded) {
        setSubmitSuccess(true);
        setFormData({
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          subject: '',
          message: '',
          preferredDate: '',
          preferredTime: '',
        });
      } else {
        setSubmitError(res.message || 'حدث خطأ أثناء إرسال الطلب');
      }
    } catch {
      setSubmitError('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    }
    setSubmitting(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <FontAwesomeIcon icon={faSpinner} spin className="text-sky-600 text-4xl" />
      </div>
    );
  }

  // Error state
  if (error || !consultant) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32 px-4" dir="rtl">
        <div className="bg-white rounded-2xl p-12 shadow-md text-center max-w-md">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faUserTie} className="text-red-400 text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">لم يتم العثور على المستشار</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            href="/consultants"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowRight} />
            العودة للمستشارين
          </Link>
        </div>
      </div>
    );
  }

  const hasSocial = consultant.linkedInUrl || consultant.xUrl || consultant.instagramUrl || consultant.facebookUrl;

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
      {/* Hero Banner */}
      <section className="relative pt-28 pb-32 bg-gradient-to-br from-sky-700 via-sky-800 to-sky-700 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
          <Link
            href="/consultants"
            className="inline-flex items-center gap-2 text-sky-100 hover:text-white transition-colors text-sm font-medium mb-8"
          >
            <FontAwesomeIcon icon={faArrowRight} />
            العودة لقائمة المستشارين
          </Link>
        </div>
      </section>

      {/* Profile Card */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-sky-100 to-sky-50 flex-shrink-0 shadow-md ring-4 ring-white">
              {consultant.avatarUrl ? (
                <img
                  src={getFileUrl(consultant.avatarUrl)}
                  alt={consultant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserTie} className="text-sky-300 text-4xl" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-right space-y-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{consultant.name}</h1>
              <p className="text-sky-600 font-semibold text-lg">{consultant.title}</p>

              {/* Specialty */}
              {consultant.specialty && (
                <span className="inline-block px-4 py-1.5 bg-sky-50 text-sky-700 text-sm rounded-full font-medium border border-sky-200">
                  {consultant.specialty}
                </span>
              )}

              {/* Social Media */}
              {hasSocial && (
                <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                  {consultant.linkedInUrl && (
                    <a href={consultant.linkedInUrl} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-all duration-300">
                      <FontAwesomeIcon icon={faLinkedinIn} className="text-sm" />
                    </a>
                  )}
                  {consultant.xUrl && (
                    <a href={consultant.xUrl} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:text-white transition-all duration-300">
                      <FontAwesomeIcon icon={faXTwitter} className="text-sm" />
                    </a>
                  )}
                  {consultant.instagramUrl && (
                    <a href={consultant.instagramUrl} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-pink-500 hover:text-white transition-all duration-300">
                      <FontAwesomeIcon icon={faInstagram} className="text-sm" />
                    </a>
                  )}
                  {consultant.facebookUrl && (
                    <a href={consultant.facebookUrl} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-500 hover:text-white transition-all duration-300">
                      <FontAwesomeIcon icon={faFacebookF} className="text-sm" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Rating */}
            {consultant.rating != null && consultant.rating > 0 && (
              <div className="flex flex-col items-center bg-amber-50 rounded-2xl px-5 py-4 flex-shrink-0">
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon
                      key={star}
                      icon={faStar}
                      className={`text-sm ${
                        star <= Math.round(consultant.rating!)
                          ? 'text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold text-gray-800">{consultant.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-500">التقييم العام</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats + Content */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 space-y-10">
        {/* Info Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Years of Experience */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faBriefcase} className="text-green-600 text-xl" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {consultant.yearsOfExperience ?? '-'}
            </p>
            <p className="text-xs text-gray-500 mt-1">سنوات الخبرة</p>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-amber-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faStar} className="text-amber-600 text-xl" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {consultant.rating != null ? consultant.rating.toFixed(1) : '-'}
            </p>
            <p className="text-xs text-gray-500 mt-1">التقييم</p>
          </div>

          {/* Hourly Rate */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faMoneyBill} className="text-blue-600 text-xl" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {consultant.hourlyRate != null ? (
                <>
                  {consultant.hourlyRate} <span className="text-sm font-normal">ر.س</span>
                </>
              ) : (
                '-'
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">سعر الساعة</p>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-purple-600 text-xl" />
            </div>
            <p className="text-sm font-bold text-gray-800 leading-relaxed">
              {consultant.availability || 'غير محدد'}
            </p>
            <p className="text-xs text-gray-500 mt-1">أوقات التوفر</p>
          </div>
        </div>

        {/* Skills Section */}
        {consultant.skills && consultant.skills.length > 0 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faLightbulb} className="text-sky-600" />
              المهارات والخبرات
            </h2>
            <div className="flex flex-wrap gap-2">
              {consultant.skills.map((skill, index) => {
                const colors = [
                  'bg-sky-50 text-sky-700 border-sky-200',
                  'bg-blue-50 text-blue-700 border-blue-200',
                  'bg-purple-50 text-purple-700 border-purple-200',
                  'bg-amber-50 text-amber-700 border-amber-200',
                  'bg-rose-50 text-rose-700 border-rose-200',
                  'bg-sky-50 text-sky-700 border-sky-200',
                ];
                const colorClass = colors[index % colors.length];
                return (
                  <span
                    key={skill.id}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full font-medium border ${colorClass}`}
                  >
                    <FontAwesomeIcon icon={faLightbulb} className="text-[10px]" />
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Bio Section */}
        {consultant.bio && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faQuoteRight} className="text-sky-600" />
              نبذة عن المستشار
            </h2>
            <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
              {consultant.bio}
            </p>
          </div>
        )}

        {/* Consultation Request Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={faPaperPlane} className="text-sky-600" />
            طلب استشارة
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            املأ النموذج التالي وسنتواصل معك في أقرب وقت ممكن
          </p>

          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faCheck} className="text-green-600" />
              </div>
              <div>
                <p className="text-green-800 font-semibold text-sm">
                  تم إرسال طلب الاستشارة بنجاح!
                </p>
                <p className="text-green-600 text-xs mt-0.5">
                  سنتواصل معك قريباً
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Name + Email */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  required
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  required
                  value={formData.clientEmail}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  dir="ltr"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm transition-all text-left"
                />
              </div>
            </div>

            {/* Row 2: Phone + Subject */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  رقم الهاتف <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="clientPhone"
                  required
                  value={formData.clientPhone}
                  onChange={handleChange}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm transition-all text-left"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  الموضوع <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="موضوع الاستشارة"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm transition-all"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                الرسالة <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="اكتب رسالتك هنا... صف استشارتك بالتفصيل"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm transition-all resize-none"
              />
            </div>

            {/* Row 3: Preferred Date + Time */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  التاريخ المفضل
                  <span className="text-gray-400 font-normal mr-1">(اختياري)</span>
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  الوقت المفضل
                  <span className="text-gray-400 font-normal mr-1">(اختياري)</span>
                </label>
                <input
                  type="time"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 focus:ring-4 focus:ring-sky-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    جارٍ الإرسال...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} />
                    إرسال طلب الاستشارة
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
