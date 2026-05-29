import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#fbfcff]">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute right-[-160px] top-20 h-[420px] w-[420px] rounded-full bg-purple-300/35 blur-3xl" />
        <div className="absolute left-[-180px] top-64 h-[360px] w-[360px] rounded-full bg-cyan-200/35 blur-3xl" />

        <div className="absolute right-16 top-20 hidden h-48 w-48 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:14px_14px] opacity-25 lg:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          {/* LEFT CONTENT */}
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-bold text-indigo-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-indigo-600 shadow-[0_0_18px_rgba(79,70,229,0.9)]" />
              All-in-one business management platform
            </div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Run your business
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                in one place.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              Manage clients, projects, appointments, CRM, collaborations and
              AI tools — all connected inside one smart dashboard.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-base font-black text-white shadow-xl shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-500/30"
              >
                Start Free
                <span className="ml-2 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-2xl border border-indigo-100 bg-white px-8 py-4 text-base font-black text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
              >
                View Pricing
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-500">
              <span className="inline-flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-indigo-50 text-indigo-600">
                  ✓
                </span>
                14-day free trial
              </span>

              <span className="inline-flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-indigo-50 text-indigo-600">
                  ✓
                </span>
                No credit card required
              </span>

              <span className="inline-flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-indigo-50 text-indigo-600">
                  ✓
                </span>
                Cancel anytime
              </span>
            </div>
          </div>

          {/* RIGHT PRODUCT MOCKUP */}
          <div className="relative min-h-[560px]">
            {/* Main dashboard */}
            <div className="absolute left-0 top-8 w-full max-w-[760px] rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-2xl shadow-indigo-200/60 backdrop-blur-xl">
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white">
                <div className="flex min-h-[430px]">
                  {/* Sidebar */}
                  <div className="hidden w-44 shrink-0 bg-slate-950 p-5 text-white md:block">
                    <div className="mb-8 flex items-center gap-2 font-black">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400">
                        B
                      </span>
                      BizUply
                    </div>

                    {[
                      "Overview",
                      "Clients",
                      "Appointments",
                      "Collaborations",
                      "Projects",
                      "AI Assistant",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`mb-2 rounded-xl px-3 py-2 text-xs font-bold ${
                          index === 0
                            ? "bg-indigo-600 text-white"
                            : "text-slate-400"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-gradient-to-br from-white to-indigo-50/40 p-5">
                    <div className="mb-5 flex items-start justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-indigo-600">
                          Good morning, Michael
                        </p>
                        <h3 className="mt-1 text-xl font-black text-slate-950">
                          Here’s your business today
                        </h3>
                      </div>

                      <div className="rounded-full border border-slate-100 bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm">
                        May 2026
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-4">
                      {[
                        ["Profile Views", "1,289", "+24%"],
                        ["Reviews", "4.8", "+0.6"],
                        ["Appointments", "18", "+12%"],
                        ["Revenue", "$12,540", "+18%"],
                      ].map(([label, value, change]) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                        >
                          <p className="text-[11px] font-bold text-slate-400">
                            {label}
                          </p>
                          <div className="mt-2 flex items-end justify-between gap-2">
                            <strong className="text-xl font-black text-slate-950">
                              {value}
                            </strong>
                            <span className="text-xs font-black text-emerald-500">
                              {change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="font-black text-slate-900">
                            Activity Overview
                          </p>
                          <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                            This Week
                          </span>
                        </div>

                        <div className="flex h-40 items-end gap-3">
                          {[42, 58, 70, 52, 76, 61, 92].map((height, index) => (
                            <div
                              key={index}
                              className="flex flex-1 items-end rounded-full bg-indigo-50"
                            >
                              <div
                                className="w-full rounded-full bg-gradient-to-t from-indigo-600 to-cyan-400"
                                style={{ height: `${height}%` }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                        <p className="mb-4 font-black text-slate-900">
                          Upcoming
                        </p>

                        {[
                          ["Design Consultation", "Today, 10:00"],
                          ["Project Review", "Tomorrow, 14:00"],
                          ["Strategy Call", "May 16, 11:00"],
                        ].map(([title, time]) => (
                          <div
                            key={title}
                            className="mb-3 rounded-2xl bg-slate-50 p-3"
                          >
                            <p className="text-sm font-black text-slate-800">
                              {title}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">
                              {time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating clients card */}
            <div className="absolute -left-4 bottom-16 hidden w-[390px] rounded-3xl border border-white/80 bg-white/95 p-5 shadow-2xl shadow-indigo-200/60 backdrop-blur-xl md:block">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-black text-slate-950">Clients</h4>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-600">
                  All Clients
                </span>
              </div>

              {[
                ["Daniel Brooks", "daniel@email.com"],
                ["Sarah Johnson", "sarah@email.com"],
                ["Olivia White", "olivia@email.com"],
              ].map(([name, email]) => (
                <div
                  key={name}
                  className="mb-3 flex items-center justify-between rounded-2xl bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400" />
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        {name}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {email}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">
                    Active
                  </span>
                </div>
              ))}
            </div>

            {/* Floating AI card */}
            <div className="absolute -right-2 bottom-0 w-[320px] rounded-3xl border border-white/80 bg-white/95 p-5 shadow-2xl shadow-violet-200/60 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-black text-slate-950">AI Assistant</h4>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600 text-white">
                  ✦
                </span>
              </div>

              <p className="rounded-2xl bg-indigo-50 p-4 text-sm font-semibold leading-6 text-slate-700">
                Hi Michael 👋 I found 3 open time slots and drafted a proposal
                for your new client.
              </p>

              <div className="mt-4 grid gap-2">
                {["Summarize my week", "Draft a proposal", "Find free slots"].map(
                  (item) => (
                    <button
                      key={item}
                      className="rounded-xl border border-slate-100 bg-white px-4 py-3 text-left text-xs font-black text-slate-700 shadow-sm"
                      type="button"
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Floating calendar */}
            <div className="absolute right-0 top-0 hidden w-[230px] rounded-3xl border border-white/80 bg-white/95 p-5 shadow-2xl shadow-indigo-200/50 backdrop-blur-xl xl:block">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-black text-slate-950">May</p>
                <p className="text-xs font-bold text-slate-400">2026</p>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <span key={day}>{day}</span>
                ))}

                {Array.from({ length: 28 }).map((_, index) => (
                  <span
                    key={index}
                    className={`grid h-7 w-7 place-items-center rounded-full ${
                      index === 13
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600"
                    }`}
                  >
                    {index + 1}
                  </span>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-indigo-50 p-3">
                <p className="text-xs font-black text-indigo-700">
                  Design Consultation
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Wed, May 14 · 10:00
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TRUST STRIP */}
        <div className="mt-16 rounded-[2rem] border border-white/70 bg-white/70 px-6 py-8 shadow-xl shadow-indigo-100/50 backdrop-blur-xl">
          <p className="mb-7 text-center text-sm font-black text-slate-500">
            Built for service businesses, agencies, freelancers, studios and
            growing teams.
          </p>

          <div className="grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["1,000+", "Businesses"],
              ["50K+", "Users"],
              ["98%", "Customer Satisfaction"],
              ["24/7", "Support"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-3xl font-black text-slate-950">{value}</p>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}