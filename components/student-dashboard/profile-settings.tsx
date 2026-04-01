'use client';

import { useState, useEffect, useRef, useCallback, DragEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faLock, faLink, faCamera, faSave, faPlus, faTimes,
  faShieldAlt, faEye, faEyeSlash, faKey, faCheckDouble, faCheck,
  faEnvelope, faDownload, faChevronLeft, faGlobe, faMapMarkerAlt,
  faPhone, faCalendar, faSpinner, faFileUpload, faFilePdf,
  faTrashAlt, faCheckCircle, faExclamationTriangle, faInfoCircle,
  faVenusMars, faShareAlt, faCloudUploadAlt, faChartLine,
  faBookOpen, faCertificate, faClock,
} from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedin, faTwitter, faGithub, faFacebook, faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import { ClientProfileService, type ClientProfileData, type UpdateProfileData, type ClientStats } from '@/services/client-profile/page';
import { getFileUrl } from '@/lib/config';
import { SAUDI_REGIONS } from '@/data/saudi-regions';

const DEFAULT_AVATAR = '/images/default-avatar.svg';

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '';
  }
}

function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `منذ ${diffDays} يوم`;
    return formatDate(dateStr);
  } catch {
    return '';
  }
}

// ===== Toast Component =====
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold animate-fadeIn ${
      type === 'success' ? 'bg-primary text-white' : 'bg-red-600 text-white'
    }`}>
      <FontAwesomeIcon icon={type === 'success' ? faCheckCircle : faExclamationTriangle} />
      {message}
    </div>
  );
}

// ===== Skeleton Loader =====
function ProfileSkeleton() {
  return (
    <div className="font-cairo">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-neutral-200 animate-pulse" />
        <div className="h-7 w-32 bg-neutral-200 rounded animate-pulse" />
      </div>
      <div className="mb-6">
        <div className="flex gap-3 border-b border-neutral-200 pb-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 w-32 bg-neutral-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-2xl bg-neutral-200 animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-48 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
              </div>
            </div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-neutral-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-neutral-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Main Component =====
export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'social'>('personal');
  const [profile, setProfile] = useState<ClientProfileData | null>(null);
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [retrying, setRetrying] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  const fetchProfile = useCallback(async (isRetry = false) => {
    if (isRetry) setRetrying(true);
    else setLoading(true);
    setErrorMsg('');
    try {
      const res = await ClientProfileService.getMyProfile();
      if (res.succeeded) {
        setProfile(res.data);
        setErrorMsg('');
      } else {
        setErrorMsg(res.message || 'فشل تحميل البيانات');
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        setErrorMsg('يرجى تسجيل الدخول أولاً');
      } else if (status === 502 || !err?.response) {
        setErrorMsg('تعذر الاتصال بالخادم. تأكد من تشغيل Backend');
      } else {
        setErrorMsg(err?.response?.data?.message || 'حدث خطأ غير متوقع');
      }
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await ClientProfileService.getMyStats();
      if (res.succeeded) setStats(res.data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, [fetchProfile, fetchStats]);

  const refreshProfile = async () => {
    try {
      const res = await ClientProfileService.getMyProfile();
      if (res.succeeded) setProfile(res.data);
    } catch { /* silent */ }
  };

  if (loading) return <ProfileSkeleton />;
  if (!profile) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-red-400" />
      </div>
      <p className="text-neutral-800 font-bold text-lg">تعذر تحميل الملف الشخصي</p>
      {errorMsg && <p className="text-neutral-500 text-sm text-center max-w-md">{errorMsg}</p>}
      <button
        onClick={() => fetchProfile(true)}
        disabled={retrying}
        className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-accent transition flex items-center gap-2 disabled:opacity-60"
      >
        {retrying && <FontAwesomeIcon icon={faSpinner} spin />}
        إعادة المحاولة
      </button>
    </div>
  );

  const tabs = [
    { id: 'personal' as const, icon: faUser, label: 'المعلومات الشخصية' },
    { id: 'security' as const, icon: faLock, label: 'الأمان' },
    { id: 'social' as const, icon: faLink, label: 'الروابط الاجتماعية' },
  ];

  return (
    <div className="font-cairo">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Page Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
          <FontAwesomeIcon icon={faUser} className="text-emerald-700 text-lg" />
        </div>
        <h1 className="text-2xl font-black text-neutral-900">الإعدادات</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3 border-b border-neutral-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold transition relative ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-600 hover:text-primary border-b-2 border-transparent'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="ml-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tab Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'personal' && (
            <PersonalInfoTab profile={profile} onUpdate={refreshProfile} showToast={showToast} />
          )}
          {activeTab === 'security' && (
            <SecurityTab showToast={showToast} />
          )}
          {activeTab === 'social' && (
            <SocialLinksTab profile={profile} onUpdate={refreshProfile} showToast={showToast} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-black text-neutral-900 mb-6 flex items-center">
              <FontAwesomeIcon icon={faChartLine} className="text-primary ml-2" />
              الإحصائيات
            </h3>
            <div className="space-y-4">
              {[
                { icon: faBookOpen, label: 'الدورات المسجلة', value: stats?.totalEnrollments ?? 0, bgColor: 'bg-primary/5', iconBg: 'bg-primary/10', iconColor: 'text-primary' },
                { icon: faCertificate, label: 'الشهادات', value: stats?.certificateCount ?? 0, bgColor: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
                { icon: faClock, label: 'ساعات التعلم', value: stats?.totalLearningHours ?? 0, bgColor: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
              ].map((stat, index) => (
                <div key={index} className={`flex items-center justify-between p-4 ${stat.bgColor} rounded-xl`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                      <FontAwesomeIcon icon={stat.icon} className={stat.iconColor} />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">{stat.label}</p>
                      <p className="text-2xl font-black text-neutral-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Completion */}
          <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white">
            <h3 className="text-lg font-black mb-4">اكتمال الملف الشخصي</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">{profile.profileCompletion}%</span>
              </div>
              <div className="h-3 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${profile.profileCompletion}%` }}
                />
              </div>
            </div>
            {profile.profileCompletion === 100 ? (
              <p className="text-xs opacity-90 font-semibold flex items-center gap-1">
                <FontAwesomeIcon icon={faCheckCircle} />
                ملفك الشخصي مكتمل!
              </p>
            ) : (
              <p className="text-xs opacity-80">
                أكمل البيانات أدناه للوصول لـ 100%
              </p>
            )}
          </div>

          {/* Completion Checklist */}
          <CompletionChecklist profile={profile} onNavigate={setActiveTab} />

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-black text-neutral-900 mb-4">إجراءات سريعة</h3>
            <div className="space-y-2">
              {profile.cvUrl && (
                <a
                  href={getFileUrl(profile.cvUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-right px-4 py-3 rounded-xl hover:bg-neutral-50 transition text-sm font-semibold text-neutral-700 flex items-center justify-between"
                >
                  <span>
                    <FontAwesomeIcon icon={faDownload} className="ml-2" />
                    تحميل السيرة الذاتية
                  </span>
                  <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                </a>
              )}
              <ShareProfileButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Completion Checklist =====
function CompletionChecklist({
  profile,
  onNavigate,
}: {
  profile: ClientProfileData;
  onNavigate: (tab: 'personal' | 'security' | 'social') => void;
}) {
  const details = profile.completionDetails;
  if (!details) return null;

  const items = [
    { done: details.hasFullName, label: 'الاسم الكامل', weight: 15, tab: 'personal' as const },
    { done: details.hasProfilePicture, label: 'الصورة الشخصية', weight: 15, tab: 'personal' as const },
    { done: details.hasPhoneNumber, label: 'رقم الهاتف', weight: 15, tab: 'personal' as const },
    { done: details.hasBio, label: 'نبذة عني', weight: 15, tab: 'personal' as const },
    { done: details.hasDateOfBirth, label: 'تاريخ الميلاد', weight: 10, tab: 'personal' as const },
    { done: details.hasAddress, label: 'العنوان', weight: 10, tab: 'personal' as const },
    { done: details.hasGender, label: 'الجنس', weight: 10, tab: 'personal' as const },
    { done: details.hasCv, label: 'السيرة الذاتية', weight: 10, tab: 'personal' as const },
  ];

  const completedCount = items.filter(i => i.done).length;
  if (completedCount === items.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-black text-neutral-900">أكمل ملفك</h3>
        <span className="text-xs text-neutral-500 font-semibold">{completedCount}/{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => !item.done && onNavigate(item.tab)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
              item.done
                ? 'bg-primary/5 text-primary cursor-default'
                : 'bg-neutral-50 text-neutral-600 hover:bg-amber-50 hover:text-amber-700 cursor-pointer'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              item.done ? 'bg-primary text-white' : 'border-2 border-neutral-300'
            }`}>
              {item.done && <FontAwesomeIcon icon={faCheck} className="text-[10px]" />}
            </div>
            <span className={`flex-1 text-right font-semibold ${item.done ? 'line-through opacity-70' : ''}`}>
              {item.label}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              item.done ? 'bg-primary/10 text-primary' : 'bg-neutral-200 text-neutral-500'
            }`}>
              {item.weight}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ===== Share Profile Button =====
function ShareProfileButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full text-right px-4 py-3 rounded-xl hover:bg-neutral-50 transition text-sm font-semibold text-neutral-700 flex items-center justify-between"
    >
      <span>
        <FontAwesomeIcon icon={copied ? faCheck : faShareAlt} className={`ml-2 ${copied ? 'text-primary' : ''}`} />
        {copied ? 'تم نسخ الرابط!' : 'مشاركة الملف الشخصي'}
      </span>
      <FontAwesomeIcon icon={copied ? faCheckCircle : faChevronLeft} className={`text-xs ${copied ? 'text-primary' : ''}`} />
    </button>
  );
}

// ===== Personal Information Tab =====
function PersonalInfoTab({
  profile,
  onUpdate,
  showToast,
}: {
  profile: ClientProfileData;
  onUpdate: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deletingAvatar, setDeletingAvatar] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [deletingCv, setDeletingCv] = useState(false);
  const [draggingCv, setDraggingCv] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    fullName: profile.fullName || '',
    phoneNumber: profile.phoneNumber || '',
    dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
    bio: profile.bio || '',
    address: profile.address || '',
    gender: profile.gender,
    region: profile.region || '',
    city: profile.city || '',
  });

  // Get cities for selected region
  const selectedRegion = SAUDI_REGIONS.find(r => r.name === form.region);
  const availableCities = selectedRegion?.cities || [];

  useEffect(() => {
    setForm({
      fullName: profile.fullName || '',
      phoneNumber: profile.phoneNumber || '',
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
      bio: profile.bio || '',
      address: profile.address || '',
      gender: profile.gender,
      region: profile.region || '',
      city: profile.city || '',
    });
  }, [profile]);

  // Close avatar menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) {
        setShowAvatarMenu(false);
      }
    };
    if (showAvatarMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showAvatarMenu]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'gender') {
      setForm(prev => ({ ...prev, gender: Number(value) }));
    } else if (name === 'region') {
      setForm(prev => ({ ...prev, region: value, city: '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data: UpdateProfileData = {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        dateOfBirth: form.dateOfBirth || undefined,
        bio: form.bio,
        address: form.address,
        gender: form.gender,
        region: form.region || undefined,
        city: form.city || undefined,
      };
      const res = await ClientProfileService.updateMyProfile(data);
      if (res.succeeded) {
        showToast('تم حفظ التغييرات بنجاح', 'success');
        setEditing(false);
        onUpdate();
      } else {
        showToast(res.message || 'فشل الحفظ', 'error');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'فشل الحفظ';
      showToast(msg, 'error');
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAvatarFile(file);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const uploadAvatarFile = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      showToast('حجم الصورة يجب أن لا يتجاوز 2 ميجابايت', 'error');
      return;
    }
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(ext)) {
      showToast('نوع الملف غير مسموح. الأنواع المسموحة: JPG, PNG, WEBP', 'error');
      return;
    }
    setUploadingAvatar(true);
    setShowAvatarMenu(false);
    try {
      const res = await ClientProfileService.uploadAvatar(file);
      if (res.succeeded) {
        showToast('تم تحديث الصورة بنجاح', 'success');
        onUpdate();
      } else {
        showToast(res.message || 'فشل رفع الصورة', 'error');
      }
    } catch {
      showToast('فشل رفع الصورة', 'error');
    }
    setUploadingAvatar(false);
  };

  const handleDeleteAvatar = async () => {
    setDeletingAvatar(true);
    setShowAvatarMenu(false);
    try {
      const res = await ClientProfileService.deleteAvatar();
      if (res.succeeded) {
        showToast('تم حذف الصورة الشخصية', 'success');
        onUpdate();
      } else {
        showToast(res.message || 'فشل الحذف', 'error');
      }
    } catch {
      showToast('فشل حذف الصورة', 'error');
    }
    setDeletingAvatar(false);
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadCvFile(file);
    if (cvInputRef.current) cvInputRef.current.value = '';
  };

  const uploadCvFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast('حجم الملف يجب أن لا يتجاوز 5 ميجابايت', 'error');
      return;
    }
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(ext)) {
      showToast('نوع الملف غير مسموح. الأنواع المسموحة: PDF, DOC, DOCX', 'error');
      return;
    }
    setUploadingCv(true);
    try {
      const res = await ClientProfileService.uploadCv(file);
      if (res.succeeded) {
        showToast('تم رفع السيرة الذاتية بنجاح', 'success');
        onUpdate();
      } else {
        showToast(res.message || 'فشل رفع السيرة الذاتية', 'error');
      }
    } catch {
      showToast('فشل رفع السيرة الذاتية', 'error');
    }
    setUploadingCv(false);
  };

  const handleDeleteCv = async () => {
    setDeletingCv(true);
    try {
      const res = await ClientProfileService.deleteCv();
      if (res.succeeded) {
        showToast('تم حذف السيرة الذاتية', 'success');
        onUpdate();
      } else {
        showToast(res.message || 'فشل الحذف', 'error');
      }
    } catch {
      showToast('فشل حذف السيرة الذاتية', 'error');
    }
    setDeletingCv(false);
  };

  const handleCvDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingCv(true);
  };

  const handleCvDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingCv(false);
  };

  const handleCvDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingCv(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadCvFile(file);
  };

  const inputClass = "w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition bg-white";
  const inputDisabledClass = "w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-700";

  const joinedYear = profile.joinedDate ? new Date(profile.joinedDate).getFullYear() : '';

  return (
    <>
      {/* Personal Information Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-neutral-900">المعلومات الشخصية</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-primary hover:text-accent font-semibold flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faSave} className="ml-1" />
              تعديل
            </button>
          )}
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-8 border-b border-neutral-200">
          <div className="relative" ref={avatarMenuRef}>
            <img
              src={profile.profilePictureUrl ? getFileUrl(profile.profilePictureUrl) : DEFAULT_AVATAR}
              alt="الصورة الشخصية"
              className="w-32 h-32 rounded-2xl object-cover border-4 border-primary/20 shadow-lg bg-emerald-50"
            />
            <button
              onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              disabled={uploadingAvatar || deletingAvatar}
              className="absolute bottom-0 left-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent transition disabled:opacity-60"
            >
              {(uploadingAvatar || deletingAvatar) ? (
                <FontAwesomeIcon icon={faSpinner} spin className="text-sm" />
              ) : (
                <FontAwesomeIcon icon={faCamera} className="text-sm" />
              )}
            </button>

            {showAvatarMenu && (
              <div className="absolute bottom-12 left-0 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 min-w-[160px] z-50">
                <button
                  onClick={() => {
                    avatarInputRef.current?.click();
                    setShowAvatarMenu(false);
                  }}
                  className="w-full text-right px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary/5 hover:text-primary transition flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faCamera} className="text-xs" />
                  {profile.profilePictureUrl ? 'تغيير الصورة' : 'رفع صورة'}
                </button>
                {profile.profilePictureUrl && (
                  <button
                    onClick={handleDeleteAvatar}
                    className="w-full text-right px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="text-xs" />
                    حذف الصورة
                  </button>
                )}
              </div>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
          <div className="flex-1 text-center md:text-right">
            <h2 className="text-2xl font-black text-neutral-900 mb-1">
              {profile.fullName || 'مستخدم جديد'}
            </h2>
            {profile.bio && (
              <p className="text-neutral-600 text-sm mb-2 line-clamp-2">{profile.bio}</p>
            )}
            {!profile.bio && (
              <p className="text-neutral-400 text-sm mb-2">طالب في منصة باسقات</p>
            )}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-2">
              {joinedYear && (
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold">
                  عضو منذ {joinedYear}
                </span>
              )}
              {profile.profileCompletion === 100 && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                  ملف مكتمل
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-xs text-neutral-500">
              {profile.joinedDate && (
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faCalendar} className="text-primary/60" />
                  تاريخ التسجيل: {formatDate(profile.joinedDate)}
                </span>
              )}
              {profile.lastLogin && (
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faClock} className="text-primary/60" />
                  آخر دخول: {timeAgo(profile.lastLogin)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2 flex items-center">
              <FontAwesomeIcon icon={faUser} className="ml-2 text-primary" />
              الاسم الكامل
            </label>
            {editing ? (
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className={inputClass} placeholder="أدخل اسمك الكامل" />
            ) : (
              <div className={inputDisabledClass}>{form.fullName || '—'}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2 flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="ml-2 text-primary" />
              البريد الإلكتروني
            </label>
            <div className={inputDisabledClass + " cursor-not-allowed opacity-70"}>{profile.email || '—'}</div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2 flex items-center">
              <FontAwesomeIcon icon={faPhone} className="ml-2 text-primary" />
              رقم الهاتف
            </label>
            {editing ? (
              <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className={inputClass} placeholder="05XXXXXXXX" dir="ltr" />
            ) : (
              <div className={inputDisabledClass} dir="ltr">{form.phoneNumber || '—'}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2 flex items-center">
              <FontAwesomeIcon icon={faCalendar} className="ml-2 text-primary" />
              تاريخ الميلاد
            </label>
            {editing ? (
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={inputClass} />
            ) : (
              <div className={inputDisabledClass}>{form.dateOfBirth || '—'}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2 flex items-center">
              <FontAwesomeIcon icon={faVenusMars} className="ml-2 text-primary" />
              الجنس
            </label>
            {editing ? (
              <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                <option value={0}>غير محدد</option>
                <option value={1}>ذكر</option>
                <option value={2}>أنثى</option>
              </select>
            ) : (
              <div className={inputDisabledClass}>
                {form.gender === 1 ? 'ذكر' : form.gender === 2 ? 'أنثى' : 'غير محدد'}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2 flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="ml-2 text-primary" />
              العنوان
            </label>
            {editing ? (
              <input type="text" name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="العنوان التفصيلي" />
            ) : (
              <div className={inputDisabledClass}>{form.address || '—'}</div>
            )}
          </div>

          {/* Region Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2 flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="ml-2 text-primary" />
              المنطقة
            </label>
            {editing ? (
              <select name="region" value={form.region} onChange={handleChange} className={inputClass}>
                <option value="">اختر المنطقة</option>
                {SAUDI_REGIONS.map(r => (
                  <option key={r.name} value={r.name}>{r.name}</option>
                ))}
              </select>
            ) : (
              <div className={inputDisabledClass}>{form.region || '—'}</div>
            )}
          </div>

          {/* City Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2 flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="ml-2 text-primary" />
              المدينة
            </label>
            {editing ? (
              <select name="city" value={form.city} onChange={handleChange} className={inputClass} disabled={!form.region}>
                <option value="">اختر المدينة</option>
                {availableCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <div className={inputDisabledClass}>{form.city || '—'}</div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-neutral-700 mb-2 flex items-center">
              <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-primary" />
              نبذة عني
            </label>
            {editing ? (
              <>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  className={inputClass + " resize-none"}
                  placeholder="اكتب نبذة مختصرة عنك..."
                />
                <p className="text-xs text-neutral-500 mt-1">{500 - form.bio.length} حرف متبقي</p>
              </>
            ) : (
              <div className={inputDisabledClass + " min-h-[80px] whitespace-pre-wrap"}>{form.bio || '—'}</div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {editing && (
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-6 border-t border-neutral-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-accent transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSave} />}
              حفظ التغييرات
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setForm({
                  fullName: profile.fullName || '',
                  phoneNumber: profile.phoneNumber || '',
                  dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
                  bio: profile.bio || '',
                  address: profile.address || '',
                  gender: profile.gender,
                  region: profile.region || '',
                  city: profile.city || '',
                });
              }}
              className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition"
            >
              إلغاء
            </button>
          </div>
        )}
      </div>

      {/* CV Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-neutral-900">السيرة الذاتية</h2>
        </div>

        {profile.cvUrl ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faFilePdf} className="text-primary text-2xl" />
            </div>
            <div className="flex-1 text-center sm:text-right">
              <p className="font-bold text-neutral-900">السيرة الذاتية مرفوعة</p>
              <p className="text-xs text-neutral-600">يمكنك تحديث الملف أو حذفه</p>
            </div>
            <div className="flex gap-2">
              <a
                href={getFileUrl(profile.cvUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-accent transition text-sm"
              >
                <FontAwesomeIcon icon={faDownload} className="ml-1" />
                تحميل
              </a>
              <button
                onClick={() => cvInputRef.current?.click()}
                disabled={uploadingCv}
                className="px-4 py-2 border border-primary/30 text-primary rounded-lg font-semibold hover:bg-primary/5 transition text-sm disabled:opacity-60"
              >
                {uploadingCv ? <FontAwesomeIcon icon={faSpinner} spin /> : 'تحديث'}
              </button>
              <button
                onClick={handleDeleteCv}
                disabled={deletingCv}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition text-sm disabled:opacity-60"
              >
                {deletingCv ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faTrashAlt} />}
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => !uploadingCv && cvInputRef.current?.click()}
            onDragOver={handleCvDragOver}
            onDragLeave={handleCvDragLeave}
            onDrop={handleCvDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition group ${
              draggingCv
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : 'border-neutral-300 hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            {uploadingCv ? (
              <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary mb-3" />
            ) : draggingCv ? (
              <FontAwesomeIcon icon={faCloudUploadAlt} className="text-4xl text-primary mb-3 animate-bounce" />
            ) : (
              <FontAwesomeIcon icon={faFileUpload} className="text-4xl text-neutral-400 group-hover:text-primary mb-3 transition" />
            )}
            <p className="font-bold text-neutral-700 group-hover:text-primary transition">
              {uploadingCv ? 'جاري الرفع...' : draggingCv ? 'أفلت الملف هنا' : 'اسحب وأفلت أو اضغط لرفع السيرة الذاتية'}
            </p>
            <p className="text-xs text-neutral-500 mt-1">PDF, DOC, DOCX - حد أقصى 5 ميجابايت</p>
          </div>
        )}
        <input
          ref={cvInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleCvUpload}
        />
      </div>

      {/* Skills & Interests Card */}
      <SkillsInterestsCard profile={profile} onUpdate={onUpdate} showToast={showToast} />
    </>
  );
}

