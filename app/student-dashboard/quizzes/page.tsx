"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardCheck,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faPercent,
  faPlay,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  QuizService,
  type QuizAttemptData,
  type QuizForStudent,
} from "@/services/courses/page";

export default function QuizzesPage() {
  const [attempts, setAttempts] = useState<QuizAttemptData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState<QuizForStudent | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizAttemptData | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = () => {
    setLoading(true);
    QuizService.myAttempts()
      .then((res) => {
        if (res.succeeded && res.data) setAttempts(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const startQuiz = async (quizId: number) => {
    setQuizLoading(true);
    try {
      const res = await QuizService.start(quizId);
      if (res.succeeded && res.data) {
        setActiveQuiz(res.data);
        setAnswers({});
        setResult(null);
      }
    } catch {}
    setQuizLoading(false);
  };

  const handleSubmit = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);
    try {
      const answersArray = activeQuiz.questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id] ?? null,
      }));
      const res = await QuizService.submit({ quizId: activeQuiz.id, answers: answersArray });
      if (res.succeeded && res.data) {
        setResult(res.data);
        fetchAttempts();
      }
    } catch {}
    setSubmitting(false);
  };

  // Active Quiz View
  if (activeQuiz && !result) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto" dir="rtl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">{activeQuiz.title}</h1>
            <p className="text-sm text-neutral-500">{activeQuiz.courseTitle}</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} className="text-xs text-emerald-500" />
              {activeQuiz.durationInMinutes} دقيقة
            </span>
            <span>درجة النجاح: {activeQuiz.passingScore}%</span>
          </div>
        </div>

        {activeQuiz.questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-base font-bold text-neutral-900 mb-4">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold ml-2">
                {idx + 1}
              </span>
              {q.questionText}
            </h3>
            <div className="space-y-2">
              {q.options.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${
                    answers[q.id] === opt.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-neutral-200 hover:border-emerald-300 hover:bg-neutral-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[q.id] === opt.id}
                    onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                    className="accent-emerald-600"
                  />
                  <span className="text-sm text-neutral-700">{opt.optionText}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition text-sm flex items-center justify-center gap-2"
          >
            {submitting ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <>تسليم الاختبار</>
            )}
          </button>
          <button
            onClick={() => { setActiveQuiz(null); setAnswers({}); }}
            className="px-6 py-3 bg-neutral-100 text-neutral-600 rounded-xl font-semibold hover:bg-neutral-200 transition text-sm"
          >
            إلغاء
          </button>
        </div>
      </div>
    );
  }

  // Result View
  if (result) {
    return (
      <div className="flex flex-col items-center gap-6 py-12 max-w-md mx-auto" dir="rtl">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
          result.passed ? "bg-green-100" : "bg-red-100"
        }`}>
          <FontAwesomeIcon
            icon={result.passed ? faCheckCircle : faTimesCircle}
            className={`text-4xl ${result.passed ? "text-green-600" : "text-red-600"}`}
          />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">
          {result.passed ? "تهانينا! نجحت في الاختبار" : "لم تجتز الاختبار"}
        </h2>
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">الاختبار</span>
            <span className="font-semibold">{result.quizTitle}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">الدرجة</span>
            <span className={`font-bold text-lg ${result.passed ? "text-green-600" : "text-red-600"}`}>
              {result.scorePercentage}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">الإجابات الصحيحة</span>
            <span className="font-semibold">{result.correctAnswers} / {result.totalQuestions}</span>
          </div>
        </div>
        <button
          onClick={() => { setResult(null); setActiveQuiz(null); }}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition text-sm"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          العودة للاختبارات
        </button>
      </div>
    );
  }

  // Attempts List
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">اختباراتي</h1>
        <p className="text-sm text-neutral-500 mt-1">سجل الاختبارات والنتائج</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-emerald-600" />
        </div>
      ) : attempts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-neutral-400">
          <FontAwesomeIcon icon={faClipboardCheck} className="text-5xl" />
          <p className="text-lg font-semibold">لم تقدم أي اختبار بعد</p>
          <p className="text-sm">ستظهر هنا نتائج اختباراتك بعد تقديمها</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attempts.map((attempt) => (
            <div key={attempt.id} className="bg-white rounded-2xl shadow-lg p-5 border border-neutral-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-neutral-900">{attempt.quizTitle}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{attempt.courseTitle}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  attempt.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {attempt.passed ? "ناجح" : "راسب"}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faPercent} className="text-xs text-emerald-500" />
                  {attempt.scorePercentage}%
                </span>
                <span>{attempt.correctAnswers}/{attempt.totalQuestions} صحيحة</span>
                <span className="text-xs">{attempt.startedAt}</span>
              </div>

              {!attempt.passed && (
                <button
                  onClick={() => startQuiz(attempt.quizId)}
                  disabled={quizLoading}
                  className="mt-3 w-full bg-emerald-50 text-emerald-700 py-2 rounded-xl font-semibold text-sm hover:bg-emerald-100 transition flex items-center justify-center gap-2"
                >
                  {quizLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : (
                    <>
                      <FontAwesomeIcon icon={faPlay} className="text-xs" />
                      إعادة الاختبار
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
