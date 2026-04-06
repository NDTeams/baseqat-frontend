"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faUser,
  faBriefcase,
  faFileAlt,
  faVenusMars,
  faMars,
  faVenus,
  faSpinner,
  faCheck,
  faGraduationCap,
  faPaperPlane,
  faInfoCircle,
  faArrowRight,
  faArrowLeft,
  faStar,
  faLink,
  faCamera,
  faImage,
  faFileArrowUp,
  faFilePdf,
  faLightbulb,
  faPlus,
  faTimes,
  faClock,
  faDollarSign,
  faTag,
  faLayerGroup,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faXTwitter,
  faInstagram,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { ConsultantAdminService, ConsultationCategoryPublicService, type ConsultationCategory } from "@/services/consultants/page";
import ModalMessage from "@/components/modal-message";

// ===========================
// Types
// ===========================
interface ConsultantFormData {
  name: string;
  title: string;
  bio: string;
  gender: number;
  yearsOfExperience: string;
  specialty: string;
  hourlyRate: string;
  availability: string;
  linkedInUrl: string;
  xUrl: string;
  instagramUrl: string;
  facebookUrl: string;
}

const STEPS = [
  { id: 1, label: "المعلومات الأساسية", icon: faUser },
  { id: 2, label: "التخصص والخبرة", icon: faBriefcase },
  { id: 3, label: "السيرة الذاتية", icon: faFileAlt },
  { id: 4, label: "الصورة والملفات", icon: faCamera },
  { id: 5, label: "روابط التواصل", icon: faLink },
];
const TOTAL_STEPS = STEPS.length;

