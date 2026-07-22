"use client";

import { useTranslation } from "react-i18next";

export default function FinalCTA() {
  const { t } = useTranslation();

  const productItems = [
    [t("finalCta.crm"), t("finalCta.crmText")],
    [t("finalCta.appointments"), t("finalCta.appointmentsText")],
    [t("finalCta.aiTools"), t("finalCta.aiToolsText")],
  ];

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] px-6 py-24 text-slate-800 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-24 h-[360px] w-[360px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[360px] w-[360px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute right-24 top-24 hidden h-56 w-56 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 lg:block" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/75 p-3 shadow-[0_30px_100px_rgba(79,70,229,0.18)] backdrop-blur-xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 sm:px-10 lg:px-16 lg:py-20">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-[-220px] h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-500/35 blur-3xl" />
              <div className="absolute right-[-120px] top-20 h-[360px] w-[360px] rounded-full bg-cyan-400/25 blur-3xl" />
              <div className="absolute left-[-140px] bottom-[-140px] h-[380px] w-[380px] rounded-full bg-violet-500/25 blur-3xl" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(79,70,229,0.18),transparent_35%,rgba(6,182,212,0.16))]" />
            </div>

            <div className="relative mx-auto max-w-4xl">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-black text-cyan-100 shadow-2xl shadow-indigo-950/30 backdrop-blur">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.95)]" />
                {t("finalCta.eyebrow")}
              </div>

              <h2 className="mt-8 text-4xl font-black leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                {t("finalCta.titleTop")}
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  {t("finalCta.titleHighlight")}
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-300">
                {t("finalCta.subtitle")}
              </p>
            </div>

            <div className="relative mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-3">
              {productItems.map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-white/10 p-5 text-start backdrop-blur transition hover:bg-white/[0.14]"
                >
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-black text-white">
                    ✓
                  </div>

                  <h3 className="text-lg font-black text-white">{title}</h3>

                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
