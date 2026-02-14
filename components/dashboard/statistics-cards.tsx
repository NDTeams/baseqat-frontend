// components/StatisticsCards.tsx
"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUnlink, 
  faClock, 
  faFileAlt, 
  faChartLine 
} from "@fortawesome/free-solid-svg-icons";

const stats = [
  {
    title: "المشاريع المرفوضة",
    value: "33,493",
    icon: faUnlink,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    title: "المشاريع قيد التنفيذ",
    value: "33,493",
    icon: faClock,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "المشاريع المكتملة",
    value: "33,493",
    icon: faFileAlt,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "إجمالي المشاريع",
    value: "33,493",
    icon: faChartLine,
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
];

export default function StatisticsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <FontAwesomeIcon icon={stat.icon} className={`text-xl ${stat.iconColor}`} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
