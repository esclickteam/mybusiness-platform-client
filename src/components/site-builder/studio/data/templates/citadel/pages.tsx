import React, { useMemo, useState } from "react";

import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { TemplateText } from "../shared/TemplateText";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { citadelDefaultData } from "./defaultData";
import { citadelEditorCss } from "./editorCss";

export const citadelPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const citadelAllowedPages = citadelPages.map((page) => page.id);

const citadelTheme = {
  bg: "#030a06",
  surface: "#071510",
  text: "#d7ffd9",
  muted: "#7fad85",
  accent: "#39ff14",
  border: "#39ff1426",
  dark: "#010503",
  light: "#effff0",
};

const terminalFont =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

type CitadelPagesProps = {
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

type TemplateData = Record<string, any>;

function getValue(data: TemplateData, key: string) {
  return data?.[key] ?? (citadelDefaultData as TemplateData)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatBracketLabel(label: string) {
  const normalized = String(label || "SYS").replace(/[\s/]+/g, "_").toUpperCase();
  return `[${normalized}]`;
}

function getPageTitle(data: TemplateData, pageId: string) {
  const map: Record<string, string> = {
    about: "navAbout",
    services: "navServices",
    work: "navWork",
    insights: "navInsights",
    contact: "navContact",
  };

  return getValue(data, map[pageId] || "brandName");
}

function buildStats(data: TemplateData) {
  return [
    [getValue(data, "statOne"), getValue(data, "statOneLabel")],
    [getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
    [getValue(data, "statThree"), getValue(data, "statThreeLabel")],
    [getValue(data, "statFour"), getValue(data, "statFourLabel")],
  ];
}

function buildNav(data: TemplateData) {
  return citadelPages.map((page) => {
    const labelMap: Record<string, string> = {
      home: "navHome",
      about: "navAbout",
      services: "navServices",
      work: "navWork",
      insights: "navInsights",
      contact: "navContact",
    };

    return [page.id, getValue(data, labelMap[page.id] || page.label)] as const;
  });
}

function TerminalLabel({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-sm border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em]",
        className,
      )}
      style={{
        borderColor: citadelTheme.border,
        color: citadelTheme.accent,
        background: "rgba(57, 255, 20, 0.05)",
      }}
    >
      {formatBracketLabel(label)}
    </span>
  );
}

function SectionHeading({
  label,
  title,
  text,
  center = false,
}: {
  label: string;
  title: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={cx("mx-auto max-w-4xl", center ? "text-center" : "text-right")}>
      <div className={cx("mb-5", center ? "justify-center" : "justify-start", "flex")}>
        <TerminalLabel label={label} />
      </div>
      <TemplateText
        as="h2"
        className="text-3xl font-bold leading-[1.1] tracking-[0.02em] md:text-5xl"
        style={{ color: citadelTheme.light }}
      >
        {title}
      </TemplateText>
      {text ? (
        <TemplateText
          as="p"
          className="mt-5 text-base leading-8 md:text-lg"
          style={{ color: citadelTheme.muted }}
        >
          {text}
        </TemplateText>
      ) : null}
    </div>
  );
}

