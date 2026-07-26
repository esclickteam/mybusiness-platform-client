import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Bot,
  CalendarDays,
  LayoutDashboard,
  MessageSquareHeart,
  Sparkles,
  UsersRound,
} from "lucide-react";
import "../styles/About.css";

const offerMeta = [
  { key: "offer1", icon: UsersRound },
  { key: "offer2", icon: LayoutDashboard },
  { key: "offer3", icon: MessageSquareHeart },
  { key: "offer4", icon: Sparkles },
  { key: "offer5", icon: Bot },
  { key: "offer6", icon: CalendarDays },
];

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

function About() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(0);

  const marqueeItems = t("about.marqueeItems", { returnObjects: true });
  const processSteps = [1, 2, 3, 4].map((n) => ({
    title: t(`about.process${n}Title`),
    text: t(`about.process${n}Text`),
  }));
  const faqs = [1, 2, 3, 4, 5, 6].map((n) => ({
    q: t(`about.faq${n}Q`),
    a: t(`about.faq${n}A`),
  }));
  const offers = offerMeta.map((meta) => ({
    ...meta,
    title: t(`about.${meta.key}Title`),
    text: t(`about.${meta.key}Text`),
  }));
  const values = [1, 2, 3].map((n) => ({
    title: t(`about.value${n}Title`),
    text: t(`about.value${n}Text`),
  }));
  const stats = [
    { value: 1, suffix: "", label: t("about.stat1Label") },
    { value: 6, suffix: "+", label: t("about.stat2Label") },
    { value: 24, suffix: "/7", label: t("about.stat3Label") },
  ];

  const safeMarquee = Array.isArray(marqueeItems)
    ? marqueeItems
    : ["CRM", "Leads", "AI", "Appointments", "Reviews", "Collaborations"];

  return (
    <div className="about-page">
      <Helmet>
        <title>{t("about.seoTitle")}</title>
        <meta name="description" content={t("about.seoDescription")} />
        <meta name="keywords" content={t("about.seoKeywords")} />
        <link rel="canonical" href="https://bizuply.com/about" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={t("about.ogTitle")} />
        <meta property="og:description" content={t("about.ogDescription")} />
        <meta property="og:url" content="https://bizuply.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
        <meta property="og:image" content="https://bizuply.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("about.twitterTitle")} />
        <meta
          name="twitter:description"
          content={t("about.twitterDescription")}
        />
        <meta name="twitter:image" content="https://bizuply.com/og-image.jpg" />
      </Helmet>

      <div className="about-ambient" aria-hidden="true">
        <span className="a1" />
        <span className="a2" />
        <span className="a3" />
      </div>

      <div className="about-shell mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Hero — CRM glass panel */}
        <section className="about-enter overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-[0_22px_70px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
          <div className="h-1 bg-gradient-to-l from-sky-300 via-violet-300 to-emerald-300" />

          <div className="grid gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10 lg:py-14">
            <div className="text-start">
              <p className="about-enter about-enter-delay-1 text-xs font-black uppercase tracking-[0.22em] text-sky-600">
                {t("about.badge")}
              </p>

              <h1 className="about-enter about-enter-delay-1 mt-3 text-4xl font-black tracking-tight text-slate-800 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
                {t("about.heroTitleTop")}{" "}
                <span className="bg-gradient-to-l from-[#6D28D9] to-[#2563EB] bg-clip-text text-transparent">
                  {t("about.heroTitleHighlight")}
                </span>
              </h1>

              <p className="about-enter about-enter-delay-2 mt-5 max-w-xl text-base font-semibold leading-8 text-slate-500 sm:text-lg">
                {t("about.heroSubtitle")}
              </p>

              <div className="about-enter about-enter-delay-3 mt-8 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#6D28D9] px-5 text-sm font-black text-white transition hover:bg-[#5B21B6]"
                >
                  {t("about.ctaPrimary")}
                </Link>
                <Link
                  to="/features"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-800 transition hover:border-violet-200 hover:bg-violet-50/50"
                >
                  {t("about.ctaExplore")}
                </Link>
              </div>
            </div>

            <div className="about-enter about-enter-delay-2">
              <HeroPreview stats={stats} />
            </div>
          </div>
        </section>

        {/* Marquee */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
          <div className="about-marquee">
            <div className="about-marquee-track">
              {[...safeMarquee, ...safeMarquee].map((item, i) => (
                <div
                  key={`${item}-${i}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-[#F7F8FC] px-4 py-2 text-sm font-bold text-slate-700"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <Reveal className="mt-16 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
              {t("about.badge")}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
              {t("about.storyTitle")}
            </h2>
            <p className="mt-4 text-base font-semibold leading-8 text-slate-500">
              {t("about.introQuestion")}
            </p>
          </div>
          <p className="text-base leading-8 text-slate-600">{t("about.storyText")}</p>
        </Reveal>

        {/* Offers */}
        <Reveal className="mt-20">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
              {t("about.offersBadge")}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
              {t("about.offersTitleTop")}{" "}
              <span className="bg-gradient-to-l from-[#6D28D9] to-[#2563EB] bg-clip-text text-transparent">
                {t("about.offersTitleHighlight")}
              </span>
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-500">
              {t("about.offersSubtitle")}
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {offers.map((item) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.key}
                  variants={fadeUp}
                  className="about-card rounded-2xl p-6 text-start"
                >
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-[#6D28D9]">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-black text-slate-800">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    {item.text}
                  </p>
                  <Link
                    to="/features"
                    className="mt-4 inline-flex text-sm font-black text-[#6D28D9] transition hover:text-[#5B21B6]"
                  >
                    {t("about.offerLearnMore")}
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        </Reveal>

        {/* Process */}
        <Reveal className="mt-20 overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.06)] backdrop-blur-2xl sm:p-8">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
              {t("about.processTitle")}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-800">
              {t("about.processSubtitle")}
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-[#F7F8FC] p-5"
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
        </Reveal>

        {/* Why + stats */}
        <Reveal className="mt-20">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
              {t("about.valuesBadge")}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
              {t("about.whyTitle")}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-500">
              {t("about.valuesText")}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
              >
                <h3 className="text-lg font-black text-slate-800">{value.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">{value.text}</p>
              </div>
            ))}
          </div>

          <StatsRow stats={stats} />
        </Reveal>

        {/* FAQ */}
        <Reveal className="mt-20 mb-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
              {t("about.faqBadge")}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-800">
              {t("about.faqTitle")}
            </h2>
            <p className="mt-3 text-base text-slate-500">{t("about.faqSubtitle")}</p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {faqs.map((item, index) => {
              const open = openFaq === index;
              return (
                <div
                  key={item.q}
                  data-open={open}
                  className="about-faq-item rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
                    onClick={() => setOpenFaq(open ? -1 : index)}
                    aria-expanded={open}
                  >
                    <span className="text-sm font-black text-slate-800 sm:text-base">
                      {item.q}
                    </span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet-100 text-base font-black text-[#6D28D9] transition ${
                        open ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div className="about-faq-answer">
                    <div>
                      <p className="px-5 pb-5 text-sm leading-7 text-slate-500">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* CTA */}
        <section className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-l from-[#6D28D9] to-[#2563EB] p-8 text-white shadow-[0_14px_34px_rgba(37,99,235,0.25)] sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl text-start">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                {t("about.ctaTitleTop")}
                <br />
                {t("about.ctaTitleBottom")}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/85 sm:text-base">
                {t("about.ctaText")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-black text-[#6D28D9] transition hover:bg-violet-50"
              >
                {t("about.ctaPrimary")}
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-5 text-sm font-black text-white transition hover:bg-white/15"
              >
                {t("about.ctaHowItWorks")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function HeroPreview({ stats }) {
  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-[#F7F8FC] p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="rounded-2xl bg-gradient-to-br from-[#6D28D9] to-[#2563EB] p-5 text-white shadow-[0_14px_34px_rgba(37,99,235,0.25)]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75">
          BizUply CRM
        </p>
        <p className="mt-2 text-2xl font-black tracking-tight">
          {stats[0]?.label}
        </p>
        <p className="mt-1 text-sm font-semibold text-white/80">
          CRM · Leads · AI
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-center"
          >
            <p className="text-lg font-black text-slate-800">
              {stat.value}
              {stat.suffix}
            </p>
            <p className="mt-1 text-[11px] font-bold text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {["CRM", "Leads", "Appointments"].map((row, i) => (
          <div
            key={row}
            className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-bold ${
              i === 0
                ? "border-violet-200 bg-gradient-to-l from-violet-50 via-white to-sky-50 text-slate-800"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            <span>{row}</span>
            <span className="h-2 w-2 rounded-full bg-[#6D28D9]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Reveal({ children, className = "" }) {
  return (
    <motion.section
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
    >
      {children}
    </motion.section>
  );
}

function StatsRow({ stats }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div
      ref={ref}
      className="mt-8 grid gap-4 sm:grid-cols-3"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
        >
          <p className="text-4xl font-black tracking-tight text-slate-800">
            <AnimatedNumber
              value={stat.value}
              suffix={stat.suffix}
              active={inView}
            />
          </p>
          <p className="mt-2 text-sm font-bold text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function AnimatedNumber({ value, suffix = "", active }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    let frame = 0;
    const frames = 28;
    const id = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(1, frame / frames);
      const eased = 1 - (1 - progress) ** 3;
      setN(Math.round(value * eased));
      if (progress >= 1) window.clearInterval(id);
    }, 20);
    return () => window.clearInterval(id);
  }, [active, value]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
}

export default About;
