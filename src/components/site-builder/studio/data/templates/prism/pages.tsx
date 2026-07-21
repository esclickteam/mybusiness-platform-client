import React, { useMemo, useState } from "react";

import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { TemplateText } from "../shared/TemplateText";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { prismDefaultData } from "./defaultData";
import { prismEditorCss } from "./editorCss";

export const prismPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const prismAllowedPages = prismPages.map((page) => page.id);
const PRISM_RED = "#ff0033";
const PRISM_BLUE = "#0057ff";
const PRISM_YELLOW = "#ffcc00";

type PrismPagesProps = {
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
  return data?.[key] ?? (prismDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function extendEditorCss(templateId: string, css: string) {
  const liveSelector = `[data-template-id="${templateId}"]`;
  const previewSelector = `[data-template-id="${templateId}-preview"]`;
  return css.split(liveSelector).join(`${liveSelector}, ${previewSelector}`);
}

function getPageTitle(data: Record<string, any>, type: string) {
  const keyMap: Record<string, string> = {
    about: "navAbout",
    services: "navServices",
    work: "navWork",
    insights: "navInsights",
    contact: "navContact",
  };
  return getValue(data, keyMap[type] || "brandName");
}

function PrismButton({
  children,
  onClick,
  variant = "blue",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "blue" | "red" | "ghost";
  className?: string;
}) {
  const styles =
    variant === "blue"
      ? "border-black bg-[#0057ff] text-white hover:bg-[#1f6cff]"
      : variant === "red"
        ? "border-black bg-[#ff0033] text-white hover:bg-[#ff2955]"
        : "border-black bg-transparent text-black hover:bg-black hover:text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center justify-center border px-6 py-3 text-xs font-black uppercase tracking-[0.24em] transition duration-300",
        styles,
        className,
      )}
    >
      {children}
    </button>
  );
}

function PrismHeading({
  data,
  eyebrowKey,
  titleKey,
  textKey,
  center = false,
}: {
  data: Record<string, any>;
  eyebrowKey: string;
  titleKey: string;
  textKey?: string;
  center?: boolean;
}) {
  return (
    <div className={cx("max-w-3xl", center ? "mx-auto text-center" : "text-right")}>
      <TemplateText
        as="p"
        editId={eyebrowKey}
        editLabel={eyebrowKey}
        className="mb-4 text-[11px] font-black uppercase tracking-[0.38em] text-[#0057ff]"
      >
        {getValue(data, eyebrowKey)}
      </TemplateText>
      <TemplateText
        as="h2"
        editId={titleKey}
        editLabel={titleKey}
        className="text-4xl font-black uppercase leading-[0.9] text-[#0a0a0a] md:text-5xl lg:text-6xl"
      >
        {getValue(data, titleKey)}
      </TemplateText>
      {textKey ? (
        <TemplateText
          as="p"
          editId={textKey}
          editLabel={textKey}
          className={cx(
            "mt-5 max-w-2xl text-base leading-8 text-[#4d4a43] md:text-lg",
            center && "mx-auto",
          )}
        >
          {getValue(data, textKey)}
        </TemplateText>
      ) : null}
    </div>
  );
}

