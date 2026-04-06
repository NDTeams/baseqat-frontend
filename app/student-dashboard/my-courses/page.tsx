"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faSpinner,
  faArrowLeft,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faUsers,
  faUserTie,
  faCertificate,
  faXmark,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { CourseEnrollmentService, type MyEnrollment } from "@/services/courses/page";
import { getFileUrl } from "@/lib/config";

type TabFilter = "all" | "pending" | "approved" | "rejected";

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<MyEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchEnrollments = () => {
    setLoading(true);
    CourseEnrollmentService.getMyEnrollments()
      .then((res) => {
        if (res.succeeded && res.data) setEnrollments(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleCancel = async (enrollmentId: number) => {
    if (!confirm("هل أنت متأكد من إلغاء طلب التسجيل؟")) return;
    setCancellingId(enrollmentId);
    try {
      const res = await CourseEnrollmentService.cancelMyEnrollment(enrollmentId);
      if (res.succeeded) {
        setEnrollments((prev) => prev.filter((e) => e.enrollmentId !== enrollmentId));
      }
    } catch {}
    setCancellingId(null);
  };

  const filtered = enrollments.filter((e) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return e.enrollmentStatus === 0;
    if (activeTab === "approved") return e.enrollmentStatus === 1;
    if (activeTab === "rejected") return e.enrollmentStatus === 2;
    return true;
  });

  const counts = {
    all: enrollments.length,
    pending: enrollments.filter((e) => e.enrollmentStatus === 0).length,
    approved: enrollments.filter((e) => e.enrollmentStatus === 1).length,
    rejected: enrollments.filter((e) => e.enrollmentStatus === 2).length,
  };

  const tabs: { key: TabFilter; label: string; icon: any; color: string }[] = [
    { key: "all", label: "الكل", icon: faLayerGroup, color: "emerald" },
    { key: "approved", label: "معتمدة", icon: faCheckCircle, color: "green" },
    { key: "pending", label: "قيد المراجعة", icon: faClock, color: "amber" },
    { key: "rejected", label: "مرفوضة", icon: faTimesCircle, color: "red" },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">دوراتي</h1>
          <p className="text-sm text-neutral-500 mt-1">
            جميع الدورات التي تقدمت للتسجيل فيها
          </p>
        </div>
        <Link
          href="/courses-archive"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition text-sm"
        >
          تصفح الدورات المتاحة
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? tab.color === "emerald"
                  ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                  : tab.color === "green"
                  ? "bg-green-100 text-green-700 border-2 border-green-300"
                  : tab.color === "amber"
                  ? "bg-amber-100 text-amber-700 border-2 border-amber-300"
                  : "bg-red-100 text-red-700 border-2 border-red-300"
                : "bg-white text-neutral-600 border-2 border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} className="text-xs" />
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key ? "bg-white/50" : "bg-neutral-100"
            }`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-emerald-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-neutral-400">
          <FontAwesomeIcon icon={faBookOpen} className="text-5xl" />
          <p className="text-lg font-semibold">
            {activeTab === "all"
              ? "لا توجد دورات مسجلة حالياً"
              : activeTab === "pending"
              ? "لا توجد طلبات قيد المراجعة"
              : activeTab === "approved"
              ? "لا توجد دورات معتمدة"
              : "لا توجد طلبات مرفوضة"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((enrollment) => (
            <EnrollmentCard
              key={enrollment.enrollmentId}
              enrollment={enrollment}
              onCancel={handleCancel}
              cancellingId={cancellingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EnrollmentCard({
  enrollment,
  onCancel,
  cancellingId,
}: {
  enrollment: MyEnrollment;
  onCancel: (id: number) => void;
  cancellingId: number | null;
}) {
  const isPending = enrollment.enrollmentStatus === 0;
  const isApproved = enrollment.enrollmentStatus === 1;
  const isRejected = enrollment.enrollmentStatus === 2;

  const statusConfig = isPending
    ? { bg: "bg-amber-500", text: "قيد المراجعة", icon: faClock }
    : isApproved
    ? { bg: "bg-green-500", text: "معتمد", icon: faCheckCircle }
    : { bg: "bg-red-500", text: "مرفوض", icon: faTimesCircle };

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group ${
      isRejected ? "opacity-75" : ""
    }`}>
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={enrollment.thumbnailUrl ? getFileUrl(enrollment.thumbnailUrl) : "/site/logo.png"}
          alt={enrollment.courseTitle}
          className={`w-full h-48 transition-transform duration-300 group-hover:scale-105 ${
            enrollment.thumbnailUrl ? "object-cover" : "object-contain p-8 bg-slate-50"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`${statusConfig.bg} text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg inline-flex items-center gap-1.5`}>
            <FontAwesomeIcon icon={statusConfig.icon} className="text-[10px]" />
            {statusConfig.text}
          </span>
        </div>

        {enrollment.courseTypeName && (
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 text-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold">
              {enrollment.courseTypeName}
            </span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUsers} className="text-sm" />
            <span className="text-sm">{enrollment.totalEnrollments} طالب</span>
          </div>
          {enrollment.levelName && (
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{enrollment.levelName}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center overflow-hidden">
            {enrollment.instructorAvatarUrl ? (
              <img
                src={getFileUrl(enrollment.instructorAvatarUrl)}
                alt={enrollment.instructorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <FontAwesomeIcon icon={faUserTie} className="text-sm text-emerald-600" />
            )}
          </div>
          <div>
            <p className="text-[11px] text-neutral-400">المدرب</p>
            <p className="text-sm font-semibold text-neutral-800">{enrollment.instructorName}</p>
          </div>
        </div>

        <h3 className="text-base font-bold text-neutral-900 mb-2 line-clamp-2">{enrollment.courseTitle}</h3>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-neutral-400 mb-3">
          {enrollment.totalDurationInHours > 0 && <span>{enrollment.totalDurationInHours} ساعة</span>}
          {enrollment.totalSections > 0 && <span>{enrollment.totalSections} قسم</span>}
          {enrollment.hasCertificate && (
            <span className="text-amber-500 flex items-center gap-1">
              <FontAwesomeIcon icon={faCertificate} className="text-[10px]" />
              شهادة
            </span>
          )}
        </div>

        <p className="text-xs text-neutral-400 mb-4">تاريخ التسجيل: {enrollment.enrolledAt}</p>

        {/* Rejection reason */}
        {isRejected && enrollment.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4">
            <p className="text-xs text-red-600 font-semibold mb-0.5">سبب الرفض:</p>
            <p className="text-xs text-red-500">{enrollment.rejectionReason}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
          {isApproved && (
            <Link
              href={`/courses/${enrollment.courseId}`}
              className="flex-1 bg-emerald-600 text-white text-center py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition text-sm flex items-center justify-center gap-2"
            >
              متابعة التعلم
              <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            </Link>
          )}

          {isPending && (
            <button
              onClick={() => onCancel(enrollment.enrollmentId)}
              disabled={cancellingId === enrollment.enrollmentId}
              className="flex-1 bg-neutral-100 text-neutral-600 text-center py-2.5 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 transition text-sm flex items-center justify-center gap-2"
            >
              {cancellingId === enrollment.enrollmentId ? (
                <FontAwesomeIcon icon={faSpinner} spin className="text-sm" />
              ) : (
                <>
                  إلغاء الطلب
                  <FontAwesomeIcon icon={faXmark} className="text-xs" />
                </>
              )}
            </button>
          )}

          {isRejected && (
            <Link
              href="/courses-archive"
              className="flex-1 bg-neutral-100 text-neutral-600 text-center py-2.5 rounded-xl font-semibold hover:bg-neutral-200 transition text-sm"
            >
              تصفح دورات أخرى
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
