import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Bot,
  Handshake,
  Headset,
  LayoutGrid,
  Settings2,
  Sparkles,
  Target,
  UserRound,
  UsersRound,
  Zap,
} from "lucide-react";
import AboutDashboardShowcase from "../components/about/AboutDashboardShowcase";
import "../styles/About.css";

const valueIcons = [UsersRound, Zap, BadgeCheck, Settings2];
/* DOM order is RTL-first: collaborations ends up left, CRM right — matching mockup */
const serviceMeta = [
  { key: "service1", icon: Handshake, to: "/collaborations", tone: "purple" },
  { key: "service2", icon: LayoutGrid, to: "/website-builder", tone: "blue" },
  { key: "service3", icon: Headset, to: "/agents", tone: "purple" },
  { key: "service4", icon: Bot, to: "/automations", tone: "blue" },
  { key: "service5", icon: UserRound, to: "/crm", tone: "purple" },
];

const STATS = [
  { key: 1, value: 180, suffix: "+", decimals: 0 },
  { key: 2, value: 12, suffix: "K+", decimals: 0 },
  { key: 3, value: 2.4, suffix: "K+", decimals: 1 },
];

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

function CountUpStat({ value, suffix = "", decimals = 0, active }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    let frame = 0;
    const total = 48;
    const id = window.setInterval(() => {
      frame += 1;
      const p = Math.min(1, frame / total);
      const eased = 1 - (1 - p) ** 3;
      const next = value * eased;
      setN(decimals ? Number(next.toFixed(decimals)) : Math.round(next));
      if (p >= 1) window.clearInterval(id);
    }, 20);
    return () => window.clearInterval(id);
  }, [active, value, decimals]);

  const display = decimals ? n.toFixed(decimals) : n.toLocaleString("en-US");
  return (
    <>
      {display}
      {suffix}
    </>
  );
}

function About() {
  const { t } = useTranslation();
  const statsRef = React.useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.45 });

  const values = [1, 2, 3, 4].map((n, i) => ({
    key: n,
    title: t(`about.value${n}Title`),
    text: t(`about.value${n}Text`),
    icon: valueIcons[i],
    featured: n === 3,
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
        {/* HERO */}
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
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            {t("about.heroTitle")}
          </motion.h1>

          <motion.p
            className="about-title-shine mx-auto mt-4 max-w-3xl text-2xl font-black leading-snug sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            {t("about.heroHighlight")}
          </motion.p>

          <motion.p
            className="mx-auto mt-5 max-w-3xl text-base font-medium leading-8 text-slate-600 sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.55 }}
          >
            {t("about.heroSubtitle")}
          </motion.p>

          <motion.div
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
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

          <div className="about-hero-dash mt-10">
            <AboutDashboardShowcase labels={dashLabels} />
          </div>

          <motion.div
            ref={statsRef}
            className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.key}
                variants={fade}
                className="rounded-2xl border border-violet-100 bg-white px-3 py-5 text-center shadow-[0_10px_28px_rgba(109,40,217,0.08)]"
              >
                <p className="text-2xl font-black tabular-nums text-[#6D28D9] sm:text-3xl">
                  <CountUpStat
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    active={statsInView}
                  />
                </p>
                <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">
                  {t(`about.stat${stat.key}Label`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* MISSION */}
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

        {/* VALUES */}
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
                key={value.key}
                variants={fade}
                className={`about-card rounded-2xl border p-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${
                  value.featured
                    ? "about-meta-card border-violet-200 bg-gradient-to-b from-violet-50 to-white"
                    : "border-violet-100 bg-white/85"
                }`}
              >
                <div
                  className={`mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl ${
                    value.featured
                      ? "bg-gradient-to-br from-[#6D28D9] to-[#2563EB] text-white shadow-[0_10px_22px_rgba(109,40,217,0.35)]"
                      : "bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 text-[#6D28D9]"
                  }`}
                >
                  <Icon size={20} />
                </div>
                {value.featured && (
                  <span className="about-meta-pill mb-2 inline-flex">
                    {t("about.metaBadge")}
                  </span>
                )}
                <h3 className="text-base font-black text-slate-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                  {value.text}
                </p>
              </motion.article>
            );
          })}
        </motion.section>

        {/* WHO — text beside image */}
        <motion.section
          className="about-who mt-20"
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="about-who-grid">
            <div className="about-who-copy">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-l from-violet-100 to-sky-100 text-[#6D28D9]">
                <UsersRound size={22} />
              </div>
              <p className="about-who-brand">{t("about.whoBrand")}</p>
              <h2>{t("about.whoTitle")}</h2>
              <p className="about-who-lead">{t("about.whoLead")}</p>
              <p className="about-who-text">{t("about.whoText")}</p>
              <p className="about-who-text">{t("about.whoText2")}</p>
            </div>

            <motion.div
              className="about-who-media"
              whileHover={{ scale: 1.015 }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
            >
              <img
                src="/images/about-team.jpg"
                alt={t("about.whoImageAlt")}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* SERVICES */}
        <motion.section
          className="about-services mt-20 text-center"
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-[2rem]">
            {t("about.servicesTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base font-medium leading-7 text-slate-600">
            {t("about.servicesSubtitle")}
          </p>
          <div className="about-services-rule mx-auto mt-4" />

          <motion.div
            className="about-services-grid mt-9"
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
                    className={`about-service-card about-service-card--${service.tone}`}
                  >
                    <span className="about-service-icon" aria-hidden="true">
                      <Icon size={22} strokeWidth={1.85} />
                    </span>
                    <h3>{service.title}</h3>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="about-cta-band"
          initial={{ opacity: 0, scale: 0.96, y: 28 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="about-cta-dots" aria-hidden="true" />
          <motion.div
            className="about-cta-glow"
            aria-hidden="true"
            animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="about-cta-inner">
            <div className="about-cta-spark">
              <Sparkles size={20} />
            </div>
            <h2>{t("about.ctaTitle")}</h2>
            <p className="about-cta-text">{t("about.ctaText")}</p>
            <Link to="/register" className="about-cta-pill">
              {t("about.ctaPrimary")}
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default About;
