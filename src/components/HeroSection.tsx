"use client";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type PipelineStage = {
  title: string;
  amount: string;
  deals: string;
};

export default function HeroSection() {
  const { t } = useTranslation();

  const sidebarItems = [
    t("preview.sidebarDashboard"),
    t("preview.sidebarClients"),
    t("preview.sidebarAppointments"),
    t("preview.sidebarCrm"),
    t("preview.sidebarCollaborations"),
    t("preview.sidebarReports"),
    t("preview.sidebarAiTools"),
  ];

  const pipelineStages: PipelineStage[] = [
    {
      title: t("preview.stageLeads"),
      amount: "$8.2k",
      deals: "29 deals",
    },
    {
      title: t("preview.stageContacted"),
      amount: "$14.8k",
      deals: "54 deals",
    },
    {
      title: t("preview.stageProposal"),
      amount: "$21.4k",
      deals: "38 deals",
    },
    {
      title: t("preview.stageScheduled"),
      amount: "$9.6k",
      deals: "16 deals",
    },
    {
      title: t("preview.stageConverted"),
      amount: "$32.1k",
      deals: "40 deals",
    },
  ];

  const aiActions = [
    t("preview.aiSummarize"),
    t("preview.aiDraftProposal"),
    t("preview.aiFindSlots"),
  ];

  const trustBullets = [
    t("home.trustNoCard"),
    t("home.trustTrial"),
    t("home.trustCancel"),
  ];

  const chartBars = [42, 66, 53, 82, 74, 96, 120, 106];

  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_34%,#eef3ff_68%,#ffffff_100%)] text-slate-950">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-260px] h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-indigo-200/50 blur-3xl" />
        <div className="absolute right-[-180px] top-32 h-[460px] w-[460px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute left-[-190px] top-72 h-[460px] w-[460px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

        <div className="absolute right-20 top-24 hidden h-64 w-64 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:18px_18px] opacity-20 lg:block" />
        <div className="absolute left-16 bottom-24 hidden h-56 w-56 bg-[radial-gradient(circle,#06b6d4_1px,transparent_1px)] [background-size:18px_18px] opacity-20 lg:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 text-center sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        {/* BADGE */}
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-xs font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur sm:text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_18px_rgba(79,70,229,0.85)]" />
          {t("home.badge")}
        </div>

        {/* HEADLINE */}
        <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl xl:text-8xl">
          {t("home.headlineTop")}
          <br />
          <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
            {t("home.headlineHighlight")}
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg lg:text-xl">
          {t("home.subtitle")}
        </p>

        {/* CTAS */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/register"
            className="group inline-flex min-w-[190px] items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-8 py-4 text-base font-black text-white shadow-[0_18px_45px_rgba(99,102,241,0.30)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(99,102,241,0.38)]"
          >
            {t("home.startTrial")}
            <span className="ml-2 transition group-hover:translate-x-1">→</span>
          </Link>

          <Link
            to="/pricing"
            className="inline-flex min-w-[190px] items-center justify-center rounded-full border border-slate-200 bg-white/90 px-8 py-4 text-base font-black text-slate-900 shadow-lg shadow-slate-100 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white"
          >
            {t("home.viewPricing")}
          </Link>
        </div>

        {/* TRUST */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-bold text-slate-500 sm:text-base">
          {trustBullets.map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-indigo-50 text-xs text-indigo-600">
                ✓
              </span>
              {item}
            </span>
          ))}
        </div>

        {/* PRODUCT PREVIEW */}
        <div className="relative mx-auto mt-14 max-w-6xl lg:mt-16">
          <div className="absolute inset-x-10 -top-8 h-24 rounded-full bg-cyan-300/25 blur-3xl" />
          <div className="absolute inset-x-20 bottom-0 h-24 rounded-full bg-indigo-300/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-3 shadow-[0_34px_110px_rgba(79,70,229,0.16)] backdrop-blur-xl sm:p-4">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white">
              {/* TOP FLOATING TOGGLE */}
              <div className="absolute left-1/2 top-5 z-40 flex -translate-x-1/2 items-center rounded-full border border-slate-200 bg-white/95 p-1 shadow-xl shadow-indigo-100 backdrop-blur">
                <span className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-black text-white sm:px-5 sm:text-sm">
                  {t("preview.themeLight")}
                </span>
                <span className="px-4 py-2 text-xs font-black text-slate-500 sm:px-5 sm:text-sm">
                  {t("preview.themeSmart")}
                </span>
              </div>

              <div className="relative z-10 flex min-h-[560px]">
                {/* SIDEBAR */}
                <aside className="hidden w-[225px] shrink-0 bg-slate-950 p-5 text-left text-white md:block">
                  <div className="mb-8 flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-lg font-black text-white shadow-lg shadow-indigo-950/30">
                      B
                    </div>

                    <div>
                      <p className="text-lg font-black text-white">BizUply</p>
                      <p className="text-xs font-semibold text-slate-400">
                        {t("preview.businessOs")}
                      </p>
                    </div>
                  </div>

                  <nav className="space-y-2">
                    {sidebarItems.map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className={[
                          "rounded-2xl px-4 py-3 text-sm font-bold transition",
                          index === 0
                            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-950/30"
                            : "text-slate-400",
                        ].join(" ")}
                      >
                        {item}
                      </div>
                    ))}
                  </nav>

                  <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      AI Status
                    </p>
                    <p className="mt-2 text-sm font-black text-white">
                      Smart assistant active
                    </p>
                  </div>
                </aside>

                {/* DASHBOARD */}
                <main className="flex-1 bg-gradient-to-br from-white via-indigo-50/40 to-cyan-50/40 p-4 pt-24 text-left sm:p-5 sm:pt-24 md:p-7 md:pt-24">
                  {/* DASH HEADER */}
                  <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-indigo-600">
                        {t("preview.greeting")}
                      </p>
                      <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                        {t("preview.pipelineTitle")}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="hidden rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm sm:block">
                        {t("preview.thisMonth")}
                      </div>

                      <button
                        type="button"
                        className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 text-lg font-black text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5"
                        aria-label="Add"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* MINI STATS */}
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        Revenue
                      </p>
                      <p className="mt-2 text-xl font-black text-slate-950">
                        $86.1k
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        Clients
                      </p>
                      <p className="mt-2 text-xl font-black text-slate-950">
                        1,248
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        Growth
                      </p>
                      <p className="mt-2 text-xl font-black text-emerald-600">
                        +18%
                      </p>
                    </div>
                  </div>

                  {/* PIPELINE CARD */}
                  <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-xl shadow-indigo-100/60 sm:p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {t("preview.salesPipeline")}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {t("preview.salesPipelineSubtitle")}
                        </p>
                      </div>

                      <div className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-700">
                        {t("preview.activeDeals")}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      {pipelineStages.map((stage) => (
                        <div
                          key={stage.title}
                          className="rounded-2xl bg-gradient-to-br from-white to-indigo-50 p-4 shadow-sm ring-1 ring-slate-100"
                        >
                          <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                            {stage.title}
                          </p>
                          <p className="mt-3 text-xl font-black text-slate-950">
                            {stage.amount}
                          </p>
                          <p className="mt-1 text-xs font-bold text-slate-500">
                            {stage.deals}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                      {/* CHART */}
                      <div className="rounded-2xl bg-slate-50 p-5">
                        <div className="flex items-center justify-between">
                          <p className="font-black text-slate-900">
                            {t("preview.revenueGrowth")}
                          </p>
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">
                            +18%
                          </span>
                        </div>

                        <div className="mt-5 flex h-44 items-end gap-2 sm:gap-3">
                          {chartBars.map((height, index) => (
                            <div
                              key={index}
                              className="flex flex-1 items-end rounded-full bg-white shadow-sm"
                            >
                              <div
                                className="w-full rounded-full bg-gradient-to-t from-indigo-600 via-blue-500 to-cyan-400"
                                style={{ height: `${height}px` }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI CARD */}
                      <div className="rounded-2xl bg-white p-5 text-slate-950 shadow-sm ring-1 ring-slate-100">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="font-black">
                            {t("preview.aiAssistant")}
                          </p>
                          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-100">
                            ✦
                          </span>
                        </div>

                        <p className="rounded-2xl bg-indigo-50 p-4 text-sm font-semibold leading-6 text-slate-700">
                          {t("preview.aiMessage")}
                        </p>

                        <div className="mt-4 space-y-2">
                          {aiActions.map((item) => (
                            <button
                              key={item}
                              type="button"
                              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-left text-sm font-black text-white shadow-lg shadow-indigo-100 transition hover:-translate-y-0.5"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}