"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSpinner,
  faClipboardCheck,
  faTrash,
  faPlus,
  faChevronLeft,
  faChevronRight,
  faEye,
  faToggleOn,
  faToggleOff,
  faQuestionCircle,
  faUsers,
  faTimes,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  QuizService,
  CoursesAdminService,
  type QuizData,
  type QuizQuestion,
  type QuizAttemptData,
  type Course,
} from "@/services/courses/page";

const PAGE_SIZE = 10;

function StatusToast({ open, type, message, onClose }: { open: boolean; type: string; message: string; onClose: () => void }) {
  useEffect(() => { if (open) { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); } }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl shadow-lg text-white text-sm font-semibold ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
      {message}
    </div>
  );
}

export default function QuizzesAdmin() {
  const [data, setData] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [questionsModal, setQuestionsModal] = useState<number | null>(null);
  const [attemptsModal, setAttemptsModal] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await QuizService.getAllPaged(
        { pageNumber: page, pageSize: PAGE_SIZE },
        {}
      );
      if (res.succeeded && res.data) {
        const filtered = search
          ? res.data.filter(q => q.title.includes(search) || q.courseTitle.includes(search))
          : res.data;
        setData(filtered);
        setTotalCount(res.totalCount);
      } else {
        setData([]);
        setTotalCount(0);
      }
    } catch { setData([]); }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleDelete = async (id: number) => {
    if (!confirm("هل تريد حذف هذا الاختبار نهائياً؟")) return;
    setActionLoading(id);
    try {
      const res = await QuizService.delete(id);
      if (res.succeeded) {
        setToast({ open: true, type: "success", message: "تم حذف الاختبار" });
        fetchData();
      } else {
        setToast({ open: true, type: "error", message: res.message || "فشل الحذف" });
      }
    } catch { setToast({ open: true, type: "error", message: "حدث خطأ" }); }
    setActionLoading(null);
  };

  const handleToggleActive = async (quiz: QuizData) => {
    setActionLoading(quiz.id);
    try {
      const res = await QuizService.update(quiz.id, { isActive: !quiz.isActive });
      if (res.succeeded) {
        setToast({ open: true, type: "success", message: quiz.isActive ? "تم تعطيل الاختبار" : "تم تفعيل الاختبار" });
        fetchData();
      } else {
        setToast({ open: true, type: "error", message: res.message || "فشل التحديث" });
      }
    } catch { setToast({ open: true, type: "error", message: "حدث خطأ" }); }
    setActionLoading(null);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <StatusToast {...toast} onClose={() => setToast(p => ({ ...p, open: false }))} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">إدارة الاختبارات</h1>
          <p className="text-sm text-neutral-500 mt-1">إنشاء وإدارة اختبارات الدورات</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition text-sm"
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
          إضافة اختبار
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="ابحث بعنوان الاختبار أو الدورة..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">#</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">العنوان</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">الدورة</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">الأسئلة</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">المحاولات</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">درجة النجاح</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">المدة</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">الحالة</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-neutral-400">
                    <FontAwesomeIcon icon={faClipboardCheck} className="text-3xl mb-2 block mx-auto" />
                    لا توجد اختبارات
                  </td>
                </tr>
              ) : (
                data.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-neutral-50 transition">
                    <td className="px-6 py-4 text-neutral-500">{quiz.id}</td>
                    <td className="px-6 py-4 font-semibold text-neutral-800">{quiz.title}</td>
                    <td className="px-6 py-4 text-neutral-600">{quiz.courseTitle}</td>
                    <td className="px-6 py-4 text-neutral-600">{quiz.questionsCount}</td>
                    <td className="px-6 py-4 text-neutral-600">{quiz.attemptsCount}</td>
                    <td className="px-6 py-4 text-neutral-600">{quiz.passingScore}%</td>
                    <td className="px-6 py-4 text-neutral-600">{quiz.durationInMinutes} د</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        quiz.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}>
                        {quiz.isActive ? "مفعل" : "معطل"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setQuestionsModal(quiz.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="الأسئلة"
                        >
                          <FontAwesomeIcon icon={faQuestionCircle} className="text-sm" />
                        </button>
                        <button
                          onClick={() => setAttemptsModal(quiz.id)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          title="المحاولات"
                        >
                          <FontAwesomeIcon icon={faUsers} className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(quiz)}
                          disabled={actionLoading === quiz.id}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title={quiz.isActive ? "تعطيل" : "تفعيل"}
                        >
                          {actionLoading === quiz.id ? (
                            <FontAwesomeIcon icon={faSpinner} spin className="text-sm" />
                          ) : (
                            <FontAwesomeIcon icon={quiz.isActive ? faToggleOn : faToggleOff} className="text-sm" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(quiz.id)}
                          disabled={actionLoading === quiz.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="حذف"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100">
            <p className="text-sm text-neutral-500">
              عرض {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, totalCount)} من {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 transition"
              >
                <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
              </button>
              <span className="text-sm font-semibold text-neutral-700">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 transition"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Quiz Modal */}
      {showAddModal && (
        <AddQuizModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { fetchData(); setToast({ open: true, type: "success", message: "تم إضافة الاختبار بنجاح" }); }}
          onError={(msg) => setToast({ open: true, type: "error", message: msg })}
        />
      )}

      {/* Questions Modal */}
      {questionsModal && (
        <QuestionsModal
          quizId={questionsModal}
          onClose={() => setQuestionsModal(null)}
          onRefresh={fetchData}
          setToast={setToast}
        />
      )}

      {/* Attempts Modal */}
      {attemptsModal && (
        <AttemptsModal
          quizId={attemptsModal}
          onClose={() => setAttemptsModal(null)}
        />
      )}
    </div>
  );
}

// ===== Add Quiz Modal =====
function AddQuizModal({
  onClose, onSuccess, onError,
}: {
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [passingScore, setPassingScore] = useState("60");
  const [duration, setDuration] = useState("30");
  const [submitting, setSubmitting] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    CoursesAdminService.getAll()
      .then(res => { if (res.succeeded && res.data) setCourses(res.data); })
      .catch(() => {})
      .finally(() => setLoadingCourses(false));
  }, []);

  const handleSubmit = async () => {
    if (!title || !courseId) return;
    setSubmitting(true);
    try {
      const res = await QuizService.add({
        title,
        description: description || undefined,
        courseId: parseInt(courseId),
        passingScore: parseInt(passingScore) || 60,
        durationInMinutes: parseInt(duration) || 30,
      });
      if (res.succeeded) {
        onSuccess();
        onClose();
      } else {
        onError(res.message || "فشل الإضافة");
      }
    } catch {
      onError("حدث خطأ أثناء الإضافة");
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()} dir="rtl">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">إضافة اختبار جديد</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">عنوان الاختبار *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="مثال: اختبار نهاية الدورة"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">الدورة *</label>
            {loadingCourses ? (
              <div className="text-sm text-neutral-400 py-2"><FontAwesomeIcon icon={faSpinner} spin /> جاري تحميل الدورات...</div>
            ) : (
              <select
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">اختر الدورة</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">الوصف</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="وصف اختياري"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">درجة النجاح (%)</label>
              <input
                type="number"
                value={passingScore}
                onChange={e => setPassingScore(e.target.value)}
                min={0} max={100}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">المدة (دقيقة)</label>
              <input
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                min={1}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!title || !courseId || submitting}
            className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? <FontAwesomeIcon icon={faSpinner} spin /> : "إضافة الاختبار"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-100 text-neutral-600 rounded-xl font-semibold hover:bg-neutral-200 transition text-sm"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Questions Modal =====
function QuestionsModal({
  quizId, onClose, onRefresh, setToast,
}: {
  quizId: number;
  onClose: () => void;
  onRefresh: () => void;
  setToast: (t: { open: boolean; type: string; message: string }) => void;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await QuizService.getQuestions(quizId);
      if (res.succeeded && res.data) setQuestions(res.data);
    } catch {}
    setLoading(false);
  }, [quizId]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleDeleteQuestion = async (qId: number) => {
    if (!confirm("حذف هذا السؤال؟")) return;
    setDeleting(qId);
    try {
      const res = await QuizService.deleteQuestion(qId);
      if (res.succeeded) {
        fetchQuestions();
        onRefresh();
        setToast({ open: true, type: "success", message: "تم حذف السؤال" });
      }
    } catch {}
    setDeleting(null);
  };

  // Add question form state
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([
    { optionText: "", isCorrect: true, orderIndex: 0 },
    { optionText: "", isCorrect: false, orderIndex: 1 },
  ]);
  const [addingQ, setAddingQ] = useState(false);

  const handleAddQuestion = async () => {
    if (!questionText || options.some(o => !o.optionText)) return;
    if (!options.some(o => o.isCorrect)) return;
    setAddingQ(true);
    try {
      const res = await QuizService.addQuestion({
        quizId,
        questionText,
        orderIndex: questions.length,
        points: 1,
        options: options.map((o, i) => ({ ...o, orderIndex: i })),
      });
      if (res.succeeded) {
        setQuestionText("");
        setOptions([
          { optionText: "", isCorrect: true, orderIndex: 0 },
          { optionText: "", isCorrect: false, orderIndex: 1 },
        ]);
        setShowAdd(false);
        fetchQuestions();
        onRefresh();
        setToast({ open: true, type: "success", message: "تم إضافة السؤال" });
      }
    } catch {}
    setAddingQ(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()} dir="rtl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-neutral-900">أسئلة الاختبار ({questions.length})</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
            >
              <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
              إضافة سؤال
            </button>
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg transition">
              <FontAwesomeIcon icon={faTimes} className="text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Add Question Form */}
        {showAdd && (
          <div className="bg-emerald-50 rounded-xl p-4 mb-4 space-y-3">
            <input
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              placeholder="نص السؤال"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="space-y-2">
              <p className="text-xs font-semibold text-neutral-600">الخيارات (حدد الإجابة الصحيحة):</p>
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={opt.isCorrect}
                    onChange={() => setOptions(prev => prev.map((o, i) => ({ ...o, isCorrect: i === idx })))}
                    className="accent-emerald-600"
                  />
                  <input
                    value={opt.optionText}
                    onChange={e => setOptions(prev => prev.map((o, i) => i === idx ? { ...o, optionText: e.target.value } : o))}
                    placeholder={`الخيار ${idx + 1}`}
                    className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => setOptions(prev => prev.filter((_, i) => i !== idx))}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-xs" />
                    </button>
                  )}
                </div>
              ))}
              {options.length < 6 && (
                <button
                  onClick={() => setOptions(prev => [...prev, { optionText: "", isCorrect: false, orderIndex: prev.length }])}
                  className="text-xs text-emerald-600 font-semibold hover:underline"
                >
                  + إضافة خيار
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddQuestion}
                disabled={addingQ || !questionText || options.some(o => !o.optionText)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {addingQ ? <FontAwesomeIcon icon={faSpinner} spin /> : "حفظ السؤال"}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 bg-neutral-200 text-neutral-600 rounded-lg text-xs font-semibold hover:bg-neutral-300 transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Questions List */}
        {loading ? (
          <div className="flex justify-center py-10">
            <FontAwesomeIcon icon={faSpinner} spin className="text-2xl text-emerald-600" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-10 text-neutral-400">
            <FontAwesomeIcon icon={faQuestionCircle} className="text-3xl mb-2" />
            <p className="text-sm">لا توجد أسئلة بعد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-neutral-50 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-bold text-neutral-800">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold ml-2">
                      {idx + 1}
                    </span>
                    {q.questionText}
                  </h4>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    disabled={deleting === q.id}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                  >
                    {deleting === q.id ? <FontAwesomeIcon icon={faSpinner} spin className="text-xs" /> : <FontAwesomeIcon icon={faTrash} className="text-xs" />}
                  </button>
                </div>
                <div className="space-y-1 mr-8">
                  {q.options.map(opt => (
                    <div key={opt.id} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${opt.isCorrect ? "bg-green-100 text-green-700 font-semibold" : "text-neutral-600"}`}>
                      <FontAwesomeIcon icon={opt.isCorrect ? faCheckCircle : faTimesCircle} className={`text-[10px] ${opt.isCorrect ? "text-green-600" : "text-neutral-300"}`} />
                      {opt.optionText}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Attempts Modal =====
function AttemptsModal({ quizId, onClose }: { quizId: number; onClose: () => void }) {
  const [attempts, setAttempts] = useState<QuizAttemptData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    QuizService.getAttempts(quizId)
      .then(res => { if (res.succeeded && res.data) setAttempts(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [quizId]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()} dir="rtl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-neutral-900">محاولات الطلاب ({attempts.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg transition">
            <FontAwesomeIcon icon={faTimes} className="text-neutral-500" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <FontAwesomeIcon icon={faSpinner} spin className="text-2xl text-emerald-600" />
          </div>
        ) : attempts.length === 0 ? (
          <div className="text-center py-10 text-neutral-400">
            <FontAwesomeIcon icon={faUsers} className="text-3xl mb-2" />
            <p className="text-sm">لا توجد محاولات بعد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold text-neutral-600">الطالب</th>
                  <th className="px-4 py-3 text-right font-semibold text-neutral-600">الدرجة</th>
                  <th className="px-4 py-3 text-right font-semibold text-neutral-600">الصحيحة</th>
                  <th className="px-4 py-3 text-right font-semibold text-neutral-600">النتيجة</th>
                  <th className="px-4 py-3 text-right font-semibold text-neutral-600">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {attempts.map(a => (
                  <tr key={a.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-semibold text-neutral-800">{a.studentName}</td>
                    <td className="px-4 py-3 text-neutral-600">{a.scorePercentage}%</td>
                    <td className="px-4 py-3 text-neutral-600">{a.correctAnswers}/{a.totalQuestions}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${a.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {a.passed ? "ناجح" : "راسب"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">{a.startedAt}</td>
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
