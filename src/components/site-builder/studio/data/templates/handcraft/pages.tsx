import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { handcraftDefaultData } from "./defaultData";
import { handcraftEditorCss } from "./editorCss";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";

export const handcraftPages = [{ id: "home", label: "בית", slug: "/" }];

type HandcraftPagesProps = {
  initialPage?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
  page?: string;
  pageId?: string;
  initialPageId?: string;
  activePageId?: string;
  currentPageId?: string;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (handcraftDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function phoneHref(data: Record<string, any>) {
  return `tel:${getValue(data, "phoneHref") || getValue(data, "phone")}`;
}

function SectionHeading({
  data,
  eyebrowKey,
  titleKey,
  textKey,
  invert = false,
}: {
  data: Record<string, any>;
  eyebrowKey: string;
  titleKey: string;
  textKey?: string;
  invert?: boolean;
}) {
  return (
    <div className="h-copper-line pt-7">
      <p
        className={cx(
          "h-anim text-xs font-extrabold uppercase tracking-[0.34em]",
          invert ? "text-[var(--h-accent)]" : "text-[var(--h-primary)]",
        )}
      >
        {getValue(data, eyebrowKey)}
      </p>
      <h2
        className={cx(
          "h-rise h-anim-d1 mt-4 max-w-4xl whitespace-pre-line text-4xl font-extrabold leading-[0.98] md:text-6xl",
          invert ? "text-[var(--h-background)]" : "text-[var(--h-text)]",
        )}
      >
        {getValue(data, titleKey)}
      </h2>
      {textKey ? (
        <p
          className={cx(
            "h-rise h-anim-d2 mt-5 max-w-2xl text-base leading-8 md:text-lg",
            invert ? "text-white/70" : "text-[var(--h-muted)]",
          )}
        >
          {getValue(data, textKey)}
        </p>
      ) : null}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center justify-center bg-[var(--h-primary)] px-7 py-4 text-sm font-extrabold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[var(--h-accent)] hover:text-[var(--h-dark)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  const navItems = [
    [getValue(data, "navServices"), "#handcraft-services"],
    [getValue(data, "navBeforeAfter"), "#handcraft-before-after"],
    [getValue(data, "navPricing"), "#handcraft-pricing"],
    [getValue(data, "navAreas"), "#handcraft-areas"],
    [getValue(data, "navReviews"), "#handcraft-reviews"],
  ];

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      className="sticky inset-x-0 top-0 z-50 border-b border-white/10 bg-[var(--h-secondary)] text-[var(--h-background)]"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">
        <a href="#handcraft-hero" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center border border-[var(--h-primary)] text-[11px] font-extrabold tracking-[0.18em] text-[var(--h-accent)]">
            {getValue(data, "logoText")}
          </span>
          <span className="h-display text-2xl leading-none text-white md:text-3xl">{getValue(data, "brandName")}</span>
        </a>
        <nav className="hidden items-center gap-7 text-[11px] font-bold uppercase tracking-[0.22em] text-white/70 xl:flex">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="transition hover:text-[var(--h-accent)]">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a
            href={phoneHref(data)}
            className="hidden text-sm font-extrabold tracking-[0.12em] text-[var(--h-accent)] md:inline-flex"
          >
            {getValue(data, "phone")}
          </a>
          <button
            type="button"
            onClick={openModal}
            className="border border-[var(--h-primary)] px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white transition hover:bg-[var(--h-primary)]"
          >
            {getValue(data, "navContact")}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section
      id="handcraft-hero"
      data-template-section-type="hero"
      className="relative min-h-[calc(100svh-76px)] overflow-hidden bg-[var(--h-dark)] text-[var(--h-background)]"
    >
      <img
        src={getValue(data, "heroImage")}
        alt={getValue(data, "heroImageAlt")}
        className="h-image-anim absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-[#16181A] via-[#16181A]/80 to-[#16181A]/20" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--h-primary)]" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-76px)] max-w-7xl flex-col justify-end px-5 pb-14 pt-24 lg:px-8 lg:pb-20">
        <p className="h-anim text-xs font-extrabold uppercase tracking-[0.42em] text-[var(--h-accent)]">
          {getValue(data, "heroEyebrow")}
        </p>
        <div className="h-line-anim mt-5 h-[3px] w-28 bg-[var(--h-primary)]" />
        <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="h-display h-anim h-anim-d1 text-7xl leading-[0.72] text-white md:text-9xl lg:text-[10.5rem]">
              {getValue(data, "brandName")}
            </div>
            <h1 className="h-rise h-anim-d2 mt-8 max-w-3xl whitespace-pre-line text-4xl font-extrabold leading-[0.98] md:text-6xl lg:text-7xl">
              {getValue(data, "heroTitle")}
            </h1>
          </div>
          <div className="h-rise h-anim-d2 border-r-4 border-[var(--h-primary)] pr-6">
            <p className="max-w-xl text-base leading-8 text-white/80 md:text-lg">{getValue(data, "heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <PrimaryButton onClick={openModal}>{getValue(data, "heroPrimaryButton")}</PrimaryButton>
              <a href={phoneHref(data)} className="text-2xl font-extrabold text-[var(--h-accent)] md:text-3xl">
                {getValue(data, "phone")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services({ data }: { data: Record<string, any> }) {
  const services = [
    ["serviceOneNumber", "serviceOneTitle", "serviceOneText", "serviceOneMeta"],
    ["serviceTwoNumber", "serviceTwoTitle", "serviceTwoText", "serviceTwoMeta"],
    ["serviceThreeNumber", "serviceThreeTitle", "serviceThreeText", "serviceThreeMeta"],
    ["serviceFourNumber", "serviceFourTitle", "serviceFourText", "serviceFourMeta"],
  ];

  return (
    <section
      id="handcraft-services"
      data-template-section-type="services"
      className="h-section bg-[var(--h-background)] px-5 py-24 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading data={data} eyebrowKey="sectionTwoEyebrow" titleKey="sectionTwoTitle" textKey="sectionTwoText" />
          <div className="grid border-t border-[var(--h-line)] md:grid-cols-2">
            {services.map(([numberKey, titleKey, textKey, metaKey]) => (
              <article
                key={titleKey}
                className="group min-h-[310px] border-b border-r border-[var(--h-line)] bg-[var(--h-surface)] p-7 transition duration-300 hover:bg-[var(--h-secondary)] hover:text-[var(--h-background)]"
              >
                <div className="h-display text-3xl md:text-6xl leading-none text-[var(--h-primary)] transition group-hover:text-[var(--h-accent)]">
                  {getValue(data, numberKey)}
                </div>
                <h3 className="mt-10 text-3xl font-extrabold leading-none">{getValue(data, titleKey)}</h3>
                <p className="mt-5 text-sm leading-7 text-[var(--h-muted)] transition group-hover:text-white/70">
                  {getValue(data, textKey)}
                </p>
                <p className="mt-8 border-t border-current/20 pt-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--h-primary)] transition group-hover:text-[var(--h-accent)]">
                  {getValue(data, metaKey)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BeforeAfter({ data }: { data: Record<string, any> }) {
  return (
    <section
      id="handcraft-before-after"
      data-template-section-type="before-after"
      className="h-dark-section px-5 py-24 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          data={data}
          eyebrowKey="sectionThreeEyebrow"
          titleKey="sectionThreeTitle"
          textKey="sectionThreeText"
          invert
        />
        <div className="mt-14 grid gap-px bg-white/20 lg:grid-cols-2">
          {[
            ["beforeLabel", "beforeTitle", "beforeText", "beforeImage"],
            ["afterLabel", "afterTitle", "afterText", "afterImage"],
          ].map(([labelKey, titleKey, textKey, imageKey]) => (
            <article key={labelKey} className="bg-[var(--h-secondary)]">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={getValue(data, imageKey)}
                  alt=""
                  className="h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0"
                />
              </div>
              <div className="border-t border-white/20 p-7 lg:p-9">
                <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[var(--h-accent)]">
                  {getValue(data, labelKey)}
                </p>
                <h3 className="mt-4 text-3xl font-extrabold leading-tight text-white">{getValue(data, titleKey)}</h3>
                <p className="mt-4 text-sm leading-7 text-white/60">{getValue(data, textKey)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs({ data }: { data: Record<string, any> }) {
  const statements = [
    ["whyOneTitle", "whyOneText"],
    ["whyTwoTitle", "whyTwoText"],
    ["whyThreeTitle", "whyThreeText"],
    ["whyFourTitle", "whyFourText"],
  ];

  return (
    <section data-template-section-type="why-us" className="h-section px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionHeading data={data} eyebrowKey="sectionFourEyebrow" titleKey="sectionFourTitle" textKey="sectionFourText" />
        <div className="border-t border-[var(--h-text)]">
          {statements.map(([titleKey, textKey], index) => (
            <article key={titleKey} className="grid gap-5 border-b border-[var(--h-line)] py-8 md:grid-cols-[110px_1fr]">
              <span className="h-display text-2xl md:text-5xl leading-none text-[var(--h-primary)]">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-2xl font-extrabold">{getValue(data, titleKey)}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--h-muted)]">{getValue(data, textKey)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ data }: { data: Record<string, any> }) {
  const tiers = [
    ["pricingOneName", "pricingOnePrice", "pricingOneText", "pricingOneMeta"],
    ["pricingTwoName", "pricingTwoPrice", "pricingTwoText", "pricingTwoMeta"],
    ["pricingThreeName", "pricingThreePrice", "pricingThreeText", "pricingThreeMeta"],
  ];

  return (
    <section
      id="handcraft-pricing"
      data-template-section-type="pricing"
      className="h-section h-grid px-5 py-24 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading data={data} eyebrowKey="sectionFiveEyebrow" titleKey="sectionFiveTitle" textKey="sectionFiveText" />
          <div className="grid gap-5 md:grid-cols-3">
            {tiers.map(([nameKey, priceKey, textKey, metaKey]) => (
              <article key={nameKey} className="border border-[var(--h-text)] bg-[var(--h-background)] p-7">
                <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[var(--h-primary)]">
                  {getValue(data, nameKey)}
                </p>
                <div className="mt-8 min-h-[92px] border-y border-[var(--h-line)] py-6 text-2xl sm:text-4xl font-extrabold leading-tight">
                  {getValue(data, priceKey)}
                </div>
                <p className="mt-6 text-sm leading-7 text-[var(--h-muted)]">{getValue(data, textKey)}</p>
                <p className="mt-8 bg-[var(--h-secondary)] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--h-background)]">
                  {getValue(data, metaKey)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceAreas({ data }: { data: Record<string, any> }) {
  const areas = [
    ["areaOneTitle", "areaOneText"],
    ["areaTwoTitle", "areaTwoText"],
    ["areaThreeTitle", "areaThreeText"],
    ["areaFourTitle", "areaFourText"],
  ];

  return (
    <section
      id="handcraft-areas"
      data-template-section-type="areas"
      className="h-dark-section px-5 py-24 lg:px-8 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionHeading data={data} eyebrowKey="sectionSixEyebrow" titleKey="sectionSixTitle" textKey="sectionSixText" invert />
          <p className="mt-9 border-r-4 border-[var(--h-primary)] pr-5 text-sm font-bold leading-7 text-white/70">
            {getValue(data, "mapNote")}
          </p>
        </div>
        <div className="relative min-h-[520px] border border-white/20 bg-[var(--h-dark)] p-5">
          <div className="absolute inset-5 h-grid opacity-50" />
          <div className="relative grid h-full grid-rows-4 gap-4">
            {areas.map(([titleKey, textKey], index) => (
              <article
                key={titleKey}
                className={cx(
                  "border border-white/20 bg-[#2B2F33]/90 p-5 shadow-2xl shadow-black/20",
                  index % 2 === 0 ? "ml-10" : "mr-10",
                )}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-extrabold text-white">{getValue(data, titleKey)}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/60">{getValue(data, textKey)}</p>
                  </div>
                  <span className="h-display text-2xl md:text-5xl leading-none text-[var(--h-primary)]">{index + 1}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews({ data }: { data: Record<string, any> }) {
  const reviews = [
    ["reviewOneText", "reviewOneName", "reviewOneRole"],
    ["reviewTwoText", "reviewTwoName", "reviewTwoRole"],
    ["reviewThreeText", "reviewThreeName", "reviewThreeRole"],
  ];

  return (
    <section
      id="handcraft-reviews"
      data-template-section-type="reviews"
      className="h-section bg-[var(--h-background)] px-5 py-24 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading data={data} eyebrowKey="sectionSevenEyebrow" titleKey="sectionSevenTitle" />
        <div className="mt-14 grid gap-px bg-[var(--h-line)] lg:grid-cols-3">
          {reviews.map(([textKey, nameKey, roleKey]) => (
            <blockquote key={nameKey} className="bg-[var(--h-surface)] p-8 lg:p-10">
              <div className="h-display text-3xl md:text-7xl leading-none text-[var(--h-primary)]">"</div>
              <p className="-mt-4 text-lg font-semibold leading-9 text-[var(--h-text)]">{getValue(data, textKey)}</p>
              <footer className="mt-8 border-t border-[var(--h-line)] pt-5">
                <p className="font-extrabold">{getValue(data, nameKey)}</p>
                <p className="mt-1 text-sm text-[var(--h-muted)]">{getValue(data, roleKey)}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmergencyCta({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="emergency" className="bg-[var(--h-primary)] px-5 py-16 text-[var(--h-dark)] lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr_auto]">
        <p className="text-xs font-extrabold uppercase tracking-[0.34em] text-[#16181A]/70">
          {getValue(data, "sectionEightEyebrow")}
        </p>
        <div>
          <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">{getValue(data, "sectionEightTitle")}</h2>
          <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#16181A]/80">
            {getValue(data, "sectionEightText")}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <a
            href={phoneHref(data)}
            className="inline-flex items-center justify-center bg-[var(--h-dark)] px-7 py-4 text-sm font-extrabold uppercase tracking-[0.2em] text-white"
          >
            {getValue(data, "phone")}
          </a>
          <button
            type="button"
            onClick={openModal}
            className="border border-[var(--h-dark)] px-7 py-4 text-sm font-extrabold uppercase tracking-[0.2em] transition hover:bg-[var(--h-dark)] hover:text-white"
          >
            {getValue(data, "contactButton")}
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  const footerLinks = [
    [getValue(data, "navServices"), "#handcraft-services"],
    [getValue(data, "navPricing"), "#handcraft-pricing"],
    [getValue(data, "navAreas"), "#handcraft-areas"],
    [getValue(data, "navReviews"), "#handcraft-reviews"],
  ];

  return (
    <footer data-template-section-type="footer" className="bg-[var(--h-dark)] px-5 py-16 text-[var(--h-background)] lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="h-display text-6xl leading-none text-white md:text-8xl">{getValue(data, "brandName")}</div>
          <h2 className="mt-8 max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">{getValue(data, "ctaTitle")}</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/60">{getValue(data, "ctaText")}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <PrimaryButton onClick={openModal}>{getValue(data, "ctaButton")}</PrimaryButton>
            <a
              href={phoneHref(data)}
              className="inline-flex items-center justify-center border border-white/20 px-7 py-4 text-sm font-extrabold uppercase tracking-[0.2em] text-white transition hover:border-[var(--h-primary)]"
            >
              {getValue(data, "phone")}
            </a>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 lg:border-r lg:border-t-0 lg:pr-8 lg:pt-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.34em] text-[var(--h-accent)]">{getValue(data, "contactTitle")}</p>
          <div className="mt-6 space-y-4 text-sm leading-7 text-white/70">
            <p>{getValue(data, "contactText")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
          <nav className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white">
            {footerLinks.map(([label, href]) => (
              <a key={href} href={href} className="border-b border-white/20 pb-3 transition hover:text-[var(--h-accent)]">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40">
        <span>
          © {new Date().getFullYear()} {getValue(data, "brandName")}
        </span>
        <span>אינסטלציה · חשמל · שיפוצים · תחזוקת נכסים</span>
      </div>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg border border-[var(--h-primary)] bg-[var(--h-secondary)] p-8 text-[var(--h-background)] shadow-2xl shadow-black/40">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 text-3xl leading-none text-white/60 transition hover:text-white"
        >
          ×
        </button>
        <p className="text-xs font-extrabold uppercase tracking-[0.34em] text-[var(--h-accent)]">
          {getValue(data, "sectionEightEyebrow")}
        </p>
        <h3 className="mt-4 text-3xl font-extrabold leading-tight">{getValue(data, "contactTitle")}</h3>
        <p className="mt-3 text-sm leading-7 text-white/60">{getValue(data, "contactText")}</p>
        <form className="mt-7 grid gap-3" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-skin="template" data-bizuply-form-id="handcraft-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
          <input className="h-input px-5 py-4 text-right" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
          <input className="h-input px-5 py-4 text-right" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
          <input className="h-input px-5 py-4 text-right" placeholder="מה התקלה?"  name="other" data-bizuply-form-field-id="other" />
          <button
            type="submit"
            className="mt-2 bg-[var(--h-primary)] px-7 py-4 text-sm font-extrabold uppercase tracking-[0.2em] text-white transition hover:bg-[var(--h-accent)] hover:text-[var(--h-dark)]"
          >
            {getValue(data, "contactButton")}
          </button>
        </form>
      </div>
    </div>
  );
}

function HomePage({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <>
      <Hero data={data} openModal={openModal} />
      <Services data={data} />
      <BeforeAfter data={data} />
      <WhyUs data={data} />
      <Pricing data={data} />
      <ServiceAreas data={data} />
      <Reviews data={data} />
      <EmergencyCta data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function HandcraftPages({
  initialPage = "home",
  mode = "preview",
  data,
  onPageChange,
  isPublic,
  viewMode,
  runtimeMode,
  page,
  pageId,
  initialPageId,
  activePageId,
  currentPageId,
}: HandcraftPagesProps) {
  const mergedData = useMemo(() => ({ ...handcraftDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      dir="rtl"
      data-template-id="handcraft"
      className="min-h-screen w-full overflow-x-hidden bg-[var(--h-background)] text-[var(--h-text)]"
    >
      <style dangerouslySetInnerHTML={{ __html: handcraftEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
