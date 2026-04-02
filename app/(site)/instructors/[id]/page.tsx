'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar, faUsers, faBookOpen, faChalkboardTeacher,
  faArrowRight, faSpinner, faMars, faVenus,
  faLightbulb, faQuoteRight, faBriefcase, faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  faInstagram, faFacebookF, faLinkedinIn, faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import {
  InstructorPublicService,
  type InstructorDetail,
  type Course,
} from '@/services/courses/page';
import { getFileUrl } from '@/lib/config';

export default function InstructorDetailsPage() {
  const { id } = useParams();
  const [instructor, setInstructor] = useState<InstructorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await InstructorPublicService.getActiveById(Number(id));
        if (res.succeeded && res.data) {
          setInstructor(res.data);
        } else {
          setError(res.message || 'لم يتم العثور على المدرب');
        }
      } catch {
        setError('حدث خطأ أثناء تحميل بيانات المدرب');
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <FontAwesomeIcon icon={faSpinner} spin className="text-primary text-4xl" />
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32 px-4" dir="rtl">
        <div className="bg-white rounded-2xl p-12 shadow-md text-center max-w-md">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faChalkboardTeacher} className="text-red-400 text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">لم يتم العثور على المدرب</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            href="/instructors"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition"
          >
            <FontAwesomeIcon icon={faArrowRight} />
            العودة للمدربين
          </Link>
        </div>
      </div>
    );
  }

  const hasSocial = instructor.linkedInUrl || instructor.xUrl || instructor.instagramUrl || instructor.facebookUrl;
  const courses = instructor.courses || [];
  const reviews = instructor.reviews || [];

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      {/* Hero Banner */}
      <section className="relative pt-28 pb-32 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
          <Link
            href="/instructors"
            className="inline-flex items-center gap-2 text-emerald-100 hover:text-white transition-colors text-sm font-medium mb-8"
          >
            <FontAwesomeIcon icon={faArrowRight} />
            العودة لقائمة المدربين
          </Link>
        </div>
      </section>

      {/* Profile Card */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-100">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-md">
              <img
                src={instructor.avatarUrl ? getFileUrl(instructor.avatarUrl) : '/site/logo.png'}
                alt={instructor.name}
                className={`w-full h-full ${instructor.avatarUrl ? 'object-cover' : 'object-contain p-4'}`}
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-right space-y-3">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{instructor.name}</h1>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  instructor.gender === 0
                    ? 'bg-sky-100 text-sky-700'
                    : 'bg-pink-100 text-pink-700'
                }`}>
                  <FontAwesomeIcon icon={instructor.gender === 0 ? faMars : faVenus} className="text-[10px]" />
                  {instructor.genderName || (instructor.gender === 0 ? 'ذكر' : 'أنثى')}
                </span>
              </div>
              <p className="text-emerald-600 font-semibold text-lg">{instructor.title}</p>

              {/* Years of Experience */}
              {instructor.yearsOfExperience != null && instructor.yearsOfExperience > 0 && (
                <p className="text-slate-500 text-sm flex items-center justify-center sm:justify-start gap-2">
                  <FontAwesomeIcon icon={faBriefcase} className="text-slate-400" />
                  {instructor.yearsOfExperience} سنوات خبرة
                </p>
              )}

              {/* Skills */}
              {instructor.skills && instructor.skills.length > 0 && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {instructor.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full font-medium"
                    >
                      <FontAwesomeIcon icon={faLightbulb} className="text-[10px]" />
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Media */}
              {hasSocial && (
                <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                  {instructor.linkedInUrl && (
                    <a href={instructor.linkedInUrl} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#0077B5] hover:text-white transition-all duration-300">
                      <FontAwesomeIcon icon={faLinkedinIn} className="text-sm" />
                    </a>
                  )}
                  {instructor.xUrl && (
                    <a href={instructor.xUrl} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-gray-900 hover:text-white transition-all duration-300">
                      <FontAwesomeIcon icon={faXTwitter} className="text-sm" />
                    </a>
                  )}
                  {instructor.instagramUrl && (
                    <a href={instructor.instagramUrl} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-pink-500 hover:text-white transition-all duration-300">
                      <FontAwesomeIcon icon={faInstagram} className="text-sm" />
                    </a>
                  )}
                  {instructor.facebookUrl && (
                    <a href={instructor.facebookUrl} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all duration-300">
                      <FontAwesomeIcon icon={faFacebookF} className="text-sm" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Rating */}
            {instructor.rating != null && instructor.rating > 0 && (
              <div className="flex flex-col items-center bg-amber-50 rounded-2xl px-5 py-4 flex-shrink-0 border border-amber-100">
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon
                      key={star}
                      icon={faStar}
                      className={`text-sm ${
                        star <= Math.round(instructor.rating!)
                          ? 'text-amber-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold text-slate-800">{instructor.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-500">التقييم العام</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats + Content */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 space-y-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-amber-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faStar} className="text-amber-500 text-lg" />
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {instructor.rating != null ? instructor.rating.toFixed(1) : '-'}
            </p>
            <p className="text-xs text-slate-500 mt-1">التقييم</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-emerald-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-emerald-600 text-lg" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{instructor.totalStudents ?? 0}</p>
            <p className="text-xs text-slate-500 mt-1">طالب</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-emerald-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faBookOpen} className="text-emerald-600 text-lg" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{instructor.totalCources ?? 0}</p>
            <p className="text-xs text-slate-500 mt-1">دورة</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-violet-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faBriefcase} className="text-violet-600 text-lg" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{instructor.yearsOfExperience ?? '-'}</p>
            <p className="text-xs text-slate-500 mt-1">سنوات خبرة</p>
          </div>
        </div>

        {/* Bio */}
        {instructor.bio && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faQuoteRight} className="text-emerald-600" />
              نبذة عن المدرب
            </h2>
            <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">{instructor.bio}</p>
          </div>
        )}

        {/* Courses */}
        {courses.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faBookOpen} className="text-emerald-600" />
              الدورات التدريبية
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{courses.length}</span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={course.thumbnailUrl ? getFileUrl(course.thumbnailUrl) : '/site/logo.png'}
                      alt={course.title}
                      className={`w-full h-full transition-transform duration-500 group-hover:scale-110 ${course.thumbnailUrl ? 'object-cover' : 'object-contain p-8'}`}
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2">{course.title}</h3>
                    {course.subtitle && (
                      <p className="text-sm text-slate-500 line-clamp-1">{course.subtitle}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                      {course.levelName && <span className="bg-slate-100 px-2 py-1 rounded-full text-slate-600 font-medium">{course.levelName}</span>}
                      {course.price != null && course.price > 0 && (
                        <span className="font-bold text-emerald-600 text-sm">{course.price} ر.س</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faStar} className="text-amber-500" />
              التقييمات
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{reviews.length}</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {reviews.map((review, i) => (
                <div
                  key={review.id || i}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesomeIcon
                          key={star}
                          icon={faStar}
                          className={`text-xs ${
                            star <= (review.rating || 0) ? 'text-amber-500' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
