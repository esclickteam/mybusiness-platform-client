import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_#ffffff_0%,_#f7f8ff_38%,_#eef2ff_72%,_#f8fbff_100%)]">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[80px] h-[340px] w-[340px] rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute right-[-120px] top-[40px] h-[420px] w-[420px] rounded-full bg-violet-300/25 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-[280px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/20 blur-3xl" />
        <div className="absolute right-20 top-20 hidden h-40 w-40 bg-[radial-gradient(circle,#7c3aed_1px,transparent_1px)] [background-size:14px_14px] opacity-15 lg:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-16 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-bold text-indigo-700 shadow-lg shadow-indigo-100 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.95)]" />
              All-in-one business platform
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[0.94] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
              Run your
              <br />
              business
              <br />
              <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                beautifully.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              One premium workspace for clients, appointments, CRM,
              collaborations, proposals and AI — built for modern service
              businesses that want to look and operate at a higher level.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4f46e5_0%,#7c3aed_55%,#06b6d4_100%)] px-8 py-4 text-base font-black text-white shadow-[0_16px_40px_rgba(99,102,241,0.32)] transition duration-200 hover:-translate-y-0.5"
              >
                Start Free
                <span className="ml-2 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 px-8 py-4 text-base font-black text-slate-900 shadow-lg shadow-slate-100 transition hover:-translate-y-0.5 hover:border-slate-300"
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

          {/* RIGHT */}
          <div className="relative min-h-[640px]">
            {/* Main product frame */}
            <div className="absolute inset-x-0 top-6 mx-auto w-full max-w-[760px] rounded-[32px] border border-white/80 bg-white/80 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white">
                <div className="flex min-h-[500px]">
                  {/* Sidebar */}
                  <aside className="hidden w-[200px] shrink-0 bg-slate-950 px-5 py-6 text-white md:block">
                    <div className="mb-8 flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[linear-gradient(135deg,#6366f1,#06b6d4)] text-lg font-black">
                        B
                      </div>
                      <div>
                        <p className="text-lg font-black">BizUply</p>
                        <p className="text-xs text-slate-400">
                          Business OS
                        </p>
                      </div>
                    </div>

                    {[
                      "Overview",
                      "Clients",
                      "Appointments",
                      "Projects",
                      "Collaborations",
                      "CRM",
                      "AI Assistant",
                    ].map((item, i) => (
                      <div
                        key={item}
                        className={`mb-2 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                          i === 0
                            ? "bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-white shadow-lg shadow-violet-900/25"
                            : "text-slate-400 hover:bg-white/5"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </aside>

                  {/* Main content */}
                  <div className="flex-1 bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] p-5 sm:p-6">
                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-600">
                          Good morning, Michael
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-slate-950">
                          Here’s what’s happening today
                        </h3>
                      </div>

                      <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm">
                        May 2026
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-4">
                      {[
                        ["Revenue", "$12,540", "+18%"],
                        ["Appointments", "18", "+12%"],
                        ["Clients", "124", "+8%"],
                        ["Reviews", "4.9", "+0.4"],
                      ].map(([label, value, delta]) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                        >
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            {label}
                          </p>
                          <div className="mt-2 flex items-end justify-between">
                            <p className="text-2xl font-black text-slate-950">
                              {value}
                            </p>
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-600">
                              {delta}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                      {/* Chart card */}
                      <div className="rounded-[26px] border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-black text-slate-950">
                            Business Performance
                          </h4>
                          <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                            This month
                          </span>
                        </div>

                        <div className="mt-5 flex h-56 items-end gap-3 rounded-2xl bg-[linear-gradient(180deg,#f9fbff_0%,#f3f6ff_100%)] p-4">
                          {[56, 72, 88, 67, 102, 84, 118].map((h, idx) => (
                            <div
                              key={idx}
                              className="flex flex-1 items-end"
                            >
                              <div
                                className="w-full rounded-t-2xl bg-[linear-gradient(180deg,#60a5fa_0%,#6366f1_55%,#7c3aed_100%)] shadow-[0_12px_20px_rgba(99,102,241,0.18)]"
                                style={{ height: `${h}px` }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Activity card */}
                      <div className="rounded-[26px] border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-black text-slate-950">
                            Upcoming Schedule
                          </h4>
                          <span className="text-xs font-bold text-indigo-600">
                            View all
                          </span>
                        </div>

                        <div className="mt-4 space-y-3">
                          {[
                            [
                              "Design Consultation",
                              "Today • 10:00 AM",
                              "Daniel Brooks",
                            ],
                            ["Project Review", "Tomorrow • 2:00 PM", "Olivia"],
                            ["Strategy Call", "May 16 • 11:00 AM", "Sarah"],
                          ].map(([title, time, client]) => (
                            <div
                              key={title}
                              className="rounded-2xl bg-slate-50 p-4"
                            >
                              <p className="text-sm font-black text-slate-900">
                                {title}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-slate-500">
                                {time}
                              </p>
                              <p className="mt-2 text-xs font-bold text-indigo-600">
                                {client}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[26px] border border-slate-100 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-black text-slate-950">
                          Top Services
                        </h4>
                        <span className="text-xs font-bold text-slate-500">
                          Revenue split
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-4">
                        {[
                          ["Brand Design", "$4,250", "34%"],
                          ["Consulting", "$3,120", "26%"],
                          ["Web Projects", "$2,880", "23%"],
                          ["Marketing", "$1,770", "17%"],
                        ].map(([name, amount, share]) => (
                          <div
                            key={name}
                            className="rounded-2xl bg-slate-50 p-4"
                          >
                            <p className="text-sm font-black text-slate-900">
                              {name}
                            </p>
                            <p className="mt-2 text-lg font-black text-slate-950">
                              {amount}
                            </p>
                            <p className="text-xs font-bold text-indigo-600">
                              {share} of total
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating card 1 */}
            <div className="absolute -left-6 bottom-20 hidden w-[320px] rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_24px_50px_rgba(99,102,241,0.18)] backdrop-blur-xl md:block">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-black text-slate-950">Clients</h4>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-600">
                  Active
                </span>
              </div>

              {[
                ["Daniel Brooks", "daniel@email.com"],
                ["Sarah Johnson", "sarah@email.com"],
                ["Olivia White", "olivia@email.com"],
              ].map(([name, email]) => (
                <div
                  key={name}
                  className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
                >
                  <div className="h-11 w-11 rounded-full bg-[linear-gradient(135deg,#818cf8,#22d3ee)]" />
                  <div>
                    <p className="text-sm font-black text-slate-900">{name}</p>
                    <p className="text-xs font-semibold text-slate-500">
                      {email}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating card 2 */}
            <div className="absolute -right-3 top-20 hidden w-[280px] rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_24px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl xl:block">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-slate-950">AI Copilot</h4>
                <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-white">
                  ✦
                </div>
              </div>

              <p className="mt-4 rounded-2xl bg-[linear-gradient(180deg,#eef2ff_0%,#f5f3ff_100%)] p-4 text-sm font-semibold leading-6 text-slate-700">
                I found three available time slots and prepared a proposal draft
                for your new lead.
              </p>

              <div className="mt-4 space-y-2">
                {["Summarize my week", "Draft proposal", "Find open slots"].map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      className="w-full rounded-2xl bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] px-4 py-3 text-left text-sm font-black text-white shadow-lg shadow-violet-200"
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom trust strip */}
        <div className="mt-14 rounded-[34px] border border-white/70 bg-white/85 px-6 py-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <p className="mb-8 text-center text-base font-black text-slate-500">
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
                <p className="text-5xl font-black tracking-tight text-slate-950">
                  {value}
                </p>
                <p className="mt-2 text-base font-bold text-slate-500">
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