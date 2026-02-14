"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebookF,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import TeachersHeader from "@/components/site/teachers-header";
export interface Teacher {
  id: string;
  name: string;
  role: string;
  image: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
}

export const teachers: Teacher[] = [
  {
    id: "1",
    name: "سارة العتيبي",
    role: "منتج وتجربة مستخدم",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    id: "2",
    name: "عبدالله الشريف",
    role: "نمو ومبيعات",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    id: "3",
    name: "ليان المالكي",
    role: "بيانات وأتمتة",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    id: "4",
    name: "محمد الزهراني",
    role: "تمويل واستثمار",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    linkedin: "https://www.linkedin.com/",
  },
];

const Teachers = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-slate-50 py-16 w-full">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
         <TeachersHeader
        expertsNetwork={t("Teachers.experts_network")}
        specializedMentors={t("Teachers.specialized_mentors")}
        teamDescription={t("Teachers.team_description")}
      />

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {teachers.map((teacher) => (
            <Link
              key={teacher.id}
              href={`/home/${teacher.id}`}
              className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:-translate-y-2 hover:shadow-xl transition block"
            >
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-bold text-slate-900">
                  {teacher.name}
                </h3>
                <p className="text-primary font-semibold text-sm">{teacher.role}</p>
                <div className="flex items-center gap-3 text-slate-500">
                  {teacher.instagram && (
                    <FontAwesomeIcon icon={faInstagram} className="text-lg" />
                  )}
                  {teacher.facebook && (
                    <FontAwesomeIcon icon={faFacebookF} className="text-lg" />
                  )}
                  {teacher.linkedin && (
                    <FontAwesomeIcon icon={faLinkedinIn} className="text-lg" />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Teachers;