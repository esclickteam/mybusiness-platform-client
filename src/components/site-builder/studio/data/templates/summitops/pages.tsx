import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { summitopsDefaultData } from "./defaultData";
import { summitopsEditorCss } from "./editorCss";

export const summitopsPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "cases", label: "פרויקטים", slug: "/cases" },
  { id: "team", label: "צוות", slug: "/team" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const allowedPages = summitopsPages.map((p) => p.id);

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
  return data?.[key] ?? (summitopsDefaultData as Record<string, any>)[key] ?? "";
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
    <header data-visual-flow-lock="true" data-template-section-type="header" className={`sticky top-0 z-50 border-b border-black/10 bg-[var(--surface)]/90 text-[var(--text)] backdrop-blur-xl`}>
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
          <button type="button" className={`grid h-11 w-11 place-items-center border border-black/10 lg:hidden`} onClick={() => setOpen((v) => !v)}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className={`border-t border-black/10 px-5 py-4 lg:hidden`}>
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
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_180px]">
        <Reveal variant="right" className="text-right">
          <div className="border border-black/10 bg-[var(--surface)] p-7 md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "aboutEyebrow")}</p>
            <h2 className="ag-display mt-5 max-w-4xl text-3xl font-extrabold leading-tight md:text-5xl">{getValue(data, "aboutTitle")}</h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--muted)]">{getValue(data, "aboutText")}</p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                ["01", getValue(data, "processOneTitle")],
                ["02", getValue(data, "processTwoTitle")],
                ["03", getValue(data, "processThreeTitle")],
              ].map(([num, label]) => (
                <div key={num} className="border-t border-black/10 pt-4">
                  <p className="ag-display text-3xl font-extrabold text-[var(--p)]">{num}</p>
                  <p className="mt-2 text-sm font-bold text-[var(--muted)]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal variant="left" className="lg:sticky lg:top-28 lg:self-start">
          <aside className="border border-black/10 bg-[var(--bg)] p-5 text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[var(--muted)]">Framework rail</p>
            <div className="mt-6 h-28 border-r-2 border-[var(--p)]" />
            <p className="ag-display mt-6 text-2xl font-extrabold text-[var(--p)]">{getValue(data, "brandName")}</p>
            <p className="mt-2 text-sm font-bold leading-6 text-[var(--muted)]">{getValue(data, "nicheLabel")}</p>
          </aside>
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
        
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*90} variant="up">
              <article className="ag-card border-r-4 border-r-[var(--p)] border border-black/10 bg-[var(--surface)] p-7 text-right">
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
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
    [getValue(data, "caseOneTitle"), getValue(data, "caseOneText")],
    [getValue(data, "caseTwoTitle"), getValue(data, "caseTwoText")],
    [getValue(data, "caseThreeTitle"), getValue(data, "caseThreeText")],
  ];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "casesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "casesTitle")}</h2>
        </Reveal>
        <div className="mt-12 overflow-hidden border border-black/10 bg-[var(--surface)]">
          <div className="hidden grid-cols-[1fr_1fr_1fr_80px] border-b border-black/10 px-6 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--muted)] md:grid">
            <span>Problem</span>
            <span>Recommendation</span>
            <span>Outcome</span>
            <span className="text-left">Ref</span>
          </div>
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90}>
              <article className="grid gap-5 border-b border-black/10 p-6 text-right last:border-b-0 md:grid-cols-[1fr_1fr_1fr_80px] md:items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--p)] md:hidden">Problem</p>
                  <h3 className="mt-2 text-2xl font-bold md:mt-0">{title}</h3>
                </div>
                <div className="border-r border-black/10 pr-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--p)] md:hidden">Recommendation</p>
                  <p className="mt-2 text-sm font-bold leading-7 text-[var(--text)] md:mt-0">מסגרת עבודה, בעלות ברורה וקצב החלטות שבועי.</p>
                </div>
                <div className="border-r border-black/10 pr-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--p)] md:hidden">Outcome</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)] md:mt-0">{text}</p>
                </div>
                <p className="ag-display text-left text-3xl font-extrabold text-[var(--p)]">0{i + 1}</p>
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
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "teamTitle")}</h2>
        </Reveal>
        <div className="mt-12 space-y-4">
          {items.map(([name, role, image], i) => (
            <Reveal key={name} delayMs={i * 90}>
              <article className="ag-card grid gap-5 border border-black/10 bg-[var(--bg)] p-4 text-right sm:grid-cols-[1fr_112px] sm:items-center">
                <div className="px-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--muted)]">Advisor 0{i + 1}</p>
                  <h3 className="mt-2 text-2xl font-bold">{name}</h3>
                  <p className="mt-2 text-sm font-semibold text-[var(--muted)]">{role}</p>
                </div>
                <div className="h-28 w-28 overflow-hidden border border-black/10 sm:justify-self-end">
                  <img src={image} alt="" className="h-full w-full object-cover" />
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
    <section className="px-5 py-14 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4 text-right">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "galleryEyebrow")}</p>
            <h2 className="ag-display mt-3 text-3xl font-extrabold md:text-5xl">{getValue(data, "galleryTitle")}</h2>
          </div>
          <span className="h-px flex-1 bg-black/10" />
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border-y border-black/10 py-3">
          {images.map((src, i) => (
            <Reveal key={src} delayMs={i * 70} variant="scale">
              <div className="overflow-hidden border border-black/10">
                <img src={src} alt="" className="h-32 w-full object-cover md:h-40" />
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
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "insightsTitle")}</h2>
        </Reveal>
        <div className="mt-12 border-y border-black/10">
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90}>
              <article className="ag-card grid gap-5 border-b border-black/10 bg-[var(--surface)] p-6 text-right last:border-b-0 md:grid-cols-[120px_1fr_auto] md:items-center">
                <p className="ag-display text-2xl md:text-5xl font-extrabold text-[var(--p)]">0{i + 1}</p>
                <div>
                  <h3 className="text-2xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{text}</p>
                </div>
                <button type="button" onClick={() => goTo("contact")} className="border border-black/10 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-[var(--p)]">Playbook</button>
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
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_220px]">
        <div>
          <Reveal className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
            <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "processTitle")}</h2>
          </Reveal>
          <div className="mt-12 space-y-4">
            {steps.map(([title, text], i) => (
              <Reveal key={title} delayMs={i * 80}>
                <article className="ag-card grid gap-4 border border-black/10 bg-[var(--bg)] p-6 text-right md:grid-cols-[90px_1fr] md:items-start">
                  <p className="ag-display text-2xl sm:text-4xl font-extrabold text-[var(--p)]">0{i + 1}</p>
                  <div>
                    <h3 className="text-2xl font-bold">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal variant="left" className="lg:sticky lg:top-28 lg:self-start">
          <aside className="border-l-2 border-[var(--p)] py-2 pr-6 text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">Phases</p>
            <div className="mt-8 space-y-8">
              {steps.map(([title], i) => (
                <div key={title} className="relative">
                  <span className="absolute -left-[7px] top-1 h-3 w-3 bg-[var(--p)]" />
                  <p className="ag-display text-2xl font-extrabold">0{i + 1}</p>
                  <p className="mt-1 text-sm font-bold text-[var(--muted)]">{title}</p>
                </div>
              ))}
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}

function Contact({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-5xl border border-black/10 bg-[var(--surface)] p-4">
        <div className="grid gap-8 border border-black/10 p-6 md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal variant="right" className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
            <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">Schedule a working session</h2>
            <p className="mt-5 text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
            <div className="mt-8 space-y-2 border-t border-black/10 pt-6 text-sm font-bold">
              <p>{getValue(data, "phone")}</p>
              <p>{getValue(data, "email")}</p>
              <p>{getValue(data, "address")}</p>
            </div>
          </Reveal>
          <Reveal variant="left" delayMs={100}>
            <form className="grid gap-3" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-skin="template" data-bizuply-form-id="summitops-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
              <input className="border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
              <input className="border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
              <input className="border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="חברה / תחום"  name="company" data-bizuply-form-field-id="company" />
              <textarea className="min-h-32 border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="מה נרצה לפתור בפגישה?"  name="other" data-bizuply-form-field-id="other"></textarea>
              <button type="submit" className="bg-[var(--p)] px-6 py-4 text-sm font-black text-white">{getValue(data, "contactButton")}</button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const links = summitopsPages.filter((p) => p.id !== "home");
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
    <section className="border-b border-black/10 px-5 py-16 lg:px-8 lg:py-24">
      <Reveal className="mx-auto grid max-w-7xl gap-8 text-right lg:grid-cols-[1fr_180px]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "brandName")}</p>
          <h1 className="ag-display mt-4 max-w-4xl text-4xl font-extrabold md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
        </div>
        <aside className="border-r-2 border-[var(--p)] pr-5">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">Rail</p>
          <p className="mt-4 text-sm font-bold leading-7 text-[var(--text)]">{getValue(data, "nicheLabel")}</p>
        </aside>
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
    <section data-template-section-type="hero" className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal variant="right" className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-4 text-4xl font-extrabold leading-tight md:text-6xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("process")} className="border border-[var(--p)] px-8 py-4 text-sm font-black text-[var(--p)]">לתהליך</button>
          </div>
        </Reveal>
        <div className="space-y-4">
          {stats.map(([v,l],i)=>(
            <Reveal key={l} delayMs={i*90} className="ag-card flex items-center gap-6 border border-black/10 bg-[var(--surface)] p-6">
              <span className="ag-display text-2xl md:text-5xl font-extrabold text-[var(--p)]">0{i+1}</span>
              <div className="text-right">
                <p className="ag-display text-3xl font-extrabold">{v}</p>
                <p className="mt-1 text-sm font-bold text-[var(--muted)]">{l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section></>);
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} />
      <Process data={data} />
      <Services data={data} goTo={goTo} />
      <About data={data} />
      <Cases data={data} />
      <Team data={data} />
      <Insights data={data} goTo={goTo} />
      <GalleryStrip data={data} />
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
    about: (<><About data={data} /><Process data={data} /><Team data={data} /><GalleryStrip data={data} /></>),
    services: (<><Services data={data} goTo={goTo} /><Process data={data} /><Cases data={data} /><Contact data={data} /></>),
    cases: (<><Cases data={data} /><Insights data={data} goTo={goTo} /><GalleryStrip data={data} /><Contact data={data} /></>),
    team: (<><Team data={data} /><About data={data} /><Insights data={data} goTo={goTo} /><Contact data={data} /></>),
    insights: (<><Insights data={data} goTo={goTo} /><Process data={data} /><Cases data={data} /><Contact data={data} /></>),
    process: (<><Process data={data} /><Services data={data} goTo={goTo} /><About data={data} /><Contact data={data} /></>),
    contact: (<><Contact data={data} /><Process data={data} /><GalleryStrip data={data} /></>),
  };
  return (
    <>
      <PageHero data={data} title={titles[type] || getValue(data, "brandName")} />
      {map[type] ?? null}
      <Footer data={data} goTo={goTo} />
    </>
  );
}

export default function SummitopsPages({
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
  const mergedData = useMemo(() => ({ ...summitopsDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id="summitops" className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: summitopsEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} goTo={goTo} /> },
          ...summitopsPages.filter((p) => p.id !== "home").map((p) => ({
            id: p.id,
            content: <InnerPage data={mergedData} type={p.id} goTo={goTo} />,
          })),
        ]}
      />
    </div>
  );
}
