'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faPlus,
  faEdit,
  faTrash,
  faCheck,
  faTimes,
  faSpinner,
  faTriangleExclamation,
  faGraduationCap,
  faLayerGroup,
  faPlayCircle,
  faListCheck,
  faChalkboardTeacher,
  faUsers,
  faChevronDown,
  faChevronUp,
  faFileAlt,
  faVolumeUp,
  faImage,
  faQuestionCircle,
  faChalkboard,
  faStar,
  faInfoCircle,
  faSave,
  faCloudUploadAlt,
  faTrashAlt,
  faPlay,
  faCamera,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import {
  CoursesAdminService,
  CourseSectionService,
  CourseLessonService,
  CourseRequirementService,
  CourseInstructorService,
  CourseEnrollmentService,
  CourseReviewService,
  CourseCategoryAdminService,
  InstructorAdminService,
  type Course,
  type CourseSection,
  type CourseLesson,
  type CourseRequirement,
  type CourseInstructor,
  type CourseEnrollment,
  type CourseReview,
  type CourseCategory,
  type Instructor,
} from '@/services/courses/page';
import { getFileUrl } from '@/lib/config';

// ===========================
// Helpers
// ===========================
function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
  return match?.[1] || '';
}

const PLATFORM_LOGO = '/site/logo.png';

// ===========================
// Types
// ===========================
type TabKey = 'overview' | 'sections' | 'requirements' | 'instructors' | 'reviews' | 'enrollments';

interface StatusNotif {
  open: boolean;
  type: 'success' | 'error';
  message: string;
}

