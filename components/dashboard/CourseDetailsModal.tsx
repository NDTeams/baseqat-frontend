import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

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

interface CourseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

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

export default function CourseDetailsModal({ isOpen, onClose, course }: CourseDetailsModalProps) {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dashboardBg text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{course.title}</h2>
              <p className="text-green-200 mt-1">{course.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Course Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">تاريخ البدء</div>
              <div className="font-semibold">{formatDate(course.startDate)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">تاريخ الانتهاء</div>
              <div className="font-semibold">{formatDate(course.endDate)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">النوع</div>
              <span className={`px-3 py-1 inline-block rounded-full ${getTypeColor(course.type)}`}>
                {getTypeText(course.type)}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">المدة</div>
              <div className="font-semibold">{course.durationDays} أيام / {course.durationHours} ساعة</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">القسم</div>
              <div className="font-semibold">{course.section}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">الحالة</div>
              <span className={`px-3 py-1 inline-block rounded-full ${getStatusColor(course.status)}`}>
                {getStatusText(course.status)}
              </span>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">وصف الدورة</h3>
              <p className="text-gray-700">{course.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">متطلبات الدورة</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-2 w-2 rounded-full bg-dashboardBg mt-2 ml-2"></span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">فهرس الدورة</h3>
              {course.syllabus.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                  <div className="bg-green-50 px-4 py-3">
                    <h4 className="font-semibold text-gray-800">{module.module}</h4>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <li key={lessonIndex} className="flex items-start">
                          <span className="flex-shrink-0 h-2 w-2 rounded-full bg-dashboardBg mt-2 ml-2"></span>
                          <span className="text-gray-700">{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">صفحة المدربين</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.trainers.map((trainer, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-dashboardBg rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {trainer.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{trainer.name}</h4>
                      <p className="text-sm text-gray-600">{trainer.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}