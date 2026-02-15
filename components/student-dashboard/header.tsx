"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-[20px] border-b border-neutral-200 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Left */}
          <div className="flex items-center space-x-reverse space-x-4">
            <button
              id="sidebarToggle"
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition"
            >
              <FontAwesomeIcon icon={faBars} className="text-xl text-neutral-700" />
            </button>

            <Link href="/" className="flex items-center">
              <Image
                src="/assets/images/logo.png"
                alt="logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-reverse space-x-4">
            <div className="hidden md:flex items-center space-x-reverse space-x-3">
              <Link
                href="/courses"
                className="text-neutral-700 hover:text-primary transition font-semibold"
              >
                الدورات
              </Link>
              <Link
                href="/#contact"
                className="text-neutral-700 hover:text-primary transition font-semibold"
              >
                اتصل بنا
              </Link>
            </div>

            <div className="relative">
              <button className="flex items-center space-x-reverse space-x-3 p-2 rounded-lg hover:bg-neutral-100 transition">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&q=90"
                  alt="المستخدم"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="hidden md:block text-neutral-700 font-semibold">
                  أحمد محمد
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="text-neutral-600 text-sm"
                />
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}