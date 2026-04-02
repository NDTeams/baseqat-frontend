'use client';

import { useState } from 'react';
import {
  faCheckCircle,
  faPlayCircle,
  faChevronLeft,
  faPlay,
  faFileAlt,
  faStar,
  faUsers,
  faBook,
  faCalendarAlt,
  faSignal,
  faGlobe,
  faCertificate,
  faClock,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { CourseDetailFull } from '@/services/courses/page';
import { getFileUrl } from '@/lib/config';

const levelLabels: Record<number, string> = { 0: 'مبتدئ', 1: 'متوسط', 2: 'متقدم' };

export default function CourseDetails({ course }: { course: CourseDetailFull }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  const tabs = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'content', label: 'محتوى الدورة' },
    ...(course.requirements?.length ? [{ id: 'details', label: 'المتطلبات' }] : []),
    ...(course.instructors?.length ? [{ id: 'instructor', label: 'المدرب' }] : []),
    ...(course.reviews?.length ? [{ id: 'reviews', label: 'التقييمات' }] : []),
  ];

  const totalLessons = course.sections?.reduce((sum, s) => sum + (s.lessons?.length || 0), 0) || 0;

  return (
    <section className="py-12 bg-white w-full" dir="rtl">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-neutral-200 mb-8">
              <div className="flex flex-wrap gap-4 overflow-x-auto pb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`relative px-4 py-3 font-semibold text-sm md:text-base transition-all ${
                      activeTab === tab.id ? 'text-primary' : 'text-neutral-600 hover:text-primary'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                {course.description && (
                  <>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">وصف الدورة</h2>
                    <div className="text-neutral-700 leading-relaxed mb-8 whitespace-pre-line">
                      {course.description}
                    </div>
                  </>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {course.sections?.length > 0 && (
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-700">{course.sections.length}</div>
                      <div className="text-sm text-emerald-600">أقسام</div>
                    </div>
                  )}
                  {totalLessons > 0 && (
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-700">{totalLessons}</div>
                      <div className="text-sm text-blue-600">دروس</div>
                    </div>
                  )}
                  {course.totalDurationInHours != null && course.totalDurationInHours > 0 && (
                    <div className="bg-amber-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-amber-700">{course.totalDurationInHours}</div>
                      <div className="text-sm text-amber-600">ساعة</div>
                    </div>
                  )}
                  {course.enrollmentCount > 0 && (
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-purple-700">{course.enrollmentCount}</div>
                      <div className="text-sm text-purple-600">مسجل</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">محتوى الدورة</h2>
                <p className="text-sm text-neutral-500 mb-6">
                  {course.sections?.length || 0} أقسام - {totalLessons} دروس
                </p>
                <div className="space-y-2">
                  {course.sections?.map((section, index) => (
                    <div
                      key={section.id}
                      className="bg-white border border-neutral-200 rounded-lg overflow-hidden"
                    >
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
                        onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                      >
                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon icon={faPlayCircle} className="text-primary text-xl flex-shrink-0" />
                          <div>
                            <h4 className="font-bold text-neutral-900">{section.title}</h4>
                            <p className="text-sm text-neutral-500">{section.lessons?.length || 0} دروس</p>
                          </div>
                        </div>
                        <FontAwesomeIcon
                          icon={faChevronLeft}
                          className={`text-neutral-400 transition-transform duration-300 ${
                            activeAccordion === index ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                      <div className={`overflow-hidden transition-all duration-300 ${
                        activeAccordion === index ? 'max-h-[1000px]' : 'max-h-0'
                      }`}>
                        <div className="px-4 pb-4 space-y-1">
                          {section.lessons?.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <FontAwesomeIcon
                                  icon={lesson.lessonType === 0 ? faPlay : faFileAlt}
                                  className="text-primary text-sm flex-shrink-0"
                                />
                                <span className="text-neutral-700 text-sm">{lesson.title}</span>
                                {lesson.isPreview && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">معاينة</span>
                                )}
                              </div>
                              {lesson.durationInMinutes > 0 && (
                                <span className="text-xs text-neutral-500">{lesson.durationInMinutes} د</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements Tab */}
            {activeTab === 'details' && course.requirements?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">متطلبات الدورة</h2>
                <ul className="space-y-3">
                  {course.requirements.map((req) => (
                    <li key={req.id} className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-primary text-lg mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700">{req.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructor Tab */}
            {activeTab === 'instructor' && course.instructors?.length > 0 && (
              <div className="space-y-6">
                {course.instructors.map((inst, i) => (
                  <div key={i} className="bg-neutral-50 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {inst.instructorAvatarUrl ? (
                        <img
                          src={getFileUrl(inst.instructorAvatarUrl)}
                          alt={inst.instructorName}
                          className="w-20 h-20 rounded-full object-cover border-3 border-primary"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                          {inst.instructorName?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900">{inst.instructorName}</h3>
                        {inst.instructorTitle && (
                          <p className="text-neutral-600">{inst.instructorTitle}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                {/* Rating Summary */}
                <div className="flex items-center gap-6 mb-8 p-6 bg-neutral-50 rounded-2xl">
                  <div className="text-center">
                    <div className="text-4xl font-black text-neutral-900">
                      {course.averageRating > 0 ? course.averageRating.toFixed(1) : '—'}
                    </div>
                    <div className="flex items-center justify-center mt-1 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          className={i < Math.round(course.averageRating) ? 'text-yellow-400' : 'text-neutral-300'}
                          style={{ fontSize: '14px' }}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">{course.totalReviews} تقييم</p>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {course.reviews?.map((review) => (
                    <div key={review.id} className="border border-neutral-200 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {review.userName?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-900">{review.userName}</h4>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <FontAwesomeIcon
                                key={i}
                                icon={faStar}
                                className={i < review.rating ? 'text-yellow-400' : 'text-neutral-300'}
                                style={{ fontSize: '11px' }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-neutral-700 text-sm leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-5 sticky top-24 border border-neutral-100">
              {/* Thumbnail */}
              <div className="relative mb-5 rounded-xl overflow-hidden bg-neutral-100 h-48">
                <img
                  src={course.thumbnailUrl ? getFileUrl(course.thumbnailUrl) : '/site/logo.png'}
                  alt={course.title}
                  className={`w-full h-full ${course.thumbnailUrl ? 'object-cover' : 'object-contain p-6'}`}
                />
              </div>

              {/* Price */}
              <div className="mb-5">
                <div className="text-3xl font-black text-neutral-900">
                  {course.price > 0 ? (
                    <>{course.price.toLocaleString('ar-SA')} <span className="text-base font-normal text-neutral-500">ر.س</span></>
                  ) : (
                    <span className="text-primary">مجاناً</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-lg transition hover:opacity-90 mb-5 flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faShoppingCart} />
                سجل الآن
              </button>

              {/* Course Info */}
              <div className="space-y-3 text-sm border-t border-neutral-100 pt-5">
                {course.totalDurationInHours != null && course.totalDurationInHours > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 flex items-center gap-2">
                      <FontAwesomeIcon icon={faClock} className="text-primary" /> المدة
                    </span>
                    <span className="font-semibold">{course.totalDurationInHours} ساعة</span>
                  </div>
                )}
                {totalLessons > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 flex items-center gap-2">
                      <FontAwesomeIcon icon={faBook} className="text-primary" /> الدروس
                    </span>
                    <span className="font-semibold">{totalLessons}</span>
                  </div>
                )}
                {course.enrollmentCount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 flex items-center gap-2">
                      <FontAwesomeIcon icon={faUsers} className="text-primary" /> المسجلون
                    </span>
                    <span className="font-semibold">{course.enrollmentCount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600 flex items-center gap-2">
                    <FontAwesomeIcon icon={faSignal} className="text-primary" /> المستوى
                  </span>
                  <span className="font-semibold">{levelLabels[course.level] || course.levelName || 'عام'}</span>
                </div>
                {course.language && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 flex items-center gap-2">
                      <FontAwesomeIcon icon={faGlobe} className="text-primary" /> اللغة
                    </span>
                    <span className="font-semibold">{course.language}</span>
                  </div>
                )}
                {course.hasCertificate && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCertificate} className="text-primary" /> الشهادة
                    </span>
                    <span className="font-semibold text-emerald-600">نعم</span>
                  </div>
                )}
                {course.startDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-primary" /> تاريخ البدء
                    </span>
                    <span className="font-semibold">{new Date(course.startDate).toLocaleDateString('ar-SA')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
