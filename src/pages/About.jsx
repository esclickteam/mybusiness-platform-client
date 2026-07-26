import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../styles/About.css";

const offerMeta = [
  { key: "offer1", index: "01" },
  { key: "offer2", index: "02" },
  { key: "offer3", index: "03" },
  { key: "offer4", index: "04" },
  { key: "offer5", index: "05" },
];

function About() {
  const { t } = useTranslation();

  const storyStats = [
    [t("about.storyStat1"), t("about.storyStat1Label")],
    [t("about.storyStat2"), t("about.storyStat2Label")],
    [t("about.storyStat3"), t("about.storyStat3Label")],
  ];

  const storyItems = [
    [t("about.storyItem1Title"), t("about.storyItem1Text")],
    [t("about.storyItem2Title"), t("about.storyItem2Text")],
    [t("about.storyItem3Title"), t("about.storyItem3Text")],
    [t("about.storyItem4Title"), t("about.storyItem4Text")],
  ];

  const offers = offerMeta.map((meta) => ({
    ...meta,
    title: t(`about.${meta.key}Title`),
    text: t(`about.${meta.key}Text`),
  }));

  const values = [1, 2, 3].map((n) => ({
    title: t(`about.value${n}Title`),
    text: t(`about.value${n}Text`),
  }));

  return (
    <div className="about-page relative overflow-hidden">
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

      {/* Hero — full-bleed brand plane */}
      <section className="relative isolate overflow-hidden bg-[var(--about-ink)] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(31,167,160,0.28),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_80%,rgba(255,255,255,0.06),transparent_45%)]" />
          <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
        </div>

        <div className="relative mx-auto grid min-h-[88vh] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl text-start">
            <p className="about-rise text-sm font-extrabold tracking-[0.22em] text-[var(--about-accent)]">
              BIZUPLY
            </p>

            <div className="about-accent-line mt-5 h-[3px] w-20 bg-[var(--about-accent)]" />

            <h1 className="about-rise about-rise-delay-1 mt-7 text-5xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              {t("about.heroTitleTop")}{" "}
              <span className="text-[var(--about-accent)]">
                {t("about.heroTitleHighlight")}
              </span>
            </h1>

            <p className="about-rise about-rise-delay-2 mt-6 max-w-xl text-lg leading-8 text-white/75 sm:text-xl">
              {t("about.heroSubtitle")}
            </p>

            <div className="about-rise about-rise-delay-3 mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--about-accent)] px-6 py-3.5 text-sm font-extrabold text-[var(--about-ink)] transition hover:bg-[#27c4bc]"
              >
                {t("about.ctaPrimary")}
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-extrabold text-white transition hover:border-white/45 hover:bg-white/10"
              >
                {t("about.ctaSecondary")}
              </Link>
            </div>
          </div>

          <div className="about-rise about-rise-delay-4 about-visual-float relative">
            <WorkspaceVisual
              badge={t("about.storyBadge")}
              stats={storyStats}
            />
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        {/* Story */}
        <section className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-xs font-extrabold tracking-[0.2em] text-[var(--about-accent-deep)]">
              {t("about.storyBadge")}
            </p>
            <h2 className="mt-4 max-w-xl text-4xl font-black leading-[1.08] tracking-[-0.035em] text-[var(--about-ink)] sm:text-5xl">
              {t("about.storyTitle")}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--about-muted)]">
              {t("about.storyText")}
            </p>
          </div>

          <div className="border-t border-[var(--about-line)]">
            {storyItems.map(([title, text], index) => (
              <div
                key={title}
                className="grid grid-cols-[auto_1fr] gap-5 border-b border-[var(--about-line)] py-6"
              >
                <span className="pt-1 text-sm font-extrabold tracking-[0.16em] text-[var(--about-accent-deep)]">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-xl font-extrabold text-[var(--about-ink)]">
                    {title}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-[var(--about-muted)]">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vision / Journey */}
        <section className="mt-24 grid gap-0 border border-[var(--about-line)] bg-white/70 lg:grid-cols-2">
          <article className="border-b border-[var(--about-line)] p-8 sm:p-10 lg:border-b-0 lg:border-e">
            <p className="text-xs font-extrabold tracking-[0.2em] text-[var(--about-accent-deep)]">
              {t("about.visionLabel")}
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] text-[var(--about-ink)] sm:text-4xl">
              {t("about.visionTitle")}
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--about-muted)]">
              {t("about.visionText")}
            </p>
          </article>

          <article className="p-8 sm:p-10">
            <p className="text-xs font-extrabold tracking-[0.2em] text-[var(--about-accent-deep)]">
              {t("about.journeyLabel")}
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] text-[var(--about-ink)] sm:text-4xl">
              {t("about.journeyTitle")}
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--about-muted)]">
              {t("about.journeyText")}
            </p>
          </article>
        </section>

        {/* Offers */}
        <section className="mt-24">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold tracking-[0.2em] text-[var(--about-accent-deep)]">
              {t("about.offersBadge")}
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.035em] text-[var(--about-ink)] sm:text-5xl">
              {t("about.offersTitleTop")}{" "}
              <span className="text-[var(--about-accent-deep)]">
                {t("about.offersTitleHighlight")}
              </span>
            </h2>
          </div>

          <div className="mt-12 grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((item) => (
              <article
                key={item.key}
                className="group border-t border-[var(--about-line)] py-8 transition"
              >
                <p className="text-sm font-extrabold tracking-[0.18em] text-[var(--about-accent-deep)] transition group-hover:tracking-[0.24em]">
                  {item.index}
                </p>
                <h3 className="mt-4 text-2xl font-extrabold tracking-[-0.02em] text-[var(--about-ink)]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-sm text-base leading-7 text-[var(--about-muted)]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mt-24">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold tracking-[0.2em] text-[var(--about-accent-deep)]">
              {t("about.valuesBadge")}
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.035em] text-[var(--about-ink)] sm:text-5xl">
              {t("about.valuesTitleTop")} {t("about.valuesTitleBottom")}
            </h2>
            <p className="mt-5 text-lg leading-8 text-[var(--about-muted)]">
              {t("about.valuesText")}
            </p>
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {values.map((value, index) => (
              <div key={value.title} className="text-start">
                <p className="text-5xl font-black tracking-[-0.05em] text-[var(--about-accent)]">
                  0{index + 1}
                </p>
                <h3 className="mt-4 text-xl font-extrabold text-[var(--about-ink)]">
                  {value.title}
                </h3>
                <p className="mt-2 text-base leading-7 text-[var(--about-muted)]">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[var(--about-ink)] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(31,167,160,0.22),transparent_50%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-20 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">
              {t("about.ctaTitleTop")}
              <br />
              {t("about.ctaTitleBottom")}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/70">
              {t("about.ctaText")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--about-accent)] px-6 py-3.5 text-sm font-extrabold text-[var(--about-ink)] transition hover:bg-[#27c4bc]"
            >
              {t("about.ctaPrimary")}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3.5 text-sm font-extrabold text-white transition hover:border-white/45 hover:bg-white/10"
            >
              {t("about.ctaSecondary")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function WorkspaceVisual({ badge, stats }) {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="absolute -inset-6 rounded-[2rem] bg-[var(--about-accent)]/15 blur-2xl" />

      <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[var(--about-ink-soft)] shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--about-accent)]" />
          </div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-white/55">
            {badge}
          </p>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-3 rounded-2xl bg-black/20 p-4">
            {["CRM", "Calendar", "Inbox", "Reviews"].map((item, i) => (
              <div
                key={item}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold ${
                  i === 0
                    ? "bg-[var(--about-accent)] text-[var(--about-ink)]"
                    : "bg-white/5 text-white/70"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                {item}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-extrabold text-white">Pipeline</p>
                <span className="about-scan h-px w-16 bg-[var(--about-accent)]" />
              </div>
              <div className="grid grid-cols-4 items-end gap-2">
                {[42, 68, 54, 88].map((h, i) => (
                  <div
                    key={i}
                    className="rounded-t-md bg-gradient-to-t from-[var(--about-accent)]/30 to-[var(--about-accent)]"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {stats.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-3"
                >
                  <p className="text-lg font-black text-white">{value}</p>
                  <p className="mt-0.5 text-[11px] font-bold text-white/50">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
