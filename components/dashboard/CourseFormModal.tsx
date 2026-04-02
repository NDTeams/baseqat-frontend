import { useState, ChangeEvent } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faTimes, faSave, faImage, faUpload } from "@fortawesome/free-solid-svg-icons";

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
    image: string; // يمكن أن يكون URL أو base64
    file?: File; // للملف الأصلي عند الرفع
  }[];
}

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: Omit<Course, 'id'>) => void;
  isEditMode: boolean;
  initialData?: Course;
  sectionsList: string[];
}

export default function CourseFormModal({
  isOpen,
  onClose,
  onSave,
  isEditMode,
  initialData,
  sectionsList
}: CourseFormModalProps) {
  const [formData, setFormData] = useState<Omit<Course, 'id'>>({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    type: initialData?.type || 'online',
    section: initialData?.section || '',
    durationDays: initialData?.durationDays || 5,
    durationHours: initialData?.durationHours || 30,
    status: initialData?.status || 'upcoming',
    description: initialData?.description || '',
    requirements: initialData?.requirements || [''],
    syllabus: initialData?.syllabus || [{ module: '', lessons: [''] }],
    trainers: initialData?.trainers.map(trainer => ({
      ...trainer,
      file: undefined
    })) || [{ name: '', role: '', image: '', file: undefined }]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    index: number, 
    value: string, 
    field: 'requirements' | 'trainers' | 'syllabus',
    subField?: string
  ) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      if (subField) {
        newArray[index] = { ...(newArray[index] as any), [subField]: value };
      } else {
        newArray[index] = value;
      }
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: 'requirements' | 'trainers' | 'syllabus') => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      if (field === 'requirements') {
        newArray.push('');
      } else if (field === 'trainers') {
        newArray.push({ name: '', role: '', image: '', file: undefined });
      } else if (field === 'syllabus') {
        newArray.push({ module: '', lessons: [''] });
      }
      return { ...prev, [field]: newArray };
    });
  };

  const removeArrayItem = (index: number, field: 'requirements' | 'trainers' | 'syllabus') => {
    if (index === 0 && (field === 'requirements' || field === 'syllabus')) return;
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addLesson = (moduleIndex: number) => {
    setFormData(prev => {
      const newSyllabus = [...prev.syllabus];
      newSyllabus[moduleIndex].lessons.push('');
      return { ...prev, syllabus: newSyllabus };
    });
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    if (lessonIndex === 0 && formData.syllabus[moduleIndex].lessons.length === 1) return;
    setFormData(prev => {
      const newSyllabus = [...prev.syllabus];
      newSyllabus[moduleIndex].lessons = newSyllabus[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
      return { ...prev, syllabus: newSyllabus };
    });
  };

  const handleLessonChange = (moduleIndex: number, lessonIndex: number, value: string) => {
    setFormData(prev => {
      const newSyllabus = [...prev.syllabus];
      newSyllabus[moduleIndex].lessons[lessonIndex] = value;
      return { ...prev, syllabus: newSyllabus };
    });
  };

  // دالة لمعالجة رفع الصورة
  const handleImageUpload = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPEG, PNG, GIF)');
      return;
    }

    // التحقق من حجم الملف (اختياري - مثلاً 5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. الحد الأقصى هو 5MB');
      return;
    }

    try {
      // قراءة الملف كـ base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setFormData(prev => {
          const newTrainers = [...prev.trainers];
          newTrainers[index] = {
            ...newTrainers[index],
            image: imageDataUrl,
            file: file
          };
          return { ...prev, trainers: newTrainers };
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading image file:', error);
      alert('حدث خطأ أثناء تحميل الصورة');
    }
  };

  const handleSubmit = () => {
    // يمكنك هنا معالجة الملفات قبل الحفظ إذا لزم الأمر
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dashboardBg text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {isEditMode ? 'تعديل الدورة' : 'إضافة دورة جديدة'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">المعلومات الأساسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الدورة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                  placeholder="أدخل عنوان الدورة"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان الفرعي
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                  placeholder="أدخل العنوان الفرعي"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ البدء <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ الانتهاء <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الدورة <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                >
                  <option value="online">أونلاين</option>
                  <option value="onsite">حضوري</option>
                  <option value="hybrid">أونلاين + حضوري</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  القسم <span className="text-red-500">*</span>
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                >
                  <option value="">اختر القسم</option>
                  {sectionsList.map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مدة الدورة بالأيام <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="durationDays"
                  value={formData.durationDays}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مدة الدورة بالساعات <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="durationHours"
                  value={formData.durationHours}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حالة الدورة <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                >
                  <option value="upcoming">قادمة</option>
                  <option value="active">نشطة</option>
                  <option value="completed">منتهية</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">وصف الدورة</h3>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
              placeholder="أدخل وصفاً مفصلاً للدورة..."
            />
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">متطلبات الدورة</h3>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex items-start gap-2 mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'requirements')}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                  placeholder={`المتطلب ${index + 1}`}
                />
                {formData.requirements.length > 1 && (
                  <button
                    onClick={() => removeArrayItem(index, 'requirements')}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="حذف"
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                  </button>
                )}
                {index === formData.requirements.length - 1 && (
                  <button
                    onClick={() => addArrayItem('requirements')}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    title="إضافة"
                  >
                    <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Syllabus */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">فهرس الدورة</h3>
            {formData.syllabus.map((module, moduleIndex) => (
              <div key={moduleIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">الوحدة {moduleIndex + 1}</h4>
                  {formData.syllabus.length > 1 && (
                    <button
                      onClick={() => removeArrayItem(moduleIndex, 'syllabus')}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                      حذف الوحدة
                    </button>
                  )}
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الوحدة
                  </label>
                  <input
                    type="text"
                    value={module.module}
                    onChange={(e) => handleArrayChange(moduleIndex, e.target.value, 'syllabus', 'module')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                    placeholder="أدخل اسم الوحدة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الدروس
                  </label>
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="flex items-start gap-2 mb-2">
                      <input
                        type="text"
                        value={lesson}
                        onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                        placeholder={`الدرس ${lessonIndex + 1}`}
                      />
                      {module.lessons.length > 1 && (
                        <button
                          onClick={() => removeLesson(moduleIndex, lessonIndex)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="حذف"
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                        </button>
                      )}
                      {lessonIndex === module.lessons.length - 1 && (
                        <button
                          onClick={() => addLesson(moduleIndex)}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          title="إضافة"
                        >
                          <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={() => addArrayItem('syllabus')}
              className="px-4 py-2 bg-dashboardBg text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
              إضافة وحدة جديدة
            </button>
          </div>

          {/* Trainers */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">المدربين</h3>
            {formData.trainers.map((trainer, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">المدرب {index + 1}</h4>
                  {formData.trainers.length > 1 && (
                    <button
                      onClick={() => removeArrayItem(index, 'trainers')}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                      حذف المدرب
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم المدرب <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={trainer.name}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'trainers', 'name')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                      placeholder="أدخل اسم المدرب"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوظيفة/الدور
                    </label>
                    <input
                      type="text"
                      value={trainer.role}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'trainers', 'role')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                      placeholder="أدخل الوظيفة"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      صورة المدرب
                    </label>
                    <div className="flex items-center gap-4">
                      {/* معاينة الصورة */}
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                        {trainer.image ? (
                          <img 
                            src={trainer.image} 
                            alt="صورة المدرب" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FontAwesomeIcon icon={faImage} className="text-gray-400 h-8 w-8" />
                        )}
                      </div>
                      
                      {/* زر رفع الصورة */}
                      <div>
                        <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          <FontAwesomeIcon icon={faUpload} className="mr-2 h-4 w-4" />
                          اختيار صورة
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e)}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1"> formats: JPG, PNG, GIF (max 5MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => addArrayItem('trainers')}
              className="px-4 py-2 bg-dashboardBg text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
              إضافة مدرب جديد
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.section || !formData.startDate || !formData.endDate}
            className="px-6 py-2 bg-dashboardBg text-white rounded-lg hover:bg-[#059669] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSave} className="h-4 w-4" />
            {isEditMode ? 'حفظ التعديلات' : 'إضافة الدورة'}
          </button>
        </div>
      </div>
    </div>
  );
}