import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const stepMeta = [
  {
    key: "step1",
    number: "01",
    icon: "✦",
    gradient: "from-indigo-600 to-violet-600",
    hasSides: true,
    businessCount: 4,
    clientCount: 3,
  },
  {
    key: "step2",
    number: "02",
    icon: "⌕",
    gradient: "from-blue-600 to-cyan-500",
    pointCount: 4,
  },
  {
    key: "step3",
    number: "03",
    icon: "◷",
    gradient: "from-violet-200 via-sky-200 to-cyan-200",
    pointCount: 4,
  },
  {
    key: "step4",
    number: "04",
    icon: "↔",
    gradient: "from-cyan-500 to-indigo-600",
    pointCount: 4,
  },
  {
    key: "step5",
    number: "05",
    icon: "◆",
    gradient: "from-indigo-600 via-violet-600 to-cyan-500",
    pointCount: 4,
  },
];

function HowItWorks() {
  const { t } = useTranslation();

  const overviewStats = [
    ["01", t("howItWorks.overviewStat1Label")],
    ["02", t("howItWorks.overviewStat2Label")],
    ["03", t("howItWorks.overviewStat3Label")],
  ];

  const overviewItems = [
    [t("howItWorks.overviewItem1Title"), t("howItWorks.overviewItem1Text")],
    [t("howItWorks.overviewItem2Title"), t("howItWorks.overviewItem2Text")],
    [t("howItWorks.overviewItem3Title"), t("howItWorks.overviewItem3Text")],
    [t("howItWorks.overviewItem4Title"), t("howItWorks.overviewItem4Text")],
    [t("howItWorks.overviewItem5Title"), t("howItWorks.overviewItem5Text")],
  ];

  const simplicityItems = [
    [t("howItWorks.simplicityItem1Title"), t("howItWorks.simplicityItem1Text")],
    [t("howItWorks.simplicityItem2Title"), t("howItWorks.simplicityItem2Text")],
    [t("howItWorks.simplicityItem3Title"), t("howItWorks.simplicityItem3Text")],
  ];

  const steps = stepMeta.map((meta) => {
    const base = {
      ...meta,
      label: t(`howItWorks.${meta.key}Label`),
      title: t(`howItWorks.${meta.key}Title`),
      description: t(`howItWorks.${meta.key}Description`),
    };

    if (meta.hasSides) {
      return {
        ...base,
        business: Array.from({ length: meta.businessCount }, (_, i) =>
          t(`howItWorks.${meta.key}Business${i + 1}`)
        ),
        client: Array.from({ length: meta.clientCount }, (_, i) =>
          t(`howItWorks.${meta.key}Client${i + 1}`)
        ),
      };
    }

    return {
      ...base,
      points: Array.from({ length: meta.pointCount }, (_, i) =>
        t(`howItWorks.${meta.key}Point${i + 1}`)
      ),
    };
  });

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] text-slate-800">
      <Helmet>
        <title>{t("howItWorks.seoTitle")}</title>
        <meta name="description" content={t("howItWorks.seoDescription")} />
        <meta name="keywords" content={t("howItWorks.seoKeywords")} />
        <link rel="canonical" href="https://bizuply.com/how-it-works" />
        <meta name="robots" content="index, follow" />

        <meta property="og:title" content={t("howItWorks.ogTitle")} />
        <meta
          property="og:description"
          content={t("howItWorks.ogDescription")}
        />
        <meta property="og:url" content="https://bizuply.com/how-it-works" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bizuply" />
        <meta property="og:image" content="https://bizuply.com/og-image.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("howItWorks.twitterTitle")} />
        <meta
          name="twitter:description"
          content={t("howItWorks.twitterDescription")}
        />
        <meta name="twitter:image" content="https://bizuply.com/og-image.jpg" />
      </Helmet>

      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-80 h-[420px] w-[420px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 top-[950px] h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute right-24 top-32 hidden h-56 w-56 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 lg:block" />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
            {t("howItWorks.badge")}
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[0.98] tracking-[-0.05em] text-slate-800 sm:text-6xl lg:text-7xl">
            {t("howItWorks.heroTitleTop")}
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              {t("howItWorks.heroTitleHighlight")}
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
            {t("howItWorks.heroSubtitle")}
          </p>
        </section>

        {/* Premium overview */}
        <section className="mt-16 overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/75 p-3 shadow-[0_30px_100px_rgba(79,70,229,0.16)] backdrop-blur-xl">
          <div className="grid overflow-hidden rounded-[2rem] border border-slate-100 bg-white lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative overflow-hidden border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 sm:p-10">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
              <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

              <div className="relative">
                <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-cyan-100">
                  {t("howItWorks.overviewBadge")}
                </div>

                <h2 className="max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                  {t("howItWorks.overviewTitle")}
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                  {t("howItWorks.overviewText")}
                </p>

                <div className="mt-9 grid gap-4 sm:grid-cols-3">
                  {overviewStats.map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                    >
                      <p className="text-3xl font-black">{value}</p>
                      <p className="mt-1 text-sm font-bold text-slate-300">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-indigo-50/70 p-6 sm:p-8">
              <div className="grid gap-4">
                {overviewItems.map(([title, text], index) => (
                  <div
                    key={title}
                    className="group flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-base font-black text-white shadow-lg shadow-indigo-100">
                      {index + 1}
                    </div>

                    <div className="text-start">
                      <h3 className="text-lg font-black text-slate-800">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                        {text}
                      </p>
                    </div>

                    <div className="ms-auto hidden h-9 w-9 place-items-center rounded-full bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white sm:grid">
                      →
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mt-20">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-slate-800 sm:text-5xl">
              {t("howItWorks.timelineTitleTop")}
              <br />
              <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                {t("howItWorks.timelineTitleHighlight")}
              </span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              {t("howItWorks.timelineSubtitle")}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-indigo-200 via-cyan-200 to-transparent lg:block" />

            <div className="space-y-7">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_26px_80px_rgba(79,70,229,0.16)] lg:ms-16"
                >
                  <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-200/35 blur-3xl transition group-hover:scale-125" />

                  <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                    <div>
                      <div className="mb-6 flex items-center gap-4">
                        <div
                          className={`grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br ${step.gradient} text-2xl font-black text-white shadow-xl shadow-indigo-100`}
                        >
                          {step.icon}
                        </div>

                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.18em] text-indigo-600">
                            {step.label}
                          </p>
                          <p className="mt-1 text-sm font-black text-slate-400">
                            {t("howItWorks.stepPrefix")} {step.number}
                          </p>
                        </div>
                      </div>

                      <h3 className="text-3xl font-black leading-tight tracking-[-0.04em] text-slate-800 sm:text-4xl">
                        {step.title}
                      </h3>

                      <p className="mt-4 text-base font-medium leading-7 text-slate-600">
                        {step.description}
                      </p>
                    </div>

                    <div>
                      {step.business && step.client ? (
                        <div className="grid gap-4 md:grid-cols-2">
                          <StepList
                            title={t("howItWorks.forBusinesses")}
                            items={step.business}
                          />
                          <StepList
                            title={t("howItWorks.forClients")}
                            items={step.client}
                          />
                        </div>
                      ) : (
                        <StepList
                          title={t("howItWorks.whatHappens")}
                          items={step.points}
                        />
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Simplicity */}
        <section className="mt-20 overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/75 p-3 shadow-[0_30px_100px_rgba(79,70,229,0.16)] backdrop-blur-xl">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-8 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-700">
                  {t("howItWorks.simplicityBadge")}
                </div>

                <h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-slate-800 sm:text-5xl">
                  {t("howItWorks.simplicityTitleTop")}
                  <br />
                  {t("howItWorks.simplicityTitleBottom")}
                </h2>

                <p className="mt-5 text-lg leading-8 text-slate-600">
                  {t("howItWorks.simplicityText")}
                </p>
              </div>

              <div className="grid gap-4">
                {simplicityItems.map(([title, text], index) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-indigo-50/70 p-5 shadow-sm"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-base font-black text-white shadow-lg shadow-indigo-100">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-800">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA without buttons */}
        <section className="mt-20 overflow-hidden rounded-[2.5rem] border border-white/70 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-[1px] shadow-[0_24px_80px_rgba(79,70,229,0.24)]">
          <div className="rounded-[2.5rem] bg-white/10 px-8 py-12 text-center backdrop-blur-xl sm:px-12">
            <h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">
              {t("howItWorks.ctaTitleTop")}
              <br />
              {t("howItWorks.ctaTitleBottom")}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-indigo-50">
              {t("howItWorks.ctaText")}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function StepList({ title, items }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
      <h4 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-indigo-700">
        {title}
      </h4>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-xs text-white">
              ✓
            </span>

            <span className="text-sm font-semibold leading-6 text-slate-600">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HowItWorks;
