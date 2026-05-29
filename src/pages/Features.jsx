import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const features = [
  {
    number: "01",
    title: "Professional Business Page",
    subtitle: "Your business profile, built to convert.",
    description:
      "Every business gets a polished digital business page that presents your brand, services, availability and contact details in one professional place.",
    points: [
      "Business name, category and description",
      "Logo, gallery and visual brand assets",
      "Working hours and contact details",
      "Social links and location",
      "Services with duration and availability",
    ],
    result:
      "A clean, professional online presence that makes your business easier to find, trust and contact.",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 10.5L12 4L20 10.5V20H5.5C4.67 20 4 19.33 4 18.5V10.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M9 20V14H15V20"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
    gradient: "from-indigo-600 to-violet-600",
  },
  {
    number: "02",
    title: "CRM — Client Management",
    subtitle: "Know every client. Track every step.",
    description:
      "Manage relationships, tasks, notes, appointments and history in one organized CRM built for real service businesses.",
    points: [
      "Client files for every customer",
      "Notes from calls, meetings and services",
      "Activity and work history",
      "Tasks and follow-up reminders",
      "Appointments directly from client files",
    ],
    result:
      "All your client data, communication and next actions stay structured, searchable and easy to manage.",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path
          d="M16 11C17.66 11 19 9.66 19 8C19 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M8 12C9.93 12 11.5 10.43 11.5 8.5C11.5 6.57 9.93 5 8 5C6.07 5 4.5 6.57 4.5 8.5C4.5 10.43 6.07 12 8 12Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M3 20C3.5 16.8 5.25 15 8 15C10.75 15 12.5 16.8 13 20"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M13.5 15.5C14.18 15.18 14.98 15 16 15C18.6 15 20.2 16.6 21 19"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    number: "03",
    title: "Messaging System",
    subtitle: "Every conversation in one place.",
    description:
      "Let clients contact you directly from your business page, then manage every message from a single organized dashboard.",
    points: [
      "Clients send messages from your page",
      "Messages appear in your dashboard",
      "Reply directly inside BizUply",
      "Message history is saved",
      "Real-time notifications",
    ],
    result:
      "Client communication becomes centralized, organized and much easier to follow up on.",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 5H19C20.1 5 21 5.9 21 7V15C21 16.1 20.1 17 19 17H10L5 21V17H5C3.9 17 3 16.1 3 15V7C3 5.9 3.9 5 5 5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 9.5H16.5M7.5 12.5H13.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
    gradient: "from-violet-600 to-fuchsia-500",
  },
  {
    number: "04",
    title: "Ratings & Reviews",
    subtitle: "Build trust with every client.",
    description:
      "Strengthen your reputation with public reviews, ratings and verified feedback that helps new clients choose your business.",
    points: [
      "Clients leave public reviews",
      "Star ratings build credibility",
      "Reviews appear on your page",
      "Better reputation over time",
      "More trust across the BizUply network",
    ],
    result:
      "Authentic feedback helps your business look more reliable, professional and ready to grow.",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3.5L14.7 8.97L20.75 9.85L16.38 14.11L17.41 20.13L12 17.28L6.59 20.13L7.62 14.11L3.25 9.85L9.3 8.97L12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
    gradient: "from-amber-400 to-orange-500",
  },
];

