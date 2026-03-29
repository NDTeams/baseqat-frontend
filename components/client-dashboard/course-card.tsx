"use client";

// import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUsers, 
  faStar, 
  faUserTie, 
  faEllipsisV, 
  faArrowLeft, 
  faCertificate 
} from "@fortawesome/free-solid-svg-icons";

interface CourseCardProps {
  image: string;
  title: string;
  instructorName: string;
  instructorColor?: string;
  instructorIcon?: any;
  students: string;
  rating: string;
  progressPercentage: number;
  lessonsDone: string;
  hoursLeft: string;
  statusText: string;
  statusColor?: string;
  mainButtonText: string;
  mainButtonIcon?: any;
  mainButtonLink: string;
}

// كومبوننت بطاقة واحدة
function CourseCard({
  image,
  title,
  instructorName,
  instructorColor = "bg-primary/10",
  instructorIcon = faUserTie,
  students,
  rating,
  progressPercentage,
  lessonsDone,
  hoursLeft,
  statusText,
  statusColor = "bg-primary",
  mainButtonText,
  mainButtonIcon = faArrowLeft,
  mainButtonLink,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group" data-aos="fade-up">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          width={600}
          height={400}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="absolute top-4 right-4">
          <span className={`text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${statusColor}`}>
            {statusText}
          </span>
        </div>

        <div className="absolute bottom-4 right-4 left-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-sm" />
              <span className="text-sm">{students}</span>
            </div>
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-sm" />
              <span className="text-sm font-semibold">{rating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-10 h-10 rounded-full ${instructorColor} flex items-center justify-center`}>
            <FontAwesomeIcon icon={instructorIcon} className="text-sm" />
          </div>
          
          <div>
            <p className="text-xs text-neutral-500">المدرب</p>
            <p className="text-sm font-semibold text-neutral-900">{instructorName}</p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2">{title}</h3>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">التقدم</span>
            <span className="text-sm font-bold text-primary">{progressPercentage}%</span>
          </div>
          <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-neutral-500">
            <span>{lessonsDone}</span>
            <span>{hoursLeft}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
          <a
            href={mainButtonLink}
            className="flex-1 bg-primary text-white text-center py-2.5 rounded-xl font-semibold hover:bg-accent transition text-sm flex items-center justify-center gap-1"
          >
            {mainButtonText}
            <FontAwesomeIcon icon={mainButtonIcon} />
          </a>

          <button className="w-10 h-10 rounded-xl border border-neutral-300 hover:bg-neutral-50 transition flex items-center justify-center">
            <FontAwesomeIcon icon={faEllipsisV} className="text-neutral-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

// كومبوننت Grid كامل لجميع الكورسات
export default function CourseGrid() {
  const courses: CourseCardProps[] = [
    {
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop&q=90",
      title: "أساسيات التحول الرقمي في المنشآت",
      instructorName: "د. محمد أحمد",
      students: "1,234 طالب",
      rating: "4.8",
      progressPercentage: 50,
      lessonsDone: "12/24 درس",
      hoursLeft: "5/10 ساعات متبقية",
      statusText: "قيد التنفيذ",
      statusColor: "bg-primary",
      mainButtonText: "متابعة التعلم",
      mainButtonIcon: faArrowLeft,
      mainButtonLink: "../course-details.html",
    },
    {
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop&q=90",
      title: "تطوير تطبيقات الويب الحديثة",
      instructorName: "د. سارة علي",
      students: "2,456 طالب",
      rating: "4.9",
      progressPercentage: 100,
      lessonsDone: "24/24 درس",
      hoursLeft: "مكتمل",
      statusText: "مكتمل",
      statusColor: "bg-green-500",
      mainButtonText: "عرض الشهادة",
      mainButtonIcon: faCertificate,
      mainButtonLink: "certificates.html",
    },
    {
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=90",
      title: "إدارة المشاريع الرقمية",
      instructorName: "د. خالد حسن",
      students: "856 طالب",
      rating: "4.7",
      progressPercentage: 30,
      lessonsDone: "6/20 درس",
      hoursLeft: "12/16 ساعة متبقية",
      statusText: "قيد التنفيذ",
      statusColor: "bg-primary",
      mainButtonText: "متابعة التعلم",
      mainButtonIcon: faArrowLeft,
      mainButtonLink: "../course-details.html",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <CourseCard key={index} {...course} />
      ))}
    </div>
  );
}
