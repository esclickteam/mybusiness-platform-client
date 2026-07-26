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
  { key: "offer1", icon: UsersRound, to: "/features" },
  { key: "offer2", icon: LayoutDashboard, to: "/features" },
  { key: "offer3", icon: MessageSquareHeart, to: "/features" },
  { key: "offer4", icon: Sparkles, to: "/features" },
  { key: "offer5", icon: Bot, to: "/features" },
  { key: "offer6", icon: CalendarDays, to: "/features" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
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
    link: t("about.offerLearnMore"),
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

      {/* HERO */}
      <section className="about-hero about-anim-hero">
        <div className="about-hero-bg" aria-hidden="true" />
        <div className="about-hero-grid" aria-hidden="true" />
        <div className="about-hero-overlay" aria-hidden="true" />
        <div className="about-hero-fade" aria-hidden="true" />

        <div className="about-hero-content">
          <p className="about-anim-up-1 text-sm font-extrabold tracking-[0.28em] text-sky-200">
            BIZUPLY
          </p>
          <h1 className="about-anim-up-2 mt-5 text-[clamp(2rem,6.5vw,3.75rem)] font-black leading-[1.12]">
            {t("about.heroTitleTop")}{" "}
            <span className="text-sky-200">{t("about.heroTitleHighlight")}</span>
          </h1>
          <p className="about-anim-up-3 mx-auto mt-5 max-w-[48ch] text-[clamp(1rem,3vw,1.25rem)] leading-8 text-white/90">
            {t("about.heroSubtitle")}
          </p>
          <div className="about-anim-up-4 mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register" className="about-btn-primary">
              {t("about.ctaPrimary")}
            </Link>
            <Link to="/features" className="about-btn-secondary">
              {t("about.ctaExplore")}
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="relative z-[1] -mt-8 px-4 pb-6">
        <div className="about-marquee rounded-2xl border border-violet-100/80 bg-white/80 py-4 shadow-[0_14px_40px_rgba(37,99,235,0.1)] backdrop-blur-xl">
          <div className="about-marquee-track">
            {[...safeMarquee, ...safeMarquee].map((item, i) => (
              <div
                key={`${item}-${i}`}
                className="flex items-center gap-3 rounded-xl border border-violet-100 bg-gradient-to-l from-violet-50 via-sky-50 to-cyan-50 px-5 py-2.5 text-sm font-extrabold text-slate-800"
              >
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#6D28D9] to-[#2563EB]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-7xl px-5 pb-8 sm:px-8 lg:px-10">
        {/* ABOUT / STORY */}
        <RevealSection className="py-20 text-center lg:py-24">
          <p className="text-sm font-extrabold tracking-[0.22em] text-[#6D28D9]">
            {t("about.badge")}
          </p>
          <h2 className="about-shine mx-auto mt-4 max-w-3xl text-[clamp(1.9rem,4vw,3rem)] font-black leading-tight">
            {t("about.storyTitle")}
          </h2>
          <span className="about-title-underline" />
          <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-600">
            {t("about.introQuestion")}
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600">
            {t("about.storyText")}
          </p>
        </RevealSection>

        {/* OFFERS / SERVICES */}
        <RevealSection className="pb-20 lg:pb-24">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-extrabold tracking-[0.22em] text-[#6D28D9]">
              {t("about.offersBadge")}
            </p>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-black leading-tight text-slate-900">
              {t("about.offersTitleTop")}{" "}
              <span className="bg-gradient-to-l from-[#6D28D9] to-[#2563EB] bg-clip-text text-transparent">
                {t("about.offersTitleHighlight")}
              </span>
            </h2>
            <span className="about-title-underline" />
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
              {t("about.offersSubtitle")}
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {offers.map((item) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.key}
                  variants={fadeUp}
                  className="about-service-card p-8 text-start"
                >
                  <div className="about-service-icon relative z-[1] mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 text-[#6D28D9]">
                    <Icon size={24} />
                  </div>
                  <h3 className="about-service-title relative z-[1] text-xl font-black text-slate-900">
                    {item.title}
                  </h3>
                  <p className="about-service-text relative z-[1] mt-3 text-sm font-medium leading-7 text-slate-600">
                    {item.text}
                  </p>
                  <Link
                    to={item.to}
                    className="about-service-link relative z-[1] mt-5 inline-flex text-sm font-extrabold text-[#6D28D9]"
                  >
                    {item.link}
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        </RevealSection>
      </main>

      {/* PROCESS */}
      <section className="about-process px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        <div className="about-process-pulse" aria-hidden="true" />
        <div className="relative z-[1] mx-auto max-w-7xl text-center">
          <h2 className="about-shine text-[clamp(1.9rem,4vw,2.8rem)] font-black">
            {t("about.processTitle")}
          </h2>
          <span className="about-title-underline" />
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/85">
            {t("about.processSubtitle")}
          </p>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                className="about-process-step rounded-2xl p-6 text-start"
              >
                <p className="text-sm font-extrabold tracking-[0.2em] text-sky-200">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-xl font-black">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/80">{step.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <main className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* WHY + STATS */}
        <RevealSection className="py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold tracking-[0.22em] text-[#6D28D9]">
              {t("about.valuesBadge")}
            </p>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-black leading-tight text-slate-900">
              {t("about.whyTitle")}
            </h2>
            <span className="about-title-underline" />
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600">
              {t("about.valuesText")}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-violet-100/80 bg-white/90 p-6 shadow-[0_10px_28px_rgba(37,99,235,0.08)]"
              >
                <h3 className="text-lg font-black text-slate-900">{value.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{value.text}</p>
              </div>
            ))}
          </div>

          <StatsRow stats={stats} />
        </RevealSection>

        {/* FAQ */}
        <RevealSection className="pb-20 lg:pb-24">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-sm font-extrabold tracking-[0.22em] text-[#6D28D9]">
              {t("about.faqBadge")}
            </p>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-black text-slate-900">
              {t("about.faqTitle")}
            </h2>
            <span className="about-title-underline" />
            <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600">
              {t("about.faqSubtitle")}
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((item, index) => {
              const open = openFaq === index;
              return (
                <div
                  key={item.q}
                  className="about-faq-item rounded-2xl"
                  data-open={open}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
                    onClick={() => setOpenFaq(open ? -1 : index)}
                    aria-expanded={open}
                  >
                    <span className="text-base font-extrabold text-slate-900">
                      {item.q}
                    </span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-l from-violet-100 to-sky-100 text-lg font-black text-[#6D28D9] transition ${
                        open ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div className="about-faq-answer">
                    <div>
                      <p className="px-5 pb-5 text-sm leading-7 text-slate-600">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </RevealSection>
      </main>

      {/* FINAL CTA — not a contact form */}
      <section className="relative overflow-hidden px-5 pb-20 sm:px-8 lg:px-10 lg:pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-gradient-to-l from-[#6D28D9] to-[#2563EB] px-6 py-14 text-center text-white shadow-[0_22px_60px_rgba(37,99,235,0.28)] sm:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_45%)]" />
          <div className="relative">
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-black leading-tight">
              {t("about.ctaTitleTop")}
              <br />
              {t("about.ctaTitleBottom")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/85">
              {t("about.ctaText")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/register" className="about-btn-primary">
                {t("about.ctaPrimary")}
              </Link>
              <Link
                to="/how-it-works"
                className="about-btn-secondary"
              >
                {t("about.ctaHowItWorks")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function RevealSection({ children, className = "" }) {
  return (
    <motion.section
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
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
      className="mt-12 overflow-hidden rounded-[1.5rem] bg-gradient-to-l from-[#4c1d95] via-[#6D28D9] to-[#2563EB] p-6 text-white shadow-[0_18px_50px_rgba(37,99,235,0.25)] sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/15 bg-white/10 px-5 py-6 text-center backdrop-blur-sm"
          >
            <p className="text-4xl font-black tracking-tight sm:text-5xl">
              <AnimatedNumber
                value={stat.value}
                suffix={stat.suffix}
                active={inView}
              />
            </p>
            <p className="mt-2 text-sm font-bold text-white/85">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimatedNumber({ value, suffix = "", active }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    let frame = 0;
    const frames = 36;
    const id = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(1, frame / frames);
      const eased = 1 - (1 - progress) ** 3;
      setN(Math.round(value * eased));
      if (progress >= 1) window.clearInterval(id);
    }, 24);
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
