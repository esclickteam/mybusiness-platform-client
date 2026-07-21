import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { TemplateText } from "../shared/TemplateText";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { kineticDefaultData } from "./defaultData";

export const kineticPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const kineticAllowedPages = kineticPages.map((page) => page.id);

type KineticPagesProps = {
  initialPage?: string;
  initialPageId?: string;
  page?: string;
  pageId?: string;
  activePageId?: string;
  currentPageId?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
};

const motionCss = `
@keyframes kinetic-stripe-slide {
  0% { transform: translateX(0); }
  100% { transform: translateX(-120px); }
}

@keyframes kinetic-pulse-glow {
  0%, 100% { opacity: 0.35; transform: scaleX(1); }
  50% { opacity: 0.8; transform: scaleX(1.04); }
}

@keyframes kinetic-sweep {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(140%); }
}

.kinetic-stripe-field {
  background-image:
    linear-gradient(135deg, transparent 0, transparent 18px, rgba(255,45,45,0.18) 18px, rgba(255,45,45,0.18) 36px, transparent 36px, transparent 54px),
    linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0));
  background-size: 120px 120px, 100% 100%;
  animation: kinetic-stripe-slide 10s linear infinite;
}

.kinetic-sweep {
  animation: kinetic-sweep 3.6s linear infinite;
}

.kinetic-pulse {
  animation: kinetic-pulse-glow 2.6s ease-in-out infinite;
}
`;

const intensityRows = [
  ["כוח", "אימוני כוח מדורגים עם עומסים ברורים."],
  ["מנוע", "בניית סיבולת וקצב עבודה יציב."],
  ["מהירות", "חדות, קצב ותנועה אגרסיבית."],
  ["התאוששות", "ניהול עומס, טכניקה והחזרה ליום הבא."],
];

const sessionRows = [
  ["06:30", "התחלה חזקה", "קבוצה למתאמנים שרוצים פתיחת יום מהירה."],
  ["12:00", "איפוס צהריים", "פורמט קצר עם דגש על איכות וטכניקה."],
  ["19:30", "שעת שיא", "אימון ערב עצים עם מסלול התקדמות קבוע."],
];

