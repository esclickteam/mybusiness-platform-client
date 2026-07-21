import React, { useMemo } from "react";

import {
  ContactFormBlock,
  CtaBand,
  PageHero,
  RectFooter,
  RectHeader,
  RectTemplateShell,
  Reveal,
  SectionTitle,
  StatRow,
  TemplateText,
  VisualPageStack,
  cx,
  makeGetValue,
  useRectTemplateApp,
  type RectPageDef,
  type RectTemplateNavProps,
  type RectTheme,
} from "./rectTemplateKit";

export type RectLayoutVariant =
  | "gridline"
  | "monolith"
  | "vertex"
  | "framehaus"
  | "steelworks"
  | "prism"
  | "horizon"
  | "ledger"
  | "kinetic"
  | "citadel";

type CreateRectTemplateOptions = {
  id: string;
  variant: RectLayoutVariant;
  theme: RectTheme;
  pages: RectPageDef[];
  defaultData: Record<string, any>;
  editorCss?: string;
  fontFamily?: string;
};

function buildNav(pages: RectPageDef[], getValue: (d: Record<string, any>, k: string) => string, data: Record<string, any>) {
  const map: Record<string, string> = {
    home: "navHome",
    about: "navAbout",
    services: "navServices",
    work: "navWork",
    insights: "navInsights",
    contact: "navContact",
  };
  return pages
    .filter((p) => p.id !== "home")
    .map((p) => [p.id, getValue(data, map[p.id] || p.label)] as [string, string]);
}

