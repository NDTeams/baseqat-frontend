import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash, faFilter } from "@fortawesome/free-solid-svg-icons";

// تعريف الواجهة مباشرة في الملف
interface Course {
  id: number;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  type: 'online' | 'onsite' | 'hybrid';
  section: string;
  durationDays: number;
  durationHours: number;
  status: 'active' | 'completed' | 'upcoming';
  description: string;
  requirements: string[];
  syllabus: {
    module: string;
    lessons: string[];
  }[];
  trainers: {
    name: string;
    role: string;
    image: string;
  }[];
}

interface CoursesTableBodyProps {
  courses: Course[];
  searchQuery: string;
  selectedSection: string;
  selectedType: string;
  selectedStatus: string;
  onViewDetails: (course: Course) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'completed': return 'bg-gray-100 text-gray-800';
    case 'upcoming': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'online': return 'bg-sky-100 text-sky-800';
    case 'onsite': return 'bg-amber-100 text-amber-800';
    case 'hybrid': return 'bg-violet-100 text-violet-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'نشطة';
    case 'completed': return 'منتهية';
    case 'upcoming': return 'قادمة';
    default: return status;
  }
};

const getTypeText = (type: string) => {
  switch (type) {
    case 'online': return 'أونلاين';
    case 'onsite': return 'حضوري';
    case 'hybrid': return 'أونلاين + حضوري';
    default: return type;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function CoursesTableBody({
  courses,
  searchQuery,
  selectedSection,
  selectedType,
  selectedStatus,
  onViewDetails,
  onEditCourse,
  onDeleteCourse
}: CoursesTableBodyProps) {
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = selectedSection === 'all' || course.section === selectedSection;
    const matchesType = selectedType === 'all' || course.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
    
    return matchesSearch && matchesSection && matchesType && matchesStatus;
  });

  return (
    <>
      

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-dashboardBg">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">العنوان</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">القسم</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">المدة</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">النوع</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">تاريخ البدء</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr 
                  key={course.id} 
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-bold text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-500">{course.subtitle}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {course.section}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{course.durationDays} أيام</div>
                    <div className="text-xs text-gray-500">{course.durationHours} ساعة</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(course.type)}`}>
                      {getTypeText(course.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(course.status)}`}>
                      {getStatusText(course.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(course.startDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(course)}
                        className="p-2 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg hover:bg-blue-200 transition-colors"
                        title="عرض التفاصيل"
                      >
                        <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditCourse(course)}
                        className="p-2 bg-yellow-100 text-yellow-600 flex items-center justify-center rounded-lg hover:bg-yellow-200 transition-colors"
                        title="تعديل"
                      >
                        <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteCourse(course.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                        title="حذف"
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faFilter} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لم يتم العثور على دورات تطابق المعايير</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        العرض: <span className="font-semibold text-[#047857]">{filteredCourses.length}</span> من <span className="font-semibold">{courses.length}</span> دورة
      </div>
    </>
  );
}