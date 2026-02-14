// components/ChartsSection.tsx
"use client";

import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ChartsSection() {
  // Donut Chart data
  const donutData = {
    labels: ["عرض تحت المراجعة", "عرض قيد التفاوض", "عرض مقبول", "عرض مرفوض"],
    datasets: [
      {
        data: [723, 48, 92, 47],
        backgroundColor: ["#4F46E5", "#10B981", "#60A5FA", "#F59E0B"],
        borderWidth: 0,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Bar Chart data
  const barData = {
    labels: ["إجمالي المشاريع", "المشاريع المكتملة", "المشاريع قيد التنفيذ", "المشاريع المرفوضة"],
    datasets: [
      {
        data: [143382, 87974, 45211, 21893],
        backgroundColor: ["#10B981", "#F59E0B", "#3B82F6", "#8B5CF6"],
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const, // نفس الكود الأصلي (bar chart horizontal)
    plugins: { legend: { display: false } },
    scales: {
      x: {
        beginAtZero: true,
        grid: { display: false },
      },
      y: { grid: { display: false } },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Donut Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">إحصائيات العروض</h3>
        <div className="relative h-64">
          <Doughnut data={donutData} options={donutOptions} />
        </div>
        <div className="mt-4 space-y-2">
          {[
            { color: "bg-indigo-600", label: "723 عرض تحت المراجعة" },
            { color: "bg-green-500", label: "48 عرض قيد التفاوض" },
            { color: "bg-blue-400", label: "92 عرض مقبول" },
            { color: "bg-yellow-500", label: "47 عرض مرفوض" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">إحصائيات العروض</h3>
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-sm text-gray-600">Last 7 Days</span>
            <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
          </div>
        </div>
        <div className="relative h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}
