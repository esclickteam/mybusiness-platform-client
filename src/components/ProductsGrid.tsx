"use client";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CalendarClock,
  Globe,
  Handshake,
  Headset,
  Users,
  Zap,
} from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "./product-marketing";

const MODULES = [
  { id: "crm", to: "/crm", Icon: Users, tone: "from-indigo-600 to-violet-600" },
  {
    id: "appointments",
    to: "/appointments",
    Icon: CalendarClock,
    tone: "from-blue-600 to-cyan-500",
  },
  {
    id: "automations",
    to: "/automations",
    Icon: Zap,
    tone: "from-violet-600 to-fuchsia-500",
  },
  {
    id: "agents",
    to: "/agents",
    Icon: Headset,
    tone: "from-emerald-600 to-teal-500",
  },
  {
    id: "collaborations",
    to: "/collaborations",
    Icon: Handshake,
    tone: "from-pink-600 to-rose-500",
  },
  {
    id: "site",
    to: "/website-builder",
    Icon: Globe,
    tone: "from-sky-600 to-indigo-600",
  },
];

/** Every module the platform ships, each one a door into its own page. */
export default function ProductsGrid() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-white py-16 text-slate-800 sm:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal from="up" distance={20}>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
              {t("modules.eyebrow")}
            </div>
          </Reveal>

          <Reveal from="up" distance={26} blur delay={0.06}>
            <h2 className="mt-7 text-4xl font-black leading-[1.05] tracking-[-0.04em] text-slate-800 sm:text-5xl">
              {t("modules.titleTop")}{" "}
              <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                {t("modules.titleHighlight")}
              </span>
            </h2>
          </Reveal>

          <Reveal from="up" distance={20} delay={0.12}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {t("modules.subtitle")}
            </p>
          </Reveal>
        </div>

        <Stagger
          className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
          gap={0.07}
        >
          {MODULES.map(({ id, to, Icon, tone }) => (
            <StaggerItem key={id} className="h-full">
              <Link
                to={to}
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white p-5 text-center shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-indigo-100 hover:shadow-[0_24px_70px_rgba(79,70,229,0.16)] sm:rounded-[1.75rem] sm:p-7"
              >
                <span
                  className={`mx-auto mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-lg shadow-indigo-100 transition duration-300 group-hover:scale-110 sm:mb-5 sm:h-12 sm:w-12`}
                >
                  <Icon size={21} aria-hidden="true" />
                </span>

                <h3 className="text-lg font-black tracking-[-0.02em] text-slate-900 sm:text-xl">
                  {t(`modules.${id}Title`)}
                </h3>

                <p className="mt-2 flex-1 text-sm font-semibold leading-6 text-slate-600 sm:mt-3 sm:leading-7">
                  {t(`modules.${id}Text`)}
                </p>

                <span className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-black text-indigo-700 sm:mt-6">
                  {t("modules.open")}
                  <span
                    aria-hidden="true"
                    className="transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
