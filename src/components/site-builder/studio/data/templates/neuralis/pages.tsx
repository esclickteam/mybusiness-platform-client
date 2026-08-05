import React, { useEffect, useMemo, useRef, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { neuralisDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { neuralisEditorCss } from "./editorCss";
import { Reveal, useCountUp } from "../shared/Reveal";

export const neuralisPages = [{ id: "home", label: "בית", slug: "/" }];

type NeuralisPagesProps = {
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
  return data?.[key] ?? (neuralisDefaultData as Record<string, any>)[key] ?? "";
}

function useInViewOnce() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Header({ data }: { data: Record<string, any> }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky inset-x-0 top-0 z-50 border-b border-cyan-300/10 bg-[#050816]/72 text-white backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#top" className="group flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center border border-cyan-300/40 bg-cyan-300 text-lg font-black text-[#050816] shadow-[0_0_34px_rgba(34,211,238,0.36)] transition duration-300 group-hover:scale-105">
            {getValue(data, "logoText")}
          </span>
          <span className="neuralis-display text-2xl font-bold tracking-tight text-white">{getValue(data, "brandName")}</span>
        </a>
        <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.26em] text-cyan-50/58 lg:flex">
          <a href="#product" className="transition hover:text-cyan-200">{getValue(data, "navProduct")}</a>
          <a href="#workflow" className="transition hover:text-cyan-200">{getValue(data, "navWorkflow")}</a>
          <a href="#pricing" className="transition hover:text-cyan-200">{getValue(data, "navPricing")}</a>
          <a href="#demo" className="transition hover:text-cyan-200">{getValue(data, "navDemo")}</a>
        </nav>
        <a href="#demo" className="border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.18)] transition hover:bg-cyan-300 hover:text-[#050816]">
          {getValue(data, "heroPrimaryButton")}
        </a>
      </div>
    </header>
  );
}

function MetricCard({ target, label, suffix = "", delayMs = 0 }: { target: number; label: string; suffix?: string; delayMs?: number }) {
  const { ref, visible } = useInViewOnce();
  const value = useCountUp(target, visible, 1300);

  return (
    <div ref={ref}>
      <Reveal delayMs={delayMs} variant="scale">
        <div className="neuralis-card relative aspect-square overflow-hidden border border-cyan-300/18 bg-white/[0.045] p-5 backdrop-blur">
          <p className="neuralis-display text-2xl md:text-5xl font-bold text-cyan-200">{value}{suffix}</p>
          <p className="mt-3 text-sm font-semibold leading-6 text-cyan-50/60">{label}</p>
        </div>
      </Reveal>
    </div>
  );
}

function Hero({ data }: { data: Record<string, any> }) {
  const metrics = [
    [Number(getValue(data, "heroMetricOneValue")) || 42, getValue(data, "heroMetricOneLabel"), ""],
    [Number(getValue(data, "heroMetricTwoValue")) || 8, getValue(data, "heroMetricTwoLabel"), ""],
    [Number(getValue(data, "heroMetricThreeValue")) || 99, getValue(data, "heroMetricThreeLabel"), "%"],
  ] as const;

  return (
    <section id="top" data-template-section-type="hero" className="relative isolate overflow-hidden px-5 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
      <div className="neuralis-grid absolute inset-0 -z-20" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <span className="neuralis-orb absolute right-[7%] top-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <span className="neuralis-orb absolute left-[12%] top-52 h-96 w-96 rounded-full bg-sky-500/16 blur-3xl" />
        <span className="neuralis-orb absolute bottom-20 right-[45%] h-64 w-64 rounded-full bg-teal-300/12 blur-3xl" />
      </div>
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <Reveal variant="right">
          <p className="inline-flex border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-cyan-200">
            {getValue(data, "heroEyebrow")}
          </p>
          <h1 className="neuralis-display mt-6 text-7xl font-bold leading-[0.78] text-white md:text-9xl lg:text-[10.5rem]">
            {getValue(data, "heroTitle")}
          </h1>
          <p className="neuralis-display mt-6 max-w-3xl text-3xl font-semibold leading-tight text-cyan-100 md:text-5xl">
            {getValue(data, "heroKicker")}
          </p>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-[var(--muted)]">
            {getValue(data, "heroSubtitle")}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#demo" className="bg-cyan-300 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#050816] shadow-[0_0_38px_rgba(34,211,238,0.34)] transition hover:-translate-y-1">
              {getValue(data, "heroPrimaryButton")}
            </a>
            <a href="#workflow" className="border border-cyan-300/30 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-cyan-100 transition hover:-translate-y-1 hover:bg-cyan-300/10">
              {getValue(data, "heroSecondaryButton")}
            </a>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <div className="relative">
            <div className="absolute -inset-8 bg-cyan-300/10 blur-3xl" />
            <div className="neuralis-scan neuralis-card relative border border-cyan-300/24 bg-[#071126]/90 p-3 shadow-2xl shadow-cyan-950/60">
              <div className="flex items-center justify-between border-b border-cyan-300/14 px-4 py-3">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-cyan-300" />
                  <span className="h-3 w-3 rounded-full bg-sky-400" />
                  <span className="h-3 w-3 rounded-full bg-white/30" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-200/75">LIVE OPS</span>
              </div>
              <img src={getValue(data, "heroImage")} alt="" className="h-[420px] w-full object-cover opacity-82 mix-blend-luminosity" />
              <div className="absolute bottom-8 right-8 w-64 border border-cyan-300/25 bg-[#06101f]/86 p-5 backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-200">AI recommendation</p>
                <div className="mt-4 h-2 w-full bg-white/10">
                  <span className="block h-full w-[76%] bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.75)]" />
                </div>
                <p className="mt-4 text-sm leading-6 text-cyan-50/72">הסוכן איתר חריגה, יצר הסבר והכין פעולה לאישור.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 md:grid-cols-3 gap-3">
        {metrics.map(([target, label, suffix], index) => (
          <MetricCard key={label} target={target} label={label} suffix={suffix} delayMs={index * 90} />
        ))}
      </div>
    </section>
  );
}

function LogoCloud({ data }: { data: Record<string, any> }) {
  const logos = [
    getValue(data, "logoOne"),
    getValue(data, "logoTwo"),
    getValue(data, "logoThree"),
    getValue(data, "logoFour"),
    getValue(data, "logoFive"),
    getValue(data, "logoSix"),
    getValue(data, "logoSeven"),
    getValue(data, "logoEight"),
  ];
  const loop = [...logos, ...logos];

  return (
    <section data-template-section-type="logos" className="overflow-hidden border-y border-cyan-300/10 bg-[#071126] px-5 py-12 lg:px-8">
      <Reveal>
        <p className="text-center text-xs font-black uppercase tracking-[0.38em] text-cyan-100/50">{getValue(data, "logoCloudTitle")}</p>
      </Reveal>
      <div className="mt-8 flex overflow-hidden">
        <div className="neuralis-marquee flex min-w-max items-center gap-4">
          {loop.map((logo, index) => (
            <span key={`${logo}-${index}`} className="border border-cyan-300/12 bg-white/[0.035] px-8 py-4 text-sm font-black uppercase tracking-[0.22em] text-cyan-100/70">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesBento({ data }: { data: Record<string, any> }) {
  const features = [
    [getValue(data, "featureOneTitle"), getValue(data, "featureOneText")],
    [getValue(data, "featureTwoTitle"), getValue(data, "featureTwoText")],
    [getValue(data, "featureThreeTitle"), getValue(data, "featureThreeText")],
    [getValue(data, "featureFourTitle"), getValue(data, "featureFourText")],
    [getValue(data, "featureFiveTitle"), getValue(data, "featureFiveText")],
    [getValue(data, "featureSixTitle"), getValue(data, "featureSixText")],
  ];

  return (
    <section id="product" data-template-section-type="features" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.38em] text-cyan-300">{getValue(data, "featuresEyebrow")}</p>
            <h2 className="neuralis-display mt-4 text-5xl font-bold leading-tight text-white md:text-7xl">{getValue(data, "featuresTitle")}</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "featuresText")}</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, text], index) => (
            <Reveal key={title} delayMs={index * 85} variant="up">
              <article className="neuralis-card relative flex min-h-[280px] flex-col justify-between overflow-hidden border border-cyan-300/22 bg-white/[0.045] p-7 text-right transition duration-500 hover:-translate-y-2 hover:border-cyan-300/70 md:min-h-[320px]">
                <span className="neuralis-display text-5xl font-bold text-cyan-300/28 md:text-6xl">0{index + 1}</span>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white md:text-3xl">{title}</h3>
                  <p className="mt-4 text-sm font-medium leading-7 text-cyan-50/72">{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow({ data }: { data: Record<string, any> }) {
  const steps = [
    [getValue(data, "workflowOneTitle"), getValue(data, "workflowOneText")],
    [getValue(data, "workflowTwoTitle"), getValue(data, "workflowTwoText")],
    [getValue(data, "workflowThreeTitle"), getValue(data, "workflowThreeText")],
  ];

  return (
    <section id="workflow" data-template-section-type="process" className="bg-[#071126] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs font-black uppercase tracking-[0.38em] text-cyan-300">{getValue(data, "workflowEyebrow")}</p>
          <h2 className="neuralis-display mt-4 max-w-4xl text-5xl font-bold leading-none text-white md:text-7xl">{getValue(data, "workflowTitle")}</h2>
        </Reveal>
        <div className="relative mt-14 grid gap-5 lg:grid-cols-3">
          <div className="absolute right-[15%] top-20 hidden h-px w-[70%] bg-cyan-300/24 lg:block" />
          {steps.map(([title, text], index) => (
            <Reveal key={title} delayMs={index * 120} variant="scale">
              <article className="group relative min-h-[360px] border border-cyan-300/22 bg-[#09182d] p-8 shadow-[0_0_0_rgba(34,211,238,0)] transition duration-500 hover:-translate-y-2 hover:border-cyan-300/70 hover:shadow-[0_0_70px_rgba(34,211,238,0.18)]">
                <span className="grid h-20 w-20 place-items-center border border-cyan-300 bg-cyan-300 text-2xl font-black text-[#050816] shadow-[0_0_42px_rgba(34,211,238,0.45)]">0{index + 1}</span>
                <h3 className="neuralis-display mt-10 text-2xl sm:text-4xl font-bold text-white">{title}</h3>
                <p className="mt-5 text-base leading-8 text-[var(--muted)]">{text}</p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, dot) => (
                    <span key={dot} className={`h-2 bg-cyan-300/20 ${dot <= index + 3 ? "bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.72)]" : ""}`} />
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ data }: { data: Record<string, any> }) {
  const tiers = [
    [getValue(data, "priceOneName"), getValue(data, "priceOnePrice"), getValue(data, "priceOneText"), getValue(data, "priceOneFeatures")],
    [getValue(data, "priceTwoName"), getValue(data, "priceTwoPrice"), getValue(data, "priceTwoText"), getValue(data, "priceTwoFeatures")],
    [getValue(data, "priceThreeName"), getValue(data, "priceThreePrice"), getValue(data, "priceThreeText"), getValue(data, "priceThreeFeatures")],
  ];

  return (
    <section id="pricing" data-template-section-type="pricing" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.38em] text-cyan-300">{getValue(data, "pricingEyebrow")}</p>
              <h2 className="neuralis-display mt-4 text-5xl font-bold leading-none text-white md:text-7xl">{getValue(data, "pricingTitle")}</h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-[var(--muted)]">{getValue(data, "pricingText")}</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {tiers.map(([name, price, text, features], index) => (
            <Reveal key={name} delayMs={index * 110} variant="up">
              <article className={`flex aspect-square flex-col justify-between border p-7 ${index === 1 ? "border-cyan-300 bg-cyan-300 text-[#050816] shadow-[0_0_70px_rgba(34,211,238,0.30)]" : "border-cyan-300/20 bg-white/[0.04] text-white"}`}>
                <div>
                  <p className="neuralis-display text-2xl sm:text-4xl font-bold">{name}</p>
                  <p className="neuralis-display mt-7 text-3xl md:text-6xl font-bold">{price}</p>
                  <p className={`mt-5 text-sm font-semibold leading-7 ${index === 1 ? "text-[#073242]/75" : "text-[var(--muted)]"}`}>{text}</p>
                </div>
                <div className={`space-y-2 border-t pt-5 text-sm font-bold ${index === 1 ? "border-[#050816]/20" : "border-cyan-300/15"}`}>
                  {String(features).split("|").map((feature) => (
                    <p key={feature}>/ {feature}</p>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecurityStrip({ data }: { data: Record<string, any> }) {
  const badges = [getValue(data, "securityOne"), getValue(data, "securityTwo"), getValue(data, "securityThree"), getValue(data, "securityFour")];

  return (
    <section data-template-section-type="security" className="border-y border-cyan-300/10 bg-[#071126] px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.38em] text-cyan-300">{getValue(data, "securityEyebrow")}</p>
          <h2 className="neuralis-display mt-4 text-4xl font-bold leading-none text-white md:text-6xl">{getValue(data, "securityTitle")}</h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--muted)]">{getValue(data, "securityText")}</p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map((badge, index) => (
            <Reveal key={badge} delayMs={index * 80} variant="scale">
              <div className="aspect-square border border-cyan-300/22 bg-[#09182d] p-5">
                <span className="neuralis-display text-2xl md:text-5xl font-bold text-cyan-300/24">0{index + 1}</span>
                <p className="mt-8 text-lg font-black uppercase tracking-[0.16em] text-cyan-100">{badge}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName"), getValue(data, "reviewOneRole")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName"), getValue(data, "reviewTwoRole")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName"), getValue(data, "reviewThreeRole")],
  ];

  return (
    <section data-template-section-type="testimonials" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs font-black uppercase tracking-[0.38em] text-cyan-300">{getValue(data, "reviewEyebrow")}</p>
          <h2 className="neuralis-display mt-4 max-w-4xl text-5xl font-bold leading-none text-white md:text-7xl">{getValue(data, "reviewsTitle")}</h2>
        </Reveal>
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {reviews.map(([text, name, role], index) => (
            <Reveal key={name} delayMs={index * 100} variant="up">
              <blockquote className="flex aspect-square flex-col justify-between border border-cyan-300/18 bg-[#071126] p-7">
                <p className="text-xl font-semibold leading-9 text-cyan-50">"{text}"</p>
                <footer>
                  <p className="font-black text-cyan-300">{name}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-50/45">{role}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoForm({ data }: { data: Record<string, any> }) {
  return (
    <section id="demo" data-template-section-type="contact" className="bg-[#071126] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-8 border border-cyan-300/18 bg-[#050816] p-6 md:p-10 lg:grid-cols-[0.86fr_1.14fr]">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.38em] text-cyan-300">{getValue(data, "contactEyebrow")}</p>
          <h2 className="neuralis-display mt-4 text-5xl font-bold leading-none text-white md:text-7xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-6 text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm font-bold text-cyan-100/78">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <form className="grid gap-4" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-skin="template" data-bizuply-form-id="neuralis-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="border border-cyan-300/16 bg-white/[0.045] px-5 py-4 text-right text-white outline-none placeholder:text-cyan-50/28 focus:border-cyan-300" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
              <input className="border border-cyan-300/16 bg-white/[0.045] px-5 py-4 text-right text-white outline-none placeholder:text-cyan-50/28 focus:border-cyan-300" placeholder="אימייל עבודה"  name="email" data-bizuply-form-field-id="email" type="email" autoComplete="email" />
            </div>
            <input className="border border-cyan-300/16 bg-white/[0.045] px-5 py-4 text-right text-white outline-none placeholder:text-cyan-50/28 focus:border-cyan-300" placeholder="חברה ותפקיד"  name="company" data-bizuply-form-field-id="company" />
            <textarea className="min-h-36 border border-cyan-300/16 bg-white/[0.045] px-5 py-4 text-right text-white outline-none placeholder:text-cyan-50/28 focus:border-cyan-300" placeholder="איזה תהליך הייתם רוצים להפוך לחכם?"  name="other" data-bizuply-form-field-id="other"></textarea>
            <button type="submit" className="bg-cyan-300 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#050816] transition hover:-translate-y-1">
              {getValue(data, "contactButton")}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data }: { data: Record<string, any> }) {
  return (
    <footer data-template-section-type="footer" className="neuralis-footer-glow relative overflow-hidden border-t border-cyan-300/16 bg-[#030610] px-5 py-20 lg:px-8">
      <div className="absolute left-1/2 top-0 h-56 w-[760px] -translate-x-1/2 rounded-full bg-cyan-300/16 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <h2 className="neuralis-display max-w-5xl text-5xl font-bold leading-none text-white md:text-8xl">{getValue(data, "ctaTitle")}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "ctaText")}</p>
          <a href="#demo" className="mt-10 inline-flex bg-cyan-300 px-9 py-5 text-sm font-black uppercase tracking-[0.2em] text-[#050816] shadow-[0_0_46px_rgba(34,211,238,0.38)]">
            {getValue(data, "ctaButton")}
          </a>
        </Reveal>
        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-cyan-300/12 pt-6 text-xs font-bold uppercase tracking-[0.2em] text-cyan-50/45 md:flex-row">
          <p>© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
          <p>{getValue(data, "email")} · {getValue(data, "phone")}</p>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ data }: { data: Record<string, any> }) {
  return (
    <>
      <Hero data={data} />
      <LogoCloud data={data} />
      <FeaturesBento data={data} />
      <Workflow data={data} />
      <Pricing data={data} />
      <SecurityStrip data={data} />
      <Testimonials data={data} />
      <DemoForm data={data} />
      <Footer data={data} />
    </>
  );
}

export default function NeuralisPages(props: NeuralisPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...neuralisDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );

  return (
    <div dir="rtl" data-template-id="neuralis" className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: neuralisEditorCss }} />
      <Header data={mergedData} />
      <VisualPageStack activePageId={currentPage} pages={[{ id: "home", content: <HomePage data={mergedData} /> }]} />
    </div>
  );
}
