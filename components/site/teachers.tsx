"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faChalkboardTeacher,
  faStar,
  faUsers,
  faBookOpen,
  faArrowLeft,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faFacebookF,
  faLinkedinIn,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { InstructorPublicService, type Instructor } from "@/services/courses/page";
import { getFileUrl } from "@/lib/config";
import TeachersHeader from "@/components/site/teachers-header";

const Teachers = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    InstructorPublicService.getActive()
      .then((res) => {
        if (res.succeeded && res.data) {
          setInstructors(res.data.slice(0, 8));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-50 py-16 w-full">
        <div className="flex justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary" />
        </div>
      </section>
    );
  }

  if (instructors.length === 0) return null;

  return (
    <section className="bg-slate-50 py-16 w-full">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <TeachersHeader
          expertsNetwork="شبكة الخبراء"
          specializedMentors="مستشارون ومرشدون متخصصون"
          teamDescription="فريق متعدد الخبرات في المنتج، النمو، البيانات، والتمويل."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className="group bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <Link href={`/instructors/${instructor.id}`}>
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={instructor.avatarUrl ? getFileUrl(instructor.avatarUrl) : "/site/logo.png"}
                    alt={instructor.name}
                    className={`w-full h-full transition-transform duration-500 group-hover:scale-110 ${
                      instructor.avatarUrl ? "object-cover" : "object-contain p-8"
                    }`}
                  />
                  {/* Rating Badge */}
                  {instructor.rating != null && instructor.rating > 0 && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                      {instructor.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="p-5 space-y-3">
                <Link href={`/instructors/${instructor.id}`}>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {instructor.name}
                  </h3>
                </Link>
                <p className="text-emerald-600 font-semibold text-sm">{instructor.title}</p>

                {/* Skills */}
                {instructor.skills && instructor.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {instructor.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill.id}
                        className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {instructor.skills.length > 3 && (
                      <span className="text-xs text-slate-400 font-medium">
                        +{instructor.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100">
                  {instructor.totalStudents != null && instructor.totalStudents > 0 && (
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faUsers} className="text-[10px]" />
                      {instructor.totalStudents} طالب
                    </span>
                  )}
                  {instructor.totalCources != null && instructor.totalCources > 0 && (
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faBookOpen} className="text-[10px]" />
                      {instructor.totalCources} دورة
                    </span>
                  )}
                </div>

                {/* Social + Consultation */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    {instructor.linkedInUrl && (
                      <a href={instructor.linkedInUrl} target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#0077B5] hover:text-white transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}>
                        <FontAwesomeIcon icon={faLinkedinIn} className="text-xs" />
                      </a>
                    )}
                    {instructor.xUrl && (
                      <a href={instructor.xUrl} target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-gray-900 hover:text-white transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}>
                        <FontAwesomeIcon icon={faXTwitter} className="text-xs" />
                      </a>
                    )}
                    {instructor.instagramUrl && (
                      <a href={instructor.instagramUrl} target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-pink-500 hover:text-white transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}>
                        <FontAwesomeIcon icon={faInstagram} className="text-xs" />
                      </a>
                    )}
                    {instructor.facebookUrl && (
                      <a href={instructor.facebookUrl} target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}>
                        <FontAwesomeIcon icon={faFacebookF} className="text-xs" />
                      </a>
                    )}
                  </div>

                  {/* Consultation Button */}
                  <Link
                    href={`/instructors/${instructor.id}?consultation=true`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full hover:bg-emerald-600 hover:text-white transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="text-[10px]" />
                    طلب استشارة
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/instructors"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition"
          >
            عرض جميع المستشارين
            <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Teachers;
