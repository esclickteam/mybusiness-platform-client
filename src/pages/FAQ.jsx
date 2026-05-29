import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

const FAQS = [
  {
    q: "What is Bizuply?",
    a: "Bizuply is a smart platform that connects businesses and clients. It combines scheduling, messaging, AI-powered insights, and collaborations — all in one place.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Bizuply offers a 14-day free trial with no credit card required.",
  },
  {
    q: "How do I join as a business?",
    a: "Click “Join as a Business”, complete your profile, and start managing clients, appointments, and collaborations from one dashboard.",
  },
  {
    q: "How do clients use the platform?",
    a: "Clients can sign up for free, search businesses, book appointments, and chat directly — from mobile or desktop.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. Bizuply uses encryption and industry-standard security practices to keep your data protected at all times.",
  },
  {
    q: "Where can I get support?",
    a: "You can contact our support team anytime via the Contact Page for fast and friendly help.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F4EE] text-slate-950">
      <Helmet>
        <title>FAQ - Bizuply | Everything You Need to Know</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about Bizuply – registration, pricing, security, and support."
        />
        <link rel="canonical" href="https://bizuply.com/faq" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Background */}
      <div className="pointer-events-none absolute left-[-12%] top-[-12%] h-[460px] w-[460px] rounded-full bg-amber-200/55 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10%] top-[18%] h-[540px] w-[540px] rounded-full bg-emerald-100/75 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-18%] left-[28%] h-[520px] w-[520px] rounded-full bg-white/85 blur-3xl" />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-5 pb-12 pt-20 text-center sm:px-8 lg:px-10 lg:pt-24">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-sm font-black text-amber-800 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Bizuply Help Center
        </div>

        <h1 className="mx-auto max-w-5xl text-5xl font-black leading-[1.03] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
          Frequently Asked Questions
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-8 text-slate-600 sm:text-xl">
          Everything you need to know about Bizuply — pricing, features,
          security, registration and how to get started.
        </p>
      </section>

      {/* FAQ */}
      <section className="relative mx-auto grid max-w-7xl gap-8 px-5 pb-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        {/* Left card */}
        <aside className="h-fit rounded-[2.5rem] border border-white/80 bg-white/70 p-7 shadow-xl shadow-slate-900/5 backdrop-blur">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-2xl shadow-lg shadow-slate-900/20">
            ✨
          </div>

          <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950">
            Need a quick answer?
          </h2>

          <p className="mt-4 text-base font-medium leading-7 text-slate-600">
            Browse the most common questions about Bizuply. Open any question to
            see a clear explanation.
          </p>

          <div className="mt-7 grid gap-3">
            {[
              ["14-day", "Free trial"],
              ["AI", "Smart tools"],
              ["CRM", "Client management"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white/80 px-5 py-4"
              >
                <div>
                  <p className="text-xl font-black text-slate-950">{title}</p>
                  <p className="text-sm font-bold text-slate-500">{text}</p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">
                  ✓
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* FAQ list */}
        <div className="space-y-4">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <article
                key={item.q}
                className={`overflow-hidden rounded-[1.75rem] border bg-white/75 shadow-lg shadow-slate-900/5 backdrop-blur transition-all duration-300 ${
                  isOpen
                    ? "border-slate-200 ring-1 ring-slate-950/5"
                    : "border-white/80 hover:-translate-y-0.5 hover:bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-5 px-6 py-6 text-left sm:px-7"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-black leading-7 tracking-[-0.02em] text-slate-950 sm:text-xl">
                    {item.q}
                  </span>

                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl font-black transition ${
                      isOpen
                        ? "bg-slate-950 text-white"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isOpen ? "–" : "+"}
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-slate-100 px-6 pb-6 pt-5 sm:px-7">
                      <p className="text-base font-medium leading-8 text-slate-600">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[2.5rem] bg-slate-950 px-6 py-12 text-center shadow-2xl shadow-slate-900/20 sm:px-10">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-300">
            Still have questions?
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
            Start exploring Bizuply and see how it can help your business grow.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-white/70">
            Manage clients, appointments, collaborations and smart business
            growth from one modern platform.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/join"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-base font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-amber-100"
            >
              Join as a Business
              <span className="ml-2">→</span>
            </a>

            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-8 py-4 text-base font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default FAQ;