function HeroVariant({
  variant,
  theme,
  data,
  getValue,
  goTo,
}: {
  variant: RectLayoutVariant;
  theme: RectTheme;
  data: Record<string, any>;
  getValue: (d: Record<string, any>, k: string) => string;
  goTo: (p: string) => void;
}) {
  const title = getValue(data, "heroTitle");
  const subtitle = getValue(data, "heroSubtitle");
  const eyebrow = getValue(data, "heroEyebrow");
  const image = getValue(data, "heroImage");

  if (variant === "gridline") {
    return (
      <section className="relative border-b" style={{ borderColor: theme.border }}>
        <div className={`${variant}-hero-grid pointer-events-none absolute inset-0 opacity-40`} />
        <div className="mx-auto grid min-h-[88vh] max-w-[1400px] grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center border-b px-6 py-16 md:border-b-0 md:border-l md:px-10 md:py-24" style={{ borderColor: theme.border }}>
            <TemplateText as="p" className="rect-animate-left mb-6 text-xs font-bold uppercase tracking-[0.34em]" style={{ color: theme.accent, animationDelay: "80ms" }}>
              {eyebrow}
            </TemplateText>
            <TemplateText as="h1" className="rect-animate-left text-5xl font-black leading-[0.95] md:text-7xl" style={{ animationDelay: "180ms" }}>
              {title}
            </TemplateText>
            <TemplateText as="p" className="rect-animate-left mt-6 max-w-xl text-lg leading-8" style={{ color: theme.muted, animationDelay: "280ms" }}>
              {subtitle}
            </TemplateText>
            <div className="rect-animate-left mt-10 flex flex-wrap gap-0" style={{ animationDelay: "380ms" }}>
              <button type="button" className="px-7 py-4 text-sm font-black" style={{ background: theme.accent, color: theme.light || "#fff" }}>
                {getValue(data, "heroPrimaryButton")}
              </button>
              <button type="button" onClick={() => goTo("work")} className="border px-7 py-4 text-sm font-bold" style={{ borderColor: theme.border }}>
                {getValue(data, "heroSecondaryButton")}
              </button>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden md:min-h-full">
            <img src={image} alt="" className="h-full w-full object-cover rect-animate-right" style={{ animationDelay: "220ms" }} />
            <div className="absolute inset-0 border-8 border-transparent" style={{ boxShadow: `inset 0 0 0 1px ${theme.border}` }} />
          </div>
        </div>
      </section>
    );
  }

  if (variant === "monolith") {
    return (
      <section style={{ background: theme.dark || theme.text, color: theme.light || "#fff" }}>
        <div className="mx-auto max-w-[1400px] px-6 py-24 md:py-32">
          <div className="grid gap-0 md:grid-cols-[1fr_auto_1fr]">
            <div className="hidden md:block" style={{ borderRight: `1px solid ${theme.accent}44` }} />
            <div className="px-0 py-4 text-center md:px-16">
              <TemplateText as="p" className="rect-animate-rise mb-6 text-xs font-bold uppercase tracking-[0.38em]" style={{ color: theme.accent }}>
                {eyebrow}
              </TemplateText>
              <TemplateText as="h1" className="rect-animate-rise text-5xl font-bold leading-[1.02] md:text-8xl" style={{ fontFamily: "Georgia, serif" }}>
                {title}
              </TemplateText>
              <TemplateText as="p" className="rect-animate-rise mx-auto mt-8 max-w-2xl text-lg leading-8 opacity-70">
                {subtitle}
              </TemplateText>
            </div>
            <div className="hidden md:block" style={{ borderLeft: `1px solid ${theme.accent}44` }} />
          </div>
        </div>
        <div className="grid md:grid-cols-2">
          <img src={image} alt="" className="h-72 w-full object-cover md:h-96" />
          <div className="flex items-center justify-center border-t px-8 py-10 md:border-t-0 md:border-r" style={{ borderColor: `${theme.accent}33` }}>
            <button type="button" className="px-10 py-4 text-sm font-black" style={{ background: theme.accent, color: theme.dark || "#000" }}>
              {getValue(data, "heroPrimaryButton")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "vertex") {
    return (
      <section className="relative overflow-hidden" style={{ background: theme.bg }}>
        <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, transparent 40%, ${theme.accent} 40%, ${theme.accent} 42%, transparent 42%)` }} />
        <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-6 py-24 md:grid-cols-2 md:py-32">
          <div>
            <TemplateText as="p" className="mb-5 font-mono text-xs uppercase tracking-[0.3em]" style={{ color: theme.accent }}>
              {eyebrow}
            </TemplateText>
            <TemplateText as="h1" className="text-5xl font-black uppercase leading-[0.92] md:text-7xl">
              {title}
            </TemplateText>
            <TemplateText as="p" className="mt-6 max-w-lg text-lg leading-8" style={{ color: theme.muted }}>
              {subtitle}
            </TemplateText>
          </div>
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full border-2" style={{ borderColor: theme.accent }} />
            <img src={image} alt="" className="relative h-80 w-full object-cover md:h-[420px]" />
          </div>
        </div>
      </section>
    );
  }

  if (variant === "framehaus") {
    return (
      <section className="px-4 py-16 md:px-8 md:py-24" style={{ background: theme.bg }}>
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-4">
          <div className="col-span-12 flex flex-col justify-end md:col-span-5">
            <TemplateText as="h1" className="text-6xl font-black leading-[0.9] md:text-8xl">
              {title}
            </TemplateText>
            <TemplateText as="p" className="mt-6 text-base leading-7" style={{ color: theme.muted }}>
              {subtitle}
            </TemplateText>
          </div>
          <div className="col-span-7 hidden md:block">
            <img src={image} alt="" className="h-[480px] w-full object-cover" />
          </div>
          <div className="col-span-5 md:col-span-4">
            <div className="border-4 p-2" style={{ borderColor: theme.text }}>
              <img src={image} alt="" className="h-56 w-full object-cover md:hidden" />
            </div>
          </div>
          <div className="col-span-7 flex items-end md:col-span-3">
            <TemplateText as="p" className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: theme.accent }}>
              {eyebrow}
            </TemplateText>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "steelworks") {
    return (
      <section className="relative">
        <img src={image} alt="" className="h-[70vh] w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,.82), transparent 55%)" }} />
        <div className="absolute inset-x-0 bottom-0">
          <div className={`${variant}-accent-bar h-2 w-full`} />
          <div className="px-6 py-10 md:px-8" style={{ background: theme.bg, color: theme.text }}>
            <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <TemplateText as="h1" className="text-4xl font-black uppercase md:text-6xl">{title}</TemplateText>
                <TemplateText as="p" className="mt-4 max-w-2xl text-lg" style={{ color: theme.muted }}>{subtitle}</TemplateText>
              </div>
              <button type="button" className="h-fit px-8 py-4 text-sm font-black" style={{ background: theme.accent, color: "#000" }}>
                {getValue(data, "heroPrimaryButton")}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "prism") {
    return (
      <section>
        <div className="grid md:grid-cols-3">
          {[
            { bg: "#ff0033", t: eyebrow },
            { bg: theme.accent, t: title.split(" ")[0] || title },
            { bg: "#ffcc00", t: getValue(data, "brandName") },
          ].map((col, i) => (
            <div key={i} className="flex min-h-[220px] flex-col justify-end p-8 md:min-h-[360px]" style={{ background: col.bg, color: i === 2 ? "#000" : "#fff" }}>
              <TemplateText as="div" className="text-3xl font-black uppercase md:text-5xl">{col.t}</TemplateText>
            </div>
          ))}
        </div>
        <div className="border-b px-6 py-12 md:px-8" style={{ borderColor: theme.border, background: theme.bg }}>
          <TemplateText as="h1" className="mx-auto max-w-[1400px] text-4xl font-black md:text-6xl">{title}</TemplateText>
          <TemplateText as="p" className="mx-auto mt-4 max-w-[1400px] text-lg" style={{ color: theme.muted }}>{subtitle}</TemplateText>
        </div>
      </section>
    );
  }

  if (variant === "horizon") {
    return (
      <section className="relative">
        <img src={image} alt="" className="h-[75vh] w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 border-t-4" style={{ borderColor: theme.accent, background: `${theme.bg}f0` }}>
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-6 py-10 md:grid-cols-[1fr_auto] md:px-8">
            <div>
              <TemplateText as="p" className="mb-3 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: theme.accent }}>{eyebrow}</TemplateText>
              <TemplateText as="h1" className="text-4xl font-bold md:text-6xl">{title}</TemplateText>
            </div>
            <TemplateText as="p" className="max-w-md text-base leading-7" style={{ color: theme.muted }}>{subtitle}</TemplateText>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "ledger") {
    return (
      <section className="border-b" style={{ borderColor: theme.border, background: theme.bg }}>
        <div className="mx-auto grid max-w-[1400px] md:grid-cols-2">
          <div className="border-b px-6 py-16 md:border-b-0 md:border-l md:px-10 md:py-24" style={{ borderColor: theme.border }}>
            <TemplateText as="p" className="mb-4 font-mono text-xs uppercase tracking-widest" style={{ color: theme.accent }}>{eyebrow}</TemplateText>
            <TemplateText as="h1" className="text-5xl font-bold leading-tight md:text-6xl">{title}</TemplateText>
            <TemplateText as="p" className="mt-6 text-lg leading-8" style={{ color: theme.muted }}>{subtitle}</TemplateText>
          </div>
          <div className="grid grid-rows-4">
            {["אסטרטגיה", "ביצוע", "בקרה", "דיווח"].map((row) => (
              <div key={row} className="flex items-center justify-between border-b px-8 py-5 font-mono text-sm" style={{ borderColor: theme.border }}>
                <span>{row}</span>
                <span style={{ color: theme.accent }}>▣</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "kinetic") {
    return (
      <section style={{ background: theme.bg, color: theme.text }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="rect-pulse-bar h-1 w-full" style={{ background: theme.accent, animationDelay: `${i * 0.3}s` }} />
        ))}
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:py-28">
          <TemplateText as="h1" className="text-6xl font-black uppercase italic leading-[0.88] md:text-8xl">{title}</TemplateText>
          <TemplateText as="p" className="mt-8 max-w-2xl text-xl font-bold uppercase tracking-wide" style={{ color: theme.accent }}>{subtitle}</TemplateText>
        </div>
      </section>
    );
  }

  // citadel
  return (
    <section className="relative overflow-hidden font-mono" style={{ background: theme.bg, color: theme.text }}>
      <div className="rect-scan-line pointer-events-none absolute inset-x-0 h-24 opacity-10" style={{ background: `linear-gradient(to bottom, transparent, ${theme.accent}, transparent)` }} />
      <div className="mx-auto max-w-[1400px] border px-6 py-16 md:px-8 md:py-24" style={{ borderColor: `${theme.accent}44` }}>
        <TemplateText as="p" className="mb-4 text-xs" style={{ color: theme.accent }}>
          {`> ${eyebrow}_`}
        </TemplateText>
        <TemplateText as="h1" className="text-4xl font-bold leading-tight md:text-6xl">{title}</TemplateText>
        <TemplateText as="p" className="mt-6 max-w-2xl text-sm leading-7 opacity-75">{subtitle}</TemplateText>
        <div className="mt-8 grid gap-2 md:grid-cols-3">
          {["ENCRYPT", "MONITOR", "RESPOND"].map((cmd) => (
            <div key={cmd} className="border px-4 py-3 text-xs" style={{ borderColor: `${theme.accent}55` }}>
              [{cmd}]
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TickerSection({ theme, data, getValue, variant }: { theme: RectTheme; data: Record<string, any>; getValue: any; variant: RectLayoutVariant }) {
  const items = [getValue(data, "brandName"), getValue(data, "tagline"), getValue(data, "heroEyebrow"), "PREMIUM", "2026", "BIZUPLY"];
  return (
    <section className="overflow-hidden border-y py-4" style={{ borderColor: theme.border, background: variant === "citadel" ? theme.dark || theme.bg : theme.surface }}>
      <div className="rect-marquee-track flex w-max gap-0">
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className={`${variant}-marquee-item shrink-0 border-l px-8 text-xs font-bold uppercase tracking-[0.35em]`} style={{ color: theme.accent }}>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function AboutSection({ theme, data, getValue }: { theme: RectTheme; data: Record<string, any>; getValue: any }) {
  return (
    <Reveal id="about-main">
      <section className="px-4 py-20 md:px-8 md:py-28" style={{ background: theme.surface }}>
        <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-2">
          <img src={getValue(data, "aboutImage")} alt="" className="h-[420px] w-full object-cover" />
          <div className="flex flex-col justify-center text-right">
            <SectionTitle eyebrow={getValue(data, "aboutEyebrow")} title={getValue(data, "aboutTitle")} text={getValue(data, "aboutText")} theme={theme} />
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function ServicesSection({ theme, data, getValue }: { theme: RectTheme; data: Record<string, any>; getValue: any }) {
  const items = [1, 2, 3, 4].map((n) => ({
    title: getValue(data, `service${["One", "Two", "Three", "Four"][n - 1]}Title`),
    text: getValue(data, `service${["One", "Two", "Three", "Four"][n - 1]}Text`),
  }));
  return (
    <Reveal id="services-main">
      <section className="border-t px-4 py-20 md:px-8 md:py-28" style={{ borderColor: theme.border, background: theme.bg }}>
        <div className="mx-auto max-w-[1400px]">
          <SectionTitle eyebrow={getValue(data, "servicesEyebrow")} title={getValue(data, "servicesTitle")} theme={theme} center />
          <div className="mt-14 grid gap-0 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <div key={item.title} className="border p-8" style={{ borderColor: theme.border, background: index % 2 ? theme.surface : theme.bg }}>
                <TemplateText as="div" className="mb-4 text-xs font-black" style={{ color: theme.accent }}>
                  0{index + 1}
                </TemplateText>
                <TemplateText as="h3" className="text-xl font-bold">{item.title}</TemplateText>
                <TemplateText as="p" className="mt-4 text-sm leading-7" style={{ color: theme.muted }}>{item.text}</TemplateText>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function WorkSection({ theme, data, getValue }: { theme: RectTheme; data: Record<string, any>; getValue: any }) {
  const items = [1, 2, 3].map((n) => ({
    title: getValue(data, `work${["One", "Two", "Three"][n - 1]}Title`),
    text: getValue(data, `work${["One", "Two", "Three"][n - 1]}Text`),
  }));
  return (
    <Reveal id="work-main">
      <section className="px-4 py-20 md:px-8 md:py-28" style={{ background: theme.dark || theme.text, color: theme.light || "#fff" }}>
        <div className="mx-auto max-w-[1400px]">
          <SectionTitle eyebrow={getValue(data, "workEyebrow")} title={getValue(data, "workTitle")} theme={theme} light center />
          <div className="mt-14 grid gap-0 md:grid-cols-3">
            {items.map((item, i) => (
              <div key={item.title} className="group border p-8 transition duration-500 hover:-translate-y-1" style={{ borderColor: `${theme.accent}33` }}>
                <div className="mb-6 h-40 w-full" style={{ background: `linear-gradient(135deg, ${theme.accent}55, transparent)` }} />
                <TemplateText as="h3" className="text-2xl font-bold">{item.title}</TemplateText>
                <TemplateText as="p" className="mt-3 text-sm leading-7 opacity-65">{item.text}</TemplateText>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function ProcessSection({ theme, data, getValue }: { theme: RectTheme; data: Record<string, any>; getValue: any }) {
  const steps = [1, 2, 3, 4].map((n) => ({
    title: getValue(data, `process${["One", "Two", "Three", "Four"][n - 1]}Title`),
    text: getValue(data, `process${["One", "Two", "Three", "Four"][n - 1]}Text`),
  }));
  return (
    <Reveal id="process-main">
      <section className="border-t px-4 py-20 md:px-8" style={{ borderColor: theme.border, background: theme.surface }}>
        <div className="mx-auto max-w-[1400px]">
          <SectionTitle eyebrow={getValue(data, "processEyebrow")} title={getValue(data, "processTitle")} theme={theme} />
          <div className="mt-12 grid gap-0 md:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="border px-6 py-8" style={{ borderColor: theme.border }}>
                <TemplateText as="div" className="text-4xl font-black" style={{ color: theme.accent }}>{i + 1}</TemplateText>
                <TemplateText as="h3" className="mt-4 text-lg font-bold">{step.title}</TemplateText>
                <TemplateText as="p" className="mt-3 text-sm leading-7" style={{ color: theme.muted }}>{step.text}</TemplateText>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function InsightsSection({ theme, data, getValue }: { theme: RectTheme; data: Record<string, any>; getValue: any }) {
  return (
    <Reveal id="insights-main">
      <section className="px-4 py-20 md:px-8" style={{ background: theme.bg }}>
        <div className="mx-auto max-w-[1400px]">
          <SectionTitle eyebrow={getValue(data, "insightsEyebrow")} title={getValue(data, "insightsTitle")} theme={theme} />
          <div className="mt-12 grid gap-0 md:grid-cols-2">
            {[1, 2].map((n) => (
              <article key={n} className="border p-8" style={{ borderColor: theme.border }}>
                <TemplateText as="h3" className="text-2xl font-bold">{getValue(data, `insight${["One", "Two"][n - 1]}Title`)}</TemplateText>
                <TemplateText as="p" className="mt-4 leading-7" style={{ color: theme.muted }}>{getValue(data, `insight${["One", "Two"][n - 1]}Text`)}</TemplateText>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function ContactSection({ theme, data, getValue }: { theme: RectTheme; data: Record<string, any>; getValue: any }) {
  return (
    <Reveal id="contact-main">
      <section className="px-4 py-20 md:px-8 md:py-28" style={{ background: theme.surface }}>
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionTitle eyebrow={getValue(data, "contactEyebrow")} title={getValue(data, "contactTitle")} text={getValue(data, "contactText")} theme={theme} />
            <div className="mt-8 space-y-2 text-sm" style={{ color: theme.muted }}>
              <TemplateText as="div">{getValue(data, "phone")}</TemplateText>
              <TemplateText as="div">{getValue(data, "email")}</TemplateText>
              <TemplateText as="div">{getValue(data, "address")}</TemplateText>
            </div>
          </div>
          <ContactFormBlock theme={theme} data={data} getValue={getValue} />
        </div>
      </section>
    </Reveal>
  );
}

function getPageTitle(data: Record<string, any>, type: string, getValue: (d: Record<string, any>, k: string) => string) {
  const map: Record<string, string> = {
    about: "navAbout",
    services: "navServices",
    work: "navWork",
    insights: "navInsights",
    contact: "navContact",
  };
  return getValue(data, map[type] || "brandName");
}

export function createRectTemplatePages(options: CreateRectTemplateOptions) {
  const { id, variant, theme, pages, defaultData, editorCss, fontFamily } = options;

  function TemplatePages(props: RectTemplateNavProps) {
    const mergedData = useMemo(() => ({ ...defaultData, ...(props.data ?? {}) }), [props.data]);
    const getValue = useMemo(() => makeGetValue(defaultData), []);
    const { currentPage, goTo } = useRectTemplateApp(props, pages);
    const nav = buildNav(pages, getValue, mergedData);
    const hasInsights = pages.some((p) => p.id === "insights");

    const stats: Array<[string, string]> = [
      [getValue(mergedData, "statOne"), getValue(mergedData, "statOneLabel")],
      [getValue(mergedData, "statTwo"), getValue(mergedData, "statTwoLabel")],
      [getValue(mergedData, "statThree"), getValue(mergedData, "statThreeLabel")],
      [getValue(mergedData, "statFour"), getValue(mergedData, "statFourLabel")],
    ];

    const HomePage = (
      <>
        <HeroVariant variant={variant} theme={theme} data={mergedData} getValue={getValue} goTo={goTo} />
        <TickerSection theme={theme} data={mergedData} getValue={getValue} variant={variant} />
        <section className="px-4 py-16 md:px-8" style={{ background: theme.bg }}>
          <div className="mx-auto max-w-[1400px]">
            <StatRow theme={theme} stats={stats} />
          </div>
        </section>
        <AboutSection theme={theme} data={mergedData} getValue={getValue} />
        <ServicesSection theme={theme} data={mergedData} getValue={getValue} />
        <WorkSection theme={theme} data={mergedData} getValue={getValue} />
        <ProcessSection theme={theme} data={mergedData} getValue={getValue} />
        {hasInsights ? <InsightsSection theme={theme} data={mergedData} getValue={getValue} /> : null}
        <CtaBand theme={theme} data={mergedData} getValue={getValue} onCta={() => goTo("contact")} />
      </>
    );

    function InnerPage({ type }: { type: string }) {
      const map: Record<string, React.ReactNode> = {
        about: (
          <>
            <AboutSection theme={theme} data={mergedData} getValue={getValue} />
            <ProcessSection theme={theme} data={mergedData} getValue={getValue} />
          </>
        ),
        services: (
          <>
            <ServicesSection theme={theme} data={mergedData} getValue={getValue} />
            <ProcessSection theme={theme} data={mergedData} getValue={getValue} />
          </>
        ),
        work: <WorkSection theme={theme} data={mergedData} getValue={getValue} />,
        insights: hasInsights ? <InsightsSection theme={theme} data={mergedData} getValue={getValue} /> : null,
        contact: <ContactSection theme={theme} data={mergedData} getValue={getValue} />,
      };

      return (
        <>
          <PageHero theme={theme} title={getPageTitle(mergedData, type, getValue)} eyebrow={getValue(mergedData, "brandName")} dark={variant !== "gridline"} />
          {map[type] ?? null}
          <CtaBand theme={theme} data={mergedData} getValue={getValue} onCta={() => goTo("contact")} />
        </>
      );
    }

    return (
      <RectTemplateShell
        templateId={id}
        theme={theme}
        mode={props.mode}
        fontFamily={fontFamily}
        editorCss={editorCss}
        header={
          <RectHeader
            theme={theme}
            data={mergedData}
            getValue={getValue}
            nav={[["home", getValue(mergedData, "navHome")], ...nav]}
            currentPage={currentPage}
            goTo={goTo}
            ctaLabel={getValue(mergedData, "heroPrimaryButton")}
            onCta={() => goTo("contact")}
          />
        }
        footer={
          <RectFooter theme={theme} data={mergedData} getValue={getValue} goTo={goTo} nav={[["home", getValue(mergedData, "navHome")], ...nav]} />
        }
      >
        <VisualPageStack
          activePageId={currentPage}
          pages={[
            { id: "home", content: HomePage },
            ...pages
              .filter((p) => p.id !== "home")
              .map((p) => ({ id: p.id, content: <InnerPage type={p.id} /> })),
          ]}
        />
      </RectTemplateShell>
    );
  }

  TemplatePages.displayName = `${id}Pages`;
  return TemplatePages;
}
