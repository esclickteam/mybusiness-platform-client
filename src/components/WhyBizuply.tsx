"use client";

import type { ReactNode } from "react";

type Feature = {
  title: string;
  text: string;
  icon: ReactNode;
  badge: string;
  gradient: string;
  glow: string;
};

export default function WhyBizuply() {
  const features: Feature[] = [
    {
      title: "One platform instead of many tools",
      text: "Manage clients, tasks, deals, appointments and automations in one clean workspace — without jumping between systems.",
      icon: (
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3V6M12 18V21M3 12H6M18 12H21"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M7 7H11V11H7V7ZM13 7H17V11H13V7ZM7 13H11V17H7V13ZM13 13H17V17H13V13Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      ),
      badge: "All-in-one",
      gradient: "from-indigo-600 to-violet-600",
      glow: "bg-indigo-300/35",
    },
    {
      title: "Built for real daily business work",
      text: "Designed for real workflows, not theory. Fast actions, clear data and practical tools your business can use every day.",
      icon: (
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M13 2L3 14H11L10 22L21 10H13V2Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      ),
      badge: "Fast workflow",
      gradient: "from-blue-600 to-cyan-500",
      glow: "bg-cyan-300/35",
    },
    {
      title: "Designed to grow with you",
      text: "Start simple and unlock advanced CRM, collaboration, analytics and AI tools as your business grows.",
      icon: (
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 17L9 11L13 15L21 7"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 3V21H21"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      ),
      badge: "Scalable",
      gradient: "from-violet-600 to-fuchsia-500",
      glow: "bg-violet-300/35",
    },
  ];

  const workflows = [
    ["Clients", "Centralize contacts, history and activity"],
    ["Appointments", "Schedule and manage bookings easily"],
    ["Collaborations", "Work with partners in one place"],
    ["AI Assistant", "Get summaries, insights and next actions"],
  ];

  const stats = [
    ["50K+", "actions managed"],
    ["98%", "satisfaction"],
    ["24/7", "business visibility"],
  ];

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_40%,#eef3ff_76%,#ffffff_100%)] py-24 text-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-40 h-[360px] w-[360px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 bottom-10 h-[360px] w-[360px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute right-24 top-24 hidden h-56 w-56 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 lg:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
            WHY BIZUPLY
          </div>

          <h2 className="mt-7 text-4xl font-black leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-6xl">
            One platform.
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              Unlimited possibilities.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Everything your business needs — CRM, clients, appointments,
            collaborations, automations and AI — in one simple, powerful
            platform.
          </p>
        </div>

        <div className="mt-16 overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/75 p-3 shadow-[0_28px_90px_rgba(79,70,229,0.16)] backdrop-blur-xl">
          <div className="grid overflow-hidden rounded-[2rem] border border-slate-100 bg-white lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative overflow-hidden bg-slate-950 p-8 text-white sm:p-10">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
              <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

              <div className="relative">
                <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-cyan-100">
                  Built for modern businesses
                </div>

                <h3 className="max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                  Stop managing your business across disconnected tools.
                </h3>

                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                  BizUply brings your daily business operations into one
                  beautiful workspace — so you can move faster, stay organized
                  and grow with confidence.
                </p>

                <div className="mt-9 grid gap-4 sm:grid-cols-3">
                  {stats.map(([value, label]) => (
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
                {workflows.map(([title, text], index) => (
                  <div
                    key={title}
                    className="group flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-base font-black text-white shadow-lg shadow-indigo-100">
                      {index + 1}
                    </div>

                    <div className="text-left">
                      <h4 className="text-lg font-black text-slate-950">
                        {title}
                      </h4>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                        {text}
                      </p>
                    </div>

                    <div className="ml-auto hidden h-9 w-9 place-items-center rounded-full bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white sm:grid">
                      →
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_26px_80px_rgba(79,70,229,0.16)]"
            >
              <div
                className={`absolute -right-16 -top-16 h-40 w-40 rounded-full ${feature.glow} blur-3xl transition group-hover:scale-125`}
              />

              <div className="relative">
                <div
                  className={`mb-6 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br ${feature.gradient} text-white shadow-xl shadow-indigo-100`}
                >
                  {feature.icon}
                </div>

                <div className="mb-4 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-indigo-700">
                  {feature.badge}
                </div>

                <h3 className="text-2xl font-black leading-tight tracking-[-0.03em] text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-4 text-base font-medium leading-7 text-slate-600">
                  {feature.text}
                </p>

                <a
                  href="/features"
                  className="mt-7 flex items-center gap-2 text-sm font-black text-indigo-700"
                >
                  Learn more
                  <span className="transition group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-4xl rounded-[2rem] border border-indigo-100 bg-white/85 px-8 py-8 text-center shadow-xl shadow-indigo-100/60 backdrop-blur">
          <h3 className="text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">
            Built to replace scattered tools with one beautiful business OS.
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-600">
            Start with what you need today, and unlock more powerful workflows
            as your business grows.
          </p>
        </div>
      </div>
    </section>
  );
}