"use client";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  TourAppointmentsDemo,
  TourClientDemo,
  TourLeadCardDemo,
} from "./TourLiveDemos";
import TemplateShowcase from "./website-builder-marketing/TemplateShowcase";
import { websiteHeroTemplates } from "./website-builder-marketing/websiteHeroTemplates";
import { Reveal, Stagger, StaggerItem } from "./product-marketing";
import "../styles/homeWow.css";
import "./website-builder-marketing/WebsiteBuilderHero.css";

type Step = {
  id: string;
  to: string;
  live?: "leads" | "clients" | "appointments";
  siteShowcase?: boolean;
};

const STEPS: Step[] = [
  {
    id: "leads",
    to: "/crm",
    live: "leads",
  },
  {
    id: "clients",
    to: "/crm",
    live: "clients",
  },
  {
    id: "appointments",
    to: "/appointments",
    live: "appointments",
  },
  {
    id: "site",
    to: "/website-builder",
    siteShowcase: true,
  },
];

function LiveFor({ kind }: { kind: NonNullable<Step["live"]> }) {
  if (kind === "leads") return <TourLeadCardDemo />;
  if (kind === "clients") return <TourClientDemo />;
  return <TourAppointmentsDemo />;
}

export default function ScrollStory() {
  const { t } = useTranslation();

  const bulletsFor = (id: string) => {
    const value = t(`tour.${id}Bullets`, { returnObjects: true }) as unknown;
    return Array.isArray(value) ? (value as string[]) : [];
  };

  return (
    <section
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] py-16 text-center text-slate-800 sm:py-24"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute right-[-180px] top-[620px] h-[420px] w-[420px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute left-[-180px] top-[1200px] h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <Reveal from="up" distance={20}>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
            {t("tour.eyebrow")}
          </div>
        </Reveal>

        <Reveal from="up" distance={26} blur delay={0.06}>
          <h2 className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-slate-800 sm:text-5xl lg:text-6xl">
            {t("tour.titleTop")}{" "}
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              {t("tour.titleHighlight")}
            </span>
          </h2>
        </Reveal>

        <Reveal from="up" distance={20} delay={0.14}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {t("tour.subtitle")}
          </p>
        </Reveal>

        <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-28">
          {STEPS.map((step) => (
            <article key={step.id}>
              <Reveal from="up" distance={22}>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-600">
                  {t(`tour.${step.id}Label`)}
                </p>

                <h3 className="mx-auto mt-4 max-w-3xl text-3xl font-black leading-[1.08] tracking-[-0.035em] text-slate-900 sm:text-4xl lg:text-5xl">
                  {t(`tour.${step.id}Title`)}
                </h3>

                <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 lg:text-lg">
                  {t(`tour.${step.id}Text`)}
                </p>
              </Reveal>

              <Stagger
                className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-2.5"
                gap={0.06}
              >
                {bulletsFor(step.id).map((item) => (
                  <StaggerItem key={item}>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur">
                      <span
                        className="grid h-4 w-4 place-items-center rounded-full bg-indigo-600 text-[0.6rem] font-black text-white"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      {item}
                    </span>
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal
                from="up"
                distance={30}
                duration={0.85}
                delay={0.08}
                className="mx-auto mt-10 max-w-3xl"
              >
                {step.live ? (
                  <div className="live-demo-fixed live-demo-fixed--tour">
                    <LiveFor kind={step.live} />
                  </div>
                ) : step.siteShowcase ? (
                  <div className="home-site-stage">
                    <TemplateShowcase
                      templates={websiteHeroTemplates.slice(0, 5)}
                    />
                  </div>
                ) : null}
              </Reveal>

              <Reveal from="up" distance={18} delay={0.1} className="mt-9">
                <Link
                  to={step.to}
                  className="cta-solid group inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  {t(`tour.${step.id}Cta`)}
                  <span aria-hidden="true" className="transition group-hover:-translate-x-1">
                    ←
                  </span>
                </Link>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
