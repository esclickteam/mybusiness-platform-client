import React from "react";
import { Helmet } from "react-helmet-async";

const offers = [
  {
    title: "Smart CRM & Communication",
    text: "Manage customer data, messages and relationships efficiently from one dashboard.",
    icon: "CRM",
  },
  {
    title: "Interactive Business Page",
    text: "Showcase your services, reviews and chat directly with clients from one professional page.",
    icon: "WEB",
  },
  {
    title: "Ratings & Reviews System",
    text: "Build credibility and trust with verified client feedback.",
    icon: "★",
  },
  {
    title: "Business Collaborations",
    text: "Connect with complementary businesses and create new growth opportunities.",
    icon: "∞",
  },
  {
    title: "AI Business Assistant",
    text: "Automate tasks, analyze activity and get smart recommendations to boost performance.",
    icon: "AI",
  },
];

const values = [
  {
    title: "Transparency & Simplicity",
    text: "Intuitive tools that empower you to focus on what truly matters.",
  },
  {
    title: "Innovation with Purpose",
    text: "Practical solutions inspired by real business challenges.",
  },
  {
    title: "Community & Collaboration",
    text: "A growing network of professionals dedicated to shared success.",
  },
];

function About() {
  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] text-slate-950">
      <Helmet>
        <title>About BizUply | All-in-One Business Management Platform</title>
        <meta
          name="description"
          content="Learn about BizUply — an all-in-one SaaS platform that helps business owners manage clients, communication, scheduling, and growth efficiently."
        />
        <meta
          name="keywords"
          content="BizUply, business management, SaaS platform, CRM, automation, AI tools, small business software, business collaboration"
        />
        <link rel="canonical" href="https://bizuply.com/about" />
        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="About BizUply" />
        <meta
          property="og:description"
          content="Discover BizUply — the smart business management platform that simplifies communication, collaboration, and growth."
        />
        <meta property="og:url" content="https://bizuply.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
        <meta property="og:image" content="https://bizuply.com/og-image.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About BizUply" />
        <meta
          name="twitter:description"
          content="BizUply helps small and medium businesses manage clients, automation, and communication — all in one platform."
        />
        <meta name="twitter:image" content="https://bizuply.com/og-image.jpg" />
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
            ABOUT BIZUPLY
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[0.98] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
            A smarter way
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              to run a business.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
            BizUply is a modern SaaS platform built to help business owners
            manage clients, communication, scheduling, collaborations,
            automation and growth — all from one connected workspace.
          </p>
        </section>

        {/* Main story */}
        <section className="mt-16 overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/75 p-3 shadow-[0_30px_100px_rgba(79,70,229,0.16)] backdrop-blur-xl">
          <div className="grid overflow-hidden rounded-[2rem] border border-slate-100 bg-white lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative overflow-hidden bg-slate-950 p-8 text-white sm:p-10">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
              <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

              <div className="relative">
                <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-cyan-100">
                  Built from real business needs
                </div>

                <h2 className="max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                  One platform for the work that usually lives everywhere.
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                  Founded by entrepreneurs who understand real business
                  challenges, BizUply was created to simplify management,
                  strengthen client connections and support long-term growth.
                </p>

                <div className="mt-9 grid gap-4 sm:grid-cols-3">
                  {[
                    ["CRM", "Clients"],
                    ["AI", "Insights"],
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
                  [
                    "Our Vision",
                    "Technology should work for business owners — not the other way around.",
                  ],
                  [
                    "Our Journey",
                    "BizUply brings essential tools under one roof: CRM, scheduling, messaging, reviews, partnerships and AI.",
                  ],
                  [
                    "Looking Ahead",
                    "We’re building a reliable digital workspace for small and medium businesses.",
                  ],
                  [
                    "In a Few Words",
                    "A smarter way to stay organized, connected and future-ready.",
                  ],
                ].map(([title, text], index) => (
                  <div
                    key={title}
                    className="group flex items-start gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100"
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

                    <div className="ml-auto hidden h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white sm:grid">
                      →
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vision / Journey */}
        <section className="mt-20 grid gap-7 lg:grid-cols-2">
          <InfoCard
            label="OUR VISION"
            title="Powerful business tools should feel simple."
            text="We believe technology should be accessible, practical and effective for every small and medium-sized business. BizUply empowers entrepreneurs to grow smarter by combining usability, innovation and real human connection."
          />

          <InfoCard
            label="OUR JOURNEY"
            title="Built to replace scattered tools."
            text="BizUply was founded with one goal — to bring essential business tools under one roof. Instead of managing separate systems for CRM, scheduling, messaging, reviews and partnerships, we created one unified platform."
          />
        </section>

        {/* Offers */}
        <section className="mt-20">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
              WHAT BIZUPLY OFFERS
            </div>

            <h2 className="mt-7 text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Everything your business needs
              <br />
              <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                in one beautiful system.
              </span>
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {offers.map((item, index) => (
              <article
                key={item.title}
                className={`group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_26px_80px_rgba(79,70,229,0.16)] ${
                  index === 4 ? "lg:col-span-2" : ""
                }`}
              >
                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-200/35 blur-3xl transition group-hover:scale-125" />

                <div className="relative">
                  <div className="mb-6 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-lg font-black text-white shadow-xl shadow-indigo-100">
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-black leading-tight tracking-[-0.03em] text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-base font-medium leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mt-20 overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/75 p-3 shadow-[0_30px_100px_rgba(79,70,229,0.16)] backdrop-blur-xl">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-8 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-700">
                  OUR VALUES
                </div>

                <h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
                  Built with clarity,
                  <br />
                  purpose and collaboration.
                </h2>

                <p className="mt-5 text-lg leading-8 text-slate-600">
                  BizUply is built on principles that make the platform useful,
                  practical and focused on real business growth.
                </p>
              </div>

              <div className="grid gap-4">
                {values.map((value, index) => (
                  <div
                    key={value.title}
                    className="flex items-start gap-4 rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-indigo-50/70 p-5 shadow-sm"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-base font-black text-white shadow-lg shadow-indigo-100">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-950">
                        {value.title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                        {value.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA without buttons */}
        <section className="mt-20 overflow-hidden rounded-[2.5rem] border border-white/70 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-[1px] shadow-[0_24px_80px_rgba(79,70,229,0.24)]">
          <div className="rounded-[2.5rem] bg-white/10 px-8 py-12 text-center backdrop-blur-xl sm:px-12">
            <h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">
              Ready to run your business
              <br />
              from one smart workspace?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-indigo-50">
              BizUply helps businesses stay organized, connected and
              future-ready — so you can focus on leading, creating and growing.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoCard({ label, title, text }) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_26px_80px_rgba(79,70,229,0.16)]">
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-200/35 blur-3xl transition group-hover:scale-125" />

      <div className="relative">
        <div className="mb-5 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-700">
          {label}
        </div>

        <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl">
          {title}
        </h2>

        <p className="mt-5 text-base font-medium leading-8 text-slate-600">
          {text}
        </p>
      </div>
    </article>
  );
}

export default About;