const conversionRows = [
  ["01", "אבחון קצר ומיפוי מטרה."],
  ["02", "בחירת מסלול אימון ורמת עומס."],
  ["03", "שיעור ניסיון ומעקב תוצאה."],
];

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (kineticDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getNavLabel(data: Record<string, any>, type: string) {
  if (type === "home") return getValue(data, "navHome");
  if (type === "about") return getValue(data, "navAbout");
  if (type === "services") return getValue(data, "navServices");
  if (type === "work") return getValue(data, "navWork");
  if (type === "contact") return getValue(data, "navContact");
  return getValue(data, "brandName");
}

function KineticSectionTitle({
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
    <div className={cx("max-w-4xl", center ? "mx-auto text-center" : "text-right")}>
      <div
        className={cx(
          "mb-4 inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.36em]",
          light ? "text-[#ff8f8f]" : "text-[#ff2d2d]",
        )}
      >
        <span className="h-px w-10 bg-current" />
        <TemplateText as="span">{eyebrow}</TemplateText>
      </div>
      <TemplateText
        as="h2"
        className={cx(
          "text-4xl font-black uppercase leading-[0.94] tracking-[-0.05em] md:text-6xl",
          light ? "text-white" : "text-[#0b0b0b]",
        )}
      >
        {title}
      </TemplateText>
      {text ? (
        <TemplateText
          as="p"
          className={cx("mt-5 text-lg leading-8", light ? "text-[#d0d0d0]" : "text-[#696969]")}
        >
          {text}
        </TemplateText>
      ) : null}
    </div>
  );
}

function KineticHeader({
  data,
  currentPage,
  goTo,
}: {
  data: Record<string, any>;
  currentPage: string;
  goTo: (pageId: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = kineticPages.map((page) => [page.id, getNavLabel(data, page.id)] as [string, string]);

  function handleNavigate(pageId: string) {
    goTo(pageId);
    setMobileOpen(false);
  }

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0b]/95 backdrop-blur-2xl"
    >
      <div className="h-1 w-full bg-[#ff2d2d]" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => handleNavigate("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-11 w-11 place-items-center border border-[#ff2d2d] bg-[#ff2d2d] text-sm font-black tracking-[0.2em] text-black">
            {getValue(data, "logoText")}
          </span>
          <div className="text-right">
            <TemplateText as="div" className="text-lg font-black uppercase tracking-tight text-white">
              {getValue(data, "brandName")}
            </TemplateText>
            <TemplateText as="div" className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ff8f8f]">
              {getValue(data, "tagline")}
            </TemplateText>
          </div>
        </button>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => handleNavigate(id)}
              className={cx(
                "border-b px-1 py-2 text-sm font-black uppercase tracking-[0.22em] transition",
                currentPage === id
                  ? "border-[#ff2d2d] text-white"
                  : "border-transparent text-[#8f8f8f] hover:text-white",
              )}
            >
              <TemplateText as="span">{label}</TemplateText>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavigate("contact")}
            className="hidden border border-[#ff2d2d] bg-[#ff2d2d] px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-black sm:inline-flex"
          >
            <TemplateText as="span">{getValue(data, "heroPrimaryButton")}</TemplateText>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center border border-white/10 text-white lg:hidden"
          >
            <span>{mobileOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#111111] px-5 py-4 lg:hidden">
          <div className="grid gap-1">
            {nav.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                className={cx(
                  "border px-4 py-3 text-right text-sm font-black uppercase tracking-[0.22em]",
                  currentPage === id
                    ? "border-[#ff2d2d] bg-[#ff2d2d] text-black"
                    : "border-white/10 text-white",
                )}
              >
                <TemplateText as="span">{label}</TemplateText>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function KineticHero({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (pageId: string) => void;
}) {
  const stats = [
    [getValue(data, "statOne"), getValue(data, "statOneLabel")],
    [getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
    [getValue(data, "statThree"), getValue(data, "statThreeLabel")],
    [getValue(data, "statFour"), getValue(data, "statFourLabel")],
  ];

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-black text-white">
      <div className="kinetic-stripe-field absolute inset-0 opacity-80" />
      <div className="absolute inset-x-0 top-0 h-1 bg-[#ff2d2d] kinetic-pulse" />
      <div className="absolute inset-x-0 top-4 h-1 bg-[#ff2d2d]/70 kinetic-pulse" />
      <div className="absolute inset-x-0 top-8 h-1 bg-[#ff2d2d]/45 kinetic-pulse" />
      <div className="absolute inset-y-0 left-0 w-[22%] bg-gradient-to-r from-[#ff2d2d]/12 to-transparent" />
      <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent kinetic-sweep" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-3 border border-[#ff2d2d]/35 bg-black/50 px-4 py-3 text-[11px] font-black uppercase tracking-[0.36em] text-[#ff8f8f]">
            <span className="h-px w-10 bg-[#ff2d2d]" />
            <TemplateText as="span">{getValue(data, "heroEyebrow")}</TemplateText>
          </div>
          <TemplateText as="h1" className="max-w-4xl text-6xl font-black uppercase italic leading-[0.86] tracking-[-0.06em] md:text-[92px]">
            {getValue(data, "heroTitle")}
          </TemplateText>
          <TemplateText as="p" className="mt-8 max-w-2xl text-xl font-black uppercase tracking-[0.14em] text-[#ff2d2d]">
            {getValue(data, "heroSubtitle")}
          </TemplateText>
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => goTo("contact")}
              className="border border-[#ff2d2d] bg-[#ff2d2d] px-7 py-4 text-sm font-black uppercase tracking-[0.22em] text-black"
            >
              <TemplateText as="span">{getValue(data, "heroPrimaryButton")}</TemplateText>
            </button>
            <button
              type="button"
              onClick={() => goTo("services")}
              className="border border-white/20 px-7 py-4 text-sm font-black uppercase tracking-[0.22em] text-white"
            >
              <TemplateText as="span">{getValue(data, "heroSecondaryButton")}</TemplateText>
            </button>
          </div>
        </div>

        <div className="border border-white/10 bg-[#111111] p-3">
          <img src={getValue(data, "heroImage")} alt="" className="h-[520px] w-full object-cover" />
          <div className="mt-3 grid gap-0 border-t border-white/10 md:grid-cols-2">
            {stats.map(([value, label]) => (
              <div key={label} className="border-l border-b border-white/10 px-4 py-4 last:border-l-0 md:last:border-l md:even:border-l-0">
                <TemplateText as="div" className="text-3xl font-black uppercase tracking-[-0.04em] text-[#ff2d2d]">
                  {value}
                </TemplateText>
                <TemplateText as="div" className="mt-2 text-[11px] font-black uppercase tracking-[0.34em] text-[#c8c8c8]">
                  {label}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactGrid() {
  return (
    <section className="border-b border-white/10 bg-[#111111] px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-4">
        {intensityRows.map(([title, text], index) => (
          <article key={title} className={cx("border border-white/10 p-6", index === 0 ? "md:border-l-0" : "")}>
            <TemplateText as="div" className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ff2d2d]">
              Zone 0{index + 1}
            </TemplateText>
            <TemplateText as="h3" className="mt-5 text-2xl font-black uppercase leading-none text-white">
              {title}
            </TemplateText>
            <TemplateText as="p" className="mt-4 text-sm leading-7 text-[#aaaaaa]">
              {text}
            </TemplateText>
          </article>
        ))}
      </div>
    </section>
  );
}

function ManifestoSection({ data }: { data: Record<string, any> }) {
  const statements = [
    "אימונים שבנויים למדידה ולא לניחוש.",
    "שילוב בין טכניקה, עומס וקצב בלי בזבוז זמן.",
    "שפה חזקה שמתורגמת גם לאתר וגם לרצפת הסטודיו.",
  ];

  return (
    <section className="bg-black px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border border-white/10 p-3">
          <img src={getValue(data, "aboutImage")} alt="" className="h-[540px] w-full object-cover" />
        </div>
        <div className="border border-r-0 border-white/10 bg-[#111111] p-8 lg:p-12">
          <KineticSectionTitle
            eyebrow={getValue(data, "aboutEyebrow")}
            title={getValue(data, "aboutTitle")}
            text={getValue(data, "aboutText")}
            light
          />
          <div className="mt-10 border-t border-white/10">
            {statements.map((statement, index) => (
              <div key={statement} className="grid gap-3 border-b border-white/10 py-4 md:grid-cols-[80px_1fr]">
                <TemplateText as="div" className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ff2d2d]">
                  0{index + 1}
                </TemplateText>
                <TemplateText as="p" className="text-base leading-7 text-[#d0d0d0]">
                  {statement}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgramGrid({ data }: { data: Record<string, any> }) {
  const services = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
  ];

  return (
    <section className="border-y border-white/10 bg-[#141414] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <KineticSectionTitle eyebrow={getValue(data, "servicesEyebrow")} title={getValue(data, "servicesTitle")} light center />
        <div className="mt-14 grid gap-0 md:grid-cols-2">
          {services.map(([title, text], index) => (
            <article key={`${title}-${index}`} className="border border-white/10 p-8 lg:p-10">
              <TemplateText as="div" className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ff2d2d]">
                Program 0{index + 1}
              </TemplateText>
              <TemplateText as="h3" className="mt-6 text-3xl font-black uppercase leading-none text-white">
                {title}
              </TemplateText>
              <TemplateText as="p" className="mt-4 max-w-xl text-sm leading-7 text-[#aaaaaa]">
                {text}
              </TemplateText>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultsWall({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "workOneTitle"), getValue(data, "workOneText")],
    [getValue(data, "workTwoTitle"), getValue(data, "workTwoText")],
    [getValue(data, "workThreeTitle"), getValue(data, "workThreeText")],
  ];

  return (
    <section className="bg-black px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <KineticSectionTitle eyebrow={getValue(data, "workEyebrow")} title={getValue(data, "workTitle")} light center />
        <div className="mt-14 grid gap-0 lg:grid-cols-3">
          {items.map(([title, text], index) => (
            <article key={`${title}-${index}`} className="border border-white/10 bg-[#111111] p-8">
              <div className="mb-6 h-2 w-16 bg-[#ff2d2d]" />
              <TemplateText as="div" className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ff8f8f]">
                Result 0{index + 1}
              </TemplateText>
              <TemplateText as="h3" className="mt-5 text-3xl font-black uppercase leading-none text-white">
                {title}
              </TemplateText>
              <TemplateText as="p" className="mt-4 text-sm leading-7 text-[#aaaaaa]">
                {text}
              </TemplateText>
              <div className="mt-8 border-t border-white/10 pt-4">
                <TemplateText as="div" className="text-sm font-black uppercase tracking-[0.28em] text-[#ff2d2d]">
                  High intensity / measurable progress
                </TemplateText>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessTrack({ data }: { data: Record<string, any> }) {
  const steps = [
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    [getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];

  return (
    <section className="border-y border-white/10 bg-[#141414] px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <KineticSectionTitle eyebrow={getValue(data, "processEyebrow")} title={getValue(data, "processTitle")} light />
        <div className="mt-12 border border-white/10">
          {steps.map(([title, text], index) => (
            <div key={`${title}-${index}`} className="grid gap-4 border-b border-white/10 px-6 py-6 md:grid-cols-[90px_240px_1fr]">
              <TemplateText as="div" className="text-lg font-black uppercase tracking-[0.2em] text-[#ff2d2d]">
                0{index + 1}
              </TemplateText>
              <TemplateText as="div" className="text-xl font-black uppercase text-white">
                {title}
              </TemplateText>
              <TemplateText as="p" className="text-sm leading-7 text-[#aaaaaa]">
                {text}
              </TemplateText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScheduleBoard() {
  return (
    <section className="bg-black px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <KineticSectionTitle
          eyebrow="מערכת שעות"
          title="עמודים בנויים להנעה מהירה לפעולה."
          text="הטמפלט מחזיק מסלולי אימון, לוח שיעורים, קירות תוצאה ודפי יצירת קשר בלי לאבד את שפת המותג."
          light
        />
        <div className="mt-12 border border-white/10">
          {sessionRows.map(([time, title, text]) => (
            <div key={time} className="grid gap-4 border-b border-white/10 px-6 py-5 md:grid-cols-[120px_240px_1fr]">
              <TemplateText as="div" className="text-lg font-black uppercase tracking-[0.2em] text-[#ff2d2d]">
                {time}
              </TemplateText>
              <TemplateText as="div" className="text-base font-black uppercase text-white">
                {title}
              </TemplateText>
              <TemplateText as="p" className="text-sm leading-7 text-[#aaaaaa]">
                {text}
              </TemplateText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactIntake({ data }: { data: Record<string, any> }) {
  const info = [
    ["טלפון", getValue(data, "phone")],
    ["אימייל", getValue(data, "email")],
    ["כתובת", getValue(data, "address")],
  ];

  return (
    <section className="border-t border-white/10 bg-[#141414] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="border border-white/10 bg-black p-8 lg:p-12">
          <KineticSectionTitle
            eyebrow={getValue(data, "contactEyebrow")}
            title={getValue(data, "contactTitle")}
            text={getValue(data, "contactText")}
            light
          />
          <div className="mt-10 border-t border-white/10">
            {info.map(([label, value]) => (
              <div key={label} className="grid gap-2 border-b border-white/10 py-4 md:grid-cols-[120px_1fr]">
                <TemplateText as="div" className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ff2d2d]">
                  {label}
                </TemplateText>
                <TemplateText as="div" className="text-sm leading-7 text-white">
                  {value}
                </TemplateText>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-white/10 pt-6">
            {conversionRows.map(([num, text]) => (
              <div key={num} className="grid gap-2 border-b border-white/10 py-3 md:grid-cols-[70px_1fr]">
                <TemplateText as="div" className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ff8f8f]">
                  {num}
                </TemplateText>
                <TemplateText as="div" className="text-sm leading-7 text-[#d0d0d0]">
                  {text}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>
        <form className="border border-r-0 border-white/10 bg-[#111111] p-8 lg:p-12">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="border border-white/12 bg-black px-4 py-4 text-right text-white outline-none" placeholder="שם מלא" />
            <input className="border border-white/12 bg-black px-4 py-4 text-right text-white outline-none" placeholder="טלפון" />
            <input className="border border-white/12 bg-black px-4 py-4 text-right text-white outline-none md:col-span-2" placeholder="אימייל" />
            <textarea className="min-h-40 border border-white/12 bg-black px-4 py-4 text-right text-white outline-none md:col-span-2" placeholder="מה המטרה שלכם: כוח, ירידה באחוזי שומן, חזרה למסלול או בניית שגרה?" />
          </div>
          <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 md:grid-cols-[1fr_auto] md:items-center">
            <TemplateText as="p" className="text-sm leading-7 text-[#aaaaaa]">
              דף יצירת קשר נבנה כמו מסך המרה קשוח: מעט הסחות, הרבה בהירות, והזמנה ברורה לשיעור ניסיון.
            </TemplateText>
            <button type="button" className="border border-[#ff2d2d] bg-[#ff2d2d] px-6 py-4 text-sm font-black uppercase tracking-[0.22em] text-black">
              <TemplateText as="span">{getValue(data, "contactButton")}</TemplateText>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function PageHero({
  title,
  eyebrow,
  text,
  image,
}: {
  title: string;
  eyebrow: string;
  text: string;
  image: string;
}) {
  return (
    <section className="border-b border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center px-5 py-16 lg:px-8 lg:py-24">
          <KineticSectionTitle eyebrow={eyebrow} title={title} text={text} light />
        </div>
        <div className="border-r border-white/10 p-3">
          <img src={image} alt="" className="h-[320px] w-full object-cover lg:h-[420px]" />
        </div>
      </div>
    </section>
  );
}

function KineticFooter({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (pageId: string) => void;
}) {
  return (
    <footer className="border-t border-white/10 bg-black px-5 py-10 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          <TemplateText as="div" className="text-xl font-black uppercase tracking-tight text-white">
            {getValue(data, "brandName")}
          </TemplateText>
          <TemplateText as="p" className="mt-3 max-w-2xl text-sm leading-7 text-[#aaaaaa]">
            {getValue(data, "footerText")}
          </TemplateText>
        </div>
        <div className="grid gap-1 sm:grid-cols-5">
          {kineticPages.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => goTo(page.id)}
              className="border border-white/10 px-4 py-3 text-[11px] font-black uppercase tracking-[0.34em] text-white transition hover:border-[#ff2d2d] hover:text-[#ff2d2d]"
            >
              <TemplateText as="span">{getNavLabel(data, page.id)}</TemplateText>
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-6">
        <TemplateText as="p" className="text-sm text-[#8f8f8f]">
          © {new Date().getFullYear()} {getValue(data, "brandName")} · Kinetic Template
        </TemplateText>
      </div>
    </footer>
  );
}

function HomePage({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (pageId: string) => void;
}) {
  return (
    <>
      <KineticHero data={data} goTo={goTo} />
      <ImpactGrid />
      <ProgramGrid data={data} />
      <ManifestoSection data={data} />
      <ProcessTrack data={data} />
      <ResultsWall data={data} />
      <ScheduleBoard />
      <ContactIntake data={data} />
    </>
  );
}

function AboutPage({ data }: { data: Record<string, any> }) {
  return (
    <>
      <PageHero
        title={getNavLabel(data, "about")}
        eyebrow={getValue(data, "aboutEyebrow")}
        text={getValue(data, "aboutText")}
        image={getValue(data, "aboutImage")}
      />
      <ManifestoSection data={data} />
      <ImpactGrid />
      <ProcessTrack data={data} />
      <ContactIntake data={data} />
    </>
  );
}

function ServicesPage({ data }: { data: Record<string, any> }) {
  return (
    <>
      <PageHero
        title={getNavLabel(data, "services")}
        eyebrow={getValue(data, "servicesEyebrow")}
        text="עמוד שירותים שבנוי כמו לוח אימון: מסלולים ברורים, עצימות, שגרה ותנועה ישירה לעבר ההרשמה."
        image={getValue(data, "heroImage")}
      />
      <ProgramGrid data={data} />
      <ProcessTrack data={data} />
      <ScheduleBoard />
      <ContactIntake data={data} />
    </>
  );
}

function WorkPage({ data }: { data: Record<string, any> }) {
  return (
    <>
      <PageHero
        title={getNavLabel(data, "work")}
        eyebrow={getValue(data, "workEyebrow")}
        text="הצלחות, מסלולי התקדמות ושפה תחרותית שממחישה איך העבודה נראית מבפנים ולא רק איך היא משווקת."
        image={getValue(data, "heroImage")}
      />
      <ResultsWall data={data} />
      <ImpactGrid />
      <ContactIntake data={data} />
    </>
  );
}

function ContactPage({ data }: { data: Record<string, any> }) {
  return (
    <>
      <PageHero
        title={getNavLabel(data, "contact")}
        eyebrow={getValue(data, "contactEyebrow")}
        text={getValue(data, "contactText")}
        image={getValue(data, "aboutImage")}
      />
      <ScheduleBoard />
      <ContactIntake data={data} />
    </>
  );
}

export default function KineticPages({
  initialPage = "home",
  initialPageId,
  page,
  pageId,
  activePageId,
  currentPageId,
  mode = "preview",
  data,
  onPageChange,
  isPublic,
  viewMode,
  runtimeMode,
}: KineticPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...kineticDefaultData,
      ...(data ?? {}),
    }),
    [data],
  );

  const { currentPage, goTo } = useTemplatePageNavigation(
    {
      page,
      pageId,
      initialPage,
      initialPageId,
      activePageId,
      currentPageId,
      onPageChange,
      isPublic,
      viewMode,
      runtimeMode,
    },
    { allowedPages: kineticAllowedPages, fallbackPage: "home" },
  );

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "kinetic-preview" : "kinetic"}
      className="min-h-screen w-full overflow-x-hidden bg-black text-white"
      style={{ fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif' }}
    >
      <style>{motionCss}</style>
      <KineticHeader data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} goTo={goTo} /> },
          { id: "about", content: <AboutPage data={mergedData} /> },
          { id: "services", content: <ServicesPage data={mergedData} /> },
          { id: "work", content: <WorkPage data={mergedData} /> },
          { id: "contact", content: <ContactPage data={mergedData} /> },
        ]}
      />
      <KineticFooter data={mergedData} goTo={goTo} />
    </div>
  );
}
