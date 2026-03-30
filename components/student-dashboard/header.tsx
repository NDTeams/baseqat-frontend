"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faBookOpen,
  faPhone,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-[20px] border-b border-neutral-200 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Right - Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/site/logo.png"
                alt="باسقات"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Center - Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/student-dashboard"
              className="text-neutral-600 hover:text-emerald-700 transition font-semibold text-sm flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faHome} className="text-xs" />
              لوحة التحكم
            </Link>
            <Link
              href="/courses"
              className="text-neutral-600 hover:text-emerald-700 transition font-semibold text-sm flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBookOpen} className="text-xs" />
              الدورات
            </Link>
            <Link
              href="/#contact"
              className="text-neutral-600 hover:text-emerald-700 transition font-semibold text-sm flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPhone} className="text-xs" />
              اتصل بنا
            </Link>
          </div>

          {/* Left - User */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-100 transition">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&q=90"
                  alt="المستخدم"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover border-2 border-emerald-200"
                />
                <span className="hidden md:block text-neutral-700 font-semibold text-sm">
                  أحمد محمد
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="text-neutral-400 text-xs"
                />
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}