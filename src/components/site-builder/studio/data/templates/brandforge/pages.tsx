import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { brandforgeDefaultData } from "./defaultData";
import { brandforgeEditorCss } from "./editorCss";

export const brandforgePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "cases", label: "פרויקטים", slug: "/cases" },
  { id: "team", label: "צוות", slug: "/team" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const allowedPages = brandforgePages.map((p) => p.id);

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
  return data?.[key] ?? (brandforgeDefaultData as Record<string, any>)[key] ?? "";
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
      <div className="mx-auto grid max-w-7xl border border-black/10 bg-[var(--surface)] lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal variant="right" className="bg-[var(--dark)] p-8 text-right text-white md:p-12 lg:min-h-[520px]">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--accent)]">{getValue(data, "aboutEyebrow")}</p>
          <h2 className="ag-display mt-8 max-w-3xl text-5xl font-extrabold leading-[0.92] md:text-7xl">{getValue(data, "aboutTitle")}</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3">
            <span className="h-24 bg-[var(--accent)]" />
            <span className="h-24 border border-white/20" />
            <span className="h-24 bg-white" />
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={90} className="grid">
          <div className="border-b border-black/10 p-4">
            <img src={getValue(data, "aboutImage")} alt="" className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="grid bg-[var(--accent)] p-8 text-right text-[var(--dark)] md:p-10">
            <p className="max-w-xl self-end text-lg font-bold leading-9">{getValue(data, "aboutText")}</p>
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
        
        <div className="mt-12 grid gap-3 md:grid-cols-2">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*80}>
              <article className={`ag-card min-h-[200px] p-8 text-right ${i%2===0?"bg-[var(--dark)] text-white":"bg-[var(--accent)] text-[var(--dark)]"}`}>
                <h3 className="ag-display text-3xl font-extrabold">{title}</h3>
                <p className="mt-4 text-sm leading-7 opacity-80">{text}</p>
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
  const bars = ["bg-[var(--p)]", "bg-[var(--accent)]", "bg-[var(--dark)]"];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-4 border-y border-black/10 py-8 text-right md:grid-cols-[0.35fr_1fr]">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "casesEyebrow")}</p>
          <h2 className="ag-display text-4xl font-extrabold leading-none md:text-6xl">{getValue(data, "casesTitle")}</h2>
        </Reveal>
        <div className="mt-10 grid gap-6">
          {items.map(([title, text, image], i) => (
            <Reveal key={title} delayMs={i * 90} variant="up">
              <article className="ag-card grid overflow-hidden border border-black/10 bg-[var(--surface)] text-right md:grid-cols-[14px_0.85fr_1.15fr]">
                <span className={bars[i % bars.length]} />
                <div className="p-5">
                  <img src={image} alt="" className="aspect-[4/3] w-full border border-black/10 object-cover" />
                </div>
                <div className="flex flex-col justify-between border-t border-black/10 p-7 md:border-r md:border-t-0 md:p-10">
                  <div>
                    <p className="ag-display text-3xl md:text-7xl font-extrabold leading-none text-[var(--dark)]/10">0{i + 1}</p>
                    <h3 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{title}</h3>
                  </div>
                  <p className="mt-8 max-w-xl text-base font-semibold leading-8 text-[var(--muted)]">{text}</p>
                </div>
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
        <Reveal className="max-w-4xl text-right">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "teamEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-extrabold leading-none md:text-7xl">{getValue(data, "teamTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(([name, role, image], i) => (
            <Reveal key={name} delayMs={i * 90} variant="scale">
              <article className="ag-card relative overflow-hidden border border-black/10 bg-[var(--bg)] p-5 text-right">
                <span className="ag-display pointer-events-none absolute -left-4 top-2 text-[12rem] font-extrabold leading-none text-[var(--dark)]/5 md:text-[15rem]">{Array.from(String(name))[0] ?? ""}</span>
                <div className="relative aspect-[4/5] overflow-hidden border border-black/10 bg-[var(--surface)]">
                  <img src={image} alt="" className="h-full w-full object-cover grayscale transition duration-500 hover:grayscale-0" />
                </div>
                <div className="relative mt-5 border-t-4 border-[var(--dark)] pt-4">
                  <h3 className="ag-display text-3xl font-extrabold">{name}</h3>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.24em] text-[var(--p)]">{role}</p>
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
    <section className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-black/10 pb-6 text-right">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "galleryEyebrow")}</p>
            <h2 className="ag-display mt-3 text-4xl font-extrabold md:text-6xl">{getValue(data, "galleryTitle")}</h2>
          </div>
          <p className="ag-display text-2xl md:text-5xl font-extrabold text-[var(--accent)]">01-04</p>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {images.map((src, i) => (
            <Reveal key={src} delayMs={i * 70} variant="scale">
              <div className="relative aspect-square overflow-hidden border-4 border-black/10 bg-[var(--surface)]">
                <img src={src} alt="" className="h-full w-full object-cover mix-blend-multiply" />
                <div className="absolute inset-4 border-2 border-[var(--dark)]" />
                <span className="ag-display absolute bottom-4 right-4 bg-[var(--dark)] px-3 py-1 text-sm font-extrabold text-white">BF-0{i + 1}</span>
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
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "insightsEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-extrabold md:text-6xl">{getValue(data, "insightsTitle")}</h2>
        </Reveal>
        <div className="mt-10 grid gap-0 border-t border-black/10">
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90}>
              <article className="ag-card grid gap-5 border-b border-black/10 bg-[var(--surface)] p-7 text-right md:grid-cols-[120px_1fr_0.8fr] md:items-center md:p-10">
                <p className="ag-display text-3xl md:text-8xl font-extrabold leading-none text-[var(--accent)]">"</p>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--muted)]">PRINCIPLE 0{i + 1}</p>
                  <h3 className="ag-display mt-3 text-3xl font-extrabold md:text-5xl">{title}</h3>
                </div>
                <div>
                  <p className="text-base font-semibold leading-8 text-[var(--muted)]">{text}</p>
                  <button type="button" onClick={() => goTo("contact")} className="mt-5 border-b-2 border-[var(--p)] text-sm font-black text-[var(--p)]">ליישום במותג</button>
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
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    [getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];
  return (
    <section className="bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-6 text-right lg:grid-cols-[0.7fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
            <h2 className="ag-display mt-4 text-4xl font-extrabold leading-none md:text-6xl">{getValue(data, "processTitle")}</h2>
          </div>
          <p className="text-sm font-bold leading-7 text-[var(--muted)]">מערכת מותג נבנית ברצף של החלטות ברורות: מחקר, ניסוח, עיצוב והטמעה.</p>
        </Reveal>
        <div className="mt-12 grid border border-black/10 md:grid-cols-2">
          {steps.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 80} variant="up">
              <article className={`ag-card min-h-[280px] border-black/10 p-8 text-right md:p-10 ${i === 0 || i === 3 ? "bg-[var(--dark)] text-white" : "bg-[var(--bg)] text-[var(--dark)]"}`}>
                <p className={`ag-display text-8xl font-extrabold leading-none ${i === 0 || i === 3 ? "text-white/20" : "text-[var(--accent)]"}`}>0{i + 1}</p>
                <h3 className="ag-display mt-6 text-2xl sm:text-4xl font-extrabold">{title}</h3>
                <p className={`mt-4 text-sm font-semibold leading-7 ${i === 0 || i === 3 ? "text-white/70" : "text-[var(--muted)]"}`}>{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl border border-black/10 bg-[var(--surface)]">
        <Reveal variant="right" className="border-b border-black/10 p-6 text-right md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="ag-display mt-4 break-words text-6xl font-extrabold leading-[0.82] md:text-9xl lg:text-[10rem]">Contact</h2>
        </Reveal>
        <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal variant="right" className="bg-[var(--accent)] p-6 text-right text-[var(--dark)] md:p-10">
            <h3 className="ag-display text-3xl font-extrabold">{getValue(data, "contactTitle")}</h3>
            <p className="mt-5 text-base font-bold leading-8">{getValue(data, "contactText")}</p>
            <div className="mt-10 grid gap-3 text-sm font-black">
              <p>{getValue(data, "phone")}</p>
              <p>{getValue(data, "email")}</p>
              <p>{getValue(data, "address")}</p>
            </div>
          </Reveal>
          <Reveal variant="left" delayMs={100}>
            <form className="grid gap-0" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-skin="template" data-bizuply-form-id="brandforge-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
              <input className="border-b border-black/10 bg-[var(--bg)] px-5 py-5 text-right text-sm font-bold outline-none" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
              <input className="border-b border-black/10 bg-[var(--bg)] px-5 py-5 text-right text-sm font-bold outline-none" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
              <input className="border-b border-black/10 bg-[var(--bg)] px-5 py-5 text-right text-sm font-bold outline-none" placeholder="חברה / תחום"  name="company" data-bizuply-form-field-id="company" />
              <textarea className="min-h-36 border-b border-black/10 bg-[var(--bg)] px-5 py-5 text-right text-sm font-bold outline-none" placeholder="במה נוכל לעזור?"  name="message" data-bizuply-form-field-id="message"></textarea>
              <button type="submit" className="bg-[var(--dark)] px-6 py-5 text-sm font-black uppercase tracking-[0.18em] text-white">{getValue(data, "contactButton")}</button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const links = brandforgePages.filter((p) => p.id !== "home");
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
    <section className="border-b border-black/10 px-5 py-14 lg:px-8 lg:py-20">
      <Reveal className="mx-auto grid max-w-7xl overflow-hidden border border-black/10 text-right md:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-[var(--dark)] p-8 text-white md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--accent)]">{getValue(data, "brandName")} · {getValue(data, "nicheLabel")}</p>
          <h1 className="ag-display mt-8 max-w-4xl text-5xl font-extrabold leading-[0.9] md:text-8xl">{title}</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="bg-[var(--accent)] p-6 text-[var(--dark)]">
            <p className="ag-display text-2xl md:text-5xl font-extrabold">TYPE</p>
            <p className="mt-4 text-sm font-bold leading-7">{getValue(data, "heroSubtitle")}</p>
          </div>
          <div className="grid">
            <span className="bg-[var(--p)]" />
            <span className="border-t border-black/10 bg-[var(--bg)]" />
          </div>
        </div>
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
    <section data-template-section-type="hero" className="px-5 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="grid gap-3 md:grid-cols-12">
            <div className="bg-[var(--dark)] p-8 text-white md:col-span-7 md:min-h-[420px] md:p-12">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--accent)]">{getValue(data, "heroEyebrow")}</p>
              <h1 className="ag-display mt-6 text-5xl font-extrabold leading-[0.95] md:text-7xl">{getValue(data, "heroTitle")}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/70">{getValue(data, "heroSubtitle")}</p>
              <button type="button" onClick={() => goTo("contact")} className="mt-8 bg-[var(--accent)] px-8 py-4 text-sm font-black text-[var(--dark)]">{getValue(data, "heroPrimaryButton")}</button>
            </div>
            <div className="grid gap-3 md:col-span-5">
              <img src={getValue(data, "heroImage")} alt="" className="aspect-[4/3] w-full object-cover" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stats.slice(0,2).map(([v,l])=>(
                  <div key={l} className="bg-[var(--accent)] p-5 text-center text-[var(--dark)]">
                    <p className="ag-display text-3xl font-extrabold">{v}</p>
                    <p className="mt-1 text-xs font-bold">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section></>);
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} />
      <About data={data} />
      <GalleryStrip data={data} />
      <Services data={data} goTo={goTo} />
      <Cases data={data} />
      <Team data={data} />
      <Process data={data} />
      <Insights data={data} goTo={goTo} />
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
    about: (<><About data={data} /><GalleryStrip data={data} /><Team data={data} /><Contact data={data} /></>),
    services: (<><Services data={data} goTo={goTo} /><Process data={data} /><Cases data={data} /><Contact data={data} /></>),
    cases: (<><Cases data={data} /><GalleryStrip data={data} /><Insights data={data} goTo={goTo} /><Contact data={data} /></>),
    team: (<><Team data={data} /><Process data={data} /><About data={data} /><Contact data={data} /></>),
    insights: (<><Insights data={data} goTo={goTo} /><Cases data={data} /><GalleryStrip data={data} /><Contact data={data} /></>),
    process: (<><Process data={data} /><Services data={data} goTo={goTo} /><Insights data={data} goTo={goTo} /><Contact data={data} /></>),
    contact: (<><Contact data={data} /><About data={data} /><Team data={data} /></>),
  };
  return (
    <>
      <PageHero data={data} title={titles[type] || getValue(data, "brandName")} />
      {map[type] ?? null}
      <Footer data={data} goTo={goTo} />
    </>
  );
}

export default function BrandforgePages({
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
  const mergedData = useMemo(() => ({ ...brandforgeDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id="brandforge" className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: brandforgeEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} goTo={goTo} /> },
          ...brandforgePages.filter((p) => p.id !== "home").map((p) => ({
            id: p.id,
            content: <InnerPage data={mergedData} type={p.id} goTo={goTo} />,
          })),
        ]}
      />
    </div>
  );
}