function PrismHeader({
  data,
  currentPage,
  goTo,
}: {
  data: Record<string, any>;
  currentPage: string;
  goTo: (page: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = [
    ["home", "navHome"],
    ["about", "navAbout"],
    ["services", "navServices"],
    ["work", "navWork"],
    ["insights", "navInsights"],
    ["contact", "navContact"],
  ] as const;

  function navigate(pageId: string) {
    goTo(pageId);
    setMobileOpen(false);
  }

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b border-black/15 bg-[#fffef8]/95 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 md:px-8">
        <button type="button" onClick={() => navigate("home")} className="flex items-center gap-4 text-right">
          <span className="grid h-11 w-11 place-items-center border border-black bg-[#ffcc00] text-sm font-black uppercase text-black">
            <TemplateText as="span" editId="logoText" editLabel="logoText">
              {getValue(data, "logoText")}
            </TemplateText>
          </span>
          <div className="flex flex-col items-start">
            <TemplateText
              as="span"
              editId="brandName"
              editLabel="brandName"
              className="text-base font-black uppercase tracking-[0.26em] text-black md:text-lg"
            >
              {getValue(data, "brandName")}
            </TemplateText>
            <TemplateText
              as="span"
              editId="tagline"
              editLabel="tagline"
              className="text-[10px] font-black uppercase tracking-[0.34em] text-black/60"
            >
              {getValue(data, "tagline")}
            </TemplateText>
          </div>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map(([id, key], index) => (
            <button
              key={id}
              type="button"
              onClick={() => navigate(id)}
              className={cx(
                "border px-4 py-3 text-[11px] font-black uppercase tracking-[0.24em] transition",
                currentPage === id
                  ? index % 3 === 0
                    ? "border-black bg-[#ff0033] text-white"
                    : index % 3 === 1
                      ? "border-black bg-[#0057ff] text-white"
                      : "border-black bg-[#ffcc00] text-black"
                  : "border-transparent text-black hover:border-black hover:bg-white",
              )}
            >
              <TemplateText as="span" editId={key} editLabel={key}>
                {getValue(data, key)}
              </TemplateText>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <PrismButton onClick={() => navigate("contact")} className="hidden md:inline-flex">
            <TemplateText as="span" editId="heroPrimaryButton" editLabel="heroPrimaryButton">
              {getValue(data, "heroPrimaryButton")}
            </TemplateText>
          </PrismButton>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center border border-black text-lg text-black lg:hidden"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-black/15 bg-[#fffef8] px-5 py-4 lg:hidden">
          <div className="grid gap-2">
            {nav.map(([id, key], index) => (
              <button
                key={id}
                type="button"
                onClick={() => navigate(id)}
                className={cx(
                  "border px-4 py-3 text-right text-xs font-black uppercase tracking-[0.24em]",
                  currentPage === id
                    ? index % 3 === 0
                      ? "border-black bg-[#ff0033] text-white"
                      : index % 3 === 1
                        ? "border-black bg-[#0057ff] text-white"
                        : "border-black bg-[#ffcc00] text-black"
                    : "border-black/15 bg-white text-black",
                )}
              >
                <TemplateText as="span" editId={key} editLabel={key}>
                  {getValue(data, key)}
                </TemplateText>
              </button>
            ))}
            <PrismButton onClick={() => navigate("contact")}>
              <TemplateText as="span" editId="heroPrimaryButton" editLabel="heroPrimaryButton">
                {getValue(data, "heroPrimaryButton")}
              </TemplateText>
            </PrismButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function PrismHero({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  return (
    <section className="border-b border-black bg-[#fffef8]">
      <div className="mx-auto grid max-w-[1440px] gap-0 lg:grid-cols-[1fr_0.94fr]">
        <div className="prism-hero-grid relative border-b border-black px-5 py-14 md:px-8 md:py-20 lg:border-b-0 lg:border-l">
          <span className="absolute left-8 top-8 h-12 w-12 border border-black bg-[#ffcc00]" />
          <span className="absolute bottom-10 left-12 h-6 w-28 bg-[#ff0033]" />
          <TemplateText
            as="p"
            editId="heroEyebrow"
            editLabel="heroEyebrow"
            className="relative z-10 text-[11px] font-black uppercase tracking-[0.42em] text-[#0057ff]"
          >
            {getValue(data, "heroEyebrow")}
          </TemplateText>
          <TemplateText
            as="h1"
            editId="heroTitle"
            editLabel="heroTitle"
            className="relative z-10 mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.84] text-black md:text-7xl lg:text-[86px]"
          >
            {getValue(data, "heroTitle")}
          </TemplateText>
          <TemplateText
            as="p"
            editId="heroSubtitle"
            editLabel="heroSubtitle"
            className="relative z-10 mt-8 max-w-2xl text-base leading-8 text-[#4d4a43] md:text-lg"
          >
            {getValue(data, "heroSubtitle")}
          </TemplateText>
          <div className="relative z-10 mt-10 flex flex-wrap gap-3">
            <PrismButton onClick={() => goTo("contact")}>
              <TemplateText as="span" editId="heroPrimaryButton" editLabel="heroPrimaryButton">
                {getValue(data, "heroPrimaryButton")}
              </TemplateText>
            </PrismButton>
            <PrismButton variant="ghost" onClick={() => goTo("work")}>
              <TemplateText as="span" editId="heroSecondaryButton" editLabel="heroSecondaryButton">
                {getValue(data, "heroSecondaryButton")}
              </TemplateText>
            </PrismButton>
          </div>
        </div>

        <div className="grid min-h-[420px] grid-cols-3 lg:min-h-[620px]">
          {[
            { color: PRISM_RED, label: getValue(data, "brandName"), textClass: "text-white" },
            { color: PRISM_BLUE, label: getValue(data, "tagline"), textClass: "text-white" },
            { color: PRISM_YELLOW, label: "באוהאוס", textClass: "text-black" },
          ].map((column, index) => (
            <div
              key={`${column.label}-${index}`}
              className={cx(
                "flex flex-col justify-between border-l border-black p-5 md:p-7",
                index === 0 && "border-l-0",
              )}
              style={{ background: column.color }}
            >
              <div className={cx("text-[10px] font-black uppercase tracking-[0.34em]", column.textClass)}>
                0{index + 1}
              </div>
              <TemplateText
                as="div"
                className={cx("text-3xl font-black uppercase leading-none md:text-5xl", column.textClass)}
              >
                {column.label}
              </TemplateText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrismManifestoBand({ data }: { data: Record<string, any> }) {
  const items = [
    getValue(data, "brandName"),
    getValue(data, "tagline"),
    "צורה",
    "צבע",
    "מסר",
    "מערכת",
  ];

  return (
    <section className="overflow-hidden border-b border-black bg-white py-4">
      <div className="flex w-max items-center">
        {[...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="prism-marquee-item shrink-0 border-l border-black px-7 text-[11px] font-black uppercase tracking-[0.34em] text-[#0057ff]"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function PrismStatsBand({ data }: { data: Record<string, any> }) {
  const stats = [
    ["statOne", "statOneLabel", PRISM_RED],
    ["statTwo", "statTwoLabel", PRISM_BLUE],
    ["statThree", "statThreeLabel", PRISM_YELLOW],
    ["statFour", "statFourLabel", "#ffffff"],
  ] as const;

  return (
    <section className="border-b border-black bg-[#fffef8] px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto grid max-w-[1440px] gap-0 border border-black md:grid-cols-4">
        {stats.map(([valueKey, labelKey, background], index) => (
          <div
            key={valueKey}
            className={cx("px-6 py-8", index !== 0 && "border-t border-black md:border-r md:border-t-0")}
            style={{ background }}
          >
            <TemplateText
              as="div"
              editId={valueKey}
              editLabel={valueKey}
              className="text-4xl font-black uppercase text-black md:text-5xl"
            >
              {getValue(data, valueKey)}
            </TemplateText>
            <TemplateText
              as="div"
              editId={labelKey}
              editLabel={labelKey}
              className="mt-3 text-[11px] font-black uppercase tracking-[0.32em] text-black/70"
            >
              {getValue(data, labelKey)}
            </TemplateText>
            <p className="mt-4 text-sm leading-7 text-black/70">
              מערכת מותגית חדה, ריווח מדויק ושפה טיפוגרפית שמובילה את כל החוויה.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PrismAboutBand({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  return (
    <section className="border-b border-black bg-white px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-[1440px] gap-0 border border-black lg:grid-cols-[0.98fr_1.02fr]">
        <div className="relative border-b border-black px-6 py-10 md:px-10 lg:border-b-0 lg:border-l">
          <span className="absolute left-8 top-8 h-20 w-20 rounded-full border border-black bg-[#ffcc00]" />
          <span className="absolute bottom-10 left-10 h-16 w-16 bg-[#0057ff]" />
          <div className="relative z-10">
            <PrismHeading
              data={data}
              eyebrowKey="aboutEyebrow"
              titleKey="aboutTitle"
              textKey="aboutText"
            />
            <div className="mt-8 grid gap-3">
              {[
                "מותג נבנה דרך חוקים ברורים, לא דרך קישוטים מקריים.",
                "אנחנו מחברים קונספט, אתר ומסרים למערכת אחת עקבית.",
                "כל עמוד מדבר בשפה גרפית אחת עם היררכיה חדה.",
              ].map((item, index) => (
                <div key={item} className="grid grid-cols-[26px_1fr] items-start gap-4 border-t border-black pt-4">
                  <span
                    className="mt-1 h-4 w-4 border border-black"
                    style={{ background: index === 0 ? PRISM_RED : index === 1 ? PRISM_BLUE : PRISM_YELLOW }}
                  />
                  <TemplateText as="p" className="text-sm leading-7 text-[#4d4a43]">
                    {item}
                  </TemplateText>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <PrismButton variant="ghost" onClick={() => goTo("work")}>
                <TemplateText as="span" editId="navWork" editLabel="navWork">
                  {getValue(data, "navWork")}
                </TemplateText>
              </PrismButton>
            </div>
          </div>
        </div>
        <div className="min-h-[420px]">
          <img src={getValue(data, "aboutImage")} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function PrismServicesBand({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  const services = [
    ["serviceOneTitle", "serviceOneText", PRISM_RED],
    ["serviceTwoTitle", "serviceTwoText", PRISM_BLUE],
    ["serviceThreeTitle", "serviceThreeText", PRISM_YELLOW],
    ["serviceFourTitle", "serviceFourText", "#ffffff"],
  ] as const;

  return (
    <section className="border-b border-black bg-[#fffef8] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1440px]">
        <PrismHeading data={data} eyebrowKey="servicesEyebrow" titleKey="servicesTitle" center />
        <div className="mt-12 grid gap-0 border border-black md:grid-cols-2">
          {services.map(([titleKey, textKey, accent], index) => (
            <article
              key={titleKey}
              className={cx(
                "relative px-6 py-8 md:px-8 md:py-10",
                index > 1 && "border-t border-black",
                index % 2 === 1 && "md:border-r md:border-black",
              )}
            >
              <span className="absolute left-0 top-0 h-3 w-20 border-b border-r border-black" style={{ background: accent }} />
              <div className="text-[11px] font-black uppercase tracking-[0.32em] text-black/50">0{index + 1}</div>
              <TemplateText
                as="h3"
                editId={titleKey}
                editLabel={titleKey}
                className="mt-6 text-3xl font-black uppercase leading-tight text-black"
              >
                {getValue(data, titleKey)}
              </TemplateText>
              <TemplateText
                as="p"
                editId={textKey}
                editLabel={textKey}
                className="mt-4 max-w-xl text-sm leading-8 text-[#4d4a43] md:text-base"
              >
                {getValue(data, textKey)}
              </TemplateText>
              <div className="mt-8">
                <PrismButton variant={index % 2 === 0 ? "blue" : "red"} onClick={() => goTo("contact")}>
                  להתחיל פרויקט
                </PrismButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrismWorkBand({ data }: { data: Record<string, any> }) {
  const workItems = [
    ["workOneTitle", "workOneText", PRISM_RED],
    ["workTwoTitle", "workTwoText", PRISM_BLUE],
    ["workThreeTitle", "workThreeText", PRISM_YELLOW],
  ] as const;

  return (
    <section className="border-b border-black bg-white px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1440px]">
        <PrismHeading data={data} eyebrowKey="workEyebrow" titleKey="workTitle" />
        <div className="mt-12 grid gap-0 border border-black lg:grid-cols-3">
          {workItems.map(([titleKey, textKey, accent], index) => (
            <article
              key={titleKey}
              className={cx("flex flex-col", index !== 0 && "border-t border-black lg:border-r lg:border-t-0")}
            >
              <div className="border-b border-black px-6 py-5 text-[11px] font-black uppercase tracking-[0.32em] text-black/60">
                POSTER 0{index + 1}
              </div>
              <div className="flex-1 px-6 py-8">
                <div
                  className="mb-8 h-48 w-full border border-black"
                  style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent} 52%, #fffef8 52%, #fffef8 100%)` }}
                />
                <TemplateText
                  as="h3"
                  editId={titleKey}
                  editLabel={titleKey}
                  className="text-3xl font-black uppercase leading-tight text-black"
                >
                  {getValue(data, titleKey)}
                </TemplateText>
                <TemplateText
                  as="p"
                  editId={textKey}
                  editLabel={textKey}
                  className="mt-4 text-sm leading-8 text-[#4d4a43] md:text-base"
                >
                  {getValue(data, textKey)}
                </TemplateText>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrismProcessBand({ data }: { data: Record<string, any> }) {
  const steps = [
    ["processOneTitle", "processOneText", PRISM_RED],
    ["processTwoTitle", "processTwoText", PRISM_BLUE],
    ["processThreeTitle", "processThreeText", PRISM_YELLOW],
    ["processFourTitle", "processFourText", "#ffffff"],
  ] as const;

  return (
    <section className="border-b border-black bg-[#fffef8] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1440px]">
        <PrismHeading data={data} eyebrowKey="processEyebrow" titleKey="processTitle" />
        <div className="mt-12 grid gap-0 border border-black md:grid-cols-4">
          {steps.map(([titleKey, textKey, background], index) => (
            <div
              key={titleKey}
              className={cx("px-6 py-8", index !== 0 && "border-t border-black md:border-r md:border-t-0")}
              style={{ background }}
            >
              <div className="text-5xl font-black text-black">0{index + 1}</div>
              <TemplateText
                as="h3"
                editId={titleKey}
                editLabel={titleKey}
                className="mt-6 text-2xl font-black uppercase text-black"
              >
                {getValue(data, titleKey)}
              </TemplateText>
              <TemplateText
                as="p"
                editId={textKey}
                editLabel={textKey}
                className="mt-4 text-sm leading-7 text-[#4d4a43]"
              >
                {getValue(data, textKey)}
              </TemplateText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrismInsightsBand({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  const insights = [
    ["insightOneTitle", "insightOneText", "הערה 01", PRISM_RED],
    ["insightTwoTitle", "insightTwoText", "הערה 02", PRISM_BLUE],
  ] as const;

  return (
    <section className="border-b border-black bg-white px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1440px]">
        <PrismHeading data={data} eyebrowKey="insightsEyebrow" titleKey="insightsTitle" />
        <div className="mt-12 grid gap-0 border border-black lg:grid-cols-[1fr_1fr_0.72fr]">
          {insights.map(([titleKey, textKey, tag, accent], index) => (
            <article
              key={titleKey}
              className={cx("px-6 py-8", index !== 0 && "border-t border-black lg:border-r lg:border-t-0")}
            >
              <div
                className="inline-flex border border-black px-3 py-2 text-[11px] font-black uppercase tracking-[0.28em]"
                style={{ background: accent, color: "#fff" }}
              >
                {tag}
              </div>
              <TemplateText
                as="h3"
                editId={titleKey}
                editLabel={titleKey}
                className="mt-6 text-2xl font-black uppercase leading-tight text-black"
              >
                {getValue(data, titleKey)}
              </TemplateText>
              <TemplateText
                as="p"
                editId={textKey}
                editLabel={textKey}
                className="mt-4 text-sm leading-8 text-[#4d4a43]"
              >
                {getValue(data, textKey)}
              </TemplateText>
            </article>
          ))}
          <div className="border-t border-black bg-[#fffef8] px-6 py-8 lg:border-r lg:border-t-0">
            <div className="text-[11px] font-black uppercase tracking-[0.32em] text-black/60">EDITORIAL</div>
            <TemplateText as="p" className="mt-6 text-3xl font-black uppercase leading-tight text-black">
              מסר ברור נבנה דרך ניגוד, קצב וחזרתיות.
            </TemplateText>
            <TemplateText as="p" className="mt-4 text-sm leading-8 text-[#4d4a43]">
              כל רכיב ויזואלי בתבנית ממוקם כדי לחזק היררכיה, זכירות ותנועה בין עמודים.
            </TemplateText>
            <div className="mt-8">
              <PrismButton variant="ghost" onClick={() => goTo("insights")}>
                <TemplateText as="span" editId="navInsights" editLabel="navInsights">
                  {getValue(data, "navInsights")}
                </TemplateText>
              </PrismButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrismContactBand({ data }: { data: Record<string, any> }) {
  const info = [
    ["טלפון", "phone", PRISM_RED],
    ["אימייל", "email", PRISM_BLUE],
    ["כתובת", "address", PRISM_YELLOW],
  ] as const;

  return (
    <section className="border-b border-black bg-[#fffef8] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-[1440px] gap-0 border border-black lg:grid-cols-[0.92fr_1.08fr]">
        <div className="bg-white px-6 py-10 md:px-10">
          <PrismHeading
            data={data}
            eyebrowKey="contactEyebrow"
            titleKey="contactTitle"
            textKey="contactText"
          />
          <div className="mt-8 space-y-0 border border-black">
            {info.map(([label, valueKey, accent], index) => (
              <div
                key={valueKey}
                className={cx(
                  "grid gap-2 px-5 py-4 md:grid-cols-[110px_1fr]",
                  index !== 0 && "border-t border-black",
                )}
              >
                <div className="text-[11px] font-black uppercase tracking-[0.32em]" style={{ color: accent }}>
                  {label}
                </div>
                <TemplateText
                  as="div"
                  editId={valueKey}
                  editLabel={valueKey}
                  className="text-sm font-bold text-black md:text-base"
                >
                  {getValue(data, valueKey)}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>

        <form className="grid gap-4 border-t border-black bg-[#fffef8] px-6 py-10 md:px-10 lg:border-r lg:border-t-0">
          <input
            className="border border-black bg-white px-4 py-4 text-right text-sm text-black outline-none placeholder:text-black/45 focus:bg-[#fffdf2]"
            placeholder="שם מלא"
          />
          <input
            className="border border-black bg-white px-4 py-4 text-right text-sm text-black outline-none placeholder:text-black/45 focus:bg-[#fffdf2]"
            placeholder="טלפון"
          />
          <input
            className="border border-black bg-white px-4 py-4 text-right text-sm text-black outline-none placeholder:text-black/45 focus:bg-[#fffdf2]"
            placeholder="אימייל"
          />
          <textarea
            className="min-h-36 border border-black bg-white px-4 py-4 text-right text-sm text-black outline-none placeholder:text-black/45 focus:bg-[#fffdf2]"
            placeholder="ספרו על המותג או הפרויקט"
          />
          <PrismButton className="w-full justify-center">
            <TemplateText as="span" editId="contactButton" editLabel="contactButton">
              {getValue(data, "contactButton")}
            </TemplateText>
          </PrismButton>
        </form>
      </div>
    </section>
  );
}

function PrismFooterBand({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  return (
    <footer className="bg-[#fffef8] px-5 py-10 md:px-8">
      <div className="prism-accent-bar h-4 w-full border border-b-0 border-black" />
      <div className="mx-auto border border-black px-6 py-10 md:max-w-[1440px] md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <TemplateText
              as="p"
              editId="brandName"
              editLabel="brandName"
              className="text-[11px] font-black uppercase tracking-[0.38em] text-[#ff0033]"
            >
              {getValue(data, "brandName")}
            </TemplateText>
            <TemplateText
              as="h2"
              editId="ctaTitle"
              editLabel="ctaTitle"
              className="mt-4 text-4xl font-black uppercase leading-[0.9] text-black md:text-5xl"
            >
              {getValue(data, "ctaTitle")}
            </TemplateText>
            <TemplateText
              as="p"
              editId="ctaText"
              editLabel="ctaText"
              className="mt-5 max-w-2xl text-base leading-8 text-[#4d4a43]"
            >
              {getValue(data, "ctaText")}
            </TemplateText>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <PrismButton onClick={() => goTo("contact")}>
              <TemplateText as="span" editId="ctaButton" editLabel="ctaButton">
                {getValue(data, "ctaButton")}
              </TemplateText>
            </PrismButton>
            <PrismButton variant="ghost" onClick={() => goTo("services")}>
              <TemplateText as="span" editId="navServices" editLabel="navServices">
                {getValue(data, "navServices")}
              </TemplateText>
            </PrismButton>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-black pt-6 text-xs font-black uppercase tracking-[0.24em] text-black/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {getValue(data, "brandName")}
          </p>
          <TemplateText as="p" editId="footerText" editLabel="footerText">
            {getValue(data, "footerText")}
          </TemplateText>
        </div>
      </div>
    </footer>
  );
}

function PrismPageIntro({
  data,
  type,
}: {
  data: Record<string, any>;
  type: string;
}) {
  return (
    <section className="border-b border-black bg-[#fffef8] px-5 py-16 md:px-8 md:py-24">
      <div className="prism-hero-grid mx-auto max-w-[1440px] border border-black bg-white px-6 py-12 md:px-10 md:py-16">
        <TemplateText
          as="p"
          editId="brandName"
          editLabel="brandName"
          className="text-[11px] font-black uppercase tracking-[0.38em] text-[#0057ff]"
        >
          {getValue(data, "brandName")}
        </TemplateText>
        <h1 className="mt-5 text-5xl font-black uppercase leading-[0.88] text-black md:text-7xl">
          {getPageTitle(data, type)}
        </h1>
      </div>
    </section>
  );
}

function PrismHomePage({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  return (
    <>
      <PrismHero data={data} goTo={goTo} />
      <PrismManifestoBand data={data} />
      <PrismStatsBand data={data} />
      <PrismAboutBand data={data} goTo={goTo} />
      <PrismServicesBand data={data} goTo={goTo} />
      <PrismWorkBand data={data} />
      <PrismProcessBand data={data} />
      <PrismInsightsBand data={data} goTo={goTo} />
      <PrismContactBand data={data} />
      <PrismFooterBand data={data} goTo={goTo} />
    </>
  );
}

function PrismInnerPage({
  data,
  type,
  goTo,
}: {
  data: Record<string, any>;
  type: string;
  goTo: (page: string) => void;
}) {
  const pageMap: Record<string, React.ReactNode> = {
    about: (
      <>
        <PrismAboutBand data={data} goTo={goTo} />
        <PrismStatsBand data={data} />
        <PrismProcessBand data={data} />
      </>
    ),
    services: (
      <>
        <PrismServicesBand data={data} goTo={goTo} />
        <PrismProcessBand data={data} />
        <PrismContactBand data={data} />
      </>
    ),
    work: (
      <>
        <PrismWorkBand data={data} />
        <PrismAboutBand data={data} goTo={goTo} />
      </>
    ),
    insights: (
      <>
        <PrismInsightsBand data={data} goTo={goTo} />
        <PrismManifestoBand data={data} />
      </>
    ),
    contact: <PrismContactBand data={data} />,
  };

  return (
    <>
      <PrismPageIntro data={data} type={type} />
      {pageMap[type] ?? null}
      <PrismFooterBand data={data} goTo={goTo} />
    </>
  );
}

export default function PrismPages({
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
}: PrismPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...prismDefaultData,
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
    { allowedPages: prismAllowedPages, fallbackPage: "home" },
  );

  const scopedEditorCss = useMemo(() => extendEditorCss("prism", prismEditorCss), []);

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "prism-preview" : "prism"}
      className="min-h-screen w-full overflow-x-hidden bg-[#fffef8] text-[#0a0a0a]"
      style={{ fontFamily: '"Arial Black", "Helvetica Neue", Arial, sans-serif' }}
    >
      <style>{scopedEditorCss}</style>
      <PrismHeader data={mergedData} currentPage={currentPage} goTo={goTo} />

      <VisualPageStack
        activePageId={currentPage}
        pages={[
          {
            id: "home",
            content: <PrismHomePage data={mergedData} goTo={goTo} />,
          },
          ...prismPages
            .filter((item) => item.id !== "home")
            .map((item) => ({
              id: item.id,
              content: <PrismInnerPage data={mergedData} type={item.id} goTo={goTo} />,
            })),
        ]}
      />
    </div>
  );
}
