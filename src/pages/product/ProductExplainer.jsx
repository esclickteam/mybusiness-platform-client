import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Globe2,
  Handshake,
  UsersRound,
} from "lucide-react";
import "../../styles/ProductExplainer.css";

const PAGE_META = {
  crm: { icon: UsersRound, accent: "from-[#6D28D9] to-[#2563EB]" },
  collaborations: { icon: Handshake, accent: "from-[#6D28D9] to-[#2563EB]" },
  website: { icon: Globe2, accent: "from-[#6D28D9] to-[#2563EB]" },
  appointments: { icon: CalendarDays, accent: "from-[#6D28D9] to-[#2563EB]" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export default function ProductExplainer({ pageKey }) {
  const { t } = useTranslation();
  const meta = PAGE_META[pageKey] || PAGE_META.crm;
  const Icon = meta.icon;
  const base = `productPages.${pageKey}`;

  const benefits = [1, 2, 3, 4].map((n) => ({
    title: t(`${base}.benefit${n}Title`),
    text: t(`${base}.benefit${n}Text`),
  }));

  const steps = [1, 2, 3, 4].map((n) => ({
    title: t(`${base}.step${n}Title`),
    text: t(`${base}.step${n}Text`),
  }));

  const audience = [1, 2, 3].map((n) => t(`${base}.audience${n}`));

  return (
    <div className="product-page">
      <Helmet>
        <title>{t(`${base}.seoTitle`)}</title>
        <meta name="description" content={t(`${base}.seoDescription`)} />
        <link rel="canonical" href={`https://bizuply.com/${pageKey === "website" ? "website-builder" : pageKey}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={t(`${base}.seoTitle`)} />
        <meta property="og:description" content={t(`${base}.seoDescription`)} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
      </Helmet>

      <div className="product-ambient" aria-hidden="true">
        <span className="a1" />
        <span className="a2" />
        <span className="a3" />
      </div>

      <div className="product-shell mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Hero */}
        <section className="product-enter overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-[0_22px_70px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
          <div className="h-1 bg-gradient-to-l from-sky-300 via-violet-300 to-emerald-300" />

          <div className="grid gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10 lg:py-14">
            <div className="text-start">
              <p className="product-enter product-enter-delay-1 text-xs font-black uppercase tracking-[0.22em] text-sky-600">
                {t(`${base}.badge`)}
              </p>

              <h1 className="product-enter product-enter-delay-1 mt-3 text-4xl font-black tracking-tight text-slate-800 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                {t(`${base}.heroTitle`)}{" "}
                <span
                  className={`bg-gradient-to-l ${meta.accent} bg-clip-text text-transparent`}
                >
                  {t(`${base}.heroHighlight`)}
                </span>
              </h1>

              <p className="product-enter product-enter-delay-2 mt-5 max-w-xl text-base font-semibold leading-8 text-slate-500 sm:text-lg">
                {t(`${base}.heroSubtitle`)}
              </p>

              <div className="product-enter product-enter-delay-3 mt-8 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#6D28D9] px-5 text-sm font-black text-white transition hover:bg-[#5B21B6]"
                >
                  {t("productPages.ctaPrimary")}
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-800 transition hover:border-violet-200 hover:bg-violet-50/50"
                >
                  {t("productPages.ctaPricing")}
                </Link>
              </div>
            </div>

            <div className="product-enter product-enter-delay-2 rounded-[1.6rem] border border-slate-200 bg-[#F7F8FC] p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
              <div
                className={`rounded-2xl bg-gradient-to-br ${meta.accent} p-5 text-white shadow-[0_14px_34px_rgba(37,99,235,0.25)]`}
              >
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
                  <Icon size={24} />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75">
                  {t(`${base}.badge`)}
                </p>
                <p className="mt-2 text-2xl font-black tracking-tight">
                  {t(`${base}.previewTitle`)}
                </p>
                <p className="mt-1 text-sm font-semibold text-white/80">
                  {t(`${base}.previewText`)}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                {audience.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <motion.section
          className="mt-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
              {t("productPages.benefitsBadge")}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
              {t(`${base}.benefitsTitle`)}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-500">
              {t(`${base}.benefitsSubtitle`)}
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-8 grid gap-4 sm:grid-cols-2"
          >
            {benefits.map((item, index) => (
              <motion.article
                key={item.title}
                variants={fadeUp}
                className="product-card rounded-2xl p-6 text-start"
              >
                <p className="text-xs font-black tracking-[0.18em] text-[#6D28D9]">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-lg font-black text-slate-800">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                  {item.text}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        {/* How it works */}
        <motion.section
          className="mt-20 overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.06)] backdrop-blur-2xl sm:p-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
              {t("productPages.stepsBadge")}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-800">
              {t(`${base}.stepsTitle`)}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-500">
              {t(`${base}.stepsSubtitle`)}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-[#F7F8FC] p-5 text-start"
              >
                <p className="text-xs font-black tracking-[0.18em] text-[#6D28D9]">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-lg font-black text-slate-800">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">{step.text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <section className="mb-6 mt-20 overflow-hidden rounded-[2rem] bg-gradient-to-l from-[#6D28D9] to-[#2563EB] p-8 text-white shadow-[0_14px_34px_rgba(37,99,235,0.25)] sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl text-start">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                {t(`${base}.ctaTitle`)}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/85 sm:text-base">
                {t(`${base}.ctaText`)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-black text-[#6D28D9] transition hover:bg-violet-50"
              >
                {t("productPages.ctaPrimary")}
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-5 text-sm font-black text-white transition hover:bg-white/15"
              >
                {t("productPages.ctaContact")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
