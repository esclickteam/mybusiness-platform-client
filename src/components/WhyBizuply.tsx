"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Reveal, Stagger, StaggerItem } from "./product-marketing";
import "../styles/homeWow.css";

type Feature = {
  title: string;
  text: string;
  icon: ReactNode;
  badge: string;
  gradient: string;
  glow: string;
};

/** Compact why section — header + three wow cards (no middle dashboard panel). */
export default function WhyBizuply() {
  const { t } = useTranslation();
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setLit((value) => (value + 1) % 3);
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

  const features: Feature[] = [
    {
      title: t("why.feature1Title"),
      text: t("why.feature1Text"),
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3V6M12 18V21M3 12H6M18 12H21"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M7 7H11V11H7V7ZM13 7H17V11H13V7ZM7 13H11V17H7V13ZM13 13H17V17H13V13Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      ),
      badge: t("why.feature1Badge"),
      gradient: "from-indigo-600 to-violet-600",
      glow: "bg-indigo-300/35",
    },
    {
      title: t("why.feature2Title"),
      text: t("why.feature2Text"),
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M13 2L3 14H11L10 22L21 10H13V2Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      ),
      badge: t("why.feature2Badge"),
      gradient: "from-blue-600 to-cyan-500",
      glow: "bg-cyan-300/35",
    },
    {
      title: t("why.feature3Title"),
      text: t("why.feature3Text"),
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 17L9 11L13 15L21 7"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 3V21H21"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      ),
      badge: t("why.feature3Badge"),
      gradient: "from-violet-600 to-fuchsia-500",
      glow: "bg-violet-300/35",
    },
  ];

  return (
    <section
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_40%,#eef3ff_76%,#ffffff_100%)] py-16 text-slate-800 sm:py-24"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-40 h-[360px] w-[360px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 bottom-10 h-[360px] w-[360px] rounded-full bg-violet-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal from="up" distance={18}>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
              {t("why.eyebrow")}
            </div>
          </Reveal>

          <Reveal from="up" distance={24} blur delay={0.06}>
            <h2 className="mt-7 text-4xl font-black leading-[1.02] tracking-[-0.04em] text-slate-800 sm:text-5xl lg:text-6xl">
              {t("why.titleTop")}
              <br />
              <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                {t("why.titleHighlight")}
              </span>
            </h2>
          </Reveal>

          <Reveal from="up" distance={18} delay={0.12}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {t("why.subtitle")}
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-5 sm:mt-14 lg:grid-cols-3" gap={0.08}>
          {features.map((feature, index) => (
            <StaggerItem key={feature.title} className="h-full">
              <div
                className={`home-wow-card home-wow-card--feature${
                  lit === index ? " is-lit" : ""
                }`}
                style={{ "--gold-i": index } as CSSProperties}
              >
                <div className="home-wow-card__inner">
                  <div
                    className={`absolute -right-16 -top-16 h-40 w-40 rounded-full ${feature.glow} blur-3xl transition group-hover:scale-125`}
                    aria-hidden="true"
                  />

                  <div
                    className={`mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-xl shadow-indigo-100`}
                  >
                    {feature.icon}
                  </div>

                  <div className="mb-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-black tracking-wide text-indigo-700">
                    {feature.badge}
                  </div>

                  <h3 className="text-xl font-black leading-tight tracking-[-0.03em] text-slate-800 sm:text-2xl">
                    {feature.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm font-medium leading-7 text-slate-600 sm:text-base">
                    {feature.text}
                  </p>

                  <Link
                    to="/features"
                    className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-black text-indigo-700"
                  >
                    {t("common.learnMore")}
                    <span aria-hidden="true">←</span>
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
