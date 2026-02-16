"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

export default function contactInfoInfo() {
  const { t } = useTranslation();
  const phoneNumber = "+966 55 843 8050";
  const phoneHref = "tel:+966558438050";
  const email = "info@baseqatbusiness.com";
  const mapUrl =
    "https://www.google.com/maps/place/%D8%A8%D8%A7%D8%B3%D9%82%D8%A7%D8%AA%E2%80%AD/@24.4468012,39.5086862,113m/data=!3m1!1e3!4m6!3m5!1s0x15bdc74420baf74b:0x350525b6d9cdd250!8m2!3d24.4468062!4d39.5085615!16s%2Fg%2F11g10plq_b";

  return (
    <section className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          {t("contactInfo.title")}
        </h2>

        <div className="space-y-3 text-slate-700">
          {/* الهاتف */}
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FontAwesomeIcon icon={faPhone} />
            </span>
            <div>
              <p className="font-semibold text-slate-900">
                {t("contactInfo.phoneLabel")}
              </p>
              <a href={phoneHref} className="text-emerald-700 font-bold" dir="ltr">
                {phoneNumber}
              </a>
            </div>
          </div>

          {/* البريد */}
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <div>
              <p className="font-semibold text-slate-900">
                {t("contactInfo.emailLabel")}
              </p>
              <a href={`mailto:${email}`} className="text-emerald-700 font-bold">
                {email}
              </a>
            </div>
          </div>

          {/* العنوان */}
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FontAwesomeIcon icon={faLocationDot} />
            </span>
            <div>
              <p className="font-semibold text-slate-900">
                {t("contactInfo.addressLabel")}
              </p>
              <p>{t("contactInfo.addressValue")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          {t("contactInfo.mapTitle")}
        </h2>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-64 rounded-xl overflow-hidden border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 hover:shadow-md transition"
        >
          <div className="h-full w-full flex flex-col items-center justify-center text-slate-600 text-sm">
            <span className="font-semibold text-slate-800">{t("contactInfo.mapTitle")}</span>
            <span className="mt-2 text-emerald-700">{t("contactInfo.mapPlaceholder")}</span>
          </div>
        </a>
      </div>
    </section>
  );
}