// ===== Skills & Interests Card =====
function SkillsInterestsCard({
  profile,
  onUpdate,
  showToast,
}: {
  profile: ClientProfileData;
  onUpdate: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}) {
  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [interests, setInterests] = useState<string[]>(profile.interests || []);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [savingSkills, setSavingSkills] = useState(false);

  useEffect(() => {
    setSkills(profile.skills || []);
    setInterests(profile.interests || []);
  }, [profile]);

  const saveSkillsAndInterests = async (updatedSkills: string[], updatedInterests: string[]) => {
    setSavingSkills(true);
    try {
      const res = await ClientProfileService.updateMyProfile({
        skills: updatedSkills,
        interests: updatedInterests,
      });
      if (res.succeeded) {
        showToast('تم الحفظ بنجاح', 'success');
        onUpdate();
      } else {
        showToast(res.message || 'فشل الحفظ', 'error');
      }
    } catch {
      showToast('فشل الحفظ', 'error');
    }
    setSavingSkills(false);
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    const updated = [...skills, trimmed];
    setSkills(updated);
    setNewSkill('');
    saveSkillsAndInterests(updated, interests);
  };

  const removeSkill = (skill: string) => {
    const updated = skills.filter(s => s !== skill);
    setSkills(updated);
    saveSkillsAndInterests(updated, interests);
  };

  const addInterest = () => {
    const trimmed = newInterest.trim();
    if (!trimmed || interests.includes(trimmed)) return;
    const updated = [...interests, trimmed];
    setInterests(updated);
    setNewInterest('');
    saveSkillsAndInterests(skills, updated);
  };

  const removeInterest = (interest: string) => {
    const updated = interests.filter(i => i !== interest);
    setInterests(updated);
    saveSkillsAndInterests(skills, updated);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-neutral-900">المهارات والاهتمامات</h2>
        {savingSkills && (
          <span className="text-xs text-primary font-semibold flex items-center gap-1">
            <FontAwesomeIcon icon={faSpinner} spin />
            جاري الحفظ...
          </span>
        )}
      </div>

      {/* Skills */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-neutral-700 mb-3">المهارات</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((skill) => (
            <span key={skill} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold flex items-center gap-2 group">
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                disabled={savingSkills}
                className="opacity-40 group-hover:opacity-100 hover:text-red-500 transition disabled:opacity-20"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xs" />
              </button>
            </span>
          ))}
          {skills.length === 0 && <span className="text-sm text-neutral-400">لا توجد مهارات - أضف مهاراتك</span>}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
            disabled={savingSkills}
            className="flex-1 px-4 py-2 border border-neutral-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm disabled:opacity-60"
            placeholder="أضف مهارة واضغط Enter..."
          />
          <button
            onClick={addSkill}
            disabled={savingSkills || !newSkill.trim()}
            className="px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-accent transition text-sm disabled:opacity-40"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-3">الاهتمامات</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {interests.map((interest) => (
            <span key={interest} className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold flex items-center gap-2 group">
              {interest}
              <button
                onClick={() => removeInterest(interest)}
                disabled={savingSkills}
                className="opacity-40 group-hover:opacity-100 hover:text-red-500 transition disabled:opacity-20"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xs" />
              </button>
            </span>
          ))}
          {interests.length === 0 && <span className="text-sm text-neutral-400">لا توجد اهتمامات - أضف اهتماماتك</span>}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newInterest}
            onChange={e => setNewInterest(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }}
            disabled={savingSkills}
            className="flex-1 px-4 py-2 border border-neutral-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm disabled:opacity-60"
            placeholder="أضف اهتمام واضغط Enter..."
          />
          <button
            onClick={addInterest}
            disabled={savingSkills || !newInterest.trim()}
            className="px-4 py-2 bg-accent text-white rounded-xl font-semibold hover:bg-accent/80 transition text-sm disabled:opacity-40"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Security Tab =====
