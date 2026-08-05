import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { growthlyDefaultData } from "./defaultData";
import { growthlyEditorCss } from "./editorCss";

export const growthlyPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "cases", label: "פרויקטים", slug: "/cases" },
  { id: "team", label: "צוות", slug: "/team" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const allowedPages = growthlyPages.map((p) => p.id);

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
  return data?.[key] ?? (growthlyDefaultData as Record<string, any>)[key] ?? "";
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
    <section className="py-20 lg:py-28">
      <div className="relative min-h-[620px] overflow-hidden">
        <Reveal variant="scale" className="absolute inset-0">
          <img src={getValue(data, "aboutImage")} alt="" className="h-full w-full object-cover opacity-70" />
        </Reveal>
        <div className="absolute inset-0 bg-gradient-to-l from-[var(--dark)] via-[var(--dark)]/70 to-[var(--dark)]/25" />
        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center justify-end px-5 lg:px-8">
          <Reveal variant="right" className="max-w-2xl border border-white/15 bg-[var(--dark)]/75 p-7 text-right backdrop-blur-xl md:p-10">
            <div className="mb-8 h-1 w-28 bg-[var(--accent)]" />
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "aboutEyebrow")}</p>
            <h2 className="ag-display mt-4 text-3xl font-extrabold leading-tight md:text-5xl">{getValue(data, "aboutTitle")}</h2>
            <p className="mt-6 text-base leading-8 text-[var(--muted)]">{getValue(data, "aboutText")}</p>
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
        
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*90} variant="up">
              <article className="ag-card group relative min-h-[220px] overflow-hidden border border-white/15 bg-[var(--surface)] p-7 text-right">
                <span className="ag-display absolute -left-2 -top-4 text-3xl md:text-8xl font-black text-[var(--p)]/15">0{i+1}</span>
                <h3 className="relative text-2xl font-bold">{title}</h3>
                <p className="relative mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
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
        <Reveal className="max-w-3xl text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "casesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "casesTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <Reveal variant="scale">
            <article className="ag-card relative min-h-[560px] overflow-hidden border border-white/15 bg-[var(--surface)] text-right">
              <img src={items[0][2]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)] via-[var(--dark)]/70 to-transparent" />
              <div className="relative z-10 flex min-h-[560px] flex-col justify-end p-7 md:p-10">
                <span className="mb-5 inline-flex w-fit border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-[var(--accent)]">FEATURE 01</span>
                <h3 className="ag-display max-w-2xl text-4xl font-extrabold md:text-6xl">{items[0][0]}</h3>
                <p className="mt-4 max-w-xl text-base leading-8 text-white/75">{items[0][1]}</p>
              </div>
            </article>
          </Reveal>
          <div className="grid gap-5">
            {items.slice(1).map(([title, text, image], i) => (
              <Reveal key={title} delayMs={(i + 1) * 100} variant="left">
                <article className="ag-card grid min-h-[265px] grid-cols-[0.8fr_1fr] overflow-hidden border border-white/15 bg-[var(--surface)] text-right">
                  <div className="relative">
                    <img src={image} alt="" className="h-full w-full object-cover opacity-70" />
                    <div className="absolute inset-0 bg-[var(--p)]/20" />
                  </div>
                  <div className="flex flex-col justify-between p-6">
                    <p className="ag-display text-2xl md:text-5xl font-black text-[var(--accent)]">0{i + 2}</p>
                    <div>
                      <h3 className="text-2xl font-bold">{title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
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
        <Reveal className="max-w-3xl text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "teamEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "teamTitle")}</h2>
        </Reveal>
        <div className="mt-12 flex gap-5 overflow-x-auto pb-4">
          {items.map(([name, role, image], i) => (
            <Reveal key={name} delayMs={i * 90} variant="scale">
              <article className="ag-card relative h-[520px] min-w-[78vw] overflow-hidden border border-white/15 bg-[var(--bg)] text-right sm:min-w-[520px] lg:min-w-[620px]">
                <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-l from-[var(--dark)]/95 via-[var(--dark)]/45 to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-end p-7">
                  <p className="ag-display text-3xl md:text-6xl font-black text-white/15">0{i + 1}</p>
                  <h3 className="mt-3 text-3xl font-bold">{name}</h3>
                  <p className="mt-2 text-sm font-semibold text-[var(--muted)]">{role}</p>
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
        <Reveal className="mb-8 text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "galleryEyebrow") || "פריימים מהצמיחה"}</p>
          <h2 className="ag-display mt-3 text-3xl font-extrabold md:text-5xl">{getValue(data, "galleryTitle") || "קולנוע של עבודה שמתקדמת"}</h2>
        </Reveal>
        <div className="grid auto-rows-[180px] gap-3 md:grid-cols-4 md:auto-rows-[220px]">
          <Reveal variant="scale" className="md:col-span-2 md:row-span-2">
            <div className="h-full overflow-hidden border border-white/15 bg-[var(--surface)]">
              <img src={images[0]} alt="" className="h-full w-full object-cover opacity-85" />
            </div>
          </Reveal>
          <div className="grid gap-3 md:row-span-2 md:grid-rows-2">
            <Reveal delayMs={80} variant="scale">
              <div className="h-full overflow-hidden border border-white/15 bg-[var(--surface)]">
                <img src={images[1]} alt="" className="h-full w-full object-cover opacity-85" />
              </div>
            </Reveal>
            <Reveal delayMs={160} variant="scale">
              <div className="h-full overflow-hidden border border-white/15 bg-[var(--surface)]">
                <img src={images[2]} alt="" className="h-full w-full object-cover opacity-85" />
              </div>
            </Reveal>
          </div>
          <Reveal delayMs={240} variant="scale" className="md:row-span-2">
            <div className="h-full overflow-hidden border border-white/15 bg-[var(--surface)]">
              <img src={images[3]} alt="" className="h-full w-full object-cover opacity-85" />
            </div>
          </Reveal>
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
        <Reveal className="max-w-3xl text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "insightsEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "insightsTitle")}</h2>
        </Reveal>
        <div className="mt-12 border-t border-white/15">
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90} variant="up">
              <article className="grid gap-5 border-b border-white/15 py-8 text-right md:grid-cols-[160px_1fr_auto] md:items-center">
                <p className="ag-display text-3xl md:text-6xl font-black text-[var(--p)]/40">0{i + 1}</p>
                <div>
                  <h3 className="text-2xl font-bold md:text-3xl">{title}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">{text}</p>
                </div>
                <button type="button" onClick={() => goTo("contact")} className="w-fit border border-white/15 px-5 py-3 text-sm font-black text-[var(--p)]">קראו עוד</button>
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
        <Reveal className="max-w-3xl text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "processTitle")}</h2>
        </Reveal>
        <div className="relative mt-16 grid gap-10 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-white/15 lg:block" />
          {steps.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 80} variant="up">
              <article className="relative text-right">
                <div className="relative z-10 grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-[var(--bg)] text-lg font-black text-[var(--accent)] shadow-[0_0_0_10px_var(--surface)]">0{i + 1}</div>
                <div className="ag-card mt-8 border border-white/15 bg-[var(--bg)] p-6">
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
                </div>
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
    <section className="py-20 lg:py-28">
      <Reveal variant="up" className="bg-[var(--dark)] px-5 py-16 text-right lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="ag-display mt-4 max-w-4xl text-4xl font-extrabold md:text-6xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-white/80">
            <span className="border border-white/15 px-4 py-2">{getValue(data, "phone")}</span>
            <span className="border border-white/15 px-4 py-2">{getValue(data, "email")}</span>
            <span className="border border-white/15 px-4 py-2">{getValue(data, "address")}</span>
          </div>
        </div>
      </Reveal>
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <Reveal variant="scale" delayMs={100} className="-mt-10 border border-white/15 bg-[var(--surface)] p-5 md:p-8">
          <form className="grid gap-3" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-skin="template" data-bizuply-form-id="growthly-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
            <input className="border border-white/15 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
            <div className="grid gap-3 md:grid-cols-2">
              <input className="border border-white/15 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
              <input className="border border-white/15 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="חברה / תחום"  name="company" data-bizuply-form-field-id="company" />
            </div>
            <textarea className="min-h-32 border border-white/15 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="במה נוכל לעזור?"  name="message" data-bizuply-form-field-id="message"></textarea>
            <button type="submit" className="bg-[var(--p)] px-6 py-4 text-sm font-black text-white">{getValue(data, "contactButton")}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const links = growthlyPages.filter((p) => p.id !== "home");
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
    <section className="border-b border-white/15 bg-[var(--dark)] px-5 py-20 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-7xl text-right">
        <div className="mb-8 h-1 w-36 bg-[var(--accent)]" />
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "brandName")} · {getValue(data, "nicheLabel")}</p>
        <h1 className="ag-display mt-5 max-w-5xl text-5xl font-extrabold leading-none md:text-7xl lg:text-8xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
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
    <section data-template-section-type="hero" className="relative min-h-[92svh] overflow-hidden">
      <img src={getValue(data, "heroImage")} alt="" className="ag-ken absolute inset-0 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)] via-[var(--dark)]/70 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
        <Reveal variant="up">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--accent)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-5 max-w-5xl text-5xl font-extrabold leading-[0.95] md:text-7xl lg:text-8xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="ag-pulse bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("cases")} className="border border-white/30 px-8 py-4 text-sm font-black text-white">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([v,l],i) => (
            <Reveal key={l} delayMs={i*80} variant="scale">
              <div className="ag-float border border-white/15 bg-white/10 p-5 backdrop-blur-xl text-center" style={{animationDelay:`${i*0.4}s`}}>
                <p className="ag-display text-3xl font-extrabold text-[var(--accent)]">{v}</p>
                <p className="mt-2 text-xs font-bold text-white/70">{l}</p>
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
      <About data={data} />
      <Services data={data} goTo={goTo} />
      <Cases data={data} />
      <GalleryStrip data={data} />
      <Team data={data} />
      <Insights data={data} goTo={goTo} />
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
    about: (<><About data={data} /><Process data={data} /><Team data={data} /><Insights data={data} goTo={goTo} /></>),
    services: (<><Services data={data} goTo={goTo} /><Process data={data} /><Cases data={data} /><GalleryStrip data={data} /><Contact data={data} /></>),
    cases: (<><Cases data={data} /><Insights data={data} goTo={goTo} /><GalleryStrip data={data} /><Team data={data} /><Contact data={data} /></>),
    team: (<><Team data={data} /><About data={data} /><Process data={data} /><Insights data={data} goTo={goTo} /><Contact data={data} /></>),
    insights: (<><Insights data={data} goTo={goTo} /><Cases data={data} /><Process data={data} /><GalleryStrip data={data} /></>),
    process: (<><Process data={data} /><Services data={data} goTo={goTo} /><Cases data={data} /><Team data={data} /><Contact data={data} /></>),
    contact: (<><Contact data={data} /><About data={data} /><Cases data={data} /><GalleryStrip data={data} /></>),
  };
  return (
    <>
      <PageHero data={data} title={titles[type] || getValue(data, "brandName")} />
      {map[type] ?? null}
      <Footer data={data} goTo={goTo} />
    </>
  );
}

export default function GrowthlyPages({
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
  const mergedData = useMemo(() => ({ ...growthlyDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id="growthly" className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: growthlyEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} goTo={goTo} /> },
          ...growthlyPages.filter((p) => p.id !== "home").map((p) => ({
            id: p.id,
            content: <InnerPage data={mergedData} type={p.id} goTo={goTo} />,
          })),
        ]}
      />
    </div>
  );
}
