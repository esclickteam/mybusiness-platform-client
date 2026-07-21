import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { TemplateText } from "../shared/TemplateText";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { vertexDefaultData } from "./defaultData";
import { vertexEditorCss } from "./editorCss";

export const vertexPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const vertexAllowedPages = vertexPages.map((page) => page.id);
const scopedVertexEditorCss = vertexEditorCss
  .split('[data-template-id="vertex"]')
  .join('[data-template-id="vertex"], [data-template-id="vertex-preview"]');

const vertexTheme = {
  bg: "#050505",
  surface: "#0d0d0d",
  panel: "#111111",
  text: "#f5f5f5",
  muted: "#9a9a9a",
  accent: "#00ff88",
  border: "#00ff8833",
};

type VertexPagesProps = {
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

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (vertexDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getPageTitle(data: Record<string, any>, pageId: string) {
  if (pageId === "about") return getValue(data, "navAbout");
  if (pageId === "services") return getValue(data, "navServices");
  if (pageId === "work") return getValue(data, "navWork");
  if (pageId === "insights") return getValue(data, "navInsights");
  if (pageId === "contact") return getValue(data, "navContact");
  return getValue(data, "brandName");
}

function getStats(data: Record<string, any>) {
  return [
    [getValue(data, "statOne"), getValue(data, "statOneLabel")],
    [getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
    [getValue(data, "statThree"), getValue(data, "statThreeLabel")],
    [getValue(data, "statFour"), getValue(data, "statFourLabel")],
  ];
}

function SectionIntro({
  eyebrow,
  title,
  text,
  align = "right",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "right" | "center";
}) {
  return (
    <div className={cx("mx-auto max-w-3xl", align === "center" ? "text-center" : "text-right")}>
      <TemplateText
        as="p"
        className="mb-4 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.34em] text-[#00ff88]"
      >
        <span className="h-px w-10 bg-[#00ff88]" />
        {eyebrow}
      </TemplateText>
      <TemplateText
        as="h2"
        className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.05em] text-[#f5f5f5] md:text-6xl"
      >
        {title}
      </TemplateText>
      {text ? (
        <TemplateText as="p" className="mt-5 text-lg leading-8 text-[#9a9a9a]">
          {text}
        </TemplateText>
      ) : null}
    </div>
  );
}

function SquareButton({
  children,
  onClick,
  kind = "solid",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  kind?: "solid" | "ghost";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "border px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] transition duration-300 hover:-translate-y-0.5 rounded-none",
        kind === "solid"
          ? "border-[#00ff88] bg-[#00ff88] text-[#050505] hover:bg-[#6effb8]"
          : "border-[#00ff8833] bg-transparent text-[#f5f5f5] hover:border-[#00ff88] hover:text-[#00ff88]",
        className,
      )}
    >
      {children}
    </button>
  );
}

function VertexHeader({
  data,
  currentPage,
  goTo,
  openInquiry,
}: {
  data: Record<string, any>;
  currentPage: string;
  goTo: (pageId: string) => void;
  openInquiry: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = [
    ["home", getValue(data, "navHome")],
    ["about", getValue(data, "navAbout")],
    ["services", getValue(data, "navServices")],
    ["work", getValue(data, "navWork")],
    ["insights", getValue(data, "navInsights")],
    ["contact", getValue(data, "navContact")],
  ];

  function handleNavigate(pageId: string) {
    goTo(pageId);
    setMobileOpen(false);
  }

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b border-[#00ff8833] bg-[#050505]/90 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate("home")}
          className="flex items-center gap-3 text-right"
        >
          <span className="grid h-11 w-11 border border-[#00ff88] bg-[#00ff88]/10 text-sm font-bold text-[#00ff88]">
            <TemplateText as="span" className="grid h-full w-full place-items-center">
              {getValue(data, "logoText")}
            </TemplateText>
          </span>
          <div className="text-right">
            <TemplateText as="div" className="text-lg font-bold uppercase tracking-[0.14em] text-[#f5f5f5]">
              {getValue(data, "brandName")}
            </TemplateText>
            <TemplateText as="div" className="text-[10px] uppercase tracking-[0.32em] text-[#00ff88]">
              {getValue(data, "tagline")}
            </TemplateText>
          </div>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map(([pageId, label]) => (
            <button
              key={pageId}
              type="button"
              onClick={() => handleNavigate(pageId)}
              className={cx(
                "border-b px-3 py-2 text-sm font-bold uppercase tracking-[0.16em] transition duration-300",
                currentPage === pageId
                  ? "border-[#00ff88] text-[#00ff88]"
                  : "border-transparent text-[#8f8f8f] hover:text-[#f5f5f5]",
              )}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SquareButton onClick={openInquiry} className="hidden sm:inline-flex">
            {getValue(data, "heroPrimaryButton")}
          </SquareButton>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 border border-[#00ff8833] text-[#f5f5f5] lg:hidden"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#00ff8833] bg-[#050505] px-5 pb-5 lg:hidden">
          <div className="grid gap-2 pt-4">
            {nav.map(([pageId, label]) => (
              <button
                key={pageId}
                type="button"
                onClick={() => handleNavigate(pageId)}
                className={cx(
                  "border px-4 py-3 text-right text-sm font-bold uppercase tracking-[0.14em] transition rounded-none",
                  currentPage === pageId
                    ? "border-[#00ff88] bg-[#00ff88] text-[#050505]"
                    : "border-[#00ff8833] text-[#f5f5f5]",
                )}
              >
                {label}
              </button>
            ))}
            <SquareButton
              onClick={() => {
                setMobileOpen(false);
                openInquiry();
              }}
            >
              {getValue(data, "heroPrimaryButton")}
            </SquareButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function InquiryModal({
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
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/75 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden border border-[#00ff8833] bg-[#0d0d0d] p-8 shadow-[0_0_50px_rgba(0,255,136,0.12)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#00ff88]" />
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 grid h-10 w-10 border border-[#00ff8833] text-lg text-[#f5f5f5]"
        >
          ×
        </button>
        <TemplateText as="p" className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#00ff88]">
          Mission Intake
        </TemplateText>
        <TemplateText as="h3" className="mt-4 text-3xl font-black uppercase text-[#f5f5f5]">
          {getValue(data, "contactTitle")}
        </TemplateText>
        <TemplateText as="p" className="mt-3 max-w-xl text-sm leading-7 text-[#9a9a9a]">
          {getValue(data, "contactText")}
        </TemplateText>
        <form className="mt-8 grid gap-0 border border-[#00ff8833]">
          {[
            "שם מלא / חברה",
            "אימייל עבודה",
            "יעד הפרויקט",
            "לוח זמנים רצוי",
          ].map((placeholder) => (
            <input
              key={placeholder}
              className="h-14 border-b border-[#00ff8833] bg-transparent px-5 text-right text-sm text-[#f5f5f5] outline-none placeholder:text-[#666]"
              placeholder={placeholder}
            />
          ))}
          <textarea
            className="min-h-32 bg-transparent px-5 py-4 text-right text-sm text-[#f5f5f5] outline-none placeholder:text-[#666]"
            placeholder="תיאור קצר של האתגר"
          />
          <button
            type="button"
            className="border-t border-[#00ff8833] bg-[#00ff88] px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#050505]"
          >
            {getValue(data, "contactButton")}
          </button>
        </form>
      </div>
    </div>
  );
}

function HeroSection({
  data,
  goTo,
  openInquiry,
}: {
  data: Record<string, any>;
  goTo: (pageId: string) => void;
  openInquiry: () => void;
}) {
  const stats = getStats(data).slice(0, 3);
  const heroCards = [
    ["Latency", getValue(data, "serviceOneTitle")],
    ["Pipeline", getValue(data, "serviceTwoTitle")],
    ["Signal", getValue(data, "serviceFourTitle")],
  ];

  return (
    <section className="relative overflow-hidden border-b border-[#00ff8833] px-5 pb-16 pt-14 lg:px-8 lg:pb-24 lg:pt-20">
      <div className="vertex-hero-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute -left-12 top-24 h-48 w-48 rotate-45 border border-[#00ff8833]" />
      <div className="pointer-events-none absolute bottom-16 right-[8%] h-28 w-28 border border-[#00ff88]" />

      <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10">
          <TemplateText
            as="p"
            editId="heroEyebrow"
            className="mb-5 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.36em] text-[#00ff88]"
          >
            <span className="h-px w-12 bg-[#00ff88]" />
            {getValue(data, "heroEyebrow")}
          </TemplateText>
          <TemplateText
            as="h1"
            editId="heroTitle"
            className="max-w-4xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.06em] text-[#f5f5f5] md:text-7xl lg:text-[5.25rem]"
          >
            {getValue(data, "heroTitle")}
          </TemplateText>
          <TemplateText
            as="p"
            editId="heroSubtitle"
            className="mt-7 max-w-2xl text-lg leading-8 text-[#9a9a9a]"
          >
            {getValue(data, "heroSubtitle")}
          </TemplateText>

          <div className="mt-10 flex flex-wrap gap-3">
            <SquareButton onClick={openInquiry}>{getValue(data, "heroPrimaryButton")}</SquareButton>
            <SquareButton kind="ghost" onClick={() => goTo("work")}>
              {getValue(data, "heroSecondaryButton")}
            </SquareButton>
          </div>

          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {heroCards.map(([label, value], index) => (
              <div
                key={label}
                className="border border-[#00ff8833] bg-[#0d0d0d]/80 px-4 py-4"
                style={{ clipPath: index === 1 ? "polygon(0 0, 100% 0, 100% 100%, 8% 100%)" : undefined }}
              >
                <TemplateText as="div" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00ff88]">
                  {label}
                </TemplateText>
                <TemplateText as="div" className="mt-2 text-sm font-bold uppercase text-[#f5f5f5]">
                  {value}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="absolute -right-5 -top-5 h-full w-full border border-[#00ff88]" />
          <div
            className="relative overflow-hidden border border-[#00ff8833] bg-[#0d0d0d]"
            style={{ clipPath: "polygon(13% 0, 100% 0, 100% 82%, 87% 100%, 0 100%, 0 18%)" }}
          >
            <img
              src={getValue(data, "heroImage")}
              alt={getValue(data, "brandName")}
              className="h-[420px] w-full object-cover md:h-[620px]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,255,136,0.18),transparent_36%,transparent_65%,rgba(0,0,0,0.5))]" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {stats.map(([value, label]) => (
              <div key={label} className="border border-[#00ff8833] bg-[#0d0d0d] px-4 py-4 text-right">
                <TemplateText as="div" className="text-3xl font-black text-[#00ff88]">
                  {value}
                </TemplateText>
                <TemplateText as="div" className="mt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-[#7e7e7e]">
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

function TelemetryStrip({ data }: { data: Record<string, any> }) {
  const stats = getStats(data);
  return (
    <section className="border-b border-[#00ff8833] bg-[#0b0b0b] px-5 py-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-px border border-[#00ff8833] bg-[#00ff8833] md:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="bg-[#050505] px-5 py-5">
            <TemplateText as="div" className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#00ff88]">
              {label}
            </TemplateText>
            <TemplateText as="div" className="mt-2 text-3xl font-black uppercase text-[#f5f5f5]">
              {value}
            </TemplateText>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutSection({ data }: { data: Record<string, any> }) {
  const promises = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
  ];

  return (
    <section className="border-b border-[#00ff8833] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SectionIntro
            eyebrow={getValue(data, "aboutEyebrow")}
            title={getValue(data, "aboutTitle")}
            text={getValue(data, "aboutText")}
          />
          <div className="mt-10 grid gap-px border border-[#00ff8833] bg-[#00ff8833]">
            {promises.map(([title, text], index) => (
              <div key={title} className="grid gap-4 bg-[#050505] px-5 py-5 md:grid-cols-[120px_1fr]">
                <TemplateText as="div" className="text-sm font-black uppercase tracking-[0.28em] text-[#00ff88]">
                  0{index + 1} / {title}
                </TemplateText>
                <TemplateText as="p" className="text-sm leading-7 text-[#9a9a9a]">
                  {text}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -bottom-5 -left-5 h-32 w-32 border border-[#00ff88]" />
          <div className="overflow-hidden border border-[#00ff8833] bg-[#0d0d0d]">
            <img
              src={getValue(data, "aboutImage")}
              alt={getValue(data, "aboutTitle")}
              className="h-[520px] w-full object-cover"
            />
          </div>
          <div className="mt-4 grid gap-px border border-[#00ff8833] bg-[#00ff8833] md:grid-cols-2">
            <div className="bg-[#050505] px-5 py-4">
              <TemplateText as="div" className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#00ff88]">
                Operating Mode
              </TemplateText>
              <TemplateText as="div" className="mt-2 text-sm font-bold uppercase text-[#f5f5f5]">
                {getValue(data, "processTitle")}
              </TemplateText>
            </div>
            <div className="bg-[#050505] px-5 py-4">
              <TemplateText as="div" className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#00ff88]">
                Active Relay
              </TemplateText>
              <TemplateText as="div" className="mt-2 text-sm font-bold uppercase text-[#f5f5f5]">
                {getValue(data, "tagline")}
              </TemplateText>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({
  data,
  openInquiry,
}: {
  data: Record<string, any>;
  openInquiry: () => void;
}) {
  const services = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
  ];

  return (
    <section className="border-b border-[#00ff8833] bg-[#080808] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow={getValue(data, "servicesEyebrow")}
          title={getValue(data, "servicesTitle")}
          align="center"
        />
        <div className="mt-12 grid gap-px border border-[#00ff8833] bg-[#00ff8833] md:grid-cols-2 xl:grid-cols-4">
          {services.map(([title, text], index) => (
            <article key={title} className="flex h-full flex-col bg-[#050505] p-6">
              <TemplateText as="div" className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#00ff88]">
                Node 0{index + 1}
              </TemplateText>
              <TemplateText as="h3" className="mt-5 text-2xl font-black uppercase leading-tight text-[#f5f5f5]">
                {title}
              </TemplateText>
              <TemplateText as="p" className="mt-4 flex-1 text-sm leading-7 text-[#9a9a9a]">
                {text}
              </TemplateText>
              <button
                type="button"
                onClick={openInquiry}
                className="mt-8 border border-[#00ff8833] px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.26em] text-[#00ff88] transition hover:border-[#00ff88]"
              >
                Brief / Start
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkSection({ data }: { data: Record<string, any> }) {
  const works = [
    {
      title: getValue(data, "workOneTitle"),
      text: getValue(data, "workOneText"),
      image: getValue(data, "heroImage"),
      span: "lg:col-span-7",
    },
    {
      title: getValue(data, "workTwoTitle"),
      text: getValue(data, "workTwoText"),
      image: getValue(data, "aboutImage"),
      span: "lg:col-span-5",
    },
    {
      title: getValue(data, "workThreeTitle"),
      text: getValue(data, "workThreeText"),
      image: getValue(data, "heroImage"),
      span: "lg:col-span-12",
    },
  ];

  return (
    <section className="border-b border-[#00ff8833] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow={getValue(data, "workEyebrow")}
          title={getValue(data, "workTitle")}
          text={getValue(data, "ctaText")}
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {works.map((work, index) => (
            <article
              key={work.title + index}
              className={cx("group relative overflow-hidden border border-[#00ff8833] bg-[#0d0d0d]", work.span)}
            >
              <img
                src={work.image}
                alt={work.title}
                className={cx(
                  "w-full object-cover transition duration-700 group-hover:scale-[1.03]",
                  index === 2 ? "h-[300px] md:h-[360px]" : "h-[420px]",
                )}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.88),rgba(0,0,0,0.18),transparent)]" />
              <div className="absolute inset-x-0 bottom-0 grid gap-3 p-6 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <TemplateText as="div" className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#00ff88]">
                    Deployment 0{index + 1}
                  </TemplateText>
                  <TemplateText as="h3" className="mt-3 text-3xl font-black uppercase text-[#f5f5f5]">
                    {work.title}
                  </TemplateText>
                  <TemplateText as="p" className="mt-3 max-w-2xl text-sm leading-7 text-[#c7c7c7]">
                    {work.text}
                  </TemplateText>
                </div>
                <span className="border border-[#00ff88] px-4 py-3 text-xs font-bold uppercase tracking-[0.26em] text-[#00ff88]">
                  Execute ↗
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightsSection({ data }: { data: Record<string, any> }) {
  const insightCards = [
    [getValue(data, "insightOneTitle"), getValue(data, "insightOneText")],
    [getValue(data, "insightTwoTitle"), getValue(data, "insightTwoText")],
    [getValue(data, "processTitle"), getValue(data, "ctaText")],
  ];

  return (
    <section className="border-b border-[#00ff8833] bg-[#070707] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow={getValue(data, "insightsEyebrow")}
          title={getValue(data, "insightsTitle")}
          align="center"
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-[0.95fr_1.05fr_0.8fr]">
          {insightCards.map(([title, text], index) => (
            <article
              key={title + index}
              className={cx(
                "border border-[#00ff8833] bg-[#050505] p-6",
                index === 1 ? "lg:translate-y-8" : "",
              )}
            >
              <TemplateText as="div" className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#00ff88]">
                Insight Vector 0{index + 1}
              </TemplateText>
              <TemplateText as="h3" className="mt-5 text-2xl font-black uppercase leading-tight text-[#f5f5f5]">
                {title}
              </TemplateText>
              <TemplateText as="p" className="mt-4 text-sm leading-7 text-[#9a9a9a]">
                {text}
              </TemplateText>
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
    [getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];

  return (
    <section className="border-b border-[#00ff8833] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow={getValue(data, "processEyebrow")}
          title={getValue(data, "processTitle")}
          text={getValue(data, "aboutText")}
        />
        <div className="mt-12 grid gap-px border border-[#00ff8833] bg-[#00ff8833] lg:grid-cols-4">
          {steps.map(([title, text], index) => (
            <div key={title} className="bg-[#050505] p-6">
              <TemplateText as="div" className="text-5xl font-black text-[#00ff88]">
                0{index + 1}
              </TemplateText>
              <TemplateText as="h3" className="mt-5 text-2xl font-black uppercase text-[#f5f5f5]">
                {title}
              </TemplateText>
              <TemplateText as="p" className="mt-4 text-sm leading-7 text-[#9a9a9a]">
                {text}
              </TemplateText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({
  data,
  openInquiry,
}: {
  data: Record<string, any>;
  openInquiry: () => void;
}) {
  const info = [
    ["Phone", getValue(data, "phone")],
    ["Email", getValue(data, "email")],
    ["Location", getValue(data, "address")],
  ];

  return (
    <section className="border-b border-[#00ff8833] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-px border border-[#00ff8833] bg-[#00ff8833] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="bg-[#050505] p-8 lg:p-10">
          <SectionIntro
            eyebrow={getValue(data, "contactEyebrow")}
            title={getValue(data, "contactTitle")}
            text={getValue(data, "contactText")}
          />
          <div className="mt-10 grid gap-px border border-[#00ff8833] bg-[#00ff8833]">
            {info.map(([label, value]) => (
              <div key={label} className="bg-[#0d0d0d] px-5 py-4">
                <TemplateText as="div" className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#00ff88]">
                  {label}
                </TemplateText>
                <TemplateText as="div" className="mt-2 text-base font-bold text-[#f5f5f5]">
                  {value}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>
        <form className="grid gap-0 bg-[#0b0b0b]">
          {[
            "שם מלא",
            "אימייל",
            "חברה",
            "מטרת הפרויקט",
          ].map((placeholder) => (
            <input
              key={placeholder}
              className="h-16 border-b border-[#00ff8833] bg-transparent px-5 text-right text-sm text-[#f5f5f5] outline-none placeholder:text-[#666]"
              placeholder={placeholder}
            />
          ))}
          <textarea
            className="min-h-40 border-b border-[#00ff8833] bg-transparent px-5 py-4 text-right text-sm text-[#f5f5f5] outline-none placeholder:text-[#666]"
            placeholder="ספרו לנו מה צריך להיבנות, להשתפר או להשתלב."
          />
          <div className="p-5">
            <SquareButton onClick={openInquiry} className="w-full justify-center">
              {getValue(data, "contactButton")}
            </SquareButton>
          </div>
        </form>
      </div>
    </section>
  );
}

function FooterSection({
  data,
  goTo,
  openInquiry,
}: {
  data: Record<string, any>;
  goTo: (pageId: string) => void;
  openInquiry: () => void;
}) {
  return (
    <footer className="px-5 py-12 lg:px-8">
      <div className="mx-auto border border-[#00ff8833] bg-[#0b0b0b] p-8 lg:max-w-7xl lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <TemplateText as="p" className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#00ff88]">
              Vertex Control Layer
            </TemplateText>
            <TemplateText as="h2" className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[0.92] text-[#f5f5f5] md:text-6xl">
              {getValue(data, "ctaTitle")}
            </TemplateText>
            <TemplateText as="p" className="mt-5 max-w-2xl text-lg leading-8 text-[#9a9a9a]">
              {getValue(data, "ctaText")}
            </TemplateText>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <SquareButton onClick={openInquiry}>{getValue(data, "ctaButton")}</SquareButton>
            <SquareButton kind="ghost" onClick={() => goTo("services")}>
              {getValue(data, "navServices")}
            </SquareButton>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-4 border-t border-[#00ff8833] pt-8 text-sm text-[#7f7f7f] md:flex-row md:items-center md:justify-between">
        <TemplateText as="p">
          © {new Date().getFullYear()} {getValue(data, "brandName")}
        </TemplateText>
        <TemplateText as="p">{getValue(data, "footerText")}</TemplateText>
      </div>
    </footer>
  );
}

function HomePage({
  data,
  goTo,
  openInquiry,
}: {
  data: Record<string, any>;
  goTo: (pageId: string) => void;
  openInquiry: () => void;
}) {
  return (
    <>
      <HeroSection data={data} goTo={goTo} openInquiry={openInquiry} />
      <TelemetryStrip data={data} />
      <AboutSection data={data} />
      <ServicesSection data={data} openInquiry={openInquiry} />
      <WorkSection data={data} />
      <InsightsSection data={data} />
      <ProcessSection data={data} />
      <ContactSection data={data} openInquiry={openInquiry} />
      <FooterSection data={data} goTo={goTo} openInquiry={openInquiry} />
    </>
  );
}

function InnerPage({
  data,
  type,
  goTo,
  openInquiry,
}: {
  data: Record<string, any>;
  type: string;
  goTo: (pageId: string) => void;
  openInquiry: () => void;
}) {
  const pageMap: Record<string, React.ReactNode> = {
    about: (
      <>
        <AboutSection data={data} />
        <ProcessSection data={data} />
      </>
    ),
    services: (
      <>
        <ServicesSection data={data} openInquiry={openInquiry} />
        <WorkSection data={data} />
      </>
    ),
    work: (
      <>
        <WorkSection data={data} />
        <TelemetryStrip data={data} />
      </>
    ),
    insights: (
      <>
        <InsightsSection data={data} />
        <ProcessSection data={data} />
      </>
    ),
    contact: <ContactSection data={data} openInquiry={openInquiry} />,
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-[#00ff8833] px-5 py-20 lg:px-8 lg:py-28">
        <div className="vertex-hero-grid pointer-events-none absolute inset-0 opacity-20" />
        <div className="pointer-events-none absolute left-[10%] top-0 h-full w-px bg-[#00ff8833]" />
        <div className="mx-auto max-w-7xl">
          <TemplateText as="p" className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#00ff88]">
            {getValue(data, "brandName")}
          </TemplateText>
          <TemplateText as="h1" className="mt-5 max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-[#f5f5f5] md:text-7xl">
            {getPageTitle(data, type)}
          </TemplateText>
        </div>
      </section>

      {pageMap[type] ?? null}

      <FooterSection data={data} goTo={goTo} openInquiry={openInquiry} />
    </>
  );
}

export default function VertexPages({
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
}: VertexPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...vertexDefaultData,
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
    { allowedPages: vertexAllowedPages, fallbackPage: "home" },
  );
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "vertex-preview" : "vertex"}
      className="min-h-screen w-full overflow-x-hidden bg-[#050505] text-[#f5f5f5] rounded-none"
      style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
    >
      <style>{scopedVertexEditorCss}</style>

      <VertexHeader
        data={mergedData}
        currentPage={currentPage}
        goTo={goTo}
        openInquiry={() => setInquiryOpen(true)}
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
                openInquiry={() => setInquiryOpen(true)}
              />
            ),
          },
          ...vertexPages
            .filter((pageItem) => pageItem.id !== "home")
            .map((pageItem) => ({
              id: pageItem.id,
              content: (
                <InnerPage
                  data={mergedData}
                  type={pageItem.id}
                  goTo={goTo}
                  openInquiry={() => setInquiryOpen(true)}
                />
              ),
            })),
        ]}
      />

      <InquiryModal
        data={mergedData}
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </div>
  );
}
