"use client";

import { useTranslation } from "react-i18next";

export default function ContactForm() {
    const { t } = useTranslation();
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl shadow-lg p-6 sm:p-7">
      <form className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-background mb-1">
              {t("contact.fullName")}
            </label>
            <input
              type="text"
              placeholder={t("contact.fullNamePlaceholder")}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-background mb-1">
              {t("contact.email")}
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>
        </div>

        {/* الهاتف */}
        <div>
          <label className="block text-sm font-semibold text-background mb-1">
            {t("contact.phone")}
          </label>
          <input
            type="text"
            placeholder="+966"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
        </div>

        {/* الخدمة */}
        <div>
          <label className="block text-sm font-semibold text-background mb-1">
            {t("contact.service")}
          </label>
          <select className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white">
            <option>{t("contact.serviceOptions.choose")}</option>
            <option>{t("contact.serviceOptions.market")}</option>
            <option>{t("contact.serviceOptions.launch")}</option>
            <option>{t("contact.serviceOptions.digital")}</option>
            <option>{t("contact.serviceOptions.session")}</option>
            <option>{t("contact.serviceOptions.training")}</option>
          </select>
        </div>

        {/* الرسالة */}
        <div>
          <label className="block text-sm font-semibold text-background mb-1">
            {t("contact.message")}
          </label>
          <textarea
            rows={4}
            placeholder={t("contact.messagePlaceholder")}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
          ></textarea>
        </div>

        {/* زر الإرسال */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-lg transition"
        >
          {t("contact.submit")}
        </button>
      </form>
    </div>
  );
}
