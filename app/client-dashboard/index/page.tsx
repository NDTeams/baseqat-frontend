import StudentDashboard from "@/components/client-dashboard/student-header"
import AttendanceHeader from "@/components/client-dashboard/attendance-header"
import ProgressCards from "@/components/client-dashboard/progress-cards"
import CourseCard from "@/components/client-dashboard/course-card";
import { faCalendarAlt, faFilter, faThLarge, 
  faArrowLeft  } from "@fortawesome/free-solid-svg-icons";

export default function Index(){
    return(
        <>
        <StudentDashboard />
       <AttendanceHeader
        title="نظرة عامة على تقدمك"
        description="إليك ملخص سريع لرحلتك التعليمية في منصة باسقات"
        periodLabel="هذا الأسبوع"
        filterLabel="تصفية"
        periodIcon={faCalendarAlt}
        filterIcon={faFilter}
      />
        <ProgressCards />
        <AttendanceHeader
          title="الدورات المسجلة"
          description="تابع تقدمك في جميع الدورات المسجلة"
          periodLabel="عرض الشبكة"
          filterLabel="عرض الكل"
          periodIcon={faThLarge}
          filterIcon={faArrowLeft}
        />
        <CourseCard />

        </>
    )
}