import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
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
import AboutDashboardShowcase from "../components/about/AboutDashboardShowcase";
import "../styles/About.css";

const valueIcons = [UsersRound, Zap, ShieldCheck, Settings2];
const serviceMeta = [
  { key: "service1", icon: Handshake, to: "/collaborations" },
  { key: "service2", icon: LayoutDashboard, to: "/website-builder" },
  { key: "service3", icon: Headset, to: "/agents" },
  { key: "service4", icon: Bot, to: "/automations" },
  { key: "service5", icon: UsersRound, to: "/crm" },
];

const fade = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

function About() {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.94]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.75]);

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

  const dashLabels = {
    nav: {
      dashboard: t("about.dash.navDashboard"),
      leads: t("about.dash.navLeads"),
      clients: t("about.dash.navClients"),
      tasks: t("about.dash.navTasks"),
      calendar: t("about.dash.navCalendar"),
      reports: t("about.dash.navReports"),
      tips: t("about.dash.navTips"),
      settings: t("about.dash.navSettings"),
    },
    help: t("about.dash.help"),
    logout: t("about.dash.logout"),
    avatar: t("about.dash.avatar"),
    owner: t("about.dash.owner"),
    role: t("about.dash.role"),
    kpi: {
      views: t("about.dash.kpiViews"),
      leads: t("about.dash.kpiLeads"),
      reviews: t("about.dash.kpiReviews"),
      collabs: t("about.dash.kpiCollabs"),
    },
    kpiSub: {
      views: t("about.dash.kpiViewsSub"),
      leads: t("about.dash.kpiLeadsSub"),
      reviews: t("about.dash.kpiReviewsSub"),
      collabs: t("about.dash.kpiCollabsSub"),
    },
    recsTitle: t("about.dash.recsTitle"),
    recsSubtitle: t("about.dash.recsSubtitle"),
    urgent: t("about.dash.urgent"),
    recommended: t("about.dash.recommended"),
    viewLeads: t("about.dash.viewLeads"),
    sendFollowUp: t("about.dash.sendFollowUp"),
    viewAllRecs: t("about.dash.viewAllRecs"),
    recText: {
      urgent: t("about.dash.recUrgent"),
      recommended: t("about.dash.recRecommended"),
    },
    toastTitle: t("about.heroFloatTitle"),
    toastText: t("about.heroFloatText"),
  };

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

      <div className="about-orb about-orb-a" aria-hidden="true" />
      <div className="about-orb about-orb-b" aria-hidden="true" />
      <div className="about-orb about-orb-c" aria-hidden="true" />

      <main className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        {/* HERO — centered */}
        <section className="text-center">
          <motion.p
            className="text-xs font-black uppercase tracking-[0.22em] text-[#6D28D9]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t("about.badge")}
          </motion.p>

          <motion.h1
            className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl"
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {t("about.heroTitle")}
          </motion.h1>

          <motion.p
            className="about-title-shine mx-auto mt-4 max-w-3xl text-2xl font-black leading-snug sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.65 }}
          >
            {t("about.heroHighlight")}
          </motion.p>

          <motion.p
            className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-slate-600 sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
          >
            {t("about.heroSubtitle")}
          </motion.p>

          <motion.div
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            <Link
              to="/register"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#6D28D9] px-7 text-sm font-black text-white shadow-[0_14px_34px_rgba(109,40,217,0.35)] transition hover:-translate-y-1 hover:bg-[#5B21B6]"
            >
              {t("about.ctaPrimary")}
              <ArrowLeft size={16} className="rtl:rotate-180" />
            </Link>
            <Link
              to="/crm"
              className="inline-flex h-12 items-center rounded-full border border-violet-200 bg-white/80 px-7 text-sm font-black text-slate-800 transition hover:-translate-y-1"
            >
              {t("about.ctaSecondary")}
            </Link>
          </motion.div>

          <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="mt-10">
            <AboutDashboardShowcase labels={dashLabels} />
          </motion.div>

          <motion.div
            className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fade}
                className="rounded-2xl border border-violet-100 bg-white/80 px-3 py-4 text-center shadow-[0_10px_28px_rgba(109,40,217,0.08)]"
              >
                <p className="text-2xl font-black text-[#6D28D9] sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* MISSION — centered */}
        <motion.section
          className="mx-auto mt-20 max-w-3xl text-center"
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.div
            className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-l from-violet-100 to-sky-100 text-[#6D28D9]"
            animate={{ rotate: [0, -6, 6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Target size={24} />
          </motion.div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            {t("about.missionTitle")}
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
            {t("about.missionText")}
          </p>
        </motion.section>

        {/* VALUES — centered cards */}
        <motion.section
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
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
                variants={fade}
                className="about-card rounded-2xl border border-violet-100 bg-white/85 p-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
              >
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 text-[#6D28D9]">
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

        {/* WHO — centered with team image */}
        <motion.section
          className="mt-20 text-center"
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-l from-violet-100 to-sky-100 text-[#6D28D9]">
            <UsersRound size={22} />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            {t("about.whoTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-slate-600">
            {t("about.whoText")}
          </p>
          <motion.div
            className="mx-auto mt-8 max-w-xl overflow-hidden rounded-[1.6rem] border border-white/80 shadow-[0_24px_70px_rgba(109,40,217,0.18)]"
            whileHover={{ scale: 1.02, rotate: -0.4 }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
          >
            <img
              src="/images/about-team.jpg"
              alt={t("about.whoImageAlt")}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </motion.section>

        {/* SERVICES — centered */}
        <motion.section
          className="mt-20 text-center"
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            {t("about.servicesTitle")}
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-l from-[#6D28D9] to-[#2563EB]" />

          <motion.div
            className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.key} variants={fade}>
                  <Link
                    to={service.to}
                    className="about-card flex h-full flex-col items-center rounded-2xl border border-violet-100 bg-white/85 px-4 py-7 text-center shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
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

        {/* CTA — centered, no social proof */}
        <motion.section
          className="relative mt-20 overflow-hidden rounded-[1.8rem] bg-gradient-to-l from-[#6D28D9] via-[#4c1d95] to-[#0f172a] px-6 py-14 text-center text-white shadow-[0_28px_80px_rgba(109,40,217,0.38)]"
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:16px_16px]" />
          <motion.div
            className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-sky-300/30 blur-3xl"
            animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="relative">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
              <Sparkles size={22} />
            </div>
            <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
              {t("about.ctaTitle")}
            </h2>
            <Link
              to="/register"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 text-sm font-black text-[#6D28D9] transition hover:-translate-y-1 hover:bg-violet-50"
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