function SecurityTab({
  showToast,
}: {
  showToast: (msg: string, type: 'success' | 'error') => void;
}) {
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [visibility, setVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
    setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      showToast('يرجى تعبئة جميع الحقول', 'error');
      return;
    }
    if (passwords.new.length < 6) {
      showToast('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل', 'error');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      showToast('كلمة المرور الجديدة غير متطابقة مع التأكيد', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await ClientProfileService.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
        confirmNewPassword: passwords.confirm,
      });
      if (res.succeeded) {
        showToast('تم تغيير كلمة المرور بنجاح', 'success');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        showToast(res.message || 'فشل تغيير كلمة المرور', 'error');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'فشل تغيير كلمة المرور';
      showToast(msg, 'error');
    }
    setSaving(false);
  };

  const passwordFields = [
    { id: 'current' as const, label: 'كلمة المرور الحالية', icon: faLock, placeholder: 'أدخل كلمة المرور الحالية' },
    { id: 'new' as const, label: 'كلمة المرور الجديدة', icon: faKey, placeholder: 'أدخل كلمة مرور جديدة (6 أحرف على الأقل)' },
    { id: 'confirm' as const, label: 'تأكيد كلمة المرور الجديدة', icon: faCheckDouble, placeholder: 'أعد إدخال كلمة المرور' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-black text-neutral-900 mb-1">تغيير كلمة المرور</h2>
          <p className="text-sm text-neutral-600">قم بتحديث كلمة المرور بانتظام لحماية حسابك</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={faShieldAlt} className="text-red-500" />
        </div>
      </div>

      <div className="space-y-5">
        {passwordFields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-semibold text-neutral-700 mb-2 flex items-center">
              <FontAwesomeIcon icon={field.icon} className="ml-2 text-primary" />
              {field.label}
            </label>
            <div className="relative">
              <input
                type={visibility[field.id] ? 'text' : 'password'}
                name={field.id}
                value={passwords[field.id]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition pr-12"
              />
              <button
                type="button"
                onClick={() => toggleVisibility(field.id)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-primary transition"
              >
                <FontAwesomeIcon icon={visibility[field.id] ? faEyeSlash : faEye} />
              </button>
            </div>
            {field.id === 'new' && passwords.new.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <FontAwesomeIcon icon={faCheck} className={passwords.new.length >= 6 ? 'text-green-500' : 'text-neutral-300'} />
                  <span className="text-neutral-600">6 أحرف على الأقل</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <FontAwesomeIcon icon={faCheck} className={passwords.new === passwords.confirm && passwords.confirm.length > 0 ? 'text-green-500' : 'text-neutral-300'} />
                  <span className="text-neutral-600">متطابقة مع التأكيد</span>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="pt-4 border-t border-neutral-200">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-accent transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSave} />}
            تحديث كلمة المرور
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Social Links Tab =====
function SocialLinksTab({
  profile,
  onUpdate,
  showToast,
}: {
  profile: ClientProfileData;
  onUpdate: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}) {
  const [saving, setSaving] = useState(false);
  const [links, setLinks] = useState({
    linkedInUrl: profile.linkedInUrl || '',
    xUrl: profile.xUrl || '',
    gitHubUrl: profile.gitHubUrl || '',
    facebookUrl: profile.facebookUrl || '',
    instagramUrl: profile.instagramUrl || '',
    websiteUrl: profile.websiteUrl || '',
  });

  useEffect(() => {
    setLinks({
      linkedInUrl: profile.linkedInUrl || '',
      xUrl: profile.xUrl || '',
      gitHubUrl: profile.gitHubUrl || '',
      facebookUrl: profile.facebookUrl || '',
      instagramUrl: profile.instagramUrl || '',
      websiteUrl: profile.websiteUrl || '',
    });
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLinks(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await ClientProfileService.updateMyProfile(links);
      if (res.succeeded) {
        showToast('تم حفظ الروابط بنجاح', 'success');
        onUpdate();
      } else {
        showToast(res.message || 'فشل الحفظ', 'error');
      }
    } catch {
      showToast('فشل حفظ الروابط', 'error');
    }
    setSaving(false);
  };

  const socialFields = [
    { name: 'linkedInUrl', icon: faLinkedin, title: 'LinkedIn', placeholder: 'https://linkedin.com/in/username', color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'xUrl', icon: faTwitter, title: 'X (Twitter)', placeholder: 'https://x.com/username', color: 'text-sky-500', bg: 'bg-sky-50' },
    { name: 'gitHubUrl', icon: faGithub, title: 'GitHub', placeholder: 'https://github.com/username', color: 'text-neutral-800', bg: 'bg-neutral-100' },
    { name: 'facebookUrl', icon: faFacebook, title: 'Facebook', placeholder: 'https://facebook.com/username', color: 'text-blue-700', bg: 'bg-blue-50' },
    { name: 'instagramUrl', icon: faInstagram, title: 'Instagram', placeholder: 'https://instagram.com/username', color: 'text-pink-600', bg: 'bg-pink-50' },
    { name: 'websiteUrl', icon: faGlobe, title: 'الموقع الشخصي', placeholder: 'https://example.com', color: 'text-primary', bg: 'bg-primary/5' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-black text-neutral-900 mb-1">الروابط الاجتماعية</h2>
          <p className="text-sm text-neutral-600">أضف روابط حساباتك لعرضها في ملفك الشخصي</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={faShareAlt} className="text-purple-500" />
        </div>
      </div>

      <div className="space-y-5">
        {socialFields.map((field) => {
          const value = links[field.name as keyof typeof links];
          return (
            <div key={field.name} className="p-4 border border-neutral-200 rounded-xl hover:border-primary/30 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${field.bg} flex items-center justify-center`}>
                  <FontAwesomeIcon icon={field.icon} className={field.color} />
                </div>
                <div>
                  <p className="font-bold text-neutral-900 text-sm">{field.title}</p>
                </div>
                {value && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-semibold mr-auto">
                    مربوط
                  </span>
                )}
              </div>
              <input
                type="url"
                name={field.name}
                value={value}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition text-sm"
                dir="ltr"
              />
            </div>
          );
        })}

        <div className="pt-4 border-t border-neutral-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-accent transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSave} />}
            حفظ جميع التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}
