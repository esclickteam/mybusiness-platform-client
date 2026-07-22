"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

type FaqBullet = {
  title: string;
  text: string;
};

type FaqItem = {
  q: string;
  a: {
    lead: string;
    bullets: FaqBullet[];
    footer?: string;
  };
};

export default function FAQMini() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const FAQS: FaqItem[] = [
    {
      q: t("faqMini.q1"),
      a: {
        lead: t("faqMini.a1Lead"),
        bullets: [
          { title: t("faqMini.a1b1Title"), text: t("faqMini.a1b1Text") },
          { title: t("faqMini.a1b2Title"), text: t("faqMini.a1b2Text") },
          { title: t("faqMini.a1b3Title"), text: t("faqMini.a1b3Text") },
          { title: t("faqMini.a1b4Title"), text: t("faqMini.a1b4Text") },
        ],
        footer: t("faqMini.a1Footer"),
      },
    },
    {
      q: t("faqMini.q2"),
      a: {
        lead: t("faqMini.a2Lead"),
        bullets: [
          { title: t("faqMini.a2b1Title"), text: t("faqMini.a2b1Text") },
          { title: t("faqMini.a2b2Title"), text: t("faqMini.a2b2Text") },
          { title: t("faqMini.a2b3Title"), text: t("faqMini.a2b3Text") },
        ],
        footer: t("faqMini.a2Footer"),
      },
    },
    {
      q: t("faqMini.q3"),
      a: {
        lead: t("faqMini.a3Lead"),
        bullets: [
          { title: t("faqMini.a3b1Title"), text: t("faqMini.a3b1Text") },
          { title: t("faqMini.a3b2Title"), text: t("faqMini.a3b2Text") },
          { title: t("faqMini.a3b3Title"), text: t("faqMini.a3b3Text") },
          { title: t("faqMini.a3b4Title"), text: t("faqMini.a3b4Text") },
        ],
        footer: t("faqMini.a3Footer"),
      },
    },
    {
      q: t("faqMini.q4"),
      a: {
        lead: t("faqMini.a4Lead"),
        bullets: [
          { title: t("faqMini.a4b1Title"), text: t("faqMini.a4b1Text") },
          { title: t("faqMini.a4b2Title"), text: t("faqMini.a4b2Text") },
          { title: t("faqMini.a4b3Title"), text: t("faqMini.a4b3Text") },
        ],
        footer: t("faqMini.a4Footer"),
      },
    },
  ];

  const chips = [
    "CRM",
    t("faqMini.chipBusinessPage"),
    t("faqMini.a1b3Title"),
    t("faqMini.chipAiTools"),
  ];

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_40%,#eef3ff_76%,#ffffff_100%)] py-24 text-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-36 h-[360px] w-[360px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 bottom-12 h-[360px] w-[360px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute right-24 top-24 hidden h-56 w-56 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 lg:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <div className="lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
              {t("faqMini.eyebrow")}
            </div>

            <h2 className="mt-7 text-4xl font-black leading-[1.02] tracking-[-0.04em] text-slate-800 sm:text-6xl">
              {t("faqMini.titleTop")}
              <br />
              <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                {t("faqMini.titleHighlight")}
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              {t("faqMini.subtitle")}
            </p>

            <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-3 shadow-[0_24px_70px_rgba(79,70,229,0.14)] backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/35 blur-3xl" />
                <div className="absolute -bottom-24 left-8 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl" />

                <div className="relative">
                  <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-2xl shadow-xl shadow-indigo-950/30">
                    ✦
                  </div>

                  <h3 className="text-2xl font-black tracking-[-0.03em]">
                    {t("faqMini.stillTitle")}
                  </h3>

                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">
                    {t("faqMini.stillText")}
                  </p>

                  <div className="mt-6 grid gap-3">
                    {chips.map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black backdrop-blur"
                      >
                        <span>{item}</span>
                        <span className="text-cyan-300">✓</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/80 bg-white/75 p-3 shadow-[0_28px_90px_rgba(79,70,229,0.14)] backdrop-blur-xl">
            <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white">
              {FAQS.map((item, i) => {
                const isOpen = openIndex === i;

                return (
                  <div
                    key={item.q}
                    className={[
                      "border-b border-slate-100 last:border-b-0",
                      isOpen
                        ? "bg-gradient-to-br from-white to-indigo-50/70"
                        : "bg-white",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 px-6 py-6 text-start sm:px-8"
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={[
                            "mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-sm font-black transition",
                            isOpen
                              ? "bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-100"
                              : "bg-indigo-50 text-indigo-700",
                          ].join(" ")}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <span className="text-lg font-black leading-7 tracking-[-0.02em] text-slate-800 sm:text-xl">
                          {item.q}
                        </span>
                      </div>

                      <span
                        className={[
                          "grid h-10 w-10 shrink-0 place-items-center rounded-full text-2xl font-black transition",
                          isOpen
                            ? "rotate-180 border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800"
                            : "bg-slate-50 text-indigo-700",
                        ].join(" ")}
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    <div
                      className={[
                        "grid transition-all duration-300 ease-out",
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      ].join(" ")}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 pb-7 sm:px-8">
                          <div className="ms-0 rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-sm sm:ms-14">
                            <p className="text-base font-semibold leading-8 text-slate-600">
                              {item.a.lead}
                            </p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                              {item.a.bullets.map((bullet) => (
                                <div
                                  key={bullet.title}
                                  className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                                >
                                  <div className="mb-2 flex items-center gap-2">
                                    <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-xs text-white">
                                      ✓
                                    </span>
                                    <strong className="text-sm font-black text-slate-800">
                                      {bullet.title}
                                    </strong>
                                  </div>

                                  <p className="text-sm font-semibold leading-6 text-slate-500">
                                    {bullet.text}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {item.a.footer && (
                              <div className="mt-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-[1px]">
                                <p className="rounded-2xl bg-white px-5 py-4 text-sm font-black leading-6 text-slate-800">
                                  {item.a.footer}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-14 overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-[1px] shadow-[0_24px_80px_rgba(79,70,229,0.24)]">
          <div className="rounded-[2rem] bg-white/10 px-8 py-9 text-center backdrop-blur-xl sm:px-12">
            <h3 className="text-3xl font-black tracking-[-0.03em] text-white">
              {t("faqMini.ctaTitle")}
            </h3>

            <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-7 text-indigo-50">
              {t("faqMini.ctaText")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
