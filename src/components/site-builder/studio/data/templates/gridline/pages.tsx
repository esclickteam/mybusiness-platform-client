import React, { useEffect, useMemo, useState } from "react";

import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { TemplateText } from "../shared/TemplateText";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { gridlineDefaultData } from "./defaultData";
import { gridlineEditorCss } from "./editorCss";

export const gridlinePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const gridlineAllowedPages = gridlinePages.map((page) => page.id);

type GridlinePagesProps = {
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

type EditableTextProps = {
  data: Record<string, any>;
  dataKey: string;
  label: string;
  as?: React.ElementType;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (gridlineDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getPageKeySet(type: string) {
  if (type === "about") {
    return {
      eyebrowKey: "aboutEyebrow",
      titleKey: "aboutTitle",
      textKey: "aboutText",
    };
  }
  if (type === "services") {
    return {
      eyebrowKey: "servicesEyebrow",
      titleKey: "servicesTitle",
      textKey: "serviceOneText",
    };
  }
  if (type === "work") {
    return {
      eyebrowKey: "workEyebrow",
      titleKey: "workTitle",
      textKey: "workOneText",
    };
  }
  if (type === "insights") {
    return {
      eyebrowKey: "insightsEyebrow",
      titleKey: "insightsTitle",
      textKey: "insightOneText",
    };
  }
  if (type === "contact") {
    return {
      eyebrowKey: "contactEyebrow",
      titleKey: "contactTitle",
      textKey: "contactText",
    };
  }
  return {
    eyebrowKey: "heroEyebrow",
    titleKey: "heroTitle",
    textKey: "heroSubtitle",
  };
}

function useReveal() {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setVisible(true);
          observer.disconnect();
        });
      },
      { threshold: 0.18 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return { setNode, visible };
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { setNode, visible } = useReveal();

  return (
    <div
      ref={setNode}
      className={cx(
        "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function EditableText({
  data,
  dataKey,
  label,
  as = "span",
  className,
  ...props
}: EditableTextProps) {
  return (
    <TemplateText
      as={as}
      className={className}
      editId={dataKey}
      editLabel={label}
      {...props}
    >
      {getValue(data, dataKey)}
    </TemplateText>
  );
}

function EditableImage({
  data,
  dataKey,
  label,
  className,
  alt,
}: {
  data: Record<string, any>;
  dataKey: string;
  label: string;
  className?: string;
  alt: string;
}) {
  return (
    <img
      src={getValue(data, dataKey)}
      alt={alt}
      className={className}
      data-visual-editable="true"
      data-visual-edit-id={dataKey}
      data-visual-edit-type="image"
      data-visual-edit-label={label}
    />
  );
}

function GridlineMark({ data }: { data: Record<string, any> }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center border border-black bg-black text-sm font-bold uppercase tracking-[0.24em] text-white">
        <EditableText
          data={data}
          dataKey="logoText"
          label="טקסט לוגו"
          as="span"
          className="font-mono"
        />
      </div>
      <div className="text-right">
        <EditableText
          data={data}
          dataKey="brandName"
          label="שם המותג"
          as="div"
          className="text-lg font-semibold uppercase tracking-[0.18em] text-black"
        />
        <EditableText
          data={data}
          dataKey="tagline"
          label="שורת תיאור"
          as="div"
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/55"
        />
      </div>
    </div>
  );
}

function SectionHeading({
  data,
  eyebrowKey,
  eyebrowLabel,
  titleKey,
  titleLabel,
  textKey,
  textLabel,
  dark = false,
  align = "right",
}: {
  data: Record<string, any>;
  eyebrowKey: string;
  eyebrowLabel: string;
  titleKey: string;
  titleLabel: string;
  textKey?: string;
  textLabel?: string;
  dark?: boolean;
  align?: "right" | "center";
}) {
  return (
    <div className={cx("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-right")}>
      <EditableText
        data={data}
        dataKey={eyebrowKey}
        label={eyebrowLabel}
        as="p"
        className={cx(
          "font-mono text-xs uppercase tracking-[0.32em]",
          dark ? "text-white/65" : "text-black/55",
        )}
      />
      <EditableText
        data={data}
        dataKey={titleKey}
        label={titleLabel}
        as="h2"
        className={cx(
          "mt-5 text-4xl font-semibold leading-[1.06] md:text-5xl",
          dark ? "text-white" : "text-black",
        )}
      />
      {textKey ? (
        <EditableText
          data={data}
          dataKey={textKey}
          label={textLabel || titleLabel}
          as="p"
          className={cx(
            "mt-5 text-base leading-8 md:text-lg",
            dark ? "text-white/72" : "text-black/68",
          )}
        />
      ) : null}
    </div>
  );
}

function Header({
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
    { id: "home", key: "navHome", label: "ניווט בית" },
    { id: "about", key: "navAbout", label: "ניווט אודות" },
    { id: "services", key: "navServices", label: "ניווט שירותים" },
    { id: "work", key: "navWork", label: "ניווט פרויקטים" },
    { id: "insights", key: "navInsights", label: "ניווט תובנות" },
    { id: "contact", key: "navContact", label: "ניווט יצירת קשר" },
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
      className="sticky top-0 z-50 border-b border-black bg-[#f3f3ef]/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <button type="button" onClick={() => handleNavigate("home")} className="text-right">
          <GridlineMark data={data} />
        </button>

        <nav className="hidden items-center gap-2 lg:flex">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
              className={cx(
                "border px-4 py-3 text-sm font-semibold uppercase tracking-[0.22em] transition",
                currentPage === item.id
                  ? "border-black bg-black text-white"
                  : "border-black/15 bg-white text-black hover:border-black",
              )}
            >
              <TemplateText
                as="span"
                editId={item.key}
                editLabel={item.label}
                className="font-mono"
              >
                {getValue(data, item.key)}
              </TemplateText>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavigate("contact")}
            className="hidden border border-black bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black sm:inline-flex"
          >
            <TemplateText
              as="span"
              editId="heroPrimaryButton"
              editLabel="כפתור ראשי הירו"
              className="font-mono"
            >
              {getValue(data, "heroPrimaryButton")}
            </TemplateText>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center border border-black bg-white text-xl text-black lg:hidden"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-black bg-[#f3f3ef] px-4 py-4 lg:hidden">
          <div className="grid gap-2">
            {nav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={cx(
                  "border px-4 py-4 text-right text-sm font-semibold uppercase tracking-[0.18em]",
                  currentPage === item.id
                    ? "border-black bg-black text-white"
                    : "border-black/15 bg-white text-black",
                )}
              >
                <TemplateText
                  as="span"
                  editId={item.key}
                  editLabel={item.label}
                  className="font-mono"
                >
                  {getValue(data, item.key)}
                </TemplateText>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Hero({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  const notes = [
    [getValue(data, "statOne"), getValue(data, "statOneLabel")],
    [getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
    [getValue(data, "statThree"), getValue(data, "statThreeLabel")],
  ];

  return (
    <section className="border-b border-black bg-[#f3f3ef]">
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal className="border-b border-black p-6 lg:border-b-0 lg:border-l lg:p-10" delay={20}>
          <EditableText
            data={data}
            dataKey="heroEyebrow"
            label="כותרת עליונה הירו"
            as="p"
            className="font-mono text-xs uppercase tracking-[0.34em] text-black/55"
          />
          <EditableText
            data={data}
            dataKey="heroTitle"
            label="כותרת ראשית הירו"
            as="h1"
            className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.94] text-black md:text-7xl"
          />
          <EditableText
            data={data}
            dataKey="heroSubtitle"
            label="טקסט משנה הירו"
            as="p"
            className="mt-6 max-w-2xl text-base leading-8 text-black/70 md:text-lg"
          />

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => goTo("contact")}
              className="border border-black bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-white hover:text-black"
            >
              <TemplateText
                as="span"
                editId="heroPrimaryButton"
                editLabel="כפתור ראשי הירו"
                className="font-mono"
              >
                {getValue(data, "heroPrimaryButton")}
              </TemplateText>
            </button>
            <button
              type="button"
              onClick={() => goTo("work")}
              className="border border-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-black hover:text-white"
            >
              <TemplateText
                as="span"
                editId="heroSecondaryButton"
                editLabel="כפתור משני הירו"
                className="font-mono"
              >
                {getValue(data, "heroSecondaryButton")}
              </TemplateText>
            </button>
          </div>

          <div className="mt-12 grid gap-0 border border-black sm:grid-cols-3">
            {notes.map(([value, label], index) => (
              <div key={label + index} className="border-b border-black p-5 last:border-b-0 sm:border-b-0 sm:border-l sm:last:border-l-0">
                <div className="font-mono text-xs uppercase tracking-[0.28em] text-black/45">
                  0{index + 1}
                </div>
                <div className="mt-3 text-3xl font-semibold text-black">{value}</div>
                <div className="mt-2 font-mono text-xs uppercase tracking-[0.24em] text-black/55">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="relative p-6 lg:p-10" delay={120}>
          <div className="absolute inset-6 border border-black/10 gridline-hero-grid lg:inset-10" />
          <div className="relative border border-black bg-white">
            <div className="border-b border-black px-5 py-4 font-mono text-[11px] uppercase tracking-[0.32em] text-black/55">
              <EditableText
                data={data}
                dataKey="heroPanelBadge"
                label="תג הירו"
                as="span"
                className="font-mono"
              />
            </div>
            <div className="grid gap-0 lg:grid-cols-[1fr_220px]">
              <EditableImage
                data={data}
                dataKey="heroImage"
                label="תמונת הירו"
                alt="הירו Gridline"
                className="h-[420px] w-full border-b border-black object-cover lg:h-[640px] lg:border-b-0 lg:border-l"
              />
              <div className="flex flex-col justify-between bg-[#ecece6]">
                <div className="border-b border-black p-5">
                  <EditableText
                    data={data}
                    dataKey="heroPanelTitle"
                    label="כותרת פאנל הירו"
                    as="h3"
                    className="text-2xl font-semibold leading-[1.15] text-black"
                  />
                  <EditableText
                    data={data}
                    dataKey="heroPanelText"
                    label="טקסט פאנל הירו"
                    as="p"
                    className="mt-4 text-sm leading-7 text-black/68"
                  />
                </div>
                <div className="grid gap-0">
                  <div className="border-b border-black p-5">
                    <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/45">
                      studio line
                    </div>
                    <EditableText
                      data={data}
                      dataKey="tagline"
                      label="תג ליין"
                      as="div"
                      className="mt-3 text-lg font-semibold uppercase tracking-[0.16em] text-black"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-0">
                    <div className="border-l border-black p-5">
                      <div className="text-2xl font-semibold text-black">
                        {getValue(data, "statFour")}
                      </div>
                      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-black/55">
                        {getValue(data, "statFourLabel")}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="text-2xl font-semibold text-black">
                        {getValue(data, "statTwo")}
                      </div>
                      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-black/55">
                        {getValue(data, "statTwoLabel")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MarqueeSection({ data }: { data: Record<string, any> }) {
  const items = [
    getValue(data, "marqueeOne"),
    getValue(data, "marqueeTwo"),
    getValue(data, "marqueeThree"),
    getValue(data, "marqueeFour"),
    getValue(data, "marqueeFive"),
  ];

  return (
    <section className="overflow-hidden border-b border-black bg-white py-5">
      <div
        className="flex min-w-max gap-4"
        style={{ animation: "gridline-marquee 24s linear infinite" }}
      >
        {[...items, ...items].map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="gridline-marquee-item border px-5 py-3 font-mono text-xs uppercase tracking-[0.34em] text-black"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsSection({ data }: { data: Record<string, any> }) {
  const stats = [
    [getValue(data, "statOne"), getValue(data, "statOneLabel")],
    [getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
    [getValue(data, "statThree"), getValue(data, "statThreeLabel")],
    [getValue(data, "statFour"), getValue(data, "statFourLabel")],
  ];

  return (
    <section className="border-b border-black bg-[#ecece6] px-4 py-16 lg:px-8">
      <Reveal className="mx-auto max-w-7xl">
        <div className="grid gap-0 border border-black md:grid-cols-4">
          {stats.map(([value, label], index) => (
            <div key={label} className="border-b border-black p-6 last:border-b-0 md:border-b-0 md:border-l md:last:border-l-0">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/45">
                grid.{index + 1}
              </div>
              <div className="mt-4 text-4xl font-semibold text-black md:text-5xl">{value}</div>
              <div className="mt-3 text-sm font-medium text-black/62">{label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function AboutSection({ data }: { data: Record<string, any> }) {
  const points = [
    ["aboutPointOne", "נקודת חוזקה 1"],
    ["aboutPointTwo", "נקודת חוזקה 2"],
    ["aboutPointThree", "נקודת חוזקה 3"],
  ];

  return (
    <section className="border-b border-black bg-[#f3f3ef] px-4 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-0 border border-black lg:grid-cols-[0.92fr_1.08fr]">
        <Reveal className="border-b border-black lg:border-b-0 lg:border-l" delay={10}>
          <EditableImage
            data={data}
            dataKey="aboutImage"
            label="תמונת אודות"
                alt="אודות Gridline"
            className="h-full min-h-[420px] w-full object-cover lg:min-h-[560px]"
          />
        </Reveal>

        <Reveal className="p-6 lg:p-10" delay={100}>
          <SectionHeading
            data={data}
            eyebrowKey="aboutEyebrow"
            eyebrowLabel="אייברו אודות"
            titleKey="aboutTitle"
            titleLabel="כותרת אודות"
            textKey="aboutText"
            textLabel="טקסט אודות"
          />
          <div className="mt-10 grid gap-0 border border-black">
            {points.map(([key, label], index) => (
              <div
                key={key}
                className="grid gap-4 border-b border-black p-5 last:border-b-0 md:grid-cols-[120px_1fr]"
              >
                <div className="font-mono text-xs uppercase tracking-[0.28em] text-black/45">
                  note.0{index + 1}
                </div>
                <EditableText
                  data={data}
                  dataKey={key}
                  label={label}
                  as="p"
                  className="text-base leading-8 text-black/72"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ServicesSection({
  data,
  compact = false,
}: {
  data: Record<string, any>;
  compact?: boolean;
}) {
  const services = [
    ["serviceOneTitle", "serviceOneText", "שירות 01"],
    ["serviceTwoTitle", "serviceTwoText", "שירות 02"],
    ["serviceThreeTitle", "serviceThreeText", "שירות 03"],
    ["serviceFourTitle", "serviceFourText", "שירות 04"],
  ];

  return (
    <section className="border-b border-black bg-white px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            data={data}
            eyebrowKey="servicesEyebrow"
            eyebrowLabel="אייברו שירותים"
            titleKey="servicesTitle"
            titleLabel="כותרת שירותים"
            textKey={compact ? undefined : "heroSubtitle"}
            textLabel="טקסט שירותים"
          />
        </Reveal>

        <div className="mt-10 grid gap-0 border border-black md:grid-cols-2">
          {services.map(([titleKey, textKey, code], index) => (
            <Reveal key={titleKey} delay={index * 70}>
              <article className="border-b border-black p-6 last:border-b-0 md:min-h-[240px] md:border-b-0 md:border-l md:last:border-l-0">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/45">
                  {code}
                </div>
                <EditableText
                  data={data}
                  dataKey={titleKey}
                  label={`כותרת שירות ${index + 1}`}
                  as="h3"
                  className="mt-5 text-2xl font-semibold text-black"
                />
                <EditableText
                  data={data}
                  dataKey={textKey}
                  label={`תיאור שירות ${index + 1}`}
                  as="p"
                  className="mt-4 text-base leading-8 text-black/68"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkSection({ data }: { data: Record<string, any> }) {
  const items = [
    {
      imageKey: "workOneImage",
      tagKey: "workOneTag",
      titleKey: "workOneTitle",
      textKey: "workOneText",
    },
    {
      imageKey: "workTwoImage",
      tagKey: "workTwoTag",
      titleKey: "workTwoTitle",
      textKey: "workTwoText",
    },
    {
      imageKey: "workThreeImage",
      tagKey: "workThreeTag",
      titleKey: "workThreeTitle",
      textKey: "workThreeText",
    },
  ];

  return (
    <section className="border-b border-black bg-[#ecece6] px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            data={data}
            eyebrowKey="workEyebrow"
            eyebrowLabel="אייברו פרויקטים"
            titleKey="workTitle"
            titleLabel="כותרת פרויקטים"
            textKey="heroPanelText"
            textLabel="טקסט פרויקטים"
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.titleKey} delay={index * 80}>
              <article className="border border-black bg-white">
                <EditableImage
                  data={data}
                  dataKey={item.imageKey}
                  label={`תמונת פרויקט ${index + 1}`}
                  alt={`Project ${index + 1}`}
                  className="h-72 w-full border-b border-black object-cover"
                />
                <div className="p-6">
                  <EditableText
                    data={data}
                    dataKey={item.tagKey}
                    label={`תג פרויקט ${index + 1}`}
                    as="p"
                    className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/45"
                  />
                  <EditableText
                    data={data}
                    dataKey={item.titleKey}
                    label={`כותרת פרויקט ${index + 1}`}
                    as="h3"
                    className="mt-4 text-2xl font-semibold text-black"
                  />
                  <EditableText
                    data={data}
                    dataKey={item.textKey}
                    label={`טקסט פרויקט ${index + 1}`}
                    as="p"
                    className="mt-4 text-base leading-8 text-black/68"
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ data }: { data: Record<string, any> }) {
  const steps = [
    ["processOneTitle", "processOneText"],
    ["processTwoTitle", "processTwoText"],
    ["processThreeTitle", "processThreeText"],
    ["processFourTitle", "processFourText"],
  ];

  return (
    <section className="border-b border-black bg-black px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            data={data}
            eyebrowKey="processEyebrow"
            eyebrowLabel="אייברו תהליך"
            titleKey="processTitle"
            titleLabel="כותרת תהליך"
            textKey="heroPanelText"
            textLabel="טקסט תהליך"
            dark
          />
        </Reveal>

        <div className="mt-10 grid gap-0 border border-white/15 md:grid-cols-4">
          {steps.map(([titleKey, textKey], index) => (
            <Reveal key={titleKey} delay={index * 70}>
              <div className="border-b border-white/15 p-6 last:border-b-0 md:min-h-[260px] md:border-b-0 md:border-l md:last:border-l-0">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">
                  phase.0{index + 1}
                </div>
                <EditableText
                  data={data}
                  dataKey={titleKey}
                  label={`כותרת שלב ${index + 1}`}
                  as="h3"
                  className="mt-5 text-2xl font-semibold text-white"
                />
                <EditableText
                  data={data}
                  dataKey={textKey}
                  label={`תיאור שלב ${index + 1}`}
                  as="p"
                  className="mt-4 text-base leading-8 text-white/72"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightsSection({ data }: { data: Record<string, any> }) {
  const insights = [
    ["insightOneTag", "insightOneTitle", "insightOneText"],
    ["insightTwoTag", "insightTwoTitle", "insightTwoText"],
    ["insightThreeTag", "insightThreeTitle", "insightThreeText"],
  ];

  return (
    <section className="border-b border-black bg-[#f3f3ef] px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            data={data}
            eyebrowKey="insightsEyebrow"
            eyebrowLabel="אייברו תובנות"
            titleKey="insightsTitle"
            titleLabel="כותרת תובנות"
            textKey="heroSubtitle"
            textLabel="טקסט תובנות"
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {insights.map(([tagKey, titleKey, textKey], index) => (
            <Reveal key={titleKey} delay={index * 80}>
              <article className="border border-black bg-white p-6">
                <EditableText
                  data={data}
                  dataKey={tagKey}
                  label={`תג תובנה ${index + 1}`}
                  as="p"
                  className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/45"
                />
                <EditableText
                  data={data}
                  dataKey={titleKey}
                  label={`כותרת תובנה ${index + 1}`}
                  as="h3"
                  className="mt-5 text-2xl font-semibold leading-[1.2] text-black"
                />
                <EditableText
                  data={data}
                  dataKey={textKey}
                  label={`טקסט תובנה ${index + 1}`}
                  as="p"
                  className="mt-4 text-base leading-8 text-black/68"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({
  data,
  titleKey = "contactTitle",
  textKey = "contactText",
}: {
  data: Record<string, any>;
  titleKey?: string;
  textKey?: string;
}) {
  const info = [
    ["phone", "טלפון", "מידע 01"],
    ["email", "אימייל", "מידע 02"],
    ["address", "כתובת", "מידע 03"],
    ["hours", "שעות פעילות", "מידע 04"],
  ];

  return (
    <section className="border-b border-black bg-white px-4 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-0 border border-black lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="border-b border-black bg-black p-6 lg:border-b-0 lg:border-l lg:p-10" delay={20}>
          <EditableText
            data={data}
            dataKey="contactEyebrow"
            label="אייברו יצירת קשר"
            as="p"
            className="font-mono text-xs uppercase tracking-[0.32em] text-white/65"
          />
          <EditableText
            data={data}
            dataKey={titleKey}
            label="כותרת יצירת קשר"
            as="h2"
            className="mt-5 text-4xl font-semibold leading-[1.08] text-white md:text-5xl"
          />
          <EditableText
            data={data}
            dataKey={textKey}
            label="טקסט יצירת קשר"
            as="p"
            className="mt-5 text-base leading-8 text-white/72"
          />

          <div className="mt-10 grid gap-0 border border-white/15">
            {info.map(([key, label, code]) => (
              <div key={key} className="grid gap-4 border-b border-white/15 p-5 last:border-b-0 md:grid-cols-[120px_1fr]">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">
                  {code}
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">
                    {label}
                  </div>
                  <EditableText
                    data={data}
                    dataKey={key}
                    label={label}
                    as="div"
                    className="mt-2 text-lg font-medium text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="bg-[#ecece6] p-6 lg:p-10" delay={120}>
          <form
            data-bizuply-form-builder="true"
            data-visual-editable="true"
            data-visual-edit-id="contact.form"
            data-visual-edit-type="box"
            data-visual-edit-label="טופס יצירת קשר"
            className="grid gap-0 border border-black bg-white"
          >
            <input
              className="border-b border-black bg-transparent px-5 py-4 text-right text-sm outline-none placeholder:text-black/35 md:border-l"
              placeholder="שם מלא"
              data-visual-editable="true"
              data-visual-edit-id="contact.form.name"
              data-visual-edit-type="control"
              data-visual-edit-label="שדה שם"
            />
            <input
              className="border-b border-black bg-transparent px-5 py-4 text-right text-sm outline-none placeholder:text-black/35"
              placeholder="טלפון"
              data-visual-editable="true"
              data-visual-edit-id="contact.form.phone"
              data-visual-edit-type="control"
              data-visual-edit-label="שדה טלפון"
            />
            <input
              className="border-b border-black bg-transparent px-5 py-4 text-right text-sm outline-none placeholder:text-black/35 md:border-l"
              placeholder="אימייל"
              data-visual-editable="true"
              data-visual-edit-id="contact.form.email"
              data-visual-edit-type="control"
              data-visual-edit-label="שדה אימייל"
            />
            <input
              className="border-b border-black bg-transparent px-5 py-4 text-right text-sm outline-none placeholder:text-black/35"
              placeholder="סוג פרויקט"
              data-visual-editable="true"
              data-visual-edit-id="contact.form.topic"
              data-visual-edit-type="control"
              data-visual-edit-label="שדה סוג פרויקט"
            />
            <textarea
              className="min-h-40 border-b border-black bg-transparent px-5 py-4 text-right text-sm outline-none placeholder:text-black/35 md:col-span-2"
              placeholder="ספרו לנו על השטח, היעד, הלו״ז והאתגר"
              data-visual-editable="true"
              data-visual-edit-id="contact.form.message"
              data-visual-edit-type="control"
              data-visual-edit-label="שדה הודעה"
            />
            <button
              type="button"
              className="bg-black px-5 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#2a2a2a] md:col-span-2"
              data-visual-editable="true"
              data-visual-edit-id="contact.form.submit"
              data-visual-edit-type="button"
              data-visual-edit-label="כפתור שליחת טופס"
            >
              <TemplateText
                as="span"
                editId="contactButton"
                editLabel="כפתור יצירת קשר"
                className="font-mono"
              >
                {getValue(data, "contactButton")}
              </TemplateText>
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function CtaSection({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  return (
    <section className="border-b border-black bg-black px-4 py-20 lg:px-8">
      <Reveal className="mx-auto max-w-7xl border border-white/15 bg-black p-6 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="text-right">
            <div className="font-mono text-xs uppercase tracking-[0.32em] text-white/45">
              final call
            </div>
            <EditableText
              data={data}
              dataKey="ctaTitle"
              label="כותרת קריאה לפעולה"
              as="h2"
              className="mt-5 text-4xl font-semibold leading-[1.08] text-white md:text-5xl"
            />
            <EditableText
              data={data}
              dataKey="ctaText"
              label="טקסט קריאה לפעולה"
              as="p"
              className="mt-5 max-w-2xl text-base leading-8 text-white/72"
            />
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <button
              type="button"
              onClick={() => goTo("contact")}
              className="border border-white bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-black hover:text-white"
            >
              <TemplateText
                as="span"
                editId="ctaButton"
                editLabel="כפתור קריאה לפעולה"
                className="font-mono"
              >
                {getValue(data, "ctaButton")}
              </TemplateText>
            </button>
            <button
              type="button"
              onClick={() => goTo("work")}
              className="border border-white/35 px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:border-white"
            >
              <TemplateText
                as="span"
                editId="navWork"
                editLabel="כפתור פרויקטים בפוטר"
                className="font-mono"
              >
                {getValue(data, "navWork")}
              </TemplateText>
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  const nav = [
    { id: "home", key: "navHome", label: "ניווט בית תחתון" },
    { id: "about", key: "navAbout", label: "ניווט אודות תחתון" },
    { id: "services", key: "navServices", label: "ניווט שירותים תחתון" },
    { id: "work", key: "navWork", label: "ניווט פרויקטים תחתון" },
    { id: "insights", key: "navInsights", label: "ניווט תובנות תחתון" },
    { id: "contact", key: "navContact", label: "ניווט יצירת קשר תחתון" },
  ];

  return (
    <footer className="bg-[#f3f3ef] px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl border border-black bg-white">
        <div className="grid gap-0 border-b border-black lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-black p-6 lg:border-b-0 lg:border-l lg:p-8">
            <GridlineMark data={data} />
            <EditableText
              data={data}
              dataKey="footerText"
              label="טקסט פוטר"
              as="p"
              className="mt-5 max-w-xl text-sm leading-7 text-black/65"
            />
          </div>
          <div className="p-6 lg:p-8">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {nav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(item.id)}
                  className="border border-black/15 px-4 py-3 text-right text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:border-black"
                >
                  <TemplateText
                    as="span"
                    editId={item.key}
                    editLabel={item.label}
                    className="font-mono"
                  >
                    {getValue(data, item.key)}
                  </TemplateText>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-black/45 md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} {getValue(data, "brandName")}
          </div>
          <div>Gridline template · Bizuply Studio</div>
        </div>
      </div>
    </footer>
  );
}

function PageHero({
  data,
  type,
}: {
  data: Record<string, any>;
  type: string;
}) {
  const keys = getPageKeySet(type);
  const indexMap: Record<string, string> = {
    about: "01",
    services: "02",
    work: "03",
    insights: "04",
    contact: "05",
  };

  return (
    <section className="border-b border-black bg-black px-4 py-20 lg:px-8">
      <Reveal className="mx-auto grid max-w-7xl gap-0 border border-white/15 lg:grid-cols-[0.24fr_1fr]">
        <div className="border-b border-white/15 p-6 font-mono text-6xl font-semibold text-white/20 lg:border-b-0 lg:border-l lg:p-10">
          {indexMap[type]}
        </div>
        <div className="p-6 lg:p-10">
          <EditableText
            data={data}
            dataKey={keys.eyebrowKey}
            label={`אייברו עמוד ${type}`}
            as="p"
            className="font-mono text-xs uppercase tracking-[0.32em] text-white/55"
          />
          <EditableText
            data={data}
            dataKey={keys.titleKey}
            label={`כותרת עמוד ${type}`}
            as="h1"
            className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.96] text-white md:text-7xl"
          />
          <EditableText
            data={data}
            dataKey={keys.textKey}
            label={`טקסט עמוד ${type}`}
            as="p"
            className="mt-6 max-w-3xl text-base leading-8 text-white/72 md:text-lg"
          />
        </div>
      </Reveal>
    </section>
  );
}

function HomePage({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  return (
    <>
      <Hero data={data} goTo={goTo} />
      <MarqueeSection data={data} />
      <StatsSection data={data} />
      <AboutSection data={data} />
      <ServicesSection data={data} />
      <WorkSection data={data} />
      <ProcessSection data={data} />
      <InsightsSection data={data} />
      <ContactSection data={data} />
      <CtaSection data={data} goTo={goTo} />
    </>
  );
}

function SimplePage({
  data,
  type,
  goTo,
}: {
  data: Record<string, any>;
  type: string;
  goTo: (page: string) => void;
}) {
  const pageContent: Record<string, React.ReactNode> = {
    about: (
      <>
        <AboutSection data={data} />
        <StatsSection data={data} />
        <ProcessSection data={data} />
      </>
    ),
    services: (
      <>
        <ServicesSection data={data} compact />
        <ProcessSection data={data} />
        <ContactSection data={data} titleKey="ctaTitle" textKey="ctaText" />
      </>
    ),
    work: (
      <>
        <WorkSection data={data} />
        <StatsSection data={data} />
        <ContactSection data={data} titleKey="workTitle" textKey="heroPanelText" />
      </>
    ),
    insights: (
      <>
        <InsightsSection data={data} />
        <MarqueeSection data={data} />
        <ContactSection data={data} titleKey="insightsTitle" textKey="insightThreeText" />
      </>
    ),
    contact: (
      <>
        <ContactSection data={data} />
        <StatsSection data={data} />
      </>
    ),
  };

  return (
    <>
      <PageHero data={data} type={type} />
      {pageContent[type] ?? null}
      <CtaSection data={data} goTo={goTo} />
    </>
  );
}

export default function GridlinePages({
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
}: GridlinePagesProps) {
  const mergedData = useMemo(
    () => ({
      ...gridlineDefaultData,
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
    { allowedPages: gridlineAllowedPages, fallbackPage: "home" },
  );

  return (
    <div
      dir="rtl"
      data-template-id="gridline"
      data-template-mode={mode}
      className="min-h-screen overflow-x-hidden bg-[#f3f3ef] text-black"
      style={{ fontFamily: '"IBM Plex Sans Arabic", "Inter", "Arial", sans-serif' }}
    >
      <style>{gridlineEditorCss}</style>
      <style>{`
        @keyframes gridline-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />

      <VisualPageStack
        activePageId={currentPage}
        pages={[
          {
            id: "home",
            content: <HomePage data={mergedData} goTo={goTo} />,
          },
          ...gridlinePages
            .filter((item) => item.id !== "home")
            .map((item) => ({
              id: item.id,
              content: (
                <SimplePage
                  data={mergedData}
                  type={item.id}
                  goTo={goTo}
                />
              ),
            })),
        ]}
      />

      <Footer data={mergedData} goTo={goTo} />
    </div>
  );
}
