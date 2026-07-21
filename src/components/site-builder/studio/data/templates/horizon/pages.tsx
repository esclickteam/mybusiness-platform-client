import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { TemplateText } from "../shared/TemplateText";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { horizonDefaultData } from "./defaultData";

export const horizonPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "נכסים", slug: "/work" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const horizonAllowedPages = horizonPages.map((page) => page.id);

type HorizonPagesProps = {
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

const propertyMeta = [
  { zone: "SEA FRONT", size: "340 מ\"ר", status: "במכירה פרטית" },
  { zone: "CENTRAL TLV", size: "480 מ\"ר", status: "השכרה מנוהלת" },
  { zone: "JERUSALEM HILLS", size: "610 מ\"ר", status: "מגרש לבנייה" },
];

const serviceNotes = [
  "ליווי רכישה והשקעה",
  "מכירה והשבחת נכסים",
  "ניהול משא ומתן ומכרזים",
  "תמחור, מחקר ושיווק",
];

const districtRows = [
  ["קו ראשון לים", "פרמיית ביקוש גבוהה", "38 עסקאות ברבעון"],
  ["מרכז עסקים עירוני", "יציבות שכירות", "תפוסה ממוצעת 94%"],
  ["שכונות מתחדשות", "פוטנציאל השבחה", "כניסת הון מוסדי"],
];

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (horizonDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getNavLabel(data: Record<string, any>, type: string) {
  if (type === "home") return getValue(data, "navHome");
  if (type === "about") return getValue(data, "navAbout");
  if (type === "services") return getValue(data, "navServices");
  if (type === "work") return getValue(data, "navWork");
  if (type === "insights") return getValue(data, "navInsights");
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
    <div className={cx("max-w-3xl", center ? "mx-auto text-center" : "text-right")}>
      <div
        className={cx(
          "mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.34em]",
          light ? "text-[#d6c1a7]" : "text-[#8f6d4b]",
        )}
      >
        <span className="h-px w-12 bg-current" />
        <TemplateText as="span">{eyebrow}</TemplateText>
      </div>
      <TemplateText
        as="h2"
        className={cx(
          "text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl",
          light ? "text-[#f7f3ed]" : "text-[#1c1c1c]",
        )}
      >
        {title}
      </TemplateText>
      {text ? (
        <TemplateText
          as="p"
          className={cx(
            "mt-5 text-lg leading-8",
            light ? "text-[#e8ddd0]" : "text-[#6b645c]",
          )}
        >
          {text}
        </TemplateText>
      ) : null}
    </div>
  );
}

function HorizonHeader({
  data,
  currentPage,
  goTo,
}: {
  data: Record<string, any>;
  currentPage: string;
  goTo: (pageId: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = horizonPages.map((page) => [page.id, getNavLabel(data, page.id)] as [string, string]);

  function handleNavigate(pageId: string) {
    goTo(pageId);
    setMobileOpen(false);
  }

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b border-[#1c1c1c]/10 bg-[#f7f3ed]/95 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => handleNavigate("home")} className="flex items-center gap-3 text-right">
          <span className="grid h-11 w-11 place-items-center border border-[#1c1c1c]/12 bg-[#1c1c1c] text-sm font-semibold tracking-[0.2em] text-[#f7f3ed]">
            {getValue(data, "logoText")}
          </span>
          <div className="text-right">
            <TemplateText as="div" className="text-lg font-semibold tracking-tight text-[#1c1c1c]">
              {getValue(data, "brandName")}
            </TemplateText>
            <TemplateText as="div" className="text-[11px] uppercase tracking-[0.3em] text-[#8b8177]">
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
                "border-b px-1 py-2 text-sm font-medium tracking-[0.16em] uppercase transition",
                currentPage === id
                  ? "border-[#b8956b] text-[#1c1c1c]"
                  : "border-transparent text-[#6b645c] hover:text-[#1c1c1c]",
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
            className="hidden border border-[#1c1c1c] bg-[#1c1c1c] px-5 py-3 text-sm font-semibold tracking-[0.18em] text-[#f7f3ed] transition hover:bg-[#2b2b2b] sm:inline-flex"
          >
            <TemplateText as="span">{getValue(data, "heroPrimaryButton")}</TemplateText>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center border border-[#1c1c1c]/15 text-[#1c1c1c] lg:hidden"
          >
            <span>{mobileOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#1c1c1c]/10 bg-[#fffdf9] px-5 py-4 lg:hidden">
          <div className="grid gap-1">
            {nav.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                className={cx(
                  "border px-4 py-3 text-right text-sm font-semibold tracking-[0.16em] uppercase",
                  currentPage === id
                    ? "border-[#1c1c1c] bg-[#1c1c1c] text-[#f7f3ed]"
                    : "border-[#1c1c1c]/10 text-[#6b645c]",
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

function HorizonHero({
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
  ];

  return (
    <section className="relative border-b border-[#1c1c1c]/10">
      <div className="relative min-h-[760px] overflow-hidden">
        <img src={getValue(data, "heroImage")} alt="" className="h-[760px] w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c]/82 via-[#1c1c1c]/28 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#1c1c1c]/30 to-transparent" />

        <div className="absolute inset-x-0 top-0 mx-auto flex h-full max-w-7xl items-center px-5 lg:px-8">
          <div className="max-w-3xl pb-28">
            <div className="mb-5 inline-flex items-center gap-3 border border-white/15 bg-[#1c1c1c]/30 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#f0e6db] backdrop-blur">
              <span className="h-px w-10 bg-[#b8956b]" />
              <TemplateText as="span">{getValue(data, "heroEyebrow")}</TemplateText>
            </div>
            <TemplateText as="h1" className="text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[#f7f3ed] md:text-7xl lg:text-[88px]">
              {getValue(data, "heroTitle")}
            </TemplateText>
            <TemplateText as="p" className="mt-7 max-w-2xl text-lg leading-8 text-[#ebe3d9] md:text-xl">
              {getValue(data, "heroSubtitle")}
            </TemplateText>
            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => goTo("contact")}
                className="border border-[#b8956b] bg-[#b8956b] px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#1c1c1c] transition hover:bg-[#c3a176]"
              >
                <TemplateText as="span">{getValue(data, "heroPrimaryButton")}</TemplateText>
              </button>
              <button
                type="button"
                onClick={() => goTo("work")}
                className="border border-white/22 bg-transparent px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#f7f3ed] transition hover:bg-white/10"
              >
                <TemplateText as="span">{getValue(data, "heroSecondaryButton")}</TemplateText>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t-2 border-[#b8956b] bg-[#f7f3ed]/96 backdrop-blur">
          <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div className="border-b border-[#1c1c1c]/10 px-5 py-6 md:border-b-0 md:border-l lg:px-8">
              <TemplateText as="div" className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#8f6d4b]">
                Panorama Index
              </TemplateText>
              <TemplateText as="div" className="mt-3 max-w-sm text-sm leading-7 text-[#6b645c]">
                ניהול מלא של נכסי יוקרה, השבחת קרקעות ומעטפת שיווקית שמתחילה במחקר ומסתיימת בחתימה.
              </TemplateText>
            </div>
            {stats.map(([value, label]) => (
              <div key={label} className="border-b border-[#1c1c1c]/10 px-5 py-6 text-right md:border-b-0 md:border-l lg:px-8">
                <TemplateText as="div" className="text-3xl font-semibold tracking-[-0.04em] text-[#1c1c1c]">
                  {value}
                </TemplateText>
                <TemplateText as="div" className="mt-2 text-[12px] font-semibold uppercase tracking-[0.28em] text-[#8b8177]">
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

function MarketStrip() {
  return (
    <section className="border-b border-[#1c1c1c]/10 bg-[#fffdf9]">
      <div className="mx-auto flex max-w-7xl flex-wrap">
        {serviceNotes.map((item) => (
          <div key={item} className="border-l border-[#1c1c1c]/10 px-5 py-4 last:border-l-0 lg:px-8">
            <TemplateText as="span" className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#8f6d4b]">
              {item}
            </TemplateText>
          </div>
        ))}
      </div>
    </section>
  );
}

function SignatureStats({ data }: { data: Record<string, any> }) {
  const items = [
    ["PIPELINE", getValue(data, "statOne"), getValue(data, "statOneLabel")],
    ["YEARS", getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
    ["RETENTION", getValue(data, "statThree"), getValue(data, "statThreeLabel")],
    ["DESK", getValue(data, "statFour"), getValue(data, "statFourLabel")],
  ];

  return (
    <section className="border-b border-[#1c1c1c]/10 px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-4">
        {items.map(([eyebrow, value, label], index) => (
          <article key={eyebrow} className={cx("border border-[#1c1c1c]/10 p-6", index === 0 ? "md:border-l-0" : "")}>
            <TemplateText as="div" className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#8f6d4b]">
              {eyebrow}
            </TemplateText>
            <TemplateText as="div" className="mt-6 text-5xl font-semibold tracking-[-0.05em] text-[#1c1c1c]">
              {value}
            </TemplateText>
            <TemplateText as="p" className="mt-3 text-sm leading-7 text-[#6b645c]">
              {label}
            </TemplateText>
          </article>
        ))}
      </div>
    </section>
  );
}

function StorySection({ data }: { data: Record<string, any> }) {
  const points = [
    "הערכת שווי עם הקשר תכנוני ושיווקי.",
    "ליווי קונים, יזמים ומשקיעים באותה שפה.",
    "ניהול תהליך דיסקרטי משלב המחקר עד המסירה.",
  ];

  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border border-[#1c1c1c]/10 bg-[#fffdf9] p-3">
          <img src={getValue(data, "aboutImage")} alt="" className="h-[520px] w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <SectionTitle eyebrow={getValue(data, "aboutEyebrow")} title={getValue(data, "aboutTitle")} text={getValue(data, "aboutText")} />
          <div className="mt-10 grid gap-3">
            {points.map((point) => (
              <div key={point} className="grid grid-cols-[20px_1fr] items-start gap-4 border-t border-[#1c1c1c]/10 py-4 first:border-t-0 first:pt-0">
                <span className="mt-1 h-2 w-2 bg-[#b8956b]" />
                <TemplateText as="p" className="text-base leading-7 text-[#4f4942]">
                  {point}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceGrid({ data }: { data: Record<string, any> }) {
  const services = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
  ];

  return (
    <section className="border-y border-[#1c1c1c]/10 bg-[#fffdf9] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow={getValue(data, "servicesEyebrow")} title={getValue(data, "servicesTitle")} center />
        <div className="mt-14 grid gap-0 md:grid-cols-2">
          {services.map(([title, text], index) => (
            <article key={`${title}-${index}`} className="border border-[#1c1c1c]/10 p-8 md:p-10">
              <TemplateText as="div" className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#8f6d4b]">
                0{index + 1}
              </TemplateText>
              <TemplateText as="h3" className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-[#1c1c1c]">
                {title}
              </TemplateText>
              <TemplateText as="p" className="mt-4 max-w-xl text-base leading-7 text-[#6b645c]">
                {text}
              </TemplateText>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PropertyShowcase({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "workOneTitle"), getValue(data, "workOneText")],
    [getValue(data, "workTwoTitle"), getValue(data, "workTwoText")],
    [getValue(data, "workThreeTitle"), getValue(data, "workThreeText")],
  ];

  return (
    <section className="bg-[#1c1c1c] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow={getValue(data, "workEyebrow")} title={getValue(data, "workTitle")} light center />
        <div className="mt-14 grid gap-0 lg:grid-cols-3">
          {items.map(([title, text], index) => (
            <article key={`${title}-${index}`} className="border border-[#b8956b]/20 p-8">
              <div className="flex items-start justify-between gap-6 border-b border-[#b8956b]/20 pb-5">
                <div>
                  <TemplateText as="div" className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d6c1a7]">
                    {propertyMeta[index]?.zone}
                  </TemplateText>
                  <TemplateText as="h3" className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#f7f3ed]">
                    {title}
                  </TemplateText>
                </div>
                <TemplateText as="span" className="text-sm uppercase tracking-[0.28em] text-[#b8956b]">
                  0{index + 1}
                </TemplateText>
              </div>
              <TemplateText as="p" className="mt-6 text-base leading-7 text-[#d6cec4]">
                {text}
              </TemplateText>
              <div className="mt-8 grid gap-3 border-t border-[#b8956b]/20 pt-5 text-sm text-[#efe4d7]">
                <TemplateText as="div">{propertyMeta[index]?.size}</TemplateText>
                <TemplateText as="div">{propertyMeta[index]?.status}</TemplateText>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessAxis({ data }: { data: Record<string, any> }) {
  const steps = [
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    [getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];

  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow={getValue(data, "processEyebrow")} title={getValue(data, "processTitle")} />
        <div className="mt-14 grid gap-0 md:grid-cols-4">
          {steps.map(([title, text], index) => (
            <div key={`${title}-${index}`} className="border border-[#1c1c1c]/10 p-7">
              <TemplateText as="div" className="text-4xl font-semibold tracking-[-0.04em] text-[#b8956b]">
                0{index + 1}
              </TemplateText>
              <TemplateText as="h3" className="mt-5 text-2xl font-semibold text-[#1c1c1c]">
                {title}
              </TemplateText>
              <TemplateText as="p" className="mt-3 text-sm leading-7 text-[#6b645c]">
                {text}
              </TemplateText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DistrictTable() {
  return (
    <section className="border-y border-[#1c1c1c]/10 bg-[#fffdf9] px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Market Scan"
          title="שכונות, מגמות והזדמנויות בזמן אמת."
          text="מבנה התוכן משלב דפי תדמית, מלאי נכסים ותובנות שוק כדי לייצר חוויית נדל״ן מלאה ולא רק עמוד נחיתה."
        />
        <div className="mt-12 border border-[#1c1c1c]/10">
          {districtRows.map(([area, focus, signal], index) => (
            <div
              key={area}
              className={cx(
                "grid gap-4 border-b border-[#1c1c1c]/10 px-5 py-5 text-right md:grid-cols-[1fr_1fr_1fr]",
                index === districtRows.length - 1 ? "border-b-0" : "",
              )}
            >
              <TemplateText as="div" className="font-semibold text-[#1c1c1c]">
                {area}
              </TemplateText>
              <TemplateText as="div" className="text-sm text-[#6b645c]">
                {focus}
              </TemplateText>
              <TemplateText as="div" className="text-sm text-[#8f6d4b]">
                {signal}
              </TemplateText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightPanels({ data }: { data: Record<string, any> }) {
  const insights = [
    [getValue(data, "insightOneTitle"), getValue(data, "insightOneText"), "Quarterly Report"],
    [getValue(data, "insightTwoTitle"), getValue(data, "insightTwoText"), "Advisory Memo"],
  ];

  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow={getValue(data, "insightsEyebrow")} title={getValue(data, "insightsTitle")} center />
        <div className="mt-14 grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-0">
            {insights.map(([title, text, tag]) => (
              <article key={title} className="border border-[#1c1c1c]/10 p-8">
                <TemplateText as="div" className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#8f6d4b]">
                  {tag}
                </TemplateText>
                <TemplateText as="h3" className="mt-5 text-3xl font-semibold text-[#1c1c1c]">
                  {title}
                </TemplateText>
                <TemplateText as="p" className="mt-4 text-base leading-7 text-[#6b645c]">
                  {text}
                </TemplateText>
              </article>
            ))}
          </div>
          <div className="border border-[#1c1c1c]/10 bg-[#1c1c1c] p-8">
            <TemplateText as="div" className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d6c1a7]">
              Advisory Desk
            </TemplateText>
            <TemplateText as="h3" className="mt-5 text-4xl font-semibold leading-[1.1] text-[#f7f3ed]">
              תוכן שמשמש גם ככלי מכירה, גם כחומר עבודה פנימי וגם כהוכחת מומחיות.
            </TemplateText>
            <div className="mt-10 grid gap-5 border-t border-[#b8956b]/20 pt-6">
              {[
                ["VALUE MAP", "ניתוח שכונות, מחירי יעד ומסלולי השבחה."],
                ["BUYER JOURNEY", "עמודי תהליך, תשובות לשאלות ומסמכי הכנה לפגישה."],
                ["PIPELINE CONTENT", "מאמרים, דוחות ועדכונים שמחזיקים את הקהל קרוב."],
              ].map(([title, text]) => (
                <div key={title}>
                  <TemplateText as="div" className="text-sm font-semibold uppercase tracking-[0.28em] text-[#b8956b]">
                    {title}
                  </TemplateText>
                  <TemplateText as="p" className="mt-2 text-sm leading-7 text-[#e7ddd2]">
                    {text}
                  </TemplateText>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection({ data }: { data: Record<string, any> }) {
  const info = [
    ["PHONE", getValue(data, "phone")],
    ["EMAIL", getValue(data, "email")],
    ["ADDRESS", getValue(data, "address")],
  ];

  return (
    <section className="border-t border-[#1c1c1c]/10 bg-[#fffdf9] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border border-[#1c1c1c]/10 bg-[#1c1c1c] p-8 lg:p-12">
          <SectionTitle eyebrow={getValue(data, "contactEyebrow")} title={getValue(data, "contactTitle")} text={getValue(data, "contactText")} light />
          <div className="mt-10 grid gap-0 border-t border-[#b8956b]/20">
            {info.map(([label, value]) => (
              <div key={label} className="border-b border-[#b8956b]/20 py-4">
                <TemplateText as="div" className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#b8956b]">
                  {label}
                </TemplateText>
                <TemplateText as="div" className="mt-2 text-base text-[#f7f3ed]">
                  {value}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>
        <form className="border border-r-0 border-[#1c1c1c]/10 bg-[#f7f3ed] p-8 lg:p-12">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="border border-[#1c1c1c]/12 bg-white px-4 py-4 text-right outline-none" placeholder="שם מלא" />
            <input className="border border-[#1c1c1c]/12 bg-white px-4 py-4 text-right outline-none" placeholder="טלפון" />
            <input className="border border-[#1c1c1c]/12 bg-white px-4 py-4 text-right outline-none md:col-span-2" placeholder="אימייל" />
            <textarea className="min-h-40 border border-[#1c1c1c]/12 bg-white px-4 py-4 text-right outline-none md:col-span-2" placeholder="ספרו לנו על הנכס, הרכישה או ההשבחה שאתם מתכננים." />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#1c1c1c]/10 pt-6">
            <TemplateText as="p" className="max-w-md text-sm leading-7 text-[#6b645c]">
              פגישת היכרות כוללת אפיון מלא, בדיקת שוק וסקיצה ראשונית למסלול ההתקדמות.
            </TemplateText>
            <button type="button" className="border border-[#1c1c1c] bg-[#1c1c1c] px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#f7f3ed] transition hover:bg-[#2a2a2a]">
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
    <section className="border-b border-[#1c1c1c]/10 bg-[#fffdf9]">
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center px-5 py-16 lg:px-8 lg:py-24">
          <SectionTitle eyebrow={eyebrow} title={title} text={text} />
        </div>
        <div className="border-r border-[#1c1c1c]/10 p-3">
          <img src={image} alt="" className="h-[320px] w-full object-cover lg:h-[420px]" />
        </div>
      </div>
    </section>
  );
}

function HorizonFooter({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (pageId: string) => void;
}) {
  return (
    <footer className="border-t border-[#b8956b]/20 bg-[#1c1c1c] px-5 py-10 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <TemplateText as="div" className="text-xl font-semibold tracking-tight text-[#f7f3ed]">
            {getValue(data, "brandName")}
          </TemplateText>
          <TemplateText as="p" className="mt-3 max-w-2xl text-sm leading-7 text-[#d8cec2]">
            {getValue(data, "footerText")}
          </TemplateText>
        </div>
        <div className="flex flex-wrap gap-3">
          {horizonPages.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => goTo(page.id)}
              className="border border-[#b8956b]/20 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#f7f3ed] transition hover:bg-white/5"
            >
              <TemplateText as="span">{getNavLabel(data, page.id)}</TemplateText>
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-[#b8956b]/20 pt-6">
        <TemplateText as="p" className="text-sm text-[#a99988]">
          © {new Date().getFullYear()} {getValue(data, "brandName")} · Horizon Template
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
      <HorizonHero data={data} goTo={goTo} />
      <MarketStrip />
      <SignatureStats data={data} />
      <StorySection data={data} />
      <ServiceGrid data={data} />
      <PropertyShowcase data={data} />
      <ProcessAxis data={data} />
      <InsightPanels data={data} />
      <ContactSection data={data} />
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
      <StorySection data={data} />
      <DistrictTable />
      <ProcessAxis data={data} />
      <ContactSection data={data} />
    </>
  );
}

function ServicesPage({ data }: { data: Record<string, any> }) {
  return (
    <>
      <PageHero
        title={getNavLabel(data, "services")}
        eyebrow={getValue(data, "servicesEyebrow")}
        text="דף שירותים מלא עם רמות ליווי, מהלכי ביצוע ומבנה ברור שמרגיש כמו משרד בוטיק לנכסי יוקרה."
        image={getValue(data, "heroImage")}
      />
      <ServiceGrid data={data} />
      <ProcessAxis data={data} />
      <DistrictTable />
      <ContactSection data={data} />
    </>
  );
}

function WorkPage({ data }: { data: Record<string, any> }) {
  return (
    <>
      <PageHero
        title={getNavLabel(data, "work")}
        eyebrow={getValue(data, "workEyebrow")}
        text="נכסים, פרויקטים ומסלולי עבודה שמודגשים כשילוב של מלאי איכותי, מידע שיווקי וסטוריטלינג מכירתי."
        image={getValue(data, "heroImage")}
      />
      <PropertyShowcase data={data} />
      <DistrictTable />
      <InsightPanels data={data} />
      <ContactSection data={data} />
    </>
  );
}

function InsightsPage({ data }: { data: Record<string, any> }) {
  return (
    <>
      <PageHero
        title={getNavLabel(data, "insights")}
        eyebrow={getValue(data, "insightsEyebrow")}
        text="עמוד תובנות שמרחיב את הנראות המקצועית עם מאמרים, סיגנלים שוקיים ומבנה קריא של דוח פנימי."
        image={getValue(data, "aboutImage")}
      />
      <InsightPanels data={data} />
      <DistrictTable />
      <ContactSection data={data} />
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
        image={getValue(data, "heroImage")}
      />
      <DistrictTable />
      <ContactSection data={data} />
    </>
  );
}

export default function HorizonPages({
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
}: HorizonPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...horizonDefaultData,
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
    { allowedPages: horizonAllowedPages, fallbackPage: "home" },
  );

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "horizon-preview" : "horizon"}
      className="min-h-screen w-full overflow-x-hidden bg-[#f7f3ed] text-[#1c1c1c]"
      style={{ fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif' }}
    >
      <HorizonHeader data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} goTo={goTo} /> },
          { id: "about", content: <AboutPage data={mergedData} /> },
          { id: "services", content: <ServicesPage data={mergedData} /> },
          { id: "work", content: <WorkPage data={mergedData} /> },
          { id: "insights", content: <InsightsPage data={mergedData} /> },
          { id: "contact", content: <ContactPage data={mergedData} /> },
        ]}
      />
      <HorizonFooter data={mergedData} goTo={goTo} />
    </div>
  );
}