// ===========================
// Toast
// ===========================
function StatusToast({ notif, onClose }: { notif: StatusNotif; onClose: () => void }) {
  useEffect(() => {
    if (notif.open) {
      const t = setTimeout(onClose, 3500);
      return () => clearTimeout(t);
    }
  }, [notif.open, onClose]);

  if (!notif.open) return null;
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl text-white font-semibold text-sm transition-all ${
        notif.type === 'success' ? 'bg-blue-600' : 'bg-red-500'
      }`}
    >
      <FontAwesomeIcon icon={notif.type === 'success' ? faCheck : faTriangleExclamation} />
      {notif.message}
      <button onClick={onClose} className="mr-2 opacity-70 hover:opacity-100">
        <FontAwesomeIcon icon={faTimes} className="text-xs" />
      </button>
    </div>
  );
}

// ===========================
// Inline Edit Modal
// ===========================
function InlineModal({
  isOpen,
  title,
  loading,
  onClose,
  onSave,
  children,
}: {
  isOpen: boolean;
  title: string;
  loading: boolean;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" dir="rtl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button
            onClick={onSave}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faCheck} />}
            حفظ
          </button>
          <button onClick={onClose} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================
// Overview Tab (نظرة عامة)
// ===========================
function OverviewTab({ course, courseId, notif, onCourseUpdated }: {
  course: Course;
  courseId: number;
  notif: (t: 'success' | 'error', m: string) => void;
  onCourseUpdated: (c: Course) => void;
}) {
  const [form, setForm] = useState({
    title: course.title || '',
    subtitle: course.subtitle || '',
    description: course.description || '',
    price: course.price ?? 0,
    level: course.level ?? 1,
    language: course.language || 'العربية',
    hasCertificate: course.hasCertificate ?? false,
    courseType: course.courseType ?? 0,
    courseDays: course.courseDays ?? 31,
    startDate: course.startDate?.split('T')[0] || '',
    endDate: course.endDate?.split('T')[0] || '',
    location: course.location || '',
    platformName: course.platformName || '',
    platformUrl: course.platformUrl || '',
    status: course.status ?? 1,
    isActive: course.isActive ?? true,
    durationInDays: course.durationInDays ?? 0,
    totalDurationInHours: course.totalDurationInHours ?? 0,
    promoVideoUrl: course.promoVideoUrl || '',
    courseCategoryId: course.courseCategoryId ?? 0,
    instructorId: course.instructorId ?? 0,
  });

  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [saving, setSaving] = useState(false);

  // Thumbnail upload
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    course.thumbnailUrl ? getFileUrl(course.thumbnailUrl) : ''
  );
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  useEffect(() => {
    Promise.all([
      CourseCategoryAdminService.getAll(),
      InstructorAdminService.getAll(),
    ]).then(([catRes, instRes]) => {
      if (catRes.succeeded) setCategories(catRes.data ?? []);
      if (instRes.succeeded) setInstructors(instRes.data ?? []);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await CoursesAdminService.update(courseId, form);
      if (res.succeeded) {
        notif('success', 'تم حفظ التعديلات بنجاح');
        onCourseUpdated(res.data);
      } else {
        notif('error', res.message || 'فشل الحفظ');
      }
    } catch (err: any) {
      notif('error', err.message || 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Preview
    const reader = new FileReader();
    reader.onload = () => setThumbnailPreview(reader.result as string);
    reader.readAsDataURL(file);
    // Upload
    setUploadingThumbnail(true);
    try {
      const res = await CoursesAdminService.uploadThumbnail(courseId, file);
      if (res.succeeded) {
        notif('success', 'تم رفع الصورة بنجاح');
        onCourseUpdated({ ...course, thumbnailUrl: (res.data as any)?.imageUrl || course.thumbnailUrl });
      } else {
        notif('error', res.message || 'فشل رفع الصورة');
      }
    } catch (err: any) {
      notif('error', err.message || 'حدث خطأ أثناء الرفع');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4">المعلومات الأساسية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>عنوان الدورة <span className="text-red-500">*</span></label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>العنوان الفرعي</label>
            <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>القسم <span className="text-red-500">*</span></label>
            <select value={form.courseCategoryId} onChange={(e) => setForm({ ...form, courseCategoryId: Number(e.target.value) })} className={inputClass}>
              <option value={0} disabled>اختر القسم</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>المدرب الرئيسي</label>
            <select value={form.instructorId} onChange={(e) => setForm({ ...form, instructorId: Number(e.target.value) })} className={inputClass}>
              <option value={0}>بدون مدرب</option>
              {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4">وصف الدورة</h3>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} placeholder="أدخل وصفاً مفصلاً للدورة..." className={`${inputClass} resize-y`} />
      </div>

      {/* Pricing & Level */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4">التسعير والمستوى</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>السعر (ر.س)</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} min="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>المستوى</label>
            <select value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} className={inputClass}>
              <option value={1}>مبتدئ</option>
              <option value={2}>متوسط</option>
              <option value={3}>متقدم</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>اللغة</label>
            <input type="text" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Type & Location */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4">النوع والموقع</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>نوع الدورة</label>
            <select value={form.courseType} onChange={(e) => setForm({ ...form, courseType: Number(e.target.value) })} className={inputClass}>
              <option value={0}>حضوري</option>
              <option value={1}>عن بعد</option>
              <option value={2}>هجين</option>
            </select>
          </div>
          {(form.courseType === 0 || form.courseType === 2) && (
            <div className="md:col-span-2">
              <label className={labelClass}>الموقع</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="مثال: الرياض - حي العليا" className={inputClass} />
            </div>
          )}
          {(form.courseType === 1 || form.courseType === 2) && (
            <>
              <div>
                <label className={labelClass}>اسم المنصة</label>
                <input type="text" value={form.platformName} onChange={(e) => setForm({ ...form, platformName: e.target.value })} placeholder="Zoom, Teams..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>رابط المنصة</label>
                <input type="url" value={form.platformUrl} onChange={(e) => setForm({ ...form, platformUrl: e.target.value })} placeholder="https://..." className={inputClass} dir="ltr" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Duration & Dates */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4">المدة والمواعيد</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>تاريخ البداية</label>
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>تاريخ النهاية</label>
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>المدة بالأيام</label>
            <input type="number" value={form.durationInDays} onChange={(e) => setForm({ ...form, durationInDays: Number(e.target.value) })} min="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>إجمالي الساعات</label>
            <input type="number" value={form.totalDurationInHours} onChange={(e) => setForm({ ...form, totalDurationInHours: Number(e.target.value) })} min="0" className={inputClass} />
          </div>
        </div>
        <CourseDaysPicker value={form.courseDays} onChange={(v) => setForm({ ...form, courseDays: v })} labelClass={labelClass} />
      </div>

      {/* Status & Visibility */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4">الحالة والنشر</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>حالة الدورة</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })} className={inputClass}>
              <option value={1}>مسودة</option>
              <option value={2}>منشورة</option>
              <option value={3}>مؤرشفة</option>
            </select>
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-700">مفعّلة (ظاهرة)</span>
            </label>
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.hasCertificate} onChange={(e) => setForm({ ...form, hasCertificate: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-700">شهادة إتمام</span>
            </label>
          </div>
        </div>
      </div>

      {/* Media: Thumbnail + Promo Video */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faCamera} className="text-blue-500" />
          الوسائط
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thumbnail Upload */}
          <div>
            <label className={labelClass}>صورة الدورة (Thumbnail)</label>
            <div className="relative group">
              {thumbnailPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img src={thumbnailPreview} alt="صورة الدورة" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="cursor-pointer w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-blue-600 hover:bg-white transition-colors">
                      <FontAwesomeIcon icon={faEdit} className="text-sm" />
                      <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                    </label>
                  </div>
                  {uploadingThumbnail && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <FontAwesomeIcon icon={faSpinner} className="text-2xl text-blue-600 animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
                  {uploadingThumbnail ? (
                    <FontAwesomeIcon icon={faSpinner} className="text-2xl text-blue-600 animate-spin" />
                  ) : (
                    <>
                      <img src="/site/logo.png" alt="شعار المنصة" className="w-16 h-16 object-contain opacity-30 mb-2" />
                      <FontAwesomeIcon icon={faCloudUploadAlt} className="text-2xl text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 font-medium">اسحب الصورة أو انقر للرفع</span>
                      <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Promo Video URL */}
          <div>
            <label className={labelClass}>فيديو الشرح / الفيديو الترويجي</label>
            <input type="url" value={form.promoVideoUrl} onChange={(e) => setForm({ ...form, promoVideoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." className={`${inputClass} mb-3`} dir="ltr" />
            {form.promoVideoUrl ? (
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-900">
                {form.promoVideoUrl.includes('youtube.com') || form.promoVideoUrl.includes('youtu.be') ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(form.promoVideoUrl)}`}
                    className="w-full h-40"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                  />
                ) : form.promoVideoUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={form.promoVideoUrl} controls className="w-full h-40 object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-white/60">
                    <FontAwesomeIcon icon={faVideo} className="text-2xl mb-2" />
                    <a href={form.promoVideoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">فتح رابط الفيديو</a>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl text-gray-400">
                <FontAwesomeIcon icon={faVideo} className="text-2xl mb-2" />
                <span className="text-sm">أضف رابط الفيديو الترويجي</span>
                <span className="text-xs mt-1">YouTube, MP4, أو أي رابط فيديو</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
        >
          {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faSave} />}
          حفظ التعديلات
        </button>
      </div>
    </div>
  );
}

