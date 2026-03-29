"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUserCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ClientProfileService, type ClientProfileData } from "@/services/client-profile/page";
import { getFileUrl } from "@/lib/config";

export default function DashboardHero() {
  const [profile, setProfile] = useState<ClientProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await ClientProfileService.getMyProfile();
        if (res.succeeded) setProfile(res.data);
      } catch {
        // silent - show fallback UI
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const displayName = profile?.fullName || "مستخدم";
  const avatarUrl = profile?.profilePictureUrl ? getFileUrl(profile.profilePictureUrl) : null;
  const completion = profile?.profileCompletion ?? 0;

  return (
    <section className="mb-10">
      <div className="relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-r from-[#2558FF] via-[#87B6DD] to-[#33FFBF] text-white">
        {/* shapes */}
        <div className="absolute -top-24 -left-10 w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 right-0 w-72 h-72 bg-black/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 px-6 md:px-10 py-8 md:py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Left */}
            <div className="space-y-5 max-w-xl">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs md:text-sm gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse"></span>
                <span>مرحباً بعودتك إلى لوحة تحكمك</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white/50 shadow-lg">
                  {loading ? (
                    <div className="w-full h-full bg-white/20 flex items-center justify-center">
                      <FontAwesomeIcon icon={faSpinner} spin className="text-white/60" />
                    </div>
                  ) : avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/20 flex items-center justify-center">
                      <FontAwesomeIcon icon={faUserCircle} className="text-3xl text-white/60" />
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm md:text-base opacity-80 mb-1">عضو في منصة باسقات</p>
                  {loading ? (
                    <div className="h-8 w-40 bg-white/20 rounded animate-pulse"></div>
                  ) : (
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight">
                      {displayName}
                    </h1>
                  )}
                </div>
              </div>

              {profile?.bio ? (
                <p className="text-sm md:text-base opacity-90 leading-relaxed line-clamp-2">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-sm md:text-base opacity-90 leading-relaxed">
                  أكمل ملفك الشخصي للحصول على تجربة أفضل في المنصة.
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                {profile?.joinedDate && (
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs md:text-sm">
                    عضو منذ <span className="font-semibold">{new Date(profile.joinedDate).getFullYear()}</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/client-dashboard/profile"
                  className="inline-flex items-center space-x-reverse space-x-2 border border-white/50 text-white px-4 md:px-5 py-2 rounded-2xl font-semibold text-sm md:text-base hover:bg-white/10 transition"
                >
                  <FontAwesomeIcon icon={faUserCircle} className="text-sm md:text-base" />
                  <span>عرض ملفي الشخصي</span>
                </a>
              </div>
            </div>

            {/* Right - Profile Completion */}
            <div className="w-full lg:w-auto">
              <div className="grid grid-cols-1 gap-4 min-w-[260px]">
                <div className="bg-black/10 backdrop-blur-md rounded-2xl px-5 py-5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm opacity-80">اكتمال الملف الشخصي</p>
                    <span className="text-lg font-black">{completion}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-300 via-white to-blue-300 rounded-full transition-all duration-700"
                      style={{ width: `${completion}%` }}
                    ></div>
                  </div>
                  {completion < 100 ? (
                    <p className="text-[11px] md:text-xs opacity-80 mt-2">
                      أكمل بياناتك الشخصية وارفع سيرتك الذاتية لتصل لـ 100%
                    </p>
                  ) : (
                    <p className="text-[11px] md:text-xs opacity-90 mt-2 font-semibold">
                      ملفك الشخصي مكتمل!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
