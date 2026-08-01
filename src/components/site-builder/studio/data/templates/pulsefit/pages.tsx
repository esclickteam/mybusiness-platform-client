import React, { useEffect, useMemo, useRef, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { pulsefitDefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { pulsefitEditorCss } from "./editorCss";
import { Reveal, useCountUp } from "../shared/Reveal";

export const pulsefitPages = [{ id: "home", label: "בית", slug: "/" }];

type PulsefitPagesProps = {
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
  return data?.[key] ?? (pulsefitDefaultData as Record<string, any>)[key] ?? "";
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
      { threshold: 0.24 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky inset-x-0 top-0 z-50 border-b border-white/10 bg-[var(--bg)]/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-[var(--p)] text-sm font-black text-black">{getValue(data, "logoText")}</span>
          <span className="t-display text-3xl font-bold uppercase tracking-tight">{getValue(data, "brandName")}</span>
        </div>
        <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.24em] text-white/70 lg:flex">
          <a href="#programs">{getValue(data, "navServices")}</a>
          <a href="#pricing">{getValue(data, "navAbout")}</a>
          <a href="#start">{getValue(data, "navContact")}</a>
        </nav>
        <button type="button" onClick={openModal} className="bg-[var(--p)] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black">{getValue(data, "heroPrimaryButton")}</button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="hero" className="relative min-h-[92svh] overflow-hidden bg-[var(--bg)]">
      <img src={getValue(data, "heroImage")} alt="" className="pulsefit-hero-image absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-l from-black/88 via-black/58 to-black/18" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--bg)] to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-center px-5 py-12 md:py-24 lg:px-8">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <div className="mt-5 flex items-start gap-5">
            <span className="pulsefit-slash mt-3 hidden h-36 w-4 bg-[var(--p)] md:block" />
            <h1 className="t-display whitespace-pre-line text-7xl font-bold uppercase leading-[0.86] text-white md:text-9xl lg:text-[10rem]">{getValue(data, "heroTitle")}</h1>
          </div>
          <p className="mt-8 max-w-2xl text-xl font-semibold leading-8 text-white/78">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={openModal} className="bg-[var(--p)] px-9 py-4 text-sm font-black uppercase tracking-[0.16em] text-black">{getValue(data, "heroPrimaryButton")}</button>
            <a href="#programs" className="border border-white/40 px-9 py-4 text-sm font-black uppercase tracking-[0.16em] text-white">{getValue(data, "heroSecondaryButton")}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Programs({ data }: { data: Record<string, any> }) {
  const programs = [
    [getValue(data, "programOneTitle"), getValue(data, "programOneText"), getValue(data, "programOneMeta")],
    [getValue(data, "programTwoTitle"), getValue(data, "programTwoText"), getValue(data, "programTwoMeta")],
    [getValue(data, "programThreeTitle"), getValue(data, "programThreeText"), getValue(data, "programThreeMeta")],
    [getValue(data, "programFourTitle"), getValue(data, "programFourText"), getValue(data, "programFourMeta")],
  ];

  return (
    <section id="programs" data-template-section-type="services" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="t-display text-5xl font-bold uppercase leading-none md:text-7xl">{getValue(data, "sectionTwoTitle")}</h2>
            <p className="max-w-md text-sm font-semibold leading-7 text-[var(--muted)]">{getValue(data, "sectionTwoText")}</p>
          </div>
        </Reveal>
        <div className="mt-12 space-y-4">
          {programs.map(([title, text, meta], index) => (
            <Reveal key={title} delayMs={index * 90} variant="up">
              <article className="pulsefit-program-row border-2 border-[var(--p)] p-6 md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-6">
                    <span className="t-display text-2xl md:text-5xl font-bold text-[var(--p)]">0{index + 1}</span>
                    <div>
                      <h3 className="t-display text-3xl font-bold uppercase text-white md:text-5xl">{title}</h3>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">{text}</p>
                    </div>
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{meta}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CounterRow({ target, label, prefix = "", suffix = "", decimals = 0, delayMs = 0 }: { target: number; label: string; prefix?: string; suffix?: string; decimals?: number; delayMs?: number }) {
  const { ref, visible } = useInViewOnce();
  const raw = useCountUp(target, visible, 1300);
  const value = decimals > 0 ? (raw / Math.pow(10, decimals)).toFixed(decimals) : raw.toLocaleString("he-IL");

  return (
    <div ref={ref}>
      <Reveal delayMs={delayMs} variant="right">
        <div className="border-b border-white/15 py-8 md:flex md:items-end md:justify-between">
          <p className="t-display text-6xl font-bold uppercase text-[var(--p)] md:text-8xl">{prefix}{value}{suffix}</p>
          <p className="mt-3 text-lg font-bold text-white md:mb-3 md:mt-0">{label}</p>
        </div>
      </Reveal>
    </div>
  );
}

function Results({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="stats" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-black uppercase tracking-[0.42em] text-[var(--p)]">{getValue(data, "sectionThreeEyebrow")}</p>
          <h2 className="t-display mt-4 text-5xl font-bold uppercase leading-none text-white md:text-7xl">{getValue(data, "sectionThreeTitle")}</h2>
        </Reveal>
        <div className="mt-12">
          <CounterRow target={12} prefix="-" suffix="KG" label={getValue(data, "resultOneLabel")} />
          <CounterRow target={840} suffix="+" label={getValue(data, "resultTwoLabel")} delayMs={90} />
          <CounterRow target={49} decimals={1} suffix="/5" label={getValue(data, "resultThreeLabel")} delayMs={180} />
        </div>
      </div>
    </section>
  );
}

function Method({ data }: { data: Record<string, any> }) {
  const panels = [
    [getValue(data, "methodOneTitle"), getValue(data, "methodOneText")],
    [getValue(data, "methodTwoTitle"), getValue(data, "methodTwoText")],
    [getValue(data, "methodThreeTitle"), getValue(data, "methodThreeText")],
  ];

  return (
    <section data-template-section-type="process" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="t-display text-5xl font-bold uppercase leading-none text-white md:text-7xl">{getValue(data, "sectionFourTitle")}</h2>
        </Reveal>
        <div className="mt-12 flex flex-col gap-5 lg:flex-row">
          {panels.map(([title, text], index) => (
            <Reveal key={title} delayMs={index * 100} variant="up" className="flex-1">
              <article className="pulsefit-method-panel h-full border border-white/15 bg-[var(--surface)] p-8 lg:min-h-[300px]" style={{ clipPath: "polygon(0 0, 92% 0, 100% 100%, 8% 100%)" }}>
                <span className="t-display text-3xl md:text-6xl font-bold text-[var(--p)]">0{index + 1}</span>
                <h3 className="t-display mt-8 text-3xl font-bold uppercase text-white">{title}</h3>
                <p className="mt-4 text-sm font-semibold leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  const tiers = [
    [getValue(data, "priceOneName"), getValue(data, "priceOnePrice"), getValue(data, "priceOneText"), getValue(data, "priceOneFeatures")],
    [getValue(data, "priceTwoName"), getValue(data, "priceTwoPrice"), getValue(data, "priceTwoText"), getValue(data, "priceTwoFeatures")],
  ];

  return (
    <section id="pricing" data-template-section-type="pricing" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <h2 className="t-display text-5xl font-bold uppercase leading-none text-white md:text-7xl">{getValue(data, "sectionFiveTitle")}</h2>
            <p className="max-w-md text-sm font-semibold leading-7 text-[var(--muted)]">{getValue(data, "sectionFiveText")}</p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {tiers.map(([name, price, text, features], index) => (
            <Reveal key={name} delayMs={index * 120} variant={index === 0 ? "right" : "left"}>
              <article className={`min-h-[420px] border-2 p-8 md:p-10 ${index === 0 ? "border-white/20 bg-[var(--bg)]" : "border-[var(--p)] bg-[var(--p)] text-black"}`}>
                <p className="t-display text-2xl sm:text-4xl font-bold uppercase">{name}</p>
                <p className="t-display mt-8 text-3xl md:text-7xl font-bold uppercase">{price}</p>
                <p className={`mt-5 max-w-xl text-base font-semibold leading-8 ${index === 0 ? "text-[var(--muted)]" : "text-black/70"}`}>{text}</p>
                <div className={`mt-8 space-y-3 border-t pt-6 text-sm font-bold ${index === 0 ? "border-white/15 text-white" : "border-black/20 text-black"}`}>
                  {String(features).split("|").map((feature) => (
                    <p key={feature}>/ {feature}</p>
                  ))}
                </div>
                <button type="button" onClick={openModal} className={`mt-10 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] ${index === 0 ? "bg-[var(--p)] text-black" : "bg-black text-[var(--p)]"}`}>{getValue(data, "ctaButton")}</button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Transformations({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="showcase" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="t-display max-w-4xl text-5xl font-bold uppercase leading-none text-white md:text-7xl">{getValue(data, "sectionSixTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-0 border-2 border-[var(--p)] md:grid-cols-2">
          <Reveal variant="right">
            <figure className="relative min-h-[420px] overflow-hidden">
              <img src={getValue(data, "beforeImage")} alt="" className="h-full min-h-[420px] w-full object-cover grayscale" />
              <figcaption className="absolute right-0 top-0 bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.24em] text-[var(--p)]">{getValue(data, "beforeLabel")}</figcaption>
            </figure>
          </Reveal>
          <Reveal variant="left" delayMs={120}>
            <figure className="relative min-h-[420px] overflow-hidden border-t-2 border-[var(--p)] md:border-r-2 md:border-t-0">
              <img src={getValue(data, "afterImage")} alt="" className="h-full min-h-[420px] w-full object-cover" />
              <figcaption className="absolute right-0 top-0 bg-[var(--p)] px-5 py-3 text-xs font-black uppercase tracking-[0.24em] text-black">{getValue(data, "afterLabel")}</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName")],
  ];

  return (
    <section data-template-section-type="testimonials" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="t-display text-5xl font-bold uppercase leading-none text-white md:text-7xl">{getValue(data, "sectionSevenTitle")}</h2>
        </Reveal>
        <div className="mt-12 flex flex-col gap-5 md:flex-row">
          {reviews.map(([text, name], index) => (
            <Reveal key={name} delayMs={index * 100} variant="up" className="flex-1">
              <blockquote className="flex aspect-square flex-col justify-between border-2 border-[var(--p)] p-7">
                <p className="t-display text-2xl sm:text-4xl font-bold uppercase leading-tight text-[var(--p)]">"{text}"</p>
                <footer className="text-sm font-black uppercase tracking-[0.2em] text-white">{name}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StartForm({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section id="start" data-template-section-type="contact" className="bg-[var(--bg)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 border border-white/15 bg-black p-7 md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-[var(--p)]">{getValue(data, "sectionEightTitle")}</p>
          <h2 className="t-display mt-4 text-5xl font-bold uppercase leading-none text-white md:text-7xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-6 max-w-lg text-base font-semibold leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm font-bold text-white">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <form className="grid gap-4" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-id="pulsefit-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="border border-white/15 bg-[var(--surface)] px-5 py-4 text-right text-white outline-none focus:border-[var(--p)]" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
              <input className="border border-white/15 bg-[var(--surface)] px-5 py-4 text-right text-white outline-none focus:border-[var(--p)]" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
            </div>
            <input className="border border-white/15 bg-[var(--surface)] px-5 py-4 text-right text-white outline-none focus:border-[var(--p)]" placeholder="מטרה: חיטוב / כוח / כושר"  name="other" data-bizuply-form-field-id="other" />
            <textarea className="min-h-32 border border-white/15 bg-[var(--surface)] px-5 py-4 text-right text-white outline-none focus:border-[var(--p)]" placeholder="מה חייב להשתנות ב-90 הימים הקרובים?"  name="other_2" data-bizuply-form-field-id="other_2"></textarea>
            <button type="submit" onClick={openModal} className="bg-[var(--p)] px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-black">{getValue(data, "contactButton")}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="bg-[var(--p)] px-5 py-16 text-black lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
        <Reveal variant="right">
          <h2 className="t-display max-w-4xl text-5xl font-bold uppercase leading-none md:text-8xl">{getValue(data, "ctaTitle")}</h2>
          <p className="mt-5 max-w-2xl text-base font-bold text-black/70">{getValue(data, "ctaText")}</p>
        </Reveal>
        <Reveal variant="left" delayMs={100}>
          <button type="button" onClick={openModal} className="bg-black px-8 py-5 text-xs font-black uppercase tracking-[0.22em] text-[var(--p)]">{getValue(data, "ctaButton")}</button>
        </Reveal>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-3 border-t border-black/25 pt-6 text-xs font-bold uppercase tracking-[0.18em] md:flex-row">
        <p>© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
        <p>{getValue(data, "email")} · {getValue(data, "phone")}</p>
      </div>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md border-2 border-[var(--p)] bg-black p-8 text-white">
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl text-[var(--p)]">×</button>
        <h3 className="t-display text-2xl sm:text-4xl font-bold uppercase">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-id="pulsefit-contact-2" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
          <input className="border border-white/15 bg-[var(--surface)] px-5 py-4 text-right outline-none" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
          <input className="border border-white/15 bg-[var(--surface)] px-5 py-4 text-right outline-none" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
          <button type="submit" className="bg-[var(--p)] py-4 text-sm font-black uppercase text-black">{getValue(data, "contactButton")}</button>
        </form>
      </div>
    </div>
  );
}

function HomePage({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <>
      <Hero data={data} openModal={openModal} />
      <Programs data={data} />
      <Results data={data} />
      <Method data={data} />
      <Pricing data={data} openModal={openModal} />
      <Transformations data={data} />
      <Testimonials data={data} />
      <StartForm data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function PulsefitPages(props: PulsefitPagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...pulsefitDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "pulsefit-preview" : "pulsefit"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: pulsefitEditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
