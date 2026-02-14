'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faEdit,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-secondary to-primary rounded-xl shadow-lg p-6 text-white">
        <div className="flex lg:flex-row flex-col gap-4 lg:items-center justify-between mb-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span className="text-sm">2:30 pm Jan 17, 2022</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">مرحباً احمد</h2>
            <p className="text-white/90">نتمنى لك يوما مليئاً بالانجاز</p>
          </div>
          <Image
            src="/dashboard/hand.png" 
            alt="welcome"
            width={160}
            height={160}
            className="object-cover"
          />
        </div>
      </div>

      {/* About Company Card */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-2 bg-primary px-6 py-2 rounded-t-xl">
          <h2 className="text-xl font-bold text-white">لمحة عن الشركة</h2>
          <button className="p-2 text-white">
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>

        <div className="flex items-center space-x-4 space-x-reverse mb-2 px-6 py-2">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-white text-lg" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">احمد</h3>
            <p className="text-sm text-gray-600">you@company.com</p>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed px-6 py-2">
          لمحة عن الشركة لمحة عن الشركة لمحة عن الشركة لمحة عن الشركة لمحة عن الشركة لمحة عن الشركة لمحة عن الشركة لمحة عن الشركة
        </p>
      </div>

    </div>
  );
}
