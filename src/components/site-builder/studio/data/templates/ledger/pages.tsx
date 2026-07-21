import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { TemplateText } from "../shared/TemplateText";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { ledgerDefaultData } from "./defaultData";

export const ledgerPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const ledgerAllowedPages = ledgerPages.map((page) => page.id);

type LedgerPagesProps = {
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

const auditRows = [
  ["תחזית", "תכנון תזרים ותרחישים"],
  ["דיווח", "דוחות הנהלה וליווי תקציבי"],
  ["בקרה", "בקרות, מעקב וסטנדרטיזציה"],
  ["ייעוץ", "קבלת החלטות עם הקשר עסקי"],
];

const governanceRows = [
  ["קצב דירקטוריון", "פגישות סדורות, חומרים אחידים ותקציב פתוח."],
  ["מעקב סיכונים", "זיהוי חריגות, תרחישים והשפעה ישירה על המזומן."],
  ["שכבת החלטות", "מתרגמים נתונים לשאלות הנהלה, לא רק לאקסל."],
];

const registerRows = [
  ["Q1", "מיפוי KPI, תקציב, בקרה"],
  ["Q2", "ייעול תמחור, רכש, גבייה"],
  ["Q3", "דיווח הנהלה, דשבורדים, תחזיות"],
  ["Q4", "אופטימיזציה, צמיחה, היערכות"],
];

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (ledgerDefaultData as Record<string, any>)[key] ?? "";
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

function LedgerSectionTitle({
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
          "mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.34em]",
          light ? "text-[#d8e8e2]" : "text-[#0d5c45]",
        )}
      >
        <span className="h-px w-10 bg-current" />
        <TemplateText as="span">{eyebrow}</TemplateText>
      </div>
      <TemplateText
        as="h2"
        className={cx(
          "text-4xl font-semibold leading-[1.06] tracking-[-0.04em] md:text-6xl",
          light ? "text-[#f6f3ea]" : "text-[#102018]",
        )}
      >
        {title}
      </TemplateText>
      {text ? (
        <TemplateText
          as="p"
          className={cx(
            "mt-5 text-lg leading-8",
            light ? "text-[#d9e4de]" : "text-[#5a6b62]",
          )}
        >
          {text}
        </TemplateText>
      ) : null}
    </div>
  );
}

