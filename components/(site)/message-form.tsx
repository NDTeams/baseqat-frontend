"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function MessageForm() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    type: "general",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert(t("form.success"));
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      type: "general",
      message: "",
    });
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7 space-y-5">
      <h2 className="text-xl font-bold text-slate-900">
        {t("form.title")}
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              {t("form.fullName")}
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
              placeholder={t("form.fullNamePlaceholder")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              {t("form.email")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
              placeholder="name@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            {t("form.phone")}
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
            placeholder="+966"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            {t("form.type")}
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white"
          >
            <option value="general">{t("form.types.general")}</option>
            <option value="support">{t("form.types.support")}</option>
            <option value="partners">{t("form.types.partners")}</option>
            <option value="media">{t("form.types.media")}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            {t("form.message")}
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
            placeholder={t("form.messagePlaceholder")}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-lg transition"
        >
          {t("form.submit")}
        </button>
      </form>
    </section>
  );
}