function Features() {
  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] text-slate-950">
      <Helmet>
        <title>BizUply — All the Tools Your Business Needs in One Place</title>
        <meta
          name="description"
          content="Explore BizUply features — an all-in-one platform combining CRM, chat, scheduling, reviews, collaborations, and AI tools for small businesses."
        />
        <meta
          name="keywords"
          content="BizUply, business platform, CRM, chat, reviews, scheduling, AI assistant, small business tools, SaaS, business management"
        />
        <meta name="author" content="BizUply" />
      </Helmet>

      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-80 h-[420px] w-[420px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 top-[900px] h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute right-24 top-32 hidden h-56 w-56 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 lg:block" />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
            BIZUPLY FEATURES
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[0.98] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
            All the tools your business needs
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              in one place.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
            BizUply brings together your business page, CRM, messages, reviews,
            collaborations, appointments and AI insights — all inside one smart,
            beautiful workspace.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-8 py-4 text-base font-black text-white shadow-[0_18px_40px_rgba(99,102,241,0.28)] transition hover:-translate-y-0.5"
            >
              Get Started
              <span className="ml-2 transition group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-black text-slate-900 shadow-lg shadow-slate-100 transition hover:-translate-y-0.5 hover:border-indigo-200"
            >
              See How It Works
            </Link>
          </div>
        </section>

        {/* Product overview card */}
        <section className="mt-16 overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/75 p-3 shadow-[0_30px_100px_rgba(79,70,229,0.16)] backdrop-blur-xl">
          <div className="grid overflow-hidden rounded-[2rem] border border-slate-100 bg-white lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative overflow-hidden bg-slate-950 p-8 text-white sm:p-10">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
              <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

              <div className="relative">
                <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-cyan-100">
                  Business OS
                </div>

                <h2 className="max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                  Replace scattered tools with one connected workspace.
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                  Instead of managing clients in one place, messages in another,
                  appointments somewhere else and AI separately — BizUply brings
                  everything together.
                </p>

                <div className="mt-9 grid gap-4 sm:grid-cols-3">
                  {[
                    ["CRM", "Client data"],
                    ["AI", "Next actions"],
                    ["360°", "Business view"],
                  ].map(([value, label]) => (
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
                {[
                  ["Business Page", "Present your business professionally"],
                  ["CRM", "Track clients, notes and follow-ups"],
                  ["Messaging", "Keep conversations organized"],
                  ["Reviews", "Build credibility and trust"],
                  ["AI Insights", "Know what to do next"],
                ].map(([title, text], index) => (
                  <div
                    key={title}
                    className="group flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-base font-black text-white shadow-lg shadow-indigo-100">
                      {index + 1}
                    </div>

                    <div className="text-left">
                      <h3 className="text-lg font-black text-slate-950">
                        {title}
                      </h3>
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
        </section>

        {/* Feature cards */}
        <section className="mt-20 grid gap-7 lg:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_26px_80px_rgba(79,70,229,0.16)]"
            >
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-200/35 blur-3xl transition group-hover:scale-125" />

              <div className="relative">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div
                    className={`grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br ${feature.gradient} text-white shadow-xl shadow-indigo-100`}
                  >
                    {feature.icon}
                  </div>

                  <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-700">
                    {feature.number}
                  </span>
                </div>

                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-indigo-600">
                  {feature.subtitle}
                </p>

                <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl">
                  {feature.title}
                </h2>

                <p className="mt-4 text-base font-medium leading-7 text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {feature.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                    >
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-xs text-white">
                        ✓
                      </span>
                      <span className="text-sm font-bold leading-6 text-slate-600">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-[1px]">
                  <p className="rounded-2xl bg-white px-5 py-4 text-sm font-black leading-6 text-slate-800">
                    <span className="text-indigo-700">Result:</span>{" "}
                    {feature.result}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Summary CTA */}
        <section className="mt-20 overflow-hidden rounded-[2.5rem] border border-white/70 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-[1px] shadow-[0_24px_80px_rgba(79,70,229,0.24)]">
          <div className="rounded-[2.5rem] bg-white/10 px-8 py-12 text-center backdrop-blur-xl sm:px-12">
            <h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">
              Build, manage and grow
              <br />
              your business from one place.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-indigo-50">
              From client management to AI insights, BizUply gives you the tools
              to operate more professionally and move faster.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-black text-indigo-700 shadow-xl shadow-indigo-900/20 transition hover:-translate-y-0.5"
              >
                Get Started
              </Link>

              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-4 text-base font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Features;