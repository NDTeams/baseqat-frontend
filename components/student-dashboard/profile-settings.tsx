'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faLock,
  faBell,
  faLink,
  faCamera,
  faEdit,
  faSave,
  faPlus,
  faTimes,
  faShieldAlt,
  faEye,
  faEyeSlash,
  faKey,
  faCheckDouble,
  faCheck,
  faSms,
  faMobileAlt,
  faDesktop,
  faSignOutAlt,
  faEnvelope,
  faBookOpen,
  faTasks,
  faCertificate,
  faComments,
  faBullhorn,
  faWindowMaximize,
  faInfoCircle,
  faChartLine,
  faDownload,
  faShareAlt,
  faChevronLeft,
  faGlobe,
  faMapMarkerAlt,
  faPhone,
  faCalendar,
  faClock,
  faSync,
  faUnlink,
} from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedin,
  faTwitter,
  faGithub,
  faFacebook,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'notifications' | 'social'>('personal');
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [profileCompletion, setProfileCompletion] = useState(80);

  // Initialize AOS on client side only
//   useEffect(() => {
//     let aos;
//     import('aos').then((AOS) => {
//       aos = AOS.default;
//       aos.init({ duration: 1000, once: true, offset: 100 });
//     });

    // Cleanup AOS on unmount
