"use client";

import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCertificate,
  faSpinner,
  faDownload,
  faAward,
  faClock,
  faUserTie,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { CertificateService, type CertificateData } from "@/services/courses/page";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  useEffect(() => {
    CertificateService.getMyCertificates()
      .then((res) => {
        if (res.succeeded && res.data) setCertificates(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">شهاداتي</h1>
        <p className="text-sm text-neutral-500 mt-1">
          جميع الشهادات التي حصلت عليها من دورات منصة باسقات
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-emerald-600" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-neutral-400">
          <FontAwesomeIcon icon={faAward} className="text-5xl" />
          <p className="text-lg font-semibold">لا توجد شهادات حتى الآن</p>
          <p className="text-sm">أكمل دوراتك للحصول على شهادات معتمدة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100 hover:shadow-xl transition-all"
            >
              {/* Certificate Preview Banner */}
              <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 p-6 text-white relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <FontAwesomeIcon icon={faCertificate} className="text-amber-300 text-lg" />
                    <span className="text-sm font-semibold text-amber-200">شهادة إتمام</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{cert.courseTitle}</h3>
                  <p className="text-xs text-emerald-200">رقم الشهادة: {cert.certificateNumber}</p>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <FontAwesomeIcon icon={faUserTie} className="text-emerald-500 text-xs" />
                    <span>المدرب: <span className="font-semibold text-neutral-800">{cert.instructorName}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <FontAwesomeIcon icon={faClock} className="text-emerald-500 text-xs" />
                    <span>{cert.courseDurationHours} ساعة</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-emerald-500 text-xs" />
                    <span>تاريخ الإصدار: {cert.issuedAt}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-neutral-100">
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="flex-1 bg-emerald-600 text-white text-center py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition text-sm flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faCertificate} className="text-xs" />
                    عرض الشهادة
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCert(cert);
                      setTimeout(() => {
                        window.print();
                      }, 500);
                    }}
                    className="bg-neutral-100 text-neutral-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-neutral-200 transition text-sm flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faDownload} className="text-xs" />
                    طباعة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
    </div>
  );
}

function CertificateModal({ cert, onClose }: { cert: CertificateData; onClose: () => void }) {
  const certRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - hidden in print */}
        <div className="flex justify-end p-4 print:hidden">
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-xl px-2">&times;</button>
        </div>

        {/* Certificate Design */}
        <div ref={certRef} className="px-8 pb-10 print:px-0" dir="rtl">
          <div className="border-4 border-emerald-700 rounded-2xl p-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-50 rounded-full -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-50 rounded-full translate-x-20 translate-y-20" />
            <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-300 rounded-full" />
            <div className="absolute top-4 left-4 w-3 h-3 bg-emerald-300 rounded-full" />
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-emerald-300 rounded-full" />
            <div className="absolute bottom-4 left-4 w-3 h-3 bg-emerald-300 rounded-full" />

            <div className="relative z-10 text-center space-y-6">
              {/* Logo */}
              <div className="flex justify-center">
                <img src="/site/logo.png" alt="باسقات" className="h-16 object-contain" />
              </div>

              {/* Title */}
              <div>
                <h2 className="text-3xl font-black text-emerald-800 mb-1">شهادة إتمام</h2>
                <p className="text-sm text-neutral-500">Certificate of Completion</p>
              </div>

              <div className="w-24 h-0.5 bg-emerald-300 mx-auto" />

              {/* Student Name */}
              <div>
                <p className="text-sm text-neutral-500 mb-1">تشهد منصة باسقات بأن</p>
                <h3 className="text-2xl font-black text-neutral-900 border-b-2 border-amber-400 inline-block pb-1 px-6">
                  {cert.studentName}
                </h3>
              </div>

              {/* Course */}
              <div>
                <p className="text-sm text-neutral-500 mb-1">قد أتم بنجاح دورة</p>
                <h4 className="text-xl font-bold text-emerald-700">{cert.courseTitle}</h4>
              </div>

              {/* Details */}
              <div className="flex items-center justify-center gap-8 text-sm text-neutral-600">
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faClock} className="text-emerald-500 text-xs" />
                  <span>{cert.courseDurationHours} ساعة تدريبية</span>
                </div>
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faUserTie} className="text-emerald-500 text-xs" />
                  <span>المدرب: {cert.instructorName}</span>
                </div>
              </div>

              {cert.courseStartDate && cert.courseEndDate && (
                <p className="text-xs text-neutral-400">
                  الفترة: {cert.courseStartDate} - {cert.courseEndDate}
                </p>
              )}

              <div className="w-24 h-0.5 bg-emerald-300 mx-auto" />

              {/* Stamp and signature area */}
              <div className="flex items-end justify-between pt-4">
                <div className="text-center">
                  <div className="w-20 h-20 border-2 border-emerald-300 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <img src="/site/logo.png" alt="ختم" className="w-12 h-12 object-contain opacity-60" />
                  </div>
                  <p className="text-xs text-neutral-500">ختم المنصة</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-xs text-neutral-400 mb-1">رقم الشهادة</p>
                  <p className="text-sm font-mono font-bold text-emerald-700">{cert.certificateNumber}</p>
                  <p className="text-xs text-neutral-400 mt-2">تاريخ الإصدار: {cert.issuedAt}</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-0.5 bg-neutral-400 mb-2 mx-auto" />
                  <p className="text-xs text-neutral-500">التوقيع</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions - hidden in print */}
        <div className="flex justify-center gap-3 pb-6 print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition text-sm"
          >
            <FontAwesomeIcon icon={faDownload} className="text-xs" />
            طباعة / تحميل PDF
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-100 text-neutral-600 font-semibold rounded-xl hover:bg-neutral-200 transition text-sm"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
