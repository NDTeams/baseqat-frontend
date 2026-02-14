"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faBell,
  faEnvelope,
  // faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import LanguageDropdown from "@/components/dashboard/language";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Burger Menu */}
        <button
          id="mobile-burger"
          className="mobile-burger lg:hidden block p-2 text-gray-600 hover:text-primary transition-colors mr-4"
        >
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md lg:block hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="البحث"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <button className="p-2 text-gray-600 hover:text-primary transition-colors">
            <FontAwesomeIcon icon={faBell} className="text-xl" />
          </button>

          <button className="p-2 text-gray-600 hover:text-primary transition-colors">
            <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
          </button>

            <LanguageDropdown />
          
        </div>
      </div>
    </header>
  );
}
