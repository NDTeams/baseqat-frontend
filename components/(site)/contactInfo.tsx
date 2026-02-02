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
              <Link
                href="tel:+966500000000"
                className="text-emerald-700 font-bold"
              >
                +966 50 000 0000
              </Link>
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
              <Link
                href="mailto:hello@basqat.com"
                className="text-emerald-700 font-bold"
              >
                hello@basqat.com
              </Link>
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
        <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 text-sm">
          {t("contactInfo.mapPlaceholder")}
        </div>
      </div>
    </section>
  );
}
