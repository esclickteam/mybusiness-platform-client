"use client";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AppShot from "./AppShot";

type Step = {
  id: string;
  src: string;
  width: number;
  height: number;
  to: string;
  /** Odd steps put the shot first so the page alternates. */
  shotFirst: boolean;
};

const STEPS: Step[] = [
  {
    id: "leads",
    src: "/home/crm-lead-card.webp",
    width: 1248,
    height: 1158,
    to: "/crm",
    shotFirst: true,
  },
  {
    id: "clients",
    src: "/home/crm-client.webp",
    width: 1400,
    height: 838,
    to: "/crm",
    shotFirst: false,
  },
  {
    id: "appointments",
    src: "/home/crm-appointments.webp",
    width: 1400,
    height: 752,
    to: "/appointments",
    shotFirst: true,
  },
  {
    id: "site",
    src: "/home/site-velmora.webp",
    width: 1400,
    height: 562,
    to: "/website-builder",
    shotFirst: false,
  },
];

const SITE_EXTRAS = [
  { src: "/home/site-lunelle.webp", width: 1400, height: 632, key: "lunelle" },
  { src: "/home/site-talentix.webp", width: 1400, height: 866, key: "talentix" },
];

function useBullets(id: string) {
  const { t } = useTranslation();
  const value = t(`tour.${id}Bullets`, { returnObjects: true }) as unknown;
  return Array.isArray(value) ? (value as string[]) : [];
}

function StepText({ step }: { step: Step }) {
  const { t } = useTranslation();
  const bullets = useBullets(step.id);

  return (
    <div className="relative">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-4 py-2 text-sm font-black text-indigo-700 shadow-lg shadow-indigo-100/70 backdrop-blur">
        <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
        {t(`tour.${step.id}Label`)}
      </div>

      <h3 className="max-w-xl text-3xl font-black leading-[1.06] tracking-[-0.04em] text-slate-800 sm:text-4xl lg:text-5xl">
        {t(`tour.${step.id}Title`)}
      </h3>

      <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 lg:text-lg">
        {t(`tour.${step.id}Text`)}
      </p>

      <ul className="mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
        {bullets.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm font-bold leading-6 text-slate-700 shadow-sm backdrop-blur"
          >
            <span
              className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-50 text-[0.7rem] font-black text-indigo-700"
              aria-hidden="true"
            >
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      <Link
        to={step.to}
        className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-indigo-100 bg-white px-6 py-3 text-sm font-black text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100"
      >
        {t(`tour.${step.id}Cta`)}
        <span aria-hidden="true" className="rtl:rotate-180">
          →
        </span>
      </Link>
    </div>
  );
}

export default function ScrollStory() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] py-16 text-slate-800 sm:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute right-[-180px] top-[520px] h-[420px] w-[420px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute left-[-180px] top-[900px] h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
            {t("tour.eyebrow")}
          </div>

          <h2 className="mt-7 text-4xl font-black leading-[1.02] tracking-[-0.04em] text-slate-800 sm:text-5xl lg:text-6xl">
            {t("tour.titleTop")}
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              {t("tour.titleHighlight")}
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {t("tour.subtitle")}
          </p>
        </div>

        <div className="mt-14 space-y-16 sm:mt-20 sm:space-y-24 lg:space-y-28">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div className={step.shotFirst ? "lg:order-1" : "lg:order-2"}>
                <AppShot
                  src={step.src}
                  alt={t(`tour.${step.id}Alt`)}
                  width={step.width}
                  height={step.height}
                  crumb={t(`tour.${step.id}Crumb`)}
                />

                {step.id === "site" ? (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {SITE_EXTRAS.map((extra) => (
                      <AppShot
                        key={extra.key}
                        src={extra.src}
                        alt={t(`tour.site${extra.key === "lunelle" ? "Extra1" : "Extra2"}Alt`)}
                        width={extra.width}
                        height={extra.height}
                        crumb={t(
                          `tour.site${extra.key === "lunelle" ? "Extra1" : "Extra2"}Crumb`,
                        )}
                      />
                    ))}
                  </div>
                ) : null}
              </div>

              <div
                className={
                  step.shotFirst ? "lg:order-2 lg:ps-4" : "lg:order-1 lg:pe-4"
                }
              >
                <StepText step={step} />
              </div>
            </div>
          ))}
        </div>

        {/* Notifications — the one screen people actually live in on a phone */}
        <div className="mt-16 grid items-center gap-10 rounded-[2.5rem] border border-white/80 bg-white/70 p-6 shadow-[0_24px_80px_rgba(79,70,229,0.12)] backdrop-blur-xl sm:mt-24 sm:p-10 lg:mt-28 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="mx-auto w-full max-w-[19rem]">
            <AppShot
              src="/home/crm-notifications.webp"
              alt={t("tour.mobileAlt")}
              width={784}
              height={1218}
              crumb={t("tour.mobileCrumb")}
            />
          </div>

          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-4 py-2 text-sm font-black text-indigo-700 shadow-lg shadow-indigo-100/70 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
              {t("tour.mobileLabel")}
            </div>

            <h3 className="text-3xl font-black leading-[1.06] tracking-[-0.04em] text-slate-800 sm:text-4xl">
              {t("tour.mobileTitle")}
            </h3>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 lg:text-lg">
              {t("tour.mobileText")}
            </p>

            <ul className="mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
              {(
                (t("tour.mobileBullets", { returnObjects: true }) as unknown as
                  | string[]
                  | undefined) || []
              ).map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold leading-6 text-slate-700 shadow-sm"
                >
                  <span
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-50 text-[0.7rem] font-black text-indigo-700"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
