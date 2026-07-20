import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { TemplateDecor, TemplateText } from "../shared/TemplateText";
import { fortivaDefaultData } from "./defaultData";

export const fortivaPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "המשרד", slug: "/about" },
  { id: "services", label: "תחומי עיסוק", slug: "/services" },
  { id: "cases", label: "הצלחות", slug: "/cases" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

type FortivaPagesProps = {
  initialPage?: string;
  page?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (fortivaDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getPageTitle(data: Record<string, any>, type: string) {
  if (type === "about") return getValue(data, "navAbout");
  if (type === "services") return getValue(data, "navServices");
  if (type === "cases") return getValue(data, "navCases");
  if (type === "contact") return getValue(data, "navContact");
  return getValue(data, "brandName");
}

function SectionTitle({
  eyebrow,
  title,
  text,
  center = false,
  light = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={cx("mx-auto max-w-3xl", center ? "text-center" : "text-right")}>
      <TemplateText
        as="p"
        className={cx(
          "mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em]",
          light ? "text-[#c6a664]" : "text-[#b8935a]",
        )}
      >
        <span className="h-px w-8 bg-current" />
        {eyebrow}
      </TemplateText>
      <TemplateText
        as="h2"
        className={cx(
          "font-serif text-4xl font-semibold leading-[1.12] md:text-5xl",
          light ? "text-[#f6f5f1]" : "text-[#0f1e3d]",
        )}
      >
        {title}
      </TemplateText>
      {text ? (
        <TemplateText
          as="p"
          className={cx("mt-5 text-lg leading-8", light ? "text-[#c9d2e3]" : "text-[#4a5568]")}
        >
          {text}
        </TemplateText>
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
    ["cases", getValue(data, "navCases")],
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
      className="sticky top-0 z-50 border-b border-[#0f1e3d]/8 bg-[#f6f5f1]/90 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate("home")}
          className="group flex items-center gap-3 text-right"
        >
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#0f1e3d] font-serif text-lg font-semibold text-[#c6a664] transition duration-300 group-hover:scale-105">
            {getValue(data, "logoText")}
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight text-[#0f1e3d]">
            {getValue(data, "brandName")}
          </span>
        </button>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => handleNavigate(id)}
              className={cx(
                "relative py-1 text-sm font-semibold transition duration-300",
                currentPage === id
                  ? "text-[#0f1e3d]"
                  : "text-[#5a6478] hover:text-[#0f1e3d]",
              )}
            >
              {label}
              {currentPage === id ? (
                <span className="absolute -bottom-1 right-0 h-0.5 w-full bg-[#b8935a]" />
              ) : null}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openBooking}
            className="hidden rounded-lg bg-[#0f1e3d] px-5 py-3 text-sm font-semibold text-[#f6f5f1] shadow-lg shadow-[#0f1e3d]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#13294b] sm:inline-flex"
          >
            {getValue(data, "heroPrimaryButton")}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-lg border border-[#0f1e3d]/12 bg-white text-[#0f1e3d] lg:hidden"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#0f1e3d]/8 bg-[#f6f5f1] px-5 pb-5 lg:hidden">
          <div className="grid gap-2 rounded-2xl border border-[#0f1e3d]/8 bg-white p-2">
            {nav.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                className={cx(
                  "rounded-xl px-4 py-3 text-right text-sm font-semibold transition",
                  currentPage === id ? "bg-[#0f1e3d] text-[#f6f5f1]" : "text-[#5a6478] hover:bg-[#f6f5f1]",
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
              className="rounded-xl bg-[#0f1e3d] px-4 py-3 text-sm font-semibold text-[#f6f5f1]"
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
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#0f1e3d]/70 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#c6a664]/25 bg-[#f6f5f1] p-8 shadow-2xl shadow-black/40">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full bg-[#0f1e3d]/8 text-xl font-semibold text-[#0f1e3d] transition hover:scale-105"
        >
          ×
        </button>
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#b8935a]">
          <span className="h-px w-8 bg-current" />
          {getValue(data, "contactEyebrow")}
        </p>
        <TemplateText as="h3" className="mt-5 font-serif text-3xl font-semibold text-[#0f1e3d]">
          {getValue(data, "contactTitle")}
        </TemplateText>
        <p className="mt-3 text-sm leading-6 text-[#4a5568]">{getValue(data, "contactText")}</p>
        <form className="mt-7 grid gap-4">
          <input
            className="rounded-lg border border-[#0f1e3d]/12 bg-white px-5 py-4 text-right outline-none transition focus:border-[#b8935a]"
            placeholder={getValue(data, "formNamePlaceholder")}
          />
          <input
            className="rounded-lg border border-[#0f1e3d]/12 bg-white px-5 py-4 text-right outline-none transition focus:border-[#b8935a]"
            placeholder={getValue(data, "formPhonePlaceholder")}
          />
          <select className="rounded-lg border border-[#0f1e3d]/12 bg-white px-5 py-4 text-right outline-none transition focus:border-[#b8935a]">
            <option>תחום הפנייה</option>
            <option>דיני חברות ומסחר</option>
            <option>נדל״ן ומקרקעין</option>
            <option>מיסוי ופיננסים</option>
            <option>ליטיגציה ויישוב סכסוכים</option>
          </select>
          <textarea
            className="min-h-24 rounded-lg border border-[#0f1e3d]/12 bg-white px-5 py-4 text-right outline-none transition focus:border-[#b8935a]"
            placeholder={getValue(data, "formMessagePlaceholder")}
          />
          <button
            type="button"
            className="rounded-lg bg-[#0f1e3d] px-7 py-4 text-base font-semibold text-[#f6f5f1] shadow-lg shadow-[#0f1e3d]/15 transition hover:-translate-y-0.5 hover:bg-[#13294b]"
          >
            {getValue(data, "contactButton")}
          </button>
        </form>
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
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-[#b8935a]">
            <span className="h-px w-10 bg-current" />
            {getValue(data, "heroEyebrow")}
          </p>
          <TemplateText
            as="h1"
            className="max-w-3xl font-serif text-5xl font-semibold leading-[1.05] text-[#0f1e3d] md:text-6xl lg:text-7xl"
          >
            {getValue(data, "heroTitle")}
          </TemplateText>
          <TemplateText as="p" className="mt-7 max-w-xl text-lg leading-8 text-[#4a5568]">
            {getValue(data, "heroSubtitle")}
          </TemplateText>
          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openBooking}
              className="rounded-lg bg-[#0f1e3d] px-7 py-4 text-base font-semibold text-[#f6f5f1] shadow-xl shadow-[#0f1e3d]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#13294b]"
            >
              {getValue(data, "heroPrimaryButton")}
            </button>
            <button
              type="button"
              onClick={() => goTo("services")}
              className="rounded-lg border border-[#0f1e3d]/15 bg-white px-7 py-4 text-base font-semibold text-[#0f1e3d] transition duration-300 hover:-translate-y-0.5 hover:border-[#b8935a]"
            >
              {getValue(data, "heroSecondaryButton")}
            </button>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-[#0f1e3d]/10 pt-8">
            {stats.map(([num, label]) => (
              <div key={label}>
                <TemplateText as="div" className="font-serif text-4xl font-semibold text-[#0f1e3d]">
                  {num}
                </TemplateText>
                <TemplateText as="div" className="mt-1 text-xs font-semibold text-[#7a8395]">
                  {label}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-4 -top-4 h-full w-full rounded-2xl border-2 border-[#b8935a]/30" />
          <div className="group relative overflow-hidden rounded-2xl shadow-2xl shadow-[#0f1e3d]/25">
            <img
              src={getValue(data, "heroImage")}
              alt=""
              className="h-[560px] w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f1e3d]/40 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ValuesSection({ data }: { data: Record<string, any> }) {
  const values = [
    [getValue(data, "valuesOneTitle"), getValue(data, "valuesOneText")],
    [getValue(data, "valuesTwoTitle"), getValue(data, "valuesTwoText")],
    [getValue(data, "valuesThreeTitle"), getValue(data, "valuesThreeText")],
  ];

  return (
    <section className="px-5 pb-4 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {values.map(([title, text], index) => (
          <div
            key={title}
            className="group rounded-2xl border border-[#0f1e3d]/8 bg-white p-7 shadow-lg shadow-[#0f1e3d]/5 transition duration-500 hover:-translate-y-2 hover:shadow-xl"
          >
            <span className="font-serif text-3xl font-semibold text-[#b8935a]">0{index + 1}</span>
            <h3 className="mt-4 font-serif text-xl font-semibold text-[#0f1e3d]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#4a5568]">{text}</p>
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
          <div className="group relative overflow-hidden rounded-2xl shadow-2xl shadow-[#0f1e3d]/20">
            <img
              src={getValue(data, "aboutImage")}
              alt=""
              className="h-[520px] w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-6 right-6 rounded-2xl bg-[#0f1e3d] px-7 py-5 text-[#f6f5f1] shadow-2xl">
            <div className="font-serif text-3xl font-semibold text-[#c6a664]">25+</div>
            <div className="mt-1 text-xs font-semibold text-[#c9d2e3]">שנות מצוינות</div>
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
              "צוות רב-תחומי של עורכי דין ויועצים",
              "ליווי אישי מהפגישה הראשונה ועד לתוצאה",
              "ניסיון מוכח מול הרשויות ובתי המשפט",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-[#334155]">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#b8935a]/15 text-[#b8935a]">✓</span>
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
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
  ];

  return (
    <section className="bg-[#0f1e3d] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          light
          eyebrow={getValue(data, "servicesEyebrow")}
          title={getValue(data, "servicesTitle")}
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {services.map(([title, text], index) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/5 p-8 transition duration-500 hover:-translate-y-2 hover:border-[#c6a664]/40 hover:bg-white/8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-serif text-5xl font-semibold text-[#c6a664]/50 transition duration-500 group-hover:text-[#c6a664]">
                  0{index + 1}
                </span>
                <span className="mt-2 grid h-10 w-10 place-items-center rounded-full border border-[#c6a664]/30 text-[#c6a664] transition duration-500 group-hover:bg-[#c6a664] group-hover:text-[#0f1e3d]">
                  ↗
                </span>
              </div>
              <h3 className="mt-5 font-serif text-2xl font-semibold text-[#f6f5f1]">{title}</h3>
              <p className="mt-3 text-base leading-7 text-[#c9d2e3]">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={openBooking}
            className="rounded-lg bg-[#c6a664] px-8 py-4 text-base font-semibold text-[#0f1e3d] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d4b878]"
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
            <div key={title} className="relative rounded-2xl border border-[#0f1e3d]/8 bg-white p-8 shadow-lg shadow-[#0f1e3d]/5">
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#0f1e3d] font-serif text-xl font-semibold text-[#c6a664]">
                {index + 1}
              </div>
              <h3 className="font-serif text-2xl font-semibold text-[#0f1e3d]">{title}</h3>
              <p className="mt-3 text-base leading-7 text-[#4a5568]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CasesSection({ data }: { data: Record<string, any> }) {
  const cases = [
    [getValue(data, "caseOneTitle"), getValue(data, "caseOneText"), getValue(data, "caseOneTag")],
    [getValue(data, "caseTwoTitle"), getValue(data, "caseTwoText"), getValue(data, "caseTwoTag")],
    [getValue(data, "caseThreeTitle"), getValue(data, "caseThreeText"), getValue(data, "caseThreeTag")],
  ];

  return (
    <section className="bg-[#eeece4] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle center eyebrow={getValue(data, "casesEyebrow")} title={getValue(data, "casesTitle")} />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {cases.map(([title, text, tag], index) => (
            <article
              key={title + index}
              className="group flex flex-col rounded-2xl border border-[#0f1e3d]/8 bg-white p-8 shadow-lg shadow-[#0f1e3d]/5 transition duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              <span className="inline-flex w-fit rounded-full bg-[#b8935a]/12 px-3 py-1 text-xs font-bold text-[#b8935a]">
                {tag}
              </span>
              <h3 className="mt-5 font-serif text-2xl font-semibold text-[#0f1e3d]">{title}</h3>
              <p className="mt-3 flex-1 text-base leading-7 text-[#4a5568]">{text}</p>
              <div className="mt-6 border-t border-[#0f1e3d]/8 pt-4 text-sm font-semibold text-[#b8935a]">
                קרא עוד ←
              </div>
            </article>
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
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle center eyebrow={getValue(data, "teamEyebrow")} title={getValue(data, "teamTitle")} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {team.map(([name, role, image]) => (
            <article key={name} className="group overflow-hidden rounded-2xl border border-[#0f1e3d]/8 bg-white shadow-lg shadow-[#0f1e3d]/5">
              <div className="relative h-80 overflow-hidden">
                <img src={image} alt={name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1e3d]/50 via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold text-[#0f1e3d]">{name}</h3>
                <p className="mt-1 text-sm font-medium text-[#b8935a]">{role}</p>
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
    [getValue(data, "labelPhone"), getValue(data, "phone")],
    [getValue(data, "labelEmail"), getValue(data, "email")],
    [getValue(data, "labelAddress"), getValue(data, "address")],
    [getValue(data, "labelHours"), getValue(data, "hours")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-[#0f1e3d]/8 bg-[#0f1e3d] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="p-8 lg:p-12">
          <SectionTitle
            light
            eyebrow={getValue(data, "contactEyebrow")}
            title={getValue(data, "contactTitle")}
            text={getValue(data, "contactText")}
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {info.map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-white/8 bg-white/5 px-4 py-4">
                <TemplateText
                  as="div"
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ac]"
                >
                  {label}
                </TemplateText>
                <TemplateText as="div" className="mt-1 text-base font-semibold text-[#f6f5f1]">
                  {value}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>
        <form className="m-4 rounded-2xl bg-[#f6f5f1] p-6 lg:m-6 lg:p-8">
          <div className="grid gap-4">
            <input
              className="rounded-lg border border-[#0f1e3d]/12 bg-white px-5 py-4 text-right outline-none transition focus:border-[#b8935a]"
              placeholder={getValue(data, "formNamePlaceholder")}
            />
            <input
              className="rounded-lg border border-[#0f1e3d]/12 bg-white px-5 py-4 text-right outline-none transition focus:border-[#b8935a]"
              placeholder={getValue(data, "formPhonePlaceholder")}
            />
            <input
              className="rounded-lg border border-[#0f1e3d]/12 bg-white px-5 py-4 text-right outline-none transition focus:border-[#b8935a]"
              placeholder={getValue(data, "formEmailPlaceholder")}
            />
            <textarea
              className="min-h-32 rounded-lg border border-[#0f1e3d]/12 bg-white px-5 py-4 text-right outline-none transition focus:border-[#b8935a]"
              placeholder={getValue(data, "formMessagePlaceholder")}
            />
            <button
              type="button"
              onClick={openBooking}
              className="rounded-lg bg-[#0f1e3d] px-7 py-4 text-base font-semibold text-[#f6f5f1] shadow-lg shadow-[#0f1e3d]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#13294b]"
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
      <div className="mx-auto max-w-7xl rounded-3xl border border-[#0f1e3d]/8 bg-white p-8 shadow-lg shadow-[#0f1e3d]/5 lg:p-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#b8935a]">
              <span className="h-px w-8 bg-current" />
              Fortiva
            </p>
            <h2 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.1] text-[#0f1e3d] md:text-5xl">
              {getValue(data, "ctaTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4a5568]">
              {getValue(data, "ctaText")}
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <button
              type="button"
              onClick={openBooking}
              className="rounded-lg bg-[#0f1e3d] px-8 py-4 text-base font-semibold text-[#f6f5f1] transition duration-300 hover:-translate-y-0.5 hover:bg-[#13294b]"
            >
              {getValue(data, "ctaButton")}
            </button>
            <button
              type="button"
              onClick={() => goTo("services")}
              className="rounded-lg border border-[#0f1e3d]/15 px-8 py-4 text-base font-semibold text-[#0f1e3d] transition duration-300 hover:border-[#b8935a]"
            >
              {getValue(data, "navServices")}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#0f1e3d]/10 pt-8 text-sm text-[#7a8395] md:flex-row">
        <p>
          © {new Date().getFullYear()} {getValue(data, "brandName")}
        </p>
        <p>תבנית Fortiva · Bizuply Studio</p>
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
      <ValuesSection data={data} />
      <AboutSection data={data} />
      <ServicesSection data={data} openBooking={openBooking} />
      <ProcessSection data={data} />
      <CasesSection data={data} />
      <TeamSection data={data} />
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
        <ValuesSection data={data} />
        <TeamSection data={data} />
      </>
    ),
    services: (
      <>
        <ServicesSection data={data} openBooking={openBooking} />
        <ProcessSection data={data} />
      </>
    ),
    cases: <CasesSection data={data} />,
    contact: <ContactSection data={data} openBooking={openBooking} />,
  };

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#0f1e3d] px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#c6a664]">
            <span className="h-px w-8 bg-current" />
            {getValue(data, "brandName")}
            <span className="h-px w-8 bg-current" />
          </p>
          <h1 className="mx-auto max-w-4xl font-serif text-5xl font-semibold leading-[1.08] text-[#f6f5f1] md:text-6xl">
            {getPageTitle(data, type)}
          </h1>
        </div>
      </section>

      {pageMap[type] ?? null}

      <CtaFooter data={data} goTo={goTo} openBooking={openBooking} />
    </>
  );
}

export default function FortivaPages({
  initialPage = "home",
  page,
  mode = "preview",
  data,
}: FortivaPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...fortivaDefaultData,
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
      data-template-id={mode === "preview" ? "fortiva-preview" : "fortiva"}
      className="min-h-screen w-full overflow-x-hidden bg-[#f6f5f1] text-[#0f1e3d]"
      style={{ fontFamily: '"Frank Ruhl Libre", "Playfair Display", Georgia, serif' }}
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
          ...fortivaPages
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