function LedgerHeader({
  data,
  currentPage,
  goTo,
}: {
  data: Record<string, any>;
  currentPage: string;
  goTo: (pageId: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = ledgerPages.map((page) => [page.id, getNavLabel(data, page.id)] as [string, string]);

  function handleNavigate(pageId: string) {
    goTo(pageId);
    setMobileOpen(false);
  }

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b border-[#102018]/10 bg-[#fffdf8]/95 backdrop-blur-2xl"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-4 px-5 py-4 lg:grid-cols-[auto_1fr_auto] lg:px-8">
        <button type="button" onClick={() => handleNavigate("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-11 w-11 place-items-center border border-[#102018]/12 bg-[#0d5c45] text-sm font-semibold tracking-[0.2em] text-[#f6f3ea]">
            {getValue(data, "logoText")}
          </span>
          <div className="text-right">
            <TemplateText as="div" className="text-lg font-semibold tracking-tight text-[#102018]">
              {getValue(data, "brandName")}
            </TemplateText>
            <TemplateText as="div" className="text-[11px] uppercase tracking-[0.32em] text-[#5a6b62]">
              {getValue(data, "tagline")}
            </TemplateText>
          </div>
        </button>

        <nav className="hidden grid-cols-5 border border-[#102018]/10 lg:grid">
          {nav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => handleNavigate(id)}
              className={cx(
                "border-l border-[#102018]/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition last:border-l-0",
                currentPage === id
                  ? "bg-[#0d5c45] text-[#f6f3ea]"
                  : "text-[#5a6b62] hover:bg-[#f3eee3] hover:text-[#102018]",
              )}
            >
              <TemplateText as="span">{label}</TemplateText>
            </button>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleNavigate("contact")}
            className="hidden border border-[#0d5c45] bg-[#0d5c45] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6f3ea] transition hover:bg-[#0f6f53] sm:inline-flex"
          >
            <TemplateText as="span">{getValue(data, "heroPrimaryButton")}</TemplateText>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center border border-[#102018]/12 text-[#102018] lg:hidden"
          >
            <span>{mobileOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#102018]/10 bg-[#fffdf8] px-5 py-4 lg:hidden">
          <div className="grid gap-1">
            {nav.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                className={cx(
                  "border px-4 py-3 text-right text-sm font-semibold uppercase tracking-[0.2em]",
                  currentPage === id
                    ? "border-[#0d5c45] bg-[#0d5c45] text-[#f6f3ea]"
                    : "border-[#102018]/10 text-[#5a6b62]",
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

function LedgerHero({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (pageId: string) => void;
}) {
  return (
    <section className="border-b border-[#102018]/10 bg-[#f6f3ea]">
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="border-b border-[#102018]/10 px-5 py-16 lg:border-b-0 lg:border-l lg:px-8 lg:py-24">
          <div className="mb-5 inline-flex items-center gap-3 border border-[#102018]/10 bg-[#fffdf8] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#0d5c45]">
            <span className="h-px w-10 bg-[#0d5c45]" />
            <TemplateText as="span">{getValue(data, "heroEyebrow")}</TemplateText>
          </div>
          <TemplateText as="h1" className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-[#102018] md:text-7xl">
            {getValue(data, "heroTitle")}
          </TemplateText>
          <TemplateText as="p" className="mt-7 max-w-2xl text-lg leading-8 text-[#5a6b62]">
            {getValue(data, "heroSubtitle")}
          </TemplateText>
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => goTo("contact")}
              className="border border-[#0d5c45] bg-[#0d5c45] px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6f3ea]"
            >
              <TemplateText as="span">{getValue(data, "heroPrimaryButton")}</TemplateText>
            </button>
            <button
              type="button"
              onClick={() => goTo("work")}
              className="border border-[#102018]/12 px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#102018]"
            >
              <TemplateText as="span">{getValue(data, "heroSecondaryButton")}</TemplateText>
            </button>
          </div>
        </div>

        <div className="grid grid-rows-4">
          {auditRows.map(([label, text], index) => (
            <div
              key={label}
              className={cx(
                "grid grid-cols-[auto_1fr] items-center gap-6 border-b border-[#102018]/10 px-6 py-5",
                index === auditRows.length - 1 ? "border-b-0" : "",
              )}
            >
              <TemplateText as="span" className="text-xl font-semibold tracking-[-0.04em] text-[#0d5c45]">
                0{index + 1}
              </TemplateText>
              <div className="text-right">
                <TemplateText as="div" className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#102018]">
                  {label}
                </TemplateText>
                <TemplateText as="p" className="mt-2 text-sm leading-7 text-[#5a6b62]">
                  {text}
                </TemplateText>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function KPIBoard({ data }: { data: Record<string, any> }) {
  const stats = [
    [getValue(data, "statOne"), getValue(data, "statOneLabel")],
    [getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
    [getValue(data, "statThree"), getValue(data, "statThreeLabel")],
    [getValue(data, "statFour"), getValue(data, "statFourLabel")],
  ];

  return (
    <section className="border-b border-[#102018]/10 bg-[#fffdf8] px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-4">
        {stats.map(([value, label], index) => (
          <div key={label} className={cx("border border-[#102018]/10 p-6", index === 0 ? "md:border-l-0" : "")}>
            <TemplateText as="div" className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#0d5c45]">
              Metric 0{index + 1}
            </TemplateText>
            <TemplateText as="div" className="mt-5 text-5xl font-semibold tracking-[-0.05em] text-[#102018]">
              {value}
            </TemplateText>
            <TemplateText as="div" className="mt-3 text-sm leading-7 text-[#5a6b62]">
              {label}
            </TemplateText>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutLedger({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border border-[#102018]/10 p-3">
          <img src={getValue(data, "aboutImage")} alt="" className="h-[520px] w-full object-cover" />
        </div>
        <div className="border border-r-0 border-[#102018]/10 bg-[#fffdf8] p-8 lg:p-12">
          <LedgerSectionTitle
            eyebrow={getValue(data, "aboutEyebrow")}
            title={getValue(data, "aboutTitle")}
            text={getValue(data, "aboutText")}
          />
          <div className="mt-10 border-t border-[#102018]/10">
            {governanceRows.map(([label, text]) => (
              <div key={label} className="grid gap-2 border-b border-[#102018]/10 py-4 md:grid-cols-[180px_1fr]">
                <TemplateText as="div" className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#0d5c45]">
                  {label}
                </TemplateText>
                <TemplateText as="p" className="text-sm leading-7 text-[#5a6b62]">
                  {text}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesLedger({ data }: { data: Record<string, any> }) {
  const services = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
  ];

  return (
    <section className="border-y border-[#102018]/10 bg-[#f6f3ea] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <LedgerSectionTitle eyebrow={getValue(data, "servicesEyebrow")} title={getValue(data, "servicesTitle")} center />
        <div className="mt-14 border border-[#102018]/10">
          {services.map(([title, text], index) => (
            <article key={`${title}-${index}`} className="grid gap-4 border-b border-[#102018]/10 px-6 py-6 md:grid-cols-[90px_240px_1fr]">
              <TemplateText as="div" className="text-lg font-semibold tracking-[-0.03em] text-[#0d5c45]">
                0{index + 1}
              </TemplateText>
              <TemplateText as="h3" className="text-xl font-semibold text-[#102018]">
                {title}
              </TemplateText>
              <TemplateText as="p" className="text-sm leading-7 text-[#5a6b62]">
                {text}
              </TemplateText>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowRegister({ data }: { data: Record<string, any> }) {
  const steps = [
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    [getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];

  return (
    <section className="px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <LedgerSectionTitle eyebrow={getValue(data, "processEyebrow")} title={getValue(data, "processTitle")} />
        <div className="mt-12 border border-[#102018]/10">
          {steps.map(([title, text], index) => (
            <div key={`${title}-${index}`} className="grid gap-4 border-b border-[#102018]/10 px-6 py-6 md:grid-cols-[80px_220px_1fr]">
              <TemplateText as="div" className="text-lg font-semibold tracking-[-0.03em] text-[#0d5c45]">
                0{index + 1}
              </TemplateText>
              <TemplateText as="div" className="text-base font-semibold text-[#102018]">
                {title}
              </TemplateText>
              <TemplateText as="p" className="text-sm leading-7 text-[#5a6b62]">
                {text}
              </TemplateText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegisterTable() {
  return (
    <section className="border-y border-[#102018]/10 bg-[#fffdf8] px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <LedgerSectionTitle
          eyebrow="תצוגת Ledger"
          title="מבנה עמודים שנראה כמו מסמך עבודה ולא רק שיווק."
          text="הטמפלט בנוי עם יחידות טבלה, שורות בקרה ותאי מידע שמשרתים משרדי כספים, רואי חשבון וייעוץ הנהלה."
        />
        <div className="mt-12 border border-[#102018]/10">
          {registerRows.map(([quarter, scope]) => (
            <div key={quarter} className="grid gap-4 border-b border-[#102018]/10 px-6 py-5 md:grid-cols-[120px_1fr_220px]">
              <TemplateText as="div" className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#0d5c45]">
                {quarter}
              </TemplateText>
              <TemplateText as="div" className="text-sm leading-7 text-[#5a6b62]">
                {scope}
              </TemplateText>
              <TemplateText as="div" className="text-sm font-semibold text-[#102018]">
                Ready for board review
              </TemplateText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkRegister({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "workOneTitle"), getValue(data, "workOneText")],
    [getValue(data, "workTwoTitle"), getValue(data, "workTwoText")],
    [getValue(data, "workThreeTitle"), getValue(data, "workThreeText")],
  ];

  return (
    <section className="bg-[#102018] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <LedgerSectionTitle eyebrow={getValue(data, "workEyebrow")} title={getValue(data, "workTitle")} light center />
        <div className="mt-14 border border-[#d8e8e2]/20">
          {items.map(([title, text], index) => (
            <div key={`${title}-${index}`} className="grid gap-4 border-b border-[#d8e8e2]/20 px-6 py-6 md:grid-cols-[120px_260px_1fr]">
              <TemplateText as="div" className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d8e8e2]">
                Case 0{index + 1}
              </TemplateText>
              <TemplateText as="h3" className="text-xl font-semibold text-[#f6f3ea]">
                {title}
              </TemplateText>
              <TemplateText as="p" className="text-sm leading-7 text-[#d9e4de]">
                {text}
              </TemplateText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactBoard({ data }: { data: Record<string, any> }) {
  const info = [
    ["טלפון", getValue(data, "phone")],
    ["אימייל", getValue(data, "email")],
    ["כתובת", getValue(data, "address")],
  ];

  return (
    <section className="border-t border-[#102018]/10 bg-[#f6f3ea] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="border border-[#102018]/10 bg-[#102018] p-8 lg:p-12">
          <LedgerSectionTitle
            eyebrow={getValue(data, "contactEyebrow")}
            title={getValue(data, "contactTitle")}
            text={getValue(data, "contactText")}
            light
          />
          <div className="mt-10 border-t border-[#d8e8e2]/20">
            {info.map(([label, value]) => (
              <div key={label} className="grid gap-2 border-b border-[#d8e8e2]/20 py-4 md:grid-cols-[120px_1fr]">
                <TemplateText as="div" className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d8e8e2]">
                  {label}
                </TemplateText>
                <TemplateText as="div" className="text-sm leading-7 text-[#f6f3ea]">
                  {value}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>
        <form className="border border-r-0 border-[#102018]/10 bg-[#fffdf8] p-8 lg:p-12">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="border border-[#102018]/12 bg-white px-4 py-4 text-right outline-none" placeholder="שם מלא" />
            <input className="border border-[#102018]/12 bg-white px-4 py-4 text-right outline-none" placeholder="טלפון" />
            <input className="border border-[#102018]/12 bg-white px-4 py-4 text-right outline-none md:col-span-2" placeholder="אימייל" />
            <textarea className="min-h-40 border border-[#102018]/12 bg-white px-4 py-4 text-right outline-none md:col-span-2" placeholder="ספרו לנו מה תרצו למדוד, לייעל או לייצב." />
          </div>
          <div className="mt-6 grid gap-4 border-t border-[#102018]/10 pt-6 md:grid-cols-[1fr_auto] md:items-center">
            <TemplateText as="p" className="text-sm leading-7 text-[#5a6b62]">
              שיחת ההתנעה מיועדת למנהלים, בעלי עסקים וגורמי כספים שמבקשים תהליך מסודר ולא רק ייעוץ חד-פעמי.
            </TemplateText>
            <button type="button" className="border border-[#0d5c45] bg-[#0d5c45] px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6f3ea]">
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
    <section className="border-b border-[#102018]/10 bg-[#fffdf8]">
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center px-5 py-16 lg:px-8 lg:py-24">
          <LedgerSectionTitle eyebrow={eyebrow} title={title} text={text} />
        </div>
        <div className="border-r border-[#102018]/10 p-3">
          <img src={image} alt="" className="h-[320px] w-full object-cover lg:h-[420px]" />
        </div>
      </div>
    </section>
  );
}

function LedgerFooter({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (pageId: string) => void;
}) {
  return (
    <footer className="border-t border-[#102018]/10 bg-[#fffdf8] px-5 py-10 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          <TemplateText as="div" className="text-xl font-semibold tracking-tight text-[#102018]">
            {getValue(data, "brandName")}
          </TemplateText>
          <TemplateText as="p" className="mt-3 max-w-2xl text-sm leading-7 text-[#5a6b62]">
            {getValue(data, "footerText")}
          </TemplateText>
        </div>
        <div className="grid gap-1 sm:grid-cols-5">
          {ledgerPages.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => goTo(page.id)}
              className="border border-[#102018]/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#102018] transition hover:bg-[#f3eee3]"
            >
              <TemplateText as="span">{getNavLabel(data, page.id)}</TemplateText>
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-[#102018]/10 pt-6">
        <TemplateText as="p" className="text-sm text-[#5a6b62]">
          © {new Date().getFullYear()} {getValue(data, "brandName")} · Ledger Template
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
      <LedgerHero data={data} goTo={goTo} />
      <KPIBoard data={data} />
      <AboutLedger data={data} />
      <ServicesLedger data={data} />
      <WorkflowRegister data={data} />
      <WorkRegister data={data} />
      <ContactBoard data={data} />
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
      <AboutLedger data={data} />
      <RegisterTable />
      <WorkflowRegister data={data} />
      <ContactBoard data={data} />
    </>
  );
}

function ServicesPage({ data }: { data: Record<string, any> }) {
  return (
    <>
      <PageHero
        title={getNavLabel(data, "services")}
        eyebrow={getValue(data, "servicesEyebrow")}
        text="עמוד שירותים שנבנה כמו מסמך Scope: טבלאות, תאי בקרה ותחומי אחריות ברורים לכל שלב."
        image={getValue(data, "heroImage")}
      />
      <ServicesLedger data={data} />
      <WorkflowRegister data={data} />
      <RegisterTable />
      <ContactBoard data={data} />
    </>
  );
}

function WorkPage({ data }: { data: Record<string, any> }) {
  return (
    <>
      <PageHero
        title={getNavLabel(data, "work")}
        eyebrow={getValue(data, "workEyebrow")}
        text="פרויקטים מוצגים כלוג עבודה: מה הבעיה, מה בוצע, ומה היה השינוי העסקי אחרי הסגירה."
        image={getValue(data, "heroImage")}
      />
      <WorkRegister data={data} />
      <KPIBoard data={data} />
      <ContactBoard data={data} />
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
      <RegisterTable />
      <ContactBoard data={data} />
    </>
  );
}

export default function LedgerPages({
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
}: LedgerPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...ledgerDefaultData,
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
    { allowedPages: ledgerAllowedPages, fallbackPage: "home" },
  );

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "ledger-preview" : "ledger"}
      className="min-h-screen w-full overflow-x-hidden bg-[#f6f3ea] text-[#102018]"
      style={{ fontFamily: '"IBM Plex Mono", "SFMono-Regular", Menlo, monospace' }}
    >
      <LedgerHeader data={mergedData} currentPage={currentPage} goTo={goTo} />
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
      <LedgerFooter data={mergedData} goTo={goTo} />
    </div>
  );
}
