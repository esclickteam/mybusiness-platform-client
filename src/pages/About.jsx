import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
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

const heroWord = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

function About() {
  const { t } = useTranslation();

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

  return (
    <div className="about-page" dir="rtl">
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
      <div className="about-orb about-orb-d" aria-hidden="true" />
      <div className="about-spark-field" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <main className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        {/* HERO */}
        <section className="about-hero text-center">
          <motion.h1
            className="about-hero-title about-bidi"
            variants={heroWord}
            initial="hidden"
            animate="show"
          >
            {t("about.heroTitle")}
          </motion.h1>

          <motion.div
            className="about-hero-underline"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.p
            className="about-title-shine about-bidi mx-auto mt-5 max-w-3xl text-2xl font-black leading-snug sm:text-4xl"
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.18, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {t("about.heroHighlight")}
          </motion.p>

          <motion.p
            className="about-bidi mx-auto mt-5 max-w-3xl text-base font-medium leading-8 text-slate-600 sm:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55 }}
          >
            {t("about.heroSubtitle")}
          </motion.p>

          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.55 }}
          >
            <Link to="/crm" className="about-hero-crm about-bidi">
              <span className="about-hero-crm-glow" aria-hidden="true" />
              {t("about.ctaSecondary")}
            </Link>
          </motion.div>

          <motion.div
            className="about-hero-dash"
            initial={{ opacity: 0, y: 36, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.48, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1200 }}
          >
            <motion.div
              className="about-product-frame"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="about-frame-sheen" aria-hidden="true" />
              <img
                src="/abaut12345.PNG"
                alt=""
                className="about-shot-rail"
                decoding="async"
                fetchPriority="high"
              />
              <img
                src="/abaut1234.PNG"
                alt={t("about.heroImageAlt")}
                className="about-shot-main"
                decoding="async"
                fetchPriority="high"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-14 text-center"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {t("about.widgetsTitle")}
            </h2>
            <p className="about-bidi mx-auto mt-3 max-w-2xl text-base font-medium leading-7 text-slate-600">
              {t("about.widgetsText")}
            </p>
            <div className="about-widgets-shot-wrap mt-7">
              <img
                src="/abaut123.PNG"
                alt={t("about.widgetsImageAlt")}
                className="about-widgets-shot"
                decoding="async"
                loading="lazy"
              />
            </div>
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
          <p className="about-bidi mt-4 text-base leading-8 text-slate-600 sm:text-lg">
            {t("about.missionText")}
          </p>
        </motion.section>

        {/* VALUES */}
        <div className="about-values-track mt-10">
          <motion.section
            className="about-values-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.article
                  key={value.key}
                  variants={fade}
                  className={`about-card about-value-card p-6 text-center ${
                    value.featured ? "about-meta-card is-featured" : ""
                  }`}
                  style={{ "--gold-i": index }}
                >
                  <div className="about-value-card-inner">
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
                      <span className="about-meta-pill about-bidi mb-2 inline-flex">
                        {t("about.metaBadge")}
                      </span>
                    )}
                    <h3 className="about-bidi text-base font-black text-slate-900">
                      {value.title}
                    </h3>
                    <p className="about-bidi mt-2 text-sm font-medium leading-6 text-slate-500">
                      {value.text}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </motion.section>
        </div>

        {/* WHO — centered RTL copy beside image */}
        <motion.section
          className="about-who mt-20"
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="about-who-grid">
            <div className="about-who-copy">
              <div className="about-who-icon mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-l from-violet-100 to-sky-100 text-[#6D28D9]">
                <UsersRound size={22} />
              </div>
              <p className="about-who-brand about-bidi">{t("about.whoBrand")}</p>
              <h2>{t("about.whoTitle")}</h2>
              <p className="about-who-lead about-bidi">{t("about.whoLead")}</p>
              <p className="about-who-text about-bidi">{t("about.whoText")}</p>
              <p className="about-who-text about-bidi">{t("about.whoText2")}</p>
            </div>

            <motion.div
              className="about-who-media"
              whileHover={{ scale: 1.015 }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
            >
              <img
                src="/images/about-team.webp"
                alt={t("about.whoImageAlt")}
                className="about-who-photo"
                loading="lazy"
                decoding="async"
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
          <p className="about-bidi mx-auto mt-3 max-w-2xl text-base font-medium leading-7 text-slate-600">
            {t("about.servicesSubtitle")}
          </p>
          <div className="about-services-rule mx-auto mt-4" />

          <div className="about-services-track mt-9">
            <motion.div
              className="about-services-grid"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.key}
                    variants={fade}
                    style={{ "--gold-i": index }}
                  >
                    <Link
                      to={service.to}
                      className={`about-service-card about-service-card--${service.tone}`}
                    >
                      <span className="about-service-icon" aria-hidden="true">
                        <Icon size={22} strokeWidth={1.85} />
                      </span>
                      <h3 className="about-bidi">{service.title}</h3>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
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
            <p className="about-cta-text about-bidi">{t("about.ctaText")}</p>
            <Link to="/pricing" className="about-cta-pill">
              {t("about.ctaPrimary")}
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default About;
