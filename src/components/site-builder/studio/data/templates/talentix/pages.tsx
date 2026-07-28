import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { talentixDefaultData } from "./defaultData";
import { talentixEditorCss } from "./editorCss";

export const talentixPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "cases", label: "פרויקטים", slug: "/cases" },
  { id: "team", label: "צוות", slug: "/team" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const allowedPages = talentixPages.map((p) => p.id);

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
  return data?.[key] ?? (talentixDefaultData as Record<string, any>)[key] ?? "";
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
  const signals = [
    [getValue(data, "statOne"), getValue(data, "statOneLabel")],
    [getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
  ];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-12">
        <Reveal variant="scale" className="lg:col-span-7">
          <div className="grid gap-4 md:grid-cols-6">
            <div className="overflow-hidden border border-black/10 bg-[var(--surface)] md:col-span-4 md:row-span-2">
              <img src={getValue(data, "aboutImage")} alt="" className="h-full min-h-[360px] w-full object-cover" />
            </div>
            <div className="flex min-h-[260px] flex-col justify-between border border-black/10 bg-[var(--surface)] p-6 text-right md:col-span-2">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "aboutEyebrow")}</p>
              <p className="ag-display text-2xl sm:text-4xl font-extrabold text-[var(--p)]">{signals[0][0]}</p>
              <p className="text-sm font-bold text-[var(--muted)]">{signals[0][1]}</p>
            </div>
            <div className="flex min-h-[180px] flex-col justify-center border border-black/10 bg-[var(--p)] p-6 text-right text-white md:col-span-2">
              <p className="ag-display text-2xl sm:text-4xl font-extrabold">{signals[1][0]}</p>
              <p className="mt-2 text-sm font-bold text-white/80">{signals[1][1]}</p>
            </div>
          </div>
        </Reveal>
        <Reveal variant="right" className="flex flex-col justify-center border border-black/10 bg-[var(--surface)] p-7 text-right lg:col-span-5 lg:mt-16">
          <div className="h-2 w-20 bg-[var(--p)]" />
          <h2 className="ag-display mt-6 text-3xl font-extrabold leading-tight md:text-5xl">{getValue(data, "aboutTitle")}</h2>
          <p className="mt-6 text-base leading-8 text-[var(--muted)]">{getValue(data, "aboutText")}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="border border-black/10 bg-[var(--bg)] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--p)]">People map</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">מיפוי מועמדים לפי מוטיבציה, כישורים וקצב גיוס.</p>
            </div>
            <div className="border border-black/10 bg-[var(--bg)] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--p)]">Shortlist</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">רשימות קצרות שמרגישות כמו צוות, לא כמו מאגר.</p>
            </div>
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
        
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*80} variant="scale">
              <article className={`ag-card border border-black/10 bg-[var(--surface)] p-6 text-right ${i%2===0?"lg:translate-y-6":""}`}>
                <div className="mb-4 h-2 w-12 bg-[var(--p)]" />
                <h3 className="text-xl font-bold">{title}</h3>
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
  const roleTags = [
    ["Product", "Backend", "12 hires"],
    ["Founding team", "Data", "Series A"],
    ["Retail", "Operations", "Leaders"],
  ];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "casesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "casesTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {items.map(([title, text, image], i) => (
            <Reveal key={title} delayMs={i * 90} variant="up">
              <article className={`ag-card grid overflow-hidden border border-black/10 bg-[var(--surface)] text-right md:grid-cols-[0.8fr_1.2fr] ${i === 0 ? "lg:col-span-2 lg:max-w-5xl" : ""} ${i === 1 ? "lg:mt-12" : ""}`}>
                <div className="relative min-h-[260px] overflow-hidden">
                  <img src={image} alt="" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                  <span className="absolute right-4 top-4 border border-white/40 bg-white/90 px-3 py-1 text-xs font-black text-[var(--text)]">Placement 0{i + 1}</span>
                </div>
                <div className="flex flex-col justify-between p-6">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {roleTags[i].map((tag) => (
                        <span key={tag} className="border border-black/10 bg-[var(--bg)] px-3 py-1 text-xs font-black text-[var(--p)]">{tag}</span>
                      ))}
                    </div>
                    <h3 className="ag-display mt-5 text-3xl font-extrabold">{title}</h3>
                    <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
                  </div>
                  <div className="mt-8 border-t border-black/10 pt-4">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--muted)]">Outcome</p>
                    <p className="mt-2 text-lg font-extrabold text-[var(--text)]">מועמדים חתומים, צוות מגייס רגוע ותהליך שקוף.</p>
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
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.72fr]">
          <div className="border border-black/10 bg-[var(--bg)]">
            {items.map(([name, role, image], i) => (
              <Reveal key={name} delayMs={i * 90} variant="right">
                <article className="flex flex-col gap-5 border-b border-black/10 p-5 text-right last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <img src={image} alt="" className="h-20 w-20 rounded-full border border-black/10 object-cover" />
                    <div>
                      <h3 className="text-xl font-extrabold">{name}</h3>
                      <p className="mt-1 text-sm font-bold text-[var(--muted)]">{role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--p)]" />
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-[var(--p)]">Open role desk</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal variant="left" delayMs={120}>
            <aside className="flex h-full flex-col justify-between border border-black/10 bg-[var(--p)] p-7 text-right text-white">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-white/70">Now sourcing</p>
                <h3 className="ag-display mt-4 text-2xl sm:text-4xl font-extrabold">תפקידים פתוחים שמחכים לאדם הנכון.</h3>
              </div>
              <div className="mt-8 space-y-3">
                {[getValue(data, "serviceOneTitle"), getValue(data, "serviceTwoTitle"), getValue(data, "serviceThreeTitle")].map((role) => (
                  <div key={role} className="flex items-center justify-between border-t border-white/25 pt-3">
                    <span className="text-sm font-bold text-white/80">{role}</span>
                    <span className="text-xs font-black uppercase tracking-[0.16em]">Open</span>
                  </div>
                ))}
              </div>
            </aside>
          </Reveal>
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
  const imageClasses = [
    "md:col-span-2 md:row-span-2",
    "md:col-span-1",
    "md:col-span-1",
    "md:col-span-2",
  ];
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-8 text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "galleryEyebrow")}</p>
          <h2 className="ag-display mt-3 text-3xl font-extrabold md:text-5xl">{getValue(data, "galleryTitle")}</h2>
        </Reveal>
        <div className="grid gap-3 md:grid-cols-4 md:auto-rows-[170px]">
          {images.map((src, i) => (
            <Reveal key={src} delayMs={i * 70} variant="scale" className={imageClasses[i]}>
              <div className="h-full overflow-hidden border border-black/10 bg-[var(--surface)]">
                <img src={src} alt="" className="h-full min-h-[220px] w-full object-cover" />
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
  const rotations = ["rotate-1", "-rotate-1", "rotate-0"];
  return (
    <section className="bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "insightsEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "insightsTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90}>
              <article className={`ag-card border border-black/10 bg-[var(--bg)] p-7 text-right shadow-[12px_12px_0_rgba(8,145,178,0.12)] ${rotations[i]}`}>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--p)]">Recruiter note 0{i + 1}</p>
                <h3 className="mt-5 text-2xl font-extrabold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
                <button type="button" onClick={() => goTo("contact")} className="mt-7 border-b border-[var(--p)] pb-1 text-sm font-black text-[var(--p)]">דברו עם מגייס/ת</button>
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
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "processTitle")}</h2>
        </Reveal>
        <div className="mt-12">
          {steps.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 80} variant="up">
              <div className="mx-auto max-w-2xl">
                <article className="border border-black/10 bg-[var(--surface)] p-6 text-center">
                  <p className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--p)] text-sm font-black text-white">0{i + 1}</p>
                  <h3 className="ag-display mt-4 text-2xl font-extrabold">{title}</h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">{text}</p>
                </article>
                {i < steps.length - 1 ? (
                  <div className="mx-auto my-4 h-8 w-8 rotate-45 border-b-4 border-r-4 border-[var(--p)]" />
                ) : null}
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
    <section className="bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-0 border border-black/10 lg:grid-cols-2 lg:[direction:ltr]">
        <Reveal variant="right" className="flex flex-col justify-between bg-[var(--p)] p-7 text-right text-white md:p-10 lg:[direction:rtl]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-white/75">Send CV / Talk to recruiter</p>
            <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "contactTitle")}</h2>
            <p className="mt-5 text-base leading-8 text-white/80">{getValue(data, "contactText")}</p>
          </div>
          <div className="mt-10 space-y-2 border-t border-white/25 pt-6 text-sm font-bold">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={100} className="bg-[var(--bg)] p-7 md:p-10 lg:[direction:rtl]">
          <form className="grid gap-3">
            <input className="border border-black/10 bg-[var(--surface)] px-4 py-4 text-right outline-none" placeholder="שם מלא" />
            <input className="border border-black/10 bg-[var(--surface)] px-4 py-4 text-right outline-none" placeholder="טלפון" />
            <input className="border border-black/10 bg-[var(--surface)] px-4 py-4 text-right outline-none" placeholder="תפקיד / חברה" />
            <textarea className="min-h-36 border border-black/10 bg-[var(--surface)] px-4 py-4 text-right outline-none" placeholder="לשלוח קורות חיים או לדבר עם מגייס/ת?" />
            <button type="button" className="bg-[var(--p)] px-6 py-4 text-sm font-black text-white">{getValue(data, "contactButton")}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const links = talentixPages.filter((p) => p.id !== "home");
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
  const images = [
    getValue(data, "galleryOneImage"),
    getValue(data, "galleryTwoImage"),
    getValue(data, "galleryThreeImage"),
    getValue(data, "galleryFourImage"),
  ];
  return (
    <section className="border-b border-black/10 bg-[var(--surface)] px-5 py-14 lg:px-8 lg:py-20">
      <Reveal className="mx-auto grid max-w-7xl gap-8 text-right lg:grid-cols-[1fr_0.72fr] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "brandName")} · {getValue(data, "nicheLabel")}</p>
          <h1 className="ag-display mt-4 max-w-4xl text-4xl font-extrabold md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {images.map((src, i) => (
            <img key={src} src={src} alt="" className={`border border-black/10 object-cover ${i === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"}`} />
          ))}
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
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7" variant="right">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-4 text-4xl font-extrabold leading-tight md:text-6xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("team")} className="border border-[var(--p)] px-8 py-4 text-sm font-black text-[var(--p)]">הכירו את הצוות</button>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-5" delayMs={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <img src={getValue(data, "heroImage")} alt="" className="ag-float col-span-2 aspect-[16/10] object-cover border border-black/10" />
            <img src={getValue(data, "aboutImage")} alt="" className="aspect-square object-cover border border-black/10" />
            <div className="flex aspect-square flex-col justify-center border border-black/10 bg-[var(--p)] p-5 text-center text-white">
              <p className="ag-display text-2xl sm:text-4xl font-extrabold">{stats[0][0]}</p>
              <p className="mt-2 text-xs font-bold">{stats[0][1]}</p>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="mx-auto mt-10 grid max-w-7xl gap-3 sm:grid-cols-3">
        {stats.slice(1).map(([v,l],i)=>(
          <Reveal key={l} delayMs={i*80} className="border border-black/10 bg-[var(--surface)] p-5 text-center">
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
      <Team data={data} />
      <Services data={data} goTo={goTo} />
      <Cases data={data} />
      <GalleryStrip data={data} />
      <About data={data} />
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
    about: (<><About data={data} /><Team data={data} /><GalleryStrip data={data} /><Process data={data} /></>),
    services: (<><Services data={data} goTo={goTo} /><Cases data={data} /><Process data={data} /><Contact data={data} /></>),
    cases: (<><Cases data={data} /><GalleryStrip data={data} /><About data={data} /><Contact data={data} /></>),
    team: (<><Team data={data} /><Cases data={data} /><Insights data={data} goTo={goTo} /><Contact data={data} /></>),
    insights: (<><Insights data={data} goTo={goTo} /><Process data={data} /><Cases data={data} /><Contact data={data} /></>),
    process: (<><Process data={data} /><Team data={data} /><Services data={data} goTo={goTo} /><Contact data={data} /></>),
    contact: (<><Contact data={data} /><Team data={data} /><GalleryStrip data={data} /></>),
  };
  return (
    <>
      <PageHero data={data} title={titles[type] || getValue(data, "brandName")} />
      {map[type] ?? null}
      <Footer data={data} goTo={goTo} />
    </>
  );
}

export default function TalentixPages({
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
  const mergedData = useMemo(() => ({ ...talentixDefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "talentix-preview" : "talentix"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: talentixEditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} goTo={goTo} /> },
          ...talentixPages.filter((p) => p.id !== "home").map((p) => ({
            id: p.id,
            content: <InnerPage data={mergedData} type={p.id} goTo={goTo} />,
          })),
        ]}
      />
    </div>
  );
}
