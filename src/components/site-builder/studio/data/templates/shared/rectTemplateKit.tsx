import React, { useEffect, useState } from "react";

import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { TemplateText } from "./TemplateText";
import { useTemplatePageNavigation } from "./useTemplatePageNavigation";

export type RectTheme = {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentAlt?: string;
  border: string;
  dark?: string;
  light?: string;
};

export type RectPageDef = {
  id: string;
  label: string;
  slug: string;
};

export type RectTemplateNavProps = {
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

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function makeGetValue(defaultData: Record<string, any>) {
  return (data: Record<string, any>, key: string) =>
    data?.[key] ?? defaultData[key] ?? "";
}

export function useReveal() {
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-rect-reveal]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.rectReveal;
          if (!id || !entry.isIntersecting) return;
          setVisible((current) => ({ ...current, [id]: true }));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return visible;
}

export function revealClass(isVisible: boolean, delay = "") {
  return cx(
    "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
    delay,
    isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
  );
}

export function Reveal({
  children,
  className,
  delay = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  delay?: string;
}) {
  return (
    <div className={cx("rect-animate-rise", delay, className)}>
      {children}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  text,
  theme,
  center = false,
  light = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  theme: RectTheme;
  center?: boolean;
  light?: boolean;
}) {
  const textColor = light ? theme.light || "#fff" : theme.text;
  const mutedColor = light ? "rgba(255,255,255,.62)" : theme.muted;

  return (
    <div className={cx("mx-auto max-w-4xl", center ? "text-center" : "text-right")}>
      <TemplateText
        as="p"
        className="mb-4 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em]"
        style={{ color: theme.accent }}
      >
        <span className="h-px w-10" style={{ background: theme.accent }} />
        {eyebrow}
      </TemplateText>
      <TemplateText
        as="h2"
        className="text-4xl font-bold leading-[1.05] tracking-[-0.04em] md:text-6xl"
        style={{ color: textColor }}
      >
        {title}
      </TemplateText>
      {text ? (
        <TemplateText
          as="p"
          className="mt-5 text-lg leading-8"
          style={{ color: mutedColor }}
        >
          {text}
        </TemplateText>
      ) : null}
    </div>
  );
}

