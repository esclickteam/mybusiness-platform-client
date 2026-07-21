import React, { useMemo, useState } from "react";

import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { TemplateText } from "../shared/TemplateText";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { steelworksDefaultData } from "./defaultData";
import { steelworksEditorCss } from "./editorCss";

export const steelworksPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const steelworksAllowedPages = steelworksPages.map((page) => page.id);

type SteelworksPagesProps = {
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
  return data?.[key] ?? (steelworksDefaultData as Record<string, any>)[key] ?? "";
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

function SteelButton({
  children,
  onClick,
  variant = "accent",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "accent" | "ghost" | "line";
  className?: string;
}) {
  const styles =
    variant === "accent"
      ? "bg-[#ff6b2c] text-[#111111] hover:bg-[#ff844f]"
      : variant === "ghost"
        ? "bg-transparent text-[#f3f0ea] hover:bg-white/8"
        : "border border-white/15 bg-transparent text-[#f3f0ea] hover:border-[#ff6b2c]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center justify-center border border-transparent px-6 py-3 text-xs font-black uppercase tracking-[0.24em] transition duration-300",
        styles,
        className,
      )}
    >
      {children}
    </button>
  );
}

function BandHeading({
  data,
  eyebrowKey,
  titleKey,
  textKey,
  center = false,
  invert = false,
}: {
  data: Record<string, any>;
  eyebrowKey: string;
  titleKey: string;
  textKey?: string;
  center?: boolean;
  invert?: boolean;
}) {
  return (
    <div className={cx("max-w-3xl", center ? "mx-auto text-center" : "text-right")}>
      <TemplateText
        as="p"
        editId={eyebrowKey}
        editLabel={eyebrowKey}
        className={cx(
          "mb-4 text-[11px] font-black uppercase tracking-[0.38em]",
          invert ? "text-[#ff9a6a]" : "text-[#ff6b2c]",
        )}
      >
        {getValue(data, eyebrowKey)}
      </TemplateText>
      <TemplateText
        as="h2"
        editId={titleKey}
        editLabel={titleKey}
        className={cx(
          "text-4xl font-black uppercase leading-[0.95] md:text-5xl lg:text-6xl",
          invert ? "text-[#f3f0ea]" : "text-[#111111]",
        )}
      >
        {getValue(data, titleKey)}
      </TemplateText>
      {textKey ? (
        <TemplateText
          as="p"
          editId={textKey}
          editLabel={textKey}
          className={cx(
            "mt-5 max-w-2xl text-base leading-8 md:text-lg",
            invert ? "text-[#b7b0a6]" : "text-[#3f3a34]",
            center && "mx-auto",
          )}
        >
          {getValue(data, textKey)}
        </TemplateText>
      ) : null}
    </div>
  );
}

