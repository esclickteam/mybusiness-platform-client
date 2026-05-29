import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    label: "GET STARTED",
    title: "Create a business or client profile",
    description:
      "Set up your account in minutes and start using Bizuply as a business owner or as a client.",
    business: [
      'Click "Join as a Business" and fill out your basic details.',
      "Upload your logo, images and set your business hours.",
      "Choose the right plan for your business.",
      "Result: You get a professional business page ready to welcome clients.",
    ],
    client: [
      'Click "Sign Up" and choose "New Client".',
      "Fill in your name, email and password.",
      "Result: Search businesses, book services and chat directly with providers.",
    ],
    icon: "✦",
    gradient: "from-indigo-600 to-violet-600",
  },
  {
    number: "02",
    label: "DISCOVER",
    title: "Smart business & service search",
    description:
      "Clients can quickly find the right business using smart search, filters and clear business profiles.",
    points: [
      'Search keywords like "Hairdresser in NYC".',
      "Results can be based on ratings, location and availability.",
      "Filter by price, reviews, category and business hours.",
      "Result: Clients quickly find the exact business they need.",
    ],
    icon: "⌕",
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    number: "03",
    label: "BOOKINGS",
    title: "Schedule and manage appointments",
    description:
      "Turn availability into bookings with a simple scheduling flow that keeps everyone updated.",
    points: [
      'Clients visit a business page and click "Book Now".',
      "They view available calendar slots and get instant confirmation.",
      "Automatic reminders help reduce missed appointments.",
      "Result: Easier booking management for both sides.",
    ],
    icon: "◷",
    gradient: "from-violet-600 to-fuchsia-500",
  },
  {
    number: "04",
    label: "COMMUNICATION",
    title: "Direct messages and collaborations",
    description:
      "Keep client conversations and business-to-business collaborations in one connected workspace.",
    points: [
      'Clients can click "Send Message" from every business page.',
      "Questions and requests go directly to the business owner.",
      "Businesses can send collaboration requests.",
      "Result: Easier communication, partnerships and referrals.",
    ],
    icon: "↔",
    gradient: "from-cyan-500 to-indigo-600",
  },
  {
    number: "05",
    label: "INSIGHTS",
    title: "Track and manage your activity",
    description:
      "Use the dashboard to understand what is happening in your business and decide what to do next.",
    points: [
      "Businesses can view dashboard data on visits, bookings and client activity.",
      "Marketing tools help send promotions and updates.",
      "Clients can view booking and appointment history.",
      "Smart recommendations help clients discover better services.",
    ],
    icon: "◆",
    gradient: "from-indigo-600 via-violet-600 to-cyan-500",
  },
];

