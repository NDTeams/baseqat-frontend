"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faPlayCircle,
  faClock,
  faCheckCircle,
  faTrophy,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { ClientProfileService, type ClientStats } from "@/services/client-profile/page";
import { CourseEnrollmentService, type MyEnrollment } from "@/services/courses/page";

export default function ProgressCards() {
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [enrollments, setEnrollments] = useState<MyEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ClientProfileService.getMyStats(),
      CourseEnrollmentService.getMyEnrollments(),
    ])
      .then(([statsRes, enrollRes]) => {
        if (statsRes.succeeded && statsRes.data) setStats(statsRes.data);
        if (enrollRes.succeeded && enrollRes.data) setEnrollments(enrollRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeCourses = enrollments.filter((e) => e.status === 0 || e.status === 1).length;
  const completedCourses = enrollments.filter((e) => e.status === 2).length;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center h-40">
            <FontAwesomeIcon icon={faSpinner} spin className="text-xl text-slate-300" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      icon: faBookOpen,
      value: stats?.totalEnrollments ?? 0,
      label: "الدورات المسجلة",
      border: "border-primary",
      iconBg: "from-primary/20 to-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: faPlayCircle,
      value: activeCourses,
      label: "الدورات النشطة",
      border: "border-accent",
      iconBg: "from-accent/20 to-accent/10",
      iconColor: "text-accent",
    },
    {
      icon: faCheckCircle,
      value: completedCourses,
      label: "الدورات المكتملة",
      border: "border-secondary",
      iconBg: "from-secondary/20 to-secondary/10",
      iconColor: "text-secondary",
      extra: stats?.certificateCount ? `${stats.certificateCount} شهادة` : undefined,
      extraIcon: faTrophy,
    },
    {
      icon: faClock,
      value: stats?.totalLearningHours ?? 0,
      label: "ساعة تعلم",
      border: "border-purple-500",
      iconBg: "from-purple-500/20 to-purple-500/10",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`bg-white rounded-2xl shadow-lg p-6 border-r-4 ${card.border}`}
          data-aos="fade-up"
          data-aos-delay={100 + i * 100}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center`}>
              <FontAwesomeIcon icon={card.icon} className={`text-2xl ${card.iconColor}`} />
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-neutral-900 mb-1">{card.value}</div>
              <div className="text-sm text-neutral-600">{card.label}</div>
            </div>
          </div>
          {card.extra && (
            <div className="pt-4 border-t border-neutral-100">
              <div className="flex items-center text-xs text-neutral-500">
                <FontAwesomeIcon icon={card.extraIcon!} className="text-yellow-500 ml-2" />
                <span>{card.extra}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
