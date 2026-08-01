import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { eventideDefaultData } from "./defaultData";
import { eventideEditorCss } from "./editorCss";

export const eventidePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "cases", label: "פרויקטים", slug: "/cases" },
  { id: "team", label: "צוות", slug: "/team" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const allowedPages = eventidePages.map((p) => p.id);

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
  return data?.[key] ?? (eventideDefaultData as Record<string, any>)[key] ?? "";
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
      <div className="mx-auto max-w-7xl">
        <Reveal variant="scale" className="overflow-hidden border border-white/15">
          <img src={getValue(data, "aboutImage")} alt="" className="aspect-[21/9] w-full object-cover" />
        </Reveal>
        <Reveal variant="up" className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "aboutEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold leading-tight md:text-5xl">{getValue(data, "aboutTitle")}</h2>
          <p className="mt-6 text-base leading-8 text-[var(--muted)]">{getValue(data, "aboutText")}</p>
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
              <article className="ag-card grid gap-4 border border-white/15 bg-[var(--surface)] p-5 md:grid-cols-[120px_1fr] md:items-center">
                <div className="text-center md:text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)]">Slot</p>
                  <p className="ag-display text-3xl font-extrabold text-[var(--p)]">0{i+1}:00</p>
                </div>
                <div className="text-right"><h3 className="text-2xl font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></div>
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
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map(([title, text, image], i) => (
            <Reveal key={title} delayMs={i * 90} variant="up">
              <article className="ag-card relative min-h-[420px] overflow-hidden border border-white/15 bg-[var(--surface)] text-right">
                <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="relative z-10 flex min-h-[420px] flex-col justify-between p-6">
                  <p className="ag-display text-left text-2xl md:text-5xl font-extrabold text-white/80">0{i + 1}.25</p>
                  <div>
                    <h3 className="ag-display text-3xl font-bold text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/75">{text}</p>
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
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "teamEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "teamTitle")}</h2>
        </Reveal>
        <div className="mt-12 overflow-hidden border border-white/15">
          {items.map(([name, role, image], i) => (
            <Reveal key={name} delayMs={i * 90}>
              <article className="grid gap-4 border-b border-white/15 bg-[var(--bg)] p-4 text-right last:border-b-0 md:grid-cols-[88px_1fr_120px] md:items-center">
                <div className="h-20 w-20 overflow-hidden border border-white/15">
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--accent)]">Crew 0{i + 1}</p>
                  <h3 className="mt-1 text-2xl font-bold">{name}</h3>
                  <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{role}</p>
                </div>
                <p className="ag-display border border-white/15 px-4 py-3 text-center text-sm font-black uppercase tracking-[0.28em] text-[var(--accent)]">CALL</p>
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
        <Reveal className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "galleryEyebrow")}</p>
          <h2 className="ag-display mt-3 text-3xl font-extrabold md:text-5xl">{getValue(data, "galleryTitle")}</h2>
        </Reveal>
        <div className="overflow-x-auto border-y border-white/15 py-4">
          <div className="flex min-w-max gap-4">
            {images.map((src, i) => (
              <Reveal key={src} delayMs={i * 70} variant="scale">
                <div className="w-[78vw] max-w-[420px] overflow-hidden border border-white/15 bg-[var(--surface)] md:w-[360px]">
                  <img src={src} alt="" className="h-72 w-full object-cover" />
                  <p className="ag-display border-t border-white/15 px-4 py-3 text-left text-sm font-black text-[var(--accent)]">FRAME 0{i + 1}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Insights({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const items = [
    ["18:00", getValue(data, "insightOneTitle"), getValue(data, "insightOneText")],
    ["19:30", getValue(data, "insightTwoTitle"), getValue(data, "insightTwoText")],
    ["21:00", getValue(data, "insightThreeTitle"), getValue(data, "insightThreeText")],
  ];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "insightsEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "insightsTitle")}</h2>
        </Reveal>
        <div className="mt-12 space-y-3">
          {items.map(([time, title, text], i) => (
            <Reveal key={title} delayMs={i * 90}>
              <article className="ag-card grid gap-5 border border-white/15 bg-[var(--surface)] p-5 text-right md:grid-cols-[130px_1fr_auto] md:items-center">
                <p className="ag-display text-2xl sm:text-4xl font-extrabold text-[var(--accent)]">{time}</p>
                <div>
                  <h3 className="text-2xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{text}</p>
                </div>
                <button type="button" onClick={() => goTo("contact")} className="border border-white/15 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-[var(--accent)]">Run sheet</button>
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
    ["T-30", getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    ["T-14", getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    ["T-7", getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    ["Day-Of", getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];
  return (
    <section className="bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "processTitle")}</h2>
        </Reveal>
        <div className="mt-12">
          <div className="hidden h-px bg-white/15 md:block" />
          <div className="grid gap-4 md:grid-cols-4">
            {steps.map(([marker, title, text], i) => (
              <Reveal key={title} delayMs={i * 80} variant="up">
                <article className="ag-card relative border border-white/15 bg-[var(--bg)] p-6 text-right">
                  <span className="absolute -top-[7px] right-6 hidden h-3 w-3 bg-[var(--p)] md:block" />
                  <p className="ag-display text-3xl font-black text-[var(--accent)]">{marker}</p>
                  <h3 className="mt-3 text-xl font-bold">{title}</h3>
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
      <div className="mx-auto max-w-4xl border border-white/15 bg-[var(--surface)] p-6 md:p-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">RSVP to the next production</h2>
          <p className="mt-5 text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-bold text-[var(--accent)]">
            <span>{getValue(data, "phone")}</span>
            <span>{getValue(data, "email")}</span>
            <span>{getValue(data, "address")}</span>
          </div>
        </Reveal>
        <Reveal variant="up" delayMs={100} className="mx-auto mt-10 max-w-2xl">
          <form className="grid gap-3" data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-id="eventide-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.">
            <input className="border border-white/15 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="שם מלא"  name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" />
            <input className="border border-white/15 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="טלפון"  name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" />
            <input className="border border-white/15 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="שם האירוע"  name="name_2" data-bizuply-form-field-id="name_2" type="text" autoComplete="name" />
            <textarea className="min-h-32 border border-white/15 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="כמה אורחים ומה הקצב?"  name="guests" data-bizuply-form-field-id="guests"></textarea>
            <button type="submit" className="bg-[var(--p)] px-6 py-4 text-sm font-black text-white">{getValue(data, "contactButton")}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const links = eventidePages.filter((p) => p.id !== "home");
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
    <section className="border-b border-white/15 px-5 py-16 lg:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-7xl text-right">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <span className="bg-[var(--p)] px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-white">Tonight</span>
          <span className="h-px flex-1 bg-white/15" />
          <span className="text-xs font-black uppercase tracking-[0.28em] text-[var(--accent)]">{getValue(data, "nicheLabel")}</span>
        </div>
        <p className="ag-display text-sm font-black uppercase tracking-[0.32em] text-[var(--accent)]">{getValue(data, "brandName")}</p>
        <h1 className="ag-display mt-4 max-w-4xl text-4xl font-extrabold md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
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
    <section data-template-section-type="hero" className="relative overflow-hidden px-5 py-16 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--p)]/25 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--accent)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mx-auto mt-5 max-w-4xl text-5xl font-extrabold leading-tight md:text-7xl">{getValue(data, "heroTitle")}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <button type="button" onClick={() => goTo("contact")} className="ag-pulse mt-8 bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
        </Reveal>
        <Reveal delayMs={120} className="mt-12 overflow-hidden border border-white/15">
          <img src={getValue(data, "heroImage")} alt="" className="ag-ken aspect-[21/8] w-full object-cover" />
        </Reveal>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {stats.map(([v,l],i)=>(
            <Reveal key={l} delayMs={i*70} className="border border-white/15 bg-[var(--surface)] p-5 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--accent)]">Act 0{i+1}</p>
              <p className="ag-display mt-2 text-3xl font-extrabold">{v}</p>
              <p className="mt-1 text-xs font-bold text-[var(--muted)]">{l}</p>
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
      <Services data={data} goTo={goTo} />
      <GalleryStrip data={data} />
      <Cases data={data} />
      <Process data={data} />
      <Team data={data} />
      <Insights data={data} goTo={goTo} />
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
    about: (<><About data={data} /><GalleryStrip data={data} /><Team data={data} /><Contact data={data} /></>),
    services: (<><Services data={data} goTo={goTo} /><GalleryStrip data={data} /><Process data={data} /><Contact data={data} /></>),
    cases: (<><Cases data={data} /><GalleryStrip data={data} /><Insights data={data} goTo={goTo} /><Contact data={data} /></>),
    team: (<><Team data={data} /><Process data={data} /><Insights data={data} goTo={goTo} /><Contact data={data} /></>),
    insights: (<><Insights data={data} goTo={goTo} /><Process data={data} /><Cases data={data} /><Contact data={data} /></>),
    process: (<><Process data={data} /><Services data={data} goTo={goTo} /><Team data={data} /><Contact data={data} /></>),
    contact: (<><Contact data={data} /><GalleryStrip data={data} /><About data={data} /></>),
  };
  return (
    <>
      <PageHero data={data} title={titles[type] || getValue(data, "brandName")} />
      {map[type] ?? null}
      <Footer data={data} goTo={goTo} />
    </>
  );
}

export default function EventidePages({
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
  const mergedData = useMemo(() => ({ ...eventideDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "eventide-preview" : "eventide"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: eventideEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} goTo={goTo} /> },
          ...eventidePages.filter((p) => p.id !== "home").map((p) => ({
            id: p.id,
            content: <InnerPage data={mergedData} type={p.id} goTo={goTo} />,
          })),
        ]}
      />
    </div>
  );
}