function HowItWorks() {
  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] text-slate-950">
      <Helmet>
        <title>How It Works - Bizuply | Platform Guide</title>
        <meta
          name="description"
          content="A simple guide on how Bizuply connects businesses with clients, manages appointments, and improves communication with smart automation tools."
        />
        <meta
          name="keywords"
          content="Bizuply, how it works, business management, scheduling, communication, automation, clients, SaaS"
        />
        <link rel="canonical" href="https://bizuply.com/how-it-works" />
        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="How Bizuply Works – Simple Platform Guide"
        />
        <meta
          property="og:description"
          content="Learn how Bizuply helps businesses manage clients, bookings, and collaborations in one smart system."
        />
        <meta property="og:url" content="https://bizuply.com/how-it-works" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bizuply" />
        <meta property="og:image" content="https://bizuply.com/og-image.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="How Bizuply Works – Simple Platform Guide"
        />
        <meta
          name="twitter:description"
          content="Step-by-step guide to Bizuply: managing clients, booking services, and growing your business with smart automation."
        />
        <meta name="twitter:image" content="https://bizuply.com/og-image.jpg" />
      </Helmet>

      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-80 h-[420px] w-[420px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 top-[950px] h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute right-24 top-32 hidden h-56 w-56 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 lg:block" />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
            HOW BIZUPLY WORKS
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[0.98] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
            From setup to growth
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              in one simple flow.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
            Learn step by step how Bizuply helps businesses create a
            professional presence, manage clients, schedule services,
            communicate clearly and grow with smarter tools.
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
              to="/features"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-black text-slate-900 shadow-lg shadow-slate-100 transition hover:-translate-y-0.5 hover:border-indigo-200"
            >
              Explore Features
            </Link>
          </div>
        </section>

        {/* Premium overview */}
        <section className="mt-16 overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/75 p-3 shadow-[0_30px_100px_rgba(79,70,229,0.16)] backdrop-blur-xl">
          <div className="grid overflow-hidden rounded-[2rem] border border-slate-100 bg-white lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative overflow-hidden bg-slate-950 p-8 text-white sm:p-10">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
              <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

              <div className="relative">
                <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-cyan-100">
                  Simple setup. Powerful results.
                </div>

                <h2 className="max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                  Everything starts with one connected business workspace.
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                  Bizuply connects your business page, search visibility,
                  appointments, messages, CRM, collaborations and activity data
                  into one smooth experience.
                </p>

                <div className="mt-9 grid gap-4 sm:grid-cols-3">
                  {[
                    ["01", "Create"],
                    ["02", "Connect"],
                    ["03", "Grow"],
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
                  ["Create a profile", "Build your business page"],
                  ["Get discovered", "Search and filters help clients find you"],
                  ["Book services", "Manage appointments clearly"],
                  ["Communicate", "Messages and collaboration requests"],
                  ["Track activity", "Dashboard insights and next actions"],
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

        {/* Timeline */}
        <section className="mt-20">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
              A clear process from first click
              <br />
              <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                to daily management.
              </span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Each step is designed to be simple, practical and connected to the
              next part of your business workflow.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-indigo-200 via-cyan-200 to-transparent lg:block" />

            <div className="space-y-7">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_26px_80px_rgba(79,70,229,0.16)] lg:ml-16"
                >
                  <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-200/35 blur-3xl transition group-hover:scale-125" />

                  <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                    <div>
                      <div className="mb-6 flex items-center gap-4">
                        <div
                          className={`grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br ${step.gradient} text-2xl font-black text-white shadow-xl shadow-indigo-100`}
                        >
                          {step.icon}
                        </div>

                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.18em] text-indigo-600">
                            {step.label}
                          </p>
                          <p className="mt-1 text-sm font-black text-slate-400">
                            Step {step.number}
                          </p>
                        </div>
                      </div>

                      <h3 className="text-3xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl">
                        {step.title}
                      </h3>

                      <p className="mt-4 text-base font-medium leading-7 text-slate-600">
                        {step.description}
                      </p>
                    </div>

                    <div>
                      {step.business && step.client ? (
                        <div className="grid gap-4 md:grid-cols-2">
                          <StepList title="For Businesses" items={step.business} />
                          <StepList title="For Clients" items={step.client} />
                        </div>
                      ) : (
                        <StepList title="What happens" items={step.points} />
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Simplicity */}
        <section className="mt-20 overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/75 p-3 shadow-[0_30px_100px_rgba(79,70,229,0.16)] backdrop-blur-xl">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-8 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-700">
                  WHY IT FEELS SIMPLE
                </div>

                <h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
                  Powerful tools,
                  <br />
                  without the complexity.
                </h2>

                <p className="mt-5 text-lg leading-8 text-slate-600">
                  Bizuply is designed so business owners can start fast, stay
                  organized and manage daily work without complicated setup.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  ["User-friendly design", "No technical experience required."],
                  [
                    "Automatic reminders",
                    "Notifications help clients and businesses stay updated.",
                  ],
                  ["Support at every step", "Guidance is built into the flow."],
                ].map(([title, text], index) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-indigo-50/70 p-5 shadow-sm"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-base font-black text-white shadow-lg shadow-indigo-100">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-950">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 overflow-hidden rounded-[2.5rem] border border-white/70 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-[1px] shadow-[0_24px_80px_rgba(79,70,229,0.24)]">
          <div className="rounded-[2.5rem] bg-white/10 px-8 py-12 text-center backdrop-blur-xl sm:px-12">
            <h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">
              Ready to see how Bizuply
              <br />
              works for your business?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-indigo-50">
              Create your business workspace, connect with clients and manage
              everything from one smart platform.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-black text-indigo-700 shadow-xl shadow-indigo-900/20 transition hover:-translate-y-0.5"
              >
                Get Started
              </Link>

              <Link
                to="/features"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-4 text-base font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StepList({ title, items }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
      <h4 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-indigo-700">
        {title}
      </h4>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-xs text-white">
              ✓
            </span>

            <span className="text-sm font-semibold leading-6 text-slate-600">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HowItWorks;