function SteelHeader({
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
      className="sticky top-0 z-50 border-b border-white/10 bg-[#111111]/95 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 md:px-8">
        <button type="button" onClick={() => navigate("home")} className="flex items-center gap-4 text-right">
          <span className="grid h-11 w-11 place-items-center border border-[#ff6b2c] bg-[#1a1a1a] text-sm font-black uppercase text-[#ff6b2c]">
            <TemplateText as="span" editId="logoText" editLabel="logoText">
              {getValue(data, "logoText")}
            </TemplateText>
          </span>
          <div className="flex flex-col items-start">
            <TemplateText
              as="span"
              editId="brandName"
              editLabel="brandName"
              className="text-base font-black uppercase tracking-[0.24em] text-[#f3f0ea] md:text-lg"
            >
              {getValue(data, "brandName")}
            </TemplateText>
            <TemplateText
              as="span"
              editId="tagline"
              editLabel="tagline"
              className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#8f8578]"
            >
              {getValue(data, "tagline")}
            </TemplateText>
          </div>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map(([id, key]) => (
            <button
              key={id}
              type="button"
              onClick={() => navigate(id)}
              className={cx(
                "border px-4 py-3 text-[11px] font-black uppercase tracking-[0.24em] transition",
                currentPage === id
                  ? "border-[#ff6b2c] bg-[#ff6b2c] text-[#111111]"
                  : "border-transparent text-[#f3f0ea] hover:border-white/10 hover:bg-white/5",
              )}
            >
              <TemplateText as="span" editId={key} editLabel={key}>
                {getValue(data, key)}
              </TemplateText>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SteelButton onClick={() => navigate("contact")} className="hidden md:inline-flex">
            <TemplateText as="span" editId="heroPrimaryButton" editLabel="heroPrimaryButton">
              {getValue(data, "heroPrimaryButton")}
            </TemplateText>
          </SteelButton>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center border border-white/10 text-lg text-[#f3f0ea] lg:hidden"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#151515] px-5 py-4 lg:hidden">
          <div className="grid gap-2">
            {nav.map(([id, key]) => (
              <button
                key={id}
                type="button"
                onClick={() => navigate(id)}
                className={cx(
                  "border px-4 py-3 text-right text-xs font-black uppercase tracking-[0.24em]",
                  currentPage === id
                    ? "border-[#ff6b2c] bg-[#ff6b2c] text-[#111111]"
                    : "border-white/10 text-[#f3f0ea]",
                )}
              >
                <TemplateText as="span" editId={key} editLabel={key}>
                  {getValue(data, key)}
                </TemplateText>
              </button>
            ))}
            <SteelButton onClick={() => navigate("contact")}>
              <TemplateText as="span" editId="heroPrimaryButton" editLabel="heroPrimaryButton">
                {getValue(data, "heroPrimaryButton")}
              </TemplateText>
            </SteelButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function SteelHero({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  return (
    <section className="relative min-h-[78vh] overflow-hidden border-b border-white/10">
      <img
        src={getValue(data, "heroImage")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,12,12,0.9)_0%,rgba(12,12,12,0.74)_48%,rgba(12,12,12,0.38)_100%)]" />
      <div className="steelworks-hero-grid absolute inset-0 opacity-40" />
      <div className="relative mx-auto flex min-h-[78vh] max-w-[1440px] items-end px-5 pb-24 pt-20 md:px-8">
        <div className="max-w-4xl">
          <TemplateText
            as="p"
            editId="heroEyebrow"
            editLabel="heroEyebrow"
            className="mb-6 text-[11px] font-black uppercase tracking-[0.42em] text-[#ff9a6a]"
          >
            {getValue(data, "heroEyebrow")}
          </TemplateText>
          <TemplateText
            as="h1"
            editId="heroTitle"
            editLabel="heroTitle"
            className="max-w-4xl text-5xl font-black uppercase leading-[0.88] text-[#f3f0ea] md:text-7xl lg:text-[88px]"
          >
            {getValue(data, "heroTitle")}
          </TemplateText>
          <TemplateText
            as="p"
            editId="heroSubtitle"
            editLabel="heroSubtitle"
            className="mt-8 max-w-2xl text-base leading-8 text-[#d0c8bd] md:text-lg"
          >
            {getValue(data, "heroSubtitle")}
          </TemplateText>
          <div className="mt-10 flex flex-wrap gap-3">
            <SteelButton onClick={() => goTo("contact")}>
              <TemplateText as="span" editId="heroPrimaryButton" editLabel="heroPrimaryButton">
                {getValue(data, "heroPrimaryButton")}
              </TemplateText>
            </SteelButton>
            <SteelButton variant="line" onClick={() => goTo("work")}>
              <TemplateText as="span" editId="heroSecondaryButton" editLabel="heroSecondaryButton">
                {getValue(data, "heroSecondaryButton")}
              </TemplateText>
            </SteelButton>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0">
        <div className="steelworks-accent-bar h-5 w-full" />
        <div className="border-t border-white/10 bg-[#111111]/90 px-5 py-4 md:px-8">
          <div className="mx-auto grid max-w-[1440px] gap-4 md:grid-cols-[1.3fr_0.7fr] md:items-center">
            <TemplateText
              as="p"
              editId="tagline"
              editLabel="tagline"
              className="text-sm font-bold uppercase tracking-[0.3em] text-[#f3f0ea]"
            >
              {getValue(data, "tagline")}
            </TemplateText>
            <div className="grid grid-cols-2 gap-0 border border-white/10 md:justify-self-end">
              {[
                ["statOne", "statOneLabel"],
                ["statTwo", "statTwoLabel"],
              ].map(([valueKey, labelKey]) => (
                <div key={valueKey} className="border-l border-white/10 px-5 py-4 first:border-l-0">
                  <TemplateText
                    as="div"
                    editId={valueKey}
                    editLabel={valueKey}
                    className="text-2xl font-black uppercase text-[#ff6b2c]"
                  >
                    {getValue(data, valueKey)}
                  </TemplateText>
                  <TemplateText
                    as="div"
                    editId={labelKey}
                    editLabel={labelKey}
                    className="mt-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#b7b0a6]"
                  >
                    {getValue(data, labelKey)}
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

function SteelMarquee({ data }: { data: Record<string, any> }) {
  const items = [
    getValue(data, "brandName"),
    getValue(data, "tagline"),
    getValue(data, "heroEyebrow"),
    "PRECISION",
    "FABRICATION",
    "LOGISTICS",
  ];

  return (
    <section className="overflow-hidden border-b border-white/10 bg-[#111111] py-4">
      <div className="flex w-max items-center">
        {[...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="steelworks-marquee-item shrink-0 border-l px-7 text-[11px] font-black uppercase tracking-[0.34em] text-[#ff6b2c]"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function SteelMetricsBand({ data }: { data: Record<string, any> }) {
  const stats = [
    ["statOne", "statOneLabel"],
    ["statTwo", "statTwoLabel"],
    ["statThree", "statThreeLabel"],
    ["statFour", "statFourLabel"],
  ] as const;

  return (
    <section className="border-b border-white/10 bg-[#1a1a1a] px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto grid max-w-[1440px] gap-0 border border-white/10 md:grid-cols-4">
        {stats.map(([valueKey, labelKey], index) => (
          <div
            key={valueKey}
            className={cx(
              "px-6 py-8",
              index !== 0 && "border-t border-white/10 md:border-r md:border-t-0",
            )}
          >
            <TemplateText
              as="div"
              editId={valueKey}
              editLabel={valueKey}
              className="text-4xl font-black uppercase text-[#f3f0ea] md:text-5xl"
            >
              {getValue(data, valueKey)}
            </TemplateText>
            <TemplateText
              as="div"
              editId={labelKey}
              editLabel={labelKey}
              className="mt-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#ff6b2c]"
            >
              {getValue(data, labelKey)}
            </TemplateText>
            <p className="mt-4 text-sm leading-7 text-[#b7b0a6]">
              קו ייצור מתוזמן, תיאום שטח קפדני ומדידה שוטפת של כל שלב בפרויקט.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SteelAboutBand({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  const checkpoints = [
    "קו תכנון, ייצור והקמה תחת אחריות אחת.",
    "דיווח קבוע למנהלי פרויקט, רכש ותפעול.",
    "בקרת איכות כתובה בכל מעבר בין צוותים.",
  ];

  return (
    <section className="border-b border-white/10 bg-[#202020] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-[1440px] gap-0 border border-white/10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="order-2 flex flex-col justify-center px-6 py-10 md:px-10 lg:order-1">
          <BandHeading
            data={data}
            eyebrowKey="aboutEyebrow"
            titleKey="aboutTitle"
            textKey="aboutText"
            invert
          />
          <div className="mt-8 grid gap-3">
            {checkpoints.map((item) => (
              <div key={item} className="grid grid-cols-[20px_1fr] items-start gap-4 border-t border-white/10 pt-4">
                <span className="mt-1 h-2 w-2 bg-[#ff6b2c]" />
                <TemplateText as="p" className="text-sm leading-7 text-[#ddd4c7]">
                  {item}
                </TemplateText>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <SteelButton variant="line" onClick={() => goTo("work")}>
              <TemplateText as="span" editId="navWork" editLabel="navWork">
                {getValue(data, "navWork")}
              </TemplateText>
            </SteelButton>
          </div>
        </div>
        <div className="order-1 min-h-[420px] border-b border-white/10 lg:order-2 lg:border-b-0 lg:border-r">
          <img src={getValue(data, "aboutImage")} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function SteelServicesBand({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  const services = [
    ["serviceOneTitle", "serviceOneText", "01"],
    ["serviceTwoTitle", "serviceTwoText", "02"],
    ["serviceThreeTitle", "serviceThreeText", "03"],
    ["serviceFourTitle", "serviceFourText", "04"],
  ] as const;

  return (
    <section className="border-b border-white/10 bg-[#111111] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1440px]">
        <BandHeading data={data} eyebrowKey="servicesEyebrow" titleKey="servicesTitle" invert />
        <div className="mt-12 grid gap-0 border border-white/10">
          {services.map(([titleKey, textKey, number], index) => (
            <article
              key={titleKey}
              className={cx(
                "grid gap-6 px-6 py-8 md:grid-cols-[120px_1fr_220px] md:items-center md:px-8",
                index !== 0 && "border-t border-white/10",
              )}
            >
              <div className="text-4xl font-black text-[#ff6b2c]">{number}</div>
              <div>
                <TemplateText
                  as="h3"
                  editId={titleKey}
                  editLabel={titleKey}
                  className="text-2xl font-black uppercase text-[#f3f0ea]"
                >
                  {getValue(data, titleKey)}
                </TemplateText>
                <TemplateText
                  as="p"
                  editId={textKey}
                  editLabel={textKey}
                  className="mt-3 max-w-3xl text-sm leading-7 text-[#b7b0a6] md:text-base"
                >
                  {getValue(data, textKey)}
                </TemplateText>
              </div>
              <div className="md:justify-self-end">
                <SteelButton variant={index % 2 === 0 ? "accent" : "line"} onClick={() => goTo("contact")}>
                  התחלת תהליך
                </SteelButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SteelWorkBand({ data }: { data: Record<string, any> }) {
  const workItems = [
    ["workOneTitle", "workOneText", "PLANT / 01"],
    ["workTwoTitle", "workTwoText", "LOGISTICS / 02"],
    ["workThreeTitle", "workThreeText", "SYSTEMS / 03"],
  ] as const;

  return (
    <section className="border-b border-white/10 bg-[#1a1a1a] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1440px]">
        <BandHeading data={data} eyebrowKey="workEyebrow" titleKey="workTitle" invert />
        <div className="mt-12 grid gap-0 border border-white/10">
          {workItems.map(([titleKey, textKey, tag], index) => (
            <article
              key={titleKey}
              className={cx(
                "grid gap-8 px-6 py-8 lg:grid-cols-[0.18fr_0.34fr_0.48fr] lg:items-center",
                index !== 0 && "border-t border-white/10",
              )}
            >
              <div className="text-[11px] font-black uppercase tracking-[0.32em] text-[#ff6b2c]">{tag}</div>
              <TemplateText
                as="h3"
                editId={titleKey}
                editLabel={titleKey}
                className="text-3xl font-black uppercase leading-tight text-[#f3f0ea]"
              >
                {getValue(data, titleKey)}
              </TemplateText>
              <TemplateText
                as="p"
                editId={textKey}
                editLabel={textKey}
                className="text-sm leading-8 text-[#cec4b8] md:text-base"
              >
                {getValue(data, textKey)}
              </TemplateText>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SteelProcessBand({ data }: { data: Record<string, any> }) {
  const steps = [
    ["processOneTitle", "processOneText"],
    ["processTwoTitle", "processTwoText"],
    ["processThreeTitle", "processThreeText"],
    ["processFourTitle", "processFourText"],
  ] as const;

  return (
    <section className="border-b border-white/10 bg-[#202020] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1440px]">
        <BandHeading data={data} eyebrowKey="processEyebrow" titleKey="processTitle" invert />
        <div className="mt-12 grid gap-0 border border-white/10 md:grid-cols-4">
          {steps.map(([titleKey, textKey], index) => (
            <div
              key={titleKey}
              className={cx(
                "px-6 py-8",
                index !== 0 && "border-t border-white/10 md:border-r md:border-t-0",
              )}
            >
              <div className="text-5xl font-black text-[#ff6b2c]">0{index + 1}</div>
              <TemplateText
                as="h3"
                editId={titleKey}
                editLabel={titleKey}
                className="mt-6 text-2xl font-black uppercase text-[#f3f0ea]"
              >
                {getValue(data, titleKey)}
              </TemplateText>
              <TemplateText
                as="p"
                editId={textKey}
                editLabel={textKey}
                className="mt-3 text-sm leading-7 text-[#b7b0a6]"
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

function SteelInsightsBand({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  const insights = [
    ["insightOneTitle", "insightOneText", "FIELD REPORT 01"],
    ["insightTwoTitle", "insightTwoText", "FIELD REPORT 02"],
  ] as const;

  return (
    <section className="border-b border-white/10 bg-[#111111] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1440px]">
        <BandHeading data={data} eyebrowKey="insightsEyebrow" titleKey="insightsTitle" invert />
        <div className="mt-12 grid gap-0 border border-white/10 lg:grid-cols-[1fr_1fr_0.7fr]">
          {insights.map(([titleKey, textKey, tag], index) => (
            <article
              key={titleKey}
              className={cx("px-6 py-8", index !== 0 && "border-t border-white/10 lg:border-r lg:border-t-0")}
            >
              <div className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ff6b2c]">{tag}</div>
              <TemplateText
                as="h3"
                editId={titleKey}
                editLabel={titleKey}
                className="mt-5 text-2xl font-black uppercase text-[#f3f0ea]"
              >
                {getValue(data, titleKey)}
              </TemplateText>
              <TemplateText
                as="p"
                editId={textKey}
                editLabel={textKey}
                className="mt-4 text-sm leading-8 text-[#b7b0a6]"
              >
                {getValue(data, textKey)}
              </TemplateText>
            </article>
          ))}
          <div className="border-t border-white/10 px-6 py-8 lg:border-r lg:border-t-0">
            <div className="text-[11px] font-black uppercase tracking-[0.34em] text-[#ff6b2c]">OPS NOTE</div>
            <TemplateText as="p" className="mt-5 text-2xl font-black uppercase leading-tight text-[#f3f0ea]">
              לוחות זמנים נשמרים רק כשכל החלטה פוגשת נתון.
            </TemplateText>
            <TemplateText as="p" className="mt-4 text-sm leading-8 text-[#b7b0a6]">
              תכנון מוקדם, סנכרון ממשקים ובקרת מסירה מצמצמים עיכובים ומגבירים ודאות בשטח.
            </TemplateText>
            <div className="mt-8">
              <SteelButton variant="accent" onClick={() => goTo("insights")}>
                <TemplateText as="span" editId="navInsights" editLabel="navInsights">
                  {getValue(data, "navInsights")}
                </TemplateText>
              </SteelButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SteelContactBand({ data }: { data: Record<string, any> }) {
  const info = [
    ["PHONE", "phone"],
    ["EMAIL", "email"],
    ["ADDRESS", "address"],
  ] as const;

  return (
    <section className="border-b border-white/10 bg-[#1a1a1a] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-[1440px] gap-0 border border-white/10 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="bg-[#ff6b2c] px-6 py-10 text-[#111111] md:px-10">
          <BandHeading
            data={data}
            eyebrowKey="contactEyebrow"
            titleKey="contactTitle"
            textKey="contactText"
          />
          <div className="mt-8 space-y-0 border border-black/15">
            {info.map(([label, valueKey], index) => (
              <div
                key={valueKey}
                className={cx(
                  "grid gap-2 px-5 py-4 md:grid-cols-[110px_1fr]",
                  index !== 0 && "border-t border-black/15",
                )}
              >
                <div className="text-[11px] font-black uppercase tracking-[0.32em] text-black/70">{label}</div>
                <TemplateText
                  as="div"
                  editId={valueKey}
                  editLabel={valueKey}
                  className="text-sm font-bold text-[#111111] md:text-base"
                >
                  {getValue(data, valueKey)}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>
        <form className="grid gap-4 bg-[#111111] px-6 py-10 md:px-10">
          <input
            className="border border-white/10 bg-[#1a1a1a] px-4 py-4 text-right text-sm text-[#f3f0ea] outline-none placeholder:text-[#8f8578] focus:border-[#ff6b2c]"
            placeholder="שם מלא"
          />
          <input
            className="border border-white/10 bg-[#1a1a1a] px-4 py-4 text-right text-sm text-[#f3f0ea] outline-none placeholder:text-[#8f8578] focus:border-[#ff6b2c]"
            placeholder="טלפון"
          />
          <input
            className="border border-white/10 bg-[#1a1a1a] px-4 py-4 text-right text-sm text-[#f3f0ea] outline-none placeholder:text-[#8f8578] focus:border-[#ff6b2c]"
            placeholder="אימייל"
          />
          <textarea
            className="min-h-36 border border-white/10 bg-[#1a1a1a] px-4 py-4 text-right text-sm text-[#f3f0ea] outline-none placeholder:text-[#8f8578] focus:border-[#ff6b2c]"
            placeholder="ספרו לנו על הפרויקט"
          />
          <SteelButton className="w-full justify-center">
            <TemplateText as="span" editId="contactButton" editLabel="contactButton">
              {getValue(data, "contactButton")}
            </TemplateText>
          </SteelButton>
        </form>
      </div>
    </section>
  );
}

function SteelFooterBand({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  return (
    <footer className="bg-[#111111] px-5 py-10 md:px-8">
      <div className="steelworks-accent-bar h-4 w-full" />
      <div className="mx-auto border border-t-0 border-white/10 px-6 py-10 md:max-w-[1440px] md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <TemplateText
              as="p"
              editId="brandName"
              editLabel="brandName"
              className="text-[11px] font-black uppercase tracking-[0.38em] text-[#ff6b2c]"
            >
              {getValue(data, "brandName")}
            </TemplateText>
            <TemplateText
              as="h2"
              editId="ctaTitle"
              editLabel="ctaTitle"
              className="mt-4 text-4xl font-black uppercase leading-[0.92] text-[#f3f0ea] md:text-5xl"
            >
              {getValue(data, "ctaTitle")}
            </TemplateText>
            <TemplateText
              as="p"
              editId="ctaText"
              editLabel="ctaText"
              className="mt-5 max-w-2xl text-base leading-8 text-[#b7b0a6]"
            >
              {getValue(data, "ctaText")}
            </TemplateText>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <SteelButton onClick={() => goTo("contact")}>
              <TemplateText as="span" editId="ctaButton" editLabel="ctaButton">
                {getValue(data, "ctaButton")}
              </TemplateText>
            </SteelButton>
            <SteelButton variant="line" onClick={() => goTo("services")}>
              <TemplateText as="span" editId="navServices" editLabel="navServices">
                {getValue(data, "navServices")}
              </TemplateText>
            </SteelButton>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs font-bold uppercase tracking-[0.24em] text-[#8f8578] md:flex-row md:items-center md:justify-between">
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

function SteelPageIntro({
  data,
  type,
}: {
  data: Record<string, any>;
  type: string;
}) {
  return (
    <section className="border-b border-white/10 bg-[#1a1a1a] px-5 py-16 md:px-8 md:py-24">
      <div className="steelworks-hero-grid mx-auto max-w-[1440px] border border-white/10 px-6 py-12 md:px-10 md:py-16">
        <TemplateText
          as="p"
          editId="brandName"
          editLabel="brandName"
          className="text-[11px] font-black uppercase tracking-[0.38em] text-[#ff6b2c]"
        >
          {getValue(data, "brandName")}
        </TemplateText>
        <h1 className="mt-5 text-5xl font-black uppercase leading-[0.9] text-[#f3f0ea] md:text-7xl">
          {getPageTitle(data, type)}
        </h1>
      </div>
    </section>
  );
}

function SteelHomePage({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  return (
    <>
      <SteelHero data={data} goTo={goTo} />
      <SteelMarquee data={data} />
      <SteelMetricsBand data={data} />
      <SteelAboutBand data={data} goTo={goTo} />
      <SteelServicesBand data={data} goTo={goTo} />
      <SteelWorkBand data={data} />
      <SteelProcessBand data={data} />
      <SteelInsightsBand data={data} goTo={goTo} />
      <SteelContactBand data={data} />
      <SteelFooterBand data={data} goTo={goTo} />
    </>
  );
}

function SteelInnerPage({
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
        <SteelAboutBand data={data} goTo={goTo} />
        <SteelMetricsBand data={data} />
        <SteelProcessBand data={data} />
      </>
    ),
    services: (
      <>
        <SteelServicesBand data={data} goTo={goTo} />
        <SteelProcessBand data={data} />
        <SteelContactBand data={data} />
      </>
    ),
    work: (
      <>
        <SteelWorkBand data={data} />
        <SteelAboutBand data={data} goTo={goTo} />
      </>
    ),
    insights: (
      <>
        <SteelInsightsBand data={data} goTo={goTo} />
        <SteelMarquee data={data} />
      </>
    ),
    contact: <SteelContactBand data={data} />,
  };

  return (
    <>
      <SteelPageIntro data={data} type={type} />
      {pageMap[type] ?? null}
      <SteelFooterBand data={data} goTo={goTo} />
    </>
  );
}

export default function SteelworksPages({
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
}: SteelworksPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...steelworksDefaultData,
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
    { allowedPages: steelworksAllowedPages, fallbackPage: "home" },
  );

  const scopedEditorCss = useMemo(
    () => extendEditorCss("steelworks", steelworksEditorCss),
    [],
  );

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "steelworks-preview" : "steelworks"}
      className="min-h-screen w-full overflow-x-hidden bg-[#1a1a1a] text-[#f3f0ea]"
      style={{ fontFamily: '"Inter", "Arial", sans-serif' }}
    >
      <style>{scopedEditorCss}</style>
      <SteelHeader data={mergedData} currentPage={currentPage} goTo={goTo} />

      <VisualPageStack
        activePageId={currentPage}
        pages={[
          {
            id: "home",
            content: <SteelHomePage data={mergedData} goTo={goTo} />,
          },
          ...steelworksPages
            .filter((item) => item.id !== "home")
            .map((item) => ({
              id: item.id,
              content: <SteelInnerPage data={mergedData} type={item.id} goTo={goTo} />,
            })),
        ]}
      />
    </div>
  );
}
