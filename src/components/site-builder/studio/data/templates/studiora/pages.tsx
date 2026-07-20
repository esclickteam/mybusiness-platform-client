import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { studioraDefaultData } from "./defaultData";

export const studioraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "work", label: "עבודות", slug: "/work" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "בואו נדבר", slug: "/contact" },
];

type StudioraPagesProps = {
  initialPage?: string;
  page?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (studioraDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getPageTitle(data: Record<string, any>, type: string) {
  if (type === "work") return getValue(data, "navWork");
  if (type === "services") return getValue(data, "navServices");
  if (type === "about") return getValue(data, "navAbout");
  if (type === "contact") return getValue(data, "navContact");
  return getValue(data, "brandName");
}

function SectionTitle({
  eyebrow,
  title,
  text,
  center = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={cx("mx-auto max-w-3xl", center ? "text-center" : "text-right")}>
      <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-[#c3ff00]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#c3ff00]" />
        {eyebrow}
      </p>
      <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-6xl">
        {title}
      </h2>
      {text ? (
        <p className="mt-5 text-lg leading-8 text-white/55">{text}</p>
      ) : null}
    </div>
  );
}

function Header({
  data,
  currentPage,
  setCurrentPage,
  openBooking,
}: {
  data: Record<string, any>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  openBooking: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = [
    ["home", getValue(data, "navHome")],
    ["work", getValue(data, "navWork")],
    ["services", getValue(data, "navServices")],
    ["about", getValue(data, "navAbout")],
    ["contact", getValue(data, "navContact")],
  ];

  function handleNavigate(id: string) {
    setCurrentPage(id);
    setMobileOpen(false);
  }

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b border-white/8 bg-[#0a0a0a]/85 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate("home")}
          className="group flex items-center gap-3 text-right"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#c3ff00] text-lg font-black text-[#0a0a0a] transition duration-300 group-hover:rotate-12">
            {getValue(data, "logoText")}
          </span>
          <span className="text-xl font-black uppercase tracking-tight text-white">
            {getValue(data, "brandName")}
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => handleNavigate(id)}
              className={cx(
                "rounded-full px-4 py-2 text-sm font-bold transition duration-300",
                currentPage === id
                  ? "bg-white text-[#0a0a0a]"
                  : "text-white/60 hover:text-white",
              )}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openBooking}
            className="hidden rounded-full bg-[#c3ff00] px-5 py-3 text-sm font-bold text-[#0a0a0a] transition duration-300 hover:-translate-y-0.5 hover:bg-white sm:inline-flex"
          >
            {getValue(data, "heroPrimaryButton")}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white lg:hidden"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/8 bg-[#0a0a0a]/97 px-5 pb-5 lg:hidden">
          <div className="grid gap-2 rounded-[24px] border border-white/8 bg-white/5 p-2">
            {nav.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                className={cx(
                  "rounded-2xl px-4 py-3 text-right text-sm font-bold transition",
                  currentPage === id ? "bg-[#c3ff00] text-[#0a0a0a]" : "text-white/70 hover:bg-white/5",
                )}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openBooking();
              }}
              className="rounded-2xl bg-[#c3ff00] px-4 py-3 text-sm font-bold text-[#0a0a0a]"
            >
              {getValue(data, "heroPrimaryButton")}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function BookingModal({
  data,
  open,
  onClose,
}: {
  data: Record<string, any>;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/80 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#c3ff00]/15 blur-3xl" />
        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/5 text-xl font-semibold text-white transition hover:scale-105"
        >
          ×
        </button>
        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#c3ff00]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c3ff00]" />
            בריף פרויקט
          </p>
          <h3 className="mt-5 text-3xl font-black uppercase text-white">בואו נבנה משהו גדול.</h3>
          <p className="mt-3 text-sm leading-6 text-white/55">{getValue(data, "contactText")}</p>
          <form className="mt-7 grid gap-4">
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none transition placeholder:text-white/40 focus:border-[#c3ff00]"
              placeholder="שם / חברה"
            />
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none transition placeholder:text-white/40 focus:border-[#c3ff00]"
              placeholder="אימייל"
            />
            <select className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none transition focus:border-[#c3ff00]">
              <option>סוג הפרויקט</option>
              <option>מיתוג וזהות</option>
              <option>עיצוב UI/UX</option>
              <option>בניית אתר</option>
              <option>קמפיין / מושן</option>
            </select>
            <textarea
              className="min-h-24 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none transition placeholder:text-white/40 focus:border-[#c3ff00]"
              placeholder="ספרו לנו על הרעיון"
            />
            <button
              type="button"
              className="rounded-full bg-[#c3ff00] px-7 py-4 text-base font-bold text-[#0a0a0a] transition hover:-translate-y-0.5 hover:bg-white"
            >
              {getValue(data, "contactButton")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Hero({
  data,
  goTo,
  openBooking,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openBooking: () => void;
}) {
  const stats = [
    [getValue(data, "heroStatOne"), getValue(data, "heroStatOneLabel")],
    [getValue(data, "heroStatTwo"), getValue(data, "heroStatTwoLabel")],
    [getValue(data, "heroStatThree"), getValue(data, "heroStatThreeLabel")],
  ];

  return (
    <section className="relative isolate overflow-hidden px-5 pb-16 pt-14 lg:px-8 lg:pb-20 lg:pt-20">
      <div className="absolute right-[8%] top-16 -z-10 h-80 w-80 rounded-full bg-[#c3ff00]/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        <p className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-[#c3ff00]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c3ff00]" />
          {getValue(data, "heroEyebrow")}
        </p>
        <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.9] tracking-tight text-white md:text-8xl lg:text-[8.5rem]">
          {getValue(data, "heroTitle")}
        </h1>

        <div className="mt-10 grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <p className="max-w-2xl text-lg leading-8 text-white/55 md:text-xl">
            {getValue(data, "heroSubtitle")}
          </p>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <button
              type="button"
              onClick={openBooking}
              className="rounded-full bg-[#c3ff00] px-7 py-4 text-base font-bold text-[#0a0a0a] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              {getValue(data, "heroPrimaryButton")}
            </button>
            <button
              type="button"
              onClick={() => goTo("work")}
              className="rounded-full border border-white/15 px-7 py-4 text-base font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/5"
            >
              {getValue(data, "heroSecondaryButton")}
            </button>
          </div>
        </div>

        <div className="mt-14 overflow-hidden rounded-[32px] border border-white/8">
          <img
            src={getValue(data, "heroImage")}
            alt=""
            className="h-[420px] w-full object-cover md:h-[560px]"
          />
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/8 pt-8">
          {stats.map(([num, label]) => (
            <div key={label}>
              <div className="text-4xl font-black text-white md:text-5xl">{num}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-widest text-white/45">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Marquee({ data }: { data: Record<string, any> }) {
  const text = getValue(data, "marqueeText");
  return (
    <section className="border-y border-white/8 bg-[#c3ff00] py-5">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 text-center text-lg font-black uppercase tracking-tight text-[#0a0a0a]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="flex items-center gap-6">
            {text}
            <span className="text-2xl">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

function ServicesSection({
  data,
  openBooking,
}: {
  data: Record<string, any>;
  openBooking: () => void;
}) {
  const services = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow={getValue(data, "servicesEyebrow")} title={getValue(data, "servicesTitle")} />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-white/8 bg-white/8 md:grid-cols-2">
          {services.map(([title, text], index) => (
            <article
              key={title}
              className="group relative bg-[#0a0a0a] p-8 transition duration-500 hover:bg-[#111111] lg:p-10"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-black text-[#c3ff00]">0{index + 1}</span>
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition duration-500 group-hover:bg-[#c3ff00] group-hover:text-[#0a0a0a]">
                  ↗
                </span>
              </div>
              <h3 className="mt-6 text-3xl font-black uppercase text-white">{title}</h3>
              <p className="mt-4 max-w-md text-base leading-7 text-white/55">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={openBooking}
            className="rounded-full bg-white px-8 py-4 text-base font-bold text-[#0a0a0a] transition duration-300 hover:-translate-y-0.5 hover:bg-[#c3ff00]"
          >
            {getValue(data, "heroPrimaryButton")}
          </button>
        </div>
      </div>
    </section>
  );
}

function WorkSection({ data }: { data: Record<string, any> }) {
  const works = [
    { title: getValue(data, "workOneTitle"), tag: getValue(data, "workOneTag"), image: getValue(data, "workOneImage"), big: true },
    { title: getValue(data, "workTwoTitle"), tag: getValue(data, "workTwoTag"), image: getValue(data, "workTwoImage"), big: false },
    { title: getValue(data, "workThreeTitle"), tag: getValue(data, "workThreeTag"), image: getValue(data, "workThreeImage"), big: false },
    { title: getValue(data, "workFourTitle"), tag: getValue(data, "workFourTag"), image: getValue(data, "workFourImage"), big: true },
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow={getValue(data, "workEyebrow")} title={getValue(data, "workTitle")} />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {works.map((work, index) => (
            <article
              key={work.title + index}
              className={cx(
                "group relative overflow-hidden rounded-[28px] border border-white/8",
                work.big ? "md:col-span-2" : "",
              )}
            >
              <img
                src={work.image}
                alt={work.title}
                className={cx(
                  "w-full object-cover transition duration-700 group-hover:scale-105",
                  work.big ? "h-[360px] md:h-[480px]" : "h-[360px]",
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7">
                <div>
                  <span className="inline-flex rounded-full bg-[#c3ff00] px-3 py-1 text-xs font-black uppercase text-[#0a0a0a]">
                    {work.tag}
                  </span>
                  <h3 className="mt-3 text-3xl font-black uppercase text-white">{work.title}</h3>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-[#0a0a0a] transition duration-500 group-hover:rotate-45">
                  ↗
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ data }: { data: Record<string, any> }) {
  const steps = [
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow={getValue(data, "processEyebrow")} title={getValue(data, "processTitle")} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map(([title, text], index) => (
            <div
              key={title}
              className="group rounded-[28px] border border-white/8 bg-white/5 p-8 transition duration-500 hover:-translate-y-2 hover:border-[#c3ff00]/40"
            >
              <span className="text-6xl font-black text-white/15 transition duration-500 group-hover:text-[#c3ff00]">
                0{index + 1}
              </span>
              <h3 className="mt-5 text-2xl font-black uppercase text-white">{title}</h3>
              <p className="mt-3 text-base leading-7 text-white/55">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection({ data }: { data: Record<string, any> }) {
  const stats = [
    [getValue(data, "statNumberOne"), getValue(data, "statLabelOne")],
    [getValue(data, "statNumberTwo"), getValue(data, "statLabelTwo")],
    [getValue(data, "statNumberThree"), getValue(data, "statLabelThree")],
    [getValue(data, "statNumberFour"), getValue(data, "statLabelFour")],
  ];

  return (
    <section className="px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-[28px] border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([num, label]) => (
          <div key={label} className="bg-[#0a0a0a] p-8 text-center">
            <div className="text-5xl font-black text-[#c3ff00]">{num}</div>
            <div className="mt-2 text-xs font-bold uppercase tracking-widest text-white/45">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutSection({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionTitle
            eyebrow={getValue(data, "aboutEyebrow")}
            title={getValue(data, "aboutTitle")}
            text={getValue(data, "aboutText")}
          />
        </div>
        <div className="group relative overflow-hidden rounded-[28px] border border-white/8">
          <img
            src={getValue(data, "aboutImage")}
            alt=""
            className="h-[460px] w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}

function ReviewsSection({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName"), getValue(data, "reviewOneRole")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName"), getValue(data, "reviewTwoRole")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName"), getValue(data, "reviewThreeRole")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow={getValue(data, "reviewsEyebrow")} title={getValue(data, "reviewsTitle")} />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {reviews.map(([text, name, role], index) => (
            <article
              key={name + index}
              className="group rounded-[28px] border border-white/8 bg-white/5 p-8 transition duration-500 hover:-translate-y-2 hover:border-[#c3ff00]/40"
            >
              <div className="mb-5 text-[#c3ff00]">★★★★★</div>
              <p className="text-lg leading-8 text-white/80">“{text}”</p>
              <div className="mt-7 flex items-center gap-3 border-t border-white/8 pt-5">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#c3ff00] text-sm font-black text-[#0a0a0a]">
                  {String(name).charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-black text-white">{name}</p>
                  <p className="text-xs text-white/45">{role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({
  data,
  openBooking,
}: {
  data: Record<string, any>;
  openBooking: () => void;
}) {
  const info = [
    ["טלפון", getValue(data, "phone")],
    ["אימייל", getValue(data, "email")],
    ["כתובת", getValue(data, "address")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[36px] border border-white/8 bg-white/5 lg:grid-cols-[1fr_1fr]">
        <div className="p-8 lg:p-12">
          <SectionTitle
            eyebrow={getValue(data, "contactEyebrow")}
            title={getValue(data, "contactTitle")}
            text={getValue(data, "contactText")}
          />
          <div className="mt-10 grid gap-3">
            {info.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-[#0a0a0a] px-4 py-4">
                <div className="text-xs font-bold uppercase tracking-widest text-white/40">{label}</div>
                <div className="mt-1 text-base font-bold text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
        <form className="m-4 rounded-[28px] border border-white/8 bg-[#0a0a0a] p-6 lg:m-6 lg:p-8">
          <div className="grid gap-4">
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none transition placeholder:text-white/40 focus:border-[#c3ff00]"
              placeholder="שם / חברה"
            />
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none transition placeholder:text-white/40 focus:border-[#c3ff00]"
              placeholder="אימייל"
            />
            <input
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none transition placeholder:text-white/40 focus:border-[#c3ff00]"
              placeholder="תקציב משוער"
            />
            <textarea
              className="min-h-32 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right text-white outline-none transition placeholder:text-white/40 focus:border-[#c3ff00]"
              placeholder="ספרו לנו על הפרויקט"
            />
            <button
              type="button"
              onClick={openBooking}
              className="rounded-full bg-[#c3ff00] px-7 py-4 text-base font-bold text-[#0a0a0a] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              {getValue(data, "contactButton")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function CtaFooter({
  data,
  goTo,
  openBooking,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openBooking: () => void;
}) {
  return (
    <footer className="px-5 pb-10 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[36px] bg-[#c3ff00] p-8 text-[#0a0a0a] lg:p-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h2 className="max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
              {getValue(data, "ctaTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-[#0a0a0a]/70">
              {getValue(data, "ctaText")}
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <button
              type="button"
              onClick={openBooking}
              className="rounded-full bg-[#0a0a0a] px-8 py-4 text-base font-bold text-white transition duration-300 hover:-translate-y-0.5"
            >
              {getValue(data, "ctaButton")}
            </button>
            <button
              type="button"
              onClick={() => goTo("work")}
              className="rounded-full border-2 border-[#0a0a0a] px-8 py-4 text-base font-bold text-[#0a0a0a] transition duration-300 hover:bg-[#0a0a0a] hover:text-white"
            >
              {getValue(data, "navWork")}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 text-sm text-white/45 md:flex-row">
        <p>
          © {new Date().getFullYear()} {getValue(data, "brandName")}
        </p>
        <p>תבנית Studiora · Bizuply Studio</p>
      </div>
    </footer>
  );
}

function HomePage({
  data,
  goTo,
  openBooking,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openBooking: () => void;
}) {
  return (
    <>
      <Hero data={data} goTo={goTo} openBooking={openBooking} />
      <Marquee data={data} />
      <ServicesSection data={data} openBooking={openBooking} />
      <WorkSection data={data} />
      <StatsSection data={data} />
      <ProcessSection data={data} />
      <AboutSection data={data} />
      <ReviewsSection data={data} />
      <ContactSection data={data} openBooking={openBooking} />
      <CtaFooter data={data} goTo={goTo} openBooking={openBooking} />
    </>
  );
}

function SimplePage({
  data,
  type,
  goTo,
  openBooking,
}: {
  data: Record<string, any>;
  type: string;
  goTo: (page: string) => void;
  openBooking: () => void;
}) {
  const pageMap: Record<string, React.ReactNode> = {
    work: (
      <>
        <WorkSection data={data} />
        <StatsSection data={data} />
        <ReviewsSection data={data} />
      </>
    ),
    services: (
      <>
        <ServicesSection data={data} openBooking={openBooking} />
        <ProcessSection data={data} />
      </>
    ),
    about: (
      <>
        <AboutSection data={data} />
        <StatsSection data={data} />
        <ReviewsSection data={data} />
      </>
    ),
    contact: <ContactSection data={data} openBooking={openBooking} />,
  };

  return (
    <>
      <section className="relative isolate overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
        <div className="absolute right-[10%] top-6 -z-10 h-56 w-72 rounded-full bg-[#c3ff00]/10 blur-[120px]" />
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-[#c3ff00]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c3ff00]" />
            {getValue(data, "brandName")}
          </p>
          <h1 className="max-w-4xl text-6xl font-black uppercase leading-[0.9] tracking-tight text-white md:text-8xl">
            {getPageTitle(data, type)}
          </h1>
        </div>
      </section>

      {pageMap[type] ?? null}

      <CtaFooter data={data} goTo={goTo} openBooking={openBooking} />
    </>
  );
}

export default function StudioraPages({
  initialPage = "home",
  page,
  mode = "preview",
  data,
}: StudioraPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...studioraDefaultData,
      ...(data ?? {}),
    }),
    [data],
  );

  const [currentPage, setCurrentPage] = useState(page || initialPage || "home");
  const [bookingOpen, setBookingOpen] = useState(false);

  function goTo(nextPage: string) {
    setCurrentPage(nextPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "studiora-preview" : "studiora"}
      className="min-h-screen w-full overflow-x-hidden bg-[#0a0a0a] font-sans text-white"
    >
      <Header
        data={mergedData}
        currentPage={currentPage}
        setCurrentPage={goTo}
        openBooking={() => setBookingOpen(true)}
      />

      <VisualPageStack
        activePageId={currentPage}
        pages={[
          {
            id: "home",
            content: (
              <HomePage
                data={mergedData}
                goTo={goTo}
                openBooking={() => setBookingOpen(true)}
              />
            ),
          },
          ...studioraPages
            .filter((item) => item.id !== "home")
            .map((item) => ({
              id: item.id,
              content: (
                <SimplePage
                  data={mergedData}
                  type={item.id}
                  goTo={goTo}
                  openBooking={() => setBookingOpen(true)}
                />
              ),
            })),
        ]}
      />

      <BookingModal
        data={mergedData}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
