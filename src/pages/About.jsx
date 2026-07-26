import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Handshake,
  Headset,
  LayoutDashboard,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  Zap,
} from "lucide-react";
import "../styles/About.css";

const valueIcons = [UsersRound, Zap, ShieldCheck, Settings2];
const serviceMeta = [
  { key: "service1", icon: Handshake, to: "/collaborations" },
  { key: "service2", icon: LayoutDashboard, to: "/website-builder" },
  { key: "service3", icon: Headset, to: "/agents" },
  { key: "service4", icon: Bot, to: "/automations" },
  { key: "service5", icon: UsersRound, to: "/crm" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

function About() {
  const { t } = useTranslation();

  const stats = [1, 2, 3].map((n) => ({
    value: t(`about.stat${n}Value`),
    label: t(`about.stat${n}Label`),
  }));

  const values = [1, 2, 3, 4].map((n, i) => ({
    title: t(`about.value${n}Title`),
    text: t(`about.value${n}Text`),
    icon: valueIcons[i],
  }));

  const services = serviceMeta.map((item) => ({
    ...item,
    title: t(`about.${item.key}Title`),
  }));

  return (
    <div className="about-page">
      <Helmet>
        <title>{t("about.seoTitle")}</title>
        <meta name="description" content={t("about.seoDescription")} />
        <link rel="canonical" href="https://bizuply.com/about" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={t("about.ogTitle")} />
        <meta property="og:description" content={t("about.ogDescription")} />
        <meta property="og:url" content="https://bizuply.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
      </Helmet>

      <main className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* HERO — start aligned, dense, image-forward */}
        <section className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="about-float about-pulse-glow overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/70 p-2 shadow-[0_24px_70px_rgba(109,40,217,0.16)] backdrop-blur">
              <img
                src="/images/about-dashboard-hero.png"
                alt={t("about.heroImageAlt")}
                className="about-media h-auto w-full rounded-[1.2rem] object-cover"
              />
            </div>

            <motion.div
              className="about-float-slow absolute -bottom-3 start-3 z-10 flex max-w-[230px] items-center gap-3 rounded-2xl border border-white bg-white/95 p-3 shadow-[0_16px_40px_rgba(109,40,217,0.2)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.55 }}
            >
              <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <Sparkles size={18} />
              </div>
              <div className="text-start">
                <p className="text-xs font-black text-slate-800">
                  {t("about.heroFloatTitle")}
                </p>
                <p className="text-[11px] font-semibold text-slate-500">
                  {t("about.heroFloatText")}
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="order-1 text-start lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6D28D9]">
              {t("about.badge")}
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              {t("about.heroTitle")}
            </h1>
            <p className="about-shimmer mt-4 text-2xl font-black leading-snug sm:text-3xl">
              {t("about.heroHighlight")}
            </p>
            <p className="mt-4 max-w-xl text-base font-medium leading-7 text-slate-600 sm:text-lg">
              {t("about.heroSubtitle")}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#6D28D9] px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(109,40,217,0.28)] transition hover:-translate-y-0.5 hover:bg-[#5B21B6]"
              >
                {t("about.ctaPrimary")}
                <ArrowLeft size={16} className="rtl:rotate-180" />
              </Link>
              <Link
                to="/crm"
                className="inline-flex h-11 items-center rounded-xl border border-violet-200 bg-white/80 px-5 text-sm font-black text-slate-800 transition hover:-translate-y-0.5 hover:border-violet-300"
              >
                {t("about.ctaSecondary")}
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3 rounded-2xl border border-violet-100 bg-white/75 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-start"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                >
                  <p className="text-2xl font-black tracking-tight text-[#6D28D9] sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* MISSION — start aligned, not centered */}
        <motion.section
          className="mt-16 rounded-[1.6rem] border border-violet-100 bg-white/80 p-6 shadow-[0_14px_40px_rgba(109,40,217,0.08)] sm:p-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="flex items-start gap-4 text-start">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-l from-violet-100 to-sky-100 text-[#6D28D9]">
              <Target size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {t("about.missionTitle")}
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                {t("about.missionText")}
              </p>
            </div>
          </div>
        </motion.section>

        {/* VALUES */}
        <motion.section
          className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <motion.article
                key={value.title}
                variants={fadeUp}
                className="about-card rounded-2xl border border-violet-100 bg-white/85 p-5 text-start shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
              >
                <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 text-[#6D28D9]">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-black text-slate-900">{value.title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                  {value.text}
                </p>
              </motion.article>
            );
          })}
        </motion.section>

        {/* WHO WE ARE + TEAM */}
        <motion.section
          className="mt-16 grid items-center gap-8 lg:grid-cols-2 lg:gap-10"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="about-media overflow-hidden rounded-[1.6rem] border border-white/80 shadow-[0_22px_60px_rgba(109,40,217,0.14)]">
            <img
              src="/images/about-team.jpg"
              alt={t("about.whoImageAlt")}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="text-start">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-l from-violet-100 to-sky-100 text-[#6D28D9]">
              <UsersRound size={22} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              {t("about.whoTitle")}
            </h2>
            <p className="mt-3 text-base font-medium leading-7 text-slate-600">
              {t("about.whoText")}
            </p>
          </div>
        </motion.section>

        {/* PRODUCT WIDGETS — their dashboard images */}
        <motion.section
          className="mt-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="mb-5 text-start">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              {t("about.widgetsTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-base text-slate-600">
              {t("about.widgetsText")}
            </p>
          </div>
          <div className="about-float-slow overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/70 p-2 shadow-[0_22px_60px_rgba(109,40,217,0.12)] backdrop-blur">
            <img
              src="/images/about-widgets.png"
              alt={t("about.widgetsImageAlt")}
              className="about-media h-auto w-full rounded-[1.2rem] object-cover"
            />
          </div>
        </motion.section>

        {/* SERVICES */}
        <motion.section
          className="mt-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="mb-5 text-start">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              {t("about.servicesTitle")}
            </h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-l from-[#6D28D9] to-[#2563EB]" />
          </div>

          <motion.div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.key} variants={fadeUp}>
                  <Link
                    to={service.to}
                    className="about-card flex h-full flex-col items-start rounded-2xl border border-violet-100 bg-white/85 px-4 py-6 text-start shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
                  >
                    <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 text-[#6D28D9]">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 sm:text-base">
                      {service.title}
                    </h3>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* CTA — no social proof */}
        <motion.section
          className="relative mt-14 overflow-hidden rounded-[1.8rem] bg-gradient-to-l from-[#6D28D9] via-[#4c1d95] to-[#0f172a] px-6 py-12 text-start text-white shadow-[0_24px_70px_rgba(109,40,217,0.35)] sm:px-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="pointer-events-none absolute -start-10 top-0 h-40 w-40 rounded-full bg-sky-400/30 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
                <Sparkles size={22} />
              </div>
              <h2 className="max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
                {t("about.ctaTitle")}
              </h2>
            </div>
            <Link
              to="/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-black text-[#6D28D9] transition hover:-translate-y-1 hover:bg-violet-50"
            >
              {t("about.ctaPrimary")}
              <ArrowLeft size={16} className="rtl:rotate-180" />
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default About;
