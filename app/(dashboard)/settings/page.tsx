"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faUsers,
  faUserShield,
  faUserTag,
  faTags,
  faLayerGroup,
  faTicketAlt,
  faMoneyBillWave,
  faCity,
  faArrowLeft,
  faShieldAlt,
  faSpinner,
  faEnvelopeCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { AppSettingsService } from "@/services/dashboard/app-settings/page";

const settingsList = [
  {
    title: "إدارة الباقات",
    href: "/plans",
    icon: faBox,
    bg: "bg-primary/10",
    hoverBg: "group-hover:bg-primary",
    color: "text-primary",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-primary",
  },
  {
    title: "إدارة المستخدمين",
    href: "/users",
    icon: faUsers,
    bg: "bg-blue-50",
    hoverBg: "group-hover:bg-blue-600",
    color: "text-blue-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-blue-600",
  },
  {
    title: "الصلاحيات",
    href: "/Privileges",
    icon: faUserShield,
    bg: "bg-green-50",
    hoverBg: "group-hover:bg-green-600",
    color: "text-green-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-green-600",
  },
  {
    title: "إدارة المجموعات",
    href: "/Roles",
    icon: faUserTag,
    bg: "bg-orange-50",
    hoverBg: "group-hover:bg-orange-600",
    color: "text-orange-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-orange-600",
  },
  {
    title: "إدارة الوسوم",
    href: "/Tag",
    icon: faTags,
    bg: "bg-purple-50",
    hoverBg: "group-hover:bg-purple-600",
    color: "text-purple-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-purple-600",
  },
  {
    title: "إدارة فئات الخدمات",
    href: "/ServiceCategories",
    icon: faLayerGroup,
    bg: "bg-indigo-50",
    hoverBg: "group-hover:bg-indigo-600",
    color: "text-indigo-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-indigo-600",
  },
  {
    title: "إدارة الكوبونات",
    href: "/coupons",
    icon: faTicketAlt,
    bg: "bg-pink-50",
    hoverBg: "group-hover:bg-pink-600",
    color: "text-pink-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-pink-600",
  },
  {
    title: "سجل المدفوعات",
    href: "/userPayments",
    icon: faMoneyBillWave,
    bg: "bg-yellow-50",
    hoverBg: "group-hover:bg-yellow-600",
    color: "text-yellow-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-yellow-600",
  },
  {
    title: "إدارة المدن",
    href: "/city",
    icon: faCity,
    bg: "bg-cyan-50",
    hoverBg: "group-hover:bg-cyan-600",
    color: "text-cyan-600",
    hoverColor: "group-hover:text-white",
    arrowHover: "group-hover:text-cyan-600",
  },
];

interface AppSettingItem {
  key: string;
  value: string;
  description: string | null;
}

export default function Settings() {
  const [settings, setSettings] = useState<AppSettingItem[]>([]);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await AppSettingsService.getAll();
      if (res.succeeded && Array.isArray(res.data)) {
        setSettings(res.data);
      }
    } catch {
      // silent
    } finally {
      setLoadingSettings(false);
    }
  };

  const toggleSetting = async (key: string, currentValue: string) => {
    const newValue = currentValue === "true" ? "false" : "true";
    setUpdatingKey(key);
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value: newValue } : s));
    try {
      const res = await AppSettingsService.update(key, newValue);
      if (!res.succeeded) {
        setSettings(prev => prev.map(s => s.key === key ? { ...s, value: currentValue } : s));
      }
    } catch {
      setSettings(prev => prev.map(s => s.key === key ? { ...s, value: currentValue } : s));
    } finally {
      setUpdatingKey(null);
    }
  };

  const getSettingIcon = (key: string) => {
    if (key === "RequireEmailConfirmation") return faEnvelopeCircleCheck;
    return faShieldAlt;
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 fade-in-up delay-200">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          الاعدادات
        </h1>
      </div>

      {/* إعدادات الأمان */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faShieldAlt} className="text-emerald-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">إعدادات الأمان</h2>
            <p className="text-sm text-gray-500">التحكم في إعدادات التسجيل والمصادقة</p>
          </div>
        </div>

        {loadingSettings ? (
          <div className="flex justify-center py-6">
            <FontAwesomeIcon icon={faSpinner} className="text-emerald-700 text-xl animate-spin" />
          </div>
        ) : settings.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">لا توجد إعدادات</p>
        ) : (
          <div className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={getSettingIcon(setting.key)} className="text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{setting.description || setting.key}</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{setting.key}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting(setting.key, setting.value)}
                  disabled={updatingKey === setting.key}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                    setting.value === "true" ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  {updatingKey === setting.key ? (
                    <FontAwesomeIcon icon={faSpinner} className="text-white text-xs animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  ) : (
                    <span
                      className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-200 ${
                        setting.value === "true" ? "left-0.5" : "left-[calc(100%-1.625rem)]"
                      }`}
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsList.map((item, index) => (
          <Link key={index} href={item.href} className="block group">
            <div className="bg-white rounded-xl card-shadow p-6 hover:shadow-lg transition-all transform group-hover:-translate-y-1 h-full cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div
                    className={`w-12 h-12 ${item.bg} rounded-full flex items-center justify-center ${item.hoverBg} transition-colors`}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`${item.color} text-xl ${item.hoverColor} transition-colors`}
                    />
                  </div>
                  <div className="mr-3">
                    <h3 className="font-bold text-lg text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <div
                  className={`text-gray-400 ${item.arrowHover} transition-colors`}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
