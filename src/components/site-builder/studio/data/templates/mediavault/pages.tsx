import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { mediavaultDefaultData } from "./defaultData";
import { mediavaultEditorCss } from "./editorCss";

export const mediavaultPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "cases", label: "פרויקטים", slug: "/cases" },
  { id: "team", label: "צוות", slug: "/team" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const allowedPages = mediavaultPages.map((p) => p.id);

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
  return data?.[key] ?? (mediavaultDefaultData as Record<string, any>)[key] ?? "";
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
      <div className="mx-auto max-w-7xl overflow-hidden border border-white/15 bg-[var(--surface)]">
        <Reveal className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 bg-[var(--dark)] px-5 py-4 text-right">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--accent)]">{getValue(data, "aboutEyebrow")}</p>
            <h2 className="ag-display mt-2 text-3xl font-extrabold md:text-5xl">{getValue(data, "aboutTitle")}</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/80">
            <span className="border border-white/15 px-3 py-2">LIVE OPS</span>
            <span className="border border-white/15 px-3 py-2">MEDIA MIX</span>
            <span className="border border-white/15 px-3 py-2 text-[var(--accent)]">KPI READY</span>
          </div>
        </Reveal>
        <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
          <Reveal variant="right" className="border-b border-white/15 p-6 text-right lg:border-b-0 lg:border-l md:p-8">
            <p className="text-base leading-8 text-[var(--muted)]">{getValue(data, "aboutText")}</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                [getValue(data, "statOne"), getValue(data, "statOneLabel")],
                [getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
                [getValue(data, "statFour"), getValue(data, "statFourLabel")],
              ].map(([value, label]) => (
                <div key={label} className="border border-white/15 bg-[var(--bg)] p-4">
                  <p className="ag-display text-2xl font-extrabold text-[var(--accent)]">{value}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal variant="left" delayMs={90} className="p-4">
            <div className="overflow-hidden border border-white/15 bg-[var(--dark)]">
              <div className="flex items-center justify-between border-b border-white/15 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                <span>MEDIA PANEL</span>
                <span className="text-emerald-400">REC</span>
              </div>
              <img src={getValue(data, "aboutImage")} alt="" className="aspect-[16/10] w-full object-cover opacity-85" />
            </div>
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
        
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*80}>
              <article className="ag-card border border-white/15 bg-[var(--surface)] p-6 text-right">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-black text-[var(--accent)]">MODULE 0{i+1}</span>
                  <span className="h-2 w-2 rounded-full bg-[var(--p)]" />
                </div>
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
    [getValue(data, "caseOneTitle"), getValue(data, "caseOneText"), getValue(data, "caseOneImage")],
    [getValue(data, "caseTwoTitle"), getValue(data, "caseTwoText"), getValue(data, "caseTwoImage")],
    [getValue(data, "caseThreeTitle"), getValue(data, "caseThreeText"), getValue(data, "caseThreeImage")],
  ];
  const channels = ["PAID SOCIAL", "PROGRAMMATIC", "ALWAYS-ON"];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-6 text-right">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--accent)]">{getValue(data, "casesEyebrow")}</p>
            <h2 className="ag-display mt-3 text-3xl font-extrabold md:text-5xl">{getValue(data, "casesTitle")}</h2>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">CAMPAIGN FRAMES</p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map(([title, text, image], i) => (
            <Reveal key={title} delayMs={i * 90} variant="up">
              <article className="ag-card overflow-hidden border border-white/15 bg-[var(--surface)] text-right">
                <div className="flex items-center justify-between border-b border-white/15 bg-[var(--dark)] px-4 py-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--accent)]">{channels[i]}</span>
                  <span className="text-[10px] font-black text-[var(--muted)]">FRAME 0{i + 1}</span>
                </div>
                <div className="relative aspect-[16/11] overflow-hidden p-3">
                  <img src={image} alt="" className="h-full w-full border border-white/15 object-cover opacity-90 transition duration-700 hover:scale-105" />
                </div>
                <div className="border-t border-white/15 p-5">
                  <h3 className="text-2xl font-bold">{title}</h3>
                  <div className="mt-5 border border-white/15 bg-[var(--bg)] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted)]">KPI STRIP</p>
                    <p className="ag-display mt-2 text-2xl font-extrabold text-[var(--accent)]">{text}</p>
                  </div>
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
        <Reveal className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--accent)]">{getValue(data, "teamEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "teamTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map(([name, role, image], i) => (
            <Reveal key={name} delayMs={i * 90} variant="scale">
              <article className="ag-card overflow-hidden border border-white/15 bg-[var(--bg)] text-right">
                <div className="flex items-center justify-between border-b border-white/15 px-4 py-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted)]">CONTROL TILE 0{i + 1}</span>
                  <span className="flex items-center gap-2 text-[10px] font-black text-emerald-400"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> ONLINE</span>
                </div>
                <div className="p-4">
                  <img src={image} alt="" className="aspect-[4/3] w-full border border-white/15 object-cover" />
                </div>
                <div className="border-t border-white/15 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)]">ROLE / NAME</p>
                  <h3 className="mt-2 text-xl font-bold">{role} / {name}</h3>
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
        <Reveal className="mb-8 text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--accent)]">{getValue(data, "galleryEyebrow")}</p>
          <h2 className="ag-display mt-3 text-3xl font-extrabold md:text-5xl">{getValue(data, "galleryTitle")}</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((src, i) => (
            <Reveal key={src} delayMs={i * 70} variant="scale">
              <div className="ag-card overflow-hidden border border-white/15 bg-[var(--surface)]">
                <div className="flex items-center justify-between border-b border-white/15 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--muted)]">GAL-0{i + 1}.jpg</span>
                </div>
                <img src={src} alt="" className="aspect-square w-full object-cover opacity-90" />
                <div className="border-t border-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--muted)]">vault/media/campaign</div>
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
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--accent)]">{getValue(data, "insightsEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "insightsTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90}>
              <article className="ag-card overflow-hidden border border-white/15 bg-[var(--surface)] text-right">
                <div className="flex items-center justify-between border-b border-white/15 bg-[var(--dark)] px-4 py-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--accent)]">REPORT 0{i + 1}</span>
                  <span className="text-[10px] font-black text-[var(--muted)]">UPDATED NOW</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
                  <div className="mt-6 h-2 bg-white/10">
                    <span className="block h-full bg-[var(--p)]" style={{ width: `${82 - i * 14}%` }} />
                  </div>
                  <button type="button" onClick={() => goTo("contact")} className="mt-5 text-sm font-black text-[var(--accent)]">פתחו דוח</button>
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
        <Reveal className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--accent)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "processTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {steps.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 80} variant="up">
              <article className="ag-card relative border border-white/15 bg-[var(--bg)] p-6 text-right">
                {i < steps.length - 1 ? <span className="absolute left-[-22px] top-1/2 hidden h-px w-5 bg-white/25 lg:block" /> : null}
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--accent)]">MODULE 0{i + 1}</p>
                  <span className="h-2 w-2 rounded-full bg-[var(--p)]" />
                </div>
                <h3 className="mt-8 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-1">
                  {Array.from({ length: 6 }).map((_, barIndex) => (
                    <span key={barIndex} className={`h-1.5 ${barIndex <= i + 1 ? "bg-[var(--accent)]" : "bg-white/10"}`} />
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

function Contact({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl overflow-hidden border border-white/15 bg-[var(--surface)]">
        <Reveal className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 bg-[var(--dark)] px-5 py-4 text-right">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--accent)]">{getValue(data, "contactEyebrow")}</p>
            <h2 className="ag-display mt-2 text-3xl font-extrabold md:text-5xl">MEDIA-TICKET / {getValue(data, "contactTitle")}</h2>
          </div>
          <span className="border border-emerald-400/40 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">QUEUE OPEN</span>
        </Reveal>
        <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal variant="right" className="border-b border-white/15 p-6 text-right lg:border-b-0 lg:border-l md:p-8">
            <p className="text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
            <div className="mt-8 grid gap-3 text-sm font-bold">
              <p className="border border-white/15 bg-[var(--bg)] p-3">TEL: {getValue(data, "phone")}</p>
              <p className="border border-white/15 bg-[var(--bg)] p-3">MAIL: {getValue(data, "email")}</p>
              <p className="border border-white/15 bg-[var(--bg)] p-3">LOC: {getValue(data, "address")}</p>
            </div>
          </Reveal>
          <Reveal variant="left" delayMs={100}>
            <form className="grid gap-0" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-id="mediavault-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
              <label className="grid gap-2 border-b border-white/15 p-4 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                Requester name
                <input className="bg-[var(--bg)] px-4 py-4 text-right text-sm text-white outline-none" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
              </label>
              <label className="grid gap-2 border-b border-white/15 p-4 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                Callback
                <input className="bg-[var(--bg)] px-4 py-4 text-right text-sm text-white outline-none" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
              </label>
              <label className="grid gap-2 border-b border-white/15 p-4 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                Channel / budget
                <input className="bg-[var(--bg)] px-4 py-4 text-right text-sm text-white outline-none" placeholder="חברה / תחום"  name="company" data-bizuply-form-field-id="company" />
              </label>
              <label className="grid gap-2 border-b border-white/15 p-4 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                Ticket brief
                <textarea className="min-h-32 bg-[var(--bg)] px-4 py-4 text-right text-sm text-white outline-none" placeholder="במה נוכל לעזור?"  name="message" data-bizuply-form-field-id="message"></textarea>
              </label>
              <button type="submit" className="bg-[var(--p)] px-6 py-5 text-sm font-black uppercase tracking-[0.18em] text-white">{getValue(data, "contactButton")}</button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const links = mediavaultPages.filter((p) => p.id !== "home");
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
    <section className="border-b border-white/15 px-5 py-14 lg:px-8 lg:py-20">
      <Reveal className="mx-auto max-w-7xl overflow-hidden border border-white/15 bg-[var(--surface)] text-right">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 bg-[var(--dark)] px-5 py-4">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--accent)]">{getValue(data, "brandName")} / {getValue(data, "nicheLabel")}</p>
          <div className="flex gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
        </div>
        <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
          <div className="p-7 md:p-10">
            <h1 className="ag-display max-w-4xl text-4xl font-extrabold md:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          </div>
          <div className="grid border-t border-white/15 lg:border-r lg:border-t-0">
            {[
              [getValue(data, "statOne"), getValue(data, "statOneLabel")],
              [getValue(data, "statFour"), getValue(data, "statFourLabel")],
            ].map(([value, label]) => (
              <div key={label} className="border-b border-white/15 p-5 last:border-b-0">
                <p className="ag-display text-3xl font-extrabold text-[var(--accent)]">{value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
              </div>
            ))}
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
    <section data-template-section-type="hero" className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--accent)]">{getValue(data, "heroEyebrow")}</p>
            <h1 className="ag-display mt-3 max-w-3xl text-4xl font-extrabold md:text-6xl">{getValue(data, "heroTitle")}</h1>
          </div>
          <button type="button" onClick={() => goTo("contact")} className="bg-[var(--p)] px-7 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-8" variant="scale">
            <div className="border border-white/15 bg-[var(--surface)] p-3">
              <img src={getValue(data, "heroImage")} alt="" className="aspect-[16/9] w-full object-cover opacity-90" />
              <p className="mt-3 px-2 text-sm leading-7 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
            </div>
          </Reveal>
          <div className="grid gap-3 lg:col-span-4">
            {stats.map(([v,l],i)=>(
              <Reveal key={l} delayMs={i*70} className="ag-card border border-white/15 bg-[var(--surface)] p-5 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">{l}</p>
                <p className="ag-display mt-2 text-2xl sm:text-4xl font-extrabold text-[var(--accent)]">{v}</p>
                <div className="mt-3 h-1.5 w-full bg-white/10"><span className="block h-full bg-[var(--p)]" style={{width: `${70-i*8}%`}} /></div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section></>);
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} />
      <Services data={data} goTo={goTo} />
      <Cases data={data} />
      <Insights data={data} goTo={goTo} />
      <GalleryStrip data={data} />
      <Process data={data} />
      <Team data={data} />
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
    about: (<><About data={data} /><Insights data={data} goTo={goTo} /><Team data={data} /><Contact data={data} /></>),
    services: (<><Services data={data} goTo={goTo} /><Process data={data} /><Cases data={data} /><Contact data={data} /></>),
    cases: (<><Cases data={data} /><Insights data={data} goTo={goTo} /><GalleryStrip data={data} /><Contact data={data} /></>),
    team: (<><Team data={data} /><About data={data} /><Process data={data} /><Contact data={data} /></>),
    insights: (<><Insights data={data} goTo={goTo} /><Cases data={data} /><GalleryStrip data={data} /><Contact data={data} /></>),
    process: (<><Process data={data} /><Services data={data} goTo={goTo} /><Cases data={data} /><Contact data={data} /></>),
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

export default function MediavaultPages({
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
  const mergedData = useMemo(() => ({ ...mediavaultDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "mediavault-preview" : "mediavault"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: mediavaultEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} goTo={goTo} /> },
          ...mediavaultPages.filter((p) => p.id !== "home").map((p) => ({
            id: p.id,
            content: <InnerPage data={mergedData} type={p.id} goTo={goTo} />,
          })),
        ]}
      />
    </div>
  );
}
