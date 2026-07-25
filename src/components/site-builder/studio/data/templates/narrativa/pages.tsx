import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { narrativaDefaultData } from "./defaultData";
import { narrativaEditorCss } from "./editorCss";

export const narrativaPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "cases", label: "פרויקטים", slug: "/cases" },
  { id: "team", label: "צוות", slug: "/team" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const allowedPages = narrativaPages.map((p) => p.id);

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
  return data?.[key] ?? (narrativaDefaultData as Record<string, any>)[key] ?? "";
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
  const aboutText = String(getValue(data, "aboutText"));
  const firstLetter = aboutText.slice(0, 1);
  const restText = aboutText.slice(1);
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="border-y border-black/10 py-4 text-center">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--p)]">{getValue(data, "aboutEyebrow")}</p>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.78fr] lg:items-start">
          <Reveal variant="right" className="text-right">
            <h2 className="ag-display text-4xl font-bold leading-tight md:text-6xl">{getValue(data, "aboutTitle")}</h2>
            <p className="mt-8 text-lg leading-9 text-[var(--muted)]">
              <span className="ag-display ml-3 inline-block align-top text-7xl font-bold leading-none text-[var(--p)]">{firstLetter}</span>
              {restText}
            </p>
            <div className="mt-8 grid gap-4 border-y border-black/10 py-5 sm:grid-cols-2">
              <p className="text-sm leading-7 text-[var(--muted)]">מערכת מסרים, דוברות ויחסי עיתונות שנבנים סביב קו editorial אחד.</p>
              <p className="text-sm leading-7 text-[var(--muted)]">כל לקוח מקבל זווית, לוח פרסום וקצב עבודה ברור מול המדיה.</p>
            </div>
          </Reveal>
          <Reveal variant="scale">
            <figure className="border border-black/10 bg-[var(--surface)] p-3">
              <img src={getValue(data, "aboutImage")} alt="" className="aspect-[4/5] w-full object-cover" />
              <figcaption className="mt-3 border-t border-black/10 pt-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                Editorial desk · {getValue(data, "brandName")}
              </figcaption>
            </figure>
          </Reveal>
        </div>
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
        
        <div className="mt-12 grid gap-0 border border-black/10 md:grid-cols-2">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*70}>
              <article className={`border-b border-black/10 p-7 text-right md:border-l ${i<2?"md:border-b":"md:border-b-0"}`}>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[var(--p)]">Column 0{i+1}</p>
                <h3 className="ag-display mt-3 text-3xl font-bold">{title}</h3>
                <p className="mt-4 text-sm leading-8 text-[var(--muted)]">{text}</p>
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
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "casesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "casesTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {items.map(([title, text, image], i) => (
            <Reveal key={title} delayMs={i * 90} variant="up">
              <article className="ag-card min-h-full border border-black/10 bg-[var(--surface)] p-5 text-right">
                <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">Press</p>
                    <h3 className="ag-display mt-3 text-3xl font-bold leading-tight">{title}</h3>
                  </div>
                  <img src={image} alt="" className="h-24 w-24 shrink-0 border border-black/10 object-cover" />
                </div>
                <p className="mt-5 text-sm leading-8 text-[var(--muted)]">{text}</p>
                <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                  <span>Clipping 0{i + 1}</span>
                  <span>{getValue(data, "brandName")}</span>
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
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "teamEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "teamTitle")}</h2>
        </Reveal>
        <div className="mt-12 border-y border-black/10">
          {items.map(([name, role, image], i) => (
            <Reveal key={name} delayMs={i * 90} variant="right">
              <article className="flex flex-col gap-4 border-b border-black/10 py-5 text-right last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <img src={image} alt="" className="h-16 w-16 rounded-full border border-black/10 object-cover" />
                  <div>
                    <h3 className="ag-display text-2xl font-bold">{name}</h3>
                    <p className="mt-1 text-sm font-bold text-[var(--muted)]">{name} · {role}</p>
                  </div>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--p)]">Byline 0{i + 1}</p>
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
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-8 border-y border-black/10 py-5 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "galleryEyebrow")}</p>
          <h2 className="ag-display mt-3 text-3xl font-extrabold md:text-5xl">{getValue(data, "galleryTitle")}</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {images.slice(0, 2).map((src, i) => (
            <Reveal key={src} delayMs={i * 70} variant="scale">
              <figure className="border border-black/10 bg-[var(--surface)] p-3">
                <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
                <figcaption className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Spread image 0{i + 1}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {images.slice(2).map((src, i) => (
            <Reveal key={src} delayMs={(i + 2) * 70} variant="scale">
              <div className="border border-black/10 bg-[var(--surface)] p-3">
                <img src={src} alt="" className="aspect-[16/7] w-full object-cover" />
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
      <div className="mx-auto max-w-4xl">
        <Reveal className="border-y border-black/10 py-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "insightsEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "insightsTitle")}</h2>
        </Reveal>
        <div className="mt-10 space-y-8">
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90}>
              <article className="border-b border-black/10 pb-8 text-right">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--p)]">Column 0{i + 1}</p>
                <h3 className="ag-display mt-3 text-3xl font-bold">{title}</h3>
                <p className="mt-4 text-base leading-8 text-[var(--muted)]">{text}</p>
                <blockquote className="mt-6 border-r-4 border-[var(--p)] bg-[var(--surface)] p-5 text-xl font-bold leading-9">
                  "{i === 0 ? "כותרת טובה מתחילה בזווית, לא ברשימת מסרים." : i === 1 ? "מדיה אוהבת קצב עקבי יותר מהבטחה גדולה." : "משבר נמדד בדקות הראשונות ובשקט שאחריו."}"
                </blockquote>
                <button type="button" onClick={() => goTo("contact")} className="mt-5 text-sm font-black text-[var(--p)]">שלחו נושא לכתבה</button>
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
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "processTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid border border-black/10 md:grid-cols-4">
          {steps.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 80} variant="up">
              <article className="min-h-full border-b border-black/10 p-6 text-right md:border-b-0 md:border-l md:last:border-l-0">
                <p className="ag-display text-3xl font-bold text-[var(--p)]">Week {i + 1}</p>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
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
      <Reveal className="mx-auto max-w-4xl border border-black/10 bg-[var(--surface)] p-6 text-right md:p-10">
        <div className="border-y border-black/10 py-5 text-center">
          <p className="ag-display text-4xl font-bold">{getValue(data, "brandName")}</p>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
        </div>
        <div className="py-8">
          <h2 className="ag-display text-3xl font-bold md:text-5xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-6 grid gap-2 border-y border-black/10 py-4 text-sm font-bold md:grid-cols-3">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </div>
        <form className="grid gap-3">
          <input className="border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="שם מלא" />
          <input className="border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="טלפון" />
          <input className="border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="נושא / ארגון" />
          <textarea className="min-h-36 border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="מה הסיפור שצריך להגיע לעיתונות?" />
          <button type="button" className="bg-[var(--p)] px-6 py-4 text-sm font-black text-white">{getValue(data, "contactButton")}</button>
        </form>
      </Reveal>
    </section>
  );
}

function Footer({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const links = narrativaPages.filter((p) => p.id !== "home");
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
      <Reveal className="mx-auto max-w-6xl text-center">
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-black/10 py-4 text-xs font-black uppercase tracking-[0.24em] text-[var(--muted)]">
          <span>Vol. 02</span>
          <span>{getValue(data, "brandName")}</span>
          <span>{getValue(data, "nicheLabel")}</span>
        </div>
        <h1 className="ag-display mx-auto mt-8 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">{title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
        <div className="mt-8 border-t border-black/10 pt-4 text-xs font-bold uppercase tracking-[0.22em] text-[var(--p)]">{getValue(data, "tagline")}</div>
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
    <section data-template-section-type="hero" className="border-b border-black/10 px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-6">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data, "heroEyebrow")} · Vol. 01</p>
            <p className="text-xs font-bold text-[var(--muted)]">{getValue(data, "tagline")}</p>
          </div>
          <h1 className="ag-display mt-8 max-w-4xl text-5xl font-bold leading-[1.05] md:text-7xl">{getValue(data, "heroTitle")}</h1>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <img src={getValue(data, "heroImage")} alt="" className="aspect-[16/10] w-full object-cover border border-black/10" />
            <div className="flex flex-col justify-between border border-black/10 bg-[var(--surface)] p-7 text-right">
              <p className="text-lg leading-9 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
              <div className="mt-8 space-y-3">
                {stats.slice(0,3).map(([v,l])=>(
                  <div key={l} className="flex items-baseline justify-between border-t border-black/10 pt-3">
                    <span className="text-sm font-bold text-[var(--muted)]">{l}</span>
                    <span className="ag-display text-2xl font-bold text-[var(--p)]">{v}</span>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => goTo("contact")} className="mt-8 bg-[var(--p)] px-6 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
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
      <Insights data={data} goTo={goTo} />
      <About data={data} />
      <Services data={data} goTo={goTo} />
      <Cases data={data} />
      <GalleryStrip data={data} />
      <Team data={data} />
      <Process data={data} />
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
    about: (<><About data={data} /><Insights data={data} goTo={goTo} /><GalleryStrip data={data} /><Team data={data} /></>),
    services: (<><Services data={data} goTo={goTo} /><Cases data={data} /><Process data={data} /><Contact data={data} /></>),
    cases: (<><Cases data={data} /><GalleryStrip data={data} /><Insights data={data} goTo={goTo} /><Contact data={data} /></>),
    team: (<><Team data={data} /><About data={data} /><Process data={data} /><Contact data={data} /></>),
    insights: (<><Insights data={data} goTo={goTo} /><About data={data} /><Cases data={data} /><Contact data={data} /></>),
    process: (<><Process data={data} /><Insights data={data} goTo={goTo} /><Team data={data} /><Contact data={data} /></>),
    contact: (<><Contact data={data} /><About data={data} /><GalleryStrip data={data} /></>),
  };
  return (
    <>
      <PageHero data={data} title={titles[type] || getValue(data, "brandName")} />
      {map[type] ?? null}
      <Footer data={data} goTo={goTo} />
    </>
  );
}

export default function NarrativaPages({
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
  const mergedData = useMemo(() => ({ ...narrativaDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "narrativa-preview" : "narrativa"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: narrativaEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} goTo={goTo} /> },
          ...narrativaPages.filter((p) => p.id !== "home").map((p) => ({
            id: p.id,
            content: <InnerPage data={mergedData} type={p.id} goTo={goTo} />,
          })),
        ]}
      />
    </div>
  );
}
