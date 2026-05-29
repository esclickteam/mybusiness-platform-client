"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What is Bizuply?",
    a: {
      lead:
        "Bizuply is an all-in-one platform that centralizes your business — business page, CRM, collaborations, and AI — so you can manage everything in one place.",
      bullets: [
        {
          title: "Business Page",
          text: "Turn visitors into leads with a professional profile.",
        },
        {
          title: "CRM",
          text: "Track leads, clients, follow-ups, and pipeline stages.",
        },
        {
          title: "Collaborations",
          text: "Work with other businesses and manage proposals & deals.",
        },
        {
          title: "AI",
          text: "Get smart suggestions and next-step actions to move faster.",
        },
      ],
      footer:
        "Everything stays connected — no more switching between scattered tools.",
    },
  },
  {
    q: "How does Bizuply help me get more clients?",
    a: {
      lead:
        "Bizuply helps you capture leads, respond faster, and stay consistent — which increases conversions over time.",
      bullets: [
        {
          title: "Capture leads",
          text: "Your business page turns traffic into inquiries.",
        },
        {
          title: "Follow up faster",
          text: "CRM reminders and tasks keep leads warm.",
        },
        {
          title: "Close more deals",
          text: "A clear pipeline view helps you move opportunities forward.",
        },
      ],
      footer:
        "The result: fewer missed messages, faster follow-ups, and more closed clients.",
    },
  },
  {
    q: "What can I manage inside the CRM?",
    a: {
      lead:
        "Your CRM is where everything about a lead or client stays organized — so you always know what’s next.",
      bullets: [
        {
          title: "Leads & clients",
          text: "Keep every contact and inquiry in one place.",
        },
        {
          title: "Tasks & follow-ups",
          text: "Set reminders, next steps, and due dates.",
        },
        {
          title: "Notes & history",
          text: "Track conversations, status, and progress over time.",
        },
        {
          title: "Pipeline stages",
          text: "Move deals through steps so nothing gets stuck.",
        },
      ],
      footer:
        "No more spreadsheets or forgotten follow-ups — it’s all structured and searchable.",
    },
  },
  {
    q: "How does AI help in Bizuply?",
    a: {
      lead:
        "Bizuply AI helps you act faster by highlighting priorities and recommending next steps based on your activity.",
      bullets: [
        {
          title: "Next-step suggestions",
          text: "Get recommended actions for leads and deals.",
        },
        {
          title: "Priority insights",
          text: "See what needs attention now — before it’s too late.",
        },
        {
          title: "Faster responses",
          text: "Draft better replies and follow-ups in less time.",
        },
      ],
      footer:
        "It’s like having a smart assistant inside your CRM — focused on results.",
    },
  },
];

export default function FAQMini() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_40%,#eef3ff_76%,#ffffff_100%)] py-24 text-slate-950">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-36 h-[360px] w-[360px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 bottom-12 h-[360px] w-[360px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute right-24 top-24 hidden h-56 w-56 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 lg:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          {/* LEFT SIDE */}
          <div className="lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
              FAQ
            </div>

            <h2 className="mt-7 text-4xl font-black leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-6xl">
              Frequently asked
              <br />
              <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                questions.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Everything you need to know about managing your business,
              clients, CRM, collaborations and AI inside Bizuply.
            </p>

            {/* Premium side card */}
            <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-3 shadow-[0_24px_70px_rgba(79,70,229,0.14)] backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-950 p-7 text-white">
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/35 blur-3xl" />
                <div className="absolute -bottom-24 left-8 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl" />

                <div className="relative">
                  <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-2xl shadow-xl shadow-indigo-950/30">
                    ✦
                  </div>

                  <h3 className="text-2xl font-black tracking-[-0.03em]">
                    Still have questions?
                  </h3>

                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">
                    Start with the FAQ, then explore how Bizuply can fit your
                    workflow.
                  </p>

                  <div className="mt-6 grid gap-3">
                    {["CRM", "Business Page", "Collaborations", "AI Tools"].map(
                      (item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black backdrop-blur"
                        >
                          <span>{item}</span>
                          <span className="text-cyan-300">✓</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ LIST */}
          <div className="rounded-[2.5rem] border border-white/80 bg-white/75 p-3 shadow-[0_28px_90px_rgba(79,70,229,0.14)] backdrop-blur-xl">
            <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white">
              {FAQS.map((item, i) => {
                const isOpen = openIndex === i;

                return (
                  <div
                    key={item.q}
                    className={`border-b border-slate-100 last:border-b-0 ${
                      isOpen
                        ? "bg-gradient-to-br from-white to-indigo-50/70"
                        : "bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left sm:px-8"
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-sm font-black transition ${
                            isOpen
                              ? "bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-100"
                              : "bg-indigo-50 text-indigo-700"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <span className="text-lg font-black leading-7 tracking-[-0.02em] text-slate-950 sm:text-xl">
                          {item.q}
                        </span>
                      </div>

                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-2xl font-black transition ${
                          isOpen
                            ? "rotate-180 bg-slate-950 text-white"
                            : "bg-slate-50 text-indigo-700"
                        }`}
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 pb-7 sm:px-8">
                          <div className="ml-0 rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-sm sm:ml-14">
                            <p className="text-base font-semibold leading-8 text-slate-600">
                              {item.a.lead}
                            </p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                              {item.a.bullets.map((b) => (
                                <div
                                  key={b.title}
                                  className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                                >
                                  <div className="mb-2 flex items-center gap-2">
                                    <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-xs text-white">
                                      ✓
                                    </span>
                                    <strong className="text-sm font-black text-slate-950">
                                      {b.title}
                                    </strong>
                                  </div>

                                  <p className="text-sm font-semibold leading-6 text-slate-500">
                                    {b.text}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {item.a.footer && (
                              <div className="mt-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-[1px]">
                                <p className="rounded-2xl bg-white px-5 py-4 text-sm font-black leading-6 text-slate-800">
                                  {item.a.footer}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-[1px] shadow-[0_24px_80px_rgba(79,70,229,0.24)]">
          <div className="rounded-[2rem] bg-white/10 px-8 py-9 text-center backdrop-blur-xl sm:px-12">
            <h3 className="text-3xl font-black tracking-[-0.03em] text-white">
              Ready to manage your business in one place?
            </h3>

            <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-7 text-indigo-50">
              Start free and build your business workspace with CRM,
              collaborations, appointments and AI.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-black text-indigo-700 shadow-xl shadow-indigo-900/20 transition hover:-translate-y-0.5"
              >
                Start Free
              </a>

              <a
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-4 text-base font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}