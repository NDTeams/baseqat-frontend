'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faTimes,
  faSpinner,
  faArrowUp,
  faArrowDown,
  faToggleOn,
  faToggleOff,
  faEye,
  faSort,
} from '@fortawesome/free-solid-svg-icons';
import api from '@/lib/axios';
import ModalMessage from '@/components/modal-message';

interface HomeStatistic {
  id: number;
  title: string;
  value: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

interface FormData {
  title: string;
  value: string;
  icon: string;
  sortOrder: number;
}

export default function HomeStatisticsPage() {
  const [stats, setStats] = useState<HomeStatistic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>({ title: '', value: '', icon: '', sortOrder: 0 });
  const [modal, setModal] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning',
    title: '',
    message: '' as string | string[],
  });

  const showModal = (type: 'success' | 'error' | 'warning', title: string, message: string | string[]) => {
    setModal({ isOpen: true, type, title, message });
  };

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/HomeStatistic/GetAll');
      if (res.data?.succeeded && res.data.data) {
        setStats(res.data.data);
      } else {
        setStats([]);
      }
    } catch {
      showModal('error', 'خطأ', 'فشل في تحميل البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleAdd = async () => {
    if (!form.title.trim() || !form.value.trim()) {
      showModal('warning', 'تنبيه', 'يرجى ملء العنوان والقيمة');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/HomeStatistic/Add', {
        title: form.title,
        value: form.value,
        icon: form.icon || null,
        sortOrder: form.sortOrder,
      });
      if (res.data?.succeeded) {
        showModal('success', 'تم بنجاح', 'تمت إضافة الإحصائية بنجاح');
        setShowAddForm(false);
        setForm({ title: '', value: '', icon: '', sortOrder: 0 });
        fetchStats();
      } else {
        showModal('error', 'خطأ', res.data?.message || 'فشل في الإضافة');
      }
    } catch {
      showModal('error', 'خطأ', 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!form.title.trim() || !form.value.trim()) {
      showModal('warning', 'تنبيه', 'يرجى ملء العنوان والقيمة');
      return;
    }
    setSaving(true);
    try {
      const res = await api.put(`/HomeStatistic/Update/${id}`, {
        title: form.title,
        value: form.value,
        icon: form.icon || null,
        sortOrder: form.sortOrder,
      });
      if (res.data?.succeeded) {
        showModal('success', 'تم بنجاح', 'تم تحديث الإحصائية بنجاح');
        setEditingId(null);
        fetchStats();
      } else {
        showModal('error', 'خطأ', res.data?.message || 'فشل في التحديث');
      }
    } catch {
      showModal('error', 'خطأ', 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الإحصائية؟')) return;
    try {
      const res = await api.delete(`/HomeStatistic/Delete/${id}`);
      if (res.data?.succeeded) {
        showModal('success', 'تم بنجاح', 'تم حذف الإحصائية');
        fetchStats();
      } else {
        showModal('error', 'خطأ', res.data?.message || 'فشل في الحذف');
      }
    } catch {
      showModal('error', 'خطأ', 'حدث خطأ في الاتصال بالخادم');
    }
  };

  const handleToggleActive = async (stat: HomeStatistic) => {
    // تحديث الحالة محلياً مباشرة بدون إعادة تحميل
    setStats(prev => prev.map(s => s.id === stat.id ? { ...s, isActive: !s.isActive } : s));
    try {
      const res = await api.put(`/HomeStatistic/Update/${stat.id}`, {
        isActive: !stat.isActive,
      });
      if (!res.data?.succeeded) {
        // التراجع عن التغيير في حال فشل
        setStats(prev => prev.map(s => s.id === stat.id ? { ...s, isActive: stat.isActive } : s));
        showModal('error', 'خطأ', 'فشل في تغيير الحالة');
      }
    } catch {
      // التراجع عن التغيير في حال خطأ
      setStats(prev => prev.map(s => s.id === stat.id ? { ...s, isActive: stat.isActive } : s));
      showModal('error', 'خطأ', 'فشل في تغيير الحالة');
    }
  };

  const startEdit = (stat: HomeStatistic) => {
    setEditingId(stat.id);
    setShowAddForm(false);
    setForm({
      title: stat.title,
      value: stat.value,
      icon: stat.icon || '',
      sortOrder: stat.sortOrder,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', value: '', icon: '', sortOrder: 0 });
  };

  const startAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setForm({ title: '', value: '', icon: '', sortOrder: stats.length + 1 });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen" dir="rtl">
      <ModalMessage
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, isOpen: false })}
        autoClose={modal.type === 'success' ? 2000 : 5000}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faChartLine} className="text-emerald-700 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">إحصائيات الموقع</h1>
            <p className="text-sm text-gray-500">إدارة الإحصائيات المعروضة في الصفحة الرئيسية</p>
          </div>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-800 transition text-sm"
        >
          <FontAwesomeIcon icon={faPlus} />
          إضافة إحصائية
        </button>
      </div>

      {/* Preview */}
      {stats.filter(s => s.isActive).length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faEye} className="text-gray-400" />
            <h2 className="font-semibold text-gray-700 text-sm">معاينة - كما تظهر في الموقع</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.filter(s => s.isActive).map((stat) => (
              <div key={stat.id} className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                <div className="text-2xl font-black text-emerald-700 mb-1" dir="ltr">{stat.value}</div>
                <div className="text-xs font-semibold text-slate-600">{stat.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">إضافة إحصائية جديدة</h2>
            <button onClick={() => { setShowAddForm(false); setForm({ title: '', value: '', icon: '', sortOrder: 0 }); }} className="text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">العنوان <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="مثال: مشروع مُنجز"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">القيمة <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="مثال: 120 أو 98%"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">الأيقونة</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="اختياري"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">الترتيب</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="flex items-center gap-2 bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-800 transition text-sm disabled:opacity-50"
            >
              {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faSave} />}
              حفظ
            </button>
            <button
              onClick={() => { setShowAddForm(false); setForm({ title: '', value: '', icon: '', sortOrder: 0 }); }}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition text-sm"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Stats Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">جميع الإحصائيات</h2>
          <span className="text-sm text-gray-500">{stats.length} إحصائية</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-emerald-700 text-2xl" />
          </div>
        ) : stats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FontAwesomeIcon icon={faChartLine} className="text-4xl mb-3" />
            <p className="font-semibold">لا توجد إحصائيات</p>
            <p className="text-sm mt-1">اضغط على "إضافة إحصائية" لإنشاء واحدة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-sm text-gray-600">
                  <th className="text-right px-6 py-3 font-semibold">
                    <FontAwesomeIcon icon={faSort} className="ml-1 text-xs" />
                    الترتيب
                  </th>
                  <th className="text-right px-6 py-3 font-semibold">العنوان</th>
                  <th className="text-right px-6 py-3 font-semibold">القيمة</th>
                  <th className="text-right px-6 py-3 font-semibold">الحالة</th>
                  <th className="text-center px-6 py-3 font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.map((stat) => (
                  <tr key={stat.id} className="hover:bg-gray-50/60 transition-colors">
                    {editingId === stat.id ? (
                      <>
                        <td className="px-6 py-3">
                          <input
                            type="number"
                            value={form.sortOrder}
                            onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500"
                          />
                        </td>
                        <td className="px-6 py-3">
                          <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500"
                          />
                        </td>
                        <td className="px-6 py-3">
                          <input
                            type="text"
                            value={form.value}
                            onChange={(e) => setForm({ ...form, value: e.target.value })}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500"
                            dir="ltr"
                          />
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stat.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {stat.isActive ? 'مفعّل' : 'معطّل'}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleUpdate(stat.id)}
                              disabled={saving}
                              className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition text-sm"
                            >
                              {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faSave} />}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-sm"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 text-sm font-bold">
                            {stat.sortOrder}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="font-semibold text-gray-800 text-sm">{stat.title}</span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-lg font-black text-emerald-700" dir="ltr">{stat.value}</span>
                        </td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => handleToggleActive(stat)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                              stat.isActive
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            <FontAwesomeIcon icon={stat.isActive ? faToggleOn : faToggleOff} className="text-base" />
                            {stat.isActive ? 'مفعّل' : 'معطّل'}
                          </button>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => startEdit(stat)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                              title="تعديل"
                            >
                              <FontAwesomeIcon icon={faEdit} className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleDelete(stat.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                              title="حذف"
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
