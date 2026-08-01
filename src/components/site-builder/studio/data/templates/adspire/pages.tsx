import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { adspireDefaultData } from "./defaultData";
import { adspireEditorCss } from "./editorCss";

export const adspirePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "cases", label: "פרויקטים", slug: "/cases" },
  { id: "team", label: "צוות", slug: "/team" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const allowedPages = adspirePages.map((p) => p.id);

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
  return data?.[key] ?? (adspireDefaultData as Record<string, any>)[key] ?? "";
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
        <Reveal variant="scale">
          <div className="relative">
            <img src={getValue(data, "aboutImage")} alt="" className="aspect-[16/9] w-full border border-white/15 object-cover md:aspect-[21/9]" />
            <div className="absolute -bottom-10 right-4 h-24 w-24 bg-[var(--p)]/80 blur-2xl" />
          </div>
        </Reveal>
        <Reveal variant="up" delayMs={120} className="relative z-10 -mt-12 mr-auto max-w-3xl border border-white/15 bg-[var(--surface)]/95 p-6 text-right shadow-2xl backdrop-blur md:-mt-20 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[var(--accent)]">{getValue(data, "aboutEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-extrabold leading-[0.95] md:text-6xl">{getValue(data, "aboutTitle")}</h2>
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
        
        <div className="mt-12 flex gap-4 overflow-x-auto pb-4">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*90} className="min-w-[280px] shrink-0">
              <article className="ag-card flex aspect-square flex-col justify-between border border-white/15 bg-[var(--surface)] p-7 text-right">
                <span className="ag-display text-2xl md:text-5xl font-extrabold text-[var(--p)]">0{i+1}</span>
                <div><h3 className="text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p></div>
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
        <Reveal className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "casesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-extrabold md:text-6xl">{getValue(data, "casesTitle")}</h2>
        </Reveal>
        <div className="mt-12 flex snap-x gap-5 overflow-x-auto pb-6">
          {items.map(([title, text, image], i) => (
            <Reveal key={title} delayMs={i * 90} variant="up" className="min-w-[78vw] snap-start md:min-w-[420px]">
              <article className="ag-card relative h-[560px] overflow-hidden border border-white/15 bg-[var(--surface)] text-right">
                <img src={image} alt="" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-6">
                  <p className="ag-display text-3xl md:text-6xl font-extrabold text-white/20">0{i + 1}</p>
                  <h3 className="-mt-4 text-3xl font-black text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/75">{text}</p>
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
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "teamEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-extrabold md:text-6xl">{getValue(data, "teamTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map(([name, role, image], i) => (
            <Reveal key={name} delayMs={i * 90} variant="scale">
              <article className="ag-card relative min-h-[460px] overflow-hidden border border-white/15 bg-[var(--bg)]">
                <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 border-t border-white/15 bg-black/70 p-5 text-right backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--accent)]">Credit 0{i + 1}</p>
                  <h3 className="mt-2 text-2xl font-black text-white">{name}</h3>
                  <p className="mt-1 text-sm font-semibold text-white/70">{role}</p>
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
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "galleryEyebrow") || "Showreel"}</p>
          <h2 className="ag-display mt-3 text-3xl font-extrabold md:text-5xl">{getValue(data, "galleryTitle") || "פריימים שמחזיקים קמפיין"}</h2>
        </Reveal>
        <div className="flex snap-x gap-4 overflow-x-auto pb-5">
          {images.map((src, i) => (
            <Reveal key={src} delayMs={i * 70} variant="scale" className="min-w-[82vw] snap-center md:min-w-[520px]">
              <div className="relative overflow-hidden border border-white/15">
                <img src={src} alt="" className="aspect-[16/9] w-full object-cover" />
                <span className="absolute bottom-4 right-4 bg-[var(--p)] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">Shot 0{i + 1}</span>
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
          <h2 className="ag-display mt-4 text-4xl font-extrabold md:text-6xl">{getValue(data, "insightsTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-6">
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90}>
              <article className={`ag-card min-h-[280px] border border-white/15 bg-[var(--surface)] p-7 text-right ${i === 0 ? "md:col-span-4" : i === 1 ? "md:col-span-2" : "md:col-span-6"}`}>
                <p className="ag-display text-3xl md:text-7xl font-extrabold leading-none text-[var(--p)]/80">0{i + 1}</p>
                <h3 className="mt-8 text-2xl font-black">{title}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">{text}</p>
                <button type="button" onClick={() => goTo("contact")} className="mt-6 border border-[var(--accent)] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-[var(--accent)]">Brief it</button>
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
          <h2 className="ag-display mt-4 text-4xl font-extrabold md:text-6xl">{getValue(data, "processTitle")}</h2>
        </Reveal>
        <div className="mt-12 divide-y divide-white/15 border-y border-white/15">
          {steps.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 80} variant={i % 2 === 0 ? "right" : "left"}>
              <article className={`grid gap-5 px-5 py-7 text-right md:grid-cols-[140px_1fr] md:items-center ${i % 2 === 0 ? "bg-[var(--bg)]" : "bg-[var(--surface)]"}`}>
                <p className="ag-display text-3xl md:text-6xl font-extrabold text-[var(--p)]">0{i + 1}</p>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--accent)]">{i === 0 ? "Spark" : i === 1 ? "Script" : i === 2 ? "Launch" : "Learn"}</p>
                  <h3 className="mt-2 text-2xl font-black">{title}</h3>
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
    <section className="relative overflow-hidden bg-[var(--p)] px-5 py-20 text-white lg:px-8 lg:py-28">
      <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-40 w-2/3 -skew-y-6 bg-[var(--accent)]/25" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <Reveal variant="right" className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-white/75">{getValue(data, "contactEyebrow")}</p>
          <h2 className="ag-display mt-4 text-5xl font-extrabold leading-[0.9] md:text-8xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">{getValue(data, "contactText")}</p>
          <div className="mt-8 grid gap-2 text-sm font-bold text-white/85">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={100}>
          <form className="grid gap-3 border border-white/25 bg-white/10 p-5 backdrop-blur-xl" data-bizuply-block="lead-form" data-bizuply-form-id="adspire-contact-1" data-bizuply-crm-lead="true" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.">
            <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  className="border border-white/25 bg-black/20 px-4 py-4 text-right text-white outline-none placeholder:text-white/65" placeholder="שם מלא" />
            <input name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel"  className="border border-white/25 bg-black/20 px-4 py-4 text-right text-white outline-none placeholder:text-white/65" placeholder="טלפון" />
            <input className="border border-white/25 bg-black/20 px-4 py-4 text-right text-white outline-none placeholder:text-white/65" placeholder="חברה / תחום" />
            <textarea name="message" data-bizuply-form-field-id="message"  className="min-h-32 border border-white/25 bg-black/20 px-4 py-4 text-right text-white outline-none placeholder:text-white/65" placeholder="במה נוכל לעזור?" />
            <button type="submit" className="bg-white px-6 py-4 text-sm font-black text-[var(--p)]">{getValue(data, "contactButton")}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const links = adspirePages.filter((p) => p.id !== "home");
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
    <section className="border-b border-white/15 bg-[var(--dark)] px-5 py-14 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr] lg:items-stretch">
        <Reveal variant="right" className="bg-[var(--p)] p-6 text-right text-white">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-white/70">{getValue(data, "brandName")}</p>
          <p className="ag-display mt-20 text-5xl font-extrabold leading-none md:text-7xl">{getValue(data, "nicheLabel")}</p>
        </Reveal>
        <Reveal variant="left" delayMs={100} className="border border-white/15 p-6 text-right md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--accent)]">Campaign page</p>
          <h1 className="ag-display mt-4 max-w-5xl text-5xl font-extrabold leading-[0.9] md:text-8xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
        </Reveal>
      </div>
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
    <section data-template-section-type="hero" className="relative overflow-hidden px-5 pb-10 pt-16 lg:px-8">
      <div className="mx-auto mt-8 grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--accent)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-4 text-5xl font-extrabold leading-[0.92] md:text-7xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 text-base leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("cases")} className="border border-[var(--accent)] px-8 py-4 text-sm font-black text-[var(--accent)]">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </Reveal>
        <Reveal variant="scale" delayMs={120}>
          <div className="relative overflow-hidden border border-white/15">
            <img src={getValue(data, "heroImage")} alt="" className="ag-ken aspect-[16/11] w-full object-cover" />
            <div className="absolute bottom-4 right-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {stats.slice(0,2).map(([v,l])=>(
                <div key={l} className="border border-white/20 bg-black/55 px-4 py-3 backdrop-blur text-center">
                  <p className="ag-display text-2xl font-extrabold text-[var(--accent)]">{v}</p>
                  <p className="text-[10px] font-bold text-white/70">{l}</p>
                </div>
              ))}
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
      <GalleryStrip data={data} />
      <Services data={data} goTo={goTo} />
      <Cases data={data} />
      <Insights data={data} goTo={goTo} />
      <Team data={data} />
      <About data={data} />
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
    about: (<><About data={data} /><GalleryStrip data={data} /><Team data={data} /><Contact data={data} /></>),
    services: (<><Services data={data} goTo={goTo} /><Cases data={data} /><Process data={data} /><Contact data={data} /></>),
    cases: (<><Cases data={data} /><Insights data={data} goTo={goTo} /><GalleryStrip data={data} /><Contact data={data} /></>),
    team: (<><Team data={data} /><Cases data={data} /><About data={data} /><Contact data={data} /></>),
    insights: (<><Insights data={data} goTo={goTo} /><GalleryStrip data={data} /><Process data={data} /><Contact data={data} /></>),
    process: (<><Process data={data} /><Services data={data} goTo={goTo} /><Cases data={data} /><Contact data={data} /></>),
    contact: (<><Contact data={data} /><GalleryStrip data={data} /><Cases data={data} /></>),
  };
  return (
    <>
      <PageHero data={data} title={titles[type] || getValue(data, "brandName")} />
      {map[type] ?? null}
      <Footer data={data} goTo={goTo} />
    </>
  );
}

export default function AdspirePages({
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
  const mergedData = useMemo(() => ({ ...adspireDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "adspire-preview" : "adspire"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: adspireEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} goTo={goTo} /> },
          ...adspirePages.filter((p) => p.id !== "home").map((p) => ({
            id: p.id,
            content: <InnerPage data={mergedData} type={p.id} goTo={goTo} />,
          })),
        ]}
      />
    </div>
  );
}
