import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f6f7ff_38%,#eef3ff_72%,#ffffff_100%)] text-slate-950">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/45 blur-3xl" />
        <div className="absolute right-[-160px] top-28 h-[420px] w-[420px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute left-[-180px] top-64 h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute right-28 top-24 hidden h-56 w-56 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 lg:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 text-center lg:px-8 lg:pb-28 lg:pt-24">
        {/* Top badge */}
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_18px_rgba(79,70,229,0.85)]" />
          All-in-one business management platform
        </div>

        {/* Headline */}
        <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl xl:text-8xl">
          Run your business
          <br />
          <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
            in one place.
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
          One smart platform to manage clients, appointments, CRM,
          collaborations, proposals and AI — everything connected in one
          premium workspace.
        </p>

        {/* Product preview */}
        <div className="relative mx-auto mt-14 max-w-6xl">
          <div className="absolute inset-x-10 -top-8 h-24 rounded-full bg-cyan-300/25 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-4 shadow-[0_34px_110px_rgba(79,70,229,0.16)] backdrop-blur-xl">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white">
              {/* Light / soft split overlay */}
              <div className="absolute inset-y-0 left-0 z-20 w-1/2 bg-white/80 mix-blend-normal" />
              <div className="absolute inset-y-0 left-1/2 z-30 w-px bg-indigo-100" />

              {/* Toggle */}
              <div className="absolute left-1/2 top-6 z-40 flex -translate-x-1/2 items-center rounded-full border border-slate-200 bg-white/95 p-1 shadow-xl shadow-indigo-100 backdrop-blur">
                <span className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-black text-white">
                  Light
                </span>
                <span className="px-5 py-2 text-sm font-black text-slate-500">
                  Smart
                </span>
              </div>

              {/* App */}
              <div className="relative z-10 flex min-h-[500px]">
                {/* Sidebar */}
                <aside className="hidden w-[210px] shrink-0 bg-slate-950 p-5 text-left text-white md:block">
                  <div className="mb-7 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-lg font-black text-white">
                      B
                    </div>
                    <div>
                      <p className="text-lg font-black text-white">BizUply</p>
                      <p className="text-xs font-semibold text-slate-400">
                        Business OS
                      </p>
                    </div>
                  </div>

                  {[
                    "Dashboard",
                    "Clients",
                    "Appointments",
                    "CRM",
                    "Collaborations",
                    "Reports",
                    "AI Tools",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className={`mb-2 rounded-2xl px-4 py-3 text-sm font-bold ${
                        index === 0
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-950/30"
                          : "text-slate-400"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </aside>

                {/* Main dashboard */}
                <main className="flex-1 bg-gradient-to-br from-white to-indigo-50/60 p-5 text-left md:p-7">
                  <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-indigo-600">
                        Good morning, Michael
                      </p>
                      <h3 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">
                        Your business pipeline
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="hidden rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm sm:block">
                        This month
                      </div>
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                        +
                      </div>
                    </div>
                  </div>

                  {/* Pipeline card */}
                  <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-100/60">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          Sales & Client Pipeline
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          Active opportunities, appointments and proposals
                        </p>
                      </div>

                      <div className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-700">
                        296 active deals
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 md:grid-cols-5">
                      {[
                        ["Leads", "$8.2k", "29 deals"],
                        ["Contacted", "$14.8k", "54 deals"],
                        ["Proposal", "$21.4k", "38 deals"],
                        ["Scheduled", "$9.6k", "16 deals"],
                        ["Converted", "$32.1k", "40 deals"],
                      ].map(([title, amount, deals]) => (
                        <div
                          key={title}
                          className="rounded-2xl bg-gradient-to-br from-white to-indigo-50 p-4 shadow-sm"
                        >
                          <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                            {title}
                          </p>
                          <p className="mt-3 text-xl font-black text-slate-950">
                            {amount}
                          </p>
                          <p className="mt-1 text-xs font-bold text-slate-500">
                            {deals}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                      <div className="rounded-2xl bg-slate-50 p-5">
                        <div className="flex items-center justify-between">
                          <p className="font-black text-slate-900">
                            Revenue Growth
                          </p>
                          <span className="text-xs font-black text-emerald-600">
                            +18%
                          </span>
                        </div>

                        <div className="mt-5 flex h-44 items-end gap-3">
                          {[42, 66, 53, 82, 74, 96, 120, 106].map(
                            (height, index) => (
                              <div
                                key={index}
                                className="flex flex-1 items-end rounded-full bg-white"
                              >
                                <div
                                  className="w-full rounded-full bg-gradient-to-t from-indigo-600 via-blue-500 to-cyan-400"
                                  style={{ height: `${height}px` }}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white p-5 text-slate-950 shadow-sm ring-1 ring-slate-100">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="font-black">AI Assistant</p>
                          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white">
                            ✦
                          </span>
                        </div>

                        <p className="rounded-2xl bg-indigo-50 p-4 text-sm font-semibold leading-6 text-slate-700">
                          I found 3 open time slots and prepared a proposal
                          draft for your new client.
                        </p>

                        <div className="mt-4 space-y-2">
                          {[
                            "Summarize my week",
                            "Draft proposal",
                            "Find free slots",
                          ].map((item) => (
                            <button
                              key={item}
                              type="button"
                              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-left text-sm font-black text-white shadow-lg shadow-indigo-100"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/register"
            className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-8 py-4 text-base font-black text-white shadow-[0_18px_40px_rgba(99,102,241,0.28)] transition hover:-translate-y-0.5"
          >
            Start a trial
          </Link>

          <Link
            to="/pricing"
            className="inline-flex min-w-[180px] items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-black text-slate-900 shadow-lg shadow-slate-100 transition hover:-translate-y-0.5 hover:border-indigo-200"
          >
            View pricing
          </Link>
        </div>

        {/* Trust bullets */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base font-semibold text-slate-500">
          {["No credit card required", "14-day free trial", "Cancel anytime"].map(
            (item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-indigo-50 text-xs text-indigo-600">
                  ✓
                </span>
                {item}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}