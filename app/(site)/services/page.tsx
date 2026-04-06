"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface Service {
  id: number;
  titleKey: string;
  descKey: string;
  featuresKey: string;
  icon: string;
  color: string;
}

export default function ServicesPage() {
  const { t } = useTranslation();
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const services: Service[] = [
    {
      id: 1,
      titleKey: "services.acceleration.title",
      descKey: "services.acceleration.description",
      featuresKey: "services.acceleration.features",
      icon: "🚀",
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: 2,
      titleKey: "services.incubation.title",
      descKey: "services.incubation.description",
      featuresKey: "services.incubation.features",
      icon: "🏥",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 4,
      titleKey: "services.workspace.title",
      descKey: "services.workspace.description",
      featuresKey: "services.workspace.features",
      icon: "🏢",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 5,
      titleKey: "services.digital.title",
      descKey: "services.digital.description",
      featuresKey: "services.digital.features",
      icon: "💻",
      color: "from-red-500 to-pink-500",
    },
    {
      id: 6,
      titleKey: "services.development.title",
      descKey: "services.development.description",
      featuresKey: "services.development.features",
      icon: "📈",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-5 sm:px-8 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-600 dark:from-emerald-900 dark:via-emerald-950 dark:to-emerald-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            {t("services.pageTitle")}
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
            {t("services.pageSubtitle")}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        {/* Services Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const featuresData = t(service.featuresKey, { returnObjects: true }) as unknown;
            const features = Array.isArray(featuresData) ? featuresData : [];
            return (
              <div
                key={service.id}
                className="group relative cursor-pointer"
                onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
              >
                {/* Card */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700 h-full overflow-hidden">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                  {/* Content */}
                  <div className="relative space-y-4">
                    {/* Icon */}
                    <div className="text-6xl mb-6">{service.icon}</div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {t(service.titleKey)}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {t(service.descKey)}
                    </p>

                    {/* Features - Expandable */}
                    {selectedService === service.id && (
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3 animate-in">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          المميزات:
                        </h4>
                        <ul className="space-y-2">
                          {Array.isArray(features) && features.map((feature: string, idx: number) => (
                            <li
                              key={idx}
                              className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
                            >
                              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Learn More Button */}
                    <button className="mt-6 inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                      {selectedService === service.id ? t("services.closeMore") : t("services.learnMore")}
                      <span className={`transition-transform ${selectedService === service.id ? "rotate-180" : ""}`}>
                        ↓
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Why Choose Our Services Section */}
        <section className="mt-32 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              {t("services.whyChoose")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              {t("services.whyChooseDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {(() => {
              const featuresData = t("services.whyChooseFeatures", { returnObjects: true }) as unknown;
              const features = Array.isArray(featuresData) ? featuresData : [];
              return features.map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">
                    {index === 0 ? "✨" : index === 1 ? "🎯" : index === 2 ? "🤝" : "💡"}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {item?.title || item}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item?.desc || ""}
                  </p>
                </div>
              ));
            })()}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative mt-32 py-16 px-8 md:px-16 bg-gradient-to-r from-gray-900 via-emerald-900 to-gray-900 dark:from-gray-950 dark:via-emerald-950 dark:to-gray-950 rounded-3xl text-white overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>

          <div className="relative text-center space-y-8 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              {t("services.ctaTitle")}
            </h2>
            <p className="text-lg text-emerald-100">
              {t("services.ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                {t("about.contactUs")} →
              </a>
              <a
                href="/consultants"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 border-2 border-emerald-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                {t("about.exploreConsultants") || "استكشف المستشا��ين"} ↗
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
