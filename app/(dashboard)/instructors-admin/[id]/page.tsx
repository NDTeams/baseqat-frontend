'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight, faUserTie, faMars, faVenus, faStar, faUsers,
  faBookOpen, faFilePdf, faCamera, faFileArrowUp, faSpinner,
  faCheck, faTimes, faDownload, faPlus,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import {
  InstructorAdminService,
  InstructorSkillAdminService,
  type Instructor,
  type Course,
} from '@/services/courses/page';
import { API_BASE, getFileUrl } from '@/lib/config';

// ===========================
// Upload Modal
// ===========================
function UploadModal({
  isOpen, type, instructorId, onClose, onSuccess,
}: {
  isOpen: boolean;
  type: 'avatar' | 'cv';
  instructorId: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFile(null);
    setPreview(null);
    setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const isAvatar = type === 'avatar';
  const accept = isAvatar ? '.jpg,.jpeg,.png,.gif,.webp' : '.pdf,.doc,.docx';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setError('حجم الملف يجب أن لا يتجاوز 5 ميجابايت');
      return;
    }
    setError('');
    setFile(f);
    if (isAvatar && f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const res = isAvatar
        ? await InstructorAdminService.uploadAvatar(instructorId, file)
        : await InstructorAdminService.uploadCv(instructorId, file);
      if (res.succeeded) {
        onClose();
        onSuccess();
      } else {
        setError(res.message || 'فشل الرفع');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'حدث خطأ');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">
            {isAvatar ? 'رفع صورة شخصية' : 'رفع السيرة الذاتية'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {preview && (
            <div className="flex justify-center">
              <img src={preview} alt="معاينة" className="w-32 h-32 rounded-full object-cover border-4 border-blue-200" />
            </div>
          )}
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
          >
            <FontAwesomeIcon icon={isAvatar ? faCamera : faFileArrowUp} className="text-3xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">{file ? file.name : 'اضغط لاختيار ملف'}</p>
            <p className="text-xs text-gray-400 mt-1">
              {isAvatar ? 'JPG, PNG, GIF, WEBP' : 'PDF, DOC, DOCX'} - حتى 5MB
            </p>
          </div>
          <input ref={inputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button onClick={handleUpload} disabled={!file || uploading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {uploading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faCheck} />}
            رفع
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================
// Main Page
// ===========================
export default function InstructorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'avatar' | 'cv'>('avatar');

  // Skills state
  const [newSkillName, setNewSkillName] = useState('');
  const [skillLoading, setSkillLoading] = useState(false);
  const [skillDeleting, setSkillDeleting] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [instRes, coursesRes, reviewsRes, skillsRes] = await Promise.all([
        InstructorAdminService.getById(id),
        InstructorAdminService.getInstructorCourses(id).catch(() => ({ succeeded: false, data: [] })),
        InstructorAdminService.getInstructorReviews(id).catch(() => ({ succeeded: false, data: [] })),
        InstructorSkillAdminService.getByInstructor(id).catch((err) => {
          console.error('[Skills] Fetch error:', err);
          return { succeeded: false, data: [] as any[] };
        }),
      ]);

      if (instRes.succeeded) {
        const inst = instRes.data;
        if (skillsRes.succeeded && Array.isArray(skillsRes.data)) {
          inst.skills = skillsRes.data;
        } else {
          inst.skills = [];
        }
        setInstructor(inst);
      } else {
        setError(instRes.message || 'لم يتم العثور على المدرب');
      }

      if (coursesRes.succeeded && coursesRes.data) {
        setCourses(coursesRes.data);
      }

      if (reviewsRes.succeeded && reviewsRes.data) {
        setReviews(reviewsRes.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const openUpload = (type: 'avatar' | 'cv') => {
    setUploadType(type);
    setUploadModal(true);
  };

  // --- Skills (خاصة بهذا المدرب فقط) ---
  const handleAddSkill = async () => {
    const skillName = newSkillName.trim();
    if (!skillName) return;
    if (instructor?.skills?.some(s => s.name === skillName)) return;

    setSkillLoading(true);
    try {
      const res = await InstructorSkillAdminService.add({ name: skillName, instructorId: id });
      if (res.succeeded && res.data) {
        setNewSkillName('');
        setInstructor(prev => prev ? { ...prev, skills: [...(prev.skills || []), res.data] } : prev);
      }
    } catch {}
    setSkillLoading(false);
  };

  const handleDeleteSkill = async (skillId: number) => {
    setSkillDeleting(skillId);
    try {
      const res = await InstructorSkillAdminService.delete(skillId);
      if (res.succeeded) {
        setInstructor(prev => prev ? { ...prev, skills: (prev.skills || []).filter(s => s.id !== skillId) } : prev);
      }
    } catch {}
    setSkillDeleting(null);
  };

  // Loading State
  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto" dir="rtl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <div className="flex gap-6">
              <div className="w-32 h-32 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-64 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !instructor) {
    return (
      <div className="p-6 max-w-6xl mx-auto" dir="rtl">
        <div className="bg-white rounded-2xl p-12 shadow-md text-center">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faUserTie} className="text-red-400 text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">لم يتم العثور على المدرب</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button onClick={() => router.push('/instructors-admin')}
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            العودة للقائمة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6" dir="rtl">
      {/* Back Button */}
      <button onClick={() => router.push('/instructors-admin')}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm">
        <FontAwesomeIcon icon={faArrowRight} />
        العودة لقائمة المدربين
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-l from-blue-600 via-blue-500 to-sky-500" />

        <div className="px-8 pb-8">
          {/* Avatar + Info */}
          <div className="flex flex-col md:flex-row gap-6 -mt-16">
            {/* Avatar */}
            <div className="relative group">
              {instructor.avatarUrl ? (
                <img src={getFileUrl(instructor.avatarUrl)} alt={instructor.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-white shadow-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserTie} className="text-gray-500 text-4xl" />
                </div>
              )}
              <button onClick={() => openUpload('avatar')}
                className="absolute bottom-1 left-1 w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100">
                <FontAwesomeIcon icon={faCamera} className="text-sm" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 pt-4 md:pt-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{instructor.name}</h1>
                  <p className="text-blue-600 font-semibold mt-1">{instructor.title}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${instructor.gender === 1 ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                      <FontAwesomeIcon icon={instructor.gender === 1 ? faMars : faVenus} />
                      {instructor.genderName || (instructor.gender === 1 ? 'ذكر' : 'أنثى')}
                    </span>
                    {instructor.rating !== null && instructor.rating !== undefined && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                        <FontAwesomeIcon icon={faStar} />
                        {instructor.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button onClick={() => openUpload('avatar')}
                    className="px-4 py-2 bg-purple-50 text-purple-600 font-semibold rounded-xl hover:bg-purple-100 transition-colors text-sm flex items-center gap-2">
                    <FontAwesomeIcon icon={faCamera} /> تغيير الصورة
                  </button>
                  <button onClick={() => openUpload('cv')}
                    className="px-4 py-2 bg-orange-50 text-orange-600 font-semibold rounded-xl hover:bg-orange-100 transition-colors text-sm flex items-center gap-2">
                    <FontAwesomeIcon icon={faFileArrowUp} /> رفع سيرة ذاتية
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 text-center">
          <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-xl flex items-center justify-center mb-3">
            <FontAwesomeIcon icon={faStar} className="text-yellow-600 text-xl" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {instructor.rating !== null && instructor.rating !== undefined ? instructor.rating.toFixed(1) : '-'}
          </div>
          <div className="text-xs text-gray-500 mt-1">التقييم</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 text-center">
          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-xl" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{instructor.totalStudents ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1">عدد الطلاب</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 text-center">
          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <FontAwesomeIcon icon={faBookOpen} className="text-blue-600 text-xl" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{instructor.totalCources ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1">عدد الدورات</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 text-center">
          <div className="w-12 h-12 mx-auto bg-green-100 rounded-xl flex items-center justify-center mb-3">
            <FontAwesomeIcon icon={faFilePdf} className="text-green-600 text-xl" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {instructor.cvUrl ? (
              <a href={getFileUrl(instructor.cvUrl)} target="_blank" rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 text-base flex items-center justify-center gap-1">
                <FontAwesomeIcon icon={faDownload} className="text-sm" /> تحميل
              </a>
            ) : (
              <span className="text-gray-400 text-base">غير مرفقة</span>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">السيرة الذاتية</div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faUserTie} className="text-blue-600 text-sm" />
          </div>
          نبذة عن المدرب
        </h2>
        <p className="text-gray-600 leading-8 text-sm whitespace-pre-wrap">
          {instructor.bio || 'لا توجد نبذة متاحة.'}
        </p>
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faLightbulb} className="text-purple-600 text-sm" />
          </div>
          مهارات المدرب
          <span className="text-sm font-normal text-gray-400">({instructor.skills?.length ?? 0})</span>
        </h2>

        {/* Current Skills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {instructor.skills && instructor.skills.length > 0 ? (
            instructor.skills.map((skill) => (
              <span key={skill.id} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium border border-purple-100">
                {skill.name}
                <button onClick={() => handleDeleteSkill(skill.id)} disabled={skillDeleting === skill.id}
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-purple-200 text-purple-600 hover:bg-red-200 hover:text-red-600 transition-colors text-xs">
                  {skillDeleting === skill.id ? <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[10px]" /> : <FontAwesomeIcon icon={faTimes} className="text-[10px]" />}
                </button>
              </span>
            ))
          ) : (
            <div className="text-gray-400 text-sm">لا توجد مهارات مضافة لهذا المدرب</div>
          )}
        </div>

        {/* Add New Skill */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            placeholder="أضف مهارة لهذا المدرب..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
          />
          <button onClick={handleAddSkill} disabled={skillLoading || !newSkillName.trim()}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 text-sm">
            {skillLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faPlus} />}
            إضافة
          </button>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faBookOpen} className="text-blue-600 text-sm" />
          </div>
          دورات المدرب
          <span className="text-sm font-normal text-gray-400">({courses.length})</span>
        </h2>

        {courses.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">لا توجد دورات حالياً</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div key={course.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                {course.thumbnailUrl && (
                  <img src={getFileUrl(course.thumbnailUrl)} alt={course.title}
                    className="w-full h-36 object-cover" />
                )}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-gray-800 text-sm">{course.title}</h3>
                  {course.courseCategoryName && (
                    <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                      {course.courseCategoryName}
                    </span>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{course.levelName || `مستوى ${course.level}`}</span>
                    <span className="font-bold text-blue-600">{course.price} ر.س</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{course.statusName || (course.isActive ? 'نشطة' : 'غير نشطة')}</span>
                    {course.hasCertificate && (
                      <span className="text-yellow-600 font-semibold">شهادة</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faStar} className="text-yellow-600 text-sm" />
          </div>
          التقييمات
          <span className="text-sm font-normal text-gray-400">({reviews.length})</span>
        </h2>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">لا توجد تقييمات حالياً</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800 text-sm">{review.userName || 'مستخدم'}</span>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar}
                        className={i < (review.rating || 0) ? 'text-yellow-500' : 'text-gray-200'} />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-600 text-sm leading-7">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal isOpen={uploadModal} type={uploadType} instructorId={instructor.id}
        onClose={() => setUploadModal(false)} onSuccess={fetchData} />
    </div>
  );
}
