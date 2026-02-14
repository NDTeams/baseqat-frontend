'use client';

import { useState } from 'react';
import CoursesFilters from './CoursesFilters';
import CoursesTableBody from './CoursesTableBody';
import CourseDetailsModal from './CourseDetailsModal';
import CourseFormModal from './CourseFormModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

// تعريف الواجهة مباشرة في الملف
interface Course {
  id: number;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  type: 'online' | 'onsite';
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

const coursesData: Course[] = [
  {
    id: 1,
    title: 'تطوير تطبيقات الويب باستخدام React',
    subtitle: 'من المبتدئ إلى المتقدم',
    startDate: '2026-02-15',
    endDate: '2026-02-20',
    type: 'online',
    section: 'تقنية',
    durationDays: 5,
    durationHours: 30,
    status: 'upcoming',
    description: 'دورة شاملة لتعلم تطوير تطبيقات الويب الحديثة باستخدام React.js وأحدث التقنيات.',
    requirements: [
      'معرفة أساسية بالـ HTML و CSS',
      'فهم أساسيات JavaScript',
      'حاسوب شخصي بمواصفات جيدة'
    ],
    syllabus: [
      {
        module: 'أساسيات React',
        lessons: [
          'مقدمة عن React',
          'JSX و المكونات',
          'Props و State',
          'Hooks الأساسية'
        ]
      },
      {
        module: 'المواضيع المتقدمة',
        lessons: [
          'Context API',
          'Routing',
          'State Management',
          'API Integration'
        ]
      }
    ],
    trainers: [
      {
        name: 'أحمد القسادي',
        role: 'مدرب أول - تطوير الويب',
        image: '/trainers/ahmed.jpg'
      },
      {
        name: 'سارة محمد',
        role: 'مدربة - تجربة المستخدم',
        image: '/trainers/sara.jpg'
      }
    ]
  },
  {
    id: 2,
    title: 'تحليل البيانات باستخدام Python',
    subtitle: 'الإحصاء وتعلم الآلة',
    startDate: '2026-02-10',
    endDate: '2026-02-14',
    type: 'onsite',
    section: 'تحليل البيانات',
    durationDays: 5,
    durationHours: 40,
    status: 'active',
    description: 'تعلم تحليل البيانات وبناء نماذج تنبؤية باستخدام لغة Python وأشهر المكتبات.',
    requirements: [
      'معرفة أساسية بالبرمجة',
      'فهم أساسيات الرياضيات',
      'حاسوب بذاكرة 8GB على الأقل'
    ],
    syllabus: [
      {
        module: 'أساسيات Python للبيانات',
        lessons: [
          'NumPy و Pandas',
          'تنظيف البيانات',
          'التصور البياني',
          'الإحصاء الأساسي'
        ]
      }
    ],
    trainers: [
      {
        name: 'خالد عبدالله',
        role: 'خبير تحليل البيانات',
        image: '/trainers/khalid.jpg'
      }
    ]
  },
  {
    id: 3,
    title: 'تصميم واجهات المستخدم',
    subtitle: 'من المفاهيم إلى التطبيق',
    startDate: '2026-01-20',
    endDate: '2026-01-24',
    type: 'online',
    section: 'تصميم',
    durationDays: 5,
    durationHours: 25,
    status: 'completed',
    description: 'دورة شاملة لتعلم تصميم واجهات المستخدم الحديثة وتجربة المستخدم.',
    requirements: [
      'اهتمام بالتصميم',
      'حاسوب شخصي',
      'برامج التصميم (اختياري)'
    ],
    syllabus: [
      {
        module: 'أساسيات التصميم',
        lessons: [
          'مبادئ التصميم',
          'أدوات التصميم',
          'النماذج الأولية',
          'اختبارات المستخدم'
        ]
      }
    ],
    trainers: [
      {
        name: 'نورا علي',
        role: 'مصممة واجهات',
        image: '/trainers/nora.jpg'
      }
    ]
  },
  {
    id: 4,
    title: 'إدارة المشاريع الاحترافية',
    subtitle: 'منهجية إدارة المشاريع',
    startDate: '2026-03-01',
    endDate: '2026-03-05',
    type: 'onsite',
    section: 'إدارة',
    durationDays: 5,
    durationHours: 35,
    status: 'upcoming',
    description: 'تعلم أساليب إدارة المشاريع الحديثة وأفضل الممارسات.',
    requirements: [
      'خبرة في العمل الجماعي',
      'مهارات تنظيمية',
      'حاسوب شخصي'
    ],
    syllabus: [
      {
        module: 'أساسيات إدارة المشاريع',
        lessons: [
          'مقدمة في إدارة المشاريع',
          'تخطيط المشاريع',
          'إدارة الموارد',
          'مراقبة الجودة'
        ]
      }
    ],
    trainers: [
      {
        name: 'محمد صالح',
        role: 'مدير مشاريع معتمد',
        image: '/trainers/mohammed.jpg'
      }
    ]
  },
  {
    id: 5,
    title: 'الأمن السيبراني',
    subtitle: 'حماية الأنظمة والمعلومات',
    startDate: '2026-02-25',
    endDate: '2026-03-01',
    type: 'online',
    section: 'تقنية',
    durationDays: 5,
    durationHours: 40,
    status: 'upcoming',
    description: 'دورة شاملة في الأمن السيبراني وحماية الأنظمة.',
    requirements: [
      'معرفة أساسية بالشبكات',
      'فهم أساسيات البرمجة',
      'حاسوب بمواصفات جيدة'
    ],
    syllabus: [
      {
        module: 'أساسيات الأمن السيبراني',
        lessons: [
          'مقدمة في الأمن السيبراني',
          'تهديدات الأمن',
          'الحماية من الاختراق',
          'أمن الشبكات'
        ]
      }
    ],
    trainers: [
      {
        name: 'علي أحمد',
        role: 'خبير أمن معلومات',
        image: '/trainers/ali.jpg'
      }
    ]
  }
];

const sectionsList = ['تقنية', 'تحليل البيانات', 'تصميم', 'إدارة', 'تسويق', 'محاسبة'];

export default function CoursesTable() {
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleDeleteCourse = (courseId: number) => {
    setCourseToDelete(courseId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (courseToDelete !== null) {
      setCourses(courses.filter(course => course.id !== courseToDelete));
      setShowDeleteConfirm(false);
      setCourseToDelete(null);
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setIsEditMode(true);
    setShowAddModal(true);
  };

  const handleSaveCourse = (courseData: Omit<Course, 'id'>) => {
    if (isEditMode && editingCourseId !== null) {
      setCourses(courses.map(course => 
        course.id === editingCourseId ? { ...course, ...courseData } : course
      ));
    } else {
      const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
      setCourses([...courses, { id: newId, ...courseData }]);
    }
    
    setShowAddModal(false);
    setIsEditMode(false);
    setEditingCourseId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-end">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">جدول الدورات التدريبية</h1>
        {/* <p className="text-gray-600">استعرض جميع الدورات المتاحة والمنتهية</p> */}
      </div>

      <CoursesFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sectionsList={sectionsList}
        onAddCourse={() => {
          setIsEditMode(false);
          setShowAddModal(true);
        }}
      />

      <CoursesTableBody
        courses={courses}
        searchQuery={searchQuery}
        selectedSection={selectedSection}
        selectedType={selectedType}
        selectedStatus={selectedStatus}
        onViewDetails={handleViewDetails}
        onEditCourse={handleEditCourse}
        onDeleteCourse={handleDeleteCourse}
      />

      <CourseDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        course={selectedCourse}
      />

      <CourseFormModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setIsEditMode(false);
          setEditingCourseId(null);
        }}
        onSave={handleSaveCourse}
        isEditMode={isEditMode}
        initialData={isEditMode && editingCourseId ? 
          courses.find(c => c.id === editingCourseId) || undefined : undefined
        }
        sectionsList={sectionsList}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setCourseToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}