import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export default function Accessibility() {
  const { t, i18n } = useTranslation();

  const sectionBase =
    "rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-8";

  const h2Base =
    "mb-4 text-2xl font-black tracking-[-0.03em] text-slate-800 sm:text-3xl";

  const pBase = "text-base font-medium leading-8 text-slate-600";

  const ulBase =
    "mt-5 space-y-3 text-base font-medium leading-8 text-slate-600";

  const chips = t("accessibilityPage.chips", { returnObjects: true });
  const chipItems = Array.isArray(chips) ? chips : [];
  const featuresList = t("accessibilityPage.featuresList", {
    returnObjects: true,
  });
  const featureItems = Array.isArray(featuresList) ? featuresList : [];

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#F7F4EE] text-start text-slate-800"
      dir={i18n.language === "he" ? "rtl" : "ltr"}
    >
      <Helmet>
        <title>{t("accessibilityPage.seoTitle")}</title>
        <meta name="description" content={t("accessibilityPage.seoDesc")} />
        <link rel="canonical" href="https://bizuply.com/accessibility" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="pointer-events-none absolute left-[-12%] top-[-10%] h-[520px] w-[520px] rounded-full bg-amber-200/55 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12%] top-[16%] h-[560px] w-[560px] rounded-full bg-emerald-100/75 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-18%] left-[24%] h-[560px] w-[560px] rounded-full bg-white/85 blur-3xl" />

      <section className="relative mx-auto max-w-7xl px-5 pb-10 pt-20 text-center sm:px-8 lg:px-10 lg:pt-24">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-sm font-black text-amber-800 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {t("accessibilityPage.badge")}
        </div>

        <h1 className="mx-auto max-w-5xl text-5xl font-black leading-[1.03] tracking-[-0.05em] text-slate-800 sm:text-6xl lg:text-7xl">
          {t("accessibilityPage.title")}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600 sm:text-xl">
          {t("accessibilityPage.intro")}
        </p>

        <div className="mx-auto mt-8 inline-flex rounded-2xl border border-white/80 bg-white/70 px-5 py-3 text-sm font-black text-slate-700 shadow-sm backdrop-blur">
          {t("accessibilityPage.lastUpdatedChip")}
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-5 pb-24 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:px-10">
        <aside className="h-fit rounded-[2.5rem] border border-white/80 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur lg:sticky lg:top-24">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-2xl text-slate-800 shadow-lg shadow-slate-900/20">
            ♿
          </div>

          <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-800">
            {t("accessibilityPage.asideTitle")}
          </h2>

          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
            {t("accessibilityPage.asideText")}
          </p>

          <div className="mt-6 grid gap-3">
            {chipItems.map(({ title, text }) => (
              <div
                key={title}
                className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white/75 px-5 py-4"
              >
                <div>
                  <p className="text-xl font-black text-slate-800">{title}</p>
                  <p className="text-sm font-bold text-slate-500">{text}</p>
                </div>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">
                  ✓
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-5 py-4 text-start text-slate-800">
            <p className="text-sm font-black text-amber-800">
              {t("accessibilityPage.needHelp")}
            </p>
            <a
              href="mailto:support@bizuply.com"
              className="mt-2 block break-all text-sm font-bold text-slate-800 transition hover:text-amber-800"
              dir="ltr"
            >
              support@bizuply.com
            </a>
          </div>
        </aside>

        <div className="space-y-6">
          <section className={sectionBase}>
            <h2 className={h2Base}>{t("accessibilityPage.commitmentTitle")}</h2>

            <p className={pBase}>{t("accessibilityPage.commitmentP1")}</p>

            <p className={`${pBase} mt-4`}>
              {t("accessibilityPage.commitmentP2")}
            </p>
          </section>

          <section className={sectionBase}>
            <h2 className={h2Base}>{t("accessibilityPage.featuresTitle")}</h2>

            <p className={pBase}>{t("accessibilityPage.featuresP")}</p>

            <ul className={ulBase}>
              {featureItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={sectionBase}>
            <h2 className={h2Base}>{t("accessibilityPage.limitationsTitle")}</h2>

            <p className={pBase}>{t("accessibilityPage.limitationsP")}</p>
          </section>

          <section className={sectionBase}>
            <h2 className={h2Base}>{t("accessibilityPage.feedbackTitle")}</h2>

            <p className={pBase}>{t("accessibilityPage.feedbackP")}</p>

            <div className="mt-6 rounded-3xl border border-slate-100 bg-white/80 p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">
                {t("accessibilityPage.emailLabel")}
              </p>

              <a
                href="mailto:support@bizuply.com"
                className="mt-2 block break-all text-lg font-black text-slate-800 transition hover:text-amber-700"
                dir="ltr"
              >
                support@bizuply.com
              </a>
            </div>
          </section>

          <section className={sectionBase}>
            <h2 className={h2Base}>{t("accessibilityPage.lastUpdateTitle")}</h2>

            <p className={pBase}>
              {t("accessibilityPage.lastUpdateBefore")}
              <time dateTime="2025-09-29" className="font-black text-slate-800">
                {t("accessibilityPage.lastUpdateDate")}
              </time>
              {t("accessibilityPage.lastUpdateAfter")}
            </p>

            <div className="mt-6 rounded-3xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-5 py-4 text-start text-slate-800">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-800">
                {t("accessibilityPage.statementLabel")}
              </p>
              <p className="mt-2 text-xl font-black">Bizuply</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
