"use client";

import { Link } from "react-router-dom";
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
          <div className="relative overflow-hidden rounded-[2rem] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-6 py-14 text-center text-slate-800 sm:px-10 lg:px-16 lg:py-20">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-[-220px] h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-300/40 blur-3xl" />
              <div className="absolute right-[-120px] top-20 h-[360px] w-[360px] rounded-full bg-cyan-300/30 blur-3xl" />
              <div className="absolute left-[-140px] bottom-[-140px] h-[380px] w-[380px] rounded-full bg-violet-300/30 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-4xl">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-lg shadow-indigo-100/70 backdrop-blur">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
                {t("finalCta.eyebrow")}
              </div>

              <h2 className="mt-8 text-4xl font-black leading-[1.02] tracking-[-0.05em] text-slate-900 sm:text-6xl lg:text-7xl">
                {t("finalCta.titleTop")}
                <br />
                <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  {t("finalCta.titleHighlight")}
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-600">
                {t("finalCta.subtitle")}
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="cta-solid inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-base font-black text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5 sm:w-auto"
                >
                  {t("home.startTrial")}
                </Link>

                <Link
                  to="/pricing"
                  className="cta-soft inline-flex w-full items-center justify-center rounded-2xl border border-white/80 bg-white/85 px-8 py-4 text-base font-black text-indigo-700 shadow-lg shadow-indigo-100/70 backdrop-blur transition hover:-translate-y-0.5 sm:w-auto"
                >
                  {t("home.viewPricing")}
                </Link>
              </div>

              <p className="mt-5 text-sm font-bold text-slate-500">
                {t("home.trustNoCard")}
              </p>
            </div>

            <div className="relative mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-3">
              {productItems.map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/80 bg-white/80 p-5 text-start shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100"
                >
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-black text-white">
                    ✓
                  </div>

                  <h3 className="text-lg font-black text-slate-900">{title}</h3>

                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
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
