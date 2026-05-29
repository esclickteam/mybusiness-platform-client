import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function BusinessJoin() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F4EE] text-slate-950">
      <Helmet>
        <title>
          Join Businesses - Collaborations, Clients & Smart Management | Bizuply
        </title>
        <meta
          name="description"
          content="Join Bizuply and get real client inquiries, collaborations with other businesses, and smart CRM & scheduling. Everything your business needs to grow in one place."
        />
        <link rel="canonical" href="https://bizuply.com/join" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Background */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-amber-200/50 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8%] top-[20%] h-[520px] w-[520px] rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-15%] left-[25%] h-[480px] w-[480px] rounded-full bg-white/80 blur-3xl" />

      {/* Hero */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-28 lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-sm font-bold text-amber-800 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            New growth platform for modern businesses
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
            Grow your business with clients, collaborations & smart management.
          </h1>

          <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-slate-600 sm:text-xl">
            Bizuply helps businesses get discovered, receive client inquiries,
            collaborate with other businesses, manage appointments, and organize
            daily work from one beautiful dashboard.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center rounded-2xl bg-slate-950 px-8 py-4 text-base font-black text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Start Free Trial
              <span className="ml-2 transition group-hover:translate-x-1">→</span>
            </Link>

            <Link
              to="/businesses"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/75 px-8 py-4 text-base font-black text-slate-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              Explore Businesses
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {[
              ["CRM", "Clients & leads"],
              ["AI", "Smart assistant"],
              ["Growth", "Collaborations"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur"
              >
                <p className="text-xl font-black text-slate-950">{title}</p>
                <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="relative">
          <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-amber-200/70 via-white to-emerald-100/80 blur-2xl" />

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/80 p-5 shadow-2xl shadow-slate-900/12 backdrop-blur-xl">
            <div className="rounded-[2rem] bg-slate-950 p-5 text-white">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-amber-200">
                    Bizuply Dashboard
                  </p>
                  <h3 className="mt-1 text-2xl font-black">Today’s Growth</h3>
                </div>

                <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-black">
                  Live
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white p-5 text-slate-950">
                  <p className="text-sm font-bold text-slate-500">
                    New inquiries
                  </p>
                  <p className="mt-3 text-4xl font-black">24</p>
                  <p className="mt-2 text-sm font-bold text-emerald-600">
                    +18% this week
                  </p>
                </div>

                <div className="rounded-3xl bg-amber-100 p-5 text-slate-950">
                  <p className="text-sm font-bold text-amber-800">
                    Collaborations
                  </p>
                  <p className="mt-3 text-4xl font-black">8</p>
                  <p className="mt-2 text-sm font-bold text-amber-700">
                    Active deals
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 rounded-3xl bg-white/10 p-4">
                {[
                  ["New client request", "Website design project"],
                  ["Meeting booked", "Tomorrow at 11:30"],
                  ["AI reminder", "Follow up with 3 leads"],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-black">{title}</p>
                      <p className="text-xs font-semibold text-white/60">
                        {text}
                      </p>
                    </div>
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        <div className="mb-10 text-center">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-700">
            Why join Bizuply
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Everything your business needs to grow smarter
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: "🚀",
              title: "Benefits You’ll Get",
              items: [
                "Professional business page",
                "Calendar & appointment tools",
                "CRM for clients and leads",
                "Simple monthly price",
              ],
            },
            {
              icon: "🤝",
              title: "More Collaborations",
              items: [
                "Connect with complementary businesses",
                "Receive direct referrals",
                "Collaborate on projects and deals",
                "Build a strong growth network",
              ],
            },
            {
              icon: "✨",
              title: "3 Simple Steps",
              items: [
                "Sign up and choose your plan",
                "Create your business page",
                "Start receiving inquiries",
                "Let the system work for you",
              ],
            },
          ].map((card) => (
            <article
              key={card.title}
              className="group rounded-[2rem] border border-white/80 bg-white/75 p-7 shadow-xl shadow-slate-900/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-2xl shadow-lg shadow-slate-900/20 transition group-hover:scale-105">
                {card.icon}
              </div>

              <h3 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                {card.title}
              </h3>

              <ul className="mt-6 space-y-4">
                {card.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-base font-bold leading-7 text-slate-600"
                  >
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[2.5rem] bg-slate-950 px-6 py-14 text-center shadow-2xl shadow-slate-900/20 sm:px-10 lg:py-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-300">
              Start growing today
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              Join Bizuply and turn your business into a growth machine.
            </h2>

            <p className="mt-5 text-lg font-medium leading-8 text-white/70">
              Manage clients, collaborations, appointments, reminders and smart
              business growth from one powerful platform.
            </p>

            <div className="mt-8">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-9 py-4 text-base font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-amber-100"
              >
                Start Free Trial
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BusinessJoin;