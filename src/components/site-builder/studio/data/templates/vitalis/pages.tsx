import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { vitalisDefaultData } from "./defaultData";

export const vitalisPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות המרפאה", slug: "/about" },
  { id: "services", label: "טיפולים", slug: "/services" },
  { id: "team", label: "הצוות הרפואי", slug: "/team" },
  { id: "contact", label: "קביעת תור", slug: "/contact" },
];

type VitalisPagesProps = {
  initialPage?: string;
  page?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (vitalisDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getPageTitle(data: Record<string, any>, type: string) {
  if (type === "about") return getValue(data, "navAbout");
  if (type === "services") return getValue(data, "navServices");
  if (type === "team") return getValue(data, "navTeam");
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
      <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0891b2]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0891b2]">
        {eyebrow}
      </p>
      <h2 className="text-4xl font-bold leading-[1.12] tracking-tight text-[#0f2a36] md:text-5xl">
        {title}
      </h2>
      {text ? (
        <p className="mt-5 text-lg leading-8 text-[#51707c]">{text}</p>
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
    ["about", getValue(data, "navAbout")],
    ["services", getValue(data, "navServices")],
    ["team", getValue(data, "navTeam")],
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
      className="sticky top-0 z-50 border-b border-[#0891b2]/8 bg-white/90 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate("home")}
          className="group flex items-center gap-3 text-right"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#0ea5a4] to-[#0891b2] text-lg font-bold text-white shadow-lg shadow-[#0891b2]/25 transition duration-300 group-hover:scale-105">
            {getValue(data, "logoText")}
          </span>
          <span className="text-xl font-bold tracking-tight text-[#0f2a36]">
            {getValue(data, "brandName")}
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full bg-[#eef8f9] p-1 lg:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => handleNavigate(id)}
              className={cx(
                "rounded-full px-4 py-2 text-sm font-semibold transition duration-300",
                currentPage === id
                  ? "bg-white text-[#0891b2] shadow-sm"
                  : "text-[#51707c] hover:text-[#0f2a36]",
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
            className="hidden rounded-full bg-gradient-to-r from-[#0ea5a4] to-[#0891b2] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0891b2]/25 transition duration-300 hover:-translate-y-0.5 sm:inline-flex"
          >
            {getValue(data, "heroPrimaryButton")}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#0891b2]/15 bg-white text-[#0891b2] lg:hidden"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#0891b2]/8 bg-white px-5 pb-5 lg:hidden">
          <div className="grid gap-2 rounded-2xl bg-[#eef8f9] p-2">
            {nav.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                className={cx(
                  "rounded-xl px-4 py-3 text-right text-sm font-semibold transition",
                  currentPage === id ? "bg-white text-[#0891b2] shadow-sm" : "text-[#51707c]",
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
              className="rounded-xl bg-gradient-to-r from-[#0ea5a4] to-[#0891b2] px-4 py-3 text-sm font-semibold text-white"
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
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#0f2a36]/60 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-[#0891b2]/15 bg-white p-8 shadow-2xl shadow-[#0f2a36]/25">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#0ea5a4]/12 blur-3xl" />
        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full bg-[#eef8f9] text-xl font-semibold text-[#0891b2] transition hover:scale-105"
        >
          ×
        </button>
        <div className="relative z-10">
          <p className="inline-flex rounded-full bg-[#0891b2]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0891b2]">
            קביעת תור
          </p>
          <h3 className="mt-5 text-3xl font-bold text-[#0f2a36]">נשמח לקבל אתכם.</h3>
          <p className="mt-3 text-sm leading-6 text-[#51707c]">{getValue(data, "contactText")}</p>
          <form className="mt-7 grid gap-4">
            <input
              className="rounded-2xl border border-[#0891b2]/15 bg-[#f7fcfc] px-5 py-4 text-right outline-none transition focus:border-[#0891b2]"
              placeholder="שם מלא"
            />
            <input
              className="rounded-2xl border border-[#0891b2]/15 bg-[#f7fcfc] px-5 py-4 text-right outline-none transition focus:border-[#0891b2]"
              placeholder="טלפון"
            />
            <select className="rounded-2xl border border-[#0891b2]/15 bg-[#f7fcfc] px-5 py-4 text-right outline-none transition focus:border-[#0891b2]">
              <option>סוג הטיפול</option>
              <option>בדיקה כללית</option>
              <option>יישור שיניים</option>
              <option>השתלות</option>
              <option>אסתטיקה והלבנה</option>
              <option>טיפול חירום</option>
            </select>
            <button
              type="button"
              className="rounded-full bg-gradient-to-r from-[#0ea5a4] to-[#0891b2] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-[#0891b2]/25 transition hover:-translate-y-0.5"
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
    <section className="relative isolate overflow-hidden px-5 pb-20 pt-14 lg:px-8 lg:pb-28 lg:pt-20">
      <div className="absolute left-[6%] top-16 -z-10 h-72 w-72 rounded-full bg-[#0ea5a4]/12 blur-3xl" />
      <div className="absolute right-[8%] top-[44%] -z-10 h-80 w-80 rounded-full bg-[#0284c7]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#0891b2]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#0891b2]">
            {getValue(data, "heroEyebrow")}
          </p>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-[#0f2a36] md:text-6xl lg:text-7xl">
            {getValue(data, "heroTitle")}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#51707c]">
            {getValue(data, "heroSubtitle")}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openBooking}
              className="rounded-full bg-gradient-to-r from-[#0ea5a4] to-[#0891b2] px-7 py-4 text-base font-semibold text-white shadow-xl shadow-[#0891b2]/25 transition duration-300 hover:-translate-y-0.5"
            >
              {getValue(data, "heroPrimaryButton")}
            </button>
            <button
              type="button"
              onClick={() => goTo("services")}
              className="rounded-full border border-[#0891b2]/20 bg-white px-7 py-4 text-base font-semibold text-[#0f2a36] transition duration-300 hover:-translate-y-0.5 hover:border-[#0891b2]"
            >
              {getValue(data, "heroSecondaryButton")}
            </button>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {stats.map(([num, label]) => (
              <div
                key={label}
                className="rounded-3xl border border-[#0891b2]/8 bg-white p-4 text-center shadow-lg shadow-[#0f2a36]/5 transition duration-500 hover:-translate-y-2"
              >
                <div className="text-3xl font-bold text-[#0891b2]">{num}</div>
                <div className="mt-1 text-xs font-semibold text-[#7c95a0]">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="group relative overflow-hidden rounded-[40px] shadow-2xl shadow-[#0f2a36]/20">
            <img
              src={getValue(data, "heroImage")}
              alt=""
              className="h-[560px] w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-6 right-6 max-w-[260px] rounded-[26px] border border-[#0891b2]/10 bg-white/95 p-5 shadow-2xl shadow-[#0f2a36]/15 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0ea5a4]/12 text-[#0891b2]">✚</span>
              <p className="text-base font-bold text-[#0f2a36]">{getValue(data, "heroCardTitle")}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#51707c]">{getValue(data, "heroCardText")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip({ data }: { data: Record<string, any> }) {
  const items = [
    getValue(data, "trustOne"),
    getValue(data, "trustTwo"),
    getValue(data, "trustThree"),
    getValue(data, "trustFour"),
  ];
  return (
    <section className="px-5 pb-4 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 rounded-[28px] border border-[#0891b2]/8 bg-white p-6 shadow-lg shadow-[#0f2a36]/5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0ea5a4]/12 text-[#0891b2]">✓</span>
            <span className="text-sm font-semibold text-[#0f2a36]">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutSection({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative">
          <div className="group relative overflow-hidden rounded-[40px] shadow-2xl shadow-[#0f2a36]/15">
            <img
              src={getValue(data, "aboutImage")}
              alt=""
              className="h-[520px] w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-6 right-6 rounded-[24px] bg-gradient-to-br from-[#0ea5a4] to-[#0891b2] px-7 py-5 text-white shadow-2xl">
            <div className="text-3xl font-bold">20K+</div>
            <div className="mt-1 text-xs font-semibold text-white/80">מטופלים מרוצים</div>
          </div>
        </div>
        <div>
          <SectionTitle
            eyebrow={getValue(data, "aboutEyebrow")}
            title={getValue(data, "aboutTitle")}
            text={getValue(data, "aboutText")}
          />
          <div className="mt-8 grid gap-3">
            {[
              "סביבה נקייה, מודרנית ורגועה",
              "הסבר מלא לכל שלב בטיפול",
              "צוות שמקשיב ומלווה באמת",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-[#334155]">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0ea5a4]/12 text-[#0891b2]">✓</span>
                <span className="text-base font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
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
    ["🦷", getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    ["😁", getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    ["⚙", getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    ["✨", getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
    ["🧸", getValue(data, "serviceFiveTitle"), getValue(data, "serviceFiveText")],
    ["🚑", getValue(data, "serviceSixTitle"), getValue(data, "serviceSixText")],
  ];

  return (
    <section className="bg-[#eef8f9] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle center eyebrow={getValue(data, "servicesEyebrow")} title={getValue(data, "servicesTitle")} />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map(([icon, title, text]) => (
            <article
              key={title}
              className="group rounded-[28px] border border-[#0891b2]/8 bg-white p-7 shadow-lg shadow-[#0f2a36]/5 transition duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#0ea5a4]/12 text-2xl">
                {icon}
              </span>
              <h3 className="mt-6 text-xl font-bold text-[#0f2a36]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#51707c]">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={openBooking}
            className="rounded-full bg-gradient-to-r from-[#0ea5a4] to-[#0891b2] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#0891b2]/25 transition duration-300 hover:-translate-y-0.5"
          >
            {getValue(data, "heroPrimaryButton")}
          </button>
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
        <SectionTitle center eyebrow={getValue(data, "processEyebrow")} title={getValue(data, "processTitle")} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map(([title, text], index) => (
            <div key={title} className="relative rounded-[28px] border border-[#0891b2]/8 bg-white p-8 shadow-lg shadow-[#0f2a36]/5">
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#0ea5a4] to-[#0891b2] text-xl font-bold text-white">
                {index + 1}
              </div>
              <h3 className="text-2xl font-bold text-[#0f2a36]">{title}</h3>
              <p className="mt-3 text-base leading-7 text-[#51707c]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection({ data }: { data: Record<string, any> }) {
  const team = [
    [getValue(data, "teamOneName"), getValue(data, "teamOneRole"), getValue(data, "teamOneImage")],
    [getValue(data, "teamTwoName"), getValue(data, "teamTwoRole"), getValue(data, "teamTwoImage")],
    [getValue(data, "teamThreeName"), getValue(data, "teamThreeRole"), getValue(data, "teamThreeImage")],
  ];

  return (
    <section className="bg-[#eef8f9] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle center eyebrow={getValue(data, "teamEyebrow")} title={getValue(data, "teamTitle")} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {team.map(([name, role, image]) => (
            <article key={name} className="group overflow-hidden rounded-[28px] border border-[#0891b2]/8 bg-white shadow-lg shadow-[#0f2a36]/5">
              <div className="relative h-80 overflow-hidden">
                <img src={image} alt={name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-[#0f2a36]">{name}</h3>
                <p className="mt-1 text-sm font-medium text-[#0891b2]">{role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewsSection({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle center eyebrow={getValue(data, "reviewsEyebrow")} title={getValue(data, "reviewsTitle")} />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {reviews.map(([text, name], index) => (
            <article
              key={name + index}
              className="group rounded-[28px] border border-[#0891b2]/8 bg-white p-8 shadow-lg shadow-[#0f2a36]/5 transition duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-5 text-[#0891b2]">★★★★★</div>
              <p className="text-base leading-8 text-[#334155]">“{text}”</p>
              <div className="mt-7 flex items-center gap-3 border-t border-[#0891b2]/8 pt-5">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#0ea5a4] to-[#0891b2] text-sm font-bold text-white">
                  {String(name).charAt(0)}
                </span>
                <p className="text-sm font-bold text-[#0f2a36]">{name}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ data }: { data: Record<string, any> }) {
  const [open, setOpen] = useState(0);
  const faqs = [
    [getValue(data, "faqOneQuestion"), getValue(data, "faqOneAnswer")],
    [getValue(data, "faqTwoQuestion"), getValue(data, "faqTwoAnswer")],
    [getValue(data, "faqThreeQuestion"), getValue(data, "faqThreeAnswer")],
  ];

  return (
    <section className="bg-[#eef8f9] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionTitle eyebrow={getValue(data, "faqEyebrow")} title={getValue(data, "faqTitle")} />
        <div className="space-y-4">
          {faqs.map(([question, answer], index) => {
            const isOpen = open === index;
            return (
              <div key={question} className="overflow-hidden rounded-[24px] border border-[#0891b2]/8 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-6 p-6 text-right"
                >
                  <span className="text-lg font-bold text-[#0f2a36]">{question}</span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#0ea5a4] to-[#0891b2] text-lg text-white">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={cx(
                    "grid transition-all duration-500 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-base leading-7 text-[#51707c]">{answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
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
    ["שעות", getValue(data, "hours")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[40px] bg-gradient-to-br from-[#0ea5a4] to-[#0891b2] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="p-8 text-white lg:p-12">
          <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white">
            {getValue(data, "contactEyebrow")}
          </p>
          <h2 className="text-4xl font-bold leading-[1.12] md:text-5xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-5 text-lg leading-8 text-white/85">{getValue(data, "contactText")}</p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {info.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">{label}</div>
                <div className="mt-1 text-base font-semibold text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
        <form className="m-4 rounded-[30px] bg-white p-6 lg:m-6 lg:p-8">
          <div className="grid gap-4">
            <input
              className="rounded-2xl border border-[#0891b2]/15 bg-[#f7fcfc] px-5 py-4 text-right outline-none transition focus:border-[#0891b2]"
              placeholder="שם מלא"
            />
            <input
              className="rounded-2xl border border-[#0891b2]/15 bg-[#f7fcfc] px-5 py-4 text-right outline-none transition focus:border-[#0891b2]"
              placeholder="טלפון"
            />
            <input
              className="rounded-2xl border border-[#0891b2]/15 bg-[#f7fcfc] px-5 py-4 text-right outline-none transition focus:border-[#0891b2]"
              placeholder="אימייל"
            />
            <textarea
              className="min-h-32 rounded-2xl border border-[#0891b2]/15 bg-[#f7fcfc] px-5 py-4 text-right outline-none transition focus:border-[#0891b2]"
              placeholder="במה נוכל לעזור?"
            />
            <button
              type="button"
              onClick={openBooking}
              className="rounded-full bg-gradient-to-r from-[#0ea5a4] to-[#0891b2] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-[#0891b2]/25 transition duration-300 hover:-translate-y-0.5"
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
      <div className="mx-auto max-w-7xl rounded-[40px] border border-[#0891b2]/8 bg-white p-8 shadow-lg shadow-[#0f2a36]/5 lg:p-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h2 className="max-w-3xl text-4xl font-bold leading-[1.1] text-[#0f2a36] md:text-5xl">
              {getValue(data, "ctaTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#51707c]">
              {getValue(data, "ctaText")}
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <button
              type="button"
              onClick={openBooking}
              className="rounded-full bg-gradient-to-r from-[#0ea5a4] to-[#0891b2] px-8 py-4 text-base font-semibold text-white transition duration-300 hover:-translate-y-0.5"
            >
              {getValue(data, "ctaButton")}
            </button>
            <button
              type="button"
              onClick={() => goTo("services")}
              className="rounded-full border border-[#0891b2]/20 px-8 py-4 text-base font-semibold text-[#0f2a36] transition duration-300 hover:border-[#0891b2]"
            >
              {getValue(data, "navServices")}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#0891b2]/10 pt-8 text-sm text-[#7c95a0] md:flex-row">
        <p>
          © {new Date().getFullYear()} {getValue(data, "brandName")}
        </p>
        <p>תבנית Vitalis · Bizuply Studio</p>
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
      <TrustStrip data={data} />
      <AboutSection data={data} />
      <ServicesSection data={data} openBooking={openBooking} />
      <ProcessSection data={data} />
      <TeamSection data={data} />
      <ReviewsSection data={data} />
      <FaqSection data={data} />
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
    about: (
      <>
        <AboutSection data={data} />
        <TrustStrip data={data} />
        <ReviewsSection data={data} />
      </>
    ),
    services: (
      <>
        <ServicesSection data={data} openBooking={openBooking} />
        <ProcessSection data={data} />
        <FaqSection data={data} />
      </>
    ),
    team: <TeamSection data={data} />,
    contact: <ContactSection data={data} openBooking={openBooking} />,
  };

  return (
    <>
      <section className="relative isolate overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
        <div className="absolute left-1/2 top-6 -z-10 h-56 w-[560px] -translate-x-1/2 rounded-full bg-[#0ea5a4]/12 blur-3xl" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-flex rounded-full bg-[#0891b2]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#0891b2]">
            {getValue(data, "brandName")}
          </p>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[1.06] tracking-tight text-[#0f2a36] md:text-6xl">
            {getPageTitle(data, type)}
          </h1>
        </div>
      </section>

      {pageMap[type] ?? null}

      <CtaFooter data={data} goTo={goTo} openBooking={openBooking} />
    </>
  );
}

export default function VitalisPages({
  initialPage = "home",
  page,
  mode = "preview",
  data,
}: VitalisPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...vitalisDefaultData,
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
      data-template-id={mode === "preview" ? "vitalis-preview" : "vitalis"}
      className="min-h-screen w-full overflow-x-hidden bg-[linear-gradient(180deg,#f7fcfc_0%,#ffffff_40%)] font-sans text-[#0f2a36]"
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
          ...vitalisPages
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
