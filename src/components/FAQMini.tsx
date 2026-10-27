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
        <Reveal from="up" distance={26} blur delay={0.06}>
          <h2 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] text-slate-800 sm:text-5xl">
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

      </div>
      <section className="home-close" dir={getTextDirection(i18n.language)}>
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
          <h2>{t("home.finalTitle")}</h2>
          <p>{t("home.finalLead")}</p>
          <div className="home-close__actions">
            <Link to="/register" className="home-cta home-cta--primary">
              {t("home.startTrial")}
            </Link>
            <Link to="/pricing" className="home-cta home-cta--ghost">
              {t("home.finalPricing")}
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
}
