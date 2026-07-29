import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const solutionMeta = [
  {
    key: "card1",
    icon: "✦",
    gradient: "from-indigo-600 to-violet-600",
  },
  {
    key: "card2",
    icon: "↗",
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    key: "card3",
    icon: "◎",
    gradient: "from-violet-200 via-sky-200 to-cyan-200",
  },
  {
    key: "card4",
    icon: "◆",
    gradient: "from-cyan-500 to-indigo-600",
  },
  {
    key: "card5",
    icon: "∞",
    gradient: "from-indigo-600 via-violet-600 to-cyan-500",
  },
];

function Solutions() {
  const { t } = useTranslation();

  const overviewStats = [
    [t("solutions.statCrm"), t("solutions.statCrmLabel")],
    [t("solutions.statAi"), t("solutions.statAiLabel")],
    [t("solutions.stat360"), t("solutions.stat360Label")],
  ];

  const overviewItems = [
    [t("solutions.overviewItem1Title"), t("solutions.overviewItem1Text")],
    [t("solutions.overviewItem2Title"), t("solutions.overviewItem2Text")],
    [t("solutions.overviewItem3Title"), t("solutions.overviewItem3Text")],
    [t("solutions.overviewItem4Title"), t("solutions.overviewItem4Text")],
    [t("solutions.overviewItem5Title"), t("solutions.overviewItem5Text")],
  ];

  const solutions = solutionMeta.map((meta) => ({
    ...meta,
    title: t(`solutions.${meta.key}Title`),
    subtitle: t(`solutions.${meta.key}Subtitle`),
    challenge: t(`solutions.${meta.key}Challenge`),
    solution: t(`solutions.${meta.key}Solution`),
    plus: t(`solutions.${meta.key}Plus`),
  }));

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] text-slate-800">
      <Helmet>
        <title>{t("solutions.seoTitle")}</title>
        <meta name="description" content={t("solutions.seoDescription")} />
        <meta name="keywords" content={t("solutions.seoKeywords")} />
        <meta name="author" content="BizUply" />
        <meta property="og:title" content={t("solutions.ogTitle")} />
        <meta property="og:description" content={t("solutions.ogDescription")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.bizuply.com/solutions" />
        <meta
          property="og:image"
          content="https://www.bizuply.com/og-image.jpg"
        />
        <link rel="canonical" href="https://www.bizuply.com/solutions" />
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
            {t("solutions.badge")}
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[0.98] tracking-[-0.05em] text-slate-800 sm:text-6xl lg:text-7xl">
            {t("solutions.heroTitleTop")}
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              {t("solutions.heroTitleHighlight")}
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
            {t("solutions.heroSubtitle")}
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
                  {t("solutions.overviewBadge")}
                </div>

                <h2 className="max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                  {t("solutions.overviewTitle")}
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                  {t("solutions.overviewText")}
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
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-base font-black text-black shadow-lg shadow-indigo-100">
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

        {/* Solutions cards */}
        <section className="mt-20 grid gap-7 lg:grid-cols-2">
          {solutions.map((item, index) => (
            <article
              key={item.key}
              className={`group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_26px_80px_rgba(79,70,229,0.16)] ${
                index === solutions.length - 1 ? "lg:col-span-2" : ""
              }`}
            >
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-200/35 blur-3xl transition group-hover:scale-125" />

              <div className="relative">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div
                    className={`grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br ${item.gradient} text-2xl font-black text-black shadow-xl shadow-indigo-100`}
                  >
                    {item.icon}
                  </div>

                  <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-indigo-600">
                  {item.subtitle}
                </p>

                <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-slate-800 sm:text-4xl">
                  {item.title}
                </h2>

                <div className="mt-6 grid gap-4">
                  <SolutionLine
                    label={t("solutions.challengeLabel")}
                    text={item.challenge}
                  />
                  <SolutionLine
                    label={t("solutions.solutionLabel")}
                    text={item.solution}
                  />
                  <SolutionLine
                    label={t("solutions.plusLabel")}
                    text={item.plus}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Summary without buttons */}
        <section className="mt-20 overflow-hidden rounded-[2.5rem] border border-white/70 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 p-[1px] shadow-[0_24px_80px_rgba(79,70,229,0.24)]">
          <div className="rounded-[2.5rem] bg-white/10 px-8 py-12 text-center backdrop-blur-xl sm:px-12">
            <h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">
              {t("solutions.ctaTitleTop")}
              <br />
              {t("solutions.ctaTitleBottom")}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-indigo-50">
              {t("solutions.ctaText")}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function SolutionLine({ label, text }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
      <div className="mb-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-indigo-700 shadow-sm">
        {label}
      </div>

      <p className="text-sm font-semibold leading-7 text-slate-600">{text}</p>
    </div>
  );
}

export default Solutions;
