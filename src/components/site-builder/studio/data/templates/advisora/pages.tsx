import React, { useEffect, useMemo, useRef, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { advisoraDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal, useCountUp } from "../shared/Reveal";
import { advisoraEditorCss } from "./editorCss";

export const advisoraPages = [{ id: "home", label: "בית", slug: "/" }];

type AdvisoraPagesProps = {
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
  return data?.[key] ?? (advisoraDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  const links = [
    [getValue(data, "navServices"), "#services"],
    [getValue(data, "sectionFourTitle"), "#cases"],
    [getValue(data, "sectionFiveTitle"), "#process"],
    [getValue(data, "navContact"), "#contact"],
  ];

  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#071428]/15 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <a href="#" className="grid h-11 w-11 place-items-center border border-[var(--p)] text-sm font-bold text-[var(--p)]" aria-label={getValue(data, "brandName")}>
          {getValue(data, "logoText")}
        </a>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/80 lg:flex" aria-label="ניווט ראשי">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="a-nav-link">
              {label}
            </a>
          ))}
        </nav>
        <button type="button" onClick={openModal} className="border border-[var(--p)] bg-[var(--p)] px-5 py-3 text-sm font-bold text-[var(--dark)] transition hover:bg-transparent hover:text-[var(--p)]">
          {getValue(data, "heroPrimaryButton")}
        </button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data, "heroImage")} alt="" className="a-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071428]/95 via-[#0B1F3A]/80 to-[#0B1F3A]/35" />
      <div className="absolute inset-y-0 left-0 hidden w-[38vw] border-r border-[var(--p)]/25 bg-[#071428]/55 backdrop-blur-[2px] lg:block" />
      <div className="relative z-10 mx-auto min-h-[100svh] max-w-7xl px-5 pb-16 pt-32 lg:px-8">
        <div className="flex min-h-[calc(100svh-12rem)] items-end justify-end lg:items-center">
          <div className="a-hero-panel max-w-2xl border border-[var(--p)]/25 bg-[#071428]/70 p-7 shadow-2xl shadow-black/30 backdrop-blur-md lg:ml-0 lg:p-10">
            <p className="a-hero-in text-xs font-bold uppercase tracking-[0.36em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
            <div className="a-hero-in a-d1 mt-5 h-1 w-20 bg-[var(--p)]" />
            <p className="t-display a-hero-in a-d1 mt-7 text-6xl font-bold leading-none text-[var(--p)] md:text-8xl lg:text-9xl">
              {getValue(data, "brandName")}
            </p>
            <h1 className="t-display a-hero-in a-d2 mt-5 whitespace-pre-line text-4xl font-bold leading-[1.04] text-white md:text-6xl">
              {getValue(data, "heroTitle")}
            </h1>
            <p className="a-hero-in a-d3 mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
            <div className="a-hero-in a-d3 mt-9 flex flex-wrap gap-3">
              <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--dark)] transition hover:bg-white">
                {getValue(data, "heroPrimaryButton")}
              </button>
              <a href="#cases" className="border border-white/30 px-8 py-4 text-sm font-semibold text-white transition hover:border-[var(--p)] hover:text-[var(--p)]">
                {getValue(data, "heroSecondaryButton")}
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
    [getValue(data, "itemOneTitle"), getValue(data, "itemOneText")],
    [getValue(data, "itemTwoTitle"), getValue(data, "itemTwoText")],
    [getValue(data, "itemThreeTitle"), getValue(data, "itemThreeText")],
    [getValue(data, "itemFourTitle"), getValue(data, "itemFourText")],
  ];
  const tickerServices = [...services, ...services];

  return (
    <section id="services" data-template-section-type="services" className="overflow-hidden bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end" delayMs={80}>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "servicesEyebrow")}</p>
            <h2 className="t-display mt-4 text-4xl font-bold leading-tight md:text-6xl">{getValue(data, "sectionTwoTitle")}</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "sectionTwoText")}</p>
        </Reveal>
      </div>
      <Reveal className="a-service-viewport mt-12" delayMs={180} variant="right">
        <div className="a-service-track">
          {tickerServices.map(([title, text], index) => (
            <article key={`${title}-${index}`} className="a-service-panel aspect-square min-w-[260px] border border-[var(--p)]/30 bg-[var(--surface)] p-7 md:min-w-[320px]">
              <span className="text-sm font-bold text-[var(--p)]">0{(index % services.length) + 1}</span>
              <h3 className="t-display mt-10 text-3xl font-bold leading-tight">{title}</h3>
              <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{text}</p>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function CountUpStat({ label, suffix, target, delayMs }: { label: string; suffix: string; target: number; delayMs: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const value = useCountUp(target, enabled, 1500);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEnabled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Reveal delayMs={delayMs} variant="up">
      <div ref={ref} className="border-l border-[#071428]/25 px-6 py-5 last:border-l-0">
        <div className="t-display text-5xl font-bold leading-none text-[#071428] md:text-7xl">
          {value}
          {suffix}
        </div>
        <p className="mt-3 text-sm font-bold text-[#071428]/75">{label}</p>
      </div>
    </Reveal>
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  const stats = [
    [Number(getValue(data, "statOneNumber")), getValue(data, "statOneSuffix"), getValue(data, "heroStatOneLabel")],
    [Number(getValue(data, "statTwoNumber")), getValue(data, "statTwoSuffix"), getValue(data, "heroStatTwoLabel")],
    [Number(getValue(data, "statThreeNumber")), getValue(data, "statThreeSuffix"), getValue(data, "heroStatThreeLabel")],
  ] as const;

  return (
    <section data-template-section-type="stats" className="bg-[var(--p)] px-5 py-12 text-[#071428] lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <Reveal delayMs={60} variant="right">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em]">{getValue(data, "sectionThreeEyebrow")}</p>
            <h2 className="t-display mt-3 text-4xl font-bold md:text-5xl">{getValue(data, "sectionThreeTitle")}</h2>
          </div>
        </Reveal>
        <div className="grid border border-[#071428]/25 bg-[#D7B94B] md:grid-cols-3">
          {stats.map(([target, suffix, label], index) => (
            <CountUpStat key={label} target={target} suffix={suffix} label={label} delayMs={140 + index * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudies({ data }: { data: Record<string, any> }) {
  const cases = [
    [getValue(data, "caseOneTitle"), getValue(data, "caseOneTag"), getValue(data, "caseOneImage"), getValue(data, "caseOneText")],
    [getValue(data, "caseTwoTitle"), getValue(data, "caseTwoTag"), getValue(data, "caseTwoImage"), getValue(data, "caseTwoText")],
  ];

  return (
    <section id="cases" data-template-section-type="case-studies" className="bg-[#071428] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl" delayMs={80}>
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "caseEyebrow")}</p>
          <h2 className="t-display mt-4 text-4xl font-bold md:text-6xl">{getValue(data, "sectionFourTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-7 lg:grid-cols-[1.18fr_0.82fr]">
          {cases.map(([title, tag, image, text], index) => (
            <Reveal key={title} delayMs={160 + index * 140} variant={index === 0 ? "right" : "left"} className={index === 1 ? "lg:mt-20" : ""}>
              <article className="a-case-card border border-[var(--p)]/25 bg-[var(--bg)]">
                <div className="a-image-frame aspect-square overflow-hidden">
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="p-7 lg:p-9">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--p)]">{tag}</p>
                  <h3 className="t-display mt-4 text-3xl font-bold leading-tight md:text-4xl">{title}</h3>
                  <p className="mt-5 leading-8 text-[var(--muted)]">{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ data }: { data: Record<string, any> }) {
  const steps = [
    ["01", getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    ["02", getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    ["03", getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    ["04", getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];

  return (
    <section id="process" data-template-section-type="process" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr]">
        <Reveal delayMs={80} variant="right">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="t-display mt-4 text-4xl font-bold leading-tight md:text-6xl">{getValue(data, "sectionFiveTitle")}</h2>
          <p className="mt-6 leading-8 text-[var(--muted)]">{getValue(data, "processIntro")}</p>
        </Reveal>
        <div className="relative border-r border-[var(--p)]/35 pr-8">
          {steps.map(([num, title, text], index) => (
            <Reveal key={num} delayMs={160 + index * 120} variant="left">
              <article className="a-timeline-item relative pb-12 last:pb-0">
                <span className="absolute -right-[45px] top-1 h-7 w-7 border-4 border-[var(--bg)] bg-[var(--p)]" />
                <p className="text-sm font-bold text-[var(--p)]">{num}</p>
                <h3 className="t-display mt-2 text-3xl font-bold">{title}</h3>
                <p className="mt-3 max-w-2xl leading-8 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  const [active, setActive] = useState(0);
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName"), getValue(data, "reviewOneRole")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName"), getValue(data, "reviewTwoRole")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName"), getValue(data, "reviewThreeRole")],
  ];
  const [text, name, role] = reviews[active];

  return (
    <section data-template-section-type="testimonials" className="bg-[#071428] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal delayMs={80}>
          <p className="text-center text-sm font-bold uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "testimonialEyebrow")}</p>
          <h2 className="t-display mt-4 text-center text-4xl font-bold md:text-6xl">{getValue(data, "sectionSixTitle")}</h2>
        </Reveal>
        <Reveal delayMs={190} variant="scale">
          <blockquote className="mt-12 border-y border-[var(--p)]/30 py-10 text-center md:py-16">
            <p className="t-display text-3xl font-bold leading-snug md:text-6xl">"{text}"</p>
            <footer className="mt-9">
              <p className="text-lg font-bold text-[var(--p)]">{name}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{role}</p>
            </footer>
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            {reviews.map((review, index) => (
              <button
                key={review[1]}
                type="button"
                onClick={() => setActive(index)}
                className={`h-3 w-12 border border-[var(--p)] transition ${active === index ? "bg-[var(--p)]" : "bg-transparent"}`}
                aria-label={`עדות ${index + 1}`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Faq({ data }: { data: Record<string, any> }) {
  const [open, setOpen] = useState(0);
  const faqs = [
    [getValue(data, "faqOneQuestion"), getValue(data, "faqOneAnswer")],
    [getValue(data, "faqTwoQuestion"), getValue(data, "faqTwoAnswer")],
    [getValue(data, "faqThreeQuestion"), getValue(data, "faqThreeAnswer")],
  ];

  return (
    <section data-template-section-type="faq" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal delayMs={80} variant="right">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "faqEyebrow")}</p>
          <h2 className="t-display mt-4 text-4xl font-bold leading-tight md:text-6xl">{getValue(data, "sectionSevenTitle")}</h2>
          <p className="mt-6 leading-8 text-[var(--muted)]">{getValue(data, "faqIntro")}</p>
        </Reveal>
        <div className="space-y-4">
          {faqs.map(([question, answer], index) => (
            <Reveal key={question} delayMs={160 + index * 110} variant="left">
              <div className="border border-[var(--p)]/25 bg-[#071428]">
                <button type="button" onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-center justify-between gap-5 p-6 text-right">
                  <span className="text-lg font-bold">{question}</span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center bg-[var(--p)] text-xl font-bold text-[var(--dark)]">{open === index ? "−" : "+"}</span>
                </button>
                {open === index ? <p className="px-6 pb-6 leading-8 text-[var(--muted)]">{answer}</p> : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  const details = [
    ["טלפון", getValue(data, "phone")],
    ["אימייל", getValue(data, "email")],
    ["כתובת", getValue(data, "address")],
  ];

  return (
    <section id="contact" data-template-section-type="contact" className="bg-[#071428] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl border border-[var(--p)]/25 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="bg-[var(--bg)] p-8 lg:p-12" delayMs={80} variant="right">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="t-display mt-4 text-4xl font-bold leading-tight md:text-6xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-6 leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-10 divide-y divide-[var(--p)]/20 border-y border-[var(--p)]/20">
            {details.map(([label, value], index) => (
              <Reveal key={label} delayMs={180 + index * 100} variant="right">
                <div className="grid gap-1 py-5 sm:grid-cols-[120px_1fr]">
                  <span className="text-sm font-bold text-[var(--p)]">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
        <Reveal className="bg-[#06101F] p-8 lg:p-12" delayMs={160} variant="left">
          <form className="grid gap-4" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-skin="template" data-bizuply-form-id="advisora-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
            <input className="border border-[var(--p)]/25 bg-transparent px-5 py-4 text-right outline-none transition focus:border-[var(--p)]" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
            <input className="border border-[var(--p)]/25 bg-transparent px-5 py-4 text-right outline-none transition focus:border-[var(--p)]" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
            <input className="border border-[var(--p)]/25 bg-transparent px-5 py-4 text-right outline-none transition focus:border-[var(--p)]" placeholder="אימייל"  name="email" data-bizuply-form-field-id="email" type="email" autoComplete="email" />
            <textarea className="min-h-32 border border-[var(--p)]/25 bg-transparent px-5 py-4 text-right outline-none transition focus:border-[var(--p)]" placeholder="מה האתגר העסקי המרכזי?"  name="other" data-bizuply-form-field-id="other"></textarea>
            <button type="submit" onClick={openModal} className="mt-2 bg-[var(--p)] px-7 py-4 text-sm font-bold text-[var(--dark)] transition hover:bg-white">
              {getValue(data, "contactButton")}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="bg-[var(--p)] px-5 py-16 text-[#071428] lg:px-8 lg:py-24">
      <Reveal className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end" delayMs={80}>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.32em]">{getValue(data, "brandName")}</p>
          <h2 className="t-display mt-4 text-5xl font-bold leading-[0.95] md:text-7xl lg:text-8xl">{getValue(data, "ctaTitle")}</h2>
        </div>
        <div>
          <p className="text-lg font-semibold leading-8 text-[#071428]/80">{getValue(data, "ctaText")}</p>
          <button type="button" onClick={openModal} className="mt-8 border border-[#071428] bg-[#071428] px-8 py-4 text-sm font-bold text-white transition hover:bg-transparent hover:text-[#071428]">
            {getValue(data, "ctaButton")}
          </button>
          <p className="mt-10 text-xs font-bold">© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
        </div>
      </Reveal>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-[var(--p)]/40 bg-[#071428] p-8 text-[var(--text)] shadow-2xl shadow-black/40">
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl text-[var(--p)]" aria-label="סגירה">
          ×
        </button>
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "brandName")}</p>
        <h3 className="t-display mt-3 text-3xl font-bold">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-skin="template" data-bizuply-form-id="advisora-contact-2" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
          <input className="border border-[var(--p)]/25 bg-transparent px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
          <input className="border border-[var(--p)]/25 bg-transparent px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
          <button type="submit" className="bg-[var(--p)] py-4 text-sm font-bold text-[var(--dark)]">{getValue(data, "contactButton")}</button>
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
      <Stats data={data} />
      <CaseStudies data={data} />
      <Process data={data} />
      <Testimonials data={data} />
      <Faq data={data} />
      <Contact data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function AdvisoraPages(props: AdvisoraPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...advisoraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id="advisora" className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: advisoraEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