export function RectHeader({
  theme,
  data,
  getValue,
  nav,
  currentPage,
  goTo,
  ctaLabel,
  onCta,
  logoText,
}: {
  theme: RectTheme;
  data: Record<string, any>;
  getValue: (data: Record<string, any>, key: string) => string;
  nav: Array<[string, string]>;
  currentPage: string;
  goTo: (page: string) => void;
  ctaLabel: string;
  onCta: () => void;
  logoText?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b"
      style={{
        borderColor: theme.border,
        background: `${theme.surface}f2`,
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 md:px-8">
        <button
          type="button"
          onClick={() => goTo("home")}
          className="flex items-center gap-3 text-right"
        >
          <span
            className="grid h-11 w-11 place-items-center text-sm font-black"
            style={{ background: theme.accent, color: theme.dark || theme.text }}
          >
            {logoText || getValue(data, "logoText")}
          </span>
          <TemplateText
            as="span"
            className="hidden text-lg font-bold tracking-tight sm:inline"
            style={{ color: theme.text }}
          >
            {getValue(data, "brandName")}
          </TemplateText>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => goTo(id)}
              className={cx(
                "px-4 py-2 text-sm font-semibold transition duration-300",
                currentPage === id ? "opacity-100" : "opacity-55 hover:opacity-100",
              )}
              style={{
                color: theme.text,
                borderBottom:
                  currentPage === id
                    ? `2px solid ${theme.accent}`
                    : "2px solid transparent",
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCta}
            className="hidden px-5 py-3 text-sm font-bold transition duration-300 hover:-translate-y-0.5 sm:inline-flex"
            style={{ background: theme.accent, color: theme.dark || "#000" }}
          >
            {ctaLabel}
          </button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center border lg:hidden"
            style={{ borderColor: theme.border, color: theme.text }}
          >
            {open ? "×" : "☰"}
          </button>
        </div>
      </div>

      {open ? (
        <div
          className="border-t px-4 py-4 lg:hidden"
          style={{ borderColor: theme.border, background: theme.surface }}
        >
          <div className="grid gap-1">
            {nav.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  goTo(id);
                  setOpen(false);
                }}
                className="px-4 py-3 text-right text-sm font-semibold"
                style={{
                  background: currentPage === id ? theme.accent : "transparent",
                  color: currentPage === id ? theme.dark || "#000" : theme.text,
                }}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onCta();
              }}
              className="mt-2 px-4 py-3 text-sm font-bold"
              style={{ background: theme.accent, color: theme.dark || "#000" }}
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function RectFooter({
  theme,
  data,
  getValue,
  goTo,
  nav,
}: {
  theme: RectTheme;
  data: Record<string, any>;
  getValue: (data: Record<string, any>, key: string) => string;
  goTo: (page: string) => void;
  nav: Array<[string, string]>;
}) {
  return (
    <footer
      className="border-t px-4 py-12 md:px-8"
      style={{ borderColor: theme.border, background: theme.dark || theme.text, color: theme.light || "#fff" }}
    >
      <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <TemplateText as="div" className="text-2xl font-black tracking-tight">
            {getValue(data, "brandName")}
          </TemplateText>
          <TemplateText as="p" className="mt-4 max-w-sm text-sm leading-7 opacity-60">
            {getValue(data, "footerText")}
          </TemplateText>
        </div>
        <div>
          <TemplateText as="div" className="mb-4 text-xs font-bold uppercase tracking-[0.28em] opacity-45">
            ניווט
          </TemplateText>
          <div className="grid gap-2">
            {nav.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => goTo(id)}
                className="text-right text-sm opacity-70 transition hover:opacity-100"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <TemplateText as="div" className="mb-4 text-xs font-bold uppercase tracking-[0.28em] opacity-45">
            יצירת קשר
          </TemplateText>
          <TemplateText as="div" className="text-sm opacity-70">
            {getValue(data, "phone")}
          </TemplateText>
          <TemplateText as="div" className="mt-1 text-sm opacity-70">
            {getValue(data, "email")}
          </TemplateText>
          <TemplateText as="div" className="mt-1 text-sm opacity-70">
            {getValue(data, "address")}
          </TemplateText>
        </div>
      </div>
    </footer>
  );
}

export function PageHero({
  theme,
  title,
  eyebrow,
  dark = true,
}: {
  theme: RectTheme;
  title: string;
  eyebrow: string;
  dark?: boolean;
}) {
  return (
    <section
      className="relative overflow-hidden px-4 py-20 md:px-8 md:py-28"
      style={{
        background: dark ? theme.dark || theme.text : theme.surface,
        color: dark ? theme.light || "#fff" : theme.text,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(${theme.accent} 1px, transparent 1px), linear-gradient(90deg, ${theme.accent} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] text-center">
        <TemplateText
          as="p"
          className="mb-5 text-xs font-bold uppercase tracking-[0.32em]"
          style={{ color: theme.accent }}
        >
          {eyebrow}
        </TemplateText>
        <TemplateText as="h1" className="text-5xl font-black leading-[1.02] md:text-7xl">
          {title}
        </TemplateText>
      </div>
    </section>
  );
}

export function StatRow({
  theme,
  stats,
  light = false,
}: {
  theme: RectTheme;
  stats: Array<[string, string]>;
  light?: boolean;
}) {
  return (
    <div
      className="grid grid-cols-2 border md:grid-cols-4"
      style={{ borderColor: theme.border }}
    >
      {stats.map(([value, label]) => (
        <div
          key={label}
          className="border px-6 py-8"
          style={{
            borderColor: theme.border,
            background: light ? "transparent" : theme.surface,
          }}
        >
          <TemplateText
            as="div"
            className="text-3xl font-black md:text-4xl"
            style={{ color: theme.accent }}
          >
            {value}
          </TemplateText>
          <TemplateText
            as="div"
            className="mt-2 text-xs font-bold uppercase tracking-[0.22em]"
            style={{ color: light ? "rgba(255,255,255,.55)" : theme.muted }}
          >
            {label}
          </TemplateText>
        </div>
      ))}
    </div>
  );
}

export function ContactFormBlock({
  theme,
  data,
  getValue,
}: {
  theme: RectTheme;
  data: Record<string, any>;
  getValue: (data: Record<string, any>, key: string) => string;
}) {
  return (
    <form
      data-bizuply-form-builder="true"
      data-visual-editable="true"
      data-visual-edit-id="contact.form"
      data-visual-edit-type="box"
      data-visual-edit-label="טופס יצירת קשר"
      className="grid gap-0 border md:grid-cols-2"
      style={{ borderColor: theme.border }}
    >
      {[
        ["contact.form.name", "שם מלא", "input", "שם מלא"],
        ["contact.form.phone", "טלפון", "input", "טלפון"],
        ["contact.form.email", "אימייל", "input", "אימייל"],
        ["contact.form.topic", "נושא", "input", "נושא הפנייה"],
      ].map(([id, label, , placeholder]) => (
        <input
          key={id}
          className="h-14 border bg-transparent px-5 text-right outline-none transition focus:ring-1"
          style={{ borderColor: theme.border, color: theme.text }}
          placeholder={placeholder}
          data-visual-editable="true"
          data-visual-edit-id={id}
          data-visual-edit-type="control"
          data-visual-edit-label={label}
        />
      ))}
      <textarea
        className="min-h-36 border bg-transparent px-5 py-4 text-right outline-none md:col-span-2"
        style={{ borderColor: theme.border, color: theme.text }}
        placeholder="ספרו לנו בקצרה"
        data-visual-editable="true"
        data-visual-edit-id="contact.form.message"
        data-visual-edit-type="control"
        data-visual-edit-label="הודעה"
      />
      <button
        type="button"
        className="h-14 px-6 text-sm font-black md:col-span-2"
        style={{ background: theme.accent, color: theme.dark || "#000" }}
        data-visual-editable="true"
        data-visual-edit-id="contact.form.submit"
        data-visual-edit-type="button"
        data-visual-edit-label="כפתור שליחה"
      >
        {getValue(data, "contactButton")}
      </button>
    </form>
  );
}

export function CtaBand({
  theme,
  data,
  getValue,
  onCta,
}: {
  theme: RectTheme;
  data: Record<string, any>;
  getValue: (data: Record<string, any>, key: string) => string;
  onCta: () => void;
}) {
  return (
    <section
      className="px-4 py-16 md:px-8 md:py-24"
      style={{ background: theme.accent, color: theme.dark || "#000" }}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-2xl text-right">
          <TemplateText as="h2" className="text-4xl font-black leading-tight md:text-5xl">
            {getValue(data, "ctaTitle")}
          </TemplateText>
          <TemplateText as="p" className="mt-4 text-lg opacity-75">
            {getValue(data, "ctaText")}
          </TemplateText>
        </div>
        <button
          type="button"
          onClick={onCta}
          className="px-8 py-4 text-sm font-black transition hover:-translate-y-0.5"
          style={{ background: theme.dark || theme.text, color: theme.light || "#fff" }}
        >
          {getValue(data, "ctaButton")}
        </button>
      </div>
    </section>
  );
}

export function RectTemplateShell({
  templateId,
  theme,
  mode,
  fontFamily,
  editorCss,
  header,
  footer,
  children,
}: {
  templateId: string;
  theme: RectTheme;
  mode?: string;
  fontFamily?: string;
  editorCss?: string;
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? `${templateId}-preview` : templateId}
      className="min-h-screen w-full overflow-x-hidden"
      style={{ background: theme.bg, color: theme.text, fontFamily }}
    >
      {editorCss ? <style>{editorCss}</style> : null}
      {header}
      {children}
      {footer}
    </div>
  );
}

export function useRectTemplateApp(
  props: RectTemplateNavProps,
  pages: RectPageDef[],
) {
  const allowed = pages.map((page) => page.id);
  const { currentPage, goTo } = useTemplatePageNavigation(props, {
    allowedPages: allowed,
    fallbackPage: "home",
  });

  return { currentPage, goTo, allowed };
}

export { VisualPageStack, TemplateText };
