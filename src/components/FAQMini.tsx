"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Reveal } from "./product-marketing";

type FaqItem = { q: string; a: string };

export default function FAQMini() {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
    q: t(`home.faq${n}q`),
    a: t(`home.faq${n}a`),
  }));

  return (
    <section
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_40%,#eef3ff_76%,#ffffff_100%)] py-16 text-center text-slate-800 sm:py-24"
      dir={getTextDirection(i18n.language)}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-36 h-[360px] w-[360px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 bottom-12 h-[360px] w-[360px] rounded-full bg-violet-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
        <Reveal from="up" distance={20}>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
            {t("home.faqEyebrow")}
          </div>
        </Reveal>

        <Reveal from="up" distance={26} blur delay={0.06}>
          <h2 className="mt-7 text-4xl font-black leading-[1.05] tracking-[-0.04em] text-slate-800 sm:text-5xl">
            {t("home.faqTitle")}
          </h2>
        </Reveal>

        <Reveal from="up" distance={20} delay={0.12}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {t("home.faqLead")}
          </p>
        </Reveal>

        <div className="mt-12 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <Reveal key={item.q} from="up" distance={18} delay={i * 0.04}>
                <div
                  className={`overflow-hidden rounded-[1.5rem] border text-center transition-colors ${
                    isOpen
                      ? "border-indigo-200 bg-white shadow-[0_18px_50px_rgba(79,70,229,0.12)]"
                      : "border-slate-100 bg-white/85 hover:border-indigo-100"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 px-5 py-5 text-center sm:px-7"
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-black transition ${
                        isOpen
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="flex-1 text-base font-black leading-7 tracking-[-0.02em] text-slate-800 sm:text-lg">
                      {item.q}
                    </span>

                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xl font-black ${
                        isOpen
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-50 text-indigo-700"
                      }`}
                      aria-hidden="true"
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="body"
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={
                          reduceMotion ? undefined : { height: 0, opacity: 0 }
                        }
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6 text-start sm:px-7">
                          <p className="mx-auto max-w-2xl text-base font-semibold leading-8 text-slate-600">
                            {item.a}
                          </p>
                          {i === 9 ? (
                            <p className="mx-auto mt-3 max-w-2xl">
                              <Link to="/pricing" className="font-black text-indigo-700 underline">
                                {t("home.finalPricing")}
                              </Link>
                            </p>
                          ) : null}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal from="up" distance={24} delay={0.1}>
          <div className="mt-14 rounded-[2rem] border border-indigo-100 bg-white/85 px-6 py-10 text-center shadow-[0_24px_70px_rgba(79,70,229,0.12)] backdrop-blur sm:px-12">
            <span
              className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-2xl text-white shadow-lg shadow-indigo-200"
              aria-hidden="true"
            >
              ✦
            </span>

            <h2 className="mt-6 text-2xl font-black tracking-[-0.03em] text-slate-900 sm:text-3xl">
              {t("home.finalTitle")}
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-base font-semibold leading-7 text-slate-600">
              {t("home.finalLead")}
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/pricing"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 sm:w-auto"
              >
                {t("home.startTrial")}
              </Link>

              <Link
                to="/pricing"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-indigo-100 bg-white px-7 py-3.5 text-sm font-black text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 sm:w-auto"
              >
                {t("home.finalPricing")}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
