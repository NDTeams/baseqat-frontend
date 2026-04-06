"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faStar,
  faUserTie,
  faArrowLeft,
  faCertificate,
  faSpinner,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import { CourseEnrollmentService, type MyEnrollment } from "@/services/courses/page";
import { getFileUrl } from "@/lib/config";

function EnrollmentCard({ enrollment }: { enrollment: MyEnrollment }) {
  const isCompleted = enrollment.status === 2;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group" data-aos="fade-up">
      <div className="relative overflow-hidden">
        <img
          src={enrollment.thumbnailUrl ? getFileUrl(enrollment.thumbnailUrl) : "/site/logo.png"}
          alt={enrollment.courseTitle}
          className={`w-full h-48 transition-transform duration-300 group-hover:scale-110 ${
            enrollment.thumbnailUrl ? "object-cover" : "object-contain p-8 bg-slate-50"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="absolute top-4 right-4">
          <span className={`text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
            isCompleted ? "bg-green-500" : "bg-primary"
          }`}>
            {enrollment.statusName || (isCompleted ? "مكتمل" : "قيد التنفيذ")}
          </span>
        </div>

        {enrollment.courseTypeName && (
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 text-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold">
              {enrollment.courseTypeName}
            </span>
          </div>
        )}

        <div className="absolute bottom-4 right-4 left-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-sm" />
              <span className="text-sm">{enrollment.totalEnrollments} طالب</span>
            </div>
            {enrollment.levelName && (
              <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">{enrollment.levelName}</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {enrollment.instructorAvatarUrl ? (
              <img
                src={getFileUrl(enrollment.instructorAvatarUrl)}
                alt={enrollment.instructorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <FontAwesomeIcon icon={faUserTie} className="text-sm text-primary" />
            )}
          </div>
          <div>
            <p className="text-xs text-neutral-500">المدرب</p>
            <p className="text-sm font-semibold text-neutral-900">{enrollment.instructorName}</p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-neutral-900 mb-3 line-clamp-2">{enrollment.courseTitle}</h3>

        {enrollment.totalDurationInHours > 0 && (
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
            <span>{enrollment.totalDurationInHours} ساعة</span>
            {enrollment.totalSections > 0 && <span>{enrollment.totalSections} قسم</span>}
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
          <Link
            href={isCompleted ? `/student-dashboard/certificates` : `/courses/${enrollment.courseId}`}
            className="flex-1 bg-primary text-white text-center py-2.5 rounded-xl font-semibold hover:opacity-90 transition text-sm flex items-center justify-center gap-2"
          >
            {isCompleted ? "عرض الشهادة" : "متابعة التعلم"}
            <FontAwesomeIcon icon={isCompleted ? faCertificate : faArrowLeft} className="text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CourseGrid() {
  const [enrollments, setEnrollments] = useState<MyEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CourseEnrollmentService.getMyEnrollments()
      .then((res) => {
        if (res.succeeded && res.data) setEnrollments(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary" />
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
        <FontAwesomeIcon icon={faBookOpen} className="text-4xl" />
        <p className="text-lg font-semibold">لا توجد دورات مسجلة حالياً</p>
        <Link
          href="/courses-archive"
          className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition text-sm"
        >
          تصفح الدورات المتاحة
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {enrollments.map((enrollment) => (
        <EnrollmentCard key={enrollment.enrollmentId} enrollment={enrollment} />
      ))}
    </div>
  );
}
