"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function AboutUsPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-5 sm:px-8 bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-600 dark:from-emerald-900 dark:via-emerald-950 dark:to-emerald-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-md rounded-full text-sm font-medium border border-emerald-300/50">
            <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
            {t("about.subtitle")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            {t("about.title")}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            {t("about.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="px-8 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              {t("about.contactUs")}
            </button>
            <button className="px-8 py-3 bg-emerald-500/20 backdrop-blur-md border border-emerald-300/50 text-white font-semibold rounded-lg hover:bg-emerald-500/30 transition-all duration-300">
              {t("about.explorePrograms")}
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-20 py-20">
        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { key: "stats.clients", value: "500+", icon: "👥" },
            { key: "stats.projects", value: "1200+", icon: "📊" },
            { key: "stats.years", value: "10+", icon: "⭐" },
            { key: "stats.satisfaction", value: "98%", icon: "✨" },
          ].map((stat, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 md:p-8 text-center border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg"
            >
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-medium">
                {t(`about.${stat.key}`)}
              </div>
            </div>
          ))}
        </section>

        {/* Vision & Mission Section */}
        <section className="grid md:grid-cols-2 gap-8 py-8">
          {/* Vision */}
          <div className="group relative bg-gradient-to-br from-emerald-600 to-emerald-800 dark:from-emerald-700 dark:to-emerald-900 rounded-3xl p-8 md:p-10 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative space-y-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">{t("about.vision")}</h2>
              <p className="text-emerald-100 leading-relaxed text-lg">
                {t("about.visionText")}
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="group relative bg-gradient-to-br from-emerald-600 to-emerald-800 dark:from-emerald-700 dark:to-emerald-900 rounded-3xl p-8 md:p-10 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative space-y-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">{t("about.mission")}</h2>
              <p className="text-emerald-100 leading-relaxed text-lg">
                {t("about.missionText")}
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              {t("about.ourValues")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              {t("about.valuesDescription")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: t("about.values.innovation"),
                desc: t("about.values.innovationDesc"),
                color: "from-emerald-500 to-teal-500",
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: t("about.values.teamwork"),
                desc: t("about.values.teamworkDesc"),
                color: "from-emerald-500 to-teal-500",
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: t("about.values.quality"),
                desc: t("about.values.qualityDesc"),
                color: "from-purple-500 to-pink-500",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className={`relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                  {t("about.whyChooseUs")}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {t("about.whyChooseUsDesc")}
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  t("about.benefits.experts"),
                  t("about.benefits.methods"),
                  t("about.benefits.support"),
                  t("about.benefits.results"),
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 text-lg font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 dark:from-emerald-700 dark:to-emerald-900 rounded-3xl p-12 flex flex-col items-center justify-center min-h-96">
                <div className="text-7xl font-bold text-white mb-4 text-center">10+</div>
                <div className="text-2xl text-emerald-100 text-center font-semibold">
                  {t("about.yearsExperience")}
                </div>
                <div className="mt-8 flex gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">👥</div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">🎓</div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">🚀</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 px-8 md:px-16 bg-gradient-to-r from-gray-900 via-emerald-900 to-gray-900 dark:from-gray-950 dark:via-emerald-950 dark:to-gray-950 rounded-3xl text-white overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
          
          <div className="relative text-center space-y-8 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              {t("about.ctaTitle")}
            </h2>
            <p className="text-lg text-blue-100">
              {t("about.ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                {t("about.contactUs")} →
              </a>
              <a
                href="/courses-archive"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 border-2 border-emerald-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                {t("about.explorePrograms")} ↗
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
