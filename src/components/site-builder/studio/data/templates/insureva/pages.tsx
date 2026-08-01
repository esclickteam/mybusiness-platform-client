import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { insurevaDefaultData } from "./defaultData";
import { insurevaEditorCss } from "./editorCss";

export const insurevaPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "cases", label: "פרויקטים", slug: "/cases" },
  { id: "team", label: "צוות", slug: "/team" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const allowedPages = insurevaPages.map((p) => p.id);

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
  return data?.[key] ?? (insurevaDefaultData as Record<string, any>)[key] ?? "";
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
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "aboutEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold leading-tight md:text-5xl">{getValue(data, "aboutTitle")}</h2>
        </Reveal>
        <Reveal variant="scale" delayMs={100} className="relative mt-12 border border-black/10 bg-[var(--surface)] p-3">
          <div className="absolute bottom-3 left-3 top-3 w-2 bg-[var(--p)]" />
          <img src={getValue(data, "aboutImage")} alt="" className="aspect-[21/9] w-full object-cover" />
        </Reveal>
        <Reveal variant="up" delayMs={160} className="mx-auto mt-8 max-w-3xl text-right">
          <p className="text-base leading-8 text-[var(--muted)]">{getValue(data, "aboutText")}</p>
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
        
        <div className="relative mt-14 space-y-6">
          <div className="absolute bottom-0 right-6 top-0 w-px bg-[var(--p)]/40" />
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*100} variant="left">
              <article className="relative mr-12 border border-black/10 bg-[var(--surface)] p-6 text-right">
                <span className="absolute -right-12 top-6 grid h-10 w-10 place-items-center rounded-full bg-[var(--p)] text-sm font-black text-white">{i+1}</span>
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
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "casesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "casesTitle")}</h2>
        </Reveal>
        <div className="mt-12 space-y-5">
          {items.map(([title, text, image], i) => (
            <Reveal key={title} delayMs={i * 90} variant="left">
              <article className="ag-card relative flex flex-col gap-5 border border-black/10 bg-[var(--surface)] p-4 text-right md:flex-row md:items-center md:p-5">
                <div className="shrink-0 overflow-hidden border border-black/10 md:w-64">
                  <img src={image} alt="" className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105" />
                </div>
                <div className="flex-1 px-1 md:px-4">
                  <h3 className="text-2xl font-bold md:text-3xl">{title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{text}</p>
                </div>
                <span className="grid h-16 w-14 shrink-0 place-items-center bg-[var(--p)] text-sm font-black text-white [clip-path:polygon(50%_0,100%_18%,100%_72%,50%_100%,0_72%,0_18%)]">0{i + 1}</span>
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
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 border-y border-black/10 py-10 text-center md:grid-cols-3">
          {items.map(([name, role, image], i) => (
            <Reveal key={name} delayMs={i * 90} variant="scale">
              <article className="text-center">
                <img src={image} alt="" className="mx-auto h-44 w-44 rounded-full border border-black/10 object-cover p-1" />
                <h3 className="mt-5 text-xl font-bold">{name}</h3>
                <p className="mt-2 text-sm font-semibold text-[var(--muted)]">{role}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delayMs={220} className="mx-auto mt-8 max-w-2xl border border-black/10 bg-[var(--bg)] p-6 text-center">
          <p className="text-sm font-bold leading-7 text-[var(--muted)]">צוות אמון שמכיר פוליסות, תביעות ואנשים — ומחזיק את התיק עד שיש תשובה ברורה.</p>
        </Reveal>
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
  const captions = [getValue(data, "caseOneTitle"), getValue(data, "caseTwoTitle"), getValue(data, "caseThreeTitle"), "משרד ושטח"];
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "galleryEyebrow") || "מבט לסוכנות"}</p>
          <h2 className="ag-display mt-3 text-3xl font-extrabold md:text-5xl">{getValue(data, "galleryTitle") || "מרחבי שירות וביטחון"}</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {images.map((src, i) => (
            <Reveal key={src} delayMs={i * 70} variant="scale">
              <div className="overflow-hidden border border-black/10 bg-[var(--surface)]">
                <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
                <p className="border-t border-black/10 px-5 py-4 text-right text-sm font-bold text-[var(--muted)]">{captions[i]}</p>
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
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "insightsEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "insightsTitle")}</h2>
        </Reveal>
        <div className="mt-12">
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90}>
              <article className="border-b border-black/10 py-7 text-right">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
                  </div>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-black/10 text-xs font-black text-[var(--p)]">?</span>
                </div>
                <button type="button" onClick={() => goTo("contact")} className="mt-4 text-sm font-black text-[var(--p)]">שאלו אותנו</button>
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
        <div className="relative mx-auto mt-14 max-w-5xl">
          <div className="absolute bottom-0 right-6 top-0 w-px bg-black/10 md:right-1/2" />
          {steps.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 80} variant={i % 2 === 0 ? "right" : "left"}>
              <div className="relative grid gap-5 pb-10 md:grid-cols-[1fr_56px_1fr] md:items-start">
                {i % 2 === 0 ? (
                  <article className="ag-card mr-16 border border-black/10 bg-[var(--bg)] p-6 text-right md:mr-0">
                    <p className="text-sm font-black text-[var(--p)]">שלב 0{i + 1}</p>
                    <h3 className="mt-3 text-xl font-bold">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
                  </article>
                ) : (
                  <div className="hidden md:block" />
                )}
                <span className="absolute right-0 top-0 z-10 grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-[var(--surface)] text-sm font-black text-[var(--p)] md:static md:h-14 md:w-14">0{i + 1}</span>
                {i % 2 === 1 ? (
                  <article className="ag-card mr-16 border border-black/10 bg-[var(--bg)] p-6 text-right md:mr-0">
                    <p className="text-sm font-black text-[var(--p)]">שלב 0{i + 1}</p>
                    <h3 className="mt-3 text-xl font-bold">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
                  </article>
                ) : (
                  <div className="hidden md:block" />
                )}
              </div>
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
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "contactTitle")}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-bold text-[var(--muted)]">
            <span>{getValue(data, "phone")}</span>
            <span>{getValue(data, "email")}</span>
            <span>{getValue(data, "address")}</span>
          </div>
        </Reveal>
        <Reveal variant="up" delayMs={100} className="mx-auto mt-10 max-w-xl">
          <form className="grid gap-3 border border-black/10 bg-[var(--surface)] p-5 md:p-7" data-bizuply-block="lead-form" data-bizuply-form-id="insureva-contact-1" data-bizuply-crm-lead="true" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.">
            <input name="name" data-bizuply-form-field-id="name" autoComplete="name"  className="border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="שם מלא" />
            <input name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel"  className="border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="טלפון" />
            <input className="border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="חברה / תחום" />
            <textarea name="message" data-bizuply-form-field-id="message"  className="min-h-32 border border-black/10 bg-[var(--bg)] px-4 py-4 text-right outline-none" placeholder="במה נוכל לעזור?" />
            <button type="submit" className="bg-[var(--p)] px-6 py-4 text-sm font-black text-white">{getValue(data, "contactButton")}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const links = insurevaPages.filter((p) => p.id !== "home");
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
    <section className="border-b border-black/10 bg-[var(--surface)] px-5 py-16 lg:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-7xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-black/10 bg-[var(--bg)] text-xl font-black text-[var(--p)]">✓</span>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "brandName")} · {getValue(data, "nicheLabel")}</p>
        <h1 className="ag-display mx-auto mt-4 max-w-4xl text-4xl font-extrabold md:text-6xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
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
    <section data-template-section-type="hero" className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <span className="ag-pulse inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--p)] text-xl font-black text-[var(--p)]">✓</span>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-5 text-4xl font-extrabold leading-tight md:text-6xl">{getValue(data, "heroTitle")}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => goTo("contact")} className="bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("about")} className="border border-[var(--p)] px-8 py-4 text-sm font-black text-[var(--p)]">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </Reveal>
      </div>
      <Reveal delayMs={120} className="mx-auto mt-14 max-w-5xl overflow-hidden border border-black/10">
        <img src={getValue(data, "heroImage")} alt="" className="aspect-[21/9] w-full object-cover" />
      </Reveal>
      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-4">
        {stats.map(([v,l],i)=>(
          <Reveal key={l} delayMs={i*70} className="border border-black/10 bg-[var(--surface)] p-5 text-center">
            <p className="ag-display text-3xl font-extrabold text-[var(--p)]">{v}</p>
            <p className="mt-2 text-xs font-bold text-[var(--muted)]">{l}</p>
          </Reveal>
        ))}
      </div>
    </section></>);
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} />
      <Services data={data} goTo={goTo} />
      <Process data={data} />
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
    about: (<><About data={data} /><Team data={data} /><Process data={data} /><GalleryStrip data={data} /></>),
    services: (<><Services data={data} goTo={goTo} /><Process data={data} /><Cases data={data} /><Insights data={data} goTo={goTo} /><Contact data={data} /></>),
    cases: (<><Cases data={data} /><About data={data} /><GalleryStrip data={data} /><Insights data={data} goTo={goTo} /><Contact data={data} /></>),
    team: (<><Team data={data} /><Process data={data} /><Cases data={data} /><Contact data={data} /></>),
    insights: (<><Insights data={data} goTo={goTo} /><Process data={data} /><Cases data={data} /><GalleryStrip data={data} /></>),
    process: (<><Process data={data} /><Services data={data} goTo={goTo} /><About data={data} /><Team data={data} /><Contact data={data} /></>),
    contact: (<><Contact data={data} /><Process data={data} /><About data={data} /><Cases data={data} /></>),
  };
  return (
    <>
      <PageHero data={data} title={titles[type] || getValue(data, "brandName")} />
      {map[type] ?? null}
      <Footer data={data} goTo={goTo} />
    </>
  );
}

export default function InsurevaPages({
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
  const mergedData = useMemo(() => ({ ...insurevaDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "insureva-preview" : "insureva"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: insurevaEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} goTo={goTo} /> },
          ...insurevaPages.filter((p) => p.id !== "home").map((p) => ({
            id: p.id,
            content: <InnerPage data={mergedData} type={p.id} goTo={goTo} />,
          })),
        ]}
      />
    </div>
  );
}
