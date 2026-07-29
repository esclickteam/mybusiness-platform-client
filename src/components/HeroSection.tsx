"use client";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";

import { Reveal, WordReveal } from "./product-marketing";
import LiveStage from "./LiveStage";
import SourcesMarquee from "./SourcesMarquee";

export default function HeroSection() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const trustItems = [
    t("home.trustTrial"),
    t("home.trustNoCard"),
    t("home.trustCancel"),
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_34%,#eef3ff_68%,#ffffff_100%)] text-slate-800">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-260px] h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-indigo-200/50 blur-3xl" />
        <div className="absolute right-[-180px] top-32 h-[460px] w-[460px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute left-[-190px] top-72 h-[460px] w-[460px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

        <div className="absolute right-20 top-24 hidden h-64 w-64 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:18px_18px] opacity-20 lg:block" />
        <div className="absolute left-16 bottom-24 hidden h-56 w-56 bg-[radial-gradient(circle,#06b6d4_1px,transparent_1px)] [background-size:18px_18px] opacity-20 lg:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 text-center sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <Reveal from="down" distance={14} duration={0.6}>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-xs font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur sm:text-sm">
            <motion.span
              className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_18px_rgba(79,70,229,0.85)]"
              animate={
                reduceMotion
                  ? undefined
                  : { scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }
              }
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            {t("home.badge")}
          </div>
        </Reveal>

        <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.055em] text-slate-800 sm:text-6xl lg:text-7xl">
          <WordReveal text={t("home.headlineTop")} delay={0.12} />
          <br />
          <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
            <WordReveal text={t("home.headlineHighlight")} delay={0.42} />
          </span>
        </h1>

        <Reveal from="up" distance={18} delay={0.5} className="mt-7">
          <p className="mx-auto max-w-3xl text-base leading-8 text-slate-600 sm:text-lg lg:text-xl">
            {t("home.subtitle")}
          </p>
        </Reveal>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="cta-solid inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-base font-black text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-300 sm:w-auto"
          >
            {t("home.startTrial")}
          </Link>

          <Link
            to="/pricing"
            className="cta-soft inline-flex w-full items-center justify-center rounded-2xl border border-indigo-100 bg-white/85 px-8 py-4 text-base font-black text-indigo-700 shadow-lg shadow-indigo-100/70 backdrop-blur transition hover:-translate-y-0.5 hover:border-indigo-200 sm:w-auto"
          >
            {t("home.viewPricing")}
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-bold text-slate-500">
          {trustItems.map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {item}
            </span>
          ))}
        </div>

        <Reveal
          from="up"
          distance={34}
          delay={0.55}
          duration={0.9}
          className="mx-auto mt-14 max-w-5xl lg:mt-16"
        >
          <LiveStage />
        </Reveal>

        <div className="mx-auto mt-10 max-w-5xl">
          <SourcesMarquee />
        </div>
      </div>
    </section>
  );
}
