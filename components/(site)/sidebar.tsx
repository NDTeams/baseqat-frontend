"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"; // <-- هنا النوع الصحيح
import {
  faChartLine,
  faGraduationCap,
  faTasks,
  faChartBar,
  faCertificate,
  faUser,
  faCog,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";

interface SidebarLinkProps {
  href: string;
  icon: IconDefinition; // بدل any
  children: React.ReactNode;
  active?: boolean;
}

function SidebarLink({ href, icon, children, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-emerald-50 text-emerald-800"
          : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
      }`}
    >
      <FontAwesomeIcon icon={icon} className="w-5 text-center" />
      <span>{children}</span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white border border-slate-100 rounded-2xl shadow p-4 lg:sticky lg:top-44">
        <nav className="space-y-2">
          <SidebarLink href="#overview" icon={faChartLine} active>
            نظرة عامة
          </SidebarLink>
          <SidebarLink href="#courses" icon={faGraduationCap}>
            دوراتي
          </SidebarLink>
          <SidebarLink href="#assignments" icon={faTasks}>
            المهام والواجبات
          </SidebarLink>
          <SidebarLink href="#progress" icon={faChartBar}>
            تقدمي الدراسي
          </SidebarLink>
          <SidebarLink href="#certificates" icon={faCertificate}>
            الشهادات
          </SidebarLink>
          <SidebarLink href="#profile" icon={faUser}>
            ملفي الشخصي
          </SidebarLink>
          <SidebarLink href="#settings" icon={faCog}>
            الإعدادات
          </SidebarLink>
          <SidebarLink href="#support" icon={faHeadset}>
            الدعم والمساعدة
          </SidebarLink>
        </nav>

        {/* Quick Stats */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 mb-3">إحصائيات سريعة</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">الدورات المكتملة</span>
              <span className="font-semibold text-emerald-700">3</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">الشهادات المحصلة</span>
              <span className="font-semibold text-emerald-700">2</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">ساعات التعلم</span>
              <span className="font-semibold text-emerald-700">45</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
