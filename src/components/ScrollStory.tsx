"use client";

import { useTranslation } from "react-i18next";

type FeatureAlign = "center" | "left" | "right";

type Feature = {
  label: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  badge: string;
  align: FeatureAlign;
};

function FeatureVisual({ feature }: { feature: Feature }) {
  return (
    <div className="relative">
      <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-indigo-200/45 via-violet-200/35 to-cyan-200/40 blur-2xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-3 shadow-[0_24px_80px_rgba(79,70,229,0.16)] backdrop-blur-xl">
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 bg-white/90 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-300" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-300" />
            </div>

            <span className="rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-black text-indigo-700">
              {feature.badge}
            </span>
          </div>

          <div className="relative bg-gradient-to-br from-white to-indigo-50/60 p-4">
            <img
              src={feature.image}
              alt={feature.alt}
              loading="lazy"
              decoding="async"
              className="h-auto w-full rounded-[1.2rem] object-cover shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureText({
  feature,
  bullets,
}: {
  feature: Feature;
  bullets: string[];
}) {
  return (
    <div className="relative">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-4 py-2 text-sm font-black text-indigo-700 shadow-lg shadow-indigo-100/70 backdrop-blur">
        <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
        {feature.label}
      </div>

      <h3 className="max-w-xl text-4xl font-black leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-5xl">
        {feature.title}
      </h3>

      <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
        {feature.description}
      </p>

      <div className="mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
        {bullets.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-xs text-white">
              ✓
            </span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ScrollStory() {
  const { t } = useTranslation();

  const features: Feature[] = [
    {
      label: t("scrollStory.introLabel"),
      title: t("scrollStory.introTitle"),
      description: t("scrollStory.introDescription"),
      image: "/images/dashboard-preview-v3.png",
      alt: t("scrollStory.introAlt"),
      badge: t("scrollStory.introBadge"),
      align: "center",
    },
    {
      label: t("scrollStory.pageLabel"),
      title: t("scrollStory.pageTitle"),
      description: t("scrollStory.pageDescription"),
      image: "/images/business-page-v4.png",
      alt: t("scrollStory.pageAlt"),
      badge: t("scrollStory.pageBadge"),
      align: "left",
    },
    {
      label: t("scrollStory.collabLabel"),
      title: t("scrollStory.collabTitle"),
      description: t("scrollStory.collabDescription"),
      image: "/images/collaborations-v11.png",
      alt: t("scrollStory.collabAlt"),
      badge: t("scrollStory.collabBadge"),
      align: "right",
    },
    {
      label: t("scrollStory.crmLabel"),
      title: t("scrollStory.crmTitle"),
      description: t("scrollStory.crmDescription"),
      image: "/images/crm-preview-v2.png",
      alt: t("scrollStory.crmAlt"),
      badge: t("scrollStory.crmBadge"),
      align: "left",
    },
    {
      label: t("scrollStory.aiLabel"),
      title: t("scrollStory.aiTitle"),
      description: t("scrollStory.aiDescription"),
      image: "/images/ai-preview.png",
      alt: t("scrollStory.aiAlt"),
      badge: t("scrollStory.aiBadge"),
      align: "right",
    },
  ];

  const bullets = [
    t("scrollStory.bullet1"),
    t("scrollStory.bullet2"),
    t("scrollStory.bullet3"),
    t("scrollStory.bullet4"),
  ];

  const [intro, ...steps] = features;

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] py-24 text-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute right-[-180px] top-[520px] h-[420px] w-[420px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute left-[-180px] top-[900px] h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute right-20 top-24 hidden h-56 w-56 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 lg:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
            {intro.label}
          </div>

          <h2 className="mt-7 text-4xl font-black leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-6xl">
            {t("scrollStory.introTitleTop")}
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              {t("scrollStory.introTitleHighlight")}
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {t("scrollStory.introSubtitle")}
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-5xl">
          <FeatureVisual feature={intro} />
        </div>

        <div className="mt-28 space-y-28">
          {steps.map((feature) => {
            const imageFirst = feature.align === "left";

            return (
              <div
                key={feature.title}
                className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
              >
                <div className={imageFirst ? "lg:order-1" : "lg:order-2"}>
                  <FeatureVisual feature={feature} />
                </div>

                <div
                  className={[
                    imageFirst ? "lg:order-2 lg:ps-4" : "lg:order-1 lg:pe-4",
                  ].join(" ")}
                >
                  <FeatureText feature={feature} bullets={bullets} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-28 overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-[1px] shadow-[0_24px_80px_rgba(79,70,229,0.24)]">
          <div className="rounded-[2rem] bg-white/10 px-8 py-10 text-center backdrop-blur-xl sm:px-12">
            <h3 className="text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
              {t("scrollStory.footerTitle")}
            </h3>

            <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-indigo-50">
              {t("scrollStory.footerText")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
