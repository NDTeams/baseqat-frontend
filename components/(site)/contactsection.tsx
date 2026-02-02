"use client";

import { useTranslation } from "react-i18next";
import ContactForm from "./contact-form";

export default function ContactSection() {
  const { t } = useTranslation();

  // دالة لمعالجة البيانات المستلمة من الفورم
  const handleFormData = (data: {
    fullName: string;
    email: string;
    phone: string;
    service: string;
    message: string;
  }) => {
    console.log("Received from ContactForm:", data);
    // هنا يمكنك إرسال البيانات إلى API أو عرض إشعار
    alert(`تم استلام رسالتك، ${data.fullName}!`);
  };

  return (
    <section className="bg-white w-full py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left content */}
          <div className="space-y-4">
            <span className="text-sm font-semibold text-primary">
              {t("contact.badge")}
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {t("contact.title")}
            </h2>

            <p className="text-slate-600 text-base">{t("contact.description")}</p>

            <div className="space-y-3 text-background">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-emerald-100 text-primary flex items-center justify-center">
                  📞
                </span>
                <div>
                  <p className="font-semibold">{t("contact.phoneLabel")}</p>
                  <a href="tel:+966500000000" className="text-primary font-bold">
                    +966 50 000 0000
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-emerald-100 text-primary flex items-center justify-center">
                  ✉️
                </span>
                <div>
                  <p className="font-semibold">{t("contact.emailLabel")}</p>
                  <a href="mailto:hello@basqat.com" className="text-primary font-bold">
                    hello@basqat.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-emerald-100 text-primary flex items-center justify-center">
                  📍
                </span>
                <div>
                  <p className="font-semibold">{t("contact.addressLabel")}</p>
                  <p>{t("contact.address")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
         <ContactForm
  
/>

        </div>
      </div>
    </section>
  );
}
