'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import CourseHero from '@/components/site/course-hero';
import CourseSection from '@/components/site/course-section';
import SimilarCourses from '@/components/site/similar-courses';
import { CoursesService, type CourseDetailFull } from '@/services/courses/page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<CourseDetailFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    setError(false);
    CoursesService.getActiveById(courseId)
      .then((res) => {
        if (res.succeeded && res.data) {
          setCourse(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" dir="rtl">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-5xl text-red-400" />
        <h2 className="text-xl font-bold text-gray-800">لم يتم العثور على الدورة</h2>
        <p className="text-gray-500">الدورة غير موجودة أو غير متاحة حالياً</p>
        <Link href="/courses-archive" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          عرض جميع الدورات
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <CourseHero course={course} />
      <CourseSection course={course} />
      <SimilarCourses categoryId={course.courseCategoryId} currentCourseId={course.id} />
    </div>
  );
}
