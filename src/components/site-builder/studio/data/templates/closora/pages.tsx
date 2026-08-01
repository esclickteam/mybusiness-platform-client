import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { closoraDefaultData } from "./defaultData";
import { closoraEditorCss } from "./editorCss";

export const closoraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "cases", label: "פרויקטים", slug: "/cases" },
  { id: "team", label: "צוות", slug: "/team" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const allowedPages = closoraPages.map((p) => p.id);

type Props = {
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
  return data?.[key] ?? (closoraDefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const nav = [
    ["home", getValue(data, "navHome")],
    ["about", getValue(data, "navAbout")],
    ["services", getValue(data, "navServices")],
    ["cases", getValue(data, "navCases")],
    ["team", getValue(data, "navTeam")],
    ["insights", getValue(data, "navInsights")],
    ["process", getValue(data, "navProcess")],
    ["contact", getValue(data, "navContact")],
  ];
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className={`sticky top-0 z-50 border-b border-white/15 bg-[var(--dark)]/85 text-white backdrop-blur-xl`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="text-right">
          <div className="flex items-center gap-3">
            <span className="ag-pulse grid h-10 w-10 place-items-center bg-[var(--p)] text-sm font-black text-white">{getValue(data, "logoText")}</span>
            <div>
              <p className="ag-display text-xl font-extrabold leading-none">{getValue(data, "brandName")}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">{getValue(data, "tagline")}</p>
            </div>
          </div>
        </button>
        <nav className="hidden items-center gap-4 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className={`text-xs font-bold uppercase tracking-[0.12em] transition ${currentPage === id ? "text-[var(--p)]" : "opacity-70 hover:opacity-100"}`}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => goTo("contact")} className="hidden bg-[var(--p)] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white md:inline-flex">{getValue(data, "heroPrimaryButton")}</button>
          <button type="button" className={`grid h-11 w-11 place-items-center border border-white/15 lg:hidden`} onClick={() => setOpen((v) => !v)}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className={`border-t border-white/15 px-5 py-4 lg:hidden`}>
          <div className="grid gap-2">
            {nav.map(([id, label]) => (
              <button key={id} type="button" onClick={() => { goTo(id); setOpen(false); }} className="py-2 text-right text-sm font-bold">{label}</button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function About({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_220px] lg:items-stretch">
        <Reveal variant="right" className="border-y border-white/15 py-8 text-right lg:py-12">
          <p className="ag-display text-6xl font-extrabold uppercase leading-none text-[var(--p)] opacity-90 md:text-8xl">{getValue(data, "aboutEyebrow")}</p>
          <h2 className="ag-display mt-6 max-w-4xl text-4xl font-extrabold uppercase leading-[0.95] md:text-6xl">{getValue(data, "aboutTitle")}</h2>
          <p className="mt-7 max-w-2xl text-lg font-bold leading-8 text-[var(--muted)]">{getValue(data, "aboutText")}</p>
          <div className="mt-8 grid gap-3 text-xs font-black uppercase tracking-[0.24em] text-white/70 sm:grid-cols-3">
            <span className="border border-white/15 px-4 py-3">No fluff</span>
            <span className="border border-white/15 px-4 py-3">Daily score</span>
            <span className="border border-white/15 px-4 py-3">Close faster</span>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={120}>
          <div className="h-full min-h-[430px] overflow-hidden border border-white/15 bg-[var(--surface)] p-3">
            <img src={getValue(data, "aboutImage")} alt="" className="h-full min-h-[400px] w-full object-cover grayscale contrast-125" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Services({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const services = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
  ];
  return (
    <section className="bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "servicesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "servicesTitle")}</h2>
        </Reveal>
        
        <div className="mt-12 space-y-3">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*80}>
              <article className="ag-card grid gap-4 border border-white/15 bg-[var(--surface)] p-5 md:grid-cols-[80px_1fr_auto] md:items-center">
                <span className="ag-display text-2xl sm:text-4xl font-extrabold text-[var(--accent)]">0{i+1}</span>
                <div className="text-right"><h3 className="text-2xl font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></div>
                <button type="button" onClick={() => goTo("contact")} className="border border-[var(--p)] px-4 py-2 text-xs font-black text-[var(--p)]">GO</button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cases({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "caseOneTitle"), getValue(data, "caseOneText"), getValue(data, "caseOneImage")],
    [getValue(data, "caseTwoTitle"), getValue(data, "caseTwoText"), getValue(data, "caseTwoImage")],
    [getValue(data, "caseThreeTitle"), getValue(data, "caseThreeText"), getValue(data, "caseThreeImage")],
  ];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col gap-4 border-b border-white/15 pb-7 text-right md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">WINS / {getValue(data, "casesEyebrow")}</p>
            <h2 className="ag-display mt-3 text-4xl font-extrabold uppercase md:text-6xl">{getValue(data, "casesTitle")}</h2>
          </div>
          <span className="ag-display text-2xl md:text-5xl font-extrabold text-white/15">CLOSED</span>
        </Reveal>
        <div className="mt-8 space-y-4">
          {items.map(([title, text, image], i) => (
            <Reveal key={title} delayMs={i * 90} variant="up">
              <article className="ag-card grid gap-4 border border-white/15 bg-[var(--surface)] p-3 text-right md:grid-cols-[120px_1fr_150px] md:items-center">
                <div className="flex h-full items-center justify-center bg-[var(--p)] px-4 py-5">
                  <span className="ag-display text-xl font-extrabold uppercase tracking-[0.12em] text-white">Closed</span>
                </div>
                <div className="px-2 py-3">
                  <p className="ag-display text-2xl md:text-5xl font-extrabold text-white/10">0{i + 1}</p>
                  <h3 className="-mt-4 text-2xl font-black uppercase">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{text}</p>
                </div>
                <img src={image} alt="" className="h-28 w-full object-cover md:h-24" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "teamOneName"), getValue(data, "teamOneRole"), getValue(data, "teamOneImage")],
    [getValue(data, "teamTwoName"), getValue(data, "teamTwoRole"), getValue(data, "teamTwoImage")],
    [getValue(data, "teamThreeName"), getValue(data, "teamThreeRole"), getValue(data, "teamThreeImage")],
  ];
  return (
    <section className="bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "teamEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-extrabold uppercase md:text-6xl">{getValue(data, "teamTitle")}</h2>
        </Reveal>
        <div className="mt-10 space-y-4">
          {items.map(([name, role, image], i) => (
            <Reveal key={name} delayMs={i * 90} variant="right">
              <article dir="ltr" className="ag-card grid gap-5 border border-white/15 bg-[var(--bg)] p-4 md:grid-cols-[140px_minmax(0,1fr)_110px] md:items-center">
                <img src={image} alt="" className="h-32 w-full object-cover md:h-36" />
                <div dir="rtl" className="text-right">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--accent)]">Rank #{i + 1}</p>
                  <h3 className="mt-2 text-2xl font-black">{name}</h3>
                  <p className="mt-1 text-sm font-bold text-[var(--muted)]">{role}</p>
                  <div className="mt-5 h-3 overflow-hidden bg-white/10">
                    <div className="h-full bg-[var(--p)]" style={{ width: `${92 - i * 13}%` }} />
                  </div>
                </div>
                <div className="ag-display text-center text-3xl md:text-6xl font-extrabold text-white/15">
                  #{i + 1}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryStrip({ data }: { data: Record<string, any> }) {
  const images = [
    getValue(data, "galleryOneImage"),
    getValue(data, "galleryTwoImage"),
    getValue(data, "galleryThreeImage"),
    getValue(data, "galleryFourImage"),
  ];
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-8 flex flex-col gap-3 text-right md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "galleryEyebrow") || "Deal room"}</p>
            <h2 className="ag-display mt-3 text-3xl font-extrabold uppercase md:text-5xl">{getValue(data, "galleryTitle") || "ארבעה רגעים לפני סגירה"}</h2>
          </div>
          <span className="text-xs font-black uppercase tracking-[0.24em] text-[var(--muted)]">Pipeline evidence</span>
        </Reveal>
        <div className="grid gap-3">
          {images.map((src, i) => (
            <Reveal key={src} delayMs={i * 70} variant="right">
              <div className="grid overflow-hidden border border-white/15 bg-[var(--surface)] md:grid-cols-[1fr_120px] md:items-center">
                <img src={src} alt="" className="h-24 w-full object-cover md:h-28" />
                <div className="ag-display bg-[var(--bg)] px-5 py-4 text-3xl font-extrabold text-[var(--p)]">0{i + 1}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Insights({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const items = [
    [getValue(data, "insightOneTitle"), getValue(data, "insightOneText")],
    [getValue(data, "insightTwoTitle"), getValue(data, "insightTwoText")],
    [getValue(data, "insightThreeTitle"), getValue(data, "insightThreeText")],
  ];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "insightsEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-extrabold uppercase md:text-6xl">{getValue(data, "insightsTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90}>
              <article className={`ag-card border border-white/15 bg-[var(--surface)] p-7 text-right ${i === 2 ? "md:col-span-2" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full border border-[var(--p)] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[var(--p)]">Battle card</span>
                  <span className="ag-display text-2xl md:text-5xl font-extrabold text-white/10">0{i + 1}</span>
                </div>
                <h3 className="mt-8 text-2xl font-black uppercase">{title}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">{text}</p>
                <button type="button" onClick={() => goTo("contact")} className="mt-6 bg-[var(--p)] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white">Use this card</button>
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
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    [getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];
  return (
    <section className="bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-extrabold uppercase md:text-6xl">{getValue(data, "processTitle")}</h2>
        </Reveal>
        <div className="mt-12 overflow-x-auto pb-4">
          <div className="grid min-w-[900px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-white/15 bg-[var(--bg)]">
          {steps.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 80} variant="up">
              <article className="relative h-full border-l border-white/15 p-6 text-right last:border-l-0">
                <div className="mb-8 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center bg-[var(--p)] text-sm font-black text-white">0{i + 1}</span>
                  <span className="h-px flex-1 bg-[var(--p)]/60" />
                  {i < steps.length - 1 ? <span className="ag-display text-2xl font-extrabold text-[var(--p)]">→</span> : null}
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--accent)]">{i === 0 ? "Lead" : i === 1 ? "Qualify" : i === 2 ? "Close" : "Expand"}</p>
                <h3 className="mt-3 text-2xl font-black uppercase">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-6 border border-white/15 bg-[var(--surface)] p-4 md:p-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal variant="right" className="text-right">
          <div className="h-full bg-[var(--bg)] p-7 md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
            <h2 className="ag-display mt-4 text-4xl font-extrabold uppercase leading-none md:text-7xl">{getValue(data, "contactTitle")}</h2>
            <p className="mt-6 text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
            <a href={`tel:${getValue(data, "phone")}`} className="ag-display mt-8 block text-5xl font-extrabold text-[var(--p)] md:text-8xl">{getValue(data, "phone")}</a>
            <div className="mt-8 grid gap-2 text-sm font-bold text-white/75">
              <p>{getValue(data, "email")}</p>
              <p>{getValue(data, "address")}</p>
            </div>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={100}>
          <form className="grid gap-3 border border-white/15 bg-[var(--bg)] p-4" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-id="closora-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
            <input className={`border border-white/15 bg-[var(--bg)] px-4 py-4 text-right outline-none`} placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
            <input className={`border border-white/15 bg-[var(--bg)] px-4 py-4 text-right outline-none`} placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
            <input className={`border border-white/15 bg-[var(--bg)] px-4 py-4 text-right outline-none`} placeholder="חברה / תחום"  name="company" data-bizuply-form-field-id="company" />
            <textarea className={`min-h-32 border border-white/15 bg-[var(--bg)] px-4 py-4 text-right outline-none`} placeholder="במה נוכל לעזור?"  name="message" data-bizuply-form-field-id="message"></textarea>
            <button type="submit" className="bg-[var(--p)] px-6 py-4 text-sm font-black text-white">{getValue(data, "contactButton")}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const links = closoraPages.filter((p) => p.id !== "home");
  return (
    <footer className="bg-[var(--dark)] px-5 py-16 text-white lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <Reveal>
          <p className="ag-display text-4xl font-extrabold md:text-6xl">{getValue(data, "brandName")}</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-2xl font-bold md:text-4xl">{getValue(data, "ctaTitle")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70">{getValue(data, "ctaText")}</p>
          <button type="button" onClick={() => goTo("contact")} className="ag-pulse mt-8 bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "ctaButton")}</button>
        </Reveal>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {links.map((p) => (
            <button key={p.id} type="button" onClick={() => goTo(p.id)} className="border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/80">{p.label}</button>
          ))}
        </div>
        <p className="mt-10 text-xs text-white/50">© {new Date().getFullYear()} {getValue(data, "brandName")} · {getValue(data, "footerText")}</p>
      </div>
    </footer>
  );
}

function PageHero({ data, title }: { data: Record<string, any>; title: string }) {
  return (
    <section className="relative overflow-hidden border-b border-white/15 bg-[var(--dark)]">
      <div className="absolute left-8 top-0 h-full w-28 -skew-x-12 bg-[var(--p)]/35" />
      <div className="absolute left-28 top-0 h-full w-4 -skew-x-12 bg-[var(--accent)]" />
      <Reveal className="relative z-10 mx-auto max-w-7xl px-5 py-16 text-right lg:px-8 lg:py-24">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "brandName")} / {getValue(data, "nicheLabel")}</p>
        <h1 className="ag-display mt-4 max-w-5xl text-5xl font-extrabold uppercase leading-[0.9] md:text-8xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-base font-bold leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
      </Reveal>
    </section>
  );
}

function Hero({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const stats = [
    [getValue(data, "statOne"), getValue(data, "statOneLabel")],
    [getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
    [getValue(data, "statThree"), getValue(data, "statThreeLabel")],
    [getValue(data, "statFour"), getValue(data, "statFourLabel")],
  ];
  return (<>
    <section data-template-section-type="hero" className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rotate-12 bg-[var(--p)]/30 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--accent)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-4 text-5xl font-extrabold uppercase leading-[0.9] md:text-7xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("cases")} className="border border-[var(--p)] px-8 py-4 text-sm font-black">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={100}>
          <div className="space-y-3">
            {stats.map(([v,l],i)=>(
              <div key={l} className="ag-card flex items-center justify-between border border-white/15 bg-[var(--surface)] px-5 py-4">
                <span className="text-sm font-bold text-[var(--muted)]">#{i+1} {l}</span>
                <span className="ag-display text-3xl font-extrabold text-[var(--accent)]">{v}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section></>);
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} />
      <Cases data={data} />
      <Services data={data} goTo={goTo} />
      <Team data={data} />
      <Process data={data} />
      <Insights data={data} goTo={goTo} />
      <GalleryStrip data={data} />
      <About data={data} />
      <Contact data={data} />
      <Footer data={data} goTo={goTo} />
    </>
  );
}

function InnerPage({ data, type, goTo }: { data: Record<string, any>; type: string; goTo: (id: string) => void }) {
  const titles: Record<string, string> = {
    about: getValue(data, "navAbout"),
    services: getValue(data, "navServices"),
    cases: getValue(data, "navCases"),
    team: getValue(data, "navTeam"),
    insights: getValue(data, "navInsights"),
    process: getValue(data, "navProcess"),
    contact: getValue(data, "navContact"),
  };
  const map: Record<string, React.ReactNode> = {
    about: (<><About data={data} /><Team data={data} /><Process data={data} /><Contact data={data} /></>),
    services: (<><Services data={data} goTo={goTo} /><Cases data={data} /><Insights data={data} goTo={goTo} /><Contact data={data} /></>),
    cases: (<><Cases data={data} /><GalleryStrip data={data} /><Team data={data} /><Contact data={data} /></>),
    team: (<><Team data={data} /><Cases data={data} /><About data={data} /><Contact data={data} /></>),
    insights: (<><Insights data={data} goTo={goTo} /><Process data={data} /><Cases data={data} /><Contact data={data} /></>),
    process: (<><Process data={data} /><Cases data={data} /><Services data={data} goTo={goTo} /><Contact data={data} /></>),
    contact: (<><Contact data={data} /><Cases data={data} /><GalleryStrip data={data} /></>),
  };
  return (
    <>
      <PageHero data={data} title={titles[type] || getValue(data, "brandName")} />
      {map[type] ?? null}
      <Footer data={data} goTo={goTo} />
    </>
  );
}

export default function ClosoraPages({
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
}: Props) {
  const mergedData = useMemo(() => ({ ...closoraDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "closora-preview" : "closora"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: closoraEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} goTo={goTo} /> },
          ...closoraPages.filter((p) => p.id !== "home").map((p) => ({
            id: p.id,
            content: <InnerPage data={mergedData} type={p.id} goTo={goTo} />,
          })),
        ]}
      />
    </div>
  );
}
