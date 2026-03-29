'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faBookOpen, faShoppingCart, faMoneyBillWave,
  faArrowTrendUp, faArrowTrendDown, faChartLine, faGraduationCap,
  faUserCheck, faLayerGroup, faStar, faEye,
  faCalendarAlt, faEllipsisV, faCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  Filler,
);

// ===== Types =====
type Period = 'week' | 'month' | 'year';

// ===== KPI Cards Data =====
const KPI_CARDS = [
  {
    title: 'إجمالي المستخدمين',
    value: '12,845',
    change: +18.4,
    icon: faUsers,
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    desc: 'مقارنة بالشهر الماضي',
  },
  {
    title: 'الدورات النشطة',
    value: '348',
    change: +7.2,
    icon: faBookOpen,
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    desc: 'مقارنة بالشهر الماضي',
  },
  {
    title: 'الطلبات الجديدة',
    value: '2,193',
    change: -3.1,
    icon: faShoppingCart,
    gradient: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    desc: 'مقارنة بالشهر الماضي',
  },
  {
    title: 'الإيرادات (ر.س)',
    value: '189,430',
    change: +24.6,
    icon: faMoneyBillWave,
    gradient: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    desc: 'مقارنة بالشهر الماضي',
  },
];

// ===== Secondary Stats =====
const SECONDARY_STATS = [
  { title: 'متوسط تقييم الدورات', value: '4.7', sub: 'من 5.0', icon: faStar, color: 'text-amber-500', bg: 'bg-amber-50' },
  { title: 'نسبة إتمام الدورات', value: '68%', sub: '+5% هذا الشهر', icon: faGraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'المستخدمون النشطون', value: '8,210', sub: '63% من الإجمالي', icon: faUserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'أقسام الدورات', value: '14', sub: '3 أقسام جديدة', icon: faLayerGroup, color: 'text-violet-600', bg: 'bg-violet-50' },
];

// ===== Top Courses =====
const TOP_COURSES = [
  { name: 'ريادة الأعمال المتقدمة', students: 1843, revenue: 36860, rating: 4.9, change: +12 },
  { name: 'استراتيجيات التسويق الرقمي', students: 1542, revenue: 30840, rating: 4.8, change: +8 },
  { name: 'مهارات القيادة والإدارة', students: 1290, revenue: 25800, rating: 4.7, change: +5 },
  { name: 'الفنون الإبداعية للأعمال', students: 987, revenue: 19740, rating: 4.6, change: -2 },
  { name: 'المهارات الناعمة في بيئة العمل', students: 876, revenue: 17520, rating: 4.5, change: +3 },
];

// ===== Recent Activity =====
const ACTIVITY = [
  { user: 'أحمد الشمري', action: 'اشترك في دورة ريادة الأعمال', time: 'منذ 5 دقائق', type: 'enroll' },
  { user: 'سارة العتيبي', action: 'أكملت دورة التسويق الرقمي', time: 'منذ 18 دقيقة', type: 'complete' },
  { user: 'محمد الدوسري', action: 'سجّل حساباً جديداً', time: 'منذ 32 دقيقة', type: 'register' },
  { user: 'نورة الزهراني', action: 'قيّمت دورة القيادة بـ 5 نجوم', time: 'منذ 45 دقيقة', type: 'review' },
  { user: 'فيصل القحطاني', action: 'اشترك في دورة المهارات الناعمة', time: 'منذ ساعة', type: 'enroll' },
];

const ACTIVITY_COLORS: Record<string, string> = {
  enroll: 'bg-blue-100 text-blue-600',
  complete: 'bg-blue-100 text-blue-600',
  register: 'bg-violet-100 text-violet-600',
  review: 'bg-amber-100 text-amber-600',
};
const ACTIVITY_ICONS: Record<string, any> = {
  enroll: faBookOpen,
  complete: faGraduationCap,
  register: faUsers,
  review: faStar,
};

// ===== Chart Data Generators =====
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const WEEKS = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
const YEARS = ['2021', '2022', '2023', '2024', '2025', '2026'];

const LINE_DATA: Record<Period, { labels: string[]; users: number[]; revenue: number[] }> = {
  week: {
    labels: WEEKS,
    users: [120, 200, 180, 310, 270, 390, 450],
    revenue: [5000, 8200, 7400, 12000, 11000, 15500, 18000],
  },
  month: {
    labels: MONTHS,
    users: [800, 1100, 950, 1400, 1250, 1600, 1900, 2100, 1800, 2400, 2200, 2800],
    revenue: [32000, 45000, 38000, 56000, 51000, 63000, 75000, 82000, 71000, 94000, 88000, 110000],
  },
  year: {
    labels: YEARS,
    users: [3200, 5800, 7400, 9100, 11200, 12845],
    revenue: [120000, 218000, 290000, 370000, 460000, 560000],
  },
};

const BAR_DATA = {
  labels: ['ريادة الأعمال', 'التسويق', 'الإدارة', 'الفنون', 'المهارات'],
  datasets: [
    {
      label: 'عدد الطلاب',
      data: [1843, 1542, 1290, 987, 876],
      backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'],
      borderRadius: 8,
    },
  ],
};

const DONUT_DATA = {
  labels: ['ريادة الأعمال', 'التسويق والمبيعات', 'الإدارة والقيادة', 'الفنون والحرف', 'المهارات الناعمة'],
  datasets: [{
    data: [32, 24, 20, 14, 10],
    backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'],
    borderWidth: 0,
    hoverOffset: 8,
  }],
};

const DONUT_COLORS = ['bg-blue-500', 'bg-blue-500', 'bg-violet-500', 'bg-amber-500', 'bg-red-500'];

