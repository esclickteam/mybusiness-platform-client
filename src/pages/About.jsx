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
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
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

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        {/* Hero */}
        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="about-enter order-2 text-start lg:order-1">
            <div className="relative mx-auto max-w-xl">
              <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[#F7F8FC] p-3 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
                <img
                  src="/images/crm-preview-v2.png"
                  alt={t("about.heroImageAlt")}
                  className="h-auto w-full rounded-[1.25rem] object-cover"
                />
              </div>
              <div className="absolute -bottom-4 start-4 flex max-w-[220px] items-center gap-3 rounded-2xl border border-white bg-white p-3 shadow-[0_14px_34px_rgba(109,40,217,0.18)]">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">
                    {t("about.heroFloatTitle")}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500">
                    {t("about.heroFloatText")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-enter about-enter-d1 order-1 text-start lg:order-2">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              {t("about.heroTitle")}
            </h1>
            <p className="mt-4 bg-gradient-to-l from-[#6D28D9] to-[#2563EB] bg-clip-text text-2xl font-black leading-snug text-transparent sm:text-3xl">
              {t("about.heroHighlight")}
            </p>
            <p className="mt-5 max-w-xl text-base font-medium leading-8 text-slate-500 sm:text-lg">
              {t("about.heroSubtitle")}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-100 pt-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-black tracking-tight text-[#6D28D9] sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <motion.section
          className="mx-auto mt-24 max-w-3xl text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-violet-100 text-[#6D28D9]">
            <Target size={26} />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            {t("about.missionTitle")}
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-500 sm:text-lg">
            {t("about.missionText")}
          </p>
        </motion.section>

        {/* Values */}
        <motion.section
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
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
                className="about-card rounded-2xl border border-slate-200 bg-white p-6 text-start shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
              >
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-[#6D28D9]">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-black text-slate-900">{value.title}</h3>
                <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                  {value.text}
                </p>
              </motion.article>
            );
          })}
        </motion.section>

        {/* Who we are + team image */}
        <motion.section
          className="mt-24 grid items-center gap-10 lg:grid-cols-2 lg:gap-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
            <img
              src="/images/about-team.jpg"
              alt={t("about.whoImageAlt")}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="text-start">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-[#6D28D9]">
              <UsersRound size={22} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {t("about.whoTitle")}
            </h2>
            <p className="mt-4 text-base font-medium leading-8 text-slate-500 sm:text-lg">
              {t("about.whoText")}
            </p>
          </div>
        </motion.section>

        {/* Services */}
        <motion.section
          className="mt-24"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {t("about.servicesTitle")}
            </h2>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#6D28D9]" />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.key}
                  to={service.to}
                  className="about-card flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
                >
                  <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-violet-100 text-[#6D28D9]">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    {service.title}
                  </h3>
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* CTA */}
        <section className="relative mt-24 overflow-hidden rounded-[2rem] bg-gradient-to-l from-[#1e1b4b] via-[#4c1d95] to-[#6D28D9] px-6 py-14 text-center text-white shadow-[0_22px_60px_rgba(109,40,217,0.28)] sm:px-10">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="relative">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
              <Sparkles size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              {t("about.ctaTitle")}
            </h2>
            <Link
              to="/register"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-black text-[#6D28D9] transition hover:bg-violet-50"
            >
              {t("about.ctaPrimary")}
              <ArrowLeft size={16} className="rtl:rotate-180" />
            </Link>
          </div>
        </section>

        {/* Social proof */}
        <section className="mt-16 pb-8 text-center">
          <p className="text-sm font-black tracking-[0.08em] text-slate-400">
            {t("about.socialProof")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-black text-slate-300">
            {["Dream Design", "Urban Market", "HouseTech", "FITNESS+", "Bella.", "GreenLine"].map(
              (name) => (
                <span key={name}>{name}</span>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;