//     return () => {
//       if (aos?.refresh) aos.refresh();
//     };
//   }, []);

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoTab />;
      case 'security':
        return <SecurityTab passwordVisibility={passwordVisibility} togglePassword={togglePasswordVisibility} />;
      case 'notifications':
        return <NotificationsTab />;
      case 'social':
        return <SocialLinksTab />;
      default:
        return <PersonalInfoTab />;
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-neutral-50 font-cairo">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-primary text-xl" />
            </div>
            <h1 className="text-2xl font-black text-neutral-900">الإعدادات</h1>
          </div>
          <button className="p-2 hover:bg-neutral-100 rounded-xl transition">
            <FontAwesomeIcon icon={faGlobe} className="text-xl text-neutral-700" />
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6" data-aos="fade-up">
          <div className="flex flex-wrap gap-3 border-b border-neutral-200">
            {[
              { id: 'personal', icon: faUser, label: 'المعلومات الشخصية' },
              { id: 'security', icon: faLock, label: 'الأمان' },
              { id: 'notifications', icon: faBell, label: 'الإشعارات' },
              { id: 'social', icon: faLink, label: 'الروابط الاجتماعية' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 font-semibold transition relative ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-600 hover:text-primary border-b-2 border-transparent'
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="ml-2" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-primary rounded-t-lg" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tab Content */}
          <div className="lg:col-span-2 space-y-6">
            {getTabContent()}
          </div>

          {/* Sidebar - Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-lg font-black text-neutral-900 mb-6 flex items-center">
                <FontAwesomeIcon icon={faChartLine} className="text-primary ml-2" />
                الإحصائيات
              </h3>
              <div className="space-y-5">
                {[
                  { icon: faBookOpen, label: 'الدورات المسجلة', value: '5', color: 'primary' },
                  { icon: faCertificate, label: 'الشهادات', value: '4', color: 'accent' },
                  { icon: faClock, label: 'ساعات التعلم', value: '120', color: 'blue-500' },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 bg-${stat.color}/5 rounded-xl`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                        <FontAwesomeIcon icon={stat.icon} className={`text-${stat.color}`} />
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
            <div
              className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h3 className="text-lg font-black mb-4">اكتمال الملف الشخصي</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-90">{profileCompletion}%</span>
                  <span className="text-xs opacity-75">4/5 أقسام</span>
                </div>
                <div className="h-3 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs opacity-80 mb-4">
                أكمل ملفك الشخصي للحصول على تجربة أفضل
              </p>
              <button className="w-full bg-white text-primary py-2.5 rounded-xl font-semibold hover:bg-neutral-100 transition text-sm">
                إكمال الملف
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6" data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-lg font-black text-neutral-900 mb-4">إجراءات سريعة</h3>
              <div className="space-y-2">
                {[
                  { icon: faDownload, label: 'تحميل السيرة الذاتية' },
                  { icon: faShareAlt, label: 'مشاركة الملف الشخصي' },
                  { icon: faEye, label: 'معاينة الملف' },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="w-full text-right px-4 py-3 rounded-xl hover:bg-neutral-50 transition text-sm font-semibold text-neutral-700 flex items-center justify-between"
                  >
                    <span>
                      <FontAwesomeIcon icon={action.icon} className="ml-2" />
                      {action.label}
                    </span>
                    <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-lg">
        <div className="flex items-center justify-around py-3 px-2">
          {[
            { icon: faUser, label: 'الملف' },
            { icon: faBookOpen, label: 'الدورات' },
            { icon: faTasks, label: 'المهام' },
            { icon: faCertificate, label: 'الشهادات' },
            { icon: faBell, label: 'الإشعارات' },
          ].map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all ${
                index === 0 ? 'text-primary bg-primary/10' : 'text-neutral-600'
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className={`text-xl ${index === 0 ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
              {index === 0 && (
                <div className="absolute top-1 right-1/2 transform translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// Personal Information Tab Component
function PersonalInfoTab() {
  return (
    <>
      {/* Personal Information Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-neutral-900">المعلومات الشخصية</h2>
          <button className="text-sm text-primary hover:text-accent font-semibold flex items-center">
            <FontAwesomeIcon icon={faEdit} className="ml-1" />
            تعديل
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-8 border-b border-neutral-200">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=90"
              alt="المستخدم"
              className="w-32 h-32 rounded-2xl object-cover border-4 border-primary/20 shadow-lg"
            />
            <button className="absolute bottom-0 left-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent transition">
              <FontAwesomeIcon icon={faCamera} className="text-sm" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-right">
            <h2 className="text-2xl font-black text-neutral-900 mb-2">أحمد محمد</h2>
            <p className="text-neutral-600 mb-3">طالب في منصة باسقات</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                مستوى متقدم
              </span>
              <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold">
                عضو منذ 2024
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[ 
            { label: 'الاسم الكامل', icon: faUser, value: 'أحمد محمد', type: 'text' },
            { label: 'البريد الإلكتروني', icon: faEnvelope, value: 'ahmed@example.com', type: 'email' },
            { label: 'رقم الهاتف', icon: faPhone, value: '+966501234567', type: 'tel' },
            { label: 'تاريخ الميلاد', icon: faCalendar, value: '1995-05-15', type: 'date' },
          ].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-semibold text-neutral-700 mb-2 flex items-center">
                <FontAwesomeIcon icon={field.icon} className="ml-2 text-primary" />
                {field.label}
              </label>
              <input
                type={field.type}
                value={field.value}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition"
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-neutral-700 mb-2 flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="ml-2 text-primary" />
              العنوان
            </label>
            <input
              type="text"
              value="المدينة المنورة، المملكة العربية السعودية"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-neutral-700 mb-2 flex items-center">
              <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-primary" />
              نبذة عني
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition resize-none"
            >
              طالب مهتم بالتحول الرقمي وتطوير الأعمال. أسعى لتطوير مهاراتي في مجال التكنولوجيا وريادة الأعمال من خلال الدورات المتخصصة في منصة باسقات.
            </textarea>
            <p className="text-xs text-neutral-500 mt-1">500 حرف متبقي</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-6 border-t border-neutral-200">
          <button className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-accent transition shadow-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faSave} className="ml-2" />
            حفظ التغييرات
          </button>
          <button className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition">
            إلغاء
          </button>
        </div>
      </div>

      {/* Skills & Interests Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up" data-aos-delay="100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-neutral-900">المهارات والاهتمامات</h2>
          <button className="text-sm text-primary hover:text-accent font-semibold flex items-center">
            <FontAwesomeIcon icon={faPlus} className="ml-1" />
            إضافة
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-3">المهارات</label>
            <div className="flex flex-wrap gap-2">
              {['التحول الرقمي', 'تطوير الويب', 'إدارة المشاريع'].map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold flex items-center gap-2"
                >
                  {skill}
                  <button className="hover:text-red-500 transition">
                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                  </button>
                </span>
              ))}
              <button className="px-4 py-2 border-2 border-dashed border-neutral-300 text-neutral-600 rounded-full text-sm font-semibold hover:border-primary hover:text-primary transition">
                <FontAwesomeIcon icon={faPlus} className="ml-1" />
                إضافة مهارة
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-3">الاهتمامات</label>
            <div className="flex flex-wrap gap-2">
              {['ريادة الأعمال', 'التكنولوجيا'].map((interest, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold flex items-center gap-2"
                >
                  {interest}
                  <button className="hover:text-red-500 transition">
                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                  </button>
                </span>
              ))}
              <button className="px-4 py-2 border-2 border-dashed border-neutral-300 text-neutral-600 rounded-full text-sm font-semibold hover:border-accent hover:text-accent transition">
                <FontAwesomeIcon icon={faPlus} className="ml-1" />
                إضافة اهتمام
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Security Tab Component
function SecurityTab({
  passwordVisibility,
  togglePassword,
}: {
  passwordVisibility: { current: boolean; new: boolean; confirm: boolean };
  togglePassword: (field: 'current' | 'new' | 'confirm') => void;
}) {
  return (
    <>
      {/* Change Password Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up">
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
          {[ 
            { id: 'current', label: 'كلمة المرور الحالية', icon: faLock, placeholder: 'أدخل كلمة المرور الحالية' },
            { id: 'new', label: 'كلمة المرور الجديدة', icon: faKey, placeholder: 'أدخل كلمة مرور جديدة' },
            { id: 'confirm', label: 'تأكيد كلمة المرور الجديدة', icon: faCheckDouble, placeholder: 'أعد إدخال كلمة المرور' },
          ].map((field, index) => (
            <div key={field.id}>
              <label className="block text-sm font-semibold text-neutral-700 mb-2 flex items-center">
                <FontAwesomeIcon icon={field.icon} className="ml-2 text-primary" />
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={passwordVisibility[field.id as keyof typeof passwordVisibility] ? 'text' : 'password'}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => togglePassword(field.id as 'current' | 'new' | 'confirm')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-primary transition"
                >
                  <FontAwesomeIcon
                    icon={
                      passwordVisibility[field.id as keyof typeof passwordVisibility]
                        ? faEyeSlash
                        : faEye
                    }
                  />
                </button>
              </div>
              {field.id === 'new' && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                    <span className="text-neutral-600">8 أحرف على الأقل</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                    <span className="text-neutral-600">تحتوي على حروف وأرقام</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="pt-4 border-t border-neutral-200">
            <button className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-accent transition shadow-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faSave} className="ml-2" />
              تحديث كلمة المرور
            </button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up" data-aos-delay="100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-black text-neutral-900 mb-1">المصادقة الثنائية</h2>
            <p className="text-sm text-neutral-600">طبقة إضافية من الحماية لحسابك</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faMobileAlt} className="text-blue-500" />
          </div>
        </div>
        <div className="space-y-4">
          {[ 
            { 
              icon: faSms, 
              title: 'المصادقة عبر الرسائل النصية', 
              desc: '+966 50 *** 567',
              color: 'blue-500',
              checked: true 
            },
            { 
              icon: faMobileAlt, 
              title: 'تطبيق المصادقة', 
              desc: 'Google Authenticator أو Microsoft Authenticator',
              color: 'green-500',
              checked: false 
            },
          ].map((method, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${method.color}/10 flex items-center justify-center`}>
                  <FontAwesomeIcon icon={method.icon} className={`text-${method.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{method.title}</p>
                  <p className="text-xs text-neutral-600">{method.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={method.checked} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
          <button className="w-full border-2 border-dashed border-neutral-300 text-neutral-600 py-3 rounded-xl font-semibold hover:border-primary hover:text-primary transition">
            <FontAwesomeIcon icon={faPlus} className="ml-2" />
            إضافة طريقة مصادقة أخرى
          </button>
        </div>
      </div>

      {/* Active Sessions Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up" data-aos-delay="200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-neutral-900 mb-1">الجلسات النشطة</h2>
            <p className="text-sm text-neutral-600">إدارة الأجهزة التي سجلت دخولها إلى حسابك</p>
          </div>
        </div>
        <div className="space-y-4">
          {[ 
            { 
              icon: faDesktop, 
              title: 'Windows - Chrome', 
              location: 'المدينة المنورة، السعودية • نشط الآن',
              lastActive: 'آخر نشاط: قبل 5 دقائق',
              active: true,
              color: 'primary'
            },
            { 
              icon: faMobileAlt, 
              title: 'iPhone - Safari', 
              location: 'المدينة المنورة، السعودية',
              lastActive: 'آخر نشاط: قبل 3 أيام',
              active: false,
              color: 'blue-500'
            },
          ].map((session, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-neutral-200 rounded-xl gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-${session.color}/10 flex items-center justify-center`}>
                  <FontAwesomeIcon icon={session.icon} className={`text-${session.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{session.title}</p>
                  <p className="text-xs text-neutral-600">{session.location}</p>
                  <p className="text-xs text-neutral-500">{session.lastActive}</p>
                </div>
              </div>
              {session.active ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold self-start sm:self-auto">
                  نشط
                </span>
              ) : (
                <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition self-start sm:self-auto">
                  <FontAwesomeIcon icon={faSignOutAlt} className="ml-1" />
                  تسجيل الخروج
                </button>
              )}
            </div>
          ))}
          <button className="w-full border border-red-300 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition">
            <FontAwesomeIcon icon={faSignOutAlt} className="ml-2" />
            تسجيل الخروج من جميع الأجهزة
          </button>
        </div>
      </div>
    </>
  );
}

// Notifications Tab Component
function NotificationsTab() {
  return (
    <>
      {/* Email Notifications Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-black text-neutral-900 mb-1">إشعارات البريد الإلكتروني</h2>
            <p className="text-sm text-neutral-600">اختر الإشعارات التي تريد استلامها عبر البريد</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faEnvelope} className="text-blue-500" />
          </div>
        </div>
        <div className="space-y-4">
          {[ 
            { icon: faBookOpen, title: 'إشعارات الدورات', desc: 'إشعارات حول الدورات المسجلة والدروس الجديدة', checked: true },
            { icon: faTasks, title: 'إشعارات المهام', desc: 'تذكيرات بالمواعيد النهائية للمهام', checked: true },
            { icon: faCertificate, title: 'إشعارات الشهادات', desc: 'عند إصدار شهادة جديدة أو تحديثها', checked: true },
            { icon: faComments, title: 'إشعارات الاستشارات', desc: 'تحديثات حول جلسات الاستشارة', checked: false },
            { icon: faBullhorn, title: 'الإعلانات والعروض', desc: 'عروض خاصة ودورات جديدة', checked: false },
          ].map((notification, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={notification.icon} className="text-primary" />
                <div>
                  <p className="font-semibold text-neutral-900">{notification.title}</p>
                  <p className="text-xs text-neutral-600">{notification.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={notification.checked} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up" data-aos-delay="100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-black text-neutral-900 mb-1">الإشعارات الفورية</h2>
            <p className="text-sm text-neutral-600">إشعارات على المتصفح والهاتف</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faBell} className="text-green-500" />
          </div>
        </div>
        <div className="space-y-4">
          {[ 
            { icon: faWindowMaximize, title: 'إشعارات المتصفح', desc: 'إشعارات على متصفح الويب', checked: true },
            { icon: faMobileAlt, title: 'إشعارات الهاتف', desc: 'إشعارات على تطبيق الهاتف', checked: false },
          ].map((notification, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={notification.icon} className="text-primary" />
                <div>
                  <p className="font-semibold text-neutral-900">{notification.title}</p>
                  <p className="text-xs text-neutral-600">{notification.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={notification.checked} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mt-1" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">ملاحظة</p>
                <p className="text-xs text-blue-700">
                  يجب تفعيل الإشعارات في إعدادات المتصفح لتلقي الإشعارات الفورية
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Frequency Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up" data-aos-delay="200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-neutral-900 mb-1">تكرار الإشعارات</h2>
            <p className="text-sm text-neutral-600">اختر متى تريد استلام الإشعارات</p>
          </div>
        </div>
        <div className="space-y-3">
          {[ 
            { value: 'instant', title: 'فوري', desc: 'استلم الإشعارات فوراً عند حدوثها', checked: true },
            { value: 'daily', title: 'يومي', desc: 'ملخص يومي في نهاية كل يوم', checked: false },
            { value: 'weekly', title: 'أسبوعي', desc: 'ملخص أسبوعي كل يوم أحد', checked: false },
          ].map((frequency, index) => (
            <label
              key={index}
              className={`flex items-center p-4 rounded-xl cursor-pointer transition ${
                frequency.checked
                  ? 'border-2 border-primary bg-primary/5'
                  : 'border-2 border-neutral-200 hover:border-primary/50'
              }`}
            >
              <input
                type="radio"
                name="frequency"
                value={frequency.value}
                defaultChecked={frequency.checked}
                className="ml-3 text-primary"
              />
              <div className="flex-1">
                <p className="font-semibold text-neutral-900">{frequency.title}</p>
                <p className="text-xs text-neutral-600">{frequency.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}

// Social Links Tab Component
function SocialLinksTab() {
  return (
    <>
      {/* Social Media Links Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-black text-neutral-900 mb-1">الروابط الاجتماعية</h2>
            <p className="text-sm text-neutral-600">
              اربط حساباتك الاجتماعية لعرضها في ملفك الشخصي
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faShareAlt} className="text-purple-500" />
          </div>
        </div>
        <div className="space-y-5">
          {[ 
            { 
              icon: faLinkedin, 
              color: 'blue-600', 
              title: 'LinkedIn', 
              desc: 'اربط حساب LinkedIn الخاص بك',
              value: 'https://linkedin.com/in/ahmed-mohammed',
              connected: true 
            },
            { 
              icon: faTwitter, 
              color: 'sky-500', 
              title: 'Twitter', 
              desc: 'اربط حساب Twitter الخاص بك',
              value: '',
              connected: false 
            },
            { 
              icon: faGithub, 
              color: 'neutral-800', 
              title: 'GitHub', 
              desc: 'اربط حساب GitHub الخاص بك',
              value: 'https://github.com/ahmed-mohammed',
              connected: true 
            },
            { 
              icon: faFacebook, 
              color: 'blue-700', 
              title: 'Facebook', 
              desc: 'اربط حساب Facebook الخاص بك',
              value: '',
              connected: false 
            },
            { 
              icon: faInstagram, 
              color: 'from-purple-600 to-pink-500', 
              title: 'Instagram', 
              desc: 'اربط حساب Instagram الخاص بك',
              value: '',
              connected: false,
              gradient: true 
            },
            { 
              icon: faGlobe, 
              color: 'primary', 
              title: 'الموقع الشخصي', 
              desc: 'أضف رابط موقعك الشخصي أو مدونتك',
              value: '',
              connected: false 
            },
          ].map((social, index) => (
            <div
              key={index}
              className="p-5 border-2 border-neutral-200 rounded-xl hover:border-primary/50 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      social.gradient
                        ? 'bg-gradient-to-br from-purple-600/10 to-pink-500/10'
                        : `bg-${social.color}/10`
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={social.icon}
                      className={`text-2xl ${
                        social.gradient
                          ? 'text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-500'
                          : `text-${social.color}`
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{social.title}</p>
                    <p className="text-xs text-neutral-600">{social.desc}</p>
                  </div>
                </div>
                {social.title !== 'الموقع الشخصي' && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      social.connected
                        ? 'bg-green-100 text-green-700'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {social.connected ? 'مربوط' : 'غير مربوط'}
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                  type="url"
                  value={social.value}
                  placeholder={social.value || `https://${social.title.toLowerCase()}.com/username`}
                  className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition text-sm"
                />
                <div className="flex gap-2 w-full sm:w-auto">
                  {social.connected ? (
                    <>
                      <button
                        className={`px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition text-sm w-full sm:w-auto ${
                          social.gradient
                            ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                            : social.color.includes('neutral')
                            ? 'bg-neutral-800 text-white hover:bg-neutral-900'
                            : `bg-${social.color} text-white hover:bg-${social.color}/90`
                        }`}
                      >
                        <FontAwesomeIcon icon={faSync} className="ml-2" />
                        تحديث
                      </button>
                      <button className="px-4 py-2.5 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition text-sm">
                        <FontAwesomeIcon icon={faUnlink} />
                      </button>
                    </>
                  ) : (
                    <button
                      className={`px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition text-sm w-full ${
                        social.gradient
                          ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                          : social.color.includes('neutral')
                          ? 'bg-neutral-800 text-white hover:bg-neutral-900'
                          : `bg-${social.color} text-white hover:bg-${social.color}/90`
                      }`}
                    >
                      <FontAwesomeIcon icon={faLink} className="ml-2" />
                      {social.title === 'الموقع الشخصي' ? 'حفظ' : 'ربط'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t border-neutral-200">
            <button className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-accent transition shadow-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faSave} className="ml-2" />
              حفظ جميع التغييرات
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Settings Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up" data-aos-delay="100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-neutral-900 mb-1">إعدادات الخصوصية</h2>
            <p className="text-sm text-neutral-600">تحكم في من يمكنه رؤية روابطك الاجتماعية</p>
          </div>
        </div>
        <div className="space-y-4">
          {[ 
            { title: 'عرض الروابط للجميع', desc: 'يمكن لأي شخص يزور ملفك الشخصي رؤية روابطك', checked: true },
            { title: 'عرض الروابط للمسجلين فقط', desc: 'فقط المستخدمون المسجلون يمكنهم رؤية روابطك', checked: false },
          ].map((setting, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
              <div>
                <p className="font-semibold text-neutral-900">{setting.title}</p>
                <p className="text-xs text-neutral-600">{setting.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={setting.checked} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}