// ===========================
// Sections & Lessons Tab
// ===========================
function SectionsTab({ courseId, notif }: { courseId: number; notif: (t: 'success' | 'error', m: string) => void }) {
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [lessons, setLessons] = useState<Record<number, CourseLesson[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  // Section modal
  const [sectionModal, setSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState<CourseSection | null>(null);
  const [sectionForm, setSectionForm] = useState({ title: '', description: '', orderIndex: 0 });
  const [sectionLoading, setSectionLoading] = useState(false);

  // Lesson modal
  const [lessonModal, setLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);
  const [lessonSectionId, setLessonSectionId] = useState<number>(0);
  const [lessonForm, setLessonForm] = useState({ title: '', description: '', videoUrl: '', duration: 0, orderIndex: 0, lessonType: 1, isPreview: false });
  const [lessonLoading, setLessonLoading] = useState(false);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CourseSectionService.getAllPaged({ pageNumber: 1, pageSize: 100 }, { courseId });
      if (res.succeeded) {
        setSections(res.data ?? []);
      }
    } catch { } finally { setLoading(false); }
  }, [courseId]);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const fetchLessons = async (sectionId: number) => {
    try {
      const res = await CourseLessonService.getBySection(sectionId);
      if (res.succeeded) {
        setLessons(prev => ({ ...prev, [sectionId]: res.data ?? [] }));
      }
    } catch { }
  };

  const toggleSection = (id: number) => {
    const next = new Set(expandedSections);
    if (next.has(id)) { next.delete(id); } else { next.add(id); fetchLessons(id); }
    setExpandedSections(next);
  };

  // Section CRUD
  const openAddSection = () => {
    setEditingSection(null);
    setSectionForm({ title: '', description: '', orderIndex: sections.length + 1 });
    setSectionModal(true);
  };

  const openEditSection = (s: CourseSection) => {
    setEditingSection(s);
    setSectionForm({ title: s.title, description: s.description || '', orderIndex: s.orderIndex });
    setSectionModal(true);
  };

  const saveSection = async () => {
    setSectionLoading(true);
    try {
      if (editingSection) {
        const res = await CourseSectionService.update(editingSection.id, sectionForm);
        if (res.succeeded) { notif('success', 'تم تعديل القسم'); setSectionModal(false); fetchSections(); }
        else notif('error', res.message || 'فشل التعديل');
      } else {
        const res = await CourseSectionService.add({ ...sectionForm, courseId });
        if (res.succeeded) { notif('success', 'تم إضافة القسم'); setSectionModal(false); fetchSections(); }
        else notif('error', res.message || 'فشل الإضافة');
      }
    } catch (err: any) { notif('error', err.message || 'حدث خطأ'); }
    finally { setSectionLoading(false); }
  };

  const deleteSection = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    try {
      const res = await CourseSectionService.delete(id);
      if (res.succeeded) { notif('success', 'تم حذف القسم'); fetchSections(); }
      else notif('error', res.message || 'فشل الحذف');
    } catch (err: any) { notif('error', err.message || 'حدث خطأ'); }
  };

  // Lesson CRUD
  const openAddLesson = (sectionId: number) => {
    setEditingLesson(null);
    setLessonSectionId(sectionId);
    setLessonForm({ title: '', description: '', videoUrl: '', duration: 0, orderIndex: (lessons[sectionId]?.length || 0) + 1, lessonType: 0, isPreview: false });
    setLessonModal(true);
  };

  const openEditLesson = (l: CourseLesson) => {
    setEditingLesson(l);
    setLessonSectionId(l.courseSectionId);
    setLessonForm({ title: l.title, description: l.description || '', videoUrl: l.videoUrl || '', duration: l.duration || 0, orderIndex: l.orderIndex, lessonType: l.lessonType, isPreview: l.isPreview });
    setLessonModal(true);
  };

  const saveLesson = async () => {
    setLessonLoading(true);
    try {
      if (editingLesson) {
        const res = await CourseLessonService.update(editingLesson.id, lessonForm);
        if (res.succeeded) { notif('success', 'تم تعديل الدرس'); setLessonModal(false); fetchLessons(lessonSectionId); }
        else notif('error', res.message || 'فشل التعديل');
      } else {
        const res = await CourseLessonService.add({ ...lessonForm, courseSectionId: lessonSectionId });
        if (res.succeeded) { notif('success', 'تم إضافة الدرس'); setLessonModal(false); fetchLessons(lessonSectionId); }
        else notif('error', res.message || 'فشل الإضافة');
      }
    } catch (err: any) { notif('error', err.message || 'حدث خطأ'); }
    finally { setLessonLoading(false); }
  };

  const deleteLesson = async (id: number, sectionId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;
    try {
      const res = await CourseLessonService.delete(id);
      if (res.succeeded) { notif('success', 'تم حذف الدرس'); fetchLessons(sectionId); }
      else notif('error', res.message || 'فشل الحذف');
    } catch (err: any) { notif('error', err.message || 'حدث خطأ'); }
  };

  if (loading) return <div className="flex justify-center py-12"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-blue-600 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">محتوى الدورة</h3>
        <button onClick={openAddSection} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
          <FontAwesomeIcon icon={faPlus} /> إضافة قسم
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FontAwesomeIcon icon={faLayerGroup} className="text-4xl mb-3" />
          <p>لا توجد أقسام بعد</p>
        </div>
      ) : (
        sections.sort((a, b) => a.orderIndex - b.orderIndex).map((section) => (
          <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-3.5 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={expandedSections.has(section.id) ? faChevronUp : faChevronDown} className="text-gray-400 text-sm" />
                <span className="font-semibold text-gray-800">{section.title}</span>
                <span className="text-xs text-gray-400">({section.lessonsCount ?? lessons[section.id]?.length ?? 0} درس)</span>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => openEditSection(section)} className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center text-xs">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => deleteSection(section.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center text-xs">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>

            {expandedSections.has(section.id) && (
              <div className="p-4 space-y-2 border-t border-gray-100">
                {(lessons[section.id] ?? []).sort((a, b) => a.orderIndex - b.orderIndex).map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between px-4 py-2.5 bg-white border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={({ 0: faFileAlt, 1: faPlayCircle, 2: faVolumeUp, 3: faImage, 4: faQuestionCircle, 5: faChalkboard } as Record<number, any>)[lesson.lessonType] || faPlayCircle} className="text-blue-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-800">{lesson.title}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">{lesson.lessonTypeName || ({ 0: 'نص', 1: 'فيديو', 2: 'صوت', 3: 'صورة', 4: 'أسئلة', 5: 'شرح' }[lesson.lessonType] || 'غير محدد')}</span>
                          {lesson.duration ? <span className="text-xs text-gray-400">• {lesson.duration} دقيقة</span> : null}
                          {lesson.isPreview && <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">معاينة</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEditLesson(lesson)} className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center text-xs">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => deleteLesson(lesson.id, section.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center text-xs">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={() => openAddLesson(section.id)} className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-300 rounded-lg transition-colors text-sm">
                  <FontAwesomeIcon icon={faPlus} /> إضافة درس
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {/* Section Modal */}
      <InlineModal isOpen={sectionModal} title={editingSection ? 'تعديل القسم' : 'إضافة قسم جديد'} loading={sectionLoading} onClose={() => setSectionModal(false)} onSave={saveSection}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">عنوان القسم <span className="text-red-500">*</span></label>
          <input type="text" value={sectionForm.title} onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })} required placeholder="مثال: مقدمة في البرمجة" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">الوصف</label>
          <textarea value={sectionForm.description} onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })} rows={2} placeholder="وصف اختياري للقسم" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">الترتيب</label>
          <input type="number" value={sectionForm.orderIndex} onChange={(e) => setSectionForm({ ...sectionForm, orderIndex: Number(e.target.value) })} min="0" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
        </div>
      </InlineModal>

      {/* Lesson Modal */}
      <InlineModal isOpen={lessonModal} title={editingLesson ? 'تعديل الدرس' : 'إضافة درس جديد'} loading={lessonLoading} onClose={() => setLessonModal(false)} onSave={saveLesson}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">عنوان الدرس <span className="text-red-500">*</span></label>
          <input type="text" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required placeholder="مثال: ما هو HTML؟" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">الوصف</label>
          <textarea value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">نوع الدرس</label>
            <select value={lessonForm.lessonType} onChange={(e) => setLessonForm({ ...lessonForm, lessonType: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
              <option value={0}>نص / كتابة</option>
              <option value={1}>فيديو</option>
              <option value={2}>صوت</option>
              <option value={3}>صورة</option>
              <option value={4}>أسئلة</option>
              <option value={5}>شرح</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">المدة (دقيقة)</label>
            <input type="number" value={lessonForm.duration} onChange={(e) => setLessonForm({ ...lessonForm, duration: Number(e.target.value) })} min="0" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">رابط الفيديو</label>
          <input type="url" value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" dir="ltr" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">الترتيب</label>
            <input type="number" value={lessonForm.orderIndex} onChange={(e) => setLessonForm({ ...lessonForm, orderIndex: Number(e.target.value) })} min="0" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={lessonForm.isPreview} onChange={(e) => setLessonForm({ ...lessonForm, isPreview: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-700">معاينة مجانية</span>
            </label>
          </div>
        </div>
      </InlineModal>
    </div>
  );
}

// ===========================
// Requirements Tab
// ===========================
function RequirementsTab({ courseId, notif }: { courseId: number; notif: (t: 'success' | 'error', m: string) => void }) {
  const [requirements, setRequirements] = useState<CourseRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<CourseRequirement | null>(null);
  const [text, setText] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CourseRequirementService.getByCourse(courseId);
      if (res.succeeded) setRequirements(res.data ?? []);
    } catch { } finally { setLoading(false); }
  }, [courseId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setEditing(null); setText(''); setModal(true); };
  const openEdit = (r: CourseRequirement) => { setEditing(r); setText(r.text); setModal(true); };

  const save = async () => {
    setSaveLoading(true);
    try {
      if (editing) {
        const res = await CourseRequirementService.update(editing.id, { text });
        if (res.succeeded) { notif('success', 'تم التعديل'); setModal(false); fetchData(); }
        else notif('error', res.message || 'فشل');
      } else {
        const res = await CourseRequirementService.add({ text, courseId });
        if (res.succeeded) { notif('success', 'تم الإضافة'); setModal(false); fetchData(); }
        else notif('error', res.message || 'فشل');
      }
    } catch (err: any) { notif('error', err.message || 'حدث خطأ'); }
    finally { setSaveLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المتطلب؟')) return;
    try {
      const res = await CourseRequirementService.delete(id);
      if (res.succeeded) { notif('success', 'تم الحذف'); fetchData(); }
      else notif('error', res.message || 'فشل الحذف');
    } catch (err: any) { notif('error', err.message || 'حدث خطأ'); }
  };

  if (loading) return <div className="flex justify-center py-12"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-blue-600 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">متطلبات الدورة</h3>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
          <FontAwesomeIcon icon={faPlus} /> إضافة متطلب
        </button>
      </div>

      {requirements.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FontAwesomeIcon icon={faListCheck} className="text-4xl mb-3" />
          <p>لا توجد متطلبات بعد</p>
        </div>
      ) : (
        <div className="space-y-2">
          {requirements.map((req) => (
            <div key={req.id} className="flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                <span className="text-sm text-gray-800">{req.text}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => openEdit(req)} className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center text-xs">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(req.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center text-xs">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <InlineModal isOpen={modal} title={editing ? 'تعديل المتطلب' : 'إضافة متطلب جديد'} loading={saveLoading} onClose={() => setModal(false)} onSave={save}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">نص المتطلب <span className="text-red-500">*</span></label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} required placeholder="مثال: معرفة أساسيات الحاسب" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
        </div>
      </InlineModal>
    </div>
  );
}

// ===========================
// Instructors Tab
// ===========================
function InstructorsTab({ courseId, notif }: { courseId: number; notif: (t: 'success' | 'error', m: string) => void }) {
  const [courseInstructors, setCourseInstructors] = useState<CourseInstructor[]>([]);
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState<number>(0);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ciRes, instRes] = await Promise.all([
        CourseInstructorService.getByCourse(courseId),
        InstructorAdminService.getAll(),
      ]);
      if (ciRes.succeeded) setCourseInstructors(ciRes.data ?? []);
      if (instRes.succeeded) setAllInstructors(instRes.data ?? []);
    } catch { } finally { setLoading(false); }
  }, [courseId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const assignedIds = new Set(courseInstructors.map(ci => ci.instructorId));
  const availableInstructors = allInstructors.filter(i => !assignedIds.has(i.id));

  const handleAdd = async () => {
    if (!selectedInstructorId) return;
    setSaveLoading(true);
    try {
      const res = await CourseInstructorService.add({ courseId, instructorId: selectedInstructorId });
      if (res.succeeded) { notif('success', 'تم إضافة المدرب'); setAddModal(false); setSelectedInstructorId(0); fetchData(); }
      else notif('error', res.message || 'فشل');
    } catch (err: any) { notif('error', err.message || 'حدث خطأ'); }
    finally { setSaveLoading(false); }
  };

  const handleRemove = async (id: number) => {
    if (!confirm('هل أنت متأكد من إزالة هذا المدرب؟')) return;
    try {
      const res = await CourseInstructorService.delete(id);
      if (res.succeeded) { notif('success', 'تم إزالة المدرب'); fetchData(); }
      else notif('error', res.message || 'فشل');
    } catch (err: any) { notif('error', err.message || 'حدث خطأ'); }
  };

  if (loading) return <div className="flex justify-center py-12"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-blue-600 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">مدربو الدورة</h3>
        <button onClick={() => setAddModal(true)} disabled={availableInstructors.length === 0} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50">
          <FontAwesomeIcon icon={faPlus} /> إضافة مدرب
        </button>
      </div>

      {courseInstructors.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FontAwesomeIcon icon={faChalkboardTeacher} className="text-4xl mb-3" />
          <p>لم يتم تعيين مدربين بعد</p>
        </div>
      ) : (
        <div className="space-y-2">
          {courseInstructors.map((ci) => (
            <div key={ci.id} className="flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {(ci.instructorName || '؟')[0]}
                </div>
                <span className="font-medium text-gray-800">{ci.instructorName || `مدرب #${ci.instructorId}`}</span>
              </div>
              <button onClick={() => handleRemove(ci.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center text-xs">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
      )}

      <InlineModal isOpen={addModal} title="إضافة مدرب للدورة" loading={saveLoading} onClose={() => setAddModal(false)} onSave={handleAdd}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">اختر المدرب</label>
          <select value={selectedInstructorId} onChange={(e) => setSelectedInstructorId(Number(e.target.value))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
            <option value={0} disabled>اختر مدرب...</option>
            {availableInstructors.map((inst) => (
              <option key={inst.id} value={inst.id}>{inst.name}</option>
            ))}
          </select>
        </div>
      </InlineModal>
    </div>
  );
}

// ===========================
// Reviews Tab (التقييمات)
// ===========================
function ReviewsTab({ courseId, notif }: { courseId: number; notif: (t: 'success' | 'error', m: string) => void }) {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CourseReviewService.getByCourse(courseId);
      if (res.succeeded) setReviews(res.data ?? []);
    } catch { } finally { setLoading(false); }
  }, [courseId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    try {
      const res = await CourseReviewService.delete(id);
      if (res.succeeded) { notif('success', 'تم حذف التقييم'); fetchData(); }
      else notif('error', res.message || 'فشل الحذف');
    } catch (err: any) { notif('error', err.message || 'حدث خطأ'); }
  };

  if (loading) return <div className="flex justify-center py-12"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-blue-600 animate-spin" /></div>;

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">التقييمات ({reviews.length})</h3>
      </div>

      {/* Average Rating */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-600">{avgRating.toFixed(1)}</p>
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <FontAwesomeIcon key={s} icon={faStar} className={`text-sm ${s <= Math.round(avgRating) ? 'text-amber-400' : 'text-gray-300'}`} />
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p>متوسط التقييم من <span className="font-semibold">{reviews.length}</span> تقييم</p>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FontAwesomeIcon icon={faStar} className="text-4xl mb-3" />
          <p>لا توجد تقييمات بعد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="flex items-start justify-between px-4 py-4 bg-white border border-gray-100 rounded-xl">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                  {(review.userName || '؟')[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800 text-sm">{review.userName || `مستخدم #${review.userId}`}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FontAwesomeIcon key={s} icon={faStar} className={`text-xs ${s <= review.rating ? 'text-amber-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              </div>
              <button onClick={() => handleDelete(review.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center text-xs flex-shrink-0 mr-2">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===========================
// Enrollments Tab
// ===========================
function EnrollmentsTab({ courseId, notif }: { courseId: number; notif: (t: 'success' | 'error', m: string) => void }) {
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CourseEnrollmentService.getByCourse(courseId);
      if (res.succeeded) setEnrollments(res.data ?? []);
    } catch { } finally { setLoading(false); }
  }, [courseId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا التسجيل؟')) return;
    try {
      const res = await CourseEnrollmentService.delete(id);
      if (res.succeeded) { notif('success', 'تم الحذف'); fetchData(); }
      else notif('error', res.message || 'فشل');
    } catch (err: any) { notif('error', err.message || 'حدث خطأ'); }
  };

  if (loading) return <div className="flex justify-center py-12"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-blue-600 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">المسجلين ({enrollments.length})</h3>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FontAwesomeIcon icon={faUsers} className="text-4xl mb-3" />
          <p>لا يوجد مسجلين بعد</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-right font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">اسم المستخدم</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">تاريخ التسجيل</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {enrollments.map((enr, i) => (
                <tr key={enr.id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{enr.userName || enr.userId}</td>
                  <td className="px-4 py-3 text-gray-500">{enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString('ar-SA') : '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(enr.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center text-xs">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ===========================
// Main Page
// ===========================
// ===========================
// Course Days Picker (أيام الدورة)
// ===========================
const WEEK_DAYS = [
  { value: 1, label: 'الأحد' },
  { value: 2, label: 'الاثنين' },
  { value: 4, label: 'الثلاثاء' },
  { value: 8, label: 'الأربعاء' },
  { value: 16, label: 'الخميس' },
  { value: 32, label: 'الجمعة' },
  { value: 64, label: 'السبت' },
];

function CourseDaysPicker({ value, onChange, labelClass }: { value: number; onChange: (v: number) => void; labelClass: string }) {
  const toggleDay = (dayValue: number) => {
    onChange(value ^ dayValue); // XOR to toggle bit
  };

  return (
    <div>
      <label className={labelClass}>أيام الدورة</label>
      <div className="flex flex-wrap gap-2 mt-1">
        {WEEK_DAYS.map((day) => {
          const isSelected = (value & day.value) !== 0;
          return (
            <button
              key={day.value}
              type="button"
              onClick={() => toggleDay(day.value)}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {day.label}
            </button>
          );
        })}
      </div>
      {value > 0 && (
        <p className="text-xs text-gray-400 mt-1.5">
          الأيام المختارة: {WEEK_DAYS.filter(d => (value & d.value) !== 0).map(d => d.label).join('، ')}
        </p>
      )}
    </div>
  );
}

// ===========================
// New Course Form (إضافة دورة جديدة)
// ===========================
function NewCourseForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState<StatusNotif>({ open: false, type: 'success', message: '' });

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: 0,
    level: 1,
    language: 'العربية',
    hasCertificate: false,
    courseType: 0,
    courseDays: 31, // الأحد-الخميس (1+2+4+8+16)
    startDate: '',
    endDate: '',
    location: '',
    platformName: '',
    platformUrl: '',
    status: 0,
    isActive: true,
    durationInDays: 0,
    totalDurationInHours: 0,
    promoVideoUrl: '',
    courseCategoryId: 0,
    instructorId: 0,
  });

  useEffect(() => {
    Promise.all([
      CourseCategoryAdminService.getAll(),
      InstructorAdminService.getAll(),
    ]).then(([catRes, instRes]) => {
      if (catRes.succeeded) setCategories(catRes.data ?? []);
      if (instRes.succeeded) setInstructors(instRes.data ?? []);
    });
  }, []);

  const handleCreate = async () => {
    if (!form.title.trim()) {
      setNotif({ open: true, type: 'error', message: 'عنوان الدورة مطلوب' });
      return;
    }
    if (!form.courseCategoryId) {
      setNotif({ open: true, type: 'error', message: 'اختر قسم الدورة' });
      return;
    }
    setSaving(true);
    try {
      const res = await CoursesAdminService.add(form);
      if (res.succeeded) {
        setNotif({ open: true, type: 'success', message: 'تم إنشاء الدورة بنجاح' });
        setTimeout(() => router.push(`/courses-table/${res.data.id}`), 1000);
      } else {
        setNotif({ open: true, type: 'error', message: res.message || 'فشل الإنشاء' });
      }
    } catch (err: any) {
      setNotif({ open: true, type: 'error', message: err.message || 'حدث خطأ' });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="p-4 sm:p-6" dir="rtl">
      <button onClick={() => router.push('/courses-table')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-4 transition-colors">
        <FontAwesomeIcon icon={faArrowRight} />
        العودة لقائمة الدورات
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
          <FontAwesomeIcon icon={faPlus} className="text-blue-600 text-lg" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">إضافة دورة جديدة</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4">المعلومات الأساسية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>عنوان الدورة <span className="text-red-500">*</span></label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="أدخل عنوان الدورة" className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>العنوان الفرعي</label>
              <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="عنوان فرعي (اختياري)" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>القسم <span className="text-red-500">*</span></label>
              <select value={form.courseCategoryId} onChange={(e) => setForm({ ...form, courseCategoryId: Number(e.target.value) })} className={inputClass}>
                <option value={0} disabled>اختر القسم</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>المدرب الرئيسي</label>
              <select value={form.instructorId} onChange={(e) => setForm({ ...form, instructorId: Number(e.target.value) })} className={inputClass}>
                <option value={0}>بدون مدرب</option>
                {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4">وصف الدورة</h3>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="أدخل وصفاً مفصلاً للدورة..." className={`${inputClass} resize-y`} />
        </div>

        {/* Pricing & Level */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4">التسعير والمستوى</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>السعر (ر.س)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} min="0" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>المستوى</label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} className={inputClass}>
                <option value={1}>مبتدئ</option>
                <option value={2}>متوسط</option>
                <option value={3}>متقدم</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>اللغة</label>
              <input type="text" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Type & Location */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4">النوع والموقع</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>نوع الدورة</label>
              <select value={form.courseType} onChange={(e) => setForm({ ...form, courseType: Number(e.target.value) })} className={inputClass}>
                <option value={0}>حضوري</option>
                <option value={1}>أونلاين</option>
                <option value={2}>أونلاين + حضوري</option>
              </select>
            </div>
            {(form.courseType === 0 || form.courseType === 2) && (
              <div className="md:col-span-2">
                <label className={labelClass}>الموقع</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="مثال: الرياض - حي العليا" className={inputClass} />
              </div>
            )}
            {(form.courseType === 1 || form.courseType === 2) && (
              <>
                <div>
                  <label className={labelClass}>اسم المنصة</label>
                  <input type="text" value={form.platformName} onChange={(e) => setForm({ ...form, platformName: e.target.value })} placeholder="Zoom, Teams..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>رابط المنصة</label>
                  <input type="url" value={form.platformUrl} onChange={(e) => setForm({ ...form, platformUrl: e.target.value })} placeholder="https://..." className={inputClass} dir="ltr" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Duration & Dates */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4">المدة والمواعيد</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>تاريخ البداية</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>تاريخ النهاية</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>المدة بالأيام</label>
              <input type="number" value={form.durationInDays} onChange={(e) => setForm({ ...form, durationInDays: Number(e.target.value) })} min="0" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>إجمالي الساعات</label>
              <input type="number" value={form.totalDurationInHours} onChange={(e) => setForm({ ...form, totalDurationInHours: Number(e.target.value) })} min="0" className={inputClass} />
            </div>
          </div>
          <CourseDaysPicker value={form.courseDays} onChange={(v) => setForm({ ...form, courseDays: v })} labelClass={labelClass} />
        </div>

        {/* Promo Video URL */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faVideo} className="text-blue-500" />
            الوسائط
          </h3>
          <div>
            <label className={labelClass}>رابط الفيديو الترويجي</label>
            <input type="url" value={form.promoVideoUrl} onChange={(e) => setForm({ ...form, promoVideoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." className={inputClass} dir="ltr" />
            <p className="text-xs text-gray-400 mt-1">يمكنك رفع صورة الدورة بعد الإنشاء من صفحة التعديل</p>
          </div>
        </div>

        {/* Options */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4">خيارات إضافية</h3>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-700">مفعّلة (ظاهرة)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.hasCertificate} onChange={(e) => setForm({ ...form, hasCertificate: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-700">شهادة إتمام</span>
            </label>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            onClick={handleCreate}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faPlus} />}
            إنشاء الدورة
          </button>
        </div>
      </div>

      <StatusToast notif={notif} onClose={() => setNotif({ ...notif, open: false })} />
    </div>
  );
}

// ===========================
// Main Page
// ===========================
export default function CourseDetailAdminPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';
  const courseId = isNew ? 0 : Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [notif, setNotif] = useState<StatusNotif>({ open: false, type: 'success', message: '' });

  const showNotif = (type: 'success' | 'error', message: string) =>
    setNotif({ open: true, type, message });

  useEffect(() => {
    if (isNew || !courseId) return;
    setLoading(true);
    CoursesAdminService.getById(courseId)
      .then((res) => {
        if (res.succeeded) setCourse(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId, isNew]);

  // Show create form for new courses
  if (isNew) {
    return <NewCourseForm />;
  }

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: 'overview', label: 'نظرة عامة', icon: faInfoCircle },
    { key: 'sections', label: 'محتوى الدورة', icon: faLayerGroup },
    { key: 'requirements', label: 'المتطلبات', icon: faListCheck },
    { key: 'instructors', label: 'المدربين', icon: faChalkboardTeacher },
    { key: 'reviews', label: 'التقييمات', icon: faStar },
    { key: 'enrollments', label: 'المسجلين', icon: faUsers },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" dir="rtl">
        <FontAwesomeIcon icon={faSpinner} className="text-3xl text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4" dir="rtl">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-4xl text-red-400" />
        <p className="text-gray-600 font-medium">لم يتم العثور على الدورة</p>
        <button onClick={() => router.push('/courses-table')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">
          العودة للقائمة
        </button>
      </div>
    );
  }

  const statusLabels: Record<number, string> = { 1: 'مسودة', 2: 'منشورة', 3: 'مؤرشفة' };
  const levelLabels: Record<number, string> = { 1: 'مبتدئ', 2: 'متوسط', 3: 'متقدم' };

  return (
    <div className="p-4 sm:p-6" dir="rtl">
      {/* Back button + Header */}
      <div className="mb-6">
        <button onClick={() => router.push('/courses-table')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-4 transition-colors">
          <FontAwesomeIcon icon={faArrowRight} />
          العودة لقائمة الدورات
        </button>

        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            {course.thumbnailUrl ? (
              <img src={getFileUrl(course.thumbnailUrl)} alt={course.title} className="w-20 h-20 rounded-xl object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center border border-emerald-200">
                <img src={PLATFORM_LOGO} alt="شعار المنصة" className="w-12 h-12 object-contain" />
              </div>
            )}
            {course.promoVideoUrl && (
              <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
                <FontAwesomeIcon icon={faPlay} className="text-white text-[8px] mr-[-1px]" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg font-medium">
                {course.courseCategoryName || 'بدون قسم'}
              </span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-lg font-medium">
                {levelLabels[course.level] || course.levelName || 'غير محدد'}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                course.status === 2 ? 'bg-blue-100 text-blue-700' :
                course.status === 3 ? 'bg-gray-100 text-gray-600' :
                'bg-amber-100 text-amber-700'
              }`}>
                {statusLabels[course.status] || course.statusName || 'مسودة'}
              </span>
              {course.instructorName && (
                <span className="text-xs text-gray-500">المدرب: {course.instructorName}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="text-sm" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'overview' && <OverviewTab course={course} courseId={courseId} notif={showNotif} onCourseUpdated={(c) => setCourse(c)} />}
          {activeTab === 'sections' && <SectionsTab courseId={courseId} notif={showNotif} />}
          {activeTab === 'requirements' && <RequirementsTab courseId={courseId} notif={showNotif} />}
          {activeTab === 'instructors' && <InstructorsTab courseId={courseId} notif={showNotif} />}
          {activeTab === 'reviews' && <ReviewsTab courseId={courseId} notif={showNotif} />}
          {activeTab === 'enrollments' && <EnrollmentsTab courseId={courseId} notif={showNotif} />}
        </div>
      </div>

      <StatusToast notif={notif} onClose={() => setNotif({ ...notif, open: false })} />
    </div>
  );
}
