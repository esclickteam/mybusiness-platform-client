import React from "react";
import { Helmet } from "react-helmet-async";

export default function Accessibility() {
  const sectionBase =
    "rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-8";

  const h2Base =
    "mb-4 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl";

  const pBase = "text-base font-medium leading-8 text-slate-600";

  const ulBase =
    "mt-5 space-y-3 text-base font-medium leading-8 text-slate-600";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F4EE] text-slate-950">
      <Helmet>
        <title>Accessibility Statement - Bizuply</title>
        <meta
          name="description"
          content="Read Bizuply's Accessibility Statement and learn about our commitment to digital accessibility, WCAG standards, and support options."
        />
        <link rel="canonical" href="https://bizuply.com/accessibility" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Background */}
      <div className="pointer-events-none absolute left-[-12%] top-[-10%] h-[520px] w-[520px] rounded-full bg-amber-200/55 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12%] top-[16%] h-[560px] w-[560px] rounded-full bg-emerald-100/75 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-18%] left-[24%] h-[560px] w-[560px] rounded-full bg-white/85 blur-3xl" />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-5 pb-10 pt-20 text-center sm:px-8 lg:px-10 lg:pt-24">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-sm font-black text-amber-800 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Accessibility Center
        </div>

        <h1 className="mx-auto max-w-5xl text-5xl font-black leading-[1.03] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
          Accessibility Statement
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600 sm:text-xl">
          Bizuply is committed to creating an inclusive, accessible and
          user-friendly digital experience for everyone.
        </p>

        <div className="mx-auto mt-8 inline-flex rounded-2xl border border-white/80 bg-white/70 px-5 py-3 text-sm font-black text-slate-700 shadow-sm backdrop-blur">
          Last Updated: September 29, 2025
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-5 pb-24 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:px-10">
        {/* Sidebar */}
        <aside className="h-fit rounded-[2.5rem] border border-white/80 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur lg:sticky lg:top-24">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-2xl shadow-lg shadow-slate-900/20">
            ♿
          </div>

          <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
            Our Accessibility Promise
          </h2>

          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
            We continuously work to improve accessibility across Bizuply and
            support users who need assistance.
          </p>

          <div className="mt-6 grid gap-3">
            {[
              ["WCAG", "2.1 Level AA"],
              ["ADA", "Accessibility aligned"],
              ["Support", "Help available"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white/75 px-5 py-4"
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

          <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white">
            <p className="text-sm font-black text-amber-300">
              Need assistance?
            </p>
            <a
              href="mailto:support@bizuply.com"
              className="mt-2 block break-all text-sm font-bold text-white/80 transition hover:text-white"
            >
              support@bizuply.com
            </a>
          </div>
        </aside>

        {/* Content */}
        <div className="space-y-6">
          <section className={sectionBase}>
            <h2 className={h2Base}>Our Commitment</h2>

            <p className={pBase}>
              Bizuply is committed to ensuring digital accessibility for people
              with disabilities. We are constantly working to improve the user
              experience for everyone and to apply the relevant accessibility
              standards in line with the Americans with Disabilities Act (ADA).
            </p>

            <p className={`${pBase} mt-4`}>
              We aim to follow the Web Content Accessibility Guidelines (WCAG)
              2.1 Level AA to provide an inclusive and user-friendly digital
              experience for all visitors.
            </p>
          </section>

          <section className={sectionBase}>
            <h2 className={h2Base}>Accessibility Features</h2>

            <p className={pBase}>
              Bizuply is designed with accessibility principles in mind,
              including clear structure, readable content and support for common
              assistive technologies.
            </p>

            <ul className={ulBase}>
              {[
                "Keyboard navigation support.",
                "Readable text with adjustable contrast and sizing.",
                "Alternative text for images and icons.",
                "Consistent structure and clear labels for forms and buttons.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={sectionBase}>
            <h2 className={h2Base}>Limitations</h2>

            <p className={pBase}>
              While we strive to make all content fully accessible, some
              third-party integrations or media may not yet meet full ADA/WCAG
              requirements. We are actively working on solutions and
              improvements.
            </p>
          </section>

          <section className={sectionBase}>
            <h2 className={h2Base}>Feedback & Contact</h2>

            <p className={pBase}>
              If you encounter any barriers while using Bizuply or need
              assistance, please contact us. We welcome feedback and use it to
              improve the platform.
            </p>

            <div className="mt-6 rounded-3xl border border-slate-100 bg-white/80 p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">
                Email
              </p>

              <a
                href="mailto:support@bizuply.com"
                className="mt-2 block break-all text-lg font-black text-slate-950 transition hover:text-amber-700"
              >
                support@bizuply.com
              </a>
            </div>
          </section>

          <section className={sectionBase}>
            <h2 className={h2Base}>Last Updated</h2>

            <p className={pBase}>
              This statement was last updated on{" "}
              <time dateTime="2025-09-29" className="font-black text-slate-950">
                September 29, 2025
              </time>
              .
            </p>

            <div className="mt-6 rounded-3xl bg-slate-950 px-6 py-5 text-white">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
                Accessibility Statement
              </p>
              <p className="mt-2 text-xl font-black">Bizuply</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}