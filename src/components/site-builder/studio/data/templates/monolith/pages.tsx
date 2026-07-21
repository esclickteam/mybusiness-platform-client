import React, { useEffect, useMemo, useState } from "react";

import {
  TemplateText,
  VisualPageStack,
  useTemplatePageNavigation,
} from "../shared";
import { monolithDefaultData } from "./defaultData";
import { monolithEditorCss } from "./editorCss";

export const monolithPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const monolithAllowedPages = monolithPages.map((page) => page.id);

type MonolithPagesProps = {
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
  return data?.[key] ?? (monolithDefaultData as Record<string, any>)[key] ?? "";
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

function MonolithMark({ data }: { data: Record<string, any> }) {
  return (
    <div className="flex items-center gap-4">
      <div className="grid h-12 w-12 place-items-center border border-[#c8a96a] text-sm font-semibold uppercase tracking-[0.28em] text-[#c8a96a]">
        <EditableText
          data={data}
          dataKey="logoText"
          label="טקסט לוגו"
          as="span"
          className="text-sm"
        />
      </div>
      <div className="text-right">
        <EditableText
          data={data}
          dataKey="brandName"
          label="שם המותג"
          as="div"
          className="text-xl font-semibold tracking-[0.08em] text-white"
        />
        <EditableText
          data={data}
          dataKey="tagline"
          label="שורת תיאור"
          as="div"
          className="text-[11px] uppercase tracking-[0.34em] text-[#c8a96a]"
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
  align = "right",
  dark = false,
}: {
  data: Record<string, any>;
  eyebrowKey: string;
  eyebrowLabel: string;
  titleKey: string;
  titleLabel: string;
  textKey?: string;
  textLabel?: string;
  align?: "right" | "center";
  dark?: boolean;
}) {
  return (
    <div className={cx("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-right")}>
      <EditableText
        data={data}
        dataKey={eyebrowKey}
        label={eyebrowLabel}
        as="p"
        className={cx(
          "text-xs uppercase tracking-[0.36em]",
          dark ? "text-[#c8a96a]" : "text-[#8d7442]",
        )}
      />
      <EditableText
        data={data}
        dataKey={titleKey}
        label={titleLabel}
        as="h2"
        className={cx(
          "mt-6 text-4xl font-semibold leading-[1.08] md:text-5xl",
          dark ? "text-white" : "text-[#0c1a33]",
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
            dark ? "text-white/72" : "text-[#4e5b73]",
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
      className="sticky top-0 z-50 border-b border-[#c8a96a]/25 bg-[#0c1a33]/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <button type="button" onClick={() => handleNavigate("home")} className="text-right">
          <MonolithMark data={data} />
        </button>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
              className={cx(
                "relative py-3 text-sm font-medium uppercase tracking-[0.22em] transition",
                currentPage === item.id
                  ? "text-[#f6f1e7]"
                  : "text-white/70 hover:text-white",
              )}
            >
              <TemplateText
                as="span"
                editId={item.key}
                editLabel={item.label}
              >
                {getValue(data, item.key)}
              </TemplateText>
              <span
                className={cx(
                  "absolute bottom-0 right-0 h-px w-full bg-[#c8a96a] transition-opacity",
                  currentPage === item.id ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavigate("contact")}
            className="hidden border border-[#c8a96a] bg-[#c8a96a] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0c1a33] transition hover:bg-transparent hover:text-[#f6f1e7] sm:inline-flex"
          >
            <TemplateText
              as="span"
              editId="heroPrimaryButton"
              editLabel="כפתור ראשי הירו"
            >
              {getValue(data, "heroPrimaryButton")}
            </TemplateText>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center border border-[#c8a96a]/35 text-xl text-[#f6f1e7] lg:hidden"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#c8a96a]/25 px-4 py-4 lg:hidden">
          <div className="grid gap-2">
            {nav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={cx(
                  "border px-4 py-4 text-right text-sm uppercase tracking-[0.2em]",
                  currentPage === item.id
                    ? "border-[#c8a96a] bg-[#c8a96a] text-[#0c1a33]"
                    : "border-[#c8a96a]/25 text-white",
                )}
              >
                <TemplateText
                  as="span"
                  editId={item.key}
                  editLabel={item.label}
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
  return (
    <section className="border-b border-[#c8a96a]/20 bg-[#0c1a33] px-4 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <EditableText
            data={data}
            dataKey="heroEyebrow"
            label="אייברו הירו"
            as="p"
            className="text-xs uppercase tracking-[0.42em] text-[#c8a96a]"
          />
          <EditableText
            data={data}
            dataKey="heroTitle"
            label="כותרת ראשית הירו"
            as="h1"
            className="mx-auto mt-8 max-w-5xl text-5xl font-semibold leading-[0.95] text-[#f6f1e7] md:text-7xl lg:text-8xl"
          />
          <EditableText
            data={data}
            dataKey="heroSubtitle"
            label="טקסט משנה הירו"
            as="p"
            className="mx-auto mt-8 max-w-3xl text-base leading-8 text-white/72 md:text-lg"
          />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => goTo("contact")}
              className="border border-[#c8a96a] bg-[#c8a96a] px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#0c1a33] transition hover:bg-transparent hover:text-[#f6f1e7]"
            >
              <TemplateText
                as="span"
                editId="heroPrimaryButton"
                editLabel="כפתור ראשי הירו"
              >
                {getValue(data, "heroPrimaryButton")}
              </TemplateText>
            </button>
            <button
              type="button"
              onClick={() => goTo("work")}
              className="border border-[#c8a96a]/35 px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#f6f1e7] transition hover:border-[#c8a96a]"
            >
              <TemplateText
                as="span"
                editId="heroSecondaryButton"
                editLabel="כפתור משני הירו"
              >
                {getValue(data, "heroSecondaryButton")}
              </TemplateText>
            </button>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-0 border border-[#c8a96a]/25 lg:grid-cols-[0.9fr_1px_1.1fr]">
          <Reveal className="bg-[#102140] p-6 lg:p-8" delay={70}>
            <EditableText
              data={data}
              dataKey="heroPanelBadge"
              label="תג הירו"
              as="p"
              className="text-xs uppercase tracking-[0.36em] text-[#c8a96a]"
            />
            <EditableText
              data={data}
              dataKey="heroPanelTitle"
              label="כותרת פאנל הירו"
              as="h3"
              className="mt-6 text-3xl font-semibold leading-[1.15] text-[#f6f1e7]"
            />
            <EditableText
              data={data}
              dataKey="heroPanelText"
              label="טקסט פאנל הירו"
              as="p"
              className="mt-5 text-base leading-8 text-white/72"
            />

            <div className="mt-10 grid gap-0 border border-[#c8a96a]/20">
              <div className="grid gap-4 border-b border-[#c8a96a]/20 p-5 md:grid-cols-[130px_1fr]">
                <div className="text-xs uppercase tracking-[0.32em] text-[#c8a96a]/70">legacy</div>
                <EditableText
                  data={data}
                  dataKey="tagline"
                  label="תג ליין"
                  as="p"
                  className="text-lg text-[#f6f1e7]"
                />
              </div>
              <div className="grid gap-0 md:grid-cols-2">
                <div className="border-b border-[#c8a96a]/20 p-5 md:border-b-0 md:border-l">
                  <div className="text-3xl font-semibold text-[#f6f1e7]">
                    {getValue(data, "statTwo")}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.28em] text-[#c8a96a]/70">
                    {getValue(data, "statTwoLabel")}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-3xl font-semibold text-[#f6f1e7]">
                    {getValue(data, "statThree")}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.28em] text-[#c8a96a]/70">
                    {getValue(data, "statThreeLabel")}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="monolith-accent-bar hidden lg:block" />

          <Reveal className="relative overflow-hidden bg-[#102140]" delay={150}>
            <div className="absolute inset-0 monolith-hero-grid opacity-40" />
            <EditableImage
              data={data}
              dataKey="heroImage"
              label="תמונת הירו"
              alt="Monolith hero"
              className="relative h-[420px] w-full object-cover lg:h-[640px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a33] via-[#0c1a33]/20 to-transparent" />
            <div className="absolute bottom-0 right-0 left-0 grid gap-0 border-t border-[#c8a96a]/25 bg-[#0c1a33]/92 md:grid-cols-3">
              {[
                [getValue(data, "statOne"), getValue(data, "statOneLabel")],
                [getValue(data, "statFour"), getValue(data, "statFourLabel")],
                [getValue(data, "statThree"), getValue(data, "statThreeLabel")],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className="border-b border-[#c8a96a]/25 p-5 last:border-b-0 md:border-b-0 md:border-l md:last:border-l-0"
                >
                  <div className="text-3xl font-semibold text-[#f6f1e7]">{value}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.28em] text-[#c8a96a]/70">
                    {label}
                  </div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.3em] text-white/35">
                    column {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
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
    <section className="overflow-hidden border-b border-[#c8a96a]/20 bg-[#102140] py-5">
      <div
        className="flex min-w-max gap-4"
        style={{ animation: "monolith-marquee 26s linear infinite" }}
      >
        {[...items, ...items].map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="monolith-marquee-item border px-6 py-3 text-xs uppercase tracking-[0.34em] text-[#f6f1e7]"
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
    <section className="border-b border-[#d7c7a5] bg-[#f6f1e7] px-4 py-20 lg:px-8">
      <Reveal className="mx-auto max-w-7xl border border-[#d7c7a5] bg-white">
        <div className="grid gap-0 md:grid-cols-4">
          {stats.map(([value, label], index) => (
            <div
              key={label}
              className="border-b border-[#d7c7a5] p-6 last:border-b-0 md:border-b-0 md:border-l md:last:border-l-0"
            >
              <div className="text-xs uppercase tracking-[0.34em] text-[#8d7442]">
                metric 0{index + 1}
              </div>
              <div className="mt-4 text-4xl font-semibold text-[#0c1a33] md:text-5xl">{value}</div>
              <div className="mt-3 text-sm text-[#58657b]">{label}</div>
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
    <section className="border-b border-[#d7c7a5] bg-[#f6f1e7] px-4 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-0 border border-[#d7c7a5] bg-white lg:grid-cols-[1fr_1px_1fr]">
        <Reveal className="p-6 lg:p-10" delay={20}>
          <SectionHeading
            data={data}
            eyebrowKey="aboutEyebrow"
            eyebrowLabel="אייברו אודות"
            titleKey="aboutTitle"
            titleLabel="כותרת אודות"
            textKey="aboutText"
            textLabel="טקסט אודות"
          />
          <div className="mt-10 grid gap-0 border border-[#d7c7a5]">
            {points.map(([key, label], index) => (
              <div
                key={key}
                className="grid gap-4 border-b border-[#d7c7a5] p-5 last:border-b-0 md:grid-cols-[130px_1fr]"
              >
                <div className="text-xs uppercase tracking-[0.32em] text-[#8d7442]">
                  pillar 0{index + 1}
                </div>
                <EditableText
                  data={data}
                  dataKey={key}
                  label={label}
                  as="p"
                  className="text-base leading-8 text-[#4e5b73]"
                />
              </div>
            ))}
          </div>
        </Reveal>

        <div className="monolith-accent-bar hidden lg:block" />

        <Reveal className="bg-[#102140]" delay={120}>
          <EditableImage
            data={data}
            dataKey="aboutImage"
            label="תמונת אודות"
            alt="Monolith about"
            className="h-full min-h-[420px] w-full object-cover lg:min-h-[560px]"
          />
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
    ["serviceOneTitle", "serviceOneText", "01"],
    ["serviceTwoTitle", "serviceTwoText", "02"],
    ["serviceThreeTitle", "serviceThreeText", "03"],
    ["serviceFourTitle", "serviceFourText", "04"],
  ];

  return (
    <section className="border-b border-[#c8a96a]/20 bg-[#0c1a33] px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            data={data}
            eyebrowKey="servicesEyebrow"
            eyebrowLabel="אייברו שירותים"
            titleKey="servicesTitle"
            titleLabel="כותרת שירותים"
            textKey={compact ? undefined : "heroPanelText"}
            textLabel="טקסט שירותים"
            dark
          />
        </Reveal>

        <div className="mt-10 grid gap-0 border border-[#c8a96a]/25">
          {services.map(([titleKey, textKey, code], index) => (
            <Reveal key={titleKey} delay={index * 70}>
              <article className="grid gap-0 border-b border-[#c8a96a]/25 last:border-b-0 lg:grid-cols-[180px_1px_1fr]">
                <div className="p-6 text-5xl font-semibold text-[#c8a96a] lg:p-8">{code}</div>
                <div className="monolith-accent-bar hidden lg:block" />
                <div className="p-6 lg:p-8">
                  <EditableText
                    data={data}
                    dataKey={titleKey}
                    label={`כותרת שירות ${index + 1}`}
                    as="h3"
                    className="text-3xl font-semibold text-[#f6f1e7]"
                  />
                  <EditableText
                    data={data}
                    dataKey={textKey}
                    label={`טקסט שירות ${index + 1}`}
                    as="p"
                    className="mt-4 max-w-3xl text-base leading-8 text-white/72"
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

function WorkSection({ data }: { data: Record<string, any> }) {
  const work = [
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
    <section className="border-b border-[#d7c7a5] bg-[#f6f1e7] px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            data={data}
            eyebrowKey="workEyebrow"
            eyebrowLabel="אייברו פרויקטים"
            titleKey="workTitle"
            titleLabel="כותרת פרויקטים"
            textKey="heroSubtitle"
            textLabel="טקסט פרויקטים"
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {work.map((item, index) => (
            <Reveal key={item.titleKey} delay={index * 80}>
              <article className="border border-[#d7c7a5] bg-white">
                <EditableImage
                  data={data}
                  dataKey={item.imageKey}
                  label={`תמונת פרויקט ${index + 1}`}
                  alt={`Project ${index + 1}`}
                  className="h-72 w-full border-b border-[#d7c7a5] object-cover"
                />
                <div className="p-6">
                  <EditableText
                    data={data}
                    dataKey={item.tagKey}
                    label={`תג פרויקט ${index + 1}`}
                    as="p"
                    className="text-xs uppercase tracking-[0.32em] text-[#8d7442]"
                  />
                  <EditableText
                    data={data}
                    dataKey={item.titleKey}
                    label={`כותרת פרויקט ${index + 1}`}
                    as="h3"
                    className="mt-4 text-2xl font-semibold text-[#0c1a33]"
                  />
                  <EditableText
                    data={data}
                    dataKey={item.textKey}
                    label={`טקסט פרויקט ${index + 1}`}
                    as="p"
                    className="mt-4 text-base leading-8 text-[#4e5b73]"
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
    <section className="border-b border-[#c8a96a]/20 bg-[#102140] px-4 py-20 lg:px-8">
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

        <div className="mt-10 grid gap-0 border border-[#c8a96a]/25">
          {steps.map(([titleKey, textKey], index) => (
            <Reveal key={titleKey} delay={index * 70}>
              <div className="grid gap-0 border-b border-[#c8a96a]/25 last:border-b-0 lg:grid-cols-[160px_1px_1fr]">
                <div className="p-6 text-4xl font-semibold text-[#c8a96a] lg:p-8">
                  0{index + 1}
                </div>
                <div className="monolith-accent-bar hidden lg:block" />
                <div className="p-6 lg:p-8">
                  <EditableText
                    data={data}
                    dataKey={titleKey}
                    label={`כותרת שלב ${index + 1}`}
                    as="h3"
                    className="text-3xl font-semibold text-[#f6f1e7]"
                  />
                  <EditableText
                    data={data}
                    dataKey={textKey}
                    label={`טקסט שלב ${index + 1}`}
                    as="p"
                    className="mt-4 max-w-3xl text-base leading-8 text-white/72"
                  />
                </div>
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
    <section className="border-b border-[#d7c7a5] bg-white px-4 py-20 lg:px-8">
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
              <article className="border border-[#d7c7a5] bg-[#f6f1e7] p-6">
                <EditableText
                  data={data}
                  dataKey={tagKey}
                  label={`תג תובנה ${index + 1}`}
                  as="p"
                  className="text-xs uppercase tracking-[0.34em] text-[#8d7442]"
                />
                <EditableText
                  data={data}
                  dataKey={titleKey}
                  label={`כותרת תובנה ${index + 1}`}
                  as="h3"
                  className="mt-5 text-2xl font-semibold leading-[1.2] text-[#0c1a33]"
                />
                <EditableText
                  data={data}
                  dataKey={textKey}
                  label={`טקסט תובנה ${index + 1}`}
                  as="p"
                  className="mt-4 text-base leading-8 text-[#4e5b73]"
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
    ["phone", "טלפון", "01"],
    ["email", "אימייל", "02"],
    ["address", "כתובת", "03"],
    ["hours", "שעות פעילות", "04"],
  ];

  return (
    <section className="border-b border-[#c8a96a]/20 bg-[#0c1a33] px-4 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-0 border border-[#c8a96a]/25 lg:grid-cols-[1fr_1px_1fr]">
        <Reveal className="bg-[#102140] p-6 lg:p-10" delay={30}>
          <EditableText
            data={data}
            dataKey="contactEyebrow"
            label="אייברו יצירת קשר"
            as="p"
            className="text-xs uppercase tracking-[0.36em] text-[#c8a96a]"
          />
          <EditableText
            data={data}
            dataKey={titleKey}
            label="כותרת יצירת קשר"
            as="h2"
            className="mt-6 text-4xl font-semibold leading-[1.08] text-[#f6f1e7] md:text-5xl"
          />
          <EditableText
            data={data}
            dataKey={textKey}
            label="טקסט יצירת קשר"
            as="p"
            className="mt-5 text-base leading-8 text-white/72"
          />

          <div className="mt-10 grid gap-0 border border-[#c8a96a]/20">
            {info.map(([key, label, code]) => (
              <div
                key={key}
                className="grid gap-4 border-b border-[#c8a96a]/20 p-5 last:border-b-0 md:grid-cols-[90px_1fr]"
              >
                <div className="text-xs uppercase tracking-[0.32em] text-[#c8a96a]/70">
                  {code}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-[#c8a96a]/70">
                    {label}
                  </div>
                  <EditableText
                    data={data}
                    dataKey={key}
                    label={label}
                    as="div"
                    className="mt-2 text-lg text-[#f6f1e7]"
                  />
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="monolith-accent-bar hidden lg:block" />

        <Reveal className="bg-[#f6f1e7] p-6 lg:p-10" delay={130}>
          <form
            data-bizuply-form-builder="true"
            data-visual-editable="true"
            data-visual-edit-id="contact.form"
            data-visual-edit-type="box"
            data-visual-edit-label="טופס יצירת קשר"
            className="grid gap-0 border border-[#d7c7a5] bg-white"
          >
            <input
              className="border-b border-[#d7c7a5] bg-transparent px-5 py-4 text-right text-sm outline-none placeholder:text-[#7d8596] md:border-l"
              placeholder="שם מלא"
              data-visual-editable="true"
              data-visual-edit-id="contact.form.name"
              data-visual-edit-type="control"
              data-visual-edit-label="שדה שם"
            />
            <input
              className="border-b border-[#d7c7a5] bg-transparent px-5 py-4 text-right text-sm outline-none placeholder:text-[#7d8596]"
              placeholder="טלפון"
              data-visual-editable="true"
              data-visual-edit-id="contact.form.phone"
              data-visual-edit-type="control"
              data-visual-edit-label="שדה טלפון"
            />
            <input
              className="border-b border-[#d7c7a5] bg-transparent px-5 py-4 text-right text-sm outline-none placeholder:text-[#7d8596] md:border-l"
              placeholder="אימייל"
              data-visual-editable="true"
              data-visual-edit-id="contact.form.email"
              data-visual-edit-type="control"
              data-visual-edit-label="שדה אימייל"
            />
            <input
              className="border-b border-[#d7c7a5] bg-transparent px-5 py-4 text-right text-sm outline-none placeholder:text-[#7d8596]"
              placeholder="תחום ייעוץ"
              data-visual-editable="true"
              data-visual-edit-id="contact.form.topic"
              data-visual-edit-type="control"
              data-visual-edit-label="שדה תחום ייעוץ"
            />
            <textarea
              className="min-h-40 border-b border-[#d7c7a5] bg-transparent px-5 py-4 text-right text-sm outline-none placeholder:text-[#7d8596] md:col-span-2"
              placeholder="ספרו לנו על היעד העסקי, המורכבות הארגונית והטיימינג"
              data-visual-editable="true"
              data-visual-edit-id="contact.form.message"
              data-visual-edit-type="control"
              data-visual-edit-label="שדה הודעה"
            />
            <button
              type="button"
              className="bg-[#0c1a33] px-5 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#f6f1e7] transition hover:bg-[#102140] md:col-span-2"
              data-visual-editable="true"
              data-visual-edit-id="contact.form.submit"
              data-visual-edit-type="button"
              data-visual-edit-label="כפתור שליחת טופס"
            >
              <TemplateText
                as="span"
                editId="contactButton"
                editLabel="כפתור יצירת קשר"
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
    <section className="border-b border-[#c8a96a]/20 bg-[#102140] px-4 py-20 lg:px-8">
      <Reveal className="mx-auto max-w-7xl border border-[#c8a96a]/25 bg-[#0c1a33] p-6 lg:p-10">
        <div className="grid gap-0 lg:grid-cols-[1fr_1px_0.8fr] lg:items-center">
          <div className="pb-8 text-right lg:pb-0 lg:pl-8">
            <div className="text-xs uppercase tracking-[0.36em] text-[#c8a96a]">
              board call
            </div>
            <EditableText
              data={data}
              dataKey="ctaTitle"
              label="כותרת קריאה לפעולה"
              as="h2"
              className="mt-6 text-4xl font-semibold leading-[1.08] text-[#f6f1e7] md:text-5xl"
            />
            <EditableText
              data={data}
              dataKey="ctaText"
              label="טקסט קריאה לפעולה"
              as="p"
              className="mt-5 max-w-2xl text-base leading-8 text-white/72"
            />
          </div>
          <div className="monolith-accent-bar hidden lg:block" />
          <div className="flex flex-col gap-3 lg:items-end lg:pr-8">
            <button
              type="button"
              onClick={() => goTo("contact")}
              className="border border-[#c8a96a] bg-[#c8a96a] px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#0c1a33] transition hover:bg-transparent hover:text-[#f6f1e7]"
            >
              <TemplateText
                as="span"
                editId="ctaButton"
                editLabel="כפתור קריאה לפעולה"
              >
                {getValue(data, "ctaButton")}
              </TemplateText>
            </button>
            <button
              type="button"
              onClick={() => goTo("services")}
              className="border border-[#c8a96a]/35 px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#f6f1e7] transition hover:border-[#c8a96a]"
            >
              <TemplateText
                as="span"
                editId="navServices"
                editLabel="כפתור שירותים בפוטר"
              >
                {getValue(data, "navServices")}
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
    <footer className="bg-[#0c1a33] px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl border border-[#c8a96a]/25 bg-[#102140]">
        <div className="grid gap-0 border-b border-[#c8a96a]/25 lg:grid-cols-[0.85fr_1px_1.15fr]">
          <div className="border-b border-[#c8a96a]/25 p-6 lg:border-b-0 lg:p-8">
            <MonolithMark data={data} />
            <EditableText
              data={data}
              dataKey="footerText"
              label="טקסט פוטר"
              as="p"
              className="mt-5 max-w-xl text-sm leading-7 text-white/68"
            />
          </div>
          <div className="monolith-accent-bar hidden lg:block" />
          <div className="p-6 lg:p-8">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {nav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(item.id)}
                  className="border border-[#c8a96a]/20 px-4 py-3 text-right text-sm uppercase tracking-[0.18em] text-[#f6f1e7] transition hover:border-[#c8a96a]"
                >
                  <TemplateText
                    as="span"
                    editId={item.key}
                    editLabel={item.label}
                  >
                    {getValue(data, item.key)}
                  </TemplateText>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 px-6 py-4 text-[11px] uppercase tracking-[0.26em] text-[#c8a96a]/75 md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} {getValue(data, "brandName")}
          </div>
          <div>Monolith template · Bizuply Studio</div>
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
    about: "I",
    services: "II",
    work: "III",
    insights: "IV",
    contact: "V",
  };

  return (
    <section className="border-b border-[#c8a96a]/20 bg-[#102140] px-4 py-20 lg:px-8">
      <Reveal className="mx-auto grid max-w-7xl gap-0 border border-[#c8a96a]/25 lg:grid-cols-[180px_1px_1fr]">
        <div className="border-b border-[#c8a96a]/25 p-6 text-center text-5xl font-semibold text-[#c8a96a] lg:border-b-0 lg:p-10">
          {indexMap[type]}
        </div>
        <div className="monolith-accent-bar hidden lg:block" />
        <div className="p-6 lg:p-10">
          <EditableText
            data={data}
            dataKey={keys.eyebrowKey}
            label={`אייברו עמוד ${type}`}
            as="p"
            className="text-xs uppercase tracking-[0.36em] text-[#c8a96a]"
          />
          <EditableText
            data={data}
            dataKey={keys.titleKey}
            label={`כותרת עמוד ${type}`}
            as="h1"
            className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.96] text-[#f6f1e7] md:text-7xl"
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

export default function MonolithPages({
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
}: MonolithPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...monolithDefaultData,
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
    { allowedPages: monolithAllowedPages, fallbackPage: "home" },
  );

  return (
    <div
      dir="rtl"
      data-template-id="monolith"
      data-template-mode={mode}
      className="min-h-screen overflow-x-hidden bg-[#0c1a33] text-[#0c1a33]"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      <style>{monolithEditorCss}</style>
      <style>{`
        @keyframes monolith-marquee {
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
          ...monolithPages
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
