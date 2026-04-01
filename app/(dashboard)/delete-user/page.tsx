'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faTrash, faArrowRight, faSpinner,
  faUserTie, faChalkboardTeacher, faBookOpen,
  faComments, faStar, faClipboard, faSignInAlt,
  faFileExcel, faExclamationTriangle, faCheck,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { UsersManagement } from '@/services/dashboard/users-management/page';

interface RelatedData {
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    userName: string;
    roles: string[];
    joinedDate: string;
    lastLogin: string | null;
  };
  consultants: any[];
  instructors: any[];
  courseEnrollments: any[];
  consultationRequests: any[];
  studentReviews: any[];
  courseReviews: any[];
  clientProfile: any | null;
  loginLogs: { totalCount: number; successCount: number; failCount: number };
  summary: {
    consultantsCount: number;
    instructorsCount: number;
    enrollmentsCount: number;
    consultationRequestsCount: number;
    studentReviewsCount: number;
    courseReviewsCount: number;
    hasClientProfile: boolean;
    loginLogsCount: number;
  };
}

export default function DeleteUserPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId');

  const [data, setData] = useState<RelatedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await UsersManagement.GetUserRelatedData(userId);
      if (res.succeeded && res.data) {
        setData(res.data);
      }
    } catch {
      setResult({ type: 'error', message: 'فشل في جلب بيانات المستخدم' });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!userId) return;
    setDeleting(true);
    try {
      const res = await UsersManagement.DeleteUserWithData(userId);
      if (res.succeeded) {
        setResult({ type: 'success', message: 'تم حذف المستخدم وجميع بياناته بنجاح' });
        setShowConfirm(false);
        setTimeout(() => router.push('/user-management'), 2000);
      } else {
        setResult({ type: 'error', message: res.message || 'فشل في حذف المستخدم' });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'حدث خطأ أثناء حذف المستخدم';
      setResult({ type: 'error', message: msg });
    } finally {
      setDeleting(false);
    }
  };

  const exportToExcel = () => {
    if (!data) return;

    const rows: string[][] = [];
    const addSection = (title: string, headers: string[], items: any[], fields: string[]) => {
      rows.push([title]);
      rows.push(headers);
      items.forEach(item => {
        rows.push(fields.map(f => String(item[f] ?? '-')));
      });
      rows.push([]);
    };

    // معلومات المستخدم
    rows.push(['بيانات المستخدم']);
    rows.push(['الاسم', data.user.fullName]);
    rows.push(['البريد', data.user.email]);
    rows.push(['الهاتف', data.user.phoneNumber]);
    rows.push(['الأدوار', data.user.roles.join(', ')]);
    rows.push(['تاريخ الانضمام', data.user.joinedDate]);
    rows.push(['آخر دخول', data.user.lastLogin || 'لم يسجل دخول']);
    rows.push([]);

    if (data.consultants.length > 0) {
      addSection('بيانات المستشار', ['#', 'الاسم', 'اللقب', 'التخصص', 'السعر/ساعة', 'سنوات الخبرة', 'التقييم'],
        data.consultants, ['id', 'name', 'title', 'specialty', 'hourlyRate', 'yearsOfExperience', 'rating']);
    }
    if (data.instructors.length > 0) {
      addSection('بيانات المدرب', ['#', 'الاسم', 'اللقب', 'سنوات الخبرة', 'التقييم', 'عدد الطلاب', 'عدد الدورات'],
        data.instructors, ['id', 'name', 'title', 'yearsOfExperience', 'rating', 'totalStudents', 'totalCources']);
    }
    if (data.courseEnrollments.length > 0) {
      addSection('التسجيلات في الدورات', ['#', 'رقم الدورة', 'تاريخ التسجيل'],
        data.courseEnrollments, ['id', 'courseId', 'enrolledAt']);
    }
    if (data.consultationRequests.length > 0) {
      addSection('طلبات الاستشارة', ['#', 'الموضوع', 'اسم العميل', 'البريد', 'الحالة', 'التاريخ المفضل'],
        data.consultationRequests, ['id', 'subject', 'clientName', 'clientEmail', 'status', 'preferredDate']);
    }
    if (data.studentReviews.length > 0) {
      addSection('تقييمات الطلاب', ['#', 'رقم المدرب', 'رقم الدورة', 'التقييم', 'التعليق', 'التاريخ'],
        data.studentReviews, ['id', 'instructorId', 'courseId', 'rating', 'comment', 'createdAt']);
    }
    if (data.courseReviews.length > 0) {
      addSection('تقييمات الدورات', ['#', 'رقم الدورة', 'التقييم', 'التعليق', 'التاريخ'],
        data.courseReviews, ['id', 'courseId', 'rating', 'comment', 'createdAt']);
    }

    rows.push(['سجل الدخول']);
    rows.push(['إجمالي', String(data.loginLogs.totalCount)]);
    rows.push(['ناجح', String(data.loginLogs.successCount)]);
    rows.push(['فاشل', String(data.loginLogs.failCount)]);

    // تحويل إلى CSV مع BOM للعربية
    const BOM = '\uFEFF';
    const csv = BOM + rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user-data-${data.user.fullName}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!userId) {
    return (
      <main className="flex-1 p-6 flex items-center justify-center">
        <p className="text-gray-500">لم يتم تحديد مستخدم</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex-1 p-6 flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="text-emerald-700 text-3xl animate-spin" />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex-1 p-6 flex items-center justify-center">
        <p className="text-red-500">فشل في جلب البيانات</p>
      </main>
    );
  }

  const { summary } = data;
  const totalRelated = summary.consultantsCount + summary.instructorsCount + summary.enrollmentsCount
    + summary.consultationRequestsCount + summary.studentReviewsCount + summary.courseReviewsCount
    + (summary.hasClientProfile ? 1 : 0) + summary.loginLogsCount;

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/user-management"
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <FontAwesomeIcon icon={faArrowRight} className="text-gray-600" />
          </Link>
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faTrash} className="text-red-700" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">حذف المستخدم</h1>
            <p className="text-sm text-gray-500">مراجعة البيانات المرتبطة قبل الحذف</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition"
          >
            <FontAwesomeIcon icon={faFileExcel} />
            تصدير Excel
          </button>
        </div>
      </div>

      {/* معلومات المستخدم */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-emerald-700 text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{data.user.fullName}</h2>
            <p className="text-sm text-gray-500">{data.user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><span className="text-gray-400">الهاتف:</span> <span className="text-gray-700" dir="ltr">{data.user.phoneNumber}</span></div>
          <div><span className="text-gray-400">الأدوار:</span> <span className="text-gray-700">{data.user.roles.join(', ')}</span></div>
          <div><span className="text-gray-400">تاريخ الانضمام:</span> <span className="text-gray-700">{data.user.joinedDate}</span></div>
          <div><span className="text-gray-400">آخر دخول:</span> <span className="text-gray-700">{data.user.lastLogin || 'لم يسجل دخول'}</span></div>
        </div>
      </div>

      {/* ملخص البيانات */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: faUserTie, label: 'مستشار', count: summary.consultantsCount, color: 'blue' },
          { icon: faChalkboardTeacher, label: 'مدرب', count: summary.instructorsCount, color: 'purple' },
          { icon: faBookOpen, label: 'تسجيلات', count: summary.enrollmentsCount, color: 'emerald' },
          { icon: faComments, label: 'طلبات استشارة', count: summary.consultationRequestsCount, color: 'amber' },
          { icon: faStar, label: 'تقييمات طلاب', count: summary.studentReviewsCount, color: 'orange' },
          { icon: faStar, label: 'تقييمات دورات', count: summary.courseReviewsCount, color: 'yellow' },
          { icon: faClipboard, label: 'ملف شخصي', count: summary.hasClientProfile ? 1 : 0, color: 'teal' },
          { icon: faSignInAlt, label: 'سجلات دخول', count: summary.loginLogsCount, color: 'slate' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-100 p-3 text-center">
            <FontAwesomeIcon icon={item.icon} className={`text-${item.color}-600 mb-1`} />
            <div className={`text-xl font-bold ${item.count > 0 ? 'text-red-600' : 'text-gray-300'}`}>{item.count}</div>
            <div className="text-xs text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      {/* تفاصيل كل جدول */}
      {data.consultants.length > 0 && (
        <DataSection title="بيانات المستشار" icon={faUserTie} color="blue">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-600">
              <th className="p-2 text-right">الاسم</th>
              <th className="p-2 text-right">اللقب</th>
              <th className="p-2 text-right">التخصص</th>
              <th className="p-2 text-right">السعر/ساعة</th>
              <th className="p-2 text-right">سنوات الخبرة</th>
            </tr></thead>
            <tbody>
              {data.consultants.map((c: any) => (
                <tr key={c.id} className="border-t border-gray-100">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.title}</td>
                  <td className="p-2">{c.specialty || '-'}</td>
                  <td className="p-2">{c.hourlyRate ? `${c.hourlyRate} ر.س` : '-'}</td>
                  <td className="p-2">{c.yearsOfExperience || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataSection>
      )}

      {data.instructors.length > 0 && (
        <DataSection title="بيانات المدرب" icon={faChalkboardTeacher} color="purple">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-600">
              <th className="p-2 text-right">الاسم</th>
              <th className="p-2 text-right">اللقب</th>
              <th className="p-2 text-right">سنوات الخبرة</th>
              <th className="p-2 text-right">عدد الطلاب</th>
              <th className="p-2 text-right">عدد الدورات</th>
            </tr></thead>
            <tbody>
              {data.instructors.map((i: any) => (
                <tr key={i.id} className="border-t border-gray-100">
                  <td className="p-2">{i.name}</td>
                  <td className="p-2">{i.title}</td>
                  <td className="p-2">{i.yearsOfExperience || '-'}</td>
                  <td className="p-2">{i.totalStudents || 0}</td>
                  <td className="p-2">{i.totalCources || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataSection>
      )}

      {data.courseEnrollments.length > 0 && (
        <DataSection title="التسجيلات في الدورات" icon={faBookOpen} color="emerald">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-600">
              <th className="p-2 text-right">رقم الدورة</th>
              <th className="p-2 text-right">تاريخ التسجيل</th>
            </tr></thead>
            <tbody>
              {data.courseEnrollments.map((e: any) => (
                <tr key={e.id} className="border-t border-gray-100">
                  <td className="p-2">{e.courseId}</td>
                  <td className="p-2">{e.enrolledAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataSection>
      )}

      {data.consultationRequests.length > 0 && (
        <DataSection title="طلبات الاستشارة" icon={faComments} color="amber">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-600">
              <th className="p-2 text-right">الموضوع</th>
              <th className="p-2 text-right">اسم العميل</th>
              <th className="p-2 text-right">الحالة</th>
              <th className="p-2 text-right">التاريخ المفضل</th>
            </tr></thead>
            <tbody>
              {data.consultationRequests.map((r: any) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="p-2">{r.subject}</td>
                  <td className="p-2">{r.clientName}</td>
                  <td className="p-2">{r.status}</td>
                  <td className="p-2">{r.preferredDate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataSection>
      )}

      {data.studentReviews.length > 0 && (
        <DataSection title="تقييمات الطلاب" icon={faStar} color="orange">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-600">
              <th className="p-2 text-right">رقم المدرب</th>
              <th className="p-2 text-right">رقم الدورة</th>
              <th className="p-2 text-right">التقييم</th>
              <th className="p-2 text-right">التعليق</th>
              <th className="p-2 text-right">التاريخ</th>
            </tr></thead>
            <tbody>
              {data.studentReviews.map((r: any) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="p-2">{r.instructorId}</td>
                  <td className="p-2">{r.courseId}</td>
                  <td className="p-2">{r.rating}</td>
                  <td className="p-2 max-w-[200px] truncate">{r.comment || '-'}</td>
                  <td className="p-2">{r.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataSection>
      )}

      {data.courseReviews.length > 0 && (
        <DataSection title="تقييمات الدورات" icon={faStar} color="yellow">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-600">
              <th className="p-2 text-right">رقم الدورة</th>
              <th className="p-2 text-right">التقييم</th>
              <th className="p-2 text-right">التعليق</th>
              <th className="p-2 text-right">التاريخ</th>
            </tr></thead>
            <tbody>
              {data.courseReviews.map((r: any) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="p-2">{r.courseId}</td>
                  <td className="p-2">{r.rating}</td>
                  <td className="p-2 max-w-[200px] truncate">{r.comment || '-'}</td>
                  <td className="p-2">{r.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataSection>
      )}

      {/* سجل الدخول */}
      {data.loginLogs.totalCount > 0 && (
        <DataSection title="سجل الدخول" icon={faSignInAlt} color="slate">
          <div className="flex gap-6 p-3 text-sm">
            <div><span className="text-gray-400">إجمالي:</span> <span className="font-bold">{data.loginLogs.totalCount}</span></div>
            <div><span className="text-gray-400">ناجح:</span> <span className="font-bold text-green-600">{data.loginLogs.successCount}</span></div>
            <div><span className="text-gray-400">فاشل:</span> <span className="font-bold text-red-600">{data.loginLogs.failCount}</span></div>
          </div>
        </DataSection>
      )}

      {/* تحذير وزر الحذف */}
      {totalRelated === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
          <FontAwesomeIcon icon={faCheck} className="text-green-600 text-xl mb-2" />
          <p className="text-green-700 font-medium">لا توجد بيانات مرتبطة - يمكن حذف المستخدم بأمان</p>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-xl mt-0.5" />
            <div>
              <h3 className="font-bold text-red-800 mb-1">تحذير: سيتم حذف جميع البيانات أعلاه!</h3>
              <p className="text-sm text-red-600">
                يوجد {totalRelated} سجل مرتبط بهذا المستخدم. يُنصح بتصدير البيانات قبل الحذف.
                هذا الإجراء لا يمكن التراجع عنه.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-3 mb-10">
        <Link
          href="/user-management"
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
        >
          إلغاء
        </Link>
        <button
          onClick={() => setShowConfirm(true)}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faTrash} />
          حذف المستخدم وجميع بياناته
        </button>
      </div>

      {/* تأكيد الحذف */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">تأكيد الحذف النهائي</h3>
              <p className="text-sm text-gray-500 mt-2">
                هل أنت متأكد من حذف <strong>{data.user.fullName}</strong> وجميع بياناته ({totalRelated} سجل)؟
                <br />
                <span className="text-red-600 font-medium">لا يمكن التراجع عن هذا الإجراء!</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition"
                disabled={deleting}
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
                disabled={deleting}
              >
                {deleting ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faTrash} />
                )}
                {deleting ? 'جاري الحذف...' : 'نعم، احذف'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* رسالة النتيجة */}
      {result && (
        <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center" onClick={() => setResult(null)}>
          <div className={`bg-white rounded-2xl p-6 shadow-2xl max-w-sm mx-4 text-center ${result.type === 'success' ? 'border-t-4 border-emerald-500' : 'border-t-4 border-red-500'}`} onClick={e => e.stopPropagation()}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${result.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {result.type === 'success' ? '✓' : '✕'}
            </div>
            <p className="text-sm text-slate-600">{result.message}</p>
          </div>
        </div>
      )}
    </main>
  );
}

function DataSection({ title, icon, color, children }: { title: string; icon: any; color: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 mb-4 overflow-hidden">
      <div className={`flex items-center gap-2 px-4 py-3 bg-${color}-50 border-b border-${color}-100`}>
        <FontAwesomeIcon icon={icon} className={`text-${color}-600`} />
        <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