function CitadelHeader({
  data,
  currentPage,
  goTo,
}: {
  data: TemplateData;
  currentPage: string;
  goTo: (pageId: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = buildNav(data);

  function handleNavigate(pageId: string) {
    goTo(pageId);
    setMobileOpen(false);
  }

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{
        borderColor: citadelTheme.border,
        background: "rgba(3, 10, 6, 0.9)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate("home")}
          className="flex items-center gap-3 text-right"
        >
          <span
            className="grid h-11 w-11 place-items-center border text-sm font-black tracking-[0.32em]"
            style={{
              borderColor: citadelTheme.accent,
              background: "rgba(57, 255, 20, 0.1)",
              color: citadelTheme.accent,
              boxShadow: "0 0 24px rgba(57, 255, 20, 0.15)",
            }}
          >
            {getValue(data, "logoText")}
          </span>
          <div className="hidden sm:block">
            <TemplateText
              as="div"
              className="text-lg font-bold uppercase tracking-[0.3em]"
              style={{ color: citadelTheme.light }}
            >
              {getValue(data, "brandName")}
            </TemplateText>
            <TemplateText
              as="div"
              className="mt-1 text-[11px] uppercase tracking-[0.26em]"
              style={{ color: citadelTheme.muted }}
            >
              {formatBracketLabel(getValue(data, "tagline") || "security")}
            </TemplateText>
          </div>
        </button>

        <nav className="hidden items-center gap-2 xl:flex">
          {nav.map(([pageId, label]) => {
            const isActive = currentPage === pageId;
            return (
              <button
                key={pageId}
                type="button"
                onClick={() => handleNavigate(pageId)}
                className="rounded-sm border px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] transition duration-300"
                style={{
                  borderColor: isActive ? citadelTheme.accent : citadelTheme.border,
                  color: isActive ? citadelTheme.accent : citadelTheme.text,
                  background: isActive ? "rgba(57, 255, 20, 0.08)" : "transparent",
                  boxShadow: isActive
                    ? "inset 0 0 0 1px rgba(57, 255, 20, 0.16), 0 0 18px rgba(57, 255, 20, 0.08)"
                    : "none",
                }}
              >
                {formatBracketLabel(String(label))}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavigate("contact")}
            className="hidden rounded-sm border px-5 py-3 text-xs font-bold uppercase tracking-[0.28em] transition duration-300 hover:-translate-y-0.5 md:inline-flex"
            style={{
              borderColor: citadelTheme.accent,
              background: citadelTheme.accent,
              color: citadelTheme.dark,
              boxShadow: "0 0 20px rgba(57, 255, 20, 0.16)",
            }}
          >
            {formatBracketLabel("engage")}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-sm border text-lg xl:hidden"
            style={{ borderColor: citadelTheme.border, color: citadelTheme.accent }}
          >
            {mobileOpen ? "×" : "≡"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          className="border-t px-5 pb-5 pt-4 xl:hidden"
          style={{ borderColor: citadelTheme.border, background: citadelTheme.surface }}
        >
          <div className="grid gap-2">
            {nav.map(([pageId, label]) => {
              const isActive = currentPage === pageId;
              return (
                <button
                  key={pageId}
                  type="button"
                  onClick={() => handleNavigate(pageId)}
                  className="rounded-sm border px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.24em]"
                  style={{
                    borderColor: isActive ? citadelTheme.accent : citadelTheme.border,
                    color: isActive ? citadelTheme.dark : citadelTheme.text,
                    background: isActive ? citadelTheme.accent : "transparent",
                  }}
                >
                  {formatBracketLabel(String(label))}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function HeroSection({
  data,
  goTo,
}: {
  data: TemplateData;
  goTo: (pageId: string) => void;
}) {
  const commandBlocks = ["ENCRYPT", "MONITOR", "RESPOND"];
  const statusRows = [
    `${getValue(data, "statOne")} :: ${getValue(data, "statOneLabel")}`,
    `${getValue(data, "statTwo")} :: ${getValue(data, "statTwoLabel")}`,
    `${getValue(data, "statThree")} :: ${getValue(data, "statThreeLabel")}`,
    `${getValue(data, "statFour")} :: ${getValue(data, "statFourLabel")}`,
  ];

  return (
    <section className="relative overflow-hidden border-b" style={{ borderColor: citadelTheme.border }}>
      <div className="citadel-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="citadel-scan-band pointer-events-none absolute inset-x-0 top-0 h-32 opacity-20" />
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
        <div className="relative z-10">
          <div className="mb-6 flex flex-wrap gap-3">
            <TerminalLabel label="root.access" className="rect-animate-left" />
            <TerminalLabel label="zero.trust" className="rect-animate-left" />
          </div>
          <TemplateText
            as="p"
            className="rect-animate-left text-xs font-bold uppercase tracking-[0.34em]"
            style={{ color: citadelTheme.accent, animationDelay: "80ms" }}
          >
            {`> ${String(getValue(data, "heroEyebrow") || "cybersecurity").toUpperCase()}_BOOT`}
          </TemplateText>
          <TemplateText
            as="h1"
            className="rect-animate-left mt-6 max-w-4xl text-4xl font-bold leading-[1.03] tracking-[0.02em] md:text-6xl xl:text-7xl"
            style={{ color: citadelTheme.light, animationDelay: "160ms" }}
          >
            {getValue(data, "heroTitle")}
          </TemplateText>
          <TemplateText
            as="p"
            className="rect-animate-left mt-6 max-w-2xl text-base leading-8 md:text-lg"
            style={{ color: citadelTheme.muted, animationDelay: "260ms" }}
          >
            {getValue(data, "heroSubtitle")}
          </TemplateText>
          <div className="rect-animate-left mt-10 flex flex-wrap gap-3" style={{ animationDelay: "340ms" }}>
            <button
              type="button"
              onClick={() => goTo("contact")}
              className="rounded-sm border px-6 py-4 text-xs font-black uppercase tracking-[0.28em] transition duration-300 hover:-translate-y-0.5"
              style={{
                borderColor: citadelTheme.accent,
                background: citadelTheme.accent,
                color: citadelTheme.dark,
                boxShadow: "0 0 22px rgba(57, 255, 20, 0.16)",
              }}
            >
              {formatBracketLabel("engage")}
            </button>
            <button
              type="button"
              onClick={() => goTo("work")}
              className="rounded-sm border px-6 py-4 text-xs font-bold uppercase tracking-[0.28em] transition duration-300 hover:border-[#39ff14]"
              style={{ borderColor: citadelTheme.border, color: citadelTheme.text }}
            >
              {formatBracketLabel("inspect.work")}
            </button>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {commandBlocks.map((block, index) => (
              <div
                key={block}
                className="rect-animate-rise citadel-panel rounded-sm px-4 py-4 text-left"
                style={{ animationDelay: `${420 + index * 90}ms` }}
              >
                <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: citadelTheme.accent }}>
                  {formatBracketLabel(block)}
                </div>
                <div className="text-sm leading-7" style={{ color: citadelTheme.muted }}>
                  {block === "ENCRYPT"
                    ? "Transport, identity, and data-layer hardening with policy-first controls."
                    : block === "MONITOR"
                      ? "Continuous telemetry, anomaly detection, and exposure mapping."
                      : "Incident playbooks, containment routing, and board-level reporting."}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 rect-animate-right" style={{ animationDelay: "220ms" }}>
          <div className="citadel-panel citadel-screen overflow-hidden rounded-sm border" style={{ borderColor: citadelTheme.border }}>
            <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: citadelTheme.border }}>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#39ff14]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#2e7d32]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#14531b]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: citadelTheme.accent }}>
                {formatBracketLabel("live.telemetry")}
              </span>
            </div>
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="border-b p-5 lg:border-b-0 lg:border-l" style={{ borderColor: citadelTheme.border }}>
                <div className="mb-4 space-y-2 text-left text-[12px] leading-6" style={{ color: citadelTheme.muted }}>
                  {[
                    "> initiating perimeter check",
                    "> validating endpoint posture",
                    "> rotating credentials + enforcing MFA",
                    "> syncing SOC escalation routes",
                  ].map((line) => (
                    <div key={line} className="citadel-code-line">{line}</div>
                  ))}
                </div>
                <div className="relative overflow-hidden rounded-sm border" style={{ borderColor: citadelTheme.border }}>
                  <img
                    src={getValue(data, "heroImage")}
                    alt=""
                    className="h-64 w-full object-cover opacity-60 grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030a06] via-[#030a06]/20 to-transparent" />
                  <div className="absolute inset-0 border" style={{ borderColor: "rgba(57, 255, 20, 0.15)" }} />
                </div>
              </div>
              <div className="p-5">
                <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: citadelTheme.accent }}>
                  {formatBracketLabel("uptime.matrix")}
                </div>
                <div className="space-y-3 text-left text-sm">
                  {statusRows.map((row) => (
                    <div
                      key={row}
                      className="rounded-sm border px-4 py-3"
                      style={{ borderColor: citadelTheme.border, color: citadelTheme.light }}
                    >
                      {row}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SignalTicker({ data }: { data: TemplateData }) {
  const items = [
    "ENCRYPT",
    "SOC 24/7",
    "ZERO TRUST",
    "THREAT HUNT",
    getValue(data, "brandName").toUpperCase(),
    getValue(data, "tagline").toUpperCase(),
  ];

  return (
    <section className="overflow-hidden border-y py-4" style={{ borderColor: citadelTheme.border, background: citadelTheme.dark }}>
      <div className="rect-marquee-track flex w-max gap-0">
        {[...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="citadel-marquee-item shrink-0 border-l px-7 text-xs font-bold uppercase tracking-[0.34em]"
            style={{ borderColor: citadelTheme.border, color: citadelTheme.accent }}
          >
            {formatBracketLabel(item)}
          </span>
        ))}
      </div>
    </section>
  );
}

function StatsSection({ data }: { data: TemplateData }) {
  const stats = buildStats(data);

  return (
    <section className="px-5 py-14 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-0 border md:grid-cols-4" style={{ borderColor: citadelTheme.border }}>
        {stats.map(([value, label]) => (
          <div
            key={label}
            className="citadel-panel border px-6 py-7"
            style={{ borderColor: citadelTheme.border }}
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: citadelTheme.accent }}>
              {formatBracketLabel(label)}
            </div>
            <TemplateText
              as="div"
              className="mt-4 text-3xl font-bold md:text-4xl"
              style={{ color: citadelTheme.light }}
            >
              {value}
            </TemplateText>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutSection({ data }: { data: TemplateData }) {
  const bulletLines = [
    "Identity-first access layers for staff, vendors, and leadership.",
    "Board-ready posture reporting that translates risk into action.",
    "Security architecture designed to scale with operations and compliance.",
  ];

  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-24" style={{ borderColor: citadelTheme.border, background: citadelTheme.surface }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="citadel-panel overflow-hidden rounded-sm border" style={{ borderColor: citadelTheme.border }}>
          <img src={getValue(data, "aboutImage")} alt="" className="h-[420px] w-full object-cover grayscale" />
        </div>
        <div>
          <SectionHeading
            label="ARCHITECTURE"
            title={getValue(data, "aboutTitle")}
            text={getValue(data, "aboutText")}
          />
          <div className="mt-8 grid gap-3">
            {bulletLines.map((line, index) => (
              <div
                key={line}
                className="citadel-panel flex items-start gap-4 rounded-sm border px-4 py-4"
                style={{ borderColor: citadelTheme.border }}
              >
                <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: citadelTheme.accent }}>
                  {formatBracketLabel(`0${index + 1}`)}
                </span>
                <div className="text-sm leading-7" style={{ color: citadelTheme.muted }}>
                  {line}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ data }: { data: TemplateData }) {
  const services = [1, 2, 3, 4].map((index) => ({
    title: getValue(data, `service${["One", "Two", "Three", "Four"][index - 1]}Title`),
    text: getValue(data, `service${["One", "Two", "Three", "Four"][index - 1]}Text`),
    label: ["ENCRYPT", "DETECT", "CONTAIN", "OPTIMIZE"][index - 1],
  }));

  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-24" style={{ borderColor: citadelTheme.border }}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="SERVICES"
          title={getValue(data, "servicesTitle")}
          text="Layered advisory, implementation, and response programs built to reduce exposure without slowing delivery."
          center
        />
        <div className="mt-12 grid gap-0 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="citadel-panel border px-6 py-7"
              style={{
                borderColor: citadelTheme.border,
                background: index % 2 === 0 ? citadelTheme.bg : citadelTheme.surface,
              }}
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <TerminalLabel label={service.label} />
                <span className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: citadelTheme.muted }}>
                  {`00${index + 1}`.slice(-2)}
                </span>
              </div>
              <TemplateText as="h3" className="text-2xl font-bold" style={{ color: citadelTheme.light }}>
                {service.title}
              </TemplateText>
              <TemplateText as="p" className="mt-4 text-sm leading-7" style={{ color: citadelTheme.muted }}>
                {service.text}
              </TemplateText>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkSection({ data }: { data: TemplateData }) {
  const workItems = [1, 2, 3].map((index) => ({
    title: getValue(data, `work${["One", "Two", "Three"][index - 1]}Title`),
    text: getValue(data, `work${["One", "Two", "Three"][index - 1]}Text`),
    command: ["PERIMETER", "PIPELINE", "INCIDENT"][index - 1],
  }));

  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-24" style={{ borderColor: citadelTheme.border, background: citadelTheme.surface }}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="CASEFILES"
          title={getValue(data, "workTitle")}
          text="Selected engagements focused on resilience, control coverage, and faster response time across high-risk environments."
        />
        <div className="mt-12 grid gap-0 lg:grid-cols-3">
          {workItems.map((item, index) => (
            <article
              key={item.title}
              className="citadel-panel group border px-6 py-7 transition duration-300 hover:-translate-y-1"
              style={{ borderColor: citadelTheme.border }}
            >
              <div className="mb-8 h-40 rounded-sm border" style={{ borderColor: citadelTheme.border }}>
                <div className="citadel-grid h-full w-full opacity-40" />
              </div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <TerminalLabel label={item.command} />
                <span className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: citadelTheme.muted }}>
                  {formatBracketLabel(`case.${index + 1}`)}
                </span>
              </div>
              <TemplateText as="h3" className="text-2xl font-bold" style={{ color: citadelTheme.light }}>
                {item.title}
              </TemplateText>
              <TemplateText as="p" className="mt-4 text-sm leading-7" style={{ color: citadelTheme.muted }}>
                {item.text}
              </TemplateText>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ data }: { data: TemplateData }) {
  const steps = [1, 2, 3, 4].map((index) => ({
    title: getValue(data, `process${["One", "Two", "Three", "Four"][index - 1]}Title`),
    text: getValue(data, `process${["One", "Two", "Three", "Four"][index - 1]}Text`),
    label: ["DISCOVER", "MODEL", "EXECUTE", "FORTIFY"][index - 1],
  }));

  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-24" style={{ borderColor: citadelTheme.border }}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="PIPELINE"
          title={getValue(data, "processTitle")}
          text="A disciplined operating model that moves from exposure discovery into hardening, validation, and iteration."
        />
        <div className="mt-12 grid gap-0 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="citadel-panel border px-6 py-7"
              style={{ borderColor: citadelTheme.border }}
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <TerminalLabel label={step.label} />
                <span className="text-3xl font-bold" style={{ color: citadelTheme.accent }}>
                  {`0${index + 1}`}
                </span>
              </div>
              <TemplateText as="h3" className="text-xl font-bold" style={{ color: citadelTheme.light }}>
                {step.title}
              </TemplateText>
              <TemplateText as="p" className="mt-4 text-sm leading-7" style={{ color: citadelTheme.muted }}>
                {step.text}
              </TemplateText>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightsSection({ data }: { data: TemplateData }) {
  const insights = [1, 2].map((index) => ({
    title: getValue(data, `insight${["One", "Two"][index - 1]}Title`),
    text: getValue(data, `insight${["One", "Two"][index - 1]}Text`),
    label: ["FORECAST", "PLAYBOOK"][index - 1],
  }));

  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-24" style={{ borderColor: citadelTheme.border, background: citadelTheme.surface }}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="INTEL"
          title={getValue(data, "insightsTitle")}
          text="Actionable analysis for teams that need to brief leadership, prioritize remediation, and stay ahead of operational drift."
        />
        <div className="mt-12 grid gap-0 lg:grid-cols-2">
          {insights.map((insight) => (
            <article
              key={insight.title}
              className="citadel-panel border px-6 py-7"
              style={{ borderColor: citadelTheme.border }}
            >
              <div className="mb-5">
                <TerminalLabel label={insight.label} />
              </div>
              <TemplateText as="h3" className="text-2xl font-bold" style={{ color: citadelTheme.light }}>
                {insight.title}
              </TemplateText>
              <TemplateText as="p" className="mt-4 text-sm leading-7" style={{ color: citadelTheme.muted }}>
                {insight.text}
              </TemplateText>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ data }: { data: TemplateData }) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-24" style={{ borderColor: citadelTheme.border }}>
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            label="HANDSHAKE"
            title={getValue(data, "contactTitle")}
            text={getValue(data, "contactText")}
          />
          <div className="mt-8 grid gap-3">
            {[
              ["LINE", getValue(data, "phone")],
              ["MAIL", getValue(data, "email")],
              ["NODE", getValue(data, "address")],
            ].map(([label, value]) => (
              <div
                key={label}
                className="citadel-panel rounded-sm border px-4 py-4"
                style={{ borderColor: citadelTheme.border }}
              >
                <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: citadelTheme.accent }}>
                  {formatBracketLabel(label)}
                </div>
                <TemplateText as="div" className="text-sm leading-7" style={{ color: citadelTheme.light }}>
                  {value}
                </TemplateText>
              </div>
            ))}
          </div>
        </div>

        <form
          data-bizuply-form-builder="true"
          data-visual-editable="true"
          data-visual-edit-id="contact.form"
          data-visual-edit-type="box"
          data-visual-edit-label="טופס יצירת קשר"
          className="citadel-panel grid gap-0 rounded-sm border md:grid-cols-2"
          style={{ borderColor: citadelTheme.border }}
        >
          {[
            ["contact.form.name", "שם מלא", "שם מלא"],
            ["contact.form.phone", "טלפון", "טלפון"],
            ["contact.form.email", "אימייל", "אימייל"],
            ["contact.form.topic", "נושא", "נושא הפנייה"],
          ].map(([id, label, placeholder]) => (
            <input
              key={id}
              className="h-14 border bg-transparent px-5 text-right text-sm outline-none"
              style={{ borderColor: citadelTheme.border, color: citadelTheme.light }}
              placeholder={placeholder}
              data-visual-editable="true"
              data-visual-edit-id={id}
              data-visual-edit-type="control"
              data-visual-edit-label={label}
            />
          ))}
          <textarea
            className="min-h-40 border bg-transparent px-5 py-4 text-right text-sm outline-none md:col-span-2"
            style={{ borderColor: citadelTheme.border, color: citadelTheme.light }}
            placeholder="ספרו לנו על האתגר, הסביבה והדחיפות."
            data-visual-editable="true"
            data-visual-edit-id="contact.form.message"
            data-visual-edit-type="control"
            data-visual-edit-label="הודעה"
          />
          <button
            type="button"
            className="h-14 border-t px-6 text-xs font-black uppercase tracking-[0.28em] md:col-span-2"
            style={{
              borderColor: citadelTheme.border,
              background: citadelTheme.accent,
              color: citadelTheme.dark,
            }}
            data-visual-editable="true"
            data-visual-edit-id="contact.form.submit"
            data-visual-edit-type="button"
            data-visual-edit-label="כפתור שליחה"
          >
            {formatBracketLabel(getValue(data, "contactButton") || "transmit")}
          </button>
        </form>
      </div>
    </section>
  );
}

function CtaSection({
  data,
  goTo,
}: {
  data: TemplateData;
  goTo: (pageId: string) => void;
}) {
  return (
    <section className="border-t px-5 py-16 lg:px-8 lg:py-20" style={{ borderColor: citadelTheme.border, background: citadelTheme.dark }}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 xl:flex-row xl:items-center">
        <div className="max-w-3xl text-right">
          <div className="mb-5">
            <TerminalLabel label="DEPLOY_NEXT" />
          </div>
          <TemplateText as="h2" className="text-3xl font-bold md:text-5xl" style={{ color: citadelTheme.light }}>
            {getValue(data, "ctaTitle")}
          </TemplateText>
          <TemplateText as="p" className="mt-5 text-base leading-8 md:text-lg" style={{ color: citadelTheme.muted }}>
            {getValue(data, "ctaText")}
          </TemplateText>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => goTo("contact")}
            className="rounded-sm border px-6 py-4 text-xs font-black uppercase tracking-[0.28em] transition duration-300 hover:-translate-y-0.5"
            style={{ borderColor: citadelTheme.accent, background: citadelTheme.accent, color: citadelTheme.dark }}
          >
            {formatBracketLabel("open.channel")}
          </button>
          <button
            type="button"
            onClick={() => goTo("services")}
            className="rounded-sm border px-6 py-4 text-xs font-bold uppercase tracking-[0.28em]"
            style={{ borderColor: citadelTheme.border, color: citadelTheme.text }}
          >
            {formatBracketLabel("review.stack")}
          </button>
        </div>
      </div>
    </section>
  );
}

function PageHero({
  data,
  pageId,
}: {
  data: TemplateData;
  pageId: string;
}) {
  return (
    <section className="relative overflow-hidden border-b px-5 py-16 lg:px-8 lg:py-24" style={{ borderColor: citadelTheme.border, background: citadelTheme.dark }}>
      <div className="citadel-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="citadel-scan-band pointer-events-none absolute inset-x-0 top-0 h-28 opacity-15" />
      <div className="relative mx-auto max-w-7xl text-center">
        <div className="mb-5 flex justify-center">
          <TerminalLabel label={pageId === "home" ? "ROOT" : pageId} />
        </div>
        <TemplateText as="p" className="text-xs font-bold uppercase tracking-[0.34em]" style={{ color: citadelTheme.accent }}>
          {formatBracketLabel(getValue(data, "brandName"))}
        </TemplateText>
        <TemplateText
          as="h1"
          className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-[1.05] md:text-6xl"
          style={{ color: citadelTheme.light }}
        >
          {getPageTitle(data, pageId)}
        </TemplateText>
      </div>
    </section>
  );
}

function CitadelFooter({
  data,
  goTo,
}: {
  data: TemplateData;
  goTo: (pageId: string) => void;
}) {
  const nav = buildNav(data);

  return (
    <footer className="border-t px-5 py-12 lg:px-8" style={{ borderColor: citadelTheme.border, background: citadelTheme.dark }}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr_0.8fr]">
        <div>
          <TemplateText as="div" className="text-2xl font-bold uppercase tracking-[0.24em]" style={{ color: citadelTheme.light }}>
            {getValue(data, "brandName")}
          </TemplateText>
          <TemplateText as="p" className="mt-4 max-w-md text-sm leading-7" style={{ color: citadelTheme.muted }}>
            {getValue(data, "footerText")}
          </TemplateText>
        </div>
        <div>
          <div className="mb-4">
            <TerminalLabel label="NAV" />
          </div>
          <div className="grid gap-2">
            {nav.map(([pageId, label]) => (
              <button
                key={pageId}
                type="button"
                onClick={() => goTo(pageId)}
                className="text-right text-sm uppercase tracking-[0.2em] transition hover:opacity-100"
                style={{ color: citadelTheme.text, opacity: 0.75 }}
              >
                {formatBracketLabel(String(label))}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-4">
            <TerminalLabel label="CONTACT" />
          </div>
          <div className="space-y-2 text-sm leading-7" style={{ color: citadelTheme.muted }}>
            <TemplateText as="div">{getValue(data, "phone")}</TemplateText>
            <TemplateText as="div">{getValue(data, "email")}</TemplateText>
            <TemplateText as="div">{getValue(data, "address")}</TemplateText>
          </div>
        </div>
      </div>
    </footer>
  );
}

function HomePage({
  data,
  goTo,
}: {
  data: TemplateData;
  goTo: (pageId: string) => void;
}) {
  return (
    <>
      <HeroSection data={data} goTo={goTo} />
      <SignalTicker data={data} />
      <StatsSection data={data} />
      <AboutSection data={data} />
      <ServicesSection data={data} />
      <WorkSection data={data} />
      <ProcessSection data={data} />
      <InsightsSection data={data} />
      <CtaSection data={data} goTo={goTo} />
    </>
  );
}

function InnerPage({
  data,
  pageId,
  goTo,
}: {
  data: TemplateData;
  pageId: string;
  goTo: (pageId: string) => void;
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
        <ServicesSection data={data} />
        <WorkSection data={data} />
        <ProcessSection data={data} />
      </>
    ),
    work: (
      <>
        <WorkSection data={data} />
        <InsightsSection data={data} />
      </>
    ),
    insights: <InsightsSection data={data} />,
    contact: <ContactSection data={data} />,
  };

  return (
    <>
      <PageHero data={data} pageId={pageId} />
      {pageContent[pageId] ?? null}
      <CtaSection data={data} goTo={goTo} />
    </>
  );
}

export default function CitadelPages({
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
}: CitadelPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...citadelDefaultData,
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
    { allowedPages: citadelAllowedPages, fallbackPage: "home" },
  );

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "citadel-preview" : "citadel"}
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background: citadelTheme.bg,
        color: citadelTheme.text,
        fontFamily: terminalFont,
      }}
    >
      <style>{citadelEditorCss}</style>
      <CitadelHeader data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          {
            id: "home",
            content: <HomePage data={mergedData} goTo={goTo} />,
          },
          ...citadelPages
            .filter((pageItem) => pageItem.id !== "home")
            .map((pageItem) => ({
              id: pageItem.id,
              content: (
                <InnerPage data={mergedData} pageId={pageItem.id} goTo={goTo} />
              ),
            })),
        ]}
      />
      <CitadelFooter data={mergedData} goTo={goTo} />
    </div>
  );
}