export default function BecomeConsultantPage() {
  const [requestStatus, setRequestStatus] = useState<number | null>(null);
  const [denialReason, setDenialReason] = useState<string>("");
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    ConsultantAdminService.getMyRequest().then(res => {
      if (res.succeeded && res.data) {
        setRequestStatus(res.data.requestStatus ?? null);
        setDenialReason(res.data.denialReason || "");
      }
    }).catch(() => {}).finally(() => setCheckingStatus(false));
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form data
  const [formData, setFormData] = useState<ConsultantFormData>({
    name: "",
    title: "",
    bio: "",
    gender: 1,
    yearsOfExperience: "",
    specialty: "",
    hourlyRate: "",
    availability: "",
    linkedInUrl: "",
    xUrl: "",
    instagramUrl: "",
    facebookUrl: "",
  });

  // File uploads
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  // Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Categories
  const [availableCategories, setAvailableCategories] = useState<ConsultationCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await ConsultationCategoryPublicService.getActive();
        if (res.succeeded) setAvailableCategories(res.data || []);
      } catch {}
    })();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showModal("error", "خطأ", "حجم الصورة يجب أن لا يتجاوز 5 ميجابايت");
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showModal("error", "خطأ", "حجم الملف يجب أن لا يتجاوز 5 ميجابايت");
      return;
    }
    setCvFile(file);
  };

  // Modal
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success" as "success" | "error" | "warning",
    title: "",
    message: "" as string | string[],
  });

  const showModal = (type: "success" | "error" | "warning", title: string, message: string | string[]) => {
    setModal({ isOpen: true, type, title, message });
  };

  // Step validation
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return formData.title.trim().length > 0;
      case 3:
        return formData.bio.trim().length >= 20;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.title.trim()) {
      showModal("error", "بيانات ناقصة", "الاسم والمسمى حقول مطلوبة");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await ConsultantAdminService.registerRequest({
        name: formData.name.trim(),
        title: formData.title.trim(),
        bio: formData.bio.trim() || undefined,
        gender: formData.gender,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
        specialty: formData.specialty.trim() || undefined,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
        availability: formData.availability.trim() || undefined,
        linkedInUrl: formData.linkedInUrl.trim() || undefined,
        xUrl: formData.xUrl.trim() || undefined,
        instagramUrl: formData.instagramUrl.trim() || undefined,
        facebookUrl: formData.facebookUrl.trim() || undefined,
        skills: skills.length > 0 ? skills : undefined,
        categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
        avatarFile: avatarFile || undefined,
        cvFile: cvFile || undefined,
      });

      if (res.succeeded) {
        setIsSubmitted(true);
        showModal("success", "تم إرسال طلبك بنجاح!", res.message || "سيتم مراجعة طلبك من قبل فريق الإدارة وسنتواصل معك قريبًا.");
      } else {
        showModal("error", "خطأ في الإرسال", res.message || "حدث خطأ أثناء إرسال الطلب");
      }
    } catch (err: any) {
      console.error("RegisterRequest error:", err);
      const errData = err.response?.data;
      const status = err.response?.status;
      let msg: string;
      if (status === 401) {
        msg = "يجب تسجيل الدخول أولاً";
      } else if (errData?.message) {
        msg = errData.message;
      } else if (Array.isArray(errData?.errors) && errData.errors.length) {
        msg = errData.errors[0];
      } else if (errData?.errors && typeof errData.errors === "object") {
        const firstField = Object.values(errData.errors)[0];
        msg = Array.isArray(firstField) ? firstField[0] : String(firstField);
      } else if (errData?.title) {
        msg = errData.title;
      } else {
        msg = "حدث خطأ في الاتصال بالخادم";
      }
      showModal("error", "خطأ", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading status check
  if (checkingStatus) {
    return (
      <div dir="rtl" className="min-h-[60vh] flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-blue-600 text-3xl" />
      </div>
    );
  }

  // Approved - hide the form
  if (requestStatus === 2) {
    return (
      <div dir="rtl" className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faCheck} className="text-green-600 text-4xl" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-3">تمت الموافقة على طلبك</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            تهانينا! تمت الموافقة على طلبك كمستشار في منصة باسقات. يمكنك الآن استقبال طلبات الاستشارات.
          </p>
          <a
            href="/student-dashboard/index"
            className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            العودة للوحة التحكم
          </a>
        </div>
      </div>
    );
  }

  // Denied - show denial reason
  if (requestStatus === 3) {
    return (
      <div dir="rtl" className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faTimesCircle} className="text-red-600 text-4xl" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-3">تم رفض طلبك</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            للأسف تم رفض طلبك للانضمام كمستشار في منصة باسقات.
          </p>
          {denialReason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-right">
              <p className="text-sm font-semibold text-red-800 mb-1">سبب الرفض:</p>
              <p className="text-sm text-red-700">{denialReason}</p>
            </div>
          )}
          <a
            href="/student-dashboard/index"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            العودة للوحة التحكم
          </a>
        </div>
      </div>
    );
  }

  // Pending - show waiting screen
  if (requestStatus === 1) {
    return (
      <div dir="rtl" className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faClock} className="text-amber-600 text-4xl" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-3">طلبك قيد المراجعة</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            تم استلام طلبك للانضمام كمستشار وهو الآن قيد المراجعة من قبل فريق الإدارة. سيتم إبلاغك بالنتيجة قريبًا.
          </p>
          <a
            href="/student-dashboard/index"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            العودة للوحة التحكم
          </a>
        </div>
      </div>
    );
  }

  // Success screen
  if (isSubmitted) {
    return (
      <div dir="rtl" className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sky-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faCheck} className="text-sky-600 text-4xl" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-3">تم إرسال طلبك بنجاح!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            شكرًا لاهتمامك بالانضمام كمستشار في منصة باسقات.
            سيتم مراجعة طلبك من قبل فريق الإدارة وسنتواصل معك عبر البريد الإلكتروني قريبًا.
          </p>
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon={faInfoCircle} className="text-sky-600 mt-1" />
              <div className="text-right">
                <p className="text-sm font-semibold text-sky-800 mb-1">ماذا بعد؟</p>
                <ul className="text-xs text-sky-700 space-y-1">
                  <li>- سيتم مراجعة بياناتك خلال 2-3 أيام عمل</li>
                  <li>- ستصلك رسالة تأكيد على بريدك الإلكتروني</li>
                  <li>- بعد القبول ستتمكن من تقديم استشاراتك عبر المنصة</li>
                </ul>
              </div>
            </div>
          </div>
          <a
            href="/student-dashboard/index"
            className="inline-flex items-center gap-2 px-8 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors"
          >
            العودة للوحة التحكم
          </a>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl">
      <ModalMessage
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, isOpen: false })}
        autoClose={modal.type === "success" ? 3000 : 5000}
      />

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg">
            <FontAwesomeIcon icon={faUserTie} className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800">كن مستشارًا</h1>
            <p className="text-gray-500 text-sm">انضم إلى فريق المستشارين وقدّم خبراتك للعملاء</p>
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => {
                    if (step.id < currentStep) setCurrentStep(step.id);
                  }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    step.id === currentStep
                      ? "bg-sky-600 text-white shadow-lg scale-110"
                      : step.id < currentStep
                      ? "bg-sky-100 text-sky-600 cursor-pointer hover:bg-sky-200"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.id < currentStep ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : (
                    <FontAwesomeIcon icon={step.icon} />
                  )}
                </button>
                <span
                  className={`text-xs mt-2 font-semibold hidden sm:block ${
                    step.id === currentStep
                      ? "text-sky-600"
                      : step.id < currentStep
                      ? "text-sky-500"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-1 flex-1 rounded-full mx-2 transition-all duration-300 ${
                    step.id < currentStep ? "bg-sky-400" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-sky-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">المعلومات الأساسية</h2>
                <p className="text-sm text-gray-500">أدخل بياناتك الشخصية كمستشار</p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faUser} className="ml-2 text-sky-600" />
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="أدخل اسمك الكامل كما سيظهر للعملاء"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faVenusMars} className="ml-2 text-sky-600" />
                الجنس <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label
                  className={`flex-1 flex items-center gap-3 px-5 py-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.gender === 1
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    checked={formData.gender === 1}
                    onChange={() => setFormData({ ...formData, gender: 1 })}
                    className="hidden"
                  />
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.gender === 1 ? "bg-blue-100" : "bg-gray-100"}`}>
                    <FontAwesomeIcon icon={faMars} className={formData.gender === 1 ? "text-blue-600" : "text-gray-400"} />
                  </div>
                  <span className={`font-semibold ${formData.gender === 1 ? "text-blue-700" : "text-gray-600"}`}>ذكر</span>
                </label>
                <label
                  className={`flex-1 flex items-center gap-3 px-5 py-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.gender === 2
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    checked={formData.gender === 2}
                    onChange={() => setFormData({ ...formData, gender: 2 })}
                    className="hidden"
                  />
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.gender === 2 ? "bg-pink-100" : "bg-gray-100"}`}>
                    <FontAwesomeIcon icon={faVenus} className={formData.gender === 2 ? "text-pink-600" : "text-gray-400"} />
                  </div>
                  <span className={`font-semibold ${formData.gender === 2 ? "text-pink-700" : "text-gray-600"}`}>أنثى</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Specialization & Experience */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faBriefcase} className="text-sky-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">التخصص والخبرة</h2>
                <p className="text-sm text-gray-500">حدثنا عن تخصصك ومجال خبرتك الاستشارية</p>
              </div>
            </div>

            {/* Title/Specialization */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faGraduationCap} className="ml-2 text-sky-600" />
                اللقب / المسمى الوظيفي <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="مثال: مستشار إداري، خبير تقنية معلومات، مستشار مالي"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            {/* Consultation Categories */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faLayerGroup} className="ml-2 text-sky-600" />
                أقسام الاستشارات
              </label>
              {availableCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((cat) => {
                    const isSelected = selectedCategoryIds.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() =>
                          setSelectedCategoryIds((prev) =>
                            isSelected
                              ? prev.filter((id) => id !== cat.id)
                              : [...prev, cat.id]
                          )
                        }
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                          isSelected
                            ? "bg-sky-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:border-sky-400 hover:text-sky-600"
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400">لا توجد أقسام متاحة</p>
              )}
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faStar} className="ml-2 text-sky-600" />
                سنوات الخبرة
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                placeholder="عدد سنوات الخبرة في مجال الاستشارات"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faDollarSign} className="ml-2 text-sky-600" />
                سعر الساعة (ريال)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder="سعر الساعة الاستشارية بالريال السعودي"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faClock} className="ml-2 text-sky-600" />
                أوقات التوفر
              </label>
              <input
                type="text"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                placeholder="مثال: الأحد - الخميس، 9 صباحاً - 5 مساءً"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faLightbulb} className="ml-2 text-sky-600" />
                المهارات والاهتمامات
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="أدخل مهارة واضغط Enter أو زر إضافة"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  disabled={!newSkill.trim()}
                  className="px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  إضافة
                </button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-sky-50 text-sky-700 rounded-full text-sm font-semibold flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTimes} className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Bio */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faFileAlt} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">السيرة الذاتية</h2>
                <p className="text-sm text-gray-500">اكتب نبذة تعريفية عنك تظهر للعملاء</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                نبذة عنك <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={8}
                placeholder="اكتب نبذة تعريفية شاملة عن نفسك، خبراتك الاستشارية، إنجازاتك، وما الذي يميزك كمستشار. هذا النص سيظهر في صفحتك الشخصية كمستشار وسيساعد العملاء على التعرف عليك..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${formData.bio.length < 20 ? "text-red-500" : "text-gray-400"}`}>
                  {formData.bio.length < 20
                    ? `يجب أن يكون 20 حرف على الأقل (${formData.bio.length}/20)`
                    : `${formData.bio.length} حرف`}
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faInfoCircle} className="text-purple-600 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-purple-800 mb-2">نصائح لكتابة سيرة مميزة:</p>
                  <ul className="text-xs text-purple-700 space-y-1.5">
                    <li>- ابدأ بتعريف موجز عن نفسك وتخصصك الاستشاري</li>
                    <li>- اذكر سنوات خبرتك وأبرز المشاريع التي عملت عليها</li>
                    <li>- أضف المؤهلات والشهادات المهنية الحاصل عليها</li>
                    <li>- وضّح القيمة التي سيحصل عليها العميل من استشاراتك</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Photo & Files */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faCamera} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">الصورة والملفات</h2>
                <p className="text-sm text-gray-500">أضف صورتك الشخصية وسيرتك الذاتية (اختياري)</p>
              </div>
            </div>

            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FontAwesomeIcon icon={faImage} className="ml-2 text-orange-600" />
                الصورة الشخصية
              </label>
              <div
                onClick={() => avatarInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-sky-400 hover:bg-sky-50/30 transition-colors"
              >
                {avatarPreview ? (
                  <div className="flex flex-col items-center">
                    <img src={avatarPreview} alt="preview" className="w-28 h-28 rounded-2xl object-cover mb-3 border-4 border-sky-200 shadow-lg" />
                    <p className="text-sm font-semibold text-gray-700">{avatarFile?.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{avatarFile ? (avatarFile.size / 1024 / 1024).toFixed(2) + " MB" : ""}</p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setAvatarFile(null); setAvatarPreview(null); }}
                      className="mt-2 text-xs text-red-500 hover:text-red-700"
                    >
                      إزالة الصورة
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <FontAwesomeIcon icon={faCamera} className="text-gray-300 text-3xl" />
                    </div>
                    <p className="text-sm font-semibold text-gray-600">اضغط لاختيار صورة شخصية</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP - حد أقصى 5MB</p>
                  </div>
                )}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FontAwesomeIcon icon={faFileArrowUp} className="ml-2 text-orange-600" />
                السيرة الذاتية (ملف)
              </label>
              <div
                onClick={() => cvInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-colors"
              >
                {cvFile ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                      <FontAwesomeIcon icon={faFilePdf} className="text-red-500 text-3xl" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">{cvFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                      className="mt-2 text-xs text-red-500 hover:text-red-700"
                    >
                      إزالة الملف
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <FontAwesomeIcon icon={faFileArrowUp} className="text-gray-300 text-3xl" />
                    </div>
                    <p className="text-sm font-semibold text-gray-600">اضغط لرفع سيرتك الذاتية</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX - حد أقصى 5MB</p>
                  </div>
                )}
                <input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Social Links */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faLink} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">روابط التواصل الاجتماعي</h2>
                <p className="text-sm text-gray-500">أضف روابط حساباتك (اختياري)</p>
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faLinkedin} className="ml-2 text-[#0A66C2]" />
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedInUrl}
                onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                placeholder="https://linkedin.com/in/your-profile"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                dir="ltr"
              />
            </div>

            {/* X (Twitter) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faXTwitter} className="ml-2 text-black" />
                X (Twitter)
              </label>
              <input
                type="url"
                value={formData.xUrl}
                onChange={(e) => setFormData({ ...formData, xUrl: e.target.value })}
                placeholder="https://x.com/your-handle"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all text-sm"
                dir="ltr"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faInstagram} className="ml-2 text-[#E4405F]" />
                Instagram
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/your-profile"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all text-sm"
                dir="ltr"
              />
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faFacebook} className="ml-2 text-[#1877F2]" />
                Facebook
              </label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/your-profile"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                dir="ltr"
              />
            </div>

            {/* Summary before submit */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-3">ملخص الطلب:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">الاسم:</span>{" "}
                  <span className="font-semibold text-gray-800">{formData.name || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500">المسمى:</span>{" "}
                  <span className="font-semibold text-gray-800">{formData.title || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500">التخصص:</span>{" "}
                  <span className="font-semibold text-gray-800">{formData.specialty || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500">الجنس:</span>{" "}
                  <span className="font-semibold text-gray-800">{formData.gender === 1 ? "ذكر" : "أنثى"}</span>
                </div>
                <div>
                  <span className="text-gray-500">سنوات الخبرة:</span>{" "}
                  <span className="font-semibold text-gray-800">{formData.yearsOfExperience || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500">سعر الساعة:</span>{" "}
                  <span className="font-semibold text-gray-800">{formData.hourlyRate ? `${formData.hourlyRate} ريال` : "-"}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-500">أوقات التوفر:</span>{" "}
                  <span className="font-semibold text-gray-800">{formData.availability || "-"}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-500">السيرة:</span>{" "}
                  <span className="font-semibold text-gray-800">{formData.bio.length > 0 ? `${formData.bio.length} حرف` : "-"}</span>
                </div>
                {skills.length > 0 && (
                  <div className="sm:col-span-2">
                    <span className="text-gray-500">المهارات:</span>{" "}
                    <span className="font-semibold text-gray-800">{skills.join("، ")}</span>
                  </div>
                )}
                {selectedCategoryIds.length > 0 && (
                  <div className="sm:col-span-2">
                    <span className="text-gray-500">أقسام الاستشارات:</span>{" "}
                    <span className="font-semibold text-gray-800">
                      {availableCategories.filter(c => selectedCategoryIds.includes(c.id)).map(c => c.name).join("، ")}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">الصورة:</span>{" "}
                  <span className={`font-semibold ${avatarFile ? "text-sky-600" : "text-gray-400"}`}>
                    {avatarFile ? "مرفقة" : "غير مرفقة"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">السيرة الذاتية:</span>{" "}
                  <span className={`font-semibold ${cvFile ? "text-sky-600" : "text-gray-400"}`}>
                    {cvFile ? "مرفقة" : "غير مرفقة"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            currentStep === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <FontAwesomeIcon icon={faArrowRight} />
          السابق
        </button>

        {currentStep < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={!isStepValid(currentStep)}
            className="flex items-center gap-2 px-8 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            التالي
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-xl font-semibold hover:from-sky-700 hover:to-sky-800 transition-all disabled:opacity-60 shadow-lg"
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} />
                إرسال الطلب
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