// ===== Main Page =====
export default function IndicatorsPage() {
  const [period, setPeriod] = useState<Period>('month');

  const lineLabels = LINE_DATA[period].labels;
  const lineUsers = LINE_DATA[period].users;
  const lineRevenue = LINE_DATA[period].revenue;

  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: 'المستخدمون',
        data: lineUsers,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59,130,246,0.08)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#3B82F6',
      },
      {
        label: 'الإيرادات (÷100)',
        data: lineRevenue.map(v => Math.round(v / 100)),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16,185,129,0.08)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#10B981',
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f3f4f6' }, beginAtZero: true },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f3f4f6' }, beginAtZero: true },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    cutout: '72%',
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">المؤشرات والإحصاءات</h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
            آخر تحديث: 17 فبراير 2026
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          {(['week', 'month', 'year'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                period === p ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {p === 'week' ? 'أسبوع' : p === 'month' ? 'شهر' : 'سنة'}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                <FontAwesomeIcon icon={card.icon} className={`text-xl ${card.iconColor}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                card.change >= 0 ? 'text-blue-700 bg-blue-50' : 'text-red-600 bg-red-50'
              }`}>
                <FontAwesomeIcon icon={card.change >= 0 ? faArrowTrendUp : faArrowTrendDown} className="text-[10px]" />
                {Math.abs(card.change)}%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">{card.value}</p>
            <p className="text-sm font-medium text-gray-700">{card.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Line Chart + Donut Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div>
              <h2 className="font-bold text-gray-800">نمو المستخدمين والإيرادات</h2>
              <p className="text-xs text-gray-400 mt-0.5">مقارنة المؤشرات عبر الزمن</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <FontAwesomeIcon icon={faCircle} className="text-blue-500 text-[8px]" /> المستخدمون
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <FontAwesomeIcon icon={faCircle} className="text-blue-500 text-[8px]" /> الإيرادات
              </span>
            </div>
          </div>
          <div className="h-64">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-800">توزيع الأقسام</h2>
              <p className="text-xs text-gray-400 mt-0.5">نسبة الطلاب لكل قسم</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
          </div>
          <div className="h-44 relative">
            <Doughnut data={DONUT_DATA} options={donutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-bold text-gray-800">5</p>
              <p className="text-xs text-gray-400">أقسام</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {DONUT_DATA.labels.map((label, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${DONUT_COLORS[i]}`} />
                  <span className="text-xs text-gray-600 truncate max-w-[130px]">{label}</span>
                </div>
                <span className="text-xs font-semibold text-gray-700">{DONUT_DATA.datasets[0].data[i]}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Secondary Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SECONDARY_STATS.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <FontAwesomeIcon icon={stat.icon} className={`${stat.color} text-lg`} />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs font-medium text-gray-600 truncate">{stat.title}</p>
              <p className="text-[11px] text-gray-400">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bar Chart + Top Courses ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="mb-5">
            <h2 className="font-bold text-gray-800">طلاب الأقسام</h2>
            <p className="text-xs text-gray-400 mt-0.5">عدد المسجلين لكل قسم</p>
          </div>
          <div className="h-52">
            <Bar data={BAR_DATA} options={barOptions} />
          </div>
        </div>

        {/* Top Courses Table */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-800">أعلى الدورات أداءً</h2>
              <p className="text-xs text-gray-400 mt-0.5">ترتيب حسب عدد المسجلين</p>
            </div>
            <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              <FontAwesomeIcon icon={faEye} className="text-[10px]" /> عرض الكل
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {TOP_COURSES.map((course, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/60 transition-colors">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{course.name}</p>
                  <p className="text-xs text-gray-400">{course.students.toLocaleString()} طالب</p>
                </div>
                <div className="text-left flex-shrink-0">
                  <p className="text-sm font-bold text-gray-700">{course.revenue.toLocaleString()} ر.س</p>
                  <div className={`flex items-center justify-end gap-0.5 text-xs font-medium ${
                    course.change >= 0 ? 'text-blue-600' : 'text-red-500'
                  }`}>
                    <FontAwesomeIcon icon={course.change >= 0 ? faArrowTrendUp : faArrowTrendDown} className="text-[10px]" />
                    {Math.abs(course.change)}%
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                  <FontAwesomeIcon icon={faStar} className="text-xs" />
                  <span className="text-xs font-semibold text-gray-700">{course.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Activity + Growth Indicator ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-800">النشاط الأخير</h2>
            <p className="text-xs text-gray-400 mt-0.5">آخر التفاعلات على المنصة</p>
          </div>
          <div className="divide-y divide-gray-50">
            {ACTIVITY.map((item, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/60 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ACTIVITY_COLORS[item.type]}`}>
                  <FontAwesomeIcon icon={ACTIVITY_ICONS[item.type]} className="text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{item.user}</p>
                  <p className="text-xs text-gray-500 truncate">{item.action}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-gray-800 mb-1">ملخص النمو</h2>
            <p className="text-xs text-gray-400">مقارنة بالفترة السابقة</p>
          </div>

          <div className="space-y-4 mt-4">
            {[
              { label: 'نمو المستخدمين', value: 18.4, color: 'bg-blue-500' },
              { label: 'نمو الإيرادات', value: 24.6, color: 'bg-blue-500' },
              { label: 'نمو الدورات', value: 7.2, color: 'bg-violet-500' },
              { label: 'معدل الإتمام', value: 68, color: 'bg-amber-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-bold text-gray-800">{item.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${Math.min(item.value, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <FontAwesomeIcon icon={faChartLine} className="text-primary" />
              <span className="text-sm font-bold text-gray-800">أداء استثنائي</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              المنصة تسجّل نمواً بنسبة 24.6% في الإيرادات مقارنة بالشهر الماضي مع ارتفاع ملحوظ في معدلات الإتمام.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
